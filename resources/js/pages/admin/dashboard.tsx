import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts';
import {
  Package,
  Gamepad2,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  Activity,
} from 'lucide-react';

interface DailyDataPoint {
  date: string;
  orders: number;
  sales: number;
}

interface OrdersByStatus {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
}

type AdminDashboardProps = PageProps<{
  stats: {
    games: number;
    products: number;
    orders: number;
    users: number;
    activeUsers: number;
    totalSales: number;
    pendingOrders: number;
  };
  dailyData: DailyDataPoint[];
  ordersByStatus: OrdersByStatus;
}>;

const STATUS_COLORS = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  completed: '#10b981',
  failed: '#ef4444',
  cancelled: '#6b7280',
};

export default function AdminDashboard() {
  const { stats, dailyData, ordersByStatus } = usePage<AdminDashboardProps>().props;

  const statusChartData = Object.entries(ordersByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    status,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Admin', href: '/admin' },
      ]}
    >
      <Head title="Admin Dashboard" />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-orbitron text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-slate-400">Kelola dan monitor aplikasi TomSkyShop.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/orders">
              <Button variant="secondary" className="bg-slate-800 hover:bg-slate-700 cursor-pointer">
                Lihat Orders
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] cursor-pointer">Kelola Produk</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Games</CardTitle>
              <Gamepad2 className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.games}</div>
              <p className="text-xs text-slate-500 mt-1">Game yang tersedia</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.products}</div>
              <p className="text-xs text-slate-500 mt-1">Produk aktif</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.orders}</div>
              <p className="text-xs text-slate-500 mt-1">{stats.pendingOrders} menunggu diproses</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/80 hover:bg-slate-900 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
              <p className="text-xs text-slate-500 mt-1">Online dalam 5 menit</p>
            </CardContent>
          </Card>
        </div>

        {/* Total Sales Card */}
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-white">Total Penjualan</CardTitle>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-400">{formatCurrency(stats.totalSales)}</div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Daily Sales & Orders Line Chart */}
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-white">Penjualan & Order Harian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      name="Penjualan"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      name="Orders"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Orders by Status Bar Chart */}
          <Card className="border-slate-800 bg-slate-900/80">
            <CardHeader>
              <CardTitle className="text-white">Status Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

