import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({
  children,
  className = "",
  ...rest
}: CardProps): JSX.Element {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-sm shadow-black/30 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
