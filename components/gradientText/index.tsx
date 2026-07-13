import { Text, ViewProps } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/hooks/useThemeColors";

type GradientTextProps = ViewProps & {
  text: string;
};

export function GradientText({ text, className }: GradientTextProps) {
  const color = useThemeColors();
  return (
    <MaskedView maskElement={<Text className={className}>{text}</Text>}>
      <LinearGradient colors={["#ffffff", color.title]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text className={`opacity-0 ${className}`}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}
