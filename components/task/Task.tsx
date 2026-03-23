import { Pressable, StyleSheet, TextProps, View } from "react-native";
import { Dispatch } from "react";
import Button from "../button/Button";
import { ThemedText } from "../ThemedText";
import Row from "../row";
import { SQLiteDatabase } from "expo-sqlite";
import { Task } from "@/constant/types/task";
import { useTaskData } from "@/hooks/useTaskData";
import { StatusBadge } from "./StatusBadge";

type Props = TextProps & {
    task: Task
    view: string
    db: SQLiteDatabase | null;
    startDate: string
    endDate: string
    deleteSetter?: Dispatch<any>
}

export function TaskCard({task, view, db, startDate, endDate, deleteSetter} : Props) {
    const {
        idTask,
        taskStatus,
        taskColor,
        borderColor,
        durationStr,
        startTimeStr,
        endTimeStr,
        pressed,
        setPressed,
        dispatch,
        handleFinish,
        handleDelete
    } = useTaskData(task)
    return (
        <Pressable onPress={() => setPressed(!pressed)}>
            <View style={[styles.container, {backgroundColor: taskColor, borderLeftColor: borderColor}]}>
                <ThemedText variant="taskTitle" color="text" style={{fontWeight:700}}>{task.taskTitle}</ThemedText>
                {pressed && <View >
                    <View style={{ alignItems: 'flex-start' }}>
                        <StatusBadge status={taskStatus} />
                    </View>
                    <View style={styles.timeDetails}>
                        <ThemedText variant="smallText" color="text">{startTimeStr} - {endTimeStr} </ThemedText>
                        <ThemedText variant="normal" color="duration">({(durationStr)})</ThemedText>
                    </View>
                    {taskStatus !== 'completed' && 
                        <Row >
                            {view === "create_plan" ? null : 
                                <Button type="Finish" onPress={() => handleFinish(idTask, db, view, dispatch, startDate, endDate)}/>
                            }
                            <Button 
                                type="Delete" 
                                onPress={() => {
                                    if(view==='create_plan') {
                                        if(!deleteSetter) return  
                                        deleteSetter(task)
                                    }else handleDelete(task, db, view, dispatch, startDate, endDate)
                                    
                                }}/>
                        </Row>
                    }
                </View>}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 5,
        borderLeftWidth: 5,
        borderRadius: 15,
        gap: 5,
    },
    timeDetails: {
        display: "flex",
        flexDirection: 'row',
        gap: 1,
        marginVertical: 5,
        marginHorizontal: 10
    }
})