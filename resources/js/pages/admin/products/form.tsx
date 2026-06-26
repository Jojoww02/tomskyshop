import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';

interface GameOption {
  id: number;
  name: string;
}

type ProductType = 'game_topup' | 'voucher_streaming';
type Mode = 'create' | 'edit';

interface ProductFormData {
  type: ProductType;
  game_id: number | null;
  name: string;
  slug: string;
  description: string;
  price: number | '';
  original_price: number | '' | null;
  flash_sale_price: number | '' | null;
  is_flash_sale: boolean;
  flash_sale_ends_at: string | null;
  package_type: string;
  game_currency_amount: string;
  bonus_amount: string;
  is_featured: boolean;
  is_active: boolean;
  stock: number;
  // Voucher & Streaming specific fields
  voucher_category: string;
  validity_period: string;
}

interface ProductEditData {
  id: number;
  type: ProductType;
  game_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  flash_sale_price: number | null;
  is_flash_sale: boolean;
  flash_sale_ends_at: string | null;
  package_type: string | null;
  game_currency_amount: string | null;
  bonus_amount: string | null;
  is_featured: boolean;
  is_active: boolean;
  stock: number;
  voucher_category: string | null;
  validity_period: string | null;
}

type AdminProductsFormProps = PageProps<{
  mode: Mode;
  games: GameOption[];
  product: ProductEditData | null;
}>;

