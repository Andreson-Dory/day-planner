import { Image, StyleSheet, View } from "react-native";
import { GradientText } from "../gradientText";
import { ThemedText } from "../ThemedText";

export function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={require("@/assets/images/Settings.png")}
          style={[{ width: 25, height: 25 }, styles.image]}
        />

        <GradientText text="DAY PLANNER" style={styles.title} />
      </View>

      <View style={styles.userContainer}>
        <Image
          source={require("@/assets/images/user.png")}
          style={{ width: 51, height: 49 }}
        />
        <ThemedText variant="gretting" color="user">
          Hello Dear
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
    paddingHorizontal: 20,
    gap: 15,
  },
  userContainer: {
    alignItems: "center",
    gap: 5,
  },
  titleContainer: {
    gap: 10,
    marginBottom: -16
  },
  title: {
    fontSize: 40,
    lineHeight: 36,
    fontWeight: "bold",
  },
  image: {
    paddingTop: -25
  }
});
