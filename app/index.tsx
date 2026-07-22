import { useThemeColors } from "@/hooks/useThemeColors";
import { useContext, useEffect } from "react";
import { DatabaseContext } from "@/context/databaseContext";
import { getAllTask } from "@/services/task-sevices";
import { restoreTaskNotifications } from "@/services/notification-service";
import { alarmNotificationService } from "@/lib/notifications";
import "@/global.css";
import { SubHeader } from "@/components/headers/SubHeader";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const colors = useThemeColors();
  const db = useContext(DatabaseContext);

  useEffect(() => {
    async function initNotifications() {
      await alarmNotificationService.init();

      if (db) {
        const tasks = await getAllTask(db);
        await restoreTaskNotifications(db, tasks);
      }
    }
    initNotifications();
  }, [db]);

  return (
    <LinearGradient
      colors={[colors.appBaseGradientStart, colors.appBaseGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
    >
      <SubHeader text="Home" type="home" />
    </LinearGradient>
  );
}
