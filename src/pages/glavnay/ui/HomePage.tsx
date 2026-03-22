import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../../widgets/banner/Banner";
import Button from "../../../widgets/button/Button";
import BookCard from "../../../widgets/bookCard/BookCard";
import { useGetBooks } from "../../../entities";
import Features from "../../../widgets/features/Features";
import recommendationsIcon from "../../../assets/icons/books.svg";
import arrowRightIcon from "../../../assets/icons/Arrow.svg";
import "./HomePage.css";

const genres = ["Детективы", "Романы", "Фантастика", "Фэнтези", "Наука"];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const getBooks = useGetBooks();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
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

  const handleBannerClick = () => {
    navigate("/catalog");
  };

  const handleRecommendationsClick = () => {
    navigate("/recommendations");
  };

  const handleAddToCart = (bookId: string) => {
    console.log("Добавлено в корзину:", bookId);
  };

  return (
    <div className="HomePage">
      <Banner onButtonClick={handleBannerClick} />

      <div className="HomePage__content">
        <h1>Популярные жанры</h1>
        <div className="genres-row">
          {genres.map((genre, index) => (
            <Button
              key={index}
              size="medium"
              variant="outline"
              className="genre-button"
            >
              {genre}
            </Button>
          ))}
        </div>
        <h1>Новинки месяца</h1>
        {loading && <div>Загрузка...</div>}
        <div className="HomePage__carousel">
          {books.map((book) => (
            <div className="HomePage__carousel-item" key={book.id}>
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
              />
            </div>
          ))}
        </div>
        <Features />
        <div className="HomePage__recommendations-block">
          <div className="HomePage__recommendations-icon">
            <img src={recommendationsIcon} alt="Рекомендации" />
          </div>
          <div className="HomePage__Text">
            <h2 className="HomePage__recommendations-title">
              Рекомендации для вас
            </h2>
            <p className="HomePage__recommendations-description">
              Основаны на ваших просмотренных и избранных книгах
            </p>
          </div>
          <Button
            size="medium"
            variant="filled"
            rightIcon={<img src={arrowRightIcon} alt="→" />}
            onClick={handleRecommendationsClick}
          >
            Посмотреть
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
