import { Image, Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";
import Row from "../row";
import { useThemeColors } from "@/hooks/useThemeColors";

export function SubHeader ({ text } : { text: string }) {
    const colors = useThemeColors();
    return (
        <Row style={[ styles.subHeader, { backgroundColor: colors.bluelight } ]}>
            <Pressable onPress={router.back}>
                <Image source={require("@/assets/images/back.png")} style={styles.img} />
            </Pressable>
            <ThemedText variant="subtitle" color="light" >{text}</ThemedText>
            <Pressable onPress={()=>{}}>
                <Image source={require("@/assets/images/refresh.png")} style={styles.img} />
            </Pressable>
        </Row>
    )
}

const styles = StyleSheet.create({
    img: {
        width: 21.88,
        height: 21.32
    },
    subHeader: {
        height: 48,
        width: "100%",
        borderTopLeftRadius: 17,
        borderEndStartRadius: 17,
        paddingHorizontal: 15,
        marginVertical: 0
    }
})