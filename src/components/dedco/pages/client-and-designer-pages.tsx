"use client";

import { useState } from "react";
import {
  Wallet as WalletIcon,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  CreditCard,
  Images,
  Plus,
  Edit,
  Trash2,
  Eye as EyeIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Star,
  Check,
  Sparkles,
  ShieldCheck,
  Truck,
  Upload,
  Video,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useDedcoStore, type ProjectScope } from "@/lib/store";
import { formatFCFA, DESIGNERS, ARTISANS, PRODUCTS, getProduct } from "@/lib/dedco-data";

// ============================================================
// PAGE: designer-wallet — Wallet Designer
// ============================================================

type TxType = "credit" | "debit" | "retrait";
type Tx = { id: string; type: TxType; desc: string; amount: number; date: string; status: "completed" | "pending" };

const MOCK_TXS: Tx[] = [
  { id: "TX-D01", type: "credit", desc: "Honoraires — Projet salon Sophie K.", amount: 250000, date: "20 jan 2026", status: "completed" },
  { id: "TX-D02", type: "retrait", desc: "Retrait MTN Mobile Money", amount: -150000, date: "15 jan 2026", status: "completed" },
  { id: "TX-D03", type: "credit", desc: "Acompte — Projet bureau Marc A.", amount: 45000, date: "10 jan 2026", status: "pending" },
  { id: "TX-D04", type: "debit", desc: "Abonnement Pro mensuel", amount: -25000, date: "1 jan 2026", status: "completed" },
];

