// Removes secrets before anything is printed into test output or reports.
export function redact(value: unknown, max = 300): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return text
    .replace(/("password"\s*:\s*")[^"]*(")/g, '$1<redacted>$2')
    .replace(/("pushToken"\s*:\s*")[^"]*(")/g, '$1<redacted>$2')
    .replace(/eyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}/g, '<jwt>')
    .slice(0, max);
}
