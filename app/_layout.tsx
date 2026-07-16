import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
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
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <Header />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(views)" />
          </Stack>
        </SafeAreaView>
      </LinearGradient>
    </Provider>
  );
}
