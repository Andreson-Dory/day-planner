import { Image, StyleSheet, View } from "react-native";
import { GradientText } from "../gradientText";
import { ThemedText } from "../ThemedText";
import { user } from "@/constant/types/user";
import { useAppSelector } from "@/hooks/useAppSelector";

export function Header() {
  const user: user = useAppSelector(state => state.user.user);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image
          source={require("@/assets/images/Settings.png")}
          style={{ width: 22, height: 22 }}
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
          Hello, {user.firstName}
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
    gap: 15
  },
  userContainer: {
    alignItems: "center",
    gap: 5
  },
  titleContainer: {
    gap: 30,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "bold",
  },
});
