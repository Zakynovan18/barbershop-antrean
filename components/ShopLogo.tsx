import { Scissors } from "lucide-react";
import { SHOP } from "@/lib/shop";

export default function ShopLogo({ size = 80 }: { size?: number }) {
  const style = { width: size, height: size };
  return SHOP.logo ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={SHOP.logo}
      alt={SHOP.name}
      style={style}
      className="shrink-0 rounded-full bg-white object-contain p-1 shadow-[0_0_24px_rgba(255,255,255,0.16)]"
    />
  ) : (
    <div
      style={style}
      className="flex shrink-0 items-center justify-center rounded-full bg-white text-neutral-950 shadow-[0_0_24px_rgba(255,255,255,0.16)]"
    >
      <Scissors size={Math.round(size * 0.42)} />
    </div>
  );
}