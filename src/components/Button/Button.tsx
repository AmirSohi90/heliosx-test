import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-blue-700 text-white hover:bg-blue-800",
    "disabled:bg-gray-300 disabled:text-gray-700",
    "aria-disabled:bg-gray-300 aria-disabled:text-gray-700",
  ),
  secondary: cn(
    "border border-gray-400 bg-white text-gray-900 hover:bg-gray-50",
    "disabled:border-gray-200 disabled:text-gray-500",
    "aria-disabled:border-gray-200 aria-disabled:text-gray-500",
  ),
};

export function Button({
  variant = "primary",
  type = "button",
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      type={type}
      {...buttonProps}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded px-6 font-semibold cursor-pointer",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700",
        "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed",
        variantClasses[variant],
        className,
      )}
    />
  );
}
