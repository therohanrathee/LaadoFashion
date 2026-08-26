'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/app/actions/runner'

type Order = {
  id: string
  status: string
  address: string
  total_amount: number
  customer: {
    full_name: string
    phone: string
  }
}

export default function RunnerPortal({ orders }: { orders: Order[] }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpdate = async (id: string, newStatus: string) => {
    setLoading(id)
    await updateOrderStatus(id, newStatus)
    setLoading(null)
  }

  const handleDirections = (address: string) => {
    const query = encodeURIComponent(address)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Your Assigned Tasks</h2>
      
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-[#141414] dark:bg-[#141414] p-6 rounded shadow-sm border text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
          You have no tasks assigned currently.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map(order => (
            <div key={order.id} className="bg-white dark:bg-[#141414] dark:bg-[#141414] p-6 rounded-lg shadow-sm border border-gray-200 dark:border-white/10 dark:border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{order.customer.full_name}</h3>
                  <a href={`tel:${order.customer.phone}`} className="text-[#E91E63] text-sm hover:underline">
                    {order.customer.phone}
                  </a>
                </div>
                <span className="bg-gray-100 dark:bg-white/5 dark:bg-white dark:bg-[#141414]/5 px-2 py-1 text-xs rounded text-gray-600 dark:text-gray-300 dark:text-gray-300 font-medium">
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-300 mb-2">{order.address}</p>
                <button 
                  onClick={() => handleDirections(order.address)}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                  Get Directions
                </button>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-3">Amount to Collect: <span className="text-[#E91E63]">₹{order.total_amount / 2}</span></p>
                
                <div className="flex gap-2">
                  {order.status === 'pending_measurement' && (
                    <>
                      <button 
                        onClick={() => handleUpdate(order.id, 'measurement_in_progress')}
                        disabled={loading === order.id}
                        className="flex-1 bg-black text-white text-sm py-2 rounded hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading === order.id ? '...' : 'Start Measurement'}
                      </button>
                      <button 
                        onClick={() => handleUpdate(order.id, 'fabric_received')}
                        disabled={loading === order.id}
                        className="flex-1 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Collected & Done
                      </button>
                    </>
                  )}
                  {order.status === 'stitching_complete' && (
                    <button 
                      onClick={() => handleUpdate(order.id, 'out_for_delivery')}
                      disabled={loading === order.id}
                      className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading === order.id ? '...' : 'Pick for Delivery'}
                    </button>
                  )}
                  {order.status === 'out_for_delivery' && (
                    <>
                      <button 
                        onClick={() => handleUpdate(order.id, 'delivered')}
                        disabled={loading === order.id}
                        className="flex-1 bg-green-600 text-white text-sm py-2 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Delivered
                      </button>
                      <button 
                        onClick={() => handleUpdate(order.id, 'returned')}
                        disabled={loading === order.id}
                        className="flex-1 bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Returned
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
