import { Text, TextProps, ViewProps } from "react-native";

type Props = TextProps & ViewProps;
export function ThemedText({ className, ...rest }: Props) {
  return <Text className={className} {...rest} />;
}
