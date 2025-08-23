const moment = require("moment-timezone");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASSWORD,
  },
  logger: true,
  debug: true,
});

const TZ = "Asia/Kolkata";

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
    console.warn("[MAIL] Invalid email:", to);
    return;
  }
  const prettyDeadline = deadline
    ? moment(deadline).format("YYYY-MM-DD")
    : "Not set";
  const subject = `New Quotation Assigned • TXN ${txnId}`;
  const link = baseUrl ? `${baseUrl}/quotation/${clientId}/${txnId}` : null;

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
        link
          ? `<p><a href="${link}" target="_blank" rel="noreferrer">Open Quotation</a></p>`
          : ""
      }
      <p>— System Notification</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: process.env.EMAILSENDER,
    to,
    subject,
    html,
  });
  console.log("[MAIL] Assigned:", info.messageId, info.accepted, info.rejected);
}

async function sendReminderEmail({
  type,
  to,
  assigneeName,
  clientName,
  clientId,
  txnId,
  deadline,
  baseUrl,
}) {
  if (!isEmail(to)) {
    console.warn("[MAIL] Invalid email:", to);
    return;
  }
  const prettyDeadline = deadline
    ? moment(deadline).format("YYYY-MM-DD")
    : "Not set";
  const link = baseUrl ? `${baseUrl}/quotation/${clientId}/${txnId}` : null;

  const SUBJECTS = {
    start: `Reminder (Start) • TXN ${txnId}`,
    mid: `Reminder (Mid) • TXN ${txnId}`,
    day_before: `Reminder (1 day left) • TXN ${txnId}`,
  };
  const subject = SUBJECTS[type] || `Reminder • TXN ${txnId}`;

  const intro =
    {
      start: "Work window has started for this quotation.",
      mid: "You're at the midpoint to the deadline.",
      day_before: "Only 1 day left to the deadline.",
    }[type] || "This is a reminder.";

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5">
      <h2 style="margin:0 0 8px">${subject}</h2>
      <p>Hi <b>${assigneeName || "Team"}</b>,</p>
      <p>${intro}</p>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 8px"><b>Client</b></td><td style="padding:4px 8px">${
          clientName || "N/A"
        } (ID: ${clientId})</td></tr>
        <tr><td style="padding:4px 8px"><b>Transaction</b></td><td style="padding:4px 8px">${txnId}</td></tr>
        <tr><td style="padding:4px 8px"><b>Deadline</b></td><td style="padding:4px 8px">${prettyDeadline}</td></tr>
      </table>
      ${
        link
          ? `<p><a href="${link}" target="_blank" rel="noreferrer">Open Quotation</a></p>`
          : ""
      }
      <p>— System Notification</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: process.env.EMAILSENDER,
    to,
    subject,
    html,
  });
  console.log(
    `[MAIL] Reminder ${type}:`,
    info.messageId,
    info.accepted,
    info.rejected
  );
}

module.exports = { sendAssignmentEmail, sendReminderEmail, TZ };
