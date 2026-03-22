import React from "react";
import "./Features.css";

import deliveryIcon from "../../assets/icons/del.svg";
import discountIcon from "../../assets/icons/discount.svg";
import paymentIcon from "../../assets/icons/lock.svg";
import favoriteIcon from "../../assets/icons/leaky heart.svg";

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const featuresData: FeatureItem[] = [
  {
    id: 1,
    title: "Быстрая доставка",
    description: "Курьером или в пункт выдачи",
    icon: deliveryIcon,
  },
  {
    id: 2,
    title: "Скидки до 30%",
    description: "Постоянные акции и промокоды",
    icon: discountIcon,
  },
  {
    id: 3,
    title: "Безопасная оплата",
    description: "Надежное шифрование данных",
    icon: paymentIcon,
  },
  {
    id: 4,
    title: "Избранное",
    description: "Рекомендации под ваш вкус",
    icon: favoriteIcon,
  },
];

const Features: React.FC = () => {
  return (
    <section className="Features">
      <div className="Features__grid">
        {featuresData.map((feature) => (
          <div key={feature.id} className="Features__card">
            <div className="Features__icon">
              <img src={feature.icon} alt={feature.title} />
            </div>
            <h3 className="Features__title">{feature.title}</h3>
            <p className="Features__description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