export function DesignerWalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [tab, setTab] = useState<"tout" | "credits" | "debits" | "retraits">("tout");
  const solde = 89000;
  const pending = 45000;

  const filteredTxs = tab === "tout" ? MOCK_TXS : MOCK_TXS.filter((t) => t.type === (tab === "credits" ? "credit" : tab === "debits" ? "debit" : "retrait"));

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <header>
        <h1 className="display-lg mb-1">Mon Wallet</h1>
        <p className="text-sm text-[var(--text-2)]">Vos gains designer · Aucune commission Dedco</p>
      </header>

      <div className="rounded-2xl p-6 text-white" style={{ background: "var(--ink)" }}>
        <p className="text-xs uppercase tracking-wide opacity-60 mb-2">Solde disponible</p>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-display text-4xl font-numeric font-bold">
            {showBalance ? formatFCFA(solde) : "•••••• FCFA"}
          </h2>
          <button onClick={() => setShowBalance(!showBalance)} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button className="dedco-btn dedco-btn-primary w-full sm:w-auto">
          <ArrowDownLeft size={16} /> Retirer mes fonds
        </button>
      </div>

      <div className="dedco-card p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--amber-pale)] flex items-center justify-center flex-shrink-0">
          <Lock size={18} className="text-[var(--amber)]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">En attente de validation</p>
          <p className="text-xs text-[var(--text-2)] mt-0.5">Solde libéré après confirmation livraison PDF</p>
        </div>
        <p className="font-numeric font-bold text-[var(--amber)]">{formatFCFA(pending)}</p>
      </div>

      <div className="dedco-card p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-display font-bold">Historique transactions</h3>
          <div className="flex gap-1.5">
            {[
              { id: "tout", label: "Tout" },
              { id: "credits", label: "Crédits" },
              { id: "debits", label: "Débits" },
              { id: "retraits", label: "Retraits" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  tab === t.id ? "bg-[var(--ink)] text-white" : "bg-[var(--bg-warm)] text-[var(--text-2)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {filteredTxs.map((tx) => (
            <li key={tx.id} className="py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                tx.type === "credit" ? "bg-[var(--forest-pale)] text-[var(--forest)]" :
                tx.type === "debit" ? "bg-[var(--terracotta-pale)] text-[var(--terracotta)]" :
                "bg-[var(--amber-pale)] text-[var(--amber)]"
              }`}>
                {tx.type === "credit" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{tx.desc}</p>
                <p className="text-xs text-[var(--text-3)] font-numeric">{tx.date} · {tx.id}</p>
              </div>
              <div className="text-right">
                <p className={`font-numeric font-bold text-sm ${tx.amount > 0 ? "text-[var(--forest)]" : "text-[var(--terracotta)]"}`}>
                  {tx.amount > 0 ? "+" : ""}{formatFCFA(Math.abs(tx.amount))}
                </p>
                {tx.status === "pending" && <p className="text-[10px] text-[var(--amber)]">En attente</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: designer-portfolio — Portfolio
// ============================================================

type PortfolioProject = {
  id: string;
  title: string;
  type: string;
  before: string;
  after: string;
  desc: string;
  tags: string[];
  duration: string;
  year: string;
};

const MOCK_PROJECTS: PortfolioProject[] = [
  {
    id: "P1", title: "Salon Afro-contemporain Cotonou", type: "Aménagement complet",
    before: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=80",
    desc: "Rénovation totale d'un salon 30m² avec mobilier local et wax.",
    tags: ["Afro-contemporain", "Wax", "Bois"], duration: "6 semaines", year: "2025",
  },
  {
    id: "P2", title: "Chambre Zen tropicale", type: "Décoration",
    before: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1655276602527-ca7c0c44d6de?auto=format&fit=crop&w=800&q=80",
    desc: "Chambre épurée en bambou et linge naturel.",
    tags: ["Zen", "Bambou", "Tropical"], duration: "3 semaines", year: "2025",
  },
  {
    id: "P3", title: "Bureau Laiton & Bois", type: "Aménagement complet",
    before: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?auto=format&fit=crop&w=800&q=80",
    desc: "Bureau professionnel avec touches de laiton et bois massif.",
    tags: ["Luxe", "Bois", "Laiton"], duration: "8 semaines", year: "2024",
  },
  {
    id: "P4", title: "Entrée sculpturale Abomey", type: "Décoration",
    before: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=800&q=80",
    desc: "Entrée avec sculptures locales et miroir en raffia.",
    tags: ["Sculpture", "Raffia", "Art"], duration: "2 semaines", year: "2024",
  },
  {
    id: "P5", title: "Cuisine Terre Cuite", type: "Aménagement complet",
    before: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
    after: "https://images.unsplash.com/photo-1656402887556-e727ffe1f6d7?auto=format&fit=crop&w=800&q=80",
    desc: "Cuisine méditerranéenne avec céramiques locales.",
    tags: ["Méditerranée", "Céramique", "Bois"], duration: "10 semaines", year: "2024",
  },
];

export function DesignerPortfolioPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);
  const selected = MOCK_PROJECTS[selectedIdx];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="display-lg mb-1">Mon Portfolio</h1>
          <p className="text-sm text-[var(--text-2)] font-numeric">{MOCK_PROJECTS.length} projets</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="dedco-btn dedco-btn-primary">
          <Plus size={16} /> Ajouter un projet
        </button>
      </header>

      <div className="grid lg:grid-cols-[380px_1fr] gap-5">
        {/* Liste projets */}
        <div className="space-y-2">
          {MOCK_PROJECTS.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setSelectedIdx(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                i === selectedIdx ? "border-[var(--amber)] bg-[var(--amber-pale)]/30" : "border-[var(--border)] bg-white hover:border-[var(--text-3)]"
              }`}
            >
              <img src={p.before} alt={p.title} className="w-16 h-16 rounded-md object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-sm line-clamp-1">{p.title}</p>
                <span className="dedco-badge dedco-badge-gray text-[10px]">{p.type}</span>
              </div>
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100">
                <Edit size={12} className="text-[var(--text-2)]" />
                <Trash2 size={12} className="text-[var(--terracotta)]" />
              </div>
            </button>
          ))}
        </div>

        {/* Preview slider */}
        <div className="dedco-card p-5">
          <div className="relative w-full overflow-hidden rounded-lg bg-[var(--bg-warm)] select-none" style={{ aspectRatio: "4/3" }}>
            <img src={selected.after} alt="Après" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
              <img src={selected.before} alt="Avant" className="absolute inset-0 h-full object-cover" style={{ width: `${100 / (sliderPos / 100)}%` }} />
            </div>
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize" style={{ left: `${sliderPos}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                <ChevronLeft size={14} className="text-[var(--ink)]" />
                <ChevronRight size={14} className="text-[var(--ink)]" />
              </div>
            </div>
            <div className="absolute top-2 left-2 dedco-badge dedco-badge-white">Avant</div>
            <div className="absolute top-2 right-2 dedco-badge dedco-badge-white">Après</div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize"
            />
          </div>
          <div className="mt-4">
            <h3 className="font-display font-bold text-lg mb-1">{selected.title}</h3>
            <p className="text-sm text-[var(--text-2)] mb-2">{selected.desc}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {selected.tags.map((t) => (
                <span key={t} className="dedco-badge dedco-badge-amber">{t}</span>
              ))}
              <span className="text-xs text-[var(--text-3)]">·</span>
              <span className="text-xs text-[var(--text-3)] font-numeric">{selected.duration}</span>
              <span className="text-xs text-[var(--text-3)]">·</span>
              <span className="text-xs text-[var(--text-3)] font-numeric">{selected.year}</span>
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={() => setShowAdd(false)}>
          <div className="bg-[var(--bg-cream)] rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">Nouveau projet</h2>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-full hover:bg-[var(--bg-warm)]">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Titre du projet</label>
                <input className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" placeholder="Ex : Salon Afro-contemporain" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Type</label>
                  <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white">
                    <option>Aménagement complet</option>
                    <option>Décoration</option>
                    <option>Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Pièce</label>
                  <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white">
                    <option>Salon</option><option>Chambre</option><option>Bureau</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Photo AVANT</label>
                  <label className="block border-2 border-dashed border-[var(--border)] rounded-lg p-4 text-center cursor-pointer hover:border-[var(--amber)] bg-white">
                    <Plus size={20} className="mx-auto text-[var(--text-3)]" />
                    <input type="file" accept="image/*" className="sr-only" />
                  </label>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Photo APRÈS</label>
                  <label className="block border-2 border-dashed border-[var(--border)] rounded-lg p-4 text-center cursor-pointer hover:border-[var(--amber)] bg-white">
                    <Plus size={20} className="mx-auto text-[var(--text-3)]" />
                    <input type="file" accept="image/*" className="sr-only" />
                  </label>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Description (160 chars)</label>
                <textarea rows={2} maxLength={160} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none" />
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Styles</label>
                <div className="flex gap-1.5 flex-wrap">
                  {["Afro-contemporain", "Minimaliste", "Tropical", "Industriel", "Bohème"].map((s) => (
                    <span key={s} className="dedco-badge dedco-badge-gray">{s}</span>
                  ))}
                </div>
              </div>
              <button className="dedco-btn dedco-btn-primary w-full">Publier le projet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE: designer-abonnement — Plans designer
// ============================================================

