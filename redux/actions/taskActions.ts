import {
  GET_PLAN_TASKS,
  GET_PLAN_TASKS_ERROR,
  GET_PLAN_TASKS_SUCCESS,
  GET_DAILY_TASKS,
  GET_DAILY_TASKS_ERROR,
  GET_DAILY_TASKS_SUCCESS,
  GET_WEEK_TASKS,
  GET_WEEK_TASKS_ERROR,
  GET_WEEK_TASKS_SUCCESS,
} from "@/constant";
import {
  getCurrentCreatedPlanTaskService,
  getDailyTasksService,
  getWeekTasksService,
} from "@/services/task-sevices";
import { SQLiteDatabase } from "expo-sqlite";
import { Dispatch } from "react";

export const getTasksDailyAction = (db: SQLiteDatabase, date: string) => {
  return async (disptach: Dispatch<any>) => {
    disptach({ type: GET_DAILY_TASKS });
    try {
      const response = await getDailyTasksService(db, date);
      disptach({ type: GET_DAILY_TASKS_SUCCESS, payload: response });
    } catch (error) {
      console.error(error);
      disptach({ type: GET_DAILY_TASKS_ERROR });
    }
  };
};

export const getTasksWeekAction = (db: SQLiteDatabase, startDate: string, endDate: string) => {
  return async (disptach: Dispatch<any>) => {
    disptach({ type: GET_WEEK_TASKS });

    try {
      const response = await getWeekTasksService(db, startDate, endDate);
      disptach({ type: GET_WEEK_TASKS_SUCCESS, payload: response });
    } catch (error) {
      console.error(error);
      disptach({ type: GET_WEEK_TASKS_ERROR });
    }
  };
};

export const getTasksCurrentCreatedPlanAction = (db: SQLiteDatabase, startDate: string) => {
  return async (disptach: Dispatch<any>) => {
    disptach({ type: GET_PLAN_TASKS });

    try {
      const response = await getCurrentCreatedPlanTaskService(db, startDate);
      disptach({ type: GET_PLAN_TASKS_SUCCESS, payload: response });
    } catch (error) {
      console.error(error);
      disptach({ type: GET_PLAN_TASKS_ERROR });
    }
  };
};
