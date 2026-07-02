"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA, PROJECTS } from "@/lib/dedco-data-expanded";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Eye,
  FolderKanban,
  Wallet,
  CheckCircle2,
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

type TabKey = "en_cours" | "terminé" | "en_attente";

const TABS: { key: TabKey; label: string; count: number }[] = [
  { key: "en_cours", label: "En cours", count: 2 },
  { key: "terminé", label: "Terminés", count: 5 },
  { key: "en_attente", label: "En attente", count: 1 },
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

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ============================================================
// DesignerProjectsPage
// ============================================================

export function DesignerProjectsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }
  const [activeTab, setActiveTab] = useState<TabKey>("en_cours");

  // All projects for designer 1 (Ndèye Sarr)
  const myProjects = PROJECTS.filter((p) => p.designerId === 1);
  const filtered = myProjects.filter((p) => p.status === activeTab);

  // For demo, generate extra terminated projects
  const terminatedProjects = [
    {
      id: 101,
      title: "Salon Tropical Akpakpa",
      clientName: "Adèle Mensah",
      designerName: "Ndèye Sarr",
      designerId: 1,
      status: "terminé" as const,
      progress: 100,
      budget: 380000,
      paid: 380000,
      startDate: "2023-11-15",
      endDate: "2023-12-20",
      images: [
        "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=800&q=85",
      ],
      room: "Salon",
      style: "Tropical luxe",
    },
    {
      id: 102,
      title: "Chambre Éclectique Cadjèhoun",
      clientName: "Sylvie Vodougnon",
      designerName: "Ndèye Sarr",
      designerId: 1,
      status: "terminé" as const,
      progress: 100,
      budget: 250000,
      paid: 250000,
      startDate: "2023-12-01",
      endDate: "2024-01-05",
      images: [
        "https://images.unsplash.com/photo-1655276602527-ca7c0c44d6de?auto=format&fit=crop&w=800&q=85",
      ],
      room: "Chambre",
      style: "Éclectique chaleureux",
    },
    {
      id: 103,
      title: "Entrée Zen Fidjrossè",
      clientName: "Bruno Dossou",
      designerName: "Ndèye Sarr",
      designerId: 1,
      status: "terminé" as const,
      progress: 100,
      budget: 150000,
      paid: 150000,
      startDate: "2023-09-10",
      endDate: "2023-10-15",
      images: [
        "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=800&q=85",
      ],
      room: "Entrée",
      style: "Zen / Naturel",
    },
    {
      id: 104,
      title: "Bureau Moderne Houéyiho",
      clientName: "Christelle Agbo",
      designerName: "Ndèye Sarr",
      designerId: 1,
      status: "terminé" as const,
      progress: 100,
      budget: 420000,
      paid: 420000,
      startDate: "2023-07-20",
      endDate: "2023-09-01",
      images: [
        "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?auto=format&fit=crop&w=800&q=85",
      ],
      room: "Bureau",
      style: "Afro-contemporain minimaliste",
    },
    {
      id: 105,
      title: "Salle à Manger Kente Akwa",
      clientName: "Rachida Bello",
      designerName: "Ndèye Sarr",
      designerId: 1,
      status: "terminé" as const,
      progress: 100,
      budget: 520000,
      paid: 520000,
      startDate: "2023-06-01",
      endDate: "2023-07-25",
      images: [
        "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=85",
      ],
      room: "Salle à manger",
      style: "Afro-luxe traditionnel",
    },
  ];

  const displayProjects =
    activeTab === "terminé"
      ? terminatedProjects
      : filtered;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
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
            Mes projets
          </h1>
          <p className="text-[var(--text-2)] text-sm mt-1">
            Gérez vos projets de design d'intérieur
          </p>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div variants={fadeUp} className="mb-6">
          <div className="flex gap-1 bg-[var(--bg-warm)] p-1 rounded-lg w-fit">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                  activeTab === tab.key
                    ? "bg-[var(--bg-card)] text-[var(--text-1)] shadow-sm"
                    : "text-[var(--text-3)] hover:text-[var(--text-2)]"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 text-xs font-numeric">({tab.count})</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Project Cards ── */}
        {displayProjects.length === 0 ? (
          <motion.div variants={fadeUp} className="dedco-card p-12 text-center">
            <FolderKanban size={48} className="mx-auto text-[var(--text-3)] mb-4" />
            <h3 className="font-display text-lg font-semibold text-[var(--text-1)] mb-2">
              Aucun projet
            </h3>
            <p className="text-sm text-[var(--text-3)] max-w-sm mx-auto">
              {
                activeTab === "en_cours"
                  ? "Vous n'avez pas de projets en cours actuellement."
                  : activeTab === "terminé"
                    ? "Vous n'avez pas encore de projets terminés."
                    : "Aucun projet en attente."
              }
            </p>
            {activeTab === "en_cours" && (
              <button
                className="dedco-btn dedco-btn-primary dedco-btn-sm mt-4"
                onClick={() => navigate({ page: "designer-briefs" })}
              >
                Explorer les briefs
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                variants={fadeUp}
                className="dedco-card overflow-hidden flex flex-col"
              >
                {/* Image */}
                {project.images[0] && (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 right-3 ${statusBadge(project.status)}`}
                    >
                      {statusLabel(project.status)}
                    </span>
                  </div>
                )}

                <div className="p-4 flex flex-col flex-1">
                  {/* Title & Style */}
                  <h3 className="font-semibold text-[var(--text-1)] mb-1">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-[var(--text-2)]">
                      {project.clientName}
                    </span>
                    <span className="text-[var(--text-3)]">·</span>
                    <span className="text-sm text-[var(--text-2)]">
                      {project.room}
                    </span>
                  </div>
                  <span className="dedco-badge dedco-badge-gray mb-3 w-fit">
                    {project.style}
                  </span>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--text-3)]">
                        Progression
                      </span>
                      <span className="text-xs font-medium text-[var(--text-2)] font-numeric">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="h-full bg-[var(--amber)] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Budget & Dates */}
                  <div className="flex items-center justify-between text-xs text-[var(--text-3)] mb-1">
                    <div className="flex items-center gap-1">
                      <Wallet size={12} />
                      <span className="font-numeric">
                        {formatFCFA(project.paid)}
                      </span>
                      <span>/</span>
                      <span className="font-numeric">
                        {formatFCFA(project.budget)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--text-3)]">
                    <Calendar size={12} />
                    <span className="font-numeric">{formatDate(project.startDate)}</span>
                    {project.endDate && (
                      <>
                        <span>–</span>
                        <span className="font-numeric">
                          {formatDate(project.endDate)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* View project button */}
                  <button onClick={() => navigate({ page: "projet-designer-detail", projectId: String(project.id) })} className="dedco-btn dedco-btn-primary dedco-btn-sm mt-4 w-full justify-center">
                    <Eye size={14} />
                    Voir le projet
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Toast inline */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 dedco-card px-4 py-3 shadow-lg flex items-center gap-2" style={{ backgroundColor: "var(--forest-pale)", borderColor: "var(--forest)" }}>
          <CheckCircle2 size={16} className="text-[var(--forest)] flex-shrink-0" />
          <p className="text-sm text-[var(--text-1)]">{toast}</p>
        </div>
      )}
    </div>
  );
}
