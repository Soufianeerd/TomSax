# DIRECTIVES DE DÉVELOPPEMENT — PROJET TOM SAX

Ce document définit les règles architecturales, techniques et ergonomiques strictes pour le développement du site de Tom Sax.

---

## 1. Stack Technique Obligatoire
- **HTML5 Sémantique**
- **CSS3 Vanilla** (zéro Tailwind, zéro Bootstrap, zéro framework CSS)
- **JavaScript ES6+ Vanilla** (zéro React, zéro Next.js, zéro Vue, zéro Angular, aucun framework JS)
- **Zéro build complexe** : le projet s'exécute directement sur n'importe quel serveur statique HTTP.
- **Interdiction formelle** de remplacer HTML/CSS/JS vanilla par un framework sous quelque prétexte que ce soit.

---

## 2. Règles de Conception et Design
- **Mobile-first** : l'expérience sur smartphone (venant d'Instagram/TikTok) est la priorité absolue.
- **Design premium événementiel** : univers soigné, élégant, immersif et crédible pour mariages, soirées privées, cocktails et clubs.
- **Aucun lorem ipsum** : tous les textes doivent être contextualisés, réels et percutants.
- **Aucun texte générique creux** du type « Transformez vos rêves en réalité ».
- **Pas d’apparence de template IA** : typographies choisies avec soin, hiérarchie visuelle travaillée, rythme éditorial naturel.
- **Pas de gradients excessifs**.
- **Pas de glassmorphism partout** (usage très mesuré et subtil si nécessaire).
- **Pas de dizaines de cards identiques** : varier les formats et la mise en page.
- **Pas d’emojis utilisés comme icônes principales** : utiliser des icônes SVG propres et vectorielles.

---

## 3. Qualité, Accessibilité & Performance
- **Accessibilité WCAG raisonnable** : contrastes de couleurs suffisants, balises `aria`, structure de titres logique (`h1` unique, `h2`, `h3`).
- **HTML sémantique** : balises `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- **SEO de base** : balises `meta` (description, OpenGraph, Twitter Card), balisage Schema.org / JSON-LD pour musicien/artiste événementiel.
- **Très bonnes performances** : assets optimisés, CSS léger et structuré, pas de dépendances lourdes tierces.
- **Animations élégantes et courtes** : micro-interactions fluides, discrètes, non intrusives.
- **Respect de `prefers-reduced-motion`** : désactivation ou adoucissement des transitions pour les utilisateurs sensibles.
- **Navigation clavier** : focus visibles, tabulations ordonnées, modals/tiroirs piégeant le focus correctement.
- **Formulaires correctement labelisés** : balises `<label for="...">`, messages d'erreurs clairs, validations natives et JS.

---

## 4. Données et Maintenabilité
- **Toutes les données modifiables doivent être centralisées dans `js/data.js`** : prestations, tarifs, répertoire, avis, liens réseaux sociaux, coordonnées, offres web.
- **Ne jamais dupliquer des données directement dans plusieurs fichiers HTML**. Les composants dynamiques s'alimentent depuis `data.js`.
- **Le code doit rester compréhensible par un développeur junior** : nommage clair, séparation des responsabilités, fonctions modulaires et bien commentées.

---

## 5. Objectifs Business du Site
1. Promouvoir Tom Sax et asseoir son autorité artistique.
2. Rassurer un prospect arrivant depuis Instagram/TikTok (@tomsaxoff).
3. Présenter ses prestations (mariages, cocktails, clubbing, corporate).
4. Montrer ses vidéos et performances live.
5. Présenter son répertoire musical complet (filtrable et lisible).
6. Récupérer des demandes de prestations qualifiées (formulaire avec date, lieu, type d'événement, budget).
7. Présenter 3 offres de création de site / gestion à 270 €, 350 € et 430 €.
8. Démontrer un espace d'administration interactif permettant à Tom d'imaginer la gestion quotidienne de son activité.
