import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";

import { useThemeColors } from "@/hooks/useThemeColors";
import { store } from "@/redux/store";
import { Header } from "@/components/headers/Header";
import { DatabaseProvider } from "@/context/databaseProvider";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeProvider } from "@/hooks/useTheme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <RootLayoutWithTheme />
        <Toast />
      </DatabaseProvider>
    </ThemeProvider>
  );
}

function RootLayoutWithTheme() {
  const colors = useThemeColors();
  return (
    <Provider store={store}>
      <LinearGradient
        colors={[colors.appBaseGradientStart, colors.appBaseGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.container}>
          <Header />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(views)" />
            <Stack.Screen
              name="addTask"
              options={{
                presentation: "formSheet",
                animation: "slide_from_bottom",
                contentStyle: {
                  backgroundColor: "transparent",
                },
              }}
            />
          </Stack>
        </SafeAreaView>
      </LinearGradient>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
