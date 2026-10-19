"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Clock,
  Quote,
  Scissors,
  User,
} from "lucide-react";
import { SHOP } from "@/lib/shop";
import { HERO_PHOTOS, HIGHLIGHTS, TESTIMONIALS } from "@/lib/home";
import { formatWaitEstimate, ticketLabel } from "@/lib/estimate";
import { useQueue } from "@/lib/useQueue";
import ShopLogo from "@/components/ShopLogo";
import LiveBoard from "@/components/LiveBoard";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Marquee from "@/components/Marquee";
import SectionTitle from "@/components/SectionTitle";

/* ====== COPY HERO: ganti sesuai karakter barbershop ====== */
const HERO_HEADLINE = ["RAPI.", "CEPAT.", "TANPA ANTRE."]; // baris terakhir otomatis berkilau
const HERO_SUB =
  "Ambil nomor dari HP, pantau giliranmu, datang pas dipanggil. Potongan rapi tanpa buang waktu menunggu.";

const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

/* ---------- Kolase foto ---------- */
function Tile({ src }: { src?: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Suasana dan hasil potong rambut di barbershop"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/10 to-transparent text-white/40">
          <Scissors size={28} />
        </div>
      )}
    </div>
  );
}

function PhotoMosaic({ photos }: { photos: string[] }) {
  const p = photos.slice(0, 3);

  if (p.length === 1) {
    return (
      <Reveal variant="zoom" className="mt-6 h-56">
        <Tile src={p[0]} />
      </Reveal>
    );
  }
  if (p.length === 2) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-2">
        <Reveal variant="zoom" className="h-56">
          <Tile src={p[0]} />
        </Reveal>
        <Reveal variant="zoom" delay={120} className="h-56">
          <Tile src={p[1]} />
        </Reveal>
      </div>
    );
  }

  const t: (string | undefined)[] =
    p.length === 3 ? p : [undefined, undefined, undefined];
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      <Reveal variant="zoom" className="col-span-2 row-span-2 h-56">
        <Tile src={t[0]} />
      </Reveal>
      <Reveal variant="zoom" delay={140} className="h-[108px]">
        <Tile src={t[1]} />
      </Reveal>
      <Reveal variant="zoom" delay={280} className="h-[108px]">
        <Tile src={t[2]} />
      </Reveal>
    </div>
  );
}

