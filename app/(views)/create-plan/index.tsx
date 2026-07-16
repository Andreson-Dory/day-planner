import {
  Alert,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import RouterView from "../router-view";
import { Calendar } from "react-native-calendars";
import { useContext, useEffect, useRef, useState } from "react";
import { SubHeader } from "@/components/headers/SubHeader";
import { ThemedText } from "@/components/ThemedText";
import DateTimePicker from "@react-native-community/datetimepicker";
import { usePlanDraft } from "@/hooks/usePlanDraft";
import Row from "@/components/row";
import Col from "@/components/col";
import { DatabaseContext } from "@/context/databaseContext";
import { addArrayOfTaskService } from "@/services/task-sevices";
import { TaskCard } from "@/components/task/Task";
import { CreateTask } from "@/constant/types/task";
import { scheduleTaskNotifications } from "@/services/notification-service";
import { formatLocalDate } from "@/utils/date";
import Toast from "react-native-toast-message";

const getDatesInRange = (
  startDate: string,
  setWeekDays: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  const dates: Record<string, any> = {};
  setWeekDays([]);
  let currentDate = new Date(startDate);

  const dayOfCurrentWeek = currentDate.getDay();
  if (dayOfCurrentWeek === 0) {
    const dateString = formatLocalDate(currentDate);
    setWeekDays((prev) => [...prev, dateString]);
    dates[dateString] = {
      startingDay: true,
      endingDay: true,
      color: "orange",
      textColor: "white",
    };
    return dates;
  }

  const firstWeekDate = new Date(currentDate);
  const lastWeekDate = new Date(currentDate);
  firstWeekDate.setDate(currentDate.getDate() - dayOfCurrentWeek + 1);
  lastWeekDate.setDate(firstWeekDate.getDate() + 6);
  const endDate = formatLocalDate(lastWeekDate);

  while (currentDate <= lastWeekDate) {
    const dateString = formatLocalDate(currentDate);
    setWeekDays((prev) => [...prev, dateString]);
    dates[dateString] = {
      color: "orange",
      textColor: "white",
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  dates[startDate] = {
    startingDay: true,
    color: "orange",
    textColor: "white",
  };

  dates[endDate] = {
    endingDay: true,
    color: "orange",
    textColor: "white",
  };

  return dates;
};

export default function CreatePlan() {
  //plan draft vairables
  const { data, setPeriod, addTask, deleteTask, reset } = usePlanDraft();

  //modal variables & functions
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("None");
  const [endTime, setEndTime] = useState<string>("None");
  const [newTaskDate, setNewTaskDate] = useState<string>();
  const [provisionalId, setProvisionalId] = useState<number>(1);
  const [position, setPosition] = useState<null | { top: number; right: number }>(null);
  const ButtonRef = useRef<View>(null) as React.RefObject<View>;

  const showModal = () => {
    ButtonRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height * 4,
        right: Dimensions.get("window").width - x - width,
      });
      setShowMenuModal(true);
    });
  };

  const onChange = (event: any, selectedTime: any) => {
    const currentTime = selectedTime;
    if (status === "start") {
      setStartTime(currentTime.toISOString());
    } else if (status === "end") {
      setEndTime(currentTime.toISOString());
    }
    setShow(false);
  };

  const resetData = () => {
    reset();
    setSelected([]);
    setWeekDays([]);
    setShowMenuModal(false);
  };

  const save = async (datas: Record<string, CreateTask[]>) => {
    if (!db) {
      Alert.alert("Warning!", "Not connected to the database!");
      return;
    }
    const arrayData = Object.values(datas).flat();

    arrayData.map(async (task) => {
      const notifications = await scheduleTaskNotifications(task);

      return {
        ...task,
        startNotificationId: notifications.startId,
        endNotificationId: notifications.endId,
        startReminderId: notifications.startReminderId,
        endReminderId: notifications.endReminderId,
      };
    });

    await addArrayOfTaskService(db, arrayData)
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Tasks added with success with reminders",
          text1Style: { fontSize: 16, fontWeight: "bold", color: "#059669" },
          text2Style: { fontSize: 14 },
          position: "top",
        });
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Error adding tasks",
          text1Style: { fontSize: 16, fontWeight: "bold", color: "#ef4444" },
          text2Style: { fontSize: 14 },
          position: "top",
        });
      });
    resetData();
  };

  const handleClick = async () => {
    if (title === "") {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "Please enter task title",
        text1Style: { fontSize: 16, fontWeight: "bold", color: "#ef4444" },
        text2Style: { fontSize: 14 },
        position: "top",
      });
      return;
    }
    if (startTime === "None" || endTime === "None" || new Date(startTime) >= new Date(endTime)) {
      Toast.show({
        type: "error",
        text1: "Warning",
        text2: "Please enter valid time",
        text1Style: { fontSize: 16, fontWeight: "bold", color: "#ef4444" },
        text2Style: { fontSize: 14 },
        position: "top",
      });
      return;
    }
    if (!newTaskDate) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Not connected to the database!",
        text1Style: { fontSize: 16, fontWeight: "bold", color: "#ef4444" },
        text2Style: { fontSize: 14 },
        position: "top",
      });
      return;
    }

    const newTask = {
      idTask: provisionalId,
      taskTitle: title,
      isCompleted: 0,
      startTime: startTime,
      endTime: endTime,
      taskDate: newTaskDate,
      startNotificationId: "",
      endNotificationId: "",
      startReminderId: "",
      endReminderId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    addTask(newTaskDate, newTask);
    setShowAddModal(!showAddModal);
    setProvisionalId((prev) => prev + 1);
  };

  //create plan variable & functions
  const [selected, setSelected] = useState<string[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());
  const [markedDate, setMarkedDate] = useState({});
  const [refresh, setRefresh] = useState<number>(0);
  const db = useContext(DatabaseContext);
  const currentDate = new Date();
  const initialDate = formatLocalDate(currentDate);
  const datesPeriod = (day: string) => {
    setSelected((prev) => {
      const newArray = Array.from(prev);
      if (newArray[0] === day) {
        newArray.splice(0, 1);
        setWeekDays([]);
      } else {
        newArray[0] = day;
      }
      return Array.from(newArray);
    });
  };
  const toogleDays = (index: number) => {
    setOpenDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const funcRefresh = () => {
    setRefresh((prev) => prev + 1);
    setShowMenuModal(false);
  };

  useEffect(() => {
    setMarkedDate(selected.length === 1 ? getDatesInRange(selected[0], setWeekDays) : {});
  }, [selected]);

  useEffect(() => {
    setPeriod(weekDays);
  }, [weekDays]);

  return (
    <View className="flex-1">
      <RouterView>
        <SubHeader text="Create Plan" type="create" onPress={showModal} ButtonRef={ButtonRef} />
        {/*             Main view of the component               */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <Calendar
            initialDate={initialDate}
            minDate={initialDate}
            hideExtraDays={false}
            showSixWeeks={false}
            onDayPress={(day) => {
              datesPeriod(day.dateString);
            }}
            markingType="period"
            markedDates={{
              [initialDate]: { today: true, textColor: "blue" },
              ...markedDate,
            }}
            style={{
              width: "95%",
              alignSelf: "center",
              margin: 10,
              borderColor: "#49a6f8b8",
            }}
          />
          <View className="mb-0.5">
            {weekDays.map((day, index) => (
              <View key={index} className="flex-col gap-1 mt-2 mx-2">
                <Pressable onPress={() => toogleDays(index)}>
                  <ThemedText className="text-lg leading-none mt-1.25 w-full text-center py-3.75 rounded-2xl text-slate-50 dark:text-slate-800 bg-sky-400 dark:bg-sky-600">
                    {new Date(day + "T00:00:00").toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </ThemedText>
                </Pressable>
                {openDays.has(index) && (
                  <View>
                    {data[day]?.map((task) => (
                      <TaskCard
                        key={task.idTask}
                        task={task}
                        view="create_plan"
                        date={weekDays[0]}
                        db={db}
                        deleteSetter={deleteTask}
                      />
                    ))}
                    <Pressable
                      onPress={() => {
                        setShowAddModal(true);
                        setNewTaskDate(day);
                      }}
                    >
                      <View className="flex-row justify-center items-center h-12 mx-1 rounded-2xl gap-2 border border-dashed border-blue-500 dark:border-blue-400 bg-slate-300/40 dark:bg-slate-400/20 text-blue-500 dark:text-blue-400">
                        <Image source={require("@/assets/images/add.png")} className="w-6 h-5" />
                        <ThemedText className="text-xl leading-none w-1/4 text-blue-500 dark:text-blue-400">
                          Add New Task
                        </ThemedText>
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
          onRequestClose={() => setShowAddModal(!showAddModal)}
        >
          <View className="flex-1 justify-center items-center">
            <View className="py-5 rounded-4.25 mx-4 bg-cyan-50 dark:bg-cyan-950">
              <ThemedText className="text-xl text-center leading-none mb-6 text-blue-500 dark:text-blue-500">
                Add New Task
              </ThemedText>
              <Col className="px-4 mb-4 gap-4">
                <Row className="w-full gap-0">
                  <ThemedText className="text-lg leading-none text-gray-950 dark:text-slate-50">
                    Task title
                  </ThemedText>
                  <TextInput
                    className="w-2/3 h-9 border rounded-md py-0 text-base text-gray-950 dark:text-slate-50 border-gray-950 dark:border-slate-50 bg-gray-50 dark:bg-neutral-400"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                  />
                </Row>
                <Row className="w-full gap-0">
                  <ThemedText className="text-lg leading-none text-gray-950 dark:text-slate-50">
                    Starting time
                  </ThemedText>
                  <ThemedText className="text-base leading-none text-gray-950 dark:text-slate-50">
                    {startTime === "None"
                      ? "None"
                      : new Date(startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </ThemedText>
                  <Pressable
                    onPress={() => {
                      setShow(true);
                      setStatus("start");
                    }}
                  >
                    <ThemedText className="text-base leading-none text-blue-400 dark:text-blue-500">
                      Pick time
                    </ThemedText>
                  </Pressable>
                </Row>
                <Row className="w-full gap-0">
                  <ThemedText className="text-lg leading-none text-gray-950 dark:text-slate-50">
                    Ending time
                  </ThemedText>
                  <ThemedText className="text-base leading-none text-gray-950 dark:text-slate-50">
                    {" "}
                    {endTime === "None"
                      ? "None"
                      : new Date(endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </ThemedText>
                  <Pressable
                    onPress={() => {
                      setShow(true);
                      setStatus("end");
                    }}
                  >
                    <ThemedText className="text-base leading-none text-blue-400 dark:text-blue-500">
                      Pick time
                    </ThemedText>
                  </Pressable>
                </Row>
              </Col>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  mode="time"
                  value={new Date()}
                  display="default"
                  onChange={onChange}
                />
              )}
              <Row className="px-4">
                <Pressable
                  onPress={() => setShowAddModal(!showAddModal)}
                  className="justify-center items-center w-42 h-8.5 rounded-lg bg-slate-300/40 dark:bg-slate-400/20"
                >
                  <ThemedText className="w-2/5 text-xl text-center leading-none text-blue-500 dark:text-blue-400">
                    Cancel
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={handleClick}
                  className="justify-center items-center w-42 h-8.5 rounded-lg bg-slate-300/40 dark:bg-slate-400/20"
                >
                  <ThemedText className="w-2/5 text-xl text-center leading-none text-blue-500 dark:text-blue-400">
                    Confirm
                  </ThemedText>
                </Pressable>
              </Row>
            </View>
          </View>
        </Modal>

        {/*             Modal for popup options                 */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showMenuModal}
          onRequestClose={() => setShowMenuModal(!showMenuModal)}
        >
          <Pressable
            className="flex-1 bg-black/30"
            onPress={() => setShowMenuModal(!showMenuModal)}
          />
          <View
            className="absolute w-44 p-2 -mr-2 -mt-1 rounded-2xl gap-2 bg-slate-100 dark:bg-slate-800"
            style={position}
          >
            <Pressable
              onPress={() => {
                save(data);
              }}
              className="p-2 rounded-xl border border-slate-500 dark:border-slate-300"
            >
              <ThemedText className="text-lg leading-none text-center text-gray-950 dark:text-slate-50">
                Save
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={funcRefresh}
              className="p-2 rounded-xl border border-slate-500 dark:border-slate-300"
            >
              <ThemedText className="text-lg leading-none text-center text-gray-950 dark:text-slate-50">
                Reload
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={resetData}
              className="p-2 rounded-xl border border-slate-500 dark:border-slate-300"
            >
              <ThemedText className="text-lg leading-none text-center text-gray-950 dark:text-slate-50">
                Reset
              </ThemedText>
            </Pressable>
          </View>
        </Modal>
      </RouterView>
    </View>
  );
}
