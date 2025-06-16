const { db } = require("../connect");
const moment = require("moment-timezone");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
dotenv.config();

exports.register = async (req, res) => {
  const { employee_name, employee_role, employee_email, employee_password } =
    req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (
    !employee_name ||
    !employee_role ||
    !employee_email ||
    !employee_password
  ) {
    return res
      .status(400)
      .json({ status: "Failure", message: "All fields are required." });
  }

  try {
    db.query(
      "SELECT * FROM dm_calculator_employees WHERE employee_email = ? OR employee_name = ?",
      [employee_email, employee_name],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database ", error: err });
        }

        if (results.length > 0) {
          return res.status(409).json({
            status: "Failure",
            message: "DOAGuru User already registered.",
          });
        }

        const hashedPassword = await bcrypt.hash(employee_password, 10);

        db.query(
          "INSERT INTO dm_calculator_employees (employee_name, employee_role, employee_email, employee_password, created_at) VALUES (?, ?, ?, ?, ?)",
          [
            employee_name,
            employee_role,
            employee_email,
            hashedPassword,
            createdAt,
          ],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ status: "Failure", message: "DB error", error: err });
            }

            res.status(201).json({
              status: "Success",
              message: "DOAGuru User registered Successfully",
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.login = async (req, res) => {
  const { employee_email, employee_password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!employee_email || !employee_password) {
    return res.status(400).json({
      status: "Failure",
      message: "Email and Password are required",
    });
  }

  try {
    const getUserQuery = `SELECT * FROM dm_calculator_employees WHERE employee_email = ?`;

    db.query(getUserQuery, [employee_email], async (err, results) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res
          .status(500)
          .json({ status: "Failure", message: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ status: "Failure", message: "Invalid user ID or password" });
      }

      const user = results[0];

      const isPasswordMatch = await bcrypt.compare(
        employee_password,
        user.employee_password
      );

      if (!isPasswordMatch) {
        return res
          .status(401)
          .json({ status: "Failure", message: "Invalid user ID or password" });
      }

      const payload = {
        name: user.employee_name,
        role: user.employee_role,
        email: user.employee_email,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      return res.json({
        status: "Success",
        message: "Login successful",
        token,
        user: {
          name: user.employee_name,
          role: user.employee_role,
          email: user.employee_email,
        },
      });
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal server error" });
  }
};

const passwordOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Your Password OTP" <${process.env.EMAILSENDER}>`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your password reset OTP code is: ${otp}`,
      html: `<b>Your password reset OTP code is: ${otp}</b>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

exports.forgotPassword = async (req, res) => {
  const { UserId } = req.body;

  if (!UserId) {
    return res
      .status(400)
      .json({ status: "Failure", message: "UserId is required" });
  }

  try {
    const getUserQuery = `SELECT * FROM dm_calculator_employees WHERE employee_email = ?`;

    db.query(getUserQuery, [UserId], async (err, result) => {
      if (err || result.length === 0) {
        return res
          .status(400)
          .json({ status: "Failure", message: "User not found" });
      }
      const user = result[0];
      const otp = crypto.randomInt(100000, 999999).toString();

      // Hash the OTP
      const otpHash = await bcrypt.hash(otp, 10);

      forgototpStore.set(user.UserId, {
        otpHash,
        expiresAt: Date.now() + 5 * 60 * 1000, // OTP expires in 5 minutes
      });

      // Send the OTP via email to the fetched email
      passwordOtpEmail(user.Email, otp);

      return res
        .status(200)
        .json({ status: "Success", message: `OTP sent to ${user.Email}` });
    });
  } catch (error) {
    console.error("Error processing forgot password request:", error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal server error" });
  }
};

exports.verifyOtpAndResetPassword = async (req, res) => {
  const { UserId, otp, newPassword } = req.body;

  if (!UserId || !otp || !newPassword) {
    return res.status(400).json({
      status: "Failure",
      message: "UserId, OTP, and new password are required",
    });
  }

  try {
    const getUserQuery = `SELECT * FROM dm_calculator_employees WHERE employee_email = ?`;
    db.query(getUserQuery, [UserId], async (err, results) => {
      if (err || results.length === 0) {
        return res
          .status(404)
          .json({ status: "Failure", message: "User not found" });
      }

      const user = results[0];
      const otpData = forgototpStore.get(user.UserId);

      if (!otpData || Date.now() > otpData.expiresAt) {
        return res
          .status(400)
          .json({ status: "Failure", message: "OTP expired or invalid" });
      }

      console.log("OTP Provided:", otp);
      console.log("Stored OTP Hash:", otpData.otpHash);

      const isOtpValid = await bcrypt.compare(otp.toString(), otpData.otpHash);
      console.log("OTP Valid:", isOtpValid);
      if (!isOtpValid) {
        return res
          .status(400)
          .json({ status: "Failure", message: "Invalid OTP" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatePasswordQuery = `UPDATE dm_calculator_employees SET employee_password = ? WHERE employee_email = ?`;
      db.query(updatePasswordQuery, [hashedPassword, UserId], (updateErr) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          return res
            .status(500)
            .json({ status: "Failure", message: "Failed to reset password" });
        }

        forgototpStore.delete(user.UserId);

        return res
          .status(200)
          .json({ status: "Success", message: "Password reset successful" });
      });
    });
  } catch (error) {
    console.error("Error processing password reset:", error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal server error" });
  }
};

exports.insertServices = async (req, res) => {
  const { services, category, editing_type, amount, selected } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!services || !category || !editing_type || !amount) {
    // selected is optional, so we don't check it
    return res
      .status(400)
      .json({ status: "Failure", message: "All fields are required." });
  }

  if (isNaN(amount)) {
    return res.status(400).json({
      status: "Failure",
      message: "Amount must be numbers.",
    });
  }

  try {
    db.query(
      "INSERT INTO dm_calculator_services (services, category, editing_type, amount, selected, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      [services, category, editing_type, amount, selected || "N/A", createdAt],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error" });
        }

        res.status(201).json({
          status: "Success",
          message: "Service added successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.getServices = async (req, res) => {
  try {
    db.query(
      "SELECT * FROM dm_calculator_services ORDER BY id DESC",
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "DB error", error: err });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "Invalid user ID or password",
          });
        }

        res.status(200).json({
          status: "Success",
          data: results,
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.updateServices = async (req, res) => {
  const { id } = req.params;
  const { services, category, editing_type, amount, selected } = req.body;

  if (!services || !category || !editing_type || !amount) {
    return res.status(400).json({
      status: "Failure",
      message: "All fields except 'selected' are required.",
    });
  }

  try {
    db.query(
      "UPDATE dm_calculator_services SET services = ?, category = ?, editing_type = ?, amount = ?, selected = ? WHERE id = ?",
      [services, category, editing_type, amount, selected || "N/A", id],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "DB error", error: err });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No service found with the given ID",
          });
        }

        res.status(200).json({
          status: "Success",
          message: "Service updated successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.insertAdsServices = async (req, res) => {
  const { ads_category, amt_range_start, amt_range_end, percentage } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!ads_category || !amt_range_start || !amt_range_end || !percentage) {
    return res
      .status(400)
      .json({ status: "Failure", message: "All fields are required." });
  }

  if (
    isNaN(amt_range_start) ||
    (amt_range_end !== "Above" && isNaN(amt_range_end)) ||
    isNaN(percentage)
  ) {
    return res.status(400).json({
      status: "Failure",
      message:
        "Amount ranges must be numbers or 'Above', and percentage must be a number.",
    });
  }

  try {
    db.query(
      "INSERT INTO dm_calculator_ads (ads_category, amt_range_start, amt_range_end, percentage, created_at) VALUES (?, ?, ?, ?, ?)",
      [ads_category, amt_range_start, amt_range_end, percentage, createdAt],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error" });
        }

        res.status(201).json({
          status: "Success",
          message: "Ads Service added successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.updateAdsServices = async (req, res) => {
  const { id } = req.params;
  const { ads_category, amt_range_start, amt_range_end, percentage } = req.body;

  if (!ads_category || !amt_range_start || !amt_range_end || !percentage) {
    return res
      .status(400)
      .json({ status: "Failure", message: "All fields are required." });
  }

  if (isNaN(amt_range_start) || isNaN(amt_range_end) || isNaN(percentage)) {
    return res.status(400).json({
      status: "Failure",
      message: "Amount ranges and percentage must be numbers.",
    });
  }

  try {
    db.query(
      "UPDATE dm_calculator_ads SET ads_category = ?, amt_range_start = ?, amt_range_end = ?, percentage = ? WHERE id = ?",
      [ads_category, amt_range_start, amt_range_end, percentage, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No ad service found with the given ID",
          });
        }

        res.status(200).json({
          status: "Success",
          message: "Ads Service updated successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.insertClientDetails = async (req, res) => {
  const {
    client_name,
    client_organization,
    email,
    phone,
    address,
    dg_employee,
  } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (
    !client_name ||
    !client_organization ||
    !email ||
    !phone ||
    !address ||
    !dg_employee
  ) {
    return res
      .status(400)
      .json({ status: "Failure", message: "All fields are required." });
  }

  try {
    db.query(
      "INSERT INTO dm_calculator_client_details (client_name, client_organization, email, phone, address, dg_employee, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        client_name,
        client_organization,
        email,
        phone,
        address,
        dg_employee,
        createdAt,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error", error: err });
        }

        res.status(201).json({
          status: "Success",
          message: "Client added successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.getClientDetails = async (req, res) => {
  try {
    db.query(
      "SELECT * FROM dm_calculator_client_details ORDER BY id DESC",
      (err, results) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
            error: err,
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No client details found",
          });
        }

        res.status(200).json({
          status: "Success",
          data: results,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.getClientsByEmployee = async (req, res) => {
  const { employee } = req.params;

  try {
    db.query(
      "SELECT * FROM dm_calculator_client_details WHERE dg_employee = ? ORDER BY id DESC",
      [employee],
      (err, results) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
            error: err,
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No clients found for this employee",
          });
        }

        res.status(200).json({
          status: "Success",
          data: results,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.addServices = async (req, res) => {
  const { service_name } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!service_name) {
    return res
      .status(400)
      .json({ status: "Failure", message: "All fields are required." });
  }

  try {
    db.query(
      "INSERT INTO services (service_name, created_at) VALUES (?, ?)",
      [service_name, createdAt],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error" });
        }

        res.status(201).json({
          status: "Success",
          message: "Service added successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.addCategories = async (req, res) => {
  const { service_id, category_name } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!service_id || !category_name) {
    return res.status(400).json({
      status: "Failure",
      message: "Service ID and Category name required",
    });
  }

  try {
    db.query(
      "INSERT INTO categories (service_id, category_name, created_at) VALUES (?, ?, ?)",
      [service_id, category_name, createdAt],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error" });
        }

        res.status(201).json({
          status: "Success",
          message: "Category added successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.addEditingTypes = async (req, res) => {
  const { service_id, category_id, editing_type_name, amount } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!service_id || !category_id || !editing_type_name || !amount) {
    return res.status(400).json({
      status: "Failure",
      message: "All fields are required",
    });
  }

  try {
    db.query(
      "INSERT INTO editing_types (service_id, category_id, editing_type_name, amount, created_at) VALUES (?, ?, ?, ?, ?)",
      [service_id, category_id, editing_type_name, amount, createdAt],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error" });
        }

        res.status(201).json({
          status: "Success",
          message: "Editing type added successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.saveCalculatorData = (req, res) => {
  const {
    client_id,
    service_name,
    category_name,
    editing_type_name,
    editing_type_amount,
    quantity,
    include_content_posting,
    include_thumbnail_creation,
    total_amount,
  } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const query = `
    INSERT INTO calculator_transactions (
      client_id,
      service_name,
      category_name,
      editing_type_name,
      editing_type_amount,
      quantity,
      include_content_posting,
      include_thumbnail_creation,
      total_amount,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    client_id,
    service_name,
    category_name,
    editing_type_name,
    editing_type_amount,
    quantity,
    include_content_posting,
    include_thumbnail_creation,
    total_amount,
    createdAt,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json({ status: "Failure", message: "DB error" });
    }

    res.status(200).json({ status: "Success", message: "Saved successfully" });
  });
};

exports.saveAdsCampaign = async (req, res) => {
  const adsItems = req.body.adsItems;

  if (!Array.isArray(adsItems) || adsItems.length === 0) {
    return res
      .status(400)
      .json({ status: "Failure", message: "No data provided." });
  }

  const insertValues = adsItems.map((item) => [
    item.id,
    item.category,
    item.amount,
    item.percent,
    item.charge,
    item.total,
  ]);

  const sql = `
    INSERT INTO ads_campaign_details 
    (unique_id, category, amount, percent, charge, total) 
    VALUES ?
  `;

  db.query(sql, [insertValues], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res
        .status(500)
        .json({ status: "Failure", message: "Database error." });
    }
    res.status(200).json({ status: "Success", message: "Ads campaign saved." });
  });
};
