import { Task } from "@/constant/types/task";
import { useEffect, useState } from "react";

export function useStatusHeader () {
    const [ tasks, setTasks ] = useState<Task[]>([]);
    const [ filteredTasks, setFilteredTasks ] = useState<Task[]>([]);
    const [ filter, setFilter ] = useState<'All' | 'Pending' | 'Completed'>('All');

    const filterTasks = () => {
        if(filter === "All") setFilteredTasks(tasks)
        else if(filter === "Pending") setFilteredTasks(tasks.filter(task => task.isCompleted === 0))
        else if(filter === "Completed") setFilteredTasks(tasks.filter(task => task.isCompleted === 1))
    }

    useEffect(() => {
        filterTasks();
    }, [filter, tasks])

    return {
        filteredTasks,
        filter,
        setTasks,
        setFilter
    }
}