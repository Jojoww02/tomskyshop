import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

interface ProductCheckout {
  id: number;
  name: string;
  price: number;
  base_price: number;
  original_price: number | null;
  is_flash_sale_active: boolean;
  package_type: string | null;
  game_currency_amount: string | null;
  bonus_amount: string | null;
  stock: number;
  in_stock: boolean;
}

interface GameCheckout {
  id: number;
  name: string;
  slug: string;
}

interface PaymentMethodOption {
  id: number;
  name: string;
  code: string;
  type: string;
  account_number: string | null;
  account_name: string | null;
  min_amount: number;
  max_amount: number | null;
}

interface CouponOption {
  code: string;
  discount_percent: number;
  expires_at: string | null;
}

type CheckoutPageProps = PageProps<{
  product: ProductCheckout;
  game: GameCheckout | null;
  target_user_id: string;
  quantity: number;
  pricing: {
    unit_price: number;
    total_amount: number;
  };
  paymentMethods: PaymentMethodOption[];
  availableCoupons: CouponOption[];
}>;

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return date.toLocaleString('id-ID');
}

export default function CheckoutIndex() {
  const { product, game, target_user_id, quantity, pricing, paymentMethods, availableCoupons } = usePage<CheckoutPageProps>().props;

  const form = useForm({
    product_id: product.id,
    target_user_id,
    quantity,
    payment_method: paymentMethods[0]?.code ?? '',
    discount_code: '',
  });

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Game', href: game ? `/games/${game.slug}` : '/games' },
        { title: 'Checkout', href: '/checkout' },
      ]}
    >
      <Head title="Checkout - TomSkyShop" />

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white">Checkout</h1>
            <p className="mt-1 text-slate-400">Pilih metode pembayaran, lalu buat order.</p>
          </div>
          {game && (
            <Link href={`/games/${game.slug}`}>
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                Kembali
              </Button>
            </Link>
          )}
        </div>

        {!product.in_stock && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            Stock tidak mencukupi untuk quantity yang dipilih.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-sm text-slate-400">Paket</div>
                    <div className="mt-1 text-lg font-semibold text-white">{product.name}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                      {product.game_currency_amount && product.package_type && (
                        <span className="rounded-full bg-slate-800 px-3 py-1">
                          {product.game_currency_amount} {product.package_type}
                        </span>
                      )}
                      {product.bonus_amount && (
                        <span className="rounded-full bg-cyan-600/20 px-3 py-1 text-cyan-200">+{product.bonus_amount} bonus</span>
                      )}
                      {product.is_flash_sale_active && (
                        <span className="rounded-full bg-violet-600/20 px-3 py-1 text-violet-200">Flash Sale</span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="target_user_id">User ID / Target</Label>
                      <Input
                        id="target_user_id"
                        value={form.data.target_user_id}
                        onChange={(e) => form.setData('target_user_id', e.target.value)}
                      />
                      {form.errors.target_user_id && <div className="text-sm text-red-400">{form.errors.target_user_id}</div>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min={1}
                        max={10}
                        value={form.data.quantity}
                        onChange={(e) => form.setData('quantity', Number(e.target.value))}
                      />
                      {form.errors.quantity && <div className="text-sm text-red-400">{form.errors.quantity}</div>}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Metode Pembayaran</Label>
                    <div className="grid gap-3">
                      {paymentMethods.map((m) => (
                        <button
                          type="button"
                          key={m.code}
                          onClick={() => form.setData('payment_method', m.code)}
                          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                            form.data.payment_method === m.code
                              ? 'border-violet-500 bg-violet-600/10'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-white">{m.name}</div>
                            <div className="mt-1 text-xs text-slate-400">
                              {m.type.toUpperCase()}
                              {m.account_number && <span className="ml-2">• {m.account_number}</span>}
                            </div>
                          </div>
                          <div className={`h-4 w-4 rounded-full border ${form.data.payment_method === m.code ? 'border-violet-400 bg-violet-500' : 'border-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                    {form.errors.payment_method && <div className="text-sm text-red-400">{form.errors.payment_method}</div>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount_code">Kode Promo / Kupon (opsional)</Label>
                    <Input
                      id="discount_code"
                      placeholder="contoh: GACHA-XXXXXX / HEMAT10"
                      value={form.data.discount_code}
                      onChange={(e) => form.setData('discount_code', e.target.value.toUpperCase())}
                    />
                    {availableCoupons.length > 0 && (
                      <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                        <div className="mb-2 text-sm font-medium text-slate-200">Kupon kamu</div>
                        <div className="grid gap-2">
                          {availableCoupons.map((c) => (
                            <button
                              type="button"
                              key={c.code}
                              onClick={() => form.setData('discount_code', c.code)}
                              className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-left hover:bg-slate-900"
                            >
                              <div className="text-sm text-white">
                                {c.code} <span className="ml-2 text-cyan-300">-{c.discount_percent}%</span>
                              </div>
                              <div className="text-xs text-slate-400">{formatDate(c.expires_at) ?? 'Tanpa expiry'}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {form.errors.discount_code && <div className="text-sm text-red-400">{form.errors.discount_code}</div>}
                  </div>

                  <div className="flex items-center justify-end">
                    <Button
                      disabled={form.processing || !product.in_stock || !form.data.payment_method}
                      className="bg-violet-600 hover:bg-violet-500"
                      onClick={(e) => {
                        e.preventDefault();
                        form.post('/orders');
                      }}
                    >
                      Buat Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6">
                <div className="text-lg font-semibold text-white">Ringkasan</div>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Harga</span>
                    <span className="text-white">{formatRupiah(pricing.unit_price)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Quantity</span>
                    <span className="text-white">{form.data.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-slate-300">
                    <span>Total</span>
                    <span className="text-white">{formatRupiah(pricing.unit_price * form.data.quantity)}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Diskon akan dihitung setelah order dibuat dan kode tervalidasi.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

