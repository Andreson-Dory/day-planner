import { ScrollView, StyleSheet, TextProps, View } from "react-native";
import RouterView from "../router-view";
import { useContext, useEffect, useState } from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppSelector } from "@/hooks/useAppSelector";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";
import { AddButton } from "@/components/actionButton/AddButton";
import { useDispatch } from "react-redux";
import { getTasksTodayAction } from "@/redux/actions/taskActions";
import { DatabaseContext } from "@/context/databaseContext";
import { SQLiteDatabase } from "expo-sqlite";
import { useStatusHeader } from "@/hooks/useStatusHeader";
import { Task } from "@/constant/types/task";
import { TaskCard } from "@/components/task/Task";
import { formatLocalDate } from "@/utils/date";



type Props = TextProps & {
    tasks: Task[];
    db: SQLiteDatabase | null;
}

function Contents ({ tasks, db } : Props) {
    return (
        <View>
            {tasks.map(task => <TaskCard key={task.idTask} task={task} view="today" startDate="" endDate="" db={db} /> )} 
        </View>
    )
}

export default function TodayTask () {
    const colors = useThemeColors()
    const dispatch = useDispatch()
    const db = useContext(DatabaseContext)
    const { setTasks, filteredTasks, toggleCompleted } = useStatusHeader()
    const tasks : Task[] = useAppSelector(state => state.tasks.todaysTasks)
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
                <ScrollView showsVerticalScrollIndicator={false} style={styles.Content}>
                    <Contents tasks={filteredTasks} db={db} />
                </ScrollView>
                <AddButton stl={styles.AddButton} date={formatLocalDate(new Date())} view="today" />
            </RouterView>
        </View>
    )
}

const styles = StyleSheet.create({
    Content: {
        flex: 1,
        marginBottom: 20
    },
    AddButton: {
        bottom: 15,
        left: 0,
        right: 0,
        zIndex: 10,
    }
});