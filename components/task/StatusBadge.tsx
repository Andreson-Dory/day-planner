import { getStatusColors } from "@/constant/task";
import { Text, View, ViewProps } from "react-native";

type Props = ViewProps & {
  status: string;
};

export function StatusBadge({ status, className }: Props) {
  const c = getStatusColors(status);
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <View className={`flex-row gap-1.5 px-2.5 rounded-full items-center h-6 ${c.bg} ${className}`}>
      <View className={`w-2 h-2 rounded-full ${c.dot}`} />
      <Text className={`text-sm text-center ${c.text}`}>{formattedStatus}</Text>
    </View>
  );
}
