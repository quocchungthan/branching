export const stringToDate = (dateString: string): Date => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format ' + dateString);
  }

  return date;
};

export const earlier = (date1: Date, date2?: Date) => {
  return date1.getTime() < (date2 ?? new Date()).getTime();
};

export const addDays = (current: Date, numberOfDaysToAdd: number) => {
  const newDate = new Date(current);
  newDate.setDate(current.getDate() + numberOfDaysToAdd);

  return newDate;
};
