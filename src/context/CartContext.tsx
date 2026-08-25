'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  basePrice: number;
  image: string;
  addons: CartAddon[];
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>, event?: React.MouseEvent) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Calculate total
  const cartTotal = items.reduce((total, item) => {
    const itemTotal = item.basePrice + item.addons.reduce((sum, addon) => sum + addon.price, 0)
    return total + (itemTotal * item.quantity)
  }, 0)

  const addItem = (item: Omit<CartItem, 'cartItemId'>, event?: React.MouseEvent) => {
    // Generate unique ID for this cart entry so same products with different addons are distinct
    const newItem = { ...item, cartItemId: Math.random().toString(36).substr(2, 9) }
    
    setItems(prev => [...prev, newItem])
    
    // Trigger flying animation if event is provided
    if (event) {
      triggerFlyToCartAnimation(event.clientX, event.clientY, item.image)
    }
  }

  const removeItem = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId))
  }

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return removeItem(cartItemId)
    setItems(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    ))
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      isCartOpen,
      setIsCartOpen,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// macOS Genie / Flying Animation Logic
function triggerFlyToCartAnimation(startX: number, startY: number, imgSrc: string) {
  // Find the cart icon in the header
  const cartIcon = document.getElementById('cart-icon-target')
  if (!cartIcon) return

  const cartRect = cartIcon.getBoundingClientRect()
  
  // Create flying element
  const flyEl = document.createElement('img')
  flyEl.src = imgSrc
  flyEl.className = 'fixed z-[9999] rounded-xl object-cover shadow-2xl pointer-events-none'
  flyEl.style.width = '150px'
  flyEl.style.height = '150px'
  flyEl.style.left = `${startX - 75}px`
  flyEl.style.top = `${startY - 75}px`
  flyEl.style.transition = 'all 0.6s cubic-bezier(0.2, 1, 0.3, 1)' // macOS genie curve
  
  document.body.appendChild(flyEl)

  // Force reflow
  flyEl.getBoundingClientRect()

  // Animate to cart
  requestAnimationFrame(() => {
    flyEl.style.left = `${cartRect.left - 10}px`
    flyEl.style.top = `${cartRect.top - 10}px`
    flyEl.style.width = '40px'
    flyEl.style.height = '40px'
    flyEl.style.opacity = '0'
    flyEl.style.transform = 'scale(0.2)'
    flyEl.style.borderRadius = '50%'
  })

  // Cleanup
  setTimeout(() => {
    flyEl.remove()
  }, 600)
}
