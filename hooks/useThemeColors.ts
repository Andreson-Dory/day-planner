import { Colors } from "../constant/Colors";
import { useTheme } from "./useTheme";

export function useThemeColors() {
  const { theme } = useTheme();
  return Colors[theme];
}
