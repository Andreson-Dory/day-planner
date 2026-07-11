import { StyleSheet, Text, TextProps } from "react-native";
import { useThemeColors } from "../../hooks/useThemeColors";
import { Colors } from "@/constant/Colors";

const styles = StyleSheet.create({
  normal: { fontSize: 18, lineHeight: 16 },
  gretting: { fontSize: 30, lineHeight: 26, fontWeight: "bold" },
  subtitle1: { fontSize: 24, lineHeight: 24, fontWeight: "600" },
  subtitle: { fontSize: 22, lineHeight: 20, fontWeight: "500" },
  taskTitle: { fontSize: 18, lineHeight: 20, fontWeight: "600" },
  smallText: { fontSize: 16, lineHeight: 16, fontWeight: "500" },
  button: { fontSize: 18, lineHeight: 18, fontWeight: "600" },
});

type Props = TextProps & {
  variant?: keyof typeof styles;
  color?: keyof (typeof Colors)["light"];
  style?: TextProps["style"];
};
export function ThemedText({ variant, color, style, ...rest }: Props) {
  const colors = useThemeColors();
  return (
    <Text
      style={[styles[variant ?? "normal"], { color: colors[color ?? "text"] }, style]}
      {...rest}
    />
  );
}
