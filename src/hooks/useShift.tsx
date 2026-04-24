import { useContext } from "react";
import { ShiftContext } from "../context/ShiftContext.tsx";

export function useShift() {
  const ctx = useContext(ShiftContext);

  if (!ctx) {
    throw new Error("useShift must be used within ShiftProvider");
  }

  return ctx;
}
