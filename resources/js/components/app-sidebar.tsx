import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Package, ReceiptText, Shield } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const page = usePage<Partial<SharedData>>();
    const auth = page.props.auth ?? { user: null };
    const isAdmin = Boolean(auth.user?.is_admin || auth.user?.role === 'admin');

    const mainNavItems: NavItem[] = [
        ...(isAdmin
            ? [
                  { title: 'Admin', url: '/admin', icon: Shield },
                  { title: 'Produk', url: '/admin/products', icon: Package },
                  { title: 'Orders', url: '/admin/orders', icon: ReceiptText },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
        </Sidebar>
    );
}
