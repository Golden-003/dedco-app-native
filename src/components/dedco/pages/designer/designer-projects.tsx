"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data-expanded";
import {
  ChevronRight,
  Calendar,
  Wallet,
  User,
  FolderKanban,
  Sparkles,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react";

// ============================================================
// Types & mocks — projets designer du point de vue PRESTATAIRE
// ============================================================

type DesignerProjectStatus = "en_cours" | "en_revue" | "termine";

type DesignerProject = {
  id: string;
  title: string;
  clientName: string;
  clientAvatar: string;
  room: string;
  style: string;
  status: DesignerProjectStatus;
  progress: number;
  budget: number;
  paid: number;
  startDate: string;
  dueDate: string;
  nextMilestone: string;
  thumb: string;
};

const MOCK_PROJECTS: DesignerProject[] = [
  {
    id: "PD-001",
    title: "Aménagement Salon Tropical",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=80&q=85",
    room: "Salon",
    style: "Tropical moderne",
    status: "en_cours",
    progress: 60,
    budget: 380000,
    paid: 228000,
    startDate: "20 juin 2026",
    dueDate: "15 juil. 2026",
    nextMilestone: "Moodboard à valider",
    thumb: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "PD-002",
    title: "Chambre Éclectique",
    clientName: "Marc Adjovi",
    clientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&crop=faces&w=80&q=85",
    room: "Chambre",
    style: "Éclectique chaleureux",
    status: "en_cours",
    progress: 35,
    budget: 250000,
    paid: 125000,
    startDate: "25 juin 2026",
    dueDate: "30 juil. 2026",
    nextMilestone: "Plan d'implantation",
    thumb: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "PD-003",
    title: "Bureau Afro-contemporain",
    clientName: "Aïcha Monteiro",
    clientAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&crop=faces&w=80&q=85",
    room: "Bureau",
    style: "Minimaliste afro",
    status: "en_revue",
    progress: 95,
    budget: 420000,
    paid: 399000,
    startDate: "10 mai 2026",
    dueDate: "5 juil. 2026",
    nextMilestone: "Validation client",
    thumb: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "PD-004",
    title: "Entrée Zen Fidjrossè",
    clientName: "Bruno Dossou",
    clientAvatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=80&q=85",
    room: "Entrée",
    style: "Zen naturel",
    status: "termine",
    progress: 100,
    budget: 150000,
    paid: 150000,
    startDate: "10 sept. 2025",
    dueDate: "15 oct. 2025",
    nextMilestone: "Terminé",
    thumb: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "PD-005",
    title: "Salle à Manger Kente",
    clientName: "Rachida Bello",
    clientAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&crop=faces&w=80&q=85",
    room: "Salle à manger",
    style: "Afro-luxe traditionnel",
    status: "termine",
    progress: 100,
    budget: 520000,
    paid: 520000,
    startDate: "1 juin 2025",
    dueDate: "25 juil. 2025",
    nextMilestone: "Terminé",
    thumb: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=300&q=80",
  },
];

const COLUMNS: {
  id: DesignerProjectStatus;
  label: string;
  color: string;
  icon: typeof Sparkles;
}[] = [
  { id: "en_cours", label: "En cours", color: "var(--amber)", icon: Sparkles },
  { id: "en_revue", label: "En revue", color: "var(--terracotta)", icon: Eye },
  { id: "termine", label: "Terminés", color: "var(--forest)", icon: CheckCircle2 },
];

// ============================================================
// ProjectCard — carte compacte pour le kanban
// ============================================================

function ProjectCard({
  project,
  onClick,
}: {
  project: DesignerProject;
  onClick: () => void;
}) {
  const isUrgent = project.status === "en_cours" && project.progress < 50;
  return (
    <button
      onClick={onClick}
      className="w-full bg-[var(--bg-card)] rounded-lg p-3 text-left hover:shadow-md transition-shadow border border-[var(--border)] cursor-pointer"
    >
      <div className="flex items-center gap-2.5 mb-2 min-w-0">
        <img
          src={project.thumb}
          alt={project.title}
          className="w-11 h-11 rounded-md object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[var(--text-3)] font-numeric">{project.id}</p>
          <p className="font-display font-semibold text-sm line-clamp-1 text-[var(--text-1)]">
            {project.title}
          </p>
          <div className="flex items-center gap-1 text-xs text-[var(--text-2)] min-w-0">
            <User size={10} className="flex-shrink-0" />
            <span className="truncate">{project.clientName}</span>
          </div>
        </div>
      </div>
      {/* Milestone */}
      <div
        className="text-[11px] px-2 py-1 rounded-md mb-2 flex items-center gap-1.5 min-w-0"
        style={{
          backgroundColor: isUrgent ? "var(--terracotta-pale)" : "var(--amber-pale)",
          color: isUrgent ? "var(--terracotta)" : "var(--amber-dark)",
        }}
      >
        <Clock size={11} className="flex-shrink-0" />
        <span className="truncate">{project.nextMilestone}</span>
      </div>
      {/* Budget + échéance */}
      <div className="flex items-center justify-between mb-2 text-xs">
        <span className="font-numeric font-bold text-[var(--amber)]">
          {formatFCFA(project.paid)}
        </span>
        <span className="text-[var(--text-3)] flex items-center gap-1">
          <Calendar size={10} />
          <span className="font-numeric">{project.dueDate}</span>
        </span>
      </div>
      {/* Progress */}
      <div className="h-1.5 bg-[var(--bg-warm)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${project.progress}%`,
            backgroundColor:
              project.progress === 100
                ? "var(--forest)"
                : project.progress >= 80
                  ? "var(--forest)"
                  : isUrgent
                    ? "var(--terracotta)"
                    : "var(--amber)",
          }}
        />
      </div>
    </button>
  );
}

