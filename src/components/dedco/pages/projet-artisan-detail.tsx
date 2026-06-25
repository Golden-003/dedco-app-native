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
// MOCK — Projet artisan détaillé
// ============================================================

const MOCK_PROJECT = {
  id: "PA-001",
  briefId: "BRF-ART-001",
  status: "IN_PRODUCTION" as ProjetArtisanStatus,
  title: "Fauteuil Sahel Tressé",
  image: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=600&q=80",
  clientName: "Sophie Kossou",
  clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
  artisanName: "Amara Dossou",
  artisanAvatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=120&q=80",
  artisanCity: "Porto-Novo",
  // Détails du devis
  prixInitial: 245000,
  prixFinal: 245000,
  acompte: 122500,
  solde: 122500,
  materiaux: "Rotin naturel, tissu coton, structure bois",
  dimensions: "85 x 90 x 75 cm",
  delaiInitial: "3 semaines",
  delaiFinal: "3 semaines",
  quantite: 1,
  // Livraison
  livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
  livraisonPhone: "+229 01 97 45 23 10",
  // Jalons
  jalons: [
    {
      type: "PREPARATION" as JalonType,
      done: true,
      date: "21 juin 2026",
      photos: ["https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=400&q=80"],
      commentaire: "Matériaux confirmés : rotin naturel de qualité supérieure. Bois iroko pour la structure. Début fabrication prévu le 24 juin.",
      dimensionsConfirmees: "85 x 90 x 75 cm",
    },
    {
      type: "IN_PRODUCTION" as JalonType,
      done: false,
      current: true,
      date: "En cours",
      progress: 60,
      photos: [],
      commentaire: "",
    },
    {
      type: "READY_FOR_DELIVERY" as JalonType,
      done: false,
      date: "Prévu vers le 10 juillet",
    },
    {
      type: "DELIVERY" as JalonType,
      done: false,
      date: "Prévu vers le 12 juillet",
    },
  ],
  // Modifications
  modifications: [
    {
      id: "MOD-001",
      type: "materiaux" as const,
      element: "Matériau principal",
      valeurInitiale: "Rotin naturel",
      nouvelleValeur: "Rotin tressé renforcé",
      motif: "Rupture de stock fournisseur, qualité supérieure disponible",
      impactPrix: 15000,
      impactDelai: "0 jour",
      date: "22 juin 2026",
      status: "CHANGE_PENDING_CLIENT" as const,
    },
  ],
};

// ============================================================
// PAGE: Projet Artisan Détail
// ============================================================

