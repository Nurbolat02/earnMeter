import { useEarnMeter } from "../hooks/useEarnMeter";

type Props = ReturnType<typeof useEarnMeter>;

export function EarnMeterForm({
  targetAmount, setTargetAmount,
  hourlyRate, setHourlyRate,
  selectedShifts, shiftOptions,
  toggleShift, handleFieldChange, calculate,
}: Pick<Props,
  "targetAmount" | "setTargetAmount" |
  "hourlyRate" | "setHourlyRate" |
  "selectedShifts" | "shiftOptions" |
  "toggleShift" | "handleFieldChange" | "calculate"
>) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); calculate(); }}
      className="form"
    >
      <input
        value={targetAmount ?? ""}
        onChange={(e) => handleFieldChange(Number(e.target.value), setTargetAmount)}
        type="number"
        placeholder="Target amount"
        className="input"
      />
      <input
        value={hourlyRate ?? ""}
        onChange={(e) => handleFieldChange(Number(e.target.value), setHourlyRate)}
        type="number"
        placeholder="Hourly rate"
        className="input"
      />

      <div className="shifts">
        <h3>Select shifts</h3>
        <div className="shift-options">
          {shiftOptions.map((shift) => (
            <label key={shift}>
              <input
                type="checkbox"
                checked={selectedShifts.includes(shift)}
                onChange={() => toggleShift(shift)}
              />
              {shift}h
            </label>
          ))}
        </div>
      </div>

      <button className="button">Calculate</button>
    </form>
  );
}