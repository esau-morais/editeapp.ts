import { useEffect, useState } from "react";
import type { Theme } from "../types";

function useThemeSwitcher(
  key: string,
  initialTheme: Theme
): [Theme, (theme: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    const storagedTheme = localStorage.getItem(key);
    return storagedTheme ? (JSON.parse(storagedTheme) as Theme) : initialTheme;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(theme));
  }, [key, theme]);

  return [theme, setTheme];
}

export default useThemeSwitcher;

