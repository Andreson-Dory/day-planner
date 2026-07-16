import { Image, Pressable, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";
import Row from "../row";
import { RefObject } from "react";

type Props = {
  text: string;
  onPress: () => void;
  ButtonRef?: RefObject<View>;
};

export function SubHeader({ text, onPress, ButtonRef }: Props) {
  return (
    <Row className="h-12 w-full rounded-tl-2xl rounded-tr-2xl px-3.75 mb-2 bg-sky-400 dark:bg-sky-600">
      <Pressable onPress={router.back}>
        <Image source={require("@/assets/images/back.png")} className="w-5.5 h-5.5" />
      </Pressable>
      <ThemedText className="text-xl leading-none text-gray-50 dark:text-gray-100">
        {text}
      </ThemedText>
      {text === "Create Plan" ? (
        <Pressable onPress={onPress} ref={ButtonRef}>
          <Image source={require("@/assets/images/menu.png")} className="w-5.5 h-5.5" />
        </Pressable>
      ) : (
        <Pressable onPress={onPress}>
          <Image source={require("@/assets/images/refresh.png")} className="w-5.5 h-5.5" />
        </Pressable>
      )}
    </Row>
  );
}
