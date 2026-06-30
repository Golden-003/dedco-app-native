"use client";

import { useState } from "react";
import {
  CheckCircle2, Clock, Package, Truck, MapPin, Camera, AlertTriangle,
  ShieldCheck, FileText, Download, MessageSquare, Send, X, Check,
  ChevronRight, Hammer, Ruler, Calendar, Edit3,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";
import { PROJET_ARTISAN_STATUS, JALON_LABELS, type ProjetArtisanStatus, type JalonType } from "@/lib/dedco-status";

// ============================================================
// MOCK — Projets artisan par ID (chaque projectId a son propre mock)
// ============================================================

type JalonMock = {
  type: JalonType;
  done: boolean;
  current?: boolean;
  date: string;
  progress?: number;
  photos?: string[];
  commentaire?: string;
  dimensionsConfirmees?: string;
};

type ModificationMock = {
  id: string;
  type: "materiaux" | "dimensions" | "prix" | "delai";
  element: string;
  valeurInitiale: string;
  nouvelleValeur: string;
  motif: string;
  impactPrix: number;
  impactDelai: string;
  date: string;
  status: "CHANGE_PENDING_CLIENT" | "CHANGE_ACCEPTED" | "CHANGE_REJECTED";
};

type ArtisanProjectMock = {
  id: string;
  briefId: string;
  status: ProjetArtisanStatus;
  title: string;
  image: string;
  clientName: string;
  clientAvatar: string;
  artisanName: string;
  artisanAvatar: string;
  artisanCity: string;
  // Détails du devis
  prixInitial: number;
  prixFinal: number;
  montantPaye: number;
  materiaux: string;
  dimensions: string;
  delaiInitial: string;
  delaiFinal: string;
  quantite: number;
  // Livraison
  livraisonAdresse: string;
  livraisonPhone: string;
  // Jalons
  jalons: JalonMock[];
  // Modifications
  modifications: ModificationMock[];
  // Liaison proposition (pour le bouton "Payer maintenant")
  proposalId?: string;
};

const MOCK_PROJECTS: Record<string, ArtisanProjectMock> = {
  "PA-001": {
    id: "PA-001",
    briefId: "BRF-ART-001",
    status: "CHANGE_REQUEST_PENDING",
    title: "Fauteuil Sahel Tressé",
    image: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanName: "Amara Dossou",
    artisanAvatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Porto-Novo",
    prixInitial: 245000,
    prixFinal: 260000,
    montantPaye: 122500,
    materiaux: "Rotin naturel, tissu coton, structure bois",
    dimensions: "85 x 90 x 75 cm",
    delaiInitial: "3 semaines",
    delaiFinal: "3 semaines + 4 jours",
    quantite: 1,
    livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
    livraisonPhone: "+229 01 97 45 23 10",
    jalons: [
      {
        type: "PREPARATION",
        done: true,
        date: "21 juin 2026",
        photos: ["https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=400&q=80"],
        commentaire: "Matériaux confirmés : rotin naturel de qualité supérieure. Bois iroko pour la structure. Début fabrication prévu le 24 juin.",
        dimensionsConfirmees: "85 x 90 x 75 cm",
      },
      { type: "IN_PRODUCTION", done: false, current: true, date: "En cours", progress: 60, photos: [], commentaire: "" },
      { type: "READY_FOR_DELIVERY", done: false, date: "Prévu vers le 10 juillet" },
      { type: "DELIVERY", done: false, date: "Prévu vers le 14 juillet" },
    ],
    modifications: [
      {
        id: "MOD-001",
        type: "materiaux",
        element: "Matériau principal",
        valeurInitiale: "Rotin naturel",
        nouvelleValeur: "Rotin tressé renforcé",
        motif: "Rupture de stock fournisseur, qualité supérieure disponible",
        impactPrix: 15000,
        impactDelai: "4 jours",
        date: "22 juin 2026",
        status: "CHANGE_PENDING_CLIENT",
      },
    ],
  },
  "PA-002": {
    id: "PA-002",
    briefId: "BRF-ART-002",
    status: "DELIVERED_PENDING_CONFIRMATION",
    title: "Lampe Abat-jour Bogolan",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanName: "Fatou Loko",
    artisanAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Ouidah",
    prixInitial: 68000,
    prixFinal: 68000,
    montantPaye: 34000,
    materiaux: "Tissu bogolan, structure métal, douille porcelaine",
    dimensions: "Ø 35 x 45 cm",
    delaiInitial: "10 jours",
    delaiFinal: "10 jours",
    quantite: 1,
    livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
    livraisonPhone: "+229 01 97 45 23 10",
    jalons: [
      { type: "PREPARATION", done: true, date: "10 juin 2026", commentaire: "Tissu bogolan teint main, structure soudée." },
      { type: "IN_PRODUCTION", done: true, date: "12-15 juin 2026", progress: 100, photos: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=400&q=80"] },
      { type: "READY_FOR_DELIVERY", done: true, date: "16 juin 2026", photos: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=400&q=80"], commentaire: "Abat-jour monté, électrique testée." },
      { type: "DELIVERY", done: false, current: true, date: "Livré le 21 juin — en attente de confirmation" },
    ],
    modifications: [],
  },
  "PA-004": {
    id: "PA-004",
    briefId: "BRF-ART-004",
    status: "IN_PRODUCTION",
    title: "Miroir Encadré Raffia",
    image: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanName: "Brice Gogan",
    artisanAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Cotonou",
    prixInitial: 95000,
    prixFinal: 95000,
    montantPaye: 47500,
    materiaux: "Raffia tressé, miroir biseauté, contreplaqué",
    dimensions: "Ø 60 cm",
    delaiInitial: "12 jours",
    delaiFinal: "12 jours",
    quantite: 1,
    livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
    livraisonPhone: "+229 01 97 45 23 10",
    jalons: [
      { type: "PREPARATION", done: true, date: "18 juin 2026", commentaire: "Raffia teint, miroir biseauté commandé." },
      { type: "IN_PRODUCTION", done: false, current: true, date: "En cours", progress: 35, photos: [], commentaire: "Tressage en cours." },
      { type: "READY_FOR_DELIVERY", done: false, date: "Prévu vers le 3 juillet" },
      { type: "DELIVERY", done: false, date: "Prévu vers le 5 juillet" },
    ],
    modifications: [],
  },
  "PA-005": {
    id: "PA-005",
    briefId: "BRF-ART-005",
    status: "IN_PRODUCTION",
    title: "Tabouret Tamtam x2",
    image: "https://images.unsplash.com/photo-1566921895456-1cee6-8cee6f646?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanName: "Brice Gogan",
    artisanAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Cotonou",
    prixInitial: 76000,
    prixFinal: 76000,
    montantPaye: 38000,
    materiaux: "Bois iroko, tissu wax, mousse haute densité",
    dimensions: "Ø 40 x 45 cm (x2)",
    delaiInitial: "15 jours",
    delaiFinal: "15 jours",
    quantite: 2,
    livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
    livraisonPhone: "+229 01 97 45 23 10",
    jalons: [
      { type: "PREPARATION", done: true, date: "16 juin 2026", commentaire: "Bois iroko coupé, wax sélectionné." },
      { type: "IN_PRODUCTION", done: false, current: true, date: "En cours", progress: 50, photos: [], commentaire: "Assemblage des structures, garnissage en cours." },
      { type: "READY_FOR_DELIVERY", done: false, date: "Prévu vers le 8 juillet" },
      { type: "DELIVERY", done: false, date: "Prévu vers le 12 juillet" },
    ],
    modifications: [],
  },
  "PA-010": {
    id: "PA-010",
    briefId: "BRF-ART-010",
    status: "COMPLETED",
    title: "Canapé personnalisé Cotonou",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanName: "Atelier Kossi",
    artisanAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Cotonou",
    prixInitial: 420000,
    prixFinal: 420000,
    montantPaye: 420000,
    materiaux: "Bois massif iroko, tissu coton wax, mousse haute résilience",
    dimensions: "220 x 95 x 85 cm",
    delaiInitial: "4 semaines",
    delaiFinal: "4 semaines",
    quantite: 1,
    livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
    livraisonPhone: "+229 01 97 45 23 10",
    jalons: [
      { type: "PREPARATION", done: true, date: "5 mai 2026", commentaire: "Bois iroko sélectionné, tissu wax teint." },
      { type: "IN_PRODUCTION", done: true, date: "8-22 mai 2026", progress: 100, photos: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80"] },
      { type: "READY_FOR_DELIVERY", done: true, date: "25 mai 2026", photos: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80"], commentaire: "Canapé terminé, finitions contrôlées." },
      { type: "DELIVERY", done: true, date: "10 juin 2026", commentaire: "Livré et installé chez le client." },
    ],
    modifications: [],
  },
};

// ============================================================
// PAGE: Projet Artisan Détail — tous les boutons fonctionnels
// ============================================================

export function ProjetArtisanDetailPage({ projectId }: { projectId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const project = MOCK_PROJECTS[projectId] || MOCK_PROJECTS["PA-001"];

  // Onglet automatique si modification en attente
  const initialTab = project.modifications.some(m => m.status === "CHANGE_PENDING_CLIENT") ? "modifications" : "avancement";
  const [currentTab, setCurrentTab] = useState<"avancement" | "details" | "modifications" | "messages">(initialTab);

  // États locaux pour actions inline (pas de boutons morts)
  const [modStatuses, setModStatuses] = useState<Record<string, "CHANGE_PENDING_CLIENT" | "CHANGE_ACCEPTED" | "CHANGE_REJECTED">>(
    Object.fromEntries(project.modifications.map(m => [m.id, m.status]))
  );
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [messages, setMessages] = useState<{ from: "artisan" | "me"; text: string; time: string }[]>([
    { from: "artisan", text: "Bonjour ! J'ai commencé le travail. Voici une photo d'avancement.", time: "il y a 2h" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const statusConfig = PROJET_ARTISAN_STATUS[project.status];

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

  // Statut affiché (surcharge locale si action effectuée)
  const displayedStatus: ProjetArtisanStatus = deliveryConfirmed ? "DELIVERED_CONFIRMED" : project.status;
  const displayedStatusConfig = PROJET_ARTISAN_STATUS[displayedStatus];

  return (
    <div className="p-6 max-w-4xl mx-auto relative">
      <button onClick={() => navigate({ page: "client-projets" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> Mes projets
      </button>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full" style={{ color: displayedStatusConfig.color, backgroundColor: displayedStatusConfig.bgColor }}>
              {displayedStatusConfig.label}
            </span>
            {displayedStatusConfig.isUrgent && <span className="dedco-badge dedco-badge-terra">Urgent</span>}
          </div>
          <h1 className="display-lg">{project.title}</h1>
          <p className="text-sm text-[var(--text-2)] font-numeric">{project.id} · Brief {project.briefId}</p>
        </div>
        <img src={project.image} alt={project.title} className="w-20 h-20 rounded-lg object-cover" />
      </div>

      {/* Artisan partenaire */}
      <div className="dedco-card p-4 mb-4 flex items-center gap-3">
        <img src={project.artisanAvatar} alt={project.artisanName} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <p className="font-display font-semibold">{project.artisanName}</p>
          <p className="text-xs text-[var(--text-3)] flex items-center gap-1"><MapPin size={11} /> {project.artisanCity}</p>
        </div>
        <button
          onClick={() => navigate({ page: "messages", conversationId: `proj-${project.id}` })}
          className="dedco-btn dedco-btn-ghost dedco-btn-sm"
        >
          <MessageSquare size={14} /> Contacter
        </button>
      </div>

      {/* Bandeau récapitulatif — visible dans TOUS les onglets */}
      <div className="dedco-card p-4 mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Image + titre */}
          <img src={project.image} alt={project.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full" style={{ color: displayedStatusConfig.color, backgroundColor: displayedStatusConfig.bgColor }}>
                {displayedStatusConfig.label}
              </span>
              {displayedStatusConfig.isUrgent && <span className="dedco-badge dedco-badge-terra">Urgent</span>}
            </div>
            <h3 className="font-display font-semibold text-sm truncate text-[var(--text-1)]">{project.title}</h3>
            <p className="text-xs text-[var(--text-3)] font-numeric">{project.id} · {project.artisanName}</p>
          </div>
          {/* Stats clés */}
          <div className="flex items-center gap-4 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Montant</p>
              <p className="font-numeric font-bold text-[var(--text-1)]">{formatFCFA(project.prixFinal)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Payé</p>
              <p className="font-numeric font-semibold text-[var(--forest)]">{formatFCFA(project.montantPaye)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-3)]">Échéance</p>
              <p className="font-numeric text-[var(--text-2)]">{project.delaiFinal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto dedco-hide-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: "avancement", label: "Avancement" },
          { id: "details", label: "Détails" },
          { id: "modifications", label: `Modifications${project.modifications.filter(m => modStatuses[m.id] === "CHANGE_PENDING_CLIENT").length > 0 ? ` (${project.modifications.filter(m => modStatuses[m.id] === "CHANGE_PENDING_CLIENT").length})` : ""}` },
          { id: "messages", label: "Messagerie" },
        ].map((t) => (
          <button key={t.id} onClick={() => setCurrentTab(t.id as typeof currentTab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${currentTab === t.id ? "bg-[var(--ink)] text-white" : "bg-white border border-[var(--border)] text-[var(--text-2)]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Avancement (Jalons) */}
      {currentTab === "avancement" && (
        <div className="dedco-card p-5 mb-4">
          <h2 className="font-display font-bold mb-5">Jalons de fabrication</h2>
          <div className="space-y-4">
            {project.jalons.map((jalon, i) => {
              const jalonInfo = JALON_LABELS[jalon.type];
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      jalon.done ? "bg-[var(--forest)] text-white" : jalon.current ? "bg-[var(--amber)] text-white" : "bg-[var(--bg-warm)] text-[var(--text-3)]"
                    }`}>
                      {jalon.done ? <CheckCircle2 size={18} /> : jalon.type === "IN_PRODUCTION" ? <Package size={18} /> : jalon.type === "DELIVERY" ? <Truck size={18} /> : <Hammer size={18} />}
                    </div>
                    {i < project.jalons.length - 1 && <div className={`w-0.5 h-16 ${jalon.done ? "bg-[var(--forest)]" : "bg-[var(--border)]"}`} />}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className={`text-sm font-semibold ${jalon.done ? "" : jalon.current ? "" : "text-[var(--text-3)]"}`}>{jalonInfo.label}</p>
                    <p className="text-xs text-[var(--text-3)] mb-1">{jalonInfo.description}</p>
                    <p className="text-xs text-[var(--text-3)] font-numeric">{jalon.date}</p>

                    {jalon.current && jalon.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[var(--text-2)]">Progression</span>
                          <span className="font-numeric font-semibold text-[var(--amber)]">{jalon.progress}%</span>
                        </div>
                        <div className="h-2 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--amber)] rounded-full" style={{ width: `${jalon.progress}%` }} />
                        </div>
                      </div>
                    )}

                    {jalon.photos && jalon.photos.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {jalon.photos.map((photo, pi) => (
                          <img key={pi} src={photo} alt={`Jalon ${i+1} photo ${pi+1}`} className="w-20 h-20 rounded-md object-cover border border-[var(--border)]" />
                        ))}
                      </div>
                    )}

                    {jalon.commentaire && (
                      <p className="text-xs text-[var(--text-2)] mt-2 p-2 bg-[var(--bg-warm)] rounded-md">{jalon.commentaire}</p>
                    )}

                    {jalon.dimensionsConfirmees && (
                      <p className="text-xs text-[var(--text-3)] mt-1 flex items-center gap-1"><Ruler size={11} /> Dimensions confirmées : <span className="font-numeric">{jalon.dimensionsConfirmees}</span></p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Détails */}
      {currentTab === "details" && (
        <div className="dedco-card p-5 mb-4">
          <h2 className="font-display font-bold mb-4">Détails du projet</h2>
          <dl className="space-y-3 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prix initial</dt><dd className="font-numeric font-semibold">{formatFCFA(project.prixInitial)}</dd></div>
              <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prix final</dt><dd className="font-numeric font-semibold text-[var(--amber)]">{formatFCFA(project.prixFinal)}</dd></div>
              <div className="sm:col-span-2"><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Paiement sécurisé</dt><dd className="font-numeric text-[var(--forest)]">{formatFCFA(project.montantPaye)} — réglé via Mobile Money</dd></div>
              
            </div>
            <div className="pt-3 border-t border-[var(--border)]">
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Matériaux</dt><dd className="flex items-center gap-1"><Hammer size={12} className="text-[var(--amber)]" /> {project.materiaux}</dd>
            </div>
            <div>
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Dimensions</dt><dd className="flex items-center gap-1 font-numeric"><Ruler size={12} className="text-[var(--amber)]" /> {project.dimensions}</dd>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Délai initial</dt><dd className="flex items-center gap-1"><Calendar size={12} className="text-[var(--amber)]" /> {project.delaiInitial}</dd></div>
              <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Quantité</dt><dd className="font-numeric">{project.quantite}</dd></div>
            </div>
            <div className="pt-3 border-t border-[var(--border)]">
              <dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Livraison</dt>
              <dd className="text-[var(--text-2)]">{project.livraisonAdresse}</dd>
              <dd className="text-[var(--text-3)] font-numeric text-xs mt-0.5">{project.livraisonPhone}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Tab: Modifications */}
      {currentTab === "modifications" && (
        <div className="space-y-4">
          {project.modifications.length === 0 ? (
            <div className="dedco-card p-8 text-center">
              <p className="text-sm text-[var(--text-3)]">Aucune modification demandée pour ce projet.</p>
            </div>
          ) : (
            project.modifications.map((mod) => {
              const status = modStatuses[mod.id] || mod.status;
              const isPending = status === "CHANGE_PENDING_CLIENT";
              return (
                <div key={mod.id} className="dedco-card p-5 border-l-4" style={{ borderLeftColor: isPending ? "var(--terracotta)" : status === "CHANGE_ACCEPTED" ? "var(--forest)" : "var(--text-3)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-sm">Modification proposée par {project.artisanName}</h3>
                    <span className={`dedco-badge ${isPending ? "dedco-badge-terra" : status === "CHANGE_ACCEPTED" ? "dedco-badge-forest" : "dedco-badge-ghost"}`}>
                      {isPending ? "En attente de validation" : status === "CHANGE_ACCEPTED" ? "Acceptée" : "Refusée"}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-[var(--bg-warm)] rounded-md">
                      <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Valeur initiale</p>
                      <p className="text-sm font-medium">{mod.valeurInitiale}</p>
                    </div>
                    <div className="p-3 rounded-md" style={{ backgroundColor: "var(--amber-pale)" }}>
                      <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Nouvelle valeur</p>
                      <p className="text-sm font-medium text-[var(--amber-dark)]">{mod.nouvelleValeur}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
                    <div>
                      <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Impact prix</p>
                      <p className="font-numeric font-semibold text-[var(--terracotta)]">+{formatFCFA(mod.impactPrix)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Impact délai</p>
                      <p className="font-numeric">{mod.impactDelai}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Motif</p>
                    <p className="text-sm p-2 bg-[var(--bg-warm)] rounded-md">{mod.motif}</p>
                  </div>

                  {isPending ? (
                    <>
                      <div className="p-3 rounded-md mb-4" style={{ backgroundColor: "var(--terracotta-pale)" }}>
                        <p className="text-xs text-[var(--terracotta)] flex items-center gap-1">
                          <Clock size={12} /> Réponse attendue avant le 26 juin 2026.
                          Sans réponse, la modification est refusée automatiquement.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setModStatuses(prev => ({ ...prev, [mod.id]: "CHANGE_REJECTED" }));
                            showToast("Modification refusée. L'artisan conserve les valeurs initiales.");
                          }}
                          className="dedco-btn dedco-btn-ghost flex-1"
                        >
                          <X size={14} /> Refuser
                        </button>
                        <button
                          onClick={() => {
                            setModStatuses(prev => ({ ...prev, [mod.id]: "CHANGE_ACCEPTED" }));
                            showToast("Modification acceptée. Nouveau prix et délai appliqués.");
                          }}
                          className="dedco-btn dedco-btn-primary flex-1"
                        >
                          <Check size={14} /> Accepter la modification
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-[var(--text-3)] italic">
                      Décision enregistrée le 22 juin 2026.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Messages */}
      {currentTab === "messages" && (
        <div className="dedco-card p-5">
          <h2 className="font-display font-bold mb-4">Messagerie projet</h2>
          <div className="space-y-3 mb-4 min-h-[200px]">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === "me" ? "flex-row-reverse" : ""}`}>
                {m.from === "artisan" && <img src={project.artisanAvatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0" />}
                <div className={`max-w-[75%] p-3 rounded-md ${m.from === "me" ? "bg-[var(--amber)] text-white" : "bg-[var(--bg-warm)]"}`}>
                  <p className="text-xs text-[var(--text-3)] mb-1">{m.from === "artisan" ? project.artisanName : "Vous"} · {m.time}</p>
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
              className="dedco-btn dedco-btn-primary dedco-btn-sm"
              disabled={!newMessage.trim()}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Actions selon statut — tous fonctionnels */}
      <div className="flex gap-3 flex-wrap mt-4">
        {project.status === "DELIVERED_PENDING_CONFIRMATION" && !deliveryConfirmed && (
          <button
            onClick={() => {
              setDeliveryConfirmed(true);
              showToast("Réception confirmée. Le solde sera libéré sous 48 h.");
            }}
            className="dedco-btn dedco-btn-primary"
          >
            <CheckCircle2 size={16} /> Confirmer la réception
          </button>
        )}
        {project.status === "AWAITING_DEPOSIT" && project.proposalId && (
          <button
            onClick={() => navigate({ page: "projet-paiement-artisan", proposalId: project.proposalId! })}
            className="dedco-btn dedco-btn-primary"
          >
            <CheckCircle2 size={16} /> Payer maintenant
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
