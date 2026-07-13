import { Pressable, ScrollView, TextProps, View } from "react-native";
import RouterView from "../router-view";
import { useContext, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ThemedText } from "@/components/ThemedText";
import { AddButton } from "@/components/actionButton/AddButton";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";
import { useDispatch } from "react-redux";
import { getTasksWeekAction } from "@/redux/actions/taskActions";
import { DatabaseContext } from "@/context/databaseContext";
import { SQLiteDatabase } from "expo-sqlite";
import { useStatusHeader } from "@/hooks/useStatusHeader";
import { TaskCard } from "@/components/task/Task";
import { Task } from "@/constant/types/task";
import { formatLocalDate } from "@/utils/date";
import { useThemeColors } from "@/hooks/useThemeColors";
import AddTaskModal from "@/components/task/addTaskModal";

type Props = TextProps & {
  weekTasks: Task[];
  weekDays: string[];
  db: SQLiteDatabase | null;
  filter: string;
};

type getDateProps = {
  setWeekDays: React.Dispatch<React.SetStateAction<string[]>>;
  setWeekDaysCompleted: React.Dispatch<React.SetStateAction<boolean>>;
};

const getDatesInRange = ({ setWeekDays, setWeekDaysCompleted }: getDateProps) => {
  setWeekDays([]);
  let currentDate = new Date();

  const dayOfCurrentWeek = currentDate.getDay();
  const firstWeekDate = new Date(currentDate);
  const lastWeekDate = new Date(currentDate);
  firstWeekDate.setDate(currentDate.getDate() - dayOfCurrentWeek + 1);
  lastWeekDate.setDate(firstWeekDate.getDate() + 6);
  while (firstWeekDate <= lastWeekDate) {
    const dateString = formatLocalDate(firstWeekDate);
    setWeekDays((prev) => [...prev, dateString]);
    firstWeekDate.setDate(firstWeekDate.getDate() + 1);
  }
  setWeekDaysCompleted(true);
};

function Contents({ weekTasks, weekDays, db, filter }: Props) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const now = formatLocalDate(new Date());
  const toogleDays = (index: number) => {
    setOpenDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <ScrollView className="mb-2.5" showsVerticalScrollIndicator={false}>
      {weekDays.map((day, index) => {
        const shouldRender = filter === "Completed" ? day <= now : day >= now;
        const newIndex = index + 1;

        if (!shouldRender) return null;

        return (
          <View key={newIndex} className="flex-col gap-1.25 mt-2.5 mx-2.5">
            <Pressable onPress={() => toogleDays(newIndex)}>
              <ThemedText className="text-lg leading-none mt-1.25 w-full text-center py-3.75 rounded-2xl text-slate-50 dark:text-slate-800 bg-sky-400 dark:bg-sky-600">
                {new Date(day + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </ThemedText>
            </Pressable>
            {openDays.has(newIndex) && (
              <View>
                {weekTasks
                  .filter((task) => task.taskDate === day)
                  .map((taskItem) => (
                    <TaskCard
                      key={taskItem.idTask}
                      task={taskItem}
                      view="week"
                      startDate={weekDays[0]}
                      endDate={weekDays[6]}
                      db={db}
                    />
                  ))}
                {filter !== "Completed" && (
                  <AddButton className="mt-1.25 h-10.5" onPress={() => setShowAddTaskModal(true)} />
                )}

                <AddTaskModal
                  showAddModal={showAddTaskModal}
                  setShowAddModal={setShowAddTaskModal}
                  date={day}
                  view="week"
                  startDate={weekDays[0]}
                  endDate={weekDays[6]}
                />
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

export default function WeekTask() {
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [weekDaysCompleted, setWeekDaysCompleted] = useState<boolean>(false);
  const db = useContext(DatabaseContext);
  const { filteredTasks, filter, setTasks, setFilter } = useStatusHeader();
  const dispatch = useDispatch();
  const tasks = useAppSelector<Task[]>((state) => state.tasks.weekTasks);

  useEffect(() => {
    getDatesInRange({ setWeekDays, setWeekDaysCompleted });
  }, []);

  useEffect(() => {
    if (!db) return;
    if (!weekDaysCompleted) return;

    dispatch<any>(getTasksWeekAction(db, weekDays[0], weekDays[6]));
  }, [db, weekDaysCompleted, weekDays]);

  useEffect(() => {
    setTasks(tasks);
  }, [tasks]);

  return (
    <View className="flex-1">
      <RouterView>
        <SubHeader
          text="Week Task"
          onPress={() => {
            if (db && weekDaysCompleted) {
              dispatch<any>(getTasksWeekAction(db, weekDays[0], weekDays[6]));
            }
          }}
        />
        <StatusHeader filter={filter} setFilter={setFilter} />
        <Contents weekTasks={filteredTasks} weekDays={weekDays} db={db} filter={filter} />
      </RouterView>
    </View>
  );
}
