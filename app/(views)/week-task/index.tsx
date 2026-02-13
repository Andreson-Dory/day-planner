import { Pressable, ScrollView, StyleSheet, TextProps, View } from "react-native";
import RouterView from "../router-view";
import { useContext, useEffect, useState } from "react";
import { Task } from "@/components/task/Task";
import { task } from "@/constant/types/task";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ThemedText } from "@/components/ThemedText";
import { AddButton } from "@/components/actionButton/AddButton";
import { SubHeader } from "@/components/headers/SubHeader";
import StatusHeader from "@/components/headers/StatusHeader";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useDispatch } from "react-redux";
import { getTasksWeekAction } from "@/redux/actions/taskActions";
import { DatabaseContext } from "@/context/databaseContext";

type Props = TextProps & {
    weekTasks: task[];
    weekDays: string[];
}

type getDateProps = {
    setWeekDays: React.Dispatch<React.SetStateAction<string[]>>;
    setWeekDaysCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const getDatesInRange = ( { setWeekDays, setWeekDaysCompleted }: getDateProps ) => {
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
    setWeekDaysCompleted(true);
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
                                    <Task key={taskItem.id} task={taskItem} create_plan={false} />
                                ))}
                                <AddButton stl={styles.AddButton} date={new Date(day).toISOString()} view="week" startDate={weekDays[0]} endDate={weekDays[6]} />
                            </View>
                        )}
                    </View> 
                   ))}
            </ScrollView>
    )
};

export default function WeekTask () {
    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [weekDaysCompleted, setWeekDaysCompleted] = useState<boolean>(false);
    const db = useContext(DatabaseContext);
    const colors = useThemeColors();
    const dispatch = useDispatch();
    const tasks = useAppSelector<task[]>(state => state.tasks.weekTasks);
    const [filteredTasks, setFilteredTasks] = useState<task[]>([]);

    useEffect(() => {
        getDatesInRange({setWeekDays, setWeekDaysCompleted});
    }, [])

    useEffect(() => {
        if(!db) return;
        if(!weekDaysCompleted) return;

        dispatch<any>(getTasksWeekAction(db, weekDays[0], weekDays[6]));
        setFilteredTasks(tasks.filter(task => task.isCompleted === false));
        
    }, [db, weekDaysCompleted, weekDays])

    return (
        <View style={{ flex: 1, backgroundColor: colors.appBase }}>
            <RouterView>
                <SubHeader text="Week Task" />
                <StatusHeader setter={setFilteredTasks} tasks={tasks} />
                <Contents weekTasks={filteredTasks} weekDays={weekDays} />
            </RouterView>
        </View>
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