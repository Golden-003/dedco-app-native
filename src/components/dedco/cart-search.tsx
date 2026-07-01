"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react";
import { formatFCFA } from "@/lib/dedco-data";
import type { CartItem } from "@/lib/dedco-types";
import { useDedcoStore } from "@/lib/store";

export function CartSidebar({
  open,
  items,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
}) {
  const navigate = useDedcoStore((s) => s.navigate);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal === 0 || subtotal >= 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 dedco-fade-in" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 w-full max-w-md h-full flex flex-col bg-cream dedco-slide-in-right"
          aria-label="Panier"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-amber" />
              <Dialog.Title className="font-display font-bold text-lg">
                Mon panier
              </Dialog.Title>
              {items.length > 0 && (
                <span className="dedco-badge dedco-badge-amber">
                  {items.length} article{items.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-warm"
                aria-label="Fermer le panier"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 dedco-scroll">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-warm flex items-center justify-center mb-3">
                <ShoppingBag size={28} className="text-ink-mute" />
              </div>
              <p className="font-display font-semibold text-lg mb-1">
                Panier vide
              </p>
              <p className="text-sm text-ink-soft mb-4">
                Explorez la marketplace pour ajouter des articles.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="dedco-btn dedco-btn-primary"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={`${item.id}-${item.selectedColor}`}
                  className="dedco-card p-3 flex gap-3"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-20 h-20 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm line-clamp-1 mb-0.5">
                      {item.name}
                    </h3>
                    {item.selectedColor && (
                      <p className="text-xs text-ink-mute mb-1">
                        {item.selectedColor}
                      </p>
                    )}
                    <p className="font-numeric font-bold text-sm text-amber mb-2">
                      {formatFCFA(item.price)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => onDecrement(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-ink-soft hover:text-ink"
                          aria-label="Diminuer"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs w-6 text-center">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => onIncrement(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-ink-soft hover:text-ink"
                          aria-label="Augmenter"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="text-ink-mute hover:text-terracotta transition-colors p-1"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-white p-4 safe-bottom">
            <div className="space-y-1 mb-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-soft">Sous-total</span>
                <span className="font-semibold">{formatFCFA(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Livraison</span>
                <span className="font-semibold">
                  {shipping === 0 ? "Gratuite" : formatFCFA(shipping)}
                </span>
              </div>
              {subtotal < 50000 && (
                <p className="text-xs text-forest">
                  Plus que {formatFCFA(50000 - subtotal)} pour la livraison
                  gratuite
                </p>
              )}
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-border mb-3">
              <span className="font-display font-bold">Total</span>
              <span className="font-numeric font-bold text-xl text-amber">
                {formatFCFA(total)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate({ page: "checkout" });
              }}
              className="dedco-btn dedco-btn-primary w-full dedco-btn-lg"
            >
              Passer commande
            </button>
            <p className="text-xs text-ink-mute text-center mt-2">
              Paiement sécurisé · Mobile Money · Mobile Money
            </p>
          </div>
        )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ============================================================
// Search overlay
// ============================================================

export function SearchOverlay({
  open,
  onClose,
  onSearch,
  onOpenProduct,
  onNavigateMarketplace,
}: {
  open: boolean;
  onClose: () => void;
  onSearch: (q: string) => void;
  onOpenProduct: () => void;
  onNavigateMarketplace: () => void;
}) {
  const popular = ["wax", "bois iroko", "rotin", "bambou", "terracotta", "kente"];
  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm dedco-fade-in" />
        <Dialog.Content className="fixed left-1/2 top-16 z-50 -translate-x-1/2 w-full max-w-2xl mx-4 bg-cream rounded-xl shadow-xl dedco-fade-in">
          <Dialog.Title className="sr-only">Recherche</Dialog.Title>
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <input
              type="search"
              autoFocus
              placeholder="Rechercher un produit, artisan, designer..."
              className="flex-1 bg-transparent text-base focus:outline-none"
              aria-label="Rechercher"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSearch((e.target as HTMLInputElement).value);
                  onClose();
                }
              }}
            />
            <Dialog.Close asChild>
              <button
                type="button"
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-warm"
                aria-label="Fermer la recherche"
              >
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <div className="p-4">
            <p className="text-xs text-ink-mute uppercase tracking-wide mb-3">
              Recherches populaires
            </p>
            <div className="flex flex-wrap gap-2">
              {popular.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    onSearch(term);
                    onClose();
                  }}
                  className="dedco-badge dedco-badge-gray hover:dedco-badge-amber cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
