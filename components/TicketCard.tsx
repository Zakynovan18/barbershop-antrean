import Link from "next/link";
import { ArrowRight, BadgeCheck, RefreshCw, Users } from "lucide-react";
import BarberAvatar from "@/components/BarberAvatar";
import { clock, ticketLabel } from "@/lib/estimate";
import type { QueueApi } from "@/lib/useQueue";

const card =
  "rounded-3xl border border-white/10 bg-neutral-900/95 p-5 shadow-[0_0_40px_rgba(59,130,246,0.07)]";
const inner = "rounded-2xl border border-white/10 bg-white/5 p-4";
const label = "text-sm font-semibold uppercase tracking-[0.12em] text-neutral-400";

export default function TicketCard({
  q,
  compact = false,
}: {
  q: QueueApi;
  compact?: boolean;
}) {
  const { mine, mineActive, myBarber, peopleAhead, waitMin, now } = q;
  if (!mine) return null;

  if (!mineActive) {
    return (
      <div className={`${card} text-center`}>
        <p className="font-display text-3xl leading-tight">
          {mine.status === "done"
            ? "Antreanmu selesai. Terima kasih!"
            : "Antreanmu dilewati atau dibatalkan."}
        </p>
        <button
          onClick={q.resetTicket}
          className="press mt-4 rounded-2xl bg-[#00FF00] px-5 py-3 text-base font-bold text-neutral-950 transition-colors hover:bg-[#00E600]"
        >
          Ambil antrean baru
        </button>
      </div>
    );
  }

  return (
    <div className={card}>
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-blue-400">
          <BadgeCheck size={20} />
          E-tiket aktif
        </p>
        <span
          className={`rounded-full px-3 py-1 text-sm font-bold ${mine.status === "serving"
            ? "glow-pulse bg-red-500 text-white"
            : "bg-blue-400/15 text-blue-300"
            }`}
        >
          {mine.status === "serving" ? "Giliranmu!" : "Menunggu"}
        </span>
      </div>

      <div className={`mt-4 ${inner}`}>
        <p className={label}>Nomor antrean</p>
        <p
          key={`${mine.ticket_number}-${mine.status}`}
          className="anim-flip glow-text font-display text-8xl leading-none text-white"
        >
          {ticketLabel(mine.ticket_number)}
        </p>
        <p className="mt-2 text-base text-neutral-300">
          Layanan:{" "}
          <b className="font-bold text-white">{q.serviceName(mine.service_id)}</b>
        </p>
        {!compact && (
          <p className="text-base text-neutral-300">
            Atas nama:{" "}
            <b className="font-bold text-white">{mine.customer_name}</b>
          </p>
        )}
      </div>

      <div className={`mt-3 flex items-center gap-3 ${inner}`}>
        {myBarber ? (
          <>
            <BarberAvatar barber={myBarber} size={52} />
            <div className="min-w-0">
              <p className={label}>Barber kamu</p>
              <p className="truncate text-lg font-extrabold">{myBarber.name}</p>
              <p className="text-sm text-neutral-400">
                {myBarber.role ?? "Barber"}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-blue-400 text-neutral-950">
              <Users size={24} />
            </div>
            <div>
              <p className={label}>Barber kamu</p>
              <p className="text-base font-bold">
                Barber yang kosong lebih dulu
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className={inner}>
          <p className={label}>Estimasi</p>
          <p className="font-display mt-1 text-3xl leading-none tabular-nums">
            {mine.status === "serving"
              ? "Sekarang"
              : `${clock(now + waitMin * 60000)} WIB`}
          </p>
        </div>
        <div className={inner}>
          <p className={label}>Posisi</p>
          <p className="font-display mt-1 text-3xl leading-none">
            {mine.status === "serving"
              ? "Giliranmu"
              : peopleAhead === 0
                ? "Berikutnya"
                : `Sisa ${peopleAhead}`}
          </p>
        </div>
      </div>

      {compact ? (
        <Link
          href="/antrean"
          className="press mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-bold text-neutral-950"
        >
          Lihat detail antrean <ArrowRight size={18} />
        </Link>
      ) : (
        <>
          <button
            onClick={q.refresh}
            className="press mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 py-4 text-base font-bold"
          >
            <RefreshCw
              size={18}
              className={q.refreshing ? "animate-spin" : ""}
            />
            Perbarui Status
          </button>
          <p className="mt-3 text-center text-sm text-neutral-400">
            Estimasi bisa bergeser sesuai kondisi di barbershop.
          </p>
        </>
      )}
    </div>
  );
}