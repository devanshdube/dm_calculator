// const cron = require("node-cron");
// const moment = require("moment-timezone");
// const { db } = require("../connect");
// const { sendReminderEmail, TZ } = require("./sendEmails");

// function computeMidDate(createdAt, deadline) {
//   if (!createdAt || !deadline) return null;

//   const start = moment.tz(createdAt, TZ).startOf("day");
//   const end = moment.tz(deadline, TZ).startOf("day");

//   // if deadline < start, nothing to do
//   if (end.isBefore(start, "day")) return null;

//   const days = end.diff(start, "days");
//   // For 0 or 1 day windows, "mid" has no meaning
//   if (days < 2) return null;

//   const mid = start.clone().add(Math.floor(days / 2), "days");
//   return mid.format("YYYY-MM-DD");
// }

// async function runReminderSweep() {
//   const now = moment().tz(TZ);
//   const today = now.format("YYYY-MM-DD");
//   const nowStr = now.format("YYYY-MM-DD HH:mm:ss");

//   console.log(`[REM] sweep start @ ${nowStr} (${TZ})`);

//   // Only fetch rows that still need at least one reminder
//   const sql = `
//     SELECT
//       aq.id, aq.client_id, aq.txn_id, aq.user_id,
//       aq.deadline, aq.created_at,
//       aq.reminder_start_sent, aq.reminder_mid_sent, aq.reminder_day_before_sent,
//       u.employee_name, u.employee_email, u.employee_phone, c.client_name
//     FROM assign_quotation aq
//     JOIN dm_calculator_employees u ON aq.user_id = u.id
//     JOIN dm_calculator_client_details c ON aq.client_id = c.id
//     WHERE aq.deadline IS NOT NULL
//       AND (
//         aq.reminder_start_sent = 0 OR
//         aq.reminder_mid_sent = 0 OR
//         aq.reminder_day_before_sent = 0
//       )
//   `;

//   db.query(sql, [], async (err, rows) => {
//     if (err) {
//       console.error("[REM] DB error:", err);
//       return;
//     }

//     for (const r of rows) {
//       try {
//         const createdDate = moment.tz(r.created_at, TZ).format("YYYY-MM-DD");
//         const midDate = computeMidDate(r.created_at, r.deadline);
//         const dayBefore = moment
//           .tz(r.deadline, TZ)
//           .clone()
//           .subtract(1, "day")
//           .format("YYYY-MM-DD");

//              const link = process.env.PUBLIC_APP_URL
//           ? `${process.env.PUBLIC_APP_URL}/quotation/${r.client_id}/${r.txn_id}`
//           : null;

//         // ---- START REMINDER (same day as created_at) ----
//         if (!r.reminder_start_sent) {
//           if (createdDate === today && r.employee_email) {
//             console.log(
//               `[REM][start][send] id=${r.id} txn=${r.txn_id} user=${r.user_id} created=${createdDate}`
//             );
//             await sendReminderEmail({
//               type: "start",
//               to: r.employee_email,
//               assigneeName: r.employee_name,
//               clientName: r.client_name,
//               clientId: r.client_id,
//               txnId: r.txn_id,
//               deadline: r.deadline,
//               baseUrl: process.env.PUBLIC_APP_URL,
//             });
//             db.query(
//               "UPDATE assign_quotation SET reminder_start_sent = 1, updated_at = ? WHERE id = ?",
//               [nowStr, r.id]
//             );
//           } else {
//             console.log(
//               `[REM][start][skip] id=${
//                 r.id
//               } need=${createdDate}==${today} email=${!!r.employee_email}`
//             );
//           }
//         }

//         // ---- MID REMINDER ----
//         if (!r.reminder_mid_sent) {
//           if (midDate && midDate === today && r.employee_email) {
//             console.log(
//               `[REM][mid][send] id=${r.id} txn=${r.txn_id} user=${r.user_id} mid=${midDate}`
//             );
//             await sendReminderEmail({
//               type: "mid",
//               to: r.employee_email,
//               assigneeName: r.employee_name,
//               clientName: r.client_name,
//               clientId: r.client_id,
//               txnId: r.txn_id,
//               deadline: r.deadline,
//               baseUrl: process.env.PUBLIC_APP_URL,
//             });
//             db.query(
//               "UPDATE assign_quotation SET reminder_mid_sent = 1, updated_at = ? WHERE id = ?",
//               [nowStr, r.id]
//             );
//           } else {
//             console.log(
//               `[REM][mid][skip] id=${r.id} need=${
//                 midDate || "null"
//               } today=${today} email=${!!r.employee_email}`
//             );
//           }
//         }

