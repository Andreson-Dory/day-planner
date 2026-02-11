import { useColorScheme } from "react-native";
import { Colors } from "../constant/Colors";

export function useThemeColors () {
    const theme = useColorScheme() ?? "light";
    return Colors[theme];
}