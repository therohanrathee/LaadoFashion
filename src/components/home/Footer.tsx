import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white/50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-serif font-bold text-white mb-4">Laado Fashion & Boutique</div>
            <p className="text-sm leading-relaxed max-w-sm">
              Where tradition meets elegance. Custom ladies wear stitched to perfection, 
              measured at your home, and delivered to your doorstep.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Contact & Location</h4>
            <div className="space-y-4 text-sm">
              <p className="flex items-start gap-2">
                <svg className="w-5 h-5 shrink-0 text-[#C5A55A] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <a href="https://maps.google.com/maps?vet=10CAAQoqAOahcKEwiY6_StwbGWAxUAAAAAHQAAAAAQBQ..i&client=safari&pvq=Cg0vZy8xMXlnejA0d2g5IiAKGmxhYWRvIGZhc2hpb24gYW5kIGJvdXRpcXVlEAIYAw&lqi=ChpsYWFkbyBmYXNoaW9uIGFuZCBib3V0aXF1ZVooIhpsYWFkbyBmYXNoaW9uIGFuZCBib3V0aXF1ZSoKCAIQABABEAIQA5IBCGJvdXRpcXVl&fvr=1&cs=0&um=1&ie=UTF-8&fb=1&gl=in&sa=X&ftid=0x390d198dee7613d7:0x661cfd764a924800" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Shop No. 2, Street 8C, behind SCR Model School,<br/>
                  Ashok Vihar Phase III Extension,<br/>
                  Gurugram, Haryana 122006<br/>
                  <span className="text-gray-500 mt-1 block">Plus Code: F2VF+MX Gurugram</span>
                </a>
              </p>
              
              <p className="flex items-center gap-2 pt-2">
                <svg className="w-5 h-5 text-[#C5A55A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <a href="tel:07011917290" className="hover:text-white transition-colors">070119 17290</a>
              </p>
              
              <div className="pt-2">
                <p className="text-gray-400 font-semibold mb-1">Hours:</p>
                <p className="text-white/60">Monday - Sunday: 7 AM – 9 PM</p>
              </div>
            </div>
          </div>

          {/* Services List */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Our Services</h4>
            <ul className="space-y-2 text-sm text-white/50 leading-relaxed">
              <li>All Types of Ladies Suits</li>
              <li>Suit & Tailoring Services</li>
              <li>Custom-made clothing</li>
              <li>Alterations & Fixes</li>
              <li>Blouse alterations</li>
              <li>Trouser alterations</li>
              <li>Wedding dress alterations</li>
              <li>Women's clothing alterations</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h4>
            <div className="space-y-3">
              <Link href="#" className="block text-sm hover:text-[#C5A55A] transition-colors">Book a Measurement</Link>
              <Link href="/track" className="block text-sm hover:text-[#C5A55A] transition-colors">Track Your Order</Link>
              <Link href="/login" className="block text-sm hover:text-gray-400 transition-colors mt-6 text-white/30">Employee Login</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs">© {new Date().getFullYear()} Laado Fashion & Boutique. All rights reserved.</p>
          <p className="text-xs text-white/30">Crafted with ❤️ for every stitch</p>
        </div>
      </div>
    </footer>
  )
}