//         // ---- DAY-BEFORE REMINDER ----
//         if (!r.reminder_day_before_sent) {
//           if (dayBefore === today && r.employee_email) {
//             console.log(
//               `[REM][day_before][send] id=${r.id} txn=${r.txn_id} user=${r.user_id} day_before=${dayBefore}`
//             );
//             await sendReminderEmail({
//               type: "day_before",
//               to: r.employee_email,
//               assigneeName: r.employee_name,
//               clientName: r.client_name,
//               clientId: r.client_id,
//               txnId: r.txn_id,
//               deadline: r.deadline,
//               baseUrl: process.env.PUBLIC_APP_URL,
//             });
//             db.query(
//               "UPDATE assign_quotation SET reminder_day_before_sent = 1, updated_at = ? WHERE id = ?",
//               [nowStr, r.id]
//             );
//           } else {
//             console.log(
//               `[REM][day_before][skip] id=${
//                 r.id
//               } need=${dayBefore} today=${today} email=${!!r.employee_email}`
//             );
//           }
//         }
//       } catch (e) {
//         console.error("[REM] row error:", r?.id, e);
//       }
//     }

//     console.log(
//       `[REM] sweep end @ ${moment()
//         .tz(TZ)
//         .format("YYYY-MM-DD HH:mm:ss")} (${TZ})`
//     );
//   });
// }

// // Run daily at 09:00 IST
// cron.schedule("0 9 * * *", runReminderSweep, { timezone: TZ });

// // Also run once shortly after boot so newly created rows today can get the start reminder
// setTimeout(runReminderSweep, 30_000);

// module.exports = { runReminderSweep };

const cron = require("node-cron");
const moment = require("moment-timezone");
const { db } = require("../connect");
const { sendReminderEmail, TZ } = require("./sendEmails");
const { sendReminderWhatsApp } = require("./sendWhatsApp");

function computeMidDate(createdAt, deadline) {
  if (!createdAt || !deadline) return null;

  const start = moment.tz(createdAt, TZ).startOf("day");
  const end = moment.tz(deadline, TZ).startOf("day");

  // if deadline < start, nothing to do
  if (end.isBefore(start, "day")) return null;

  const days = end.diff(start, "days");
  // For 0 or 1 day windows, "mid" has no meaning
  if (days < 2) return null;

  const mid = start.clone().add(Math.floor(days / 2), "days");
  return mid.format("YYYY-MM-DD");
}

