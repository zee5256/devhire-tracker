import { cn, initials } from "@/lib/utils";

const TONES = [
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

export function Avatar({
  name,
  email,
  image,
  size = "md",
  className,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dimension =
    size === "sm" ? "size-8 text-[11px]" : size === "lg" ? "size-14 text-lg" : "size-10 text-xs";
  const tone = TONES[(email?.charCodeAt(0) ?? 0) % TONES.length];

  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br font-semibold text-white",
        tone,
        dimension,
        className,
      )}
      aria-hidden
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" className="size-full object-cover" />
      ) : (
        initials(name, email)
      )}
    </span>
  );
}
