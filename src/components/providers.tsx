"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      {children}
      <Toaster
        richColors
        closeButton
        position="top-right"
        toastOptions={{
          style: { borderRadius: "12px" },
        }}
      />
    </ThemeProvider>
  );
}
