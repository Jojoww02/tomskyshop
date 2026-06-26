import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface OrderDetail {
  id: number;
  order_number: string;
  target_user_id: string;
  quantity: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  status: string;
  payment_status: string;
  payment_method: string | null;
  paid_at: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  user: { id: number; name: string; email: string } | null;
  game: { id: number; name: string } | null;
  product: { id: number; name: string } | null;
  payment: {
    id: number;
    status: string;
    payment_number: string;
    amount: number;
    paid_at: string | null;
    payment_reference: string | null;
    metadata: Record<string, unknown> | null;
  } | null;
  promo: { code: string; discount_amount: number } | null;
}

type AdminOrdersShowProps = PageProps<{
  order: OrderDetail;
  statusOptions: string[];
}>;

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  return d.toLocaleString('id-ID');
}

export default function AdminOrdersShow() {
  const { order, statusOptions } = usePage<AdminOrdersShowProps>().props;

  const form = useForm({
    status: order.status,
    admin_notes: order.admin_notes ?? '',
  });

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Admin', href: '/admin' },
        { title: 'Orders', href: '/admin/orders' },
        { title: order.order_number, href: `/admin/orders/${order.order_number}` },
      ]}
    >
      <Head title={`Admin - Order ${order.order_number}`} />

      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white">Detail Order</h1>
            <p className="mt-1 text-slate-400">{order.order_number}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/orders">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-slate-400">User</div>
                    <div className="mt-1 text-white">{order.user?.name ?? '-'}</div>
                    <div className="text-xs text-slate-500">{order.user?.email ?? ''}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Game / Produk</div>
                    <div className="mt-1 text-white">{order.game?.name ?? '-'}</div>
                    <div className="text-xs text-slate-500">{order.product?.name ?? ''}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Target</div>
                    <div className="mt-1 text-white">{order.target_user_id}</div>
                    <div className="text-xs text-slate-500">Quantity: {order.quantity}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Waktu</div>
                    <div className="mt-1 text-white">{formatDate(order.created_at)}</div>
                    <div className="text-xs text-slate-500">Updated: {formatDate(order.updated_at)}</div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>Total</span>
                    <span className="text-white">{formatRupiah(order.total_amount)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-slate-300">
                    <span>Diskon</span>
                    <span className="text-white">{formatRupiah(order.discount_amount)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 text-sm text-slate-300">
                    <span>Final</span>
                    <span className="text-white">{formatRupiah(order.final_amount)}</span>
                  </div>
                  {order.promo && (
                    <div className="mt-3 text-xs text-slate-500">
                      Promo: <span className="text-slate-300">{order.promo.code}</span> ({formatRupiah(order.promo.discount_amount)})
                    </div>
                  )}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-sm text-slate-400">Status Order</div>
                    <div className="mt-1 text-lg font-semibold text-white">{order.status}</div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-sm text-slate-400">Status Pembayaran</div>
                    <div className="mt-1 text-lg font-semibold text-white">{order.payment_status}</div>
                    <div className="mt-1 text-xs text-slate-500">{order.payment_method ?? '-'}</div>
                    <div className="mt-1 text-xs text-slate-500">Paid at: {formatDate(order.paid_at)}</div>
                  </div>
                </div>

                {order.payment && (
                  <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="text-sm text-slate-300">Payment</div>
                    <div className="mt-2 grid gap-2 text-sm">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Payment Number</span>
                        <span className="text-white">{order.payment.payment_number}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Status</span>
                        <span className="text-white">{order.payment.status}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Amount</span>
                        <span className="text-white">{formatRupiah(order.payment.amount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Paid At</span>
                        <span className="text-white">{formatDate(order.payment.paid_at)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6">
                <div className="text-lg font-semibold text-white">Aksi Admin</div>
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                      value={form.data.status}
                      onChange={(e) => form.setData('status', e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white cursor-pointer"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {form.errors.status && <div className="text-sm text-red-400">{form.errors.status}</div>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin_notes">Catatan (opsional)</Label>
                    <Input
                      id="admin_notes"
                      value={form.data.admin_notes}
                      onChange={(e) => form.setData('admin_notes', e.target.value)}
                      placeholder="contoh: top up sukses / payment belum masuk"
                    />
                    {form.errors.admin_notes && <div className="text-sm text-red-400">{form.errors.admin_notes}</div>}
                  </div>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-500"
                    disabled={form.processing}
                    onClick={(e) => {
                      e.preventDefault();
                      form.put(`/admin/orders/${order.order_number}/status`, { preserveScroll: true });
                    }}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Simpan Status
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-200 hover:bg-slate-800"
                      disabled={form.processing}
                      onClick={() => form.setData('status', 'processing')}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-700 text-slate-200 hover:bg-slate-800"
                      disabled={form.processing}
                      onClick={() => form.setData('status', 'completed')}
                    >
                      Selesai
                    </Button>
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

