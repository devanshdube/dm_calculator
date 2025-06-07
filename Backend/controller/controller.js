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

// Test API Forget Password & Verify OTP Last Work
