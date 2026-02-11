import { StyleSheet, View, ViewProps } from "react-native";

type Props = ViewProps & {
    children: React.ReactNode;
}

export default function Row ({ children, style } : Props ) {
    return (
        <View style={[styles.row, style]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create ({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        marginVertical: 5
    }
}) 