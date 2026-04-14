type Props = {
  message: string;
  isCalculated: boolean;
  hoursToWork: number | null;
  actualHoursToWork: number | null;
  selectedShifts: number[];
  shiftCounts: Record<number, number>;
  setShiftCounts: React.Dispatch<React.SetStateAction<Record<number, number>>>;
};

export function ResultDisplay({
  message,
  isCalculated,
  hoursToWork,
  actualHoursToWork,
  selectedShifts,
  shiftCounts,
  setShiftCounts,
}: Props) {
  if (message) return <strong>{message}</strong>;
  if (!isCalculated) return null;
  function calculateTotal(counts: Record<number, number>) {
    return Object.entries(counts).reduce(
      (sum, [shift, count]) => sum + Number(shift) * count,
      0,
    );
  }
  const overtime = actualHoursToWork! - (hoursToWork ?? 0);

  return (
    <div className="result-summary">
      <p>
        Required: <strong>{hoursToWork ?? 0}h</strong>
      </p>
      <p>
        Planned: <strong>{actualHoursToWork}h</strong>
        {overtime > 0 && <span className="overtime"> (+{overtime}h)</span>}
      </p>

      <div className="shift-counts">
        {selectedShifts.map((shift) => (
          <div key={shift}>
            <span>{shift}h shifts:</span>
            <input
              type="number"
              min={0}
              className="input"
              value={shiftCounts[shift] ?? ""}
              onChange={(e) => {
                // при событии изменения инпута мы отлавливаем событие и передаем его в функцию
                // в теле функции мы обращаемся к методу изменения состояния ShiftCounts, что по сути является
                // обьектом с возможными сменами и их колличеством
                // обращаемся к предыдущему состоянию, создаем переменную в которую записываем предыдущее состояние
                // + новое состояние, где ключ = акутальная смена, а значение = только что измененное значение
                setShiftCounts((prev) => {
                  const updated = {
                    ...prev,
                    [shift]: Number(e.target.value),
                  };
                  // целью является сумма часов, которую нам необходима работать, если там 0 или undefined, то бери 0
                  // Максимальная переработка больше необходимой суммы часов может быть 16
                  const target = hoursToWork ?? 0;
                  const MAX_OVERTIME = 16;
                  // актуальная сумма часов = функция для подсчета + актуальны обьект со сменами и их количеством
                  const total = calculateTotal(updated);
                  // если актуальная сумма меньше цели, то создаем новую сумму, которая равна актуальной сумме
                  if (total < target) {
                    let newTotal = total;
                    // пока новая сумма меньше цели, мы будем пускать цикл работать
                    while (newTotal < target) {
                      // перебираем доступные смены и убираем только ту, которую мы только что изменили(ее трогать нельзя)
                      const availableShifts = selectedShifts.filter(
                        (s) => s !== shift,
                      );
                      // ну и просто берем самую первую смену и помечаем ее как "оптимальную"
                      // создаем переменную которая будет показывать как мы близко от идеала, в начале она будет равна бексонечности
                      let best = availableShifts[0] ?? shift;
                      let minOver = Infinity;
                      // проходим перебором по каждой доступной смене
                      // инициализируем переменную которая будет показыать разницу между актуальной суммой + моментально перебираемая смен минус цель
                      // Если полученное число меньше прошлого minOver, значит новый minOver = актуальному числу, а лучшая смена будет акутальной
                      for (const s of availableShifts) {
                        const over = newTotal + s - target;

                        if (over < minOver) {
                          minOver = over;
                          best = s;
                        }
                      }
                      //находим эту смену и увеличиваем ее количество на 1
                      // а сумму увеличиваем на длительность этой смены
                      updated[best] = updated[best] + 1;
                      newTotal += best;
                    }
                    // возвращаем обновленный массив
                    return { ...updated };
                  } else if (total > target + MAX_OVERTIME) {
                    // если актуальная сумма больше цели
                    // то мы также создаем переменную для суммы
                    // и пока сумма больше цели + 16 цикл будет работать
                    let newTotal = total;

                    while (newTotal > target + MAX_OVERTIME) {
                      const availableShifts = selectedShifts.filter(
                        (s) => s !== shift,
                      );

                      // находим ПЕРВУЮ смену у которой есть count > 0
                      const shiftToDecrease = availableShifts.find(
                        (s) => (updated[s] ?? 0) > 0,
                      );

                      if (!shiftToDecrease) break;

                      updated[shiftToDecrease]--;
                      newTotal -= shiftToDecrease;
                    }
                  }
                  const finalTotal = calculateTotal(updated);
                  if (finalTotal > target + MAX_OVERTIME) {
                    return prev;
                  }
                  return { ...updated };
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
