"use client";

import { forwardRef, useId, useState } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  revealable?: boolean;
  labelAside?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, revealable, labelAside, type = "text", className, id, ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const messageId = `${inputId}-message`;
  const [visible, setVisible] = useState(false);
  const inputType = revealable ? (visible ? "text" : "password") : type;

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={inputId} className="text-[13.5px] font-medium text-text">
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
            "h-11 w-full rounded-lg border bg-field px-3.5 text-[15px] text-text placeholder:text-muted/70",
            "transition-[border-color,box-shadow] focus:outline-none",
            error
              ? "border-danger focus:shadow-focus-danger"
              : "border-line focus:border-accent focus:shadow-focus",
            revealable && "pr-20",
            className,
          )}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-1.5 top-1.5 h-8 rounded-md px-2.5 text-[12.5px] font-medium text-muted hover:bg-line hover:text-text"
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {visible ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>

      {error ? (
        <p id={messageId} className="mt-1.5 flex items-start gap-1.5 text-[12.5px] text-danger">
          <ErrorIcon />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={messageId} className="mt-1.5 text-[12.5px] text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-px flex-none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.2v.1" strokeLinecap="round" />
    </svg>
  );
}