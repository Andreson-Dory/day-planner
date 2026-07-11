import { Task } from "@/constant/types/task";
import { SQLiteDatabase } from "expo-sqlite";
import { Dispatch, useEffect, useState } from "react";
import { useThemeColors } from "./useThemeColors";
import { calculateDuration, formatDuration, formatTime } from "@/utils/date";
import { useDispatch } from "react-redux";
import { deleteTaskService, setFinishedTask } from "@/services/task-sevices";
import { getTasksTodayAction, getTasksWeekAction } from "@/redux/actions/taskActions";
import { alarmNotificationService } from "@/lib/notifications";
import { useTheme } from "./useTheme";
import Toast from "react-native-toast-message";

const getTaskStatus = (task: Task) => {
  const now = new Date();
  const startTime = new Date(task.startTime);
  const endTime = new Date(task.endTime);

  if (task.isCompleted) {
    return "completed";
  } else if (endTime < now) {
    return "overdue";
  } else if (startTime > now) {
    return "upcoming";
  } else if (startTime < now && endTime > now) {
    return "ongoing";
  }
  return "completed";
};

const handleFinish = async (
  task: Task,
  db: SQLiteDatabase | null,
  view: string,
  dispatch: Dispatch<any>,
  startDate: string,
  endDate: string,
) => {
  if (!db) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Not connected to the database!",
      position: "top",
    });
    return;
  }
  const ids = [
    task.startNotificationId,
    task.startReminderId,
    task.endNotificationId,
    task.endReminderId,
  ];
  await alarmNotificationService.cancel(ids);
  await setFinishedTask(db, task.idTask);
  if (view === "today") dispatch(getTasksTodayAction(db));
  else if (view === "week") dispatch(getTasksWeekAction(db, startDate, endDate));
};

const handleDelete = async (
  task: Task,
  db: SQLiteDatabase | null,
  view: string,
  dispatch: Dispatch<any>,
  startDate: string,
  endDate: string,
) => {
  if (!db) {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Not connected to the database!",
      position: "top",
    });
    return;
  }
  const ids = [
    task.startNotificationId,
    task.startReminderId,
    task.endNotificationId,
    task.endReminderId,
  ];
  await alarmNotificationService.cancel(ids);
  await deleteTaskService(db, task.idTask)
    .then(() => {
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Task deleted",
        position: "top",
      });
    })
    .catch(() => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error deleting the task",
        position: "top",
      });
    });
  if (view === "today") dispatch(getTasksTodayAction(db));
  else if (view === "week") dispatch(getTasksWeekAction(db, startDate, endDate));
};

export function useTaskData(task: Task) {
  const { theme } = useTheme();
  const colors = useThemeColors();
  const dispatch = useDispatch();
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [taskColor, setTaskColor] = useState<string>("");
  const [borderColor, setBorderColor] = useState<string>("");
  const startTime = new Date(task.startTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const endTime = new Date(task.endTime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const duration = calculateDuration(startTime, endTime);
  const durationStr = formatDuration(duration);
  const startTimeStr = formatTime(startTime);
  const endTimeStr = formatTime(endTime);
  const [pressed, setPressed] = useState(false);

  const getTaskColor = (status: string) => {
    switch (status) {
      case "completed":
        return { tc: colors.taskCompleted, bc: colors.taskCompletedBorder };

      case "overdue":
        return { tc: colors.taskOverdue, bc: colors.taskOverdueBorder };

      case "upcoming":
        return { tc: colors.taskUpcoming, bc: colors.taskUpcomingBorder };

      case "ongoing":
        return { tc: colors.taskOngoing, bc: colors.taskOngoingBorder };

      default:
        return { tc: colors.taskUpcoming, bc: colors.taskUpcomingBorder };
    }
  };

  useEffect(() => {
    const status = getTaskStatus(task);
    const { tc, bc } = getTaskColor(status);
    setTaskColor(tc);
    setBorderColor(bc);
    setTaskStatus(status);
  }, [task, theme]);

  return {
    //Data
    idTask: task.idTask,
    taskStatus,
    taskColor,
    borderColor,
    durationStr,
    startTimeStr,
    endTimeStr,
    pressed,
    //Actions
    setPressed,
    dispatch,
    //Services
    handleFinish,
    handleDelete,
  };
}
