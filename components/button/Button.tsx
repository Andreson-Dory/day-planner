import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, Pressable, StyleSheet, TextProps } from "react-native";
import { ThemedText } from "../ThemedText";
import { green } from "react-native-reanimated/lib/typescript/Colors";

type Props = TextProps & {
   type : "Finish" | "Delete",
   onPress : () => void;
}

export default function Button ({ type, onPress } : Props) {
    const colors = useThemeColors();
    const colorButton = type === "Finish" ? colors.finish : colors.trash;
    
    return (
        <Pressable style={[styles.button, {backgroundColor: colorButton}]} onPress={onPress}>
            {type === 'Finish' ? 
                <Image source={require("@/assets/images/finish.png")} style={[styles.img, {tintColor: colors.taskIconBtn}]} /> :
                <Image source={require("@/assets/images/trash.png")} style={[styles.img, {tintColor: colors.taskIconBtn}]}/>
            }
            <ThemedText variant="button" color='light' >{type}</ThemedText>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        flexDirection: 'row',
        gap: 18,
        justifyContent: "center",
        alignItems: "center",
        width: 160,
        height: 30,
        borderRadius: 10,
    },
    img: {
        width: 12,
        height: 14
    }
})
