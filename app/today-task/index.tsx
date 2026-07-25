import { View } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";
import { AddButton } from "@/components/actionButton/AddButton";
import { useDispatch } from "react-redux";
import { getTasksDailyAction } from "@/redux/actions/taskActions";
import { DatabaseContext } from "@/context/databaseContext";
import { useStatusHeader } from "@/hooks/useStatusHeader";
import { Task } from "@/constant/types/task";
import { formatLocalDate } from "@/utils/date";
import AddTaskModal from "@/components/task/addTaskModal";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useFocusEffect } from "expo-router";
import { TasksContainer } from "@/components/task/TasksContainer";

export default function TodayTask() {
  const dispatch = useDispatch();
  const db = useContext(DatabaseContext);
  const { filteredTasks, filter, setTasks, setFilter } = useStatusHeader();
  const tasks: Task[] = useAppSelector((state) => state.tasks.dailyTasks);
  const colors = useThemeColors();
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const today = new Date();
  const todayString = formatLocalDate(today);

  useFocusEffect(
    useCallback(() => {
      if (!db) return;
      dispatch<any>(getTasksDailyAction(db, todayString));
    }, [db, dispatch, todayString]),
  );

  useEffect(() => {
    setTasks(tasks);
  }, [setTasks, tasks]);

  return (
    <LinearGradient
      colors={[colors.appBaseGradientStart, colors.appBaseGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1">
        <SubHeader
          text="Today Task"
          type="today"
          onPress={() => {
            if (db) {
              dispatch<any>(getTasksDailyAction(db, todayString));
            }
          }}
        />
        <StatusHeader filter={filter} setFilter={setFilter} />
        <TasksContainer dailyTasks={filteredTasks} view="today" db={db} currentDate={todayString} />
        <AddButton
          className="bottom-3.75 left-0 right-0 z-10"
          onPress={() => setShowAddTaskModal(true)}
        />
        <AddTaskModal
          showAddModal={showAddTaskModal}
          setShowAddModal={setShowAddTaskModal}
          date={formatLocalDate(new Date())}
          view="today"
        />
      </View>
    </LinearGradient>
  );
}
