import { Task } from "@/constant/types/task";
import { scheduleNotification } from "@/lib/notifications";
import { SQLiteDatabase } from "expo-sqlite";
import { updateNotificationsId } from "./task-sevices";

export async function restoreTaskNotifications(db: SQLiteDatabase, tasks: Task[]) {
    const now = new Date();

    for (const task of tasks) {
        const startTime = new Date(task.startTime);
        const endTime = new Date(task.endTime);

        // Restore start notification
        if (startTime > now && !task.startNotificationId) {
            const startId = await scheduleNotification(
                "Task Started",
                `${task.taskTitle} is starting now`,
                startTime
            );
            task.startNotificationId = startId;
        }

        // Restore start reminder notification (10 min before start)
        const startReminderTime = new Date(startTime.getTime() - 10 * 60 * 1000);
        if (startReminderTime > now && !task.startReminderId) {
            const startReminderId = await scheduleNotification(
                "Task Reminder",
                `${task.taskTitle} will start in 10 minutes`,
                startReminderTime
            );
            task.startReminderId = startReminderId;
        }

        // Restore end notification
        if (endTime > now && !task.endNotificationId) {
            const endId = await scheduleNotification(
                "Task Finished",
                `${task.taskTitle} has ended`,
                endTime
            );
            task.endNotificationId = endId;
        }

        // Restore end reminder notification (5 min before end)
        const endReminderTime = new Date(endTime.getTime() - 5 * 60 * 1000);
        if (endReminderTime > now && !task.endReminderId) {
            const endReminderId = await scheduleNotification(
                "Task Ending Soon",
                `${task.taskTitle} will end in 5 minutes`,
                endReminderTime
            );
            task.endReminderId = endReminderId;
        }

        // Update all notification IDs in DB
        await updateNotificationsId(
            db,
            task.idTask,
            task.startNotificationId,
            task.endNotificationId,
            task.startReminderId,
            task.endReminderId
        );
    }
}