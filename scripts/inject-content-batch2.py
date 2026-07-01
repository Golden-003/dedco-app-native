#!/usr/bin/env python3
"""Inject content batch 2: sections 4-31."""
import json
from pathlib import Path

HTML_PATH = Path("/home/z/my-project/public/dedcco-design-system.html")
HTML = HTML_PATH.read_text(encoding="utf-8")

icons = json.loads(Path("/tmp/lucide-icons.json").read_text())

def icon_svg(name, size=22):
    inner = icons.get(name, "")
    if not inner:
        return f'<span style="color:#ccc;font-size:10px;">[{name}]</span>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="var(--text-1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>'

ICONS_BY_CAT = [
    ("Navigation principale", [
        ("home", "Home", "Accueil, sidebar footer"),
        ("search", "Search", "Recherche globale, marketplace"),
        ("heart", "Heart", "Favoris, wishlist produits"),
        ("shopping-bag", "ShoppingBag", "Panier, commande"),
        ("user", "User", "Profil, compte utilisateur"),
        ("bell", "Bell", "Notifications (pulse si non-lus)"),
        ("menu", "Menu", "Drawer mobile, hamburger"),
        ("x", "X", "Fermer modale, annuler"),
    ]),
    ("Sidebar Designer", [
        ("layout-dashboard", "LayoutDashboard", "Dashboard designer"),
        ("file-text", "FileText", "Mes briefs (badge brouillons)"),
        ("folder-kanban", "FolderKanban", "Mes projets en fabrication"),
        ("message-circle", "MessageCircle", "Messages (badge non-lus)"),
        ("settings", "Settings", "Paramètres compte"),
    ]),
    ("Sidebar Artisan", [
        ("hammer", "Hammer", "Dashboard artisan (atelier)"),
        ("package", "Package", "Mes produits (catalogue)"),
        ("bar-chart-3", "BarChart3", "Statistiques business"),
        ("award", "Award", "Profil + niveau N1-N4"),
    ]),
    ("Sidebar Admin", [
        ("users", "Users", "Gestion utilisateurs + KYC"),
        ("clipboard-list", "ClipboardList", "Suivi commandes + litiges"),
    ]),
    ("Actions CRUD", [
        ("plus", "Plus", "Ajouter, créer nouveau"),
        ("check", "Check", "Valider, confirmer"),
        ("trash-2", "Trash2", "Supprimer (destructive)"),
        ("edit", "Edit", "Modifier, éditer"),
        ("eye", "Eye", "Voir détail, preview"),
        ("download", "Download", "Télécharger facture, image"),
        ("share-2", "Share2", "Partager brief, produit"),
        ("copy", "Copy", "Dupliquer brief, copier ID"),
    ]),
    ("Statuts & feedback", [
        ("check-circle-2", "CheckCircle2", "Succès — projet converti"),
        ("clock", "Clock", "En attente — brief publié"),
        ("alert-circle", "AlertCircle", "Attention — brief expiré"),
        ("x-circle", "XCircle", "Erreur — paiement failed"),
        ("loader-2", "Loader2", "Loading (avec .dedco-spin)"),
    ]),
    ("E-commerce & paiement", [
        ("shopping-cart", "ShoppingCart", "Panier détaillé, checkout"),
        ("credit-card", "CreditCard", "Paiement carte, acompte"),
        ("tag", "Tag", "Catégorie produit, promotion"),
        ("percent", "Percent", "Remise, commission plateforme"),
    ]),
    ("Flèches & navigation", [
        ("chevron-right", "ChevronRight", "Déplier arbo, breadcrumb"),
        ("chevron-down", "ChevronDown", "Déplier accordion, dropdown"),
        ("arrow-right", "ArrowRight", "CTA suivant, pagination"),
        ("arrow-left", "ArrowLeft", "Retour, précédent"),
        ("filter", "Filter", "Filtres marketplace"),
        ("more-horizontal", "MoreHorizontal", "Menu contextuel, options"),
    ]),
    ("Communication", [
        ("mail", "Mail", "Email, contact"),
        ("phone", "Phone", "Téléphone (formaté Bénin)"),
        ("send", "Send", "Envoyer message"),
    ]),
    ("Évaluation", [
        ("star", "Star", "Rating (couleur amber)"),
    ]),
]

icons_html_parts = []
for cat_name, items in ICONS_BY_CAT:
    icons_html_parts.append(f'<h3 class="sub">{cat_name}</h3>')
    icons_html_parts.append('<div class="icon-grid">')
    for icon_key, pascal_name, usage in items:
        svg = icon_svg(icon_key, size=24)
        icons_html_parts.append(f'<div class="icon-card"><div class="icon-visual">{svg}</div><div class="icon-name">{pascal_name}</div><div class="icon-usage">{usage}</div></div>')
    icons_html_parts.append('</div>')
icons_html = "\n".join(icons_html_parts)

