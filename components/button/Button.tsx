import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, Pressable, TextProps } from "react-native";
import { ThemedText } from "../ThemedText";

type Props = TextProps & {
  type: "Finish" | "Delete";
  onPress: () => void;
};

export default function Button({ type, onPress }: Props) {
  const colors = useThemeColors();

  return (
    <Pressable
      className={`flex-row justify-center items-center w-40 h-7 rounded-lg gap-4 ${type === "Finish" ? "bg-emerald-500 dark:bg-emerald-500" : "bg-red-500 dark:bg-red-500"}`}
      onPress={onPress}
    >
      {type === "Finish" ? (
        <Image
          source={require("@/assets/images/finish.png")}
          className="w-3 h-3.5"
          style={{ tintColor: colors.taskIconBtn }}
        />
      ) : (
        <Image
          source={require("@/assets/images/trash.png")}
          className="w-3 h-3.5"
          style={{ tintColor: colors.taskIconBtn }}
        />
      )}
      <ThemedText className="text-lg leading-none text-slate-50 dark:text-slate-800 ">
        {type}
      </ThemedText>
    </Pressable>
  );
}
