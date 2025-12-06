  export default function Navbar() {
      return (
        <nav className="flex justify-between items-center px-8 py-4 bg-[#EFFFFF] shadow-sm">
          <div className="flex items-center space-x-2">
            <img src="/logo/logo.png" alt="Scan Now Logo" className="w-20 h-20" />
            <span className="text-[#38B6FF] font-semibold"></span>
          </div>

          
          <div className="flex space-x-30 text-gray-700 mt-3 mb-3">
            <a href="#" className="text-l" >Example of Menu</a>
            <a href="#" className="text-l" >Pricing</a>
            <a href="#" className="text-l" >Contact us</a>
          </div>
    
          <div className="flex space-x-4">
            <button className="border-2 border-black px-13 py-3 h-14 rounded-xl hover:bg-gray-100 text-lg text-[#2e9be0] font-sans font-bold">
              Sign in
            </button>
            <button className="bg-[#61A9E5] text-white px-10 py-2 rounded-xl hover:bg-[#2e9be0] text-lg text-white foont-sans font-bold">
              Get Started
            </button>
          </div>
        </nav>
      );
    }
    