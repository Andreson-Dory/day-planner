import OptionCard from "@/components/optionCard";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import RouterView from "./router-view";
import { useContext, useEffect } from "react";
import { DatabaseContext } from "@/context/databaseContext";
import { getAllTask } from "@/services/task-sevices";
import { restoreTaskNotifications } from "@/services/notification-service";
import { alarmNotificationService } from "@/lib/notifications";
import "@/global.css";

export default function Index() {
  const colors = useThemeColors();
  const db = useContext(DatabaseContext);

  useEffect(() => {
    async function initNotifications() {
      if (db) {
        const tasks = await getAllTask(db);
        await restoreTaskNotifications(db, tasks);
      }
      await alarmNotificationService.init();
    }
    initNotifications();
  }, []);

  return (
    <>
      <RouterView style={[styles.appContent, { flex: 1 }]}>
        <Link href="/(views)/today-task" asChild>
          <Pressable
            android_ripple={{
              color: colors.emeraldGradientStart,
            }}
            style={{ borderRadius: 19 }}
          >
            <OptionCard
              subtitle="TODAY'S TASK LIST"
              description="View and manage all your tasks for today"
              colorGradientStart={colors.emeraldGradientStart}
              colorGradientEnd={colors.emeraldGradientEnd}
              iconColor={colors.todayTaskIcon}
              image={require("@/assets/images/today-tasks.png")}
            />
          </Pressable>
        </Link>
        <Link href="/(views)/week-task" asChild>
          <Pressable
            android_ripple={{
              color: colors.blueGradientStart,
            }}
            style={{ borderRadius: 19 }}
          >
            <OptionCard
              subtitle="WEEK'S TASK LIST"
              description="Plan and organize your entire week ahead"
              colorGradientStart={colors.blueGradientStart}
              colorGradientEnd={colors.blueGradientEnd}
              iconColor={colors.weekTaskIcon}
              image={require("@/assets/images/week-tasks.png")}
            />
          </Pressable>
        </Link>
        <Link href="/(views)/create-plan" asChild>
          <Pressable
            android_ripple={{
              color: colors.orangeGradientStart,
            }}
            style={{ borderRadius: 19 }}
          >
            <OptionCard
              subtitle="CREATE PLAN"
              description="Add and create new tasks to your planner"
              colorGradientStart={colors.orangeGradientStart}
              colorGradientEnd={colors.orangeGradientEnd}
              iconColor={colors.createPlanTaskIcon}
              image={require("@/assets/images/create.png")}
            />
          </Pressable>
        </Link>
      </RouterView>
    </>
  );
}

const styles = StyleSheet.create({
  appContent: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 60,
    gap: 30,
    alignItems: "center",
  },
});
