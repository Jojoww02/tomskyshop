import { Head, usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { ChevronRight, Phone, Mail, MessageCircle, Zap } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Import  poster
import MobileLegendPoster from '../../assets/mobile_legend_poster.png';
import FreeFirePoster from '../../assets/free_fire_poster.png';
import GenshinImpactPoster from '../../assets/genshin_impact_poster.png';
import ValorantPoster from '../../assets/valorant_poster.png';
import PubgMobilePoster from '../../assets/pubg_mobile_poster.png';
import LolPoster from '../../assets/lol_poster.png';
import HonorOfKingsPoster from '../../assets/honor_of_kings_poster.png';
import CallOfDutyPoster from '../../assets/call_of_duty_poster.png';
import PromoImage1 from '../../assets/Promo_Image_1.png';
import PromoImage2 from '../../assets/Promo_Image_2.png';
import PromoImage3 from '../../assets/Promo_Image_3.png';
import TomSkyShopLogo from '../../assets/Tomskyshop_logo.png';

// Map game slugs to poster images
const posterMap: Record<string, string> = {
  'mobile-legends': MobileLegendPoster,
  'free-fire': FreeFirePoster,
  'pubg-mobile': PubgMobilePoster,
  'genshin-impact': GenshinImpactPoster,
  'valorant': ValorantPoster,
  'honor-of-kings': HonorOfKingsPoster,
  'call-of-duty': CallOfDutyPoster,
  'league-of-legends': LolPoster,
};

const tabs = [
  { id: 'all', name: 'Topup Game', active: true },
  { id: 'voucher', name: 'Voucher & Streaming', active: false },
];

const banners = [
  { image: PromoImage1, title: 'TomSkyShop', desc: 'Top Up Game Favorit Kamu' },
  { image: PromoImage2, title: 'Promo Spesial', desc: 'Diskon Besar-besaran' },
  { image: PromoImage3, title: 'Harga Termurah', desc: 'Murahnya Ga Bohong!' },
];

const gamePosters = [
  { name: 'Mobile Legends', slug: 'mobile-legends', poster: posterMap['mobile-legends'] || MobileLegendPoster, currency: 'Diamonds' },
  { name: 'Free Fire', slug: 'free-fire', poster: posterMap['free-fire'] || FreeFirePoster, currency: 'Diamonds' },
  { name: 'Honor of Kings', slug: 'honor-of-kings', poster: posterMap['honor-of-kings'] || HonorOfKingsPoster, currency: 'Tokens' },
  { name: 'Genshin Impact', slug: 'genshin-impact', poster: posterMap['genshin-impact'] || GenshinImpactPoster, currency: 'Genesis' },
  { name: 'PUBG Mobile', slug: 'pubg-mobile', poster: posterMap['pubg-mobile'] || PubgMobilePoster, currency: 'UC' },
  { name: 'Valorant', slug: 'valorant', poster: posterMap['valorant'] || ValorantPoster, currency: 'VP' },
  { name: 'Call of Duty Mobile', slug: 'call-of-duty', poster: posterMap['call-of-duty'] || CallOfDutyPoster, currency: 'CP' },
  { name: 'League of Legends', slug: 'league-of-legends', poster: posterMap['league-of-legends'] || LolPoster, currency: 'RP' },
];

interface FlashSaleProduct {
  id: number;
  name: string;
  slug: string;
  originalPrice: number;
  flashPrice: number;
  discount: number;
  game: string;
  game_slug: string;
  flash_sale_ends_at: string;
}

export default function Home() {
  const { flashSaleProducts = [] } = usePage<{ flashSaleProducts: FlashSaleProduct[] }>().props;
  const [activeTab, setActiveTab] = useState('all');
  const [, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFlashSaleActive, setIsFlashSaleActive] = useState(false);

  // Countdown Timer Logic
  useEffect(() => {
    if (flashSaleProducts.length === 0) {
      setIsFlashSaleActive(false);
      return;
    }

    // Get the earliest end time among all flash sale products
    const endTimes = flashSaleProducts.map(p => new Date(p.flash_sale_ends_at).getTime());
    const minEndTime = Math.min(...endTimes);

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = minEndTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsFlashSaleActive(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
      setIsFlashSaleActive(true);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [flashSaleProducts]);

  // Flash Sale Carousel Settings
  const flashSaleSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2.2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 1.6 } },
      { breakpoint: 768, settings: { slidesToShow: 1.2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  // Pisahkan games menjadi populer dan lainnya (semua game untuk section SEMUA GAME)
  const popularGameSlugs = ['mobile-legends', 'free-fire', 'pubg-mobile'];
  const popularGames = gamePosters.filter(game => popularGameSlugs.includes(game.slug));

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: '11%',
    arrows: true,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    customPaging: () => (
      <div className="w-2 h-2 rounded-full bg-white/40 hover:bg-white/60 transition-all"></div>
    ),
    dotsClass: 'slick-dots absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2',
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          centerPadding: '11%',
        },
      },
      {
        breakpoint: 1280,
        settings: {
          centerPadding: '8%',
        },
      },
      {
        breakpoint: 1024,
        settings: {
          centerPadding: '5%',
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: '0%',
        },
      },
    ],
  };

  return (
    <AppLayout>
      <Head title="TomSkyShop - Top Up Game Tercepat & Termurah" />

      <div className="min-h-screen bg-[#1a1c23]">
        {/* Hero Banner Carousel */}
        <section className="relative w-full overflow-hidden bg-[#1a1c23] py-4">
          <style>{`
            .carousel-container {
              perspective: 1800px;
            }
            .carousel-container .slick-slide {
              transition: all 0.5s ease;
              opacity: 0.5;
              transform: scale(0.9);
            }
            .carousel-container .slick-center {
              opacity: 1;
              transform: scale(1);
            }
            .carousel-container .slick-dots li.slick-active div {
              background: linear-gradient(to right, #1e40af, #3b82f6);
              width: 24px;
            }
            .carousel-container .slick-prev, .carousel-container .slick-next {
              width: 36px !important;
              height: 36px !important;
              z-index: 10;
            }
            .carousel-container .slick-prev {
              left: 10px !important;
            }
            .carousel-container .slick-next {
              right: 10px !important;
            }
            .carousel-container .slick-prev:before, .carousel-container .slick-next:before {
              font-size: 30px !important;
              color: white !important;
              opacity: 0.9 !important;
            }
            @media (min-width: 768px) {
              .carousel-container .slick-prev, .carousel-container .slick-next {
                width: 48px !important;
                height: 48px !important;
              }
              .carousel-container .slick-prev {
                left: 20px !important;
              }
              .carousel-container .slick-next {
                right: 20px !important;
              }
              .carousel-container .slick-prev:before, .carousel-container .slick-next:before {
                font-size: 40px !important;
              }
            }
          `}</style>
          <div className="carousel-container relative w-full">
            <Slider {...sliderSettings}>
              {banners.map((banner, index) => (
                <div key={index} className="px-2">
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && isFlashSaleActive && (
          <section className="px-3 sm:px-4 lg:px-6 pb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Zap className="h-7 w-7 text-yellow-400 fill-yellow-400" />
                <h2 className="text-2xl font-bold text-white">FLASH SALE</h2>
              </div>
              <div className="flex items-center gap-2 bg-[#232631] px-4 py-2 rounded-xl">
                {timeLeft.days > 0 && (
                  <div className="text-center">
                    <span className="block text-white font-bold text-lg">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-xs text-slate-400">Hari</span>
                  </div>
                )}
                <div className="text-center">
                  <span className="block text-white font-bold text-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-xs text-slate-400">Jam</span>
                </div>
                <span className="text-white font-bold">:</span>
                <div className="text-center">
                  <span className="block text-white font-bold text-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-xs text-slate-400">Menit</span>
                </div>
                <span className="text-white font-bold">:</span>
                <div className="text-center">
                  <span className="block text-white font-bold text-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-xs text-slate-400">Detik</span>
                </div>
              </div>
            </div>

            <Slider {...flashSaleSliderSettings}>
              {flashSaleProducts.map((item) => (
                <div key={item.id} className="px-1.5">
                  <Link href={`/games/${item.game_slug}`}>
                    <Card className="group bg-[#232631] border-0 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                      <div className="flex items-center gap-4 p-3 sm:p-4 min-h-[140px]">
                        <div className="relative w-24 sm:w-28 md:w-32 aspect-square rounded-xl overflow-hidden flex-shrink-0">
                          <img src={posterMap[item.game_slug] || MobileLegendPoster} alt={item.name} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            -{item.discount}%
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-300 mb-1">{item.game}</div>
                          <div className="text-lg text-white font-semibold mb-2 line-clamp-2">{item.name}</div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-lg font-bold text-white">
                              Rp {item.flashPrice.toLocaleString('id-ID')}
                            </span>
                            <span className="text-sm text-slate-400 line-through">
                              Rp {item.originalPrice.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </div>
              ))}
            </Slider>
          </section>
        )}

        {/* Always Visible POPULER Section */}
        <section className="px-3 sm:px-4 lg:px-6 pb-8">
          {/* Populer Label */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl font-bold text-white">POPULER</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularGames.map((game, index) => (
              <Link key={index} href={`/games/${game.slug}`}>
                <Card className="group bg-[#232631] border-0 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={game.poster}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {game.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {game.currency}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Tab Content Section */}
        <section className="px-3 sm:px-4 lg:px-6 pb-16">
          {/* Tabs - Always Visible */}
          <div className="flex gap-2 overflow-x-auto pb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white shadow-lg'
                    : 'bg-[#232631] text-[#8a8f9e] hover:text-white hover:bg-[#2a2d39]'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab: Topup Game */}
          {activeTab === 'all' && (
            <>
              {/* Semua Game Label */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">🎮</span>
                <h2 className="text-xl font-bold text-white">SEMUA GAME</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gamePosters.map((game, index) => (
                  <Link key={index} href={`/games/${game.slug}`}>
                    <Card className="group overflow-hidden bg-transparent border-0 rounded-2xl hover:scale-105 transition-transform duration-300">
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        <img
                          src={game.poster}
                          alt={game.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c23] via-transparent to-transparent" />
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm font-medium text-white">
                          {game.name}
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Tab: Voucher & Streaming */}
          {activeTab === 'voucher' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-white mb-2">Voucher & Streaming</h3>
              <p className="text-slate-400">Coming Soon!</p>
            </div>
          )}

          {/* Tab: Pulsa, Data & E-Wallet */}
          {activeTab === 'pulsa' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-white mb-2">Pulsa, Data & E-Wallet</h3>
              <p className="text-slate-400">Coming Soon!</p>
            </div>
          )}

          {/* Tab: Pascabayar */}
          {activeTab === 'pascabayar' && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-white mb-2">Pascabayar</h3>
              <p className="text-slate-400">Coming Soon!</p>
            </div>
          )}
        </section>
        {/* Footer with Wave Divider */}
        <div className="relative">
          {/* Wave divider */}
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 -mb-1">
            <path
              d="M0,0 Q200,40 400,0 T800,0 T1200,0 L1200,120 L0,120 Z"
              fill="#e8eaf0"
            />
          </svg>

          <footer className="bg-[#e8eaf0] pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* TomSkyShop Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={TomSkyShopLogo}
                      alt="TomSkyShop"
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <h3 className="font-orbitron font-black text-2xl text-[#1a1c23]">
                      TOMSKYSHOP
                    </h3>
                  </div>
                  <p className="text-[#4a4d5a] text-sm leading-relaxed mb-6">
                    Tomskyshop adalah sebuah website penyedia layanan topup game yang paling lengkap dan murah. Dan juga kami memiliki pelayanan 24 jam untuk anda yang mengalami masalah pada saat melakukan pemesanan.
                  </p>
                  <div className="space-y-2 text-sm text-[#4a4d5a]">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Email: admin@tomskyshop.id</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>Nomor HP: +62 812-1234-5678</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span>🟢</span>
                      <span>Online CS: 11:00 - 00:00 WIB</span>
                    </p>
                  </div>
                </div>

                {/* Layanan Lainnya */}
                <div>
                  <h4 className="text-base font-bold text-[#1a1c23] mb-4 relative">
                    Layanan Lainnya
                    <span className="absolute -bottom-2 left-0 w-10 h-1 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] rounded-full"></span>
                  </h4>
                  <ul className="space-y-2">
                    <li><Link href="/games/mobile-legends" className="text-[#4a4d5a] hover:text-[#1e40af] transition-colors text-sm flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" /> Mobile Legends
                    </Link></li>
                    <li><Link href="/games/free-fire" className="text-[#4a4d5a] hover:text-[#1e40af] transition-colors text-sm flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" /> Free Fire
                    </Link></li>
                    <li><Link href="/games/pubg-mobile" className="text-[#4a4d5a] hover:text-[#1e40af] transition-colors text-sm flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" /> PUBG Mobile
                    </Link></li>
                  </ul>
                </div>

                {/* Peta Situs */}
                <div>
                  <h4 className="text-base font-bold text-[#1a1c23] mb-4 relative">
                    Peta Situs
                    <span className="absolute -bottom-2 left-0 w-10 h-1 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] rounded-full"></span>
                  </h4>
                  <ul className="space-y-2">
                    <li><Link href="/login" className="text-[#4a4d5a] hover:text-[#1e40af] transition-colors text-sm flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" /> Masuk
                    </Link></li>
                    <li><Link href="/register" className="text-[#4a4d5a] hover:text-[#1e40af] transition-colors text-sm flex items-center gap-2">
                      <ChevronRight className="w-3 h-3" /> Daftar
                    </Link></li>
                  </ul>
                </div>
              </div>

              {/* Copyright */}
              <div className="border-t border-[#d1d5e0] mt-10 pt-6 text-center text-[#6b6f7d] text-sm">
                <p>© 2026 TomSkyShop. All rights Reserved.</p>
              </div>
            </div>
          </footer>
        </div>

        {/* Floating WhatsApp Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://wa.me/6281212345678"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-[#25D366] to-[#128C7E] rounded-full shadow-lg shadow-green-500/30 hover:scale-110 transition-transform duration-300"
          >
            <MessageCircle className="w-7 h-7 text-white fill-white" />
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
