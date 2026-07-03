"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Évite l'hydration mismatch — rend un placeholder jusqu'au mount
  if (!mounted) {
    return (
      <div className="dedco-btn-icon dedco-btn-icon-ghost dedco-btn-icon-sm" aria-hidden>
        <Sun size={16} />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="dedco-btn-icon dedco-btn-icon-ghost dedco-btn-icon-sm"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
