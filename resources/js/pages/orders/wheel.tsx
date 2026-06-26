import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Gift, ArrowLeft, History, ShoppingBag, Sparkles } from 'lucide-react';

type OrdersWheelPageProps = PageProps<{
  orderNumber: string;
  segments: { percent: number }[];
  couponSystemReady: boolean;
  coupon: { code: string; discount_percent: number; expires_at: string | null } | null;
  spinResult: { segmentIndex: number | null; discount_percent: number; code: string } | null;
}>;

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return date.toLocaleString('id-ID');
}

export default function OrdersWheel() {
  const { orderNumber, segments, couponSystemReady, coupon, spinResult } = usePage<OrdersWheelPageProps>().props;
  const segmentAngle = 360 / segments.length;
  const wheelRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const colors = useMemo(
    () => ['#1E40AF', '#3B82F6', '#60A5FA', '#2563EB', '#0EA5E9', '#06B6D4', '#0891B2', '#0E7490', '#1E3A8A', '#3730A3'],
    [],
  );

  const gradient = useMemo(() => {
    const parts: string[] = [];
    segments.forEach((s, i) => {
      const start = i * segmentAngle;
      const end = (i + 1) * segmentAngle;
      parts.push(`${colors[i % colors.length]} ${start}deg ${end}deg`);
    });
    return `conic-gradient(from -90deg, ${parts.join(', ')})`;
  }, [colors, segments, segmentAngle]);

  useEffect(() => {
    if (!spinResult || spinResult.segmentIndex === null) return;

    const targetAngle = spinResult.segmentIndex * segmentAngle + segmentAngle / 2;
    const spins = 6;
    const next = spins * 360 - targetAngle;
    setIsAnimating(true);
    setRotation(next);
  }, [segmentAngle, spinResult]);

  useEffect(() => {
    const el = wheelRef.current;
    if (!el) return;

    const onEnd = () => setIsAnimating(false);
    el.addEventListener('transitionend', onEnd);
    return () => el.removeEventListener('transitionend', onEnd);
  }, []);

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Orders', href: '/orders' },
        { title: 'Spin Wheel', href: `/orders/${orderNumber}/wheel` },
      ]}
    >
      <Head title="Spin Wheel - TomSkyShop" />

      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-white flex items-center gap-3">
              <Gift className="h-8 w-8 text-blue-400" />
              Spin Wheel Kupon
            </h1>
            <div className="mt-2 text-slate-400 text-lg">
              Order <span className="text-slate-200 font-semibold">{orderNumber}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/orders/${orderNumber}`}>
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Lihat Order
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer">
                <History className="h-4 w-4 mr-2" />
                Riwayat
              </Button>
            </Link>
          </div>
        </div>

        {!couponSystemReady && (
          <div className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm text-amber-200 flex items-start gap-3">
            <Sparkles className="h-6 w-6 flex-shrink-0" />
            <div>
              <div className="font-bold text-amber-300 text-lg">Fitur Kupon Belum Aktif</div>
              Jalankan <span className="font-semibold bg-amber-500/20 px-2 py-1 rounded">php artisan migrate</span> untuk membuat tabel coupons.
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="border-slate-800 bg-slate-900/80 rounded-3xl overflow-hidden shadow-2xl">
              <CardContent className="p-10">
                <div className="flex flex-col items-center gap-10">
                  <div className="relative">
                    <div className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-l-[18px] border-r-[18px] border-t-[36px] border-l-transparent border-r-transparent border-t-blue-400 drop-shadow-lg" />
                    <div
                      ref={wheelRef}
                      className="relative h-96 w-96 rounded-full border-4 border-slate-700 shadow-2xl shadow-blue-500/20"
                      style={{
                        backgroundImage: gradient,
                        transform: `rotate(${rotation}deg)`,
                        transition: isAnimating ? 'transform 4s cubic-bezier(0.15, 0.85, 0.2, 1)' : undefined,
                      }}
                    >
                      {segments.map((s, i) => {
                        const angle = i * segmentAngle + segmentAngle / 2;
                        return (
                          <div
                            key={s.percent}
                            className="pointer-events-none absolute left-1/2 top-1/2"
                            style={{
                              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-140px) rotate(90deg)`,
                            }}
                          >
                            <div className="select-none text-lg font-black text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.7)]">
                              {s.percent}%
                            </div>
                          </div>
                        );
                      })}

                    </div>
                    <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-700 bg-slate-950 flex items-center justify-center shadow-inner">
                      <Gift className="h-8 w-8 text-blue-400" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <Button
                      className="h-14 px-10 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 cursor-pointer text-lg font-bold shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50"
                      disabled={!couponSystemReady || Boolean(coupon) || isAnimating}
                      onClick={() => {
                        if (!couponSystemReady || coupon || isAnimating) return;
                        router.post(`/orders/${orderNumber}/wheel`);
                      }}
                    >
                      {coupon ? (
                        <span className="flex items-center gap-2">
                          <Gift className="h-5 w-5" />
                          Kupon Sudah Didapatkan
                        </span>
                      ) : isAnimating ? (
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 animate-spin" />
                          Memutar...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Spin Sekarang
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-slate-800 bg-slate-900/80 rounded-3xl overflow-hidden shadow-2xl">
              <CardContent className="p-8">
                <div className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <ShoppingBag className="h-7 w-7 text-blue-400" />
                  Hasil
                </div>

                {coupon ? (
                  <div className="mt-4 space-y-6">
                    <div className="rounded-2xl border border-blue-500/40 bg-gradient-to-br from-blue-600/20 to-blue-700/10 p-6 shadow-lg shadow-blue-500/20">
                      <div className="text-sm text-slate-300 mb-3">Kupon kamu</div>
                      <div className="text-4xl font-black text-white mb-2">-{coupon.discount_percent}%</div>
                      <div className="flex items-center justify-between text-sm pt-4 border-t border-blue-500/30">
                        <div className="text-slate-200 font-bold text-lg">{coupon.code}</div>
                        <div className="text-xs text-slate-400">{formatDate(coupon.expires_at) ?? 'Tanpa expiry'}</div>
                      </div>
                    </div>

                    <div className="text-base text-slate-400 leading-relaxed">
                      Kupon bisa dipakai di checkout berikutnya pada kolom <span className="text-slate-200 font-semibold">Kode Promo / Kupon</span>.
                    </div>

                    <Link href="/orders">
                      <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer py-6 text-lg">
                        <History className="h-5 w-5 mr-2" />
                        Lihat Riwayat Order
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-base text-slate-400">
                    Klik “Spin Sekarang” untuk mendapatkan kupon!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
