function escapeCell(value: string): string {
  // Neutralise spreadsheet formula injection (=, +, -, @, tab, CR).
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCsv(headers: string[], rows: (string | number | null)[][]) {
  const lines = [headers.map(escapeCell).join(",")];
  for (const row of rows) {
    lines.push(row.map((cell) => escapeCell(String(cell ?? ""))).join(","));
  }
  // UTF-8 BOM keeps Excel from mangling accented characters.
  return `\uFEFF${lines.join("\r\n")}\r\n`;
}
