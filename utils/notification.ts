import { CreateTask } from "@/constant/types/task";
import * as Notifications from "expo-notifications";

export function buildTrigger(task: CreateTask, date: Date, channelId: string) {
  if (!task.isRepetitive) {
    return {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: date,
      channelId: channelId,
    }; // one-off, as today
  }
  const hour = date.getHours();
  const minute = date.getMinutes();

  switch (task.repeatType) {
    case "daily":
      return {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        repeats: true,
        channelId: channelId,
      };
    case "weekly":
      return {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: date.getDay() + 1,
        hour,
        minute,
        repeats: true,
        channelId: channelId,
      }; // expo weekday is 1-7, Sunday=1
    case "monthly":
      return {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: date.getDate(),
        hour,
        minute,
        repeats: true,
        channelId: channelId,
      };
    default:
      // isRepetitive was true but repeatType is null/unexpected — fall back to one-off
      return {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: date,
        channelId: channelId,
      };
  }
}
