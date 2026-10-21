const DEFAULT_API_ORIGIN = "https://shireautomations.com";

export async function fetchShireJson(path, options = {}) {
  const configuredOrigin = process.env.SHIRE_API_URL || DEFAULT_API_ORIGIN;
  let origin;
  try {
    origin = new URL(configuredOrigin);
  } catch {
    throw new Error("SHIRE_API_URL must be a valid http or https URL.");
  }
  if (!["http:", "https:"].includes(origin.protocol) || origin.username || origin.password) {
    throw new Error("SHIRE_API_URL must use http or https and cannot include credentials.");
  }

  const url = new URL(path, origin.origin);
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(15_000) });
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`Shire API returned an invalid response (HTTP ${response.status}).`);
  }
  if (!response.ok) {
    throw new Error(body?.error || `Shire API request failed (HTTP ${response.status}).`);
  }
  return body;
}
