import { useState } from "react";
import { Pressable, StyleSheet, TextProps } from "react-native"
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = TextProps & {
    type: string;
    filter: "All" | "Pending" | "Completed";
    onPress: () => void;
}

export default function StatusButton ({ type, filter, onPress}: Props) {
    const colors = useThemeColors();
    const styleButton = {
        backgroundColor: 'white',
        textColor: colors.buttonStatHead,
        borderWidth: 0,
        borderColor: "rgb(209, 213, 220)"
    }
    if(filter === "All" && type === "All") {
         styleButton.backgroundColor= colors.all;
         styleButton.textColor= "light";
         styleButton.borderWidth= 0;
    }
    else if(filter === "Pending" && type === "Pending") {
         styleButton.backgroundColor= colors.pending;
         styleButton.textColor= "light";
         styleButton.borderWidth= 0;
    }
    else if(filter === "Completed" && type === "Completed") {
         styleButton.backgroundColor= colors.completed;
         styleButton.textColor= "light";
         styleButton.borderWidth= 0;
    }
    else {
         styleButton.backgroundColor= "white";
         styleButton.textColor= colors.buttonStatHead;
         styleButton.borderWidth= 1;
    }

    return (
        <Pressable onPress={onPress} style={[styles.button, {backgroundColor: styleButton.backgroundColor, borderWidth: styleButton.borderWidth, borderColor: styleButton.borderColor}]}>
            <ThemedText variant="button" color={styleButton.textColor} >{type}</ThemedText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",        
        alignItems: "center",
        width: 113,
        height: 32,
        borderRadius: 40,
    }
})
