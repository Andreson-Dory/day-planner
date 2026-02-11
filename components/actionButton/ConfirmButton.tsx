import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, Pressable, StyleSheet, TextProps } from "react-native";
import { ThemedText } from "../ThemedText";

type Props = TextProps & {
    onPress?: () => void;
}

export default function ConfirmButton ({ onPress } : Props) {
    const colors = useThemeColors();

    return (
        <Pressable onPress={onPress} style={[styles.button, {backgroundColor: colors["greyWhite"]}]}>
            <ThemedText variant="button" color="blue" >Confirm</ThemedText>
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
