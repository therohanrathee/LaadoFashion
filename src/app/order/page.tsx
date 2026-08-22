import OrderForm from './OrderForm'

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h1 className="text-3xl font-serif text-[#E91E63] mb-8 text-center">Book a Measurement</h1>
        <OrderForm />
      </div>
    </div>
  )
}
