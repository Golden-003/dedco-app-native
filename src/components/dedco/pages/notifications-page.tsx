"use client";

import { motion } from "framer-motion";
import { Bell, Package, MessageSquare, ShieldCheck, Star, Check } from "lucide-react";
import { useDedcoStore } from "@/lib/store";

const NOTIFICATIONS = [
  { id: 1, type: "order" as const, title: "Commande ORD-001 en livraison", desc: "Votre table basse Bénin Wax est en route vers Cotonou.", time: "Il y a 2h", read: false },
  { id: 2, type: "message" as const, title: "Nouveau message de Kofi Akindélé", desc: "\"Bonjour, votre commande est en fabrication...\"", time: "Il y a 5h", read: false },
  { id: 3, type: "review" as const, title: "Avis demandé : Coussin Wax", desc: "Votre avis sur votre dernière commande serait précieux.", time: "Hier", read: true },
  { id: 4, type: "system" as const, title: "Brief #B-003 : proposition reçue", desc: "Ndèye Sarr a envoyé une proposition pour votre brief.", time: "Hier", read: true },
  { id: 5, type: "order" as const, title: "Commande ORD-002 livrée", desc: "Votre coussin Wax a été livré avec succès.", time: "Il y a 3j", read: true },
  { id: 6, type: "promo" as const, title: "Nouveaux artisans vérifiés", desc: "3 nouveaux artisans N3 ont rejoint la plateforme.", time: "Il y a 5j", read: true },
];

const TYPE_CONFIG = {
  order: { icon: Package, color: "var(--amber)", bg: "var(--amber-pale)" },
  message: { icon: MessageSquare, color: "var(--forest)", bg: "var(--forest-pale)" },
  review: { icon: Star, color: "var(--terracotta)", bg: "var(--terracotta-pale)" },
  system: { icon: ShieldCheck, color: "var(--amber-dark)", bg: "var(--amber-pale)" },
  promo: { icon: Bell, color: "var(--amber)", bg: "var(--amber-pale)" },
};

export function NotificationsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="dedco-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <button
        onClick={goBack}
        className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-4 inline-flex items-center gap-1 cursor-pointer"
      >
        ← Retour
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="display-lg font-bold text-[var(--text-1)]">Notifications</h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button className="dedco-btn dedco-btn-ghost dedco-btn-sm">
            <Check size={14} />
            Tout marquer lu
          </button>
        )}
      </div>

      <div className="space-y-2">
        {NOTIFICATIONS.map((notif, i) => {
          const cfg = TYPE_CONFIG[notif.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`dedco-card p-4 flex items-start gap-3 cursor-pointer hover:border-[var(--amber)] transition-colors ${!notif.read ? "border-l-2 border-l-[var(--amber)]" : ""}`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${!notif.read ? "font-semibold text-[var(--text-1)]" : "font-medium text-[var(--text-2)]"}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-[var(--text-3)] whitespace-nowrap flex-shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-[var(--text-3)] mt-0.5 line-clamp-2">{notif.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
