import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const CHANNEL_ID = "alarm_v4";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

class AlarmNotificationService {
  async init(): Promise<boolean> {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: "Task Alarms",
        importance: Notifications.AndroidImportance.MAX,
        sound: "default",
        vibrationPattern: [1000, 1000, 1000, 1000],
        enableVibrate: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
        },
      });
    }

    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: false,
        allowSound: true,
      },
    });

    const granted = status === "granted";
    if (!granted) {
      console.warn("Notification permissions not granted:", status);
    }
    return granted;
  }

  async schedule(date: Date, title: string, body: string): Promise<string> {
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
          autoDismiss: false,
          sticky: true,
          interruptionLevel: "timeSensitive",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date,
          channelId: CHANNEL_ID,
        },
      });
    } catch (error) {
      console.error("Failed to schedule notification:", title, error);
      return "";
    }
  }

  async isScheduled(notificationId: string) {
    if (!notificationId) {
      return false;
    }

    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    return scheduledNotifications.some(
      (notification) => notification.identifier === notificationId,
    );
  }

  async cancel(notificationIds: string[]) {
    await Promise.all(
      notificationIds.filter(Boolean).map(async (notificationId) => {
        try {
          await Notifications.cancelScheduledNotificationAsync(notificationId);
          await Notifications.dismissNotificationAsync(notificationId);
        } catch (error) {
          console.error("Failed to cancel notification:", notificationId, error);
        }
      }),
    );
  }
}

export const alarmNotificationService = new AlarmNotificationService();
