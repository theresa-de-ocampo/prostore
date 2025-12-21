import { cn } from "@/lib/utils";

export default function ProductPrice({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  const stringValue = value.toFixed(2);
  const [wholeNumber, fractionalPart] = stringValue.split(".");

  return (
    <div className={cn("text-2xl", className)}>
      <sup className="text-sm">&#36;</sup>
      <span className="font-medium">{wholeNumber}</span>
      <sup className="text-sm">.{fractionalPart}</sup>
    </div>
  );
}