async function runReminderSweep() {
  const now = moment().tz(TZ);
  const today = now.format("YYYY-MM-DD");
  const nowStr = now.format("YYYY-MM-DD HH:mm:ss");

  console.log(`[REM] sweep start @ ${nowStr} (${TZ})`);

  // Only fetch rows that still need at least one reminder
  const sql = `
    SELECT
      aq.id, aq.client_id, aq.txn_id, aq.user_id,
      aq.deadline, aq.created_at,
      aq.reminder_start_sent, aq.reminder_mid_sent, aq.reminder_day_before_sent,
      u.employee_name, u.employee_email, u.employee_phone,
      c.client_name
    FROM assign_quotation aq
    JOIN dm_calculator_employees u ON aq.user_id = u.id
    JOIN dm_calculator_client_details c ON aq.client_id = c.id
    WHERE aq.deadline IS NOT NULL
      AND (
        aq.reminder_start_sent = 0 OR
        aq.reminder_mid_sent = 0 OR
        aq.reminder_day_before_sent = 0
      )
  `;

  db.query(sql, [], async (err, rows) => {
    if (err) {
      console.error("[REM] DB error:", err);
      return;
    }

    for (const r of rows) {
      try {
        const createdDate = moment.tz(r.created_at, TZ).format("YYYY-MM-DD");
        const midDate = computeMidDate(r.created_at, r.deadline);
        const dayBefore = moment
          .tz(r.deadline, TZ)
          .clone()
          .subtract(1, "day")
          .format("YYYY-MM-DD");

        const link = process.env.PUBLIC_APP_URL
          ? `${process.env.PUBLIC_APP_URL}/quotation/${r.client_id}/${r.txn_id}`
          : null;

        // Helper: send on both channels (best-effort)
        const sendBoth = async (type) => {
          let attempted = false;

          if (r.employee_email) {
            attempted = true;
            try {
              await sendReminderEmail({
                type,
                to: r.employee_email,
                assigneeName: r.employee_name,
                clientName: r.client_name,
                clientId: r.client_id,
                txnId: r.txn_id,
                deadline: r.deadline,
                baseUrl: process.env.PUBLIC_APP_URL,
              });
              console.log(
                `[REM][${type}][email] id=${r.id} -> ${r.employee_email}`
              );
            } catch (e) {
              console.error(
                `[REM][${type}][email][err] id=${r.id}`,
                e?.message || e
              );
            }
          }

          if (r.employee_phone) {
            attempted = true;
            try {
              await sendReminderWhatsApp({
                type,
                toPhone: r.employee_phone,
                assigneeName: r.employee_name,
                clientName: r.client_name,
                clientId: r.client_id,
                txnId: r.txn_id,
                deadline: r.deadline,
                link,
              });
              console.log(
                `[REM][${type}][wa] id=${r.id} -> ${r.employee_phone}`
              );
            } catch (e) {
              console.error(
                `[REM][${type}][wa][err] id=${r.id}`,
                e?.message || e
              );
            }
          }

          return attempted; // at least one channel attempted
        };

        // ---- START REMINDER (same day as created_at) ----
        if (!r.reminder_start_sent) {
          if (createdDate === today && (r.employee_email || r.employee_phone)) {
            console.log(
              `[REM][start][send] id=${r.id} txn=${r.txn_id} user=${r.user_id} created=${createdDate}`
            );
            const attempted = await sendBoth("start");
            if (attempted) {
              db.query(
                "UPDATE assign_quotation SET reminder_start_sent = 1, updated_at = ? WHERE id = ?",
                [nowStr, r.id]
              );
            }
          } else {
            console.log(
              `[REM][start][skip] id=${
                r.id
              } need=${createdDate}==${today} email=${!!r.employee_email} phone=${!!r.employee_phone}`
            );
          }
        }

        // ---- MID REMINDER ----
        if (!r.reminder_mid_sent) {
          if (
            midDate &&
            midDate === today &&
            (r.employee_email || r.employee_phone)
          ) {
            console.log(
              `[REM][mid][send] id=${r.id} txn=${r.txn_id} user=${r.user_id} mid=${midDate}`
            );
            const attempted = await sendBoth("mid");
            if (attempted) {
              db.query(
                "UPDATE assign_quotation SET reminder_mid_sent = 1, updated_at = ? WHERE id = ?",
                [nowStr, r.id]
              );
            }
          } else {
            console.log(
              `[REM][mid][skip] id=${r.id} need=${
                midDate || "null"
              } today=${today} email=${!!r.employee_email} phone=${!!r.employee_phone}`
            );
          }
        }

        // ---- DAY-BEFORE REMINDER ----
        if (!r.reminder_day_before_sent) {
          if (dayBefore === today && (r.employee_email || r.employee_phone)) {
            console.log(
              `[REM][day_before][send] id=${r.id} txn=${r.txn_id} user=${r.user_id} day_before=${dayBefore}`
            );
            const attempted = await sendBoth("day_before");
            if (attempted) {
              db.query(
                "UPDATE assign_quotation SET reminder_day_before_sent = 1, updated_at = ? WHERE id = ?",
                [nowStr, r.id]
              );
            }
          } else {
            console.log(
              `[REM][day_before][skip] id=${
                r.id
              } need=${dayBefore} today=${today} email=${!!r.employee_email} phone=${!!r.employee_phone}`
            );
          }
        }
      } catch (e) {
        console.error("[REM] row error:", r?.id, e);
      }
    }

    console.log(
      `[REM] sweep end @ ${moment()
        .tz(TZ)
        .format("YYYY-MM-DD HH:mm:ss")} (${TZ})`
    );
  });
}

// Run daily at 09:00 IST
cron.schedule("0 9 * * *", runReminderSweep, { timezone: TZ });

// Also run once shortly after boot so newly created rows today can get the start reminder
setTimeout(runReminderSweep, 30_000);

module.exports = { runReminderSweep };

// const cron = require("node-cron");
// const moment = require("moment-timezone");
// const { db } = require("../connect");
// const { sendReminderEmail, TZ } = require("./sendEmails");

