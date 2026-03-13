import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import type { ILoginData } from "../model/IUser";
import { patches } from "../../../app/patches";
import "./AuthForms.css";

interface LoginFormProps {
  onSubmit: (data: ILoginData) => Promise<void>;
}

const LoginForm: React.FC<LoginFormProps> = observer(({ onSubmit }) => {
  const [formData, setFormData] = useState<ILoginData>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(patches.signup.url());
  };

  return (
    <form className="AuthForms" onSubmit={handleSubmit}>
      <h2 className="AuthForms__Title">Добро пожаловать!</h2>
      <p className="AuthForms__Subtitle">Войдите в свой аккаунт</p>

      {error && <div className="AuthForms__Error">{error}</div>}

      <div className="AuthForms__Group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
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
          placeholder="********"
          disabled={loading}
          required
        />
      </div>

      <button type="submit" className="AuthForms__Button" disabled={loading}>
        {loading ? "Вход..." : "Войти"}
      </button>

      <div className="AuthForms__Footer">
        <p>
          Нет аккаунта?{" "}
          <a
            href="/signup"
            className="AuthForms__LinkButton"
            onClick={handleSignupClick}
          >
            Зарегистрироваться
          </a>
        </p>
      </div>
    </form>
  );
});

export default LoginForm;
