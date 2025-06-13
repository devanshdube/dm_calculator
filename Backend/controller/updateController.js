const { db } = require("../connect");
const dotenv = require("dotenv");
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
