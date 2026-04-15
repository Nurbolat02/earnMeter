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
              onChange={(event) => {
                setShiftCounts((prev) => {
                  const updated = {
                    ...prev,
                    [shift]: Number(event.target.value),
                  };

                  const target = hoursToWork ?? 0;
                  const MAX_OVERTIME = 16;
                  const total = calculateTotal(updated);

                  if (total < target) {
                    let newTotal = total;
                    while (newTotal < target) {
                      const availableShifts = selectedShifts.filter(
                        (element) => element !== shift,
                      );
                      let best = availableShifts[0];
                      let minOver = Infinity;
                      for (const availableShift of availableShifts) {
                        const over = newTotal - target + best;
                        if (over < minOver) {
                          minOver = over;
                          best = availableShift;
                        }
                      }
                      updated[best] = updated[best] + 1;
                      newTotal = newTotal + best;
                    }
                    return { ...updated };
                  } else if (total > target + MAX_OVERTIME) {
                    let newTotal = total;
                    while (newTotal > target + MAX_OVERTIME) {
                      const availableShifts = selectedShifts.filter(
                        (element) => {
                          return element !== shift;
                        },
                      );
                      const shiftToDecrease = availableShifts.find(
                        (element) => {
                          return updated[element] > 0;
                        },
                      );
                      if (!shiftToDecrease) {
                        break;
                      }
                      updated[shiftToDecrease] = updated[shiftToDecrease] - 1;
                      newTotal = newTotal - shiftToDecrease;
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
