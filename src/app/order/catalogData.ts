export type CatalogCategory = 'Women' | 'Men'

export interface CatalogItem {
  id: string
  name: string
  basePrice: number
  originalPrice?: number
  image: string
  category: CatalogCategory
}

// Discount rules applied:
// Price < 5000 = -100
// Price >= 5000 = -200
export const CATALOG: CatalogItem[] = [
  // WOMEN
  // Row 1: Top requested / Best sellers
  { id: 'f0a9289b-9531-470a-8b3b-53fb03c73c99', name: 'Padded Blouse', basePrice: 1700, image: '/images/catalog/women/padded-blouse.webp', category: 'Women' },
  { id: 'aa901169-cc57-4054-aa4b-a03e2a98235c', name: 'Suit with Salwar', basePrice: 900, image: '/images/catalog/women/suit-with-salwar.webp', category: 'Women' },
  { id: 'b73e2995-5075-4d4e-a042-a7852c6cc045', name: 'Western Dress', basePrice: 1700, image: '/images/catalog/women/western-dress.webp', category: 'Women' },
  { id: '0199593a-0243-4893-b626-e92e480a8cf7', name: 'Anarkali Suit (12 Kaliyan)', basePrice: 1700, image: '/images/catalog/women/anarkali-suit.webp', category: 'Women' },

  // Row 2: Saree & related items
  { id: '219cf1e9-ec76-4c78-bbe7-89af1ad2f1e3', name: 'RTW Saree', basePrice: 1100, image: '/images/catalog/women/rtw-saree.webp', category: 'Women' },
  { id: 'd3425437-6663-489f-9101-2559a0921ec0', name: 'Saree Fall Piko', basePrice: 200, image: '/images/catalog/women/saree-fall-piko.webp', category: 'Women' },
  { id: '9e000430-90ca-44ab-a1d2-f6b1f1ca98ef', name: 'Petticoat', basePrice: 400, image: '/images/catalog/women/peticoat.webp', category: 'Women' },
  { id: 'bbb99e81-7afd-4e1d-8de7-1179679737c6', name: 'Blouse', basePrice: 700, image: '/images/catalog/women/blouse.webp', category: 'Women' },

  // Row 3: Bridal & Lehengas
  { id: 'c86dad7b-06c7-4d72-a28f-fa0e2d20cffe', name: 'Bridal Blouse', basePrice: 1900, image: '/images/catalog/women/bridal-blouse.webp', category: 'Women' },
  { id: 'bc8ae7be-0c38-4d7a-a806-ea7e9335af53', name: 'Lehenga', basePrice: 2400, image: '/images/catalog/women/lehenga.webp', category: 'Women' },
  { id: '4cce68f4-10de-40e6-a7ad-a2080af3f383', name: 'Lehanga Choli', basePrice: 3400, image: '/images/catalog/women/lehenga-choli.webp', category: 'Women' },
  { id: 'eb045629-d144-49aa-81f9-47302d5536f0', name: 'Lehenga Semi Stitched', basePrice: 1100, image: '/images/catalog/women/lehenga-semi-stitched.webp', category: 'Women' },

  // Row 4: Western / Casual Lowers & Tops
  { id: '2e8dcd05-718a-445f-9218-4b8319d3946e', name: 'Suit with Cigarette Pants', basePrice: 900, image: '/images/catalog/women/suit-with-ciggerete-pants.webp', category: 'Women' },
  { id: '11391d81-033b-4262-89ce-5299d454397a', name: 'Suit with Plazo', basePrice: 900, image: '/images/catalog/women/suit-with-plazo.webp', category: 'Women' },
  { id: 'b816522b-eb48-4115-8114-ef7133732436', name: 'Skirt', basePrice: 800, image: '/images/catalog/women/skirt.webp', category: 'Women' },
  { id: 'bd097863-5ff3-4bb4-9fff-b457f9f39554', name: 'Shirt', basePrice: 600, image: '/images/catalog/women/shirt.webp', category: 'Women' },

  // Row 5: Suits & Formal
  { id: '45d39f0c-415a-4600-94a4-bc4819e02ae4', name: 'Trouser', basePrice: 700, image: '/images/catalog/women/trousers.webp', category: 'Women' },
  { id: '8c3c8b92-73be-48d4-9050-519453b993ee', name: 'Cord set', basePrice: 1700, image: '/images/catalog/women/2-piece-suit.webp', category: 'Women' },
  { id: '0e14d529-4119-4499-8bf6-f7700857b9ae', name: 'Two Piece Suit', basePrice: 5300, image: '/images/catalog/women/2-piece-suit.webp', category: 'Women' },
  { id: 'ed29fcf4-36d4-41b4-a30a-7c867a6fd13e', name: 'Blazer', basePrice: 4700, image: '/images/catalog/women/blazer.webp', category: 'Women' },

  // Row 6: Misc & Footwear
  { id: '0c726deb-6e9a-4e2d-bdb0-dfb941c117ca', name: 'Gown', basePrice: 1900, image: '/images/catalog/women/gown.webp', category: 'Women' },
  { id: 'a781ffa2-1329-4db6-a798-955b58e515ae', name: 'Jumpsuit', basePrice: 1900, image: '/images/catalog/women/jumpsuit.webp', category: 'Women' },
  { id: 'c20011c0-31bf-4bac-87ef-8ad01c2cea9b', name: 'Genuine Leather Jutti', basePrice: 799, originalPrice: 1299, image: '/images/juttis/leather/IMG_8530.webp', category: 'Women' },
  { id: 'd20011c0-31bf-4bac-87ef-8ad01c2cea9c', name: 'Normal Jutti', basePrice: 499, originalPrice: 699, image: '/images/juttis/plastic/IMG_8535.webp', category: 'Women' },

  // MEN
  // Row 1: Formal Basics
  { id: '20170fb6-7d52-4f63-9fde-3a03c7d0e042', name: 'Shirt', basePrice: 700, image: '/images/catalog/men/shirt.webp', category: 'Men' },
  { id: '5a9a53a1-6b9d-4ad6-9b6a-19fc7a599f75', name: 'Trouser', basePrice: 900, image: '/images/catalog/men/trousers.webp', category: 'Men' },
  { id: '07c7d38b-685a-4a97-869e-efd1bc788622', name: 'WaistCoat', basePrice: 1400, image: '/images/catalog/men/waist-coat.webp', category: 'Men' },
  { id: '0d5a7c4c-8a35-4ac1-b5ea-9ebbdcf065a2', name: 'Nehru Jacket', basePrice: 2400, image: '/images/catalog/men/nehru-jacket.webp', category: 'Men' },

  // Row 2: Standard Suits
  { id: 'fce58bb3-a067-44c4-a2cb-2b1365050e05', name: 'Two Piece Suit', basePrice: 5300, image: '/images/catalog/men/2-piece-suit.webp', category: 'Men' },
  { id: '3a2b1854-ca1c-41ce-a72f-36d79d4d91f7', name: 'Three Piece Suit', basePrice: 6300, image: '/images/catalog/men/3-piece-suit.webp', category: 'Men' },
  { id: 'dc6b7a39-618c-4147-889f-aa3704198247', name: 'Safari Suit', basePrice: 2400, image: '/images/catalog/men/safari-suit.webp', category: 'Men' },
  { id: '3fd55e36-b503-434c-84db-b966666be222', name: 'Blazer', basePrice: 4700, image: '/images/catalog/men/blazer.webp', category: 'Men' },

  // Row 3: Premium Formal
  { id: '8abb1b95-1261-4aa4-8263-13f6bdb672f1', name: 'Double Breasted Suit', basePrice: 5300, image: '/images/catalog/men/double-breasted-suit.webp', category: 'Men' },
  { id: '2417b744-273b-4987-8675-1cb8f82c6ca6', name: 'Double Breasted Jacket', basePrice: 4700, image: '/images/catalog/men/double-breasted-jacket.webp', category: 'Men' },
  { id: 'd5dd29bd-b85d-410a-8346-7713a52209ef', name: 'Tuxedo Suit', basePrice: 5800, image: '/images/catalog/men/tuxedo-suit.webp', category: 'Men' },
  { id: 'cbc63626-dd97-4d69-be85-e7143ecf5213', name: 'Tuxedo Jacket', basePrice: 5000, image: '/images/catalog/men/tuxedo-jacket.webp', category: 'Men' },

  // Row 4: Traditional Basics
  { id: '1c5eb30d-f942-4637-b495-731e6906c9c2', name: 'Kurta', basePrice: 900, image: '/images/catalog/men/kurta.webp', category: 'Men' },
  { id: '8ab96914-1307-43d6-acfd-a6a00b43168f', name: 'Kurta Pajama', basePrice: 1300, image: '/images/catalog/men/kurta-pajama.webp', category: 'Men' },
  { id: 'c241379e-7fb3-4907-ab55-51cf4e1b1609', name: 'Kurta with Pant', basePrice: 1600, image: '/images/catalog/men/kurta-with-pant.webp', category: 'Men' },
  { id: 'ce48c207-1772-440e-8c94-cf64d9134fab', name: 'Pathani Kurta', basePrice: 900, image: '/images/catalog/men/pathani-kurta.webp', category: 'Men' },

  // Row 5: Traditional Premium
  { id: '6b265b9c-4cb1-452b-b1cf-ffe6afef5c2f', name: 'Pathani Set', basePrice: 1400, image: '/images/catalog/men/pathani-set.webp', category: 'Men' },
  { id: '119aacae-db07-4a98-9d0d-822b23dd8ed6', name: 'Sherwani', basePrice: 6800, image: '/images/catalog/men/sherwani.webp', category: 'Men' },
  { id: '1256862b-2014-464b-8d3f-de7fd2ca1673', name: 'Indo Western', basePrice: 6800, image: '/images/catalog/men/indo-western.webp', category: 'Men' },
  { id: '86fea305-59b1-422e-9d96-b8e239da1c43', name: 'Jodhpuri / Bandgala', basePrice: 5300, image: '/images/catalog/men/jodhpuri-bandhgala.webp', category: 'Men' },

  // Row 6: Outerwear
  { id: 'ceb9e557-98e5-4b44-9e2b-06e160ae5fbb', name: 'Long Coat', basePrice: 4800, image: '/images/catalog/men/long-coat.webp', category: 'Men' },
]

export const ADDONS = [
  { id: '1bbfb8cb-d181-4328-ad87-8fc4d12c93f0', name: 'Express 3-Day Delivery', price: 1000, appliesTo: CATALOG.map(c => c.id) },
  { id: 'e96641b9-a51f-4146-abbe-57d8820091e2', name: 'Premium Lining', price: 500, appliesTo: CATALOG.filter(c => c.category === 'Women' && !c.name.includes('Jutti')).map(c => c.id) },
  { id: 'ca152438-6625-412e-9df3-1f19f18a280c', name: 'Intricate Embroidery', price: 1500, appliesTo: CATALOG.filter(c => c.category === 'Women').map(c => c.id) },
  // Cross-sell items (Blinkit style)
  { id: 'c20011c0-31bf-4bac-87ef-8ad01c2cea9b', name: 'Genuine Leather Jutti (Cross-sell)', price: 799, originalPrice: 1299, appliesTo: CATALOG.map(c => c.id), isCrossSell: true },
  { id: 'd20011c0-31bf-4bac-87ef-8ad01c2cea9c', name: 'Normal Jutti (Cross-sell)', price: 499, originalPrice: 699, appliesTo: CATALOG.map(c => c.id), isCrossSell: true },
]
