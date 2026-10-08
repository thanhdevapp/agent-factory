/**
 * Secret and credential redaction utility to prevent exposing
 * API keys, authorization tokens, or sensitive credentials in logs.
 */

const SECRET_PATTERNS = [
  // Bearer / Authorization tokens
  /(Bearer\s+)[a-zA-Z0-9_\-\.]{16,}/gi,
  /(Basic\s+)[a-zA-Z0-9+\/=]{16,}/gi,

  // Known API Key Prefixes
  /(sk-[a-zA-Z0-9]{20,})/g,                   // OpenAI / Anthropic-like keys
  /(ghp_[a-zA-Z0-9]{36})/g,                   // GitHub Personal Access Token
  /(gho_[a-zA-Z0-9]{36})/g,                   // GitHub OAuth Token
  /(github_pat_[a-zA-Z0-9_]{50,})/g,          // GitHub Fine-grained PAT
  /(glpat-[a-zA-Z0-9\-]{20,})/g,              // GitLab Personal Access Token
  /(xox[baprs]-[a-zA-Z0-9\-]{10,})/g,         // Slack Tokens
  /(AIza[0-9A-Za-z-_]{35})/g,                 // Google API Key

  // Generic key assignments in bash or env: KEY=..., TOKEN=..., SECRET=...
  /((?:API_KEY|SECRET|TOKEN|PASSWORD|PASSWD|AUTH|PRIVATE_KEY)[\s]*[=:][\s]*['"]?)([^\s'"&;]{8,})(['"]?)/gi,

  // PEM Private keys
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
];

/**
 * Redacts known sensitive strings in text.
 * @param {string} text
 * @returns {string}
 */
export function redactSecrets(text) {
  if (typeof text !== "string" || !text) return text;

  let redacted = text;
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.source.includes("BEGIN")) {
      redacted = redacted.replace(pattern, "[REDACTED_PRIVATE_KEY]");
    } else {
      redacted = redacted.replace(pattern, (match, prefix, secret) => {
        if (prefix && secret) {
          return `${prefix}[REDACTED_SECRET]`;
        }
        return "[REDACTED_SECRET]";
      });
    }
  }

  return redacted;
}

/**
 * Deeply redacts object values (strings and nested objects/arrays).
 * @param {any} val
 * @returns {any}
 */
export function redactDeep(val) {
  if (typeof val === "string") {
    return redactSecrets(val);
  }
  if (Array.isArray(val)) {
    return val.map(redactDeep);
  }
  if (val && typeof val === "object") {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      if (/key|secret|token|password|auth/i.test(k) && typeof v === "string" && v.length > 6) {
        res[k] = "[REDACTED_SECRET]";
      } else {
        res[k] = redactDeep(v);
      }
    }
    return res;
  }
  return val;
}
