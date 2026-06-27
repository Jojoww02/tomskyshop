import { Head, usePage, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { ArrowLeft, Gem, ShoppingCart } from 'lucide-react';

// Import banner images
import MobileLegendBanner from '../../../assets/mobile_legend.webp';
import FreeFireBanner from '../../../assets/free_fire.webp';
import PubgMobileBanner from '../../../assets/pubg_image.webp';
import GenshinImpactBanner from '../../../assets/genshin_impact.webp';
import ValorantBanner from '../../../assets/valorant.webp';
import HonorOfKingsBanner from '../../../assets/honor_of_kings.webp';
import CallOfDutyBanner from '../../../assets/call_of_duty_mobile.webp';
import LolBanner from '../../../assets/lol_image.webp';

// Map game slugs to banner images
const bannerMap: Record<string, string> = {
  'mobile-legends': MobileLegendBanner,
  'free-fire': FreeFireBanner,
  'pubg-mobile': PubgMobileBanner,
  'genshin-impact': GenshinImpactBanner,
  'valorant': ValorantBanner,
  'honor-of-kings': HonorOfKingsBanner,
  'call-of-duty': CallOfDutyBanner,
  'league-of-legends': LolBanner,
};

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  base_price: number;
  original_price: number | null;
  flash_sale_price: number | null;
  is_flash_sale: boolean;
  is_flash_sale_active: boolean;
  flash_sale_ends_at: string | null;
  image_url: string | null;
  package_type: string;
  game_currency_amount: string;
  bonus_amount: string;
  is_featured: boolean;
  discount_percentage: number | null;
  stock: number;
  in_stock: boolean;
}

interface Game {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  banner_url: string | null;
  category: {
    name: string;
  };
}

