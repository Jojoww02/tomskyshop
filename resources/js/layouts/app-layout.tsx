import AppHeaderLayoutTemplate from '@/layouts/app/app-header-layout';
import AppSidebarLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const page = usePage();
    const isAdminArea = page.url.startsWith('/admin');

    const Layout = isAdminArea ? AppSidebarLayoutTemplate : AppHeaderLayoutTemplate;

    return (
        <Layout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </Layout>
    );
}
