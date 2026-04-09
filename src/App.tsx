import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, type FC, type JSX } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
import FavoritesPage from "./pages/favorites/ui/FavoritesPage"; // добавлен импорт
import CatalogPage from "./pages/catalog/ui/CatalogPage"; // добавлен импорт
import { CartUiProvider } from "./features/cart/CartUiContext";
import Footer from "./widgets/footer/Footer";
import "./App.css"; // дубликат удалён

const queryClient = new QueryClient();

const ProtectedRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const { store } = useContext(Context);
  if (!store.isAuth) {
    return <Navigate to={patches.login.route} replace />;
  }
  return children;
};

const PublicRoute: FC<{ children: JSX.Element }> = ({ children }) => {
  const { store } = useContext(Context);
  if (store.isAuth) {
    return <Navigate to={patches.home.route} replace />;
  }
  return children;
};

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

const App: FC = () => {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem("refreshToken")) {
      store.checkAuth();
    } else {
      store.setLoading(false);
    }
  }, []);

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

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartUiProvider>
          <Routes>
            <Route
              path={patches.login.route}
              element={
                <PublicRoute>
                  <div className="app">
                    <div className="auth-container">
                      <div className="auth-card">
                        <LoginForm onSubmit={handleLogin} />
                      </div>
                    </div>
                  </div>
                </PublicRoute>
              }
            />
            <Route
              path={patches.signup.route}
              element={
                <PublicRoute>
                  <div className="app">
                    <div className="auth-container">
                      <div className="auth-card">
                        <RegisterForm onSubmit={handleSignup} />
                      </div>
                    </div>
                  </div>
                </PublicRoute>
              }
            />
            <Route
              path={patches.home.route}
              element={
                <MainLayout>
                  <HomePage />
                </MainLayout>
              }
            />
            <Route
              path={patches.profile.route}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProfilePage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={patches.book.route}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <BookPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={patches.favorites.route}
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <FavoritesPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={patches.catalog.route}
              element={
                <MainLayout>
                  <CatalogPage />
                </MainLayout>
              }
            />

            <Route
              path="*"
              element={<Navigate to={patches.home.route} replace />}
            />
          </Routes>
        </CartUiProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default observer(App);
