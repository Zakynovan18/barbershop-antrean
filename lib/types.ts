export type QueueStatus = "waiting" | "serving" | "done" | "skipped" | "cancelled";

export interface Service {
  id: number;
  name: string;
  duration_min: number;
  price: number | null;
  is_active: boolean;
  category: string | null;
  description: string | null;
  sort_order: number;
}

export interface Barber {
  id: number;
  name: string;
  role: string | null;
  photo_url: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface QueueEntry {
  id: string;
  queue_date: string;
  ticket_number: number;
  customer_name: string;
  service_id: number | null;
  barber_id: number | null; // null = "siapa saja"
  source: "online" | "walkin";
  status: QueueStatus;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
}