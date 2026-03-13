/**
 * Formats an array of secret objects into a .env string format.
 * Expects secrets to have { key: string, value: string }
 */
export const formatEnvFile = (secrets) => {
  if (!Array.isArray(secrets)) return "";
  
  return secrets
    .filter(s => s.key && s.value)
    .map(s => `${s.key}=${s.value}`)
    .join("\n");
};
