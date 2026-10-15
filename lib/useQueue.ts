"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Barber, QueueEntry, Service } from "@/lib/types";
import {
  buildSchedule,
  estimateForNew,
  minutesUntilOpening,
  queueDateJakarta,
} from "@/lib/estimate";
import type { CardData } from "@/components/BarberCards";

const STORAGE_KEY = "barber_my_ticket";

export function useQueue() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(0);

  const fetchQueue = useCallback(async () => {
    const { data, error } = await supabase
      .from("queue_entries")
      .select("*")
      .eq("queue_date", queueDateJakarta())
      .order("ticket_number", { ascending: true });
    if (!error && data) setEntries(data as QueueEntry[]);
  }, []);

  // Load awal
  useEffect(() => {
    setNow(Date.now());
    (async () => {
      const [sv, br] = await Promise.all([
        supabase.from("services").select("*").eq("is_active", true).order("id"),
        supabase
          .from("barbers")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      ]);
      if (sv.error) {
        console.error("Gagal memuat services:", sv.error);
        setLoadError(sv.error.message);
      }
      if (br.error) console.error("Gagal memuat barbers:", br.error);
      if (sv.data) setServices(sv.data as Service[]);
      if (br.data) setBarbers(br.data as Barber[]);
      await fetchQueue();
      try {
        setMyId(localStorage.getItem(STORAGE_KEY));
      } catch { }
      setLoading(false);
    })();
  }, [fetchQueue]);

  // Realtime (nama channel unik supaya aman saat pindah halaman)
  useEffect(() => {
    const channel = supabase
      .channel(`queue-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue_entries" },
        () => fetchQueue()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchQueue]);

  // Pengaman: refresh berkala + update jam
  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      fetchQueue();
    }, 20000);
    return () => clearInterval(t);
  }, [fetchQueue]);

  const waiting = entries.filter((e) => e.status === "waiting");
  const mine = entries.find((e) => e.id === myId);
  const mineActive =
    !!mine && (mine.status === "waiting" || mine.status === "serving");

  const serviceName = (id: number | null) =>
    services.find((s) => s.id === id)?.name ?? "-";
  const servingOf = (barberId: number) =>
    entries.find((e) => e.status === "serving" && e.barber_id === barberId);

  const schedule = buildSchedule(
    entries,
    services,
    barbers,
    now,
    now > 0 ? minutesUntilOpening(now) : 0
  );

  const cards: CardData[] = barbers.map((b) => ({
    barber: b,
    busy: !!servingOf(b.id),
    waiting: waiting.filter((e) => schedule.laneOf.get(e.id) === b.id).length,
    readyIn: Math.round(schedule.freeIn[b.id] ?? 0),
  }));

  const waitNew = estimateForNew(schedule, null);
  const waitFor = (barberId: number | null) =>
    estimateForNew(schedule, barberId);

  // Posisi & estimasi tiket saya (dari simulasi jalur barber)
  let peopleAhead = 0;
  let waitMin = 0;
  const myBarber = mine?.barber_id
    ? barbers.find((b) => b.id === mine.barber_id)
    : undefined;
  if (mine && mine.status === "waiting") {
    const lane = schedule.laneOf.get(mine.id);
    const laneBusy = lane != null && !!servingOf(lane);
    peopleAhead =
      (laneBusy ? 1 : 0) +
      waiting.filter(
        (e) =>
          schedule.laneOf.get(e.id) === lane &&
          e.ticket_number < mine.ticket_number
      ).length;
    waitMin = Math.round(schedule.startIn.get(mine.id) ?? 0);
  }

  // Bersihkan tiket lama yang sudah tidak ada di antrean hari ini
  useEffect(() => {
    if (!loading && myId && !mine) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch { }
      setMyId(null);
    }
  }, [loading, myId, mine]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQueue();
    setNow(Date.now());
    setTimeout(() => setRefreshing(false), 400);
  }, [fetchQueue]);

  const resetTicket = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { }
    setMyId(null);
  }, []);

  const takeTicket = useCallback(
    async (customerName: string, serviceId: number, barberId: number | null) => {
      const takenAt = Date.now();
      const { data, error } = await supabase
        .from("queue_entries")
        .insert({
          customer_name: customerName,
          service_id: serviceId,
          barber_id: barberId,
          source: "online",
          status: "waiting",
          queue_date: queueDateJakarta(takenAt),
        })
        .select()
        .single();
      if (error || !data) return false;
      try {
        localStorage.setItem(STORAGE_KEY, data.id);
      } catch { }
      setNow(takenAt);
      setEntries((prev) =>
        prev.some((e) => e.id === data.id)
          ? prev
          : [...prev, data as QueueEntry]
      );
      setMyId(data.id);
      return true;
    },
    []
  );

  return {
    services,
    barbers,
    entries,
    now,
    loading,
    loadError,
    refreshing,
    waiting,
    mine,
    mineActive,
    myBarber,
    peopleAhead,
    waitMin,
    cards,
    waitNew,
    waitFor,
    serviceName,
    servingOf,
    refresh,
    resetTicket,
    takeTicket,
  };
}

export type QueueApi = ReturnType<typeof useQueue>;