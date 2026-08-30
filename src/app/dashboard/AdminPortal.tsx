'use client'

import { useState, useEffect } from 'react'
import { reclusterOrders } from '@/app/actions/runner'
import { updateOrderStatus, assignOrderStaff, updateCatalogItem, createCatalogItem, deleteCatalogItem, updatePromoCode, createAddon, deleteAddon } from '@/app/actions/admin'
import { updateLeadStatus } from '@/app/actions/leads'
import OrderCard from '@/components/admin/OrderCard'

export default function AdminPortal({ orders = [], employees = [], bulkOrders = [], catalog = [], promos = [], addons = [], leads = [] }: any) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'promos' | 'bulk_orders' | 'leads'>('orders')
  const [newPromoType, setNewPromoType] = useState('fixed_amount')
  
  // Catalog Modal State
  const [catalogModal, setCatalogModal] = useState<{isOpen: boolean, mode: 'create' | 'edit', item: any | null}>({ isOpen: false, mode: 'create', item: null })

  const [localOrders, setLocalOrders] = useState(orders)
  const [localLeads, setLocalLeads] = useState(leads)

  useEffect(() => {
    setLocalOrders(orders)
    setLocalLeads(leads)
  }, [orders, leads])

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

  const handleStatusChange = async (orderId: string, status: string) => {
    setLocalOrders((prev: any) => prev.map((o: any) => o.id === orderId ? { ...o, status } : o))
    await updateOrderStatus(orderId, status)
  }

  const handleLeadStatusChange = async (leadId: string, status: string) => {
    setLocalLeads((prev: any) => prev.map((l: any) => l.id === leadId ? { ...l, status } : l))
    await updateLeadStatus(leadId, status)
  }

  const handleAssignRunner = async (orderId: string, runnerId: string) => {
    const runner = employees.find((e: any) => e.id === runnerId) || null
    setLocalOrders((prev: any) => prev.map((o: any) => o.id === orderId ? { ...o, runner } : o))
    await assignOrderStaff(orderId, runnerId, 'runner')
  }

  const handleAssignTailor = async (orderId: string, tailorId: string) => {
    const tailor = employees.find((e: any) => e.id === tailorId) || null
    setLocalOrders((prev: any) => prev.map((o: any) => o.id === orderId ? { ...o, tailor } : o))
    await assignOrderStaff(orderId, tailorId, 'tailor')
  }

  const handleToggleCatalogItem = async (item: any) => {
    await updateCatalogItem(item.id, { is_active: !item.is_active })
  }

  const handleTogglePromo = async (promo: any) => {
    await updatePromoCode(promo.id, { is_active: !promo.is_active })
  }

  const activeRunnersCount = employees.filter((e: any) => e.role === 'runner' && e.active).length

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">Manage orders, dispatch runners, and oversee operations.</p>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#141414] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{localOrders.length}</p>
        </div>
        <div className="bg-white dark:bg-[#141414] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Pending Measurement</p>
          <p className="text-3xl font-bold text-blue-600">
            {orders.filter((o: any) => o.status === 'pending_measurement').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#141414] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">In Stitching</p>
          <p className="text-3xl font-bold text-orange-500">
            {orders.filter((o: any) => o.status === 'in_stitching').length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#141414] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Active Runners</p>
          <p className="text-3xl font-bold text-green-600">{activeRunnersCount}</p>
        </div>
      </div>

      {/* Runner Dispatch Action */}
      <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-lg mb-1">Runner Dispatch System</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200/70">
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
        <div className="lg:col-span-2 bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a0a]">
            <button onClick={() => setActiveTab('orders')} className={`px-5 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'orders' ? 'text-[#E91E63] border-b-2 border-[#E91E63] bg-white dark:bg-[#141414]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              Recent Orders
            </button>
            <button onClick={() => setActiveTab('catalog')} className={`px-5 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'catalog' ? 'text-[#E91E63] border-b-2 border-[#E91E63] bg-white dark:bg-[#141414]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              Catalog
            </button>
            <button onClick={() => setActiveTab('promos')} className={`px-5 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'promos' ? 'text-[#E91E63] border-b-2 border-[#E91E63] bg-white dark:bg-[#141414]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              Promos
            </button>
            <button onClick={() => setActiveTab('bulk_orders')} className={`px-5 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'bulk_orders' ? 'text-[#E91E63] border-b-2 border-[#E91E63] bg-white dark:bg-[#141414]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              Bulk Orders ({bulkOrders.length})
            </button>
            <button onClick={() => setActiveTab('leads')} className={`px-5 py-4 font-semibold text-sm whitespace-nowrap transition-colors ${activeTab === 'leads' ? 'text-[#E91E63] border-b-2 border-[#E91E63] bg-white dark:bg-[#141414]' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
              Leads ({localLeads.length})
            </button>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#0a0a0a]/50">
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {localOrders.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">No orders found.</div>
                ) : (
                  localOrders.map((order: any) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      employees={employees} 
                      onStatusChange={handleStatusChange}
                      onAssignRunner={handleAssignRunner}
                      onAssignTailor={handleAssignTailor}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === 'catalog' && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <button 
                    onClick={() => setCatalogModal({ isOpen: true, mode: 'create', item: null })}
                    className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                  >
                    + Add New Product
                  </button>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
                  <table className="w-full text-sm text-left bg-white dark:bg-[#141414]">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-[#0a0a0a] border-b">
                      <tr>
                        <th className="px-4 py-3">Image / Item</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {catalog.map((item: any) => (
                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded object-cover border border-gray-100 dark:border-white/5" />
                            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.category}</td>
                          <td className="px-4 py-3 text-gray-900 dark:text-white">₹{item.base_price}</td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button 
                              onClick={() => handleToggleCatalogItem(item)}
                              className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${item.is_active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                            >
                              {item.is_active ? 'Active' : 'Disabled'}
                            </button>
                            <button 
                              onClick={() => setCatalogModal({ isOpen: true, mode: 'edit', item })}
                              className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-white/5 dark:bg-white dark:bg-[#141414]/5 transition-colors"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'promos' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-[#141414] p-4 rounded-lg border border-gray-200 dark:border-white/10">
                  <h4 className="font-semibold text-sm mb-3">Launch New Promo Code</h4>
                  <form id="promo_form" action={async (formData) => {
                    const data = {
                      code: formData.get('code')?.toString().toUpperCase(),
                      discount_type: formData.get('discount_type'),
                      discount_value: Number(formData.get('discount_value')) || null,
                      min_cart_value: Number(formData.get('min_cart_value')) || null,
                      usage_limit: Number(formData.get('usage_limit')) || null,
                      one_time_per_user: formData.get('one_time_per_user') === 'on',
                      starts_at: formData.get('starts_at') ? new Date(formData.get('starts_at') as string).toISOString() : new Date().toISOString(),
                      expires_at: formData.get('expires_at') ? new Date(formData.get('expires_at') as string).toISOString() : null,
                      is_active: true
                    }
                    if (data.code) {
                      const { createPromoCode } = await import('@/app/actions/admin')
                      const res = await createPromoCode(data)
                      if (res.error) {
                        alert('Error creating promo: ' + res.error)
                      } else {
                        (document.getElementById('promo_form') as HTMLFormElement).reset()
                      }
                    }
                  }} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Code</label>
                      <input type="text" name="code" required className="w-full text-sm border-gray-200 dark:border-white/10 rounded p-2" placeholder="e.g. DIWALI50" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Type</label>
                      <select 
                        name="discount_type" 
                        value={newPromoType}
                        className="w-full text-sm border-gray-200 dark:border-white/10 rounded p-2"
                        onChange={(e) => setNewPromoType(e.target.value)}
                      >
                        <option value="fixed_amount">Fixed Amount (₹)</option>
                        <option value="percentage">Percentage (%)</option>
                        <option value="free_visit">Free Visit</option>
                        <option value="free_delivery">Free Delivery</option>
                      </select>
                    </div>
                    {newPromoType !== 'free_visit' && newPromoType !== 'free_delivery' && (
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Amount</label>
                        <input type="number" name="discount_value" className="w-full text-sm border-gray-200 dark:border-white/10 rounded p-2" placeholder="e.g. 500" />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Start Date (Optional)</label>
                      <input type="datetime-local" name="starts_at" className="w-full text-sm border-gray-200 dark:border-white/10 rounded p-2 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-1">Expiry Date (Optional)</label>
                      <input type="datetime-local" name="expires_at" className="w-full text-sm border-gray-200 dark:border-white/10 rounded p-2 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex items-center gap-2 pb-2 md:col-span-2">
                      <input type="checkbox" name="one_time_per_user" id="one_time" className="rounded border-gray-300 dark:border-white/20 text-[#E91E63] focus:ring-[#E91E63]" />
                      <label htmlFor="one_time" className="text-xs text-gray-600 dark:text-gray-300">One time per user?</label>
                    </div>
                    <div className="md:col-span-2 text-right pb-1">
                      <button type="submit" className="bg-[#1a1a1a] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-gray-800">Create Promo</button>
                    </div>
                  </form>
                </div>
                
                <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
                  <table className="w-full text-sm text-left bg-white dark:bg-[#141414]">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-[#0a0a0a] border-b">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Type & Amount</th>
                      <th className="px-4 py-3">Limits</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {promos.length === 0 ? <tr><td colSpan={4} className="p-4 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">No promo codes.</td></tr> : promos.map((promo: any) => (
                      <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                        <td className="px-4 py-3 font-mono font-bold text-[#E91E63]">{promo.code}</td>
                        <td className="px-4 py-3">
                          <span className="capitalize">{promo.discount_type.replace('_', ' ')}</span>
                          {promo.discount_value && ` (₹${promo.discount_value})`}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {promo.min_order_amount && <div>Min: ₹{promo.min_order_amount}</div>}
                          {promo.usage_limit && <div>Limit: {promo.usage_limit} total</div>}
                          {promo.one_time_per_user && <div>1 per user</div>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button 
                            onClick={() => handleTogglePromo(promo)}
                            className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors ${promo.is_active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                          >
                            {promo.is_active ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}

            {activeTab === 'bulk_orders' && (
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
                <table className="w-full text-sm text-left bg-white dark:bg-[#141414]">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase bg-gray-50 dark:bg-[#0a0a0a]">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bulkOrders.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">No bulk orders found.</td></tr>
                    ) : bulkOrders.map((bo: any) => (
                      <tr key={bo.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {new Date(bo.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 dark:text-white">{bo.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-xs mt-1">{bo.contact_info}</div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{bo.details}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'leads' && (
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-white/10">
                <table className="w-full text-sm text-left bg-white dark:bg-[#141414]">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#0a0a0a]">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Requirements</th>
                      <th className="px-4 py-3">Interested In</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {localLeads.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">No leads found.</td></tr>
                    ) : localLeads.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a]">
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 dark:text-white">{lead.name}</div>
                          <div className="text-[#E91E63] font-bold text-xs mt-1"><a href={`tel:${lead.phone}`}>{lead.phone}</a></div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{lead.requirements || '-'}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          {lead.interested_in ? <span className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-xs font-semibold">{lead.interested_in}</span> : '-'}
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleLeadStatusChange(lead.id, e.target.value)}
                            className="text-xs font-semibold rounded border border-gray-200 dark:border-white/10 px-2 py-1 bg-white dark:bg-[#141414] text-gray-900 dark:text-white"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted to Order</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Staff Overview */}
        <div className="bg-white dark:bg-[#141414] rounded-xl shadow-sm border border-gray-100 dark:border-white/5 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a0a]">
            <h3 className="font-semibold text-gray-900 dark:text-white">Staff Roster</h3>
          </div>
          <div className="p-2">
            <ul className="divide-y divide-gray-50">
              {employees.length === 0 ? (
                <li className="p-4 text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 text-center">No staff found.</li>
              ) : employees.map((emp: any) => (
                <li key={emp.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">{emp.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 capitalize">{emp.role}</p>
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

      {catalogModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#141414] rounded-xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-lg">{catalogModal.mode === 'create' ? 'Add New Product' : 'Edit Product'}</h3>
              <button onClick={() => setCatalogModal({ isOpen: false, mode: 'create', item: null })} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300">✕</button>
            </div>
            <form className="flex flex-col flex-1 min-h-0 overflow-hidden" action={async (formData) => {
              let imageUrl = formData.get('existing_image_url')?.toString() || ''
              const imageFile = formData.get('imageFile') as File | null
              
              if (imageFile && imageFile.size > 0) {
                const { uploadImage } = await import('@/app/actions/upload')
                const uploadRes = await uploadImage(formData)
                if (uploadRes.url) {
                  imageUrl = uploadRes.url
                } else {
                  alert(uploadRes.error)
                  return
                }
              }

              const data = {
                name: formData.get('name'),
                category: formData.get('category'),
                base_price: Number(formData.get('base_price')),
                original_price: formData.get('original_price') ? Number(formData.get('original_price')) : null,
                image_url: imageUrl,
                is_active: formData.get('is_active') === 'on'
              }
              
              if (catalogModal.mode === 'create') {
                await createCatalogItem(data)
              } else {
                await updateCatalogItem(catalogModal.item.id, data)
              }
              
              setCatalogModal({ isOpen: false, mode: 'create', item: null })
            }}>
              <div className="p-6 space-y-4 overflow-y-auto flex-1 min-h-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                  <input type="text" name="name" required defaultValue={catalogModal.item?.name} className="w-full border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-sm focus:ring-[#E91E63] focus:border-[#E91E63]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select name="category" required defaultValue={catalogModal.item?.category || 'Women'} className="w-full border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-sm focus:ring-[#E91E63] focus:border-[#E91E63]">
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Jutti">Jutti</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹)</label>
                    <input type="number" name="base_price" required defaultValue={catalogModal.item?.base_price} className="w-full border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-sm focus:ring-[#E91E63] focus:border-[#E91E63]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original Price (Optional)</label>
                    <input type="number" name="original_price" defaultValue={catalogModal.item?.original_price} className="w-full border-gray-200 dark:border-white/10 rounded-lg p-2.5 text-sm focus:ring-[#E91E63] focus:border-[#E91E63]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Image</label>
                  {catalogModal.item?.image_url && (
                    <div className="mb-2 flex items-center gap-3">
                      <img src={catalogModal.item.image_url} alt="Current" className="w-12 h-12 object-cover rounded border border-gray-200 dark:border-white/10" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Current Image</span>
                      <input type="hidden" name="existing_image_url" value={catalogModal.item.image_url} />
                    </div>
                  )}
                  <input type="file" name="imageFile" accept="image/*" className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E91E63]/10 file:text-[#E91E63] hover:file:bg-[#E91E63]/20" />
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">New images will be automatically compressed and optimized.</p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" name="is_active" id="is_active_modal" defaultChecked={catalogModal.mode === 'create' ? true : catalogModal.item?.is_active} className="rounded border-gray-300 dark:border-white/20 text-[#E91E63] focus:ring-[#E91E63]" />
                  <label htmlFor="is_active_modal" className="text-sm text-gray-700 dark:text-gray-300">Active (Visible on store)</label>
                </div>
                
                {catalogModal.mode === 'edit' && (
                  <div className="pt-4 border-t border-gray-100 dark:border-white/5">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Item-Specific Add-Ons</h4>
                    <div className="space-y-2 mb-3">
                      {addons.filter((a: any) => a.catalog_item_id === catalogModal.item.id).map((addon: any) => (
                        <div key={addon.id} className="flex justify-between items-center bg-gray-50 dark:bg-[#0a0a0a] p-2 rounded border border-gray-100 dark:border-white/5">
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{addon.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">₹{addon.price}</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={async () => {
                              if (confirm('Delete this add-on?')) {
                                await deleteAddon(addon.id)
                              }
                            }}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold px-2"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {addons.filter((a: any) => a.catalog_item_id === catalogModal.item.id).length === 0 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 italic">No specific add-ons for this item.</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input type="text" id="new_addon_name" placeholder="Add-on Name" className="flex-1 border-gray-200 dark:border-white/10 rounded p-2 text-sm" />
                      <input type="number" id="new_addon_price" placeholder="Price (₹)" className="w-24 border-gray-200 dark:border-white/10 rounded p-2 text-sm" />
                      <button 
                        type="button" 
                        onClick={async () => {
                          const nameInput = document.getElementById('new_addon_name') as HTMLInputElement
                          const priceInput = document.getElementById('new_addon_price') as HTMLInputElement
                          const name = nameInput.value
                          const price = priceInput.value
                          
                          if (name && price) {
                            nameInput.value = ''
                            priceInput.value = ''
                            await createAddon({ name, price: Number(price), catalog_item_id: catalogModal.item.id, is_active: true })
                          }
                        }}
                        className="bg-gray-200 dark:bg-white/10 hover:bg-gray-300 text-gray-800 dark:text-gray-200 text-sm font-semibold px-3 rounded transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0a0a0a] flex justify-between items-center shrink-0">
                {catalogModal.mode === 'edit' ? (
                  <button 
                    type="button" 
                    onClick={async () => {
                      if (confirm('Are you sure you want to delete this product?')) {
                        await deleteCatalogItem(catalogModal.item.id)
                        setCatalogModal({ isOpen: false, mode: 'create', item: null })
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1"
                  >
                    Delete Product
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex gap-3">
                  <button type="button" onClick={() => setCatalogModal({ isOpen: false, mode: 'create', item: null })} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Cancel</button>
                  <button type="submit" className="bg-[#E91E63] text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-[#C2185B] transition-colors">
                    {catalogModal.mode === 'create' ? 'Create Product' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
