"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
  useTheme,
} from "next-themes";

export { useTheme };

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
