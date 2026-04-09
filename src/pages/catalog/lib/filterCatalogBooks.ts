import type { IBook } from "../../../entities/book/model/types";

export const CATALOG_YEAR_RANGE_LABELS = [
  "2025 - 2026",
  "2020 - 2024",
  "2010 - 2019",
  "2000 - 2009",
  "До 2000",
] as const;

export type CatalogYearRangeLabel = (typeof CATALOG_YEAR_RANGE_LABELS)[number];

function norm(s: string) {
  return s.trim().toLowerCase();
}

function yearInRange(year: number, label: CatalogYearRangeLabel): boolean {
  switch (label) {
    case "2025 - 2026":
      return year >= 2025 && year <= 2026;
    case "2020 - 2024":
      return year >= 2020 && year <= 2024;
    case "2010 - 2019":
      return year >= 2010 && year <= 2019;
    case "2000 - 2009":
      return year >= 2000 && year <= 2009;
    case "До 2000":
      return year < 2000;
    default:
      return false;
  }
}

export interface CatalogAppliedFilters {
  priceFrom: string;
  priceTo: string;
  genres: Record<string, boolean>;
  publishers: Record<string, boolean>;
  years: Record<CatalogYearRangeLabel, boolean>;
}

function parsePriceBound(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function filterCatalogBooks(
  books: IBook[],
  applied: CatalogAppliedFilters,
): IBook[] {
  let min = parsePriceBound(applied.priceFrom);
  let max = parsePriceBound(applied.priceTo);
  if (min != null && max != null && min > max) {
    [min, max] = [max, min];
  }

  const genreKeys = Object.entries(applied.genres)
    .filter(([, v]) => v)
    .map(([k]) => norm(k));
  const publisherKeys = Object.entries(applied.publishers)
    .filter(([, v]) => v)
    .map(([k]) => norm(k));
  const yearKeys = (Object.entries(applied.years) as [CatalogYearRangeLabel, boolean][])
    .filter(([, v]) => v)
    .map(([k]) => k);

  return books.filter((book) => {
    const cost = book.cost ?? 0;
    if (min != null && cost < min) return false;
    if (max != null && cost > max) return false;

    if (genreKeys.length > 0) {
      const bookGenres = (book.genres ?? []).map((g) => norm(g.genre));
      const match = genreKeys.some((g) => bookGenres.includes(g));
      if (!match) return false;
    }

    if (publisherKeys.length > 0) {
      const pub = norm(book.publisher ?? "");
      if (!publisherKeys.includes(pub)) return false;
    }

    if (yearKeys.length > 0) {
      const y = book.year;
      if (!Number.isFinite(y)) return false;
      const match = yearKeys.some((label) => yearInRange(y, label));
      if (!match) return false;
    }

    return true;
  });
}
