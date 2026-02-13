
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, StyleSheet } from "react-native";
import { Provider } from "react-redux";
import { useThemeColors } from "@/hooks/useThemeColors";
import { store } from "@/redux/store";
import { Header } from "@/components/headers/Header";
import { DatabaseProvider } from "@/context/databaseProvider";

export default function RootLayout() {
  const colors = useThemeColors();


  return (
    <DatabaseProvider>
      <Provider store={store}>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.appBase }]}> 
          <Header />
            <Stack screenOptions={{ headerShown: false }} >
              <Stack.Screen
                name="(views)"
              />
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
      </Provider>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
