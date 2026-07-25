import { TasksContainerProps } from "@/constant/types/TasksContainer";
import { ScrollView } from "react-native";
import { TaskCard } from "./Task";

export function TasksContainer({ dailyTasks, view, currentDate, db }: TasksContainerProps) {
  return (
    <ScrollView className="mb-7" showsVerticalScrollIndicator={false}>
      {dailyTasks.map((task) => (
        <TaskCard key={task.idTask} task={task} view={view} date={currentDate} db={db} />
      ))}
    </ScrollView>
  );
}
