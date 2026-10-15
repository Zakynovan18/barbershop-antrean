import Link from "next/link";
import { SHOP } from "@/lib/shop";
import ShopLogo from "@/components/ShopLogo";
import Reveal from "@/components/Reveal";

export default function PageHeader({
  title,
  subtitle,
  eyebrow = "",
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
}) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-5 pb-6 pt-5">
      <Link href="/" className="press flex items-center gap-3">
        <ShopLogo size={40} topBrand />
        <span className="text-sm font-bold uppercase tracking-[0.18em]">
          {SHOP.name}
        </span>
      </Link>

      {eyebrow && (
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
          {eyebrow}
        </p>
      )}

      <h1
        className={`words font-display text-5xl leading-[0.95] text-white ${eyebrow ? "mt-1" : "mt-6"
          }`}
      >
        <span className="w">
          <span style={{ "--i": 0 } as React.CSSProperties}>
            <span className="shimmer">{title}</span>
          </span>
        </span>
      </h1>

      <Reveal delay={350} className="mt-3">
        <p className="text-base leading-relaxed text-neutral-300">{subtitle}</p>
      </Reveal>
    </header>
  );
}