import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { useState } from 'react';

import MobileLegendPoster from '../../../assets/mobile_legend_poster.webp';
import FreeFirePoster from '../../../assets/free_fire_poster.webp';
import GenshinImpactPoster from '../../../assets/genshin_impact_poster.webp';
import ValorantPoster from '../../../assets/valorant_poster.webp';
import PubgMobilePoster from '../../../assets/pubg_mobile_poster.webp';
import LolPoster from '../../../assets/lol_poster.webp';
import HonorOfKingsPoster from '../../../assets/honor_of_kings_poster.webp';
import CallOfDutyPoster from '../../../assets/call_of_duty_poster.webp';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

interface Game {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  category: {
    name: string;
    slug: string;
  };
  products_count?: number;
}

type GamesIndexPageProps = PageProps<{
  games: Game[];
  categories: Category[];
}>;

export default function GamesIndex() {
  const { games, categories } = usePage<GamesIndexPageProps>().props;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = games.filter((game: Game) => {
    const matchesCategory = !selectedCategory || game.category?.slug === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AppLayout>
      <Head title="Semua Game - TomSkyShop" />

      <div className="min-h-screen bg-[#1a1c23]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white font-orbitron mb-4">
              Daftar Game
            </h1>
            <p className="text-[#8a8f9e] text-lg">
              Pilih game favoritmu dan mulai top up sekarang
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-[#232631] border border-[#2a2d39] rounded-2xl p-6 sticky top-4">
                <h3 className="text-lg font-bold text-white mb-4">Kategori</h3>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-2 rounded-full transition-colors cursor-pointer ${
                      !selectedCategory
                        ? 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30'
                        : 'text-[#8a8f9e] hover:text-white hover:bg-[#2a2d39]'
                    }`}
                  >
                    Semua Game
                  </button>
                  
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left px-4 py-2 rounded-full transition-colors cursor-pointer ${
                        selectedCategory === category.slug
                          ? 'bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white shadow-lg shadow-blue-500/30'
                          : 'text-[#8a8f9e] hover:text-white hover:bg-[#2a2d39]'
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
                  className="w-full h-12 px-6 bg-[#232631] border border-[#2a2d39] text-white placeholder:text-[#8a8f9e] focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredGames.map((game: Game) => (
                  <Link key={game.id} href={`/games/${game.slug}`}>
                    <Card className="group overflow-hidden bg-transparent border-0 hover:scale-105 transition-transform duration-300">
                      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                        {(() => {
                          const slug = game.slug.toLowerCase();
                          const name = game.name.toLowerCase();
                          let poster = null;
                          if (slug.includes('pubg') || name.includes('pubg')) poster = PubgMobilePoster;
                          else if (slug.includes('call') || slug.includes('duty') || name.includes('call') || name.includes('duty')) poster = CallOfDutyPoster;
                          else if (slug.includes('lol') || slug.includes('league') || name.includes('lol') || name.includes('league')) poster = LolPoster;
                          else if (slug.includes('free') || slug.includes('fire') || name.includes('free') || name.includes('fire')) poster = FreeFirePoster;
                          else if (slug.includes('genshin') || name.includes('genshin')) poster = GenshinImpactPoster;
                          else if (slug.includes('valorant') || name.includes('valorant')) poster = ValorantPoster;
                          else if (slug.includes('honor') || slug.includes('kings') || name.includes('honor') || name.includes('kings')) poster = HonorOfKingsPoster;
                          else if (slug.includes('mobile') || slug.includes('legend') || name.includes('mobile') || name.includes('legend')) poster = MobileLegendPoster;
                          else poster = game.image_url;
                          
                          if (poster) {
                            return (
                              <img
                                src={poster}
                                alt={game.name}
                                className="w-full h-full object-cover"
                              />
                            );
                          }
                          return (
                            <div className="w-full h-full bg-gradient-to-br from-[#1e40af]/50 to-[#3b82f6]/50 flex items-center justify-center">
                              <span className="text-6xl">🎮</span>
                            </div>
                          );
                        })()}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1c23] via-transparent to-transparent" />
                      </div>
                      <div className="text-center mt-2">
                        <h3 className="text-sm font-medium text-white">
                          {game.name}
                        </h3>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">Game Tidak Ditemukan</h3>
                  <p className="text-[#8a8f9e]">Coba gunakan kata kunci lain atau pilih kategori lain</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
