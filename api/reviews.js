const { neon } = require("@neondatabase/serverless");
const { createHash } = require("crypto");

const sql = neon(process.env.DATABASE_URL);
let schemaPromise;

async function ensureSchema() {
  if (!schemaPromise) {
    schemaPromise = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS public.reviews (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        review TEXT NOT NULL CHECK (char_length(review) BETWEEN 3 AND 1500),
        verification_email VARCHAR(254) NOT NULL,
        verification_consent BOOLEAN NOT NULL DEFAULT FALSE,
        age_permission_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
        verification_status VARCHAR(24) NOT NULL DEFAULT 'not_checked',
        ip_hash CHAR(64),
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )`;
      await sql`CREATE INDEX IF NOT EXISTS reviews_public_created_idx
        ON public.reviews (created_at DESC) WHERE is_published = TRUE`;
      await sql`CREATE INDEX IF NOT EXISTS reviews_ip_created_idx
        ON public.reviews (ip_hash, created_at DESC)`;
    })();
  }
  try {
    await schemaPromise;
  } catch (error) {
    schemaPromise = undefined;
    throw error;
  }
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return send(res, 405, { error: "Method not allowed." });
  }

  if (!process.env.DATABASE_URL) {
    return send(res, 503, { error: "Reviews are temporarily unavailable." });
  }

  try {
    await ensureSchema();

    if (req.method === "GET") {
      const [summary] = await sql`
        SELECT COUNT(*)::int AS count,
               COALESCE(ROUND(AVG(rating)::numeric, 1), 0)::float AS average
        FROM public.reviews
        WHERE is_published = TRUE
      `;
      const reviews = await sql`
        SELECT id, name, rating, review, created_at
        FROM public.reviews
        WHERE is_published = TRUE
        ORDER BY created_at DESC
        LIMIT 30
      `;
      return send(res, 200, { summary, reviews });
    }

    let body = req.body || {};
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const review = typeof body.review === "string" ? body.review.trim() : "";
    const rating = Number(body.rating);
    const verificationConsent = body.verificationConsent === true;
    const agePermissionConfirmed = body.agePermissionConfirmed === true;

    // Quiet honeypot for basic bot filtering.
    if (typeof body.website === "string" && body.website.trim()) {
      return send(res, 200, { ok: true });
    }

    if (!name || name.length > 80 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
        !Number.isInteger(rating) || rating < 1 || rating > 5 ||
        review.length < 3 || review.length > 1500 ||
        !verificationConsent || !agePermissionConfirmed) {
      return send(res, 400, { error: "Please complete every field and confirm both consent statements." });
    }

    const forwarded = req.headers["x-forwarded-for"];
    const ip = req.headers["x-real-ip"] ||
      (typeof forwarded === "string" ? forwarded.split(",")[0].trim() : "");
    const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : null;

    if (ipHash) {
      const recent = await sql`
        SELECT COUNT(*)::int AS count
        FROM public.reviews
        WHERE ip_hash = ${ipHash}
          AND created_at > NOW() - INTERVAL '2 minutes'
      `;
      if (recent[0].count >= 2) {
        return send(res, 429, { error: "Please wait a little before submitting another review." });
      }
    }

    const [saved] = await sql`
      INSERT INTO public.reviews
        (name, rating, review, verification_email, verification_consent,
         age_permission_confirmed, ip_hash, is_published)
      VALUES
        (${name}, ${rating}, ${review}, ${email}, TRUE, TRUE, ${ipHash}, TRUE)
      RETURNING id, name, rating, review, created_at
    `;

    return send(res, 201, { ok: true, review: saved });
  } catch (error) {
    console.error("Review API error:", error);
    return send(res, 500, { error: "We couldn't save your review just now. Please try again later." });
  }
};
