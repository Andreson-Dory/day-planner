import { Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import RouterView from "./router-view";
import { useThemeColors } from "@/hooks/useThemeColors";
import OptionCard from "@/components/optionCard";

export function AppContent () {
    const colors = useThemeColors();
    return (
        <>
            <RouterView style={[styles.appContent, { flex: 1 }]}>
              <Link href="/views/today-task" asChild>
                <Pressable android_ripple={{ color: colors.appBase, foreground: true }}>
                    <LinearGradient colors={[colors.greenGradientStart, colors.greenGradientEnd]} start={{x: 0, y: 0}} end={{x: 0, y: 1}} 
                      style={styles.gradient}>
                        <OptionCard subtitle="TODAY'S TASK LIST" image={require("@/assets/images/today-tasks.png")} />
                    </LinearGradient>
                </Pressable>
              </Link>
              <Link href="/views/week-task" asChild>
                  <Pressable android_ripple={{ color: colors.appBase, foreground: true }}>
                    <LinearGradient colors={[colors.blueGradientStart, colors.blueGradientEnd]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} 
                      style={styles.gradient}>
                        <OptionCard subtitle="WEEK'S TASK LIST" image={require("@/assets/images/week-tasks.png")} />
                    </LinearGradient>
                  </Pressable>
              </Link>
              <Link href="/views/create-plan" asChild>
                  <Pressable android_ripple={{ color: colors.appBase, foreground: true }}>
                    <LinearGradient colors={[colors.orangeGradientStart, colors.orangeGradientEnd]} start={{x: 0, y: 0}} end={{x: 0, y: 1}} 
                      style={styles.gradient}>
                        <OptionCard subtitle="CREATE PLAN" image={require("@/assets/images/create.png")} />
                    </LinearGradient>
                  </Pressable>
              </Link>
            </RouterView>
        </>
    )
}

const styles = StyleSheet.create({
  appContent : {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 60,
    gap: 30,
    alignItems: "center"
  },
  gradient: {
    borderRadius: 19,
    overflow: "hidden"
  }
})