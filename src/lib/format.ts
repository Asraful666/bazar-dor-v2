const numberFormatter = new Intl.NumberFormat("bn-BD", {
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat("bn-BD", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const units: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatPercent(value: number): string {
  return percentFormatter.format(Math.abs(value));
}

export function formatUnit(unit: string): string {
  return `প্রতি ${units[unit] || unit}`;
}

// বাংলা বা ইংরেজি সংখ্যাকে numeric value-তে পরিবর্তন করে।
export function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== "string" || !value.trim()) {
    throw new Error("Invalid numeric value");
  }

  const normalized = value
    .trim()
    .replace(/[০-৯]/g, (digit) =>
      String("০১২৩৪৫৬৭৮৯".indexOf(digit))
    )
    .replace(/[,٬\s]/g, "");

  const number = Number(normalized);

  if (!Number.isFinite(number)) {
    throw new Error("Invalid numeric value");
  }

  return number;
}