const { db } = require("../connect");
const moment = require("moment-timezone");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { sendAssignmentEmail, TZ } = require("./sendEmails");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASSWORD,
  },
  logger: true, // nodemailer internal logger
  debug: true, // include SMTP traffic in logs
});

// verify the connection at server start
(async () => {
  try {
    const ok = await transporter.verify();
    console.log("[MAIL] Transporter verify:", ok ? "OK" : "UNKNOWN");
  } catch (e) {
    console.error("[MAIL] Transporter verify FAILED:", e);
  }
})();

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

exports.registerBD = async (req, res) => {
  const { employee_name, employee_email, employee_password } = req.body;

  const employee_role = "BD"; // 🔐 Forcefully assign role as BD
  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!employee_name || !employee_email || !employee_password) {
    return res.status(400).json({
      status: "Failure",
      message: "All fields are required.",
    });
  }

  try {
    db.query(
      "SELECT * FROM dm_calculator_employees WHERE employee_email = ? OR employee_name = ?",
      [employee_email, employee_name],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error", error: err });
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
            employee_role, // 👈 This will always be 'BD'
            employee_email,
            hashedPassword,
            createdAt,
          ],
          (err, result) => {
            if (err) {
              return res.status(500).json({
                status: "Failure",
                message: "DB error",
                error: err,
              });
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
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
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
        id: user.id,
        name: user.employee_name,
        role: user.employee_role,
        email: user.employee_email,
      };

      // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

      const token = jwt.sign(
        {
          id: user.id,
          name: user.employee_name,
          role: user.employee_role,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

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

const forgototpStore = new Map();

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
  const { User } = req.body;

  if (!User) {
    return res
      .status(400)
      .json({ status: "Failure", message: "UserId is required" });
  }

  try {
    const getUserQuery = `SELECT * FROM dm_calculator_employees WHERE employee_email = ?`;

    db.query(getUserQuery, [User], async (err, result) => {
      if (err || result.length === 0) {
        return res
          .status(400)
          .json({ status: "Failure", message: "User not found" });
      }

      const user = result[0];
      const otp = crypto.randomInt(100000, 999999).toString();
      const otpHash = await bcrypt.hash(otp, 10);

      forgototpStore.set(user.id, {
        otpHash,
        expiresAt: Date.now() + 5 * 60 * 1000,
      });

      await passwordOtpEmail(user.employee_email, otp);

      return res.status(200).json({
        status: "Success",
        message: `OTP sent to ${user.employee_email}`,
      });
    });
  } catch (error) {
    console.error("Error processing forgot password request:", error);
    return res
      .status(500)
      .json({ status: "Failure", message: "Internal server error" });
  }
};

// exports.verifyOtpAndResetPassword = async (req, res) => {
//   const { User, otp, newPassword } = req.body;

//   if (!User || !otp || !newPassword) {
//     return res.status(400).json({
//       status: "Failure",
//       message: "UserId, OTP, and new password are required",
//     });
//   }

//   try {
//     const getUserQuery = `SELECT * FROM dm_calculator_employees WHERE employee_email = ?`;
//     db.query(getUserQuery, [User], async (err, results) => {
//       if (err || results.length === 0) {
//         return res
//           .status(404)
//           .json({ status: "Failure", message: "User not found" });
//       }

//       const user = results[0];
//       const otpData = forgototpStore.get(user.User);

//       if (!otpData || Date.now() > otpData.expiresAt) {
//         return res
//           .status(400)
//           .json({ status: "Failure", message: "OTP expired or invalid" });
//       }

//       console.log("OTP Provided:", otp);
//       console.log("Stored OTP Hash:", otpData.otpHash);

//       const isOtpValid = await bcrypt.compare(otp.toString(), otpData.otpHash);
//       console.log("OTP Valid:", isOtpValid);
//       if (!isOtpValid) {
//         return res
//           .status(400)
//           .json({ status: "Failure", message: "Invalid OTP" });
//       }

//       const hashedPassword = await bcrypt.hash(newPassword, 10);

//       const updatePasswordQuery = `UPDATE dm_calculator_employees SET employee_password = ? WHERE employee_email = ?`;
//       db.query(updatePasswordQuery, [hashedPassword, UserId], (updateErr) => {
//         if (updateErr) {
//           console.error("Error updating password:", updateErr);
//           return res
//             .status(500)
//             .json({ status: "Failure", message: "Failed to reset password" });
//         }

//         forgototpStore.delete(user.UserId);

//         return res
//           .status(200)
//           .json({ status: "Success", message: "Password reset successful" });
//       });
//     });
//   } catch (error) {
//     console.error("Error processing password reset:", error);
//     return res
//       .status(500)
//       .json({ status: "Failure", message: "Internal server error" });
//   }
// };

exports.verifyOtpAndResetPassword = async (req, res) => {
  const { User, otp, newPassword } = req.body;

  if (!User || !otp || !newPassword) {
    return res.status(400).json({
      status: "Failure",
      message: "UserId, OTP, and new password are required",
    });
  }

  try {
    const getUserQuery = `SELECT * FROM dm_calculator_employees WHERE employee_email = ?`;
    db.query(getUserQuery, [User], async (err, results) => {
      if (err || results.length === 0) {
        return res
          .status(404)
          .json({ status: "Failure", message: "User not found" });
      }

      const user = results[0];
      const otpData = forgototpStore.get(user.id); // FIXED

      if (!otpData || Date.now() > otpData.expiresAt) {
        return res
          .status(400)
          .json({ status: "Failure", message: "OTP expired or invalid" });
      }

      const isOtpValid = await bcrypt.compare(otp.toString(), otpData.otpHash);
      if (!isOtpValid) {
        return res
          .status(400)
          .json({ status: "Failure", message: "Invalid OTP" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatePasswordQuery = `UPDATE dm_calculator_employees SET employee_password = ? WHERE employee_email = ?`;
      db.query(updatePasswordQuery, [hashedPassword, User], (updateErr) => {
        if (updateErr) {
          console.error("Error updating password:", updateErr);
          return res
            .status(500)
            .json({ status: "Failure", message: "Failed to reset password" });
        }

        forgototpStore.delete(user.id); // FIXED

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

// exports.insertServices = async (req, res) => {
//   const { services, category, editing_type, amount, selected } = req.body;

//   const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

//   if (!services || !category || !editing_type || !amount) {
//     // selected is optional, so we don't check it
//     return res
//       .status(400)
//       .json({ status: "Failure", message: "All fields are required." });
//   }

//   if (isNaN(amount)) {
//     return res.status(400).json({
//       status: "Failure",
//       message: "Amount must be numbers.",
//     });
//   }

//   try {
//     db.query(
//       "INSERT INTO dm_calculator_services (services, category, editing_type, amount, selected, created_at) VALUES (?, ?, ?, ?, ?, ?)",
//       [services, category, editing_type, amount, selected || "N/A", createdAt],
//       (err, result) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ status: "Failure", message: "Database error" });
//         }

//         res.status(201).json({
//           status: "Success",
//           message: "Service added successfully",
//         });
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ status: "Failure", message: "Server error", error });
//   }
// };

// exports.getServices = async (req, res) => {
//   try {
//     db.query(
//       "SELECT * FROM dm_calculator_services ORDER BY id DESC",
//       (err, results) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ status: "Failure", message: "DB error", error: err });
//         }

//         if (results.length === 0) {
//           return res.status(404).json({
//             status: "Failure",
//             message: "Invalid user ID or password",
//           });
//         }

//         res.status(200).json({
//           status: "Success",
//           data: results,
//         });
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ status: "Failure", message: "Server error", error });
//   }
// };

// exports.updateServices = async (req, res) => {
//   const { id } = req.params;
//   const { services, category, editing_type, amount, selected } = req.body;

//   if (!services || !category || !editing_type || !amount) {
//     return res.status(400).json({
//       status: "Failure",
//       message: "All fields except 'selected' are required.",
//     });
//   }

//   try {
//     db.query(
//       "UPDATE dm_calculator_services SET services = ?, category = ?, editing_type = ?, amount = ?, selected = ? WHERE id = ?",
//       [services, category, editing_type, amount, selected || "N/A", id],
//       (err, result) => {
//         if (err) {
//           return res
//             .status(500)
//             .json({ status: "Failure", message: "DB error", error: err });
//         }

//         if (result.affectedRows === 0) {
//           return res.status(404).json({
//             status: "Failure",
//             message: "No service found with the given ID",
//           });
//         }

//         res.status(200).json({
//           status: "Success",
//           message: "Service updated successfully",
//         });
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ status: "Failure", message: "Server error", error });
//   }
// };

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

  // if (isNaN(amt_range_start) || isNaN(amt_range_end) || isNaN(percentage)) {
  if (
    isNaN(amt_range_start) ||
    (amt_range_end !== "Above" && isNaN(amt_range_end)) ||
    isNaN(percentage)
  ) {
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
    txn_id,
    client_id,
    service_name,
    category_name,
    editing_type_name,
    editing_type_amount,
    quantity,
    include_content_posting,
    include_thumbnail_creation,
    total_amount,
    employee,
    plan_name,
  } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const query = `
    INSERT INTO calculator_transactions (
    	txn_id,
      client_id,
      service_name,
      category_name,
      editing_type_name,
      editing_type_amount,
      quantity,
      include_content_posting,
      include_thumbnail_creation,
      total_amount,
      employee,plan_name,
      created_at
    ) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    txn_id,
    client_id,
    service_name,
    category_name,
    editing_type_name,
    editing_type_amount,
    quantity,
    include_content_posting,
    include_thumbnail_creation,
    total_amount,
    employee,
    plan_name || "Customise",
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

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!Array.isArray(adsItems) || adsItems.length === 0) {
    return res
      .status(400)
      .json({ status: "Failure", message: "No data provided." });
  }

  const insertValues = adsItems.map((item) => [
    item.txn_id,
    item.client_id,
    item.id,
    item.category,
    item.amount,
    item.percent,
    item.charge,
    item.total,
    item.employee,
    createdAt,
  ]);

  const sql = `
    INSERT INTO ads_campaign_details 
    (	txn_id, client_id, unique_id, category, amount, percent, charge, total, employee, created_at) 
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

exports.saveCalculatorDataOfPlan = (req, res) => {
  const {
    plan_id,
    plan_name,
    service_name,
    category_name,
    editing_type_name,
    editing_type_amount,
    quantity,
    include_content_posting,
    include_thumbnail_creation,
    total_amount,
    employee,
  } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const query = `
    INSERT INTO plan_data (
    	plan_id,plan_name,
      service_name,
      category_name,
      editing_type_name,
      editing_type_amount,
      quantity,
      include_content_posting,
      include_thumbnail_creation,
      total_amount,
      employee,
      created_at
    ) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    plan_id,
    plan_name,
    service_name,
    category_name,
    editing_type_name,
    editing_type_amount,
    quantity,
    include_content_posting,
    include_thumbnail_creation,
    total_amount,
    employee,
    createdAt,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res
        .status(500)
        .json({ status: "Failure", message: "Plan  error" });
    }

    res
      .status(200)
      .json({ status: "Success", message: "Saved successfully of Plan" });
  });
};

exports.saveCalculatorDataOfPlanDetail = (req, res) => {
  const { plan_name } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const query = `
    INSERT INTO plan_details (
    	plan_name,
      created_at
    ) VALUES (?, ?)
  `;

  const values = [plan_name, createdAt];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res
        .status(500)
        .json({ status: "Failure", message: "Plan  error" });
    }

    res.status(200).json({
      status: "Success",
      message: "Saved successfully of Plan Detail",
    });
  });
};

exports.saveClientWithPlan = async (req, res) => {
  const {
    client_name,
    client_organization,
    email,
    phone,
    address,
    dg_employee,
    txn_id,
    plans, // array of plans
    planNotes, // array of notes
  } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  try {
    // Step 1: Insert client details
    const clientQuery = `
      INSERT INTO dm_calculator_client_details 
      (client_name, client_organization, email, phone, address, dg_employee, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const clientValues = [
      client_name,
      client_organization || null,
      email || null,
      phone,
      address || null,
      dg_employee,
      createdAt,
    ];

    db.query(clientQuery, clientValues, (err, clientResult) => {
      if (err) {
        return res.status(500).json({
          status: "Failure",
          message: "Error saving client",
          error: err,
        });
      }

      const client_id = clientResult.insertId;

      // Step 2: Insert plans
      const planQuery = `
        INSERT INTO calculator_transactions 
        (txn_id, client_id, service_name, category_name, editing_type_name, editing_type_amount, quantity, include_content_posting, include_thumbnail_creation, total_amount, employee, plan_name, created_at) 
        VALUES ?`;

      const planValues = plans.map((p) => [
        txn_id,
        client_id,
        p.service_name,
        p.category_name,
        p.editing_type_name,
        p.editing_type_amount,
        p.quantity,
        p.include_content_posting,
        p.include_thumbnail_creation,
        p.total_amount,
        p.employee,
        p.plan_name,
        createdAt,
      ]);

      db.query(planQuery, [planValues], (err) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Error saving plans",
            error: err,
          });
        }

        // Step 3: Insert notes
        const noteClientQuery = `
          INSERT INTO plan_client_notes 
          (txn_id, client_id, note_name, created_at) 
          VALUES ?`;

        const noteClientValues = planNotes.map((p) => [
          txn_id,
          client_id,
          p.note_name,
          createdAt,
        ]);

        db.query(noteClientQuery, [noteClientValues], (err) => {
          if (err) {
            return res.status(500).json({
              status: "Failure",
              message: "Error saving notes",
              error: err,
            });
          }

          // ✅ Final response (only once)
          res.status(201).json({
            status: "Success",
            message: "Client, Plans, and Notes saved successfully",
            client_id,
            txn_id,
          });
        });
      });
    });
  } catch (error) {
    res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};

exports.addNotebyplan = async (req, res) => {
  const { note_name, plan } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!note_name || !plan) {
    return res.status(400).json({
      status: "Failure",
      message: "Notes name and plan required",
    });
  }

  try {
    db.query(
      "INSERT INTO plans_notes (note_name,plan, created_at) VALUES (?, ?,?)",
      [note_name, plan, createdAt],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error" });
        }

        res.status(201).json({
          status: "Success",
          message: "notes added successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};

exports.savePlanClientNotes = (req, res) => {
  const { txn_id, client_id, plans, planNotes } = req.body;

  if (!txn_id || !client_id || !plans || plans.length === 0) {
    return res
      .status(400)
      .json({ status: "Failure", message: "Missing required data" });
  }

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  // Step 1: Insert Plans (calculator_transactions)
  const planQuery = `
    INSERT INTO calculator_transactions 
    (txn_id, client_id, service_name, category_name, editing_type_name, editing_type_amount, quantity, include_content_posting, include_thumbnail_creation, total_amount, employee, plan_name, created_at) 
    VALUES ?
  `;

  const planValues = plans.map((p) => [
    txn_id,
    client_id,
    p.service_name,
    p.category_name,
    p.editing_type_name,
    p.editing_type_amount,
    p.quantity,
    p.include_content_posting,
    p.include_thumbnail_creation,
    p.total_amount,
    p.employee,
    p.plan_name && p.plan_name.trim() !== "" ? p.plan_name : "Customise",
    createdAt,
  ]);

  db.query(planQuery, [planValues], (err) => {
    if (err) {
      console.error("Error saving plans:", err);
      return res.status(500).json({
        status: "Failure",
        message: "Error saving plans",
        error: err,
      });
    }

    // Step 2: Insert Notes (plan_client_notes)
    if (planNotes && planNotes.length > 0) {
      const noteClientQuery = `
        INSERT INTO plan_client_notes 
        (txn_id, client_id, note_name,created_at) 
        VALUES ?
      `;

      const noteClientValues = planNotes.map((n) => [
        txn_id,
        client_id,
        n.note_name,

        createdAt,
      ]);

      db.query(noteClientQuery, [noteClientValues], (err) => {
        if (err) {
          console.error("Error saving notes:", err);
          return res.status(500).json({
            status: "Failure",
            message: "Error saving notes",
            error: err,
          });
        }

        return res.status(200).json({
          status: "Success",
          message: "Plans & Notes saved successfully",
        });
      });
    } else {
      return res.status(200).json({
        status: "Success",
        message: "Plans saved successfully (no notes provided)",
      });
    }
  });
};

exports.saveClientIdwiseNotes = (req, res) => {
  const { txn_id, client_id, planNotes } = req.body;

  if (!txn_id || !client_id) {
    return res
      .status(400)
      .json({ status: "Failure", message: "Missing required data" });
  }

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  // Step 1: Insert Plans (calculator_transactions)
  const NotesQuery = `
    INSERT INTO plan_client_notes 
        (txn_id, client_id, note_name,created_at) 
        VALUES ?
  `;

  const NotesValues = planNotes.map((n) => [
    txn_id,
    client_id,
    n.note_name,

    createdAt,
  ]);

  db.query(NotesQuery, [NotesValues], (err) => {
    if (err) {
      console.error("Error saving Client Notes:", err);
      return res.status(500).json({
        status: "Failure",
        message: "Error saving Client Notes",
        error: err,
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Client Notes saved successfully (no notes provided)",
    });
  });
};

//NEW Work

// function isEmail(v) {
//   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
// }

// async function sendAssignmentEmail({
//   to,
//   assigneeName,
//   clientName,
//   clientId,
//   txnId,
//   deadline,
//   baseUrl,
// }) {
//   if (!isEmail(to)) {
//     console.warn("[MAIL] Invalid/empty email:", to);
//     return;
//   }
//   if (!process.env.EMAILSENDER) {
//     console.error("[MAIL] Missing env EMAILSENDER");
//     return;
//   }

//   // Gmail typically requires From to match the authenticated account
//   const from = process.env.EMAILSENDER;

//   const prettyDeadline = deadline
//     ? moment(deadline).format("YYYY-MM-DD")
//     : "Not set";
//   const subject = `New Quotation Assigned • TXN ${txnId}`;
//   const html = `
//     <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
//       <h2 style="margin:0 0 8px">Quotation Assigned</h2>
//       <p>Hi <b>${assigneeName || "Team"}</b>,</p>
//       <p>You have been assigned a quotation.</p>
//       <table style="border-collapse:collapse">
//         <tr><td style="padding:4px 8px"><b>Client</b></td><td style="padding:4px 8px">${
//           clientName || "N/A"
//         } (ID: ${clientId})</td></tr>
//         <tr><td style="padding:4px 8px"><b>Transaction</b></td><td style="padding:4px 8px">${txnId}</td></tr>
//         <tr><td style="padding:4px 8px"><b>Deadline</b></td><td style="padding:4px 8px">${prettyDeadline}</td></tr>
//       </table>
//       ${
//         baseUrl
//           ? `<p><a href="${baseUrl}" target="_blank" rel="noreferrer">Open Quotation</a></p>`
//           : ""
//       }
//       <p>— System Notification</p>
//     </div>
//   `;

//   try {
//     const info = await transporter.sendMail({
//       from,
//       to,
//       subject,
//       html,
//     });
//     console.log("[MAIL] Sent:", {
//       messageId: info.messageId,
//       accepted: info.accepted,
//       rejected: info.rejected,
//       response: info.response,
//     });
//     if (info.rejected && info.rejected.length) {
//       throw new Error("Rejected recipients: " + info.rejected.join(", "));
//     }
//   } catch (err) {
//     console.error("[MAIL] sendMail error:", err);
//     throw err; // bubble up if you want to handle upstream
//   }
// }

exports.assignQuotation = (req, res) => {
  (async () => {
    try {
      const { client_id, txn_id, user_id, deadline } = req.body;
      if (!client_id || !txn_id || !user_id)
        return res
          .status(400)
          .json({ status: "Failure", message: "Missing ID(s)" });
      if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline))
        return res.status(400).json({
          status: "Failure",
          message: "Invalid deadline (YYYY-MM-DD)",
        });

      const createdAt = moment().tz(TZ).format("YYYY-MM-DD HH:mm:ss");
      const insertQuery = `
        INSERT INTO assign_quotation
          (client_id, txn_id, user_id, deadline, created_at,
           reminder_start_sent, reminder_mid_sent, reminder_day_before_sent)
        VALUES (?, ?, ?, ?, ?, 0, 0, 0)
      `;
      db.query(
        insertQuery,
        [client_id, txn_id, user_id, deadline || null, createdAt],
        async (err, result) => {
          if (err) {
            console.error("DB Error:", err);
            return res
              .status(500)
              .json({ status: "Failure", message: "Database Error" });
          }

          // Fetch assignee & client
          const [assignee] = await new Promise((resolve, reject) => {
            db.query(
              "SELECT employee_name, employee_email FROM dm_calculator_employees WHERE id = ? LIMIT 1",
              [user_id],
              (e, rows) => (e ? reject(e) : resolve(rows || []))
            );
          });
          const [client] = await new Promise((resolve, reject) => {
            db.query(
              "SELECT client_name FROM dm_calculator_client_details WHERE id = ? LIMIT 1",
              [client_id],
              (e, rows) => (e ? reject(e) : resolve(rows || []))
            );
          });

          // Send the "start" mail immediately and mark start_sent = 1
          try {
            if (assignee?.employee_email) {
              await sendAssignmentEmail({
                to: assignee.employee_email,
                assigneeName: assignee.employee_name,
                clientName: client?.client_name,
                clientId: client_id,
                txnId: txn_id,
                deadline,
                baseUrl: process.env.PUBLIC_APP_URL,
              });
              db.query(
                "UPDATE assign_quotation SET reminder_start_sent = 1 WHERE id = ?",
                [result.insertId]
              );
            } else {
              console.warn("[MAIL] No assignee email for user_id:", user_id);
            }
          } catch (mailErr) {
            console.error("[MAIL] assign send error:", mailErr);
          }

          return res.status(201).json({
            status: "Success",
            message: "Quotation assigned & start reminder sent",
            data: {
              id: result.insertId,
              client_id,
              txn_id,
              user_id,
              deadline: deadline || null,
              created_at: createdAt,
            },
          });
        }
      );
    } catch (error) {
      console.error("Server Error:", error);
      res
        .status(500)
        .json({ status: "Failure", message: "Internal Server Error" });
    }
  })();
};

exports.reassignQuotation = (req, res) => {
  (async () => {
    try {
      const { txn_id, user_id, deadline } = req.body;
      if (!txn_id || !user_id)
        return res
          .status(400)
          .json({ status: "Failure", message: "Missing ID(s)" });
      if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline))
        return res.status(400).json({
          status: "Failure",
          message: "Invalid deadline (YYYY-MM-DD)",
        });

      // fetch existing to detect changes
      const [existing] = await new Promise((resolve, reject) => {
        db.query(
          "SELECT id, user_id AS old_user, deadline AS old_deadline FROM assign_quotation WHERE txn_id = ? LIMIT 1",
          [txn_id],
          (e, rows) => (e ? reject(e) : resolve(rows || []))
        );
      });
      if (!existing)
        return res.status(404).json({
          status: "Failure",
          message: "No assignment found to update",
        });

      const now = moment().tz(TZ).format("YYYY-MM-DD HH:mm:ss");
      const q = `
        UPDATE assign_quotation
        SET user_id = ?, ${deadline ? "deadline = ?," : ""}
            updated_at = ?,
            version = CAST(CAST(COALESCE(NULLIF(version,''),'1') AS UNSIGNED) + 1 AS CHAR)
        WHERE txn_id = ?
      `;
      const params = deadline
        ? [user_id, deadline, now, txn_id]
        : [user_id, now, txn_id];

      db.query(q, params, async (err) => {
        if (err) {
          console.error("DB Error:", err);
          return res
            .status(500)
            .json({ status: "Failure", message: "Database Error" });
        }

        // If assignee or deadline changed → reset mid/day-before flags
        const changedUser = Number(existing.old_user) !== Number(user_id);
        const changedDeadline =
          deadline && String(existing.old_deadline || "") !== String(deadline);
        if (changedUser || changedDeadline) {
          db.query(
            "UPDATE assign_quotation SET reminder_mid_sent = 0, reminder_day_before_sent = 0, reminder_start_sent = 0 WHERE id = ?",
            [existing.id]
          );
        }

        // send "start" again on reassign and mark start_sent = 1
        try {
          const [assignee] = await new Promise((resolve, reject) => {
            db.query(
              "SELECT employee_name, employee_email FROM dm_calculator_employees WHERE id = ? LIMIT 1",
              [user_id],
              (e, rows) => (e ? reject(e) : resolve(rows || []))
            );
          });
          const [client] = await new Promise((resolve, reject) => {
            db.query(
              "SELECT client_name FROM dm_calculator_client_details WHERE id = ? LIMIT 1",
              [existing.client_id || null],
              (e, rows) => (e ? reject(e) : resolve(rows || []))
            );
          });

          // fetch client_id if not in existing
          let clientId = existing.client_id;
          if (!clientId) {
            const [row2] = await new Promise((resolve, reject) => {
              db.query(
                "SELECT client_id FROM assign_quotation WHERE txn_id = ? LIMIT 1",
                [txn_id],
                (e, rows) => (e ? reject(e) : resolve(rows || []))
              );
            });
            clientId = row2?.client_id;
          }

          if (assignee?.employee_email) {
            await sendAssignmentEmail({
              to: assignee.employee_email,
              assigneeName: assignee.employee_name,
              clientName: client?.client_name,
              clientId,
              txnId: txn_id,
              deadline: deadline || existing.old_deadline,
              baseUrl: process.env.PUBLIC_APP_URL,
            });
            db.query(
              "UPDATE assign_quotation SET reminder_start_sent = 1 WHERE id = ?",
              [existing.id]
            );
          }
        } catch (mailErr) {
          console.error("[MAIL] reassign send error:", mailErr);
        }

        return res.status(200).json({
          status: "Success",
          message: "Quotation re-assigned & start reminder sent",
        });
      });
    } catch (e) {
      console.error("Server Error:", e);
      res
        .status(500)
        .json({ status: "Failure", message: "Internal Server Error" });
    }
  })();
};

// exports.assignQuotation = (req, res) => {
//   (async () => {
//     try {
//       const { client_id, txn_id, user_id, deadline } = req.body;

//       if (!client_id || !txn_id || !user_id) {
//         return res
//           .status(400)
//           .json({ status: "Failure", message: "Missing ID(s)" });
//       }
//       if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
//         return res.status(400).json({
//           status: "Failure",
//           message: "Invalid deadline format (YYYY-MM-DD)",
//         });
//       }

//       const createdAt = moment()
//         .tz("Asia/Kolkata")
//         .format("YYYY-MM-DD HH:mm:ss");
//       const insertQuery = `
//         INSERT INTO assign_quotation (client_id, txn_id, user_id, deadline, created_at)
//         VALUES (?, ?, ?, ?, ?)
//       `;

//       db.query(
//         insertQuery,
//         [client_id, txn_id, user_id, deadline || null, createdAt],
//         async (err, result) => {
//           if (err) {
//             console.error("Database Error:", err);
//             return res.status(500).json({
//               status: "Failure",
//               message: "Database Error",
//               error: err,
//             });
//           }

//           try {
//             // Fetch assignee & client
//             const [assignee] = await new Promise((resolve, reject) => {
//               db.query(
//                 "SELECT employee_name, employee_email FROM dm_calculator_employees WHERE id = ? LIMIT 1",
//                 [user_id],
//                 (e, rows) => (e ? reject(e) : resolve(rows || []))
//               );
//             });
//             const [client] = await new Promise((resolve, reject) => {
//               db.query(
//                 "SELECT client_name FROM dm_calculator_client_details WHERE id = ? LIMIT 1",
//                 [client_id],
//                 (e, rows) => (e ? reject(e) : resolve(rows || []))
//               );
//             });

//             // DEBUG: log who we’re emailing
//             console.log(
//               "[MAIL] Preparing to send to:",
//               assignee?.employee_email
//             );

//             // ***** IMPORTANT while debugging: await this *****
//             if (assignee?.employee_email) {
//               await sendAssignmentEmail({
//                 to: assignee.employee_email,
//                 assigneeName: assignee.employee_name,
//                 clientName: client?.client_name,
//                 clientId: client_id,
//                 txnId: txn_id,
//                 deadline,
//                 baseUrl: process.env.PUBLIC_APP_URL,
//               });
//             } else {
//               console.warn(
//                 "[MAIL] Assignee email not found for user_id:",
//                 user_id
//               );
//             }
//           } catch (mailErr) {
//             console.error("[MAIL] Mail send error:", mailErr);
//             // You can choose to still return success for the assignment itself:
//             // return res.status(500).json({ status:"Failure", message:"Mail failed", error: String(mailErr) });
//           }

//           return res.status(201).json({
//             status: "Success",
//             message: "Quotation assigned successfully",
//             data: {
//               id: result.insertId,
//               client_id,
//               txn_id,
//               user_id,
//               deadline: deadline || null,
//               created_at: createdAt,
//             },
//           });
//         }
//       );
//     } catch (error) {
//       console.error("Server Error:", error);
//       return res
//         .status(500)
//         .json({ status: "Failure", message: "Internal Server Error" });
//     }
//   })();
// };

// NEW WORK FOR Remainder work progress

exports.setDoneQty = (req, res) => {
  const {
    client_id,
    txn_id,
    service_name,
    category_name,
    editing_type_name = "",
    planned_qty,
    done_qty,
    user_id,
  } = req.body;

  if (
    !client_id ||
    !txn_id ||
    !service_name ||
    !category_name ||
    planned_qty == null ||
    done_qty == null ||
    !user_id
  ) {
    return res
      .status(400)
      .json({ status: "Failure", message: "Missing fields" });
  }

  // ✅ normalize
  const svc = (service_name || "").trim();
  const cat = (category_name || "").trim();
  const edit = (editing_type_name || "").trim(); // default '' OK

  const planned = Math.max(0, parseInt(planned_qty, 10) || 0);
  let done = Math.max(0, parseInt(done_qty, 10) || 0);
  if (done > planned) done = planned;

  const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const upsert = `
    INSERT INTO service_progress
      (client_id, txn_id, service_name, category_name, editing_type_name,
       planned_qty, done_qty, last_updated_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      planned_qty = VALUES(planned_qty),
      done_qty = VALUES(done_qty),
      last_updated_by = VALUES(last_updated_by),
      updated_at = VALUES(updated_at)
  `;

  db.query(
    upsert,
    [
      client_id,
      txn_id,
      svc, // 👈 normalized values
      cat,
      edit,
      planned,
      done,
      user_id,
      now,
      now,
    ],
    (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res
          .status(500)
          .json({ status: "Failure", message: "Database Error" });
      }
      return res.status(200).json({
        status: "Success",
        message: "Progress saved",
        data: {
          client_id,
          txn_id,
          service_name: svc,
          category_name: cat,
          editing_type_name: edit,
          planned_qty: planned,
          done_qty: done,
        },
      });
    }
  );
};

// exports.setDoneQty = (req, res) => {
//   const {
//     client_id,
//     txn_id,
//     service_name,
//     category_name,
//     editing_type_name = "",
//     planned_qty, // send the latest planned (from history) to keep in sync
//     done_qty, // new absolute value
//     user_id, // employee who updates
//   } = req.body;

//   if (
//     !client_id ||
//     !txn_id ||
//     !service_name ||
//     !category_name ||
//     planned_qty == null ||
//     done_qty == null ||
//     !user_id
//   ) {
//     return res
//       .status(400)
//       .json({ status: "Failure", message: "Missing fields" });
//   }

//   const planned = Math.max(0, parseInt(planned_qty, 10) || 0);
//   let done = Math.max(0, parseInt(done_qty, 10) || 0);
//   if (done > planned) done = planned;

//   const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

//   const upsert = `
//     INSERT INTO service_progress
//       (client_id, txn_id, service_name, category_name, editing_type_name, planned_qty, done_qty, last_updated_by, created_at, updated_at)
//     VALUES
//       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     ON DUPLICATE KEY UPDATE
//       planned_qty = VALUES(planned_qty),
//       done_qty = VALUES(done_qty),
//       last_updated_by = VALUES(last_updated_by),
//       updated_at = VALUES(updated_at)
//   `;

//   db.query(
//     upsert,
//     [
//       client_id,
//       txn_id,
//       service_name,
//       category_name,
//       editing_type_name,
//       planned,
//       done,
//       user_id,
//       now,
//       now,
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("DB Error:", err);
//         return res
//           .status(500)
//           .json({ status: "Failure", message: "Database Error" });
//       }
//       return res.status(200).json({
//         status: "Success",
//         message: "Progress saved",
//         data: {
//           client_id,
//           txn_id,
//           service_name,
//           category_name,
//           editing_type_name,
//           planned_qty: planned,
//           done_qty: done,
//         },
//       });
//     }
//   );
// };

exports.incrementDoneQty = (req, res) => {
  const {
    client_id,
    txn_id,
    service_name,
    category_name,
    editing_type_name = "",
    planned_qty,
    delta,
    user_id,
  } = req.body;

  if (
    !client_id ||
    !txn_id ||
    !service_name ||
    !category_name ||
    planned_qty == null ||
    delta == null ||
    !user_id
  ) {
    return res
      .status(400)
      .json({ status: "Failure", message: "Missing fields" });
  }

  const planned = Math.max(0, parseInt(planned_qty, 10) || 0);
  const step = parseInt(delta, 10) || 0;
  const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  // Use one statement: create-if-missing with 0, then increment and clamp
  const q = `
    INSERT INTO service_progress
      (client_id, txn_id, service_name, category_name, editing_type_name, planned_qty, done_qty, last_updated_by, created_at, updated_at)
    VALUES
      (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      planned_qty = VALUES(planned_qty),
      done_qty = GREATEST(0, LEAST(VALUES(planned_qty), done_qty + ?)),
      last_updated_by = VALUES(last_updated_by),
      updated_at = VALUES(updated_at)
  `;

  db.query(
    q,
    [
      client_id,
      txn_id,
      service_name,
      category_name,
      editing_type_name,
      planned,
      user_id,
      now,
      now,
      step,
    ],
    (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res
          .status(500)
          .json({ status: "Failure", message: "Database Error" });
      }
      return res
        .status(200)
        .json({ status: "Success", message: "Progress updated" });
    }
  );
};

// module.exports = { sendAssignmentEmail, sendReminderEmail, TZ };

// exports.assignQuotation = (req, res) => {
//   try {
//     const { client_id, txn_id, user_id } = req.body;

//     if (!client_id || !txn_id || !user_id) {
//       return res
//         .status(400)
//         .json({ status: "Failure", message: "Missing ID(s)" });
//     }

//     const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

//     const insertQuery = `
//       INSERT INTO assign_quotation (client_id, txn_id, user_id, created_at)
//       VALUES (?, ?, ?, ?)
//     `;

//     db.query(
//       insertQuery,
//       [client_id, txn_id, user_id, createdAt],
//       (err, result) => {
//         if (err) {
//           console.error("Database Error:", err);
//           return res
//             .status(500)
//             .json({ status: "Failure", message: "Database Error", error: err });
//         }

//         return res.status(201).json({
//           status: "Success",
//           message: "Quotation assigned successfully",
//           data: {
//             id: result.insertId,
//             client_id,
//             txn_id,
//             user_id,
//             created_at: createdAt,
//           },
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Server Error:", error);
//     return res
//       .status(500)
//       .json({ status: "Failure", message: "Internal Server Error" });
//   }
// };
