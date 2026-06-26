import { Link } from '@inertiajs/react';
import TomSkyShopLogo from '../../../assets/Tomskyshop_logo.png';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="bg-[#1a1c23] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-16 w-16 items-center justify-center rounded-full overflow-hidden bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-1">
                                <img src={TomSkyShopLogo} alt="TomSkyShop" className="h-full w-full object-cover rounded-full" />
                            </div>
                            <span className="text-xl font-bold text-white font-orbitron">TOMSKYSHOP</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
