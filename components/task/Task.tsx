import { Pressable, TextProps, View } from "react-native";
import { Dispatch } from "react";
import Button from "../button/Button";
import { ThemedText } from "../ThemedText";
import Row from "../row";
import { SQLiteDatabase } from "expo-sqlite";
import { Task } from "@/constant/types/task";
import { useTaskData } from "@/hooks/useTaskData";
import { StatusBadge } from "./StatusBadge";

type Props = TextProps & {
  task: Task;
  view: string;
  db: SQLiteDatabase | null;
  startDate: string;
  endDate: string;
  deleteSetter?: Dispatch<any>;
};

export function TaskCard({ task, view, db, startDate, endDate, deleteSetter }: Props) {
  const {
    idTask,
    taskStatus,
    taskColor,
    borderColor,
    durationStr,
    startTimeStr,
    endTimeStr,
    pressed,
    setPressed,
    dispatch,
    handleFinish,
    handleDelete,
  } = useTaskData(task);
  return (
    <Pressable onPress={() => setPressed(!pressed)}>
      <View
        className={`flex-col py-3.75 px-3.75 mt-1.25 mb-1.25 mx-1.25 border-l-4 rounded-2xl gap-1.25 ${taskColor} ${borderColor}`}
      >
        <ThemedText className="text-lg leading-none text-slate-950 dark:text-slate-50">
          {task.taskTitle}
        </ThemedText>
        {pressed && (
          <View>
            <View className="items-start">
              <StatusBadge status={taskStatus} />
            </View>
            <View className="flex-row gap-0.25 my-1.25 mx-2.5">
              <ThemedText className="text-base leading-none font-thin text-slate-950 dark:text-slate-50">
                {startTimeStr} - {endTimeStr}{" "}
              </ThemedText>
              <ThemedText className="text-base leading-none font-bold text-slate-500 dark:text-slate-300">
                ({durationStr})
              </ThemedText>
            </View>
            {taskStatus !== "completed" && (
              <Row>
                {view === "create_plan" ? null : (
                  <Button
                    type="Finish"
                    onPress={() => handleFinish(task, db, view, dispatch, startDate, endDate)}
                  />
                )}
                <Button
                  type="Delete"
                  onPress={() => {
                    if (view === "create_plan") {
                      if (!deleteSetter) return;
                      deleteSetter(task);
                    } else handleDelete(task, db, view, dispatch, startDate, endDate);
                  }}
                />
              </Row>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
