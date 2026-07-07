#!/usr/bin/env python3
"""Generate HTML for two new brand book sections:
1. Chiffres & numérique — la précision Quache critique
2. Icônes Lucide — bibliothèque d'usage par contexte
"""
import json
from pathlib import Path

# Load icons
icons = json.loads(Path("/tmp/lucide-icons.json").read_text())

# Icons organized by category with usage context
ICONS_BY_CAT = [
    ("Navigation principale", [
        ("home", "Home", "Retour accueil, sidebar footer"),
        ("search", "Search", "Recherche globale, marketplace"),
        ("heart", "Heart", "Favoris, wishlist produits"),
        ("shopping-bag", "ShoppingBag", "Panier, commande"),
        ("user", "User", "Profil, compte utilisateur"),
        ("bell", "Bell", "Notifications (avec pulse si non-lus)"),
        ("menu", "Menu", "Drawer mobile, hamburger"),
        ("x", "X", "Fermer modale, annuler"),
    ]),
    ("Sidebar Designer", [
        ("layout-dashboard", "LayoutDashboard", "Dashboard designer"),
        ("file-text", "FileText", "Mes briefs (avec badge brouillons)"),
        ("folder-kanban", "FolderKanban", "Mes projets en fabrication"),
        ("message-circle", "MessageCircle", "Messages (avec badge non-lus)"),
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
        ("check-circle-2", "CheckCircle2", "Succès — projet converti, paiement OK"),
        ("clock", "Clock", "En attente — brief publié, paiement"),
        ("alert-circle", "AlertCircle", "Attention — brief expiré, litige"),
        ("x-circle", "XCircle", "Erreur — brief annulé, paiement failed"),
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
        ("arrow-right", "ArrowRight", "CTA « suivant », pagination"),
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
        ("star", "Star", "Rating (avec couleur amber)"),
    ]),
]


def icon_svg(name, size=22, stroke="currentColor"):
    """Return full SVG element for an icon."""
    inner = icons.get(name, "")
    if not inner:
        return f'<span style="color:#ccc;font-size:10px;">[{name}?]</span>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{inner}</svg>'


