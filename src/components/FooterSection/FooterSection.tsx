import { cn } from "@/utils/cn";
import { useId, type ComponentPropsWithoutRef } from "react";

type FooterSectionProps = ComponentPropsWithoutRef<"section"> & {
  heading: string;
};

export function FooterSection({
  heading,
  children,
  className,
  ...sectionProps
}: FooterSectionProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      {...sectionProps}
      className={cn("font-semibold", className)}
    >
      <h2 id={headingId}>{heading}</h2>
      <div className="mt-2 space-y-1 text-sm">{children}</div>
    </section>
  );
}
