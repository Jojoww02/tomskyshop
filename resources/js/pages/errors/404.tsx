import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Button } from '@/components/ui/button';

type NotFoundProps = PageProps<{
  url?: string;
}>;

export default function NotFound() {
  const { url } = usePage<NotFoundProps>().props;

  return (
    <AppLayout breadcrumbs={[{ title: '404', href: url ? `/${url.replace(/^\/+/, '')}` : '/' }]}>
      <Head title="404 - Page Not Found" />

      <div className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/60 p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/10 via-cyan-600/5 to-pink-600/10" />

          <div className="relative">
            <div className="font-orbitron text-7xl font-black tracking-tight text-white md:text-8xl">404</div>
            <div className="mt-3 text-2xl font-semibold text-white">Halaman tidak ditemukan</div>
            <p className="mt-2 max-w-2xl text-slate-400">
              Link yang kamu buka tidak tersedia atau sudah dipindahkan.
            </p>

            {url && (
              <div className="mt-6 inline-flex rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-slate-300">
                {url}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/">
                <Button className="bg-violet-600 hover:bg-violet-500">Kembali ke Home</Button>
              </Link>
              <Button
                type="button"
                variant="outline"
                className="border-slate-700 text-slate-200 hover:bg-slate-800"
                onClick={() => window.history.back()}
              >
                Kembali
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

