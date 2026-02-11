import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, Pressable, StyleSheet, TextProps } from "react-native";
import { ThemedText } from "../ThemedText";
import { green } from "react-native-reanimated/lib/typescript/Colors";

type Props = TextProps & {
   type : "Finish" | "Delete"
}

export default function Button ({ type } : Props) {
    const colors = useThemeColors();
    const colorButton = type === "Finish" ? colors.success : colors.greyWhite;
    const colorText = type === "Finish" ? "green" : "red";
    
    return (
        <Pressable style={[styles.button, {backgroundColor: colorButton}]}>
            <ThemedText variant="button" color={colorText} >{type}</ThemedText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        width: 168,
        height: 35,
        borderRadius: 10,
    }
})
