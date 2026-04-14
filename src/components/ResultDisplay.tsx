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
              className="input"
              value={shiftCounts[shift] ?? ""}
              onChange={(e) =>
                setShiftCounts((prev) => ({
                  ...prev,
                  [shift]: Number(e.target.value),
                }))
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}
