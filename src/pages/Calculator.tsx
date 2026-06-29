import { useState } from "react";
import classes from "./Calculator.module.css";
import { Link } from "react-router";

export default function Calculator() {
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [desiredSalary, setDesiredSalary] = useState<string>("");
  const [selectedShifts, setSelectedShifts] = useState<number[]>([]);
  const [shiftsForMonth, setShiftsForMonts] = useState<Record<number, number>>(
    {},
  );
  const AVAILABLESHIFTLENGTHS: number[] = [8, 10, 12, 14, 16];
  function toggleShift(shift: number, checked: boolean) {
    setSelectedShifts((prev) => {
      if (checked) {
        return [...prev, shift];
      } else {
        return prev.filter((item) => item !== shift);
      }
    });
  }
  function changeStateThrouInput(
    event: React.ChangeEvent<HTMLInputElement>,
    setStateFunction: React.Dispatch<React.SetStateAction<string>>,
  ) {
    const value = event.target.value;
    if (!/^\d*$/.test(value)) return;
    setStateFunction(value);
  }
  function countShifts(
    result: Record<number, number>,
    selectedShifts: number[],
    sumOfWorkedHours: number,
    targetHours: number,
    setStateFunction: React.Dispatch<
      React.SetStateAction<Record<number, number>>
    >,
    index: number = 0,
  ) {
    while (sumOfWorkedHours < targetHours) {
      const shift = selectedShifts[index];
      result[shift] = result[shift] ? Number(result[shift]) + 1 : 1;
      sumOfWorkedHours = sumOfWorkedHours + Number(shift);
      index = (index + 1) % selectedShifts.length;
    }
    setStateFunction(result);
    localStorage.setItem("shiftPlan", JSON.stringify(result));
  }
  function changeShiftsForMonth(shiftLength: number, shiftCount: number) {
    const objWithNewShifts: number[] = selectedShifts.filter(
      (shift) => shift !== shiftLength,
    );
    const targetHours = Math.floor(Number(desiredSalary) / Number(hourlyRate));
    const result: Record<number, number> = { [shiftLength]: shiftCount };

    const sumOfWorkedHours = shiftLength * shiftCount;
    countShifts(
      result,
      objWithNewShifts,
      sumOfWorkedHours,
      targetHours,
      setShiftsForMonts,
    );
  }

  function calculateShiftPlan() {
    if (!desiredSalary || !hourlyRate || selectedShifts.length === 0) return;
    const targetHours = Math.floor(Number(desiredSalary) / Number(hourlyRate));
    const result: Record<number, number> = {};

    const sumOfWorkedHours = 0;
    countShifts(
      result,
      selectedShifts,
      sumOfWorkedHours,
      targetHours,
      setShiftsForMonts,
    );
  }
  const plannedHours = Object.entries(shiftsForMonth).reduce(
    (acc, [shift, count]) => acc + Number(shift) * Number(count),
    0,
  );

  const estimatedSalary = plannedHours * Number(hourlyRate);
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
            value={desiredSalary}
            onChange={(event) => changeStateThrouInput(event, setDesiredSalary)}
          />

          <input
            className={classes.input}
            placeholder="Hourly rate"
            value={hourlyRate}
            onChange={(event) => changeStateThrouInput(event, setHourlyRate)}
          />

          <div className={classes["shift-options"]}>
            {AVAILABLESHIFTLENGTHS.map((item) => {
              return (
                <label key={item}>
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      toggleShift(item, event.target.checked);
                    }}
                  />
                  <span>{item}h</span>
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
        {Object.entries(shiftsForMonth).length > 0 && (
          <>
            <div className={classes.result}>
              <h3>Shift plan</h3>

              {Object.entries(shiftsForMonth).map(([key, value]) => (
                <div key={key} className={classes.shiftRow}>
                  <div>{key}h shift</div>
                  <input
                    className={classes.shiftInput}
                    value={value === 0 ? "" : value}
                    onChange={(event) => {
                      changeShiftsForMonth(
                        Number(key),
                        Number(event.target.value),
                      );
                    }}
                  />
                </div>
              ))}
            </div>

            <div className={classes.summary}>
              <div className={classes.summaryRow}>
                <span>Required hours</span>
                <span>
                  {Math.floor(Number(desiredSalary) / Number(hourlyRate))}h
                </span>
              </div>

              <div className={classes.summaryRow}>
                <span>Planned hours</span>
                <span>{plannedHours}h</span>
              </div>

              <div className={classes.summaryRow}>
                <span>Estimated salary</span>
                <span>
                  {estimatedSalary}
                  czk
                </span>
              </div>
              <div className={classes.nextStep}>
                <p className={classes.nextStepText}>
                  Continue by distributing these shifts across this month's
                  calendar.
                </p>

                <Link className={classes.button} to="/planer">
                  Plan shifts in calendar
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
