"use client";

import { useState } from "react";
import {
  CheckCircle2, ChevronRight, ShieldCheck, CreditCard, Hammer,
  Ruler, Calendar, AlertTriangle, Lock,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { getBackToProjets } from "@/lib/back-to-projets";
import { formatFCFA } from "@/lib/dedco-data";
import { PhoneInput } from "@/components/dedco/phone-input";

// ============================================================
// MOCK — Propositions artisan par ID
// (récupère les conditions de paiement de la proposition choisie)
// ============================================================

type ArtisanProposalMock = {
  id: string;
  briefId: string;
  projectTitle: string;
  artisanName: string;
  artisanAvatar: string;
  artisanCity: string;
  artisanLevel: "N1" | "N2" | "N3" | "N4";
  // Détails devis
  price: number;
  deliveryTime: string;
  materials: string;
  dimensions: string;
  quantite: number;
  // Garantie Dedco
  garantiePercent: number; // ex 1.5
};

const MOCK_PROPOSALS: Record<string, ArtisanProposalMock> = {
  "PROP-K1": {
    id: "PROP-K1",
    briefId: "BA-003",
    projectTitle: "Table basse sur mesure",
    artisanName: "Atelier Kossi",
    artisanAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Cotonou",
    artisanLevel: "N3",
    price: 185000,
    deliveryTime: "18 jours",
    materials: "Bois massif iroko, vernis naturel",
    dimensions: "120 x 60 x 40 cm",
    quantite: 1,
    garantiePercent: 1.5,
  },
  "PROP-A1": {
    id: "PROP-A1",
    briefId: "BA-001",
    projectTitle: "Dressing sur mesure chambre",
    artisanName: "Kofi Akindélé",
    artisanAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Cotonou",
    artisanLevel: "N3",
    price: 220000,
    deliveryTime: "18 jours",
    materials: "Bois massif iroko, vernis naturel",
    dimensions: "300 x 240 x 60 cm",
    quantite: 1,
    garantiePercent: 1.5,
  },
  "PROP-A2": {
    id: "PROP-A2",
    briefId: "BA-001",
    projectTitle: "Dressing sur mesure chambre",
    artisanName: "Brice Gogan",
    artisanAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Cotonou",
    artisanLevel: "N2",
    price: 195000,
    deliveryTime: "21 jours",
    materials: "Contreplaqué bouleau, peinture éco-responsable",
    dimensions: "300 x 240 x 60 cm",
    quantite: 1,
    garantiePercent: 1.5,
  },
  "PROP-A3": {
    id: "PROP-A3",
    briefId: "BA-001",
    projectTitle: "Dressing sur mesure chambre",
    artisanName: "Emile Agossou",
    artisanAvatar: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Porto-Novo",
    artisanLevel: "N1",
    price: 165000,
    deliveryTime: "25 jours",
    materials: "Médjin (bois local), finition cire d'abeille",
    dimensions: "300 x 240 x 60 cm",
    quantite: 1,
    garantiePercent: 1.5,
  },
};

// ============================================================
// PAGE: Projet Paiement Artisan (escrow — client paie 100% + garantie)
// ============================================================

export function ProjetPaiementArtisanPage({ proposalId }: { proposalId: string }) {
  const navigate = useDedcoStore((s) => s.navigate);
  const currentUser = useDedcoStore((s) => s.currentUser);
  const proposal = MOCK_PROPOSALS[proposalId] || MOCK_PROPOSALS["PROP-K1"];
  const [operator, setOperator] = useState<"mtn" | "moov">("mtn");
  const [done, setDone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+229 01 97 45 23 10");

  // Calculs financiers
  const garantie = Math.round(proposal.price * proposal.garantiePercent / 100);
  const total = proposal.price + garantie;
  const newProjectId = `PA-${Math.floor(1000 + Math.random() * 9000)}`;

  // ── Bouton retour — role-aware ──
  const { route: backRoute, label: backLabel } = getBackToProjets(currentUser?.role);

  if (done) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-5" style={{ backgroundColor: "var(--forest-pale)" }}>
          <CheckCircle2 size={40} className="text-[var(--forest)]" />
        </div>
        <h1 className="display-xl mb-3">Projet lancé !</h1>
        <p className="text-sm text-[var(--text-2)] mb-2">
          L'artisan <strong>{proposal.artisanName}</strong> démarre la fabrication de votre {proposal.projectTitle.toLowerCase()}.
        </p>
        <p className="text-xs text-[var(--text-3)] mb-6 font-numeric">ID projet : {newProjectId}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => navigate({ page: "projet-artisan-detail", projectId: newProjectId })} className="dedco-btn dedco-btn-primary">
            Suivre le projet <ChevronRight size={16} />
          </button>
          <button onClick={() => navigate(backRoute)} className="dedco-btn dedco-btn-ghost">
            {backLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-md mx-auto">
      <button onClick={() => navigate(backRoute)} className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> {backLabel}
      </button>

      <header className="mb-6">
        <span className="dedco-badge dedco-badge-terra mb-2">Paiement à effectuer</span>
        <h1 className="display-lg mb-1">Paiement de la commande</h1>
        <p className="text-sm text-[var(--text-2)]">{proposal.projectTitle}</p>
      </header>

      {/* Artisan partenaire */}
      <div className="dedco-card p-4 mb-4 flex items-center gap-3">
        <img src={proposal.artisanAvatar} alt={proposal.artisanName} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-sm truncate">{proposal.artisanName}</p>
          <p className="text-xs text-[var(--text-3)]">{proposal.artisanCity} · Niveau {proposal.artisanLevel}</p>
        </div>
      </div>

      {/* Récapitulatif devis */}
      <div className="dedco-card p-4 mb-4">
        <h2 className="font-display font-semibold text-sm mb-3">Récapitulatif du devis</h2>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <Hammer size={12} className="text-[var(--amber)] flex-shrink-0 mt-0.5" />
            <span className="text-[var(--text-2)]">{proposal.materials}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler size={12} className="text-[var(--amber)] flex-shrink-0" />
            <span className="text-[var(--text-2)] font-numeric">{proposal.dimensions}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-[var(--amber)] flex-shrink-0" />
            <span className="text-[var(--text-2)] font-numeric">Délai : {proposal.deliveryTime}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center justify-between text-sm">
          <span className="text-[var(--text-2)]">Prix total du devis</span>
          <span className="font-numeric font-semibold">{formatFCFA(proposal.price)}</span>
        </div>
      </div>

      {/* Détail paiement */}
      <div className="dedco-card p-5 mb-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Prix de la prestation</span>
            <span className="font-numeric font-semibold">{formatFCFA(proposal.price)}</span>
          </div>
          <div className="flex justify-between text-[var(--text-2)]">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} className="text-[var(--forest)]" />
              Garantie Dedco ({proposal.garantiePercent}%)
            </span>
            <span className="font-numeric">{formatFCFA(garantie)}</span>
          </div>
          <div className="flex justify-between text-[var(--text-3)] text-xs">
            
          </div>
          <div className="flex justify-between font-display font-bold pt-2 border-t border-[var(--border)]">
            <span>Total à payer</span>
            <span className="font-numeric text-[var(--amber)] text-lg">{formatFCFA(total)}</span>
          </div>
        </div>
      </div>

      {/* Alerte sécurité */}
      <div className="p-3 rounded-lg mb-4 flex items-start gap-2" style={{ backgroundColor: "var(--forest-pale)" }}>
        <Lock size={14} className="text-[var(--forest)] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-[var(--forest)]">
          Paiement sécurisé Mobile Money. Vous payez l'intégralité maintenant. L'artisan est payé après validation de votre livraison.
        </p>
      </div>

      {/* Moyens de paiement */}
      <div className="dedco-card p-5 mb-4">
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { id: "mtn", label: "MTN MoMo", color: "#FFCC00", text: "#000" },
            { id: "moov", label: "Moov Money", color: "#009BDB", text: "#fff" },
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => setOperator(op.id as "mtn" | "moov")}
              className={`px-3 py-3 rounded-md text-sm font-semibold border-2 ${operator === op.id ? "border-[var(--amber)]" : "border-[var(--border)]"}`}
              style={{ backgroundColor: op.color, color: op.text }}
            >
              {op.label}
            </button>
          ))}
        </div>
        <PhoneInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          className="w-full"
        />
      </div>

      <button onClick={() => setDone(true)} className="dedco-btn dedco-btn-primary w-full dedco-btn-lg">
        <CreditCard size={16} /> Payer {formatFCFA(total)}
      </button>

      <p className="text-[11px] text-[var(--text-3)] text-center mt-3 flex items-center justify-center gap-1">
        <AlertTriangle size={10} /> Sans paiement, la proposition expire sous 7 jours.
      </p>
    </div>
  );
}
