import React from "react";
import "./Banner.css";

import BannerImage from "../../assets/images/book.png";

interface BannerProps {
  onButtonClick?: () => void;
}

const Banner: React.FC<BannerProps> = ({ onButtonClick }) => {
  return (
    <div className="Banner">
      <div className="Banner__content">
        <div className="Banner__text">
          <h1 className="Banner__title">
            Книжная
            <br />
            весна
          </h1>
          <p className="Banner__discount">до -30%</p>
          <p className="Banner__description">
            Скидки на тысячи книг: бестселлеры, новинки, подарки. Успейте
            выбрать!
          </p>
          <button className="Banner__button" onClick={onButtonClick}>
            Смотреть новинки
          </button>
        </div>
        <div className="Banner__image">
          <img src={BannerImage} alt="Книжная весна" />
        </div>
      </div>
    </div>
  );
};

export default Banner;
