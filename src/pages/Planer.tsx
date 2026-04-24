import { useShift } from "../hooks/useShift";
import classes from "./Planer.module.css";
import { useState } from "react";

export default function Planer() {
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [daysToWork, setDaysToWork] = useState<Record<number, number | null>>(
    {},
  );
  const { shiftCounts, hoursToWork } = useShift();
  const [copyShiftCounts, setCopyShiftCounts] = useState(shiftCounts);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  function getShiftTime(hours: number) {
    if (hours === 0) {
      return "Day off";
    } else {
      const end = 24;
      const start = end - hours;

      return `${start}:00–${end}:00`;
    }
  }
  function calculateActualTotal() {
    return Object.entries(shiftCounts).reduce(
      (sum, [shift, count]) => sum + Number(shift) * count,
      0,
    );
  }

  function isNumber(val: any) {
    return val === +val;
  }

  const actualHours = calculateActualTotal();

  function handleSelectShift(value: number) {
    if (!activeDay) return;
    if (value === 0) {
      setDaysToWork((prev) => ({
        ...prev,
        [activeDay]: 0,
      }));
      setActiveDay(null);
      return;
    }
    setDaysToWork((prev) => ({
      ...prev,
      [activeDay]: value,
    }));
    setCopyShiftCounts((prev) => ({
      ...prev,
      [value]: prev[value] - 1,
    }));

    setActiveDay(null);
  }

  function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getStartOffset(year: number, month: number) {
    return (new Date(year, month, 1).getDay() + 6) % 7;
  }

  function buildCalendar(year: number, month: number) {
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
    <div className={classes.layout}>
      {/* LEFT - CALENDAR */}
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

                {daysToWork[day] || daysToWork[day] === 0 ? (
                  <div className={classes.shiftTime}>
                    {getShiftTime(daysToWork[day]!)}
                  </div>
                ) : (
                  <div
                    className={classes.addEvent}
                    onClick={() => setActiveDay(day)}
                  >
                    +
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT - SIDEBAR */}
      <div className={classes.sidebar}>
        <h3 className={classes.sidebarTitle}>Shift summary</h3>

        <div className={classes.summaryList}>
          {Object.entries(copyShiftCounts).map(([shift, count]) => (
            <div key={shift} className={classes.summaryItem}>
              <span>{shift}h</span>
              <span>{count}x</span>
              {/* <span>{Number(shift) * count}h</span> */}
            </div>
          ))}
        </div>

        {/* 🎯 TARGET */}
        <div className={classes.statsBox}>
          <div className={classes.statRow}>
            <span>Target</span>
            <span>{hoursToWork}h</span>
          </div>

          <div className={classes.statRow}>
            <span>Actual</span>
            <span>{actualHours}h</span>
          </div>

          <div className={classes.statRow}>
            <span>Overtime</span>
            <span
              className={
                actualHours >= hoursToWork! ? classes.good : classes.bad
              }
            >
              {actualHours - hoursToWork!}h
            </span>
          </div>
        </div>
      </div>
      {/* MODAL */}
      <div
        className={`${classes.modalOverlay} ${activeDay ? classes.open : ""}`}
        onClick={() => setActiveDay(null)}
      >
        <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
          {activeDay && <h3 className={classes.modalTitle}>Day {activeDay}</h3>}

          <div className={classes.modalContent}>
            {Object.keys(copyShiftCounts).map((shift) => {
              if (copyShiftCounts[Number(shift)] <= 0) return;
              return (
                <div
                  className={classes.option}
                  onClick={() => handleSelectShift(+shift)}
                >
                  {shift}h shift
                </div>
              );
            })}
            <div
              className={`${classes.option} ${classes.off}`}
              onClick={() => handleSelectShift(0)}
            >
              Day off
            </div>
          </div>

          <button className={classes.close} onClick={() => setActiveDay(null)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
