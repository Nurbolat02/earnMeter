export function distributeShifts(shifts: number[], target: number) {
  const counts: Record<number, number> = {};
  shifts.forEach((s) => (counts[s] = 0));

  const avgShift = shifts.reduce((sum, s) => sum + s, 0) / shifts.length;
  const totalShifts = Math.ceil(target / avgShift);

  for (let i = 0; i < totalShifts; i++) {
    counts[shifts[i % shifts.length]]++;
  }

  let totalHours = Object.entries(counts).reduce(
    (sum, [shift, count]) => sum + Number(shift) * count,
    0
  );

  while (totalHours < target) {
    let bestShift = shifts[0];
    let minOver = Infinity;

    for (const shift of shifts) {
      const over = totalHours + shift - target;
      if (over >= 0 && over < minOver) {
        minOver = over;
        bestShift = shift;
      }
    }

    counts[bestShift]++;
    totalHours += bestShift;
  }

  return { counts, totalHours };
}