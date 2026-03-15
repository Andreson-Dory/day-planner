import * as SQLite from "expo-sqlite";

export const connectToDatabase = async () => {
  return SQLite.openDatabaseAsync("day-planner");
};

export const createTables = async (db: SQLite.SQLiteDatabase) => {
  const PRAGMA = " PRAGMA JOURNAL_MODE = WAL; PRAGMA synchronous = NORMAL; ";

    const TasksQuery = `
      CREATE TABLE IF NOT EXISTS TASKS (
        idTask INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        taskTitle TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        taskDate TEXT NOT NULL,
        isCompleted INTEGER NOT NULL DEFAULT 0,
        startNotificationId TEXT,
        endNotificationId TEXT,
        startReminderId TEXT,
        endReminderId TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now')),
        updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `;

  const IndexQuery = `
        CREATE INDEX IF NOT EXISTS idx_task_date ON TASKS (taskDate);
    `;

  try {
    await db.execAsync(PRAGMA);
    await db.execAsync(TasksQuery + IndexQuery);
  } catch (error) {
    console.error("Failed to create table in database", error);
  }
};
