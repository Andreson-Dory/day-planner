import { CreateTask } from "@/constant/types/task";
import { RepeatFrequency, TimestampTrigger, TriggerType } from "@notifee/react-native";

export function buildTrigger(task: CreateTask, date: Date): TimestampTrigger {
  const triggerDate = task.isRepetitive ? getNextRepeatDate(task, date) : date;
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: triggerDate.getTime(),
  };

  if (!task.isRepetitive) {
    return trigger;
  }

  switch (task.repeatType) {
    case "daily":
      trigger.repeatFrequency = RepeatFrequency.DAILY;
      break;
    case "weekly":
      trigger.repeatFrequency = RepeatFrequency.WEEKLY;
      break;
    /* case "monthly":
      break; */
    default:
      return { ...trigger, timestamp: triggerDate.getTime() };
  }

  return trigger;
}

function getNextRepeatDate(task: CreateTask, date: Date): Date {
  const now = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();

  if (task.repeatType === "daily") {
    const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    if (nextDate <= now) nextDate.setDate(nextDate.getDate() + 1);
    return nextDate;
  }

  if (task.repeatType === "weekly") {
    const nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    const daysUntil = (date.getDay() - nextDate.getDay() + 7) % 7;
    nextDate.setDate(nextDate.getDate() + daysUntil);
    if (nextDate <= now) nextDate.setDate(nextDate.getDate() + 7);
    return nextDate;
  }

  if (task.repeatType === "monthly") {
    for (let monthOffset = 0; monthOffset < 24; monthOffset += 1) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
      const lastDay = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
      if (date.getDate() > lastDay) continue;

      const nextDate = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth(),
        date.getDate(),
        hour,
        minute,
      );
      if (nextDate > now) return nextDate;
    }
  }

  return date;
}
