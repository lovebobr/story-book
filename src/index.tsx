import { createContext } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Store from "./features/auth/model/store.ts";

interface State {
  store: Store;
}

export const store = new Store();

export const Context = createContext<State>({
  store,
});

createRoot(document.getElementById("root")!).render(
  <Context.Provider
    value={{
      store,
    }}
  >
    <App />
  </Context.Provider>,
);