export default function GameShow() {
  const { game, products } = usePage<PageProps<{ game: Game; products: Product[] }>>().props;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetUserId, setTargetUserId] = useState('');

  const featuredProducts = products.filter((p: Product) => p.is_featured);
  const regularProducts = products.filter((p: Product) => !p.is_featured);

  return (
    <AppLayout>
      <Head title={`${game.name} - TomSkyShop`} />

      <div className="min-h-screen bg-[#1a1c23]">
        <div className="relative h-64 md:h-96 overflow-hidden">
          {bannerMap[game.slug] || game.banner_url ? (
            <img
              src={bannerMap[game.slug] ?? game.banner_url ?? undefined}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1e40af]/50 to-[#3b82f6]/50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c23] via-[#1a1c23]/80 to-[#1a1c23]/40" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Link href="/games" className="text-[#8a8f9e] hover:text-white mb-4 inline-flex items-center gap-2 cursor-pointer transition-colors">
                <ArrowLeft className="h-5 w-5" />
                Kembali ke Daftar Game
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-orbitron mb-2">
                {game.name}
              </h1>
              <p className="text-lg text-[#8a8f9e]">{game.category?.name}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {featuredProducts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6 font-orbitron flex items-center gap-2">
                    <Gem className="h-6 w-6 text-blue-400" />
                    Paket Unggulan
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {featuredProducts.map((product: Product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                          selectedProduct?.id === product.id
                            ? 'bg-gradient-to-r from-[#1e40af]/20 to-[#3b82f6]/20 border-blue-500 shadow-lg shadow-blue-500/20'
                            : 'bg-[#232631] border-[#2a2d39] hover:border-blue-500/50 hover:bg-[#2a2d39]'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-[#1e40af]/30 to-[#3b82f6]/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Gem className="h-8 w-8 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
                            <p className="text-sm text-slate-400 mb-2">
                              {product.game_currency_amount} {product.package_type}
                              {product.bonus_amount && (
                                <span className="text-cyan-400 ml-1 font-semibold">+{product.bonus_amount} bonus</span>
                              )}
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-white">
                                Rp {product.price.toLocaleString('id-ID')}
                              </span>
                              {(product.is_flash_sale_active ? product.base_price : product.original_price) && (
                                <span className="text-sm text-slate-500 line-through">
                                  Rp {(product.is_flash_sale_active ? product.base_price : product.original_price)?.toLocaleString('id-ID')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {product.discount_percentage && (
                                <span className="inline-flex px-2 py-1 bg-pink-600/20 text-pink-400 text-xs font-bold rounded-lg">
                                  -{product.discount_percentage}%
                                </span>
                              )}
                              {product.is_flash_sale_active && (
                                <span className="inline-flex px-2 py-1 bg-gradient-to-r from-[#1e40af]/20 to-[#3b82f6]/20 text-blue-300 text-xs font-bold rounded-lg">
                                  Flash Sale
                                </span>
                              )}
                            </div>
                            {!product.in_stock && (
                              <div className="mt-2 text-xs text-red-400 font-semibold">Stock habis</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-2xl font-bold text-white mb-6 font-orbitron flex items-center gap-2">
                  <Gem className="h-6 w-6 text-slate-400" />
                  Semua Paket
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {regularProducts.map((product: Product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                        selectedProduct?.id === product.id
                          ? 'bg-gradient-to-r from-[#1e40af]/20 to-[#3b82f6]/20 border-blue-500 shadow-lg shadow-blue-500/20'
                          : 'bg-[#232631] border-[#2a2d39] hover:border-blue-500/50 hover:bg-[#2a2d39]'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <Gem className="h-6 w-6 text-slate-400 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{product.name}</h3>
                          <p className="text-xs text-slate-400">
                            {product.game_currency_amount} {product.package_type}
                            {product.bonus_amount && (
                              <span className="text-cyan-400 ml-1">+{product.bonus_amount}</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold text-lg">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                          <div className="flex items-center justify-end gap-2 mt-1">
                            {product.is_flash_sale_active && (
                              <span className="text-xs text-blue-300 font-semibold">Flash Sale</span>
                            )}
                            {!product.in_stock && (
                              <span className="text-xs text-red-400 font-semibold">Habis</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-[#232631] border border-[#2a2d39] rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Deskripsi Game</h2>
                <p className="text-[#8a8f9e] leading-relaxed text-lg">{game.description}</p>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#232631] border border-[#2a2d39] rounded-3xl p-8 sticky top-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <ShoppingCart className="h-7 w-7 text-blue-400" />
                  Pesan Sekarang
                </h2>
                
                {selectedProduct ? (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-[#1e40af]/10 to-[#3b82f6]/10 border border-blue-600/30 rounded-2xl">
                      <p className="text-sm text-slate-400 mb-2">Paket Terpilih</p>
                      <p className="text-white font-bold text-lg">{selectedProduct.name}</p>
                      <p className="text-sm text-cyan-400 mt-1 font-semibold">
                        {selectedProduct.game_currency_amount} {selectedProduct.package_type}
                        {selectedProduct.bonus_amount && (
                          <span className="text-cyan-400 ml-1"> +{selectedProduct.bonus_amount} bonus</span>
                        )}
                      </p>
                      <p className="text-3xl font-bold text-white mt-4">
                        Rp {selectedProduct.price.toLocaleString('id-ID')}
                      </p>
                      {(selectedProduct.is_flash_sale_active ? selectedProduct.base_price : selectedProduct.original_price) && (
                        <p className="text-sm text-slate-500 line-through mt-1">
                          Rp {(selectedProduct.is_flash_sale_active ? selectedProduct.base_price : selectedProduct.original_price)?.toLocaleString('id-ID')}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {selectedProduct.is_flash_sale_active && (
                          <span className="inline-flex rounded-full bg-gradient-to-r from-[#1e40af]/20 to-[#3b82f6]/20 px-3 py-1 text-xs font-bold text-blue-300">
                            Flash Sale
                          </span>
                        )}
                        {selectedProduct.discount_percentage && (
                          <span className="inline-flex px-3 py-1 bg-pink-600/20 text-pink-400 text-xs font-bold rounded-full">
                            -{selectedProduct.discount_percentage}%
                          </span>
                        )}
                      </div>
                      {!selectedProduct.in_stock && (
                        <div className="mt-4 text-xs text-red-400 font-semibold">
                          Stock habis
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">
                        {game.name} ID / User ID
                      </label>
                      <input
                        type="text"
                        value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        placeholder={`Masukkan ${game.name} ID`}
                        className="w-full h-14 px-5 bg-[#2a2d39] border border-[#3a3d49] text-white placeholder:text-[#8a8f9e] focus:border-blue-500 focus:bg-[#232631] rounded-2xl transition-all cursor-text"
                      />
                    </div>

                    <Button
                      className="w-full h-14 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-blue-700 hover:to-blue-500 text-white font-bold rounded-2xl text-lg shadow-lg shadow-blue-500/30 transition-all"
                      disabled={!targetUserId || !selectedProduct.in_stock}
                      onClick={() => {
                        if (!selectedProduct || !targetUserId || !selectedProduct.in_stock) return;
                        const url = `/checkout?product_id=${selectedProduct.id}&target_user_id=${encodeURIComponent(targetUserId)}`;
                        router.visit(url);
                      }}
                    >
                      Pilih Metode Pembayaran
                    </Button>

                    <p className="text-xs text-[#8a8f9e] text-center">
                      Dengan memesan, Anda menyetujui Syarat & Ketentuan kami
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-6">📦</div>
                    <p className="text-[#8a8f9e] text-lg">Pilih paket untuk melanjutkan</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
