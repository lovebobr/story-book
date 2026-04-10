import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import CartDrawer from "../../widgets/cartDrawer/CartDrawer";
import { useAuth } from "../../entities/user/hook/useAuth";

interface CartUiContextValue {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartUiContext = createContext<CartUiContextValue | null>(null);

export function CartUiProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const value = useMemo(
    () => ({ isOpen, openCart, closeCart, toggleCart }),
    [isOpen, openCart, closeCart, toggleCart],
  );
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  return (
    <CartUiContext.Provider value={value}>
      {children}
      {isAuthenticated && <CartDrawer isOpen={isOpen} onClose={closeCart} />}
    </CartUiContext.Provider>
  );
}

export function useCartUi() {
  const ctx = useContext(CartUiContext);
  if (!ctx) {
    throw new Error("useCartUi must be used within CartUiProvider");
  }
  return ctx;
}
