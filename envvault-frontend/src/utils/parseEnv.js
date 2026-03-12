// src/utils/parseEnv.js
// Parse .env file content into key-value array
export function parseEnvFile(content) {
  return content
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'))
    .map((line) => {
      const [key, ...rest] = line.split('=')
      return {
        key:   key.trim(),
        value: rest.join('=').trim().replace(/^["']|["']$/g, ''),
      }
    })
    .filter((item) => item.key)
}
