"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet as WalletIcon,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CreditCard,
  Shield,
  ChevronRight,
  X,
  Smartphone,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";
import { BackButton } from "../layout";
import { PhoneInput } from "@/components/dedco/phone-input";

// ============================================================
// Mock transactions
// ============================================================

interface Transaction {
  id: string;
  type: "credit" | "debit";
  label: string;
  amount: number;
  date: string;
  reference: string;
  status: "completed" | "pending";
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-001",
    type: "credit",
    label: "Paiement reçu — Commande #ORD-001",
    amount: 185000,
    date: "20 Jan 2024",
    reference: "FED-20240120-001",
    status: "completed",
  },
  {
    id: "TXN-002",
    type: "debit",
    label: "Retrait Mobile Money",
    amount: -140000,
    date: "22 Jan 2024",
    reference: "MM-20240122-001",
    status: "completed",
  },
  {
    id: "TXN-003",
    type: "credit",
    label: "Remboursement litige #LIT-001",
    amount: 25000,
    date: "18 Jan 2024",
    reference: "REF-20240118-001",
    status: "completed",
  },
  {
    id: "TXN-004",
    type: "debit",
    label: "Retrait Mobile Money",
    amount: -50000,
    date: "15 Jan 2024",
    reference: "MM-20240115-002",
    status: "completed",
  },
  {
    id: "TXN-005",
    type: "credit",
    label: "Paiement reçu — Commande #ORD-002",
    amount: 67000,
    date: "15 Jan 2024",
    reference: "FED-20240115-002",
    status: "completed",
  },
  {
    id: "TXN-006",
    type: "debit",
    label: "Retrait Mobile Money",
    amount: -25000,
    date: "12 Jan 2024",
    reference: "MM-20240112-001",
    status: "completed",
  },
];

const BALANCE = 45000;

// ============================================================
// Animation variants
// ============================================================

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

// ============================================================
// Wallet Page
// ============================================================

