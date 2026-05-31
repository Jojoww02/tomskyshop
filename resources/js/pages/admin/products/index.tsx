import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Paginated<T> {
  data: T[];
  links: PaginationLink[];
  current_page: number;
  last_page: number;
  total: number;
}

interface GameOption {
  id: number;
  name: string;
}

interface ProductRow {
  id: number;
  game_id: number;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  flash_sale_price: number | null;
  is_flash_sale: boolean;
  is_flash_sale_active: boolean;
  flash_sale_ends_at: string | null;
  effective_price: number;
  package_type: string | null;
  game_currency_amount: string | null;
  bonus_amount: string | null;
  is_featured: boolean;
  is_active: boolean;
  stock: number;
  game: { id: number; name: string } | null;
}

type AdminProductsIndexProps = PageProps<{
  products: Paginated<ProductRow>;
  games: GameOption[];
  filters: { game_id: number | null };
}>;

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function AdminProductsIndex() {
  const { products, games, filters } = usePage<AdminProductsIndexProps>().props;

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Admin', href: '/admin' },
        { title: 'Produk', href: '/admin/products' },
      ]}
    >
      <Head title="Admin - Produk" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white">Produk</h1>
            <p className="mt-1 text-slate-400">Update stock, harga, denom, flash sale, dan status produk.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/products/create">
              <Button className="bg-violet-600 hover:bg-violet-500">Tambah Produk</Button>
            </Link>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-300">Filter game</label>
                <select
                  value={filters.game_id ?? ''}
                  onChange={(e) => {
                    const game_id = e.target.value ? Number(e.target.value) : null;
                    router.get('/admin/products', { game_id: game_id ?? undefined }, { preserveState: true, preserveScroll: true });
                  }}
                  className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                >
                  <option value="">Semua</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-slate-400">Total: {products.total}</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-300">
                    <th className="py-3 pr-4">Game</th>
                    <th className="py-3 pr-4">Produk</th>
                    <th className="py-3 pr-4">Denom</th>
                    <th className="py-3 pr-4">Harga</th>
                    <th className="py-3 pr-4">Flash Sale</th>
                    <th className="py-3 pr-4">Stock</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.map((p) => (
                    <tr key={p.id} className="border-b border-slate-900/60 text-slate-200">
                      <td className="py-3 pr-4">{p.game?.name ?? '-'}</td>
                      <td className="py-3 pr-4">
                        <div className="font-medium text-white">{p.name}</div>
                        <div className="text-xs text-slate-500">{p.slug}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-white">{p.game_currency_amount ?? '-'}</div>
                        {p.bonus_amount && <div className="text-xs text-cyan-400">+{p.bonus_amount} bonus</div>}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-white">{formatRupiah(p.effective_price)}</div>
                        {p.original_price && (
                          <div className="text-xs text-slate-500 line-through">{formatRupiah(p.original_price)}</div>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {p.is_flash_sale ? (
                          <div className="space-y-1">
                            <div className={`inline-flex rounded-full px-2 py-0.5 text-xs ${p.is_flash_sale_active ? 'bg-pink-600/20 text-pink-300' : 'bg-slate-800 text-slate-300'}`}>
                              {p.is_flash_sale_active ? 'Aktif' : 'Nonaktif'}
                            </div>
                            {p.flash_sale_price !== null && (
                              <div className="text-xs text-slate-400">{formatRupiah(p.flash_sale_price)}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {p.stock === -1 ? (
                          <span className="text-emerald-400">∞</span>
                        ) : (
                          <span className={p.stock > 0 ? 'text-emerald-400' : 'text-red-400'}>{p.stock}</span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          <span className={`rounded-full px-2 py-0.5 text-xs ${p.is_active ? 'bg-emerald-600/20 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>
                            {p.is_active ? 'Aktif' : 'Nonaktif'}
                          </span>
                          {p.is_featured && <span className="rounded-full bg-violet-600/20 px-2 py-0.5 text-xs text-violet-300">Unggulan</span>}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <div className="inline-flex gap-2">
                          <Link href={`/admin/products/${p.id}/edit`}>
                            <Button size="sm" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              const ok = window.confirm(`Hapus produk "${p.name}"?`);
                              if (!ok) return;
                              router.delete(`/admin/products/${p.id}`, { preserveScroll: true });
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {products.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {products.links.map((l) => (
                  <Button
                    key={l.label}
                    variant="outline"
                    className={`border-slate-800 ${l.active ? 'bg-slate-800 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-800'}`}
                    disabled={!l.url}
                    onClick={() => {
                      if (!l.url) return;
                      router.visit(l.url, { preserveScroll: true });
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: l.label }} />
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

