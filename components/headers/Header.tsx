import { Image, Pressable, View } from "react-native";
import { GradientText } from "../gradientText";
import { useTheme } from "@/hooks/useTheme";
import { useThemeColors } from "@/hooks/useThemeColors";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();
  return (
    <View className="flex-row items-center justify-between px-5 gap-3.75 bg-transparent">
      <View className="gap-2.5 mt-4">
        <GradientText
          text="DAY PLANNER"
          className="text-4xl leading-none font-bold bg-transparent"
        />
      </View>

      <View className="flex-row pt-3.75 items-center gap-5">
        <Pressable onPress={toggleTheme}>
          {theme === "light" ? (
            <Image source={require("@/assets/images/dark-mode.png")} className="w-7 h-7" />
          ) : (
            <Image
              source={require("@/assets/images/light-mode.png")}
              style={{ tintColor: "white" }}
              className="w-7 h-7"
            />
          )}
        </Pressable>
        <Image
          source={require("@/assets/images/Info.png")}
          style={{ tintColor: colors.infoIcon }}
          className="w-7 h-7"
        />
      </View>
    </View>
  );
}
