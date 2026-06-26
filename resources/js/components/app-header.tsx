import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { History, LayoutGrid, Search } from 'lucide-react';
import AppLogo from './app-logo';

const adminNavItems: NavItem[] = [
  {
    title: 'Admin',
    url: '/admin',
    icon: LayoutGrid,
  },
  {
    title: 'Produk',
    url: '/admin/products',
  },
  {
    title: 'Orders',
    url: '/admin/orders',
  },
];

const userNavItems: NavItem[] = [
  {
    title: 'Riwayat',
    url: '/orders',
    icon: History,
  },
];

const activeItemStyles = 'text-white bg-slate-800';

interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
  const page = usePage<SharedData>();
  const { auth } = page.props;
  const getInitials = useInitials();
  const user = auth?.user ?? null;
  const isAdmin = Boolean(user?.is_admin || user?.role === 'admin');

  const visibleMainNavItems = user ? (isAdmin ? adminNavItems : userNavItems) : [];
  return (
    <>
      <div className="border-slate-800 border-b bg-[#1a1c23]/95 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
          <Link href={user && isAdmin ? '/admin' : '/'} prefetch className="flex items-center space-x-3">
            <AppLogo />
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="ml-8 hidden h-full items-center space-x-4 lg:flex">
              <NavigationMenu className="flex h-full items-stretch">
                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                {visibleMainNavItems.map((item, index) => (
                  <NavigationMenuItem key={index} className="relative flex h-full items-center">
                    <Link
                      href={item.url}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        page.url.startsWith(item.url) && activeItemStyles,
                        'h-9 cursor-pointer px-4 text-slate-200 hover:text-white hover:bg-slate-800',
                      )}
                    >
                      {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                      {item.title}
                    </Link>
                    {page.url.startsWith(item.url) && (
                      <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-gradient-to-r from-[#1e40af] to-[#3b82f6]"></div>
                    )}
                  </NavigationMenuItem>
                ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          )}

          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                    <Avatar className="h-8 w-8 overflow-hidden rounded-full border-2 border-slate-700">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-[#1e40af] to-[#3b82f6] text-white">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 border-slate-700 bg-slate-900" align="end">
                  <UserMenuContent user={user} />
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="h-9 px-4 cursor-pointer text-slate-200 hover:text-white hover:bg-slate-800">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="h-9 px-5 cursor-pointer bg-gradient-to-r from-[#1e40af] to-[#3b82f6] hover:from-[#3b82f6] hover:to-[#60a5fa] text-white">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {breadcrumbs.length > 1 && (
        <div className="border-slate-800 border-b bg-[#1a1c23]/50">
          <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-slate-400 md:max-w-7xl">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
        </div>
      )}
    </>
  );
}
