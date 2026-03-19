import notifee, {
    AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
  Trigger,
  TriggerType,
} from '@notifee/react-native';

class AlarmNotificationService {
    async init() {
        notifee.requestPermission();

        await notifee.createChannel({
            id: 'alarm_v2',
            name: 'Alarm Channel',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
            visibility: AndroidVisibility.PUBLIC
        });
    }

    async scheduleReminder(date: Date, title: string, body: string) {
        const trigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime(),
            alarmManager: {
                allowWhileIdle: true,
                exact: true,
            },
        } as Trigger;

        const id = await notifee.createTriggerNotification(
            {
                title,
                body,
                android: {
                    channelId: 'alarm_v2',
                    importance: AndroidImportance.HIGH,
                    visibility: AndroidVisibility.PUBLIC,
                    sound: 'default',
                    vibrationPattern: [1000, 1000, 1000, 1000, 1000, 1000],
                    category: AndroidCategory.ALARM,
                    ongoing: true,
                    autoCancel: false,
                    pressAction: {
                        id: 'default',
                    },
                    fullScreenAction: {
                        id: 'default',
                    },
                },
            },
            trigger
        );

        return id;
    }

    async schedule(date: Date, title: string, body: string) {
        const trigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime(),
            alarmManager: {
                allowWhileIdle: true,
                exact: true,
            },
        } as Trigger;

        const id = await notifee.createTriggerNotification(
            {
                title,
                body,
                android: {
                    channelId: 'alarm_v2',
                    importance: AndroidImportance.HIGH,
                    visibility: AndroidVisibility.PUBLIC,
                    sound: 'default',
                    vibrationPattern: [1000, 1000, 1000, 1000, 1000, 1000],
                    pressAction: {
                        id: 'default',
                    },
                },
            },
            trigger
        );

        return id;
    }

    async cancel(notificationIds: string[]) {
        notifee.cancelAllNotifications(notificationIds);
    }
}

export const alarmNotificationService = new AlarmNotificationService();
