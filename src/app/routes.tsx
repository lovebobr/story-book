import { renderRoutes } from "react-router-config";
import { patches } from "./patches";

import HomePage from "../pages/glavnay/ui/HomePage";
import ProfilePage from "../pages/profile/ui/ProfilePage";
import BookPage from "../pages/book/ui/BookPage";
import CatalogPage from "../pages/catalog/ui/CatalogPage";

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
      path: patches.catalog.route,
      component: CatalogPage,
    },
  ]);
};
