import { Pressable, TouchableOpacity, View } from "react-native";
import { ArrowDownNarrowWideIcon, Menu, RefreshCcw } from "lucide-react-native";
import { ThemedText } from "../ThemedText";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import Row from "../row";
import { RefObject } from "react";

type Props = {
  text: string;
  type: string;
  onPress?: () => void;
  ButtonRef?: RefObject<View>;
};

export function SubHeader({ text, type, onPress, ButtonRef }: Props) {
  const navigation = useNavigation();
  return (
    <Row className="h-12 w-full px-3.75 mb-2 bg-sky-600 dark:bg-sky-400">
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <Menu size={28} color="#f8fafc" />
      </TouchableOpacity>

      <ThemedText className="text-xl leading-none text-slate-50 dark:text-slate-50">
        {text}
      </ThemedText>
      {type === "create" || type === "week" ? (
        <Pressable onPress={onPress} ref={ButtonRef}>
          <ArrowDownNarrowWideIcon size={28} color="#f8fafc" />
        </Pressable>
      ) : (
        <Pressable onPress={onPress}>
          <RefreshCcw size={28} color="#f8fafc" />
        </Pressable>
      )}
    </Row>
  );
}
