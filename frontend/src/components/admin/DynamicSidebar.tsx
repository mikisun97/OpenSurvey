'use client';

import { usePathname } from 'next/navigation';
import SystemManagementSidebar from './SystemManagementSidebar';
import HomepageManagementSidebar from './HomepageManagementSidebar';

export default function DynamicSidebar() {
  const pathname = usePathname();

  // 홈페이지관리 페이지들
  const isHomepageManagement = 
    pathname.includes('/admin/cms/board/BBSMSTR_000005') || // 카드뉴스
    pathname.includes('/admin/cms/board/BBSMSTR_000006');   // 공주뉴스

  // 시스템관리 페이지들
  const isSystemManagement = 
    pathname.includes('/admin/cms/board/BBSMSTR_000001') || // 공지사항
    pathname.includes('/admin/cms/common-code') || // 시스템코드
    pathname.includes('/admin/cms/board-master'); // 게시판관리

  // 기본값은 시스템관리
  if (isHomepageManagement) {
    return <HomepageManagementSidebar />;
  }

  return <SystemManagementSidebar />;
}
