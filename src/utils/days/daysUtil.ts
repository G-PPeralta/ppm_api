export function addWorkDays(startDate: Date, days: number) {
  if (isNaN(days)) {
    return;
  }
  if (!(startDate instanceof Date)) {
    return;
  }
  const dow = startDate.getDay();
  let daysToAdd = days;
  if (dow == 0) daysToAdd++;
  if (dow + daysToAdd >= 6) {
    const remainingWorkDays = daysToAdd - (5 - dow);
    daysToAdd += 2;
    if (remainingWorkDays > 5) {
      daysToAdd += 2 * Math.floor(remainingWorkDays / 5);
      if (remainingWorkDays % 5 == 0) daysToAdd -= 2;
    }
  }
  startDate.setDate(startDate.getDate() + daysToAdd);
  return startDate;
}
