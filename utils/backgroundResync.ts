import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import { restoreTaskNotifications } from "@/services/notification-service";
import { connectToDatabase } from "@/database/db";
import { getAllTask } from "@/services/task-sevices";

export const RESYNC_TASK = "task-notification-resync";

TaskManager.defineTask(RESYNC_TASK, async () => {
  try {
    const db = await connectToDatabase();
    const tasks = await getAllTask(db);
    await restoreTaskNotifications(db, tasks);
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    console.error("Background resync failed", e);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundResync() {
  await BackgroundTask.registerTaskAsync(RESYNC_TASK, {
    minimumInterval: 60 * 12,
  });
}
