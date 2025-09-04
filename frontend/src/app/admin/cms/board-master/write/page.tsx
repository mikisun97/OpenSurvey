'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemManagementSidebar from '@/components/admin/SystemManagementSidebar';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { bbsAPI, commonCodeAPI } from '@/lib/api';
import { UserInfo } from '@/types';
import { useCreateBbsMst } from '@/hooks/useApi';
import { Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// 유효성 검사 스키마 정의
const boardMasterFormSchema = z.object({
  bbsId: z.string().min(1, '게시판 ID를 입력해주세요.').max(20, '게시판 ID는 20자 이하로 입력해주세요.'),
  bbsNm: z.string().min(1, '게시판명을 입력해주세요.').max(50, '게시판명은 50자 이하로 입력해주세요.'),
  bbsIntrcn: z.string().optional(),
  bbsTyCode: z.string().min(1, '게시판 유형을 선택해주세요.'),
  replyPosblAt: z.enum(['Y', 'N']),
  fileAtchPosblAt: z.enum(['Y', 'N']),
  useAt: z.enum(['Y', 'N']),
  categoryCodeId: z.string().optional(),
  
  // 이미지 관련 설정
  representImageUseAt: z.enum(['Y', 'N']),
  representImageWidth: z.number().optional(),
  representImageHeight: z.number().optional(),
  mainImageUseAt: z.enum(['Y', 'N']),
  mainImageWidth: z.number().optional(),
  mainImageHeight: z.number().optional(),
  multiImageUseAt: z.enum(['Y', 'N']),
  multiImageDisplayName: z.string().optional(),
  multiImageMaxCount: z.number().optional(),
  multiImageWidth: z.number().optional(),
  multiImageHeight: z.number().optional(),
});

type FormData = z.infer<typeof boardMasterFormSchema>;

export default function BoardMasterWritePage() {
  const router = useRouter();
  const createBbsMstMutation = useCreateBbsMst();
  
  // React Hook Form 설정
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(boardMasterFormSchema),
    defaultValues: {
      bbsId: '',
      bbsNm: '',
      bbsIntrcn: '',
      bbsTyCode: 'BBST01',
      replyPosblAt: 'Y' as const,
      fileAtchPosblAt: 'Y' as const,
      useAt: 'Y' as const,
      categoryCodeId: undefined,
      
      // 이미지 관련 설정 초기값
      representImageUseAt: 'N' as const,
      representImageWidth: undefined,
      representImageHeight: undefined,
      mainImageUseAt: 'N' as const,
      mainImageWidth: undefined,
      mainImageHeight: undefined,
      multiImageUseAt: 'N' as const,
      multiImageDisplayName: '이미지',
      multiImageMaxCount: undefined,
      multiImageWidth: undefined,
      multiImageHeight: undefined
    }
  });

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [boardTypeCodes, setBoardTypeCodes] = useState<Array<{code: string, codeNm: string}>>([]);
  const [categoryCodes, setCategoryCodes] = useState<Array<{value: string | null, label: string}>>([]);

  // 사용자 정보 확인
  useEffect(() => {
    const checkAuth = async () => {
      const user = getUserInfo();
      if (!user || !isAdmin()) {
        router.push('/login');
        return;
      }
      setUserInfo(user);
    };
    checkAuth();
  }, [router]);

  // 게시판 타입 코드와 구분 코드 로드
  useEffect(() => {
    if (userInfo) {
      loadBoardTypeCodes();
      loadCategoryCodes();
    }
  }, [userInfo]);

  // 구분 코드 로드
  const loadCategoryCodes = async () => {
    try {
      console.log('🚨 === 구분 코드 로드 시작 ===');
      const response = await bbsAPI.getCategoryCodes();
      console.log('🚨 구분 코드 API 응답:', response);
      
      if (response.data && response.data.resultCode === 'SUCCESS') {
        const codes = response.data.data || [];
        console.log('🚨 로드된 구분 코드들:', codes);
        setCategoryCodes(codes);
      } else {
        console.error('🚨 구분 코드 로드 실패:', response.data);
        toast.error('구분 코드를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('🚨 구분 코드 로드 중 오류 발생:', error);
      toast.error('구분 코드를 불러오는 중 오류가 발생했습니다.');
    }
  };

  // 게시판 타입 코드 로드
  const loadBoardTypeCodes = async () => {
    try {
      console.log('🚨 === 게시판 타입 코드 로드 시작 ===');
      console.log('🚨 요청 URL: COM030');
      console.log('🚨 commonCodeAPI 객체:', commonCodeAPI);
      console.log('🚨 getDetailList 메서드:', commonCodeAPI.getDetailList);
      
      console.log('🚨 API 호출 직전...');
      const response = await commonCodeAPI.getDetailList('BBST');
      console.log('🚨 API 호출 완료!');
      console.log('🚨 API 응답 전체:', response);
      console.log('🚨 응답 상태:', response.status, response.statusText);
      console.log('🚨 응답 헤더:', response.headers);
      console.log('🚨 응답 데이터:', response.data);
      console.log('🚨 응답 데이터 타입:', typeof response.data);
      console.log('🚨 응답 데이터 키들:', Object.keys(response.data || {}));
      
      if (response.data && response.data.resultCode === 'SUCCESS') {
        const codes = response.data.data || [];
        console.log('🚨 로드된 게시판 타입 코드들:', codes);
        console.log('🚨 코드 개수:', codes.length);
        console.log('🚨 각 코드 상세:');
        codes.forEach((code: {code: string, codeNm: string}, index: number) => {
          console.log(`🚨   ${index + 1}. code: "${code.code}", codeNm: "${code.codeNm}"`);
        });
        setBoardTypeCodes(codes);
        console.log('🚨 boardTypeCodes 상태 업데이트 완료');
      } else {
        console.error('🚨 API 응답 실패!');
        console.error('🚨 resultCode:', response.data?.resultCode);
        console.error('🚨 resultMessage:', response.data?.resultMessage);
        console.error('🚨 전체 응답:', response.data);
      }
    } catch (error: unknown) {
      console.error('🚨 게시판 타입 코드 로드 실패!');
      console.error('🚨 에러 타입:', typeof error);
      if (error instanceof Error) {
        console.error('🚨 에러 메시지:', error.message);
        console.error('🚨 에러 스택:', error.stack);
      }
      console.error('🚨 에러 전체:', error);
    }
  };

  const handleSave = async (data: FormData) => {
    try {
      setSaving(true);
      
      const createData = {
        bbsId: data.bbsId.trim(),
        bbsNm: data.bbsNm,
        bbsIntrcn: data.bbsIntrcn || '', // null 방지
        bbsTyCode: data.bbsTyCode || 'BBST01', // null 방지
        bbsAttrbCode: 'BBSA01', // 기본값 추가
        replyPosblAt: data.replyPosblAt || 'Y', // null 방지
        fileAtchPosblAt: data.fileAtchPosblAt || 'Y', // null 방지
        atchPosblFileNumber: 5, // 기본값 추가
        atchPosblFileSize: 5242880, // 기본값 추가 (5MB)
        useAt: data.useAt || 'Y', // null 방지
        tmplatId: '', // 기본값 추가
        categoryCodeId: data.categoryCodeId || undefined, // null을 undefined로 변환
        frstRegisterId: 'admin', // 최초등록자ID 추가
        lastUpdusrId: 'admin', // 최종수정자ID 추가
        
        // 이미지 관련 설정
        representImageUseAt: data.representImageUseAt || 'N',
        representImageWidth: data.representImageWidth || undefined,
        representImageHeight: data.representImageHeight || undefined,
        mainImageUseAt: data.mainImageUseAt || 'N',
        mainImageWidth: data.mainImageWidth || undefined,
        mainImageHeight: data.mainImageHeight || undefined,
        multiImageUseAt: data.multiImageUseAt || 'N',
        multiImageDisplayName: data.multiImageDisplayName || '이미지',
        multiImageMaxCount: data.multiImageMaxCount || undefined,
        multiImageWidth: data.multiImageWidth || undefined,
        multiImageHeight: data.multiImageHeight || undefined
      };

      console.log('게시판 생성 요청 데이터:', JSON.stringify(createData, null, 2));
      
      // useCreateBbsMst 훅 사용 (자동으로 캐시 무효화됨)
      const response = await createBbsMstMutation.mutateAsync(createData);
      
      console.log('게시판 생성 응답:', response);
      
      // 응답 구조 확인 및 처리
      if (response && response.resultCode === 'SUCCESS') {
        toast.success('게시판이 생성되었습니다.');
        router.push('/admin/cms/board-master');
      } else {
        console.error('게시판 생성 실패 - 응답:', response);
        toast.error(`게시판 생성에 실패했습니다: ${response?.resultMessage || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('게시판 생성 실패:', error);
      const axiosError = error as { response?: { data?: { resultMessage?: string } }; message?: string };
      if (axiosError.response) {
        console.error('에러 응답:', axiosError.response.data);
        toast.error(`게시판 생성 중 오류가 발생했습니다: ${axiosError.response.data?.resultMessage || axiosError.message || '알 수 없는 오류'}`);
      } else {
        toast.error('게시판 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex pt-16">
        <SystemManagementSidebar />
        <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)] flex flex-col">
          {/* 상단 헤더 - 목록 페이지와 동일한 스타일 */}
          <div className="bg-white border-b border-gray-300 flex-shrink-0">
            {/* 타이틀 부분 */}
            <div className="px-8 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">게시판 설정 등록</h1>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin/cms/board-master')}
                    className="text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    목록으로
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-8 py-8 flex-1 overflow-y-auto">
            {/* 편집 폼 */}
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {/* 카드 내용 */}
              <div className="p-6">
                <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
                  {/* 게시판 ID */}
                  <div className="space-y-2">
                    <Label htmlFor="bbsId" className="block text-sm font-medium text-gray-700">
                      게시판 ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bbsId"
                      {...register('bbsId')}
                      placeholder="예: NOTICE, NEWS, FAQ 등"
                      className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.bbsId && (
                      <p className="text-sm text-red-500">{errors.bbsId.message}</p>
                    )}
                    <p className="text-xs text-gray-500">영문 대문자와 숫자만 사용 가능합니다.</p>
                  </div>

                  {/* 게시판명 */}
                  <div className="space-y-2">
                    <Label htmlFor="bbsNm" className="block text-sm font-medium text-gray-700">
                      게시판명 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="bbsNm"
                      {...register('bbsNm')}
                      placeholder="게시판명을 입력해 주세요."
                      className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {errors.bbsNm && (
                      <p className="text-sm text-red-500">{errors.bbsNm.message}</p>
                    )}
                  </div>

                  {/* 게시판 소개 */}
                  <div className="space-y-2">
                    <Label htmlFor="bbsIntrcn" className="block text-sm font-medium text-gray-700">
                      게시판 소개
                    </Label>
                    <Textarea
                      id="bbsIntrcn"
                      {...register('bbsIntrcn')}
                      placeholder="게시판에 대한 소개를 입력해 주세요."
                      className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>

                  {/* 게시판 타입과 답글 허용 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="bbsTyCode" className="block text-sm font-medium text-gray-700">
                        게시판 타입
                      </Label>
                      <Select value={watch('bbsTyCode')} onValueChange={(value: string) => setValue('bbsTyCode', value)}>
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue placeholder="게시판 타입을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {boardTypeCodes.length === 0 ? (
                            <SelectItem value="loading" disabled className="text-sm text-gray-400">
                              로딩 중... ({boardTypeCodes.length}개)
                            </SelectItem>
                          ) : (
                            boardTypeCodes.map((type) => (
                              <SelectItem key={type.code} value={type.code} className="text-sm">
                                {type.codeNm} ({type.code})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-sm font-medium text-gray-700">
                        답글 허용
                      </Label>
                      <RadioGroup 
                        value={watch('replyPosblAt')} 
                        onValueChange={(value: string) => setValue('replyPosblAt', value as 'Y' | 'N')}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Y" id="reply-y" className="w-5 h-5" />
                          <Label htmlFor="reply-y" className="text-sm">허용</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="N" id="reply-n" className="w-5 h-5" />
                          <Label htmlFor="reply-n" className="text-sm">불허용</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* 파일 첨부와 사용여부 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="block text-sm font-medium text-gray-700">
                        파일 첨부
                      </Label>
                      <RadioGroup 
                        value={watch('fileAtchPosblAt')} 
                        onValueChange={(value: string) => setValue('fileAtchPosblAt', value as 'Y' | 'N')}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Y" id="file-y" className="w-5 h-5" />
                          <Label htmlFor="file-y" className="text-sm">허용</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="N" id="file-n" className="w-5 h-5" />
                          <Label htmlFor="file-n" className="text-sm">불허용</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label className="block text-sm font-medium text-gray-700">
                        사용여부 <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup 
                        value={watch('useAt')} 
                        onValueChange={(value: string) => setValue('useAt', value as 'Y' | 'N')}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Y" id="use-y" className="w-5 h-5" />
                          <Label htmlFor="use-y" className="text-sm">사용</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="N" id="use-n" className="w-5 h-5" />
                          <Label htmlFor="use-n" className="text-sm">미사용</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* 구분 사용 설정 */}
                  <div className="space-y-2">
                    <Label htmlFor="categoryCodeId" className="block text-sm font-medium text-gray-700">
                      구분사용여부
                    </Label>
                    <Select 
                      value={watch('categoryCodeId') || 'none'} 
                      onValueChange={(value: string) => setValue('categoryCodeId', value === 'none' ? undefined : value)}
                    >
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="구분 사용 여부를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryCodes.length === 0 ? (
                          <SelectItem value="loading" disabled className="text-sm text-gray-400">
                            로딩 중... ({categoryCodes.length}개)
                          </SelectItem>
                        ) : (
                          categoryCodes.map((category) => {
                            const value = category.value === null ? 'none' : category.value;
                            return (
                              <SelectItem key={value} value={value} className="text-sm">
                                {category.label}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 이미지 설정 섹션 */}
                  <div className="space-y-6 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">이미지 설정</h3>
                    
                    {/* 대표이미지 설정 */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="block text-sm font-medium text-gray-700">
                          대표이미지
                        </Label>
                        <RadioGroup 
                          value={watch('representImageUseAt')} 
                          onValueChange={(value: string) => setValue('representImageUseAt', value as 'Y' | 'N')}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="Y" id="represent-y" className="w-5 h-5" />
                            <Label htmlFor="represent-y" className="text-sm">사용</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="N" id="represent-n" className="w-5 h-5" />
                            <Label htmlFor="represent-n" className="text-sm">사용안함</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {watch('representImageUseAt') === 'Y' && (
                        <div className="grid grid-cols-2 gap-4 ml-8">
                          <div className="space-y-2">
                            <Label htmlFor="representImageWidth" className="block text-sm font-medium text-gray-700">
                              권장 너비 (px)
                            </Label>
                            <Input
                              id="representImageWidth"
                              type="number"
                              value={watch('representImageWidth') || ''}
                              onChange={(e) => setValue('representImageWidth', e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="800"
                              className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="representImageHeight" className="block text-sm font-medium text-gray-700">
                              권장 높이 (px)
                            </Label>
                            <Input
                              id="representImageHeight"
                              type="number"
                              value={watch('representImageHeight') || ''}
                              onChange={(e) => setValue('representImageHeight', e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="600"
                              className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 메인화면이미지 설정 */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="block text-sm font-medium text-gray-700">
                          메인화면이미지
                        </Label>
                        <RadioGroup 
                          value={watch('mainImageUseAt')} 
                          onValueChange={(value: string) => setValue('mainImageUseAt', value as 'Y' | 'N')}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="Y" id="main-y" className="w-5 h-5" />
                            <Label htmlFor="main-y" className="text-sm">사용</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="N" id="main-n" className="w-5 h-5" />
                            <Label htmlFor="main-n" className="text-sm">사용안함</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {watch('mainImageUseAt') === 'Y' && (
                        <div className="grid grid-cols-2 gap-4 ml-8">
                          <div className="space-y-2">
                            <Label htmlFor="mainImageWidth" className="block text-sm font-medium text-gray-700">
                              권장 너비 (px)
                            </Label>
                            <Input
                              id="mainImageWidth"
                              type="number"
                              value={watch('mainImageWidth') || ''}
                              onChange={(e) => setValue('mainImageWidth', e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="1200"
                              className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="mainImageHeight" className="block text-sm font-medium text-gray-700">
                              권장 높이 (px)
                            </Label>
                            <Input
                              id="mainImageHeight"
                              type="number"
                              value={watch('mainImageHeight') || ''}
                              onChange={(e) => setValue('mainImageHeight', e.target.value ? parseInt(e.target.value) : undefined)}
                              placeholder="400"
                              className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 다중이미지 설정 */}
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label className="block text-sm font-medium text-gray-700">
                          다중이미지
                        </Label>
                        <RadioGroup 
                          value={watch('multiImageUseAt')} 
                          onValueChange={(value: string) => setValue('multiImageUseAt', value as 'Y' | 'N')}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="Y" id="multi-y" className="w-5 h-5" />
                            <Label htmlFor="multi-y" className="text-sm">사용</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="N" id="multi-n" className="w-5 h-5" />
                            <Label htmlFor="multi-n" className="text-sm">사용안함</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      
                      {watch('multiImageUseAt') === 'Y' && (
                        <div className="space-y-4 ml-8">
                          {/* 표시명과 최대개수를 한 줄에 */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="multiImageDisplayName" className="block text-sm font-medium text-gray-700">
                                표시명
                              </Label>
                              <Input
                                id="multiImageDisplayName"
                                value={watch('multiImageDisplayName')}
                                onChange={(e) => setValue('multiImageDisplayName', e.target.value)}
                                placeholder="이미지"
                                className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="multiImageMaxCount" className="block text-sm font-medium text-gray-700">
                                최대 개수
                              </Label>
                              <Input
                                id="multiImageMaxCount"
                                type="number"
                                value={watch('multiImageMaxCount') || ''}
                                onChange={(e) => setValue('multiImageMaxCount', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="10"
                                className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          
                          {/* 권장 너비와 높이를 한 줄에 */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="multiImageWidth" className="block text-sm font-medium text-gray-700">
                                권장 너비 (px)
                              </Label>
                              <Input
                                id="multiImageWidth"
                                type="number"
                                value={watch('multiImageWidth') || ''}
                                onChange={(e) => setValue('multiImageWidth', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="300"
                                className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="multiImageHeight" className="block text-sm font-medium text-gray-700">
                                권장 높이 (px)
                              </Label>
                              <Input
                                id="multiImageHeight"
                                type="number"
                                value={watch('multiImageHeight') || ''}
                                onChange={(e) => setValue('multiImageHeight', e.target.value ? parseInt(e.target.value) : undefined)}
                                placeholder="200"
                                className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 버튼 */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          저장 중...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          저장
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
