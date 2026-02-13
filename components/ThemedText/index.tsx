import { StyleSheet, Text, TextProps } from "react-native"; 
import { useThemeColors } from "../../hooks/useThemeColors"; 
import { Colors } from "../../constant/Colors";

 const styles = StyleSheet.create(
    { 
        normal : { fontSize: 16, lineHeight: 16 }, 
        title : { fontSize: 30, lineHeight: 36, fontWeight: "bold" }, 
        gretting : { fontSize: 26, lineHeight: 26, fontWeight: "bold" }, 
        subtitle1 : { fontSize: 24, lineHeight: 24, fontWeight: "600" }, 
        subtitle : { fontSize: 22, lineHeight: 20, fontWeight: "500" }, 
        button : { fontSize: 17, lineHeight: 18, fontWeight: "400" } 
    }); 
        
type Props = TextProps & { 
    variant?: keyof typeof styles; 
    color?: keyof typeof Colors["light"]; 
    style?: TextProps["style"]; 
} 
export function ThemedText({ variant, color , style, ...rest}: Props) {
    const colors = useThemeColors(); 
    return ( 
        <Text style={[styles[variant ?? "normal"], { color : colors[color ?? "text"] }, style]} {...rest} /> 
    )
}