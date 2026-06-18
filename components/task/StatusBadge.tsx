import { useThemeColors } from "@/hooks/useThemeColors";
import { StyleSheet, Text, View, ViewProps } from "react-native";

type Props = {
    status: string; 
    stl?: ViewProps["style"];
}

export function StatusBadge({status, stl}: Props) {
    const colors = useThemeColors();
    const getStatusColors = () => {
        switch (status) {
        case 'completed':
            return {
            bg: colors.completedBg,
            text: colors.completedTxt,
            dot: colors.completedDot,
            };
        case 'ongoing':
            return {
            bg: colors.ongoingBg,
            text: colors.ongoingTxt,
            dot: colors.ongoingDot,
            };
        case 'overdue':
            return {
            bg: colors.overdueBg,
            text: colors.overdueTxt,
            dot: colors.overdueDot,
            };
        case 'upcoming':
            return {
            bg: colors.upcomingBg,
            text: colors.upcomingTxt,
            dot: colors.upcomingDot,
            };
        default:
            return {
            bg: colors.upcomingBg,
            text: colors.upcomingTxt,
            dot: colors.upcomingDot,
            };
        }
    };

    const c = getStatusColors();
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <View style={[styles.container, {backgroundColor: c.bg}, stl]}>
            <View style={{width: 8, height: 8, borderRadius: 4, backgroundColor: c.dot}} />
            <Text style={{color: c.text, fontSize: 15, fontWeight: 600, textAlignVertical: 'center'}}>{formattedStatus}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
   container: {
    height: 25,
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    borderRadius: 200,
    alignItems: 'center'
   } 
})