"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Clock,
  MessageSquare,
  AlertTriangle,
  Eye,
  ChevronRight,
  Sofa,
  BedDouble,
  Briefcase,
  CookingPot,
  DoorOpen,
  UtensilsCrossed,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { BRIEFS, formatFCFA } from "@/lib/dedco-data-expanded";
import type { Brief } from "@/lib/dedco-types";
import { BackButton } from "../layout";

// ============================================================
// Room icon mapping
// ============================================================

const ROOM_ICONS: Record<string, React.ReactNode> = {
  Salon: <Sofa size={14} />,
  Chambre: <BedDouble size={14} />,
  Bureau: <Briefcase size={14} />,
  Cuisine: <CookingPot size={14} />,
  Entrée: <DoorOpen size={14} />,
  "Salle à manger": <UtensilsCrossed size={14} />,
};

// ============================================================
// Status badge helpers
// ============================================================

const STATUS_CONFIG: Record<
  Brief["status"],
  { label: string; className: string }
> = {
  open: { label: "Ouvert", className: "dedco-badge-amber" },
  matched: { label: "Matché", className: "dedco-badge-forest" },
  closed: { label: "Fermé", className: "dedco-badge-gray" },
};

const URGENCY_CONFIG: Record<
  Brief["urgency"],
  { label: string; color: string; icon: React.ReactNode }
> = {
  urgent: {
    label: "Urgent",
    color: "text-terracotta",
    icon: <AlertTriangle size={14} />,
  },
  normal: {
    label: "Normal",
    color: "text-ink-mute",
    icon: <Clock size={14} />,
  },
  flexible: {
    label: "Flexible",
    color: "text-forest",
    icon: <Clock size={14} />,
  },
};

// ============================================================
// Tab type
// ============================================================

type Tab = "all" | "open" | "matched";

const TABS: { id: Tab; label: string; count: number }[] = [
  { id: "all", label: "Tous", count: 3 },
  { id: "open", label: "Ouverts", count: 2 },
  { id: "matched", label: "Matchés", count: 1 },
];

// ============================================================
// Card animation variants
// ============================================================

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ============================================================
// BriefCard — individual brief card
// ============================================================

function BriefCard({ brief, index }: { brief: Brief; index: number }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const status = STATUS_CONFIG[brief.status];
  const urgency = URGENCY_CONFIG[brief.urgency];
  const roomIcon = ROOM_ICONS[brief.room] || <Sofa size={14} />;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      layout
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="dedco-card p-5 hover:shadow-md transition-shadow"
    >
      {/* Top row — status + urgency */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`dedco-badge ${status.className}`}>{status.label}</span>
          {brief.urgency === "urgent" && (
            <span className={`dedco-badge dedco-badge-terra ${urgency.color}`}>
              {urgency.icon}
              {urgency.label}
            </span>
          )}
        </div>
        <span className="text-xs text-[var(--text-3)] font-numeric">
          {formatDate(brief.createdAt)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-base text-[var(--text-1)] mb-2 line-clamp-2">
        {brief.title}
      </h3>

      {/* Room + Style badges */}
      <div className="flex items-center gap-2 mb-3">
        <span className="dedco-badge dedco-badge-gray">
          {roomIcon}
          {brief.room}
        </span>
        <span className="dedco-badge dedco-badge-amber">
          {brief.style}
        </span>
      </div>

      {/* Budget */}
      <div className="mb-3">
        <span className="text-xs text-[var(--text-3)]">Budget</span>
        <p className="font-display font-bold text-[var(--amber)] text-sm font-numeric">
          {formatFCFA(brief.budget.min)} — {formatFCFA(brief.budget.max)}
        </p>
      </div>

      {/* Requirements as tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {brief.requirements.map((req) => (
          <span
            key={req}
            className="inline-flex items-center px-2 py-0.5 text-[11px] rounded-full bg-[var(--bg-warm)] text-[var(--text-2)]"
          >
            {req}
          </span>
        ))}
      </div>

      {/* Bottom — responses + CTA */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-2)]">
          <MessageSquare size={14} />
          <span className="font-numeric">{brief.responses}</span>
          <span className="text-xs">réponse{brief.responses > 1 ? "s" : ""}</span>
        </div>
        <button
          type="button"
          onClick={() => navigate({ page: "brief-detail", id: brief.id })}
          className="dedco-btn dedco-btn-primary dedco-btn-sm"
        >
          Voir
          <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================
// BriefListPage — main listing page
// ============================================================

export function BriefListPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const [activeTab, setActiveTab] = useState<Tab>("all");

  const filteredBriefs =
    activeTab === "all"
      ? BRIEFS
      : BRIEFS.filter((b) => b.status === activeTab);

  return (
    <div className="dedco-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <BackButton onBack={goBack} />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="display-lg mb-1">Mes Briefs</h1>
          <p className="text-sm text-[var(--text-2)]">
            Gérez vos demandes de projets d&apos;aménagement
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate({ page: "brief-create" })}
          className="dedco-btn dedco-btn-primary dedco-btn-sm flex-shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Créer un brief</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-[var(--bg-warm)] rounded-lg p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-[var(--bg-card)] text-[var(--text-1)] shadow-sm"
                : "text-[var(--text-2)] hover:text-[var(--text-1)]"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 text-xs font-numeric ${
                activeTab === tab.id ? "text-[var(--amber)]" : "text-[var(--text-3)]"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Brief cards list */}
      <AnimatePresence mode="popLayout">
        {filteredBriefs.length > 0 ? (
          <div className="grid gap-4">
            {filteredBriefs.map((brief, i) => (
              <BriefCard key={brief.id} brief={brief} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="dedco-card p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--bg-warm)] mx-auto flex items-center justify-center mb-4">
              <Eye size={28} className="text-[var(--text-3)]" />
            </div>
            <p className="font-display font-semibold text-[var(--text-2)] mb-1">
              Aucun brief trouvé
            </p>
            <p className="text-sm text-[var(--text-3)]">
              Aucun brief ne correspond à ce filtre.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
