import React from "react";
import styles from "./Button.module.css";

export type ButtonSize = "small" | "medium" | "large";
export type ButtonVariant = "outline" | "filled";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  size = "medium",
  variant = "filled",
  children,
  leftIcon,
  rightIcon,
  className = "",
  loading = false,
  disabled,
  ...rest
}) => {
  const stylesTyped = styles as Record<string, string>;
  const sizeClass = stylesTyped[`size-${size}`];
  const variantClass = stylesTyped[`variant-${variant}`];

  return (
    <button
      className={`
        ${stylesTyped.button}
        ${sizeClass}
        ${variantClass}
        ${loading ? stylesTyped.loading : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className={stylesTyped.loader} />}
      <span className={stylesTyped.content}>
        {leftIcon && <span className={stylesTyped.iconLeft}>{leftIcon}</span>}
        <span className={stylesTyped.text}>{children}</span>
        {rightIcon && (
          <span className={stylesTyped.iconRight}>{rightIcon}</span>
        )}
      </span>
    </button>
  );
};

export default Button;
