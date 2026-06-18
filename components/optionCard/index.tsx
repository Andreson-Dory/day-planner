import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LinearGradient } from "expo-linear-gradient";

type Props =  {
    subtitle: string, 
    description: string, 
    image: any,
    colorGradientStart: string,
    colorGradientEnd: string,
    iconColor: string
}

export default function OptionCard ({ subtitle, description, image ,colorGradientStart, colorGradientEnd, iconColor} : Props) {
    const colors = useThemeColors();
    
    return (
        <View style={[styles.container, { borderWidth: 0.5, borderColor: colors.cardDescription}]} >
            <LinearGradient
              colors={[colorGradientStart, colorGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
                <Image source={image} style={{ width: 45, height: 40 }} tintColor={iconColor} />
            </LinearGradient>
            <View style={[styles.cardContent, {backgroundColor: colors.cardBg}]}>
                <ThemedText variant="subtitle1" color="cardTitle" style={{ textAlign: "center", marginBottom: 10 }}>{subtitle}</ThemedText>
                <ThemedText variant="smallText" color="cardDescription" >{description}</ThemedText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 325,
        height: 200,
        borderRadius: 20,
        overflow: "hidden"
    },
    gradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    cardContent: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        borderTopWidth: 1,
        borderTopColor: "#eee",
    }
})