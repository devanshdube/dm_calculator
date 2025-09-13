const axios = require("axios");

// ENV
const WHATSAPP_API_URL =
  process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v21.0/";
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID; // e.g. 123456789012345
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const TEMPLATES = {
  assignment: { name: "assignment_alert", lang: "en_US" }, // e.g., "assignment_alert", "en_US"
  reminder: { name: "reminder_alert", lang: "en_US" }, // single generic reminder template (optional)
  start: { name: "reminder_start", lang: "en_US" }, // if you use per-type templates
  mid: { name: "reminder_mid", lang: "en_US" },
  day_before: { name: "reminder_day_before", lang: "en_US" },
};

// If you're unsure which translation exists, we can try the list below in order
const DEFAULT_LANG_FALLBACK = ["en_US", "en", "hi"];

function normalizeMsisdn(v) {
  if (!v) return null;
  const digits = String(v).replace(/\D/g, "");
  if (!digits) return null;
  // If Indian 10-digit, prefix 91
  if (digits.length === 10) return `91${digits}`;
  // If already looks like E.164 without '+', pass through (e.g., 91xxxxxxxxxx)
  return digits;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function postToGraph(payload) {
  const url = `${WHATSAPP_API_URL}${PHONE_NUMBER_ID}/messages`;
  return axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    timeout: 15000,
    validateStatus: () => true,
  });
}

async function sendOnce({ to, templateName, components, lang }) {
  const msisdn = normalizeMsisdn(to);
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    return {
      ok: false,
      error: new Error("Missing PHONE_NUMBER_ID/ACCESS_TOKEN"),
    };
  }
  if (!msisdn) return { ok: false, error: new Error("Invalid phone number") };

  const payload = {
    messaging_product: "whatsapp",
    to: msisdn,
    type: "template",
    template: {
      name: templateName,
      language: { code: lang },
      components: components || [],
    },
  };

  const res = await postToGraph(payload);
  if (res.status >= 200 && res.status < 300 && res.data?.messages) {
    return { ok: true, data: res.data };
  }

  // Useful error logs
  const e = res?.data?.error;
  if (e?.code === 190) {
    console.error(
      "[WA] TOKEN ERROR 190:",
      e?.error_subcode,
      e?.error_subcode === 467
        ? "Access token invalidated (use System User token)."
        : "Access token expired/invalid."
    );
  } else if (e) {
    console.error("[WA] error:", JSON.stringify(e));
  } else {
    console.error("[WA] non-success:", res.status, res?.data);
  }

  return {
    ok: false,
    error: e || new Error(`HTTP ${res.status}`),
    data: res?.data,
  };
}

async function sendWhatsAppTemplate({
  to,
  templateName,
  components,
  lang, // preferred language
  preferLangs, // array of langs to try; falls back to DEFAULT_LANG_FALLBACK
  maxRetries = 2,
}) {
  if (!templateName) throw new Error("templateName required");

  const langs = preferLangs?.length
    ? preferLangs
    : lang
    ? [lang, ...DEFAULT_LANG_FALLBACK.filter((l) => l !== lang)]
    : DEFAULT_LANG_FALLBACK;

  let lastErr = null;

  for (const attemptLang of langs) {
    let attempt = 0;
    while (attempt <= maxRetries) {
      const res = await sendOnce({
        to,
        templateName,
        components,
        lang: attemptLang,
      });
      if (res.ok) {
        const wamid = res?.data?.messages?.[0]?.id;
        console.log(
          `[WA] sent ok: template=${templateName} lang=${attemptLang} to=${to} wamid=${
            wamid || "n/a"
          }`
        );
        return { ok: true, langUsed: attemptLang, wamid, raw: res.data };
      }

      // Retry only on rate limits / transient errors
      const errCode = res?.data?.error?.code;
      const httpMsg = res?.error?.message || "";
      const isRateOrServer =
        errCode === 4 || // rate limiting
        errCode === 17 || // user rate limit
        /HTTP 5\d{2}/.test(String(httpMsg));

      if (isRateOrServer && attempt < maxRetries) {
        const backoff = 500 * Math.pow(2, attempt); // 500ms, 1000ms, 2000ms...
        console.warn(
          `[WA] retrying (attempt ${
            attempt + 1
          }) after ${backoff}ms for lang=${attemptLang}`
        );
        await sleep(backoff);
        attempt++;
        continue;
      }

      // If template translation missing (132001), break & try next lang
      const e = res?.data?.error;
      if (e?.code === 132001) {
        console.warn(
          `[WA] template translation missing for lang=${attemptLang}; trying next...`
        );
        lastErr = res?.error || new Error("Template translation missing");
        break;
      }

      // Other errors: stop trying this lang
      lastErr = res?.error || new Error("Unknown WA error");
      break;
    }
  }

  return { ok: false, error: lastErr };
}

async function sendAssignmentWhatsApp({
  toPhone,
  assigneeName,
  clientName,
  clientId,
  txnId,
  deadline,
  link,
  lang, // optional override (e.g., "en")
  templateName, // optional override (e.g., "otpcode")
}) {
  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: assigneeName || "Team" }, // {{1}}
        { type: "text", text: clientName || "N/A" }, // {{2}}
        { type: "text", text: String(clientId) }, // {{3}}
        { type: "text", text: String(txnId) }, // {{4}}
        { type: "text", text: deadline ? String(deadline) : "Not set" }, // {{5}}
        { type: "text", text: link || "-" }, // {{6}}
      ],
    },
  ];

  const name = templateName || TEMPLATES.assignment.name;
  const preferred = [
    lang || TEMPLATES.assignment.lang,
    ...DEFAULT_LANG_FALLBACK,
  ];
  return sendWhatsAppTemplate({
    to: toPhone,
    templateName: name,
    components,
    preferLangs: [...new Set(preferred)],
  });
}

async function sendReminderWhatsApp({
  type, // "start" | "mid" | "day_before"
  toPhone,
  assigneeName,
  clientName,
  clientId,
  txnId,
  deadline,
  link,
  lang, // optional override
  templateName, // optional explicit template name
}) {
  // Choose template
  let chosen = null;
  if (templateName) {
    chosen = { name: templateName, lang: lang || TEMPLATES.reminder.lang };
  } else {
    chosen =
      TEMPLATES[type] && TEMPLATES[type].name
        ? TEMPLATES[type]
        : TEMPLATES.reminder;
  }

  // Build body params (for single-template case). If using per-type templates
  // with fewer params, adjust this array accordingly.
  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: type || "update" }, // {{1}}
        { type: "text", text: assigneeName || "Team" }, // {{2}}
        { type: "text", text: clientName || "N/A" }, // {{3}}
        { type: "text", text: String(clientId) }, // {{4}}
        { type: "text", text: String(txnId) }, // {{5}}
        { type: "text", text: deadline ? String(deadline) : "Not set" }, // {{6}}
        { type: "text", text: link || "-" }, // {{7}}
      ],
    },
  ];

  const preferred = [lang || chosen.lang, ...DEFAULT_LANG_FALLBACK];
  return sendWhatsAppTemplate({
    to: toPhone,
    templateName: chosen.name,
    components,
    preferLangs: [...new Set(preferred)],
  });
}

module.exports = {
  sendWhatsAppTemplate,
  sendAssignmentWhatsApp,
  sendReminderWhatsApp,
};
