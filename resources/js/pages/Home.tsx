import { Head, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/input';
import { useState } from 'react';

interface Game {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  category: {
    name: string;
  };
  products_count?: number;
}

export default function Home() {
  const { games = [], featuredProducts = [], categories = [] } = usePage<PageProps>().props;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((game: Game) =>
    game.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <Head title="TomSkyShop - Game Top Up">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-slate-950">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-slate-950 to-cyan-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent font-orbitron">
                  Top Up Game
                </span>
                <br />
                <span className="text-white font-orbitron">Tercepat & Termurah</span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-xl text-slate-400">
                beli diamond, UC, Genesis Crystal dan item game lainnya dengan harga terbaik. 
                Proses instan, 24 jam nonstop!
              </p>

              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Cari game favoritmu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-14 pl-6 pr-4 bg-slate-900/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20 rounded-full"
                  />
                  <Button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white rounded-full">
                    Cari
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white font-orbitron">
              Kategori Game
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/games?category=${category.slug}`}
                className="group relative p-6 bg-slate-900/50 border border-slate-800 rounded-2xl hover:border-violet-500/50 hover:bg-slate-900 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{category.icon === 'gamepad' ? '🎮' : category.icon === 'target' ? '🎯' : category.icon === 'sword' ? '⚔️' : category.icon === 'crosshair' ? '🔫' : '🚗'}</div>
                <h3 className="text-white font-semibold group-hover:text-violet-400 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white font-orbitron">
              Game Populer
            </h2>
            <Link href="/games">
              <Button variant="outline" className="border-violet-500 text-violet-400 hover:bg-violet-500/10">
                Lihat Semua →
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.slice(0, 8).map((game: Game) => (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <Card className="group overflow-hidden bg-slate-900/80 border-slate-800 hover:border-violet-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/10">
                  <div className="aspect-video relative overflow-hidden">
                    {game.image_url ? (
                      <img
                        src={game.image_url}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-900/50 to-cyan-900/50 flex items-center justify-center">
                        <span className="text-6xl">🎮</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-violet-600/90 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                        {game.category?.name}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-sm text-slate-400 line-clamp-2">
                      {game.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {game.products_count || 0} paket
                      </span>
                      <span className="text-violet-400 text-sm font-medium">
                        Top Up →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {featuredProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white font-orbitron">
                Paket Unggulan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product: any) => (
                <Link key={product.id} href={`/games/${product.game?.slug}`}>
                  <Card className="group overflow-hidden bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 rounded-xl flex items-center justify-center">
                          <span className="text-3xl">💎</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{product.game?.name}</p>
                          <h3 className="text-white font-bold">{product.name}</h3>
                        </div>
                      </div>
                      
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-white">
                          Rp {product.price?.toLocaleString('id-ID')}
                        </span>
                        {product.original_price && (
                          <span className="text-sm text-slate-500 line-through">
                            Rp {product.original_price?.toLocaleString('id-ID')}
                          </span>
                        )}
                      </div>

                      {product.discount_percentage && (
                        <span className="inline-block px-3 py-1 bg-pink-600/20 text-pink-400 text-xs font-medium rounded-full">
                          -{product.discount_percentage}%
                        </span>
                      )}

                      <div className="mt-4">
                        <span className="text-sm text-cyan-400">
                          {product.game_currency_amount} {product.package_type}
                        </span>
                        {product.bonus_amount && (
                          <span className="text-sm text-slate-400 ml-2">
                            +{product.bonus_amount} bonus
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-violet-900/30 via-slate-900 to-cyan-900/30 border border-slate-800 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-violet-600/20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Proses Instan</h3>
                <p className="text-slate-400">Top up langsung masuk dalam hitungan menit</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-cyan-600/20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Harga Termurah</h3>
                <p className="text-slate-400">Dapatkan harga terbaik untuk top up game</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-pink-600/20 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">🔒</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Aman & Terpercaya</h3>
                <p className="text-slate-400">Transaksi aman dengan proteksi data</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
