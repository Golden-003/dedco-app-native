"use client";

import { useState } from "react";
import {
  Plus,
  ChevronLeft,
  Share2,
  X,
  Heart,
  ExternalLink,
  ImagePlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDedcoStore } from "@/lib/store";
import { formatFCFA, PRODUCTS } from "@/lib/dedco-data";

// ============================================================
// Mock Moodboard Data
// ============================================================

interface MoodboardImage {
  id: string;
  src: string;
  productName: string;
  price: number;
  productId: number;
}

interface Moodboard {
  id: string;
  name: string;
  imageCount: number;
  lastUpdated: string;
  images: MoodboardImage[];
}

const MOODBOARDS: Moodboard[] = [
  {
    id: "mb-1",
    name: "Salon Afro",
    imageCount: 8,
    lastUpdated: "25 Jan 2024",
    images: [
      { id: "img1", src: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=600&q=85", productName: "Table Bénin Wax", price: 185000, productId: 1 },
      { id: "img2", src: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=85", productName: "Fauteuil Rotin", price: 95000, productId: 2 },
      { id: "img3", src: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=85", productName: "Suspension Bambou", price: 78000, productId: 3 },
      { id: "img4", src: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=600&q=85", productName: "Tapis Kente", price: 120000, productId: 4 },
      { id: "img5", src: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=85", productName: "Vase Céramique", price: 35000, productId: 5 },
      { id: "img6", src: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=600&q=85", productName: "Coussin Bogolan", price: 18000, productId: 6 },
      { id: "img7", src: "https://images.unsplash.com/photo-1655276602527-ca7c0c44d6de?auto=format&fit=crop&w=600&q=85", productName: "Lampe Laiton", price: 65000, productId: 7 },
      { id: "img8", src: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=600&q=85", productName: "Étagère Bois", price: 145000, productId: 8 },
    ],
  },
  {
    id: "mb-2",
    name: "Chambre Zen",
    imageCount: 5,
    lastUpdated: "20 Jan 2024",
    images: [
      { id: "img9", src: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=85", productName: "Lampe Laiton", price: 65000, productId: 7 },
      { id: "img10", src: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=600&q=85", productName: "Table de Nuit", price: 89000, productId: 10 },
      { id: "img11", src: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=600&q=85", productName: "Étagère Bois", price: 145000, productId: 8 },
      { id: "img12", src: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=85", productName: "Fauteuil Rotin", price: 95000, productId: 2 },
      { id: "img13", src: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=600&q=85", productName: "Tapis Kente", price: 120000, productId: 4 },
    ],
  },
  {
    id: "mb-3",
    name: "Inspiration Bureau",
    imageCount: 12,
    lastUpdated: "18 Jan 2024",
    images: [
      { id: "img14", src: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=600&q=85", productName: "Table Bénin Wax", price: 185000, productId: 1 },
      { id: "img15", src: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=85", productName: "Lampe Laiton", price: 65000, productId: 7 },
      { id: "img16", src: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=85", productName: "Suspension Bambou", price: 78000, productId: 3 },
      { id: "img17", src: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=600&q=85", productName: "Étagère Bois", price: 145000, productId: 8 },
      { id: "img18", src: "https://images.unsplash.com/photo-1566921895456-1cee64031c33?auto=format&fit=crop&w=600&q=85", productName: "Coussin Bogolan", price: 18000, productId: 6 },
      { id: "img19", src: "https://images.unsplash.com/photo-1655276602527-ca7c0c44d6de?auto=format&fit=crop&w=600&q=85", productName: "Bureau Bois Massif", price: 210000, productId: 12 },
      { id: "img20", src: "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=600&q=85", productName: "Table de Nuit", price: 89000, productId: 10 },
      { id: "img21", src: "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=600&q=85", productName: "Tapis Kente", price: 120000, productId: 4 },
      { id: "img22", src: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&w=600&q=85", productName: "Porte-manteau", price: 42000, productId: 14 },
      { id: "img23", src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=85", productName: "Organiseur Bureau", price: 25000, productId: 15 },
      { id: "img24", src: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?auto=format&fit=crop&w=600&q=85", productName: "Table Bénin Wax", price: 185000, productId: 1 },
      { id: "img25", src: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=600&q=85", productName: "Lampe Laiton", price: 65000, productId: 7 },
    ],
  },
];

// ============================================================
// MoodboardPage
// ============================================================

export function MoodboardPage() {
  const navigate = useDedcoStore((s) => s.navigate);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const expanded = MOODBOARDS.find((m) => m.id === expandedId);

  return (
    <div className="dedco-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <AnimatePresence mode="wait">
        {expanded ? (
          <MoodboardDetailView
            key={expanded.id}
            moodboard={expanded}
            onBack={() => setExpandedId(null)}
            navigate={navigate}
          />
        ) : (
          <MoodboardListView
            key="list"
            onSelect={(id) => setExpandedId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// Moodboard List View
// ============================================================

function MoodboardListView({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="display-xl mb-2">Mes Moodboards</h1>
          <p className="text-sm text-ink-soft">
            {MOODBOARDS.length} moodboard{MOODBOARDS.length > 1 ? "s" : ""}
          </p>
        </div>
        <button type="button" className="dedco-btn dedco-btn-primary dedco-btn-sm">
          <Plus size={16} />
          Créer un moodboard
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOODBOARDS.map((mb, i) => (
          <motion.button
            key={mb.id}
            type="button"
            onClick={() => onSelect(mb.id)}
            className="dedco-card overflow-hidden text-left group cursor-pointer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            {/* 2x2 Preview Grid */}
            <div className="grid grid-cols-2 gap-0.5 aspect-square">
              {mb.images.slice(0, 4).map((img) => (
                <div key={img.id} className="bg-warm overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.productName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-base mb-1">
                {mb.name}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-mute">
                  <span className="font-numeric">{mb.imageCount}</span> images
                </p>
                <p className="text-xs text-ink-mute">{mb.lastUpdated}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================
// Moodboard Detail View
// ============================================================

function MoodboardDetailView({
  moodboard,
  onBack,
  navigate,
}: {
  moodboard: Moodboard;
  onBack: () => void;
  navigate: (route: { page: string; id: number }) => void;
}) {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-warm transition-colors"
            aria-label="Retour"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="display-lg">{moodboard.name}</h1>
            <p className="text-sm text-ink-mute">
              <span className="font-numeric">{moodboard.imageCount}</span> images
              · Mis à jour {moodboard.lastUpdated}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="dedco-btn dedco-btn-ghost dedco-btn-sm"
          >
            <ImagePlus size={16} />
            Ajouter
          </button>
          <button
            type="button"
            className="dedco-btn dedco-btn-secondary dedco-btn-sm"
          >
            <Share2 size={16} />
            Partager
          </button>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="masonry-grid">
        {moodboard.images.map((img, i) => (
          <motion.div
            key={img.id}
            className="masonry-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onMouseEnter={() => setHoveredImage(img.id)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <div className="dedco-card overflow-hidden relative group cursor-pointer">
              <div
                className="bg-warm overflow-hidden"
                style={{
                  aspectRatio:
                    i % 4 === 0
                      ? "3/4"
                      : i % 4 === 1
                        ? "4/5"
                        : i % 4 === 2
                          ? "3/5"
                          : "4/4",
                }}
              >
                <img
                  src={img.src}
                  alt={img.productName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Hover overlay */}
              <AnimatePresence>
                {hoveredImage === img.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="text-white text-sm font-semibold mb-0.5">
                      {img.productName}
                    </p>
                    <p className="text-white/80 text-xs font-numeric mb-2">
                      {formatFCFA(img.price)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate({ page: "product", id: img.productId });
                        }}
                        className="dedco-btn dedco-btn-primary dedco-btn-sm text-xs py-1.5 px-3"
                      >
                        <ExternalLink size={12} />
                        Voir le produit
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                        aria-label="Retirer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Like button */}
              <button
                type="button"
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 text-terracotta flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Favoris"
              >
                <Heart size={14} fill="currentColor" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
