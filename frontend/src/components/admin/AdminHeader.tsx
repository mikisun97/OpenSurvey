'use client';

import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getEmplyrInfo, logout } from '@/lib/auth';
import { EmplyrInfo } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({ 
  title = "다정공감 공주 관리페이지", 
  subtitle = "OpenSurvey 시스템관리" 
}: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userInfo, setUserInfo] = useState<EmplyrInfo | null>(null);

  useEffect(() => {
    const emplyrInfo = getEmplyrInfo();
    setUserInfo(emplyrInfo);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleHomepageManagement = () => {
    router.push('/admin/cms/board/BBSMSTR_000005'); // 카드뉴스 페이지로 이동
  };

  const handleSystemManagement = () => {
    router.push('/admin/cms/board/BBSMSTR_000001'); // 공지사항 페이지로 이동
  };

  const isHomepageActive = pathname.includes('/admin/cms/board/BBSMSTR_000005');
  const isSystemActive = pathname.includes('/admin/cms/board/BBSMSTR_000001') || 
                        pathname.includes('/admin/cms/common-code') || 
                        pathname.includes('/admin/cms/board-master');
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b">
      <div className="flex">
        {/* 왼쪽 로고 영역 - 사이드바와 같은 너비 */}
        <div className="w-72 bg-white border-r border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
              <p className="text-xs text-gray-600 truncate">{subtitle}</p>
            </div>
          </div>
        </div>
        
        {/* 오른쪽 네비게이션 영역 */}
        <div className="flex-1 flex justify-between items-center px-8 py-2">
          <nav className="flex space-x-6">
            <button 
              onClick={handleHomepageManagement}
              className={`px-3 py-2 text-base transition-colors ${
                isHomepageActive 
                  ? 'font-medium text-orange-600 border-b-2 border-orange-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              홈페이지관리
            </button>
            <button 
              onClick={handleSystemManagement}
              className={`px-3 py-2 text-base transition-colors ${
                isSystemActive 
                  ? 'font-medium text-orange-600 border-b-2 border-orange-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              시스템관리
            </button>
          </nav>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 px-2 py-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">
                      {userInfo?.userNm || '사용자'}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {userInfo?.userNm || '사용자'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {userInfo?.emailAdres || userInfo?.emplyrId || ''}
                  </div>
                </div>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  내 정보
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
} 