'use client'

import { useState } from 'react'
import { reclusterOrders } from '@/app/actions/runner'

export default function AdminPortal() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Dashboard</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-semibold text-lg mb-2">Runner Dispatch</h3>
        <p className="text-sm text-gray-600 mb-4">
          Manually trigger the K-Means clustering algorithm to distribute unassigned orders optimally among currently active runners.
        </p>
        
        {message && <div className="mb-4 text-sm font-medium text-blue-600 bg-blue-50 p-3 rounded">{message}</div>}

        <button 
          onClick={handleRecluster}
          disabled={loading}
          className="bg-[#8b0000] text-white px-6 py-2 rounded hover:bg-[#6b0000] disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Run Clustering & Assign Orders'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 opacity-50">
        <h3 className="font-semibold text-lg mb-2">Employee Audit (Coming Soon)</h3>
        <p className="text-sm text-gray-600">View tasks completed by tailors and runners.</p>
      </div>
    </div>
  )
}
