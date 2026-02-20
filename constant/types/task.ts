export type task = {
    idTask: number;
    taskTitle: string;  
    startTime: string;
    endTime: string;
    taskDate: string;
    isCompleted?: number;
    createdAt?: Date;
    updatedAt?: Date;
}