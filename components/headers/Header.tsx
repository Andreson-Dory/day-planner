import { Image, StyleSheet, View } from "react-native";
import { GradientText } from "../gradientText";
import { ThemedText } from "../ThemedText";

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={require("@/assets/images/Settings.png")}
          style={{ width: 14, height: 24 }}
        />

        <GradientText
          text="DAY PLANNER"
          style={styles.title}
        />
      </View>

      <View style={styles.userContainer}>
        <Image
          source={require("@/assets/images/user.png")}
          style={{ width: 51, height: 49 }}
        />
        <ThemedText variant="gretting" color="user">
          Hello, Dory!
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  userContainer: {
    alignItems: "center",
  },
  titleContainer: {
    gap: 20,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "bold",
  },
});
