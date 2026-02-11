import { useState } from "react";
import { Pressable, StyleSheet, TextProps } from "react-native"
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = TextProps & {
    onPress: () => void;
    pressed: boolean;
    type: "Ongoing" | "Completed";
}

export default function StatusButton ({ onPress,pressed, type }: Props) {
    const colors = useThemeColors();
    const colorButton = pressed ? "orange" : "greyWhite";
    const colorText = pressed ? "light" : "black";

    return (
        <Pressable onPress={onPress} style={[styles.button, {backgroundColor: colors[colorButton]}]}>
            <ThemedText variant="button" color={colorText} >{type}</ThemedText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        alignItems: "center",
        width: 113,
        height: 32,
        borderRadius: 10,
    }
})
