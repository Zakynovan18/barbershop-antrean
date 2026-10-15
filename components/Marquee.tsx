export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const base = items.length < 6 ? [...items, ...items, ...items] : items;
  const row = [...base, ...base];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span
            key={i}
            className="font-display flex shrink-0 items-center pr-8 text-3xl text-white/70"
          >
            {t}
            <span className={`pl-8 ${i % 2 === 0 ? "text-blue-400" : "text-red-400"}`}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}