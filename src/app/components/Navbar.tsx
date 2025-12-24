  export default function Navbar() {
      return (
        <nav className="flex justify-between items-center px-8 py-4 bg-[#EFFFFF] shadow-sm">
          <div className="flex items-center space-x-2">
            <img src="/logo/logo.png" alt="Scan Now Logo" className="w-20 h-20" />
            <span className="text-[#38B6FF] font-semibold"></span>
          </div>

          
          <div className="flex space-x-20 text-gray-700 mt-3 mb-3">
            <a href="/page/examplemenu" className="text-l hover:text-[#38B6FF]" >Example of Menu</a>
            <a href="/page/pricing" className="text-l hover:text-[#38B6FF]">Pricing</a>
            <a href="/page/contact" className="text-l hover:text-[#38B6FF]" >Contact us</a>
          </div>
    
          <div className="flex items-center gap-5">
            <a href="/login" className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-black text-[#38b6ff] hover:bg-[#38b6ff]/10 transition">
              Sign in
            </a>
            <a href="/page/rigester/getstart" className="inline-flex px-4 py-2 rounded-lg bg-[#38b6ff] text-white hover:brightness-95 shadow-sm shadow-[#38b6ff]/30 transition">
              Get started
            </a>
          </div>
        </nav>
      );
    }
    