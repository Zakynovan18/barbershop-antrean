import { Check, Clock, Users } from "lucide-react";
import { clock } from "@/lib/estimate";
import type { Barber } from "@/lib/types";

export type CardData = {
  barber: Barber;
  busy: boolean;
  waiting: number;
  readyIn: number;
};

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const readyText = (now: number, readyIn: number) =>
  readyIn <= 0 ? "Siap sekarang" : `Siap ± ${clock(now + readyIn * 60000)}`;

function statusOf(c: CardData) {
  if (c.busy)
    return { text: "Sibuk", cls: "bg-red-600 text-white" };
  if (c.waiting > 0)
    return { text: "Ada antrean", cls: "bg-blue-400/15 text-blue-300" };
  return { text: "Kosong", cls: "bg-blue-600 text-white" };
}

const BASE =
  "flex w-40 shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-neutral-900 text-left";

function Shell({
  on,
  selectable,
  onClick,
  media,
  chip,
  title,
  subtitle,
  ready,
  waiting,
}: {
  on: boolean;
  selectable: boolean;
  onClick?: () => void;
  media: React.ReactNode;
  chip?: { text: string; cls: string };
  title: string;
  subtitle: string;
  ready: string;
  waiting: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={selectable ? 0 : -1}
      aria-pressed={selectable ? on : undefined}
      className={`${BASE} transition ${on
          ? "ring-2 ring-blue-400 shadow-[0_0_28px_rgba(59,130,246,0.28)]"
          : "ring-1 ring-white/10"
        } ${selectable ? "press" : "cursor-default"}`}
    >
      <div className="relative h-40 shrink-0">
        {media}
        {chip && (
          <span
            className={`absolute right-2 top-2 rounded-full border border-white/10 px-2.5 py-1 text-sm font-bold backdrop-blur-sm ${chip.cls}`}
          >
            {chip.text}
          </span>
        )}
        {on && (
          <span
            aria-label="Dipilih"
            className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-neutral-950 shadow-[0_0_14px_rgba(255,255,255,0.28)]"
          >
            <Check size={16} strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="truncate text-base font-extrabold leading-tight text-white">
          {title}
        </p>
        <p className="truncate text-sm text-neutral-400">{subtitle}</p>

        <div className="mt-auto pt-3">
          <div className="space-y-1.5 border-t border-white/10 pt-3 text-sm font-semibold">
            <p className="flex items-center gap-1.5 text-blue-300">
              <Clock size={15} className="shrink-0" />
              {ready}
            </p>
            <p className="flex items-center gap-1.5 text-neutral-300">
              <Users size={15} className="shrink-0" />
              {waiting} menunggu
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function BarberCards({
  cards,
  now,
  anyReadyIn = 0,
  selected,
  onSelect,
  mineId,
}: {
  cards: CardData[];
  now: number;
  anyReadyIn?: number;
  selected?: number | "any";
  onSelect?: (v: number | "any") => void;
  mineId?: number | null;
}) {
  const selectable = !!onSelect;
  const totalWaiting = cards.reduce((s, c) => s + c.waiting, 0);

  // Bleed ke tepi wadah induk supaya kartu pertama sejajar dan geseran terasa natural
  const wrap = `flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${selectable ? "-mx-5 px-5 scroll-px-5" : "-mx-4 px-4 scroll-px-4"
    }`;

  return (
    <div className={wrap}>
      {selectable && (
        <Shell
          on={selected === "any"}
          selectable
          onClick={() => onSelect!("any")}
          media={
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-red-500/10">
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-blue-300">
                <Users size={34} />
              </span>
            </div>
          }
          chip={{ text: "Otomatis", cls: "bg-white/15 text-white" }}
          title="Siapa saja"
          subtitle="Barber tercepat"
          ready={readyText(now, anyReadyIn)}
          waiting={totalWaiting}
        />
      )}

      {cards.map((c) => {
        const on = selectable
          ? selected === c.barber.id
          : mineId === c.barber.id;
        return (
          <Shell
            key={c.barber.id}
            on={on}
            selectable={selectable}
            onClick={selectable ? () => onSelect!(c.barber.id) : undefined}
            media={
              c.barber.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.barber.photo_url}
                  alt={c.barber.name}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-red-500/10">
                  <span className="font-display flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-4xl text-white">
                    {initialsOf(c.barber.name)}
                  </span>
                </div>
              )
            }
            chip={statusOf(c)}
            title={c.barber.name}
            subtitle={c.barber.role ?? "Barber"}
            ready={readyText(now, c.readyIn)}
            waiting={c.waiting}
          />
        );
      })}
    </div>
  );
}