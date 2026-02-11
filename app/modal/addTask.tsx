import { Link, router, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/components/ThemedText";
import Col from "@/components/col";
import Row from "@/components/row";
import ConfirmButton from "@/components/actionButton/ConfirmButton";

export default function AddTask() {
    const { date } = useLocalSearchParams<{ date?: string }>();
    const colors = useThemeColors();
    const isPresented = router.canGoBack();
    const [ show, setShow ] = useState(false);
    const [ status, setStatus ] = useState("");
    const [ title, setTitle ] = useState<string>("");
    const [ startTime, setStartTime ] = useState<string>("None");
    const [ endTime, setEndTime ] = useState<string>("None");

    const onChange = (event: any , selectedTime: any) => {
      const currentTime = selectedTime;
      if(status === 'start'){
        setStartTime(currentTime.toISOString());
        console.log("startTime", currentTime.toISOString());
      } else if(status === 'end') {
        setEndTime(currentTime.toISOString());
        console.log("endTime", currentTime.toISOString());
      }  
      setShow(false);
    };

    const handleClick = () => {
        if(title === ""){
            alert("Please enter task title");
            return;
        };
        if( startTime === 'None' || endTime === "None" || new Date(startTime) >= new Date(endTime) ) {
            alert("Please enter valid time");
            return;
        }

        const newTask = {
            id: 0,
            title: title,
            startTime: startTime,
            endTime: endTime
        }
    }

    return (
        <View style={styles.container}>
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
                {isPresented && <Link href="../" style={[styles.link, {backgroundColor: colors["greyWhite"]}]} >
                    Cancel
                </Link>}
                <ConfirmButton onPress={handleClick} />
            </Row>
            
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 15,
    borderRadius: 17,
    marginHorizontal: 5,
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
  link: {
    marginVertical: 20,
    fontSize: 17,
    textAlign: "center",
    paddingVertical: 5,
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