# ============================================================
# SECTION 1 : CHIFFRES & NUMÉRIQUE
# ============================================================
chiffres_html = """
<!-- ============== SECTION : Chiffres & numérique ============== -->
<div class="section-header">
  <div class="section-num">29 — Numérique</div>
  <h2 class="section-title">Chiffres &amp; alternative Quache</h2>
  <div class="section-rule"></div>
</div>

<div class="callout terra">
  <strong>⚠ Point critique — à lire absolument.</strong> La police display <em>Quache</em> ne contient <strong>aucun chiffre</strong> dans sa table de glyphs. C'est une display serif purement alphabétique, conçue pour les mots. Si on l'utilise naïvement pour des chiffres (prix, notes, dates), le navigateur affiche des <strong>tofu □□□</strong> ou un fallback système quelconque qui casse la cohérence visuelle. Ce point est délicat et facile à oublier — d'où cette section dédiée.
</div>

<h3 class="sub">Le problème technique en détail</h3>

<p>Quache est livrée avec un jeu de glyphs qui couvre les lettres latines (majuscules + minuscules), la ponctuation courante, et les accents français — mais <strong>pas les chiffres arabes (0-9)</strong>. Si on déclare <code>font-family: "Quache"</code> sur un élément contenant "125 000 FCFA", le navigateur tente d'afficher chaque caractère avec Quache : les lettres "FCFA" s'affichent en Quache, mais les chiffres "1", "2", "5", "0", "0", "0" tombent sur la font suivante de la stack — ou pire, sur un fallback système imprévisible si la stack n'est pas définie.</p>

<p>Pour résoudre ce problème de façon systémique, Dedcco utilise une technique CSS avancée : le <code>unicode-range</code> dans les <code>@font-face</code> de Quache. Cette règle déclare explicitement à Quache <em>quels caractères</em> elle peut afficher — en excluant délibérément la plage U+0030 à U+0039 (les chiffres 0-9). Conséquence : quand le navigateur rencontre un chiffre dans un heading Quache, il sait immédiatement que Quache ne le gère pas, et il saute au prochain membre de la stack (<code>var(--font-jakarta)</code>) qui, lui, gère parfaitement les chiffres.</p>

<pre class="code"><span class="c">// globals.css — @font-face avec unicode-range EXCLUANT les chiffres</span>
<span class="k">@font-face</span> {
  <span class="t">font-family</span>: <span class="s">"Quache"</span>;
  <span class="t">font-weight</span>: <span class="n">700</span>;
  <span class="t">font-display</span>: swap;
  <span class="c">// U+0030-0039 = chiffres 0-9 → ABSENTS de cette déclaration</span>
  <span class="c">// Donc Quache ne sera jamais utilisée pour les chiffres</span>
  <span class="t">unicode-range</span>: U+0020-002F, U+003A-007E, U+00A0-00FF, U+0100-017F, U+2000-206F;
  <span class="t">src</span>: <span class="s">url("/fonts/Quache-Bold.ttf")</span> format(<span class="s">"truetype"</span>);
}

<span class="c">// Tous les headings héritent de la stack Quache → Jakarta → system</span>
<span class="k">h1, h2, h3, h4, h5, h6</span> {
  <span class="t">font-family</span>: <span class="s">"Quache"</span>, var(--font-jakarta), system-ui, sans-serif;
}

<span class="c">// Conséquence : un H1 contenant "Offre 2026" sera rendu :</span>
<span class="c">//  - "Offre" en Quache (display serif)</span>
<span class="c">//  - "2026" en Plus Jakarta Sans (sans-serif)</span>
<span class="c">// C'est le pattern éditorial "serif words, sans digits" signature Dedcco</span></pre>

<h3 class="sub">Pour les blocs numériques — classe .font-numeric</h3>

<p>Le pattern <code>unicode-range</code> gère automatiquement les chiffres dans les headings, mais pour les blocs numériques dans le corps de texte (prix, statistiques, montants, notes), il faut explicitement forcer l'usage de Plus Jakarta Sans avec ses features typographiques <code>tnum</code> (tabular numbers — chiffres de même largeur pour alignement parfait) et <code>lnum</code> (lining numbers — chiffres à hauteur d'œil, pas les oldstyle avec descendantes). C'est le rôle de la classe <code>.font-numeric</code>.</p>

<div class="specimen">
  <div class="label">Sans .font-numeric — chiffres en Jakarta par défaut (proportionnels)</div>
  <div style="font-family:'Plus Jakarta Sans',sans-serif;font-size:22px;color:var(--text-1);font-weight:700;">125 000 FCFA — 4.8/5 — 18 jours</div>
</div>

<div class="specimen">
  <div class="label">Avec .font-numeric — chiffres tabulaires alignés (tnum + lnum)</div>
  <div style="font-family:'Plus Jakarta Sans',sans-serif;font-feature-settings:'tnum' 1,'lnum' 1;font-size:22px;color:var(--text-1);font-weight:700;">125 000 FCFA — 4.8/5 — 18 jours</div>
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
    <tr><td>Dates (12 mars 2026)</td><td>Oui (chiffres) + non (mois en lettres)</td><td>Mix — appliquer sur les chiffres seulement si possible</td></tr>
    <tr><td>Heading contenant un chiffre ("Offre 2026")</td><td>Non — laisser Quache gérer</td><td>Le unicode-range fait le fallback automatique vers Jakarta</td></tr>
  </tbody>
</table>

<h3 class="sub">Pattern d'usage dans les composants</h3>

<pre class="code"><span class="c">// Card produit — prix en .font-numeric</span>
&lt;<span class="k">div</span> className=<span class="s">"product-card"</span>&gt;
  &lt;<span class="k">h3</span> className=<span class="s">"font-display text-lg"</span>&gt;Fauteuil Iroko&lt;/<span class="k">h3</span>&gt;
  &lt;<span class="k">p</span> className=<span class="s">"text-sm text-ink-soft"</span>&gt;Par Koffi Adjassin&lt;/<span class="k">p</span>&gt;
  &lt;<span class="k">div</span> className=<span class="s">"flex justify-between items-center"</span>&gt;
    &lt;<span class="k">span</span> className=<span class="s">"font-numeric text-xl font-bold text-amber-dark"</span>&gt;
      125 000 FCFA
    &lt;/<span class="k">span</span>&gt;
    &lt;<span class="k">span</span> className=<span class="s">"font-numeric text-sm text-ink-soft"</span>&gt;
      4.8 ★ · 18 jours
    &lt;/<span class="k">span</span>&gt;
  &lt;/<span class="k">div</span>&gt;
&lt;/<span class="k">div</span>&gt;

<span class="c">// Dashboard KPI — stats en .font-numeric</span>
&lt;<span class="k">Card</span>&gt;
  &lt;<span class="k">CardContent</span>&gt;
    &lt;<span class="k">div</span> className=<span class="s">"text-xs text-ink-soft uppercase tracking-wider"</span>&gt;CA mensuel&lt;/<span class="k">div</span>&gt;
    &lt;<span class="k">div</span> className=<span class="s">"font-numeric text-3xl font-bold"</span>&gt;
      2 450 000 <span className=<span class="s">"text-base font-normal text-ink-soft"</span>&gt;FCFA&lt;/<span class="k">span</span>&gt;
    &lt;/<span class="k">div</span>&gt;
    &lt;<span class="k">div</span> className=<span class="s">"font-numeric text-sm text-forest"</span>&gt;+12,5% vs mois dernier&lt;/<span class="k">div</span>&gt;
  &lt;/<span class="k">CardContent</span>&gt;
&lt;/<span class="k">Card</span>&gt;</pre>

<h3 class="sub">Définition CSS complète</h3>

<pre class="code"><span class="c">// globals.css — définition de .font-numeric</span>
<span class="k">.font-numeric</span> {
  <span class="t">font-family</span>: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif <span class="k">!important</span>;
  <span class="t">font-feature-settings</span>: <span class="s">"tnum"</span> <span class="n">1</span>, <span class="s">"lnum"</span> <span class="n">1</span>;
  <span class="t">letter-spacing</span>: -<span class="n">0.005em</span>;
}

<span class="c">// tnum  = tabular numbers  → chiffres de largeur égale (alignement colonnes)</span>
<span class="c">// lnum  = lining numbers    → chiffres à hauteur d'œil (pas de descendantes)</span>
<span class="c">// letter-spacing légèrement négatif pour resserrement éditorial</span></pre>

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

<!-- ============== SECTION : Icônes Lucide ============== -->
<div class="section-header">
  <div class="section-num">30 — Iconographie</div>
  <h2 class="section-title">Icônes Lucide — bibliothèque d'usage</h2>
  <div class="section-rule"></div>
</div>

<p class="lead">Toutes les icônes Dedcco proviennent de <strong>lucide-react</strong> (v0.525), une bibliothèque open-source d'icônes SVG à stroke 2px. Cette section documente <strong>quelles icônes sont utilisées où</strong> dans le site, organisées par contexte. Chaque icône est présentée avec son nom PascalCase (pour l'import React), son nom kebab-case (pour l'arbre lucide), et son cas d'usage typique.</p>

<h3 class="sub">Convention d'usage</h3>

<p>Toutes les icônes Dedcco utilisent <strong>stroke 2px</strong>, <strong>linecap round</strong>, <strong>linejoin round</strong>, et <strong>fill none</strong>. La couleur par défaut est <code>currentColor</code> — l'icône hérite donc de la couleur de texte de son parent. Pour forcer une couleur, appliquer une classe <code>text-*</code> sur le parent ou sur l'icône directement. Les tailles standard sont 18px (sidebar), 16px (boutons), 14px (badges), 24px (empty states).</p>

<pre class="code"><span class="c">// Import standard</span>
<span class="k">import</span> { Home, Bell, Search } <span class="k">from</span> <span class="s">'lucide-react'</span>;

<span class="c">// Usage avec taille et couleur</span>
&lt;<span class="k">Home</span> size={<span class="n">18</span>} className=<span class="s">"text-amber"</span> /&gt;
&lt;<span class="k">Bell</span> size={<span class="n">18</span>} className={<span class="s">`text-ink-soft ${hasUnread ? 'dedco-pulse' : ''}`</span>} /&gt;

<span class="c">// Wrapper dans un bouton</span>
&lt;<span class="k">Button</span> variant=<span class="s">"ghost"</span> size=<span class="s">"icon"</span>&gt;
  &lt;<span class="k">Bell</span> size={<span class="n">18</span>} /&gt;
&lt;/<span class="k">Button</span>&gt;</pre>

"""

