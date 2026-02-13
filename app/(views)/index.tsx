import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import RouterView from "./router-view";
import { useThemeColors } from "@/hooks/useThemeColors";
import OptionCard from "@/components/optionCard";
import { useContext, useEffect, useState } from "react";
import { user } from "@/constant/types/user";
import { useAppSelector } from "@/hooks/useAppSelector";
import { ThemedText } from "@/components/ThemedText";
import Col from "@/components/col";
import Row from "@/components/row";
import ConfirmButton from "@/components/actionButton/ConfirmButton";
import { useDispatch } from "react-redux";
import { DatabaseContext } from "@/context/databaseContext";
import { addUserService } from "@/services/user-service";
import { getUserAction } from "@/redux/actions/userActions";

export default function Index () {
    const colors = useThemeColors();
    const user: user = useAppSelector(state => state.user.user);
    const disptach = useDispatch();
    const db = useContext(DatabaseContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");

    useEffect(() => {      
        if(!user.firstName) setModalVisible(true);
    }, [])

    const HideModal = () => {
      Alert.alert("Warnig", 'Are you sure to cancel your user configuration?', [
        {
          text: "Cancel",
          style: "cancel"
        }, 
        {
          text: "Confirm",
          style: "destructive",
          onPress: () => {
            setModalVisible(!modalVisible);
          }
        }
      ]);
    }

    const handleClick = async () => {
            if(firstName === "" || lastName === "" ){
                Alert.alert("Warning!", "Please fill all the blank field(s)");
                return;
            };

            if(!db) return null;
    
            const newUser = {
                id: 0,
                firstName: firstName,
                lastName: lastName
            }
    
            disptach<any>( await addUserService(db, newUser));
            disptach<any>( await getUserAction(db));
        }

    return (
        <>
            <RouterView style={[styles.appContent, { flex: 1 }]}>
              <Link href="/(views)/today-task" asChild>
                <Pressable android_ripple={{ color: colors.greenGradientStart, foreground: true }} style={{borderRadius: 19}} >
                    <LinearGradient colors={[colors.greenGradientStart, colors.greenGradientEnd]} start={{x: 0, y: 0}} end={{x: 0, y: 1}} 
                      style={styles.gradient}>
                        <OptionCard subtitle="TODAY'S TASK LIST" image={require("@/assets/images/today-tasks.png")} />
                    </LinearGradient>
                </Pressable>
              </Link>
              <Link href="/(views)/week-task" asChild>
                  <Pressable android_ripple={{ color: colors.blueGradientStart, foreground: true }} style={{borderRadius: 19}} >
                    <LinearGradient colors={[colors.blueGradientStart, colors.blueGradientEnd]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
                      style={styles.gradient}>
                        <OptionCard subtitle="WEEK'S TASK LIST" image={require("@/assets/images/week-tasks.png")} />
                    </LinearGradient>
                  </Pressable>
              </Link>
              <Link href="/(views)/create-plan" asChild>
                  <Pressable android_ripple={{ color: colors.orangeGradientStart, foreground: true }} style={{borderRadius: 19}} >
                    <LinearGradient colors={[colors.orangeGradientStart, colors.orangeGradientEnd]} start={{x: 0, y: 0}} end={{x: 0, y: 1}} 
                      style={styles.gradient}>
                        <OptionCard subtitle="CREATE PLAN" image={require("@/assets/images/create.png")} />
                    </LinearGradient>
                  </Pressable>
              </Link>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}>
                <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                     <ThemedText variant="subtitle" color="blue" style={{marginBottom: 25}} >User Settings</ThemedText>
                    <Col style= {styles.col}>
                        <Row style={styles.row}>
                            <ThemedText variant="normal" color="black" > First name </ThemedText>
                            <TextInput style={styles.input} value={firstName} onChangeText={(text) => setFirstName(text)} />
                        </Row>
                        <Row style={styles.row}>
                            <ThemedText variant="normal" color="black" > Last name </ThemedText>
                            <TextInput style={styles.input} value={lastName} onChangeText={(text) => setLastName(text)} />
                        </Row>
                    </Col>
                    <Row>
                        <Pressable
                          onPress={HideModal} 
                          style={[styles.button, {backgroundColor: colors["greyWhite"]}]}
                        >
                            <ThemedText variant="button" color="blue" >Cancel</ThemedText>
                        </Pressable>
                        <ConfirmButton onPress={handleClick} />
                    </Row>
                  </View>
                </View>
              </Modal>
            </RouterView>
        </>
    )
}

const styles = StyleSheet.create({
  appContent : {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 60,
    gap: 30,
    alignItems: "center"
  },
  gradient: {
    borderRadius: 19,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
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
  button: {
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
  }
})