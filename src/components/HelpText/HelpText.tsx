import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/cn";

type HelpTextVariant = "hint" | "error";

type HelpTextProps = ComponentPropsWithoutRef<"p"> & {
  variant?: HelpTextVariant;
};

const variantClasses: Record<HelpTextVariant, string> = {
  hint: "text-gray-600",
  error: "font-semibold text-red-700",
};

export function HelpText({
  variant = "hint",
  className,
  ...props
}: HelpTextProps) {
  return <p {...props} className={cn(variantClasses[variant], className)} />;
}
