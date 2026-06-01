export const timeToMinutes = (time: string): number => {
  const [hours, minutes, seconds = '0'] = time.split(':');
  return Number(hours) * 60 + Number(minutes) + Number(seconds) / 60;
};

export const rangesOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
  const startMinutesA = timeToMinutes(startA);
  const endMinutesA = timeToMinutes(endA);
  const startMinutesB = timeToMinutes(startB);
  const endMinutesB = timeToMinutes(endB);

  return startMinutesA < endMinutesB && startMinutesB < endMinutesA;
};
