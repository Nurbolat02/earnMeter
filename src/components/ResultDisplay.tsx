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
                setShiftCounts((prev) => {
                  const updated = {
                    ...prev,
                    [shift]: Math.max(0, Number(e.target.value)),
                  };

                  const target = hoursToWork ?? 0;
                  const MAX_OVERTIME = 16;

                  const total = calculateTotal(updated);

                  if (total < target) {
                    let newTotal = total;

                    while (newTotal < target) {
                      const availableShifts = selectedShifts.filter(
                        (s) => s !== shift,
                      );

                      let best = availableShifts[0] ?? shift;
                      let minOver = Infinity;

                      for (const s of availableShifts) {
                        const over = newTotal + s - target;

                        if (over >= 0 && over < minOver) {
                          minOver = over;
                          best = s;
                        }
                      }

                      updated[best] = (updated[best] ?? 0) + 1;
                      newTotal += best;
                    }

                    return { ...updated };
                  }
                  if (total > target + MAX_OVERTIME) {
                    let newTotal = total;

                    while (newTotal > target + MAX_OVERTIME) {
                      const availableShifts = selectedShifts.filter(
                        (s) => s !== shift,
                      );

                      const biggest = Math.max(...availableShifts);

                      if ((updated[biggest] ?? 0) > 0) {
                        updated[biggest]--;
                        newTotal -= biggest;
                      } else {
                        break;
                      }
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
