import { useState, useEffect } from 'react';

interface UseFavoritesReturn {
  favorites: string[];
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (propertyId: string) => void;
  addToFavorites: (propertyId: string) => void;
  removeFromFavorites: (propertyId: string) => void;
}

const FAVORITES_KEY = 'property_favorites';

export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Charger les favoris depuis le localStorage au montage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }, []);

  // Sauvegarder les favoris dans le localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }, [favorites]);

  const isFavorite = (propertyId: string): boolean => {
    return favorites.includes(propertyId);
  };

  const toggleFavorite = (propertyId: string): void => {
    setFavorites(prev => {
      if (prev.includes(propertyId)) {
        return prev.filter(id => id !== propertyId);
      } else {
        return [...prev, propertyId];
      }
    });
  };

  const addToFavorites = (propertyId: string): void => {
    if (!favorites.includes(propertyId)) {
      setFavorites(prev => [...prev, propertyId]);
    }
  };

  const removeFromFavorites = (propertyId: string): void => {
    setFavorites(prev => prev.filter(id => id !== propertyId));
  };

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites
  };
};
