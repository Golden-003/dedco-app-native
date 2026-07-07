#!/usr/bin/env python3
"""Create an ultra-compact HTML reference — under 20 KB.
System fonts only, no SVG icons, minimal CSS, all key content preserved."""
from pathlib import Path

html = '''<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Dedcco Design System</title>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
/* Quache via Playfair Display LOCAL with unicode-range EXCLUDING digits (U+0030-0039).
   Digits fall back to Plus Jakarta Sans → pattern "serif words, sans digits" preserved. */
@font-face{font-family:"Quache";font-weight:400;font-display:swap;unicode-range:U+0020-002F,U+003A-007E,U+00A0-00FF,U+0100-017F,U+2000-206F;src:local("Playfair Display"),local("Georgia")}
@font-face{font-family:"Quache";font-weight:700;font-display:swap;unicode-range:U+0020-002F,U+003A-007E,U+00A0-00FF,U+0100-017F,U+2000-206F;src:local("Playfair Display Bold"),local("Playfair Display"),local("Georgia Bold")}
@font-face{font-family:"Quache";font-weight:900;font-display:swap;unicode-range:U+0020-002F,U+003A-007E,U+00A0-00FF,U+0100-017F,U+2000-206F;src:local("Playfair Display Black"),local("Playfair Display"),local("Georgia")}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;background:#FAF8F5;color:#1E1813;font-size:13px;line-height:1.6;padding:40px 20px;max-width:720px;margin:0 auto}
h1,h2,h3{font-family:"Quache",'Plus Jakarta Sans',sans-serif;letter-spacing:-0.01em;color:#1E1813;margin:24px 0 10px}
/* Force numeric blocks to use Jakarta with tabular figures */
.num,.font-numeric{font-family:'Plus Jakarta Sans',sans-serif!important;font-feature-settings:"tnum" 1,"lnum" 1;letter-spacing:-0.005em}
h1{font-size:42px;line-height:1}
h2{font-size:24px;border-bottom:2px solid #BF793B;padding-bottom:6px;margin-top:32px}
h3{font-size:16px;color:#9A5A1F;margin-top:18px}
p{margin:8px 0}
.lead{font-size:14px;color:#5B5048}
code{background:#F5E6D3;color:#9A5A1F;padding:1px 5px;border-radius:3px;font-family:'SF Mono',monospace;font-size:11px}
pre{background:#1E1813;color:#F5E6D3;padding:12px;border-radius:6px;font-family:'SF Mono',monospace;font-size:11px;overflow-x:auto;margin:10px 0;border-left:3px solid #BF793B}
table{width:100%;border-collapse:collapse;margin:10px 0;font-size:11px}
th{background:#1E1813;color:#fff;padding:6px 8px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:0.08em}
td{padding:5px 8px;border-bottom:1px solid #F0EEEC;vertical-align:top}
tr:nth-child(even) td{background:#FAF8F5}
.swatch{display:inline-block;width:80px;height:50px;border-radius:6px;margin:4px 4px 4px 0;vertical-align:top;text-align:center;color:#fff;font-size:9px;font-weight:700;padding:6px 4px;line-height:1.2}
.swatch small{display:block;font-weight:400;font-size:8px;opacity:0.9}
.callout{padding:10px 12px;border-radius:4px;margin:10px 0;font-size:12px;border-left:3px solid}
.callout.warn{background:#FAEAE6;border-color:#A6442E;color:#6B2A1C}
.callout.ok{background:#E6F2E3;border-color:#548C45;color:#2E5427}
.callout.tip{background:#F5E6D3;border-color:#BF793B;color:#9A5A1F}
ul{margin:6px 0 6px 20px}li{margin:3px 0}
.eyebrow{font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#BF793B;margin-bottom:4px}
.pill{display:inline-block;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:600;margin:2px}
.pill.a{background:#F5E6D3;color:#9A5A1F}.pill.t{background:#FAEAE6;color:#A6442E}.pill.f{background:#E6F2E3;color:#548C45}.pill.g{background:#F0EEEC;color:#5B5048}
.icon-list{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;font-size:10px;margin:8px 0}
.icon-list div{background:#fff;border:1px solid #F0EEEC;padding:6px;border-radius:4px}
.icon-list b{color:#9A5A1F;display:block;font-family:'SF Mono',monospace;font-size:9px}
.cover{text-align:center;padding:30px 0;border-bottom:1px solid #F0EEEC;margin-bottom:20px}
.cover h1{font-size:52px;margin-bottom:8px}
.cover .sub{font-family:'Playfair Display',serif;font-size:18px;color:#5B5048;font-style:italic}
.dots{display:flex;gap:8px;justify-content:center;margin:16px 0}
.dots span{width:10px;height:10px;border-radius:50%}
</style>
</head>
<body>

<div class="cover">
<div class="eyebrow">Brand Book · v1.1 · Mars 2026</div>
<h1>Design System <span style="color:#BF793B;font-style:italic;font-weight:400">Dedco.</span></h1>
<div class="sub">La terre cuite africaine rencontre l'éditorial premium</div>
<div class="dots"><span style="background:#BF793B"></span><span style="background:#A6442E"></span><span style="background:#548C45"></span></div>
</div>

<h2>1. Palette officielle</h2>
<p class="lead">Trois couleurs strictes, aucune autre admise.</p>
<div>
<div class="swatch" style="background:#BF793B">Amber<small>#BF793B</small></div>
<div class="swatch" style="background:#9A5A1F">Amber Dark<small>#9A5A1F</small></div>
<div class="swatch" style="background:#D4954A">Amber Light<small>#D4954A</small></div>
<div class="swatch" style="background:#F5E6D3;color:#9A5A1F">Amber Pale<small>#F5E6D3</small></div>
<div class="swatch" style="background:#A6442E">Terracotta<small>#A6442E</small></div>
<div class="swatch" style="background:#FAEAE6;color:#A6442E">Terra Pale<small>#FAEAE6</small></div>
<div class="swatch" style="background:#548C45">Forest<small>#548C45</small></div>
<div class="swatch" style="background:#E6F2E3;color:#548C45">Forest Pale<small>#E6F2E3</small></div>
</div>
<table>
<tr><th>Couleur</th><th>Rôle</th><th>Usage</th></tr>
<tr><td><strong>Amber</strong> #BF793B</td><td>Accent principal</td><td>CTA primary, focus ring, étoiles rating, sélection sidebar</td></tr>
<tr><td><strong>Terracotta</strong> #A6442E</td><td>Ancrage, contraste</td><td>Destructive, sélection artisan, paiement en attente</td></tr>
<tr><td><strong>Forest</strong> #548C45</td><td>Validation, confiance</td><td>Succès, projet converti, artisan vérifié</td></tr>
<tr><td><strong>bg-cream</strong> #FFFFFF</td><td>Fond principal</td><td>Site, cards, modales</td></tr>
<tr><td><strong>bg-warm</strong> #FAF8F5</td><td>Fond chaud</td><td>Sections alternées, hover ghost, shimmer</td></tr>
<tr><td><strong>text-1</strong> #1E1813</td><td>Texte principal</td><td>Headings, body, boutons dark</td></tr>
<tr><td><strong>text-2</strong> #5B5048</td><td>Texte secondaire</td><td>Descriptions, meta</td></tr>
<tr><td><strong>border</strong> #F0EEEC</td><td>Bordures</td><td>Cards, inputs, séparateurs</td></tr>
</table>
<div class="callout warn"><strong>Discipline absolue.</strong> Ne jamais introduire une 4e couleur. La palette est fermée par design.</div>

<h2>2. Typographie — Quache + Plus Jakarta Sans</h2>
<p class="lead">Display serif Quache pour les mots, sans-serif Plus Jakarta Sans pour les chiffres.</p>

<h3>⚠ Point critique — les chiffres</h3>
<div class="callout warn"><strong>Quache ne contient AUCUN chiffre.</strong> C'est une display serif purement alphabétique. Si on l'utilise naïvement pour "125 000 FCFA", les lettres FCFA s'affichent en Quache mais les chiffres tombent sur tofu □□□ ou un fallback imprévisible.</div>

<h3>Solution : unicode-range</h3>
<p>Les <code>@font-face</code> Quache déclarent un <code>unicode-range</code> qui <strong>exclut délibérément U+0030-0039</strong> (les chiffres 0-9). Le navigateur saute automatiquement à Plus Jakarta Sans pour les chiffres.</p>
<pre>@font-face {
  font-family: "Quache";
  font-weight: 700;
  unicode-range: U+0020-002F, U+003A-007E, U+00A0-00FF;
  /* U+0030-0039 (chiffres) ABSENTS → fallback Jakarta */
  src: url("/fonts/Quache-Bold.ttf") format("truetype");
}
h1, h2, h3 { font-family: "Quache", var(--font-jakarta), sans-serif; }
/* "Offre 2026" → "Offre" en Quache, "2026" en Jakarta automatiquement */</pre>

<h3>Classe .font-numeric</h3>
<p>Pour les blocs numériques (prix, stats, notes), forcer Jakarta avec <code>tnum</code> (tabular numbers) + <code>lnum</code> (lining numbers) :</p>
<pre>.font-numeric {
  font-family: var(--font-jakarta), sans-serif !important;
  font-feature-settings: "tnum" 1, "lnum" 1;
  letter-spacing: -0.005em;
}</pre>
<table>
<tr><th>Contexte</th><th>.font-numeric ?</th></tr>
<tr><td>Prix produit (cards)</td><td>✅ Oui</td></tr>
<tr><td>Stats dashboard</td><td>✅ Oui</td></tr>
<tr><td>Notes/ratings (4.8/5)</td><td>✅ Oui</td></tr>
<tr><td>ID briefs (BRA-000042)</td><td>✅ Oui</td></tr>
<tr><td>Heading avec chiffre ("Offre 2026")</td><td>❌ Non — unicode-range gère</td></tr>
<tr><td>Téléphone</td><td>❌ Non — utiliser .mono</td></tr>
</table>
<div class="callout tip"><strong>Règle d'or.</strong> Si un élément contient majoritairement des chiffres → <code>.font-numeric</code>. Si c'est un heading avec quelques chiffres → ne rien faire, unicode-range s'occupe du fallback.</div>

<h3>Échelle display (Quache)</h3>
<table>
<tr><th>Classe</th><th>Taille</th><th>Usage</th></tr>
<tr><td><code>.display-2xl</code></td><td>clamp(2.5rem, 6vw, 5rem)</td><td>Hero — 1x par page max</td></tr>
<tr><td><code>.display-xl</code></td><td>clamp(2rem, 4vw, 3.5rem)</td><td>Hero secondaire</td></tr>
<tr><td><code>.display-lg</code></td><td>clamp(1.5rem, 3vw, 2.5rem)</td><td>Titres de section</td></tr>
<tr><td><code>.display-md</code></td><td>clamp(1.25rem, 2.5vw, 2rem)</td><td>Sous-titres</td></tr>
</table>

<h2>3. Radii & Shadows</h2>
<table>
<tr><th>Token</th><th>Valeur</th><th>Usage</th></tr>
<tr><td><code>--radius-sm</code></td><td>4px</td><td>Badges, pills</td></tr>
<tr><td><code>--radius-md</code></td><td>6px</td><td>Buttons, inputs</td></tr>
<tr><td><code>--radius-lg</code></td><td>10px</td><td>Cards, modales</td></tr>
<tr><td><code>--radius-xl</code></td><td>14px</td><td>Grandes cards</td></tr>
<tr><td><code>--radius-2xl</code></td><td>20px</td><td>Featured cards</td></tr>
<tr><td><code>--shadow-sm</code></td><td>0 1px 4px rgba(30,24,19,0.08)</td><td>Cards repos</td></tr>
<tr><td><code>--shadow-md</code></td><td>0 4px 12px rgba(30,24,19,0.1)</td><td>Dropdowns</td></tr>
<tr><td><code>--shadow-lg</code></td><td>0 8px 24px rgba(30,24,19,0.12)</td><td>Modales</td></tr>
<tr><td><code>--shadow-amber</code></td><td>0 4px 16px rgba(191,121,59,0.3)</td><td>Bouton primary hover</td></tr>
</table>

<h2>4. Boutons — .dedco-btn</h2>
<table>
<tr><th>Classe</th><th>Fond</th><th>Usage</th></tr>
<tr><td><code>.dedco-btn-primary</code></td><td>amber</td><td>CTA principal — "Publier le brief"</td></tr>
<tr><td><code>.dedco-btn-secondary</code></td><td>transparent (border amber)</td><td>CTA secondaire — "Voir détails"</td></tr>
<tr><td><code>.dedco-btn-ghost</code></td><td>transparent</td><td>Action tertiaire — "Annuler"</td></tr>
<tr><td><code>.dedco-btn-light</code></td><td>blanc 95%</td><td>CTA sur fond coloré/image — hero</td></tr>
<tr><td><code>.dedco-btn-terracotta</code></td><td>terracotta</td><td>Action critique — "Annuler le brief"</td></tr>
<tr><td><code>.dedco-btn-forest</code></td><td>forest</td><td>Validation — "Confirmer la commande"</td></tr>
</table>
<p><strong>Tailles :</strong> <code>.dedco-btn-sm</code> (8×14px), default (10×20px), <code>.dedco-btn-lg</code> (14×24px), <code>.dedco-btn-xl</code> (16×28px).</p>
<p><strong>États :</strong> hover = <code>translateY(-1px)</code> + <code>shadow-amber</code>, active = <code>scale(0.97)</code>, disabled = <code>opacity:0.4</code>, focus-visible = <code>outline 3px amber</code>.</p>

<h2>5. Badges — .dedco-badge</h2>
<p>
<span class="pill a">amber</span>
<span class="pill t">terra</span>
<span class="pill f">forest</span>
<span class="pill g">gray</span>
<span class="pill a" style="background:#BF793B;color:#fff">amber-solid</span>
<span class="pill t" style="background:#A6442E;color:#fff">terra-solid</span>
</p>
<table>
<tr><th>Badge</th><th>Usage</th></tr>
<tr><td><code>.dedco-badge-amber</code></td><td>Statut PUBLISHED, SUBMITTED</td></tr>
<tr><td><code>.dedco-badge-terra</code></td><td>ARTISAN_SELECTED, AWAITING_DEPOSIT</td></tr>
<tr><td><code>.dedco-badge-forest</code></td><td>CONVERTED_TO_PROJECT, vérifié</td></tr>
<tr><td><code>.dedco-badge-gray</code></td><td>DRAFT, meta neutre</td></tr>
<tr><td><code>.dedco-badge-amber-solid</code></td><td>Niveau N2 artisan</td></tr>
<tr><td><code>.dedco-badge-terra-solid</code></td><td>Niveau N3 artisan</td></tr>
<tr><td><code>.dedco-badge-dark</code></td><td>N4 maître artisan, sélection</td></tr>
</table>

<h2>6. Cards — .dedco-card</h2>
<pre>.dedco-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 250ms, transform 250ms;
}
.dedco-card:hover {
  box-shadow: 0 8px 24px rgba(30,24,19,0.08);
  transform: translateY(-2px);  /* signature Dedcco */
}</pre>

<h2>7. shadcn/ui — 51 composants</h2>
<p>Tous stylés aux tokens Dedcco via <code>@theme inline</code>. Mapping : <code>primary→amber</code>, <code>destructive→terracotta</code>, <code>accent→forest-pale</code>.</p>
<table>
<tr><th>Catégorie</th><th>Composants</th></tr>
<tr><td>Forms</td><td>Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Label, Form, InputOTP</td></tr>
<tr><td>Overlay</td><td>Dialog, Sheet, Drawer, Popover, HoverCard, Tooltip, AlertDialog</td></tr>
<tr><td>Navigation</td><td>Tabs, NavigationMenu, Menubar, Breadcrumb, Pagination, Sidebar</td></tr>
<tr><td>Feedback</td><td>Toast, Toaster, Sonner, Alert, Progress, Skeleton</td></tr>
<tr><td>Data</td><td>Table, Chart, Avatar, Badge, Separator, ScrollArea, AspectRatio</td></tr>
<tr><td>Selection</td><td>Command, DropdownMenu, ContextMenu, Combobox, Calendar</td></tr>
<tr><td>Layout</td><td>Card, Accordion, Collapsible, Resizable, Toggle, ToggleGroup</td></tr>
</table>
<div class="callout tip"><strong>Règle :</strong> toujours importer depuis <code>@/components/ui/*</code>, jamais depuis radix-ui directement. Wrapper, ne pas copier.</div>

<h2>8. Layouts par rôle</h2>
<table>
<tr><th>Rôle</th><th>Pages</th></tr>
<tr><td><strong>Designer</strong></td><td>dashboard, briefs, projets, profil, settings (+ brief-detail)</td></tr>
<tr><td><strong>Artisan</strong></td><td>dashboard, orders, products, stats, profile, brief-workflow</td></tr>
<tr><td><strong>Admin</strong></td><td>dashboard, users, products, orders, content, analytics</td></tr>
<tr><td><strong>Client</strong></td><td>home, marketplace, product, cart, checkout, order-tracking, mes-projets</td></tr>
</table>
<p><strong>Sidebar partagée :</strong> <code>DashboardSidebar</code> dans <code>shared-sidebar.tsx</code> — props <code>title, subtitle, items (NavItem[]), currentPage</code>. Active state = <code>bg-amber-pale text-amber-dark</code>.</p>

<h2>9. Moteur brief-artisan</h2>
<div class="callout ok"><strong>Single source of truth.</strong> Aucune logique métier hors du module. Les pages utilisent les helpers, jamais de <code>if (status === '...')</code>.</div>

<h3>Les 11 statuts</h3>
<p>
<span class="pill g">DRAFT</span>→<span class="pill a">SUBMITTED</span>→<span class="pill a">PUBLISHED</span>→<span class="pill f">PROPOSALS_RECEIVED</span>→<span class="pill a" style="background:#E8F1FA;color:#3B6EA5">IN_DISCUSSION</span>→<span class="pill t">ARTISAN_SELECTED</span>→<span class="pill t">AWAITING_DEPOSIT</span>→<span class="pill f">CONVERTED</span>
</p>
<p><strong>Terminaux :</strong> <span class="pill g">EXPIRED</span> <span class="pill g">CANCELLED</span> <span class="pill g">CLOSED</span></p>
<div class="callout warn"><strong>AWAITING_DEPOSIT est le seul statut "urgent"</strong> — déclencher badge pulse + couleur terracotta + push.</div>

<h3>23 transitions</h3>
<table>
<tr><th>From</th><th>Action</th><th>To</th><th>Rôles</th></tr>
<tr><td>DRAFT</td><td>submit</td><td>SUBMITTED</td><td>client</td></tr>
<tr><td>DRAFT</td><td>cancel</td><td>CANCELLED</td><td>client</td></tr>
<tr><td>SUBMITTED</td><td>publish</td><td>PUBLISHED</td><td>client, system</td></tr>
<tr><td>PUBLISHED</td><td>receiveProposal</td><td>PROPOSALS_RECEIVED</td><td>artisan, system</td></tr>
<tr><td>PUBLISHED</td><td>expire</td><td>EXPIRED</td><td>system</td></tr>
<tr><td>PROPOSALS_RECEIVED</td><td>startDiscussion</td><td>IN_DISCUSSION</td><td>client</td></tr>
<tr><td>PROPOSALS_RECEIVED</td><td>selectProposal</td><td>ARTISAN_SELECTED</td><td>client</td></tr>
<tr><td>IN_DISCUSSION</td><td>selectProposal</td><td>ARTISAN_SELECTED</td><td>client</td></tr>
<tr><td>ARTISAN_SELECTED</td><td>confirmSelection</td><td>AWAITING_DEPOSIT</td><td>client</td></tr>
<tr><td>AWAITING_DEPOSIT</td><td>payDeposit</td><td>CONVERTED_TO_PROJECT</td><td>client</td></tr>
<tr><td>EXPIRED</td><td>relance</td><td>PUBLISHED</td><td>client</td></tr>
<tr><td>EXPIRED/CANCELLED</td><td>duplicate</td><td>DRAFT</td><td>client</td></tr>
</table>

<h3>Permissions (13 fonctions)</h3>
<pre>canEditBrief(brief, role)         // status === DRAFT && role === client
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

<h3>Engine — pattern d'usage</h3>
<pre>function handlePayDeposit(brief) {
  if (!canPayDeposit(brief, role)) return;
  const result = transitionBrief(brief, 'payDeposit', role);
  if (!result.success) return;
  const updated = applyTransition(brief, result);
  updateBriefInStore(updated);
  result.notifications?.forEach(t => sendNotification(t, brief));
}</pre>

<h3>13 triggers de notification</h3>
<p><code>brief_submitted, brief_published, proposal_received, discussion_started, artisan_selected, payment_requested, payment_confirmed, project_created, brief_expired, brief_cancelled, modification_requested, modification_accepted, modification_rejected</code></p>

<h2>10. Animations .dedco-*</h2>
<table>
<tr><th>Classe</th><th>Effet</th><th>Usage</th></tr>
<tr><td><code>.dedco-fade-up</code></td><td>opacity + translateY 20px→0</td><td>Scroll reveal</td></tr>
<tr><td><code>.dedco-scale-in</code></td><td>opacity + scale 0.95→1</td><td>Modales, drawers</td></tr>
<tr><td><code>.dedco-shimmer</code></td><td>défilement background-position</td><td>Skeletons loading</td></tr>
<tr><td><code>.dedco-spin</code></td><td>rotate 0→360</td><td>Spinner (Loader2)</td></tr>
<tr><td><code>.dedco-pulse</code></td><td>scale 1→1.15→1</td><td>Badges notification, Bell</td></tr>
<tr><td><code>.dedco-bounce-soft</code></td><td>translateY 0→-3px→0</td><td>Icônes urgentes</td></tr>
<tr><td><code>.dedco-img-zoom</code></td><td>scale(1.05) sur img au hover</td><td>Cards produit</td></tr>
<tr><td><code>.dedco-link</code></td><td>underline animé gauche→droite</td><td>Liens textuels</td></tr>
<tr><td><code>.dedco-stagger-1</code> à <code>-6</code></td><td>délai 0.05s à 0.30s</td><td>Cascade listes</td></tr>
</table>

<h2>11. Icônes Lucide — bibliothèque d'usage</h2>
<p>Toutes de <code>lucide-react</code> v0.525. Stroke 2px, linecap round, fill none, <code>currentColor</code>.</p>

<h3>Navigation principale</h3>
<div class="icon-list">
<div><b>Home</b>Accueil, sidebar footer</div>
<div><b>Search</b>Recherche globale</div>
<div><b>Heart</b>Favoris, wishlist</div>
<div><b>ShoppingBag</b>Panier, commande</div>
<div><b>User</b>Profil, compte</div>
<div><b>Bell</b>Notifs (+pulse si non-lus)</div>
<div><b>Menu</b>Drawer mobile</div>
<div><b>X</b>Fermer modale</div>
</div>

<h3>Sidebar Designer</h3>
<div class="icon-list">
<div><b>LayoutDashboard</b>Dashboard</div>
<div><b>FileText</b>Mes briefs</div>
<div><b>FolderKanban</b>Mes projets</div>
<div><b>MessageCircle</b>Messages</div>
<div><b>Settings</b>Paramètres</div>
</div>

<h3>Sidebar Artisan</h3>
<div class="icon-list">
<div><b>Hammer</b>Dashboard atelier</div>
<div><b>Package</b>Catalogue produits</div>
<div><b>BarChart3</b>Stats business</div>
<div><b>Award</b>Profil + niveau N1-N4</div>
</div>

<h3>Sidebar Admin</h3>
<div class="icon-list">
<div><b>Users</b>Utilisateurs + KYC</div>
<div><b>ClipboardList</b>Commandes + litiges</div>
</div>

<h3>Actions CRUD</h3>
<div class="icon-list">
<div><b>Plus</b>Ajouter, créer</div>
<div><b>Check</b>Valider, confirmer</div>
<div><b>Trash2</b>Supprimer (destructive)</div>
<div><b>Edit</b>Modifier, éditer</div>
<div><b>Eye</b>Voir détail, preview</div>
<div><b>Download</b>Télécharger</div>
<div><b>Share2</b>Partager</div>
<div><b>Copy</b>Dupliquer, copier ID</div>
</div>

<h3>Statuts & feedback</h3>
<div class="icon-list">
<div><b>CheckCircle2</b>Succès — projet converti</div>
<div><b>Clock</b>En attente — brief publié</div>
<div><b>AlertCircle</b>Attention — brief expiré</div>
<div><b>XCircle</b>Erreur — paiement failed</div>
<div><b>Loader2</b>Loading (+dedco-spin)</div>
</div>

<h3>E-commerce & paiement</h3>
<div class="icon-list">
<div><b>ShoppingCart</b>Panier détaillé</div>
<div><b>CreditCard</b>Paiement, acompte</div>
<div><b>Tag</b>Catégorie, promotion</div>
<div><b>Percent</b>Remise, commission</div>
</div>

<h3>Flèches & navigation</h3>
<div class="icon-list">
<div><b>ChevronRight</b>Breadcrumb, déplier</div>
<div><b>ChevronDown</b>Accordion, dropdown</div>
<div><b>ArrowRight</b>CTA suivant, pagination</div>
<div><b>ArrowLeft</b>Retour, précédent</div>
<div><b>Filter</b>Filtres marketplace</div>
<div><b>MoreHorizontal</b>Menu contextuel</div>
</div>

<h3>Communication & évaluation</h3>
<div class="icon-list">
<div><b>Mail</b>Email, contact</div>
<div><b>Phone</b>Téléphone (formaté Bénin)</div>
<div><b>Send</b>Envoyer message</div>
<div><b>Star</b>Rating (couleur amber)</div>
</div>

<h3>Tailles standard</h3>
<table>
<tr><th>Contexte</th><th>Taille</th></tr>
<tr><td>Sidebar navigation</td><td>18px</td></tr>
<tr><td>Boutons (avec texte)</td><td>16px</td></tr>
<tr><td>Boutons icon-only</td><td>18px</td></tr>
<tr><td>Badges & pills</td><td>14px</td></tr>
<tr><td>Empty states</td><td>24-32px</td></tr>
<tr><td>Hero / illustration</td><td>48-64px</td></tr>
</table>

<h3>Couleurs sémantiques</h3>
<table>
<tr><th>Sémantique</th><th>Classe</th><th>Usage</th></tr>
<tr><td>Action primaire</td><td><code>text-amber</code></td><td>CTA, étoiles, focus</td></tr>
<tr><td>État critique</td><td><code>text-terracotta</code></td><td>Erreur, annulation</td></tr>
<tr><td>Validation</td><td><code>text-forest</code></td><td>Succès, vérifié</td></tr>
<tr><td>Texte principal</td><td><code>text-ink</code></td><td>Icônes par défaut</td></tr>
<tr><td>Texte secondaire</td><td><code>text-ink-soft</code></td><td>Aide, info, meta</td></tr>
<tr><td>Texte léger</td><td><code>text-ink-mute</code></td><td>Placeholders, empty</td></tr>
</table>

<h2>12. Accessibilité</h2>
<ul>
<li><strong>Focus visible :</strong> <code>outline: 2px solid var(--amber)</code> sur <code>*:focus-visible</code>, 3px sur <code>.dedco-btn:focus-visible</code></li>
<li><strong>Contrastes WCAG AA :</strong> text-1/text-2 sur cream ✓ ; text-3 réservé ≥14px ; amber sur blanc → utiliser amber-dark pour texte</li>
<li><strong>Safe-area mobile :</strong> <code>.safe-bottom</code> = <code>padding-bottom: env(safe-area-inset-bottom)</code></li>
<li><strong>Reduced motion :</strong> respecté via <code>tw-animate-css</code> — pulses/bounces coupés, spinners conservés</li>
<li><strong>Sémantique HTML :</strong> <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;aside&gt;</code> — jamais <code>div onClick</code></li>
</ul>

<h2>13. Conventions de code</h2>
<pre>src/
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
└── hooks/</pre>
<ul>
<li><strong>.dedco-*</strong> = custom Dedcco (composition) ; <code>ui/*</code> = shadcn (application)</li>
<li><strong>Tokens :</strong> toujours <code>var(--amber)</code>, jamais hex en dur</li>
<li><strong>Store :</strong> Zustand, pas de Redux ni Context Provider</li>
<li><strong>Imports :</strong> React/Next → externes → ui/ → dedco/ → lib/ → types</li>
</ul>

<h2>14. Stack technique</h2>
<table>
<tr><th>Package</th><th>Version</th><th>Rôle</th></tr>
<tr><td>next</td><td>^16.1.1</td><td>Framework React, App Router</td></tr>
<tr><td>react / react-dom</td><td>^19.0.0</td><td>UI runtime</td></tr>
<tr><td>tailwindcss</td><td>^4</td><td>CSS utilities + @theme inline</td></tr>
<tr><td>zustand</td><td>^5.0.6</td><td>State global</td></tr>
<tr><td>react-hook-form + zod</td><td>^7.60 / ^4.0</td><td>Forms + validation</td></tr>
<tr><td>framer-motion</td><td>^12.23</td><td>Animations complexes</td></tr>
<tr><td>lucide-react</td><td>^0.525</td><td>Icônes SVG</td></tr>
<tr><td>sonner</td><td>^2.0.6</td><td>Toasts</td></tr>
<tr><td>prisma</td><td>^6.11</td><td>ORM base de données</td></tr>
<tr><td>next-auth</td><td>^4.24</td><td>Authentification</td></tr>
<tr><td>recharts</td><td>^2.15</td><td>Charts (admin)</td></tr>
</table>

<h2>15. Glossaire métier</h2>
<table>
<tr><th>Terme</th><th>Définition</th></tr>
<tr><td><strong>BRA</strong></td><td>Brief Artisan (ID brief)</td></tr>
<tr><td><strong>BAP</strong></td><td>Brief Artisan Proposal</td></tr>
<tr><td><strong>PRA</strong></td><td>Projet Artisan (projet converti)</td></tr>
<tr><td><strong>ART</strong></td><td>Artisan (ID)</td></tr>
<tr><td><strong>N1-N4</strong></td><td>Niveaux artisan : débutant → maître</td></tr>
<tr><td><strong>Mobile Money</strong></td><td>Paiement mobile Bénin (MTN MoMo, Moov)</td></tr>
<tr><td><strong>FCFA</strong></td><td>Franc CFA (1 EUR = 655.957 FCFA)</td></tr>
<tr><td><strong>Bogolan</strong></td><td>Tissu teint à la boue — motif séparateur</td></tr>
<tr><td><strong>Iroko</strong></td><td>Bois dur africain, ébénisterie</td></tr>
<tr><td><strong>KYC</strong></td><td>Know Your Customer — validation ID</td></tr>
<tr><td><strong>Relance</strong></td><td>Remettre en PUBLISHED un brief EXPIRED</td></tr>
<tr><td><strong>Acompte</strong></td><td>Paiement initial 30% qui déclenche fabrication</td></tr>
</table>

<div class="callout ok" style="margin-top:30px">
<strong>Build with intent.</strong> Chaque classe .dedco-*, chaque token, chaque transition porte l'histoire d'un marché — Cotonou, le wax, l'iroko, la main qui façonne.
</div>

</body>
</html>'''

out = Path("/home/z/my-project/download/dedcco-design-system-compact.html")
out.write_text(html, encoding="utf-8")
print(f"Compact HTML: {len(html)} chars ({len(html)//1024}KB) → {out}")
