import { createContext, useContext, useState } from "react";

type ShiftContextType = {
  shiftCounts: Record<number, number>;
  setShiftCounts: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  hoursToWork: number | null;
  setHoursToWork: React.Dispatch<React.SetStateAction<number | null>>;
};

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const [shiftCounts, setShiftCounts] = useState<Record<number, number>>({});

  const [hoursToWork, setHoursToWork] = useState<number | null>(null);

  return (
    <ShiftContext.Provider
      value={{
        shiftCounts,
        setShiftCounts,
        hoursToWork,
        setHoursToWork,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
}
export { ShiftContext };
// export function useShift() {
//   const ctx = useContext(ShiftContext);
//   if (!ctx) throw new Error("useShift must be used within ShiftProvider");
//   return ctx;
// }
