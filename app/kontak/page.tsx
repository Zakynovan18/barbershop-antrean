"use client";

import { useEffect, useState } from "react";
import {
  ChevronDown,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
} from "lucide-react";
import { SHOP } from "@/lib/shop";
import { CONTACT_FAQ, DIRECTIONS, HOURS, HOURS_NOTE } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

const wa = (text: string) =>
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;

const QUICK_MESSAGES = [
  { label: "Tanya layanan", text: "Halo, saya ingin bertanya soal layanan." },
  {
    label: "Tanya jam ramai",
    text: "Halo, kira-kira jam berapa antrean paling sepi hari ini?",
  },
  {
    label: "Batalkan antrean",
    text: "Halo, saya ingin membatalkan antrean. Nama: ... Nomor: ...",
  },
];

function WhatsAppIcon() {
  return (
    <span className="relative flex h-6 w-6 items-center justify-center" aria-hidden="true">
      <MessageCircle className="absolute inset-0 h-6 w-6" strokeWidth={2.2} />
      <Phone className="h-3 w-3" strokeWidth={2.6} />
    </span>
  );
}

export default function KontakPage() {
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(
      new Date()
        .toLocaleDateString("id-ID", {
          weekday: "long",
          timeZone: "Asia/Jakarta",
        })
        .toLowerCase()
    );
  }, []);

  const socials = [
    { label: "Instagram", href: SHOP.instagram },
    { label: "TikTok", href: SHOP.tiktok },
  ].filter((s) => s.href);

  const card = "rounded-3xl border border-white/10 bg-white/[0.03] p-5";

  return (
    <main className="min-h-screen pb-28 text-white">
      <div className="mx-auto max-w-md space-y-5 px-4 pt-5">
        <PageHeader
          title="Kontak & Lokasi"
          subtitle="Tanya layanan, kabari keterlambatan, atau cari jalan ke barbershop. Kami mudah dihubungi."
        />

        <Reveal variant="zoom" delay={120}>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={wa("Halo, saya ingin bertanya.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#00FF00] py-4 text-base font-bold text-neutral-950 transition-colors hover:bg-[#00E600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              <WhatsAppIcon /> WhatsApp
            </a>
            <a
              href={SHOP.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-4 text-base font-bold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Navigation size={20} /> Buka Peta
            </a>
          </div>
        </Reveal>

        <Reveal>
          <section className={card}>
            <h2 className="text-xl font-extrabold">Alamat</h2>
            <p className="mt-2 flex gap-2 text-base leading-relaxed text-neutral-300">
              <MapPin size={20} className="mt-0.5 shrink-0 text-blue-300" />
              {SHOP.address}
            </p>
            <p className="mt-3 text-base leading-relaxed text-neutral-300">
              {DIRECTIONS}
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className={card}>
            <h2 className="flex items-center gap-2 text-xl font-extrabold">
              <Clock size={22} className="text-blue-300" /> Jam buka
            </h2>
            <div className="mt-3 divide-y divide-white/10">
              {HOURS.map((h, index) => {
                const isToday = h.day.toLowerCase() === today;
                return (
                  <Reveal key={h.day} variant="left" delay={index * 35}>
                    <div
                      className={`flex items-center justify-between py-3 text-base ${isToday ? "font-extrabold text-white" : "font-medium text-neutral-300"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        {h.day}
                        {isToday && (
                          <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-0.5 text-sm font-bold text-blue-300">
                            Hari ini
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums">{h.time}</span>
                    </div>
                  </Reveal>
                );
              })}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {HOURS_NOTE}
            </p>
          </section>
        </Reveal>

        <Reveal>
          <section className={card}>
            <h2 className="text-xl font-extrabold">Pesan cepat</h2>
            <p className="mt-1 text-base text-neutral-400">
              Ketuk salah satu, pesan WhatsApp langsung terisi.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUICK_MESSAGES.map((m, index) => (
                <Reveal key={m.label} variant="zoom" delay={index * 70}>
                  <a
                    href={wa(m.text)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-full border border-white/10 bg-white/5 px-4 py-2 text-base font-bold text-neutral-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {m.label}
                  </a>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        {(socials.length > 0 || SHOP.email) && (
          <Reveal>
            <section className={card}>
              <h2 className="text-xl font-extrabold">Ikuti kami</h2>
              <div className="mt-3 space-y-2">
                {socials.map((s, index) => (
                  <Reveal key={s.label} variant="left" delay={index * 70}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-bold text-neutral-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      {s.label} <ExternalLink size={18} />
                    </a>
                  </Reveal>
                ))}
                {SHOP.email && (
                  <Reveal variant="left" delay={socials.length * 70}>
                    <a
                      href={`mailto:${SHOP.email}`}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base font-bold text-neutral-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      {SHOP.email} <Mail size={18} />
                    </a>
                  </Reveal>
                )}
              </div>
            </section>
          </Reveal>
        )}

        <Reveal>
          <section className={card}>
            <h2 className="text-xl font-extrabold">Pertanyaan umum</h2>
            <div className="mt-4 space-y-3">
              {CONTACT_FAQ.map((f, index) => (
                <Reveal key={f.q} variant="left" delay={index * 65}>
                  <details className="group rounded-2xl border border-white/10 bg-white/5 p-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown
                        size={20}
                        className="shrink-0 text-blue-300 transition group-open:rotate-180"
                      />
                    </summary>
                    <p className="mt-2 text-base leading-relaxed text-neutral-300">
                      {f.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}