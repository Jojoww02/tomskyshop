import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type AdminDashboardProps = PageProps<{
  stats: {
    games: number;
    products: number;
    orders: number;
    users: number;
  };
}>;

export default function AdminDashboard() {
  const { stats } = usePage<AdminDashboardProps>().props;

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Admin', href: '/admin' },
      ]}
    >
      <Head title="Admin Dashboard" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-slate-400">Kelola produk, harga, stock, dan flash sale.</p>
          </div>
          <Link href="/admin/products">
            <Button className="bg-violet-600 hover:bg-violet-500">Kelola Produk</Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-slate-200">Game</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-white">{stats.games}</CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-slate-200">Produk</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-white">{stats.products}</CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-slate-200">Order</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-white">{stats.orders}</CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-slate-200">User</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-white">{stats.users}</CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

