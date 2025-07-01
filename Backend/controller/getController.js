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

exports.getClientTxnHistory = async (req, res) => {
  const client_id = req.params.client_id;

  const query = `
    WITH txn_services AS (
      SELECT txn_id, client_id, created_at FROM calculator_transactions
      UNION ALL
      SELECT txn_id, client_id, created_at FROM ads_campaign_details
    )
    SELECT 
      txn_id, client_id, created_at AS txn_date
    FROM txn_services
    WHERE client_id = ?
    GROUP BY txn_id, client_id, DATE(created_at)
    ORDER BY txn_date DESC
  `;

  db.query(query, [client_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "Failure", message: "Database error", error: err });
    }

    res.status(200).json({
      status: "Success",
      message: "Client txn history fetched successfully",
      data: result,
    });
  });
};

// exports.getClientServiceHistory = async (req, res) => {
//   const { client_id, txn_id } = req.params;

//   const query = `
//     SELECT
//       'Graphic Service' AS service_type,
//       ct.txn_id,
//       ct.created_at,
//       ct.service_name,
//       ct.category_name,
//       ct.editing_type_name,
//       ct.editing_type_amount,
//       ct.quantity,
//       ct.total_amount
//     FROM calculator_transactions ct
//     WHERE ct.txn_id = ? AND ct.client_id = ?

//     UNION

//     SELECT
//       'Ads Campaign' AS service_type,
//       ad.txn_id,
//       ad.created_at,
//       NULL AS service_name,
//       ad.category,
//       NULL AS editing_type_name,
//       NULL AS editing_type_amount,
//       NULL AS quantity,
//       ad.total
//     FROM ads_campaign_details ad
//     WHERE ad.txn_id = ? AND ad.client_id = ?
//   `;

//   db.query(query, [txn_id, client_id, txn_id, client_id], (err, result) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ status: "Failure", message: "Database error", error: err });
//     }

//     res.status(200).json({
//       status: "Success",
//       message: "Client service history fetched successfully",
//       data: result,
//     });
//   });
// };

exports.getClientServiceHistory = async (req, res) => {
  const { client_id, txn_id } = req.params;

  const query = `
    SELECT 
      'Graphic Service' AS service_type,
      ct.txn_id,
      ct.created_at,
      ct.service_name,
      ct.category_name,
      ct.editing_type_name,
      ct.editing_type_amount,
      ct.quantity,
      ct.total_amount,
      NULL AS amount,
      NULL AS percent,
      NULL AS charge
    FROM calculator_transactions ct
    WHERE ct.txn_id = ? AND ct.client_id = ?

    UNION

    SELECT 
      'Ads Campaign' AS service_type,
      ad.txn_id,
      ad.created_at,
      NULL AS service_name,
      ad.category AS category_name,
      NULL AS editing_type_name,
      NULL AS editing_type_amount,
      NULL AS quantity,
      ad.total AS total_amount,
      ad.amount,
      ad.percent,
      ad.charge
    FROM ads_campaign_details ad
    WHERE ad.txn_id = ? AND ad.client_id = ?
  `;

  db.query(query, [txn_id, client_id, txn_id, client_id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ status: "Failure", message: "Database error", error: err });
    }

    res.status(200).json({
      status: "Success",
      message: "Client service history fetched successfully",
      data: result,
    });
  });
};

exports.getAllClientsTxnHistory = async (req, res) => {
  const query = `
    WITH txn_services AS (
      SELECT txn_id, client_id, created_at FROM calculator_transactions
      UNION ALL
      SELECT txn_id, client_id, created_at FROM ads_campaign_details
    )
    SELECT 
      d.id AS client_id,
      d.client_name,
      d.client_organization,
      d.email,
      d.phone,
      d.address,
      d.dg_employee,
      d.created_at AS client_created_at,
      t.txn_id,
      t.created_at AS txn_date
    FROM dm_calculator_client_details d
    LEFT JOIN txn_services t ON d.id = t.client_id
    ORDER BY txn_date DESC
  `;

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "Failure",
        message: "Database error",
        error: err,
      });
    }

    res.status(200).json({
      status: "Success",
      message: "All client transaction history fetched successfully",
      data: result,
    });
  });
};

