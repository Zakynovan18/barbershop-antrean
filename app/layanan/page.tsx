"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Service } from "@/lib/types";
import { CATEGORY_INFO, CATEGORY_ORDER, SERVICE_NOTES } from "@/lib/content";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function LayananPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order")
        .order("id");
      if (error) setError(error.message);
      else setServices((data ?? []) as Service[]);
      setLoading(false);
    })();
  }, []);

  const groups = new Map<string, Service[]>();
  services.forEach((s) => {
    const c = s.category ?? "Lainnya";
    groups.set(c, [...(groups.get(c) ?? []), s]);
  });
  const rank = (c: string) => {
    const i = CATEGORY_ORDER.indexOf(c);
    return i === -1 ? 99 : i;
  };
  const categories = [...groups.keys()].sort((a, b) => rank(a) - rank(b));

  return (
    <main className="min-h-screen pb-28 text-white">
      <div className="mx-auto max-w-md space-y-5 px-4 pt-5">
        <PageHeader
          title="Layanan & Harga"
          subtitle="Dari potong rambut harian, cukur, perawatan, sampai pewarnaan. Semua dengan estimasi durasi yang jelas."
        />

        {loading ? (
          <Reveal>
            <div className="h-64 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
          </Reveal>
        ) : error ? (
          <Reveal>
            <p className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-base font-medium text-red-300">
              Gagal memuat layanan: {error}
            </p>
          </Reveal>
        ) : services.length === 0 ? (
          <Reveal>
            <p className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-base text-neutral-300">
              Daftar layanan belum tersedia.
            </p>
          </Reveal>
        ) : (
          <>
            {/* Lompat ke kategori */}
            <Reveal variant="fade" delay={120}>
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((c) => (
                  <a
                    key={c}
                    href={`#${slug(c)}`}
                    className="shrink-0 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {c}
                  </a>
                ))}
              </div>
            </Reveal>

            {categories.map((c, index) => (
              <Reveal key={c} delay={index * 90}>
                <section
                  id={slug(c)}
                  className="scroll-mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <h2 className="text-xl font-extrabold">{c}</h2>
                  {CATEGORY_INFO[c] && (
                    <p className="mt-1 text-base leading-relaxed text-neutral-400">
                      {CATEGORY_INFO[c]}
                    </p>
                  )}
                  <div className="mt-3 divide-y divide-white/10">
                    {groups.get(c)!.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-start justify-between gap-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="text-base font-bold">{s.name}</p>
                          {s.description && (
                            <p className="mt-0.5 text-base leading-relaxed text-neutral-300">
                              {s.description}
                            </p>
                          )}
                          <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-neutral-400">
                            <Clock size={15} />± {s.duration_min} menit
                          </p>
                        </div>
                        <p className="shrink-0 text-lg font-extrabold tabular-nums">
                          {s.price ? rupiah(s.price) : "Tanya kami"}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}

            <Reveal>
              <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-xl font-extrabold">Catatan</h2>
                <ul className="mt-3 space-y-3">
                  {SERVICE_NOTES.map((n) => (
                    <li key={n} className="flex gap-3 text-base text-neutral-300">
                      <BadgeCheck
                        size={22}
                        className="mt-0.5 shrink-0 text-blue-300"
                      />
                      <span className="leading-relaxed">{n}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal variant="zoom">
              <Link
                href="/antrean"
                className="flex items-center justify-center gap-2 rounded-3xl bg-[#00FF00] py-5 text-lg font-bold text-neutral-950 transition-colors hover:bg-[#00E600] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FF00] focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
              >
                Ambil Nomor Antrean <ArrowRight size={20} />
              </Link>
            </Reveal>
          </>
        )}
      </div>
    </main>
  );
}