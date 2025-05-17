import { ReactNode, useLayoutEffect } from "react";
import SwrProvider from "./SwrProvider";
import ApiProvider from "@/contexts/ApiProvider";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";

const THEME_MODE = "theme_mode";

const AppProviders = ({ children }: { children: ReactNode }) => {
  useLayoutEffect(() => {
    const theme = localStorage.getItem(THEME_MODE);

    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  return (
    <NextUIProvider>
      <ApiProvider>
        <AuthProvider>
          <SwrProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </SwrProvider>
        </AuthProvider>
      </ApiProvider>

      <Toaster />
      <Sonner />
    </NextUIProvider>
  );
};

export default AppProviders;
