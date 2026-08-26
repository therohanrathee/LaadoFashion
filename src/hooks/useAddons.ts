import { useState, useEffect } from 'react';
import { fetchAddons, CatalogAddon } from '@/app/actions/catalog';

let cachedAddonsPromise: Promise<CatalogAddon[]> | null = null;
let cachedAddonsData: CatalogAddon[] | null = null;

export function useAddons() {
  const [addons, setAddons] = useState<CatalogAddon[]>(cachedAddonsData || []);
  const [loading, setLoading] = useState(!cachedAddonsData);

  useEffect(() => {
    if (cachedAddonsData) {
      setAddons(cachedAddonsData);
      setLoading(false);
      return;
    }

    if (!cachedAddonsPromise) {
      cachedAddonsPromise = fetchAddons();
    }

    cachedAddonsPromise.then(data => {
      cachedAddonsData = data;
      setAddons(data);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load addons", err);
      setLoading(false);
      cachedAddonsPromise = null;
    });
  }, []);

  return { addons, loading };
}
