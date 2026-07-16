import { View, ViewProps } from "react-native";

type Props = ViewProps & {
  children: React.ReactNode;
};

export default function Col({ children, className }: Props) {
  return <View className={`flex-col items-center justify-between ${className}`}>{children}</View>;
}
