import { ThemedText } from "@/components/ThemedText";
import { CheckCircleIcon, Trash2Icon } from "lucide-react-native";
import Reanimated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export function FinishAction({
  progress,
  iconColor,
  pressed,
  dimension,
}: {
  progress: SharedValue<number>;
  iconColor: string;
  pressed: boolean;
  dimension: number;
}) {
  const ACTION_WIDTH = dimension * 0.3;

  const innerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scaleX: interpolate(progress.value, [0, 1], [0.3, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <Reanimated.View
      style={{ width: ACTION_WIDTH, overflow: "hidden" }}
      className="rounded-2xl bg-emerald-500 dark:bg-emerald-500 mt-1.25 mb-1.25 mx-1.25"
    >
      <Reanimated.View
        style={[{ flex: 1 }, innerStyle]}
        className="flex-row justify-center items-center py-3.75 px-3.75 gap-1"
      >
        <CheckCircleIcon size={pressed ? 32 : 18} color={iconColor} />
        {!pressed && (
          <ThemedText className="text-lg leading-none text-slate-50 dark:text-slate-800">
            Finish
          </ThemedText>
        )}
      </Reanimated.View>
    </Reanimated.View>
  );
}

export function DeleteAction({
  progress,
  iconColor,
  pressed,
  dimension,
}: {
  progress: SharedValue<number>;
  iconColor: string;
  pressed: boolean;
  dimension: number;
}) {
  const ACTION_WIDTH = dimension * 0.3;

  const innerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scaleX: interpolate(progress.value, [0, 1], [0.3, 1], Extrapolation.CLAMP),
      },
    ],
  }));

  return (
    <Reanimated.View
      style={{ width: ACTION_WIDTH, overflow: "hidden" }}
      className="rounded-2xl bg-red-500 dark:bg-red-500 mt-1.25 mb-1.25 mx-1.25"
    >
      <Reanimated.View
        style={[{ flex: 1 }, innerStyle]}
        className="flex-row justify-center items-center py-3.75 px-3.75 gap-1"
      >
        <Trash2Icon size={pressed ? 32 : 18} color={iconColor} />
        {!pressed && (
          <ThemedText className="text-lg leading-none text-slate-50 dark:text-slate-800">
            Delete
          </ThemedText>
        )}
      </Reanimated.View>
    </Reanimated.View>
  );
}