function toDatetimeLocal(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function AdminProductsForm() {
  const { mode, games, product } = usePage<AdminProductsFormProps>().props;

  const form = useForm<ProductFormData>({
    type: product?.type ?? 'game_topup',
    game_id: product?.game_id ?? (games[0]?.id ?? 0),
    name: product?.name ?? '',
    slug: product?.slug ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    original_price: product?.original_price ?? null,
    flash_sale_price: product?.flash_sale_price ?? null,
    is_flash_sale: product?.is_flash_sale ?? false,
    flash_sale_ends_at: toDatetimeLocal(product?.flash_sale_ends_at ?? null) || null,
    package_type: product?.package_type ?? '',
    game_currency_amount: product?.game_currency_amount ?? '',
    bonus_amount: product?.bonus_amount ?? '',
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
    stock: product?.stock ?? -1,
    voucher_category: product?.voucher_category ?? '',
    validity_period: product?.validity_period ?? '',
  });

  const title = mode === 'create' ? 'Tambah Produk' : 'Edit Produk';

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Admin', href: '/admin' },
        { title: 'Produk', href: '/admin/products' },
        { title, href: mode === 'create' ? '/admin/products/create' : `/admin/products/${product?.id}/edit` },
      ]}
    >
      <Head title={`Admin - ${title}`} />

      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white">{title}</h1>
            <p className="mt-1 text-slate-400">Kelola harga, denom, stock, dan flash sale.</p>
          </div>
          <Link href="/admin/products">
            <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>
          </Link>
        </div>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (mode === 'create') {
                  form.post('/admin/products');
                } else {
                  form.put(`/admin/products/${product?.id}`);
                }
              }}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Produk</Label>
                  <select
                    id="type"
                    value={form.data.type}
                    onChange={(e) => form.setData('type', e.target.value as ProductType)}
                    className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-white cursor-pointer"
                  >
                    <option value="game_topup">Game Top Up</option>
                    <option value="voucher_streaming">Voucher & Streaming</option>
                  </select>
                  {form.errors.type && <div className="text-sm text-red-400">{form.errors.type}</div>}
                </div>

                {form.data.type === 'game_topup' && (
                  <div className="space-y-2">
                    <Label htmlFor="game_id">Game</Label>
                    <select
                      id="game_id"
                      value={form.data.game_id}
                      onChange={(e) => form.setData('game_id', Number(e.target.value))}
                      className="h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-white cursor-pointer"
                    >
                      {games.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                    {form.errors.game_id && <div className="text-sm text-red-400">{form.errors.game_id}</div>}
                  </div>
                )}

                {form.data.type === 'voucher_streaming' && (
                  <div className="space-y-2">
                    <Label htmlFor="voucher_category">Kategori Voucher</Label>
                    <Input
                      id="voucher_category"
                      placeholder="Netflix / Spotify / Google Play"
                      value={form.data.voucher_category}
                      onChange={(e) => form.setData('voucher_category', e.target.value)}
                    />
                    {form.errors.voucher_category && <div className="text-sm text-red-400">{form.errors.voucher_category}</div>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Nama Produk</Label>
                  <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                  {form.errors.name && <div className="text-sm text-red-400">{form.errors.name}</div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" value={form.data.slug} onChange={(e) => form.setData('slug', e.target.value)} />
                  {form.errors.slug && <div className="text-sm text-red-400">{form.errors.slug}</div>}
                </div>

                {form.data.type === 'game_topup' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="package_type">Tipe Paket</Label>
                      <Input
                        id="package_type"
                        placeholder="diamonds / uc / genesis_crystal"
                        value={form.data.package_type}
                        onChange={(e) => form.setData('package_type', e.target.value)}
                      />
                      {form.errors.package_type && <div className="text-sm text-red-400">{form.errors.package_type}</div>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="game_currency_amount">Denom</Label>
                      <Input
                        id="game_currency_amount"
                        placeholder="86"
                        value={form.data.game_currency_amount}
                        onChange={(e) => form.setData('game_currency_amount', e.target.value)}
                      />
                      {form.errors.game_currency_amount && <div className="text-sm text-red-400">{form.errors.game_currency_amount}</div>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bonus_amount">Bonus</Label>
                      <Input
                        id="bonus_amount"
                        placeholder="0 / 8 / 25"
                        value={form.data.bonus_amount}
                        onChange={(e) => form.setData('bonus_amount', e.target.value)}
                      />
                      {form.errors.bonus_amount && <div className="text-sm text-red-400">{form.errors.bonus_amount}</div>}
                    </div>
                  </>
                )}

                {form.data.type === 'voucher_streaming' && (
                  <div className="space-y-2">
                    <Label htmlFor="validity_period">Masa Berlaku</Label>
                    <Input
                      id="validity_period"
                      placeholder="30 hari / 1 bulan / 1 tahun"
                      value={form.data.validity_period}
                      onChange={(e) => form.setData('validity_period', e.target.value)}
                    />
                    {form.errors.validity_period && <div className="text-sm text-red-400">{form.errors.validity_period}</div>}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="price">Harga</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.data.price}
                    onChange={(e) => form.setData('price', e.target.value === '' ? '' : Number(e.target.value))}
                  />
                  {form.errors.price && <div className="text-sm text-red-400">{form.errors.price}</div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="original_price">Harga Coret (opsional)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    value={form.data.original_price ?? ''}
                    onChange={(e) => form.setData('original_price', e.target.value === '' ? null : Number(e.target.value))}
                  />
                  {form.errors.original_price && <div className="text-sm text-red-400">{form.errors.original_price}</div>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock (-1 = unlimited)</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={form.data.stock}
                    onChange={(e) => form.setData('stock', Number(e.target.value))}
                  />
                  {form.errors.stock && <div className="text-sm text-red-400">{form.errors.stock}</div>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <Checkbox
                    id="is_active"
                    checked={form.data.is_active}
                    onCheckedChange={(v) => form.setData('is_active', Boolean(v))}
                  />
                  <Label htmlFor="is_active" className="text-slate-200">
                    Aktif
                  </Label>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <Checkbox
                    id="is_featured"
                    checked={form.data.is_featured}
                    onCheckedChange={(v) => form.setData('is_featured', Boolean(v))}
                  />
                  <Label htmlFor="is_featured" className="text-slate-200">
                    Unggulan
                  </Label>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 p-3">
                  <Checkbox
                    id="is_flash_sale"
                    checked={form.data.is_flash_sale}
                    onCheckedChange={(v) => form.setData('is_flash_sale', Boolean(v))}
                  />
                  <Label htmlFor="is_flash_sale" className="text-slate-200">
                    Flash Sale
                  </Label>
                </div>
              </div>

              {form.data.is_flash_sale && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="flash_sale_price">Harga Flash Sale</Label>
                    <Input
                      id="flash_sale_price"
                      type="number"
                      value={form.data.flash_sale_price ?? ''}
                      onChange={(e) => form.setData('flash_sale_price', e.target.value === '' ? null : Number(e.target.value))}
                    />
                    {form.errors.flash_sale_price && <div className="text-sm text-red-400">{form.errors.flash_sale_price}</div>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flash_sale_ends_at">Berakhir (opsional)</Label>
                    <Input
                      id="flash_sale_ends_at"
                      type="datetime-local"
                      value={form.data.flash_sale_ends_at ?? ''}
                      onChange={(e) => form.setData('flash_sale_ends_at', e.target.value || null)}
                    />
                    {form.errors.flash_sale_ends_at && <div className="text-sm text-red-400">{form.errors.flash_sale_ends_at}</div>}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (opsional)</Label>
                <textarea
                  id="description"
                  value={form.data.description}
                  onChange={(e) => form.setData('description', e.target.value)}
                  className="min-h-28 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
                />
                {form.errors.description && <div className="text-sm text-red-400">{form.errors.description}</div>}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                    type="submit"
                    disabled={form.processing}
                    className="bg-blue-600 hover:bg-blue-500"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    {mode === 'create' ? 'Simpan' : 'Update'}
                  </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

