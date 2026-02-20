import { task } from "@/constant/types/task";
import { useEffect, useState } from "react";

export function usePlanDraft () {
    const [ period, setPeriod ] = useState<Array<string>>([])
    const [ draft, setDraft ] = useState<Record<string, task[]>>({})
    
    useEffect(() => {
        const length = period.length
        let newDraft: Record<string, task[]> = {}
        for (let index = 0; index < length; index++) {
            const element = period[index]
            if(draft[element]) newDraft = {...newDraft, [element]: draft[element]}
            else newDraft = {...newDraft, [element]: []}
        }
        setDraft(newDraft)
    }, [period])

    const addTask = (day: string, task: task) => {
        setDraft( prev => ({...prev, [day]: [...prev[day]?? [], task ]}))
    }

    const deleteTask = (task: task) => {
        setDraft( prev => (
            {...prev,
                 [task.taskDate]: [...prev[task.taskDate].filter( current => current.idTask !== task.idTask)]
            }))
    }

    const reset = () => {
        setPeriod([])
        setDraft({})
    }
    
    return {
        data: draft,
        setPeriod: setPeriod,
        addTask: addTask,
        deleteTask: deleteTask,
        reset: reset
    }

}