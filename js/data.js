/**
 * DONNÉES CENTRALISÉES — TOM SAX
 * Toutes les données modifiables du site sont déclarées ici.
 * Aucune donnée ne doit être dupliquée en dur dans le HTML.
 */

const TOM_SAX_DATA = {
  profile: {
    name: "Tom Sax",
    tagline: "Saxophoniste Événementiel & Live Performer",
    instagram: "https://www.instagram.com/tomsaxoff/",
    handle: "@tomsaxoff",
    bioShort: "Saxophoniste professionnel pour mariages d'exception, cocktails raffinés, soirées privées et sets clubbing.",
    stats: {
      performancesCount: "150+",
      rating: "5.0",
      repertoireSize: "100+"
    }
  },

  // Les 3 offres de création / gestion de site pour Tom Sax
  offers: [
    {
      id: "essentiel",
      title: "Pack Vitrine Essentiel",
      price: 270,
      period: "paiement unique",
      highlight: false,
      description: "Idéal pour débuter et convertir vos abonnés Instagram/TikTok en clients sérieux.",
      features: [
        "Site vitrine responsive mobile-first",
        "Présentation des prestations & bio",
        "Galerie vidéo & intégration réseaux",
        "Formulaire de contact qualifié",
        "Hébergement rapide & nom de domaine inclus 1 an",
        "Optimisation SEO local de base"
      ],
      ctaText: "Choisir cette offre"
    },
    {
      id: "performance",
      title: "Pack Performance & Répertoire",
      price: 350,
      period: "recommandé",
      highlight: true,
      badge: "Plus Populaire",
      description: "La solution complète pour valoriser l'univers musical et maximiser les réservations privées et mariages.",
      features: [
        "Tout le Pack Vitrine Essentiel",
        "Module de répertoire musical interactif & filtrable",
        "Lecteur audio d'extraits live",
        "Demande de devis événementiel ultra-qualifiée",
        "Design sur-mesure aux couleurs de Tom Sax",
        "Accès à l'espace de démonstration de gestion",
        "Mise à jour annuelle du répertoire incluse"
      ],
      ctaText: "Sélectionner le Pack Performance"
    },
    {
      id: "elite",
      title: "Pack Signature & Gestion",
      price: 430,
      period: "clé en main",
      highlight: false,
      description: "Accompagnement haut de gamme avec espace de suivi et gestion continue de votre présence digitale.",
      features: [
        "Tout le Pack Performance",
        "Espace de gestion et suivi des leads / contrats",
        "Génération automatique d'estimations tarifaires",
        "Intégration directe WhatsApp Business & calendrier",
        "Optimisation avancée des temps de chargement (Core Web Vitals)",
        "Support technique prioritaire 7j/7 & maintenance continue"
      ],
      ctaText: "Opter pour l'accompagnement complet"
    }
  ],

  // Répertoire musical : sera complété après lecture du fichier fourni par l'utilisateur
  repertoire: [],

  // Prestations événementielles
  services: [],

  // Vidéos et médias
  media: []
};

// Export pour modules ou exposition globale
if (typeof window !== "undefined") {
  window.TOM_SAX_DATA = TOM_SAX_DATA;
}
