"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Package, MessageSquare, ShieldCheck, Star,
  CreditCard, Truck, AlertTriangle, Palette, Hammer, CheckCircle2, X,
  ChevronRight, Check,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { useNotificationStore, type NotificationType, type DedcoNotification } from "@/lib/notification-store";

// Configuration visuelle — pas de cercle générique, un accent coloré
const TYPE_CONFIG: Record<NotificationType, { icon: typeof Bell; accent: string; bg: string }> = {
  brief_artisan: { icon: Hammer, accent: "#BF793B", bg: "#FEF5E9" },
  brief_designer: { icon: Palette, accent: "#548C45", bg: "#E6F2E3" },
  project: { icon: Package, accent: "#BF793B", bg: "#FEF5E9" },
  message: { icon: MessageSquare, accent: "#548C45", bg: "#E6F2E3" },
  payment: { icon: CreditCard, accent: "#A7442D", bg: "#FAEAE6" },
  delivery: { icon: Truck, accent: "#BF793B", bg: "#FEF5E9" },
  review: { icon: Star, accent: "#A7442D", bg: "#FAEAE6" },
  system: { icon: ShieldCheck, accent: "#8B7E73", bg: "#F2EDE4" },
  litige: { icon: AlertTriangle, accent: "#A7442D", bg: "#FAEAE6" },
};

// Notifications qui méritent un fond coloré (pas toutes identiques)
const HIGHLIGHT_TYPES: NotificationType[] = ['payment', 'delivery', 'litige'];

function groupByDate(notifs: DedcoNotification[]): { label: string; items: DedcoNotification[] }[] {
  const groups: Record<string, DedcoNotification[]> = {};
  for (const n of notifs) {
    const time = n.time.toLowerCase();
    let group = 'Plus ancien';
    if (time.includes("instant") || time.includes("il y a")) group = "Aujourd'hui";
    else if (time.includes("hier")) group = "Hier";
    else if (time.includes("j") || time.includes("sem")) group = "Cette semaine";
    if (!groups[group]) groups[group] = [];
    groups[group].push(n);
  }
  const order = ["Aujourd'hui", "Hier", "Cette semaine", "Plus ancien"];
  return order.filter(g => groups[g]).map(g => ({ label: g, items: groups[g] }));
}

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
  const grouped = groupByDate(filtered);

  function handleClick(notifId: string, route?: { page: string; id?: string; briefId?: string; projectId?: string }) {
    markAsRead(notifId);
    if (route) {
      const store = useDedcoStore.getState();
      const page = route.page as any;
      if (route.briefId) store.navigate({ page, briefId: route.briefId } as any);
      else if (route.projectId) store.navigate({ page, projectId: route.projectId } as any);
      else if (route.id) store.navigate({ page, id: route.id } as any);
      else store.navigate({ page });
    }
  }

  return (
    <div className="dedco-fade-in max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Retour + titre compact */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[var(--text-2)] hover:bg-[var(--bg-warm)] transition-colors cursor-pointer"
            aria-label="Retour"
          >
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div>
            <h1 className="font-display font-bold text-xl text-[var(--text-1)]">Notifications</h1>
            <p className="text-xs text-[var(--text-3)]">
              {unreadCount > 0 ? (
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] dedco-pulse" />
                  {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                </span>
              ) : (
                "Tout est à jour"
              )}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="text-xs font-semibold text-[var(--amber-dark)] hover:text-[var(--amber)] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Check size={13} />
            Tout lire
          </button>
        )}
      </div>

      {/* Filtre — minimal, pas de gros boutons */}
      <div className="flex gap-1 mb-6">
        {[
          { key: "all" as const, label: "Tout" },
          { key: "unread" as const, label: `Non lu${unreadCount > 1 ? "s" : ""}` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === f.key
                ? "bg-[var(--text-1)] text-white"
                : "text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--bg-warm)]"
            }`}
          >
            {f.label}
            {f.key === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 font-numeric">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Liste groupée par date */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={32} className="mx-auto text-[var(--text-3)] mb-3" strokeWidth={1.5} />
          <p className="font-display font-medium text-sm text-[var(--text-2)]">
            {filter === "unread" ? "Vous êtes à jour." : "Rien ici pour le moment."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group, gi) => (
            <div key={group.label}>
              {/* Label de groupe — discret */}
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-3)] mb-2 px-1">
                {group.label}
              </p>

              {/* Items du groupe */}
              <div className="space-y-1">
                <AnimatePresence>
                  {group.items.map((notif, i) => {
                    const cfg = TYPE_CONFIG[notif.type];
                    const Icon = cfg.icon;
                    const isHighlight = HIGHLIGHT_TYPES.includes(notif.type) && !notif.read;
                    const isUnread = !notif.read;

                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: (gi * 0.05) + (i * 0.03), duration: 0.3 }}
                        className={`group relative rounded-xl transition-all cursor-pointer ${
                          isHighlight
                            ? "p-3.5"
                            : "p-3 hover:bg-[var(--bg-warm)]"
                        }`}
                        style={isHighlight ? { backgroundColor: cfg.bg } : undefined}
                        onClick={() => handleClick(notif.id, notif.route)}
                      >
                        <div className="flex items-start gap-3">
                          {/* Accent coloré — pas un cercle générique */}
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              backgroundColor: isHighlight ? 'rgba(255,255,255,0.6)' : cfg.bg,
                              color: cfg.accent,
                            }}
                          >
                            <Icon size={15} strokeWidth={2} />
                          </div>

                          {/* Contenu */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {/* Point non-lu — petit, discret */}
                                {isUnread && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                                    style={{ backgroundColor: cfg.accent }}
                                  />
                                )}
                                <p className={`text-sm leading-snug ${isUnread ? "font-semibold text-[var(--text-1)]" : "font-medium text-[var(--text-2)]"}`}>
                                  {notif.title}
                                </p>
                              </div>
                              <span className="text-[10px] text-[var(--text-3)] whitespace-nowrap flex-shrink-0 mt-0.5">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--text-3)] mt-0.5 line-clamp-2 ml-3">
                              {notif.desc}
                            </p>
                          </div>

                          {/* Actions — apparaissent au hover */}
                          <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isUnread && (
                              <button
                                onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                                className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-3)] hover:text-[var(--forest)] transition-colors"
                                title="Marquer comme lu"
                              >
                                <CheckCircle2 size={13} />
                              </button>
                            )}
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                              className="w-6 h-6 rounded-md flex items-center justify-center text-[var(--text-3)] hover:text-[var(--terracotta)] transition-colors"
                              title="Supprimer"
                            >
                              <X size={13} />
                            </button>
                          </div>

                          {/* Chevron pour les notifications cliquables */}
                          {notif.route && (
                            <ChevronRight
                              size={14}
                              className="text-[var(--text-3)] flex-shrink-0 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
