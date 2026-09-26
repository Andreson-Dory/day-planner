import { useThemeColors } from "@/hooks/useThemeColors";
import { useCallback, useContext, useEffect } from "react";
import { DatabaseContext } from "@/context/databaseContext";
import { getAllTask } from "@/services/task-sevices";
import { restoreTaskNotifications } from "@/services/notification-service";
import { alarmNotificationService } from "@/lib/notifications";
import "@/global.css";
import { SubHeader } from "@/components/headers/SubHeader";
import { LinearGradient } from "expo-linear-gradient";
import { AppState, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Activity, Calendar, ListChecksIcon } from "lucide-react-native";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { fetchDashboardStatAction } from "@/redux/actions/dashboardActions";
import { Link, useFocusEffect } from "expo-router";
import { TasksContainer } from "@/components/task/TasksContainer";
import { formatLocalDate } from "@/utils/date";
import { calculateRate } from "@/utils/math";

export default function Index() {
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const db = useContext(DatabaseContext);
  const { status, uncompletedTasks } = useAppSelector((state) => state.dashboard);
  const today = new Date();
  const todayString = formatLocalDate(today);

  useEffect(() => {
    async function refreshNotifications() {
      const { notificationsGranted } = await alarmNotificationService.init();

      if (db && notificationsGranted) {
        const tasks = await getAllTask(db);
        await restoreTaskNotifications(db, tasks);
      }
    }
    if (!db) return;

    void refreshNotifications();
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") void refreshNotifications();
    });

    return () => subscription.remove();
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      if (!db) return;
      dispatch<any>(fetchDashboardStatAction(db));
    }, [db, dispatch]),
  );

  const taskCount = status?.taskCount?.count;
  const completedTaskCount = status?.completedTaskCount?.count;
  const pendingTaskCount = taskCount - completedTaskCount;
  const weekTaskCount = status?.weekTaskCount?.count;
  const completedWeekTaskCount = status?.completedWeekTaskCount?.count;
  const weekRate = calculateRate(completedWeekTaskCount, weekTaskCount);
  const monthTaskCount = status?.monthTaskCount?.count;
  const completedMonthTaskCount = status?.completedMonthTaskCount?.count;
  const monthRate = calculateRate(completedMonthTaskCount, monthTaskCount);

  return (
    <LinearGradient
      colors={[colors.appBaseGradientStart, colors.appBaseGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <SubHeader text="Home" type="home" />
      <View className="flex flex-col gap-4 mt-2 mb-12 mx-4">
        <ThemedText className="text-4xl font-bold text-gray-900 dark:text-slate-100">
          Dashboard
        </ThemedText>

        <Link href="/today-task">
          <View className="flex flex-row w-full items-start justify-between rounded-xl p-4 border bg-emerald-50 border-emerald-200 shadow-sm transition">
            <View>
              <ThemedText className="text-sm font-medium text-slate-600">
                Today&apos;s Tasks
              </ThemedText>
              <ThemedText className="text-3xl font-bold text-slate-900 mt-2">
                {taskCount}
              </ThemedText>
              <ThemedText className="text-xs text-slate-500 mt-1">
                {completedTaskCount} completed, {pendingTaskCount} pending
              </ThemedText>
            </View>
            <ListChecksIcon size={25} color="#10b981" />
          </View>
        </Link>
        <Link href="/week-task">
          <View className="flex flex-row w-full items-start justify-between rounded-xl p-4 border bg-emerald-50 border-emerald-200 shadow-sm transition">
            <View>
              <ThemedText className="text-sm font-medium text-slate-600">This Week</ThemedText>
              <ThemedText className="text-3xl font-bold text-slate-900 mt-2">
                {weekTaskCount}
              </ThemedText>
              <ThemedText className="text-xs text-slate-500 mt-1">
                {weekRate}% completion rate
              </ThemedText>
            </View>
            <Calendar size={25} color="#10b981" />
          </View>
        </Link>
        <View className="flex flex-row items-start justify-between rounded-xl p-4 border bg-amber-50 border-amber-200 shadow-sm transition">
          <View>
            <ThemedText className="text-sm font-medium text-slate-600">Productivity</ThemedText>
            <ThemedText className="text-3xl font-bold text-slate-900 mt-2">{monthRate}%</ThemedText>
            <ThemedText className="text-xs text-slate-500 mt-1">On track this month</ThemedText>
          </View>
          <Activity size={25} color="#f97316" />
        </View>
      </View>
      <View className="flex flex-col gap-4 mt-2 mb-12 mx-4">
        <ThemedText className="text-4xl font-bold text-gray-900 dark:text-slate-100">
          Uncompleted Tasks
        </ThemedText>

        <TasksContainer
          dailyTasks={uncompletedTasks}
          view="dashboard"
          db={db}
          currentDate={todayString}
        />
      </View>
    </LinearGradient>
  );
}
