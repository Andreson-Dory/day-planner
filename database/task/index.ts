import { task } from "@/constant/types/task";
import { SQLiteDatabase } from "expo-sqlite";

/**
 * 
 * @param db - SQLite database instance
 * @param task - Task to insert in database
 * @returns Promise<boolean> - Return true if insertion succeeds 
 */

export const addTask = async ( db: SQLiteDatabase, task: task) => {
    const { taskTitle, startTime, endTime, taskDate} = task;
    const insertQuery = ` INSERT INTO TASKS ( taskTitle, startTime, endTime, taskDate) VALUES ( ?, ?, ?, ?); `;
    const values = [ taskTitle, startTime, endTime, taskDate];

    try {
        const result = await db.runAsync(insertQuery, values);
        return result.lastInsertRowId;
    } catch (error) {
        console.error(error);
        throw Error('Failed to add task');
    }
}

export const addArrayOfTask = async ( db: SQLiteDatabase, tasks: task[] ): Promise<boolean> => {
    const insertQuery = ` INSERT INTO TASKS ( taskTitle, startTime, endTime, taskDate) VALUES ( ?, ?, ?, ?); `;
    try {
        await db.withTransactionAsync(async () => {
            const statement = await db.prepareAsync(insertQuery);
            try {
                for(const task of tasks) {
                    const { taskTitle, startTime, endTime, taskDate} = task;
                    const values = [ taskTitle, startTime, endTime, taskDate];

                    await statement.executeAsync(values);
                }
            }
            finally {
                await statement.finalizeAsync();
            }
        })
        return true;
    } catch(error) {
        console.error(error);
        throw Error('Failed to save tasks');
    } 
}

export const getTasksToday = async ( db: SQLiteDatabase): Promise<task[]> => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const selectQuery = ` SELECT * FROM TASKS WHERE taskDate = $date; `;

    try {
        const result = await db.getAllAsync<task>(selectQuery, { $date: todayString } );
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

export const getTasksCurrentCreatedPlan = async ( db: SQLiteDatabase, startDate: string): Promise<task[]> => {
    const selectQuery = ` SELECT * FROM TASKS WHERE taskDate >= ?; `;

    try {
        const result = await db.getAllAsync<task>(selectQuery, [ startDate ]);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get current created plan tasks');        
    }
}

export const finishTask = async ( db: SQLiteDatabase, idTask: number) => {
    const selectQuery = ` UPDATE TASKS SET isCompleted=1 WHERE idTask = ?; `;

    try {
        const result = await db.runAsync(selectQuery, [ idTask ]);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to update task');        
    }
}

export const deleteTask = async ( db: SQLiteDatabase, idTask: number ) => {
    const deleteQuery = ` DELETE FROM TASKS WHERE idTask = ?; `;

    try {
        const result = await db.runAsync(deleteQuery, [ idTask ]);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to delete task');
    }
}