import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "zenup-admin-session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

type AdminConfigIssue =
  | "ADMIN_USERNAME is missing."
  | "ADMIN_PASSWORD is missing."
  | "ADMIN_PASSWORD is still using the placeholder value."
  | "ADMIN_SESSION_SECRET is missing."
  | "ADMIN_SESSION_SECRET is still using the placeholder value.";

function getEnvValue(name: "ADMIN_SESSION_SECRET" | "ADMIN_USERNAME" | "ADMIN_PASSWORD") {
  return (process.env[name] || "").trim();
}

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getAdminSecret() {
  const secret = getEnvValue("ADMIN_SESSION_SECRET");

  if (!secret || secret === "change-me-in-env" || secret === "replace-with-a-long-random-secret") {
    throw new Error("ADMIN_SESSION_SECRET must be configured before admin login is enabled.");
  }

  return secret;
}

export function getAdminConfigIssues(): AdminConfigIssue[] {
  const username = getEnvValue("ADMIN_USERNAME");
  const password = getEnvValue("ADMIN_PASSWORD");
  const secret = getEnvValue("ADMIN_SESSION_SECRET");
  const issues: AdminConfigIssue[] = [];

  if (!username) {
    issues.push("ADMIN_USERNAME is missing.");
  }

  if (!password) {
    issues.push("ADMIN_PASSWORD is missing.");
  } else if (password === "change-this-password") {
    issues.push("ADMIN_PASSWORD is still using the placeholder value.");
  }

  if (!secret) {
    issues.push("ADMIN_SESSION_SECRET is missing.");
  } else if (secret === "change-me-in-env" || secret === "replace-with-a-long-random-secret") {
    issues.push("ADMIN_SESSION_SECRET is still using the placeholder value.");
  }

  return issues;
}

function getSignature(payload: string) {
  return createHmac("sha256", getAdminSecret()).update(payload).digest("base64url");
}

export function isAdminConfigReady() {
  return getAdminConfigIssues().length === 0;
}

export function validateAdminCredentials(username: string, password: string) {
  const adminUsername = getEnvValue("ADMIN_USERNAME");
  const adminPassword = getEnvValue("ADMIN_PASSWORD");

  if (!adminUsername || !adminPassword || adminPassword === "change-this-password") {
    return false;
  }

  return username === adminUsername && password === adminPassword;
}

export function createAdminToken(username: string) {
  const payload = base64UrlEncode(
    JSON.stringify({
      username,
      exp: Date.now() + SESSION_DURATION_MS
    })
  );
  const signature = getSignature(payload);
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string) {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return false;
  }

  let expected = "";

  try {
    expected = getSignature(payload);
  } catch {
    return false;
  }

  if (signature.length !== expected.length) {
    return false;
  }

  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return false;
  }

  const decoded = JSON.parse(base64UrlDecode(payload)) as {
    username: string;
    exp: number;
  };

  return decoded.exp > Date.now();
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? verifyAdminToken(token) : false;
}

export async function requireAdminSession() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }
}

export async function setAdminSession(username: string) {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: createAdminToken(username),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(Date.now() + SESSION_DURATION_MS)
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set({
    name: COOKIE_NAME,
    value: "",
    path: "/",
    expires: new Date(0)
  });
}
