import React from "react";
import { useTheme } from "../../../app/providers/ThemeProvider";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "../../../shared/lib/utils";

export function ThemeTab() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium">Appearance</h3>
        <p className="text-sm text-muted-foreground">
          Customize how the application looks on your device.
        </p>
      </div>

      <div className="grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all",
            theme === "light"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Sun className={cn("h-8 w-8", theme === "light" ? "text-primary" : "text-muted-foreground")} />
          <span className="font-medium">Light</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all",
            theme === "dark"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Moon className={cn("h-8 w-8", theme === "dark" ? "text-primary" : "text-muted-foreground")} />
          <span className="font-medium">Dark</span>
        </button>

        <button
          onClick={() => setTheme("system")}
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border-2 p-6 transition-all",
            theme === "system"
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Monitor className={cn("h-8 w-8", theme === "system" ? "text-primary" : "text-muted-foreground")} />
          <span className="font-medium">System Default</span>
        </button>
      </div>
    </div>
  );
}
