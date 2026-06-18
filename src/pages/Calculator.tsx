import { useState } from "react";
import classes from "./Calculator.module.css";

export default function Calculator() {
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [desiredSalary, setDesiredSalary] = useState<number | undefined>();
  const [hourlyRate, setHourlyRate] = useState<number | undefined>();

  function toggleShift(shift: number, checked: boolean) {
    setSelectedShifts((prev) => {
      if (checked) {
        return [...prev, shift];
      }

      return prev.filter(
        (currentlyIteratedShift) => currentlyIteratedShift !== shift,
      );
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
    if (
      desiredSalary === undefined ||
      hourlyRate === undefined ||
      selectedShifts === undefined
    ) {
      alert(
        "You need to inset your desired sallary, horly rate and desired shifts",
      );
      return;
    }
    const hoursToWork = desiredSalary / hourlyRate;
  }

  const availableShiftLengths = [8, 12, 14, 16];
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
            value={desiredSalary == 0 ? "" : desiredSalary}
            onChange={(e) => {
              changeStateThrouInput(e, setDesiredSalary);
            }}
            placeholder="Expected salary"
          />

          <input
            className={classes.input}
            value={hourlyRate == 0 ? "" : hourlyRate}
            onChange={(e) => {
              changeStateThrouInput(e, setHourlyRate);
            }}
            placeholder="Hourly rate"
          />

          <div className={classes["shift-options"]}>
            {availableShiftLengths.map((element) => {
              return (
                <label>
                  <input
                    type="checkbox"
                    onChange={(e) => toggleShift(element, e.target.checked)}
                  />
                  <span>{element}h</span>
                </label>
              );
            })}
          </div>

          <button
            className={classes.button}
            onClick={() => calculateShiftPlan()}
          >
            Calculate
          </button>
        </div>

        <div className={classes.result}>
          <p>Result will appear here</p>
        </div>
      </div>
    </div>
  );
}
