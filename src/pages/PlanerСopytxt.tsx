import classes from "./Planer.module.css";
import { useState } from "react";

// ─── типы ───────────────────────────────────────────────────────────────────
type DayValue = number | "off";
type ShiftPlan = Record<number, number>;
type ScheduledDays = Record<number, DayValue>;

// ─── хелперы ────────────────────────────────────────────────────────────────
// getDaysInMonth;
// getStartOffset;
// buildCalendar;
// getShiftLabel;

// ─── компонент ──────────────────────────────────────────────────────────────
export default function Planer() {
  // Берём текущую дату, из неё достаём год и месяц, и сразу строим массив `days` для календаря.

  // Из `localStorage` читаем `shiftPlan` — это объект который калькулятор туда сохранил, например `{ 8: 3, 12: 2 }`. Он говорит сколько смен каждого типа нужно отработать за месяц.

  // создаем состояние remainingShifts для смен, которые еще нужно отработать

  // создаем состояние scheduledDays для записи запланированных смен или выходных в течении месяца

  // создаем состояние activeDay для отметки какой день сейчас активен (чтобы открывать и закрывать модалку)

  // на будущее создаем массив availableShifts который будет включать в себя все оставшиеся смены из remainingShifts (если их значения больше чем 0)

  // считаем `allShiftsUsed` — все смены использованы если `shiftPlan` не пустой и `availableShifts` пустой.

  // handleSelectShift


    // инициализируем функцию handleSelectShift, которая принимает в себя длинуСмены равную числу либо значению выходного дня (Off)
    // Проверяем активна ли вообще модалка?Если модалка активна, то значение activeDay будет отлично от null иначе выходим из функции.Инициализируем переменную Предыдущей смены, которая могла бы быть там и записываем туда значение из массива дней с событиями, обращаясь к актуальному дню.Первая проверка заключается в том, что мы проверяем, есть вообще что-то в переменной Предыдущей смены и если есть, не равно ли это значение "off".Если условие выполняется, то обращаемся к функции для изменения состояния оставшихся смен, потому что сейчас мы будем убирать актулаьно значение из выбранного дня.
    // Достаем предыдущее состояние, деструктурируем его , добавляем новое, чтобы обновить старое.
    // Добавляем ключ в виде ддины смены, которую мы должны были бы отработать в выбранный день и приписыаем ему его актуальное значение + 1.Далее мы должны записать новую смену, которую юзер выбрал работать в этот день.Обращаемся к функции для ищменения состояния запланированых событий в календаре (смены/выходные), обращаемся к предыдущему состояню, деструктурируем его, добавляем в виде ключа актулаьный день и в виде значения переданную длинну смены/выходной.Далее проверям что собственно юзер выбрал, если это НЕ ВЫХОДНОЙ, значит это какая-то смена, значит нам нужно ее найти и уменьшить ее значение на -1.Ну и дальше нам нужно вырубить модалку.


    // если на этот день уже была смена — возвращаем её в остаток


    // записываем новый выбор

    // если выбрали рабочую смену — уменьшаем остаток

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
