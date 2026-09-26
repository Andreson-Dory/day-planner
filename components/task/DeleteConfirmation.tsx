import { Modal, Pressable, View, ViewProps } from "react-native";
import { ThemedText } from "../ThemedText";
import { SQLiteDatabase } from "expo-sqlite";
import { Dispatch } from "react";
import { Task } from "@/constant/types/task";
import Row from "../row";

type Props = ViewProps & {
  showDeleteConfirmationModal: boolean;
  setShowDeleteConfirmationModal: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task;
  db: SQLiteDatabase | null;
  view: string;
  dispatch: Dispatch<any>;
  date: string;
  handleDelete: (
    task: Task,
    db: SQLiteDatabase | null,
    view: string,
    dispatch: Dispatch<any>,
    date: string,
  ) => Promise<void>;
};
export default function DeleteTaskModal({
  showDeleteConfirmationModal,
  setShowDeleteConfirmationModal,
  task,
  db,
  view,
  dispatch,
  date,
  handleDelete,
}: Props) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showDeleteConfirmationModal}
      onRequestClose={() => {
        setShowDeleteConfirmationModal(!showDeleteConfirmationModal);
      }}
    >
      <View className="flex-1 justify-center items-center">
        <View className="py-5 rounded-4.25 mx-4 bg-cyan-50 dark:bg-cyan-950">
          <ThemedText className="text-2xl font-bold text-center leading-none mb-6 text-red-500 dark:text-red-600">
            Delete Task ?
          </ThemedText>

          <ThemedText className="px-4 mb-5 text-lg leading-none text-gray-950 dark:text-slate-50">
            This task will be permenantly deleted!
          </ThemedText>

          <Row className="px-4">
            <Pressable
              onPress={() => {
                setShowDeleteConfirmationModal(false);
              }}
              className="justify-center items-center w-42 h-8.5 rounded-lg bg-slate-300/40 dark:bg-slate-400/20"
            >
              <ThemedText className="w-2/5 text-xl text-center leading-none text-blue-500 dark:text-blue-400">
                Cancel
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => {
                // setIsSaving(true);
                handleDelete(task, db, view, dispatch, date);
              }}
              // disabled={isSaving}
              className="justify-center items-center w-42 h-8.5 rounded-lg bg-red-500 dark:bg-red-600"
            >
              <ThemedText className="w-2/5 text-xl text-center leading-none text-gray-50 dark:text-gray-50">
                Delete
              </ThemedText>
            </Pressable>
          </Row>
        </View>
      </View>
    </Modal>
  );
}
