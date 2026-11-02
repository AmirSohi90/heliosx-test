"use client";

import { createContext, useContext, useId, type ReactNode } from "react";
import { HelpText } from "@/components/HelpText/HelpText";

type FieldsetProps = {
  legend: ReactNode;
  hint?: string;
  error?: string;
  children: ReactNode;
};

const FieldsetContext = createContext(false);

export function useFieldsetGuard(componentName: string) {
  if (!useContext(FieldsetContext)) {
    throw new Error(`${componentName} must be rendered inside a Fieldset`);
  }
}

export function Fieldset({ legend, hint, error, children }: FieldsetProps) {
  const idPrefix = useId();
  const hintId = `${idPrefix}-hint`;
  const errorId = `${idPrefix}-error`;

  const describedBy =
    [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldsetContext value={true}>
      <fieldset aria-describedby={describedBy}>
        <legend>{legend}</legend>

        {hint && (
          <HelpText id={hintId} className="mt-2">
            {hint}
          </HelpText>
        )}

        {error && (
          <HelpText id={errorId} variant="error">
            {error}
          </HelpText>
        )}

        <div className="space-y-3">{children}</div>
      </fieldset>
    </FieldsetContext>
  );
}
