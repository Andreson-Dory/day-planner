import { Dimensions, Modal, Pressable, View } from "react-native";
import { useCallback, useContext, useRef, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { SubHeader } from "@/components/headers/SubHeader";
import { AddButton } from "@/components/actionButton/AddButton";
import { useDispatch } from "react-redux";
import { getRepetitiveTasksAction } from "@/redux/actions/taskActions";
import { DatabaseContext } from "@/context/databaseContext";
import { Task } from "@/constant/types/task";
import { formatLocalDate } from "@/utils/date";
import AddTaskModal from "@/components/task/addTaskModal";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useFocusEffect } from "expo-router";
import { TasksContainer } from "@/components/task/TasksContainer";
import { ThemedText } from "@/components/ThemedText";

export default function RepetitiveTask() {
  const dispatch = useDispatch();
  const db = useContext(DatabaseContext);
  const tasks: Task[] = useAppSelector((state) => state.tasks.repetitiveTasks);
  const colors = useThemeColors();
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const today = new Date();
  const todayString = formatLocalDate(today);

  // modal constant
  const [showMenuModal, setShowMenuModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly" | "all">("all");
  const [position, setPosition] = useState<null | { top: number; right: number }>(null);
  const ButtonRef = useRef<View>(null) as React.RefObject<View>;

  useFocusEffect(
    useCallback(() => {
      if (!db) return;
      dispatch<any>(getRepetitiveTasksAction(db));
    }, [db, dispatch]),
  );

  const showModal = () => {
    ButtonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height + 10,
        right: Dimensions.get("window").width - x - width,
      });
      setShowMenuModal(true);
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = task.repeatType?.toLowerCase() === filter.toLowerCase();
    const matchesAll = filter === "all";
    return matchesFilter || matchesAll;
  });

  return (
    <LinearGradient
      colors={[colors.appBaseGradientStart, colors.appBaseGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1">
        <SubHeader
          text="Repetitive Tasks"
          type="repetitive"
          onPress={showModal}
          ButtonRef={ButtonRef}
        />
        <TasksContainer
          dailyTasks={filteredTasks}
          view="repetitive"
          db={db}
          currentDate={todayString}
        />
        <AddButton
          className="bottom-3.75 left-0 right-0 z-10"
          onPress={() => setShowAddTaskModal(true)}
        />
        <AddTaskModal
          showAddModal={showAddTaskModal}
          setShowAddModal={setShowAddTaskModal}
          date={formatLocalDate(new Date())}
          view="repetitive"
        />
      </View>
      {/*             Modal for popup options                 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showMenuModal}
        onRequestClose={() => setShowMenuModal(!showMenuModal)}
      >
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setShowMenuModal(!showMenuModal)}
        />
        <View
          className="absolute w-44 p-2 -mr-2 -mt-1 rounded-2xl gap-2 bg-slate-100 dark:bg-slate-800"
          style={position}
        >
          <Pressable
            onPress={() => {
              setFilter("daily");
              setShowMenuModal(false);
            }}
            className="p-3 rounded-xl border border-slate-500 dark:border-slate-300"
          >
            <ThemedText className="text-xl leading-none text-center text-gray-950 dark:text-slate-50">
              DAILY
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilter("weekly");
              setShowMenuModal(false);
            }}
            className="p-3 rounded-xl border border-slate-500 dark:border-slate-300"
          >
            <ThemedText className="text-xl leading-none text-center text-gray-950 dark:text-slate-50">
              WEEKLY
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilter("monthly");
              setShowMenuModal(false);
            }}
            className="p-3 rounded-xl border border-slate-500 dark:border-slate-300"
          >
            <ThemedText className="text-xl leading-none text-center text-gray-950 dark:text-slate-50">
              MONTHLY
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilter("all");
              setShowMenuModal(false);
            }}
            className="p-3 rounded-xl border border-slate-500 dark:border-slate-300"
          >
            <ThemedText className="text-xl leading-none text-center text-gray-950 dark:text-slate-50">
              RESET
            </ThemedText>
          </Pressable>
        </View>
      </Modal>
    </LinearGradient>
  );
}
