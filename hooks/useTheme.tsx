import { createContext, useContext, useState } from "react";
import { colorScheme } from "nativewind";

type Theme = "light" | "dark";

const ThemeContext = createContext({
  theme: "light" as Theme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = colorScheme.get() ?? "light";
  const [theme, setTheme] = useState<Theme>(systemTheme);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    colorScheme.set(newTheme);
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
