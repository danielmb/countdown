export function getAdventStatus() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Christmas Day
  const christmasDay = new Date(currentYear, 11, 25);

  // 4th Advent is the Sunday before Christmas (or Dec 24 if it's a Sunday)
  const fourthAdvent = new Date(christmasDay);
  fourthAdvent.setDate(christmasDay.getDate() - christmasDay.getDay());
  if (christmasDay.getDay() === 0) {
    // If Xmas is Sunday, tradition varies, but often 4th advent is Dec 18
    fourthAdvent.setDate(fourthAdvent.getDate() - 7);
  }

  // Calculate previous Sundays
  const thirdAdvent = new Date(fourthAdvent);
  thirdAdvent.setDate(fourthAdvent.getDate() - 7);

  const secondAdvent = new Date(thirdAdvent);
  secondAdvent.setDate(thirdAdvent.getDate() - 7);

  const firstAdvent = new Date(secondAdvent);
  firstAdvent.setDate(secondAdvent.getDate() - 7);

  if (now >= fourthAdvent) return 4;
  if (now >= thirdAdvent) return 3;
  if (now >= secondAdvent) return 2;
  if (now >= firstAdvent) return 1;
  return 0;
}
