import React from "react";
import "./Footer.css";
import phoneIcon from "../../assets/icons/telephone.svg";
import emailIcon from "../../assets/icons/dog.svg";
import calendarIcon from "../../assets/icons/calendar.svg";
import whatIcon from "../../assets/icons/whatsapp.svg";
import youtubeIcon from "../../assets/icons/youtube.svg";

const Footer: React.FC = () => {
  return (
    <footer className="Footer">
      <div className="Footer__container">
        <div className="Footer__brand">
          <div className="Footer__logo">STORY BOOK</div>
          <p className="Footer__description">
            Уютный онлайн-магазин книг и сопутствующих товаров. Более 10000 книг
            в каталоге. Быстрая доставка и забота о каждом читателе.
          </p>
          <div className="Footer__social-icons">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="Footer__social-link"
            >
              <img src={whatIcon} alt="WhatsApp" />
            </a>
            <a
              href="https://mail.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="Footer__social-link"
            >
              <img src={emailIcon} alt="Email" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="Footer__social-link"
            >
              <img src={youtubeIcon} alt="YouTube" />
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="Footer__social-link"
            >
              <img src={phoneIcon} alt="phone" />
            </a>
          </div>
        </div>

        <div className="Footer__column">
          <h3 className="Footer__column-title">Книголюбу</h3>
          <ul className="Footer__links">
            <li>
              <a href="/catalog">Каталог книг</a>
            </li>
            <li>
              <a href="/authors">Авторы</a>
            </li>
            <li>
              <a href="/genres">Жанры</a>
            </li>
            <li>
              <a href="/new">Новинки</a>
            </li>
            <li>
              <a href="/discounts">Скидки и промокоды</a>
            </li>
            <li>
              <a href="/certificates">Подарочные сертификаты</a>
            </li>
          </ul>
        </div>

        <div className="Footer__column">
          <h3 className="Footer__column-title">Помощь</h3>
          <ul className="Footer__links">
            <li>
              <a href="/how-to-order">Как сделать заказ?</a>
            </li>
            <li>
              <a href="/delivery">Доставка и оплата</a>
            </li>
            <li>
              <a href="/returns">Возврат товара</a>
            </li>
            <li>
              <a href="/faq">Часто задаваемые вопросы</a>
            </li>
            <li>
              <a href="/loyalty">Программа лояльности</a>
            </li>
          </ul>
        </div>

        <div className="Footer__column">
          <h3 className="Footer__column-title">Контакты</h3>
          <ul className="Footer__contacts">
            <li className="Footer__contact-item">
              <span className="Footer__contact-icon">
                <img src={phoneIcon} alt="Телефон" />
              </span>
              <span>8 (937) 123-45-67</span>
            </li>
            <li className="Footer__contact-item">
              <span className="Footer__contact-icon">
                <img src={emailIcon} alt="Email" />
              </span>
              <span>k.naumova2004@inbox.ru</span>
            </li>
            <li className="Footer__contact-item">
              <span className="Footer__contact-icon">
                <img src={calendarIcon} alt="Режим работы" />
              </span>
              <span>Ежедневно 9:00-21:00</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
