 export default function Navbar1() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#EFFFFF] shadow-sm">
      <a href="/">
      <div className="flex items-center space-x-2">
        <img src="/logo/logo.png" alt="Scan Now Logo" className="w-16 h-auto object-contain" />
      </div>
      </a>
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-20 text-gray-700 mt-3 mb-3">
        <a href="/page/examplemenu" className="text-l hover:text-[#38B6FF]">
          Example of Menu
        </a>
        <a href="/page/pricing" className="text-l hover:text-[#38B6FF]">
          Pricing
        </a>
        <a href="/page/contact" className="text-l hover:text-[#38B6FF]">
          Contact us
        </a>
      </div>

    </nav>
  );
}
