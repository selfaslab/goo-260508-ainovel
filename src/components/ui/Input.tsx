import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className = "", id, ...rest },
  ref
): JSX.Element {
  const inputId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={inputId}>
      <span className="font-medium text-zinc-200">{label}</span>
      <input
        ref={ref}
        id={inputId}
        className={`rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 ${className}`}
        {...rest}
      />
    </label>
  );
});
