import React, { useCallback, useEffect, useMemo, useState } from "react";
import BookCard from "../../../widgets/bookCard/BookCard";
import { useGetBooks } from "../../../entities";
import "./CatalogPage.css";

const CATEGORIES = [
  "Художественная литература",
  "Учебная литература",
  "Книги для детей",
  "Книги для подростков",
  "Комиксы и манга",
  "Книги на иностранных языках",
  "Профессиональная литература",
  "Нехудожественная литература",
] as const;

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

const YEARS = [
  "2025 - 2026",
  "2020 - 2024",
  "2010 - 2019",
  "2000 - 2009",
  "До 2000",
] as const;

function createEmptySelection<T extends string>(keys: readonly T[]) {
  return keys.reduce(
    (acc, key) => {
      acc[key] = false;
      return acc;
    },
    {} as Record<T, boolean>,
  );
}

function digitsOnly(raw: string) {
  return raw.replace(/\D/g, "");
}

type SortKey = "popular" | "priceAsc" | "priceDesc";

const CatalogPage: React.FC = () => {
  const getBooks = useGetBooks();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [sortKey, setSortKey] = useState<SortKey>("popular");

  const [priceFrom, setPriceFrom] = useState("300");
  const [priceTo, setPriceTo] = useState("5400");
  const [categories, setCategories] = useState(() =>
    createEmptySelection(CATEGORIES),
  );
  const [genres, setGenres] = useState(() => createEmptySelection(GENRES));
  const [publishers, setPublishers] = useState(() =>
    createEmptySelection(PUBLISHERS),
  );
  const [years, setYears] = useState(() => createEmptySelection(YEARS));

  const toggle = useCallback(
    <T extends string>(
      setter: React.Dispatch<React.SetStateAction<Record<T, boolean>>>,
      key: T,
    ) => {
      setter((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const handleReset = () => {
    setPriceFrom("300");
    setPriceTo("5400");
    setCategories(createEmptySelection(CATEGORIES));
    setGenres(createEmptySelection(GENRES));
    setPublishers(createEmptySelection(PUBLISHERS));
    setYears(createEmptySelection(YEARS));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
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

  const visibleBooks = useMemo(() => {
    const list = [...books];
    if (sortKey === "priceAsc") {
      list.sort((a, b) => (a?.cost ?? 0) - (b?.cost ?? 0));
    } else if (sortKey === "priceDesc") {
      list.sort((a, b) => (b?.cost ?? 0) - (a?.cost ?? 0));
    }
    return list;
  }, [books, sortKey]);

  const hasError = error != null;

  const handleAddToCart = (bookId: string) => {
    console.log("Добавлено в корзину:", bookId);
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
                    value={priceFrom}
                    onChange={(ev) => setPriceFrom(digitsOnly(ev.target.value))}
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
                    value={priceTo}
                    onChange={(ev) => setPriceTo(digitsOnly(ev.target.value))}
                  />
                  <span className="CatalogPage__price-hint">руб</span>
                </label>
              </div>
            </section>

            <section className="CatalogPage__section">
              <h2 className="CatalogPage__section-title">Категория</h2>
              <ul className="CatalogPage__options">
                {CATEGORIES.map((label) => (
                  <li key={label}>
                    <label className="CatalogPage__option">
                      <input
                        className="CatalogPage__checkbox"
                        type="checkbox"
                        checked={categories[label]}
                        onChange={() => toggle(setCategories, label)}
                      />
                      <span className="CatalogPage__option-text">{label}</span>
                    </label>
                  </li>
                ))}
              </ul>
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
                        checked={genres[label]}
                        onChange={() => toggle(setGenres, label)}
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
                        checked={publishers[label]}
                        onChange={() => toggle(setPublishers, label)}
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
                {YEARS.map((label) => (
                  <li key={label}>
                    <label className="CatalogPage__option">
                      <input
                        className="CatalogPage__checkbox"
                        type="checkbox"
                        checked={years[label]}
                        onChange={() => toggle(setYears, label)}
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
