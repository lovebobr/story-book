import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookCard from "../../../widgets/bookCard/BookCard";
import { useAddToCartMutation, useGetBooks } from "../../../entities";
import type { IBook } from "../../../entities/book/model/types";
import { patches } from "../../../app/patches";
import { handleCartUnauthorized } from "../../../shared/lib/cartAuthError";
import {
  CATALOG_YEAR_RANGE_LABELS,
  filterCatalogBooks,
  type CatalogAppliedFilters,
  type CatalogYearRangeLabel,
} from "../lib/filterCatalogBooks";
import "./CatalogPage.css";

const GENRES = [
  "Детективы",
  "Романы",
  "Фантастика",
  "Фэнтези",
  "Повести",
  "Рассказы",
  "Наука",
] as const;

const PUBLISHERS = ["АСТ", "Эксмо", "Росмэн"] as const;

function createEmptySelection<T extends string>(keys: readonly T[]) {
  return keys.reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as Record<T, boolean>,
  );
}

function createYearSelection() {
  return createEmptySelection(CATALOG_YEAR_RANGE_LABELS);
}

function defaultFilters(): CatalogAppliedFilters {
  return {
    priceFrom: "",
    priceTo: "",
    genres: createEmptySelection(GENRES),
    publishers: createEmptySelection(PUBLISHERS),
    years: createYearSelection(),
  };
}

function digitsOnly(raw: string) {
  return raw.replace(/\D/g, "");
}

