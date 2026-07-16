import { useState } from "react";
import { Pressable, TextProps } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColors } from "@/hooks/useThemeColors";

type Props = TextProps & {
  type: string;
  filter: "All" | "Pending" | "Completed";
  onPress: () => void;
};

const fitlerStatus = (type: string, filter: string) => {
  return type === filter;
};

export default function StatusButton({ type, filter, onPress }: Props) {
  const colors = useThemeColors();
  const styleButton = {
    backgroundColor: "white",
    borderWidth: 0,
    borderColor: "rgb(209, 213, 220)",
  };
  if (filter === "All" && type === "All") {
    styleButton.backgroundColor = colors.all;
    styleButton.borderWidth = 0;
  } else if (filter === "Pending" && type === "Pending") {
    styleButton.backgroundColor = colors.pending;
    styleButton.borderWidth = 0;
  } else if (filter === "Completed" && type === "Completed") {
    styleButton.backgroundColor = colors.completed;
    styleButton.borderWidth = 0;
  } else {
    styleButton.backgroundColor = "white";
    styleButton.borderWidth = 1;
  }

  return (
    <Pressable
      onPress={onPress}
      className="justify-center items-center w-28 h-8 rounded-full"
      style={{
        backgroundColor: styleButton.backgroundColor,
        borderWidth: styleButton.borderWidth,
        borderColor: styleButton.borderColor,
      }}
    >
      <ThemedText
        className={`text-lg leading-none ${fitlerStatus(type, filter) ? "text-gray-100 dark:text-gray-100" : "text-slate-500 dark:text-slate-400"} `}
      >
        {type}
      </ThemedText>
    </Pressable>
  );
}
