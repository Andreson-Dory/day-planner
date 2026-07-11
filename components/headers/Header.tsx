import { Image, Pressable, StyleSheet, View } from "react-native";
import { GradientText } from "../gradientText";
import { ThemedText } from "../ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColors } from "@/hooks/useThemeColors";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <GradientText text="DAY PLANNER" style={styles.title} />
      </View>

      <View style={styles.settings}>
        <Pressable onPress={toggleTheme}>
          {theme === "light" ? (
            <Image
              source={require("@/assets/images/dark-mode.png")}
              style={{ width: 30, height: 30 }}
            />
          ) : (
            <Image
              source={require("@/assets/images/light-mode.png")}
              style={{ width: 30, height: 30, tintColor: "white" }}
            />
          )}
        </Pressable>
        <Image
          source={require("@/assets/images/Info.png")}
          style={{ width: 30, height: 30, tintColor: colors.infoIcon }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 15,
  },
  settings: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 15,
    alignItems: "center",
    gap: 20,
  },
  titleContainer: {
    gap: 10,
    marginTop: 16,
  },
  title: {
    fontSize: 40,
    lineHeight: 36,
    fontWeight: "bold",
  },
});
