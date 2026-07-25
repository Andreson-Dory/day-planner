export const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function calculateDuration(startTime: string, endTime: string): number {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return Math.max(0, endTotalMinutes - startTotalMinutes);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

export function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export const getDatesInRangeCreatePlan = (startDate: string) => {
  const dates: Record<string, any> = {};
  const weekDaysArray: string[] = [];

  // Force local-time parsing to avoid UTC day-shift
  const clickedDate = new Date(startDate + "T00:00:00");
  const dayOfWeek = clickedDate.getDay(); // 0 = Sunday

  if (dayOfWeek === 0) {
    const dateString = formatLocalDate(clickedDate);
    weekDaysArray.push(dateString);
    dates[dateString] = {
      startingDay: true,
      endingDay: true,
      color: "orange",
      textColor: "white",
    };
    return { markedDates: dates, weekDays: weekDaysArray };
  }

  // Monday of this week
  const firstWeekDate = new Date(clickedDate);
  firstWeekDate.setDate(clickedDate.getDate() - dayOfWeek + 1);

  // Sunday of this week — derived from firstWeekDate, not the original clicked date
  const lastWeekDate = new Date(firstWeekDate);
  lastWeekDate.setDate(firstWeekDate.getDate() + 6);

  // Iterate starting from the clicked date
  while (clickedDate <= lastWeekDate) {
    const dateString = formatLocalDate(clickedDate);
    weekDaysArray.push(dateString);
    dates[dateString] = {
      color: "orange",
      textColor: "white",
    };
    clickedDate.setDate(clickedDate.getDate() + 1);
  }

  const startDateString = formatLocalDate(new Date(startDate));
  const endDateString = formatLocalDate(lastWeekDate);

  dates[startDateString] = {
    ...dates[startDateString],
    startingDay: true,
    color: "orange",
    textColor: "white",
  };

  dates[endDateString] = {
    ...dates[endDateString],
    endingDay: true,
    color: "orange",
    textColor: "white",
  };

  return { markedDates: dates, weekDays: weekDaysArray };
};
