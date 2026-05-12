"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";

interface FormDrawerProps {
  trigger: React.ReactNode;
  title: string;
  children: (close: () => void) => React.ReactNode;
}

export function FormDrawer({ trigger, title, children }: FormDrawerProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <span onClick={() => setOpen(true)} className="inline-flex">
        {trigger}
      </span>

      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-black/60 transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        className={clsx(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-xl transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-fg">
            {title}
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-1 text-fg-dim hover:bg-surface-2 hover:text-fg"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {open && children(() => setOpen(false))}
        </div>
      </aside>
    </>
  );
}
