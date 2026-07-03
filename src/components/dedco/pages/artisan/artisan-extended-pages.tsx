"use client";

import { useState } from "react";
import {
  Inbox,
  Clock,
  ChevronRight,
  LayoutDashboard,
  ClipboardList,
  Wallet as WalletIcon,
  Eye,
  EyeOff,
  ArrowDownLeft,
  ArrowUpRight,
  Lock,
  Star,
  Award,
  CheckCircle2,
  Circle,
  CreditCard,
  Settings,
  Save,
  Mail,
  Bell,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Phone,
  Upload,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { PhoneInput } from "@/components/dedco/phone-input";
import { formatFCFA, ARTISANS } from "@/lib/dedco-data";

// ============================================================
// PAGE: artisan-demandes — Briefs reçus artisan
// ============================================================

type Brief = {
  id: string;
  client: string;
  avatar: string;
  type: "mobilier" | "decoration" | "amenagement" | "autre";
  room: string;
  budgetMin: number;
  budgetMax: number;
  delay: "urgent" | "moyen" | "flexible";
  receivedAt: string;
  status: "nouveau" | "en_cours" | "expire";
  countdown?: string;
  desc: string;
};

const MOCK_BRIEFS: Brief[] = [
  {
    id: "BRF-001",
    client: "Sophie Kossou",
    avatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=80&q=80",
    type: "mobilier",
    room: "Salon",
    budgetMin: 200000,
    budgetMax: 500000,
    delay: "moyen",
    receivedAt: "Il y a 2h",
    status: "nouveau",
    countdown: "47h restantes",
    desc: "Table basse en bois iroko avec plateau wax, style afro-contemporain pour salon de 25m².",
  },
  {
    id: "BRF-002",
    client: "Marc Adjovi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=80&q=80",
    type: "decoration",
    room: "Entrée",
    budgetMin: 50000,
    budgetMax: 120000,
    delay: "flexible",
    receivedAt: "Il y a 5h",
    status: "nouveau",
    countdown: "43h restantes",
    desc: "Miroir rond encadré en raffia tressé, diamètre 80cm pour entrée.",
  },
  {
    id: "BRF-003",
    client: "Aïcha Sanni",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=80&q=80",
    type: "amenagement",
    room: "Bureau",
    budgetMin: 150000,
    budgetMax: 400000,
    delay: "urgent",
    receivedAt: "Hier",
    status: "en_cours",
    desc: "Bibliothèque modulaire 5 niveaux en bois laqué terracotta, hauteur 180cm.",
  },
  {
    id: "BRF-004",
    client: "Paul Hounkpatin",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&crop=faces&w=80&q=80",
    type: "mobilier",
    room: "Chambre",
    budgetMin: 80000,
    budgetMax: 250000,
    delay: "moyen",
    receivedAt: "Il y a 3 jours",
    status: "expire",
    desc: "Tête de lit en bois et wax pour lit 160x200cm, style naturel.",
  },
];

const TYPE_LABELS: Record<Brief["type"], string> = {
  mobilier: "Mobilier",
  decoration: "Décoration",
  amenagement: "Aménagement",
  autre: "Autre",
};

export function ArtisanDemandesPage() {
  const [filter, setFilter] = useState<"nouveau" | "en_cours" | "expire" | "tous">("tous");
  const navigate = useDedcoStore((s) => s.navigate);
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }
  const filtered = filter === "tous" ? MOCK_BRIEFS : MOCK_BRIEFS.filter((b) => b.status === filter);

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="display-lg mb-1">Briefs reçus</h1>
          <p className="text-sm text-[var(--text-2)]">
            <span className="font-numeric font-semibold">{MOCK_BRIEFS.filter((b) => b.status === "nouveau").length}</span> nouveaux ·{" "}
            <span className="font-numeric">{MOCK_BRIEFS.length}</span> au total
          </p>
        </div>
      </header>

      <div className="flex gap-2 mb-5 overflow-x-auto dedco-hide-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: "tous", label: "Tous" },
          { id: "nouveau", label: "Nouveau" },
          { id: "en_cours", label: "En cours" },
          { id: "expire", label: "Expiré" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as typeof filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all ${
              filter === t.id
                ? "bg-[var(--amber)] text-white border-[var(--amber)]"
                : "bg-card text-[var(--text-2)] border-[var(--border)] hover:border-[var(--text-3)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox size={32} />}
          title="Aucun brief reçu"
          desc="Complétez votre profil pour apparaître dans les résultats de matching."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((brief) => (
            <div
              key={brief.id}
              className="dedco-card p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <img src={brief.avatar} alt={brief.client} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                  <div>
                    <h3 className="font-display font-semibold text-base">{brief.client}</h3>
                    <p className="text-xs text-[var(--text-3)] font-numeric">{brief.id} · {brief.receivedAt}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="dedco-badge dedco-badge-amber">{TYPE_LABELS[brief.type]}</span>
                    <span className="dedco-badge dedco-badge-gray">{brief.room}</span>
                    {brief.status === "nouveau" && brief.countdown && (
                      <span className="dedco-badge dedco-badge-terra">
                        <Clock size={11} /> {brief.countdown}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-[var(--text-2)] mb-2 line-clamp-2">{brief.desc}</p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-sm">
                    <span className="text-[var(--text-3)]">Budget : </span>
                    <span className="font-numeric font-semibold text-[var(--amber)]">
                      {formatFCFA(brief.budgetMin)} — {formatFCFA(brief.budgetMax)}
                    </span>
                  </p>
                  <button
                    onClick={() => navigate({ page: "artisan-brief-recu", briefId: brief.id })}
                    className="dedco-btn dedco-btn-primary dedco-btn-sm"
                  >
                    Voir le brief <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE: artisan-projets — Kanban projets
// ============================================================

type Project = {
  id: string;
  client: string;
  product: string;
  thumb: string;
  amount: number;
  dueDate: string;
  progress: number;
  status: "en_attente" | "production" | "expedie" | "livre";
};

const MOCK_PROJECTS: Project[] = [
  { id: "CMD-001", client: "Sophie K.", product: "Table basse Wax", thumb: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=120&q=80", amount: 185000, dueDate: "20 fév", progress: 60, status: "production" },
  { id: "CMD-002", client: "Marc A.", product: "Commode Porto-Novo", thumb: "https://images.unsplash.com/photo-1517467139951-f5a925c9f9de?auto=format&fit=crop&w=120&q=80", amount: 385000, dueDate: "5 mars", progress: 0, status: "en_attente" },
  { id: "CMD-003", client: "Lucie B.", product: "Bibliothèque Yoruba", thumb: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=120&q=80", amount: 295000, dueDate: "30 jan", progress: 85, status: "expedie" },
  { id: "CMD-004", client: "Kofi D.", product: "Table à manger", thumb: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=120&q=80", amount: 520000, dueDate: "15 jan", progress: 100, status: "livre" },
  { id: "CMD-005", client: "Bob M.", product: "Tabouret Tamtam ×2", thumb: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=120&q=80", amount: 76000, dueDate: "18 fév", progress: 30, status: "production" },
];

const COLUMNS: { id: Project["status"]; label: string; color: string }[] = [
  { id: "en_attente", label: "En attente paiement", color: "var(--text-3)" },
  { id: "production", label: "En production", color: "var(--amber)" },
  { id: "expedie", label: "Expédié", color: "var(--terracotta)" },
  { id: "livre", label: "Livré", color: "var(--forest)" },
];

export function ArtisanProjetsPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [mobileCol, setMobileCol] = useState<Project["status"]>("production");

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="display-lg mb-1">Projets en cours</h1>
        <p className="text-sm text-[var(--text-2)]">
          <span className="font-numeric font-semibold">{MOCK_PROJECTS.length}</span> projets actifs
        </p>
      </header>

      {/* Mobile: tabs */}
      <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto dedco-hide-scroll">
        {COLUMNS.map((c) => (
          <button
            key={c.id}
            onClick={() => setMobileCol(c.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap border transition-all ${
              mobileCol === c.id ? "bg-[var(--amber)] text-white border-[var(--amber)]" : "bg-card border-[var(--border)]"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Desktop: 4 columns */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const items = MOCK_PROJECTS.filter((p) => p.status === col.id);
          return (
            <div key={col.id} className="bg-[var(--bg-warm)] rounded-xl p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold uppercase tracking-wide" style={{ color: col.color }}>
                  {col.label}
                </h3>
                <span className="text-xs font-numeric font-bold bg-card px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.map((p) => (
                  <ProjectCard key={p.id} project={p} onClick={() => navigate({ page: "projet-artisan-detail", projectId: p.id })} />
                ))}
                {items.length === 0 && <p className="text-xs text-[var(--text-3)] text-center py-4">Aucun projet</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: current column */}
      <div className="lg:hidden space-y-2">
        {MOCK_PROJECTS.filter((p) => p.status === mobileCol).map((p) => (
          <ProjectCard key={p.id} project={p} onClick={() => navigate({ page: "projet-artisan-detail", projectId: p.id })} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-card rounded-lg p-3 text-left hover:shadow-md transition-shadow border border-[var(--border)] cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-2">
        <img src={project.thumb} alt={project.product} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--text-3)] font-numeric">{project.id}</p>
          <p className="font-display font-semibold text-sm line-clamp-1">{project.product}</p>
          <p className="text-xs text-[var(--text-2)]">{project.client}</p>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <span className="font-numeric font-bold text-sm text-[var(--amber)]">{formatFCFA(project.amount)}</span>
        <span className="text-xs text-[var(--text-3)]">⏱ {project.dueDate}</span>
      </div>
      <div className="h-1.5 bg-[var(--bg-warm)] rounded-full overflow-hidden">
        <div className="h-full bg-[var(--amber)] rounded-full" style={{ width: `${project.progress}%` }} />
      </div>
    </button>
  );
}

// ============================================================
// PAGE: artisan-wallet — Wallet Artisan
// ============================================================

type TxType = "credit" | "debit" | "retrait";
type Tx = { id: string; type: TxType; desc: string; amount: number; date: string; status: "completed" | "pending" };

const MOCK_TXS: Tx[] = [
  { id: "TX-001", type: "credit", desc: "Paiement reçu — Table basse Wax", amount: 185000, date: "18 jan 2026", status: "completed" },
  { id: "TX-002", type: "debit", desc: "Commission Dedco (10%)", amount: -18500, date: "18 jan 2026", status: "completed" },
  { id: "TX-003", type: "credit", desc: "Avance Brief #123 — Sophie K.", amount: 48500, date: "20 jan 2026", status: "pending" },
  { id: "TX-004", type: "retrait", desc: "Retrait MTN Mobile Money", amount: -50000, date: "10 jan 2026", status: "completed" },
  { id: "TX-005", type: "credit", desc: "Paiement reçu — Miroir Raffia", amount: 95000, date: "5 jan 2026", status: "completed" },
];

export function ArtisanWalletPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  const [showBalance, setShowBalance] = useState(true);
  const [tab, setTab] = useState<"tout" | "credits" | "debits" | "retraits">("tout");
  const [withdrawAmount, setWithdrawAmount] = useState(50000);
  const [operator, setOperator] = useState<"mtn" | "moov">("mtn");

  const solde = 127500;
  const pending = 63000;
  const fees = Math.round(withdrawAmount * 0.02);
  const filteredTxs = tab === "tout" ? MOCK_TXS : MOCK_TXS.filter((t) => t.type === (tab === "credits" ? "credit" : tab === "debits" ? "debit" : "retrait"));

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <header className="mb-2">
        <h1 className="display-lg mb-1">Mon Wallet</h1>
        <p className="text-sm text-[var(--text-2)]">Gérez vos gains et retraits Mobile Money</p>
      </header>

      {/* Wallet card */}
      <div className="rounded-2xl p-5 sm:p-6 text-white" style={{ background: "var(--text-1)" }}>
        <p className="text-xs uppercase tracking-wide opacity-60 mb-2">Solde disponible</p>
        <div className="flex items-center gap-3 mb-4 min-w-0">
          <h2 className="font-display text-2xl sm:text-4xl font-numeric font-bold break-words">
            {showBalance ? formatFCFA(solde) : "•••••• FCFA"}
          </h2>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Masquer/Afficher le solde"
          >
            {showBalance ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button onClick={() => showToast("Redirection vers le retrait Mobile Money.")} className="dedco-btn dedco-btn-primary w-full sm:w-auto">
          <ArrowDownLeft size={16} /> Retirer mes fonds
        </button>
      </div>

      {/* Pending card */}
      <div className="dedco-card p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[var(--amber-pale)] flex items-center justify-center flex-shrink-0">
          <Lock size={18} className="text-[var(--amber)]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold">En attente de validation</p>
          <p className="text-xs text-[var(--text-2)] mt-0.5">Solde libéré après confirmation livraison</p>
        </div>
        <p className="font-numeric font-bold text-[var(--amber)]">{formatFCFA(pending)}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <KPI label="Ce mois" value={formatFCFA(280000)} icon={<TrendingUp size={16} />} />
        <KPI label="Total retiré" value={formatFCFA(1250000)} icon={<ArrowUpRight size={16} />} />
        <KPI label="Renouvellement" value="15 juil" icon={<CreditCard size={16} />} />
      </div>

      {/* Withdraw form */}
      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-4">Retrait Mobile Money</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Montant (FCFA)</label>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value) || 0)}
              className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card font-numeric focus:outline-none focus:border-[var(--amber)]"
              min={10000}
              step={5000}
            />
            <p className="text-xs text-[var(--text-3)] mt-1">Min. 10 000 FCFA · Frais 2% ({formatFCFA(fees)})</p>
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Opérateur</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "mtn" as const, label: "MTN MoMo", color: "#FFCC00", text: "#000" },
                { id: "moov" as const, label: "Moov Money", color: "#009BDB", text: "#fff" },
              ].map((op) => (
                <button
                  key={op.id}
                  onClick={() => setOperator(op.id)}
                  className={`px-3 py-2.5 rounded-md text-sm font-semibold border-2 transition-all ${
                    operator === op.id ? "border-[var(--amber)]" : "border-[var(--border)]"
                  }`}
                  style={{ backgroundColor: op.color, color: op.text }}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-[var(--bg-warm)] rounded-md mb-3">
          <span className="text-sm">Vous recevrez</span>
          <span className="font-numeric font-bold text-[var(--forest)]">{formatFCFA(withdrawAmount - fees)}</span>
        </div>
        <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary w-full">Confirmer le retrait</button>
      </div>

      {/* Transactions history */}
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
                  tab === t.id ? "bg-[var(--amber)] text-white" : "bg-[var(--bg-warm)] text-[var(--text-2)]"
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

function KPI({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="dedco-card p-4">
      <div className="flex items-center gap-2 mb-1 text-[var(--text-3)]">
        {icon}
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="font-display font-bold text-base font-numeric">{value}</p>
    </div>
  );
}

// ============================================================
// PAGE: artisan-avis — Avis et notes
// ============================================================

type Review = {
  id: string;
  client: string;
  avatar: string;
  date: string;
  rating: number;
  comment: string;
  hasReply: boolean;
  reply?: string;
};

const MOCK_REVIEWS: Review[] = [
  { id: "1", client: "Sophie Kossou", avatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=80&q=80", date: "Il y a 3 jours", rating: 5, comment: "Très belle table basse, finition impeccable. Kofi a su comprendre exactement ce que je voulais. Livraison en avance !", hasReply: false },
  { id: "2", client: "Marc Adjovi", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&crop=faces&w=80&q=80", date: "Il y a 1 semaine", rating: 5, comment: "Excellent travail, wax bleu Ankara magnifique. Je recommande vivement.", hasReply: true, reply: "Merci beaucoup Marc pour votre confiance ! À bientôt pour un prochain projet." },
  { id: "3", client: "Aïcha Sanni", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=faces&w=80&q=80", date: "Il y a 2 semaines", rating: 4, comment: "Bonne qualité, délai légèrement dépassé mais le résultat en valait la peine.", hasReply: false },
  { id: "4", client: "Paul Hounkpatin", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&crop=faces&w=80&q=80", date: "Il y a 3 semaines", rating: 5, comment: "Artisan talentueux et à l'écoute. Tête de lit parfaite.", hasReply: false },
  { id: "5", client: "Lucie Bokossa", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&crop=faces&w=80&q=80", date: "Il y a 1 mois", rating: 5, comment: "Commode en teck superbe, exactement comme sur les photos du portfolio.", hasReply: true, reply: "Merci Lucie ! N'hésitez pas à nous recommander." },
];

export function ArtisanAvisPage() {
  const navigate = useDedcoStore((s) => s.navigate);

  const avgRating = 4.7;
  const totalReviews = 87;
  const histogram = [
    { stars: 5, count: 65 },
    { stars: 4, count: 15 },
    { stars: 3, count: 4 },
    { stars: 2, count: 2 },
    { stars: 1, count: 1 },
  ];
  const subCriteria = [
    { label: "Qualité", value: 4.8 },
    { label: "Délais", value: 4.6 },
    { label: "Communication", value: 4.9 },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <header>
        <h1 className="display-lg mb-1">Avis et notes</h1>
        <p className="text-sm text-[var(--text-2)]">Vos clients parlent de vous</p>
      </header>

      {/* Header note globale */}
      <div className="dedco-card p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <Star size={32} className="text-[var(--amber)]" fill="currentColor" />
              <span className="font-display font-bold text-5xl font-numeric">{avgRating}</span>
            </div>
            <p className="text-sm text-[var(--text-2)] font-numeric">{totalReviews} avis</p>
          </div>
          <div className="flex-1 w-full">
            {histogram.map((h) => (
              <div key={h.stars} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs w-6 text-right font-numeric">{h.stars}★</span>
                <div className="flex-1 h-2 bg-[var(--bg-warm)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--amber)] rounded-full" style={{ width: `${(h.count / totalReviews) * 100}%` }} />
                </div>
                <span className="text-xs w-8 text-[var(--text-3)] font-numeric">{h.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[var(--border)]">
          {subCriteria.map((c) => (
            <div key={c.label} className="text-center">
              <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1">{c.label}</p>
              <p className="font-display font-bold text-lg font-numeric">{c.value}<span className="text-xs text-[var(--text-3)]">/5</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {MOCK_REVIEWS.map((r) => (
          <div key={r.id} className="dedco-card p-5">
            <div className="flex items-start gap-3 mb-2">
              <img src={r.avatar} alt={r.client} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="font-display font-semibold text-sm">{r.client}</p>
                  <span className="text-xs text-[var(--text-3)]">{r.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={12} className={s <= r.rating ? "text-[var(--amber)]" : "text-[var(--border-dark)]"} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-[var(--text-2)] mb-2">{r.comment}</p>
            {r.hasReply && r.reply && (
              <div className="ml-12 pl-4 border-l-2 border-[var(--amber)] text-sm">
                <p className="text-xs text-[var(--text-3)] mb-0.5">Votre réponse :</p>
                <p className="text-[var(--text-2)]">{r.reply}</p>
              </div>
            )}
            {!r.hasReply && (
              <button onClick={() => navigate({ page: "home" })} className="text-xs text-[var(--amber)] font-semibold hover:underline mt-2 ml-12">
                Répondre
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PAGE: artisan-certification — Certification N4
// ============================================================

export function ArtisanCertificationPage() {
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  const criteria = [
    { label: "50+ commandes livrées", value: 87, target: 50, ok: true },
    { label: "Note ≥ 4.5/5", value: 4.7, target: 4.5, ok: true },
    { label: "Taux complétion ≥ 90%", value: 94, target: 90, ok: true },
    { label: "12+ mois ancienneté", value: 36, target: 12, ok: true },
    { label: "Aucun litige non résolu", value: 0, target: 0, ok: false, pending: true },
  ];
  const benefits = ["Avance 70%", "Priorité maximale", "Accès B2B", "Support <2h"];
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [processDesc, setProcessDesc] = useState("");

  const eligible = criteria.filter((c) => c.ok).length === criteria.length - 1 && criteria.some((c) => c.pending);

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <header>
        <h1 className="display-lg mb-1">Certification N4</h1>
        <p className="text-sm text-[var(--text-2)]">Le plus haut niveau de confiance Dedco</p>
      </header>

      {/* Hero banner */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "var(--text-1)" }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <Award size={32} className="text-[var(--amber)]" />
            <div>
              <h2 className="font-display font-bold text-xl">Certification Niveau 4</h2>
              <p className="text-sm opacity-80">Certifié Plateforme</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {benefits.map((b) => (
              <div key={b} className="text-center bg-white/10 rounded-lg p-2">
                <p className="text-xs font-semibold">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility checker */}
      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-4">Critères d'éligibilité</h3>
        <ul className="space-y-3">
          {criteria.map((c) => (
            <li key={c.label} className="flex items-center gap-3">
              {c.ok ? (
                <CheckCircle2 size={20} className="text-[var(--forest)] flex-shrink-0" />
              ) : c.pending ? (
                <Circle size={20} className="text-[var(--amber)] flex-shrink-0" />
              ) : (
                <Circle size={20} className="text-[var(--text-3)] flex-shrink-0" />
              )}
              <span className="flex-1 text-sm">{c.label}</span>
              <span className="text-xs font-numeric font-semibold text-[var(--text-2)]">
                {c.value}{c.label.includes("Note") ? "/5" : c.label.includes("mois") ? " mois" : c.label.includes("commandes") ? "" : c.label.includes("complétion") ? "%" : ""}
                {!c.ok && !c.pending && ` / ${c.target}`}
              </span>
            </li>
          ))}
        </ul>
        {eligible && (
          <div className="mt-4 p-3 bg-[var(--forest-pale)] rounded-md flex items-start gap-2">
            <CheckCircle2 size={18} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--forest)]">Vous êtes éligible ! Complétez votre demande ci-dessous.</p>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="dedco-card p-5 space-y-4">
        <h3 className="font-display font-bold">Dossier de demande</h3>
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">Photos de votre atelier (3 minimum)</label>
          <label className="block border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--amber)] transition-colors bg-card">
            <Upload size={24} className="mx-auto text-[var(--text-3)] mb-2" />
            <p className="text-sm font-semibold">Cliquez pour ajouter des photos</p>
            <p className="text-xs text-[var(--text-3)] mt-1">{uploadedPhotos.length}/3 ajoutées</p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const files = Array.from(e.target.files || []).slice(0, 5);
                setUploadedPhotos(files.map((f) => URL.createObjectURL(f)));
              }}
            />
          </label>
        </div>
        <div>
          <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">Décrivez votre processus de création (max 450 caractères)</label>
          <textarea
            value={processDesc}
            onChange={(e) => setProcessDesc(e.target.value.slice(0, 450))}
            rows={5}
            placeholder="Expliquez votre approche, vos matières premières, vos techniques, votre contrôle qualité..."
            className="w-full px-3 py-2.5 text-sm border border-[var(--border)] rounded-md bg-card focus:outline-none focus:border-[var(--amber)] resize-none"
          />
          <p className="text-xs text-[var(--text-3)] mt-1 text-right font-numeric">{processDesc.length}/450</p>
        </div>
        <button onClick={() => showToast("Demande de passage au niveau N4 soumise. Réponse sous 5 jours ouvrés.")} className="dedco-btn dedco-btn-primary w-full">
          <Award size={16} /> Soumettre ma demande N4
        </button>
        <p className="text-xs text-[var(--text-3)] text-center">Délai de review : 7 jours</p>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: artisan-abonnement — Plans et abonnements
// ============================================================

export function ArtisanAbonnementPage() {
  const navigate = useDedcoStore((s) => s.navigate);

  const plans = [
    {
      id: "gratuit",
      name: "Gratuit",
      price: 0,
      features: ["3 produits max", "Profil basique", "Résultats standard", "Wallet Mobile Money"],
      highlighted: false,
      current: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 5000,
      features: ["Produits illimités", "Priorité +15%", "Badge Pro", "Stats avancées", "Support prioritaire"],
      highlighted: true,
      current: true,
    },
    {
      id: "boutique",
      name: "Boutique",
      price: 15000,
      features: ["Page marque", "20 produits max", "Messagerie client", "Collections dédiées", "B2B Phase 3"],
      highlighted: false,
      current: false,
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
      <header>
        <h1 className="display-lg mb-1">Abonnement</h1>
        <p className="text-sm text-[var(--text-2)]">Choisissez le plan adapté à votre activité</p>
      </header>

      <div className="dedco-card p-4 bg-[var(--amber-pale)] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CreditCard size={18} className="text-[var(--amber)]" />
          <p className="text-sm font-semibold">Prochain prélèvement : 15 juillet · 5 000 FCFA (Pro)</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`dedco-card p-5 relative ${
              plan.highlighted ? "border-2 border-[var(--amber)]" : ""
            }`}
          >
            {plan.current && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 dedco-badge dedco-badge-amber-solid">
                Votre plan actuel
              </span>
            )}
            <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
            <p className="font-display font-bold text-2xl sm:text-3xl mb-4">
              <span className="font-numeric">{plan.price === 0 ? "0" : plan.price.toLocaleString("fr-FR")}</span>
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
            <button onClick={() => navigate({ page: "home" })}
              className={`dedco-btn w-full ${plan.current ? "dedco-btn-ghost" : plan.highlighted ? "dedco-btn-primary" : "dedco-btn-secondary"}`}
              disabled={plan.current}
            >
              {plan.current ? "Plan actuel" : plan.price === 0 ? "Passer en Gratuit" : `Passer en ${plan.name}`}
            </button>
          </div>
        ))}
      </div>

      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-3">Comparatif détaillé</h3>
        <div className="overflow-x-auto dedco-hide-scroll">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 pr-4 font-medium text-[var(--text-2)]">Fonctionnalité</th>
                <th className="text-center py-2 px-3 font-medium text-[var(--text-2)]">Gratuit</th>
                <th className="text-center py-2 px-3 font-medium text-[var(--amber)]">Pro</th>
                <th className="text-center py-2 px-3 font-medium text-[var(--text-2)]">Boutique</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Produits max", "3", "Illimité", "20"],
                ["Priorité recherche", "Standard", "+15%", "+25%"],
                ["Badge", "—", "Pro", "Boutique"],
                ["Stats avancées", "—", "Oui", "Oui"],
                ["Page marque", "—", "—", "Oui"],
                ["Accès B2B", "—", "—", "Phase 3"],
              ].map((row) => (
                <tr key={row[0]} className="border-b border-[var(--border)]">
                  <td className="py-2 pr-4">{row[0]}</td>
                  <td className="text-center py-2 px-3 text-[var(--text-2)] font-numeric">{row[1]}</td>
                  <td className="text-center py-2 px-3 font-semibold text-[var(--amber-dark)] font-numeric">{row[2]}</td>
                  <td className="text-center py-2 px-3 text-[var(--text-2)] font-numeric">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: artisan-parametres — Paramètres artisan
// ============================================================

export function ArtisanParametresPage() {
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  const [notifEmail, setNotifEmail] = useState({
    brief: true,
    commande: true,
    avis: true,
    paiement: true,
    abonnement: false,
  });
  const [notifPush, setNotifPush] = useState({
    brief: true,
    commande: true,
    avis: false,
    paiement: true,
    abonnement: false,
  });

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-5">
      <header>
        <h1 className="display-lg mb-1">Paramètres</h1>
        <p className="text-sm text-[var(--text-2)]">Gérez votre profil et préférences</p>
      </header>

      {/* Profil atelier */}
      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-4">Profil atelier</h3>
        <div className="flex items-center gap-4 mb-4">
          <img src={ARTISANS[0].avatar} alt="Atelier" className="w-16 h-16 rounded-full object-cover" />
          <button onClick={() => showToast("Sélectionnez une nouvelle photo de profil.")} className="dedco-btn dedco-btn-ghost dedco-btn-sm">
            <Upload size={14} /> Changer
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Nom atelier</label>
            <input defaultValue="Atelier Akindélé Wood" className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card focus:outline-none focus:border-[var(--amber)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Ville</label>
            <input defaultValue="Cotonou" className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card focus:outline-none focus:border-[var(--amber)]" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Téléphone</label>
            <PhoneInput value="+229 01 97 45 23 10" onChange={() => {}} className="w-full" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Spécialités (max 3)</label>
            <div className="flex gap-1.5 flex-wrap">
              {["Ébénisterie", "Menuiserie", "Wax"].map((s) => (
                <span key={s} className="dedco-badge dedco-badge-amber">{s}</span>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Bio (300 caractères max)</label>
            <textarea defaultValue="Maître ébéniste formé à Cotonou et Accra, je crée des meubles qui marient les essences locales et les techniques traditionnelles avec un design contemporain." rows={3} maxLength={300} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-card focus:outline-none focus:border-[var(--amber)] resize-none" />
          </div>
        </div>
      </div>

      {/* Sécurité */}
      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-4">Sécurité</h3>
        <button onClick={() => showToast("Email de réinitialisation envoyé.")} className="dedco-btn dedco-btn-ghost w-full sm:w-auto">
          <Lock size={14} /> Changer mon mot de passe
        </button>
      </div>

      {/* Notifications */}
      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-4">Notifications</h3>
        <div className="space-y-2">
          {[
            { id: "brief", label: "Nouveau brief reçu", icon: <Inbox size={16} /> },
            { id: "commande", label: "Statut commande", icon: <ShoppingBag size={16} /> },
            { id: "avis", label: "Avis reçu", icon: <Star size={16} /> },
            { id: "paiement", label: "Paiement reçu", icon: <CreditCard size={16} /> },
            { id: "abonnement", label: "Renouvellement abonnement", icon: <Bell size={16} /> },
          ].map((n) => (
            <div key={n.id} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-[var(--text-3)]">{n.icon}</span>
                <span className="text-sm">{n.label}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifEmail[n.id as keyof typeof notifEmail]}
                    onChange={(e) => setNotifEmail({ ...notifEmail, [n.id]: e.target.checked })}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--amber)" }}
                  />
                  <Mail size={12} /> Email
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifPush[n.id as keyof typeof notifPush]}
                    onChange={(e) => setNotifPush({ ...notifPush, [n.id]: e.target.checked })}
                    className="w-4 h-4"
                    style={{ accentColor: "var(--amber)" }}
                  />
                  <Bell size={12} /> Push
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => showToast("Modifications enregistrées.")} className="dedco-btn dedco-btn-primary w-full sticky bottom-4">
        <Save size={16} /> Enregistrer les modifications
      </button>
    </div>
  );
}

// ============================================================
// Shared EmptyState
// ============================================================

function EmptyState({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="dedco-card p-12 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--bg-warm)] mx-auto flex items-center justify-center mb-4 text-[var(--text-3)]">
        {icon}
      </div>
      <p className="font-display font-semibold text-lg mb-1">{title}</p>
      <p className="text-sm text-[var(--text-2)]">{desc}</p>
    </div>
  );
}