type SortKey = "popular" | "priceAsc" | "priceDesc";

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const getBooks = useGetBooks();
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [sortKey, setSortKey] = useState<SortKey>("popular");

  const [draft, setDraft] = useState<CatalogAppliedFilters>(() =>
    defaultFilters(),
  );
  const [applied, setApplied] = useState<CatalogAppliedFilters>(() =>
    defaultFilters(),
  );

  const toggleGenre = useCallback((label: (typeof GENRES)[number]) => {
    setDraft((d) => ({
      ...d,
      genres: { ...d.genres, [label]: !d.genres[label] },
    }));
  }, []);

  const togglePublisher = useCallback((label: (typeof PUBLISHERS)[number]) => {
    setDraft((d) => ({
      ...d,
      publishers: { ...d.publishers, [label]: !d.publishers[label] },
    }));
  }, []);

  const toggleYear = useCallback((label: CatalogYearRangeLabel) => {
    setDraft((d) => ({
      ...d,
      years: { ...d.years, [label]: !d.years[label] },
    }));
  }, []);

  const handleReset = () => {
    const initial = defaultFilters();
    setDraft(initial);
    setApplied(initial);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({ ...draft });
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [getBooks]);

  const filteredBooks = useMemo(
    () => filterCatalogBooks(books, applied),
    [books, applied],
  );

  const visibleBooks = useMemo(() => {
    const list = [...filteredBooks];
    if (sortKey === "priceAsc") {
      list.sort((a, b) => (a?.cost ?? 0) - (b?.cost ?? 0));
    } else if (sortKey === "priceDesc") {
      list.sort((a, b) => (b?.cost ?? 0) - (a?.cost ?? 0));
    }
    return list;
  }, [filteredBooks, sortKey]);

  const hasError = error != null;

  const addToCart = useAddToCartMutation();

  const handleAddToCart = (bookId: string) => {
    addToCart.mutate(
      { book_id: bookId, amount: 1 },
      {
        onError: (err) => {
          if (!handleCartUnauthorized(err, navigate, patches.login.route)) {
            console.error(err);
          }
        },
      },
    );
  };

  return (
    <div className="CatalogPage">
      <div className="CatalogPage__topbar">
        <div className="CatalogPage__found">
          {loading ? "Загрузка..." : `Найдено ${visibleBooks.length} книг`}
        </div>
        <div className="CatalogPage__sort">
          <select
            className="CatalogPage__sort-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            aria-label="Сортировка"
          >
            <option value="popular">По популярности</option>
            <option value="priceAsc">Сначала дешевле</option>
            <option value="priceDesc">Сначала дороже</option>
          </select>
        </div>
      </div>

      <div className="CatalogPage__layout">
        <aside className="CatalogPage__filters">
          <form className="CatalogPage__filters-form" onSubmit={handleApply}>
            <section className="CatalogPage__section">
              <h2 className="CatalogPage__section-title">Цена</h2>
              <div className="CatalogPage__price-row">
                <label className="CatalogPage__price-field">
                  <span className="CatalogPage__price-hint">от</span>
                  <input
                    className="CatalogPage__price-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-label="Минимальная цена в рублях"
                    value={draft.priceFrom}
                    onChange={(ev) =>
                      setDraft((d) => ({
                        ...d,
                        priceFrom: digitsOnly(ev.target.value),
                      }))
                    }
                  />
                  <span className="CatalogPage__price-hint">руб</span>
                </label>
                <label className="CatalogPage__price-field">
                  <span className="CatalogPage__price-hint">до</span>
                  <input
                    className="CatalogPage__price-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-label="Максимальная цена в рублях"
                    value={draft.priceTo}
                    onChange={(ev) =>
                      setDraft((d) => ({
                        ...d,
                        priceTo: digitsOnly(ev.target.value),
                      }))
                    }
                  />
                  <span className="CatalogPage__price-hint">руб</span>
                </label>
              </div>
            </section>

            <section className="CatalogPage__section">
              <h2 className="CatalogPage__section-title">Жанры</h2>
              <ul className="CatalogPage__options">
                {GENRES.map((label) => (
                  <li key={label}>
                    <label className="CatalogPage__option">
                      <input
                        className="CatalogPage__checkbox"
                        type="checkbox"
                        checked={draft.genres[label]}
                        onChange={() => toggleGenre(label)}
                      />
                      <span className="CatalogPage__option-text">{label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section className="CatalogPage__section">
              <h2 className="CatalogPage__section-title">Издательство</h2>
              <ul className="CatalogPage__options">
                {PUBLISHERS.map((label) => (
                  <li key={label}>
                    <label className="CatalogPage__option">
                      <input
                        className="CatalogPage__checkbox"
                        type="checkbox"
                        checked={draft.publishers[label]}
                        onChange={() => togglePublisher(label)}
                      />
                      <span className="CatalogPage__option-text">{label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <section className="CatalogPage__section">
              <h2 className="CatalogPage__section-title">Год издания</h2>
              <ul className="CatalogPage__options">
                {CATALOG_YEAR_RANGE_LABELS.map((label) => (
                  <li key={label}>
                    <label className="CatalogPage__option">
                      <input
                        className="CatalogPage__checkbox"
                        type="checkbox"
                        checked={draft.years[label]}
                        onChange={() => toggleYear(label)}
                      />
                      <span className="CatalogPage__option-text">{label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>

            <div className="CatalogPage__actions">
              <button className="CatalogPage__btn CatalogPage__btn--primary" type="submit">
                Применить
              </button>
              <button
                className="CatalogPage__btn CatalogPage__btn--secondary"
                type="button"
                onClick={handleReset}
              >
                Сбросить
              </button>
            </div>
          </form>
        </aside>

        <main className="CatalogPage__main" aria-label="Каталог книг">
          {hasError && (
            <div className="CatalogPage__error">
              Не удалось загрузить книги. Попробуйте обновить страницу.
            </div>
          )}

          <div className="CatalogPage__grid" aria-label="Список книг">
            {visibleBooks.map((book) => (
              <div className="CatalogPage__grid-item" key={book.id}>
                <BookCard
                  title={book.title}
                  author={book.author}
                  price={book.cost}
                  image={book.image}
                  onAddToCart={() => handleAddToCart(book.id)}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CatalogPage;
