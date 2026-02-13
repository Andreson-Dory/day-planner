import { task } from '@/constant/types/task';
import { addTask, deleteTask, getTasksCurrentCreatedPlan, getTasksToday, getTasksWeek } from '@/database/task/index';
import { SQLiteDatabase } from 'expo-sqlite';

export const addTaskService = async (db: SQLiteDatabase, task: task) => {
    const response = await addTask(db, task);
    return response;
}

export const getTodayTasksService = async (db: SQLiteDatabase) => {
    const response = await getTasksToday(db);
    return response;
}

export const getWeekTasksService = async (db: SQLiteDatabase, startDate: string, endDate: string) => {
    const response = await getTasksWeek(db, startDate, endDate);
    return response;
}

export const getCurrentCreatedPlanTaskService = async (db: SQLiteDatabase, startDate: string) => {
    const response = await getTasksCurrentCreatedPlan(db, startDate);
    return response;
}

export const deleteTaskService = async (db: SQLiteDatabase, idTask: number) => {
    const response = await deleteTask(db, idTask);
    return response;
}