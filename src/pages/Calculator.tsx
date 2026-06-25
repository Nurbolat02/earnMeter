import { useState } from "react";
import classes from "./Calculator.module.css";

export default function Calculator() {
  const [hourlyRate, setHourlyRate] = useState<number>();
  const [desiredSalary, setDesiredSalary] = useState<number>();
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [shiftsForMonth, setShiftsForMonts] = useState<Record<number, number>>(
    {},
  );
  const AVAILABLESHIFTLENGTHS: number[] = [8, 10, 12, 14, 16];
  function toggleShift(shift: number, checked: boolean) {
    setSelectedShifts((prev) => {
      if (checked) {
        return [...prev, shift];
      }
      return prev.filter((s) => s !== shift);
    });
  }
  function changeStateThrouInput(
    event: React.ChangeEvent<HTMLInputElement, HTMLInputElement>,
    setStateFunction: React.Dispatch<React.SetStateAction<number | undefined>>,
  ) {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setStateFunction(Number(value));
    }
  }
  function calculateShiftPlan() {
    if (!desiredSalary || !hourlyRate) {
      return;
    }
    if (selectedShifts.length === 0) return;
    const result: Record<number, number> = {};

    let totalHours = 0;
    let index = 0;

    while (
      totalHours < Math.floor(Number(desiredSalary) / Number(hourlyRate))
    ) {
      const shift = selectedShifts[index];
      result[shift] = (result[shift] ?? 0) + 1;
      totalHours += shift;

      index = (index + 1) % selectedShifts.length;
    }
    setShiftsForMonts(result);
  }
  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <h1 className={classes.title}>EarnMeter</h1>

        <p className={classes.subtitle}>
          Calculate how many hours you need to work
        </p>

        <div className={classes.form}>
          <input
            className={classes.input}
            placeholder="Expected salary"
            value={desiredSalary ?? ""}
            onChange={(event) => {
              changeStateThrouInput(event, setDesiredSalary);
            }}
          />

          <input
            className={classes.input}
            placeholder="Hourly rate"
            value={hourlyRate ?? ""}
            onChange={(event) => {
              changeStateThrouInput(event, setHourlyRate);
            }}
          />

          <div className={classes["shift-options"]}>
            {AVAILABLESHIFTLENGTHS.map((element, index) => {
              return (
                <label key={index}>
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      toggleShift(element, event.target.checked);
                    }}
                  />
                  <span>{element}h</span>
                </label>
              );
            })}
          </div>

          <button
            className={classes.button}
            onClick={() => {
              calculateShiftPlan();
            }}
          >
            Calculate
          </button>
        </div>

        {Object.keys(shiftsForMonth).length > 0 && (
          <div className={classes.result}>
            <h3>Shift plan</h3>

            {Object.entries(shiftsForMonth).map(([shiftLength, shiftCount]) => {
              return (
                <div className={classes.shiftRow} key={shiftLength}>
                  <div>{shiftLength}h shift</div>

                  <input
                    className={classes.shiftInput}
                    value={shiftCount ? shiftCount : ""}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
