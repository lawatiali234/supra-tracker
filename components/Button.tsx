import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2 text-sm",
        variant === "primary" &&
          "bg-accent text-black hover:bg-accent/90",
        variant === "secondary" &&
          "border border-border bg-surface text-fg hover:bg-surface-2",
        variant === "ghost" &&
          "text-fg-dim hover:bg-surface hover:text-fg",
        variant === "danger" &&
          "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
        className,
      )}
    />
  );
}
