// routes/clientTxnHistory.js

const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/getClientTxnHistory/:client_id", (req, res) => {
  const client_id = req.params.client_id;

  const query = `
    WITH txn_services AS (
      SELECT txn_id, client_id, created_at FROM calculator_transactions
      UNION ALL
      SELECT txn_id, client_id, created_at FROM ads_campaign_details
    )
    SELECT 
      txn_id,
      client_id,
      DATE(created_at) AS txn_date
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
});

module.exports = router;

// routes/clientServiceHistory.js

const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/getClientServiceHistory/:client_id/:txn_id", (req, res) => {
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
      ct.total_amount
    FROM calculator_transactions ct
    WHERE ct.txn_id = ? AND ct.client_id = ?

    UNION

    SELECT 
      'Ads Campaign' AS service_type,
      ad.txn_id,
      ad.created_at,
      NULL AS service_name,
      ad.category,
      NULL AS editing_type_name,
      NULL AS editing_type_amount,
      NULL AS quantity,
      ad.total
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
});

module.exports = router;

const clientTxnHistory = require("./routes/clientTxnHistory");
const clientServiceHistory = require("./routes/clientServiceHistory");

app.use("/api", clientTxnHistory);
app.use("/api", clientServiceHistory);
