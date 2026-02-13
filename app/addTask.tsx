import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useState } from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/components/ThemedText";
import Col from "@/components/col";
import Row from "@/components/row";
import ConfirmButton from "@/components/actionButton/ConfirmButton";
import RouterView from "./(views)/router-view";
import { useDispatch } from "react-redux";
import { addTaskService } from "@/services/task-sevices";
import { DatabaseContext } from "@/context/databaseContext";
import { getTasksCurrentCreatedPlanAction, getTasksTodayAction, getTasksWeekAction } from "@/redux/actions/taskActions";

export default function AddTask() {
    const { date, view, startDate, endDate } = useLocalSearchParams<{ date: string, view: string, startDate: string, endDate: string }>();
    const colors = useThemeColors();
    const db = useContext(DatabaseContext);
    const disptach = useDispatch();
    const [ show, setShow ] = useState(false);
    const [ status, setStatus ] = useState("");
    const [ title, setTitle ] = useState<string>("");
    const [ startTime, setStartTime ] = useState<string>("None");
    const [ endTime, setEndTime ] = useState<string>("None");

    const onChange = (event: any , selectedTime: any) => {
      const currentTime = selectedTime;
      if(status === 'start'){
        setStartTime(currentTime.toISOString());
      } else if(status === 'end') {
        setEndTime(currentTime.toISOString());
      }  
      setShow(false);
    };

    const handleClick = async () => {
        if(title === ""){
            Alert.alert("Warning!", "Please enter task title");
            return;
        };
        if( startTime === 'None' || endTime === "None" || new Date(startTime) >= new Date(endTime) ) {
            Alert.alert("Warning!", "Please enter valid time");
            return;
        }
        if(!db) return null;

        const newTask = {
            id: 0,
            title: title,
            startTime: startTime,
            endTime: endTime,
            date: date
        }

        disptach<any>( await addTaskService(db, newTask));
        if( view === 'today' ) disptach<any>( await getTasksTodayAction(db));
        else if( view === 'week' ) disptach<any>( await getTasksWeekAction(db, startDate, endDate));
        else if( view === 'createPlan') disptach<any>( await getTasksCurrentCreatedPlanAction(db, startDate));
    }

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <RouterView style={styles.container} >
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
                    <Pressable onPress={router.back} style={[styles.button, {backgroundColor: colors["greyWhite"]}]}>
                        <ThemedText variant="button" color="blue" >Cancel</ThemedText>
                    </Pressable>
                    <ConfirmButton onPress={handleClick} />
                </Row>
            </RouterView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 15,
    borderRadius: 17,
    marginHorizontal: 15,
    backgroundColor: 'rgb(255, 255, 255)',
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
  button: {
    marginVertical: 20,
    fontSize: 17,
    alignItems: "center",
    paddingVertical: 8,
    marginRight: 15,
    width: 150,
    height: 35,
    borderRadius: 10,
  },
  row: {
    width: "100%",
    gap: 0
  },
  col: {
    paddingHorizontal: 20
  }
});