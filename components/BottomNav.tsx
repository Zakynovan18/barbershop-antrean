"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Phone, Scissors, Store, Ticket } from "lucide-react";

const NAV = [
  { href: "/", label: "Beranda", Icon: Home },
  { href: "/antrean", label: "Antrean", Icon: Ticket },
  { href: "/layanan", label: "Layanan", Icon: Scissors },
  { href: "/tentang", label: "Tentang", Icon: Store },
  { href: "/kontak", label: "Kontak", Icon: Phone },
];

export default function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-neutral-950/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {NAV.map(({ href, label, Icon }) => {
          const on =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`press relative flex flex-col items-center gap-1 py-3 text-[13px] font-semibold transition-colors ${on ? "text-blue-400" : "text-neutral-400"
                }`}
            >
              {on && (
                <span className="absolute top-0 h-0.5 w-9 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.65)]" />
              )}
              <Icon size={22} strokeWidth={on ? 2.6 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}