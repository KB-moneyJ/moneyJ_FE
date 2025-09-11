export type TipItem = { label: string; text: string };

export function parseTips(raw?: string | null): TipItem[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = Math.max(line.indexOf(':'), line.indexOf('：'));
      if (idx === -1) {
        return { label: '', text: line };
      }
      const label = line
        .slice(0, idx)
        .trim()
        .replace(/[：:]+$/, '');
      const text = line.slice(idx + 1).trim();
      return { label, text };
    });
}
