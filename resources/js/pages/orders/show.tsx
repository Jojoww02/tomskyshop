import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OrderDetail {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  target_user_id: string;
  quantity: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  created_at: string;
  paid_at: string | null;
  game: { id: number; name: string; slug: string } | null;
  product: { id: number; name: string; slug: string } | null;
  payment: {
    id: number;
    status: string;
    payment_number: string | null;
    payment_reference: string | null;
    amount: number;
    paid_at: string | null;
  } | null;
}

type OrderShowProps = PageProps<{ order: OrderDetail }>;

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function OrderShow() {
  const { order } = usePage<OrderShowProps>().props;

  return (
    <AppLayout breadcrumbs={[{ title: 'Orders', href: '/orders' }, { title: order.order_number, href: `/orders/${order.order_number}` }]}>
      <Head title={`Order ${order.order_number}`} />

      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-white">{order.order_number}</h1>
            <p className="mt-1 text-slate-400">{order.game?.name ?? '-'}</p>
          </div>
          <Link href="/orders">
            <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800">Kembali</Button>
          </Link>
        </div>

        <div className="space-y-4">
          <Card className="border-slate-800 bg-slate-900/80">
            <CardContent className="p-6 text-slate-200">
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-800 px-2 py-0.5">{order.status}</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5">{order.payment_status}</span>
                {order.payment_method && <span className="rounded-full bg-slate-800 px-2 py-0.5">{order.payment_method}</span>}
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-400">Produk</div>
                  <div className="font-semibold text-white">{order.product?.name ?? '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Target User ID</div>
                  <div className="font-semibold text-white">{order.target_user_id}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Total</div>
                  <div className="font-semibold text-white">{formatRupiah(order.total_amount)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Final</div>
                  <div className="font-semibold text-white">{formatRupiah(order.final_amount)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.payment && (
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6 text-slate-200">
                <div className="text-sm font-semibold text-white">Pembayaran</div>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Status</span>
                    <span>{order.payment.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Nominal</span>
                    <span>{formatRupiah(order.payment.amount)}</span>
                  </div>
                  {order.payment.payment_number && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Nomor</span>
                      <span>{order.payment.payment_number}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

