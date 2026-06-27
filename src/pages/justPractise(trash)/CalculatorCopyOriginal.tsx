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

  // toggleShift
  // принимает смену (число) и состояние чекд (булин)
  // обращаемся к функции изменения состояния selectedShifts,
  // передаем предыдущее состояние и проверяем состоянек чекд.
  // Если оно правдиво, тогда добавляем переданную смену
  // к нашему состоянию selectedShifts, иначе наборото удаляем переданную смену из нашего стейта

  // changeStateThrouInput
  // передаем ему событие, передаем функцию для изменения состояния
  // обращаемя к событию, достаем из него влью и записываем в переменную
  // проверяем если валью является числом и только после этого передаем его в функцию для изменения состояния
  // changeShiftsForMonth
  // передаем длину смены и количество эимх смен
  // инициализируем переменную в которую будем записвать новый массив со доступынми сменами кроме той, кто сейчас редактирует юзер
  // инициализируем переменную в которую поместим количество часов, которое нам нужно отработать
  //  инициализируем обьект в который сразу поместим только что измнененную смены юзером
  // Инициализируем переменную, которая будет служить аккамулятором для отработанных часов И этот аккамулятор должен быть меньше чем необходимое количество отработанных часов ОДНОВРЕМЕННО с тем, что длина массива смен должна быть больше 0 (не быть пустой)
  // в обьект Результаты мы инициализируеи переменную для каждой актуально перебираемой смены (это просто число) и проверяем, если ли в обьекте результат уже данная смена.Если нет, то мы запишем туда 0, если есть, то прибавим к ней 1, а потом увеличим общее количество отработанных часов на эту 1 смену
  // не забываем сдвигать индекс таким образом, чтобы он ходил по кругу
  // В конце полученный результат передам в функцию для изменения состояния смен на месяц

  // calculateShiftPlan
  // проверяем чтобы перемнные с зп в час и желаемой зп в месяц имели внутри себя значения
  // Также проверяем чтобы длина масива с выбранными сменами не была равна нулю (не была пустой)
  // далее решаем также, как выше
  return (
    <div className={classes.wrapper}>
      <div className={classes.card}>
        <h1 className={classes.title}>EarnMeter</h1>

        <p className={classes.subtitle}>
          Calculate how many hours you need to work
        </p>

        <div className={classes.form}>
          <input className={classes.input} placeholder="Expected salary" />

          <input className={classes.input} placeholder="Hourly rate" />

          <div className={classes["shift-options"]}>
            <label>
              <input type="checkbox" />
              <span>8h</span>
            </label>

            <label>
              <input type="checkbox" />
              <span>10h</span>
            </label>

            <label>
              <input type="checkbox" />
              <span>12h</span>
            </label>

            <label>
              <input type="checkbox" />
              <span>14h</span>
            </label>

            <label>
              <input type="checkbox" />
              <span>16h</span>
            </label>
          </div>

          <button className={classes.button}>Calculate</button>
        </div>
        <div className={classes.result}>
          <h3>Shift plan</h3>
          <div className={classes.shiftRow}>
            <div>8h shift</div>
            <input className={classes.shiftInput} />
          </div>
          <div className={classes.shiftRow}>
            <div>10h shift</div>
            <input className={classes.shiftInput} />
          </div>
          <div className={classes.shiftRow}>
            <div>12h shift</div>
            <input className={classes.shiftInput} />
          </div>
        </div>
      </div>
    </div>
  );
}
