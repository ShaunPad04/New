const MAX_LENGTHS = {
  'first-name': 80,
  'last-name': 80,
  email: 254,
  phone: 80,
  'enquiry-type': 160,
  message: 3000,
  'stock-number': 80,
};

function clean(value, max = 500) {
  return String(value ?? '').trim().slice(0, max);
}

function normaliseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body !== 'string') return {};

  const contentType = String(req.headers['content-type'] || '');
  if (contentType.includes('application/json')) {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(req.body));
  }
  return {};
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function deliverWebhook(payload) {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return false;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source: 'watchclub-daydate-concept',
      submittedAt: new Date().toISOString(),
      ...payload,
    }),
  });

  if (!response.ok) throw new Error(`Webhook delivery failed: ${response.status}`);
  return true;
}

async function deliverEmail(payload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.ENQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) return false;

  const fullName = [payload['first-name'], payload['last-name']].filter(Boolean).join(' ');
  const subject = `Watch enquiry · Stock ${payload['stock-number'] || '16496'} · ${fullName || payload.email}`;
  const text = [
    'New watch enquiry',
    '',
    `Name: ${fullName || 'Not provided'}`,
    `Email: ${payload.email}`,
    `Phone / WhatsApp: ${payload.phone || 'Not provided'}`,
    `Enquiry type: ${payload['enquiry-type'] || 'Not provided'}`,
    `Stock number: ${payload['stock-number'] || '16496'}`,
    '',
    'Message:',
    payload.message || 'No message provided.',
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject,
      text,
    }),
  });

  if (!response.ok) throw new Error(`Email delivery failed: ${response.status}`);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const raw = normaliseBody(req);

  // Honeypot: return a harmless success response to bots.
  if (clean(raw['company-name'], 200)) {
    return json(res, 200, { ok: true });
  }

  const payload = {};
  for (const [key, max] of Object.entries(MAX_LENGTHS)) {
    payload[key] = clean(raw[key], max);
  }

  if (!payload['first-name'] || !payload['last-name'] || !payload.email) {
    return json(res, 400, { ok: false, error: 'Please complete the required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return json(res, 400, { ok: false, error: 'Please enter a valid email address.' });
  }

  try {
    let delivered = false;

    if (process.env.ENQUIRY_WEBHOOK_URL) {
      delivered = (await deliverWebhook(payload)) || delivered;
    }
    if (process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL && process.env.ENQUIRY_FROM_EMAIL) {
      delivered = (await deliverEmail(payload)) || delivered;
    }

    if (!delivered) {
      return json(res, 503, {
        ok: false,
        error: 'Enquiry delivery is not configured yet. Please call or email us directly.',
      });
    }

    return json(res, 200, { ok: true });
  } catch (error) {
    console.error('Enquiry delivery failed', error);
    return json(res, 502, {
      ok: false,
      error: 'The enquiry could not be delivered. Please call or email us directly.',
    });
  }
}
