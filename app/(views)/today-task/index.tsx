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


type Props = TextProps & {
    tasks: task[];
}

function Contents ({ tasks } : Props) {
    return (
        <View>
            {tasks.map(task => <Task key={task.id} task={task} create_plan={false} /> )} 
        </View>
    )
}

export default function TodayTask () {
    const colors = useThemeColors();
    const dispatch = useDispatch();
    const db = useContext(DatabaseContext);
    const tasks : task[] = useAppSelector(state => state.tasks.todaysTasks);
    const [filteredTasks, setFilteredTasks] = useState<task[]>([]);

    useEffect(() => {
        if(!db) return;
        dispatch<any>(getTasksTodayAction(db));
        setFilteredTasks(tasks.filter(task => task.isCompleted === false));
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: colors.appBase }}>
            <RouterView>
                <SubHeader text="Today Task" />
                <StatusHeader setter={setFilteredTasks} tasks={tasks}/>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Contents tasks={filteredTasks} />
                </ScrollView>
                <AddButton stl={styles.AddButton} date={new Date().toISOString()} view="today" />
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