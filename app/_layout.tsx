
import { Slot, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";
import { useThemeColors } from "@/hooks/useThemeColors";
import { store } from "@/redux/store";
import { Header } from "@/components/headers/Header";

export default function RootLayout() {
  const colors = useThemeColors();

  return (
    <Provider store={store}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.appBase }]}> 
        <Header />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
              name="addTask"
              options={{
                presentation: "modal",
              }}
            />
          </Stack>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
