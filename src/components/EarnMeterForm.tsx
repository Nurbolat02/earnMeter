import { useEarnMeter } from "../hooks/useEarnMeter";
import { useShift } from "../hooks/useShift";
import classes from "../pages/Calculator.module.css";

type Props = ReturnType<typeof useEarnMeter>;

export function EarnMeterForm({
  targetAmount,
  hourlyRate,
  setHourlyRate,
  selectedShifts,
  shiftOptions,
  toggleShift,
  handleFieldChange,
  calculate,
  setTargetAmount,
}: Pick<
  Props,
  | "targetAmount"
  | "hourlyRate"
  | "setHourlyRate"
  | "selectedShifts"
  | "shiftOptions"
  | "toggleShift"
  | "handleFieldChange"
  | "calculate"
  | "setTargetAmount"
>) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        calculate();
      }}
      className={classes.form}
    >
      <input
        value={targetAmount === 0 ? "" : targetAmount}
        onChange={(e) =>
          handleFieldChange(Number(e.target.value), setTargetAmount)
        }
        type="number"
        placeholder="Target amount"
        className={classes.input}
      />

      <input
        value={hourlyRate === 0 ? "" : hourlyRate}
        onChange={(e) =>
          handleFieldChange(Number(e.target.value), setHourlyRate)
        }
        type="number"
        placeholder="Hourly rate"
        className={classes.input}
      />

      <div className={classes.shifts}>
        <h3>Select shifts</h3>

        <div className={classes["shift-options"]}>
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

      <button className={classes.button}>Calculate</button>
    </form>
  );
}
