import { PlaceholderItem } from '../types/legal';

export function extractPlaceholders(text: string): PlaceholderItem[] {
  if (!text) return [];

  // Match bracketed tokens like [PARTY A FULL LEGAL NAME], [AMOUNT], etc.
  const regex = /\[([A-Z0-9_\s\/\-\$\.\,\'\:]+)\]/g;
  const matches = new Set<string>();
  let match;

  while ((match = regex.exec(text)) !== null) {
    const raw = match[0];
    // Filter out common markdown links [text](url) or non-placeholders
    if (raw.length > 2 && raw.length < 80) {
      matches.add(raw);
    }
  }

  const items: PlaceholderItem[] = [];
  matches.forEach((token) => {
    let category = 'Details';
    const upper = token.toUpperCase();
    if (upper.includes('NAME') || upper.includes('PARTY') || upper.includes('EMPLOYEE') || upper.includes('CONTRACTOR') || upper.includes('TENANT')) {
      category = 'Parties & Names';
    } else if (upper.includes('DATE') || upper.includes('TERM') || upper.includes('YEAR') || upper.includes('MONTH') || upper.includes('DAY')) {
      category = 'Dates & Term';
    } else if (upper.includes('AMOUNT') || upper.includes('FEE') || upper.includes('RENT') || upper.includes('DOLLAR') || upper.includes('PRICE') || upper.includes('$')) {
      category = 'Financial & Fees';
    } else if (upper.includes('STATE') || upper.includes('JURISDICTION') || upper.includes('COUNTY') || upper.includes('CITY') || upper.includes('COUNTRY') || upper.includes('ADDRESS')) {
      category = 'Location & Jurisdiction';
    }

    items.push({
      placeholder: token,
      category,
      description: `Replace this placeholder with real legal information`,
    });
  });

  return items;
}

export function replacePlaceholderInText(
  fullText: string,
  placeholder: string,
  replacementValue: string
): string {
  if (!fullText || !placeholder) return fullText;
  // Escape special regex characters in the placeholder string
  const escaped = placeholder.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(escaped, 'g');
  return fullText.replace(regex, replacementValue);
}

export function replaceMultiplePlaceholders(
  fullText: string,
  replacements: Record<string, string>
): string {
  let updated = fullText;
  Object.entries(replacements).forEach(([ph, val]) => {
    if (val && val.trim() !== '') {
      updated = replacePlaceholderInText(updated, ph, val.trim());
    }
  });
  return updated;
}
