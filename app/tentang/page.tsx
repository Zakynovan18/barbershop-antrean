"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Heart, Scissors, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Barber } from "@/lib/types";
import { SHOP } from "@/lib/shop";
import { ABOUT, GALLERY } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

const VALUE_ICONS = [Scissors, ShieldCheck, Clock, Heart];

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function TentangPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [serviceCount, setServiceCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const [br, sv] = await Promise.all([
        supabase
          .from("barbers")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
        supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
      ]);
      if (br.data) setBarbers(br.data as Barber[]);
      if (sv.count !== null) setServiceCount(sv.count);
    })();
  }, []);

  const stats = [
    { value: String(barbers.length || "-"), label: "Barber" },
    { value: String(serviceCount ?? "-"), label: "Layanan" },
    { value: `${SHOP.open}–${SHOP.close}`, label: "Jam buka" },
  ];

  return (
    <main className="min-h-screen pb-28 text-white">
      <div className="mx-auto max-w-md space-y-5 px-4 pt-5">
        <PageHeader
          title="Tentang Kami"
          subtitle="Kenali barbershop dan orang-orang di balik potongan rapi langgananmu."
        />

        {/* Cerita */}
        <Reveal delay={120}>
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            {ABOUT.since && (
              <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
                Sejak {ABOUT.since}
              </p>
            )}
            <h2 className="mt-1 text-2xl font-extrabold leading-tight">
              {ABOUT.headline}
            </h2>
            <div className="mt-3 space-y-3">
              {ABOUT.story.map((p) => (
                <p key={p} className="text-base leading-relaxed text-neutral-300">
                  {p}
                </p>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Angka singkat (dari data asli) */}
        <section className="grid grid-cols-3 gap-3">
          {stats.map((s, index) => (
            <Reveal key={s.label} variant="zoom" delay={index * 90}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center text-white">
                <p className="text-lg font-extrabold tabular-nums">{s.value}</p>
                <p className="text-sm text-neutral-300">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Nilai */}
        <Reveal>
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-xl font-extrabold">Yang kami pegang</h2>
            <div className="mt-4 space-y-4">
              {ABOUT.values.map((v, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <div key={v.title} className="flex gap-3">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${i % 2 === 0 ? "border-blue-400/20 bg-blue-400/10 text-blue-300" : "border-red-400/20 bg-red-400/10 text-red-300"}`}>
                      <Icon size={22} />
                    </span>
                    <div>
                      <p className="text-base font-bold">{v.title}</p>
                      <p className="text-base leading-relaxed text-neutral-300">
                        {v.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </Reveal>

        {/* Tim */}
        {barbers.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-extrabold">Tim Barber</h2>
            <div className="grid grid-cols-2 gap-3">
              {barbers.map((b, index) => (
                <Reveal key={b.id} variant="zoom" delay={index * 80}>
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                    <div className="h-44 bg-gradient-to-br from-white/10 to-white/[0.02]">
                      {b.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.photo_url}
                          alt={b.name}
                          className="h-full w-full object-cover object-top"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/10 text-3xl font-extrabold text-white">
                            {initialsOf(b.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="truncate text-base font-extrabold">
                        {b.name}
                      </p>
                      <p className="truncate text-sm text-neutral-400">
                        {b.role ?? "Barber"}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Galeri (tampil kalau GALLERY diisi) */}
        {GALLERY.length > 0 && (
          <section>
            <h2 className="mb-3 text-xl font-extrabold">Galeri</h2>
            <div className="grid grid-cols-2 gap-3">
              {GALLERY.map((src, index) => (
                <Reveal key={src} variant="zoom" delay={index * 90}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt="Hasil potongan dan suasana barbershop"
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3">
          <Reveal variant="left">
            <Link
              href="/antrean"
              className="block rounded-2xl bg-[#00FF00] py-4 text-center text-base font-bold text-neutral-950 transition-colors hover:bg-[#00E600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              Ambil Nomor
            </Link>
          </Reveal>
          <Reveal variant="left" delay={100}>
            <Link
              href="/kontak"
              className="block rounded-2xl border border-white/10 bg-white/5 py-4 text-center text-base font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Hubungi Kami
            </Link>
          </Reveal>
        </section>
      </div>
    </main>
  );
}