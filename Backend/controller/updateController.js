const { db } = require("../connect");
const dotenv = require("dotenv");
const moment = require("moment-timezone");
dotenv.config();

exports.updateService = async (req, res) => {
  const { service_id } = req.params;
  const { service_name } = req.body;

  db.query(
    "UPDATE services SET service_name = ? WHERE service_id = ?",
    [service_name, service_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      res.json({ status: "Success", message: "Service updated successfully" });
    }
  );
};

exports.updateCategory = async (req, res) => {
  const { category_id } = req.params;
  const { category_name } = req.body;

  db.query(
    "UPDATE categories SET category_name = ? WHERE category_id = ?",
    [category_name, category_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      res.json({ status: "Success", message: "Category updated successfully" });
    }
  );
};

exports.updateEditingType = async (req, res) => {
  const { editing_type_id } = req.params;
  const { editing_type_name } = req.body;

  db.query(
    "UPDATE editing_types SET editing_type_name = ? WHERE editing_type_id = ?",
    [editing_type_name, editing_type_id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      res.json({
        status: "Success",
        message: "Editing type updated successfully",
      });
    }
  );
};

exports.updateCalculatorDataById = (req, res) => {
  const { id } = req.params;
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
  } = req.body;

  const updatedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  const query = `
    UPDATE calculator_transactions
    SET
      txn_id = ?,
      client_id = ?,
      service_name = ?,
      category_name = ?,
      editing_type_name = ?,
      editing_type_amount = ?,
      quantity = ?,
      include_content_posting = ?,
      include_thumbnail_creation = ?,
      total_amount = ?,
      employee = ?,
      created_at = ?
    WHERE id = ?
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
    updatedAt,
    id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Update Error:", err);
      return res.status(500).json({ status: "Failure", message: "DB error" });
    }

    res
      .status(200)
      .json({ status: "Success", message: "Entry updated successfully" });
  });
};

exports.updateClientDetails = async (req, res) => {
  const clientId = req.params.id;
  const { client_name, client_organization, email, phone, address } = req.body;

  if (!client_name || !client_organization || !email || !phone || !address) {
    return res
      .status(400)
      .json({ status: "Failure", message: "All fields are required." });
  }

  try {
    const updatedAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

    db.query(
      `UPDATE dm_calculator_client_details
       SET client_name = ?, client_organization = ?, email = ?, phone = ?, address = ?, created_at = ?
       WHERE id = ?`,
      [
        client_name,
        client_organization,
        email,
        phone,
        address,
        updatedAt,
        clientId,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: "Failure", message: "Database error", error: err });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ status: "Failure", message: "Client not found." });
        }

        res.status(200).json({
          status: "Success",
          message: "Client details updated successfully.",
        });
      }
    );
  } catch (error) {
    res.status(500).json({ status: "Failure", message: "Server error", error });
  }
};
