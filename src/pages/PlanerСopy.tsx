import classes from "./Planer.module.css";
import { useState } from "react";

export default function Planer() {
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
    const startOffset = getStartOffset(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const result: (number | null)[] = [];

    for (let i = 0; i < startOffset; i++) result.push(null);
    for (let day = 1; day <= daysInMonth; day++) result.push(day);

    return result;
  }

  const days = buildCalendar(year, month);

  return (
    <div className={classes.planner}>
      <h2 className={classes.title}>
        {now.toLocaleString("en-US", { month: "long" })} {year}
      </h2>

      <div className={classes.weekdays}>
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className={classes.calendar}>
        {days.map((day, index) =>
          day === null ? (
            <div key={index} className={classes.empty} />
          ) : (
            <div key={index} className={classes.day}>
              <div className={classes.date}>{day}</div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
