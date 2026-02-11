import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";

export default function OptionCard ({ subtitle, image } : { subtitle: string, image: any }) {
    return (
        <View style={styles.container} >
            <Image source={image} style={{ width: 69, height: 61 }} />
            <ThemedText variant="subtitle1" color="content" style={{ textAlign: "center", marginBottom: 10 }}>{subtitle}</ThemedText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 275,
        height: 175,
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    }
})