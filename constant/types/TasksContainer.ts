import { TextProps } from "react-native";
import { Task } from "./task";
import { SQLiteDatabase } from "expo-sqlite";

export type TasksContainerProps = TextProps & {
  dailyTasks: Task[];
  view: string;
  currentDate: string;
  db: SQLiteDatabase | null;
};
