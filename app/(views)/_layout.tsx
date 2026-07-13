import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeLayout() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.appBaseGradientStart, colors.appBaseGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="flex-1"
      >
        <View className="flex-1">
          <Slot />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: -20,
    paddingTop: -55,
  },
});