// function computeMidDate(createdAt, deadline) {
//   if (!createdAt || !deadline) return null;
//   const start = moment.tz(createdAt, TZ).startOf("day");
//   const end = moment.tz(deadline, TZ).startOf("day");
//   const days = end.diff(start, "days");
//   if (days < 2) return null; // too short to have a meaningful mid
//   const mid = start.clone().add(Math.floor(days / 2), "days");
//   return mid.format("YYYY-MM-DD");
// }

// async function runReminderSweep() {
//   const today = moment().tz(TZ).format("YYYY-MM-DD");
//   const nowStr = moment().tz(TZ).format("YYYY-MM-DD HH:mm:ss");
//   console.log(`[REM] sweep @ ${nowStr} (${TZ})`);

//   const sql = `
//     SELECT aq.id, aq.client_id, aq.txn_id, aq.user_id, aq.deadline, aq.created_at,
//            aq.reminder_start_sent, aq.reminder_mid_sent, aq.reminder_day_before_sent,
//            u.employee_name, u.employee_email, u.employee_phone, c.client_name
//     FROM assign_quotation aq
//     JOIN dm_calculator_employees u ON aq.user_id = u.id
//     JOIN dm_calculator_client_details c ON aq.client_id = c.id
//     WHERE aq.deadline IS NOT NULL
//       AND (aq.reminder_start_sent = 0 OR aq.reminder_mid_sent = 0 OR aq.reminder_day_before_sent = 0)
//   `;

//   db.query(sql, [], async (err, rows) => {
//     if (err) {
//       console.error("[REM] DB error:", err);
//       return;
//     }
//     for (const r of rows) {
//       try {
//         const createdDate = moment.tz(r.created_at, TZ).format("YYYY-MM-DD");
//         const midDate = computeMidDate(r.created_at, r.deadline);
//         const dayBefore = moment
//           .tz(r.deadline, TZ)
//           .clone()
//           .subtract(1, "day")
//           .format("YYYY-MM-DD");
//         const link = process.env.PUBLIC_APP_URL
//           ? `${process.env.PUBLIC_APP_URL}/quotation/${r.client_id}/${r.txn_id}`
//           : null;

//         // START (if someone inserted but mail didn't go earlier)
//         if (
//           !r.reminder_start_sent &&
//           createdDate === today &&
//           r.employee_email
//         ) {
//           await sendReminderEmail({
//             type: "start",
//             to: r.employee_email,
//             assigneeName: r.employee_name,
//             clientName: r.client_name,
//             clientId: r.client_id,
//             txnId: r.txn_id,
//             deadline: r.deadline,
//             baseUrl: process.env.PUBLIC_APP_URL,
//           });
//           db.query(
//             "UPDATE assign_quotation SET reminder_start_sent = 1, updated_at = ? WHERE id = ?",
//             [nowStr, r.id]
//           );
//         }

//         // MID
//         if (
//           !r.reminder_mid_sent &&
//           midDate &&
//           midDate === today &&
//           r.employee_email
//         ) {
//           await sendReminderEmail({
//             type: "mid",
//             to: r.employee_email,
//             assigneeName: r.employee_name,
//             clientName: r.client_name,
//             clientId: r.client_id,
//             txnId: r.txn_id,
//             deadline: r.deadline,
//             baseUrl: process.env.PUBLIC_APP_URL,
//           });
//           db.query(
//             "UPDATE assign_quotation SET reminder_mid_sent = 1, updated_at = ? WHERE id = ?",
//             [nowStr, r.id]
//           );
//         }

//         // DAY BEFORE
//         if (
//           !r.reminder_day_before_sent &&
//           dayBefore === today &&
//           r.employee_email
//         ) {
//           await sendReminderEmail({
//             type: "day_before",
//             to: r.employee_email,
//             assigneeName: r.employee_name,
//             clientName: r.client_name,
//             clientId: r.client_id,
//             txnId: r.txn_id,
//             deadline: r.deadline,
//             baseUrl: process.env.PUBLIC_APP_URL,
//           });
//           db.query(
//             "UPDATE assign_quotation SET reminder_day_before_sent = 1, updated_at = ? WHERE id = ?",
//             [nowStr, r.id]
//           );
//         }
//       } catch (e) {
//         console.error("[REM] row error:", r?.id, e);
//       }
//     }
//   });
// }

// // Daily 09:00 AM IST
// cron.schedule("0 9 * * *", runReminderSweep, { timezone: TZ });

// // Optional: also run once shortly after boot to catch immediate cases
// setTimeout(runReminderSweep, 30_000);

// module.exports = { runReminderSweep };
