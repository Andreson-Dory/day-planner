import { Alert, Modal, Pressable, Switch, TextInput, View, ViewProps } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import Col from "@/components/col";
import Row from "@/components/row";
import { useDispatch } from "react-redux";
import { addTaskService } from "@/services/task-sevices";
import { DatabaseContext } from "@/context/databaseContext";
import { getRepetitiveTasksAction, getTasksDailyAction } from "@/redux/actions/taskActions";
import { scheduleTaskNotifications } from "@/services/notification-service";
import Toast from "react-native-toast-message";
import { alarmNotificationService } from "@/lib/notifications";

type Props = ViewProps & {
  showAddModal: boolean;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  date: string;
  view: string;
};
export default function AddTaskModal({ showAddModal, setShowAddModal, date, view }: Props) {
  const db = useContext(DatabaseContext);
  const disptach = useDispatch();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [title, setTitle] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("None");
  const [endTime, setEndTime] = useState<string>("None");
  const [isRepetitive, setIsRepetitive] = useState(false);
  const [repeatType, setRepeatType] = useState<"daily" | "weekly" | "monthly" | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const onChange = (event: any, selectedTime: any) => {
    if (status === "start") {
      setStartTime(selectedTime.toISOString());
    } else if (status === "end") {
      setEndTime(selectedTime.toISOString());
    }
    setShow(false);
  };

  const resetValue = () => {
    setTitle("");
    setStartTime("None");
    setEndTime("None");
    setIsRepetitive(false);
    setRepeatType(null);
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
      setIsSaving(false);
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
      setIsSaving(false);
      return;
    }
    if (!db) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Not connected to the database!",
        text1Style: { fontSize: 16, fontWeight: "bold", color: "#ef4444" },
        text2Style: { fontSize: 14 },
        position: "top",
      });
      setIsSaving(false);
      return;
    }

    let newTask = {
      idTask: 0,
      taskTitle: title,
      startTime: startTime,
      endTime: endTime,
      taskDate: date,
      isRepetitive: isRepetitive ? 1 : 0,
      repeatType: isRepetitive ? repeatType : null,
      startNotificationId: "",
      endNotificationId: "",
      startReminderId: "",
      endReminderId: "",
    };
    const notifications = await scheduleTaskNotifications(newTask);
    newTask = {
      ...newTask,
      startNotificationId: notifications.startId,
      endNotificationId: notifications.endId,
      startReminderId: notifications.startReminderId,
      endReminderId: notifications.endReminderId,
    };
    try {
      await addTaskService(db, newTask);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: notifications.hasScheduledNotifications
          ? "Task added with reminders"
          : notifications.notificationsGranted
            ? "Task added"
            : "Task added. Reminders are disabled in system settings.",
        text1Style: { fontSize: 16, fontWeight: "bold", color: "#059669" },
        text2Style: { fontSize: 14 },
        position: "top",
      });
      if (notifications.notificationsGranted && !notifications.exactAlarmsGranted) {
        Alert.alert(
          "Precise reminders unavailable",
          "Allow Alarms & reminders in Android settings to deliver task reminders at their scheduled time.",
          [
            { text: "Not now", style: "cancel" },
            {
              text: "Open settings",
              onPress: () => void alarmNotificationService.openExactAlarmSettings(),
            },
          ],
        );
      }
    } catch (error) {
      await alarmNotificationService.cancel([
        notifications.startId,
        notifications.startReminderId,
        notifications.endId,
        notifications.endReminderId,
      ]);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Error adding task",
        text1Style: { fontSize: 16, fontWeight: "bold", color: "#ef4444" },
        text2Style: { fontSize: 14 },
        position: "top",
      });
      console.error(error);
    }

    resetValue();
    setShowAddModal(false);
    setIsSaving(false);
    if (view === "today" || view === "week") disptach<any>(getTasksDailyAction(db, date));
    else if (view === "repetitive") disptach<any>(getRepetitiveTasksAction(db));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddModal}
      onRequestClose={() => {
        setShowAddModal(!showAddModal);
        resetValue();
      }}
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
            <Row className="w-full gap-0 items-center">
              <ThemedText className="text-lg leading-none text-gray-950 dark:text-slate-50">
                Repeat
              </ThemedText>
              <Switch
                value={isRepetitive}
                onValueChange={() => {
                  if (!isRepetitive) {
                    setRepeatType(null);
                  }
                  setIsRepetitive(!isRepetitive);
                }}
              />
            </Row>

            {isRepetitive && (
              <Row className="w-full gap-2">
                {(["daily", "weekly", "monthly"] as const).map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setRepeatType(type)}
                    className={`px-3 py-1.5 rounded-lg ${
                      repeatType === type ? "bg-blue-500" : "bg-slate-300/40 dark:bg-slate-400/20"
                    }`}
                  >
                    <ThemedText
                      className={
                        repeatType === type ? "text-white" : "text-blue-500 dark:text-blue-400"
                      }
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </ThemedText>
                  </Pressable>
                ))}
              </Row>
            )}
          </Col>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              mode="time"
              onDismiss={() => setShow(false)}
              value={new Date(date)}
              display="default"
              onValueChange={onChange}
            />
          )}
          <Row className="px-4">
            <Pressable
              onPress={() => {
                setShowAddModal(false);
                resetValue();
              }}
              className="justify-center items-center w-42 h-8.5 rounded-lg bg-slate-300/40 dark:bg-slate-400/20"
            >
              <ThemedText className="w-2/5 text-xl text-center leading-none text-blue-500 dark:text-blue-400">
                Cancel
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsSaving(true);
                handleClick();
              }}
              disabled={isSaving}
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
  );
}
