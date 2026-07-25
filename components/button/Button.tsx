import { useThemeColors } from "@/hooks/useThemeColors";
import { Pressable, TextProps } from "react-native";
import { ThemedText } from "../ThemedText";
import { CheckCircleIcon, Trash2Icon } from "lucide-react-native";

type Props = TextProps & {
  type: "Finish" | "Delete";
  onPress: () => void;
};

export default function Button({ type, onPress }: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      className={`flex-row justify-center items-center w-40 h-7 rounded-lg gap-2 ${type === "Finish" ? "bg-emerald-500 dark:bg-emerald-500" : "bg-red-500 dark:bg-red-500"}`}
      onPress={onPress}
    >
      {type === "Finish" ? (
        <CheckCircleIcon size={18} color={colors.taskIconBtn} />
      ) : (
        <Trash2Icon size={18} color={colors.taskIconBtn} />
      )}
      <ThemedText className="text-lg leading-none text-slate-50 dark:text-slate-800 ">
        {type}
      </ThemedText>
    </Pressable>
  );
}
