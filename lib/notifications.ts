import { CreateTask, Task } from "@/constant/types/task";
import { buildTrigger } from "@/utils/notification";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Application from "expo-application";
import * as IntentLauncher from "expo-intent-launcher";
import { canScheduleExactAlarms } from "react-native-permissions";

const CHANNEL_ID = "alarm_v6";

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
        vibrationPattern: [1000, 1000, 1000, 1000],
        enableVibrate: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
        },
      });

      if (Platform.Version >= 31) {
        const hasExactAlarmAccess = await canScheduleExactAlarms();
        if (!hasExactAlarmAccess) {
          try {
            await IntentLauncher.startActivityAsync(
              "android.settings.REQUEST_SCHEDULE_EXACT_ALARM",
              {
                data: `package:${Application.applicationId}`,
              },
            );
          } catch (error) {
            console.warn("Could not open exact alarm settings:", error);
          }
        }
      }
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

  async schedule(task: CreateTask, date: Date, title: string, body: string): Promise<string> {
    try {
      return await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          autoDismiss: false,
          sticky: true,
          interruptionLevel: "timeSensitive",
        },
        trigger: buildTrigger(task, date, CHANNEL_ID),
      });
    } catch (error) {
      console.error("Failed to schedule notification:", title, error);
      return "";
    }
  }

  async scheduleReplacing(
    oldId: string,
    task: CreateTask,
    date: Date,
    title: string,
    body: string,
  ) {
    if (oldId) {
      await this.cancel([oldId]);
    }
    return this.schedule(task, date, title, body);
  }

  async cancel(notificationIds: string[]) {
    await Promise.all(
      notificationIds.map(async (notificationId) => {
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
