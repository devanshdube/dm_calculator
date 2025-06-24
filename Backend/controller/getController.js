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
      e.amount,
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

exports.getAdsServices = async (req, res) => {
  try {
    db.query(
      "SELECT * FROM dm_calculator_ads ORDER BY id DESC",
      (err, results) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No ads services found",
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

exports.getAllServiceDatas = (req, res) => {
  const query = `
    SELECT 
      s.service_id,
      s.service_name,
      c.category_id,
      c.category_name,
      e.editing_type_id,
      e.editing_type_name,
      e.amount,
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
      return res
        .status(500)
        .json({ status: "Failure", message: "Failed to fetch data" });
    }

    const groupedData = [];
    // console.log(`204 ${groupedData}`);
    // console.log(`205 ${results}`);

    results.forEach((row) => {
      let service = groupedData.find((s) => s.service_id === row.service_id);
      // console.log(`210 ${service}`);

      if (!service) {
        service = {
          service_id: row.service_id,
          service_name: row.service_name,
          service_created_at: row.service_created_at,
          categories: [],
        };
        groupedData.push(service);
        // console.log(`220 ${groupedData}`);
      }

      // console.log(`224 ${groupedData}`);
      // console.log(`225 ${service}`);

      let category = service.categories.find(
        (c) => c.category_id === row.category_id
      );
      // console.log(`230 ${category}`);
      if (!category && row.category_id) {
        category = {
          category_id: row.category_id,
          category_name: row.category_name,
          category_created_at: row.category_created_at,
          editing_types: [],
        };
        service.categories.push(category);
        // console.log(`239 ${category}`);
      }

      if (row.editing_type_id) {
        category.editing_types.push({
          editing_type_id: row.editing_type_id,
          editing_type_name: row.editing_type_name,
          amount: row.amount,
          editing_type_created_at: row.editing_type_created_at,
        });
      }
    });

    res.json({
      status: "Success",
      data: groupedData,
    });
  });
};

exports.getCalculatorTransactions = async (req, res) => {
  try {
    db.query("SELECT * FROM calculator_transactions", (err, results) => {
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

exports.getByIDCalculatorTransactions = async (req, res) => {
  const { txn_id, client_id } = req.params;

  try {
    db.query(
      "SELECT * FROM calculator_transactions WHERE txn_id = ? AND client_id = ?",
      [txn_id, client_id],
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
            message: "No calculator transactions found",
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

exports.getByIDAdsCampaignDetails = async (req, res) => {
  const { txn_id, client_id } = req.params;

  try {
    db.query(
      "SELECT * FROM ads_campaign_details WHERE txn_id = ? AND client_id = ?",
      [txn_id, client_id],
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
            message: "No calculator transactions found",
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

exports.getClientDetailsById = async (req, res) => {
  const clientId = req.params.id;

  try {
    db.query(
      "SELECT * FROM dm_calculator_client_details WHERE id = ?",
      [clientId],
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
            message: "Client not found",
          });
        }

        res.status(200).json({
          status: "Success",
          data: results[0],
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
