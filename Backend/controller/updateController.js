const { db } = require("../connect");
const dotenv = require("dotenv");
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
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

exports.updatePlanNameDetail = async (req, res) => {
  const { id } = req.params;
  const { plan_name } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "Failure",
      message: "Missing id parameter",
    });
  }

  const updatePlanDetail = "UPDATE plan_details SET plan_name = ? WHERE id = ?";
  const updatePlanData = "UPDATE plan_data SET plan_name = ? WHERE plan_id = ?";

  db.query(updatePlanDetail, [plan_name, id], (err1, result1) => {
    if (err1) {
      return res.status(500).json({
        status: "Failure",
        message: "Error updating plan detail",
        error: err1,
      });
    }

    db.query(updatePlanData, [plan_name, id], (err2, result2) => {
      if (err2) {
        return res.status(500).json({
          status: "Failure",
          message: "Error updating plan data",
          error: err2,
        });
      }

      // Third query - update plans_notes
      db.query(updatePlanDataNotes, [plan_name, id], (err3, result3) => {
        if (err3) {
          return res.status(500).json({
            status: "Failure",
            message: "Error updating plan data note",
            error: err3,
          });
        }

        // ✅ All queries successful
        res.status(200).json({
          status: "Success",
          message: "Plan name updated successfully in all tables",
        });
      });
    });
  });
};

exports.updatePlandata = (req, res) => {
  const { id } = req.params;
  const {
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
    UPDATE plan_data
    SET

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

exports.updatePlanNotes = async (req, res) => {
  const { id } = req.params;
  const { note_name, plan } = req.body;

  db.query(
    "UPDATE plans_notes SET note_name = ?, plan = ? WHERE id = ?",
    [note_name, plan, id],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: "Failure", message: "Database error" });
      res.json({ status: "Success", message: "Note updated successfully" });
    }
  );
};

// NEW Work

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
}

