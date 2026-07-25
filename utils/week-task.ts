import { formatLocalDate } from "./date";

export const getDateString = (date: string) => {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getWeekDay = (date: string) => {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
  });
};

export const getDatesInRange = ({
  setWeekDays,
}: {
  setWeekDays: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const currentDate = new Date();
  const dayOfCurrentWeek = currentDate.getDay(); // 0 = Sunday

  // Offset back to Monday: Sunday is a special case (6 days back), else (day - 1)
  const offsetToMonday = dayOfCurrentWeek === 0 ? 6 : dayOfCurrentWeek - 1;

  const firstWeekDate = new Date(currentDate);
  firstWeekDate.setDate(currentDate.getDate() - offsetToMonday);

  // Clone lastWeekDate from firstWeekDate, not currentDate, to avoid month overflow
  const lastWeekDate = new Date(firstWeekDate);
  lastWeekDate.setDate(firstWeekDate.getDate() + 6);

  const weekDaysArray: string[] = [];
  const iterDate = new Date(firstWeekDate);

  while (iterDate <= lastWeekDate) {
    weekDaysArray.push(formatLocalDate(iterDate));
    iterDate.setDate(iterDate.getDate() + 1);
  }

  setWeekDays(weekDaysArray);
};
