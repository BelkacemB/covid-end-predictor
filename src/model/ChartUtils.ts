export const formatDateAxis = (date: Date) => {
  return date.toLocaleString("en-GB", { month: "short" });
};

export const getFirstDaysOfMonths = (dataObjects: any[]) => {
  return dataObjects.filter((e) => e.date.getDate() === 1).map((f) => f.date);
};
