import { Pressable, TextProps } from "react-native";
import { ThemedText } from "../ThemedText";

type Props = TextProps & {
  onPress?: () => void;
};

export default function ConfirmButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="justify-center items-center w-42 h-8.5 rounded-lg bg-slate-300/40 dark:bg-slate-400/20"
    >
      <ThemedText className="w-2/5 text-xl text-center leading-none text-blue-500 dark:text-blue-400">
        Confirm
      </ThemedText>
    </Pressable>
  );
}
