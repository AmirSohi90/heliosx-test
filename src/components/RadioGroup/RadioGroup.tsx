"use client";

import { createContext, useContext, useId, type ReactNode } from "react";
import { HelpText } from "@/components/HelpText/HelpText";

type RadioGroupProps = {
  legend: ReactNode;
  hint?: string;
  error?: string;
  children: ReactNode;
};

const RadioGroupContext = createContext(false);

export function useRadioGroupGuard() {
  if (!useContext(RadioGroupContext)) {
    throw new Error("Radio must be rendered inside a RadioGroup");
  }
}

export function RadioGroup({ legend, hint, error, children }: RadioGroupProps) {
  const idPrefix = useId();
  const hintId = `${idPrefix}-hint`;
  const errorId = `${idPrefix}-error`;

  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <RadioGroupContext value={true}>
      <fieldset aria-describedby={describedBy}>
        <legend>{legend}</legend>

        {hint && (
          <HelpText id={hintId} className="mt-2">
            {hint}
          </HelpText>
        )}

        {error && (
          <HelpText id={errorId} variant="error" className="mt-4">
            {error}
          </HelpText>
        )}

        <div className="mt-6 space-y-3">{children}</div>
      </fieldset>
    </RadioGroupContext>
  );
}
