"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | null>(null);

function getInitialTheme(storageKey: string, defaultTheme: Theme): Theme {
  if (typeof window === "undefined") return defaultTheme;
  const stored = localStorage.getItem(storageKey) as Theme | null;
  return stored === "light" || stored === "dark" ? stored : defaultTheme;
}

function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(t);
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "pdms-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const t = getInitialTheme(storageKey, defaultTheme);
    if (typeof window !== "undefined") applyTheme(t);
    return t;
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const setThemeAndPersist = useCallback((t: Theme) => {
    setTheme(t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme: setThemeAndPersist, toggleTheme }),
    [theme, setThemeAndPersist, toggleTheme],
  );

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
