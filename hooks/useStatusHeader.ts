import { task } from "@/constant/types/task";
import { useEffect, useState } from "react";

export function useStatusHeader () {
    const [ isCompleted, setIsCompleted ] = useState<boolean>(false)
    const [ tasks, setTasks ] = useState<task[]>([])
    const [ filteredTasks, setFilteredTasks ] = useState<task[]>([])

    const filterTasks = () => {
        if(isCompleted === false) setFilteredTasks(tasks.filter(task => task.isCompleted === 0))
        else if(isCompleted === true) setFilteredTasks(tasks.filter(task => task.isCompleted === 1))
    }

    const toggleCompleted = () => {
        setIsCompleted(!isCompleted)
    }

    useEffect(() => {
        filterTasks();
    }, [isCompleted, tasks])

    return {
        isCompleted: isCompleted,
        setTasks: setTasks,
        filteredTasks: filteredTasks,
        toggleCompleted: toggleCompleted,
    }
}