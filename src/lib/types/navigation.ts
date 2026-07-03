// ============================================================
// DEDCO — Types: Navigation
// ============================================================

export type Route =
  | { name: "home" }
  | { name: "inspirations" }
  | { name: "marketplace" }
  | { name: "designers" }
  | { name: "magazine" }
  | { name: "product"; id: number }
  | { name: "scene"; slug: string }
  | { name: "artisan"; id: number }
  | { name: "designer"; id: number }
  | { name: "favorites" }
  | { name: "brief" }
  | { name: "artisans" }
  | { name: "article"; id: number }
  | { name: "other" }; // route non-gérée par la navbar (dashboards, cart, etc.)
