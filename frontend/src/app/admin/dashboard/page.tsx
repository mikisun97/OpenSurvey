'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserInfo, isAdmin, logout } from '@/lib/auth';
import { UserInfo } from '@/types';
import { 
  Users, 
  FileText, 
  Settings, 
  BarChart3, 
  LogOut,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getUserInfo();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!isAdmin()) {
      router.push('/surveys');
      return;
    }

    setUserInfo(user);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              {/* 공주시 스타일 로고 */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">O</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">OpenSurvey 관리자</h1>
                  <p className="text-xs text-gray-600">다정공감 설문조사</p>
                </div>
              </div>
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {userInfo?.authorityNm || '관리자'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <User className="inline w-4 h-4 mr-1" />
                {userInfo?.userNm} ({userInfo?.userId})
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-orange-200 text-orange-700 hover:bg-orange-50">
                <LogOut className="w-4 h-4 mr-2" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 환영 메시지 */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            관리자 대시보드에 오신 것을 환영합니다
          </h2>
          <p className="text-gray-600">
            설문조사 시스템을 관리하고 모니터링하세요.
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">활성 설문</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
              <p className="text-xs text-muted-foreground">
                +12.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">응답률</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89.2%</div>
              <p className="text-xs text-muted-foreground">
                +5.4% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">이번 달 응답</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                +18.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 관리 메뉴 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => router.push('/admin/cms/common-code')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                공통코드 관리
              </CardTitle>
              <CardDescription>
                시스템에서 사용되는 공통코드를 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                코드 그룹, 세부코드 등록 및 수정
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push('/admin/cms/users')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                사용자 관리
              </CardTitle>
              <CardDescription>
                시스템 사용자 계정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                사용자 등록, 권한 관리, 계정 상태 관리
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push('/admin/cms/surveys')}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                설문 관리
              </CardTitle>
              <CardDescription>
                설문조사를 생성하고 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                설문 생성, 수정, 결과 분석
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                통계 분석
              </CardTitle>
              <CardDescription>
                설문 결과를 분석하고 리포트를 생성합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                응답 통계, 트렌드 분석, 리포트 생성
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                일정 관리
              </CardTitle>
              <CardDescription>
                설문 일정과 마감일을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                설문 시작/종료 일정, 알림 설정
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                시스템 설정
              </CardTitle>
              <CardDescription>
                시스템 전반적인 설정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                기본 설정, 보안 설정, 백업 관리
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 