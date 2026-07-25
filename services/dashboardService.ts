import { getDashboardStat, getUncompletedTaskToday } from "@/database/dashboard";
import { SQLiteDatabase } from "expo-sqlite";

export const fetchDashboardStat = async (db: SQLiteDatabase) => {
  const response = await getDashboardStat(db);
  return response;
};

export const fetchUpcomingTask = async (db: SQLiteDatabase) => {
  const response = await getUncompletedTaskToday(db);
  return response;
};
