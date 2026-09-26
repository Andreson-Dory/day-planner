import { Pressable, TextProps, View } from "react-native";
import Button from "../button/Button";
import { ThemedText } from "../ThemedText";
import Row from "../row";
import { Task, TaskProps } from "@/constant/types/task";
import { useTaskData } from "@/hooks/useTaskData";
import { StatusBadge } from "./StatusBadge";
import { useState } from "react";
import DeleteTaskModal from "./DeleteConfirmation";

export function TaskCard({ task, view, db, date, deleteSetter }: TaskProps) {
  const {
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
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
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
            {!task.isRepetitive && (
              <View className="items-start">
                <StatusBadge status={taskStatus} />
              </View>
            )}
            <View className="flex-row items-start justify-between gap-0.25 my-1.25 mx-2.5">
              <View className="flex-row gap-0.25 my-1.25 mx-2.5">
                <ThemedText className="text-base leading-none font-thin text-slate-950 dark:text-slate-50">
                  {startTimeStr} - {endTimeStr}
                </ThemedText>
                <ThemedText className="text-base leading-none font-bold text-slate-500 dark:text-slate-300">
                  ({durationStr})
                </ThemedText>
              </View>
              {task.isRepetitive === 1 && (
                <ThemedText className="text-xl leading-none font-bold text-slate-500 dark:text-slate-300">
                  {task.repeatType?.toUpperCase()}
                </ThemedText>
              )}
            </View>
            {view !== "dashboard" && (
              <Row>
                {view === "create_plan" ||
                task.isRepetitive === 1 ||
                taskStatus === "completed" ? null : (
                  <Button
                    type="Finish"
                    onPress={() => handleFinish(task, db, view, dispatch, date)}
                  />
                )}

                {taskStatus !== "completed" &&
                  (task.isRepetitive === 0
                    ? true
                    : (view === "repetitive" || view === "create_plan") &&
                      task.isRepetitive === 1) && (
                    <Button
                      type="Delete"
                      onPress={() => {
                        if (view !== "create_plan") {
                          setShowDeleteModal(true);
                          return;
                        }
                        if (!deleteSetter) return;
                        deleteSetter(task);
                      }}
                    />
                  )}
              </Row>
            )}
          </View>
        )}
      </View>
      <DeleteTaskModal
        showDeleteConfirmationModal={showDeleteModal}
        setShowDeleteConfirmationModal={setShowDeleteModal}
        task={task}
        db={db}
        view={view}
        date={date}
        dispatch={dispatch}
        handleDelete={handleDelete}
      />
    </Pressable>
  );
}
