import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Filter, Eye, CheckCircle2, XCircle } from 'lucide-react';

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

interface OrderRow {
  id: number;
  order_number: string;
  target_user_id: string;
  quantity: number;
  final_amount: number;
  status: string;
  payment_status: string;
  payment_method: string | null;
  created_at: string;
  user: { id: number; name: string; email: string } | null;
  game: { id: number; name: string } | null;
  product: { id: number; name: string } | null;
  payment: { id: number; status: string; payment_number: string; amount: number; paid_at: string | null } | null;
}

type AdminOrdersIndexProps = PageProps<{
  orders: Paginated<OrderRow>;
  filters: { status: string | null };
  statusOptions: string[];
}>;

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string) {
  const d = new Date(value);
  return d.toLocaleString('id-ID');
}

function statusBadgeClass(status: string) {
  if (status === 'completed') return 'bg-emerald-600/20 text-emerald-300';
  if (status === 'processing') return 'bg-cyan-600/20 text-cyan-300';
  if (status === 'failed') return 'bg-red-600/20 text-red-300';
  if (status === 'cancelled') return 'bg-slate-800 text-slate-300';
  return 'bg-blue-600/20 text-blue-300';
}

export default function AdminOrdersIndex() {
  const { orders, filters, statusOptions } = usePage<AdminOrdersIndexProps>().props;

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Admin', href: '/admin' },
        { title: 'Orders', href: '/admin/orders' },
      ]}
    >
      <Head title="Admin - Orders" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white">Orders</h1>
            <p className="mt-1 text-slate-400">Terima dan proses order top up dari user.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <Card className="border-slate-800 bg-slate-900/80">
          <CardContent className="p-6">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 text-slate-400" />
                <label className="text-sm text-slate-300">Filter status</label>
                <select
                  value={filters.status ?? ''}
                  onChange={(e) => {
                    const status = e.target.value ? e.target.value : null;
                    router.get('/admin/orders', { status: status ?? undefined }, { preserveState: true, preserveScroll: true });
                  }}
                  className="h-10 rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-white cursor-pointer"
                >
                  <option value="">Semua</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-slate-400">Total: {orders.total}</div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-300">
                    <th className="py-3 pr-4">Order</th>
                    <th className="py-3 pr-4">User</th>
                    <th className="py-3 pr-4">Produk</th>
                    <th className="py-3 pr-4">Target</th>
                    <th className="py-3 pr-4">Total</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Payment</th>
                    <th className="py-3 pr-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.data.map((o) => (
                    <tr key={o.id} className="border-b border-slate-900/60 text-slate-200">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-white">{o.order_number}</div>
                        <div className="text-xs text-slate-500">{formatDate(o.created_at)}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-white">{o.user?.name ?? '-'}</div>
                        <div className="text-xs text-slate-500">{o.user?.email ?? ''}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-white">{o.product?.name ?? '-'}</div>
                        <div className="text-xs text-slate-500">{o.game?.name ?? ''}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-white">{o.target_user_id}</div>
                        <div className="text-xs text-slate-500">x{o.quantity}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-white">{formatRupiah(o.final_amount)}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(o.status)}`}>{o.status}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <div className="text-white">{o.payment_status}</div>
                        <div className="text-xs text-slate-500">{o.payment_method ?? '-'}</div>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <div className="inline-flex flex-wrap justify-end gap-2">
                          <Link href={`/admin/orders/${o.order_number}`}>
                            <Button size="sm" variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">
                              <Eye className="h-3 w-3 mr-1" />
                              Detail
                            </Button>
                          </Link>
                          {o.status === 'pending' && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-500"
                              onClick={() => {
                                router.put(`/admin/orders/${o.order_number}/status`, { status: 'processing' }, { preserveScroll: true });
                              }}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                          )}
                          {o.status !== 'completed' && (
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-500"
                              onClick={() => {
                                router.put(`/admin/orders/${o.order_number}/status`, { status: 'completed' }, { preserveScroll: true });
                              }}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Selesai
                            </Button>
                          )}
                          {o.status !== 'failed' && o.status !== 'completed' && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const ok = window.confirm(`Tandai order ${o.order_number} sebagai gagal?`);
                                if (!ok) return;
                                router.put(`/admin/orders/${o.order_number}/status`, { status: 'failed' }, { preserveScroll: true });
                              }}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Gagal
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {orders.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {orders.links.map((l) => (
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

