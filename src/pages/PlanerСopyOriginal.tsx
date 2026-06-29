import classes from "./Planer.module.css";
import { useState } from "react";

// ─── типы ───────────────────────────────────────────────────────────────────
type DayValue = number | "off";
type ShiftPlan = Record<number, number>;
type ScheduledDays = Record<number, DayValue>;

// ─── хелперы ────────────────────────────────────────────────────────────────
function getShiftLabel(value: DayValue) {
  if (value === "off") return "Day off";
  const start = 24 - value;
  return `${start}:00–24:00`;
}

// ─── компонент ──────────────────────────────────────────────────────────────
export default function Planer() {
  // Берём текущую дату, из неё достаём год и месяц, и сразу строим массив `days` для календаря.
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
    const emptyCells = getStartOffset(year, month);
    const dayCells = getDaysInMonth(year, month);
    const fullMonth: (number | null)[] = [];
    for (let i = 0; i < emptyCells; i++) fullMonth.push(null);
    for (let i = 0; i < dayCells; i++) fullMonth.push(i + 1);
  }

  const shiftPlan: Record<number, number> = JSON.parse(
    localStorage.getItem("shiftPlan") ?? "{}",
  );
  // Из `localStorage` читаем `shiftPlan` — это объект который калькулятор туда сохранил, например `{ 8: 3, 12: 2 }`. Он говорит сколько смен каждого типа нужно отработать за месяц.
  const [remainingShifts, setRemainingShifts] =
    useState<Record<number, number>>(shiftPlan);
  const [scheduledDays, setScheduledDays] = useState<
    Record<number, number | "off">
  >({});
  const [activeDay, setActiveDay] = useState<number | null>(null);
  // Дальше три стейта. `remainingShifts` — копия `shiftPlan`, но она будет уменьшаться по мере того как ты расставляешь смены по дням. `scheduledDays` — пустой объект, в который записывается что запланировано на каждый день, например `{ 2: 8, 5: "off" }`. `activeDay` — номер дня у которого открыта модалка, `null` если модалка закрыта.
  const availableShifts = Object.entries(remainingShifts).filter(
    ([, count]) => count > 0,
  );
  const allShiftsUsed =
    Object.entries(shiftPlan).length !== 0 && availableShifts.length === 0;
  // Из `remainingShifts` фильтруем `availableShifts` — только те смены у которых ещё остались слоты. И считаем `allShiftsUsed` — все смены использованы если `shiftPlan` не пустой и `availableShifts` пустой.

  // handleSelectShift

  function handleSelectShift(shiftLength: DayValue) {
    // инициализируем функцию handleSelectShift, которая принимает в себя длинуСмены равную числу либо значению выходного дня (Off)
    // Проверяем активна ли вообще модалка?Если модалка активна, то значение activeDay будет отлично от null иначе выходим из функции.Инициализируем переменную Предыдущей смены, которая могла бы быть там и записываем туда значение из массива дней с событиями, обращаясь к актуальному дню.Первая проверка заключается в том, что мы проверяем, есть вообще что-то в переменной Предыдущей смены и если есть, не равно ли это значение "off".Если условие выполняется, то обращаемся к функции для изменения состояния оставшихся смен, потому что сейчас мы будем убирать актулаьно значение из выбранного дня.
    // Достаем предыдущее состояние, деструктурируем его , добавляем новое, чтобы обновить старое.
    // Добавляем ключ в виде ддины смены, которую мы должны были бы отработать в выбранный день и приписыаем ему его актуальное значение + 1.Далее мы должны записать новую смену, которую юзер выбрал работать в этот день.Обращаемся к функции для ищменения состояния запланированых событий в календаре (смены/выходные), обращаемся к предыдущему состояню, деструктурируем его, добавляем в виде ключа актулаьный день и в виде значения переданную длинну смены/выходной.Далее проверям что собственно юзер выбрал, если это НЕ ВЫХОДНОЙ, значит это какая-то смена, значит нам нужно ее найти и уменьшить ее значение на -1.Ну и дальше нам нужно вырубить модалку.
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
  // `handleDeleteDay` вызывается когда нажал крестик на дне. Если там была рабочая смена — возвращаем её в `remainingShifts`. Потом удаляем день из `scheduledDays` через `delete`.

  // ── рендер ─────────────────────────────────────────────────────────────────
  return (
    <div className={classes.layout}>
      <div className={classes.planner}>
        <h2 className={classes.title}>June 2026</h2>

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
          <div className={classes.empty}></div>

          <div className={classes.day}>
            <div className={classes.date}>1</div>
          </div>

          <div className={classes.day}>
            <div className={classes.date}>2</div>
            <div className={classes.shiftTime}>16:00–24:00</div>
            <div className={classes.delete}>
              <span className={classes.deleteIcon}>×</span>
            </div>
          </div>

          <div className={classes.day}>
            <div className={classes.date}>3</div>
            <div className={classes.shiftTime}>Day off</div>
            <div className={classes.delete}>
              <span className={classes.deleteIcon}>×</span>
            </div>
          </div>

          <div className={classes.day}>
            <div className={classes.date}>4</div>
          </div>
          <div className={classes.day}>
            <div className={classes.date}>5</div>
          </div>
          <div className={classes.day}>
            <div className={classes.date}>6</div>
          </div>
        </div>
      </div>

      <div className={classes.sidebar}>
        <h3 className={classes.sidebarTitle}>Shift summary</h3>
        <div className={classes.summaryList}>
          <div className={classes.summaryItem}>
            <span>8h shift</span>
            <span>3x left</span>
          </div>
          <div className={classes.summaryItem}>
            <span>12h shift</span>
            <span>1x left</span>
          </div>
        </div>
      </div>

      <div className={classes.modalOverlay}>
        <div className={classes.modal}>
          <h3 className={classes.modalTitle}>Day 4</h3>
          <div className={classes.modalContent}>
            <div className={classes.option}>8h shift (3 left)</div>
            <div className={classes.option}>12h shift (1 left)</div>
            <div className={`${classes.option} ${classes.off}`}>Day off</div>
          </div>
          <button className={classes.close}>Close</button>
        </div>
      </div>
    </div>
  );
}