export function WalletPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const totalCredits = TRANSACTIONS
    .filter((t) => t.type === "credit")
    .reduce((s, t) => s + t.amount, 0);
  const totalDebits = TRANSACTIONS
    .filter((t) => t.type === "debit")
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div className="dedco-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <BackButton onBack={goBack} />

      <motion.div {...fadeUp} transition={{ duration: 0.35 }} className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="display-xl">Mon portefeuille</h1>
          <span className="dedco-badge dedco-badge-amber">En attente KYC</span>
        </div>
      </motion.div>

      {/* Balance card */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.06 }}
        className="rounded-xl p-6 sm:p-8 mb-5 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--amber) 0%, var(--amber-dark) 100%)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, white 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <p className="text-sm text-white/70 mb-1">Solde disponible</p>
        <p className="font-numeric text-3xl sm:text-4xl font-bold mb-4">
          {formatFCFA(BALANCE)}
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setWithdrawOpen(true)}
            className="dedco-btn dedco-btn-light dedco-btn-sm"
          >
            <ArrowUpRight size={16} />
            Retirer
          </button>
          <button type="button" className="dedco-btn dedco-btn-light dedco-btn-sm" style={{ color: "white", borderColor: "rgba(255,255,255,0.4)" }}>
            <ArrowDownLeft size={16} />
            Ajouter
          </button>
        </div>

        {/* Mini stats */}
        <div className="flex gap-6 mt-6 pt-4 border-t border-white/20">
          <div>
            <p className="text-xs text-white/60">Total crédits</p>
            <p className="font-numeric font-bold">{formatFCFA(totalCredits)}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Total débits</p>
            <p className="font-numeric font-bold">{formatFCFA(totalDebits)}</p>
          </div>
        </div>
      </motion.div>

      {/* KYC Status */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="dedco-card p-4 sm:p-5 mb-5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-pale flex items-center justify-center flex-shrink-0">
            <Shield size={20} className="text-amber" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Vérification d'identité (KYC)</p>
            <p className="text-xs text-ink-mute">
              Complétez votre vérification pour débloquer les retraits
            </p>
          </div>
          <span className="dedco-badge dedco-badge-amber">En attente</span>
          <button
            type="button"
            onClick={() => navigate({ page: "kyc" })}
            className="dedco-btn dedco-btn-secondary dedco-btn-sm"
          >
            Vérifier
          </button>
        </div>
      </motion.div>

      {/* Transaction history */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.18 }}
        className="dedco-card p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-amber" />
            <h2 className="font-display font-bold text-base">Historique</h2>
          </div>
          <button type="button" className="text-xs text-amber font-medium flex items-center gap-1 hover:underline">
            Historique complet <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-0 max-h-96 overflow-y-auto dedco-scroll">
          {TRANSACTIONS.map((txn, i) => (
            <div
              key={txn.id}
              className="flex items-center gap-3 py-3.5 border-b border-border last:border-b-0"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  txn.type === "credit"
                    ? "bg-forest-pale text-forest"
                    : "bg-terracotta-pale text-terracotta"
                }`}
              >
                {txn.type === "credit" ? (
                  <ArrowDownLeft size={16} />
                ) : (
                  <ArrowUpRight size={16} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{txn.label}</p>
                <p className="text-xs text-ink-mute font-numeric">
                  {txn.date} · {txn.reference}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p
                  className={`font-numeric font-bold text-sm ${
                    txn.amount > 0 ? "text-forest" : "text-terracotta"
                  }`}
                >
                  {txn.amount > 0 ? "+" : ""}
                  {formatFCFA(Math.abs(txn.amount))}
                </p>
                {txn.status === "completed" ? (
                  <p className="flex items-center gap-0.5 text-[10px] text-forest justify-end">
                    <CheckCircle2 size={10} /> Confirmé
                  </p>
                ) : (
                  <p className="flex items-center gap-0.5 text-[10px] text-amber justify-end">
                    <Clock size={10} /> En cours
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Withdraw Modal */}
      {withdrawOpen && (
        <WithdrawModal
          balance={BALANCE}
          amount={withdrawAmount}
          setAmount={setWithdrawAmount}
          onClose={() => {
            setWithdrawOpen(false);
            setWithdrawAmount("");
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// Withdraw Modal (Mobile Money)
// ============================================================

function WithdrawModal({
  balance,
  amount,
  setAmount,
  onClose,
}: {
  balance: number;
  amount: string;
  setAmount: (v: string) => void;
  onClose: () => void;
}) {
  const numAmount = parseInt(amount, 10) || 0;
  const isValid = numAmount > 0 && numAmount <= balance;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-md dedco-card p-6 sm:p-8 z-10"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-warm text-ink-mute"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-amber-pale flex items-center justify-center">
            <Smartphone size={20} className="text-amber" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">Retrait Mobile Money</h3>
            <p className="text-xs text-ink-mute">Via Mobile Money</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-ink-mute uppercase tracking-wide mb-1.5">
            Numéro Mobile Money
          </p>
          <PhoneInput value="" onChange={() => {}} className="w-full" />
        </div>

        <div className="mb-4">
          <p className="text-xs text-ink-mute uppercase tracking-wide mb-1.5">
            Montant (FCFA)
          </p>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full px-3.5 py-2.5 rounded-md border border-border bg-card text-sm font-numeric focus:outline-none focus:border-amber pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-mute">
              FCFA
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            {[10000, 20000, 35000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                className="px-3 py-1 rounded-md bg-warm text-xs font-numeric font-medium hover:bg-amber-pale transition-colors"
              >
                {preset.toLocaleString("fr-FR")}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-ink-mute mb-4">
          Solde disponible :{" "}
          <span className="font-medium text-ink">{formatFCFA(balance)}</span>
        </p>

        {numAmount > balance && (
          <div className="flex items-center gap-2 text-xs text-terracotta mb-3">
            <AlertCircle size={14} />
            Montant supérieur au solde disponible
          </div>
        )}

        <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-amber-pale/50 border border-amber/20">
          <CreditCard size={16} className="text-amber flex-shrink-0" />
          <p className="text-xs text-amber-dark">
            Vous devez compléter votre vérification KYC pour effectuer un retrait.
          </p>
        </div>

        <button
          type="button"
          disabled={!isValid}
          className="dedco-btn dedco-btn-primary w-full"
        >
          Confirmer le retrait
        </button>
      </motion.div>
    </div>
  );
}
