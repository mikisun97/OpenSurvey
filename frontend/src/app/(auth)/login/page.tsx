'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authAPI } from '@/lib/api';
import { saveLoginInfo, setToken } from '@/lib/auth';
import { LoginRequest, LoginResponse, EmplyrInfo } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginRequest>({
    userId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('로그인 요청:', formData);
      const response = await authAPI.login(formData);
      const loginResponse: LoginResponse = response.data.data;
      console.log('로그인 응답:', loginResponse);
      
      // 토큰 저장
      setToken(loginResponse.accessToken);
      console.log('토큰 저장 완료:', loginResponse.accessToken);
      
      // 업무사용자 정보 조회
      console.log('업무사용자 정보 조회 시작');
      const userResponse = await authAPI.me();
      console.log('업무사용자 정보 응답:', userResponse);
      const emplyrInfo: EmplyrInfo = userResponse.data.data;
      
      // 로그인 정보 저장
      saveLoginInfo(loginResponse, emplyrInfo);
      console.log('로그인 정보 저장 완료');
      
      // 업무사용자 상태 확인
      if (emplyrInfo.emplyrSttusCode !== 'A') {
        const statusMessage = getStatusMessage(emplyrInfo.emplyrSttusCode);
        setError(`로그인이 불가능한 상태입니다: ${statusMessage}`);
        return;
      }
      
      // 권한에 따른 리다이렉트
      if (['ROLE_ADMIN', 'SYSTEM_ADMIN', 'SUPER_ADMIN', 'STAFF_ADMIN'].includes(loginResponse.authorityCode)) {
        console.log('관리자 권한 확인됨, 게시판 마스터로 이동');
        router.push('/admin/cms/board-master');
      } else {
        console.log('일반 사용자 권한, 설문 페이지로 이동');
        router.push('/surveys');
      }
    } catch (err: unknown) {
      console.error('로그인 오류:', err);
      const errorMessage = err && typeof err === 'object' && 'response' in err 
        ? (err as { response?: { data?: { resultMessage?: string } } }).response?.data?.resultMessage || '로그인에 실패했습니다.'
        : '로그인에 실패했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 업무사용자 상태 메시지 반환
  const getStatusMessage = (emplyrSttusCode: string): string => {
    switch (emplyrSttusCode) {
      case 'P': return '가입 승인 대기 중';
      case 'D': return '사용 중지됨';
      default: return '알 수 없는 상태';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">로그인</CardTitle>
          <CardDescription className="text-center">
            OpenSurvey 관리시스템에 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">업무사용자 ID</Label>
              <Input
                id="userId"
                name="userId"
                type="text"
                placeholder="업무사용자 ID를 입력하세요"
                value={formData.userId}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>테스트 계정: ID: admin / PW: password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 