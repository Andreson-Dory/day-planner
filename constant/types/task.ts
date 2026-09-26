import { SQLiteDatabase } from "expo-sqlite";
import { Dispatch } from "react";
import { TextProps } from "react-native-svg";

export interface CreateTask {
  idTask: number;
  taskTitle: string;
  startTime: string;
  endTime: string;
  taskDate: string;
  isRepetitive: number;
  repeatType: "daily" | "weekly" | "monthly" | null;
  startNotificationId: string;
  endNotificationId: string;
  startReminderId: string;
  endReminderId: string;
}

export interface Task {
  idTask: number;
  taskTitle: string;
  startTime: string;
  endTime: string;
  taskDate: string;
  isCompleted: number;
  isRepetitive: number;
  repeatType: "daily" | "weekly" | "monthly" | null;
  startNotificationId: string;
  endNotificationId: string;
  startReminderId: string;
  endReminderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskProps = TextProps & {
  task: Task;
  view: string;
  db: SQLiteDatabase | null;
  date: string;
  deleteSetter?: Dispatch<any>;
};
