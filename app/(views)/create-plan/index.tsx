import { Alert, Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import RouterView from "../router-view";
import { Calendar } from 'react-native-calendars';
import { useContext, useEffect, useRef, useState } from "react";
import { SubHeader } from "@/components/headers/SubHeader";
import { ThemedText } from "@/components/ThemedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useThemeColors } from "@/hooks/useThemeColors";
import { usePlanDraft } from "@/hooks/usePlanDraft";
import Row from "@/components/row";
import Col from "@/components/col";
import { Task } from "@/components/task/Task";
import { DatabaseContext } from "@/context/databaseContext";
import { task } from "@/constant/types/task";
import { addArrayOfTaskService } from "@/services/task-sevices";

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
    //plan draft vairables
     const { data, setPeriod, addTask, deleteTask, reset } = usePlanDraft()

    //modal variables & functions
    const [showAddModal, setShowAddModal] = useState(false)
    const [ showMenuModal, setShowMenuModal ] = useState(false)
    const [ show, setShow ] = useState(false)
    const [ status, setStatus ] = useState("")
    const [ title, setTitle ] = useState<string>("")
    const [ startTime, setStartTime ] = useState<string>("None")
    const [ endTime, setEndTime ] = useState<string>("None")
    const [ newTaskDate, setNewTaskDate ] = useState<string>()
    const [ provisionalId, setProvisionalId ] = useState<number>(1)
    const [ position, setPosition ] = useState<null | { top: number; right: number}>(null)
    const ButtonRef = useRef<View>(null) as React.RefObject<View>

    const showModal = () => {
        ButtonRef.current?.measureInWindow((x, y, width, height) => {
            setPosition({
                top: y + height*4,
                right: Dimensions.get("window").width - x - width
            })
            setShowMenuModal(true)
        })
    }

    const onChange = (event: any , selectedTime: any) => {
      const currentTime = selectedTime
      if(status === 'start'){
        setStartTime(currentTime.toISOString())
      } else if(status === 'end') {
        setEndTime(currentTime.toISOString())
      }  
      setShow(false)
    }

    const resetData = () => {
        reset() 
        setSelected([])
        setWeekDays([])
        setShowMenuModal(false)
    }

    const save = async (datas: Record<string, task[]>) => {
        if(!db) {
            Alert.alert("Warning!", "Not connected to the database!")
            return;
       }
       const arrayData = Object.values(datas).flat()
       
       await addArrayOfTaskService(db, arrayData)
       resetData()
    }

    const handleClick = async () => {
        if(title === ""){
            Alert.alert("Warning!", "Please enter task title");
            return;
        };
        if( startTime === 'None' || endTime === "None" || new Date(startTime) >= new Date(endTime) ) {
            Alert.alert("Warning!", "Please enter valid time");
            return;
        }
        if(!newTaskDate) {
            Alert.alert("Warning!", "Couldn't find the date of task");
            return;
        }

        const newTask = {
            idTask: provisionalId,
            taskTitle: title,
            isCompleted: 0,
            startTime: startTime,
            endTime: endTime,
            taskDate: newTaskDate
        };
        addTask(newTaskDate, newTask)
        setShowAddModal(!showAddModal)
        setProvisionalId( prev => prev + 1 )
    }

    //create plan variable & functions
    const [selected, setSelected] = useState<string[]>([])
    const [weekDays, setWeekDays] = useState<string[]>([])
    const [openDays, setOpenDays] = useState<Set<number>>(new Set())
    const [markedDate, setMarkedDate] = useState({})
    const [refresh, setRefresh] = useState<number>(0)
    const db = useContext(DatabaseContext)
    const colors = useThemeColors()
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const currentDate = new Date();
    const initialDate = currentDate.toISOString().split('T')[0]
    const DayCurrentDate = currentDate.getDay()
    const firstCurrentWeekDate = new Date(currentDate)
    firstCurrentWeekDate.setDate(currentDate.getDate() - DayCurrentDate + 1)
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

    const funcRefresh = () => {
        setRefresh(prev => prev + 1)
        setShowMenuModal(false)
    }

    useEffect(() => {
        setMarkedDate(selected.length === 1 ? getDatesInRange( selected[0], setWeekDays) : {})
    }, [selected])

    useEffect(() => {
        setPeriod(weekDays);
    }, [weekDays])

    return (
        <View style={{ flex: 1, backgroundColor: colors.appBase }}>
            <RouterView>
                <SubHeader text="Create Plan" onPress={showModal} ButtonRef={ButtonRef} />
                {/*             Main view of the component               */}
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Calendar
                        initialDate={initialDate}
                        minDate={firstCurrentWeekDate.toISOString()}
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
                                        {data[day]?.map( task => 
                                            <Task 
                                                key={task.idTask} task={task} 
                                                view="create_plan" 
                                                startDate={weekDays[0]} 
                                                endDate={weekDays[6]} 
                                                db={db} 
                                                deleteSetter={deleteTask}/>
                                        )}
                                        <Pressable onPress={() => {
                                            setShowAddModal(true)
                                            setNewTaskDate(day)
                                        }}>
                                            <View style={[styles.button, {backgroundColor: colors["greyWhite"]}]}>
                                                <Image source={require("@/assets/images/add.png")} style={styles.img} />
                                                <ThemedText variant="subtitle" color="blue" style={{ width: "40%" }} >Add New Task</ThemedText>
                                            </View>
                                        </Pressable>
                                    </View>
                                )}
                            </View> 
                        ))}
                    </View>
                </ScrollView>

                {/*             Modal for adding Task                    */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showAddModal}
                    onRequestClose={() => setShowAddModal(!showAddModal)}>
                    <View style={styles.centeredView}>
                      <View style={styles.addModalView}>
                         <ThemedText variant="subtitle" color="blue" style={{marginBottom: 25}} > Add New Task</ThemedText>
                        <Col style= {styles.col}>
                            <Row style={styles.row}>
                                <ThemedText variant="normal" color="black" > Task title </ThemedText>
                                <TextInput style={styles.input} value={title} onChangeText={(text) => setTitle(text)} />
                            </Row>
                            <Row style={styles.row}>
                                <ThemedText variant="normal" color="black" > Starting time </ThemedText>
                                <ThemedText variant="normal" color="black">{startTime ===  "None" ? "None" : new Date(startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</ThemedText>
                                <Pressable onPress={() => {setShow(true); setStatus("start")}} >
                                    <ThemedText variant="normal" color="blue" >Pick time</ThemedText>
                                </Pressable>
                            </Row>
                            <Row style={styles.row}>
                                <ThemedText variant="normal" color="black" > Ending time </ThemedText>
                                <ThemedText variant="normal" color="black">  {endTime ===  "None" ? "None" : new Date(endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</ThemedText>
                                <Pressable onPress={() => {setShow(true); setStatus("end")}} >
                                    <ThemedText variant="normal" color="blue" >Pick time</ThemedText>
                                </Pressable>
                            </Row>
                        </Col>
                        {show && <DateTimePicker 
                                testID="dateTimePicker"
                                mode="time" 
                                value={new Date()} 
                                display="default"
                                onChange={onChange}
                            />}
                        <Row>
                            <Pressable onPress={() => setShowAddModal(!showAddModal)} style={[styles.addModalButton, {backgroundColor: colors["greyWhite"]}]}>
                                <ThemedText variant="button" color="blue" >Cancel</ThemedText>
                            </Pressable>
                            <Pressable onPress={handleClick} style={[styles.addModalButton, {backgroundColor: colors["greyWhite"]}]}>
                                <ThemedText variant="button" color="blue" >Confirm</ThemedText>
                            </Pressable>
                        </Row>
                      </View>
                    </View>
                </Modal>

                {/*             Modla for popup options                 */}
                <Modal animationType="fade"
                    transparent={true}
                    visible={showMenuModal}
                    onRequestClose={() => setShowMenuModal(!showMenuModal)} 
                    style={styles.menuModal}>
                        <Pressable style={styles.backdrop} onPress={() => setShowMenuModal(!showMenuModal)} />
                        <View style={[styles.popup,{...position, backgroundColor: colors.light}]} >
                            <Pressable onPress={() => {save(data)}} style={styles.menuButton}>
                                <ThemedText variant="normal" color="black" style={{textAlign: "center"}} >Save</ThemedText>
                            </Pressable>
                            <Pressable onPress={funcRefresh} style={styles.menuButton} >
                                <ThemedText variant="normal" color="black" style={{textAlign: "center"}} >Reload</ThemedText>
                            </Pressable>
                            <Pressable onPress={resetData} style={styles.menuButton} >
                                <ThemedText variant="normal" color="black" style={{textAlign: "center"}} >Reset</ThemedText>
                            </Pressable>
                        </View>
                </Modal>
            </RouterView>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flexDirection: "column",
        gap: 5,
        marginTop: 10,
        marginHorizontal: 10,
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
    },
    img: {
        width: 26,
        height: 21
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 42,
        marginTop: 5,
        marginHorizontal: 5,
        borderRadius: 15,
        gap: 10,
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#005EC9",
    }, 
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addModalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 15,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    input: {
      width: '65%',
      height: 37,
      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: "white",
      paddingVertical: 0
    },
    addModalButton: {
      marginVertical: 20,
      fontSize: 17,
      alignItems: "center",
      paddingVertical: 8,
      marginRight: 15,
      width: 150,
      height: 35,
      borderRadius: 10,
      padding: 10,
    },
    row: {
        width: "100%",
        gap: 0
    },
    col: {
        paddingHorizontal: 20
    },
    menuModal: {
        borderColor: "#A5CAD2"
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)"
    },
    popup: {
        position: "absolute",
        width: 100,
        padding: 10,
        marginRight: -10,
        marginTop: -5,
        borderRadius: 15,
        gap: 2
    },
    menuButton: {
        padding: 5,
        borderBottomWidth: 2,
        borderBottomColor: "#A5CAD2"
    }
});