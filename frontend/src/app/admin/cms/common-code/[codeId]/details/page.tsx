'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemManagementSidebar from '@/components/admin/SystemManagementSidebar';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { commonCodeAPI } from '@/lib/api';
import { UserInfo, CommonCodeVO, CommonCodeDetailVO } from '@/types';
import { ArrowLeft, Plus, Save } from 'lucide-react';
import CommonCodeDetailTable from '@/components/admin/CommonCodeDetailTable';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';

export default function CommonCodeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const codeId = params.codeId as string;
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailSaving, setDetailSaving] = useState(false);
  const [commonCode, setCommonCode] = useState<CommonCodeVO | null>(null);
  const [detailCodes, setDetailCodes] = useState<CommonCodeDetailVO[]>([]);
  const [isDetailEditOpen, setIsDetailEditOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<CommonCodeDetailVO | null>(null);
  const [detailFormData, setDetailFormData] = useState({
    code: '',
    codeNm: '',
    codeDc: '',
    useAt: 'Y',
    codeOrder: 0
  });

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

  // 공통코드 및 하위코드 데이터 로드
  useEffect(() => {
    if (codeId) {
      loadCommonCode();
      loadDetailCodes();
    }
  }, [codeId]);

  const loadCommonCode = async () => {
    try {
      setLoading(true);
      const response = await commonCodeAPI.getDetail(codeId);
      if (response.data.resultCode === 'SUCCESS') {
        setCommonCode(response.data.data);
      }
    } catch (error) {
      console.error('공통코드 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDetailCodes = async () => {
    try {
      const response = await commonCodeAPI.getDetailList(codeId);
      if (response.data.resultCode === 'SUCCESS') {
        const detailCodesData = response.data.data || [];
        setDetailCodes(detailCodesData);
      }
    } catch (error) {
      console.error('하위코드 목록 로드 실패:', error);
    }
  };

  const handleEditDetail = (detail: CommonCodeDetailVO) => {
    setSelectedDetail(detail);
    setDetailFormData({
      code: detail.code,
      codeNm: detail.codeNm,
      codeDc: detail.codeDc || '',
      useAt: detail.useAt,
      codeOrder: detail.codeOrder
    });
    setIsDetailEditOpen(true);
  };

  const handleCreateDetail = () => {
    setSelectedDetail(null);
    setDetailFormData({
      code: '',
      codeNm: '',
      codeDc: '',
      useAt: 'Y',
      codeOrder: detailCodes.length + 1
    });
    setIsDetailEditOpen(true);
  };

  const handleSaveDetail = async () => {
    if (!detailFormData.codeNm.trim()) {
      toast.error('코드명을 입력해주세요.');
      return;
    }

    try {
      setDetailSaving(true);
      const detailData = {
        codeId: codeId,
        code: detailFormData.code,
        codeNm: detailFormData.codeNm,
        codeDc: detailFormData.codeDc,
        useAt: detailFormData.useAt,
        codeOrder: detailFormData.codeOrder,
        lastUpdusrId: 'admin'
      };

      if (selectedDetail) {
        // 수정
        const response = await commonCodeAPI.updateDetail(codeId, detailFormData.code, detailData);
        if (response.data.resultCode === 'SUCCESS') {
          toast.success('세부코드가 수정되었습니다.');
          loadDetailCodes();
          setIsDetailEditOpen(false);
        }
      } else {
        // 생성
        const response = await commonCodeAPI.createDetail(codeId, detailData);
        if (response.data.resultCode === 'SUCCESS') {
          toast.success('세부코드가 생성되었습니다.');
          loadDetailCodes();
          setIsDetailEditOpen(false);
        }
      }
    } catch (error) {
      console.error('세부코드 저장 실패:', error);
      toast.error('세부코드 저장 중 오류가 발생했습니다.');
    } finally {
      setDetailSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!commonCode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">공통코드를 찾을 수 없습니다.</h1>
          <Button onClick={() => router.push('/admin/cms/common-code')}>
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex pt-16">
        <SystemManagementSidebar />
        <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)]">
          <div className="max-w-7xl mx-auto p-6">
            {/* 헤더 */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => router.push('/admin/cms/common-code')}
                    className="flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    목록으로
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {commonCode.codeIdNm} - 하위코드 관리
                    </h1>
                    <p className="text-sm text-gray-600">
                      {commonCode.codeId} - {commonCode.codeIdDc}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleCreateDetail}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  하위코드 추가
                </Button>
              </div>
            </div>

            {/* 하위코드 목록 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">하위코드 목록</h2>
                <CommonCodeDetailTable 
                  data={detailCodes}
                  onEdit={handleEditDetail}
                />
              </div>
            </div>

            {/* 하위코드 편집 Drawer */}
            <Sheet open={isDetailEditOpen} onOpenChange={setIsDetailEditOpen}>
              <SheetContent className="!w-[550px] sm:!w-[650px] !max-w-none sm:!max-w-none">
                <SheetHeader className="pb-6 px-6">
                  <SheetTitle className="text-xl font-semibold">
                    {selectedDetail ? '세부코드 수정' : '세부코드 추가'}
                  </SheetTitle>
                  <SheetDescription>
                    {selectedDetail ? '세부코드 정보를 수정합니다.' : '새로운 세부코드를 추가합니다.'}
                  </SheetDescription>
                </SheetHeader>
                
                <div className="px-6 space-y-8">
                  {/* 코드 */}
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      코드 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={detailFormData.code}
                      onChange={(e) => setDetailFormData({...detailFormData, code: e.target.value})}
                      placeholder="코드를 입력해 주세요."
                      disabled={!!selectedDetail}
                      className={`w-full h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                        selectedDetail ? '!text-base border-gray-300 bg-gray-50' : ''
                      }`}
                    />
                  </div>

                  {/* 상위코드 */}
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      상위코드 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={codeId}
                      disabled
                      className="w-full h-10 text-base !text-base border-gray-300 bg-gray-50"
                    />
                  </div>

                  {/* 코드명 */}
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      코드명 <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={detailFormData.codeNm}
                      onChange={(e) => setDetailFormData({...detailFormData, codeNm: e.target.value})}
                      placeholder="코드명을 입력해 주세요."
                      className="w-full h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* 코드설명 */}
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      코드설명
                    </label>
                    <Input
                      value={detailFormData.codeDc}
                      onChange={(e) => setDetailFormData({...detailFormData, codeDc: e.target.value})}
                      placeholder="코드설명을 입력해 주세요."
                      className="w-full h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* 순서 */}
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">순서</label>
                    <Input
                      type="number"
                      value={detailFormData.codeOrder}
                      onChange={(e) => setDetailFormData({...detailFormData, codeOrder: parseInt(e.target.value) || 0})}
                      className="w-full h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* 사용여부 */}
                  <div className="space-y-3">
                    <label className="block text-base font-medium text-gray-700">
                      사용여부 <span className="text-red-500">*</span>
                    </label>
                    <RadioGroup 
                      value={detailFormData.useAt} 
                      onValueChange={(value: string) => setDetailFormData({...detailFormData, useAt: value})}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="Y" id="detail-use-y" className="w-5 h-5" />
                        <Label htmlFor="detail-use-y" className="text-base">사용</Label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="N" id="detail-use-n" className="w-5 h-5" />
                        <Label htmlFor="detail-use-n" className="text-base">미사용</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 버튼 */}
                  <div className="flex justify-end space-x-3 pt-8 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setIsDetailEditOpen(false)}
                      className="px-4 py-2 h-10 text-base"
                    >
                      취소
                    </Button>
                    <Button
                      onClick={handleSaveDetail}
                      disabled={detailSaving}
                      className="px-4 py-2 h-10 text-base bg-orange-600 hover:bg-orange-700"
                    >
                      {detailSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          저장 중...
                        </>
                      ) : (
                        selectedDetail ? '수정' : '추가'
                      )}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </main>
      </div>
    </div>
  );
} 