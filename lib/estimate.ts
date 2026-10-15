import type { Barber, QueueEntry, Service } from "./types";

const DEFAULT_DURATION = 30;

export function todayJakarta(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}

export const ticketLabel = (n: number) => `A-${String(n).padStart(2, "0")}`;

export const clock = (ms: number) =>
  new Date(ms)
    .toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta",
    })
    .replace(".", ":");

function durationOf(entry: QueueEntry, services: Service[]): number {
  return (
    services.find((s) => s.id === entry.service_id)?.duration_min ??
    DEFAULT_DURATION
  );
}

function remainingMinutes(
  entry: QueueEntry,
  services: Service[],
  now: number
): number {
  const full = durationOf(entry, services);
  if (entry.status === "serving" && entry.started_at) {
    const elapsed = (now - new Date(entry.started_at).getTime()) / 60000;
    return Math.max(full - elapsed, 0);
  }
  return full;
}

export interface Schedule {
  freeIn: Record<number, number>; // id barber -> menit sampai kosong
  startIn: Map<string, number>; // id tiket (waiting) -> menit sampai mulai
  laneOf: Map<string, number>; // id tiket (waiting) -> id barber (hasil simulasi)
}

function earliest(freeIn: Record<number, number>): number | null {
  let best: number | null = null;
  for (const key of Object.keys(freeIn)) {
    const id = Number(key);
    if (best === null || freeIn[id] < freeIn[best]) best = id;
  }
  return best;
}

export function buildSchedule(
  entries: QueueEntry[],
  services: Service[],
  barbers: Barber[],
  now: number
): Schedule {
  const freeIn: Record<number, number> = {};
  barbers.forEach((b) => {
    freeIn[b.id] = 0;
  });

  entries
    .filter(
      (e) =>
        e.status === "serving" &&
        e.barber_id != null &&
        freeIn[e.barber_id] !== undefined
    )
    .forEach((e) => {
      freeIn[e.barber_id!] = remainingMinutes(e, services, now);
    });

  const startIn = new Map<string, number>();
  const laneOf = new Map<string, number>();

  const waiting = entries
    .filter((e) => e.status === "waiting")
    .sort((a, b) => a.ticket_number - b.ticket_number);

  for (const e of waiting) {
    const lane: number | null =
      e.barber_id != null && freeIn[e.barber_id] !== undefined
        ? e.barber_id
        : earliest(freeIn);
    if (lane === null) continue;
    startIn.set(e.id, freeIn[lane]);
    laneOf.set(e.id, lane);
    freeIn[lane] += durationOf(e, services);
  }

  return { freeIn, startIn, laneOf };
}

// Estimasi menit tunggu untuk tiket baru (barberId null = siapa saja)
export function estimateForNew(
  schedule: Schedule,
  barberId: number | null
): number {
  const lane =
    barberId != null && schedule.freeIn[barberId] !== undefined
      ? barberId
      : earliest(schedule.freeIn);
  return lane === null ? 0 : Math.round(schedule.freeIn[lane]);
}

// Dipakai halaman pelanggan versi lama sampai diganti di Bagian B
export function estimateWaitMinutes(
  entries: QueueEntry[],
  services: Service[],
  ticketNumber: number,
  now: number
): number {
  const ahead = entries.filter(
    (e) =>
      e.status === "serving" ||
      (e.status === "waiting" && e.ticket_number < ticketNumber)
  );
  const total = ahead.reduce(
    (sum, e) => sum + remainingMinutes(e, services, now),
    0
  );
  return Math.round(total);
}