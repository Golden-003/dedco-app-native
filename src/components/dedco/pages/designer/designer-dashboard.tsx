"use client";

import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA, BRIEFS, PROJECTS } from "@/lib/dedco-data-expanded";
import {
  FolderKanban,
  FileText,
  TrendingUp,
  Star,
  ArrowRight,
  Clock,
  Plus,
  Calendar,
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
// DesignerDashboardPage
// ============================================================

export function DesignerDashboardPage() {
  const navigate = useDedcoStore((s) => s.navigate);

  // Filter projects for Ndèye Sarr (id: 1)
  const myProjects = PROJECTS.filter((p) => p.designerId === 1);
  const activeProjects = myProjects.filter((p) => p.status === "en_cours");

  // Latest 3 open briefs
  const recentBriefs = BRIEFS.filter((b) => b.status === "open").slice(0, 3);

  // Stats
  const stats = [
    {
      label: "Projets en cours",
      value: activeProjects.length,
      icon: FolderKanban,
      color: "bg-[var(--amber-pale)] text-[var(--amber-dark)]",
      borderColor: "border-[var(--amber)]",
    },
    {
      label: "Briefs disponibles",
      value: BRIEFS.filter((b) => b.status === "open").length,
      icon: FileText,
      color: "bg-[var(--forest-pale)] text-[var(--forest)]",
      borderColor: "border-[var(--forest)]",
    },
    {
      label: "Taux de réponse",
      value: "89%",
      icon: TrendingUp,
      color: "bg-[var(--terracotta-pale)] text-[var(--terracotta)]",
      borderColor: "border-[var(--terracotta)]",
    },
    {
      label: "Note",
      value: "4.9/5",
      icon: Star,
      color: "bg-[var(--amber-pale)] text-[var(--amber-dark)]",
      borderColor: "border-[var(--amber)]",
    },
  ];

  const statusBadge = (status: string) => {
    switch (status) {
      case "en_cours":
        return "dedco-badge dedco-badge-amber";
      case "terminé":
        return "dedco-badge dedco-badge-forest";
      case "en_attente":
        return "dedco-badge dedco-badge-gray";
      default:
        return "dedco-badge dedco-badge-gray";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "en_cours":
        return "En cours";
      case "terminé":
        return "Terminé";
      case "en_attente":
        return "En attente";
      default:
        return status;
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      <motion.div variants={stagger} initial="initial" animate="animate">
        {/* ── Welcome ── */}
        <motion.div variants={fadeUp} className="mb-8">
          <p className="text-[var(--text-3)] text-sm mb-1">Tableau de bord</p>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text-1)]">
            Bonjour Ndèye
          </h1>
          <p className="text-[var(--text-2)] text-sm mt-1">
            Voici un résumé de votre activité
          </p>
        </motion.div>

        {/* ── Stats Row ── */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          {stats.map((s) => (
            <div key={s.label} className="dedco-card p-4 sm:p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon size={20} />
                </div>
              </div>
              <p className="font-display text-xl sm:text-2xl font-semibold text-[var(--text-1)] font-numeric">
                {s.value}
              </p>
              <p className="text-xs text-[var(--text-3)] mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Active Projects + Recent Briefs ── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-[var(--text-1)]">
                Projets actifs
              </h2>
              <button
                className="dedco-btn dedco-btn-ghost dedco-btn-sm"
                onClick={() => navigate({ page: "designer-projects" })}
              >
                Voir tout
                <ArrowRight size={14} />
              </button>
            </div>

            {activeProjects.length === 0 ? (
              <div className="dedco-card p-8 text-center">
                <FolderKanban size={40} className="mx-auto text-[var(--text-3)] mb-3" />
                <p className="text-[var(--text-2)] text-sm">Aucun projet en cours</p>
                <button
                  className="dedco-btn dedco-btn-primary dedco-btn-sm mt-4"
                  onClick={() => navigate({ page: "designer-briefs" })}
                >
                  <Plus size={14} />
                  Trouver un brief
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeProjects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => navigate({ page: "projet-designer-detail", projectId: String(project.id) })}
                    className="dedco-card p-4 sm:p-5 cursor-pointer hover:border-[var(--amber)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-[var(--text-1)] truncate">
                            {project.title}
                          </h3>
                          <span className={statusBadge(project.status)}>
                            {statusLabel(project.status)}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--text-2)] mb-1">
                          {project.clientName} · {project.room}
                        </p>
                        <span className="dedco-badge dedco-badge-gray text-xs">
                          {project.style}
                        </span>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="font-numeric text-sm font-medium text-[var(--text-1)]">
                          {formatFCFA(project.paid)}
                        </p>
                        <p className="text-xs text-[var(--text-3)]">
                          / {formatFCFA(project.budget)}
                        </p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--text-3)]">
                          Progression
                        </span>
                        <span className="text-xs font-medium text-[var(--text-2)] font-numeric">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-[var(--amber)] rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Briefs */}
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-[var(--text-1)]">
                Briefs récents
              </h2>
              <button
                className="dedco-btn dedco-btn-ghost dedco-btn-sm"
                onClick={() => navigate({ page: "designer-briefs" })}
              >
                Voir tout
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {recentBriefs.map((brief) => (
                <div
                  key={brief.id}
                  className="dedco-card p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    navigate({ page: "designer-brief-recu", briefId: String(brief.id) })
                  }
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-[var(--text-1)] line-clamp-2 flex-1">
                      {brief.title}
                    </h3>
                    <span className={urgencyBadge(brief.urgency)}>
                      {brief.urgency === "urgent"
                        ? "Urgent"
                        : brief.urgency === "normal"
                          ? "Normal"
                          : "Flexible"}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-2)] mb-2">
                    {brief.clientName} · {brief.room}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--amber-dark)] font-numeric">
                      {formatFCFA(brief.budget.min)} – {formatFCFA(brief.budget.max)}
                    </span>
                    <span className="text-xs text-[var(--text-3)]">
                      {brief.responses} réponses
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Quick Actions ── */}
        <motion.div variants={fadeUp} className="mt-8">
          <h2 className="font-display text-lg font-semibold text-[var(--text-1)] mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              className="dedco-card p-4 text-left hover:shadow-md transition-shadow flex flex-col items-start gap-2 cursor-pointer"
              onClick={() => navigate({ page: "designer-briefs" })}
            >
              <FileText size={20} className="text-[var(--amber)]" />
              <span className="text-sm font-medium text-[var(--text-1)]">
                Voir les briefs
              </span>
              <span className="text-xs text-[var(--text-3)]">
                {BRIEFS.filter((b) => b.status === "open").length} disponibles
              </span>
            </button>

            <button
              className="dedco-card p-4 text-left hover:shadow-md transition-shadow flex flex-col items-start gap-2 cursor-pointer"
              onClick={() => navigate({ page: "designer-projects" })}
            >
              <FolderKanban size={20} className="text-[var(--forest)]" />
              <span className="text-sm font-medium text-[var(--text-1)]">
                Mes projets
              </span>
              <span className="text-xs text-[var(--text-3)]">
                {myProjects.length} total
              </span>
            </button>

            <button
              className="dedco-card p-4 text-left hover:shadow-md transition-shadow flex flex-col items-start gap-2 cursor-pointer"
              onClick={() => navigate({ page: "designer-profile" })}
            >
              <Star size={20} className="text-[var(--terracotta)]" />
              <span className="text-sm font-medium text-[var(--text-1)]">
                Mon profil
              </span>
              <span className="text-xs text-[var(--text-3)]">
                Note 4.9/5
              </span>
            </button>

            <button
              className="dedco-card p-4 text-left hover:shadow-md transition-shadow flex flex-col items-start gap-2 cursor-pointer"
              onClick={() => navigate({ page: "designer-settings" })}
            >
              <Clock size={20} className="text-[var(--text-2)]" />
              <span className="text-sm font-medium text-[var(--text-1)]">
                Paramètres
              </span>
              <span className="text-xs text-[var(--text-3)]">
                Disponibilité
              </span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
