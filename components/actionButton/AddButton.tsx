import { Image, Pressable, TextProps, View, ViewProps } from "react-native";
import { ThemedText } from "../ThemedText";

type Props = TextProps & ViewProps;

export function AddButton({ onPress, className }: Props) {
  return (
    <Pressable onPress={onPress}>
      <View
        className={`flex-row justify-center items-center h-12 mx-1 rounded-2xl gap-2 border border-dashed border-blue-500 dark:border-blue-400 bg-slate-300/40 dark:bg-slate-400/20 text-blue-500 dark:text-blue-400 ${className}`}
      >
        <Image source={require("@/assets/images/add.png")} className="w-6 h-5" />
        <ThemedText className="w-1/4 text-xl leading-none text-blue-500 dark:text-blue-400">
          Add New Task
        </ThemedText>
      </View>
    </Pressable>
  );
}
