"use client";

import { motion } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA, getArtisan } from "@/lib/dedco-data";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  Package,
} from "lucide-react";

export function CartPage() {
  const cart = useDedcoStore((s) => s.cart);
  const navigate = useDedcoStore((s) => s.navigate);
  const incrementCart = useDedcoStore((s) => s.incrementCart);
  const decrementCart = useDedcoStore((s) => s.decrementCart);
  const removeFromCart = useDedcoStore((s) => s.removeFromCart);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 5000 : 0;
  const total = subtotal + shipping;

  // Empty state
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--bg-warm)" }}
          >
            <ShoppingBag size={40} style={{ color: "var(--text-3)" }} />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--text-1)" }}>
            Votre panier est vide
          </h2>
          <p className="text-sm mb-8 max-w-xs mx-auto" style={{ color: "var(--text-2)" }}>
            Découvrez nos artisans et trouvez des pièces uniques pour votre intérieur.
          </p>
          <button
            onClick={() => navigate({ page: "marketplace" })}
            className="dedco-btn dedco-btn-primary dedco-btn-lg"
          >
            <Package size={18} />
            Explorer le marché
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-10 max-w-6xl mx-auto">
      <button
        onClick={() => navigate({ page: "marketplace" })}
        className="text-sm text-[var(--text-3)] hover:text-[var(--amber)] mb-4 flex items-center gap-1"
      >
        <ChevronLeft size={16} /> Continuer mes achats
      </button>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-1)" }}>
              Mon panier
            </h1>
            <p className="text-sm mt-1 font-numeric" style={{ color: "var(--text-3)" }}>
              {cart.length} {cart.length === 1 ? "article" : "articles"}
            </p>
          </div>
          <button
            onClick={() => navigate({ page: "marketplace" })}
            className="dedco-btn dedco-btn-ghost dedco-btn-sm"
          >
            <ArrowLeft size={14} />
            Continuer mes achats
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cart items */}
          <div className="flex-1 space-y-3">
            {cart.map((item, index) => {
              const artisan = getArtisan(item.artisanId);
              const itemSubtotal = item.price * item.qty;
              return (
                <motion.div
                  key={`${item.id}-${item.selectedColor}-${index}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="dedco-card p-4 md:p-5"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: "var(--bg-warm)" }}
                    >
                      {item.images[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3
                            className="font-semibold text-sm truncate"
                            style={{ color: "var(--text-1)" }}
                          >
                            {item.name}
                          </h3>
                          {artisan && (
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                              {artisan.name}
                            </p>
                          )}
                          {item.selectedColor && (
                            <span className="dedco-badge dedco-badge-amber mt-1 text-xs">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 rounded-md transition-colors cursor-pointer flex-shrink-0 hover:bg-red-50"
                          style={{ color: "var(--text-3)" }}
                          title="Retirer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity controls */}
                        <div
                          className="inline-flex items-center rounded-md overflow-hidden"
                          style={{ border: "1px solid var(--border)" }}
                        >
                          <button
                            onClick={() => decrementCart(item.id)}
                            disabled={item.qty <= 1}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30"
                            style={{ background: "var(--bg-cream)", color: "var(--text-1)" }}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            className="w-10 h-8 flex items-center justify-center text-sm font-semibold font-numeric"
                            style={{ background: "var(--bg-card)", color: "var(--text-1)" }}
                          >
                            {item.qty}
                          </span>
                          <button
                            onClick={() => incrementCart(item.id)}
                            disabled={item.qty >= item.stock}
                            className="w-8 h-8 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30"
                            style={{ background: "var(--bg-cream)", color: "var(--text-1)" }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="font-semibold text-sm font-numeric" style={{ color: "var(--text-1)" }}>
                          {formatFCFA(itemSubtotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary — Desktop sidebar / Mobile bottom */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="dedco-card p-5 md:p-6 sticky top-24">
              <h3
                className="font-display font-semibold mb-4"
                style={{ color: "var(--text-1)" }}
              >
                Résumé de la commande
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-2)" }}>Sous-total</span>
                  <span className="font-semibold font-numeric" style={{ color: "var(--text-1)" }}>
                    {formatFCFA(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-2)" }}>Livraison estimée</span>
                  <span className="font-semibold font-numeric" style={{ color: "var(--text-1)" }}>
                    {formatFCFA(shipping)}
                  </span>
                </div>
                <div
                  className="h-px"
                  style={{ background: "var(--border)" }}
                />
                <div className="flex justify-between items-center">
                  <span className="font-semibold" style={{ color: "var(--text-1)" }}>Total</span>
                  <span className="font-display text-xl font-bold font-numeric" style={{ color: "var(--amber)" }}>
                    {formatFCFA(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate({ page: "checkout" })}
                className="dedco-btn dedco-btn-primary dedco-btn-lg w-full mt-6"
              >
                Passer la commande
                <ArrowRight size={16} />
              </button>

              <p className="text-center text-xs mt-3" style={{ color: "var(--text-3)" }}>
                Paiement sécurisé via Mobile Money
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
