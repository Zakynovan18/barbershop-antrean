"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";
import ShopLogo from "@/components/ShopLogo";
import { SHOP } from "@/lib/shop";

export default function ScrollTopNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const topBrand = document.querySelector("[data-top-brand]");
    if (!topBrand) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: "-56px 0px 0px 0px" }
    );
    observer.observe(topBrand);
    return () => observer.disconnect();
  }, []);

  if (pathname.startsWith("/admin") || !visible) return null;

  return (
    <nav
      aria-label="Header ringkas"
      className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-neutral-950/90 px-3 py-2 shadow-lg shadow-black/20 backdrop-blur-xl motion-safe:animate-[fade-in_180ms_ease-out]"
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-2">
        <Link href="/" className="press flex min-w-0 shrink items-center gap-2">
          <ShopLogo size={32} />
          <span className="truncate text-xs font-extrabold tracking-[0.12em] text-white">
            {SHOP.name}
          </span>
        </Link>
        <Link
          href="/admin"
          aria-label="Login barber"
          title="Login barber"
          className="press flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/15"
        >
          <User size={19} />
        </Link>
      </div>
    </nav>
  );
}
