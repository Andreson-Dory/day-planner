import { CreateTask, Task } from "@/constant/types/task";
import { alarmNotificationService } from "@/lib/notifications";
import { SQLiteDatabase } from "expo-sqlite";
import { updateNotificationsId } from "./task-sevices";

export async function scheduleTaskNotifications(task: CreateTask) {
  const now = new Date();
  let startId = "";
  let endId = "";
  let startReminderId = "";
  let endReminderId = "";

  const startTimeIni = new Date(task.startTime);
  const endTimeIni = new Date(task.endTime);

  // Schedule reminder 10 min before start
  const startReminderTime = new Date(startTimeIni.getTime() - 10 * 60 * 1000);
  if (startReminderTime > now) {
    startReminderId = await alarmNotificationService.schedule(
      task,
      startReminderTime,
      "Upcoming Task",
      `${task.taskTitle} will start in 10 minutes`,
    );
  }

  // Schedule main start notification
  if (startTimeIni > now) {
    startId = await alarmNotificationService.schedule(
      task,
      startTimeIni,
      "Task Started",
      `${task.taskTitle} is starting now`,
    );
  }

  // Schedule reminder 10 min before end
  const endReminderTime = new Date(endTimeIni.getTime() - 10 * 60 * 1000);
  if (endReminderTime > now) {
    endReminderId = await alarmNotificationService.schedule(
      task,
      endReminderTime,
      "Task Ending Soon",
      `${task.taskTitle} will end in 10 minutes`,
    );
  }

  // Schedule main end notification
  if (endTimeIni > now) {
    endId = await alarmNotificationService.schedule(
      task,
      endTimeIni,
      "Task Finished",
      `${task.taskTitle} has ended`,
    );
  }

  return { startId, endId, startReminderId, endReminderId };
}

export async function cancelNotification(notificationIds: string[]) {
  await alarmNotificationService.cancel(notificationIds);
}

export async function restoreTaskNotifications(db: SQLiteDatabase, tasks: Task[]) {
  const now = new Date();

  for (const task of tasks) {
    try {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);
      const startReminderTime = new Date(startTime.getTime() - 10 * 60 * 1000);
      const endReminderTime = new Date(endTime.getTime() - 10 * 60 * 1000);

      // Repeating tasks: always eligible for restore, regardless of original date
      // One-off tasks: only restore if the time hasn't already passed
      const startReminderEligible = task.isRepetitive || startReminderTime > now;
      const startEligible = task.isRepetitive || startTime > now;
      const endReminderEligible = task.isRepetitive || endReminderTime > now;
      const endEligible = task.isRepetitive || endTime > now;

      if (startReminderEligible)
        task.startReminderId = await alarmNotificationService.scheduleReplacing(
          task.startReminderId,
          task,
          startReminderTime,
          "Upcoming Task",
          `${task.taskTitle} will start in 10 minutes`,
        );

      if (startEligible)
        task.startNotificationId = await alarmNotificationService.scheduleReplacing(
          task.startNotificationId,
          task,
          startTime,
          "Task Started",
          `${task.taskTitle} is starting now`,
        );

      if (endReminderEligible) {
        task.endReminderId = await alarmNotificationService.scheduleReplacing(
          task.endReminderId,
          task,
          endReminderTime,
          "Task Ending Soon",
          `${task.taskTitle} will end in 10 minutes`,
        );
      }

      if (endEligible) {
        task.endNotificationId = await alarmNotificationService.scheduleReplacing(
          task.endNotificationId,
          task,
          endTime,
          "Task Finished",
          `${task.taskTitle} has ended`,
        );
      }

      await updateNotificationsId(
        db,
        task.idTask,
        task.startNotificationId,
        task.endNotificationId,
        task.startReminderId,
        task.endReminderId,
      );
    } catch (error) {
      console.error(`Failed to restore notifications for task ${task.idTask}:`, error);
    }
  }
}
