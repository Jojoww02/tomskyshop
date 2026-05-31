import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

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
    () => ['#7C3AED', '#06B6D4', '#EC4899', '#22C55E', '#F97316', '#3B82F6', '#A855F7', '#14B8A6', '#EF4444', '#84CC16'],
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
            <h1 className="font-orbitron text-3xl font-bold text-white">Spin Wheel Kupon</h1>
            <div className="mt-1 text-slate-400">
              Order <span className="text-slate-200">{orderNumber}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/orders/${orderNumber}`}>
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer">
                Lihat Order
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer">
                Riwayat
              </Button>
            </Link>
          </div>
        </div>

        {!couponSystemReady && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            Fitur kupon belum aktif di database kamu. Jalankan <span className="font-semibold">php artisan migrate</span> untuk membuat tabel coupons.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-l-[14px] border-r-[14px] border-t-[28px] border-l-transparent border-r-transparent border-t-white/90" />
                    <div
                      ref={wheelRef}
                      className="relative h-80 w-80 rounded-full border border-slate-700 shadow-lg"
                      style={{
                        backgroundImage: gradient,
                        transform: `rotate(${rotation}deg)`,
                        transition: isAnimating ? 'transform 3.2s cubic-bezier(0.15, 0.85, 0.2, 1)' : undefined,
                      }}
                    >
                      {segments.map((s, i) => {
                        const angle = i * segmentAngle + segmentAngle / 2;
                        return (
                          <div
                            key={s.percent}
                            className="pointer-events-none absolute left-1/2 top-1/2"
                            style={{
                              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-120px) rotate(90deg)`,
                            }}
                          >
                            <div className="select-none text-sm font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
                              {s.percent}%
                            </div>
                          </div>
                        );
                      })}

                    </div>
                    <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700 bg-slate-950" />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Button
                      className="h-11 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 cursor-pointer"
                      disabled={!couponSystemReady || Boolean(coupon) || isAnimating}
                      onClick={() => {
                        if (!couponSystemReady || coupon || isAnimating) return;
                        router.post(`/orders/${orderNumber}/wheel`);
                      }}
                    >
                      {coupon ? 'Kupon Sudah Didapatkan' : isAnimating ? 'Memutar...' : 'Spin Sekarang'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="border-slate-800 bg-slate-900/80">
              <CardContent className="p-6">
                <div className="text-lg font-semibold text-white">Hasil</div>

                {coupon ? (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border border-violet-500/40 bg-violet-600/10 p-4">
                      <div className="text-sm text-slate-300">Kupon kamu</div>
                      <div className="mt-1 text-xl font-bold text-white">-{coupon.discount_percent}%</div>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <div className="text-slate-300">{coupon.code}</div>
                        <div className="text-xs text-slate-400">{formatDate(coupon.expires_at) ?? 'Tanpa expiry'}</div>
                      </div>
                    </div>

                    <div className="text-sm text-slate-400">
                      Kupon bisa dipakai di checkout berikutnya pada kolom <span className="text-slate-200">Kode Promo / Kupon</span>.
                    </div>

                    <Link href="/orders">
                      <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer">
                        Lihat Riwayat Order
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-400">
                    Klik “Spin Sekarang” untuk mendapatkan kupon.
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
