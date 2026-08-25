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
  removeAddon: (cartItemId: string, addonId: string) => void;
  addAddon: (cartItemId: string, addon: CartAddon) => void;
  clearCart: () => void;
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

  const removeAddon = (cartItemId: string, addonId: string) => {
    setItems(prev => prev.map(item => 
      item.cartItemId === cartItemId 
        ? { ...item, addons: item.addons.filter(a => a.id !== addonId) }
        : item
    ))
  }
  const addAddon = (cartItemId: string, addon: CartAddon) => {
    setItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        if (item.addons.some(a => a.id === addon.id)) return item;
        return { ...item, addons: [...item.addons, addon] }
      }
      return item
    }))
  }

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      removeAddon,
      addAddon,
      clearCart,
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
  flyEl.className = 'fixed z-[9999] object-cover shadow-2xl pointer-events-none'
  
  // Initialize styles so it exists in DOM properly before animation
  flyEl.style.left = `${startX}px`
  flyEl.style.top = `${startY}px`
  flyEl.style.width = '20px'
  flyEl.style.height = '20px'
  flyEl.style.borderRadius = '50%'
  
  document.body.appendChild(flyEl)

  // Determine an upward arc peak position
  const peakX = startX > cartRect.left ? startX - 100 : startX + 100;
  const peakY = Math.max(20, startY - 150); // Move up, but don't go off screen top

  // Animate with keyframes
  const animation = flyEl.animate([
    {
      left: `${startX - 10}px`,
      top: `${startY - 10}px`,
      width: '20px',
      height: '20px',
      opacity: 1,
      borderRadius: '50%'
    },
    {
      left: `${peakX - 100}px`,
      top: `${peakY - 100}px`,
      width: '200px',
      height: '200px',
      opacity: 1,
      borderRadius: '16px',
      offset: 0.35 // Peaks at 35% of the animation
    },
    {
      left: `${cartRect.left + cartRect.width/2 - 12}px`,
      top: `${cartRect.top + cartRect.height/2 - 12}px`,
      width: '24px',
      height: '24px',
      opacity: 0.6,
      borderRadius: '50%',
      offset: 1
    }
  ], {
    duration: 1000, // Slower animation (1 second)
    easing: 'ease-in-out'
  });

  animation.onfinish = () => {
    if (document.body.contains(flyEl)) {
      document.body.removeChild(flyEl);
    }
    
    // Add a bounce effect to the cart icon
    cartIcon.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)' },
      { transform: 'scale(0.9)' },
      { transform: 'scale(1.1)' },
      { transform: 'scale(1)' }
    ], { duration: 400, easing: 'ease-in-out' });
  }
}
