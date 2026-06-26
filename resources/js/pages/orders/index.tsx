import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Paginated<T> {
  data: T[];
  links: PaginationLink[];
  total: number;
}

interface OrderRow {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  final_amount: number;
  created_at: string;
  game: { id: number; name: string; slug: string } | null;
  product: { id: number; name: string; slug: string } | null;
}

type OrdersIndexProps = PageProps<{
  orders: Paginated<OrderRow>;
}>;

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

export default function OrdersIndex() {
  const { orders } = usePage<OrdersIndexProps>().props;

  return (
    <AppLayout breadcrumbs={[{ title: 'Orders', href: '/orders' }]}>
      <Head title="Orders" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <h1 className="font-orbitron text-3xl font-bold text-white">Riwayat Pesanan</h1>
        <p className="mt-1 text-[#8a8f9e]">Riwayat transaksi Anda.</p>

        <div className="mt-6 space-y-3">
          {orders.data.map((o) => (
            <Link key={o.id} href={`/orders/${o.order_number}`} className="block">
              <Card className="border-[#2a2d39] bg-[#232631]/80 transition hover:border-blue-500/40">
                <CardContent className="flex flex-col gap-2 p-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm text-[#8a8f9e]">{o.order_number}</div>
                    <div className="text-lg font-semibold text-white">{o.game?.name ?? '-'}</div>
                    <div className="text-sm text-[#8a8f9e]">{o.product?.name ?? '-'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{formatRupiah(o.final_amount)}</div>
                    <div className="mt-1 flex items-center justify-end gap-2 text-xs">
                      <span className="rounded-full bg-[#2a2d39] px-2 py-0.5 text-white">{o.status}</span>
                      <span className="rounded-full bg-[#2a2d39] px-2 py-0.5 text-white">{o.payment_status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

