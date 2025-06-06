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
