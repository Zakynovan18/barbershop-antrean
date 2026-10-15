import { Clock, Users } from "lucide-react";
import { SHOP } from "@/lib/shop";
import { clock, formatWaitEstimate, ticketLabel } from "@/lib/estimate";
import type { QueueApi } from "@/lib/useQueue";

export default function LiveBoard({
  q,
  className = "",
}: {
  q: QueueApi;
  className?: string;
}) {
  const hhmm = q.now ? clock(q.now) : "";
  const isOpen = hhmm >= SHOP.open && hhmm < SHOP.close;
  const anyServing = q.entries.some((e) => e.status === "serving");
  const statusText = !q.now
    ? "Memuat..."
    : !isOpen
      ? "Sedang tutup"
      : anyServing
        ? "Buka • Sedang melayani"
        : "Buka • Kursi kosong";

  return (
    <div
      className={`rounded-3xl border border-white/10 bg-neutral-900/95 p-5 text-white shadow-[0_0_40px_rgba(59,130,246,0.08)] ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className={`flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] ${isOpen ? "text-blue-400" : "text-neutral-400"}`}>
          {isOpen && (
            <span className="live-dot h-2.5 w-2.5 rounded-full bg-blue-400" />
          )}
          {statusText}
        </p>
        {q.now > 0 && (
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold tabular-nums">
            <Clock size={16} /> {hhmm} WIB
          </span>
        )}
      </div>

      <div
        className="mt-4 grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${Math.max(
            q.barbers.length,
            1
          )}, minmax(0, 1fr))`,
        }}
      >
        {q.barbers.map((b) => {
          const s = q.servingOf(b.id);
          const text = s ? ticketLabel(s.ticket_number) : "—";
          return (
            <div
              key={b.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-3"
            >
              <p className="truncate text-sm font-semibold text-neutral-300">
                {b.name}
              </p>
              <p
                key={text}
                className="anim-flip glow-text font-display mt-1 text-5xl leading-none"
              >
                {text}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl bg-white/5 px-4 py-3 text-base font-semibold">
        <span className="flex items-center gap-2">
          <Users size={18} className="text-blue-400" />
          {q.waiting.length} orang dalam antrean
        </span>
        <span className="flex items-center gap-2">
          <Clock size={18} className="text-blue-400" />
          {q.waitNew > 0
            ? formatWaitEstimate(q.now, q.waitNew)
            : "Tanpa antre"}
        </span>
      </div>
    </div>
  );
}