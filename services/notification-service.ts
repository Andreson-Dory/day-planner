import { CreateTask, Task } from "@/constant/types/task";
import { alarmNotificationService } from "@/lib/notifications";
import notifee from "@notifee/react-native";
import { SQLiteDatabase } from "expo-sqlite";
import { updateNotificationsId } from "./task-sevices";

export async function scheduleTaskNotifications(task: CreateTask) {
  const capabilities = await alarmNotificationService.getCapabilities();
  const now = new Date();
  let startId = "";
  let endId = "";
  let startReminderId = "";
  let endReminderId = "";

  const startTimeIni = new Date(task.startTime);
  const endTimeIni = new Date(task.endTime);

  const startReminderTime = new Date(startTimeIni.getTime() - 10 * 60 * 1000);
  if (startReminderTime > now) {
    startReminderId = await alarmNotificationService.schedule(
      task,
      startReminderTime,
      "Upcoming Task",
      `${task.taskTitle} will start in 10 minutes`,
      { ongoing: false },
    );
  }

  if (startTimeIni > now) {
    startId = await alarmNotificationService.schedule(
      task,
      startTimeIni,
      "Task Started",
      `${task.taskTitle} is starting now`,
    );
  }

  const endReminderTime = new Date(endTimeIni.getTime() - 10 * 60 * 1000);
  if (endReminderTime > now) {
    endReminderId = await alarmNotificationService.schedule(
      task,
      endReminderTime,
      "Task Ending Soon",
      `${task.taskTitle} will end in 10 minutes`,
      { ongoing: false },
    );
  }

  if (endTimeIni > now) {
    endId = await alarmNotificationService.schedule(
      task,
      endTimeIni,
      "Task Finished",
      `${task.taskTitle} has ended`,
    );
  }

  return {
    startId,
    endId,
    startReminderId,
    endReminderId,
    ...capabilities,
    hasScheduledNotifications: Boolean(startId || endId || startReminderId || endReminderId),
  };
}

export async function cancelNotification(notificationIds: string[]) {
  await alarmNotificationService.cancel(notificationIds);
}

export async function restoreTaskNotifications(db: SQLiteDatabase, tasks: Task[]) {
  const now = new Date();

  const liveIds = new Set(await notifee.getTriggerNotificationIds());

  for (const task of tasks) {
    try {
      const startTime = new Date(task.startTime);
      const endTime = new Date(task.endTime);
      const startReminderTime = new Date(startTime.getTime() - 10 * 60 * 1000);
      const endReminderTime = new Date(endTime.getTime() - 10 * 60 * 1000);

      const startReminderEligible =
        task.isRepetitive === 1 || (startReminderTime > now && !task.isCompleted);
      const startEligible = task.isRepetitive === 1 || (startTime > now && !task.isCompleted);
      const endReminderEligible =
        task.isRepetitive === 1 || (endReminderTime > now && !task.isCompleted);
      const endEligible = task.isRepetitive === 1 || (endTime > now && !task.isCompleted);

      let changed = false;

      // Fields: [eligible flag, id field name, reschedule fn]
      const fields: Array<{
        eligible: boolean;
        idField: "startReminderId" | "startNotificationId" | "endReminderId" | "endNotificationId";
        date: Date;
        title: string;
        body: string;
        ongoing?: boolean;
      }> = [
        {
          eligible: startReminderEligible,
          idField: "startReminderId",
          date: startReminderTime,
          title: "Upcoming Task",
          body: `${task.taskTitle} will start in 10 minutes`,
          ongoing: false,
        },
        {
          eligible: startEligible,
          idField: "startNotificationId",
          date: startTime,
          title: "Task Started",
          body: `${task.taskTitle} is starting now`,
        },
        {
          eligible: endReminderEligible,
          idField: "endReminderId",
          date: endReminderTime,
          title: "Task Ending Soon",
          body: `${task.taskTitle} will end in 10 minutes`,
          ongoing: false,
        },
        {
          eligible: endEligible,
          idField: "endNotificationId",
          date: endTime,
          title: "Task Finished",
          body: `${task.taskTitle} has ended`,
        },
      ];

      for (const f of fields) {
        const currentId = task[f.idField];
        const isLive = Boolean(currentId && liveIds.has(currentId));

        if (f.eligible && !isLive) {
          // Missing or dead, but should exist — (re)schedule it.
          task[f.idField] = await alarmNotificationService.scheduleReplacing(
            currentId,
            task,
            f.date,
            f.title,
            f.body,
            f.ongoing !== undefined ? { ongoing: f.ongoing } : undefined,
          );
          changed = true;
        } else if (!f.eligible && isLive) {
          // No longer should exist (completed / one-off already elapsed)
          // but a live notification is still scheduled — cancel it.
          await alarmNotificationService.cancel([currentId]);
          task[f.idField] = "";
          changed = true;
        }
      }

      if (changed) {
        await updateNotificationsId(
          db,
          task.idTask,
          task.startNotificationId,
          task.endNotificationId,
          task.startReminderId,
          task.endReminderId,
        );
      }
    } catch (error) {
      console.error(`Failed to restore notifications for task ${task.idTask}:`, error);
    }
  }
}
