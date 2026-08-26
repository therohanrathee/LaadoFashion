import { useState } from 'react'

export default function OrderCard({ order, employees, onStatusChange, onAssignRunner, onAssignTailor }: any) {
  const [expanded, setExpanded] = useState(false)

  const runners = employees.filter((e: any) => e.role === 'runner' && e.active)
  const tailors = employees.filter((e: any) => e.role === 'tailor' && e.active)

  // Determine thumbnail
  const firstItem = order.cart_items?.[0]
  const thumbnail = firstItem?.image || '/placeholder-image.png'

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Compact View */}
      <div className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
          <img src={thumbnail} alt="Order thumbnail" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-gray-500">#{order.id.split('-')[0]}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
              ${order.status === 'pending_measurement' ? 'bg-blue-100 text-blue-700' : ''}
              ${order.status === 'measurement_in_progress' ? 'bg-blue-200 text-blue-800' : ''}
              ${order.status === 'fabric_received' ? 'bg-indigo-100 text-indigo-700' : ''}
              ${order.status === 'in_stitching' ? 'bg-orange-100 text-orange-700' : ''}
              ${order.status === 'stitching_complete' ? 'bg-orange-200 text-orange-800' : ''}
              ${order.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-700' : ''}
              ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : ''}
            `}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">{order.customer?.full_name || 'Guest Customer'}</h3>
          <p className="text-sm text-gray-500">{order.customer?.phone}</p>
        </div>

        <div className="flex-shrink-0 text-right">
          <p className="font-bold text-[#E91E63]">₹{order.total_amount}</p>
          <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>

        <button 
          onClick={() => setExpanded(!expanded)}
          className="w-full md:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
        >
          {expanded ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-5 space-y-6">
          
          {/* Detailed Items List */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Order Items</h4>
            <div className="space-y-3">
              {order.cart_items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-start bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border border-gray-50" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.quantity}x {item.name}</p>
                    {item.addons?.map((addon: any) => (
                      <p key={addon.id} className="text-xs text-gray-500">+ {addon.name} (₹{addon.price})</p>
                    ))}
                  </div>
                  <p className="font-semibold text-sm">₹{(item.basePrice + (item.addons?.reduce((s:number, a:any) => s+a.price, 0) || 0)) * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Assignments */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Order Status</label>
              <select 
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value)}
                className="w-full text-sm border-gray-200 rounded-lg bg-white focus:ring-[#E91E63] focus:border-[#E91E63]"
              >
                <option value="pending_measurement">Pending Measurement</option>
                <option value="measurement_in_progress">Measurement in Progress</option>
                <option value="fabric_received">Fabric Received</option>
                <option value="in_stitching">In Stitching</option>
                <option value="stitching_complete">Stitching Complete</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Assign Runner</label>
              <select 
                value={order.runner?.id || ''}
                onChange={(e) => onAssignRunner(order.id, e.target.value)}
                className="w-full text-sm border-gray-200 rounded-lg bg-white focus:ring-[#E91E63] focus:border-[#E91E63]"
              >
                <option value="">-- Unassigned --</option>
                {runners.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.full_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Assign Tailor</label>
              <select 
                value={order.tailor?.id || ''}
                onChange={(e) => onAssignTailor(order.id, e.target.value)}
                className="w-full text-sm border-gray-200 rounded-lg bg-white focus:ring-[#E91E63] focus:border-[#E91E63]"
              >
                <option value="">-- Unassigned --</option>
                {tailors.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.full_name}</option>
                ))}
              </select>
            </div>
          </div>
          
        </div>
      )}
    </div>
  )
}
