import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-fg-muted">{icon}</div>}
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-fg-dim">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
