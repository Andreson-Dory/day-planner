export type task = {
    id: number;
    title: string;  
    startTime: string;
    endTime: string;
    date: string;
    isCompleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}