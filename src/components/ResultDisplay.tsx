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
              value={shiftCounts[shift] === 0 ? "" : shiftCounts[shift]}
              // onChange={(e) => {
              //   console.log("🔵 INPUT CHANGE");
              //   console.log("Shift:", shift);
              //   console.log("New value:", e.target.value);

              //   setShiftCounts((prev) => {
              //     console.log("\n🟡 PREV STATE:", prev);

              //     const updated = {
              //       ...prev,
              //       [shift]: Number(e.target.value),
              //     };

              //     console.log("🟢 UPDATED (after input):", updated);

              //     const target = hoursToWork ?? 0;
              //     const MAX_OVERTIME = 16;

              //     const total = calculateTotal(updated);

              //     console.log("📊 TARGET:", target);
              //     console.log("📊 TOTAL:", total);

              //     // ======================
              //     // 📉 ЕСЛИ НЕ ХВАТАЕТ
              //     // ======================
              //     if (total < target) {
              //       console.log("⬇️ TOTAL < TARGET → START FILL");

              //       let newTotal = total;

              //       while (newTotal < target) {
              //         console.log("\n🔁 LOOP FILL");
              //         console.log("Current total:", newTotal);

              //         const availableShifts = selectedShifts.filter(
              //           (s) => s !== shift,
              //         );

              //         console.log("Available shifts:", availableShifts);

              //         let best = availableShifts[0] ?? shift;
              //         let minOver = Infinity;

              //         for (const s of availableShifts) {
              //           const over = newTotal + s - target;

              //           console.log(`Trying shift ${s}: over =`, over);

              //           if (over < minOver) {
              //             minOver = over;
              //             best = s;
              //           }
              //         }

              //         console.log("✅ BEST SHIFT:", best);

              //         updated[best] = (updated[best] ?? 0) + 1;
              //         newTotal += best;

              //         console.log("Updated counts:", updated);
              //         console.log("New total:", newTotal);
              //       }

              //       console.log("✅ FINAL UPDATED (FILL):", updated);
              //       return { ...updated };
              //     }

              //     // ======================
              //     // 📈 ЕСЛИ ПЕРЕБОР
              //     // ======================
              //     if (total > target + MAX_OVERTIME) {
              //       console.log("⬆️ TOTAL > LIMIT → START REDUCE");

              //       let newTotal = total;

              //       while (newTotal > target + MAX_OVERTIME) {
              //         console.log("\n🔁 LOOP REDUCE");
              //         console.log("Current total:", newTotal);

              //         const availableShifts = selectedShifts.filter(
              //           (s) => s !== shift,
              //         );

              //         console.log("Available shifts:", availableShifts);

              //         const shiftToDecrease = availableShifts.find(
              //           (s) => (updated[s] ?? 0) > 0,
              //         );

              //         console.log("Shift to decrease:", shiftToDecrease);

              //         if (!shiftToDecrease) {
              //           console.log("❌ NOTHING TO DECREASE → BREAK");
              //           break;
              //         }

              //         updated[shiftToDecrease]--;
              //         newTotal -= shiftToDecrease;

              //         console.log("Updated counts:", updated);
              //         console.log("New total:", newTotal);
              //       }
              //     }

              //     const finalTotal = calculateTotal(updated);

              //     console.log("\n🧾 FINAL TOTAL:", finalTotal);

              //     if (finalTotal > target + MAX_OVERTIME) {
              //       console.log("❌ TOO MUCH → REVERT");
              //       return prev;
              //     }

              //     console.log("✅ FINAL STATE:", updated);

              //     return { ...updated };
              //   });
              // }}
              onChange={(e) => {
                const value = e.target.value;

                setShiftCounts((prev) => {
                  const updated = {
                    ...prev,
                    [shift]: value === "" ? 0 : Number(value),
                  };
                  // целью является сумма часов, которую нам необходима работать, если там 0 или undefined, то бери 0
                  // Максимальная переработка больше необходимой суммы часов может быть 16
                  const target = hoursToWork ?? 0;
                  const MAX_OVERTIME = 8;
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
