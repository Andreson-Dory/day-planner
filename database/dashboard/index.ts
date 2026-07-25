import { Task } from "@/constant/types/task";
import { SQLiteDatabase } from "expo-sqlite";

export const getDashboardStat = async (db: SQLiteDatabase) => {
  const taskCountQuery = `
    SELECT COUNT(*) AS count 
    FROM tasks 
    WHERE taskDate = date('now');
  `;

  const completedTaskCountQuery = `
    SELECT COUNT(*) AS count 
    FROM tasks 
    WHERE taskDate = date('now') AND isCompleted = 1;
  `;

  const weekTaskCountQuery = `
    SELECT COUNT(*) AS count
    FROM tasks
    WHERE taskDate >= date('now', 'weekday 1', '-7 days')
      AND taskDate < date('now', 'weekday 1', '-7 days', '+7 days');
  `;

  const completedWeekTaskCountQuery = `
    SELECT COUNT(*) AS count
    FROM tasks
    WHERE taskDate >= date('now', 'weekday 1', '-7 days')
      AND taskDate < date('now', 'weekday 1', '-7 days', '+7 days')
      AND isCompleted = 1;
  `;

  const monthTaskCountQuery = `
    SELECT COUNT(*) AS count
    FROM tasks
    WHERE taskDate >= date('now', 'start of month')
      AND taskDate < date('now', 'start of month', '+1 month');
  `;

  const completedMonthTaskCountQuery = `
    SELECT COUNT(*) AS count
    FROM tasks
    WHERE taskDate >= date('now', 'start of month')
      AND taskDate < date('now', 'start of month', '+1 month')
      AND isCompleted = 1;
  `;

  try {
    const [
      taskCount,
      completedTaskCount,
      weekTaskCount,
      completedWeekTaskCount,
      monthTaskCount,
      completedMonthTaskCount,
    ] = await Promise.all([
      db.getFirstAsync<{ count: number }>(taskCountQuery),
      db.getFirstAsync<{ count: number }>(completedTaskCountQuery),
      db.getFirstAsync<{ count: number }>(weekTaskCountQuery),
      db.getFirstAsync<{ count: number }>(completedWeekTaskCountQuery),
      db.getFirstAsync<{ count: number }>(monthTaskCountQuery),
      db.getFirstAsync<{ count: number }>(completedMonthTaskCountQuery),
    ]);

    return {
      taskCount,
      completedTaskCount,
      weekTaskCount,
      completedWeekTaskCount,
      monthTaskCount,
      completedMonthTaskCount,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get dashboard stats");
  }
};

export const getUncompletedTaskToday = async (db: SQLiteDatabase) => {
  const UncompletedTaskQuery = ` 
    SELECT * FROM TASKS 
      WHERE taskDate = CURRENT_DATE AND isCompleted = 0 
        OR (isRepetitive = 1 AND repeatType = 'daily' AND isCompleted = 0)
        OR (isRepetitive = 1 AND repeatType = 'weekly'
            AND strftime('%w', taskDate) = strftime('%w', CURRENT_DATE)
            AND date(taskDate) <= date(CURRENT_DATE) AND isCompleted = 0)
        OR (isRepetitive = 1 AND repeatType = 'monthly'
            AND strftime('%d', taskDate) = strftime('%d', CURRENT_DATE)
            AND date(taskDate) <= date(CURRENT_DATE) AND isCompleted = 0); 
    `;
  try {
    const result = await db.getAllAsync<Task>(UncompletedTaskQuery);
    return result;
  } catch (error) {
    console.error(error);
    throw Error(" Failed to get uncompleted tasks ");
  }
};
