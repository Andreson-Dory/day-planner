import { StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps & {
    children: React.ReactNode;
}

export default function Col ({ children, style } : Props ) {
    return (
        <View style={[styles.col, style]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create ({
    col: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between"
    }
}) 