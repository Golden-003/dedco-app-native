"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { useDedcoStore } from "@/lib/store";
import { ALL_PRODUCTS, formatFCFA } from "@/lib/dedco-data-expanded";
import { BackButton } from "../layout";

// ============================================================
// Favorites Page (reads from store favorites array)
// ============================================================

export function FavoritesPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const goBack = useDedcoStore((s) => s.goBack);
  const favorites = useDedcoStore((s) => s.favorites);
  const toggleFavorite = useDedcoStore((s) => s.toggleFavorite);
  const addToCart = useDedcoStore((s) => s.addToCart);

  const favProducts = ALL_PRODUCTS.filter((p) => favorites.includes(p.id));

  const handleRemove = (productId: number) => {
    toggleFavorite(productId);
  };

  const handleAddToCart = (product: (typeof ALL_PRODUCTS)[number]) => {
    addToCart({
      ...product,
      qty: 1,
      selectedColor: product.colors[0],
    });
  };

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <BackButton onBack={goBack} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <h1 className="display-xl">Mes favoris</h1>
          <span className="dedco-badge dedco-badge-amber font-numeric">
            {favProducts.length}
          </span>
        </div>
        <p className="text-sm text-ink-soft mt-1">
          {favProducts.length} produit{favProducts.length > 1 ? "s" : ""}{" "}
          sauvegardé{favProducts.length > 1 ? "s" : ""}
        </p>
      </motion.div>

      {favProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="dedco-card p-12 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-amber-pale flex items-center justify-center mx-auto mb-4">
            <Heart size={28} className="text-amber" />
          </div>
          <p className="font-display font-semibold text-lg mb-2">
            Aucun favori pour le moment
          </p>
          <p className="text-sm text-ink-soft mb-6 max-w-md mx-auto">
            Cliquez sur le cœur d&apos;un produit pour le retrouver ici. Parcourez
            notre marketplace pour découvrir des pièces uniques.
          </p>
          <button
            type="button"
            onClick={() => navigate({ page: "marketplace" })}
            className="dedco-btn dedco-btn-primary"
          >
            <ShoppingBag size={18} />
            Explorer la marketplace
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="dedco-card overflow-hidden group"
            >
              {/* Image */}
              <div
                className="relative aspect-square overflow-hidden bg-warm cursor-pointer"
                onClick={() => navigate({ page: "product", id: product.id })}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.badge && (
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="dedco-badge dedco-badge-terra-solid">
                      {product.badge}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(product.id);
                  }}
                  className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-card/90 text-terracotta flex items-center justify-center hover:bg-card hover:scale-110 transition-all"
                  aria-label="Retirer des favoris"
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3
                  className="font-display font-semibold text-[15px] leading-tight mb-1 line-clamp-2 cursor-pointer hover:text-amber transition-colors"
                  onClick={() => navigate({ page: "product", id: product.id })}
                >
                  {product.name}
                </h3>
                <p className="font-numeric font-bold text-base text-amber mb-3">
                  {formatFCFA(product.price)}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="dedco-btn dedco-btn-primary dedco-btn-sm flex-1"
                  >
                    <ShoppingCart size={14} />
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(product.id)}
                    className="dedco-btn dedco-btn-ghost dedco-btn-sm"
                    aria-label="Retirer des favoris"
                  >
                    <Trash2 size={14} className="text-terracotta" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
