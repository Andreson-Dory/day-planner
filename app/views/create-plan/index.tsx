import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import RouterView from "../router-view";
import { Calendar } from 'react-native-calendars';
import { useState } from "react";
import { SubHeader } from "@/components/headers/SubHeader";
import { ThemedText } from "@/components/ThemedText";
import { AddButton } from "@/components/actionButton/AddButton";

const getDatesInRange = (startDate: string, setWeekDays: React.Dispatch<React.SetStateAction<string[]>>) => {
    const dates: Record<string, any> = {};
    setWeekDays([]);
    let currentDate = new Date(startDate);

    const dayOfCurrentWeek = currentDate.getDay();
    const firstWeekDate = new Date(currentDate);
    const lastWeekDate = new Date(currentDate);
    firstWeekDate.setDate(currentDate.getDate() - dayOfCurrentWeek);
    lastWeekDate.setDate(firstWeekDate.getDate() + 6);
    const endDate = lastWeekDate.toISOString().split('T')[0];
    
    while (currentDate <= lastWeekDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        setWeekDays((prev) => [...prev, dateString]);
        dates[dateString] = { 
            color: 'orange',
            textColor: 'white'
        };
        currentDate.setDate(currentDate.getDate() + 1);
    };

    dates[startDate] = {
        startingDay: true,
        color: 'orange',
        textColor: 'white'
    }

    dates[endDate] = {
        endingDay: true,
        color: 'orange',
        textColor: 'white'
    }

    return dates;

}

export default function CreatePlan () {
    const [selected, setSelected] = useState<string[]>([]);
    const [weekDays, setWeekDays] = useState<string[]>([]);
    const [openDays, setOpenDays] = useState<Set<number>>(new Set());
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const currentDate = new Date();
    const initialDate = currentDate.toISOString().split('T')[0];   
    const markedDate = selected.length === 1 ? getDatesInRange( selected[0], setWeekDays) : {};
    const datesPeriod = ( day : string) => {
        setSelected((prev) => {
            const newArray = Array.from(prev); 
            if(newArray[0] === day){
                newArray.splice(0, 1);
                setWeekDays([]);
            }else {
                newArray[0] = day;
            };   
            return Array.from(newArray);
        })
    }
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
        <RouterView>
            <SubHeader text="Create Plan" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Calendar
                    initialDate={initialDate}
                    hideExtraDays={false}
                    showSixWeeks={false}
                    onDayPress={day => {
                        datesPeriod(day.dateString);               
                    }}
                    markingType="period"
                    markedDates={{
                        [initialDate] : {today: true, textColor: 'blue'},
                        ...markedDate
                    }}
                     style={styles.calendar}
                />
                <View style={styles.subContent}>
                    {weekDays.map((day, index) => (
                        <View key={index} style={styles.content}>
                            <Pressable onPress={() => toogleDays(index)}>
                                <ThemedText variant="normal" color="light" style={styles.dayText} >
                                    {days[new Date(day).getDay()]}, {day}
                                </ThemedText>
                            </Pressable>
                            {openDays.has(index) && (
                                <View>
                                    <AddButton stl={styles.AddButton} date={new Date(day).toISOString()} />
                                </View>
                            )}
                        </View> 
                    ))}
                </View>
            </ScrollView>
        </RouterView>
    )
}

const styles = StyleSheet.create({
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
    },
    calendar: {
        width: '95%',
        alignSelf: 'center',
        margin: 10,
        borderRadius: 12,
        borderColor: '#49a6f8b8',
        elevation: 4,        
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    subContent: {
        marginBottom: 10
    }
});