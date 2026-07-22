// components/CustomDrawerContent.tsx
import { Pressable, Image, View, Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useTheme } from "@/hooks/useTheme"; // wherever your toggleTheme/theme lives
import { Moon, Sun } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeColors } from "@/hooks/useThemeColors";
import { GradientText } from "../gradientText";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <LinearGradient
      colors={[colors.appBaseGradientStart, colors.appBaseGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
    >
      <DrawerContentScrollView {...props}>
        <View className="items-center gap-4 mb-10">
          <View className="rounded-full items-center justify-center bg-transparent w-20 h-20">
            <Image source={require("@/assets/images/day-planner.png")} className="w-20 h-20" />
          </View>
          <GradientText
            text="DAY PLANNER"
            className="text-4xl text-center leading-none font-bold bg-transparent"
          />
        </View>

        <View className="border-t border-t-slate-700 dark:border-t-slate-300 w-full mb-10" />

        {/* Renders all your existing Drawer.Screen items automatically */}
        <DrawerItemList {...props} />

        <View className="border-t border-t-slate-700 dark:border-t-slate-300 w-full my-10" />

        {/* Your custom theme toggle, styled like a drawer row */}
        <View className="px-4">
          <Pressable onPress={toggleTheme}>
            {theme === "light" ? (
              <View className="flex-row items-center gap-4">
                <Moon size={25} color={colors.drawerText} />
                <Text className="text-xl text-slate-700">Mode sombre</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-4">
                <Sun size={25} color={colors.drawerText} />
                <Text className="text-xl text-slate-100">Mode clair</Text>
              </View>
            )}
          </Pressable>
        </View>
      </DrawerContentScrollView>
    </LinearGradient>
  );
}
