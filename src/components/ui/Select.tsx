import type { SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
}

export function Select({
  label,
  hint,
  className = "",
  id,
  children,
  ...rest
}: SelectProps): JSX.Element {
  const selectId = id ?? label.replace(/\s+/g, "-").toLowerCase();
  return (
    <label className="flex flex-col gap-1.5 text-sm" htmlFor={selectId}>
      <span className="font-medium text-zinc-200">{label}</span>
      <select
        id={selectId}
        className={`rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 ${className}`}
        {...rest}
      >
        {children}
      </select>
      {hint ? <span className="text-xs text-zinc-500">{hint}</span> : null}
    </label>
  );
}
