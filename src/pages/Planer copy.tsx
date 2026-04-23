import classes from "./Planer.module.css";
import { useState } from "react";

export default function Planer() {
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth();

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getStartOffset(year: number, month: number) {
    return (new Date(year, month, 1).getDay() + 6) % 7;
  }

  function buildCalendar(year: number, month: number) {
    const daysInMonth = getDaysInMonth(year, month);
    const startOffset = getStartOffset(year, month);

    const result: (number | null)[] = [];

    for (let i = 0; i < startOffset; i++) {
      result.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      result.push(day);
    }

    return result;
  }

  const days = buildCalendar(year, month);

  return (
    <div className={classes.planner}>
      <h2 className={classes.title}>
        {now.toLocaleString("en-US", { month: "long" })} {year}
      </h2>

      <div className={classes.weekdays}>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        <div>Sun</div>
      </div>

      <div className={classes.calendar}>
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className={classes.empty} />;
          }

          return (
            <div key={index} className={classes.day}>
              <div className={classes.date}>{day}</div>

              <div
                className={classes.addEvent}
                onClick={() => setActiveDay(day)}
              >
                +
              </div>
            </div>
          );
        })}
      </div>

      {activeDay && (
        <div
          className={classes.modalOverlay}
          onClick={() => setActiveDay(null)}
        >
          <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Day {activeDay}</h3>

            <button>8h shift</button>
            <button>12h shift</button>
            <button className={classes.off}>Day off</button>

            <button
              className={classes.close}
              onClick={() => setActiveDay(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
