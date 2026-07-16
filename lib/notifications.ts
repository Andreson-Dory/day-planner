import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
  Trigger,
  TriggerType,
} from "@notifee/react-native";

class AlarmNotificationService {
  private readonly CHANNEL_ID = "alarm_v3";

  async init() {
    await notifee.requestPermission();

    await notifee.createChannel({
      id: this.CHANNEL_ID,
      name: "Task Alarms",
      importance: AndroidImportance.HIGH,
      sound: "default",
      vibration: true,
      vibrationPattern: [1000, 1000, 1000, 1000],
      visibility: AndroidVisibility.PUBLIC,
      bypassDnd: true,
    });
  }

  async schedule(date: Date, title: string, body: string) {
    const trigger: Trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      alarmManager: {
        allowWhileIdle: true, // Handle if the phone is in idle
      },
    };

    return await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId: this.CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          visibility: AndroidVisibility.PUBLIC,
          category: AndroidCategory.ALARM,
          ongoing: true,
          autoCancel: false,
          pressAction: {
            id: "default",
          },
          fullScreenAction: {
            id: "default",
          },
        },
      },
      trigger,
    );
  }

  async cancel(notificationIds: string[]) {
    await notifee.cancelAllNotifications(notificationIds);
  }
}

export const alarmNotificationService = new AlarmNotificationService();
