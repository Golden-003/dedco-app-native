"use client";

import { useState } from "react";
import {
  UserCheck,
  Flag,
  Scale,
  Image as ImageIcon,
  Layers,
  Award,
  Settings,
  Check,
  X,
  ChevronRight,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Save,
  Search,
  Plus,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { ARTISANS, formatFCFA } from "@/lib/dedco-data";

// ============================================================
// PAGE: admin-kyc — Validation KYC
// ============================================================

type KYCDossier = {
  id: string;
  name: string;
  type: "artisan" | "designer" | "maison";
  submittedAt: string;
  waitTime: string;
  photos: { selfie: string; idFront: string; idBack: string };
  data: { nom: string; prenom: string; birth: string; idNumber: string };
};

const MOCK_KYC: KYCDossier[] = [
  {
    id: "KYC-001",
    name: "Kossi Adjigblé",
    type: "artisan",
    submittedAt: "Il y a 2h",
    waitTime: "2h",
    photos: {
      selfie: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=400&q=80",
      idFront: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=400&q=80",
      idBack: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=400&q=80",
    },
    data: { nom: "ADJIGBLÉ", prenom: "Kossi", birth: "12/03/1988", idNumber: "CI-BJ-0012345" },
  },
  {
    id: "KYC-002",
    name: "Mariam Touré",
    type: "designer",
    submittedAt: "Il y a 4h",
    waitTime: "4h",
    photos: {
      selfie: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&w=400&q=80",
      idFront: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=400&q=80",
      idBack: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=400&q=80",
    },
    data: { nom: "TOURÉ", prenom: "Mariam", birth: "25/11/1992", idNumber: "PS-BJ-0067890" },
  },
  {
    id: "KYC-003",
    name: "Atelier Bohème",
    type: "maison",
    submittedAt: "Hier",
    waitTime: "1j",
    photos: {
      selfie: "https://images.unsplash.com/photo-1533674689012-136b487b7736?auto=format&fit=crop&w=400&q=80",
      idFront: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=400&q=80",
      idBack: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=400&q=80",
    },
    data: { nom: "BOHÈME", prenom: "Atelier SARL", birth: "15/06/2020", idNumber: "RCCM-BJ-2020-0456" },
  },
];

export function AdminKYCPage() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [decision, setDecision] = useState<"approve" | "reject" | "corrections">("approve");
  const selected = MOCK_KYC[selectedIdx];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="display-lg mb-1">Validation KYC</h1>
          <p className="text-sm text-[var(--text-2)]">
            <span className="font-numeric font-semibold">{MOCK_KYC.length}</span> dossiers en attente · Refresh il y a 5 min
          </p>
        </div>
        <span className="dedco-badge dedco-badge-amber-solid">{MOCK_KYC.length} en attente</span>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Dossier principal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="dedco-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-bold text-lg">{selected.name}</h2>
                <p className="text-xs text-[var(--text-3)] font-numeric">{selected.id} · Soumis {selected.submittedAt}</p>
              </div>
              <span className="dedco-badge dedco-badge-amber">{selected.type}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Selfie", src: selected.photos.selfie },
                { label: "Pièce recto", src: selected.photos.idFront },
                { label: "Pièce verso", src: selected.photos.idBack },
              ].map((p) => (
                <div key={p.label}>
                  <img src={p.src} alt={p.label} className="w-full aspect-[3/4] object-cover rounded-lg border border-[var(--border)]" />
                  <p className="text-xs text-center text-[var(--text-3)] mt-1">{p.label}</p>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t border-[var(--border)]">
              {Object.entries(selected.data).map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-[var(--text-3)] uppercase tracking-wide">{k}</p>
                  <p className="text-sm font-medium font-numeric">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Autres dossiers */}
          <div className="dedco-card p-4">
            <h3 className="font-display font-bold text-sm mb-3">Autres dossiers en attente</h3>
            <ul className="space-y-2">
              {MOCK_KYC.map((d, i) => (
                <li
                  key={d.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    i === selectedIdx ? "bg-[var(--amber-pale)]" : "hover:bg-[var(--bg-warm)]"
                  }`}
                  onClick={() => setSelectedIdx(i)}
                >
                  <div className="w-9 h-9 rounded-full bg-[var(--bg-warm)] flex items-center justify-center text-xs font-bold uppercase">
                    {d.name.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{d.name}</p>
                    <p className="text-xs text-[var(--text-3)] font-numeric">{d.type} · {d.waitTime}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => showToast("Action effectuée.")} className="w-7 h-7 rounded-full bg-[var(--forest-pale)] text-[var(--forest)] flex items-center justify-center hover:bg-[var(--forest)] hover:text-white">
                      <Check size={14} />
                    </button>
                    <button onClick={() => showToast("Action effectuée.")} className="w-7 h-7 rounded-full bg-[var(--terracotta-pale)] text-[var(--terracotta)] flex items-center justify-center hover:bg-[var(--terracotta)] hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Panel décision */}
        <div className="dedco-card p-5 h-fit sticky top-4">
          <h3 className="font-display font-bold mb-4">Décision</h3>
          <div className="space-y-2 mb-4">
            {[
              { id: "approve", label: "Approuver", color: "var(--forest)" },
              { id: "reject", label: "Rejeter", color: "var(--terracotta)" },
              { id: "corrections", label: "Demander corrections", color: "var(--amber)" },
            ].map((d) => (
              <label key={d.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-[var(--bg-warm)]">
                <input
                  type="radio"
                  name="decision"
                  checked={decision === d.id}
                  onChange={() => setDecision(d.id as typeof decision)}
                  className="w-4 h-4"
                  style={{ accentColor: d.color }}
                />
                <span className="text-sm font-medium">{d.label}</span>
              </label>
            ))}
          </div>
          {decision === "reject" && (
            <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white mb-3">
              <option>Raison du rejet...</option>
              <option>Selfie illisible</option>
              <option>Pièce d'identité expirée</option>
              <option>Information incohérente</option>
              <option>Fraude suspectée</option>
            </select>
          )}
          {decision === "corrections" && (
            <textarea
              rows={3}
              placeholder="Précisez les corrections attendues..."
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white mb-3 resize-none"
            />
          )}
          <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary w-full">Valider la décision</button>
          <p className="text-xs text-[var(--text-3)] text-center mt-2">Notification email + SMS envoyée automatiquement</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: admin-messages — Messages flaggés
// ============================================================

type FlaggedMsg = {
  id: string;
  date: string;
  sender: string;
  senderAvatar: string;
  recipient: string;
  reason: "phone" | "url" | "whatsapp" | "keyword";
  preview: string;
  full: string;
  context: string[];
  status: "pending" | "resolved";
};

const MOCK_MSGS: FlaggedMsg[] = [
  {
    id: "MSG-001", date: "Il y a 1h", sender: "Kofi Akindélé", senderAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=80&q=80",
    recipient: "Sophie Kossou", reason: "phone",
    preview: "Appelez-moi au +229 97 45 23 10 pour discuter",
    full: "Bonjour Sophie, merci pour votre intérêt. Appelez-moi au +229 97 45 23 10 pour discuter directement du projet, ce sera plus simple.",
    context: ["Bonjour ! J'ai bien reçu votre brief.", "Merci, avez-vous des questions ?", "Appelez-moi au +229 97 45 23 10..."],
    status: "pending",
  },
  {
    id: "MSG-002", date: "Il y a 3h", sender: "Brice Gogan", senderAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80",
    recipient: "Marc Adjovi", reason: "whatsapp",
    preview: "Mon WhatsApp : +229 96 12 34 56",
    full: "Pour aller plus vite, voici mon WhatsApp : +229 96 12 34 56. On peut s'appeler en vidéo.",
    context: ["Bonjour Marc", "Voici mon WhatsApp : +229 96 12 34 56"],
    status: "pending",
  },
  {
    id: "MSG-003", date: "Hier", sender: "Aïcha Monteiro", senderAvatar: "https://images.unsplash.com/photo-1743871698163-a2e470d8eac7?auto=format&fit=crop&w=80&q=80",
    recipient: "Lucie Bokossa", reason: "url",
    preview: "Voir mon site : https://aicha-textiles.bj",
    full: "Vous pouvez voir plus de mes créations sur mon site externe : https://aicha-textiles.bj",
    context: ["Bonjour Aïcha", "Voir mon site : https://aicha-textiles.bj"],
    status: "pending",
  },
  {
    id: "MSG-004", date: "Il y a 2j", sender: "Fatou Loko", senderAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&w=80&q=80",
    recipient: "Paul Hounkpatin", reason: "phone",
    preview: "Tel: 229 97 45 23 10",
    full: "Tel: 229 97 45 23 10 — appel direct sans frais",
    context: ["Tel: 229 97 45 23 10"],
    status: "pending",
  },
];

const REASON_LABELS: Record<FlaggedMsg["reason"], { label: string; color: string }> = {
  phone: { label: "Téléphone", color: "var(--terracotta)" },
  url: { label: "URL externe", color: "var(--amber)" },
  whatsapp: { label: "WhatsApp", color: "var(--forest)" },
  keyword: { label: "Mot-clé suspect", color: "var(--terracotta)" },
};

export function AdminMessagesPage() {
  const [filter, setFilter] = useState<"tous" | "phone" | "url" | "resolved">("tous");
  const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = filter === "tous" ? MOCK_MSGS.filter((m) => m.status === "pending") : filter === "resolved" ? MOCK_MSGS.filter((m) => m.status === "resolved") : MOCK_MSGS.filter((m) => m.reason === filter && m.status === "pending");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="display-lg mb-1">Messages signalés</h1>
          <p className="text-sm text-[var(--text-2)] font-numeric">{MOCK_MSGS.filter((m) => m.status === "pending").length} à reviewer</p>
        </div>
      </header>

      <div className="flex gap-2 mb-4 overflow-x-auto dedco-hide-scroll -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: "tous", label: "Tous" },
          { id: "phone", label: "Coordonnées" },
          { id: "url", label: "URL externe" },
          { id: "resolved", label: "Résolu" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as typeof filter)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap border transition-all ${
              filter === t.id ? "bg-[var(--ink)] text-white border-[var(--ink)]" : "bg-white border-[var(--border)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((m) => (
          <div key={m.id} className="dedco-card overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === m.id ? null : m.id)}
              className="w-full p-4 flex items-center gap-3 text-left hover:bg-[var(--bg-warm)] transition-colors"
            >
              <img src={m.senderAvatar} alt={m.sender} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0 grid grid-cols-5 gap-3 items-center">
                <div className="col-span-2 min-w-0">
                  <p className="text-sm font-medium truncate">{m.sender} → {m.recipient}</p>
                  <p className="text-xs text-[var(--text-3)] font-numeric">{m.date}</p>
                </div>
                <div className="col-span-2 min-w-0">
                  <span className="dedco-badge" style={{ backgroundColor: REASON_LABELS[m.reason].color + "20", color: REASON_LABELS[m.reason].color }}>
                    {REASON_LABELS[m.reason].label}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-2)] truncate col-span-1">{m.preview}</p>
              </div>
            </button>
            {expanded === m.id && (
              <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-warm)]/50">
                <div className="mb-3 p-3 bg-white rounded-md border-l-2 border-[var(--terracotta)]">
                  <p className="text-xs text-[var(--text-3)] mb-1">Message complet :</p>
                  <p className="text-sm">{m.full}</p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-[var(--text-3)] mb-1">Contexte (messages autour) :</p>
                  <ul className="space-y-1">
                    {m.context.map((c, i) => (
                      <li key={i} className="text-xs text-[var(--text-2)] p-2 bg-white rounded">"{c}"</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => navigate({ page: "litige", id: "REC-default" })} className="dedco-btn dedco-btn-terracotta dedco-btn-sm">
                    <AlertTriangle size={14} /> Confirmer violation
                  </button>
                  <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-ghost dedco-btn-sm">Faux positif</button>
                  <button onClick={() => showToast("Action effectuée.")} className="dedco-btn dedco-btn-terracotta dedco-btn-sm" style={{ background: "var(--ink)", borderColor: "var(--ink)" }}>
                    <X size={14} /> Bannir utilisateur
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PAGE: admin-litiges — Arbitrage litiges
// ============================================================

type Litige = {
  id: string;
  cmdRef: string;
  client: string;
  clientAvatar: string;
  artisan: string;
  artisanAvatar: string;
  type: "non_conforme" | "defaut" | "endommage" | "non_livre";
  amount: number;
  openedAt: string;
  echeance: string;
  status: "ouvert" | "negociation" | "arbitrage";
  desc: string;
  photos: { ordered: string; received: string };
};

const MOCK_LITIGES: Litige[] = [
  {
    id: "LIT-001", cmdRef: "CMD-001", client: "Sophie Kossou", clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&w=80&q=80",
    artisan: "Kofi Akindélé", artisanAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=80&q=80",
    type: "non_conforme", amount: 185000, openedAt: "15 jan", echeance: "22 jan", status: "arbitrage",
    desc: "La table basse reçue ne correspond pas aux dimensions commandées. 110cm au lieu de 120cm.",
    photos: {
      ordered: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=80",
      received: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=400&q=80",
    },
  },
  {
    id: "LIT-002", cmdRef: "CMD-003", client: "Marc Adjovi", clientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
    artisan: "Brice Gogan", artisanAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&w=80&q=80",
    type: "endommage", amount: 95000, openedAt: "12 jan", echeance: "19 jan", status: "ouvert",
    desc: "Miroir reçu fissuré pendant le transport.",
    photos: {
      ordered: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=400&q=80",
      received: "https://images.unsplash.com/photo-1468531390580-8b4e8531390580?auto=format&fit=crop&w=400&q=80",
    },
  },
  {
    id: "LIT-003", cmdRef: "CMD-005", client: "Lucie Bokossa", clientAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=80&q=80",
    artisan: "Amara Dossou", artisanAvatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&w=80&q=80",
    type: "defaut", amount: 76000, openedAt: "10 jan", echeance: "17 jan", status: "negociation",
    desc: "Tabouret avec assemblage bancal, нестабильный.",
    photos: {
      ordered: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=400&q=80",
      received: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=400&q=80",
    },
  },
];

const LITIGE_TYPES: Record<Litige["type"], { label: string; color: string }> = {
  non_conforme: { label: "Non conforme", color: "var(--terracotta)" },
  defaut: { label: "Défaut qualité", color: "var(--amber)" },
  endommage: { label: "Endommagé livraison", color: "var(--terracotta)" },
  non_livre: { label: "Non livré", color: "var(--ink)" },
};

export function AdminLitigesPage() {
  const [selected, setSelected] = useState<Litige | null>(null);
  const [decision, setDecision] = useState<"client_total" | "client_partiel" | "artisan" | "partage">("client_total");
  const [comment, setComment] = useState("");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="display-lg mb-1">Litiges actifs</h1>
          <p className="text-sm text-[var(--text-2)] font-numeric">{MOCK_LITIGES.length} litiges en cours</p>
        </div>
      </header>

      <div className="dedco-card p-3 mb-4 bg-[var(--terracotta-pale)] flex items-start gap-3">
        <AlertTriangle size={18} className="text-[var(--terracotta)] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[var(--text-2)]">Votre décision sera finale et s'imposera aux deux parties.</p>
      </div>

      <div className="space-y-2 mb-6">
        {MOCK_LITIGES.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelected(l)}
            className="w-full dedco-card p-4 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <div className="font-numeric text-xs text-[var(--text-3)]">{l.id}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  <span className="font-numeric">{l.cmdRef}</span> · {l.client} vs {l.artisan}
                </p>
                <p className="text-xs text-[var(--text-3)] font-numeric">Ouvert {l.openedAt} · Échéance {l.echeance}</p>
              </div>
              <span className="dedco-badge" style={{ backgroundColor: LITIGE_TYPES[l.type].color + "20", color: LITIGE_TYPES[l.type].color }}>
                {LITIGE_TYPES[l.type].label}
              </span>
              <span className="font-numeric font-bold text-[var(--amber)]">{formatFCFA(l.amount)}</span>
              <span className={`dedco-badge ${
                l.status === "ouvert" ? "dedco-badge-terra" :
                l.status === "negociation" ? "dedco-badge-amber" : "dedco-badge-dark"
              }`}>{l.status}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-[var(--bg-cream)] rounded-t-2xl sm:rounded-xl w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--bg-cream)] z-10">
              <div>
                <h2 className="font-display font-bold text-lg">{selected.id}</h2>
                <p className="text-xs text-[var(--text-3)] font-numeric">{selected.cmdRef} · Ouvert {selected.openedAt}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-[var(--bg-warm)]">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Parties impliquées</p>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={selected.clientAvatar} alt={selected.client} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">{selected.client}</p>
                      <p className="text-xs text-[var(--text-3)]">Client</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src={selected.artisanAvatar} alt={selected.artisan} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="text-sm font-medium">{selected.artisan}</p>
                      <p className="text-xs text-[var(--text-3)]">Artisan</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Photos preuves</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <img src={selected.photos.ordered} alt="Commandé" className="w-full aspect-square object-cover rounded-md" />
                      <p className="text-[10px] text-[var(--text-3)] text-center mt-1">Commandé</p>
                    </div>
                    <div>
                      <img src={selected.photos.received} alt="Reçu" className="w-full aspect-square object-cover rounded-md" />
                      <p className="text-[10px] text-[var(--text-3)] text-center mt-1">Reçu</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Description du problème</p>
                <p className="text-sm p-3 bg-[var(--bg-warm)] rounded-md">{selected.desc}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Décision</p>
                <div className="space-y-2">
                  {[
                    { id: "client_total", label: "Client raison total — 100% remboursé" },
                    { id: "client_partiel", label: "Client raison partiel — Remboursement Y%" },
                    { id: "artisan", label: "Artisan raison — Solde débloqué" },
                    { id: "partage", label: "Partage responsabilité — 50/50" },
                  ].map((d) => (
                    <label key={d.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-[var(--bg-warm)] cursor-pointer">
                      <input
                        type="radio"
                        name="litige-decision"
                        checked={decision === d.id}
                        onChange={() => setDecision(d.id as typeof decision)}
                        className="w-4 h-4"
                        style={{ accentColor: "var(--amber)" }}
                      />
                      <span className="text-sm">{d.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">Commentaire (requis)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder="Justifiez votre décision..."
                  className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
              <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary w-full">Valider la décision</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE: admin-scenes — Éditeur Scènes & Hotspots
// ============================================================

export function AdminScenesPage() {
  const [selectedScene, setSelectedScene] = useState(0);
  const [hotspots, setHotspots] = useState([
    { x: 30, y: 55, productId: 2, label: "Fauteuil Sahel", price: 245000 },
    { x: 55, y: 70, productId: 1, label: "Table basse Wax", price: 185000 },
    { x: 75, y: 45, productId: 3, label: "Lampe Bogolan", price: 68000 },
  ]);
  const scenes = [
    { id: 1, title: "Salon Terracotta & Wax", status: "Publiée", img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=400&q=80" },
    { id: 2, title: "Chambre Zen Bambou", status: "Publiée", img: "https://images.unsplash.com/photo-1655276602527-ca7c0c44d6de?auto=format&fit=crop&w=400&q=80" },
    { id: 3, title: "Bureau Laiton & Bois", status: "Brouillon", img: "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?auto=format&fit=crop&w=400&q=80" },
    { id: 4, title: "Cuisine Terre Cuite", status: "Publiée", img: "https://images.unsplash.com/photo-1656402887556-e727ffe1f6d7?auto=format&fit=crop&w=400&q=80" },
    { id: 5, title: "Entrée Sculpturale", status: "Brouillon", img: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=400&q=80" },
    { id: 6, title: "Salon Méditerranée", status: "Publiée", img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="display-lg mb-1">Éditeur Scènes & Hotspots</h1>
        <p className="text-sm text-[var(--text-2)]">Créez et éditez les scènes Shop the Look</p>
      </header>

      <div className="grid lg:grid-cols-[280px_1fr_280px] gap-4">
        {/* Liste scènes */}
        <div className="dedco-card p-3">
          <h3 className="text-xs uppercase tracking-wide text-[var(--text-3)] mb-3 px-2">Scènes ({scenes.length})</h3>
          <ul className="space-y-1">
            {scenes.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => setSelectedScene(i)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors text-left ${
                    i === selectedScene ? "bg-[var(--amber-pale)]" : "hover:bg-[var(--bg-warm)]"
                  }`}
                >
                  <img src={s.img} alt={s.title} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{s.title}</p>
                    <span className={`text-[10px] ${s.status === "Publiée" ? "text-[var(--forest)]" : "text-[var(--text-3)]"}`}>
                      {s.status}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Éditeur central */}
        <div className="dedco-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="dedco-badge dedco-badge-amber">Mode édition</span>
              <p className="text-sm font-display font-semibold">{scenes[selectedScene].title}</p>
            </div>
          </div>
          <div
            className="relative w-full bg-[var(--bg-warm)] rounded-lg overflow-hidden cursor-crosshair"
            style={{ aspectRatio: "4/3" }}
          >
            <img src={scenes[selectedScene].img} alt="" className="w-full h-full object-cover" />
            {hotspots.map((h, i) => (
              <div
                key={i}
                className="absolute w-7 h-7 rounded-full bg-white border-2 border-[var(--amber)] flex items-center justify-center text-xs font-bold text-[var(--amber)] hotspot-dot"
                style={{ left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%, -50%)" }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-[var(--text-3)] mt-2">
            Hotspots actifs : <span className="font-numeric font-semibold text-[var(--forest)]">{hotspots.length}/3 (OK)</span> (minimum 2 requis)
          </p>
        </div>

        {/* Panel hotspot */}
        <div className="dedco-card p-4">
          <h3 className="font-display font-bold text-sm mb-3">Hotspot sélectionné</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1 block">Coordonnées</label>
              <div className="grid grid-cols-2 gap-2">
                <input value="30%" readOnly className="px-2 py-1.5 text-xs border border-[var(--border)] rounded-md bg-white font-numeric" />
                <input value="55%" readOnly className="px-2 py-1.5 text-xs border border-[var(--border)] rounded-md bg-white font-numeric" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1 block">Produit</label>
              <div className="relative">
                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
                <input defaultValue="Fauteuil Sahel Tressé" className="w-full pl-7 pr-2 py-1.5 text-xs border border-[var(--border)] rounded-md bg-white" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1 block">Prix</label>
              <input value="245 000 FCFA" readOnly className="w-full px-2 py-1.5 text-xs border border-[var(--border)] rounded-md bg-[var(--bg-warm)] font-numeric" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1 block">Statut stock</label>
              <span className="dedco-badge dedco-badge-forest">En stock (5)</span>
            </div>
            <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary w-full dedco-btn-sm">Sauvegarder hotspot</button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-5">
        <button onClick={() => showToast("Action effectuée.")} className="dedco-btn dedco-btn-ghost dedco-btn-sm">
          <Eye size={14} /> Aperçu
        </button>
        <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-ghost dedco-btn-sm">Enregistrer brouillon</button>
        <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary dedco-btn-sm">Publier la scène</button>
        <button onClick={() => showToast("Élément supprimé.")} className="dedco-btn dedco-btn-terracotta dedco-btn-sm">
          <Trash2 size={14} /> Supprimer
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PAGE: admin-collections — Collections éditoriales
// ============================================================

export function AdminCollectionsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const collections = [
    { id: 1, title: "Ambiances naturelles", count: 12, status: "Publiée", img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Artisans d'Abomey", count: 8, status: "Publiée", img: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "Bureau contemporain", count: 6, status: "Brouillon", img: "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Décor de fête", count: 10, status: "Publiée", img: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=600&q=80" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="display-lg mb-1">Collections éditoriales</h1>
          <p className="text-sm text-[var(--text-2)] font-numeric">{collections.length} collections</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="dedco-btn dedco-btn-primary">
          <Plus size={16} /> Créer une collection
        </button>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((c) => (
          <div key={c.id} className="dedco-card overflow-hidden group">
            <div className="relative aspect-[16/7] overflow-hidden">
              <img src={c.img} alt={c.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(30,24,19,0.8), transparent 60%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-display font-bold text-lg">{c.title}</h3>
                <p className="text-xs opacity-80 font-numeric">{c.count} pièces</p>
              </div>
              <span className={`absolute top-2 right-2 dedco-badge ${c.status === "Publiée" ? "dedco-badge-forest" : "dedco-badge-gray"}`}>
                {c.status}
              </span>
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button onClick={() => showToast("Action effectuée.")} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[var(--ink)] hover:bg-white">
                  <Edit size={14} />
                </button>
                <button onClick={() => showToast("Action effectuée.")} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[var(--ink)] hover:bg-white">
                  <Eye size={14} />
                </button>
                <button onClick={() => showToast("Image supprimée.")} className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[var(--terracotta)] hover:bg-white">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50" onClick={() => setShowCreate(false)}>
          <div className="bg-[var(--bg-cream)] rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
              <h2 className="font-display font-bold text-lg">Nouvelle collection</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 rounded-full hover:bg-[var(--bg-warm)]"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Titre</label>
                <input className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white focus:outline-none focus:border-[var(--amber)]" placeholder="Ex : Ambiances naturelles" />
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Description (200 chars max)</label>
                <textarea rows={3} maxLength={200} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none focus:outline-none focus:border-[var(--amber)]" />
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Photo de couverture</label>
                <label className="block border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center cursor-pointer hover:border-[var(--amber)] bg-white">
                  <ImageIcon size={24} className="mx-auto text-[var(--text-3)] mb-2" />
                  <p className="text-xs">Cliquez pour uploader</p>
                  <input type="file" accept="image/*" className="sr-only" />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Thème</label>
                  <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white">
                    <option>Naturel</option>
                    <option>Contemporain</option>
                    <option>Africain</option>
                    <option>Bohème</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Style</label>
                  <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white">
                    <option>Minimaliste</option>
                    <option>Tropical</option>
                    <option>Industriel</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Produits associés</label>
                <div className="relative">
                  <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--text-3)]" />
                  <input className="w-full pl-7 pr-2 py-2 text-sm border border-[var(--border)] rounded-md bg-white" placeholder="Rechercher un produit..." />
                </div>
              </div>
              <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary w-full">Créer la collection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE: admin-certification — Review Certification N4
// ============================================================

export function AdminCertificationPage() {
  const candidates = [
    {
      id: "CAND-001", name: "Romuald Azonsi", city: "Cotonou", avatar: "https://images.unsplash.com/photo-1533108344127-a586d2b02479?auto=format&fit=crop&w=120&q=80",
      level: "N3", commands: 71, rating: 4.9, completion: 92, months: 11,
      workshopPhotos: [
        "https://images.unsplash.com/photo-1693578616322-c8abe6c7393d?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=400&q=80",
      ],
      process: "Je travaille le bois local avec des techniques traditionnelles apprise à Cotonou. Chaque pièce est unique, contrôlée à chaque étape.",
    },
    {
      id: "CAND-002", name: "Kofi Akindélé", city: "Cotonou", avatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=120&q=80",
      level: "N3", commands: 87, rating: 4.9, completion: 95, months: 36,
      workshopPhotos: [
        "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=400&q=80",
      ],
      process: "Maître ébéniste avec 12 ans d'expérience. Atelier de 8 artisans formés à Cotonou. Sourcing bois local durable.",
    },
  ];
  const [selected, setSelected] = useState<typeof candidates[0] | null>(null);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="display-lg mb-1">Demandes Certification N4</h1>
        <p className="text-sm text-[var(--text-2)] font-numeric">{candidates.length} candidats en attente</p>
      </header>

      <div className="space-y-3 mb-6">
        {candidates.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            className="w-full dedco-card p-4 text-left hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 flex-wrap">
              <img src={c.avatar} alt={c.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-semibold">{c.name}</p>
                  <span className="dedco-badge dedco-badge-amber">N3</span>
                </div>
                <p className="text-xs text-[var(--text-3)]">{c.city}</p>
              </div>
              <div className="flex gap-3 text-xs">
                <div className="text-center">
                  <p className="font-numeric font-bold">{c.commands}</p>
                  <p className="text-[var(--text-3)]">commandes</p>
                </div>
                <div className="text-center">
                  <p className="font-numeric font-bold">{c.rating}/5</p>
                  <p className="text-[var(--text-3)]">note</p>
                </div>
                <div className="text-center">
                  <p className="font-numeric font-bold">{c.completion}%</p>
                  <p className="text-[var(--text-3)]">complétion</p>
                </div>
              </div>
              <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-primary dedco-btn-sm">Examiner</button>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50" onClick={() => setSelected(null)}>
          <div className="bg-[var(--bg-cream)] w-full max-w-md h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--bg-cream)] z-10">
              <h2 className="font-display font-bold">{selected.name}</h2>
              <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-[var(--bg-warm)]"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-5">
              <div>
                <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Critères</p>
                <ul className="space-y-1.5">
                  {[
                    { label: "50+ commandes livrées", ok: selected.commands >= 50 },
                    { label: "Note ≥ 4.5/5", ok: selected.rating >= 4.5 },
                    { label: "Taux complétion ≥ 90%", ok: selected.completion >= 90 },
                    { label: "12+ mois ancienneté", ok: selected.months >= 12 },
                  ].map((c) => (
                    <li key={c.label} className="flex items-center gap-2 text-sm">
                      {c.ok ? <Check size={16} className="text-[var(--forest)]" /> : <X size={16} className="text-[var(--terracotta)]" />}
                      {c.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Photos atelier ({selected.workshopPhotos.length})</p>
                <div className="grid grid-cols-2 gap-2">
                  {selected.workshopPhotos.map((p, i) => (
                    <img key={i} src={p} alt="" className="w-full aspect-square object-cover rounded-md" />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2">Description processus</p>
                <p className="text-sm p-3 bg-[var(--bg-warm)] rounded-md">{selected.process}</p>
              </div>
              <div>
                <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-2 block">Commentaire interne (admin)</label>
                <textarea rows={3} className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white resize-none" />
              </div>
              <div className="space-y-2">
                <button onClick={() => showToast("Action effectuée.")} className="dedco-btn dedco-btn-forest w-full">
                  <Check size={16} /> Certifier N4
                </button>
                <button onClick={() => navigate({ page: "client-projets" })} className="dedco-btn dedco-btn-terracotta w-full">
                  <X size={16} /> Refuser + motif
                </button>
                <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-ghost w-full">Demander infos complémentaires</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAGE: admin-parametres — Paramètres plateforme
// ============================================================

export function AdminParametresPage() {
  const [commission, setCommission] = useState(10);
  const [fondsGarantie, setFondsGarantie] = useState(1.5);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
      <header>
        <h1 className="display-lg mb-1">Paramètres plateforme</h1>
        <p className="text-sm text-[var(--text-2)]">Configuration globale de Dedco</p>
      </header>

      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-4">Config générale</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Nom plateforme</label>
            <input defaultValue="Dedco" className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Email support</label>
            <input defaultValue="support@dedco.bj" className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white" />
          </div>
          <label className="flex items-center justify-between p-3 bg-[var(--bg-warm)] rounded-md cursor-pointer">
            <div>
              <p className="text-sm font-medium">Mode maintenance</p>
              <p className="text-xs text-[var(--text-3)]">Bloque l'accès public, admin reste accessible</p>
            </div>
            <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} className="w-5 h-5" style={{ accentColor: "var(--terracotta)" }} />
          </label>
          {maintenance && (
            <input placeholder="Message affiché aux utilisateurs..." className="w-full px-3 py-2 text-sm border border-[var(--terracotta)] rounded-md bg-white" />
          )}
        </div>
      </div>

      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-4">Paiements</h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">
              Commission plateforme : <span className="font-numeric font-bold text-[var(--amber)]">{commission}%</span>
            </label>
            <input type="range" min={5} max={20} step={0.5} value={commission} onChange={(e) => setCommission(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--amber)" }} />
          </div>
          <div>
            <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">
              Fonds de garantie : <span className="font-numeric font-bold text-[var(--amber)]">{fondsGarantie}%</span>
            </label>
            <input type="range" min={0.5} max={3} step={0.1} value={fondsGarantie} onChange={(e) => setFondsGarantie(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--amber)" }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Seuil retrait min (FCFA)</label>
              <input defaultValue={10000} type="number" className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white font-numeric" />
            </div>
            <div>
              <label className="text-xs text-[var(--text-3)] uppercase tracking-wide mb-1.5 block">Délai libération fonds</label>
              <select className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-md bg-white">
                <option>4 jours</option>
                <option>5 jours</option>
                <option>7 jours</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="dedco-card p-5">
        <h3 className="font-display font-bold mb-3">Maintenance technique</h3>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-ghost dedco-btn-sm">Vider le cache</button>
          <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-ghost dedco-btn-sm">Resync base</button>
          <button onClick={() => navigate({ page: "home" })} className="dedco-btn dedco-btn-ghost dedco-btn-sm">Voir logs (1h)</button>
        </div>
      </div>

      <button onClick={() => showToast("Modifications enregistrées.")} className="dedco-btn dedco-btn-primary w-full sticky bottom-4">
        <Save size={16} /> Enregistrer les modifications
      </button>

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
