import { View, ViewProps } from "react-native";

type Props = ViewProps & {
  children?: React.ReactNode;
};

export default function RouterView({ className, children }: Props) {
  return (
    <View
      className={`flex-1 rounded-2xl mx-1 mt-4 mb-1 bg-slate-100 dark:bg-neutral-800  ${className}`}
    >
      {children}
    </View>
  );
}
