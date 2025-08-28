const cron = require("node-cron");
const moment = require("moment-timezone");
const { db } = require("../connect");
const { sendReminderEmail, TZ } = require("./sendEmails");

function computeMidDate(createdAt, deadline) {
  if (!createdAt || !deadline) return null;
  const start = moment.tz(createdAt, TZ).startOf("day");
  const end = moment.tz(deadline, TZ).startOf("day");
  const days = end.diff(start, "days");
  if (days < 2) return null; // too short to have a meaningful mid
  const mid = start.clone().add(Math.floor(days / 2), "days");
  return mid.format("YYYY-MM-DD");
}

async function runReminderSweep() {
  const today = moment().tz(TZ).format("YYYY-MM-DD");
  const nowStr = moment().tz(TZ).format("YYYY-MM-DD HH:mm:ss");
  console.log(`[REM] sweep @ ${nowStr} (${TZ})`);

  const sql = `
    SELECT aq.id, aq.client_id, aq.txn_id, aq.user_id, aq.deadline, aq.created_at,
           aq.reminder_start_sent, aq.reminder_mid_sent, aq.reminder_day_before_sent,
           u.employee_name, u.employee_email, c.client_name
    FROM assign_quotation aq
    JOIN dm_calculator_employees u ON aq.user_id = u.id
    JOIN dm_calculator_client_details c ON aq.client_id = c.id
    WHERE aq.deadline IS NOT NULL
      AND (aq.reminder_start_sent = 0 OR aq.reminder_mid_sent = 0 OR aq.reminder_day_before_sent = 0)
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

        // START (if someone inserted but mail didn't go earlier)
        if (
          !r.reminder_start_sent &&
          createdDate === today &&
          r.employee_email
        ) {
          await sendReminderEmail({
            type: "start",
            to: r.employee_email,
            assigneeName: r.employee_name,
            clientName: r.client_name,
            clientId: r.client_id,
            txnId: r.txn_id,
            deadline: r.deadline,
            baseUrl: process.env.PUBLIC_APP_URL,
          });
          db.query(
            "UPDATE assign_quotation SET reminder_start_sent = 1, updated_at = ? WHERE id = ?",
            [nowStr, r.id]
          );
        }

        // MID
        if (
          !r.reminder_mid_sent &&
          midDate &&
          midDate === today &&
          r.employee_email
        ) {
          await sendReminderEmail({
            type: "mid",
            to: r.employee_email,
            assigneeName: r.employee_name,
            clientName: r.client_name,
            clientId: r.client_id,
            txnId: r.txn_id,
            deadline: r.deadline,
            baseUrl: process.env.PUBLIC_APP_URL,
          });
          db.query(
            "UPDATE assign_quotation SET reminder_mid_sent = 1, updated_at = ? WHERE id = ?",
            [nowStr, r.id]
          );
        }

        // DAY BEFORE
        if (
          !r.reminder_day_before_sent &&
          dayBefore === today &&
          r.employee_email
        ) {
          await sendReminderEmail({
            type: "day_before",
            to: r.employee_email,
            assigneeName: r.employee_name,
            clientName: r.client_name,
            clientId: r.client_id,
            txnId: r.txn_id,
            deadline: r.deadline,
            baseUrl: process.env.PUBLIC_APP_URL,
          });
          db.query(
            "UPDATE assign_quotation SET reminder_day_before_sent = 1, updated_at = ? WHERE id = ?",
            [nowStr, r.id]
          );
        }
      } catch (e) {
        console.error("[REM] row error:", r?.id, e);
      }
    }
  });
}

// Daily 09:00 AM IST
cron.schedule("0 9 * * *", runReminderSweep, { timezone: TZ });

// Optional: also run once shortly after boot to catch immediate cases
setTimeout(runReminderSweep, 30_000);

module.exports = { runReminderSweep };
