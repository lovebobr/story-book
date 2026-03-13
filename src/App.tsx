import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, type FC } from "react";
import { Context } from ".";
import LoginForm from "./features/auth/ui/LoginForm";
import RegisterForm from "./features/auth/ui/RegisterForm";
import { observer } from "mobx-react-lite";
import type { ILoginData, IRegisterData } from "./features/auth/model/IUser";
import { patches } from "./app/patches";
import Header from "./widgets/header/Header";
import HomePage from "./pages/glavnay/ui/HomePage";
import ProfilePage from "./pages/profile/ui/ProfilePage";
import BookPage from "./pages/book/ui/BookPage";
import "./App.css";

const App: FC = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem("refreshToken")) {
        await store.checkAuth();
      }
    };
    checkAuth();
  }, [store]);

  const handleLogin = async (data: ILoginData) => {
    await store.login(data.email, data.password);
  };

  const handleSignup = async (data: IRegisterData) => {
    await store.registration(
      data.email,
      data.password,
      data.name,
      data.surname,
      data.phone,
      data.question,
    );
  };

  if (store.isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!store.isAuth) {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path={patches.login.route}
            element={
              <div className="app">
                <div className="auth-container">
                  <div className="auth-card">
                    <LoginForm onSubmit={handleLogin} />
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path={patches.signup.route}
            element={
              <div className="app">
                <div className="auth-container">
                  <div className="auth-card">
                    <RegisterForm onSubmit={handleSignup} />
                  </div>
                </div>
              </div>
            }
          />
          <Route
            path="*"
            element={<Navigate to={patches.login.route} replace />}
          />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={patches.home.route} element={<HomePage />} />
        <Route path={patches.profile.route} element={<ProfilePage />} />
        <Route path={patches.book.route} element={<BookPage />} />
        <Route
          path="*"
          element={<Navigate to={patches.home.route} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default observer(App);
