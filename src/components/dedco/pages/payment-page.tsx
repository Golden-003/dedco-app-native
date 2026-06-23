"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA } from "@/lib/dedco-data";
import {
  CheckCircle,
  Phone,
  Shield,
  Package,
  ArrowRight,
  AlertCircle,
  Smartphone,
} from "lucide-react";

type PaymentState = "input" | "processing" | "success" | "error";

export function PaymentPage() {
  const route = useDedcoStore((s) => s.route);
  const navigate = useDedcoStore((s) => s.navigate);
  const cart = useDedcoStore((s) => s.cart);
  const clearCart = useDedcoStore((s) => s.clearCart);

  const orderId = route.page === "payment" ? route.orderId : "ORD-001";

  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState<PaymentState>("input");

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 5000;
  const total = subtotal + shipping;

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setState("processing");

    // Simulate payment processing
    setTimeout(() => {
      // 90% success rate simulation
      const success = Math.random() > 0.1;
      if (success) clearCart();
      setState(success ? "success" : "error");
    }, 2500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {/* Input State */}
          {state === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
            >
              <div className="dedco-card p-8 md:p-10">
                {/* Fedapay Header */}
                <div className="text-center mb-8">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "var(--amber)", color: "#fff" }}
                  >
                    <Shield size={28} />
                  </div>
                  <h2 className="font-display text-xl font-semibold" style={{ color: "var(--text-1)" }}>
                    Paiement sécurisé
                  </h2>
                  <p className="text-sm mt-1" style={{ color: "var(--text-3)" }}>
                    Propulsé par Fedapay
                  </p>
                </div>

                {/* Order info */}
                <div
                  className="p-4 rounded-lg mb-6"
                  style={{ background: "var(--bg-cream)", border: "1px solid var(--border)" }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
                      Commande
                    </span>
                    <span className="text-sm font-semibold font-numeric" style={{ color: "var(--text-1)" }}>
                      {orderId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "var(--text-3)" }}>
                      {cart.length} {cart.length === 1 ? "article" : "articles"}
                    </span>
                    <span className="font-display text-xl font-bold font-numeric" style={{ color: "var(--amber)" }}>
                      {formatFCFA(total)}
                    </span>
                  </div>
                </div>

                {/* Phone input */}
                <form onSubmit={handleConfirm} className="space-y-4">
                  <div>
                    <label
                      htmlFor="payment-phone"
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: "var(--text-1)" }}
                    >
                      Numéro Mobile Money
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: "var(--text-3)" }} />
                      <input
                        id="payment-phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+229 90 00 00 00"
                        required
                        className="w-full pl-10 pr-4 py-3.5 text-sm rounded-md border focus:outline-none focus:ring-2 transition-all"
                        style={{
                          background: "var(--bg-cream)",
                          borderColor: "var(--border)",
                          color: "var(--text-1)",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg text-xs" style={{ background: "var(--bg-warm)", color: "var(--text-2)" }}>
                    <Smartphone size={14} style={{ color: "var(--amber)" }} />
                    Un USSD sera envoyé sur votre téléphone pour confirmer le paiement.
                  </div>

                  <button
                    type="submit"
                    disabled={!phoneNumber}
                    className="dedco-btn dedco-btn-primary dedco-btn-lg w-full"
                  >
                    <Shield size={16} />
                    Confirmer le paiement — {formatFCFA(total)}
                  </button>
                </form>

                <button
                  onClick={() => navigate({ page: "checkout" })}
                  className="w-full text-center text-sm mt-4 cursor-pointer hover:underline"
                  style={{ color: "var(--text-3)" }}
                >
                  Annuler et retourner
                </button>
              </div>
            </motion.div>
          )}

          {/* Processing State */}
          {state === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="dedco-card p-10 text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <svg className="animate-spin w-20 h-20" viewBox="0 0 50 50">
                    <circle
                      className="opacity-20"
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="var(--amber)"
                      strokeWidth="4"
                    />
                    <circle
                      className="opacity-80"
                      cx="25"
                      cy="25"
                      r="20"
                      fill="none"
                      stroke="var(--amber)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="80, 200"
                      strokeDashoffset="0"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="0 25 25;360 25 25"
                        dur="1.2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </svg>
                  <Shield
                    size={24}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ color: "var(--amber)" }}
                  />
                </div>
                <h2 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--text-1)" }}>
                  Traitement en cours...
                </h2>
                <p className="text-sm" style={{ color: "var(--text-3)" }}>
                  Veuillez confirmer le paiement sur votre téléphone.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--amber)" }}>
                    <motion.div
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full"
                      style={{ background: "var(--amber)" }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-3)" }}>
                    En attente de confirmation
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="dedco-card p-10 text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: "var(--terracotta-pale)" }}
                >
                  <AlertCircle size={36} style={{ color: "var(--terracotta)" }} />
                </div>
                <h2 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--terracotta)" }}>
                  Paiement échoué
                </h2>
                <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
                  Une erreur est survenue lors du traitement. Veuillez réessayer.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setState("input");
                    }}
                    className="dedco-btn dedco-btn-primary w-full"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={() => navigate({ page: "checkout" })}
                    className="dedco-btn dedco-btn-ghost w-full"
                  >
                    Retour à la commande
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="dedco-card p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "var(--forest-pale)" }}
                  >
                    <CheckCircle size={40} style={{ color: "var(--forest)" }} />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--forest)" }}>
                    Paiement réussi!
                  </h2>
                  <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
                    Votre commande a été confirmée.
                  </p>

                  <div
                    className="p-4 rounded-lg mb-6"
                    style={{ background: "var(--bg-cream)", border: "1px solid var(--border)" }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-3)" }}>
                      Numéro de commande
                    </span>
                    <p className="font-display text-xl font-bold mt-1 font-numeric" style={{ color: "var(--text-1)" }}>
                      {orderId}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        navigate({ page: "order-tracking", id: "ORD-001" })
                      }
                      className="dedco-btn dedco-btn-primary dedco-btn-lg flex-1"
                    >
                      <Package size={16} />
                      Suivre ma commande
                      <ArrowRight size={16} />
                    </button>
                    <button
                      onClick={() => navigate({ page: "marketplace" })}
                      className="dedco-btn dedco-btn-ghost dedco-btn-lg flex-1"
                    >
                      Explorer le marché
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
