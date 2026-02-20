import { ScrollView, StyleSheet, TextProps, View } from "react-native";
import RouterView from "../router-view";
import { Task } from "@/components/task/Task";
import { useContext, useEffect, useState } from "react";
import { task } from "@/constant/types/task";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppSelector } from "@/hooks/useAppSelector";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";
import { AddButton } from "@/components/actionButton/AddButton";
import { useDispatch } from "react-redux";
import { getTasksTodayAction } from "@/redux/actions/taskActions";
import { DatabaseContext } from "@/context/databaseContext";
import { SQLiteDatabase } from "expo-sqlite";
import { router } from "expo-router";
import { useStatusHeader } from "@/hooks/useStatusHeader";


type Props = TextProps & {
    tasks: task[];
    db: SQLiteDatabase | null;
}

function Contents ({ tasks, db } : Props) {
    return (
        <View>
            {tasks.map(task => <Task key={task.idTask} task={task} view="today" startDate="" endDate="" db={db} /> )} 
        </View>
    )
}

export default function TodayTask () {
    const colors = useThemeColors()
    const dispatch = useDispatch()
    const db = useContext(DatabaseContext)
    const { setTasks, filteredTasks, toggleCompleted } = useStatusHeader()
    const tasks : task[] = useAppSelector(state => state.tasks.todaysTasks)
    const [ refresh, setRefresh ] = useState<number>(0)

    useEffect(() => {
        if(!db) return;
        dispatch<any>(getTasksTodayAction(db));
    }, [])

    useEffect(() => {
        setTasks(tasks)
    }, [tasks])

    return (
        <View style={{ flex: 1, backgroundColor: colors.appBase }}>
            <RouterView>
                <SubHeader text="Today Task" onPress={() => setRefresh(prev => prev + 1 )} />
                <StatusHeader toggle={toggleCompleted} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Contents tasks={filteredTasks} db={db} />
                </ScrollView>
                <AddButton stl={styles.AddButton} date={new Date().toISOString().split('T')[0]} view="today" />
            </RouterView>
        </View>
    )
}

const styles = StyleSheet.create({
    AddButton: {
        bottom: 10,
        left: 0,
        right: 0,
        position: "absolute",
    }
});