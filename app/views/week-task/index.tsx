import { Pressable, ScrollView, StyleSheet, TextProps, View } from "react-native";
import RouterView from "../router-view";
import { useEffect, useState } from "react";
import { Task } from "@/components/task/Task";
import { task } from "@/constant/types/task";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ThemedText } from "@/components/ThemedText";
import { AddButton } from "@/components/actionButton/AddButton";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";

type Props = TextProps & {
    weekTasks: task[];
    weekDays: string[];
}

const getDatesInRange = ( setWeekDays: React.Dispatch<React.SetStateAction<string[]>> ) => {
    setWeekDays([]);
    let currentDate = new Date();  

    const dayOfCurrentWeek = currentDate.getDay();
    const firstWeekDate = new Date(currentDate);
    const lastWeekDate = new Date(currentDate);
    firstWeekDate.setDate(currentDate.getDate() - dayOfCurrentWeek + 1);
    lastWeekDate.setDate(firstWeekDate.getDate() + 6);
    while (firstWeekDate <= lastWeekDate) {
        const dateString = firstWeekDate.toISOString().split('T')[0];
        setWeekDays((prev) => [...prev, dateString]);
        firstWeekDate.setDate(firstWeekDate.getDate() + 1);
    };  
}

function Contents ({ weekTasks, weekDays } : Props) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [openDays, setOpenDays] = useState<Set<number>>(new Set());


    const toogleDays = (index : number ) => {
        setOpenDays((prev) => {
            const newSet = new Set(prev);
            if(newSet.has(index)){
                newSet.delete(index);
            }else{
                newSet.add(index);
            }
            return newSet;
        })
    }

    return (
            <ScrollView style={styles.main} showsVerticalScrollIndicator={false}>
                {weekDays.map((day, index) => (
                    <View key={index} style={styles.content}>
                        <Pressable onPress={() =>toogleDays(index)}>
                            <ThemedText variant="normal" color="light" style={styles.dayText} >
                                {days[new Date(day).getDay()]}, {day}
                            </ThemedText>
                        </Pressable>
                        {openDays.has(index) && (
                            <View>
                                {weekTasks.filter(task => (new Date(task.date).getDay() === index)).map((taskItem) => (
                                    <Task key={taskItem.id} task={taskItem} />
                                ))}
                                <AddButton stl={styles.AddButton} date={new Date(day).toISOString()} />
                            </View>
                        )}
                    </View> 
                   ))}
            </ScrollView>
    )
};

export default function WeekTask () {
    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [tasks, setTasks] = useState<task[]>(useAppSelector(state => state.tasks.weekTasks) || []);
    const [filteredTasks, setFilteredTasks] = useState<task[]>(tasks.filter(task => task.isCompleted === false));

    useEffect(() => {
        getDatesInRange(setWeekDays);
    }, [])

    return (
        <RouterView>
            <SubHeader text="Week Task" />
            <StatusHeader setter={setFilteredTasks} tasks={tasks} />
            <Contents weekTasks={filteredTasks} weekDays={weekDays} />
        </RouterView>
    )
}

const styles = StyleSheet.create({
    main: {
        marginBottom: 10,
    },
    content: {
        flexDirection: "column",
        gap: 5,
        marginTop: 10,
        marginHorizontal: 10,
    },
    AddButton: {
        marginTop: 5,
        height: 42,
    },
    dayText: {
        fontSize: 18,
        marginTop: 5,
        backgroundColor: "#49a6f8b8",
        width: "100%",
        textAlign: "center",
        paddingVertical: 12,
        borderRadius: 8,
    }
});