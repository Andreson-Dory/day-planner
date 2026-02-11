import { Image, Pressable, StyleSheet, TextProps, View, ViewProps } from "react-native";
import { Link } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "../ThemedText";

type Props = {
    stl?: ViewProps["style"];
    date: string;
}
    
export function AddButton ({ stl , date} : Props) {
    const colors = useThemeColors();

    return (
        <Link 
            href={{
                pathname: '/modal/addTask',
                params: { date: date}
            }}
            asChild
        >
            <Pressable  >
                <View style={[styles.button, {backgroundColor: colors["greyWhite"]}, stl]}>
                    <Image source={require("@/assets/images/add.png")} style={styles.img} />
                    <ThemedText variant="subtitle" color="blue" style={{ width: "40%" }} >Add New Task</ThemedText>
                </View>
            </Pressable>
        </Link>
    )
}

const styles = StyleSheet.create({
    img: {
        width: 26,
        height: 21
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 51,
        marginHorizontal: 5,
        borderRadius: 15,
        gap: 10,
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#005EC9",
    }
})