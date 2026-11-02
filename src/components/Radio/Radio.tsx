"use client";

import { useId, type ComponentPropsWithoutRef } from "react";
import { useRadioGroupGuard } from "@/components/RadioGroup/RadioGroup";
import { cn } from "@/utils/cn";

type RadioProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label: string;
};

export function Radio({ label, className, id, ...inputProps }: RadioProps) {
  useRadioGroupGuard();
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn("flex min-h-11 items-center gap-3", className)}>
      <input
        {...inputProps}
        type="radio"
        id={inputId}
        className="size-6 cursor-pointer"
      />
      <label htmlFor={inputId} className="cursor-pointer">
        {label}
      </label>
    </div>
  );
}
