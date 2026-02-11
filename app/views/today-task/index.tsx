import { ScrollView, StyleSheet, Text, TextProps, View } from "react-native";
import RouterView from "../router-view";
import { Task } from "@/components/task/Task";
import { useState } from "react";
import { task } from "@/constant/types/task";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useAppSelector } from "@/hooks/useAppSelector";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";
import { AddButton } from "@/components/actionButton/AddButton";


type Props = TextProps & {
    tasks: task[];
}

function Contents ({ tasks } : Props) {
    return (
        <View>
            {tasks.map(task => <Task key={task.id} task={task} /> )} 
        </View>
    )
}

export default function TodayTask () {
    const colors = useThemeColors();
    const tasks : task[] = useAppSelector(state => state.tasks.todaysTasks);
    const [filteredTasks, setFilteredTasks] = useState<task[]>(tasks.filter(task => task.isCompleted === false));
        
    return (
        <RouterView>
            <SubHeader text="Today Task" />
            <StatusHeader setter={setFilteredTasks} tasks={tasks}/>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Contents tasks={filteredTasks} />
            </ScrollView>
            <AddButton stl={styles.AddButton} date={new Date().toISOString()} />
        </RouterView>
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