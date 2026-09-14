# DIRECTIVES DE DÉVELOPPEMENT — PROJET TOM SAX

## Stack obligatoire
- HTML5 sémantique.
- CSS3 vanilla uniquement.
- JavaScript ES6+ vanilla uniquement.
- Aucun React, Next.js, Vue, Angular, Tailwind ou Bootstrap.
- Aucun build complexe : le projet doit fonctionner sur un serveur statique HTTP.

## Direction produit
Le MVP présenté à Tom doit volontairement se situer entre l'offre Business à 350 € et l'offre Signature à 430 €.

L'offre à 270 € ne doit pas être affichée dans le MVP public. Le site doit être perçu comme le futur site réel de Tom, pas comme un comparateur de tarifs.

Le MVP doit faire comprendre deux choses :
1. le site transforme Instagram / TikTok en demandes qualifiées ;
2. l'espace Tom permet d'organiser l'activité : demandes, calendrier, événements, clients, répertoire, acomptes et devis.

## Design
- Mobile-first.
- Univers premium événementiel, mariage moderne, nightlife chic.
- Aucun lorem ipsum.
- Aucun texte marketing générique creux.
- Pas d'apparence de template IA.
- Pas de gradients excessifs.
- Pas de glassmorphism généralisé.
- Éviter les grilles de cards SaaS répétitives.
- Typographie éditoriale, beaucoup d'espace, contrastes soignés.
- Pas d'emojis comme icônes principales.
- Animations discrètes et respect de prefers-reduced-motion.

## Qualité
- HTML sémantique.
- Navigation clavier.
- Focus visibles.
- Formulaires correctement labelisés.
- Contrastes raisonnables.
- SEO de base et Schema.org lorsque les données sont réelles.
- Aucune statistique, coordonnée ou promesse commerciale inventée.

## Données
- Les données publiques de démonstration sont centralisées dans js/data.js.
- Les données du CRM MVP sont stockées dans localStorage.
- Les données de démonstration doivent être identifiables comme telles.
- Le formulaire public alimente immédiatement les demandes de l'espace Tom.
- L'architecture doit rester facilement migrable vers Neon/PostgreSQL.

## Fonctions MVP attendues
### Public
- Hero.
- Prestations.
- Galerie live.
- Répertoire filtrable et recherchable.
- Parcours de réservation.
- Avis de démonstration clairement indiqués.
- Formulaire qualifié.

### Espace Tom
- Dashboard.
- Demandes et statuts.
- Calendrier / événements.
- Fiches clients.
- Répertoire administrable.
- Playlists par événement.
- Suivi montants, acomptes et reste à encaisser.
- Devis simplifié imprimable.
- Réinitialisation des données de démonstration.

## Interdiction
Ne pas afficher de section de prix 270 / 350 / 430 dans le MVP lui-même.
