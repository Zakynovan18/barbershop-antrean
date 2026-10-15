"use client";

import { useState } from "react";
import { CirclePlus } from "lucide-react";
import BarberCards from "@/components/BarberCards";
import type { QueueApi } from "@/lib/useQueue";

const rupiah = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

const field =
  "w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition placeholder:text-neutral-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 [color-scheme:dark]";
const label =
  "mb-1.5 block text-sm font-bold uppercase tracking-[0.14em] text-neutral-300";

export default function TakeForm({
  q,
  mode,
}: {
  q: QueueApi;
  mode: "quick" | "full";
}) {
  const [name, setName] = useState("");
  const [serviceId, setServiceId] = useState<number | "">("");
  const [barberChoice, setBarberChoice] = useState<number | "any">("any");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveService =
    serviceId === "" ? q.services[0]?.id ?? "" : serviceId;
  const choiceWait = q.waitFor(barberChoice === "any" ? null : barberChoice);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = name.trim().slice(0, 40);
    if (!cleanName) return setError("Nama wajib diisi.");
    if (!effectiveService) return setError("Pilih layanan dulu.");

    setSubmitting(true);
    setError(null);
    const ok = await q.takeTicket(
      cleanName,
      Number(effectiveService),
      barberChoice === "any" ? null : barberChoice
    );
    setSubmitting(false);
    if (!ok) setError("Gagal mengambil antrean. Coba lagi ya.");
    else setName("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-3xl border border-white/10 bg-neutral-900/95 p-5 shadow-[0_0_40px_rgba(59,130,246,0.07)]"
    >
      <div>
        <h2 className="font-display flex items-center gap-2 text-4xl leading-none">
          <CirclePlus size={28} className="text-blue-400" />
          {mode === "quick" ? "Ambil Nomor Cepat" : "Ambil Nomor Antrean"}
        </h2>
        <p className="mt-2 text-base text-neutral-300">
          Daftar dari mana saja, tanpa harus menunggu lama di tempat.
        </p>
      </div>

      <div>
        <label className={label}>Nama lengkap</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="Nama kamu"
          className={field}
        />
      </div>

      <div>
        <label className={label}>Layanan</label>
        <select
          value={effectiveService}
          onChange={(e) => setServiceId(Number(e.target.value))}
          className={field}
        >
          {q.services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.duration_min} mnt
              {s.price ? ` · ${rupiah(s.price)}` : ""})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={label}>Barber</label>
        {mode === "quick" ? (
          <select
            value={barberChoice}
            onChange={(e) =>
              setBarberChoice(
                e.target.value === "any" ? "any" : Number(e.target.value)
              )
            }
            className={field}
          >
            <option value="any">Siapa saja (tercepat)</option>
            {q.barbers.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        ) : (
          <BarberCards
            cards={q.cards}
            now={q.now}
            anyReadyIn={q.waitNew}
            selected={barberChoice}
            onSelect={setBarberChoice}
          />
        )}
        <p className="mt-1 text-base font-semibold text-blue-300">
          Estimasi tunggu:{" "}
          {choiceWait > 0 ? `± ${choiceWait} menit` : "langsung dilayani"}
        </p>
      </div>

      {error && <p className="text-base font-medium text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="cta-shine glow-green-pulse press font-display w-full rounded-2xl bg-[#00FF00] py-4 text-3xl leading-none text-neutral-950 transition-colors hover:bg-[#00E600] disabled:opacity-50"
      >
        {submitting ? "MEMPROSES..." : "AMBIL NOMOR"}
      </button>
    </form>
  );
}