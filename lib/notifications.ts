import { CreateTask } from '@/constant/types/task'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
})


export async function createNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('tasks', {
      name: 'Task Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }
}

export async function requestNotificationPermission() {
    const { status } = await Notifications.requestPermissionsAsync()
    return status === "granted"
}

export async function scheduleNotification(
    title: string, 
    body: string, 
    date: Date
): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
            channelId: "tasks"
        },
    })

    return id
}

export async function scheduleTaskNotifications(task : CreateTask) {
    const now = new Date();
    let startId = '';
    let endId = '';
    let startReminderId = '';
    let endReminderId = '';

    const startTime = new Date(task.startTime);
    const endTime = new Date(task.endTime);

    // Schedule main start notification
    if (startTime > now) {
        startId = await scheduleNotification(
            "Task Started",
            `${task.taskTitle} is starting now`,
            startTime
        );
    }

    // Schedule reminder 10 min before start
    const startReminderTime = new Date(startTime.getTime() - 10 * 60 * 1000);
    if (startReminderTime > now) {
        startReminderId = await scheduleNotification(
            "Task Reminder",
            `${task.taskTitle} will start in 10 minutes`,
            startReminderTime
        );
    }

    // Schedule main end notification
    if (endTime > now) {
        endId = await scheduleNotification(
            "Task Finished",
            `${task.taskTitle} has ended`,
            endTime
        );
    }

    // Schedule reminder 5 min before end
    const endReminderTime = new Date(endTime.getTime() - 5 * 60 * 1000);
    if (endReminderTime > now) {
        endReminderId = await scheduleNotification(
            "Task Ending Soon",
            `${task.taskTitle} will end in 5 minutes`,
            endReminderTime
        );
    }

    return { startId, endId, startReminderId, endReminderId };
}

export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId)
}