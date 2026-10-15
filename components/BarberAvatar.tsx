import type { Barber } from "@/lib/types";

export default function BarberAvatar({
  barber,
  size = 48,
}: {
  barber: Pick<Barber, "name" | "photo_url">;
  size?: number;
}) {
  const initials = barber.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const style = { width: size, height: size };

  return barber.photo_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={barber.photo_url}
      alt={barber.name}
      style={style}
      className="shrink-0 rounded-full object-cover"
    />
  ) : (
    <div
      style={style}
      className="flex shrink-0 items-center justify-center rounded-full bg-white font-bold text-neutral-950"
    >
      {initials}
    </div>
  );
}