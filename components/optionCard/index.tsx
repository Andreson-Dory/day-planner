import { Image, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  subtitle: string;
  description: string;
  image: any;
  colorGradientStart: string;
  colorGradientEnd: string;
  iconColor: string;
};

export default function OptionCard({
  subtitle,
  description,
  image,
  colorGradientStart,
  colorGradientEnd,
  iconColor,
}: Props) {
  const colors = useThemeColors();

  return (
    <View className="w-80 h-48 border-0.5 rounded-3xl overflow-hidden border-slate-600 dark:border-gray-50">
      <LinearGradient
        colors={[colorGradientStart, colorGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1 items-center justify-center"
      >
        <Image
          source={image}
          tintColor={iconColor}
          className="w-11 h-10 items-center justify-center"
        />
      </LinearGradient>
      <View className="flex-1 items-center justify-center border-t border-t-gray-200 bg-white dark:bg-slate-400">
        <ThemedText className="text-2xl leading-none text-center mb-3 text-slate-900 dark:text-slate-50">
          {subtitle}
        </ThemedText>
        <ThemedText className="text-base leading-none text-slate-600 dark:text-gray-50">
          {description}
        </ThemedText>
      </View>
    </View>
  );
}
