import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View } from "react-native";
import { useThemeColors } from "@/hooks/useThemeColors";

export default function HomeLayout() {
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.appBase }]}>
       <View style={{flex: 1}}> 
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: -20,
    paddingTop: -55
  },
});
