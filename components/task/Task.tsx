import { Pressable, StyleSheet, TextProps, View } from "react-native";
import { useState } from "react";
import { task } from "@/constant/types/task";
import Button from "../button/Button";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = TextProps & {
    task: task
}

export function Task({task} : Props) {
    const colors = useThemeColors();
    const [pressed, setPressed] =  useState(false);
    return (
        <Pressable onPress={() => setPressed(!pressed)}>
            <View style={[styles.container, {backgroundColor: colors.task}]}>
                <ThemedText variant="normal" color="text" style={{fontWeight:700}}>{task.title}</ThemedText>
                {pressed && <View>
                <View style={styles.timeDetails}>
                    <ThemedText variant="normal" color="text">Start Time : {task.startTime} </ThemedText>
                    <ThemedText variant="normal" color="text">End Time : {task.endTime} </ThemedText>
                </View>
                <View style={styles.buttons}>
                    <Button type="Finish"/>
                    <Button type="Delete"/>
                </View>
                </View>}
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        paddingTop: 10,
        paddingBottom : 10,
        paddingHorizontal: 15,
        marginTop: 5,
        marginBottom: 5,
        marginHorizontal: 5,
        borderRadius: 15,
        gap: 5,
    },
    buttons: {
        flexDirection: "row",
        marginTop: 5,
        gap: 20,
    },
    timeDetails: {
        flexDirection: "column",
        gap: 5
    }
})