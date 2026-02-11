import { task } from "@/app/constant/types/task";
import { SQLiteDatabase, SQLiteExecuteAsyncResult } from "expo-sqlite";

export const addTask = async ( db: SQLiteDatabase, task: task) => {
    const { title, startTime, endTime, date} = task;
    const insertQuery = ` INSERT INTO TASKS ( taskTitle, startTime, endTime, taskDate) VALUES ( ?, ?, ?, ?); `;
    const values = [ title, startTime, endTime, date.toISOString().split('T')[0] ];

    try {
        const result = await db.runAsync(insertQuery, values);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to add task');
    }
}

export const getTasksToday = async ( db: SQLiteDatabase): Promise<task[]> => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const selectQuery = ` SELECT * FROM TASKS WHERE taskDate = $date; `;

    try {
        const result = await db.getAllAsync<task>(selectQuery, [ todayString ]);
        return result;
    } catch (error) {
        console.error(error);
        throw Error(' Failed to get today tasks ');
    }
}

export const getTasksWeek = async ( db: SQLiteDatabase, startDate: string, endDate: string): Promise<task[]> => {
    const selectQuery = ` SELECT * FROM TASKS WHERE taskDate BETWEEN ? AND ?; `;

    try {
        const result = await db.getAllAsync<task>(selectQuery, [ startDate, endDate ]);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get week tasks');        
    }
}

export const deleteTask = async ( db: SQLiteDatabase, idTask: number) => {
    const deleteQuery = ` DELETE FROM TASKS WHERE idTask = ?; `;

    try {
        return await db.runAsync(deleteQuery, [ idTask ]);
    } catch (error) {
        console.error(error);
        throw Error('Failed to delete task');
    }
}