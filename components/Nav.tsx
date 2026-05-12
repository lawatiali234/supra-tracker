"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import {
  Gauge,
  Wrench,
  ClipboardList,
  AlertTriangle,
  Timer,
  Droplet,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/mods", label: "Mods", icon: Wrench },
  { href: "/service", label: "Service", icon: ClipboardList },
  { href: "/issues", label: "Issues", icon: AlertTriangle },
  { href: "/pulls", label: "Pulls", icon: Timer },
  { href: "/fluids", label: "Fluids", icon: Droplet },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="text-sm font-semibold tracking-widest uppercase">
            Supra <span className="text-accent">Tracker</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                  active
                    ? "bg-surface text-fg"
                    : "text-fg-dim hover:bg-surface hover:text-fg",
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
