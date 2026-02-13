import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps & {
    style?: ViewProps["style"],
    children?: React.ReactNode
}

export default function RouterView ({style, children } : Props){
    const colors = useThemeColors();
    return(
        <View style={[styles.appContainer, { backgroundColor: colors.content }, style]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
  appContainer : {
    flex: 1,
    borderRadius: 17,
    marginHorizontal: 5,
    marginTop: 15
  }
})