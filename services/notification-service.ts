import { CreateTask, Task } from "@/constant/types/task";
import { alarmNotificationService } from "@/lib/notifications";
import { SQLiteDatabase } from "expo-sqlite";
import { updateNotificationsId } from "./task-sevices";

export async function scheduleTaskNotifications(task : CreateTask) {
    const now = new Date();
    let startId = '';
    let endId = '';
    let startReminderId = '';
    let endReminderId = '';

    const startTime = new Date(task.startTime);
    const endTime = new Date(task.endTime);

    // Schedule reminder 10 min before start
    const startReminderTime = new Date(startTime.getTime() - 10 * 60 * 1000);
    if (startReminderTime > now) {
        startReminderId = await alarmNotificationService.scheduleReminder(
            startReminderTime,
            'Upcoming Task',
            `${task.taskTitle} will start in 10 minutes`
        );    
    }

    // Schedule main start notification
    if (startTime > now) {
        startId = await alarmNotificationService.schedule(
            startTime,
            'Task Started',
            `${task.taskTitle} is starting now`
        );    
    }

    // Schedule reminder 5 min before end
    const endReminderTime = new Date(endTime.getTime() - 5 * 60 * 1000);
    if (endReminderTime > now) {
        endReminderId = await alarmNotificationService.scheduleReminder(
            endReminderTime,
            'Task Ending Soon',
            `${task.taskTitle} will end in 5 minutes`
        );    
    }

    // Schedule main end notification
    if (endTime > now) {
        endId = await alarmNotificationService.schedule(
            endTime,
            'Task Finished',
            `${task.taskTitle} has ended`
        );    
    }

    return { startId, endId, startReminderId, endReminderId };
}

export async function cancelNotification(notificationIds: string[]) {
  await alarmNotificationService.cancel(notificationIds)
}

export async function restoreTaskNotifications(db: SQLiteDatabase, tasks: Task[]) {
    const now = new Date();

    for (const task of tasks) {
        const startTime = new Date(task.startTime);
        const endTime = new Date(task.endTime);

        // Restore start reminder notification (10 min before start)
        const startReminderTime = new Date(startTime.getTime() - 10 * 60 * 1000);
        if (startReminderTime > now && !task.startReminderId) {
            const startReminderId = await alarmNotificationService.scheduleReminder(
                startReminderTime,
                'Upcoming Task',
                `${task.taskTitle} will start in 10 minutes`
            );    
            task.startReminderId = startReminderId;
        }

        // Restore start notification
        if (startTime > now && !task.startNotificationId) {
            const startId = await alarmNotificationService.schedule(
                startTime,
                'Task Started',
                `${task.taskTitle} is starting now`
            );   
            task.startNotificationId = startId;
        }

        // Restore end reminder notification (5 min before end)
        const endReminderTime = new Date(endTime.getTime() - 5 * 60 * 1000);
        if (endReminderTime > now && !task.endReminderId) {
            const endReminderId = await alarmNotificationService.scheduleReminder(
                endReminderTime,
                'Task Ending Soon',
                `${task.taskTitle} will end in 5 minutes`
            );    
            task.endReminderId = endReminderId;
        }

        // Restore end notification
        if (endTime > now && !task.endNotificationId) {
            const endId = await alarmNotificationService.schedule(
                endTime,
                'Task Finished',
                `${task.taskTitle} has ended`
            );  
            task.endNotificationId = endId;
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