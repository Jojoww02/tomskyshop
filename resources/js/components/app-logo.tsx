import TomSkyShopLogo from '../../assets/Tomskyshop_logo.webp';

export default function AppLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <img
          src={TomSkyShopLogo}
          alt="TomSkyShop"
          className="h-10 w-10 rounded-lg object-cover shadow-sm shadow-blue-500/20"
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-black text-xl text-white tracking-wide">
          TOMSKYSHOP
        </span>
        <span className="text-xs text-slate-400">
          Top Up Game Murah
        </span>
      </div>
    </div>
  );
}
