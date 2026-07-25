import {
  GET_DASHBOARD_STATUS,
  GET_DASHBOARD_STATUS_ERROR,
  GET_DASHBOARD_STATUS_SUCCESS,
} from "@/constant";
import { getUncompletedTaskToday } from "@/database/dashboard";
import { fetchDashboardStat } from "@/services/dashboardService";
import { SQLiteDatabase } from "expo-sqlite";
import { Dispatch } from "react";

export const fetchDashboardStatAction = (db: SQLiteDatabase) => {
  return async (disptach: Dispatch<any>) => {
    disptach({ type: GET_DASHBOARD_STATUS });
    try {
      const dashboardStatus = await fetchDashboardStat(db);
      const dashboardUncompletedTasks = await getUncompletedTaskToday(db);
      disptach({
        type: GET_DASHBOARD_STATUS_SUCCESS,
        payload: { status: dashboardStatus, uncompletedTasks: dashboardUncompletedTasks },
      });
    } catch (error) {
      console.error(error);
      disptach({ type: GET_DASHBOARD_STATUS_ERROR });
    }
  };
};
