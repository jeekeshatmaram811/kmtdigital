import { createHmac, scryptSync, timingSafeEqual } from "crypto";

const SESSION_COOKIE_NAME = "kmt_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function verifyAdminCredentials(email: string, password: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !passwordHash) {
    return false;
  }

  if (email !== adminEmail) {
    return false;
  }

  const [salt, storedHashHex] = passwordHash.split(":");
  if (!salt || !storedHashHex) {
    return false;
  }

  const computedHash = scryptSync(password, salt, 64);
  const storedHash = Buffer.from(storedHashHex, "hex");

  return (
    computedHash.length === storedHash.length &&
    timingSafeEqual(computedHash, storedHash)
  );
}

function sign(payload: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET must be set");
  }
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionCookie(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + SESSION_TTL_MS })
  ).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifySessionCookie(token: string | undefined): boolean {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  let expectedSignature: string;
  try {
    expectedSignature = sign(payload);
  } catch {
    return false;
  }

  const expected = Buffer.from(expectedSignature, "hex");
  const actual = Buffer.from(signature, "hex");
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return false;
  }

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export { SESSION_COOKIE_NAME };
