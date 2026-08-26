import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import RunnerPortal from './RunnerPortal'
import AdminPortal from './AdminPortal'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Fetch user profile to get the role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log('[DEBUG DASHBOARD] user:', user.email, 'id:', user.id)
  console.log('[DEBUG DASHBOARD] profile:', profile)
  console.log('[DEBUG DASHBOARD] profileError:', profileError)

  let runnerOrders: any[] = []
  if (profile?.role === 'runner') {
    const { data } = await supabase
      .from('orders')
      .select('id, status, delivery_address, total_amount, customer_name, customer_phone')
      .eq('runner_id', user.id)
      .neq('status', 'delivered') // Hide completed from runner dashboard
    
    runnerOrders = data?.map(d => ({
      ...d,
      address: d.delivery_address, // map back to old prop for RunnerPortal if it expects it
      customer: { full_name: d.customer_name, phone: d.customer_phone }
    })) || []
  }

  let adminOrders: any[] = []
  let employees: any[] = []
  let bulkOrders: any[] = []
  let adminCatalog: any[] = []
  let adminPromos: any[] = []
  
  if (profile?.role === 'admin') {
    // Fetch all orders with inline customer details and assigned staff details
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        id, 
        status, 
        total_amount, 
        created_at,
        cart_items,
        customer_name,
        customer_phone,
        runner:runner_id(full_name),
        tailor:tailor_id(full_name)
      `)
      .order('created_at', { ascending: false })
    
    adminOrders = ordersData?.map(d => ({
      ...d,
      customer: { full_name: d.customer_name, phone: d.customer_phone },
      runner: Array.isArray(d.runner) ? d.runner[0] : d.runner,
      tailor: Array.isArray(d.tailor) ? d.tailor[0] : d.tailor,
    })) || []

    // Fetch employees
    const { data: employeesData } = await supabase
      .from('profiles')
      .select('id, full_name, role, active')
      .in('role', ['runner', 'tailor', 'admin'])
    
    employees = employeesData || []

    // Fetch bulk orders
    const { data: bulkData } = await supabase
      .from('bulk_orders')
      .select('*')
      .order('created_at', { ascending: false })

    bulkOrders = bulkData || []

    // Fetch Catalog for editing
    const { data: catalogData } = await supabase
      .from('catalog_items')
      .select('*')
      .order('category')
      .order('name')
    adminCatalog = catalogData || []
    
    // Fetch Promo Codes for editing
    const { data: promoData } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })
    adminPromos = promoData || []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Laado Fashion</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {profile?.full_name} ({profile?.role})
          </span>
          <form action={logout}>
            <button className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded">
              Logout
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {profile?.role === 'customer' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Customer Portal</h2>
            <p>Welcome! Here you will track your orders.</p>
          </div>
        )}
        
        {profile?.role === 'admin' && <AdminPortal orders={adminOrders} employees={employees} bulkOrders={bulkOrders} catalog={adminCatalog} promos={adminPromos} />}

        {profile?.role === 'runner' && <RunnerPortal orders={runnerOrders} />}

        {profile?.role === 'tailor' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Tailor Portal</h2>
            <p>View stitching queue and customer details.</p>
          </div>
        )}
      </main>
    </div>
  )
}

