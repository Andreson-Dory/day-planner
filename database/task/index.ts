import { CreateTask, Task } from "@/constant/types/task";
import { formatLocalDate } from "@/utils/date";
import { SQLiteDatabase } from "expo-sqlite";

/**
 * 
 * @param db - SQLite database instance
 * @param task - Task to insert in database
 * @param tasks - Tasks get after fetch
 * @returns Promise<boolean> - Return true if insertion succeeds 
 */

export const addTask = async (
    db: SQLiteDatabase,
    task: CreateTask    
) => {
    const { taskTitle, startTime, endTime, taskDate , startNotificationId, endNotificationId, startReminderId, endReminderId } = task;
    const insertQuery = ` INSERT INTO TASKS ( taskTitle, startTime, endTime, taskDate, startNotificationId, endNotificationId, startReminderId, endReminderId) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?); `;
    const values = [
        taskTitle,
        startTime,
        endTime,
        taskDate,
        startNotificationId,
        endNotificationId,
        startReminderId || '',
        endReminderId || ''
    ];

    try {
        const result = await db.runAsync(insertQuery, values);
        return result.lastInsertRowId;
    } catch (error) {
        console.error(error);
        throw Error('Failed to add task');
    }
}

export const addArrayOfTask = async (db: SQLiteDatabase, tasks: CreateTask[]): Promise<boolean> => {
    const insertQuery = ` INSERT INTO TASKS ( taskTitle, startTime, endTime, taskDate, startNotificationId, endNotificationId, startReminderId, endReminderId) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?); `;
    try {
        await db.withTransactionAsync(async () => {
            const statement = await db.prepareAsync(insertQuery);
            try {
                for (const task of tasks) {
                    const { taskTitle, startTime, endTime, taskDate, startNotificationId, endNotificationId, startReminderId, endReminderId} = task;
                    const values = [
                        taskTitle,
                        startTime,
                        endTime,
                        taskDate,
                        startNotificationId, 
                        endNotificationId,
                        startReminderId,
                        endReminderId
                    ];
                    await statement.executeAsync(values);
                }
            } finally {
                await statement.finalizeAsync();
            }
        });
        return true;
    } catch (error) {
        console.error(error);
        throw Error('Failed to save tasks');
    }
}

export const getTasksToday = async ( db: SQLiteDatabase): Promise<Task[]> => {
    const today = new Date();
    const todayString = formatLocalDate(today);
    const selectQuery = ` SELECT * FROM TASKS WHERE taskDate = $date; `;

    try {
        const result = await db.getAllAsync<Task>(selectQuery, { $date: todayString } );
        return result;
    } catch (error) {
        console.error(error);
        throw Error(' Failed to get today tasks ');
    }
}

export const getTasksWeek = async ( db: SQLiteDatabase, startDate: string, endDate: string): Promise<Task[]> => {
    const selectQuery = ` SELECT * FROM TASKS WHERE taskDate BETWEEN ? AND ?; `;

    try {
        const result = await db.getAllAsync<Task>(selectQuery, [ startDate, endDate ]);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get week tasks');        
    }
}

export const getAllTasks = async ( db: SQLiteDatabase): Promise<Task[]> => {
    const selectQuery = ` SELECT * FROM TASKS; `;

    try {
        const result = await db.getAllAsync<Task>(selectQuery);
        return result;
    } catch (error) {
        console.error(error);
        throw Error(' Failed to get all tasks ');
    }
}

export const getTasksCurrentCreatedPlan = async ( db: SQLiteDatabase, startDate: string): Promise<Task[]> => {
    const selectQuery = ` SELECT * FROM TASKS WHERE taskDate >= ?; `;

    try {
        const result = await db.getAllAsync<Task>(selectQuery, [ startDate ]);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to get current created plan tasks');        
    }
}

export const finishTask = async ( db: SQLiteDatabase, idTask: number) => {
    const updateQuery = ` UPDATE TASKS SET isCompleted=1 WHERE idTask = ?; `;

    try {
        const result = await db.runAsync(updateQuery, [ idTask ]);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to update task');        
    }
}

export const updateTaskNotificationIds = async ( 
    db: SQLiteDatabase, 
    idTask: number, 
    startNotificationId: string, 
    endNotificationId: string,
    startReminderId: string,
    endReminderId: string
) => {
    const updateQuery = ` UPDATE TASKS SET startNotificationId=? AND endNotificationId=? AND startReminderId=? AND endReminderId=? WHERE idTask = ?; `;
    const values =[startNotificationId, endNotificationId, startReminderId, endReminderId, idTask]
    
    try {
        const result = await db.runAsync(updateQuery, values);
        return result;
    } catch (error) {
        console.error(error);
        throw Error('Failed to update task\' NotificationId ');        
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