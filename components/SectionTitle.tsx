import Reveal from "@/components/Reveal";

export default function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <Reveal>
      {eyebrow && (
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
          {eyebrow}
        </p>
      )}
      <h2 className="title-line font-display text-4xl leading-none text-white">
        {title}
      </h2>
    </Reveal>
  );
}