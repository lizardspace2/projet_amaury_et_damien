# Fonctionnalité "Voir sur la carte"

Cette fonctionnalité permet d'afficher les propriétés immobilières sur une carte interactive, similaire à Zillow.

## Composants créés

### 1. PropertiesMap.tsx
Composant principal pour afficher une carte avec toutes les propriétés..

**Fonctionnalités :**
- Marqueurs colorés selon le type de propriété (vente, location, enchères)
- Popups détaillés avec informations de la propriété
- Légende interactive
- Statistiques en temps réel
- Zoom automatique pour inclure toutes les propriétés

**Props :**
- `properties`: Array des propriétés à afficher
- `onPropertyClick`: Callback quand une propriété est cliquée
- `center`: Coordonnées du centre de la carte (optionnel)
- `zoom`: Niveau de zoom initial (optionnel)
- `className`: Classes CSS personnalisées (optionnel)

### 2. MapModal.tsx
Modal plein écran pour afficher la carte avec filtres.

**Fonctionnalités :**
- Interface plein écran
- Filtres par type de propriété
- Panneau de filtres coulissant
- Conseils d'utilisation

### 3. ViewOnMapButton.tsx
Bouton réutilisable pour ouvrir la carte.

**Props :**
- `onClick`: Fonction à exécuter au clic
- `size`: Taille du bouton ('sm', 'md', 'lg')
- `variant`: Variante du bouton
- `className`: Classes CSS personnalisées
- `children`: Texte du bouton (optionnel)

### 4. PropertyMapCompact.tsx
Carte compacte pour afficher une seule propriété.

**Fonctionnalités :**
- Marqueur personnalisé
- Popup simple
- Désactivation du zoom et des contrôles
- Indicateur de localisation

## Utilisation

### Dans une page de propriétés
```tsx
import ViewOnMapButton from '@/components/ViewOnMapButton';
import MapModal from '@/components/MapModal';

const [isMapModalOpen, setIsMapModalOpen] = useState(false);

// Bouton pour ouvrir la carte
<ViewOnMapButton onClick={() => setIsMapModalOpen(true)} />

// Modal de la carte
<MapModal
  isOpen={isMapModalOpen}
  onClose={() => setIsMapModalOpen(false)}
  properties={filteredProperties}
  onPropertyClick={(property) => navigate(`/property/${property.id}`)}
  title="Propriétés sur la carte"
/>
```

### Carte compacte pour une propriété
```tsx
import PropertyMapCompact from '@/components/PropertyMapCompact';

<PropertyMapCompact
  lat={property.lat}
  lng={property.lng}
  address={`${property.address_street}, ${property.address_city}`}
  className="h-64 w-full rounded-lg"
/>
```

## Styles

Les styles sont définis dans `PropertiesMap.css` et incluent :
- Animations pour les marqueurs
- Styles pour les popups personnalisés
- Design responsive
- Effets de survol

## Couleurs des marqueurs

- 🟢 Vert : Propriétés à vendre
- 🔵 Bleu : Propriétés à louer
- 🟠 Orange : Enchères
- ⚫ Gris : Autres types

## Dépendances

- Leaflet : Bibliothèque de cartes
- Lucide React : Icônes
- Tailwind CSS : Styles
- React : Framework

## Notes techniques

- Les coordonnées sont requises (lat, lng) pour afficher une propriété
- La carte s'ajuste automatiquement pour inclure toutes les propriétés
- Les popups incluent des boutons d'action (Voir détails, etc.)
- Compatible avec le système de devises existant
