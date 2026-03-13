import React from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../../../widgets/banner/Banner";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleBannerClick = () => {
    navigate("/catalog");
  };

  return (
    <div className="HomePage">
      <Banner onButtonClick={handleBannerClick} />
    </div>
  );
};

export default HomePage;
