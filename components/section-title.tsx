interface SectionTitleProps {
  text: string;
  icon: React.ElementType;
  className?: string;
}

export function SectionTitle({
  text,
  icon: Icon,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={`w-fit flex items-center gap-2 border-2 px-4 py-3 rounded-lg bg-primary-foreground ${
        className || ""
      }`}
    >
      <Icon className="w-5 h-5 text-green-500" />
      <p className="text-md font-bold">{text}</p>
    </div>
  );
}
