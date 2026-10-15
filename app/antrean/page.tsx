"use client";

import { BadgeCheck, ChevronDown } from "lucide-react";
import { useQueue } from "@/lib/useQueue";
import PageHeader from "@/components/PageHeader";
import LiveBoard from "@/components/LiveBoard";
import TicketCard from "@/components/TicketCard";
import TakeForm from "@/components/TakeForm";
import BarberCards from "@/components/BarberCards";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";

/* ====== KONTEN: sesuaikan dengan kebijakan barbershop ====== */
const STEPS = [
  {
    title: "Ambil nomor",
    text: "Isi nama, pilih layanan, lalu pilih barber favoritmu atau biarkan sistem memilih barber yang paling cepat kosong.",
  },
  {
    title: "Pantau dari mana saja",
    text: "Posisi antrean dan estimasi jam dilayani diperbarui otomatis, jadi kamu tidak perlu menunggu di tempat.",
  },
  {
    title: "Datang menjelang giliranmu",
    text: "Usahakan tiba sekitar 10–15 menit sebelum estimasi supaya tidak terlewat.",
  },
  {
    title: "Dipanggil barber",
    text: "Saat statusmu berubah jadi Giliranmu, langsung menuju kursi barber yang tertera di e-tiket.",
  },
];

const RULES = [
  "Satu perangkat hanya bisa memegang satu tiket aktif dalam satu waktu.",
  "Estimasi waktu adalah perkiraan dan bisa bergeser mengikuti lama pengerjaan pelanggan sebelumnya.",
  "Pelanggan yang datang langsung (walk-in) tetap dilayani sesuai urutan nomor.",
  "Nomor yang sudah dipanggil tetapi belum hadir dapat dilewati barber supaya antrean tidak tertahan.",
  "Menjelang hari raya dan akhir pekan antrean biasanya panjang, jadi disarankan mengambil nomor lebih awal.",
];

const FAQ = [
  {
    q: "Apakah harus memasang aplikasi?",
    a: "Tidak perlu. Cukup buka website ini lewat browser di HP kamu.",
  },
  {
    q: "Bagaimana kalau estimasinya meleset?",
    a: "Estimasi dihitung dari durasi layanan dan antrean di depanmu. Kalau barber lebih cepat atau lebih lama dari biasanya, angkanya ikut menyesuaikan otomatis setiap beberapa detik.",
  },
  {
    q: "Boleh ambil nomor sebelum sampai di lokasi?",
    a: "Boleh, itulah gunanya sistem ini. Tetap usahakan tiba sebelum giliranmu karena nomor yang tidak hadir bisa dilewati.",
  },
  {
    q: "Bisa memilih barber tertentu?",
    a: "Bisa. Pilih barber saat mengambil nomor. Kalau memilih Siapa saja, kamu dilayani barber yang lebih dulu kosong sehingga biasanya lebih cepat.",
  },
  {
    q: "Bagaimana cara membatalkan antrean?",
    a: "Saat ini pembatalan dilakukan dengan mengabari barbershop lewat WhatsApp (lihat halaman Kontak).",
  },
  {
    q: "Tiketku hilang kalau browser ditutup?",
    a: "Tidak. Tiket tersimpan di browser perangkatmu. Jangan memakai mode penyamaran atau menghapus data browser selama antrean masih aktif.",
  },
];

const panel = "rounded-3xl border border-white/10 bg-white/[0.03] p-5";

export default function AntreanPage() {
  const q = useQueue();

  return (
    <main className="min-h-screen pb-28 text-white">
      <div className="mx-auto max-w-md space-y-8 px-4 pt-5">
        <PageHeader
          eyebrow="Antrean online"
          title="Antrean"
          subtitle="Ambil nomor, pilih barber, dan pantau giliranmu secara langsung dari HP."
        />

        <Reveal>
          <LiveBoard q={q} />
        </Reveal>

        {q.loading ? (
          <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
        ) : q.mine ? (
          <TicketCard q={q} />
        ) : (
          <TakeForm q={q} mode="full" />
        )}

        {!q.loading && q.mine && (
          <section className="space-y-4">
            <SectionTitle eyebrow="Siapa yang melayani" title="Tim Barber" />
            <BarberCards cards={q.cards} now={q.now} mineId={q.mine.barber_id} />
          </section>
        )}

        <section className={panel}>
          <SectionTitle eyebrow="Mudah dan cepat" title="Cara kerja" />
          <ol className="mt-5 space-y-5">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} variant="left" delay={i * 100}>
                <li className="flex gap-3">
                  <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-2xl text-neutral-950">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-base font-bold">{s.title}</p>
                    <p className="text-base leading-relaxed text-neutral-300">
                      {s.text}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className={panel}>
          <SectionTitle eyebrow="Biar sama-sama nyaman" title="Aturan antrean" />
          <ul className="mt-5 space-y-3">
            {RULES.map((r, i) => (
              <Reveal key={r} delay={i * 80}>
                <li className="flex gap-3 text-base text-neutral-200">
                  <BadgeCheck
                    size={22}
                    className="mt-0.5 shrink-0 text-blue-300"
                  />
                  <span className="leading-relaxed">{r}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className={panel}>
          <SectionTitle eyebrow="Sering ditanyakan" title="Pertanyaan umum" />
          <div className="mt-5 space-y-3">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 70}>
                <details className="group rounded-2xl border border-white/10 bg-white/5 p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-base font-bold [&::-webkit-details-marker]:hidden">
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
      </div>
    </main>
  );
}