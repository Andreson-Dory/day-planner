import { Pressable, StyleSheet, TextProps, View } from "react-native";
import { Dispatch, useState } from "react";
import { task } from "@/constant/types/task";
import Button from "../button/Button";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import Row from "../row";
import { SQLiteDatabase } from "expo-sqlite";
import { deleteTaskService, setFinishedTask } from "@/services/task-sevices";
import { getTasksTodayAction, getTasksWeekAction } from "@/redux/actions/taskActions";
import { useDispatch } from "react-redux";

type Props = TextProps & {
    task: task
    view: string
    db: SQLiteDatabase | null;
    startDate: string
    endDate: string
    deleteSetter?: Dispatch<any>
}

const handleFinish = async (
    idTask: number,
    db: SQLiteDatabase | null,
    view: string,
    dispatch: Dispatch<any>, 
    startDate: string,
    endDate: string
) => {
    if(!db) return;
    await setFinishedTask(db, idTask);
    if(view === "today") dispatch(getTasksTodayAction(db));
    else if(view === "week") dispatch(getTasksWeekAction(db, startDate, endDate))
}

const handleDelete = async (
    idTask: number,
    db: SQLiteDatabase | null,
    view: string,
    dispatch: Dispatch<any>,
    startDate: string,
    endDate: string,
) => {
    if(!db) return;
    await deleteTaskService(db, idTask);
    if(view === "today") dispatch(getTasksTodayAction(db));
    else if(view === "week") dispatch(getTasksWeekAction(db, startDate, endDate))
}

export function Task({task, view, db, startDate, endDate, deleteSetter} : Props) {
    const colors = useThemeColors();
    const idTask = task.idTask;
    const date = task.taskDate;
    const startTime = new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false});
    const endTime = new Date(task.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})
    const dispatch = useDispatch();
    const [pressed, setPressed] =  useState(false);
    return (
        <Pressable onPress={() => setPressed(!pressed)}>
            <View style={[styles.container, {backgroundColor: colors.task}]}>
                <ThemedText variant="normal" color="text" style={{fontWeight:700}}>{task.taskTitle}</ThemedText>
                {pressed && <View>
                <View style={styles.timeDetails}>
                    <ThemedText variant="normal" color="text">Start Time : {startTime} </ThemedText>
                    <ThemedText variant="normal" color="text">End Time : {endTime} </ThemedText>
                </View>
                {task.isCompleted === 0 ?  
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
                                }else handleDelete(idTask, db, view, dispatch, startDate, endDate)
                                
                            }}/>
                    </Row> : 
                    null
                }
                </View>}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        paddingTop: 10,
        paddingBottom : 10,
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 5,
        borderRadius: 15,
        gap: 5,
    },
    timeDetails: {
        flexDirection: "column",
        gap: 5
    }
})