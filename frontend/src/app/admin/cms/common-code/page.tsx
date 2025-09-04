'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { UserInfo, CommonCodeVO } from '@/types';
import { 
  useCommonCodeList, 
  useCreateCommonCode, 
  useUpdateCommonCode, 
  useDeleteCommonCode 
} from '@/hooks/useApi';
import { 
  Plus, 
  Search, 
  RotateCcw,
  Edit,
  Eye
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

// ColumnDef 타입 확장
type ColumnDefWithAlignment<TData, TValue> = ColumnDef<TData, TValue> & {
  textAlign?: 'left' | 'right' | 'center';
};

import AdminHeader from '@/components/admin/AdminHeader';
import DynamicSidebar from '@/components/admin/DynamicSidebar';
import { toast } from 'sonner';
import DataTable from '@/components/ui/DataTable';

export default function CommonCodePage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const [searchCondition, setSearchCondition] = useState('');
  const [searchUseAt, setSearchUseAt] = useState('ALL');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<CommonCodeVO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('CODE_ID');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [formData, setFormData] = useState({
    codeId: '',
    codeIdNm: '',
    codeIdDc: '',
    useAt: 'Y',
    clCode: ''
  });

  // 디바운싱 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // React Query 훅들
  const queryParams = useMemo(() => {
    const params = {
      pageIndex: currentPage - 1, // 0부터 시작하도록 수정
      pageSize: rowsPerPage,
      searchKeyword: debouncedSearchKeyword || undefined,
      searchCondition: searchCondition !== 'ALL' ? searchCondition : undefined,
      searchUseAt: searchUseAt !== 'ALL' ? searchUseAt : undefined,
      sortField: sortField || undefined,
      sortOrder: sortOrder || 'ASC'
    };
    console.log('API 요청 파라미터:', JSON.stringify(params, null, 2));
    return params;
  }, [debouncedSearchKeyword, searchCondition, searchUseAt, currentPage, rowsPerPage, sortField, sortOrder]);

  const { data: commonCodeData, isLoading, error } = useCommonCodeList(queryParams);
  const createMutation = useCreateCommonCode();
  const updateMutation = useUpdateCommonCode();
  const deleteMutation = useDeleteCommonCode();

  const commonCodes = commonCodeData?.data || [];
  const totalRows = commonCodeData?.paginationInfo?.totalRecordCount || 0;

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
  }, [router]);



  const handleReset = () => {
    setSearchKeyword('');
    setDebouncedSearchKeyword('');
    setSearchCondition('');
    setSearchUseAt('ALL');
    setCurrentPage(1);
  };
  const handleEdit = (code: CommonCodeVO) => {
    setSelectedCode(code);
    setFormData({
      codeId: code.codeId,
      codeIdNm: code.codeIdNm,
      codeIdDc: code.codeIdDc || '',
      useAt: code.useAt,
      clCode: code.clCode || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (codeId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteMutation.mutateAsync(codeId);
      toast.success('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedCode) {
        await updateMutation.mutateAsync({ 
          codeId: selectedCode.codeId, 
          data: formData 
        });
        toast.success('수정되었습니다.');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('등록되었습니다.');
      }
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다.');
    }
  };

  // 시스템코드 목록용 컬럼 정의
  const columns: ColumnDefWithAlignment<CommonCodeVO, unknown>[] = [
    {
      id: 'no',
      header: 'NO',
      cell: ({ row }) => <span>{commonCodes.length - row.index}</span>,
      enableSorting: false,
    },
    {
      id: 'CODE_ID',
      header: '코드 ID',
      accessorKey: 'codeId',
      cell: ({ row }) => (
        <button 
          className="text-orange-600 hover:text-orange-800 underline font-medium"
          onClick={() => router.push(`/admin/cms/common-code/edit/${row.original.codeId}`)}
        >
          {row.original.codeId}
        </button>
      ),
    },
    {
      id: 'CODE_ID_NM',
      header: '코드명',
      accessorKey: 'codeIdNm',
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.codeIdNm}</span>
      ),
    },
    {
      id: 'CODE_ID_DC',
      header: '코드설명',
      accessorKey: 'codeIdDc',
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.codeIdDc || '-'}</span>
      ),
    },
    {
      id: 'USE_AT',
      header: '사용여부',
      accessorKey: 'useAt',
      cell: ({ row }) => (
        <span className={`text-xs px-2 py-1 rounded ${
          row.original.useAt === 'Y' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.useAt === 'Y' ? '사용' : '미사용'}
        </span>
      ),
    },
    {
      id: 'FRST_REGIST_PNTTM',
      header: '등록일',
      accessorKey: 'frstRegistPnttm',
      cell: ({ row }) => {
        const date = row.original.frstRegistPnttm ? new Date(row.original.frstRegistPnttm).toLocaleDateString() : '-';
        const user = row.original.frstRegisterId ? `(${row.original.frstRegisterId})` : '';
        return `${date} ${user}`;
      },
    },
    {
      id: 'LAST_UPDT_PNTTM',
      header: '수정일',
      accessorKey: 'lastUpdtPnttm',
      cell: ({ row }) => {
        const date = row.original.lastUpdtPnttm ? new Date(row.original.lastUpdtPnttm).toLocaleDateString() : '-';
        const user = row.original.lastUpdusrId ? `(${row.original.lastUpdusrId})` : '';
        return `${date} ${user}`;
      },
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <AdminHeader />

      <div className="flex pt-16">
        {/* 좌측 사이드바 - 동적 관리 */}
        <DynamicSidebar />

        {/* 메인 콘텐츠 - QuickFlow 스타일 */}
        <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)] flex flex-col">
          {/* 상단 헤더 + 검색/필터 섹션 - 고정 영역 */}
          <div className="bg-white border-b border-gray-300 flex-shrink-0">
            {/* 타이틀 부분 */}
            <div className="px-8 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">시스템코드</h1>
                </div>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm text-sm"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      새 코드 등록
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>새 공통코드 그룹 등록</DialogTitle>
                      <DialogDescription>
                        새로운 공통코드 그룹을 등록합니다.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="codeId" className="text-sm font-medium text-gray-700">코드 ID</Label>
                        <Input
                          id="codeId"
                          value={formData.codeId}
                          onChange={(e) => setFormData({...formData, codeId: e.target.value})}
                          placeholder="예: USER_STATUS"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="codeIdNm" className="text-sm font-medium text-gray-700">코드명</Label>
                        <Input
                          id="codeIdNm"
                          value={formData.codeIdNm}
                          onChange={(e) => setFormData({...formData, codeIdNm: e.target.value})}
                          placeholder="예: 사용자 상태"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="codeIdDc" className="text-sm font-medium text-gray-700">설명</Label>
                        <Input
                          id="codeIdDc"
                          value={formData.codeIdDc}
                          onChange={(e) => setFormData({...formData, codeIdDc: e.target.value})}
                          placeholder="코드 그룹에 대한 설명"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="useAt" className="text-sm font-medium text-gray-700">사용 여부</Label>
                        <Select value={formData.useAt} onValueChange={(value: string) => setFormData({...formData, useAt: value})}>
                          <SelectTrigger className="text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Y" className="text-sm">사용</SelectItem>
                            <SelectItem value="N" className="text-sm">미사용</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-sm">
                        취소
                      </Button>
                      <Button onClick={handleSubmit} className="text-sm">등록</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* 검색/필터 부분 */}
            <div className="px-8 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="코드, 코드명으로 검색..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>
                <Select value={searchUseAt} onValueChange={(value: string) => setSearchUseAt(value)}>
                  <SelectTrigger className="w-32 text-sm">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-sm">전체</SelectItem>
                    <SelectItem value="Y" className="text-sm">사용</SelectItem>
                    <SelectItem value="N" className="text-sm">미사용</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </div>
          </div>

          {/* 테이블 영역 - 스크롤 가능한 콘텐츠 */}
          <div className="px-8 py-8 flex-1 overflow-y-auto">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <DataTable
                data={commonCodes}
                columns={columns}
                loading={isLoading}
                onSortChange={(field, order) => {
                  console.log('정렬 변경:', field, order);
                  setSortField(field);
                  setSortOrder(order);
                  setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
                }}
                sortField={sortField}
                sortOrder={sortOrder}
                serverSidePagination={true}
                totalRows={totalRows}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newPageSize) => {
                  setRowsPerPage(newPageSize);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[10, 20, 50]}
                showPagination={true}
                emptyMessage="등록된 시스템코드가 없습니다."
              />
            </div>
          </div>
        </main>
      </div>

      {/* 수정 다이얼로그 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>공통코드 그룹 수정</DialogTitle>
            <DialogDescription>
              공통코드 그룹 정보를 수정합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editCodeId" className="text-sm font-medium text-gray-700">코드 ID</Label>
              <Input
                id="editCodeId"
                value={formData.codeId}
                disabled
                className="bg-gray-100 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="editCodeIdNm" className="text-sm font-medium text-gray-700">코드명</Label>
              <Input
                id="editCodeIdNm"
                value={formData.codeIdNm}
                onChange={(e) => setFormData({...formData, codeIdNm: e.target.value})}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="editCodeIdDc" className="text-sm font-medium text-gray-700">설명</Label>
              <Input
                id="editCodeIdDc"
                value={formData.codeIdDc}
                onChange={(e) => setFormData({...formData, codeIdDc: e.target.value})}
                className="text-sm"
              />
            </div>
            <div>
              <Label htmlFor="editUseAt" className="text-sm font-medium text-gray-700">사용 여부</Label>
              <Select value={formData.useAt} onValueChange={(value: string) => setFormData({...formData, useAt: value})}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y" className="text-sm">사용</SelectItem>
                  <SelectItem value="N" className="text-sm">미사용</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-sm">
              취소
            </Button>
            <Button onClick={handleSubmit} className="text-sm">수정</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 