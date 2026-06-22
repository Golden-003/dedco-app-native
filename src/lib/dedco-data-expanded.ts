// ============================================================
// DEDCO — Expanded Mock Data
// Re-exports everything from dedco-data.ts plus additional data
// ============================================================

export {
  ARTISANS,
  PRODUCTS,
  SCENES,
  DESIGNERS,
  CATEGORIES,
  MAGAZINE,
  formatFCFA,
  getArtisan,
  getProduct,
  getDesigner,
  getScene,
  levelLabel,
  heroAvatars,
} from './dedco-data';

export type {
  Product,
  Artisan,
  Designer,
  Scene,
  Category,
  Magazine,
  CartItem,
  Route,
  Brief,
  Project,
} from './dedco-types';

import {
  PRODUCTS,
  SCENES,
} from './dedco-data';
import type { Product, Scene, Brief, Project } from './dedco-types';

// ============================================================
// Additional Products (23-24)
// ============================================================

export const ADDITIONAL_PRODUCTS: Product[] = [
  {
    id: 23,
    name: "Paravent Akwaba Triple",
    price: 210000,
    category: "decoration",
    artisanId: 6,
    material: "Bois sculpté, tissu kente",
    colors: ["Kente or & noir", "Kente vert & rouge"],
    rating: 4.7,
    reviews: 8,
    stock: 3,
    badge: "Nouveauté",
    images: [
      "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=1200&q=85",
    ],
    desc: "Paravent triple en bois sculpté avec panneaux en tissu kente. Séparez les espaces avec élégance. Chaque panneau 60×180cm.",
    tags: ["paravent", "kente", "séparation"],
    dimensions: "180 × 180 cm déplié",
  },
  {
    id: 24,
    name: "Suspension Coquillage",
    price: 55000,
    category: "luminaires",
    artisanId: 8,
    material: "Coquillages, métal doré",
    colors: ["Doré naturel"],
    rating: 4.5,
    reviews: 21,
    stock: 11,
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=85",
    ],
    desc: "Suspension composée de coquillages naturels montés sur une structure en métal doré. Lumière tamisée et poétique.",
    tags: ["suspension", "coquillage", "luminaire"],
    dimensions: "Ø 35 cm",
  },
];

// ============================================================
// Additional Scene (6)
// ============================================================

export const ADDITIONAL_SCENES: Scene[] = [
  {
    id: 6,
    slug: "salle-a-manger-kente",
    title: "Salle à Manger Kente Royale",
    style: "Afro-luxe traditionnel",
    room: "Salle à manger",
    image:
      "https://images.unsplash.com/photo-1617364852223-75f57e78dc96?auto=format&fit=crop&w=1600&q=85",
    hotspots: [
      { x: 40, y: 60, productId: 7 },
      { x: 60, y: 40, productId: 21 },
      { x: 20, y: 50, productId: 17 },
    ],
    tags: ["salle à manger", "kente", "lux"],
    saves: 112,
    designerId: 2,
  },
];

// ============================================================
// Combined exports
// ============================================================

export const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...ADDITIONAL_PRODUCTS];

export const ALL_SCENES: Scene[] = [...SCENES, ...ADDITIONAL_SCENES];

// ============================================================
// Briefs
// ============================================================

export const BRIEFS: Brief[] = [
  {
    id: 1,
    title: "Aménagement salon 30m² style afro-contemporain",
    description:
      "Je cherche un designer pour aménager mon salon de 30m² dans un style afro-contemporain. J'ai déjà une table basse en iroko et je voudrais des coussins, un tapis et des luminaires qui s'harmonisent.",
    clientName: "Marie Houénou",
    budget: { min: 200000, max: 500000 },
    room: "Salon",
    style: "Afro-contemporain",
    status: "open",
    createdAt: "2024-01-15",
    responses: 4,
    urgency: "normal",
    requirements: ["Coussins", "Tapis", "Luminaires", "Art mural"],
  },
  {
    id: 2,
    title: "Chambre principale zen avec matériaux naturels",
    description:
      "Chambre de 20m², je veux une ambiance zen et naturelle. Préfère le bambou, le rotin et les couleurs neutres. Lit existant à conserver.",
    clientName: "Jean-Pierre Agossou",
    budget: { min: 150000, max: 350000 },
    room: "Chambre",
    style: "Zen / Naturel",
    status: "matched",
    createdAt: "2024-01-10",
    responses: 7,
    urgency: "flexible",
    requirements: ["Luminaires", "Rideaux", "Décoration murale", "Tapis"],
  },
  {
    id: 3,
    title: "Bureau maison style tropical luxe",
    description:
      "Aménagement d'un bureau de 12m² dans ma maison. Je veux un bureau fonctionnel mais esthétique, style tropical luxe avec du laiton et du bois.",
    clientName: "Aminata Zannou",
    budget: { min: 300000, max: 800000 },
    room: "Bureau",
    style: "Tropical luxe",
    status: "open",
    createdAt: "2024-01-18",
    responses: 2,
    urgency: "urgent",
    requirements: ["Bureau", "Rangement", "Éclairage", "Chaise"],
  },
];

// ============================================================
// Projects
// ============================================================

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Salon Marie H.",
    clientName: "Marie Houénou",
    designerName: "Ndèye Sarr",
    designerId: 1,
    status: "en_cours",
    progress: 65,
    budget: 450000,
    paid: 292500,
    startDate: "2024-01-20",
    room: "Salon",
    style: "Afro-contemporain",
    images: [
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?auto=format&fit=crop&w=800&q=85",
    ],
  },
  {
    id: 2,
    title: "Chambre Zen JP",
    clientName: "Jean-Pierre Agossou",
    designerName: "Karine Agboton",
    designerId: 3,
    status: "terminé",
    progress: 100,
    budget: 320000,
    paid: 320000,
    startDate: "2024-01-05",
    endDate: "2024-01-25",
    room: "Chambre",
    style: "Zen / Naturel",
    images: [
      "https://images.unsplash.com/photo-1655276602527-ca7c0c44d6de?auto=format&fit=crop&w=800&q=85",
    ],
  },
  {
    id: 3,
    title: "Bureau Aminata",
    clientName: "Aminata Zannou",
    designerName: "Chidi Okonkwo",
    designerId: 2,
    status: "en_attente",
    progress: 10,
    budget: 650000,
    paid: 65000,
    startDate: "2024-01-22",
    room: "Bureau",
    style: "Tropical luxe",
    images: [
      "https://images.unsplash.com/photo-1656403002413-2ac6137237d6?auto=format&fit=crop&w=800&q=85",
    ],
  },
  {
    id: 4,
    title: "Entrée Sculpturale",
    clientName: "Paul Dossou",
    designerName: "Marc-Aurel Favi",
    designerId: 4,
    status: "en_cours",
    progress: 40,
    budget: 180000,
    paid: 72000,
    startDate: "2024-01-17",
    room: "Entrée",
    style: "Art & Artisanat",
    images: [
      "https://images.unsplash.com/photo-1604264726154-26480e76f4e1?auto=format&fit=crop&w=800&q=85",
    ],
  },
];