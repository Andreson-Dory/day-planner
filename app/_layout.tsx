import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import Toast from "react-native-toast-message";
import "@/global.css";

import { store } from "@/redux/store";
import { DatabaseProvider } from "@/context/databaseProvider";
import { ThemeProvider } from "@/hooks/useTheme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "@/hooks/useThemeColors";
import { CustomDrawerContent } from "@/components/drawer/CustomDrawerContent";
import { CalendarDaysIcon, LayoutDashboard, ListIcon, LucideTagPlus } from "lucide-react-native";

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
      <SafeAreaProvider>
        <StatusBar translucent backgroundColor="transparent" style="auto" />

        <SafeAreaView
          className="flex-1 bg-sky-300 dark:bg-cyan-800"
          edges={["top", "left", "right"]}
        >
          <Drawer
            screenOptions={{
              headerShown: false,
              drawerStyle: { backgroundColor: "transparent", width: "60%" },
              drawerActiveTintColor: colors.drawerText,
              drawerInactiveTintColor: colors.drawerText,
              drawerLabelStyle: {
                fontSize: 18,
              },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: "Home",
                title: "Home",
                drawerIcon: () => <LayoutDashboard size={25} color={colors.drawerText} />,
              }}
            />
            <Drawer.Screen
              name="today-task/index"
              options={{
                drawerLabel: "Today's tasks list",
                title: "Today tasks",
                drawerIcon: () => <ListIcon size={25} color={colors.drawerText} />,
              }}
            />
            <Drawer.Screen
              name="week-task/index"
              options={{
                drawerLabel: "Week's tasks list",
                title: "Week Tasks",
                drawerIcon: () => <CalendarDaysIcon size={25} color={colors.drawerText} />,
              }}
            />
            <Drawer.Screen
              name="create-plan/index"
              options={{
                drawerLabel: "Create plan",
                title: "Create plan",
                drawerIcon: () => <LucideTagPlus size={25} color={colors.drawerText} />,
              }}
            />
          </Drawer>
        </SafeAreaView>
      </SafeAreaProvider>
    </Provider>
  );
}