// ============================================================
// DesignerProjectsPage — kanban style (comme artisan)
// ============================================================

export function DesignerProjectsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [mobileCol, setMobileCol] = useState<DesignerProjectStatus>("en_cours");

  const activeCount = MOCK_PROJECTS.filter(
    (p) => p.status === "en_cours" || p.status === "en_revue",
  ).length;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* ── Header — pas de bouton 'Retour' (la sidebar gère) ── */}
      <header className="mb-6">
        <h1 className="display-lg mb-1">Projets en cours</h1>
        <p className="text-sm text-[var(--text-2)]">
          <span className="font-numeric font-semibold">{activeCount}</span> projets
          actifs · gérez vos missions de design
        </p>
      </header>

      {/* Mobile: tabs pour switcher de colonne */}
      <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto dedco-hide-scroll">
        {COLUMNS.map((c) => {
          const count = MOCK_PROJECTS.filter((p) => p.status === c.id).length;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => setMobileCol(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap border transition-all flex items-center gap-1.5 ${
                mobileCol === c.id
                  ? "bg-[var(--amber)] text-white border-[var(--amber)]"
                  : "bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-2)]"
              }`}
            >
              <Icon size={12} />
              {c.label}
              <span className="font-numeric opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Desktop: kanban 3 colonnes */}
      <div className="hidden lg:grid grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const items = MOCK_PROJECTS.filter((p) => p.status === col.id);
          const Icon = col.icon;
          return (
            <div
              key={col.id}
              className="bg-[var(--bg-warm)] rounded-xl p-3 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <h3
                  className="text-xs font-bold uppercase tracking-wide flex items-center gap-1.5"
                  style={{ color: col.color }}
                >
                  <Icon size={13} />
                  {col.label}
                </h3>
                <span className="text-xs font-numeric font-bold bg-[var(--bg-card)] px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2 flex-1">
                {items.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onClick={() =>
                      navigate({ page: "projet-designer-detail", projectId: p.id })
                    }
                  />
                ))}
                {items.length === 0 && (
                  <div className="text-center py-8">
                    <FolderKanban
                      size={24}
                      className="mx-auto text-[var(--text-3)] mb-1"
                    />
                    <p className="text-xs text-[var(--text-3)]">Aucun projet</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: colonne courante */}
      <div className="lg:hidden space-y-3">
        {MOCK_PROJECTS.filter((p) => p.status === mobileCol).map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            onClick={() =>
              navigate({ page: "projet-designer-detail", projectId: p.id })
            }
          />
        ))}
        {MOCK_PROJECTS.filter((p) => p.status === mobileCol).length === 0 && (
          <div className="dedco-card p-8 text-center">
            <FolderKanban size={32} className="mx-auto text-[var(--text-3)] mb-2" />
            <p className="text-sm text-[var(--text-2)] font-medium">
              Aucun projet dans cette catégorie
            </p>
          </div>
        )}
      </div>

      {/* ── Stats récap en bas ── */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="dedco-card p-3 sm:p-4 text-center">
          <Wallet size={16} className="mx-auto text-[var(--amber)] mb-1" />
          <p className="font-numeric text-base sm:text-lg font-bold text-[var(--text-1)]">
            {formatFCFA(
              MOCK_PROJECTS.reduce((sum, p) => sum + p.paid, 0),
            )}
          </p>
          <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wide">
            Encaissé
          </p>
        </div>
        <div className="dedco-card p-3 sm:p-4 text-center">
          <Clock size={16} className="mx-auto text-[var(--terracotta)] mb-1" />
          <p className="font-numeric text-base sm:text-lg font-bold text-[var(--text-1)]">
            {MOCK_PROJECTS.filter((p) => p.status === "en_cours").length}
          </p>
          <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wide">
            En cours
          </p>
        </div>
        <div className="dedco-card p-3 sm:p-4 text-center">
          <CheckCircle2
            size={16}
            className="mx-auto text-[var(--forest)] mb-1"
          />
          <p className="font-numeric text-base sm:text-lg font-bold text-[var(--text-1)]">
            {MOCK_PROJECTS.filter((p) => p.status === "termine").length}
          </p>
          <p className="text-[10px] text-[var(--text-3)] uppercase tracking-wide">
            Terminés
          </p>
        </div>
      </div>
    </div>
  );
}
