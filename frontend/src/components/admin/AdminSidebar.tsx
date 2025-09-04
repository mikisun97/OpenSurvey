'use client';

import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Database, 
  FileText, 
  Users, 
  BarChart3,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuGroup {
  id: string;
  label: string;
  items: MenuItem[];
}

interface AdminSidebarProps {
  menuGroups: MenuGroup[];
}

export default function AdminSidebar({ menuGroups }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className="fixed left-0 top-16 w-72 bg-white border-r border-gray-200 h-screen overflow-y-auto z-40">
      <div className="p-4 pt-6">
        {menuGroups.map((group) => (
          <div key={group.id} className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              {group.label}
            </h3>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isItemActive = isActive(item.href);
                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "group flex items-center w-full px-3 py-2 text-base font-medium rounded-md transition-colors",
                      "min-h-[40px]",
                      isItemActive
                        ? "bg-orange-100 text-orange-600"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    )}
                    title={item.label}
                  >
                    <item.icon 
                      className={cn(
                        "w-4 h-4 mr-3 flex-shrink-0",
                        isItemActive ? "text-orange-600" : "text-gray-400 group-hover:text-gray-500"
                      )} 
                    />
                    <span className="truncate group-hover:overflow-visible group-hover:whitespace-normal">
                      {item.label}
                    </span>
                    {isItemActive && (
                      <ChevronRight className="w-4 h-4 ml-auto text-orange-600" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
} 