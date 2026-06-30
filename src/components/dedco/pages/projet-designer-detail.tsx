"use client";

import { useState } from "react";
import {
  CheckCircle2, Clock, FileText, Download, MessageSquare, Send,
  ChevronRight, AlertTriangle, ShieldCheck, MapPin, Calendar,
  RefreshCw, Eye, PencilLine, Image as ImageIcon, Palette, Layout,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";

// ============================================================
// MOCK — Projets designer par ID
// (chaque projectId PD-xxx a son propre mock)
// ============================================================

type DesignerLivrable = {
  id: string;
  name: string;
  type: "plan" | "moodboard" | "sourcing" | "3d" | "palette";
  date: string;
  status: "available" | "pending" | "revision";
  url?: string;
  preview?: string;
};

type DesignerRevision = {
  id: string;
  round: number;
  requestedAt: string;
  motif: string;
  status: "done" | "in_progress" | "pending";
  deliveredAt?: string;
};

type DesignerProjectMock = {
  id: string;
  briefId: string;
  scope: "prototype" | "standard" | "premium";
  status: "KICKOFF_SCHEDULED" | "IN_PROGRESS" | "DELIVERABLE_READY" | "DELIVERED_PENDING_VALIDATION" | "COMPLETED";
  title: string;
  image: string;
  clientName: string;
  clientAvatar: string;
  designerName: string;
  designerAvatar: string;
  designerCity: string;
  // Prestation
  prestationLabel: string;
  prix: number;
  montantPaye: number; // 100% payé au début
  solde: number;
  livrablesPromis: string[];
  revisionsIncluses: number;
  // Détails brief
  piece: string;
  style: string;
  superficie: string;
  budgetConseil: { min: number; max: number };
  // Rendez-vous de cadrage
  rdvCadrage?: { date: string; heure: string; mode: "visio" | "presentiel" | "tel" };
  // Calendrier
  dateDemarrage: string;
  dateLivraison: string;
  // Données pour onglets
  livrables: DesignerLivrable[];
  revisions: DesignerRevision[];
};

const MOCK_PROJECTS: Record<string, DesignerProjectMock> = {
  "PD-001": {
    id: "PD-001",
    briefId: "BRF-DES-001",
    scope: "standard",
    status: "KICKOFF_SCHEDULED",
    title: "Aménagement salon moderne",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerName: "Aminata Design",
    designerAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerCity: "Cotonou",
    prestationLabel: "Standard — Plan d'aménagement complet",
    prix: 350000,
    montantPaye: 175000,
    solde: 175000,
    livrablesPromis: ["Plan d'aménagement 2D/3D", "Palette couleurs", "Liste de sourcing", "Conseils d'installation"],
    revisionsIncluses: 2,
    piece: "Salon",
    style: "Moderne épuré",
    superficie: "32 m²",
    budgetConseil: { min: 800000, max: 1500000 },
    rdvCadrage: { date: "28 juin 2026", heure: "10 h 00", mode: "visio" },
    dateDemarrage: "1 juillet 2026",
    dateLivraison: "15 août 2026",
    livrables: [],
    revisions: [],
  },
  "PD-002": {
    id: "PD-002",
    briefId: "BRF-DES-002",
    scope: "standard",
    status: "DELIVERABLE_READY",
    title: "Réaménagement bureau domicile",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerName: "Rachelle Interior",
    designerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerCity: "Porto-Novo",
    prestationLabel: "Standard — Plan d'aménagement complet",
    prix: 250000,
    montantPaye: 125000,
    solde: 125000,
    livrablesPromis: ["Plan 2D", "Palette", "Sourcing mobilier"],
    revisionsIncluses: 2,
    piece: "Bureau",
    style: "Naturel & chaleureux",
    superficie: "14 m²",
    budgetConseil: { min: 400000, max: 800000 },
    dateDemarrage: "10 juin 2026",
    dateLivraison: "25 juin 2026",
    livrables: [
      { id: "L1", name: "Moodboard bureau.pdf", type: "moodboard", date: "15 juin", status: "available", preview: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&w=300&q=80" },
      { id: "L2", name: "Plan d'aménagement 2D.pdf", type: "plan", date: "18 juin", status: "available", preview: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80" },
      { id: "L3", name: "Palette couleurs.pdf", type: "palette", date: "20 juin", status: "available", preview: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=300&q=80" },
      { id: "L4", name: "Sélection mobilier.pdf", type: "sourcing", date: "23 juin", status: "available", preview: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=300&q=80" },
    ],
    revisions: [
      { id: "R1", round: 1, requestedAt: "20 juin", motif: "Palette trop froide, ajouter touches terracotta", status: "done", deliveredAt: "22 juin" },
    ],
  },
  "PD-010": {
    id: "PD-010",
    briefId: "BRF-DES-010",
    scope: "prototype",
    status: "COMPLETED",
    title: "Plan d'aménagement salon",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerName: "Aminata Design",
    designerAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerCity: "Cotonou",
    prestationLabel: "Standard — Plan d'aménagement complet",
    prix: 250000,
    montantPaye: 250000,
    solde: 0,
    livrablesPromis: ["Plan 2D", "Palette", "Sourcing"],
    revisionsIncluses: 2,
    piece: "Salon",
    style: "Moderne épuré",
    superficie: "30 m²",
    budgetConseil: { min: 700000, max: 1200000 },
    dateDemarrage: "5 mai 2026",
    dateLivraison: "1 juin 2026",
    livrables: [
      { id: "L1", name: "Moodboard salon.pdf", type: "moodboard", date: "10 mai", status: "available", preview: "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&w=300&q=80" },
      { id: "L2", name: "Plan 2D salon.pdf", type: "plan", date: "15 mai", status: "available", preview: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80" },
      { id: "L3", name: "Palette salon.pdf", type: "palette", date: "20 mai", status: "available", preview: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=300&q=80" },
    ],
    revisions: [
      { id: "R1", round: 1, requestedAt: "22 mai", motif: "Préférer un canapé d'angle", status: "done", deliveredAt: "25 mai" },
    ],
  },
};

// ============================================================
// STATUS CONFIG (designer projects — distinct du statut artisan)
// ============================================================

const STATUS_CONFIG: Record<DesignerProjectMock["status"], { label: string; color: string; bgColor: string; isUrgent?: boolean }> = {
  KICKOFF_SCHEDULED: { label: "Rendez-vous de cadrage planifié", color: "#548C45", bgColor: "#E6F2E3" },
  IN_PROGRESS: { label: "Designer en travail", color: "#BF793B", bgColor: "#FEF5E9" },
  DELIVERABLE_READY: { label: "Livrable disponible", color: "#BF793B", bgColor: "#FEF5E9", isUrgent: true },
  DELIVERED_PENDING_VALIDATION: { label: "Livraison à valider", color: "#A6442E", bgColor: "#FAEAE6", isUrgent: true },
  COMPLETED: { label: "Prestation terminée", color: "#548C45", bgColor: "#E6F2E3" },
};

const SCOPE_LABELS: Record<DesignerProjectMock["scope"], string> = {
  prototype: "Prototype",
  standard: "Standard",
  premium: "Premium",
};

const LIVRABLE_ICONS: Record<DesignerLivrable["type"], typeof FileText> = {
  plan: Layout,
  moodboard: ImageIcon,
  sourcing: FileText,
  "3d": Layout,
  palette: Palette,
};

// ============================================================
// PAGE: Projet Designer Détail
// ============================================================

export function ProjetDesignerDetailPage({ projectId }: { projectId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const project = MOCK_PROJECTS[projectId] || MOCK_PROJECTS["PD-001"];
  const [activeTab, setActiveTab] = useState<"livrables" | "details" | "revisions" | "messages">("livrables");

  // États locaux pour actions inline (pas de boutons morts)
  const [revisions, setRevisions] = useState(project.revisions);
  const [messages, setMessages] = useState<{ from: "designer" | "me"; text: string; time: string }[]>([
    { from: "designer", text: "Bonjour ! J'ai bien reçu votre brief. Pour le rendez-vous de cadrage, préparez vos photos d'inspiration si possible.", time: "il y a 2h" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionMotif, setRevisionMotif] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const statusConfig = STATUS_CONFIG[project.status];

  // Helper : afficher un toast
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // Helper : envoyer un message
  function sendMessage() {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { from: "me", text: newMessage.trim(), time: "à l'instant" }]);
    setNewMessage("");
  }

  // Helper : demander une révision
  function submitRevision() {
    if (!revisionMotif.trim()) return;
    const nextRound = revisions.length + 1;
    setRevisions(prev => [...prev, {
      id: `R${nextRound}`,
      round: nextRound,
      requestedAt: "22 juin",
      motif: revisionMotif.trim(),
      status: "in_progress",
    }]);
    setRevisionMotif("");
    setShowRevisionForm(false);
    showToast("Révision demandée. Le designer a 3 jours pour répondre.");
  }

  // Helper : télécharger un livrable (factice)
  function downloadLivrable(name: string) {
    showToast(`Téléchargement de « ${name} » démarré.`);
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate({ page: "client-projets" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> Mes projets
      </button>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full" style={{ color: statusConfig.color, backgroundColor: statusConfig.bgColor }}>
              {statusConfig.label}
            </span>
            <span className="dedco-badge dedco-badge-forest">{SCOPE_LABELS[project.scope]}</span>
            {statusConfig.isUrgent && <span className="dedco-badge dedco-badge-terra">Action requise</span>}
          </div>
          <h1 className="display-lg">{project.title}</h1>
          <p className="text-sm text-[var(--text-2)] font-numeric">{project.id} · Brief {project.briefId}</p>
        </div>
        <img src={project.image} alt={project.title} className="w-20 h-20 rounded-lg object-cover" />
      </div>

      {/* Designer partenaire */}
      <div className="dedco-card p-4 mb-4 flex items-center gap-3">
        <img src={project.designerAvatar} alt={project.designerName} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <p className="font-display font-semibold">{project.designerName}</p>
          <p className="text-xs text-[var(--text-3)] flex items-center gap-1"><MapPin size={11} /> {project.designerCity}</p>
        </div>
        <button
          onClick={() => navigate({ page: "messages", conversationId: `proj-${project.id}` })}
          className="dedco-btn dedco-btn-ghost dedco-btn-sm"
        >
          <MessageSquare size={14} /> Contacter
        </button>
      </div>

      {/* Alerte rendez-vous de cadrage si KICKOFF_SCHEDULED */}
      {project.status === "KICKOFF_SCHEDULED" && project.rdvCadrage && (
        <div className="dedco-card p-4 mb-4 border-l-4" style={{ borderLeftColor: "var(--forest)" }}>
          <div className="flex items-start gap-3">
            <Calendar size={20} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-display font-semibold text-sm">Rendez-vous de cadrage planifié</p>
              <p className="text-sm text-[var(--text-2)] mt-1">
                {project.rdvCadrage.date} à <span className="font-numeric">{project.rdvCadrage.heure}</span> ·{" "}
                {project.rdvCadrage.mode === "visio" && "Visio"}
                {project.rdvCadrage.mode === "presentiel" && "Présentiel"}
                {project.rdvCadrage.mode === "tel" && "Téléphone"}
              </p>
              <p className="text-xs text-[var(--text-3)] mt-1">Préparez vos inspirations et contraintes (budget, surface, usages) pour gagner du temps.</p>
            </div>
          </div>
        </div>
      )}

      {/* Bandeau récapitulatif — visible dans TOUS les onglets */}
      <div className="dedco-card p-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <img src={project.image} alt={project.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full" style={{ color: statusConfig.color, backgroundColor: statusConfig.bgColor }}>
                {statusConfig.label}
              </span>
              {statusConfig.isUrgent && <span className="dedco-badge dedco-badge-terra">Action requise</span>}
            </div>
            <h3 className="font-display font-semibold text-sm truncate text-[var(--text-1)]">{project.title}</h3>
            <p className="text-xs text-[var(--text-3)] font-numeric">{project.id} · {project.designerName}</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Honoraires</p>
              <p className="font-numeric font-bold text-[var(--text-1)]">{formatFCFA(project.prix)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Payé</p>
              <p className="font-numeric font-semibold text-[var(--forest)]">{formatFCFA(project.montantPaye)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Livraison</p>
              <p className="font-numeric text-[var(--text-2)]">{project.dateLivraison}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto dedco-hide-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: "livrables", label: `Livrables${project.livrables.length > 0 ? ` (${project.livrables.length})` : ""}` },
          { id: "details", label: "Détails" },
          { id: "revisions", label: `Révisions${project.revisions.length > 0 ? ` (${project.revisions.length})` : ""}` },
          { id: "messages", label: "Messagerie" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t.id ? "bg-[var(--text-1)] text-white" : "bg-white border border-[var(--border)] text-[var(--text-2)]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Livrables */}
      {activeTab === "livrables" && (
        <div className="dedco-card p-5 mb-4">
          <h2 className="font-display font-bold mb-4">Livrables du designer</h2>

          {project.livrables.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="mx-auto text-[var(--text-3)] mb-3" />
              <p className="text-sm text-[var(--text-2)]">Le designer prépare vos livrables.</p>
              <p className="text-xs text-[var(--text-3)] mt-1">
                Livraison prévue le <span className="font-numeric">{project.dateLivraison}</span>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.livrables.map((l) => {
                const Icon = LIVRABLE_ICONS[l.type];
                return (
                  <div key={l.id} className="p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)]">
                    {l.preview && <img src={l.preview} alt={l.name} className="w-full h-28 object-cover rounded-md mb-2" />}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-md bg-[var(--bg-warm)] flex items-center justify-center text-[var(--amber)] flex-shrink-0">
                        <Icon size={14} />
                      </div>
                      <p className="text-sm font-medium truncate flex-1">{l.name}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[11px] text-[var(--text-3)] font-numeric">Mis en ligne le {l.date}</span>
                      <button
                        onClick={() => downloadLivrable(l.name)}
                        className="dedco-btn dedco-btn-ghost dedco-btn-sm"
                        title="Télécharger"
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {project.livrables.length > 0 && project.status === "DELIVERABLE_READY" && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: "var(--forest-pale)" }}>
              <p className="text-xs text-[var(--forest)] mb-2">
                <CheckCircle2 size={12} className="inline mr-1" />
                Tous les livrables sont prêts. Validez la livraison pour libérer le paiement au designer.
              </p>
              <button onClick={() => navigate({ page: "projet-livraison", projectId: project.id })} className="dedco-btn dedco-btn-primary dedco-btn-sm">
                <CheckCircle2 size={14} /> Valider la livraison
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Détails */}
      {activeTab === "details" && (
        <div className="dedco-card p-5 mb-4">
          <h2 className="font-display font-bold mb-4">Détails de la prestation</h2>
          <dl className="space-y-3 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prestation</dt>
                <dd className="text-[var(--text-1)]">{project.prestationLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Honoraires TTC</dt>
                <dd className="font-numeric font-semibold text-[var(--amber)]">{formatFCFA(project.prix)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Paiement sécurisé</dt>
                <dd className="font-numeric text-[var(--forest)]">{formatFCFA(project.montantPaye)}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Solde à la livraison</dt>
                <dd className="font-numeric text-[var(--terracotta)]">{formatFCFA(project.solde)}</dd>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)]">
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Pièce concernée</dt>
              <dd className="flex items-center gap-1"><Layout size={12} className="text-[var(--forest)]" /> {project.piece}</dd>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Style souhaité</dt>
                <dd className="flex items-center gap-1"><Palette size={12} className="text-[var(--forest)]" /> {project.style}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Superficie</dt>
                <dd className="font-numeric">{project.superficie}</dd>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)]">
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Livrables promis</dt>
              <dd>
                <ul className="space-y-1">
                  {project.livrablesPromis.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-sm text-[var(--text-2)]">
                      <CheckCircle2 size={12} className="text-[var(--forest)] flex-shrink-0" /> {l}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Démarrage</dt>
                <dd className="flex items-center gap-1 font-numeric"><Calendar size={12} className="text-[var(--amber)]" /> {project.dateDemarrage}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Livraison prévue</dt>
                <dd className="flex items-center gap-1 font-numeric"><Calendar size={12} className="text-[var(--amber)]" /> {project.dateLivraison}</dd>
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--border)]">
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Budget conseil (achats)</dt>
              <dd className="font-numeric text-[var(--text-2)]">{formatFCFA(project.budgetConseil.min)} – {formatFCFA(project.budgetConseil.max)}</dd>
              <p className="text-xs text-[var(--text-3)] mt-1">Estimation des achats recommandés par le designer. Vous restez libre d'acheter ou non.</p>
            </div>
          </dl>
        </div>
      )}

      {/* Tab: Révisions */}
      {activeTab === "revisions" && (
        <div className="dedco-card p-5 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold">Révisions</h2>
            <span className="text-xs text-[var(--text-3)] font-numeric">
              {project.revisionsIncluses - project.revisions.filter(r => r.status === "done").length} restante(s) sur {project.revisionsIncluses}
            </span>
          </div>

          {project.revisions.length === 0 ? (
            <div className="text-center py-8">
              <RefreshCw size={28} className="mx-auto text-[var(--text-3)] mb-3" />
              <p className="text-sm text-[var(--text-2)]">Aucune révision demandée pour le moment.</p>
              <p className="text-xs text-[var(--text-3)] mt-1">{project.revisionsIncluses} révisions incluses dans votre prestation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {project.revisions.map((r) => (
                <div key={r.id} className="p-3 border border-[var(--border)] rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-warm)] text-[var(--text-2)]">
                      Tour {r.round}
                    </span>
                    {r.status === "done" && <span className="text-xs text-[var(--forest)] flex items-center gap-1"><CheckCircle2 size={12} /> Livrée le <span className="font-numeric">{r.deliveredAt}</span></span>}
                    {r.status === "in_progress" && <span className="text-xs text-[var(--amber-dark)] flex items-center gap-1"><Clock size={12} /> En cours</span>}
                    {r.status === "pending" && <span className="text-xs text-[var(--terracotta)] flex items-center gap-1"><Clock size={12} /> En attente</span>}
                  </div>
                  <p className="text-sm text-[var(--text-2)]">{r.motif}</p>
                  <p className="text-xs text-[var(--text-3)] mt-1 font-numeric">Demandée le {r.requestedAt}</p>
                </div>
              ))}
            </div>
          )}

          {project.livrables.length > 0 && project.status !== "COMPLETED" && (
            <>
              {!showRevisionForm ? (
                <button
                  onClick={() => setShowRevisionForm(true)}
                  className="dedco-btn dedco-btn-secondary dedco-btn-sm mt-4 w-full"
                >
                  <PencilLine size={14} /> Demander une révision
                </button>
              ) : (
                <div className="mt-4 p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-card)]">
                  <p className="text-xs font-semibold mb-2">Motif de la révision</p>
                  <textarea
                    value={revisionMotif}
                    onChange={(e) => setRevisionMotif(e.target.value)}
                    placeholder="Ex. : la palette est trop froide, ajouter des touches terracotta"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowRevisionForm(false); setRevisionMotif(""); }}
                      className="dedco-btn dedco-btn-ghost dedco-btn-sm flex-1"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={submitRevision}
                      disabled={!revisionMotif.trim()}
                      className="dedco-btn dedco-btn-primary dedco-btn-sm flex-1"
                    >
                      <Send size={14} /> Envoyer
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Tab: Messages */}
      {activeTab === "messages" && (
        <div className="dedco-card p-5">
          <h2 className="font-display font-bold mb-4">Messagerie projet</h2>
          <div className="space-y-3 mb-4 min-h-[200px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === "me" ? "flex-row-reverse" : ""}`}>
                {m.from === "designer" && <img src={project.designerAvatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />}
                <div className={`max-w-[75%] p-3 rounded-md ${m.from === "me" ? "bg-[var(--forest)] text-white" : "bg-[var(--bg-warm)]"}`}>
                  <p className="text-xs text-[var(--text-3)] mb-1">{m.from === "designer" ? project.designerName : "Vous"} · {m.time}</p>
                  <p className="text-sm">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
              placeholder="Votre message..."
              className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="dedco-btn dedco-btn-primary dedco-btn-sm"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Actions selon statut — tous fonctionnels */}
      <div className="flex gap-3 flex-wrap mt-4">
        {project.status === "DELIVERABLE_READY" && (
          <button onClick={() => navigate({ page: "projet-livraison", projectId: project.id })} className="dedco-btn dedco-btn-primary">
            <CheckCircle2 size={16} /> Valider la livraison
          </button>
        )}
        {project.status === "KICKOFF_SCHEDULED" && (
          <button
            onClick={() => setActiveTab("details")}
            className="dedco-btn dedco-btn-primary"
          >
            <Eye size={16} /> Préparer le rendez-vous
          </button>
        )}
        <button
          onClick={() => navigate({ page: "litige", id: `REC-${project.id}` })}
          className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]"
        >
          <AlertTriangle size={16} /> Ouvrir un litige
        </button>
        <button
          onClick={() => navigate({ page: "invoice", orderId: project.id })}
          className="dedco-btn dedco-btn-ghost"
        >
          <FileText size={16} /> Voir la facture
        </button>
      </div>

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