/* ---------- Halaman ---------- */
export default function HomePage() {
  const q = useQueue();
  const mine = q.mine;

  const cta =
    q.loading || !q.now
      ? { title: "Ambil Nomor Antrean", sub: "Memuat status antrean..." }
      : mine && q.mineActive
        ? {
          title: `Tiket Saya ${ticketLabel(mine.ticket_number)}`,
          sub:
            mine.status === "serving"
              ? "Giliranmu sekarang"
              : q.peopleAhead === 0
                ? "Kamu berikutnya"
                : `Sisa ${q.peopleAhead} antrean`,
        }
        : {
          title: "Ambil Nomor Antrean",
          sub:
            q.waitNew > 0
              ? `${q.waiting.length} orang menunggu · ${formatWaitEstimate(
                  q.now,
                  q.waitNew
                )}`
              : "Antrean kosong, langsung dilayani",
        };

  const favorites = q.services.slice(0, 6);
  const doneToday = q.entries.filter((e) => e.status === "done").length;
  const stats = [
    { value: q.barbers.length, label: "Barber", duration: 1300 },
    { value: q.services.length, label: "Layanan", duration: 1300 },
    { value: doneToday, label: "Selesai hari ini", duration: 600 },
  ];

  return (
    <main className="min-h-screen pb-28 text-white">
      <div className="mx-auto max-w-md space-y-8 px-4 pt-5">
        {/* ===== HERO ===== */}
        <section className="relative isolate overflow-hidden rounded-3xl border border-white/10 p-5">
          {SHOP.heroImage && (
            <>
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 scale-110 bg-cover bg-center blur-[6px]"
                style={{ backgroundImage: `url(${SHOP.heroImage})` }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-neutral-950/80 to-neutral-950"
              />
            </>
          )}

          <div className="flex items-center justify-between">
            <Reveal variant="fade" className="flex items-center gap-3">
              <ShopLogo size={48} topBrand />
              <span className="text-sm font-bold tracking-[0.18em]">
                {SHOP.name}
              </span>
            </Reveal>
            <Link
              href="/admin"
              aria-label="Login barber"
              className="press flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"
            >
              <User size={20} />
            </Link>
          </div>

          <h1 className="words font-display hero-title mt-7">
            <span className="flex items-center">
              <span className="min-w-0 flex-[0_0_54%]">
                {HERO_HEADLINE.slice(0, 2).map((line, i) => (
                  <span key={line} className="w">
                    <span
                      style={{ "--i": i } as React.CSSProperties}
                      className="text-white"
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </span>
              <span
                aria-hidden="true"
                className="barber-lamp -ml-2 h-32 w-[40%] shrink-0"
              >
                <Image
                  src="/images/decor/barbershop.png"
                  alt=""
                  width={160}
                  height={240}
                  priority
                  onError={(event) => {
                    event.currentTarget.parentElement?.setAttribute(
                      "hidden",
                      ""
                    );
                  }}
                  className="relative z-10 h-full w-full object-contain"
                />
                <span
                  aria-hidden="true"
                  className="barber-lamp-stripes"
                />
              </span>
            </span>
            {HERO_HEADLINE.slice(2).map((line, i) => (
              <span key={line} className="w">
                <span
                  style={{ "--i": i + 2 } as React.CSSProperties}
                  className={i === HERO_HEADLINE.length - 3 ? "shimmer" : "text-white"}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <Reveal delay={650} className="mt-4">
            <p className="text-base leading-relaxed text-neutral-300">
              {HERO_SUB}
            </p>
            <p             className="mt-2 flex items-center gap-2 text-sm font-semibold text-blue-300">
              <Clock size={16} />
              {SHOP.openDays}: {SHOP.open} - {SHOP.close}
            </p>
          </Reveal>

          <PhotoMosaic photos={HERO_PHOTOS} />

          {HIGHLIGHTS.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {HIGHLIGHTS.map((h, i) => (
                <Reveal key={h} variant="zoom" delay={i * 90}>
                  <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm font-semibold">
                    <BadgeCheck size={16} className="text-blue-300" />
                    {h}
                  </span>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={200} className="mt-6 space-y-3">
            <Link
              href="/antrean"
              className="cta-shine glow-green-pulse press flex items-center justify-between gap-3 rounded-2xl bg-[#00FF00] px-5 py-4 text-neutral-950 transition-colors hover:bg-[#00E600]"
            >
              <span>
                <span className="font-display block text-3xl leading-none">
                  {cta.title}
                </span>
                <span className="mt-1 block text-sm font-bold text-neutral-800">
                  {cta.sub}
                </span>
              </span>
              <ArrowRight size={28} className="nudge shrink-0" />
            </Link>
            <Link
              href="/layanan"
              className="press block rounded-2xl border border-white/15 bg-white/5 py-3 text-center text-base font-bold"
            >
              Lihat Layanan
            </Link>
          </Reveal>
        </section>

        {/* ===== PAPAN ANTREAN ===== */}
        <Reveal>
          <LiveBoard q={q} />
        </Reveal>

        {/* ===== ANGKA ===== */}
        <section className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} variant="zoom" delay={i * 110}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center">
                <p className={`font-display glow-text text-5xl leading-none ${i === 2 ? "text-red-400" : "text-blue-300"}`}>
                  <CountUp to={s.value} duration={s.duration} />
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-300">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* ===== PITA LAYANAN ===== */}
        <Marquee items={q.services.map((s) => s.name.toUpperCase())} />

        {/* ===== LAYANAN FAVORIT ===== */}
        {favorites.length > 0 && (
          <section>
            <div className="mb-4 flex items-end justify-between">
              <SectionTitle eyebrow="Pilihan pelanggan" title="Layanan favorit" />
              <Link
                href="/layanan"
                className="flex items-center gap-1 pb-1 text-base font-bold text-blue-300"
              >
                Semua <ArrowRight size={18} />
              </Link>
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {favorites.map((s, i) => (
                <Reveal key={s.id} variant="left" delay={i * 90}>
                  <Link
                    href="/layanan"
                    className="press block w-44 shrink-0 snap-start rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="line-clamp-2 min-h-[3rem] text-base font-bold leading-snug">
                      {s.name}
                    </p>
                    <p className="font-display glow-text mt-2 text-4xl leading-none text-blue-300">
                      {s.price ? rupiah(s.price) : "Tanya kami"}
                    </p>
                    <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-neutral-300">
                      <Clock size={15} />± {s.duration_min} menit
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* ===== TESTIMONI (tampil jika diisi) ===== */}
        {TESTIMONIALS.length > 0 && (
          <section className="space-y-4">
            <SectionTitle eyebrow="Cerita mereka" title="Kata pelanggan" />
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name + t.text} delay={i * 100}>
                <figure className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <Quote size={26} className="text-red-400" />
                  <blockquote className="mt-2 text-base leading-relaxed text-neutral-200">
                    {t.text}
                  </blockquote>
                  <figcaption className="mt-3 text-base font-bold">
                    {t.name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}