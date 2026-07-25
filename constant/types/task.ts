export interface CreateTask {
  idTask: number;
  taskTitle: string;
  startTime: string;
  endTime: string;
  taskDate: string;
  isRepetitive: number;
  repeatType: "daily" | "weekly" | "monthly" | null;
  startNotificationId: string;
  endNotificationId: string;
  startReminderId: string;
  endReminderId: string;
}

export interface Task {
  idTask: number;
  taskTitle: string;
  startTime: string;
  endTime: string;
  taskDate: string;
  isCompleted: number;
  isRepetitive: number;
  repeatType: "daily" | "weekly" | "monthly" | null;
  startNotificationId: string;
  endNotificationId: string;
  startReminderId: string;
  endReminderId: string;
  createdAt: Date;
  updatedAt: Date;
}