export function DesignerAbonnementPage() {
  const plans = [
    {
      id: "essentiel", name: "Essentiel", price: 10000,
      features: ["Profil complet", "5 projets portfolio", "Accès briefs clients", "Messagerie sécurisée", "Wallet Mobile Money"],
      current: false,
    },
    {
      id: "pro", name: "Pro", price: 25000,
      features: ["Tout Essentiel", "Projets illimités", "Priorité +20%", "Badge Pro ⭐", "Accès B2B", "Stats avancées"],
      current: true,
    },
    {
      id: "signature", name: "Signature", price: 45000,
      features: ["Tout Pro", "Édito homepage", "Newsletter dédiée", "Supervision projets", "Support prioritaire <2h"],
      current: false,
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-5">
      <header>
        <h1 className="display-lg mb-1">Abonnement Designer</h1>
        <p className="text-sm text-[var(--text-2)]">Aucune commission sur vos honoraires · 100% abonnement</p>
      </header>

      <div className="grid sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`dedco-card p-5 relative ${plan.current ? "border-2 border-[var(--amber)]" : ""}`}
          >
            {plan.current && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 dedco-badge dedco-badge-amber-solid">
                Votre plan actuel
              </span>
            )}
            <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
            <p className="font-display font-bold text-3xl mb-4">
              <span className="font-numeric">{plan.price.toLocaleString("fr-FR")}</span>
              <span className="text-xs font-normal text-[var(--text-2)]"> FCFA/mois</span>
            </p>
            <ul className="space-y-2 mb-5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-[var(--forest)] flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`dedco-btn w-full ${plan.current ? "dedco-btn-ghost" : "dedco-btn-primary"}`}
              disabled={plan.current}
            >
              {plan.current ? "Plan actuel" : `Passer en ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PAGE: client-projets — Mes projets (client)
// ============================================================

type ClientProject = {
  id: string;
  name: string;
  artisanName: string;
  artisanAvatar: string;
  thumb: string;
  amount: number;
  status: "en_attente" | "production" | "expedie" | "livre";
  progress: number;
};

const MOCK_CLIENT_PROJECTS: ClientProject[] = [
  { id: "CMD-001", name: "Table basse Bénin Wax", artisanName: "Kofi Akindélé", artisanAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=80&q=80", thumb: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=200&q=80", amount: 185000, status: "production", progress: 60 },
  { id: "CMD-002", name: "Fauteuil Sahel Tressé", artisanName: "Amara Dossou", artisanAvatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=80&q=80", thumb: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=200&q=80", amount: 245000, status: "expedie", progress: 85 },
  { id: "CMD-003", name: "Lampe Abat-jour Bogolan", artisanName: "Fatou Loko", artisanAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80", thumb: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=200&q=80", amount: 68000, status: "livre", progress: 100 },
  { id: "CMD-004", name: "Miroir Encadré Raffia", artisanName: "Brice Gogan", artisanAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80", thumb: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=200&q=80", amount: 95000, status: "livre", progress: 100 },
  { id: "CMD-005", name: "Tabouret Tamtam ×2", artisanName: "Brice Gogan", artisanAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80", thumb: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=200&q=80", amount: 76000, status: "en_attente", progress: 0 },
];

const STATUS_LABELS: Record<ClientProject["status"], { label: string; color: string }> = {
  en_attente: { label: "En attente paiement", color: "var(--text-3)" },
  production: { label: "En production", color: "var(--amber)" },
  expedie: { label: "Expédié", color: "var(--terracotta)" },
  livre: { label: "Livré", color: "var(--forest)" },
};

export function ClientProjetsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [tab, setTab] = useState<"en_cours" | "termines">("en_cours");
  const filtered = tab === "en_cours" ? MOCK_CLIENT_PROJECTS.filter((p) => p.status !== "livre") : MOCK_CLIENT_PROJECTS.filter((p) => p.status === "livre");

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="mb-6">
        <h1 className="display-lg mb-1">Mes projets</h1>
        <p className="text-sm text-[var(--text-2)] font-numeric">{MOCK_CLIENT_PROJECTS.length} commandes au total</p>
      </header>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab("en_cours")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            tab === "en_cours" ? "bg-[var(--amber)] text-white" : "bg-white border border-[var(--border)] text-[var(--text-2)]"
          }`}
        >
          En cours (<span className="font-numeric">{MOCK_CLIENT_PROJECTS.filter((p) => p.status !== "livre").length}</span>)
        </button>
        <button
          onClick={() => setTab("termines")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            tab === "termines" ? "bg-[var(--amber)] text-white" : "bg-white border border-[var(--border)] text-[var(--text-2)]"
          }`}
        >
          Terminés (<span className="font-numeric">{MOCK_CLIENT_PROJECTS.filter((p) => p.status === "livre").length}</span>)
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="dedco-card p-12 text-center">
          <p className="font-display font-semibold text-lg mb-1">Aucun projet {tab === "en_cours" ? "en cours" : "terminé"}</p>
          <p className="text-sm text-[var(--text-2)] mb-4">Découvrez la marketplace pour passer commande.</p>
          <button onClick={() => navigate({ page: "marketplace" })} className="dedco-btn dedco-btn-primary">
            Explorer la marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => navigate({ page: "order-tracking", id: p.id })}
              className="w-full dedco-card p-4 flex items-center gap-4 text-left hover:shadow-md transition-shadow"
            >
              <img src={p.thumb} alt={p.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-semibold">{p.name}</h3>
                  <span className="font-numeric font-bold text-[var(--amber)]">{formatFCFA(p.amount)}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <img src={p.artisanAvatar} alt={p.artisanName} className="w-5 h-5 rounded-full" />
                  <span className="text-xs text-[var(--text-2)]">{p.artisanName}</span>
                  <span className="text-xs text-[var(--text-3)]">·</span>
                  <span className="text-xs text-[var(--text-3)] font-numeric">{p.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--amber)] rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: STATUS_LABELS[p.status].color }}>
                    {STATUS_LABELS[p.status].label}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="text-[var(--text-3)]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE: brief-designer — Type d'accompagnement + brief adaptatif 6 étapes
// ============================================================

export function BriefDesignerPage({ designerId }: { designerId: number }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const designer = DESIGNERS.find((d) => d.id === designerId) || DESIGNERS[0];
  const [step, setStep] = useState(0); // 0 = type accompagnement, 1-5 = brief
  const [submitted, setSubmitted] = useState(false);

  // Étape 0 — Type d'accompagnement (PIVOT ÉCONOMIQUE)
  const [scope, setScope] = useState<ProjectScope | "">("");

  // Étape 1 — Votre projet
  const [besoinType, setBesoinType] = useState<string>("");
  const [lieuType, setLieuType] = useState<string>("");
  const [piece, setPiece] = useState("");
  const [surface, setSurface] = useState(25);
  const [ville, setVille] = useState("");
  const [quartier, setQuartier] = useState("");

  // Étape 2 — Votre besoin
  const [souhaits, setSouhaits] = useState("");
  const [style, setStyle] = useState("");
  const [contraintes, setContraintes] = useState("");
  const [budget, setBudget] = useState<string>("");
  const [echeance, setEcheance] = useState<string>("");

  // Étape 3 — Inspirations
  const [photos, setPhotos] = useState<string[]>([]);
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [commentaire, setCommentaire] = useState("");

  // Étape 4 — Premier échange (filtré par scope)
  const [format, setFormat] = useState<"distance" | "visite" | "recommandation" | "">("");

  // Champs avancés (full_project uniquement)
  const [planLogement, setPlanLogement] = useState<string[]>([]);
  const [espacesMultiples, setEspacesMultiples] = useState("");
  const [contraintesTechniques, setContraintesTechniques] = useState("");
  const [niveauSuivi, setNiveauSuivi] = useState<string>("");

  const BESOIN_TYPES = [
    "Conseils décoration",
    "Aménagement d'une pièce",
    "Aménagement de plusieurs pièces",
    "Rénovation / transformation",
    "Projet professionnel",
    "Autre",
  ];
  const LIEU_TYPES = ["Maison", "Appartement", "Studio", "Bureau", "Commerce", "Restaurant / hôtel", "Autre"];
  const BUDGETS_QUICK = ["moins de 50 000 FCFA", "50 000 - 150 000 FCFA", "150 000 - 300 000 FCFA", "je ne sais pas encore"];
  const BUDGETS_ROOM = ["moins de 250 000 FCFA", "250 000 à 750 000 FCFA", "750 000 à 1 500 000 FCFA", "plus de 1 500 000 FCFA", "je ne sais pas encore"];
  const BUDGETS_FULL = ["moins de 500 000 FCFA", "500 000 - 2 000 000 FCFA", "2 000 000 - 5 000 000 FCFA", "plus de 5 000 000 FCFA", "sur devis"];
  const ECHEANCES = ["< 1 mois", "1-3 mois", "3-6 mois", "> 6 mois", "Pas pressé"];
  const NIVEAUX_SUIVI = ["Conseil ponctuel", "Suivi régulier", "Coordination complète chantier"];

  // Config selon le scope choisi
  const SCOPE_CONFIG: Record<ProjectScope, {
    title: string;
    desc: string;
    icon: string;
    triggers: string[];
    priceLabel: string;
    formats: { id: "distance" | "visite" | "recommandation"; label: string; desc: string; default?: boolean; recommended?: boolean }[];
    needsLocation: boolean;
    needsSurface: boolean;
    needsPlan: boolean;
    needsMultiSpaces: boolean;
    budgets: string[];
  }> = {
    quick_advice: {
      title: "Conseil rapide",
      desc: "Réponses à des questions ponctuelles, ajustements décoratifs, optimisation d'un espace existant. Sans engagement lourd.",
      icon: "💡",
      triggers: ["Cadrage léger", "Possible 100% à distance", "Peu ou pas de visite", "Livrable simple (recommandations)"],
      priceLabel: "À partir de 15 000 – 50 000 FCFA",
      formats: [
        { id: "distance", label: "À distance (visio)", desc: "Échange par visio ou appel. Idéal pour conseil rapide.", default: true, recommended: true },
        { id: "recommandation", label: "Recommandation designer", desc: "Le designer choisira le format adapté." },
      ],
      needsLocation: false,
      needsSurface: false,
      needsPlan: false,
      needsMultiSpaces: false,
      budgets: BUDGETS_QUICK,
    },
    room_design: {
      title: "Aménagement d'un espace",
      desc: "Une pièce ou zone définie. Transformation ou optimisation. Choix mobilier + décoration. Possibilité de visite.",
      icon: "🛋️",
      triggers: ["Cadrage standard obligatoire", "Visite possible si nécessaire", "Proposition complète après cadrage"],
      priceLabel: "À partir de 30 000 – 150 000 FCFA (cadrage + projet)",
      formats: [
        { id: "distance", label: "À distance (visio)", desc: "Échange par visio ou appel." },
        { id: "visite", label: "Visite sur site", desc: "Le designer découvre l'espace avant de proposer." },
        { id: "recommandation", label: "Recommandation designer", desc: "Le designer choisira le format le plus pertinent.", default: true, recommended: true },
      ],
      needsLocation: true,
      needsSurface: true,
      needsPlan: false,
      needsMultiSpaces: false,
      budgets: BUDGETS_ROOM,
    },
    full_project: {
      title: "Projet complet",
      desc: "Maison / appartement entier / bureau / commerce. Conception globale. Coordination possible. Forte probabilité de visite terrain.",
      icon: "🏠",
      triggers: ["Cadrage structuré obligatoire", "Visite quasi systématique si terrain", "Proposition détaillée obligatoire"],
      priceLabel: "À partir de 100 000 FCFA + projet sur devis",
      formats: [
        { id: "visite", label: "Visite sur site (fortement suggérée)", desc: "Cadrage terrain prioritaire pour projet complet.", default: true, recommended: true },
        { id: "recommandation", label: "Recommandation designer", desc: "Le designer confirmera la nécessité de visite." },
      ],
      needsLocation: true,
      needsSurface: true,
      needsPlan: true,
      needsMultiSpaces: true,
      budgets: BUDGETS_FULL,
    },
  };

  const scopeConfig = scope ? SCOPE_CONFIG[scope] : null;
  const TOTAL_STEPS = 5; // brief steps (0 = type, 1-5 = brief)
  const TOTAL_PROGRESS = 6; // 0 + 5 brief steps

  const canNext = () => {
    if (step === 0) return scope !== "";
    if (step === 1) {
      if (!besoinType) return false;
      if (scopeConfig?.needsLocation && (!ville || !quartier)) return false;
      if (scopeConfig?.needsSurface && !piece) return false;
      return true;
    }
    if (step === 2) return souhaits.length >= 10 && budget;
    if (step === 3) return true;
    if (step === 4) return format !== "";
    if (step === 5) return true;
    return false;
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-3">Brief envoyé !</h1>
        <p className="text-sm text-[var(--text-2)] mb-2">
          Votre brief <strong>{scopeConfig?.title}</strong> a été transmis à <strong>{designer.name}</strong>.
        </p>
        <p className="text-xs text-[var(--text-3)] mb-6">
          Vous recevrez une proposition de cadrage sous 24-48h. Aucun paiement à cette étape.
        </p>
        <button
          onClick={() => navigate({ page: "designer-projet-attente", projectId: "BRF-2026-001" })}
          className="dedco-btn dedco-btn-primary"
        >
          Voir mon projet <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate({ page: "designer", id: designerId })} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        ← Retour au profil
      </button>

      <div className="flex items-center gap-3 mb-6 p-4 dedco-card">
        <img src={designer.avatar} alt={designer.name} className="w-14 h-14 rounded-full object-cover" />
        <div>
          <p className="text-xs text-[var(--text-3)]">Démarrer un projet avec</p>
          <h1 className="font-display font-bold text-lg">{designer.name}</h1>
        </div>
      </div>

      {/* Stepper 0-5 (6 steps total) */}
      <div className="flex items-center justify-between mb-6">
        {[0, 1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
              n < step ? "bg-[var(--forest)] text-white" : n === step ? "bg-[var(--amber)] text-white" : "bg-[var(--bg-warm)] text-[var(--text-3)]"
            }`}>
              {n < step ? <Check size={14} /> : n}
            </div>
            {n < 5 && <div className={`h-0.5 flex-1 mx-1 ${n < step ? "bg-[var(--forest)]" : "bg-[var(--bg-warm)]"}`} />}
          </div>
        ))}
      </div>
      <p className="text-xs text-[var(--text-3)] mb-5 font-numeric">
        Étape {step}/{TOTAL_PROGRESS} — {step === 0 ? "Type d'accompagnement" : ["Votre projet", "Votre besoin", "Inspirations", "Premier échange", "Envoi"][step - 1]}
      </p>

      <div className="dedco-card p-5 mb-5">
        {/* STEP 0 — Type d'accompagnement (PIVOT) */}
        {step === 0 && (
          <div>
            <h2 className="display-sm mb-2">Quel type de projet souhaitez-vous réaliser ?</h2>
            <p className="text-xs text-[var(--text-3)] mb-4">Cela permet au designer d'adapter son approche, son prix et le niveau d'intervention dès le début.</p>
            <div className="space-y-3">
              {(Object.keys(SCOPE_CONFIG) as ProjectScope[]).map((key) => {
                const cfg = SCOPE_CONFIG[key];
                const active = scope === key;
                return (
                  <button
                    key={key}
                    onClick={() => setScope(key)}
                    className={`w-full p-5 rounded-lg border-2 text-left transition-all ${
                      active ? "border-[var(--amber)] bg-[var(--amber-pale)]/30" : "border-[var(--border)] hover:border-[var(--text-3)]"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{cfg.icon}</span>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-base">{cfg.title}</p>
                        <p className="text-xs text-[var(--text-3)] mt-0.5">{cfg.desc}</p>
                      </div>
                      {active && <Check size={18} className="text-[var(--amber)] flex-shrink-0" />}
                    </div>
                    <div className="ml-9">
                      <p className="font-numeric font-bold text-sm text-[var(--amber)] mb-1">{cfg.priceLabel}</p>
                      <div className="flex flex-wrap gap-1">
                        {cfg.triggers.map((t) => (
                          <span key={t} className="dedco-badge dedco-badge-gray text-[10px]">{t}</span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-[var(--bg-warm)] rounded-md flex items-start gap-2">
              <AlertTriangle size={14} className="text-[var(--amber)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-2)]">
                <strong>Règle d'or :</strong> Aucun projet ne peut être traité sans type d'accompagnement défini. Ce choix pilote toute la suite (brief, format d'échange, prix, cadrage).
              </p>
            </div>
          </div>
        )}

        {/* STEP 1 — Votre projet (adapté selon scope) */}
        {step === 1 && scopeConfig && (
          <div>
            <h2 className="display-sm mb-1">Votre projet</h2>
            <p className="text-xs text-[var(--text-3)] mb-4 flex items-center gap-1">
              <span className="dedco-badge dedco-badge-amber">{scopeConfig.icon} {scopeConfig.title}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Type de besoin</label>
                <select value={besoinType} onChange={(e) => setBesoinType(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white">
                  <option value="">— Sélectionnez —</option>
                  {BESOIN_TYPES.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Type de lieu</label>
                <select value={lieuType} onChange={(e) => setLieuType(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white">
                  <option value="">— Sélectionnez —</option>
                  {LIEU_TYPES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              {/* Champs adaptatifs */}
              {(scopeConfig.needsSurface || true) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">
                      Pièce / espace concerné {!scopeConfig.needsSurface && <span className="text-[var(--text-3)] italic">(facultatif)</span>}
                    </label>
                    <input value={piece} onChange={(e) => setPiece(e.target.value)} placeholder="Ex: Salon" className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white" />
                  </div>
                  {scopeConfig.needsSurface && (
                    <div>
                      <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Surface approx. (m²)</label>
                      <input type="number" value={surface} onChange={(e) => setSurface(Number(e.target.value))} className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white font-numeric" />
                    </div>
                  )}
                </div>
              )}
              {/* Espaces multiples (full_project) */}
              {scopeConfig.needsMultiSpaces && (
                <div>
                  <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Espaces à aménager (plusieurs possibles)</label>
                  <input value={espacesMultiples} onChange={(e) => setEspacesMultiples(e.target.value)} placeholder="Ex: Salon, cuisine, 2 chambres" className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white" />
                </div>
              )}
              {/* Localisation (sauf quick_advice) */}
              {scopeConfig.needsLocation && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Ville</label>
                    <input value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Cotonou" className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Quartier</label>
                    <input value={quartier} onChange={(e) => setQuartier(e.target.value)} placeholder="Akpakpa" className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white" />
                  </div>
                </div>
              )}
              {!scopeConfig.needsLocation && (
                <p className="text-xs text-[var(--text-3)] italic">💡 Pour un conseil rapide, la localisation n'est pas obligatoire.</p>
              )}
              <p className="text-xs text-[var(--text-3)] italic">L'adresse exacte ne sera pas demandée à cette étape.</p>
            </div>
          </div>
        )}

        {/* STEP 2 — Votre besoin (adapté selon scope) */}
        {step === 2 && scopeConfig && (
          <div>
            <h2 className="display-sm mb-1">Votre besoin</h2>
            <p className="text-xs text-[var(--text-3)] mb-4">
              <span className="dedco-badge dedco-badge-amber">{scopeConfig.icon} {scopeConfig.title}</span>
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Ce que vous souhaitez changer</label>
                <textarea value={souhaits} onChange={(e) => setSouhaits(e.target.value.slice(0, 500))} rows={3} placeholder="Ex: Moderniser mon salon en gardant une touche africaine..." className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none" />
                <p className="text-xs text-[var(--text-3)] text-right font-numeric">{souhaits.length}/500</p>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Style recherché</label>
                <input value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Ex: Afro-contemporain, minimaliste..." className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white" />
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Contraintes connues {!scopeConfig.needsPlan && <span className="italic">(facultatif)</span>}</label>
                <input value={contraintes} onChange={(e) => setContraintes(e.target.value)} placeholder="Ex: Budget limité, animaux, etc." className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white" />
              </div>
              {/* Contraintes techniques (full_project) */}
              {scopeConfig.needsPlan && (
                <>
                  <div>
                    <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Contraintes techniques (facultatif)</label>
                    <input value={contraintesTechniques} onChange={(e) => setContraintesTechniques(e.target.value)} placeholder="Ex: Plomberie à refaire, électricité ancienne..." className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white" />
                  </div>
                  <div>
                    <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Niveau de suivi souhaité</label>
                    <select value={niveauSuivi} onChange={(e) => setNiveauSuivi(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white">
                      <option value="">— Sélectionnez —</option>
                      {NIVEAUX_SUIVI.map((n) => <option key={n}>{n}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Budget global estimatif</label>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white">
                  <option value="">— Sélectionnez —</option>
                  {scopeConfig.budgets.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Échéance souhaitée</label>
                <select value={echeance} onChange={(e) => setEcheance(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-white">
                  <option value="">— Sélectionnez —</option>
                  {ECHEANCES.map((e) => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Inspirations (+ plan pour full_project) */}
        {step === 3 && scopeConfig && (
          <div>
            <h2 className="display-sm mb-1">Inspirations</h2>
            <p className="text-xs text-[var(--text-3)] mb-4">
              <span className="dedco-badge dedco-badge-amber">{scopeConfig.icon} {scopeConfig.title}</span>
            </p>
            <div className="space-y-4">
              {/* Plan du logement (full_project) */}
              {scopeConfig.needsPlan && (
                <div>
                  <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Plan du logement (facultatif)</label>
                  <label className="block border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--amber)] bg-white">
                    <Upload size={24} className="mx-auto text-[var(--text-3)] mb-2" />
                    <p className="text-sm font-semibold">Ajouter un plan</p>
                    <p className="text-xs text-[var(--text-3)]">{planLogement.length} fichier(s)</p>
                    <input type="file" multiple accept="image/*,application/pdf" className="sr-only" onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setPlanLogement(files.map((f) => URL.createObjectURL(f)));
                    }} />
                  </label>
                </div>
              )}
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Photos de votre espace</label>
                <label className="block border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--amber)] bg-white">
                  <Upload size={24} className="mx-auto text-[var(--text-3)] mb-2" />
                  <p className="text-sm font-semibold">Ajouter des photos</p>
                  <p className="text-xs text-[var(--text-3)]">{photos.length} photo(s)</p>
                  <input type="file" multiple accept="image/*" className="sr-only" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setPhotos(files.map((f) => URL.createObjectURL(f)));
                  }} />
                </label>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Images d'inspiration</label>
                <label className="block border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--amber)] bg-white">
                  <Sparkles size={24} className="mx-auto text-[var(--text-3)] mb-2" />
                  <p className="text-sm font-semibold">Ajouter des inspirations</p>
                  <p className="text-xs text-[var(--text-3)]">{inspirations.length} image(s)</p>
                  <input type="file" multiple accept="image/*" className="sr-only" onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setInspirations(files.map((f) => URL.createObjectURL(f)));
                  }} />
                </label>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Commentaire (facultatif)</label>
                <textarea value={commentaire} onChange={(e) => setCommentaire(e.target.value)} rows={3} placeholder="Précisez vos envies, références..." className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — Premier échange (filtré par scope) */}
        {step === 4 && scopeConfig && (
          <div>
            <h2 className="display-sm mb-2">Comment souhaitez-vous commencer ?</h2>
            <p className="text-xs text-[var(--text-3)] mb-4">
              <span className="dedco-badge dedco-badge-amber">{scopeConfig.icon} {scopeConfig.title}</span>
              <span className="ml-2">Format filtré selon votre type de projet.</span>
            </p>
            <div className="space-y-3">
              {scopeConfig.formats.map((f) => {
                const icons: Record<string, React.ReactNode> = {
                  distance: <Video size={24} />,
                  visite: <MapPin size={24} />,
                  recommandation: <Sparkles size={24} />,
                };
                const active = format === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      active ? "border-[var(--amber)] bg-[var(--amber-pale)]/30" : "border-[var(--border)] hover:border-[var(--text-3)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        active ? "bg-[var(--amber)] text-white" : "bg-[var(--bg-warm)] text-[var(--text-2)]"
                      }`}>
                        {icons[f.id]}
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-sm mb-0.5 flex items-center gap-2">
                          {f.label}
                          {f.recommended && <span className="dedco-badge dedco-badge-forest text-[10px]">Recommandé</span>}
                        </p>
                        <p className="text-xs text-[var(--text-3)]">{f.desc}</p>
                      </div>
                      {active && <Check size={16} className="text-[var(--amber)] flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 p-3 bg-[var(--amber-pale)]/30 rounded-md flex items-start gap-2">
              <Sparkles size={14} className="text-[var(--amber)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-2)]">
                Le format, le contenu et le prix de cette première étape seront confirmés par le designer avant paiement.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5 — Récapitulatif + envoi */}
        {step === 5 && scopeConfig && (
          <div>
            <h2 className="display-sm mb-2">Récapitulatif</h2>
            <p className="text-xs text-[var(--text-3)] mb-4">
              <span className="dedco-badge dedco-badge-amber">{scopeConfig.icon} {scopeConfig.title}</span>
            </p>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Type de projet</dt><dd className="text-right font-semibold">{scopeConfig.title}</dd></div>
              <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Besoin</dt><dd className="text-right">{besoinType}</dd></div>
              {piece && <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Pièce</dt><dd className="text-right">{piece}</dd></div>}
              {scopeConfig.needsSurface && <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Surface</dt><dd className="text-right font-numeric">{surface} m²</dd></div>}
              {scopeConfig.needsLocation && ville && <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Lieu</dt><dd className="text-right">{quartier}, {ville}</dd></div>}
              {scopeConfig.needsMultiSpaces && espacesMultiples && <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Espaces</dt><dd className="text-right">{espacesMultiples}</dd></div>}
              <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Budget</dt><dd className="text-right font-numeric">{budget}</dd></div>
              <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Format souhaité</dt><dd className="text-right">{format === "distance" ? "À distance" : format === "visite" ? "Visite sur site" : "Recommandation designer"}</dd></div>
              <div className="flex justify-between p-2 bg-[var(--bg-warm)] rounded"><dt className="text-[var(--text-3)]">Photos</dt><dd className="text-right font-numeric">{photos.length + inspirations.length + planLogement.length} fichier(s)</dd></div>
            </dl>
            <div className="mt-4 p-3 bg-[var(--forest-pale)]/30 rounded-md flex items-start gap-2">
              <CheckCircle2 size={14} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-2)]"><strong>Aucun paiement à cette étape.</strong> Le designer analysera votre brief et vous proposera un cadrage (avec prix) avant tout engagement.</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate({ page: "designer", id: designerId })} className="dedco-btn dedco-btn-ghost">
          {step === 0 ? "Annuler" : "Précédent"}
        </button>
        <button
          onClick={() => step < 5 ? setStep(step + 1) : setSubmitted(true)}
          disabled={!canNext()}
          className="dedco-btn dedco-btn-primary flex-1"
        >
          {step < 5 ? "Continuer" : "Envoyer mon brief"}
          {step < 5 && <ChevronRight size={16} />}
        </button>
      </div>

      <p className="text-xs text-[var(--text-3)] text-center mt-4">
        Brief transmis directement au designer · Proposition de cadrage sous 24-48h · Aucun paiement
      </p>
    </div>
  );
}


// PAGE: avis-livraison — Avis post-livraison
// ============================================================

export function AvisLivraisonPage({ orderId }: { orderId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const [rating, setRating] = useState(0);
  const [subRatings, setSubRatings] = useState({ qualite: 0, delais: 0, communication: 0 });
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const product = PRODUCTS[0];

  if (submitted) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-3">Merci pour votre avis !</h1>
        <p className="text-sm text-[var(--text-2)] mb-6">Votre avis nous aide à maintenir la qualité sur Dedco.</p>
        <button onClick={() => navigate({ page: "marketplace" })} className="dedco-btn dedco-btn-primary">Continuer mes achats</button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Banner success */}
      <div className="rounded-lg p-4 mb-5 bg-[var(--forest-pale)] flex items-center gap-3">
        <CheckCircle2 size={24} className="text-[var(--forest)] flex-shrink-0" />
        <p className="font-display font-semibold text-[var(--forest)]">Commande livrée avec succès !</p>
      </div>

      {/* Recap */}
      <div className="dedco-card p-4 mb-5 flex items-center gap-4">
        <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <p className="font-display font-semibold">{product.name}</p>
          <p className="text-xs text-[var(--text-3)] font-numeric">{orderId} · Livré le 22 juin 2026</p>
        </div>
        <p className="font-numeric font-bold text-[var(--amber)]">{formatFCFA(product.price)}</p>
      </div>

      {/* Avis obligatoire */}
      <div className="dedco-card p-5 border-t-4" style={{ borderTopColor: "var(--amber)", borderTopWidth: "3px" }}>
        <p className="text-sm font-semibold text-[var(--terracotta)] mb-3 flex items-center gap-2">
          ⚠ Votre avis est requis avant de continuer sur Dedco.
        </p>
        <h2 className="display-md mb-4">Notez votre commande</h2>
        <div className="flex items-center gap-2 mb-5 justify-center">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => setRating(s)}
              className="transition-transform hover:scale-110"
              aria-label={`${s} étoiles`}
            >
              <Star
                size={40}
                className={s <= rating ? "text-[var(--amber)]" : "text-[var(--border-dark)]"}
                fill={s <= rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>

        {/* Sous-critères */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {Object.entries(subRatings).map(([key, val]) => (
            <div key={key} className="text-center">
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">{key}</p>
              <div className="flex justify-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubRatings({ ...subRatings, [key]: s })}
                  >
                    <Star
                      size={16}
                      className={s <= val ? "text-[var(--amber)]" : "text-[var(--border-dark)]"}
                      fill={s <= val ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">Commentaire (optionnel, min 20 caractères)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Racontez votre expérience..."
          className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none focus:outline-none focus:border-[var(--amber)]"
        />

        <button
          onClick={() => setSubmitted(true)}
          disabled={rating === 0}
          className="dedco-btn dedco-btn-primary w-full mt-4"
        >
          Publier mon avis
        </button>
      </div>

      {/* Recommandations */}
      <div className="mt-8">
        <h3 className="display-sm mb-3">Vous aimerez aussi</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PRODUCTS.slice(5, 9).map((p) => (
            <button
              key={p.id}
              onClick={() => navigate({ page: "product", id: p.id })}
              className="dedco-card overflow-hidden text-left"
            >
              <img src={p.images[0]} alt={p.name} className="w-full aspect-square object-cover" />
              <div className="p-2">
                <p className="text-xs font-medium line-clamp-1">{p.name}</p>
                <p className="font-numeric font-bold text-xs text-[var(--amber)]">{formatFCFA(p.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: plans-tarifs — Plans et tarifs publics
// ============================================================

export function PlansTarifsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [cycle, setCycle] = useState<"mensuel" | "annuel">("mensuel");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const artisanPlans = [
    { id: "gratuit", name: "Gratuit", price: 0, features: ["3 produits max", "Profil basique", "Résultats standard"] },
    { id: "pro", name: "Artisan Pro", price: 5000, features: ["Produits illimités", "Priorité +15%", "Badge Pro ⭐", "Stats avancées"] },
    { id: "boutique", name: "Boutique", price: 15000, features: ["Page marque", "20 produits max", "Messagerie client", "B2B Phase 3"] },
  ];
  const designerPlans = [
    { id: "essentiel", name: "Essentiel", price: 10000, features: ["Profil complet", "5 projets portfolio", "Accès briefs"] },
    { id: "pro", name: "Pro", price: 25000, features: ["Projets illimités", "Priorité +20%", "Badge Pro", "B2B"] },
    { id: "signature", name: "Signature", price: 45000, features: ["Édito homepage", "Newsletter", "Supervision projets"] },
  ];

  const computePrice = (price: number) => cycle === "annuel" ? Math.round(price * 0.8) : price;

  const faqs = [
    { q: "Puis-je changer de plan à tout moment ?", a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Le prorata est calculé automatiquement." },
    { q: "Comment fonctionne le paiement Mobile Money ?", a: "Le prélèvement auto se fait via Fedapay (MTN ou Moov) à la date anniversaire de votre abonnement." },
    { q: "Y a-t-il un essai gratuit ?", a: "Oui, les 3 premiers mois sont gratuits pour tout nouvel inscrit. Sans engagement." },
    { q: "Qu'est-ce que la commission Dedco ?", a: "Pour les artisans, 10% sur chaque vente (incluse dans le prix affiché). Pour les designers, 0% de commission — seulement l'abonnement." },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="display-xl mb-2">Plans et tarifs</h1>
        <p className="text-sm text-[var(--text-2)] max-w-lg mx-auto">Choisissez le plan adapté à votre activité. Sans engagement. Paiement Mobile Money.</p>
      </header>

      {/* Toggle cycle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setCycle("mensuel")}
          className={`px-4 py-2 rounded-full text-sm font-medium ${cycle === "mensuel" ? "bg-[var(--ink)] text-white" : "text-[var(--text-2)]"}`}
        >
          Mensuel
        </button>
        <button
          onClick={() => setCycle("annuel")}
          className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${cycle === "annuel" ? "bg-[var(--ink)] text-white" : "text-[var(--text-2)]"}`}
        >
          Annuel
          <span className="dedco-badge dedco-badge-forest">-20%</span>
        </button>
      </div>

      {/* Section artisans */}
      <div className="mb-10">
        <h2 className="display-lg mb-4 text-center">Pour les artisans</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {artisanPlans.map((p) => (
            <div key={p.id} className={`dedco-card p-5 ${p.id === "pro" ? "border-2 border-[var(--amber)]" : ""}`}>
              {p.id === "pro" && <span className="dedco-badge dedco-badge-amber-solid mb-2">Populaire</span>}
              <h3 className="font-display font-bold text-lg mb-1">{p.name}</h3>
              <p className="font-display font-bold text-3xl mb-4">
                <span className="font-numeric">{computePrice(p.price).toLocaleString("fr-FR")}</span>
                <span className="text-xs font-normal text-[var(--text-2)]"> FCFA/{cycle === "annuel" ? "mois" : "mois"}</span>
              </p>
              <ul className="space-y-2 mb-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={14} className="text-[var(--forest)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate({ page: "register" })} className={`dedco-btn w-full ${p.id === "pro" ? "dedco-btn-primary" : "dedco-btn-secondary"}`}>
                {p.price === 0 ? "Commencer gratuitement" : "Choisir " + p.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section designers */}
      <div className="mb-10">
        <h2 className="display-lg mb-4 text-center">Pour les designers</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {designerPlans.map((p) => (
            <div key={p.id} className={`dedco-card p-5 ${p.id === "pro" ? "border-2 border-[var(--amber)]" : ""}`}>
              {p.id === "pro" && <span className="dedco-badge dedco-badge-amber-solid mb-2">Populaire</span>}
              <h3 className="font-display font-bold text-lg mb-1">{p.name}</h3>
              <p className="font-display font-bold text-3xl mb-4">
                <span className="font-numeric">{computePrice(p.price).toLocaleString("fr-FR")}</span>
                <span className="text-xs font-normal text-[var(--text-2)]"> FCFA/mois</span>
              </p>
              <ul className="space-y-2 mb-5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={14} className="text-[var(--forest)]" />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate({ page: "register" })} className={`dedco-btn w-full ${p.id === "pro" ? "dedco-btn-primary" : "dedco-btn-secondary"}`}>
                Choisir {p.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="display-lg mb-4 text-center">FAQ</h2>
        <div className="space-y-2">
          {faqs.map((f, i) => (
            <div key={i} className="dedco-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-4 text-left flex items-center justify-between"
              >
                <span className="font-display font-semibold text-sm">{f.q}</span>
                <ChevronRight size={16} className={`transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="p-4 pt-0 text-sm text-[var(--text-2)]">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div className="text-center mt-10">
        <button onClick={() => navigate({ page: "register" })} className="dedco-btn dedco-btn-primary dedco-btn-lg">
          Commencer gratuitement
        </button>
        <button onClick={() => navigate({ page: "artisans" })} className="block mx-auto mt-3 text-sm text-[var(--amber)] hover:underline">
          Voir tous les artisans →
        </button>
      </div>
    </div>
  );
}
