'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemManagementSidebar from '@/components/admin/SystemManagementSidebar';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { commonCodeAPI } from '@/lib/api';
import { UserInfo, CommonCodeVO, CommonCodeDetailVO } from '@/types';
import { ArrowLeft, Save, Plus, Edit } from 'lucide-react';
import CommonCodeDetailEditor from '@/components/admin/CommonCodeDetailEditor';
import { toast } from 'sonner';
import CommonCodeDetailTable from '@/components/admin/CommonCodeDetailTable';
import DataTable from '@/components/ui/DataTable';
import { DraggableDataTable } from '@/components/ui/DraggableDataTable';
import { ColumnDef } from '@tanstack/react-table';

// ColumnDef 타입 확장
type ColumnDefWithAlignment<TData, TValue> = ColumnDef<TData, TValue> & {
  textAlign?: 'left' | 'right' | 'center';
};

interface FormData {
  codeId: string;
  codeIdNm: string;
  codeIdDc: string;
  useAt: string;
  clCode: string;
  sortOrdr: number;
}

export default function EditCommonCodePage() {
  const router = useRouter();
  const params = useParams();
  const codeId = params.codeId as string;
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commonCode, setCommonCode] = useState<CommonCodeVO | null>(null);
  const [detailCodes, setDetailCodes] = useState<CommonCodeDetailVO[]>([]);
  const [isDetailEditOpen, setIsDetailEditOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<CommonCodeDetailVO | null>(null);
  const [formData, setFormData] = useState<FormData>({
    codeId: '',
    codeIdNm: '',
    codeIdDc: '',
    useAt: 'Y',
    clCode: 'SYSTEM_CODE',
    sortOrdr: 0
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

  // 공통코드 데이터 로드
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
        const data = response.data.data;
        setCommonCode(data);
        setFormData({
          codeId: data.codeId || '',
          codeIdNm: data.codeIdNm || '',
          codeIdDc: data.codeIdDc || '',
          useAt: data.useAt || 'Y',
          clCode: data.clCode || 'SYSTEM_CODE',
          sortOrdr: data.sortOrdr || 0
        });
      }
    } catch (error) {
      console.error('공통코드 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDetailCodes = async () => {
    try {
      // codeOrder로 정렬하여 가져오기
      const response = await commonCodeAPI.getDetailList(codeId, { sortField: 'CODE_ORDER', sortOrder: 'asc' });
      if (response.data.resultCode === 'SUCCESS') {
        const detailCodesData = response.data.data || [];
        // 드래그 기능을 위해 고유 ID 추가 (code 기반으로 고정 ID 생성)
        const detailsWithId = detailCodesData.map((detail: CommonCodeDetailVO) => ({
          ...detail,
          id: `${detail.codeId}_${detail.code}` // code 기반 고유 ID 생성
        }));
        setDetailCodes(detailsWithId);
      }
    } catch (error) {
      console.error('하위코드 목록 로드 실패:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.codeIdNm.trim()) {
      toast.error('코드명을 입력해주세요.');
      return;
    }

    try {
      setSaving(true);
      
      const updateData = {
        codeId: formData.codeId,
        codeIdNm: formData.codeIdNm,
        codeIdDc: formData.codeIdDc,
        useAt: formData.useAt,
        clCode: formData.clCode,
        sortOrdr: formData.sortOrdr
      };

      const response = await commonCodeAPI.update(codeId, updateData);
      
      if (response.data.resultCode === 'SUCCESS') {
        toast.success('공통코드가 수정되었습니다.');
        router.push('/admin/cms/common-code');
      } else {
        toast.error('공통코드 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('공통코드 수정 실패:', error);
      toast.error('공통코드 수정 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleEditDetail = (detail: CommonCodeDetailVO) => {
    setSelectedDetail(detail);
    setIsDetailEditOpen(true);
  };

  const handleCreateDetail = () => {
    setSelectedDetail(null);
    setIsDetailEditOpen(true);
  };

  // 하위코드 순서 변경 처리
  const handleReorder = async (newOrder: CommonCodeDetailVO[]) => {
    // 원본 데이터 백업 (실패 시 복구용)
    const originalData = [...detailCodes];
    
    try {
      console.log('원본 데이터:', detailCodes.map(item => ({ code: item.code, codeOrder: item.codeOrder })));
      console.log('새로운 순서:', newOrder.map((item, index) => ({ code: item.code, newOrder: index + 1 })));

      // 변경된 항목만 찾기
      const changedItems = newOrder.filter((item, newIndex) => {
        // 원본 데이터에서 같은 code를 가진 항목 찾기
        const originalItem = detailCodes.find(original => original.code === item.code);
        const newOrderValue = newIndex + 1;
        const isChanged = originalItem && originalItem.codeOrder !== newOrderValue;
        console.log(`${item.code}: 원본=${originalItem?.codeOrder}, 새로운=${newOrderValue}, 변경됨=${isChanged}`);
        return isChanged;
      });

      console.log('변경된 항목 수:', changedItems.length);
      console.log('변경된 항목들:', changedItems.map(item => item.code));

      // 1. 즉시 UI 업데이트 (낙관적 업데이트) - 애니메이션 방지
      const updatedNewOrder = newOrder.map((item, index) => ({
        ...item,
        codeOrder: index + 1
      }));
      
      // 즉시 업데이트하여 애니메이션 방지
      setDetailCodes(updatedNewOrder);

      // 2. 백엔드에 업데이트 요청
      for (const item of changedItems) {
        const { id, ...itemWithoutId } = item; // id 필드 제거
        const newOrderIndex = newOrder.findIndex(detail => detail.code === item.code) + 1;
        const updatedItem = {
          ...itemWithoutId,
          codeOrder: newOrderIndex
        };
        
        console.log(`업데이트: ${item.code} -> codeOrder: ${newOrderIndex}`);
        await commonCodeAPI.updateDetail(updatedItem.codeId, updatedItem.code, updatedItem);
      }

      // 3. 성공 시 백엔드에서 최신 데이터 다시 가져오기
      await loadDetailCodes();
      
      toast.success(`하위코드 순서가 변경되었습니다. (${changedItems.length}개 항목 업데이트)`);
    } catch (error) {
      console.error('하위코드 순서 변경 실패:', error);
      
      // 4. 실패 시 원상복구
      setDetailCodes(originalData);
      toast.error('하위코드 순서 변경에 실패했습니다. 원래 순서로 복구되었습니다.');
    }
  };

  // 하위코드 목록용 컬럼 정의
  const columns: ColumnDefWithAlignment<CommonCodeDetailVO, unknown>[] = [
    {
      id: 'no',
      header: 'NO',
      cell: ({ row }) => <span>{detailCodes.length - row.index}</span>,
      enableSorting: false,
      //textAlign: 'center',
    },
    {
      id: 'code',
      header: '코드',
      accessorKey: 'code',
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.code}</span>
      ),
      //textAlign: 'left',
    },
    {
      accessorKey: 'codeNm',
      header: '코드명',
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.codeNm}</span>
      ),
      //textAlign: 'left',
    },
    {
      accessorKey: 'codeDc',
      header: '코드설명',
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.codeDc || '-'}</span>
      ),
      //textAlign: 'left',
    },
    {
      accessorKey: 'codeOrder',
      header: '순서',
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.codeOrder}</span>
      ),
      //textAlign: 'center',
    },
    {
      accessorKey: 'useAt',
      header: '사용',
      cell: ({ row }) => (
        <span className={`text-xs px-2 py-1 rounded ${
          row.original.useAt === 'Y' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.useAt === 'Y' ? '사용' : '미사용'}
        </span>
      ),
      //textAlign: 'center',
    },
    {
      accessorKey: 'frstRegistPnttm',
      header: '등록',
      cell: ({ row }) => {
        const date = row.original.frstRegistPnttm ? new Date(row.original.frstRegistPnttm).toLocaleDateString() : '-';
        const user = row.original.frstRegisterId ? `(${row.original.frstRegisterId})` : '';
        return `${date} ${user}`;
      },
      //textAlign: 'center',
    },
    {
      accessorKey: 'lastUpdtPnttm',
      header: '수정',
      cell: ({ row }) => {
        const date = row.original.lastUpdtPnttm ? new Date(row.original.lastUpdtPnttm).toLocaleDateString() : '-';
        const user = row.original.lastUpdusrId ? `(${row.original.lastUpdusrId})` : '';
        return `${date} ${user}`;
      },
      //textAlign: 'right',
    },
    {
      id: 'actions',
      header: '관리',
      cell: ({ row }) => (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleEditDetail(row.original)}
          >
            <Edit className="w-4 h-4" />
          </Button>
      ),
      textAlign: 'right',
    },
  ];


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
        <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)] flex flex-col">
          {/* 상단 헤더 - 목록 페이지와 동일한 스타일 */}
          <div className="bg-white border-b border-gray-300 flex-shrink-0">
            {/* 타이틀 부분 */}
            <div className="px-8 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">시스템코드 수정</h1>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin/cms/common-code')}
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
                <div className="space-y-6">
                  {/* 코드 ID와 상위코드 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="block text-sm font-medium text-gray-700">
                          코드 ID
                        </label>
                      </div>
                      <Input
                        id="codeId"
                        value={formData.codeId}
                        disabled
                        className="w-full text-sm !text-sm border-gray-300 bg-gray-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">상위코드</label>
                      <Input
                        id="clCode"
                        value={formData.clCode}
                        disabled
                        className="w-full text-sm !text-sm border-gray-300 bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* 코드명과 코드설명 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="block text-sm font-medium text-gray-700">
                          코드명 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <Input
                        id="codeIdNm"
                        value={formData.codeIdNm}
                        onChange={(e) => setFormData({...formData, codeIdNm: e.target.value})}
                        placeholder="코드명을 입력해 주세요."
                        className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">코드설명</label>
                      <Input
                        id="codeIdDc"
                        value={formData.codeIdDc}
                        onChange={(e) => setFormData({...formData, codeIdDc: e.target.value})}
                        placeholder="코드설명을 입력해 주세요."
                        className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* 순서와 사용여부 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">순서</label>
                      <Input
                        type="number"
                        value={formData.sortOrdr}
                        onChange={(e) => setFormData({...formData, sortOrdr: parseInt(e.target.value) || 0})}
                        className="w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        사용여부 <span className="text-red-500">*</span>
                      </label>
                      <RadioGroup 
                        value={formData.useAt} 
                        onValueChange={(value: string) => setFormData({...formData, useAt: value})}
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

                  {/* 버튼 */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleSave}
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
                </div>
              </div>
            </div>
            

            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden max-h-[calc(100vh-300px)] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">하위코드정보</h3>
                <Button
                  onClick={handleCreateDetail}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  하위코드정보 추가
                </Button>
              </div>
              <DraggableDataTable
                data={detailCodes}
                columns={columns}
                loading={loading}
                enableSorting={false}
                enablePagination={false}
                showPagination={false}
                emptyMessage="등록된 하위코드가 없습니다."
                onReorder={handleReorder}
                enableDrag={true}
              />
            </div>
          </div>

            {/* 하위코드 편집 컴포넌트 */}
            <CommonCodeDetailEditor
              codeId={codeId}
              isOpen={isDetailEditOpen}
              onOpenChange={setIsDetailEditOpen}
              selectedDetail={selectedDetail}
              onSave={loadDetailCodes}
            />
        </main>
      </div>
    </div>
  );
} 