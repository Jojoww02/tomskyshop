import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

export default function GamesIndex() {
  const { games = [], categories = [] } = usePage<PageProps>().props;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((game: Game) => {
    const matchesCategory = !selectedCategory || game.category?.slug === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout>
      <Head title="Semua Game - TomSkyShop">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white font-orbitron mb-4">
              Daftar Game
            </h1>
            <p className="text-slate-400 text-lg">
              Pilih game favoritmu dan mulai top up sekarang
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sticky top-4">
                <h3 className="text-lg font-bold text-white mb-4">Kategori</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      !selectedCategory
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    Semua Game
                  </button>
                  
                  {categories.map((category: any) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.slug
                          ? 'bg-violet-600 text-white'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Cari game..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 px-6 bg-slate-900/80 border border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGames.map((game: Game) => (
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
                          <span className="px-3 py-1 bg-violet-600/90 text-white text-xs font-medium rounded-full">
                            {game.category?.name}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                          {game.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {game.products_count || 0} paket tersedia
                          </span>
                          <span className="text-violet-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                            Top Up →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">Game Tidak Ditemukan</h3>
                  <p className="text-slate-400">Coba gunakan kata kunci lain atau pilih kategori lain</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
