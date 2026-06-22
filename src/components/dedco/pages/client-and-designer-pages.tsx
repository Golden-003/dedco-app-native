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
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
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
// PAGE: brief-designer — Formulaire brief designer 5 étapes
// ============================================================

export function BriefDesignerPage({ designerId }: { designerId: number }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const designer = DESIGNERS.find((d) => d.id === designerId) || DESIGNERS[0];
  const [step, setStep] = useState(1);
  const [service, setService] = useState<string>("");
  const [room, setRoom] = useState("");
  const [surface, setSurface] = useState(20);
  const [styles, setStyles] = useState<string[]>([]);
  const [budget, setBudget] = useState(200000);
  const [delay, setDelay] = useState<"urgent" | "moyen" | "flexible">("moyen");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const SERVICES = [
    { id: "conseil", label: "Conseil déco", desc: "Consultation ponctuelle", icon: "💡" },
    { id: "amenagement", label: "Aménagement complet", desc: "Projet clé en main", icon: "🏠" },
    { id: "suivi", label: "Suivi chantier", desc: "Coordination travaux", icon: "👷" },
    { id: "shopping", label: "Shopping accompagné", desc: "Sélection produits", icon: "🛍️" },
  ];
  const STYLE_OPTS = [
    { id: "afro", label: "Afro-contemporain", img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=300&q=80" },
    { id: "min", label: "Minimaliste", img: "https://images.unsplash.com/photo-1616627452792-20384b0f7d9b?auto=format&fit=crop&w=300&q=80" },
    { id: "trop", label: "Tropical", img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80" },
    { id: "indus", label: "Industriel", img: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=300&q=80" },
    { id: "scan", label: "Scandinave", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80" },
    { id: "boh", label: "Bohème", img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=300&q=80" },
    { id: "wax", label: "Wax & Couleur", img: "https://images.unsplash.com/photo-1579656592043-a20e25a4aa4b?auto=format&fit=crop&w=300&q=80" },
    { id: "zen", label: "Zen & Bio", img: "https://images.unsplash.com/photo-1528789386055-75c4b717bad1?auto=format&fit=crop&w=300&q=80" },
  ];

  const canNext = () => {
    if (step === 1) return !!service;
    if (step === 2) return !!room;
    if (step === 3) return styles.length > 0;
    if (step === 4) return true;
    if (step === 5) return desc.length >= 50;
    return false;
  };

  if (submitted) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-[var(--forest-pale)] mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-3">Demande envoyée !</h1>
        <p className="text-sm text-[var(--text-2)] mb-6">
          Votre brief a été transmis directement à <strong>{designer.name}</strong>. Vous recevrez une proposition sous 48h dans votre messagerie.
        </p>
        <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary">
          Retour à l'accueil
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

      {/* Stepper */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3, 4, 5].map((n) => (
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
      <p className="text-xs text-[var(--text-3)] mb-5 font-numeric">Étape {step}/5</p>

      <div className="dedco-card p-5 mb-5">
        {step === 1 && (
          <div>
            <h2 className="display-sm mb-4">Type de service</h2>
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setService(s.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    service === s.id ? "border-[var(--amber)] bg-[var(--amber-pale)]" : "border-[var(--border)] hover:border-[var(--text-3)]"
                  }`}
                >
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <p className="font-display font-semibold text-sm">{s.label}</p>
                  <p className="text-xs text-[var(--text-3)]">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="display-sm mb-4">Pièce et surface</h2>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">Pièce concernée</label>
            <select value={room} onChange={(e) => setRoom(e.target.value)} className="w-full px-3 py-2.5 mb-5 text-sm border border-[var(--border)] rounded-md bg-white">
              <option value="">— Sélectionnez —</option>
              {["Salon", "Chambre", "Cuisine", "Salle à manger", "Bureau", "Entrée", "Extérieur"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">
              Surface : <span className="font-numeric font-bold text-[var(--amber)]">{surface} m²</span>
            </label>
            <input type="range" min={5} max={100} value={surface} onChange={(e) => setSurface(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--amber)" }} />
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="display-sm mb-4">Styles de référence</h2>
            <p className="text-xs text-[var(--text-3)] mb-3">Sélectionnez 1 à 3 styles</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STYLE_OPTS.map((s) => {
                const active = styles.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => setStyles(styles.includes(s.id) ? styles.filter((x) => x !== s.id) : styles.length < 3 ? [...styles, s.id] : styles)}
                    className={`relative rounded-lg overflow-hidden border-2 aspect-[4/5] transition-all ${active ? "border-[var(--amber)]" : "border-transparent"}`}
                  >
                    <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,24,19,0.85), transparent 60%)" }} />
                    <p className="absolute bottom-2 left-2 right-2 text-white text-xs font-semibold">{s.label}</p>
                    {active && <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[var(--amber)] text-white flex items-center justify-center"><Check size={12} /></div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <h2 className="display-sm mb-4">Budget et délai</h2>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">
              Budget : <span className="font-numeric font-bold text-[var(--amber)]">{formatFCFA(budget)}</span>
            </label>
            <input type="range" min={50000} max={2000000} step={50000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full mb-5" style={{ accentColor: "var(--amber)" }} />
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">Délai</label>
            <div className="space-y-2">
              {[
                { id: "urgent", label: "Urgent (< 2 semaines)" },
                { id: "moyen", label: "Moyen (2-8 semaines)" },
                { id: "flexible", label: "Flexible (> 8 semaines)" },
              ].map((d) => (
                <label key={d.id} className={`flex items-center gap-2 p-3 rounded-md cursor-pointer border-2 transition-all ${delay === d.id ? "border-[var(--amber)] bg-[var(--amber-pale)]" : "border-[var(--border)]"}`}>
                  <input type="radio" name="delay" checked={delay === d.id} onChange={() => setDelay(d.id as typeof delay)} className="w-4 h-4" style={{ accentColor: "var(--amber)" }} />
                  <span className="text-sm">{d.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        {step === 5 && (
          <div>
            <h2 className="display-sm mb-4">Description et photos</h2>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, 1000))}
              rows={5}
              placeholder="Décrivez votre projet, vos contraintes, vos envies... (min 50 caractères)"
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none focus:outline-none focus:border-[var(--amber)]"
            />
            <p className="text-xs text-[var(--text-3)] text-right font-numeric">{desc.length}/1000</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate({ page: "designer", id: designerId })} className="dedco-btn dedco-btn-ghost">
          {step === 1 ? "Annuler" : "Précédent"}
        </button>
        <button
          onClick={() => step < 5 ? setStep(step + 1) : setSubmitted(true)}
          disabled={!canNext()}
          className="dedco-btn dedco-btn-primary flex-1"
        >
          {step < 5 ? "Continuer" : "Envoyer ma demande"}
        </button>
      </div>

      <p className="text-xs text-[var(--text-3)] text-center mt-4">
        Demande transmise directement au designer · Réponse sous 48h
      </p>
    </div>
  );
}

// ============================================================
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
