const { db } = require("../connect");
const dotenv = require("dotenv");
dotenv.config();

exports.getAddServices = async (req, res) => {
  try {
    db.query("SELECT * FROM services", (err, results) => {
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
          message: "No services found",
        });
      }

      res.status(200).json({
        status: "Success",
        data: results,
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

exports.getAddCategories = async (req, res) => {
  const { service_id } = req.params;

  try {
    db.query(
      "SELECT * FROM categories WHERE service_id = ?",
      [service_id],
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
            message: "No categories found for this service",
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

exports.getAddEditingTypes = async (req, res) => {
  const { service, category } = req.params;

  try {
    db.query(
      "SELECT * FROM editing_types WHERE service_id = ? AND category_id = ?",
      [service, category],
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
            message: "No Editing Type Found for this categories & service",
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

exports.getAllServiceData = (req, res) => {
  const query = `
    SELECT 
      s.service_id,
      s.service_name,
      c.category_id,
      c.category_name,
      e.editing_type_id,
      e.editing_type_name,
      s.created_at AS service_created_at,
      c.created_at AS category_created_at,
      e.created_at AS editing_type_created_at
    FROM services s
    LEFT JOIN categories c ON s.service_id = c.service_id
    LEFT JOIN editing_types e ON c.category_id = e.category_id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching joined data:", err);
      return res.status(500).json({
        status: "Error",
        message: "Failed to fetch data",
      });
    }

    res.json({
      status: "Success",
      data: results,
    });
  });
};
