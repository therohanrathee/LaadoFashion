'use server'

import { createClient } from '@/lib/supabase/server'

export type CatalogCategory = 'Women' | 'Men' | 'Jutti'

export interface CatalogItem {
  id: string
  name: string
  basePrice: number
  originalPrice?: number
  image: string
  category: CatalogCategory
  isActive: boolean
}

export interface CatalogAddon {
  id: string
  name: string
  price: number
  isActive: boolean
  catalogItemId: string | null
}

export async function fetchCatalogItems(): Promise<CatalogItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('catalog_items')
    .select('*')
    .order('name', { ascending: true })

  if (error || !data) return []

  return data.map(item => ({
    id: item.id,
    name: item.name,
    basePrice: item.base_price,
    originalPrice: item.original_price,
    image: item.image_url,
    category: item.category as CatalogCategory,
    isActive: item.is_active
  }))
}

export async function fetchAddons(): Promise<CatalogAddon[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('addons')
    .select('*')
    .order('name', { ascending: true })

  if (error || !data) return []

  return data.map(addon => ({
    id: addon.id,
    name: addon.name,
    price: addon.price,
    isActive: addon.is_active,
    catalogItemId: addon.catalog_item_id || null
  }))
}