exports.getAllBD = async (req, res) => {
  try {
    db.query("SELECT * FROM dm_calculator_employees", (err, results) => {
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

// >>>>>>>>>> BD GET API's <<<<<<<<<<<

exports.getClientDetailsEmp = async (req, res) => {
  const dg_employee = req.params.dg_employee;

  try {
    if (!dg_employee) {
      return res.status(400).json({
        status: "Failure",
        message: "Missing employee route parameter",
      });
    }

    db.query(
      "SELECT * FROM dm_calculator_client_details WHERE dg_employee = ? ORDER BY id DESC",
      [dg_employee],
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
            message: "No client details found for the given employee",
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

exports.getClientsTxnHistoryByEmployee = async (req, res) => {
  const { dg_employee } = req.params;

  // const query = `
  //   WITH txn_services AS (
  //     SELECT txn_id, client_id, created_at FROM calculator_transactions
  //     UNION ALL
  //     SELECT txn_id, client_id, created_at FROM ads_campaign_details
  //   )
  //   SELECT
  //     d.id AS client_id,
  //     d.client_name,
  //     d.client_organization,
  //     d.email,
  //     d.phone,
  //     d.address,
  //     d.dg_employee,
  //     d.created_at AS client_created_at,
  //     t.txn_id,
  //     DATE(t.created_at) AS txn_date
  //   FROM dm_calculator_client_details d
  //   LEFT JOIN txn_services t ON d.id = t.client_id
  //   WHERE d.dg_employee = ?
  //   ORDER BY txn_date DESC
  // `;

  const query = `
WITH txn_services AS (
  SELECT txn_id, client_id, created_at, 'calculator' AS source FROM calculator_transactions
  UNION
  SELECT txn_id, client_id, created_at, 'ads_campaign' AS source FROM ads_campaign_details
)
SELECT
  d.id AS client_id,
  d.client_name,
  d.client_organization,
  d.email,
  d.phone,
  d.address,
  d.dg_employee,
  d.created_at AS client_created_at,
  t.txn_id,
  DATE(t.created_at) AS txn_date,
  t.source
FROM dm_calculator_client_details d
LEFT JOIN (
  SELECT txn_id, client_id, created_at, source
  FROM txn_services
  GROUP BY txn_id, client_id, created_at, source
) t ON d.id = t.client_id
WHERE d.dg_employee = ?
ORDER BY txn_date DESC;
    `;
  //   const query = `
  //  WITH txn_services AS (
  //   SELECT txn_id, client_id, created_at FROM calculator_transactions
  //   UNION ALL
  //   SELECT txn_id, client_id, created_at FROM ads_campaign_details
  // ),
  // latest_txn AS (
  //   SELECT client_id, MAX(created_at) AS last_txn_date
  //   FROM txn_services
  //   GROUP BY client_id
  // )
  // SELECT
  //   d.id AS client_id,
  //   d.client_name,
  //   d.client_organization,
  //   d.email,
  //   d.phone,
  //   d.address,
  //   d.dg_employee,
  //   d.created_at AS client_created_at,
  //   lt.last_txn_date
  // FROM dm_calculator_client_details d
  // LEFT JOIN latest_txn lt ON d.id = lt.client_id
  // WHERE d.dg_employee = ?
  // ORDER BY
  //   CASE WHEN lt.last_txn_date IS NULL THEN 1 ELSE 0 END,
  //   lt.last_txn_date DESC;

  //     `;

  db.query(query, [dg_employee], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "Failure",
        message: "Database error",
        error: err,
      });
    }

    res.status(200).json({
      status: "Success",
      message: `Transaction history fetched for employee: ${dg_employee}`,
      data: result,
    });
  });
};
