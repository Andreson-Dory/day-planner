import OptionCard from "@/components/optionCard";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import RouterView from "./router-view";
import { useContext, useEffect } from "react";
import { DatabaseContext } from "@/context/databaseContext";
import { getAllTask } from "@/services/task-sevices";
import { restoreTaskNotifications } from "@/services/notification-service";
import { alarmNotificationService } from "@/lib/notifications";

export default function Index() {
  const colors = useThemeColors();
  const db = useContext(DatabaseContext)

  useEffect(() => {
    async function initNotifications() {
      if(db){
        const tasks = await getAllTask(db);
        await restoreTaskNotifications(db, tasks);
      }
      await alarmNotificationService.init();
    }
    initNotifications();
    
  }, [])

  return (
    <>
      <RouterView style={[styles.appContent, { flex: 1 }]}>
        <Link href="/(views)/today-task" asChild>
          <Pressable
            android_ripple={{
              color: colors.greenGradientStart,
              foreground: true,
            }}
            style={{ borderRadius: 19 }}
          >
            <LinearGradient
              colors={[colors.greenGradientStart, colors.greenGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              <OptionCard
                subtitle="TODAY'S TASK LIST"
                image={require("@/assets/images/today-tasks.png")}
              />
            </LinearGradient>
          </Pressable>
        </Link>
        <Link href="/(views)/week-task" asChild>
          <Pressable
            android_ripple={{
              color: colors.blueGradientStart,
              foreground: true,
            }}
            style={{ borderRadius: 19 }}
          >
            <LinearGradient
              colors={[colors.blueGradientStart, colors.blueGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <OptionCard
                subtitle="WEEK'S TASK LIST"
                image={require("@/assets/images/week-tasks.png")}
              />
            </LinearGradient>
          </Pressable>
        </Link>
        <Link href="/(views)/create-plan" asChild>
          <Pressable
            android_ripple={{
              color: colors.orangeGradientStart,
              foreground: true,
            }}
            style={{ borderRadius: 19 }}
          >
            <LinearGradient
              colors={[colors.orangeGradientStart, colors.orangeGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              <OptionCard
                subtitle="CREATE PLAN"
                image={require("@/assets/images/create.png")}
              />
            </LinearGradient>
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
  gradient: {
    borderRadius: 19,
  },
});
