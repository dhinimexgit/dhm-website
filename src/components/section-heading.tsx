type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: Props) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";
  return (
    <div className={`flex flex-col gap-2 ${alignment} ${className}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-red">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold text-brand-navy sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base text-slate-600 sm:text-lg">{description}</p>
      )}
    </div>
  );
}

