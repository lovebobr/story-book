import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import type { IBook } from "../../entities/book/model/types";
import { patches } from "../../app/patches";
import { handleCartUnauthorized } from "../../shared/lib/cartAuthError";
import {
  cartTotals,
  useCartBooks,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "../../entities/cart/lib/useCartMutations";
import cartIcon from "../../assets/icons/cart.svg";
import placeholderImage from "../../assets/images/address-book.png";
import arrowRightIcon from "../../assets/icons/Arrow.svg";
import "./CartDrawer.css";
console.log("CartDrawer file evaluated");
function formatRub(n: number) {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function unitPrices(book: IBook) {
  const after = book.cost;
  if (book.discount > 0 && book.discount < 100) {
    const before = Math.round(after / (1 - book.discount / 100));
    return { unitAfter: after, unitBefore: before };
  }
  return { unitAfter: after, unitBefore: after };
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { data: books = [], isLoading, isError, refetch } = useCartBooks();
  const updateItem = useUpdateCartItemMutation();
  const removeItem = useRemoveCartItemMutation();
  console.log(books, "hghghg");
  const cartQuery = useCartBooks();
  console.log("cartQuery state:", {
    data: cartQuery.data,
    isLoading: cartQuery.isLoading,
    isError: cartQuery.isError,
    error: cartQuery.error,
  });
  const onCartMutationError = useCallback(
    (err: unknown) => {
      if (handleCartUnauthorized(err, navigate, patches.login.route)) return;
      console.error(err);
    },
    [navigate],
  );

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lineCount = books?.length;
  const { pieces, sumAfter, sumBefore, discountSum } = cartTotals(books);

  const handleQty = (book: IBook, next: number) => {
    if (next <= 0) {
      removeItem.mutate(book.id, { onError: onCartMutationError });
      return;
    }
    updateItem.mutate(
      { bookId: book.id, amount: next },
      { onError: onCartMutationError },
    );
  };

  const node = (
    <div
      className="CartDrawer__root"
      role="dialog"
      aria-modal="true"
      aria-label="Корзина"
    >
      <button
        type="button"
        className="CartDrawer__overlay"
        onClick={onClose}
        aria-label="Закрыть корзину"
      />
      <aside className="CartDrawer__panel" onClick={(e) => e.stopPropagation()}>
        <header className="CartDrawer__header">
          <div className="CartDrawer__header-title">
            <img src={cartIcon} alt="" className="CartDrawer__header-icon" />
            <span>Корзина ({lineCount})</span>
          </div>
        </header>

        <div className="CartDrawer__list-wrap">
          {isLoading && <div className="CartDrawer__hint">Загрузка...</div>}
          {isError && !isLoading && (
            <div className="CartDrawer__hint CartDrawer__hint--error">
              Не удалось загрузить корзину.
            </div>
          )}
          {!isLoading && !isError && books.length === 0 && (
            <div className="CartDrawer__hint">Корзина пуста</div>
          )}
          <ul className="CartDrawer__list">
            {books.map((book) => (
              <CartLine
                key={book.id}
                book={book}
                onChangeQty={handleQty}
                disabled={updateItem.isPending || removeItem.isPending}
              />
            ))}
          </ul>
        </div>

        <div className="CartDrawer__summary">
          <div className="CartDrawer__summary-rows">
            <div className="CartDrawer__row">
              <span>Товары ({pieces} шт)</span>
              <span>{formatRub(sumBefore)} р</span>
            </div>
            <div className="CartDrawer__row CartDrawer__row--discount">
              <span>Скидка</span>
              <span>
                {discountSum > 0 ? `−${formatRub(discountSum)} р` : "0 р"}
              </span>
            </div>
            <div className="CartDrawer__row">
              <span>Доставка</span>
              <span className="CartDrawer__delivery">бесплатно</span>
            </div>
          </div>

          <div className="CartDrawer__total-row">
            <span>Итого</span>
            <span className="CartDrawer__total-sum">
              {formatRub(sumAfter)} р
            </span>
          </div>

          <div className="CartDrawer__bonus-card">
            <div className="CartDrawer__bonus-icon" aria-hidden>
              <span className="CartDrawer__coin-stack" />
            </div>
            <div className="CartDrawer__bonus-text">
              <span className="CartDrawer__bonus-line">
                950 бонусов доступно
              </span>
            </div>
            <span className="CartDrawer__bonus-badge">
              + 91 бонус за покупку
            </span>
          </div>

          <button type="button" className="CartDrawer__checkout">
            <span>Оформить заказ</span>
            <img
              src={arrowRightIcon}
              alt=""
              className="CartDrawer__checkout-arrow"
            />
          </button>
        </div>
      </aside>
    </div>
  );

  return createPortal(node, document.body);
};

function CartLine({
  book,
  onChangeQty,
  disabled,
}: {
  book: IBook;
  onChangeQty: (book: IBook, next: number) => void;
  disabled: boolean;
}) {
  const { unitAfter, unitBefore } = unitPrices(book);
  const lineTotal = unitAfter * book.amount;
  const hasDiscount = book.discount > 0 && unitBefore > unitAfter;

  return (
    <li className="CartDrawer__item">
      <div className="CartDrawer__item-inner">
        <div className="CartDrawer__cover">
          {book.image ? (
            <img src={book.image} alt="" className="CartDrawer__cover-img" />
          ) : (
            <img
              src={placeholderImage}
              alt=""
              className="CartDrawer__cover-placeholder"
            />
          )}
        </div>
        <div className="CartDrawer__item-body">
          <div className="CartDrawer__item-title">{book.title}</div>
          <div className="CartDrawer__item-author">{book.author}</div>
          <div className="CartDrawer__item-prices">
            <span className="CartDrawer__price-now">
              {formatRub(unitAfter)} р
            </span>
            {hasDiscount && (
              <>
                <span className="CartDrawer__price-was">
                  {formatRub(unitBefore)} р
                </span>
                <span className="CartDrawer__discount-badge">
                  −{Math.round(book.discount)}%
                </span>
              </>
            )}
          </div>
          <div className="CartDrawer__item-controls">
            <div className="CartDrawer__qty">
              <button
                type="button"
                className="CartDrawer__qty-btn"
                disabled={disabled}
                onClick={() => onChangeQty(book, book.amount - 1)}
                aria-label="Уменьшить количество"
              >
                −
              </button>
              <span className="CartDrawer__qty-value">{book.amount}</span>
              <button
                type="button"
                className="CartDrawer__qty-btn"
                disabled={disabled}
                onClick={() => onChangeQty(book, book.amount + 1)}
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>
            <span className="CartDrawer__line-total">
              {formatRub(lineTotal)} р
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}

export default CartDrawer;
