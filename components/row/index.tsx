import { View, ViewProps } from "react-native";

type Props = ViewProps & {
  children: React.ReactNode;
};

export default function Row({ children, className }: Props) {
  return (
    <View className={`flex-row items-center justify-between gap-5 ${className}`}>{children}</View>
  );
}
