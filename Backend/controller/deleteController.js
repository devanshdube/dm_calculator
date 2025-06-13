const { db } = require("../connect");
const dotenv = require("dotenv");
dotenv.config();

exports.deleteService = async (req, res) => {
  const { service_id } = req.params;

  db.query(
    "DELETE FROM services WHERE service_id = ?",
    [service_id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      }
      res.json({ status: "Success", message: "Service deleted successfully" });
    }
  );
};

exports.deleteCategory = async (req, res) => {
  const { category_id } = req.params;

  db.query(
    "DELETE FROM categories WHERE category_id = ?",
    [category_id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      }
      res.json({ status: "Success", message: "Category deleted successfully" });
    }
  );
};

exports.deleteEditingType = async (req, res) => {
  const { editing_type_id } = req.params;

  db.query(
    "DELETE FROM editing_types WHERE editing_type_id = ?",
    [editing_type_id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      }
      res.json({
        status: "Success",
        message: "Editing type deleted successfully",
      });
    }
  );
};

exports.deleteAdsServices = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: "Failure",
      message: "ID is required to delete the ad service.",
    });
  }

  try {
    db.query(
      "DELETE FROM dm_calculator_ads WHERE id = ?",
      [id],
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
          message: "Ads Service deleted successfully",
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
