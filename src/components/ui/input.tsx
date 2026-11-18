"use client";

import { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  revealable?: boolean;
  labelAside?: React.ReactNode;
  children?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, revealable, labelAside, children, type = "text", className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const [visible, setVisible] = useState(false);
  const inputType = revealable ? (visible ? "text" : "password") : type;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-[13.5px] font-medium text-[#c9ced5]">
          {label}
        </label>
        {labelAside}
      </div>

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          className={cn(
            "h-11 w-full rounded-xl border bg-field px-3.5 text-[14.5px] text-text placeholder:text-[#80878f]",
            "transition-[border-color,box-shadow] focus:outline-none",
            error ? "border-[#ef5f5f] focus:shadow-focus-danger" : "border-line focus:border-accent focus:shadow-focus",
            revealable && "pr-20",
            className,
          )}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-1.5 top-[5px] h-[34px] rounded-lg px-3 text-[12.5px] font-medium text-muted hover:bg-line hover:text-text"
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>

      {children}

      {error ? (
        <p id={messageId} className="mt-[7px] flex items-start gap-1.5 text-[13px] text-[#ff8f8f]">
          <ErrorIcon />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-[7px] text-[12.5px] text-[#80878f]">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export function ErrorIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-px flex-none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.2v.1" strokeLinecap="round" />
    </svg>
  );
}