import { CreateTask } from "@/constant/types/task";
import { buildTrigger } from "@/utils/notification";
import notifee, {
  AlarmType,
  AndroidCategory,
  AndroidImportance,
  AndroidNotificationSetting,
  AndroidVisibility,
  AuthorizationStatus,
} from "@notifee/react-native";
import { Platform } from "react-native";

const CHANNEL_ID = "alarm_v8";

export type NotificationCapabilities = {
  notificationsGranted: boolean;
  exactAlarmsGranted: boolean;
};

export type ScheduleOptions = {
  ongoing?: boolean;
};

class AlarmNotificationService {
  private capabilities: NotificationCapabilities | null = null;

  async init(): Promise<NotificationCapabilities> {
    let exactAlarmsGranted = true;

    if (Platform.OS === "android") {
      await notifee.createChannel({
        id: CHANNEL_ID,
        name: "Task Alarms",
        importance: AndroidImportance.HIGH,
        sound: "default",
        vibration: true,
        vibrationPattern: [1000, 1000, 1000, 1000],
        visibility: AndroidVisibility.PUBLIC,
        bypassDnd: true,
      });
    }

    let settings = await notifee.getNotificationSettings();
    const shouldRequestPermission =
      settings.authorizationStatus === AuthorizationStatus.NOT_DETERMINED ||
      (Platform.OS === "android" &&
        Platform.Version >= 33 &&
        settings.authorizationStatus === AuthorizationStatus.DENIED);

    if (shouldRequestPermission) {
      settings = await notifee.requestPermission({ alert: true, badge: false, sound: true });
    }

    const notificationsGranted = settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
    if (!notificationsGranted) {
      console.warn("Notification permissions not granted:", settings.authorizationStatus);
    }

    if (Platform.OS === "android" && Platform.Version >= 31) {
      exactAlarmsGranted = settings.android.alarm === AndroidNotificationSetting.ENABLED;
    }

    this.capabilities = { notificationsGranted, exactAlarmsGranted };
    return this.capabilities;
  }

  async getCapabilities(): Promise<NotificationCapabilities> {
    return this.capabilities ?? this.init();
  }

  async openExactAlarmSettings() {
    if (Platform.OS !== "android" || Platform.Version < 31) return;
    await notifee.openAlarmPermissionSettings();
  }

  async schedule(
    task: CreateTask,
    date: Date,
    title: string,
    body: string,
    options?: ScheduleOptions,
  ): Promise<string> {
    const { notificationsGranted, exactAlarmsGranted } = await this.getCapabilities();
    if (!notificationsGranted) return "";

    const ongoing = options?.ongoing ?? true;

    try {
      const trigger = buildTrigger(task, date);
      if (Platform.OS === "android") {
        trigger.alarmManager = exactAlarmsGranted
          ? { type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE }
          : false;
      }

      return await notifee.createTriggerNotification(
        {
          title,
          body,
          android: {
            channelId: CHANNEL_ID,
            category: AndroidCategory.ALARM,
            importance: AndroidImportance.HIGH,
            ongoing,
            autoCancel: !ongoing,
            pressAction: { id: "default" },
          },
          ios: {
            sound: "default",
            badgeCount: 0,
            interruptionLevel: "timeSensitive",
          },
        },
        trigger,
      );
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
    options?: ScheduleOptions,
  ) {
    if (oldId) {
      await this.cancel([oldId]);
    }
    return this.schedule(task, date, title, body, options);
  }

  async cancel(notificationIds: string[]) {
    await Promise.all(
      notificationIds.filter(Boolean).map(async (notificationId) => {
        try {
          await notifee.cancelNotification(notificationId);
        } catch (error) {
          console.error("Failed to cancel notification:", notificationId, error);
        }
      }),
    );
  }
}

export const alarmNotificationService = new AlarmNotificationService();
