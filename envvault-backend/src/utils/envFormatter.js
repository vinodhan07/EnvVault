export function formatEnv(secrets) {
  return secrets
    .map(s => `${s.key}=${s.value}`)
    .join("\n");
}
