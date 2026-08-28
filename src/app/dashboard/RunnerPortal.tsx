'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/app/actions/runner'
import Image from 'next/image'

type Order = {
  id: string
  status: string
  address: string
  total_amount: number
  location_lat: number | null
  location_lng: number | null
  cart_items: any[]
  customer: {
    full_name: string
    phone: string
  }
}

export default function RunnerPortal({ orders }: { orders: Order[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  // Use optimistic local state
  const [localOrders, setLocalOrders] = useState(orders)

  const handleUpdate = async (id: string, newStatus: string) => {
    setLoading(id)
    setLocalOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
    await updateOrderStatus(id, newStatus)
    setLoading(null)
  }

  const handleDirections = (order: Order) => {
    if (order.location_lat && order.location_lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${order.location_lat},${order.location_lng}`, '_blank')
    } else {
      const query = encodeURIComponent(order.address)
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
    }
  }

  // Calculate pending active orders (hide returned/delivered from mobile view ideally, though already filtered in page.tsx)
  const activeOrders = localOrders.filter(o => !['delivered', 'returned'].includes(o.status))

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-[#1a1a1a] text-white p-6 rounded-b-3xl shadow-md mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Your Tasks</h2>
        <p className="text-[#E91E63] font-medium text-sm mt-1">{activeOrders.length} Active Assignment{activeOrders.length !== 1 && 's'}</p>
      </div>
      
      {activeOrders.length === 0 ? (
        <div className="mx-4 bg-white dark:bg-[#141414] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">☕️</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No tasks right now.</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Take a break, you'll be notified when new orders are clustered.</p>
        </div>
      ) : (
        <div className="space-y-5 px-4">
          {activeOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-[#141414] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
              
              {/* Order Header */}
              <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{order.customer.full_name}</h3>
                  <a href={`tel:${order.customer.phone}`} className="text-[#E91E63] font-semibold text-sm flex items-center gap-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    Call Customer
                  </a>
                </div>
                <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${
                  order.status === 'pending_measurement' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                  order.status === 'stitching_complete' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              
              {/* Items List */}
              <div className="p-4 bg-white dark:bg-[#141414]">
                <h4 className="text-xs uppercase font-bold text-gray-400 mb-3 tracking-wider">Order Items</h4>
                <div className="space-y-3">
                  {order.cart_items?.map((item: any) => (
                    <div key={item.cartItemId} className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{item.name}</p>
                        {item.addons && item.addons.length > 0 && (
                          <p className="text-xs text-gray-500 truncate">
                            +{item.addons.map((a: any) => a.name).join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        x{item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="px-4 pb-4">
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{order.address}</p>
                  <button 
                    onClick={() => handleDirections(order)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-2.5 rounded-lg text-sm font-semibold transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                    Navigate on Maps
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-[#1a1a1a]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-gray-500">Amount to Collect</span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">₹{order.total_amount / 2}</span>
                </div>
                
                <div className="flex gap-2">
                  {order.status === 'pending_measurement' && (
                    <button 
                      onClick={() => handleUpdate(order.id, 'fabric_received')}
                      disabled={loading === order.id}
                      className="w-full bg-[#E91E63] text-white font-semibold py-3.5 rounded-xl shadow-sm hover:bg-[#D81B60] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading === order.id ? 'Updating...' : 'Mark Fabric Received'}
                    </button>
                  )}
                  {order.status === 'stitching_complete' && (
                    <button 
                      onClick={() => handleUpdate(order.id, 'out_for_delivery')}
                      disabled={loading === order.id}
                      className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading === order.id ? 'Updating...' : 'Start Delivery'}
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <>
                      <button 
                        onClick={() => handleUpdate(order.id, 'delivered')}
                        disabled={loading === order.id}
                        className="flex-1 bg-green-600 text-white font-semibold py-3.5 rounded-xl shadow-sm hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        Delivered
                      </button>
                      <button 
                        onClick={() => handleUpdate(order.id, 'returned')}
                        disabled={loading === order.id}
                        className="flex-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white font-semibold py-3.5 rounded-xl shadow-sm active:scale-[0.98] transition-all disabled:opacity-50"
                      >
                        Failed
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
