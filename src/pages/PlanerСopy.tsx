import classes from "./Planer.module.css";
import { useState } from "react";

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
    const result: (number | null)[] = [];
    for (let i = 0; i < getStartOffset(year, month); i++) result.push(null);
    for (let i = 0; i < getDaysInMonth(year, month); i++) result.push(i + 1);
    return result;
  }

  function getShiftLabel(label: number | "off") {
    if (label === "off") {
      return "Day off";
    } else {
      const start = 24 - label;
      return `${start}:00-24:00`;
    }
  }

  const shiftPlan = JSON.parse(localStorage.getItem("shiftPlan") ?? "{}");
  const [remainingShifts, setRemainingShifts] =
    useState<Record<number, number>>(shiftPlan);
  const [scheduledDays, setScheduledDays] = useState<
    Record<number, number | "off">
  >({});
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const availableShifts = Object.entries(remainingShifts).filter(
    ([, value]) => value > 0,
  );
  const allShiftsUsed =
    Object.keys(shiftPlan).length > 0 && availableShifts.length === 0;
  const days = buildCalendar(year, month);
  // Из `localStorage` читаем `shiftPlan` — это объект который калькулятор туда сохранил, например `{ 8: 3, 12: 2 }`. Он говорит сколько смен каждого типа нужно отработать за месяц.

  // создаем состояние remainingShifts для смен, которые еще нужно отработать

  // создаем состояние scheduledDays для записи запланированных смен или выходных в течении месяца

  // создаем состояние activeDay для отметки какой день сейчас активен (чтобы открывать и закрывать модалку)

  // на будущее создаем массив availableShifts который будет включать в себя все оставшиеся смены из remainingShifts (если их значения больше чем 0)

  // считаем `allShiftsUsed` — все смены использованы если `shiftPlan` не пустой и `availableShifts` пустой.

  // handleSelectShift
  function handleSelectShift(shiftLength: number | "off") {
    if (activeDay === null) return;
    const prev = scheduledDays[activeDay];

    if (prev && prev !== "off") {
      setRemainingShifts((previous) => {
        return {
          ...previous,
          [prev]: previous[prev] + 1,
        };
      });
    }
    setScheduledDays((previous) => {
      return {
        ...previous,
        [activeDay]: shiftLength,
      };
    });

    if (shiftLength !== "off") {
      setRemainingShifts((previous) => {
        return {
          ...previous,
          [shiftLength]: previous[shiftLength] - 1,
        };
      });
    }
    setActiveDay(null);
  }
  // инициализируем функцию handleSelectShift, которая принимает в себя длинуСмены равную числу либо значению выходного дня (Off)
  // Проверяем активна ли вообще модалка?Если модалка активна, то значение activeDay будет отлично от null иначе выходим из функции.Инициализируем переменную Предыдущей смены, которая могла бы быть там и записываем туда значение из массива дней с событиями, обращаясь к актуальному дню.Первая проверка заключается в том, что мы проверяем, есть вообще что-то в переменной Предыдущей смены и если есть, не равно ли это значение "off".Если условие выполняется, то обращаемся к функции для изменения состояния оставшихся смен, потому что сейчас мы будем убирать актулаьно значение из выбранного дня.
  // Достаем предыдущее состояние, деструктурируем его , добавляем новое, чтобы обновить старое.
  // Добавляем ключ в виде ддины смены, которую мы должны были бы отработать в выбранный день и приписыаем ему его актуальное значение + 1.
  // Далее мы должны записать новую смену, которую юзер выбрал работать в этот день.Обращаемся к функции для ищменения состояния запланированых событий в календаре (смены/выходные), обращаемся к предыдущему состояню, деструктурируем его, добавляем в виде ключа актулаьный день и в виде значения переданную длинну смены/выходной.Далее проверям что собственно юзер выбрал, если это НЕ ВЫХОДНОЙ, значит это какая-то смена, значит нам нужно ее найти и уменьшить ее значение на -1.Ну и дальше нам нужно вырубить модалку.

  // если на этот день уже была смена — возвращаем её в остаток

  // записываем новый выбор

  // если выбрали рабочую смену — уменьшаем остаток

  // инициализируем функцию для удаления активности в выбранный день (handleDeleteDay). В функцию передаем актуальный номер дня, создаем переменную в которую будет помещать предыдущее значение дня, проверяем если оно вообще существует и если оно не равно выходному.Далее обращаемся к функции для изменения состояния оставшихся смен, дестркутрурируем его прошлое состояние и обновляем текущее, увеличивая его количество на 1
  // Ну и после этого можно уже непосредственно удалить событие из состояний событий в календаре.
  // Обращаемся к функции для изменения состояния запланированных действий в месяце, достаем предудущее состояние и помещаем ее в оьновленную переменную, далее удаляем из этой копии актуальное событие и возвращаем эту копию в качестве нового состояния

  function handleDeleteDay(day: number) {
    const prev = scheduledDays[day];
    if (prev && prev !== "off") {
      setRemainingShifts((previous) => {
        return {
          ...previous,
          [prev]: previous[prev] + 1,
        };
      });
    }
    setScheduledDays((previous) => {
      const updated = { ...previous };
      delete updated[day];
      return updated;
    });
  }
  function handleSave() {
    const daysInMonth = getDaysInMonth(year, month);
    const fullSchedule = { ...scheduledDays };

    for (let day = 1; day <= daysInMonth; day++) {
      if (fullSchedule[day] === undefined) {
        fullSchedule[day] = "off";
      }
    }

    const key = `schedule_${year}_${month}`;
    localStorage.setItem(key, JSON.stringify(fullSchedule));
  }
  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(new Date(year, month));
  return (
    <div className={classes.layout}>
      <div className={classes.planner}>
        <h2 className={classes.title}>
          {monthName} {year}
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
        {/* обращаюсь к масиву дней для актуального месяца и перебираю его методом map, достаю от туда каждый конкретный день + индекс.Если день равен null, значит клетка должна быть пустой, следовательно я просто передаю индекс в виде ключа и вертку для отображения пустой клетки
в обратном случае я передаю обвертку для полноценной клетки, передавая туда ключ в виде индекса + функцию для вызовы модалки при клике на день, + передаю сам день. Далее я проверяю если на этот день что-то запланированно, смена или выходной.Чтобы там не было запланировано, я передаю это в клетку и также добвляю возможность удалить событие + останавливаю всплытие события */}
        {/* в модалке будет составной класс Основной + дополнительный, который будет открывать/показывать саму модалку в случае, что день является активным, также вещаем прослушку по клику, чтобы при клике на фон, модалка закрывалась, однако внутри мы останавливаем пропогейшен чтобы клик не всплывал и не закрывал модальное окно.Передаем в тайт номер дня, далее для формирования самого контента модалки мы прозодимся методом map по состоянию доступных смен */}
        <div className={classes.calendar}>
          {days.map((element, index) => {
            if (element === null) {
              return <div key={index} className={classes.empty}></div>;
            } else {
              return (
                <div
                  key={index}
                  className={classes.day}
                  onClick={() => {
                    setActiveDay(element);
                  }}
                >
                  <div className={classes.date}>{element}</div>
                  {scheduledDays[element] !== undefined && (
                    <>
                      <div className={classes.shiftTime}>
                        {getShiftLabel(scheduledDays[element])}
                      </div>
                      <div
                        className={classes.delete}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteDay(element);
                        }}
                      >
                        <span className={classes.deleteIcon}>×</span>
                      </div>
                    </>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>

      <div className={classes.sidebar}>
        <h3 className={classes.sidebarTitle}>Shift summary</h3>
        <div className={classes.summaryList}>
          {allShiftsUsed ? (
            <div className={classes.allDone}>
              🎉 All shifts scheduled!
              <button className={classes.saveButton} onClick={handleSave}>
                Save schedule
              </button>
            </div>
          ) : (
            Object.entries(remainingShifts).map(([key, value]) => {
              return (
                <div className={classes.summaryItem}>
                  <span>{key}h shift</span>
                  <span>{value}x left</span>
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* className={classes.modalOverlay classes.open} */}
      <div
        className={`${classes.modalOverlay} ${activeDay ? classes.open : ""}`}
        onClick={() => {
          setActiveDay(null);
        }}
      >
        <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
          <h3 className={classes.modalTitle}>Day {activeDay}</h3>
          <div className={classes.modalContent}>
            {availableShifts.map(([shift, count]) => {
              return (
                <div
                  key={shift}
                  className={classes.option}
                  onClick={() => handleSelectShift(Number(shift))}
                >
                  {shift}h shift ({count} left)
                </div>
              );
            })}
            <div
              className={`${classes.option} ${classes.off}`}
              onClick={() => {
                handleSelectShift("off");
              }}
            >
              Day off
            </div>
          </div>
          <button
            className={classes.close}
            onClick={() => {
              setActiveDay(null);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
