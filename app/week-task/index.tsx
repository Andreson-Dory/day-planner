import { Dimensions, Modal, Pressable, View } from "react-native";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ThemedText } from "@/components/ThemedText";
import { AddButton } from "@/components/actionButton/AddButton";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";
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
import { getDatesInRange, getDateString, getWeekDay } from "@/utils/week-task";
import { TasksContainer } from "@/components/task/TasksContainer";

export default function WeekTask() {
  const colors = useThemeColors();
  const db = useContext(DatabaseContext);
  const { filteredTasks, filter, setTasks, setFilter } = useStatusHeader();
  const dispatch = useDispatch();
  const tasks = useAppSelector<Task[]>((state) => state.tasks.dailyTasks);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const now = formatLocalDate(new Date());
  const [selectedDay, setSelectedDay] = useState<string>(now);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [position, setPosition] = useState<null | { top: number; right: number }>(null);
  const ButtonRef = useRef<View>(null) as React.RefObject<View>;

  useEffect(() => {
    getDatesInRange({ setWeekDays });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!db) return;
      if (!selectedDay) return;

      dispatch<any>(getTasksDailyAction(db, selectedDay));
    }, [db, dispatch, selectedDay]),
  );

  useEffect(() => {
    setTasks(tasks);
  }, [setTasks, tasks]);

  const showModal = () => {
    ButtonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height + 10,
        right: Dimensions.get("window").width - x - width,
      });
      setShowMenuModal(true);
    });
  };

  return (
    <LinearGradient
      colors={[colors.appBaseGradientStart, colors.appBaseGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}
    >
      <View className="flex-1">
        <SubHeader
          text={getDateString(selectedDay)}
          type="week"
          onPress={showModal}
          ButtonRef={ButtonRef}
        />
        <StatusHeader filter={filter} setFilter={setFilter} />
        <TasksContainer dailyTasks={filteredTasks} view="week" currentDate={selectedDay} db={db} />
        {selectedDay >= now && (
          <AddButton
            className="bottom-3.75 left-0 right-0 z-10"
            onPress={() => setShowAddTaskModal(true)}
          />
        )}
        <AddTaskModal
          showAddModal={showAddTaskModal}
          setShowAddModal={setShowAddTaskModal}
          date={selectedDay}
          view="week"
        />
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
            {weekDays.map((day) => {
              return (
                <Pressable
                  key={day}
                  onPress={() => {
                    setSelectedDay(day);
                    setShowMenuModal(false);
                  }}
                  className="p-3 rounded-xl border border-slate-500 dark:border-slate-300"
                >
                  <ThemedText
                    key={day}
                    className="text-xl leading-none text-center text-gray-950 dark:text-slate-50"
                  >
                    {getWeekDay(day)}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}
