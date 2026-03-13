import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import type { IRegisterData } from "../model/IUser";
import { patches } from "../../../app/patches";
import "./AuthForms.css";

interface RegisterFormProps {
  onSubmit: (data: IRegisterData) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = observer(({ onSubmit }) => {
  const [formData, setFormData] = useState<IRegisterData>({
    email: "",
    password: "",
    name: "",
    surname: "",
    phone: "",
    question: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onSubmit(formData);
      navigate(patches.home.url());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(patches.login.url());
  };

  return (
    <form className="AuthForms" onSubmit={handleSubmit}>
      <h2 className="AuthForms__Title">Создать аккаунт</h2>
      <p className="AuthForms__Subtitle">Заполните форму для регистрации</p>

      {error && <div className="AuthForms__Error">{error}</div>}

      <div className="AuthForms__Row">
        <div className="AuthForms__Group">
          <label htmlFor="name">Имя</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Иван"
            disabled={loading}
            required
          />
        </div>

        <div className="AuthForms__Group">
          <label htmlFor="surname">Фамилия</label>
          <input
            id="surname"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Петров"
            disabled={loading}
            required
          />
        </div>
      </div>

      <div className="AuthForms__Group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="ivan.petrov@example.com"
          disabled={loading}
          required
        />
      </div>

      <div className="AuthForms__Group">
        <label htmlFor="phone">Телефон</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+7 (999) 123-45-67"
          disabled={loading}
          required
        />
      </div>

      <div className="AuthForms__Group">
        <label htmlFor="password">Пароль</label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Создайте пароль"
          disabled={loading}
          required
        />
      </div>

      <div className="AuthForms__Group">
        <label htmlFor="question">Контрольный вопрос</label>
        <select
          id="question"
          name="question"
          value={formData.question}
          onChange={handleChange}
          disabled={loading}
          required
        >
          <option value="">Выберите вопрос</option>
          <option value="Какой ваш любимый цвет?">
            Какой ваш любимый цвет?
          </option>
          <option value="Девичья фамилия матери?">
            Девичья фамилия матери?
          </option>
          <option value="Имя первого питомца?">Имя первого питомца?</option>
          <option value="Любимый фильм?">Любимый фильм?</option>
        </select>
      </div>

      <button type="submit" className="AuthForms__Button" disabled={loading}>
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>

      <div className="AuthForms__Footer">
        <p>
          Уже есть аккаунт?{" "}
          <a
            href="/login"
            className="AuthForms__LinkButton"
            onClick={handleLoginClick}
          >
            Войти
          </a>
        </p>
      </div>
    </form>
  );
});

export default RegisterForm;
