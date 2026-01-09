export default function Footer() {
  return (
    <footer className="w-full mt-auto text-gray-500 font-sans text-sm pb-8">
      <div className="w-full flex flex-col md:flex-row items-start  md:items-center justify-between gap-6">
      <div className="flex flex-col ">
          <img src="/logo/90r.png" className="w-25 opacity-70 mb-[-700] mt-8.5"  />
        </div>
        {/* Left side: icons and text */}
        
        <div className="flex flex-col space-y-2 ml-15 mt-30">
          <div className="flex space-x-4 ">
            <a href="https://www.facebook.com/profile.php?id=61581672682699" target="_blank" className="hover:opacity-75">
              <img src="/logo/fb.png" alt="Facebook icon" className="w-10 h-10" />
            </a>
            <a href="https://scontent.fpnh11-1.fna.fbcdn.net/v/t39.30808-1/525256128_741502671941968_2028523523037404_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=108&ccb=1-7&_nc_sid=e99d92&_nc_ohc=0FsWjgUdf18Q7kNvwEbxqe5&_nc_oc=AdlHlTYtynICgi0-uaDxFFbxHN8i1BJ980ZvQxqvnc86uGTvb-5HV3N3qrJCdXucmUk&_nc_zt=24&_nc_ht=scontent.fpnh11-1.fna&_nc_gid=jgljET5HLsZnnqtdKsInRQ&oh=00_AfoJoEyfCy88vW_RycDYU8E6YektR1HjL22XINvMvRkieg&oe=695D4419" target="_blank" className="hover:opacity-75">
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
          className="w-full opacity-70 max-w-xl mb-[-112] "
        />

        {/* Right side: language/help */}
        <div className="flex items-center space-x-4 mr-[-90] text-xs pl-15 pr-25 mt-[180]">
          <p>English 
            
          </p>
          <p>Help</p>
        </div>
        <div className="flex flex-col ">
          <img src="/logo/90l.png" className="w-25 opacity-70  mb-[-700] mt-8.5 "  />
        </div>
      </div>
    </footer>
  );
}