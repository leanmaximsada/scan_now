export default function Footer() {
  return (
    <footer className="w-full mt-auto text-gray-500 font-sans text-sm pb-8">
      <div className="w-full flex flex-col md:flex-row items-start  md:items-center justify-between gap-6">
      <div className="flex flex-col ">
          <img src="/logo/90r.png" className="w-30 mb-[-130] mt-4"  />
        </div>
        {/* Left side: icons and text */}
        
        <div className="flex flex-col space-y-2 ml-15 mt-30">
          <div className="flex space-x-4 ">
            <a href="#" className="hover:opacity-75">
              <img src="/logo/fb.png" alt="Facebook icon" className="w-10 h-10" />
            </a>
            <a href="#" className="hover:opacity-75">
              <img src="/logo/yt.png" alt="YouTube icon" className="w-10 h-10" />
            </a>
          </div>
          <p className="text-xs ml-2 ">@ Scan_now</p>
          <a href="#" className="ml-2 text-xs underline decoration-double mt-[-7]">
            Private Policy
          </a>
        </div>

        {/* Center: Angkor image */}
        <img
          src="/logo/angkorwat.png"
          alt="Angkor Wat silhouette"
          className="w-full max-w-3xl mb-[-63] "
        />

        {/* Right side: language/help */}
        <div className="flex items-center space-x-4 mr-[-90] text-xs pl-15 pr-25 mt-[180]">
          <p>English 
            
          </p>
          <p>Help</p>
        </div>
        <div className="flex flex-col ">
          <img src="/logo/90l.png" className="w-30   mb-[-130] mt-4 "  />
        </div>
      </div>
    </footer>
  );
}