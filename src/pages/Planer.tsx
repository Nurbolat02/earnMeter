import classes from "./Planer.module.css";
import { useState } from "react";

// ─── типы ───────────────────────────────────────────────────────────────────
type DayValue = number | "off";
type ShiftPlan = Record<number, number>;
type ScheduledDays = Record<number, DayValue>;

// ─── хелперы ────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartOffset(year: number, month: number) {
  // getDay() возвращает 0=воскресенье, поэтому сдвигаем чтобы неделя начиналась с понедельника
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

function buildCalendar(year: number, month: number): (number | null)[] {
  const offset = getStartOffset(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  const emptyCells = Array(offset).fill(null);
  const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return [...emptyCells, ...dayCells];
}

function getShiftLabel(value: DayValue) {
  if (value === "off") return "Day off";
  const start = 24 - value;
  return `${start}:00–24:00`;
}

// ─── компонент ──────────────────────────────────────────────────────────────
export default function Planer() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = buildCalendar(year, month);

  // план смен из калькулятора { 8: 3, 12: 2 } — сколько смен каждого типа нужно отработать
  const shiftPlan: ShiftPlan = JSON.parse(
    localStorage.getItem("shiftPlan") ?? "{}",
  );

  // сколько смен каждого типа осталось запланировать
  const [remainingShifts, setRemainingShifts] = useState<ShiftPlan>(shiftPlan);

  // что запланировано на каждый день { 1: 8, 5: "off", 10: 12 }
  const [scheduledDays, setScheduledDays] = useState<ScheduledDays>({});

  // какой день сейчас открыт в модалке (null = модалка закрыта)
  const [activeDay, setActiveDay] = useState<number | null>(null);

  // смены у которых ещё остались слоты
  const availableShifts = Object.entries(remainingShifts).filter(
    ([, count]) => count > 0,
  );

  const allShiftsUsed =
    Object.keys(shiftPlan).length > 0 && availableShifts.length === 0;

  // ── обработчики ────────────────────────────────────────────────────────────
  function handleSelectShift(shiftLength: DayValue) {
    if (!activeDay) return;

    // если на этот день уже была смена — возвращаем её в остаток
    const prevShift = scheduledDays[activeDay];
    if (prevShift && prevShift !== "off") {
      setRemainingShifts((prev) => ({
        ...prev,
        [prevShift]: prev[prevShift] + 1,
      }));
    }

    // записываем новый выбор
    setScheduledDays((prev) => ({ ...prev, [activeDay]: shiftLength }));

    // если выбрали рабочую смену — уменьшаем остаток
    if (shiftLength !== "off") {
      setRemainingShifts((prev) => ({
        ...prev,
        [shiftLength]: (prev[shiftLength] ?? 0) - 1,
      }));
    }

    setActiveDay(null);
  }

  function handleDeleteDay(day: number) {
    // возвращаем смену в остаток если это был рабочий день
    const prevShift = scheduledDays[day];
    if (prevShift && prevShift !== "off") {
      setRemainingShifts((prev) => ({
        ...prev,
        [prevShift]: (prev[prevShift] ?? 0) + 1,
      }));
    }

    setScheduledDays((prev) => {
      const updated = { ...prev };
      delete updated[day];
      return updated;
    });
  }

  // ── рендер ─────────────────────────────────────────────────────────────────
  return (
    <div className={classes.layout}>
      {/* КАЛЕНДАРЬ */}
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
              <div
                key={index}
                className={classes.day}
                onClick={() => setActiveDay(day)}
              >
                <div className={classes.date}>{day}</div>

                {scheduledDays[day] !== undefined && (
                  <>
                    <div className={classes.shiftTime}>
                      {getShiftLabel(scheduledDays[day])}
                    </div>
                    <div
                      className={classes.delete}
                      onClick={(e) => {
                        e.stopPropagation(); // чтобы не открывалась модалка
                        handleDeleteDay(day);
                      }}
                    >
                      <span className={classes.deleteIcon}>×</span>
                    </div>
                  </>
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {/* САЙДБАР */}
      <div className={classes.sidebar}>
        <h3 className={classes.sidebarTitle}>Shift summary</h3>

        {allShiftsUsed ? (
          <div className={classes.allDone}>🎉 All shifts scheduled!</div>
        ) : (
          <div className={classes.summaryList}>
            {Object.entries(remainingShifts).map(([shift, count]) => (
              <div key={shift} className={classes.summaryItem}>
                <span>{shift}h shift</span>
                <span>{count}x left</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* МОДАЛКА — всегда в DOM, показывается через класс .open */}
      <div
        className={`${classes.modalOverlay} ${activeDay ? classes.open : ""}`}
        onClick={() => setActiveDay(null)} // клик на фон закрывает
      >
        <div
          className={classes.modal}
          onClick={(e) => e.stopPropagation()} // клик внутри не закрывает
        >
          <h3 className={classes.modalTitle}>Day {activeDay}</h3>

          <div className={classes.modalContent}>
            {availableShifts.map(([shift, count]) => (
              <div
                key={shift}
                className={classes.option}
                onClick={() => handleSelectShift(Number(shift))}
              >
                {shift}h shift ({count} left)
              </div>
            ))}
            <div
              className={`${classes.option} ${classes.off}`}
              onClick={() => handleSelectShift("off")}
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
