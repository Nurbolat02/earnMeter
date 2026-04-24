import { useState } from "react";
import { distributeShifts } from "../utils/distributeShifts";
import { useShift } from "./useShift";

const SHIFT_OPTIONS = [8, 10, 12, 14, 16];

export function useEarnMeter() {
  const { shiftCounts, setShiftCounts, hoursToWork, setHoursToWork } =
    useShift();
  const [hourlyRate, setHourlyRate] = useState<number>();
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [targetAmount, setTargetAmount] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [isCalculated, setIsCalculated] = useState(false);

  // производное значение — не состояние
  const actualHoursToWork = isCalculated
    ? Object.entries(shiftCounts).reduce(
        (sum, [shift, count]) => sum + Number(shift) * count,
        0,
      )
    : null;

  // пересчёт при смене чекбоксов

  function handleFieldChange(
    value: number,
    setter: React.Dispatch<React.SetStateAction<number | undefined>>,
  ) {
    setter(value);
    setIsCalculated(false);
  }

  function validate(): string | null {
    if (!targetAmount || !hourlyRate)
      return "Please input target amount and hourly rate";
    if (targetAmount <= 0 || hourlyRate <= 0)
      return "Please use only positive numbers more than 0";
    if (selectedShifts.length === 0)
      return "Please choose length of shifts you would like to work";
    return null;
  }

  function calculate() {
    const error = validate();
    if (error) {
      setMessage(error);
      return;
    }

    setMessage("");
    const required = Math.ceil(targetAmount! / hourlyRate!);
    const { counts } = distributeShifts(selectedShifts, required);

    setHoursToWork(required);
    setShiftCounts(counts);
    setIsCalculated(true);
  }

  function toggleShift(shift: number) {
    setSelectedShifts((prev) =>
      prev.includes(shift) ? prev.filter((s) => s !== shift) : [...prev, shift],
    );
  }
  return {
    targetAmount,
    setTargetAmount,
    hourlyRate,
    setHourlyRate,
    selectedShifts,
    shiftCounts,
    setShiftCounts,
    hoursToWork,
    actualHoursToWork,
    message,
    isCalculated,
    shiftOptions: SHIFT_OPTIONS,
    toggleShift,
    handleFieldChange,
    calculate,
  };
}
