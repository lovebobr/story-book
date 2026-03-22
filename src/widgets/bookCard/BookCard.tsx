import React from "react";
import Button from "../button/Button";
import "./BookCard.css";
import placeholderImage from "../../assets/images/address-book.png";
import saveIcon from "../../assets/icons/save.svg";

interface BookCardProps {
  title: string;
  author: string;
  price: number;
  image?: string;
  onAddToCart?: () => void;
}

const BookCard: React.FC<BookCardProps> = ({
  title,
  author,
  price,
  image,
  onAddToCart,
}) => {
  const hasImage = !!image;

  return (
    <div className="BookCard">
      <div className="BookCard__image">
        {hasImage ? (
          <img src={image} alt={title} className="BookCard__image--cover" />
        ) : (
          <img
            src={placeholderImage}
            alt="Placeholder"
            className="BookCard__image--placeholder"
          />
        )}
      </div>
      <div className="BookCard__content">
        <div className="BookCard__top">
          <div className="BookCard__author">{author}</div>
          <h3 className="BookCard__title">«{title}»</h3>
        </div>
        <div className="BookCard__bottom">
          <div className="BookCard__price">{price} руб</div>
          <div className="BookCard__button">
            <Button
              size="small"
              variant="filled"
              leftIcon={<img src={saveIcon} alt="save" />}
              onClick={onAddToCart}
            >
              В корзину
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
