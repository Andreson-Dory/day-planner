export interface  CreateTask {
    idTask: number;
    taskTitle: string;  
    startTime: string;
    endTime: string;
    taskDate: string;
}

export interface Task {
    idTask: number;
    taskTitle: string;  
    startTime: string;
    endTime: string;
    taskDate: string;
    isCompleted: number;
    startNotificationId: string;
    endNotificationId: string;
    startReminderId: string;
    endReminderId: string;
    createdAt: Date;
    updatedAt: Date;
}