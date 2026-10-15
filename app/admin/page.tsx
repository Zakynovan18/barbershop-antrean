"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Barber, QueueEntry, Service } from "@/lib/types";
import {
  buildSchedule,
  clock,
  ticketLabel,
  todayJakarta,
} from "@/lib/estimate";
import BarberAvatar from "@/components/BarberAvatar";

function formatTime(iso: string | null): string {
  if (!iso) return "-";
  return clock(new Date(iso).getTime());
}

/* ===================== LOGIN ===================== */
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) setError("Email atau password salah.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-3 rounded-2xl bg-neutral-900 p-6"
      >
        <h1 className="text-xl font-bold">Login Barber</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full rounded-xl bg-neutral-800 px-3 py-3 text-base outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full rounded-xl bg-neutral-800 px-3 py-3 text-base outline-none focus:ring-2 focus:ring-blue-400"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-white py-3 text-base font-semibold text-neutral-950 disabled:opacity-50"
        >
          {loading ? "Masuk..." : "Masuk"}
        </button>
      </form>
    </main>
  );
}

/* ===================== DASHBOARD ===================== */
function Dashboard() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [walkName, setWalkName] = useState("");
  const [walkService, setWalkService] = useState<number | "">("");
  const [walkBarber, setWalkBarber] = useState<number | "any">("any");

  const fetchEntries = useCallback(async () => {
    const { data } = await supabase
      .from("queue_entries")
      .select("*")
      .eq("queue_date", todayJakarta())
      .order("ticket_number", { ascending: true });
    if (data) setEntries(data as QueueEntry[]);
  }, []);

  useEffect(() => {
    (async () => {
      const [sv, br] = await Promise.all([
        supabase.from("services").select("*").eq("is_active", true).order("id"),
        supabase
          .from("barbers")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      ]);
      if (sv.data && sv.data.length) {
        setServices(sv.data as Service[]);
        setWalkService(sv.data[0].id);
      }
      if (br.data) setBarbers(br.data as Barber[]);
      await fetchEntries();
    })();
  }, [fetchEntries]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("queue-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "queue_entries" },
        () => fetchEntries()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  // Pengaman: refresh berkala + update jam
  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now());
      fetchEntries();
    }, 30000);
    return () => clearInterval(t);
  }, [fetchEntries]);

  const waiting = entries.filter((e) => e.status === "waiting");
  const doneCount = entries.filter((e) => e.status === "done").length;
  const servingOf = (barberId: number) =>
    entries.find((e) => e.status === "serving" && e.barber_id === barberId);
  const nextFor = (barberId: number) =>
    waiting.find((e) => e.barber_id === null || e.barber_id === barberId);

  const serviceName = (id: number | null) =>
    services.find((s) => s.id === id)?.name ?? "-";
  const barberName = (id: number | null) =>
    id === null
      ? "Siapa saja"
      : barbers.find((b) => b.id === id)?.name ?? "-";

  const schedule = buildSchedule(entries, services, barbers, now);
  const clearMin = Math.round(
    Math.max(0, ...Object.values(schedule.freeIn))
  );

  async function updateEntry(id: string, patch: Partial<QueueEntry>) {
    setBusy(true);
    setError(null);
    const { error } = await supabase
      .from("queue_entries")
      .update(patch)
      .eq("id", id);
    setBusy(false);
    if (error) {
      setError("Gagal memperbarui: " + error.message);
      return;
    }
    await fetchEntries();
  }

  async function callNext(barber: Barber) {
    if (servingOf(barber.id)) return;
    const next = nextFor(barber.id);
    if (!next) return;
    setBusy(true);
    setError(null);
    // .eq("status","waiting") mencegah dua barber mengambil tiket yang sama
    const { data, error } = await supabase
      .from("queue_entries")
      .update({
        status: "serving",
        started_at: new Date().toISOString(),
        barber_id: barber.id,
      })
      .eq("id", next.id)
      .eq("status", "waiting")
      .select();
    setBusy(false);
    if (error) {
      setError("Gagal memanggil: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      setError("Antrean itu sudah diambil barber lain. Coba lagi.");
    }
    await fetchEntries();
  }

  function finishEntry(id: string) {
    updateEntry(id, {
      status: "done",
      finished_at: new Date().toISOString(),
    });
  }

  function skipEntry(id: string) {
    updateEntry(id, { status: "skipped" });
  }

  async function addWalkIn(e: React.FormEvent) {
    e.preventDefault();
    const cleanName = walkName.trim().slice(0, 40);
    if (!cleanName || !walkService) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.from("queue_entries").insert({
      customer_name: cleanName,
      service_id: walkService,
      barber_id: walkBarber === "any" ? null : walkBarber,
      source: "walkin",
      status: "waiting",
    });
    setBusy(false);
    if (error) {
      setError("Gagal menambah walk-in: " + error.message);
      return;
    }
    setWalkName("");
    await fetchEntries();
  }

  const field =
    "rounded-xl bg-neutral-800 px-3 py-3 text-base outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        <header className="flex items-center justify-between gap-3 pt-2">
          <div>
            <h1 className="text-2xl font-bold">Dashboard Barber</h1>
            <p className="text-sm text-neutral-300">
              Selesai hari ini: {doneCount} · Menunggu: {waiting.length}
              {clearMin > 0 && ` · Antrean habis ± ${clearMin} menit lagi`}
            </p>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-xl bg-neutral-800 px-3 py-2 text-sm font-semibold"
          >
            Keluar
          </button>
        </header>

        {error && (
          <p className="rounded-xl bg-red-950 p-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {/* Satu kartu per barber */}
        <section className="grid gap-3 sm:grid-cols-2">
          {barbers.map((b) => {
            const serving = servingOf(b.id);
            const next = nextFor(b.id);
            return (
              <div
                key={b.id}
                className={`rounded-2xl p-4 ${serving
                    ? "bg-neutral-800 text-white ring-1 ring-red-500/30"
                    : "bg-neutral-900 text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <BarberAvatar barber={b} size={44} />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold leading-tight">
                      {b.name}
                    </p>
                    <p
                      className={`text-sm ${serving ? "text-red-300" : "text-neutral-300"
                        }`}
                    >
                      {b.role ?? "Barber"} · {serving ? "Sibuk" : "Kosong"}
                    </p>
                  </div>
                </div>

                {serving ? (
                  <>
                    <p className="mt-3 text-5xl font-extrabold tabular-nums">
                      {ticketLabel(serving.ticket_number)}
                    </p>
                    <p className="mt-1 text-base font-semibold">
                      {serving.customer_name}
                    </p>
                    <p className="text-sm">
                      {serviceName(serving.service_id)} · mulai{" "}
                      {formatTime(serving.started_at)}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => finishEntry(serving.id)}
                        disabled={busy}
                        className="flex-1 rounded-xl bg-neutral-950 py-4 text-lg font-bold text-white disabled:opacity-50"
                      >
                        Selesai ✓
                      </button>
                      <button
                        onClick={() => skipEntry(serving.id)}
                        disabled={busy}
                        className="rounded-xl bg-white/50 px-4 py-4 text-base font-semibold disabled:opacity-50"
                      >
                        Lewati
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => callNext(b)}
                    disabled={busy || !next}
                    className="mt-4 w-full rounded-xl bg-white py-4 text-base font-bold text-neutral-950 disabled:opacity-40"
                  >
                    {next
                      ? `Panggil berikutnya (${ticketLabel(next.ticket_number)})`
                      : "Belum ada antrean"}
                  </button>
                )}
              </div>
            );
          })}
        </section>

        {/* Tambah walk-in */}
        <form
          onSubmit={addWalkIn}
          className="space-y-3 rounded-2xl bg-neutral-900 p-4"
        >
          <h2 className="text-lg font-bold">Tambah pelanggan walk-in</h2>
          <input
            value={walkName}
            onChange={(e) => setWalkName(e.target.value)}
            maxLength={40}
            placeholder="Nama pelanggan"
            className={`w-full ${field}`}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={walkService}
              onChange={(e) => setWalkService(Number(e.target.value))}
              className={field}
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={walkBarber}
              onChange={(e) =>
                setWalkBarber(
                  e.target.value === "any" ? "any" : Number(e.target.value)
                )
              }
              className={field}
            >
              <option value="any">Siapa saja</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-white py-3 text-base font-bold text-neutral-950 disabled:opacity-50"
          >
            Tambah ke antrean
          </button>
        </form>

        {/* Daftar menunggu */}
        <section className="space-y-2">
          <h2 className="text-lg font-bold">Daftar menunggu</h2>
          {waiting.length === 0 && (
            <p className="rounded-2xl bg-neutral-900 p-4 text-center text-neutral-300">
              Tidak ada yang menunggu.
            </p>
          )}
          {waiting.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-3 rounded-2xl bg-neutral-900 p-3"
            >
              <p className="w-16 text-center text-2xl font-bold tabular-nums">
                {ticketLabel(e.ticket_number)}
              </p>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold">
                  {e.customer_name}
                </p>
                <p className="text-sm text-neutral-300">
                  {serviceName(e.service_id)} · {barberName(e.barber_id)} ·{" "}
                  {e.source === "walkin" ? "walk-in" : "online"}
                </p>
                <p className="text-sm text-blue-300">
                  Perkiraan mulai{" "}
                  {clock(now + (schedule.startIn.get(e.id) ?? 0) * 60000)}
                </p>
              </div>
              <button
                onClick={() => skipEntry(e.id)}
                disabled={busy}
                className="rounded-xl bg-neutral-800 px-3 py-2 text-sm font-semibold disabled:opacity-30"
              >
                Lewati
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

/* ===================== HALAMAN ===================== */
export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-neutral-300">
        Memuat...
      </main>
    );
  }

  return session ? <Dashboard /> : <LoginForm />;
}