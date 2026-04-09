import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBookById, useGetBooks } from "../../../entities";
import Button from "../../../widgets/button/Button";
import placeholderImage from "../../../assets/images/address-book.png";
import saveIcon from "../../../assets/icons/save.svg";
import "./BookPage.css";
import BookCard from "../../../widgets/bookCard/BookCard";
import { InteractiveRating } from "../../../widgets/features/rateBook/ui/InteractiveRating/InteractiveRating";
import { useAuth } from "../../../entities/user/hook/useAuth";

const BookPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: book,
    isLoading,
    error,
    refetch: refetchBook,
  } = useGetBookById(id);
  const getBooks = useGetBooks();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const userRating = book?.rating || 0;

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [getBooks]);

  const handleAddToCart = (bookId: string) => {
    console.log("Добавлено в корзину:", bookId);
  };

  const handleRateSuccess = (newRating: number) => {
    refetchBook();
  };

  if (isLoading) return <div className="BookPage__loading">Загрузка...</div>;
  if (error)
    return <div className="BookPage__error">Ошибка загрузки книги</div>;
  if (!book) return <div className="BookPage__not-found">Книга не найдена</div>;

  const genreString = book.genres?.map((g) => g.genre).join(", ") || "—";
  const inStock = book.amount > 0;

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="BookPage__info-row">
      <span className="BookPage__info-label">{label}:</span>
      <span className="BookPage__info-value">{value}</span>
    </div>
  );

  return (
    <div className="BookPage">
      <div className="BookPage__container">
        <div className="BookPage__con">
          <div className="BookPage__cover">
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                className="BookPage__cover-img"
              />
            ) : (
              <img
                src={placeholderImage}
                alt="Placeholder"
                className="BookPage__cover-placeholder"
              />
            )}
          </div>

          <div className="BookPage__info">
            <div className="BookPage__title">{book.title}</div>
            <div className="BookPage_column">
              <div>
                <InfoRow label="Автор" value={book.author} />
                <InfoRow label="Жанр" value={genreString} />
              </div>
              <div>
                <InfoRow label="Издательство" value={book.publisher} />
                <InfoRow label="Год" value={book.year.toString()} />
              </div>
            </div>
            {isAuthenticated && (
              <div className="BookPage__rating-stock">
                <div className="BookPage__rating">
                  <InteractiveRating
                    bookId={book.id}
                    initialRating={userRating}
                    onRateSuccess={handleRateSuccess}
                  />
                </div>
                <span className="BookPage__rating" style={{ marginLeft: 8 }}>
                  ({book.rating?.toFixed(1)})
                </span>
                <span
                  className={`BookPage__stock ${inStock ? "BookPage__stock--in" : "BookPage__stock--out"}`}
                >
                  {inStock ? "В наличии" : "Нет в наличии"}
                </span>
              </div>
            )}

            <div className="BookPage__price">
              {book.cost} <span className="BookPage__price-currency">₽</span>
              <div className="BookPage__actions">
                <Button
                  size="large"
                  variant="filled"
                  leftIcon={<img src={saveIcon} alt="save" />}
                  onClick={() => handleAddToCart(book.id)}
                  disabled={!inStock}
                >
                  В корзину
                </Button>
              </div>
            </div>
          </div>
        </div>
        {book.description && (
          <div className="BookPage__description">
            <div className="BookPage__description__title">Описание</div>
            <p>{book.description}</p>
          </div>
        )}
      </div>
      <h1>Популярные жанры</h1>
      <div className="HomePage__carousel">
        {books.map((book) => (
          <div className="HomePage__carousel-item" key={book.id}>
            <BookCard
              title={book.title}
              author={book.author}
              price={book.cost}
              image={book.image}
              onAddToCart={() => handleAddToCart(book.id)}
              onCardClick={() => navigate(`/book/${book.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookPage;
