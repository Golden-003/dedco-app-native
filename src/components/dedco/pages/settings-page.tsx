"use client";

import { motion } from "framer-motion";
import { User, Globe, Shield, Bell, Moon, LogOut, ChevronRight } from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { useState } from "react";

const SETTINGS = [
  { section: "Compte", items: [
    { icon: <User size={18} />, label: "Informations personnelles", value: "Marie Houénou", action: "profile" },
    { icon: <Shield size={18} />, label: "Sécurité", value: "Mot de passe", action: "password" },
    { icon: <Bell size={18} />, label: "Notifications", value: "Email & SMS", action: "notifications" },
  ]},
  { section: "Préférences", items: [
    { icon: <Globe size={18} />, label: "Langue", value: "Français" },
    { icon: <Moon size={18} />, label: "Mode sombre", value: "Désactivé" },
  ]},
];

export function SettingsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const [notifs, setNotifs] = useState(true);

  return (
    <div className="dedco-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <button
        onClick={goBack}
        className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-4 inline-flex items-center gap-1 cursor-pointer"
      >
        ← Retour
      </button>

      <h1 className="display-lg font-bold text-[var(--text-1)] mb-6">Paramètres</h1>

      <div className="space-y-6">
        {SETTINGS.map((section) => (
          <motion.div
            key={section.section}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="dedco-card p-5 sm:p-6"
          >
            <h2 className="font-display font-semibold text-base text-[var(--text-1)] mb-4">{section.section}</h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.action === "profile") navigate({ page: "profile" });
                    else if (item.action === "notifications") navigate({ page: "notifications" });
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--amber)] transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-[var(--text-3)]">{item.icon}</span>
                    <span className="font-medium text-[var(--text-1)]">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && <span className="text-xs text-[var(--text-3)]">{item.value}</span>}
                    <ChevronRight size={14} className="text-[var(--text-3)]" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Toggle notifications */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="dedco-card p-5 sm:p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-[var(--text-1)]">Alertes commandes</p>
              <p className="text-xs text-[var(--text-3)] mt-0.5">Recevez des notifications pour vos commandes</p>
            </div>
            <button
              onClick={() => setNotifs(!notifs)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${notifs ? "bg-[var(--amber)]" : "bg-[var(--border)]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifs ? "translate-x-[22px]" : "translate-x-0.5"}`} />
            </button>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="dedco-card p-5 sm:p-6 border-[var(--terracotta)]/20"
        >
          <button
            className="flex items-center gap-3 text-sm font-medium text-[var(--terracotta)] hover:underline cursor-pointer"
          >
            <LogOut size={18} />
            Se déconnecter
          </button>
        </motion.div>
      </div>
    </div>
  );
}
