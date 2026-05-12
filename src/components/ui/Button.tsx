import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-purple-500 text-white hover:bg-purple-400 shadow-lg shadow-purple-500/20 active:scale-[0.99] hover:scale-[1.01]",
  secondary:
    "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 active:scale-[0.99]",
  ghost:
    "bg-transparent text-zinc-200 hover:bg-zinc-800/80 active:scale-[0.99]",
  danger: "bg-red-600/90 text-white hover:bg-red-500 active:scale-[0.99]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  loading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  type = "button",
  ...rest
}: ButtonProps): JSX.Element {
  const isDisabled = disabled || loading;
  return (
    <button
      type={type}
      className={`inline-flex transform items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition will-change-transform disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 ${styles[variant]} ${className}`}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? "처리 중..." : children}
    </button>
  );
}
