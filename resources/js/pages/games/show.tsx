import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  package_type: string;
  game_currency_amount: string;
  bonus_amount: string;
  is_featured: boolean;
  discount_percentage: number | null;
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
  const { game, products = [] } = usePage<PageProps & { game: Game; products: Product[] }>().props;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [targetUserId, setTargetUserId] = useState('');

  const featuredProducts = products.filter((p: Product) => p.is_featured);
  const regularProducts = products.filter((p: Product) => !p.is_featured);

  return (
    <AppLayout>
      <Head title={`${game.name} - TomSkyShop`}>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-slate-950">
        <div className="relative h-64 md:h-96 overflow-hidden">
          {game.banner_url ? (
            <img
              src={game.banner_url}
              alt={game.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-violet-900/50 to-cyan-900/50" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <Link href="/games" className="text-slate-400 hover:text-white mb-4 inline-block">
                ← Kembali ke Daftar Game
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-orbitron mb-2">
                {game.name}
              </h1>
              <p className="text-lg text-slate-300">{game.category?.name}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {featuredProducts.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">
                    Paket Unggulan
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {featuredProducts.map((product: Product) => (
                      <button
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 ${
                          selectedProduct?.id === product.id
                            ? 'bg-violet-600/20 border-violet-500'
                            : 'bg-slate-900/80 border-slate-800 hover:border-violet-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-violet-600/30 to-cyan-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">💎</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold mb-1">{product.name}</h3>
                            <p className="text-sm text-slate-400 mb-2">
                              {product.game_currency_amount} {product.package_type}
                              {product.bonus_amount && (
                                <span className="text-cyan-400 ml-1">+{product.bonus_amount} bonus</span>
                              )}
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-bold text-white">
                                Rp {product.price.toLocaleString('id-ID')}
                              </span>
                              {product.original_price && (
                                <span className="text-sm text-slate-500 line-through">
                                  Rp {product.original_price.toLocaleString('id-ID')}
                                </span>
                              )}
                            </div>
                            {product.discount_percentage && (
                              <span className="inline-block mt-2 px-2 py-1 bg-pink-600/20 text-pink-400 text-xs font-medium rounded">
                                -{product.discount_percentage}%
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">
                  Semua Paket
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {regularProducts.map((product: Product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`text-left p-5 rounded-xl border-2 transition-all duration-300 ${
                        selectedProduct?.id === product.id
                          ? 'bg-violet-600/20 border-violet-500'
                          : 'bg-slate-900/80 border-slate-800 hover:border-violet-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💎</span>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-sm">{product.name}</h3>
                          <p className="text-xs text-slate-400">
                            {product.game_currency_amount} {product.package_type}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Deskripsi Game</h2>
                <p className="text-slate-400 leading-relaxed">{game.description}</p>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sticky top-4">
                <h2 className="text-xl font-bold text-white mb-6">Pesan Sekarang</h2>
                
                {selectedProduct ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-violet-600/10 border border-violet-600/30 rounded-xl">
                      <p className="text-sm text-slate-400 mb-1">Paket Terpilih</p>
                      <p className="text-white font-bold">{selectedProduct.name}</p>
                      <p className="text-sm text-cyan-400 mt-1">
                        {selectedProduct.game_currency_amount} {selectedProduct.package_type}
                      </p>
                      <p className="text-xl font-bold text-white mt-2">
                        Rp {selectedProduct.price.toLocaleString('id-ID')}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        {game.name} ID / User ID
                      </label>
                      <input
                        type="text"
                        value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        placeholder={`Masukkan ${game.name} ID`}
                        className="w-full h-12 px-4 bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-lg"
                      />
                    </div>

                    <Button
                      className="w-full h-12 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold rounded-lg"
                      disabled={!targetUserId}
                    >
                      Pilih Metode Pembayaran
                    </Button>

                    <p className="text-xs text-slate-500 text-center">
                      Dengan memesan, Anda menyetujui Syarat & Ketentuan kami
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-slate-400">Pilih paket untuk melanjutkan</p>
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
