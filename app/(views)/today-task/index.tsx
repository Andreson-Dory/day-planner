import { ScrollView, TextProps, View } from "react-native";
import RouterView from "../router-view";
import { useContext, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";
import { AddButton } from "@/components/actionButton/AddButton";
import { useDispatch } from "react-redux";
import { getTasksTodayAction } from "@/redux/actions/taskActions";
import { DatabaseContext } from "@/context/databaseContext";
import { SQLiteDatabase } from "expo-sqlite";
import { useStatusHeader } from "@/hooks/useStatusHeader";
import { Task } from "@/constant/types/task";
import { TaskCard } from "@/components/task/Task";
import { formatLocalDate } from "@/utils/date";
import AddTaskModal from "@/components/task/addTaskModal";

type Props = TextProps & {
  tasks: Task[];
  db: SQLiteDatabase | null;
};

function Contents({ tasks, db }: Props) {
  return (
    <View>
      {tasks.map((task) => (
        <TaskCard key={task.idTask} task={task} view="today" startDate="" endDate="" db={db} />
      ))}
    </View>
  );
}

export default function TodayTask() {
  const dispatch = useDispatch();
  const db = useContext(DatabaseContext);
  const { filteredTasks, filter, setTasks, setFilter } = useStatusHeader();
  const tasks: Task[] = useAppSelector((state) => state.tasks.todaysTasks);
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);

  useEffect(() => {
    if (!db) return;
    dispatch<any>(getTasksTodayAction(db));
  }, [db, dispatch]);

  useEffect(() => {
    setTasks(tasks);
  }, [tasks]);

  return (
    <View className="flex-1">
      <RouterView>
        <SubHeader
          text="Today Task"
          onPress={() => {
            if (db) {
              dispatch<any>(getTasksTodayAction(db));
            }
          }}
        />
        <StatusHeader filter={filter} setFilter={setFilter} />
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-5">
          <Contents tasks={filteredTasks} db={db} />
        </ScrollView>
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
      </RouterView>
    </View>
  );
}