# Build icons HTML by category
icons_html_parts = [chiffres_html]

for cat_name, items in ICONS_BY_CAT:
    icons_html_parts.append(f'<h3 class="sub">{cat_name}</h3>')
    icons_html_parts.append('<div class="icon-grid">')
    for icon_key, pascal_name, usage in items:
        svg = icon_svg(icon_key, size=24, stroke="var(--text-1)")
        icons_html_parts.append(f'''
<div class="icon-card">
  <div class="icon-visual">{svg}</div>
  <div class="icon-name">{pascal_name}</div>
  <div class="icon-usage">{usage}</div>
</div>''')
    icons_html_parts.append('</div>')

# Add closing notes
icons_html_parts.append("""

<h3 class="sub">Tailles standard par contexte</h3>

<table class="tokens">
  <thead><tr><th>Contexte</th><th>Taille</th><th>Couleur</th><th>Exemple</th></tr></thead>
  <tbody>
    <tr><td>Sidebar navigation</td><td class="mono">18px</td><td>text-2 (idle) / amber-dark (active)</td><td>Items sidebar designer/artisan/admin</td></tr>
    <tr><td>Boutons (avec texte)</td><td class="mono">16px</td><td>currentColor (hérite)</td><td>Button primary/secondary</td></tr>
    <tr><td>Boutons icon-only</td><td class="mono">18px</td><td>currentColor</td><td>size="icon" — close, menu</td></tr>
    <tr><td>Badges &amp; pills</td><td class="mono">14px</td><td>Couleur du badge</td><td>Status brief, niveau N1-N4</td></tr>
    <tr><td>Empty states</td><td class="mono">24-32px</td><td>text-3 (très léger)</td><td>States "Aucun brief", "Panier vide"</td></tr>
    <tr><td>Hero / illustration</td><td class="mono">48-64px</td><td>amber ou terracotta</td><td>Onboarding, pages d'erreur</td></tr>
  </tbody>
</table>

<h3 class="sub">Couleurs sémantiques des icônes</h3>

<p>Les icônes héritent de la couleur du texte parent via <code>currentColor</code>. Pour assigner une couleur sémantique, appliquer une classe <code>text-*</code> sur le conteneur parent ou directement sur l'icône :</p>

<table class="tokens">
  <thead><tr><th>Sémantique</th><th>Classe</th><th>Usage</th></tr></thead>
  <tbody>
    <tr><td>Action primaire</td><td class="mono">text-amber</td><td>CTA, étoiles rating, focus</td></tr>
    <tr><td>État critique</td><td class="mono">text-terracotta</td><td>Erreur, annulation, alerte</td></tr>
    <tr><td>Validation</td><td class="mono">text-forest</td><td>Succès, vérifié, confirmé</td></tr>
    <tr><td>Texte principal</td><td class="mono">text-ink / text-1</td><td>Icônes par défaut dans boutons ghost</td></tr>
    <tr><td>Texte secondaire</td><td class="mono">text-ink-soft / text-2</td><td>Icônes d'aide, info, meta</td></tr>
    <tr><td>Texte léger</td><td class="mono">text-ink-mute / text-3</td><td>Placeholders, empty states</td></tr>
  </tbody>
</table>

<h3 class="sub">Animations sur icônes</h3>

<p>Certaines icônes méritent une animation pour attirer l'attention :</p>

<ul>
  <li><strong>Bell (notifications)</strong> — ajouter <code>.dedco-pulse</code> si notifications non-lues</li>
  <li><strong>Loader2 (loading)</strong> — toujours ajouter <code>.dedco-spin</code> via <code>animate-spin</code></li>
  <li><strong>AlertCircle (erreur)</strong> — optionnellement <code>.dedco-bounce-soft</code> pour erreurs critiques</li>
  <li><strong>Star (rating)</strong> — pas d'animation, mais couleur amber pour les pleines, border-dark pour les vides</li>
</ul>

<pre class="code"><span class="c">// Pattern Bell avec pulse si notifications non-lues</span>
&lt;<span class="k">Button</span> variant=<span class="s">"ghost"</span> size=<span class="s">"icon"</span>&gt;
  &lt;<span class="k">Bell</span>
    size={<span class="n">18</span>}
    className={unreadCount &gt; <span class="n">0</span> ? <span class="s">'dedco-pulse text-terracotta'</span> : <span class="s">'text-ink-soft'</span>}
  /&gt;
  {unreadCount &gt; <span class="n">0</span> &amp;&amp; (
    &lt;<span class="k">span</span> className=<span class="s">"absolute -top-1 -right-1 bg-terracotta text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center"</span>&gt;
      {unreadCount &gt; <span class="n">9</span> ? <span class="s">'9+'</span> : unreadCount}
    &lt;/<span class="k">span</span>&gt;
  )}
&lt;/<span class="k">Button</span>&gt;</pre>

<h3 class="sub">Ajouter une nouvelle icône au système</h3>

<p>Si une icône non listée ici est nécessaire, suivre ce protocole :</p>

<ol>
  <li><strong>Vérifier qu'elle existe dans lucide-react</strong> — la bibliothèque en contient 1500+, chercher sur <a href="https://lucide.dev">lucide.dev</a></li>
  <li><strong>Vérifier qu'aucune icône existante ne fait déjà le job</strong> — éviter la duplication (par exemple, ne pas ajouter <code>Feather</code> si <code>PenLine</code> est déjà utilisé pour "éditer")</li>
  <li><strong>Choisir la taille standard selon le contexte</strong> — 18px sidebar, 16px boutons, 14px badges</li>
  <li><strong>Définir la couleur via <code>currentColor</code></strong> — jamais de couleur en dur sur l'icône</li>
  <li><strong>Documenter l'usage dans cette section</strong> — ajouter une ligne au tableau ci-dessus</li>
</ol>

<div class="callout">
  <strong>Anti-pattern.</strong> Ne jamais importer une icône depuis un autre package (Heroicons, Phosphor, Feather direct). Toutes les icônes Dedcco viennent de <code>lucide-react</code> — c'est la seule source autorisée. Mélanger des bibliothèques créerait des incohérences visuelles (stroke width, linecap, style géométrique).
</div>

""")

# Save the new sections HTML
Path("/tmp/new-sections.html").write_text("".join(icons_html_parts), encoding="utf-8")
print(f"New sections HTML saved: {len(''.join(icons_html_parts))//1024}KB")
print(f"Icons rendered: {sum(len(items) for _, items in ICONS_BY_CAT)}")
