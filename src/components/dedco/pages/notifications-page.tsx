"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Package, MessageSquare, ShieldCheck, Star, Check,
  CreditCard, Truck, AlertTriangle, Palette, Hammer, CheckCircle2, X,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { useNotificationStore, type NotificationType } from "@/lib/notification-store";

const TYPE_CONFIG: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  brief_artisan: { icon: Hammer, color: "var(--amber-dark)", bg: "var(--amber-pale)" },
  brief_designer: { icon: Palette, color: "var(--forest)", bg: "var(--forest-pale)" },
  project: { icon: Package, color: "var(--amber-dark)", bg: "var(--amber-pale)" },
  message: { icon: MessageSquare, color: "var(--forest)", bg: "var(--forest-pale)" },
  payment: { icon: CreditCard, color: "var(--terracotta)", bg: "var(--terracotta-pale)" },
  delivery: { icon: Truck, color: "var(--amber)", bg: "var(--amber-pale)" },
  review: { icon: Star, color: "var(--terracotta)", bg: "var(--terracotta-pale)" },
  system: { icon: ShieldCheck, color: "var(--amber-dark)", bg: "var(--amber-pale)" },
  litige: { icon: AlertTriangle, color: "var(--terracotta)", bg: "var(--terracotta-pale)" },
};

export function NotificationsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const deleteNotification = useNotificationStore((s) => s.deleteNotification);

  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread" ? notifications.filter(n => !n.read) : notifications;

  function handleClick(notifId: string, route?: { page: string; id?: string; briefId?: string; projectId?: string }) {
    markAsRead(notifId);
    if (route) {
      // Navigation via le store principal
      const store = useDedcoStore.getState();
      const page = route.page as any;
      if (route.briefId) store.navigate({ page, briefId: route.briefId } as any);
      else if (route.projectId) store.navigate({ page, projectId: route.projectId } as any);
      else if (route.id) store.navigate({ page, id: route.id } as any);
      else store.navigate({ page });
    }
  }

  return (
    <div className="dedco-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <button
        onClick={goBack}
        className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] transition-colors mb-4 inline-flex items-center gap-1 cursor-pointer"
      >
        ← Retour
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="display-lg font-bold text-[var(--text-1)]">Notifications</h1>
          <p className="text-sm text-[var(--text-3)] mt-1">
            {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}` : "Tout est à jour"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllAsRead()} className="dedco-btn dedco-btn-ghost dedco-btn-sm">
            <Check size={14} />
            Tout marquer lu
          </button>
        )}
      </div>

      {/* Filtre */}
      <div className="flex gap-2 mb-5 overflow-x-auto dedco-hide-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { key: "all" as const, label: `Toutes (${notifications.length})` },
          { key: "unread" as const, label: `Non lues (${unreadCount})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all ${
              filter === f.key
                ? "bg-[var(--amber)] text-white shadow-sm"
                : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-2)] hover:bg-[var(--bg-warm)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="dedco-card p-10 text-center">
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "var(--bg-warm)" }}>
            <Bell size={24} className="text-[var(--text-3)]" />
          </div>
          <p className="font-display font-semibold text-base mb-1 text-[var(--text-1)]">
            {filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
          </p>
          <p className="text-sm text-[var(--text-2)]">
            {filter === "unread" ? "Vous êtes à jour." : "Les notifications apparaîtront ici."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((notif, i) => {
            const cfg = TYPE_CONFIG[notif.type];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`dedco-card p-4 flex items-start gap-3 transition-colors group ${!notif.read ? "border-l-2 border-l-[var(--amber)]" : ""}`}
              >
                {/* Icône */}
                <button
                  onClick={() => handleClick(notif.id, notif.route)}
                  className="flex-1 flex items-start gap-3 text-left cursor-pointer"
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
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[var(--forest)] hover:bg-[var(--forest-pale)] transition-colors"
                      title="Marquer comme lu"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-3)] hover:text-[var(--terracotta)] hover:bg-[var(--terracotta-pale)] transition-colors"
                    title="Supprimer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