CONTENT = '''
<!-- ============== SECTION 4 : Couleurs sémantiques & neutres ============== -->
<div class="section-header">
  <div class="section-num">04 — Sémantique</div>
  <h2 class="section-title">Neutres, fonds, bordures</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Autour des trois couleurs primaires gravitent des neutres chauds — des fonds <strong>cream/warm</strong> légèrement teintés, des encres <strong>ink/ink-soft/ink-mute</strong> pour la typo, des bordures <strong>border/border-dark</strong> presqu'invisibles. Ces neutres ne sont jamais gris froids — la teinte tire toujours vers le warm pour cohérence avec la palette terre cuite.</p>

<h3 class="sub">Fonds (backgrounds)</h3>

<div class="swatch-grid">
  <div class="swatch">
    <div class="swatch-chip" style="background:var(--bg-cream);border:1px solid var(--border);"></div>
    <div class="swatch-name">bg-cream</div>
    <div class="swatch-meta">#FFFFFF · var(--bg-cream)</div>
    <div class="swatch-use">Fond principal du site, cards, modales</div>
  </div>
  <div class="swatch">
    <div class="swatch-chip" style="background:var(--bg-warm);border:1px solid var(--border);"></div>
    <div class="swatch-name">bg-warm</div>
    <div class="swatch-meta">#FAF8F5 · var(--bg-warm)</div>
    <div class="swatch-use">Sections alternées, hover ghost, skeletons shimmer</div>
  </div>
  <div class="swatch">
    <div class="swatch-chip" style="background:var(--text-1);"></div>
    <div class="swatch-name">text-1 (ink)</div>
    <div class="swatch-meta">#1E1813 · var(--text-1)</div>
    <div class="swatch-use">Texte principal, headings, boutons dark</div>
  </div>
  <div class="swatch">
    <div class="swatch-chip" style="background:var(--text-2);"></div>
    <div class="swatch-name">text-2 (ink-soft)</div>
    <div class="swatch-meta">#5B5048 · var(--text-2)</div>
    <div class="swatch-use">Texte secondaire, descriptions, meta</div>
  </div>
</div>

<h3 class="sub">Bordures & séparateurs</h3>

<p>Deux niveaux de bordures seulement. <code>--border</code> (#F0EEEC) est la bordure par défaut — quasi invisible, elle structure les cards et les inputs sans alourdir. <code>--border-dark</code> (#E0DDD8) est utilisée pour les hover states et les séparateurs internes qui nécessitent un peu plus de présence. Cette dualité évite le problème classique des UI où toutes les bordures ont le même poids visuel et où l'œil ne sait plus ce qui est cliquable.</p>

<table class="tokens">
  <thead><tr><th>Token</th><th>Valeur</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td><code>--border</code></td><td class="mono">#F0EEEC</td><td>Bordures de cards, inputs, séparateurs légers</td></tr>
    <tr><td><code>--border-dark</code></td><td class="mono">#E0DDD8</td><td>Hover states, séparateurs internes visibles</td></tr>
    <tr><td><code>--ring</code></td><td class="mono">var(--amber)</td><td>Focus ring shadcn</td></tr>
    <tr><td><code>::selection</code></td><td class="mono">bg amber-pale / fg amber-dark</td><td>Texte sélectionné</td></tr>
    <tr><td><code>*:focus-visible</code></td><td class="mono">outline 2px amber</td><td>Accessibilité clavier</td></tr>
  </tbody>
</table>

<!-- ============== SECTION 5 : Typographie ============== -->
<div class="section-header">
  <div class="section-num">05 — Typographie</div>
  <h2 class="section-title">Quache + Plus Jakarta Sans</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">La typographie Dedcco joue sur la tension entre une <strong>display serif premium (Quache)</strong> réservée aux mots, et une <strong>sans-serif moderne (Plus Jakarta Sans)</strong> qui prend en charge les chiffres. Cette dissociation est obtenue par un pattern <code>unicode-range</code> qui exclut les chiffres de Quache — les chiffres retombent automatiquement sur la sans-serif, créant un contraste éditorial signature.</p>

<h3 class="sub">Police display — Quache</h3>

<p>Quache est une display serif à fort caractère, disponible en cinq graisses (Light 300, Regular 400, Medium 500, Bold 700, Black 900). Elle est chargée depuis <code>/public/fonts/Quache-*.ttf</code> via cinq <code>@font-face</code> séparés. La subtilité clé : chaque <code>@font-face</code> déclare un <code>unicode-range</code> qui <em>exclut délibérément les chiffres</em> (U+0030 à U+0039). Conséquence pratique — dans un heading Quache, les chiffres sont rendus par la prochaine font de la stack (Plus Jakarta Sans), ce qui donne le pattern éditorial "serif words, sans digits" caractéristique des magazines premium.</p>

<h3 class="sub">Police corps — Plus Jakarta Sans</h3>

<p>Plus Jakarta Sans est chargée via <code>next/font/google</code> dans <code>layout.tsx</code>, avec les graisses 400, 500, 600, 700. La variable CSS <code>--font-jakarta</code> est posée sur le <code>&lt;body&gt;</code> et utilisée partout comme police par défaut. C'est une sans-serif géométrique moderne, optimisée pour l'écran, avec un œil assez ouvert pour rester lisible en petit corps. Elle gère parfaitement les chiffres tabulaires via <code>font-feature-settings: "tnum" 1, "lnum" 1</code>, ce qui est crucial pour les prix, notes, et stats.</p>

<h3 class="sub">Spécimens typographiques</h3>

<div class="specimen">
  <div class="label">Display 2XL — Quache 700</div>
  <div style="font-family:'Quache',Georgia,serif;font-size:48px;font-weight:700;line-height:1.05;color:var(--text-1);">L'atelier de Cotonou</div>
</div>

<div class="specimen">
  <div class="label">Display LG — Quache 500</div>
  <div style="font-family:'Quache',Georgia,serif;font-size:32px;font-weight:500;line-height:1.2;color:var(--text-1);">Catalogue 2026</div>
</div>

<div class="specimen">
  <div class="label">Section eyebrow — Plus Jakarta Sans 700</div>
  <div style="font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--amber);margin-bottom:6px;">Nouveautés — Mars 2026</div>
</div>

<div class="specimen">
  <div class="label">Body — Plus Jakarta Sans 400</div>
  <div style="font-size:13px;color:var(--text-1);">Le bois iroko est une essence noble, dense et durable, traditionnellement travaillée par les ébénistes du sud-Bénin. Chaque pièce est unique, numérotée, signée par son artisan.</div>
</div>

<!-- ============== SECTION 6 : Chiffres & alternative Quache ============== -->
<div class="section-header">
  <div class="section-num">06 — Numérique</div>
  <h2 class="section-title">Chiffres & alternative Quache</h2>
  <div class="section-rule"></div>
</div>

<div class="callout terra">
  <strong>⚠ Point critique — à lire absolument.</strong> La police display <em>Quache</em> ne contient <strong>aucun chiffre</strong> dans sa table de glyphs. C'est une display serif purement alphabétique, conçue pour les mots. Si on l'utilise naïvement pour des chiffres (prix, notes, dates), le navigateur affiche des <strong>tofu □□□</strong> ou un fallback système quelconque qui casse la cohérence visuelle. Ce point est délicat et facile à oublier — d'où cette section dédiée.
</div>

<h3 class="sub">Le problème technique en détail</h3>

<p>Quache est livrée avec un jeu de glyphs qui couvre les lettres latines (majuscules + minuscules), la ponctuation courante, et les accents français — mais <strong>pas les chiffres arabes (0-9)</strong>. Si on déclare <code>font-family: "Quache"</code> sur un élément contenant "125 000 FCFA", le navigateur tente d'afficher chaque caractère avec Quache : les lettres "FCFA" s'affichent en Quache, mais les chiffres "1", "2", "5", "0", "0", "0" tombent sur la font suivante de la stack — ou pire, sur un fallback système imprévisible si la stack n'est pas définie.</p>

<p>Pour résoudre ce problème de façon systémique, Dedcco utilise une technique CSS avancée : le <code>unicode-range</code> dans les <code>@font-face</code> de Quache. Cette règle déclare explicitement à Quache <em>quels caractères</em> elle peut afficher — en excluant délibérément la plage U+0030 à U+0039 (les chiffres 0-9). Conséquence : quand le navigateur rencontre un chiffre dans un heading Quache, il sait immédiatement que Quache ne le gère pas, et il saute au prochain membre de la stack (<code>var(--font-jakarta)</code>) qui, lui, gère parfaitement les chiffres.</p>

<pre class="code">// globals.css — @font-face avec unicode-range EXCLUANT les chiffres
@font-face {
  font-family: "Quache";
  font-weight: 700;
  font-display: swap;
  // U+0030-0039 = chiffres 0-9 → ABSENTS de cette déclaration
  // Donc Quache ne sera jamais utilisée pour les chiffres
  unicode-range: U+0020-002F, U+003A-007E, U+00A0-00FF, U+0100-017F, U+2000-206F;
  src: url("/fonts/Quache-Bold.ttf") format("truetype");
}

// Tous les headings héritent de la stack Quache → Jakarta → system
h1, h2, h3, h4, h5, h6 {
  font-family: "Quache", var(--font-jakarta), system-ui, sans-serif;
}

// Conséquence : un H1 contenant "Offre 2026" sera rendu :
//  - "Offre" en Quache (display serif)
//  - "2026" en Plus Jakarta Sans (sans-serif)
// C'est le pattern éditorial "serif words, sans digits" signature Dedcco</pre>

<h3 class="sub">Pour les blocs numériques — classe .font-numeric</h3>

<p>Le pattern <code>unicode-range</code> gère automatiquement les chiffres dans les headings, mais pour les blocs numériques dans le corps de texte (prix, statistiques, montants, notes), il faut explicitement forcer l'usage de Plus Jakarta Sans avec ses features typographiques <code>tnum</code> (tabular numbers — chiffres de même largeur pour alignement parfait) et <code>lnum</code> (lining numbers — chiffres à hauteur d'œil, pas les oldstyle avec descendantes). C'est le rôle de la classe <code>.font-numeric</code>.</p>

<div class="specimen">
  <div class="label">Sans .font-numeric — chiffres proportionnels</div>
  <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;font-weight:700;color:var(--text-1);">125 000 FCFA — 4.8/5 — 18 jours</div>
</div>

<div class="specimen">
  <div class="label">Avec .font-numeric — chiffres tabulaires (tnum + lnum)</div>
  <div style="font-family:'Plus Jakarta Sans',sans-serif;font-feature-settings:'tnum' 1,'lnum' 1;font-size:22px;font-weight:700;color:var(--text-1);">125 000 FCFA — 4.8/5 — 18 jours</div>
</div>

<p>La différence est subtile mais importante : avec <code>tnum</code>, les chiffres ont tous la même largeur (le "1" prend la même place que le "8"), ce qui permet aux prix de s'aligner verticalement dans une liste. Sans <code>tnum</code>, les chiffres ont des largeurs variables (le "1" est plus étroit), ce qui crée un effet "dégingandé" dans les tableaux et listes de prix.</p>

<h3 class="sub">Quand utiliser .font-numeric — checklist</h3>

<table class="tokens">
  <thead><tr><th>Contexte</th><th>Utiliser .font-numeric ?</th><th>Pourquoi</th></tr></thead>
  <tbody>
    <tr><td>Prix produit (cards, fiches)</td><td><strong>Oui</strong></td><td>Alignement vertical des prix dans les listes</td></tr>
    <tr><td>Statistiques dashboard (CA, count, %)</td><td><strong>Oui</strong></td><td>Alignement des KPIs dans les grids</td></tr>
    <tr><td>Notes et ratings (4.8/5)</td><td><strong>Oui</strong></td><td>Cohérence visuelle des étoiles + chiffre</td></tr>
    <tr><td>Durées et délais (18 jours)</td><td><strong>Oui</strong></td><td>Alignement dans les tables comparatives</td></tr>
    <tr><td>ID briefs/projets (BRA-000042)</td><td>Oui (recommandé)</td><td>Lisibilité + monospace-feel</td></tr>
    <tr><td>Numéros de téléphone</td><td>Non — utiliser <code>.mono</code></td><td>Le téléphone est en mono</td></tr>
    <tr><td>Heading contenant un chiffre ("Offre 2026")</td><td>Non — laisser Quache gérer</td><td>Le unicode-range fait le fallback automatique vers Jakarta</td></tr>
  </tbody>
</table>

<h3 class="sub">Définition CSS complète</h3>

<pre class="code">// globals.css — définition de .font-numeric
.font-numeric {
  font-family: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif !important;
  font-feature-settings: "tnum" 1, "lnum" 1;
  letter-spacing: -0.005em;
}

// tnum  = tabular numbers  → chiffres de largeur égale (alignement colonnes)
// lnum  = lining numbers    → chiffres à hauteur d'œil (pas de descendantes)
// letter-spacing légèrement négatif pour resserrement éditorial</pre>

<div class="callout forest">
  <strong>Règle d'or.</strong> Si un élément contient <em>uniquement</em> ou <em>majoritairement</em> des chiffres (prix, stat, note, ID), appliquer <code>.font-numeric</code>. Si l'élément est un heading avec quelques chiffres au milieu, ne rien faire — le <code>unicode-range</code> s'occupe du fallback automatique vers Jakarta. Cette double stratégie (unicode-range pour les headings + .font-numeric pour les blocs numériques) garantit que <strong>aucun chiffre n'est jamais rendu en Quache</strong>.
</div>

<h3 class="sub">À ne jamais faire</h3>

<div class="callout terra">
  <strong>Anti-patterns.</strong>
  <ul style="margin-top:6px;">
    <li><strong>❌ Appliquer Quache sur un prix</strong> — <code>className="font-display text-3xl"</code> sur "125 000 FCFA" → le navigateur essaie Quache, trouve tofu, fallback Jakarta sans tnum → alignement bancal</li>
    <li><strong>❌ Oublier .font-numeric sur les stats dashboard</strong> → les chiffres s'affichent en Jakarta par défaut mais sans tnum → les "1" sont plus étroits que les "8" → colonnes dégingandées</li>
    <li><strong>❌ Modifier les @font-face Quache pour inclure les chiffres</strong> → ça casserait le pattern éditorial signature</li>
    <li><strong>❌ Utiliser une police tierce pour les chiffres</strong> → Plus Jakarta Sans est faite pour ça, ses tabular figures sont parfaites</li>
  </ul>
</div>

<!-- ============== SECTION 7 : Radii & Shadows ============== -->
<div class="section-header">
  <div class="section-num">07 — Échelle</div>
  <h2 class="section-title">Tailles, espaces, rayons</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">L'échelle typographique utilise <strong>clamp()</strong> pour les display — les tailles s'adaptent fluidement au viewport. Les corps de texte sont fixes pour garantir la lisibilité. Côté spacing et radii, le système est volontairement restreint : 5 niveaux de radius, 5 niveaux de shadow, un système de spacing basé sur les utilitaires Tailwind par défaut.</p>

<h3 class="sub">Display scale (Quache)</h3>

<table class="tokens">
  <thead><tr><th>Classe</th><th>Taille</th><th>Graisse</th><th>Line-height</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td><code>.display-2xl</code></td><td>clamp(2.5rem, 6vw, 5rem)</td><td>700</td><td>1.05</td><td>Hero principal — une fois par page max</td></tr>
    <tr><td><code>.display-xl</code></td><td>clamp(2rem, 4vw, 3.5rem)</td><td>700</td><td>1.1</td><td>Hero secondaire, titre de page</td></tr>
    <tr><td><code>.display-lg</code></td><td>clamp(1.5rem, 3vw, 2.5rem)</td><td>500</td><td>1.2</td><td>Titres de section principaux</td></tr>
    <tr><td><code>.display-md</code></td><td>clamp(1.25rem, 2.5vw, 2rem)</td><td>500</td><td>1.25</td><td>Titres de sous-section</td></tr>
    <tr><td><code>.display-sm</code></td><td>1.25rem</td><td>500</td><td>1.3</td><td>Petits titres, titres de card</td></tr>
  </tbody>
</table>

<h3 class="sub">Radii</h3>

<table class="tokens">
  <thead><tr><th>Token</th><th>Valeur</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td><code>--radius-sm</code></td><td class="mono">4px</td><td>Badges, pills, petits indicateurs</td></tr>
    <tr><td><code>--radius-md</code></td><td class="mono">6px</td><td>Buttons, inputs, petits éléments</td></tr>
    <tr><td><code>--radius-lg</code></td><td class="mono">10px</td><td>Cards, modales, panels</td></tr>
    <tr><td><code>--radius-xl</code></td><td class="mono">14px</td><td>Grandes cards, hero blocks</td></tr>
    <tr><td><code>--radius-2xl</code></td><td class="mono">20px</td><td>Éléments décoratifs, featured cards</td></tr>
  </tbody>
</table>

<h3 class="sub">Shadows</h3>

<p>Les ombres Dedcco sont teintées chaudes — elles utilisent un <code>rgba(30, 24, 19, X)</code> qui rappelle la palette ink. Cinq niveaux génériques (xs → xl) plus une ombre teintée Amber pour les boutons primaires. Toutes les ombres respectent la règle de cohérence : la source de lumière vient du haut, la diffusion est douce, l'accent est subtil.</p>

<table class="tokens">
  <thead><tr><th>Token</th><th>Valeur</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td><code>--shadow-xs</code></td><td class="mono">0 1px 2px rgba(30,24,19,0.06)</td><td>Inputs, états rest</td></tr>
    <tr><td><code>--shadow-sm</code></td><td class="mono">0 1px 4px rgba(30,24,19,0.08)</td><td>Cards au repos, badges blancs</td></tr>
    <tr><td><code>--shadow-md</code></td><td class="mono">0 4px 12px rgba(30,24,19,0.1)</td><td>Dropdowns, popovers</td></tr>
    <tr><td><code>--shadow-lg</code></td><td class="mono">0 8px 24px rgba(30,24,19,0.12)</td><td>Modales, sheets</td></tr>
    <tr><td><code>--shadow-xl</code></td><td class="mono">0 16px 48px rgba(30,24,19,0.16)</td><td>Featured cards, mega-panels</td></tr>
    <tr><td><code>--shadow-amber</code></td><td class="mono">0 4px 16px rgba(191,121,59,0.3)</td><td>Bouton primaire au hover</td></tr>
  </tbody>
</table>

<!-- ============== SECTION 8 : Boutons ============== -->
<div class="section-header">
  <div class="section-num">08 — Composants</div>
  <h2 class="section-title">Boutons — système .dedco-btn</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Le système de boutons Dedcco est <strong>double</strong> : les classes <code>.dedco-btn-*</code> offrent un contrôle fin sur les variants colorés (terracotta, forest, amber, light), tandis que le composant shadcn <code>&lt;Button&gt;</code> fournit l'API standard (variant + size + asChild). Les deux coexistent légitimement — les classes <code>.dedco-*</code> sont privilégiées pour les CTA marketing et les boutons colorés, <code>&lt;Button&gt;</code> pour les flows applicatifs standard.</p>

<h3 class="sub">Variants .dedco-btn</h3>

<div class="preview">
  <div class="preview-label">Échantillons .dedco-btn</div>
  <span class="btn-sample primary">Primary</span>
  <span class="btn-sample secondary">Secondary</span>
  <span class="btn-sample ghost">Ghost</span>
  <span class="btn-sample light">Light</span>
  <span class="btn-sample terra">Terracotta</span>
  <span class="btn-sample forest">Forest</span>
</div>

<table class="tokens">
  <thead><tr><th>Classe</th><th>Fond</th><th>Texte</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td><code>.dedco-btn-primary</code></td><td>amber</td><td>blanc</td><td>CTA principal — "Publier le brief"</td></tr>
    <tr><td><code>.dedco-btn-secondary</code></td><td>transparent</td><td>amber</td><td>CTA secondaire — "Voir détails"</td></tr>
    <tr><td><code>.dedco-btn-ghost</code></td><td>transparent</td><td>text-1</td><td>Action tertiaire — "Annuler"</td></tr>
    <tr><td><code>.dedco-btn-light</code></td><td>blanc 95%</td><td>text-1</td><td>CTA sur fond coloré ou image — hero banner</td></tr>
    <tr><td><code>.dedco-btn-terracotta</code></td><td>terracotta</td><td>blanc</td><td>Action critique — "Annuler le brief"</td></tr>
    <tr><td><code>.dedco-btn-forest</code></td><td>forest</td><td>blanc</td><td>Validation — "Confirmer la commande"</td></tr>
  </tbody>
</table>

<h3 class="sub">États (hover, active, disabled, focus)</h3>

<p>Tous les boutons partagent les mêmes transitions : <code>transform 150ms ease, box-shadow 150ms ease, background 200ms ease</code>. Au hover, le bouton primaire passe en <code>amber-dark</code> avec une élévation <code>translateY(-1px)</code> et une ombre teintée amber <code>0 4px 12px rgba(191,121,59,0.3)</code>. Au <code>:active</code>, un <code>scale(0.97)</code> donne un feedback tactile. Le <code>:disabled</code> réduit l'opacité à 0.4 et désactive le curseur. Le <code>:focus-visible</code> applique un outline 3px solid amber avec offset 2px.</p>

<!-- ============== SECTION 9 : Badges ============== -->
<div class="section-header">
  <div class="section-num">09 — Composants</div>
  <h2 class="section-title">Badges & pills</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Le système de badges est lui aussi double. Les classes <code>.dedco-badge-*</code> offrent neuf variants couvrant tous les cas d'usage (statuts brief, niveaux artisan, catégories produit), tandis que le composant shadcn <code>&lt;Badge&gt;</code> fournit l'API standard pour les badges d'interface. Tous les badges sont en <code>rounded-full</code> avec padding réduit — c'est un parti pris éditorial qui les distingue des buttons.</p>

<h3 class="sub">Variants .dedco-badge</h3>

<div class="preview">
  <div class="preview-label">Échantillons .dedco-badge</div>
  <span class="badge-sample amber">Amber</span>
  <span class="badge-sample terra">Terracotta</span>
  <span class="badge-sample forest">Forest</span>
  <span class="badge-sample gray">Gray</span>
  <span class="badge-sample dark">Dark</span>
</div>

<table class="tokens">
  <thead><tr><th>Classe</th><th>Fond</th><th>Texte</th><th>Usage typique</th></tr></thead>
  <tbody>
    <tr><td><code>.dedco-badge-amber</code></td><td>amber-pale</td><td>amber-dark</td><td>Statut "PUBLISHED", "SUBMITTED"</td></tr>
    <tr><td><code>.dedco-badge-terra</code></td><td>terracotta-pale</td><td>terracotta</td><td>Statut "ARTISAN_SELECTED", "AWAITING_DEPOSIT"</td></tr>
    <tr><td><code>.dedco-badge-forest</code></td><td>forest-pale</td><td>forest</td><td>Statut "CONVERTED_TO_PROJECT", artisan vérifié</td></tr>
    <tr><td><code>.dedco-badge-gray</code></td><td>bg-warm</td><td>text-2</td><td>Statut "DRAFT", meta neutre, placeholders</td></tr>
    <tr><td><code>.dedco-badge-dark</code></td><td>text-1 (ink)</td><td>blanc</td><td>Badge premium, "Sélection", mise en avant</td></tr>
    <tr><td><code>.dedco-badge-amber-solid</code></td><td>amber</td><td>blanc</td><td>Badge de niveau "N1", stats clés</td></tr>
    <tr><td><code>.dedco-badge-terra-solid</code></td><td>terracotta</td><td>blanc</td><td>Badge "Urgent", "Expiré" en mode fort</td></tr>
  </tbody>
</table>

<h3 class="sub">Niveaux artisan N1-N4</h3>

<p>Les artisans Dedcco sont classés sur quatre niveaux — N1 (débutant vérifié), N2 (confirmé), N3 (expert), N4 (maître artisan). Les badges de niveau utilisent les variants solid : <code>N1 → gray</code>, <code>N2 → amber-solid</code>, <code>N3 → terra-solid</code>, <code>N4 → dark</code>. Ce mapping est volontairement progressif — du plus clair au plus foncé — pour donner à l'œil une hiérarchie immédiate.</p>

<!-- ============== SECTION 10 : Cards ============== -->
<div class="section-header">
  <div class="section-num">10 — Composants</div>
  <h2 class="section-title">Cards & containers</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">La card Dedcco est définie par la classe <code>.dedco-card</code> et le composant shadcn <code>&lt;Card&gt;</code>. Les deux partagent les mêmes tokens — fond <code>bg-card</code>, bordure 1px <code>--border</code>, radius 10px, ombre <code>--shadow-sm</code> au repos. La signature Dedcco est l'effet hover : <code>translateY(-2px)</code> avec une ombre plus marquée, qui donne une sensation de carte qui se soulève doucement.</p>

<h3 class="sub">Anatomie .dedco-card</h3>

<div class="two-col">
  <div class="card-sample">
    <div class="t">Fauteuil Iroko "Cotonou"</div>
    <div class="d">Pièce unique par Koffi Adjassin — atelier de Porto-Novo. Bois massif, finition huilée.</div>
    <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;">
      <span class="badge-sample forest">Vérifié N3</span>
      <span class="num" style="font-weight:700;color:var(--amber-dark);">125 000 FCFA</span>
    </div>
  </div>
  <div class="card-sample">
    <div class="t">Brief BRA-000042</div>
    <div class="d">Chambre à coucher — style moderne épuré. Budget 350k-500k FCFA, délai 30 jours.</div>
    <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;">
      <span class="badge-sample amber">Publié</span>
      <span class="num" style="color:var(--text-3);font-size:11px;">3 propositions</span>
    </div>
  </div>
</div>

<pre class="code">// .dedco-card — pattern hover signature Dedcco
.dedco-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
.dedco-card:hover {
  box-shadow: 0 8px 24px rgba(30, 24, 19, 0.08),
              0 2px 8px rgba(30, 24, 19, 0.04);
  transform: translateY(-2px);
}</pre>

<!-- ============== SECTION 11 : shadcn/ui inventory ============== -->
<div class="section-header">
  <div class="section-num">11 — Composants</div>
  <h2 class="section-title">Inventaire shadcn/ui</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Le projet embarque <strong>51 composants shadcn/ui</strong> dans <code>src/components/ui/</code>, tous stylés aux tokens Dedcco via le mapping <code>@theme inline</code>. Cette section inventorie ces composants et précise les cas d'usage typiques. Aucun de ces fichiers ne doit être modifié directement — ils sont régénérables via <code>npx shadcn add</code>.</p>

<table class="tokens">
  <thead><tr><th>Catégorie</th><th>Composants</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td><strong>Forms</strong></td><td>Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Label, Form, InputOTP</td><td>Tous les formulaires — login, register, brief-create, KYC, checkout</td></tr>
    <tr><td><strong>Overlay</strong></td><td>Dialog, Sheet, Drawer, Popover, HoverCard, Tooltip, AlertDialog</td><td>Modales, sheets mobile, popovers de filtres, tooltips d'aide</td></tr>
    <tr><td><strong>Navigation</strong></td><td>Tabs, NavigationMenu, Menubar, Breadcrumb, Pagination, Sidebar</td><td>Navigation principale, sous-pages, breadcrumbs marketplace</td></tr>
    <tr><td><strong>Feedback</strong></td><td>Toast, Toaster, Sonner, Alert, Progress, Skeleton</td><td>Notifications, états de chargement, alertes formulaire</td></tr>
    <tr><td><strong>Data display</strong></td><td>Table, Chart, Avatar, Badge, Separator, ScrollArea, AspectRatio</td><td>Listes, tableaux de bord, profils, badges de statut</td></tr>
    <tr><td><strong>Selection</strong></td><td>Command, DropdownMenu, ContextMenu, Combobox, Calendar</td><td>Recherche, menus contextuels, sélection de date</td></tr>
    <tr><td><strong>Layout</strong></td><td>Card, Accordion, Collapsible, Resizable, Toggle, ToggleGroup</td><td>Cards, accordions FAQ, panneaux redimensionnables</td></tr>
    <tr><td><strong>Carousel</strong></td><td>Carousel</td><td>Carrousel produits, sliders d'inspiration</td></tr>
  </tbody>
</table>

<div class="callout">
  <strong>Anti-pattern.</strong> Ne jamais copier un composant shadcn dans <code>src/components/dedco/</code> pour le modifier. Ça crée de la duplication qui sera perdue à la prochaine régénération. Toujours wrapper, jamais copier.
</div>

<!-- ============== SECTION 12 : Layouts par rôle ============== -->
<div class="section-header">
  <div class="section-num">12 — Layouts</div>
  <h2 class="section-title">Layouts par rôle</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">L'espace designer est accessible depuis <code>/designer/*</code> et se structure autour d'une <strong>sidebar fixe 240px</strong> + content scrollable. L'artisan a un espace similaire avec ses propres pages (orders, products, stats, profile, brief-workflow). L'admin gère la marketplace (users, products, orders, content, analytics). Le client navigue la marketplace.</p>

<h3 class="sub">Designer — 5 pages principales</h3>

<div class="tree">src/components/dedco/pages/designer/
  designer-layout.tsx      # Shell sidebar + content
  designer-dashboard.tsx   # KPIs + briefs récents + actions rapides
  designer-briefs.tsx      # Liste briefs avec filtres statut
  brief-detail.tsx         # Détail brief + propositions + actions
  designer-projects.tsx    # Projets en fabrication avec progression
  designer-profile.tsx     # Profil public designer + portfolio
  designer-settings.tsx    # Compte, paiement, notifications</div>

<h3 class="sub">Artisan — 6 pages principales</h3>

<div class="tree">src/components/dedco/pages/artisan/
  artisan-layout.tsx           # Shell sidebar + content
  artisan-dashboard.tsx        # KPIs + briefs à répondre + commandes
  artisan-orders.tsx           # Commandes par statut
  artisan-products.tsx         # Catalogue produits + ajout/modif
  artisan-stats.tsx            # CA, panier moyen, taux de conversion
  artisan-profile.tsx          # Profil public + portfolio + niveau N1-N4
  artisan-brief-workflow.tsx   # Workflow de réponse à un brief</div>

<h3 class="sub">Sidebar partagée — composant DashboardSidebar</h3>

<p>Tous les espaces rôles (designer, artisan, admin, mais aussi "maison") partagent le composant <code>DashboardSidebar</code> défini dans <code>src/components/dedco/pages/shared-sidebar.tsx</code>. Ce composant prend en props <code>title</code>, <code>subtitle</code>, <code>items</code> (NavItem[]) et <code>currentPage</code>. Il gère l'affichage desktop (sidebar fixe 240px) et mobile (drawer avec overlay).</p>

<div class="two-col">
  <div class="card-sample" style="padding:0;overflow:hidden;">
    <div style="padding:14px 16px;border-bottom:1px solid var(--border);">
      <div style="font-family:'Quache',serif;font-size:18px;font-weight:600;color:var(--text-1);">Dedco<span style="color:var(--amber);">.</span></div>
      <div style="font-size:11px;color:var(--text-3);margin-top:2px;">Espace Designer</div>
    </div>
    <div style="padding:8px;">
      <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--amber-pale);color:var(--amber-dark);border-radius:6px;font-size:12px;font-weight:500;">
        Dashboard
      </div>
      <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;color:var(--text-2);font-size:12px;margin-top:2px;">
        Mes briefs
        <span style="margin-left:auto;background:var(--terracotta);color:white;font-size:9px;padding:1px 6px;border-radius:999px;font-weight:700;">3</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;color:var(--text-2);font-size:12px;margin-top:2px;">
        Mes projets
      </div>
      <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;color:var(--text-2);font-size:12px;margin-top:2px;">
        Messages
        <span style="margin-left:auto;background:var(--terracotta);color:white;font-size:9px;padding:1px 6px;border-radius:999px;font-weight:700;">5</span>
      </div>
    </div>
  </div>
  <div>
    <h4 class="minor">Structure</h4>
    <ul>
      <li><strong>Header brand</strong> — Dedco. en Quache 18px + subtitle rôle</li>
      <li><strong>Nav items</strong> — boutons avec icône Lucide + label + badge optionnel</li>
      <li><strong>Active state</strong> — <code>bg-amber-pale</code> + <code>text-amber-dark</code></li>
      <li><strong>Hover state</strong> — <code>bg-warm</code> + <code>text-1</code></li>
      <li><strong>Footer</strong> — "Retour au site" (icône Home)</li>
      <li><strong>Mobile</strong> — drawer avec overlay + bouton hamburger</li>
    </ul>
  </div>
</div>

<!-- ============== SECTION 13 : Moteur brief-artisan ============== -->
<div class="section-header">
  <div class="section-num">13 — Cœur métier</div>
  <h2 class="section-title">Le moteur brief-artisan</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Le moteur <code>brief-artisan</code> est le <strong>cœur métier de Dedcco</strong>. Il orchestre le workflow qui mène un client de l'idée de brief jusqu'à la conversion en projet de fabrication. Cette section détaille l'architecture du module — huit fichiers organisés en couches strictement séparées : types, statuts, transitions, permissions, helpers, notifications, engine, mock.</p>

<h3 class="sub">Architecture du module</h3>

<div class="tree">src/lib/brief-artisan/
  index.ts          # Point d'entrée public — re-exporte tout
  types.ts          # Modèle métier : BriefArtisan, BriefAction, etc.
  statuses.ts       # 11 statuts + StatusConfig (label, couleur, terminal, urgent)
  transitions.ts    # Table unique des 23 transitions autorisées
  permissions.ts    # 13 fonctions canXxx() — wrappers sémantiques
  helpers.ts        # Getters : getStatusColor, getProgress, getRemainingDays...
  notifications.ts  # NOTIFICATION_CONFIGS + generateNotifications()
  engine.ts         # transitionBrief() + applyTransition() — actions mutate
  mock.ts           # MOCK_BRIEFS — données de démo</div>

<div class="callout forest">
  <strong>Single source of truth.</strong> Le module <code>brief-artisan</code> est conçu pour être la seule source de vérité sur le cycle de vie d'un brief. Toute logique de statut, transition, ou permission qui vit en dehors de ce module est un bug potentiel. Si vous devez ajouter une règle, ajoutez-la ici — pas dans la page.
</div>

<!-- ============== SECTION 14 : Les 11 statuts ============== -->
<div class="section-header">
  <div class="section-num">14 — Cœur métier</div>
  <h2 class="section-title">Les 11 statuts brief</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Le cycle de vie d'un brief traverse <strong>11 statuts</strong> — 7 actifs et 4 terminaux. Chaque statut est défini par un code, un label, une description, une paire couleur/bgColor, et deux flags booléens <code>isTerminal</code> et <code>isUrgent</code>. La table <code>BRIEF_ARTISAN_STATUSES</code> est l'unique référence.</p>

<h3 class="sub">Flow visuel des statuts</h3>

<div class="status-flow">
  <span class="status-pill draft">DRAFT</span>
  <span class="arrow">→</span>
  <span class="status-pill submitted">SUBMITTED</span>
  <span class="arrow">→</span>
  <span class="status-pill published">PUBLISHED</span>
  <span class="arrow">→</span>
  <span class="status-pill proposals">PROPOSALS_RECEIVED</span>
  <span class="arrow">→</span>
  <span class="status-pill discussion">IN_DISCUSSION</span>
  <span class="arrow">→</span>
  <span class="status-pill selected">ARTISAN_SELECTED</span>
  <span class="arrow">→</span>
  <span class="status-pill deposit">AWAITING_DEPOSIT</span>
  <span class="arrow">→</span>
  <span class="status-pill converted">CONVERTED_TO_PROJECT</span>
</div>

<div class="status-flow">
  <span class="status-pill expired">EXPIRED</span>
  <span class="arrow">·</span>
  <span class="status-pill cancelled">CANCELLED</span>
  <span class="arrow">·</span>
  <span class="status-pill closed">CLOSED</span>
  <span style="font-size:10px;color:var(--text-3);margin-left:8px;">— terminaux</span>
</div>

<h3 class="sub">Table complète des statuts</h3>

<table class="tokens">
  <thead><tr><th>Statut</th><th>Label</th><th>Couleur</th><th>Terminal</th><th>Urgent</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>DRAFT</code></td><td>Brouillon</td><td class="mono">#7A6E65</td><td>non</td><td>non</td><td>Brief en cours de rédaction, non visible par les artisans</td></tr>
    <tr><td><code>SUBMITTED</code></td><td>Prêt à publier</td><td class="mono">#B8702F</td><td>non</td><td>non</td><td>Brief complet, en attente de publication</td></tr>
    <tr><td><code>PUBLISHED</code></td><td>En recherche d'artisan</td><td class="mono">#B8702F</td><td>non</td><td>non</td><td>Brief visible par les artisans vérifiés</td></tr>
    <tr><td><code>PROPOSALS_RECEIVED</code></td><td>Propositions reçues</td><td class="mono">#4A7A3C</td><td>non</td><td>non</td><td>Un ou plusieurs artisans ont répondu au brief</td></tr>
    <tr><td><code>IN_DISCUSSION</code></td><td>En discussion</td><td class="mono">#3B6EA5</td><td>non</td><td>non</td><td>Discussion en cours avec un artisan</td></tr>
    <tr><td><code>ARTISAN_SELECTED</code></td><td>Artisan sélectionné</td><td class="mono">#A6442E</td><td>non</td><td>non</td><td>Proposition choisie, en attente de confirmation</td></tr>
    <tr><td><code>AWAITING_DEPOSIT</code></td><td>Paiement à effectuer</td><td class="mono">#A6442E</td><td>non</td><td><strong>oui</strong></td><td>Paiement sécurisé en attente pour démarrer le projet</td></tr>
    <tr><td><code>CONVERTED_TO_PROJECT</code></td><td>Projet créé</td><td class="mono">#4A7A3C</td><td><strong>oui</strong></td><td>non</td><td>Brief converti en projet artisan, fabrication en cours</td></tr>
    <tr><td><code>EXPIRED</code></td><td>Brief expiré</td><td class="mono">#7A6E65</td><td><strong>oui</strong></td><td>non</td><td>Aucune proposition reçue dans les 14 jours</td></tr>
    <tr><td><code>CANCELLED</code></td><td>Brief annulé</td><td class="mono">#7A6E65</td><td><strong>oui</strong></td><td>non</td><td>Brief annulé par le client</td></tr>
    <tr><td><code>CLOSED</code></td><td>Brief clôturé</td><td class="mono">#7A6E65</td><td><strong>oui</strong></td><td>non</td><td>Brief clôturé après conversion en projet</td></tr>
  </tbody>
</table>

<div class="callout terra">
  <strong>Le statut AWAITING_DEPOSIT est le seul "urgent".</strong> Quand un brief arrive dans cet état, l'UI doit déclencher un feedback visuel fort — badge pulse, couleur terracotta, notification push. C'est le moment critique où le client doit payer l'acompte pour débloquer la fabrication.
</div>

<!-- ============== SECTION 15 : Transitions ============== -->
<div class="section-header">
  <div class="section-num">15 — Cœur métier</div>
  <h2 class="section-title">Table des transitions</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">La table <code>BRIEF_TRANSITIONS</code> est l'unique source de vérité sur les changements de statut autorisés. Elle contient <strong>23 transitions</strong>, chacune définie par un état source (<code>from</code>), une action (<code>action</code>), un état cible (<code>to</code>), une liste de rôles autorisés (<code>roles</code>), et une liste de notifications à déclencher (<code>notifications</code>).</p>

<h3 class="sub">Table exhaustive des transitions</h3>

<table class="tokens">
  <thead><tr><th>From</th><th>Action</th><th>To</th><th>Rôles</th><th>Notifications</th></tr></thead>
  <tbody>
    <tr><td>DRAFT</td><td>submit</td><td>SUBMITTED</td><td>client</td><td>brief_submitted</td></tr>
    <tr><td>DRAFT</td><td>cancel</td><td>CANCELLED</td><td>client</td><td>brief_cancelled</td></tr>
    <tr><td>SUBMITTED</td><td>publish</td><td>PUBLISHED</td><td>client, system</td><td>brief_published</td></tr>
    <tr><td>SUBMITTED</td><td>cancel</td><td>CANCELLED</td><td>client</td><td>brief_cancelled</td></tr>
    <tr><td>PUBLISHED</td><td>receiveProposal</td><td>PROPOSALS_RECEIVED</td><td>artisan, system</td><td>proposal_received</td></tr>
    <tr><td>PUBLISHED</td><td>expire</td><td>EXPIRED</td><td>system</td><td>brief_expired</td></tr>
    <tr><td>PUBLISHED</td><td>cancel</td><td>CANCELLED</td><td>client</td><td>brief_cancelled</td></tr>
    <tr><td>PROPOSALS_RECEIVED</td><td>startDiscussion</td><td>IN_DISCUSSION</td><td>client</td><td>discussion_started</td></tr>
    <tr><td>PROPOSALS_RECEIVED</td><td>selectProposal</td><td>ARTISAN_SELECTED</td><td>client</td><td>artisan_selected</td></tr>
    <tr><td>PROPOSALS_RECEIVED</td><td>expire</td><td>EXPIRED</td><td>system</td><td>brief_expired</td></tr>
    <tr><td>PROPOSALS_RECEIVED</td><td>cancel</td><td>CANCELLED</td><td>client</td><td>brief_cancelled</td></tr>
    <tr><td>IN_DISCUSSION</td><td>selectProposal</td><td>ARTISAN_SELECTED</td><td>client</td><td>artisan_selected</td></tr>
    <tr><td>IN_DISCUSSION</td><td>startDiscussion</td><td>PROPOSALS_RECEIVED</td><td>client</td><td>— (retour)</td></tr>
    <tr><td>IN_DISCUSSION</td><td>cancel</td><td>CANCELLED</td><td>client</td><td>brief_cancelled</td></tr>
    <tr><td>ARTISAN_SELECTED</td><td>confirmSelection</td><td>AWAITING_DEPOSIT</td><td>client</td><td>payment_requested</td></tr>
    <tr><td>ARTISAN_SELECTED</td><td>selectProposal</td><td>PROPOSALS_RECEIVED</td><td>client</td><td>— (changement d'avis)</td></tr>
    <tr><td>ARTISAN_SELECTED</td><td>cancel</td><td>CANCELLED</td><td>client</td><td>brief_cancelled</td></tr>
    <tr><td>AWAITING_DEPOSIT</td><td>payDeposit</td><td>CONVERTED_TO_PROJECT</td><td>client</td><td>payment_confirmed, project_created</td></tr>
    <tr><td>AWAITING_DEPOSIT</td><td>selectProposal</td><td>ARTISAN_SELECTED</td><td>client</td><td>— (retour)</td></tr>
    <tr><td>AWAITING_DEPOSIT</td><td>cancel</td><td>CANCELLED</td><td>client</td><td>brief_cancelled</td></tr>
    <tr><td>EXPIRED</td><td>relance</td><td>PUBLISHED</td><td>client</td><td>brief_published</td></tr>
    <tr><td>EXPIRED</td><td>duplicate</td><td>DRAFT</td><td>client</td><td>—</td></tr>
    <tr><td>CANCELLED</td><td>duplicate</td><td>DRAFT</td><td>client</td><td>—</td></tr>
    <tr><td>CONVERTED_TO_PROJECT</td><td>close</td><td>CLOSED</td><td>system</td><td>—</td></tr>
  </tbody>
</table>

<h3 class="sub">Permissions (13 fonctions)</h3>

<pre class="code">canEditBrief(brief, role)         // status === DRAFT && role === client
canSubmitBrief(brief, role)       // canTransition(submit)
canPublishBrief(brief, role)      // canTransition(publish)
canCancelBrief(brief, role)       // canTransition(cancel) && !isTerminal
canStartDiscussion(brief, role)   // canTransition(startDiscussion)
canSelectProposal(brief, role)    // canTransition + proposals.length > 0
canConfirmSelection(brief, role)  // canTransition + selectedProposalId
canPayDeposit(brief, role)        // canTransition(payDeposit)
canDuplicateBrief(brief, role)    // canTransition(duplicate)
canRelanceBrief(brief, role)      // canTransition(relance)
canPerformAction(brief, action, role)  // générique
isBriefActive(brief)              // !isTerminal
canReceiveProposals(brief)        // status === PUBLISHED</pre>

<h3 class="sub">Engine — pattern d'usage</h3>

<pre class="code">function handlePayDeposit(brief) {
  if (!canPayDeposit(brief, role)) return;
  const result = transitionBrief(brief, 'payDeposit', role);
  if (!result.success) return;
  const updated = applyTransition(brief, result);
  updateBriefInStore(updated);
  result.notifications?.forEach(t => sendNotification(t, brief));
}</pre>

<h3 class="sub">13 triggers de notification</h3>

<p><code>brief_submitted, brief_published, proposal_received, discussion_started, artisan_selected, payment_requested, payment_confirmed, project_created, brief_expired, brief_cancelled, modification_requested, modification_accepted, modification_rejected</code></p>

<!-- ============== SECTION 16 : Animations & motion ============== -->
<div class="section-header">
  <div class="section-num">16 — Motion</div>
  <h2 class="section-title">Bibliothèque d'animations</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Dedcco embarque une bibliothèque d'animations <strong>complète et systématique</strong> dans <code>globals.css</code>. Toutes les keyframes sont préfixées <code>dedco-*</code> et les classes utilitaires associées suivent la même convention.</p>

<table class="tokens">
  <thead><tr><th>Classe</th><th>Effet</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td><code>.dedco-fade-up</code></td><td>opacity + translateY 20px→0</td><td>Scroll reveal</td></tr>
    <tr><td><code>.dedco-scale-in</code></td><td>opacity + scale 0.95→1</td><td>Modales, drawers</td></tr>
    <tr><td><code>.dedco-shimmer</code></td><td>défilement background-position</td><td>Skeletons loading</td></tr>
    <tr><td><code>.dedco-spin</code></td><td>rotate 0→360</td><td>Spinner (Loader2)</td></tr>
    <tr><td><code>.dedco-pulse</code></td><td>scale 1→1.15→1</td><td>Badges notification, Bell</td></tr>
    <tr><td><code>.dedco-bounce-soft</code></td><td>translateY 0→-3px→0</td><td>Icônes urgentes</td></tr>
    <tr><td><code>.dedco-img-zoom</code></td><td>scale(1.05) sur img au hover</td><td>Cards produit</td></tr>
    <tr><td><code>.dedco-link</code></td><td>underline animé gauche→droite</td><td>Liens textuels</td></tr>
    <tr><td><code>.dedco-stagger-1</code> à <code>-6</code></td><td>délai 0.05s à 0.30s</td><td>Cascade listes</td></tr>
  </tbody>
</table>

<!-- ============== SECTION 17 : Icônes Lucide ============== -->
<div class="section-header">
  <div class="section-num">17 — Iconographie</div>
  <h2 class="section-title">Icônes Lucide — bibliothèque d'usage</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Toutes les icônes Dedcco proviennent de <strong>lucide-react</strong> (v0.525), une bibliothèque open-source d'icônes SVG à stroke 2px. Cette section documente <strong>quelles icônes sont utilisées où</strong> dans le site, organisées par contexte. Chaque icône est présentée avec son nom PascalCase (pour l'import React), son nom kebab-case (pour l'arbre lucide), et son cas d'usage typique.</p>

<h3 class="sub">Convention d'usage</h3>

<p>Toutes les icônes Dedcco utilisent <strong>stroke 2px</strong>, <strong>linecap round</strong>, <strong>linejoin round</strong>, et <strong>fill none</strong>. La couleur par défaut est <code>currentColor</code> — l'icône hérite donc de la couleur de texte de son parent. Les tailles standard sont 18px (sidebar), 16px (boutons), 14px (badges), 24px (empty states).</p>

''' + icons_html + '''

<h3 class="sub">Tailles standard par contexte</h3>

<table class="tokens">
  <thead><tr><th>Contexte</th><th>Taille</th><th>Couleur</th></tr></thead>
  <tbody>
    <tr><td>Sidebar navigation</td><td class="mono">18px</td><td>text-2 (idle) / amber-dark (active)</td></tr>
    <tr><td>Boutons (avec texte)</td><td class="mono">16px</td><td>currentColor (hérite)</td></tr>
    <tr><td>Boutons icon-only</td><td class="mono">18px</td><td>currentColor</td></tr>
    <tr><td>Badges & pills</td><td class="mono">14px</td><td>Couleur du badge</td></tr>
    <tr><td>Empty states</td><td class="mono">24-32px</td><td>text-3 (très léger)</td></tr>
    <tr><td>Hero / illustration</td><td class="mono">48-64px</td><td>amber ou terracotta</td></tr>
  </tbody>
</table>

<h3 class="sub">Couleurs sémantiques des icônes</h3>

<table class="tokens">
  <thead><tr><th>Sémantique</th><th>Classe</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td>Action primaire</td><td><code>text-amber</code></td><td>CTA, étoiles rating, focus</td></tr>
    <tr><td>État critique</td><td><code>text-terracotta</code></td><td>Erreur, annulation, alerte</td></tr>
    <tr><td>Validation</td><td><code>text-forest</code></td><td>Succès, vérifié, confirmé</td></tr>
    <tr><td>Texte principal</td><td><code>text-ink</code></td><td>Icônes par défaut dans boutons ghost</td></tr>
    <tr><td>Texte secondaire</td><td><code>text-ink-soft</code></td><td>Icônes d'aide, info, meta</td></tr>
    <tr><td>Texte léger</td><td><code>text-ink-mute</code></td><td>Placeholders, empty states</td></tr>
  </tbody>
</table>

<!-- ============== SECTION 18 : Accessibilité ============== -->
<div class="section-header">
  <div class="section-num">18 — A11y</div>
  <h2 class="section-title">Accessibilité</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">L'accessibilité Dedcco repose sur quatre piliers : <strong>focus visible</strong> amber sur tous les éléments interactifs, <strong>contrastes WCAG AA</strong> vérifiés pour chaque couple couleur, <strong>safe-area</strong> mobile pour les notchs, et <strong>reduced-motion</strong> pour respecter les préférences utilisateur.</p>

<ul>
  <li><strong>Focus visible :</strong> <code>outline: 2px solid var(--amber)</code> sur <code>*:focus-visible</code>, 3px sur <code>.dedco-btn:focus-visible</code></li>
  <li><strong>Contrastes WCAG AA :</strong> text-1/text-2 sur cream ✓ ; text-3 réservé ≥14px ; amber sur blanc → utiliser amber-dark pour texte</li>
  <li><strong>Safe-area mobile :</strong> <code>.safe-bottom</code> = <code>padding-bottom: env(safe-area-inset-bottom)</code></li>
  <li><strong>Reduced motion :</strong> respecté via <code>tw-animate-css</code> — pulses/bounces coupés, spinners conservés</li>
  <li><strong>Sémantique HTML :</strong> <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;aside&gt;</code> — jamais <code>div onClick</code></li>
</ul>

<!-- ============== SECTION 19 : Conventions de code ============== -->
<div class="section-header">
  <div class="section-num">19 — Conventions</div>
  <h2 class="section-title">Structure & conventions</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Cette section documente les conventions de code à respecter pour contribuer au projet. Arborescence des dossiers, conventions de nommage, patterns d'import, gestion d'état — tout ce qu'un développeur doit savoir pour écrire du code Dedcco cohérent.</p>

<h3 class="sub">Arborescence src/</h3>

<div class="tree">src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root (Jakarta + Toaster)
│   └── globals.css   # Tokens + .dedco-* + animations
├── components/
│   ├── ui/           # 51 shadcn — ne pas modifier
│   └── dedco/        # Composants Dedcco custom
│       └── pages/    # designer/, artisan/, admin/
├── lib/
│   ├── utils.ts      # cn() helper
│   ├── store.ts      # Zustand global
│   ├── brief-artisan/ # 8 fichiers moteur
│   └── types/
└── hooks/</div>

<ul>
  <li><strong>.dedco-*</strong> = custom Dedcco (composition) ; <code>ui/*</code> = shadcn (application)</li>
  <li><strong>Tokens :</strong> toujours <code>var(--amber)</code>, jamais hex en dur</li>
  <li><strong>Store :</strong> Zustand, pas de Redux ni Context Provider</li>
  <li><strong>Imports :</strong> React/Next → externes → ui/ → dedco/ → lib/ → types</li>
</ul>

<!-- ============== SECTION 20 : Stack technique ============== -->
<div class="section-header">
  <div class="section-num">20 — Stack</div>
  <h2 class="section-title">Stack technique</h2>
  <div class="section-rule"></div>
</div>

<table class="tokens">
  <thead><tr><th>Package</th><th>Version</th><th>Rôle</th></tr></thead>
  <tbody>
    <tr><td>next</td><td class="mono">^16.1.1</td><td>Framework React, App Router</td></tr>
    <tr><td>react / react-dom</td><td class="mono">^19.0.0</td><td>UI runtime</td></tr>
    <tr><td>tailwindcss</td><td class="mono">^4</td><td>CSS utilities + @theme inline</td></tr>
    <tr><td>zustand</td><td class="mono">^5.0.6</td><td>State global</td></tr>
    <tr><td>react-hook-form + zod</td><td class="mono">^7.60 / ^4.0</td><td>Forms + validation</td></tr>
    <tr><td>framer-motion</td><td class="mono">^12.23</td><td>Animations complexes</td></tr>
    <tr><td>lucide-react</td><td class="mono">^0.525</td><td>Icônes SVG</td></tr>
    <tr><td>sonner</td><td class="mono">^2.0.6</td><td>Toasts</td></tr>
    <tr><td>prisma</td><td class="mono">^6.11</td><td>ORM base de données</td></tr>
    <tr><td>next-auth</td><td class="mono">^4.24</td><td>Authentification</td></tr>
    <tr><td>recharts</td><td class="mono">^2.15</td><td>Charts (admin)</td></tr>
  </tbody>
</table>

<!-- ============== SECTION 21 : Onboarding ============== -->
<div class="section-header">
  <div class="section-num">21 — Onboarding</div>
  <h2 class="section-title">Onboarding nouveaux arrivants</h2>
  <div class="section-rule"></div>
</div>

<h3 class="sub">Checklist — première demi-journée</h3>

<ul>
  <li><strong>1. Lire <code>globals.css</code></strong> en entier — c'est la source de vérité pour la palette, les radii, les shadows, les animations. 30 minutes bien investies.</li>
  <li><strong>2. Explorer <code>src/lib/brief-artisan/</code></strong> — lire les 8 fichiers dans l'ordre : types → statuses → transitions → permissions → engine. Comprendre la machine à états est essentiel.</li>
  <li><strong>3. Lancer le dev server</strong> : <code>bun dev</code> → http://localhost:3000. Naviguer en tant que client (home → marketplace → product), puis designer (dashboard → briefs), puis artisan (dashboard → orders).</li>
  <li><strong>4. Jouer avec les classes <code>.dedco-*</code></strong> — créer une page de test <code>src/app/playground/page.tsx</code>, y mettre des buttons, badges, cards, et observer les variants.</li>
  <li><strong>5. Lire ce brand book en entier</strong> — particulièrement les sections 6 (chiffres), 8 (boutons), 9 (badges), 13-15 (moteur brief-artisan).</li>
</ul>

<div class="callout forest">
  <strong>Fichiers à connaître par cœur.</strong>
  <ul style="margin-top:6px;">
    <li><code>src/app/globals.css</code> — design tokens + classes .dedco-*</li>
    <li><code>src/lib/brief-artisan/index.ts</code> — API publique du moteur</li>
    <li><code>src/lib/store.ts</code> — état global Zustand</li>
    <li><code>src/components/dedco/pages/shared-sidebar.tsx</code> — pattern de sidebar réutilisable</li>
    <li><code>src/app/layout.tsx</code> — config racine (fonts, Toaster, formatage téléphone)</li>
  </ul>
</div>

<!-- ============== SECTION 22 : Annexe ============== -->
<div class="section-header">
  <div class="section-num">22 — Annexe</div>
  <h2 class="section-title">Cheatsheet & glossaire</h2>
  <div class="section-rule"></div>
</div>

<h3 class="sub">Cheatsheet — tokens essentiels</h3>

<pre class="code">// Couleurs — toujours via var()
var(--amber)         #BF793B  — CTA primary, focus
var(--terracotta)    #A6442E  — destructive, selected
var(--forest)        #548C45  — success, verified
var(--text-1)        #1E1813  — texte principal
var(--text-2)        #5B5048  — texte secondaire
var(--bg-warm)       #FAF8F5  — fond chaud

// Classes .dedco-* les plus utilisées
.dedco-btn-primary    // CTA principal
.dedco-btn-ghost      // bouton secondaire
.dedco-badge-forest   // statut positif
.dedco-badge-terra    // statut critique
.dedco-card           // card avec hover translateY
.dedco-fade-up        // animation entrée
.dedco-shimmer        // skeleton loading
.dedco-divider        // séparateur bogolan
.font-numeric         // chiffres tabulaires

// Imports moteur brief-artisan
import {
  canSubmitBrief, canPublishBrief, canCancelBrief, canPayDeposit,
  transitionBrief, applyTransition,
  getStatusLabel, getStatusColor, getStatusBgColor,
} from '@/lib/brief-artisan';</pre>

<h3 class="sub">Glossaire métier Dedcco</h3>

<table class="tokens">
  <thead><tr><th>Terme</th><th>Définition</th></tr></thead>
  <tbody>
    <tr><td><strong>BRA</strong></td><td>Brief Artisan — préfixe d'ID des briefs (BRA-000001)</td></tr>
    <tr><td><strong>BAP</strong></td><td>Brief Artisan Proposal — préfixe des propositions (BAP-000001)</td></tr>
    <tr><td><strong>PRA</strong></td><td>Projet Artisan — préfixe des projets convertis (PRA-000001)</td></tr>
    <tr><td><strong>ART</strong></td><td>Artisan — préfixe d'ID artisan (ART-000001)</td></tr>
    <tr><td><strong>N1-N4</strong></td><td>Niveaux artisan : N1 débutant, N2 confirmé, N3 expert, N4 maître</td></tr>
    <tr><td><strong>Mobile Money</strong></td><td>Paiement mobile Béninois (MTN MoMo, Moov Money) — moyen de paiement principal</td></tr>
    <tr><td><strong>FCFA</strong></td><td>Franc CFA — monnaie officielle Bénin (1 EUR = 655.957 FCFA)</td></tr>
    <tr><td><strong>Bogolan</strong></td><td>Tissu traditionnel teint à la boue (Mali, Bénin) — inspiration motif séparateur</td></tr>
    <tr><td><strong>Wax</strong></td><td>Tissu imprimé cire, très populaire en Afrique de l'Ouest</td></tr>
    <tr><td><strong>Iroko</strong></td><td>Bois dur africain, essence noble utilisée en ébénisterie</td></tr>
    <tr><td><strong>Cotonou</strong></td><td>Capitale économique du Bénin — siège Dedcco</td></tr>
    <tr><td><strong>Porto-Novo</strong></td><td>Capitale administrative du Bénin — nombreux ateliers d'artisanat</td></tr>
    <tr><td><strong>KYC</strong></td><td>Know Your Customer — validation pièce d'identité pour artisans</td></tr>
    <tr><td><strong>Relance</strong></td><td>Action de remettre en PUBLISHED un brief EXPIRED</td></tr>
    <tr><td><strong>Acompte</strong></td><td>Paiement initial (30% du prix) qui déclenche la fabrication</td></tr>
  </tbody>
</table>

<div class="callout ok" style="margin-top:30px">
  <strong>Build with intent.</strong> Chaque classe .dedco-*, chaque token, chaque transition porte l'histoire d'un marché — Cotonou, le wax, l'iroko, la main qui façonne. <em>Bienvenue dans l'aventure.</em>
</div>
'''

# Insert before the closing </div> of main (line 731)
# The pattern is: content + blank lines + </div> + blank + ENDING comment
HTML = HTML.replace('\n\n\n</div>\n\n<!-- ========================== ENDING', f'\n\n{CONTENT}\n\n</div>\n\n<!-- ========================== ENDING')

HTML_PATH.write_text(HTML, encoding="utf-8")
print(f"✓ Injected content batch 2 (sections 4-22)")
print(f"  HTML size: {len(HTML)//1024}KB")
