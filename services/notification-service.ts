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
      startReminderTime,
      "Upcoming Task",
      `${task.taskTitle} will start in 10 minutes`,
    );
  }

  // Schedule main start notification
  if (startTimeIni > now) {
    startId = await alarmNotificationService.schedule(
      startTimeIni,
      "Task Started",
      `${task.taskTitle} is starting now`,
    );
  }

  // Schedule reminder 5 min before end
  const endReminderTime = new Date(endTimeIni.getTime() - 5 * 60 * 1000);
  if (endReminderTime > now) {
    endReminderId = await alarmNotificationService.schedule(
      endReminderTime,
      "Task Ending Soon",
      `${task.taskTitle} will end in 5 minutes`,
    );
  }

  // Schedule main end notification
  if (endTimeIni > now) {
    endId = await alarmNotificationService.schedule(
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
      if (
        startReminderTime > now &&
        !(await alarmNotificationService.isScheduled(task.startReminderId))
      ) {
        task.startReminderId = await alarmNotificationService.schedule(
          startReminderTime,
          "Upcoming Task",
          `${task.taskTitle} will start in 10 minutes`,
        );
      }

      if (
        startTime > now &&
        !(await alarmNotificationService.isScheduled(task.startNotificationId))
      ) {
        task.startNotificationId = await alarmNotificationService.schedule(
          startTime,
          "Task Started",
          `${task.taskTitle} is starting now`,
        );
      }

      const endReminderTime = new Date(endTime.getTime() - 5 * 60 * 1000);
      if (
        endReminderTime > now &&
        !(await alarmNotificationService.isScheduled(task.endReminderId))
      ) {
        task.endReminderId = await alarmNotificationService.schedule(
          endReminderTime,
          "Task Ending Soon",
          `${task.taskTitle} will end in 5 minutes`,
        );
      }

      if (endTime > now && !(await alarmNotificationService.isScheduled(task.endNotificationId))) {
        task.endNotificationId = await alarmNotificationService.schedule(
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
