import { renderRoutes } from "react-router-config";
import { patches } from "./patches";

import HomePage from "../pages/glavnay/ui/HomePage";
import ProfilePage from "../pages/profile/ui/ProfilePage";
import BookPage from "../pages/book/ui/BookPage";
import FavoritesPage from "../pages/favorites/ui/FavoritesPage";

export default () => {
  return renderRoutes([
    {
      exact: true,
      path: patches.home.route,
      component: HomePage,
    },
    {
      exact: true,
      path: patches.profile.route,
      component: ProfilePage,
    },
    {
      exact: true,
      path: patches.book.route,
      component: BookPage,
    },
    {
      exact: true,
      path: patches.favorites.route,
      component: FavoritesPage,
    },
  ]);
};
