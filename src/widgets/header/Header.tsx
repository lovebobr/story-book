import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { patches } from "../../app/patches";
import "./Header.css";

import acc from "../../assets/icons/acc.svg";
import cart from "../../assets/icons/cart.svg";
import favorites from "../../assets/icons/favorites.svg";
import order from "../../assets/icons/order.svg";
import search from "../../assets/icons/search.svg";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onTabClick?: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onTabClick }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("account");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleTabClick = (tab: string, path: string) => {
    setActiveTab(tab);
    if (onTabClick) {
      onTabClick(tab);
    }
    navigate(path);
  };

  const tabs = [
    {
      id: "account",
      icon: acc,
      label: "Аккаунт",
      path: patches.profile.url(),
    },
    {
      id: "favorites",
      icon: favorites,
      label: "Избранное",
      path: "/favorites",
    },
    { id: "cart", icon: cart, label: "Корзина", path: "/cart" },
    { id: "order", icon: order, label: "Заказы", path: "/order" },
  ];

  return (
    <div className="Header__Full">
      <header className="Header">
        <div className="Header__container">
          <div
            className="Header__logo"
            onClick={() => navigate(patches.home.url())}
          >
            Story Book
          </div>

          <form className="Header__search" onSubmit={handleSearch}>
            <input
              type="text"
              className="Header__search-input"
              placeholder="Я ищу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="Header__search-button">
              <img src={search} alt="Поиск" className="Header__search-icon" />
            </button>
          </form>

          <nav className="Header__nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={"Header__tab"}
                onClick={() => handleTabClick(tab.id, tab.path)}
              >
                <img
                  src={tab.icon}
                  alt={tab.label}
                  className="Header__tab-icon"
                />
                <span className="Header__tab-label">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
