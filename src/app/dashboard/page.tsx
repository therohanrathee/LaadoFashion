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
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  let runnerOrders: any[] = []
  if (profile?.role === 'runner') {
    const { data } = await supabase
      .from('orders')
      .select('id, status, address, total_estimated_cost, customer:customer_id(full_name, phone)')
      .eq('runner_id', user.id)
      .neq('status', 'delivered') // Hide completed from runner dashboard
    
    runnerOrders = data?.map(d => ({
      ...d,
      customer: Array.isArray(d.customer) ? d.customer[0] : d.customer
    })) || []
  }

  let adminOrders: any[] = []
  let employees: any[] = []
  if (profile?.role === 'admin') {
    // Fetch all orders with customer and assigned staff details
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        id, 
        status, 
        total_estimated_cost, 
        created_at,
        item_name,
        customer:customer_id(full_name, phone),
        runner:runner_id(full_name),
        tailor:tailor_id(full_name)
      `)
      .order('created_at', { ascending: false })
    
    adminOrders = ordersData?.map(d => ({
      ...d,
      customer: Array.isArray(d.customer) ? d.customer[0] : d.customer,
      runner: Array.isArray(d.runner) ? d.runner[0] : d.runner,
      tailor: Array.isArray(d.tailor) ? d.tailor[0] : d.tailor,
    })) || []

    // Fetch employees
    const { data: employeesData } = await supabase
      .from('profiles')
      .select('id, full_name, role, active')
      .in('role', ['runner', 'tailor', 'admin'])
    
    employees = employeesData || []
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
        
        {profile?.role === 'admin' && <AdminPortal orders={adminOrders} employees={employees} />}

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

