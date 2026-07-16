import OptionCard from "@/components/optionCard";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Link } from "expo-router";
import { Pressable } from "react-native";
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
      <RouterView className="flex-1 flex-col justify-between py-14 gap-8 items-center">
        <Link href="/(views)/today-task" asChild>
          <Pressable className="rounded-2xl">
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
          <Pressable className="rounded-2xl">
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
          <Pressable className="rounded-2xl">
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
