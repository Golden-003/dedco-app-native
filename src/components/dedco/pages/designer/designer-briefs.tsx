"use client";

import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA, BRIEFS } from "@/lib/dedco-data-expanded";
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  DollarSign,
  MessageSquare,
  Search,
  Tag,
  Users,
} from "lucide-react";

// ============================================================
// Animation variants
// ============================================================

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ============================================================
// Helper functions
// ============================================================

const urgencyBadge = (urgency: string) => {
  switch (urgency) {
    case "urgent":
      return "dedco-badge dedco-badge-terra";
    case "normal":
      return "dedco-badge dedco-badge-amber";
    case "flexible":
      return "dedco-badge dedco-badge-forest";
    default:
      return "dedco-badge dedco-badge-gray";
  }
};

const urgencyLabel = (urgency: string) => {
  switch (urgency) {
    case "urgent":
      return "Urgent";
    case "normal":
      return "Normal";
    case "flexible":
      return "Flexible";
    default:
      return urgency;
  }
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ============================================================
// DesignerBriefsPage
// ============================================================

export function DesignerBriefsPage() {
  const navigate = useDedcoStore((s) => s.navigate);

  // Only show open briefs
  const openBriefs = BRIEFS.filter((b) => b.status === "open");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <motion.div variants={stagger} initial="initial" animate="animate">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="mb-6">
          <button
            className="dedco-btn dedco-btn-ghost dedco-btn-sm mb-3"
            onClick={() => navigate({ page: "designer-dashboard" })}
          >
            <ArrowLeft size={14} />
            Retour
          </button>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-1)]">
            Briefs disponibles
          </h1>
          <p className="text-[var(--text-2)] text-sm mt-1">
            Trouvez des projets qui correspondent à votre expertise
          </p>
        </motion.div>

        {/* ── Summary bar ── */}
        <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-2)]">
            <Search size={14} />
            <span>
              <span className="font-numeric font-medium text-[var(--text-1)]">
                {openBriefs.length}
              </span>{" "}
              briefs disponibles
            </span>
          </div>
          <div className="h-4 w-px bg-[var(--border)]" />
          <div className="flex items-center gap-2">
            <span className="dedco-badge dedco-badge-terra">
              {openBriefs.filter((b) => b.urgency === "urgent").length} urgent
            </span>
            <span className="dedco-badge dedco-badge-amber">
              {openBriefs.filter((b) => b.urgency === "normal").length} normal
            </span>
            <span className="dedco-badge dedco-badge-forest">
              {openBriefs.filter((b) => b.urgency === "flexible").length} flexible
            </span>
          </div>
        </motion.div>

        {/* ── Brief Cards ── */}
        <div className="space-y-4">
          {openBriefs.map((brief) => (
            <motion.div
              key={brief.id}
              variants={fadeUp}
              className="dedco-card p-5 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Left: Content */}
                <div className="flex-1 min-w-0">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-display text-lg font-semibold text-[var(--text-1)] leading-tight">
                      {brief.title}
                    </h3>
                    <span className={urgencyBadge(brief.urgency)}>
                      {urgencyLabel(brief.urgency)}
                    </span>
                  </div>

                  {/* Client & room */}
                  <div className="flex items-center gap-3 text-sm text-[var(--text-2)] mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {brief.clientName}
                    </span>
                    <span className="text-[var(--text-3)]">·</span>
                    <span>{brief.room}</span>
                    <span className="text-[var(--text-3)]">·</span>
                    <span className="dedco-badge dedco-badge-gray text-xs">
                      {brief.style}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-[var(--text-2)] leading-relaxed mb-3 line-clamp-2">
                    {brief.description}
                  </p>

                  {/* Requirements tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    <Tag size={12} className="text-[var(--text-3)]" />
                    {brief.requirements.map((req) => (
                      <span
                        key={req}
                        className="dedco-badge dedco-badge-gray text-xs"
                      >
                        {req}
                      </span>
                    ))}
                  </div>

                  {/* Meta: budget, date, responses */}
                  <div className="flex items-center gap-4 text-xs text-[var(--text-3)] flex-wrap">
                    <span className="flex items-center gap-1 font-numeric">
                      <DollarSign size={12} />
                      <span className="font-medium text-[var(--amber-dark)]">
                        {formatFCFA(brief.budget.min)} – {formatFCFA(brief.budget.max)}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      <span className="font-numeric">{formatDate(brief.createdAt)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      <span className="font-numeric">{brief.responses} réponses</span>
                    </span>
                  </div>
                </div>

                {/* Right: CTA */}
                <div className="flex sm:flex-col items-center gap-2 sm:pt-1">
                  <button
                    className="dedco-btn dedco-btn-primary dedco-btn-sm whitespace-nowrap"
                    onClick={() =>
                      navigate({ page: "brief-detail", id: brief.id })
                    }
                  >
                    Répondre au brief
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
