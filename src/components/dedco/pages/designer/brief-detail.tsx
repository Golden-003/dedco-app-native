"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA, BRIEFS } from "@/lib/dedco-data-expanded";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Send,
  Star,
  Tag,
  User,
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
    month: "long",
    year: "numeric",
  });
}

// ============================================================
// BriefDetailPage
// ============================================================

export function BriefDetailPage({ briefId }: { briefId: number }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const brief = BRIEFS.find((b) => b.id === briefId);

  const [proposedBudget, setProposedBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!brief) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-[var(--text-3)]">Brief introuvable</p>
        <button
          className="dedco-btn dedco-btn-ghost dedco-btn-sm mt-4"
          onClick={() => navigate({ page: "designer-briefs" })}
        >
          <ArrowLeft size={14} />
          Retour aux briefs
        </button>
      </div>
    );
  }

  const handleSubmit = () => {
    // Mock submit
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <motion.div variants={stagger} initial="initial" animate="animate">
        {/* ── Header ── */}
        <motion.div variants={fadeUp} className="mb-6">
          <button
            className="dedco-btn dedco-btn-ghost dedco-btn-sm mb-3"
            onClick={() => navigate({ page: "designer-briefs" })}
          >
            <ArrowLeft size={14} />
            Retour aux briefs
          </button>
        </motion.div>

        {/* ── Brief Header ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6 mb-6">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h1 className="font-display text-xl sm:text-2xl font-semibold text-[var(--text-1)] leading-tight">
              {brief.title}
            </h1>
            <span className={urgencyBadge(brief.urgency)}>
              {urgencyLabel(brief.urgency)}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-[var(--text-2)] mb-4 flex-wrap">
            <span className="dedco-badge dedco-badge-gray text-xs">
              {brief.style}
            </span>
            <span className="text-[var(--text-3)]">·</span>
            <span>{brief.room}</span>
            <span className="text-[var(--text-3)]">·</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              <span className="font-numeric">{formatDate(brief.createdAt)}</span>
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--text-2)] leading-relaxed">
            {brief.description}
          </p>
        </motion.div>

        {/* ── Two column: Client + Budget/Requirements ── */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          {/* Client profile mini card */}
          <motion.div variants={fadeUp} className="dedco-card p-5">
            <h2 className="font-display text-base font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
              <User size={16} />
              Client
            </h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[var(--amber-pale)] flex items-center justify-center text-[var(--amber-dark)] font-semibold text-lg">
                {brief.clientName.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-[var(--text-1)]">
                  {brief.clientName}
                </p>
                <div className="flex items-center gap-1 text-xs text-[var(--text-3)]">
                  <MapPin size={12} />
                  Cotonou, Bénin
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Star size={14} className="text-[var(--amber)]" />
              <Star size={14} className="text-[var(--amber)]" />
              <Star size={14} className="text-[var(--amber)]" />
              <Star size={14} className="text-[var(--amber)]" />
              <Star size={14} className="star empty" />
              <span className="text-xs text-[var(--text-3)] ml-1 font-numeric">
                (4.2)
              </span>
            </div>
          </motion.div>

          {/* Budget range + Requirements */}
          <motion.div variants={fadeUp} className="dedco-card p-5">
            <h2 className="font-display text-base font-semibold text-[var(--text-1)] mb-4 flex items-center gap-2">
              <DollarSign size={16} />
              Budget & Exigences
            </h2>

            {/* Budget range */}
            <div className="mb-4">
              <p className="text-xs text-[var(--text-3)] mb-1">
                Fourchette budgétaire
              </p>
              <p className="font-display text-xl font-semibold text-[var(--amber-dark)] font-numeric">
                {formatFCFA(brief.budget.min)} – {formatFCFA(brief.budget.max)}
              </p>
            </div>

            {/* Requirements */}
            <div>
              <p className="text-xs text-[var(--text-3)] mb-2 flex items-center gap-1">
                <Tag size={12} />
                Exigences
              </p>
              <div className="flex flex-wrap gap-2">
                {brief.requirements.map((req) => (
                  <span
                    key={req}
                    className="dedco-badge dedco-badge-amber text-xs"
                  >
                    {req}
                  </span>
                ))}
              </div>
            </div>

            {/* Responses */}
            <div className="mt-4 pt-3 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-3)]">
                <span className="font-numeric font-medium text-[var(--text-2)]">
                  {brief.responses}
                </span>{" "}
                designer{brief.responses > 1 ? "s" : ""} ont déjà répondu
              </p>
            </div>
          </motion.div>
        </div>

        {/* ── Response Form ── */}
        <motion.div variants={fadeUp} className="dedco-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-[var(--text-1)] mb-4">
            Envoyer ma proposition
          </h2>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle2
                size={48}
                className="mx-auto text-[var(--forest)] mb-3"
              />
              <h3 className="font-display text-lg font-semibold text-[var(--text-1)] mb-1">
                Proposition envoyée !
              </h3>
              <p className="text-sm text-[var(--text-2)] mb-4">
                Le client recevra votre proposition et pourra vous contacter.
              </p>
              <button
                className="dedco-btn dedco-btn-primary dedco-btn-sm"
                onClick={() => navigate({ page: "designer-briefs" })}
              >
                Voir les autres briefs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Proposed budget */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                  Budget proposé (FCFA)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={proposedBudget}
                    onChange={(e) => setProposedBudget(e.target.value)}
                    placeholder="Ex: 350000"
                    className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent font-numeric"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-3)]">
                    FCFA
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                  Délai de réalisation
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="Ex: 3 semaines"
                  className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-1)] mb-1.5">
                  Message au client
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez votre approche, vos idées et pourquoi vous êtes le designer idéal pour ce projet..."
                  rows={5}
                  className="w-full px-4 py-2.5 text-sm border border-[var(--border)] rounded-lg bg-[var(--bg-card)] text-[var(--text-1)] placeholder:text-[var(--text-3)] focus:outline-none focus:ring-2 focus:ring-[var(--amber)] focus:border-transparent resize-none"
                />
              </div>

              <button
                className="dedco-btn dedco-btn-primary w-full justify-center"
                onClick={handleSubmit}
              >
                <Send size={16} />
                Envoyer ma proposition
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
