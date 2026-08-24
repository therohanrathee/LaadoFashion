'use client'

import { useState } from 'react'
import { reclusterOrders } from '@/app/actions/runner'

export default function AdminPortal({ orders = [], employees = [], bulkOrders = [] }: { orders: any[], employees: any[], bulkOrders: any[] }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'orders' | 'bulk_orders'>('orders')

  const handleRecluster = async () => {
    setLoading(true)
    setMessage('')
    const res = await reclusterOrders()
    if (res.error) {
      setMessage(`Error: ${res.error}`)
    } else {
      setMessage(res.message || 'Orders successfully clustered and assigned to active runners.')
    }
    setLoading(false)
  }

  const activeRunnersCount = employees.filter(e => e.role === 'runner' && e.active).length

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage orders, dispatch runners, and oversee operations.</p>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Pending Measurement</p>
          <p className="text-3xl font-bold text-blue-600">
            {orders.filter(o => o.status === 'pending_measurement').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">In Stitching</p>
          <p className="text-3xl font-bold text-orange-500">
            {orders.filter(o => o.status === 'in_stitching').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Active Runners</p>
          <p className="text-3xl font-bold text-green-600">{activeRunnersCount}</p>
        </div>
      </div>

      {/* Runner Dispatch Action */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-blue-900 text-lg mb-1">Runner Dispatch System</h3>
          <p className="text-sm text-blue-800">
            Trigger the K-Means clustering algorithm to intelligently group and assign unassigned orders to active runners based on geographical proximity.
          </p>
          {message && <div className="mt-2 text-sm font-medium text-[#E91E63]">{message}</div>}
        </div>
        <button 
          onClick={handleRecluster}
          disabled={loading || activeRunnersCount === 0}
          className="shrink-0 bg-[#E91E63] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#C2185B] transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Run Clustering & Dispatch'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-4 font-semibold text-sm transition-colors ${activeTab === 'orders' ? 'text-[#E91E63] border-b-2 border-[#E91E63] bg-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Recent Orders
            </button>
            <button 
              onClick={() => setActiveTab('bulk_orders')}
              className={`px-6 py-4 font-semibold text-sm transition-colors ${activeTab === 'bulk_orders' ? 'text-[#E91E63] border-b-2 border-[#E91E63] bg-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Bulk Orders Inquiries ({bulkOrders.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'orders' ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Order / Date</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No orders found.</td></tr>
                  ) : orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-500 mb-1" title={order.id}>
                          {order.id.split('-')[0]}...
                        </div>
                        <div className="font-medium text-gray-900">
                          {Array.isArray(order.cart_items) && order.cart_items.length > 0 
                            ? order.cart_items.map((ci: any) => `${ci.quantity}x ${ci.name}`).join(', ')
                            : 'Custom Order'}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{order.customer?.full_name || 'N/A'}</div>
                        <div className="text-gray-500 text-xs">{order.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                          ${order.status === 'pending_measurement' ? 'bg-blue-100 text-blue-700' : ''}
                          ${order.status === 'in_stitching' ? 'bg-orange-100 text-orange-700' : ''}
                          ${order.status === 'ready_for_delivery' ? 'bg-purple-100 text-purple-700' : ''}
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
                        `}>
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {order.runner && <div className="text-xs">🏃 {order.runner.full_name}</div>}
                        {order.tailor && <div className="text-xs mt-1">✂️ {order.tailor.full_name}</div>}
                        {!order.runner && !order.tailor && <span className="text-xs text-gray-400">Unassigned</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Details</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bulkOrders.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No bulk orders found.</td></tr>
                  ) : bulkOrders.map(bo => (
                    <tr key={bo.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-500">
                          {new Date(bo.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(bo.created_at).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{bo.name}</div>
                        <div className="text-gray-500 text-xs mt-1">{bo.contact_info}</div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-700 text-sm whitespace-pre-wrap max-w-xs">{bo.details}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 capitalize">
                          {bo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Staff Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Staff Roster</h3>
          </div>
          <div className="p-2">
            <ul className="divide-y divide-gray-50">
              {employees.length === 0 ? (
                <li className="p-4 text-sm text-gray-500 text-center">No staff found.</li>
              ) : employees.map(emp => (
                <li key={emp.id} className="p-4 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{emp.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">{emp.role}</p>
                  </div>
                  {emp.role !== 'admin' && (
                    <span className={`w-2.5 h-2.5 rounded-full ${emp.active ? 'bg-green-500' : 'bg-gray-300'}`} title={emp.active ? 'Active' : 'Inactive'}></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
