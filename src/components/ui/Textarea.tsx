import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, className = "", id, ...rest }, ref): JSX.Element {
    const areaId = id ?? label.replace(/\s+/g, "-").toLowerCase();
    return (
      <label className="flex flex-col gap-1.5 text-sm" htmlFor={areaId}>
        <span className="font-medium text-zinc-200">{label}</span>
        <textarea
          ref={ref}
          id={areaId}
          className={`min-h-[96px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 ${className}`}
          {...rest}
        />
      </label>
    );
  }
);
