import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { clsx } from "clsx";

const baseInput =
  "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-fg-dim">
        {label}
      </span>
      {children}
      {hint && <span className="text-xs text-fg-muted">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={clsx(baseInput, props.className)} />;
}

export function NumberInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="number"
      step="any"
      {...props}
      className={clsx(baseInput, "num", props.className)}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={clsx(baseInput, "resize-y", props.className)}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={clsx(baseInput, props.className)} />;
}
