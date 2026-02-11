import { Text, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/hooks/useThemeColors";

type GradientTextProps = {
  text: string;
  style?: any;
};

export function GradientText({ text, style }: GradientTextProps) {
    const color =useThemeColors();
  return (
    <MaskedView
      maskElement={
        <Text style={[style, styles.maskText]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={["#ffffff", color.title]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, styles.hiddenText]}>
          {text}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  maskText: {
    backgroundColor: "transparent",
  },
  hiddenText: {
    opacity: 0,
  },
});