export function ProjetArtisanDetailPage({ projectId }: { projectId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const project = MOCK_PROJECT;
  const [activeTab, setActiveTab] = useState<"avancement" | "details" | "modifications" | "messages">("avancement");
  const statusConfig = PROJET_ARTISAN_STATUS[project.status];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate({ page: "client-projets" })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> Mes projets
      </button>

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full" style={{ color: statusConfig.color, backgroundColor: statusConfig.bgColor }}>
              {statusConfig.label}
            </span>
            {statusConfig.isUrgent && <span className="dedco-badge dedco-badge-terra">Urgent</span>}
          </div>
          <h1 className="display-lg">{project.title}</h1>
          <p className="text-sm text-[var(--text-2)] font-numeric">{project.id} · Brief {project.briefId}</p>
        </div>
        <img src={project.image} alt={project.title} className="w-20 h-20 rounded-lg object-cover" />
      </div>

      {/* Partenaire */}
      <div className="dedco-card p-4 mb-4 flex items-center gap-3">
        <img src={project.artisanAvatar} alt={project.artisanName} className="w-12 h-12 rounded-full object-cover" />
        <div className="flex-1">
          <p className="font-display font-semibold">{project.artisanName}</p>
          <p className="text-xs text-[var(--text-3)] flex items-center gap-1"><MapPin size={11} /> {project.artisanCity}</p>
        </div>
        <button className="dedco-btn dedco-btn-ghost dedco-btn-sm"><MessageSquare size={14} /> Contacter</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { id: "avancement", label: "Avancement" },
          { id: "details", label: "Détails" },
          { id: "modifications", label: `Modifications${project.modifications.length > 0 ? ` (${project.modifications.length})` : ""}` },
          { id: "messages", label: "Messagerie" },
        ].map((t) => (
          <button key={t.id} onClick={() => setActiveTab(t.id as typeof activeTab)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${activeTab === t.id ? "bg-[var(--ink)] text-white" : "bg-white border border-[var(--border)] text-[var(--text-2)]"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Avancement (Jalons) */}
      {activeTab === "avancement" && (
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

                    {/* Progress bar pour fabrication */}
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

                    {/* Photos */}
                    {jalon.photos && jalon.photos.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {jalon.photos.map((photo, pi) => (
                          <img key={pi} src={photo} alt={`Jalon ${i+1} photo ${pi+1}`} className="w-20 h-20 rounded-md object-cover border border-[var(--border)]" />
                        ))}
                      </div>
                    )}

                    {/* Commentaire */}
                    {jalon.commentaire && (
                      <p className="text-xs text-[var(--text-2)] mt-2 p-2 bg-[var(--bg-warm)] rounded-md">{jalon.commentaire}</p>
                    )}

                    {/* Dimensions confirmées */}
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
      {activeTab === "details" && (
        <div className="dedco-card p-5 mb-4">
          <h2 className="font-display font-bold mb-4">Détails du projet</h2>
          <dl className="space-y-3 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prix initial</dt><dd className="font-numeric font-semibold">{formatFCFA(project.prixInitial)}</dd></div>
              <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Prix final</dt><dd className="font-numeric font-semibold text-[var(--amber)]">{formatFCFA(project.prixFinal)}</dd></div>
              <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Acompte payé</dt><dd className="font-numeric text-[var(--forest)]">{formatFCFA(project.acompte)}</dd></div>
              <div><dt className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Solde à payer</dt><dd className="font-numeric text-[var(--terracotta)]">{formatFCFA(project.solde)}</dd></div>
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
      {activeTab === "modifications" && (
        <div className="space-y-4">
          {project.modifications.length === 0 ? (
            <div className="dedco-card p-8 text-center">
              <p className="text-sm text-[var(--text-3)]">Aucune modification demandée.</p>
            </div>
          ) : (
            project.modifications.map((mod) => (
              <div key={mod.id} className="dedco-card p-5 border-l-4" style={{ borderLeftColor: "var(--terracotta)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-semibold text-sm">Modification proposée par {project.artisanName}</h3>
                  <span className="dedco-badge dedco-badge-terra">{mod.status === "CHANGE_PENDING_CLIENT" ? "En attente de validation" : mod.status}</span>
                </div>

                {/* Comparaison */}
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-[var(--bg-warm)] rounded-md">
                    <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Valeur initiale</p>
                    <p className="text-sm font-medium">{mod.valeurInitiale}</p>
                  </div>
                  <div className="p-3 bg-[var(--amber-pale)]/30 rounded-md">
                    <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Nouvelle valeur</p>
                    <p className="text-sm font-medium text-[var(--amber-dark)]">{mod.nouvelleValeur}</p>
                  </div>
                </div>

                {/* Impact */}
                <div className="grid sm:grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Impact prix</p>
                    <p className="font-numeric font-semibold text-[var(--terracotta)]">+{formatFCFA(mod.impactPrix)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Impact délai</p>
                    <p>{mod.impactDelai}</p>
                  </div>
                </div>

                {/* Motif */}
                <div className="mb-4">
                  <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">Motif</p>
                  <p className="text-sm p-2 bg-[var(--bg-warm)] rounded-md">{mod.motif}</p>
                </div>

                {/* Deadline */}
                <div className="p-3 bg-[var(--terracotta-pale)] rounded-md mb-4">
                  <p className="text-xs text-[var(--terracotta)] flex items-center gap-1">
                    <Clock size={12} /> Réponse attendue avant le 26 juin 2026.
                    Sans réponse, la modification est refusée automatiquement.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="dedco-btn dedco-btn-ghost flex-1">
                    <X size={14} /> Refuser
                  </button>
                  <button className="dedco-btn dedco-btn-primary flex-1">
                    <Check size={14} /> Accepter la modification
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Messages */}
      {activeTab === "messages" && (
        <div className="dedco-card p-5">
          <h2 className="font-display font-bold mb-4">Messagerie projet</h2>
          <div className="space-y-3 mb-4 min-h-[150px]">
            <div className="flex gap-2">
              <img src={project.artisanAvatar} alt="" className="w-8 h-8 rounded-full" />
              <div className="flex-1 p-3 bg-[var(--bg-warm)] rounded-md">
                <p className="text-xs text-[var(--text-3)] mb-1">{project.artisanName} · il y a 2h</p>
                <p className="text-sm">Bonjour ! J'ai commencé le tressage. Le rotin est de très bonne qualité. Voici une photo d'avancement.</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <input placeholder="Votre message..." className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
            <button className="dedco-btn dedco-btn-primary dedco-btn-sm"><Send size={14} /></button>
          </div>
        </div>
      )}

      {/* Actions selon statut */}
      <div className="flex gap-3 flex-wrap mt-4">
        {project.status === "DELIVERED_PENDING_CONFIRMATION" && (
          <button className="dedco-btn dedco-btn-primary"><CheckCircle2 size={16} /> Confirmer la réception</button>
        )}
        <button className="dedco-btn dedco-btn-ghost text-[var(--terracotta)]"><AlertTriangle size={16} /> Ouvrir un litige</button>
        <button className="dedco-btn dedco-btn-ghost"><FileText size={16} /> Voir la facture</button>
      </div>
    </div>
  );
}