async function sendAssignmentEmail({
  to,
  assigneeName,
  clientName,
  clientId,
  txnId,
  deadline,
  baseUrl,
}) {
  if (!isEmail(to)) {
    console.warn("[MAIL] Invalid/empty email:", to);
    return;
  }
  if (!process.env.EMAILSENDER) {
    console.error("[MAIL] Missing env EMAILSENDER");
    return;
  }

  // Gmail typically requires From to match the authenticated account
  const from = process.env.EMAILSENDER;

  const prettyDeadline = deadline
    ? moment(deadline).format("YYYY-MM-DD")
    : "Not set";
  const subject = `New Quotation Assigned • TXN ${txnId}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 8px">Quotation Assigned</h2>
      <p>Hi <b>${assigneeName || "Team"}</b>,</p>
      <p>You have been assigned a quotation.</p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 8px"><b>Client</b></td><td style="padding:4px 8px">${
          clientName || "N/A"
        } (ID: ${clientId})</td></tr>
        <tr><td style="padding:4px 8px"><b>Transaction</b></td><td style="padding:4px 8px">${txnId}</td></tr>
        <tr><td style="padding:4px 8px"><b>Deadline</b></td><td style="padding:4px 8px">${prettyDeadline}</td></tr>
      </table>
      ${
        baseUrl
          ? `<p><a href="${baseUrl}" target="_blank" rel="noreferrer">Open Quotation</a></p>`
          : ""
      }
      <p>— System Notification</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log("[MAIL] Sent:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    if (info.rejected && info.rejected.length) {
      throw new Error("Rejected recipients: " + info.rejected.join(", "));
    }
  } catch (err) {
    console.error("[MAIL] sendMail error:", err);
    throw err; // bubble up if you want to handle upstream
  }
}

exports.reassignQuotation = (req, res) => {
  (async () => {
    try {
      const { txn_id, user_id, deadline } = req.body;

      if (!txn_id || !user_id) {
        return res
          .status(400)
          .json({ status: "Failure", message: "Missing ID(s)" });
      }
      if (deadline && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
        return res.status(400).json({
          status: "Failure",
          message: "Invalid deadline format (YYYY-MM-DD)",
        });
      }

      const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
      const q = `
        UPDATE assign_quotation
        SET
          user_id = ?,
          ${deadline ? "deadline = ?," : ""}
          updated_at = ?,
          version = CAST(CAST(COALESCE(NULLIF(version,''),'1') AS UNSIGNED) + 1 AS CHAR)
        WHERE txn_id = ?
      `;
      const params = deadline
        ? [user_id, deadline, now, txn_id]
        : [user_id, now, txn_id];

      db.query(q, params, async (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res
            .status(500)
            .json({ status: "Failure", message: "Database Error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "No assignment found to update",
          });
        }

        // Read back for context
        const fetchQ = `SELECT client_id, user_id, deadline FROM assign_quotation WHERE txn_id = ? LIMIT 1`;
        db.query(fetchQ, [txn_id], async (e2, rows) => {
          if (e2) {
            console.error("Read-after-update error:", e2);
            return res.status(200).json({
              status: "Success",
              message:
                "Quotation re-assigned successfully (mail may not be sent)",
            });
          }

          const record = rows?.[0];
          const clientId = record?.client_id;
          const finalDeadline = record?.deadline || deadline || null;

          try {
            const [assignee] = await new Promise((resolve, reject) => {
              db.query(
                "SELECT employee_name, employee_email FROM dm_calculator_employees WHERE id = ? LIMIT 1",
                [user_id],
                (e, r) => (e ? reject(e) : resolve(r || []))
              );
            });
            const [client] = await new Promise((resolve, reject) => {
              db.query(
                "SELECT client_name FROM dm_calculator_client_details WHERE id = ? LIMIT 1",
                [clientId],
                (e, r) => (e ? reject(e) : resolve(r || []))
              );
            });

            if (assignee?.employee_email) {
              await sendAssignmentEmail({
                to: assignee.employee_email,
                assigneeName: assignee.employee_name,
                clientName: client?.client_name,
                clientId,
                txnId: txn_id,
                deadline: finalDeadline
                  ? String(finalDeadline).slice(0, 10)
                  : null,
                baseUrl: process.env.PUBLIC_APP_URL,
              });
            } else {
              console.warn("Assignee email not found for user_id:", user_id);
            }
          } catch (mailErr) {
            console.error("Mail send error:", mailErr);
          }

          return res.status(200).json({
            status: "Success",
            message: "Quotation re-assigned successfully",
          });
        });
      });
    } catch (e) {
      console.error("Server Error:", e);
      return res
        .status(500)
        .json({ status: "Failure", message: "Internal Server Error" });
    }
  })();
}; // working code

// ------------------

// exports.reassignQuotation = (req, res) => {
//   try {
//     const { txn_id, user_id } = req.body;
//     if (!txn_id || !user_id) {
//       return res
//         .status(400)
//         .json({ status: "Failure", message: "Missing ID(s)" });
//     }

//     const now = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
//     const q = `
//       UPDATE assign_quotation
//       SET
//         user_id = ?,
//         updated_at = ?,
//         version = CAST(CAST(COALESCE(NULLIF(version,''),'1') AS UNSIGNED) + 1 AS CHAR)
//       WHERE txn_id = ?
//     `;

//     db.query(q, [user_id, now, txn_id], (err, result) => {
//       if (err) {
//         console.error("Database Error:", err);
//         return res
//           .status(500)
//           .json({ status: "Failure", message: "Database Error" });
//       }
//       if (result.affectedRows === 0) {
//         return res.status(404).json({
//           status: "Failure",
//           message: "No assignment found to update",
//         });
//       }
//       return res.status(200).json({
//         status: "Success",
//         message: "Quotation re-assigned successfully",
//       });
//     });
//   } catch (e) {
//     console.error("Server Error:", e);
//     return res
//       .status(500)
//       .json({ status: "Failure", message: "Internal Server Error" });
//   }
// };
