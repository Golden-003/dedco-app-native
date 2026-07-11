// ============================================================
// MOCK PROJETS — données partagées entre projet-*-detail et invoice
// ============================================================
// Ces mocks étaient inline dans projet-designer-detail.tsx et
// projet-artisan-detail.tsx. Ils sont maintenant partagés pour que
// InvoicePage puisse afficher une facture cohérente avec le projet
// (au lieu de fallback sur MOCK_MARKETPLACE_ORDER).

// ── Projets designer ──

export interface DesignerProjectMock {
  id: string;
  briefId: string;
  scope: "prototype" | "standard" | "premium";
  status: "KICKOFF_SCHEDULED" | "IN_PROGRESS" | "DELIVERABLE_READY" | "DELIVERED_PENDING_VALIDATION" | "COMPLETED";
  title: string;
  image: string;
  clientName: string;
  clientAvatar: string;
  designerName: string;
  designerAvatar: string;
  designerCity: string;
  prestationLabel: string;
  prix: number;
  montantPaye: number;
  solde: number;
  livrablesPromis: string[];
  revisionsIncluses: number;
  piece: string;
  style: string;
  superficie: string;
  budgetConseil: { min: number; max: number };
  rdvCadrage?: { date: string; heure: string; mode: "visio" | "presentiel" | "tel" };
  dateDemarrage: string;
  dateLivraison: string;
}

export const MOCK_DESIGNER_PROJECTS: Record<string, DesignerProjectMock> = {
  "PD-001": {
    id: "PD-001",
    briefId: "BRF-DES-001",
    scope: "standard",
    status: "KICKOFF_SCHEDULED",
    title: "Aménagement salon moderne",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerName: "Aminata Design",
    designerAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerCity: "Cotonou",
    prestationLabel: "Standard — Plan d'aménagement complet",
    prix: 350000,
    montantPaye: 175000,
    solde: 175000,
    livrablesPromis: ["Plan d'aménagement 2D/3D", "Palette couleurs", "Liste de sourcing", "Conseils d'installation"],
    revisionsIncluses: 2,
    piece: "Salon",
    style: "Moderne épuré",
    superficie: "32 m²",
    budgetConseil: { min: 800000, max: 1500000 },
    rdvCadrage: { date: "28 juin 2026", heure: "10 h 00", mode: "visio" },
    dateDemarrage: "1 juillet 2026",
    dateLivraison: "15 août 2026",
  },
  "PD-002": {
    id: "PD-002",
    briefId: "BRF-DES-002",
    scope: "standard",
    status: "DELIVERABLE_READY",
    title: "Réaménagement bureau domicile",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerName: "Rachelle Interior",
    designerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerCity: "Porto-Novo",
    prestationLabel: "Standard — Plan d'aménagement complet",
    prix: 250000,
    montantPaye: 125000,
    solde: 125000,
    livrablesPromis: ["Plan 2D", "Palette", "Sourcing mobilier"],
    revisionsIncluses: 2,
    piece: "Bureau",
    style: "Naturel & chaleureux",
    superficie: "14 m²",
    budgetConseil: { min: 400000, max: 800000 },
    dateDemarrage: "10 juin 2026",
    dateLivraison: "25 juin 2026",
  },
  "PD-010": {
    id: "PD-010",
    briefId: "BRF-DES-010",
    scope: "prototype",
    status: "COMPLETED",
    title: "Plan d'aménagement salon",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerName: "Aminata Design",
    designerAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&crop=faces&w=120&q=80",
    designerCity: "Cotonou",
    prestationLabel: "Standard — Plan d'aménagement complet",
    prix: 250000,
    montantPaye: 250000,
    solde: 0,
    livrablesPromis: ["Plan 2D", "Palette", "Sourcing mobilier"],
    revisionsIncluses: 2,
    piece: "Salon",
    style: "Moderne épuré",
    superficie: "28 m²",
    budgetConseil: { min: 600000, max: 1200000 },
    dateDemarrage: "10 mai 2026",
    dateLivraison: "25 mai 2026",
  },
};

// ── Projets artisan sur-mesure ──

export interface ArtisanProjectMock {
  id: string;
  briefId: string;
  status: string;
  title: string;
  image: string;
  clientName: string;
  clientAvatar: string;
  artisanName: string;
  artisanAvatar: string;
  artisanCity: string;
  prixInitial: number;
  prixFinal: number;
  montantPaye: number;
  materiaux: string;
  dimensions: string;
  delaiInitial: string;
  delaiFinal: string;
  quantite: number;
  livraisonAdresse: string;
  livraisonPhone: string;
}

export const MOCK_ARTISAN_PROJECTS: Record<string, ArtisanProjectMock> = {
  "PA-001": {
    id: "PA-001",
    briefId: "BRF-ART-001",
    status: "DELIVERY_PENDING",
    title: "Table basse sur mesure (bois iroko + wax)",
    image: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanName: "Kofi Akindélé",
    artisanAvatar: "https://images.unsplash.com/photo-1614023342667-6f060e9d1e04?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Cotonou",
    prixInitial: 220000,
    prixFinal: 220000,
    montantPaye: 110000,
    materiaux: "Bois iroko massif, tissu wax, vernis naturel",
    dimensions: "120 × 60 × 45 cm",
    delaiInitial: "18 jours",
    delaiFinal: "18 jours",
    quantite: 1,
    livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
    livraisonPhone: "+229 01 97 45 23 10",
  },
  "PA-002": {
    id: "PA-002",
    briefId: "BRF-ART-002",
    status: "DELIVERED_PENDING_CONFIRMATION",
    title: "Lampe Abat-jour Bogolan",
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanName: "Fatou Loko",
    artisanAvatar: "https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Ouidah",
    prixInitial: 68000,
    prixFinal: 68000,
    montantPaye: 34000,
    materiaux: "Tissu bogolan, structure métal, douille porcelaine",
    dimensions: "Ø 35 x 45 cm",
    delaiInitial: "10 jours",
    delaiFinal: "10 jours",
    quantite: 1,
    livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
    livraisonPhone: "+229 01 97 45 23 10",
  },
  "PA-004": {
    id: "PA-004",
    briefId: "BRF-ART-004",
    status: "IN_PRODUCTION",
    title: "Miroir Encadré Raffia",
    image: "https://images.unsplash.com/photo-1510828561531-05a3388f6d3d?auto=format&fit=crop&w=600&q=80",
    clientName: "Sophie Kossou",
    clientAvatar: "https://images.unsplash.com/photo-1614317226704-aba58b1ce153?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanName: "Brice Gogan",
    artisanAvatar: "https://images.unsplash.com/photo-1620932934088-fbdb2920e484?auto=format&fit=crop&crop=faces&w=120&q=80",
    artisanCity: "Cotonou",
    prixInitial: 95000,
    prixFinal: 95000,
    montantPaye: 47500,
    materiaux: "Raffia tressé, miroir biseauté, contreplaqué",
    dimensions: "Ø 60 cm",
    delaiInitial: "12 jours",
    delaiFinal: "12 jours",
    quantite: 1,
    livraisonAdresse: "12 rue des Lagunes, Akpakpa, Cotonou",
    livraisonPhone: "+229 01 97 45 23 10",
  },
};
