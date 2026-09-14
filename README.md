# TomSax — MVP Business / Signature

MVP commercial en HTML/CSS/JS vanilla pour Tom Sax, saxophoniste événementiel.

## Positionnement du MVP
Le site volontairement présenté au client se situe entre l'offre Business (350 €) et l'offre Signature (430 €). L'offre à 270 € n'est pas affichée dans le MVP.

## Ce que montre le MVP
- site public premium et responsive ;
- prestations et parcours de réservation ;
- galerie live reliée au profil Instagram ;
- répertoire musical filtrable ;
- formulaire de demande ;
- espace Tom de démonstration ;
- mini CRM des demandes ;
- calendrier / événements ;
- fiches clients ;
- répertoire administrable ;
- suivi acomptes / reste à encaisser ;
- devis simplifié imprimable.

## Démo admin
Ouvrir `/admin/login.html` puis cliquer sur **Accéder à mon espace**.

## Persistance
Le MVP utilise `localStorage` pour simuler le futur backend. Les données sont structurées afin de pouvoir être migrées ensuite vers Neon/PostgreSQL.

## Lancement local
```bash
python3 -m http.server 8080
```
Puis ouvrir `http://localhost:8080`.
