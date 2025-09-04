'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemManagementSidebar from '@/components/admin/SystemManagementSidebar';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { UserInfo, BbsMstVO } from '@/types';
import { ArrowLeft, Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import DataTable from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useBbsMstList, useCreateBbsMst, useUpdateBbsMst, useDeleteBbsMst } from '@/hooks/useApi';

// ColumnDef 타입 확장
type ColumnDefWithAlignment<TData, TValue> = ColumnDef<TData, TValue> & {
  textAlign?: 'left' | 'right' | 'center';
};

interface FormData {
  bbsId: string;
  bbsNm: string;
  bbsIntrcn: string;
  bbsTyCode: string;
  bbsAttrbCode: string;
  replyPosblAt: string;
  fileAtchPosblAt: string;
  atchPosblFileNumber: number;
  atchPosblFileSize: number;
  useAt: string;
}

export default function BoardMasterPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<BbsMstVO | null>(null);
  const [formData, setFormData] = useState<FormData>({
    bbsId: '',
    bbsNm: '',
    bbsIntrcn: '',
    bbsTyCode: 'BBST01',
    bbsAttrbCode: 'BBSA01',
    replyPosblAt: 'Y',
    fileAtchPosblAt: 'Y',
    atchPosblFileNumber: 5,
    atchPosblFileSize: 10485760,
    useAt: 'Y'
  });

  // 검색 및 페이징 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const [searchUseAt, setSearchUseAt] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('BBS_ID');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  // 검색어 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // 쿼리 파라미터 구성
  const queryParams = useMemo(() => {
    const params = {
      pageIndex: currentPage - 1, // 0부터 시작
      pageSize: rowsPerPage,
      sortField,
      sortOrder,
      searchKeyword: debouncedSearchKeyword || undefined,
      searchUseAt: searchUseAt !== 'ALL' ? searchUseAt : undefined
    };
    console.log('API 요청 파라미터:', JSON.stringify(params, null, 2));
    return params;
  }, [debouncedSearchKeyword, searchUseAt, currentPage, rowsPerPage, sortField, sortOrder]);

  // React Query 훅 사용
  const { data: bbsMstData, isLoading, error } = useBbsMstList(queryParams);

  // 공통코드와 동일한 방식으로 데이터 접근
  const boards = bbsMstData?.data || [];
  const totalRows = bbsMstData?.paginationInfo?.totalRecordCount || 0;

  const createMutation = useCreateBbsMst();
  const updateMutation = useUpdateBbsMst();
  const deleteMutation = useDeleteBbsMst();

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
    setSearchUseAt('ALL');
    setCurrentPage(1);
  };

  const handleEdit = (board: BbsMstVO) => {
    setSelectedBoard(board);
    setFormData({
      bbsId: board.bbsId,
      bbsNm: board.bbsNm,
      bbsIntrcn: board.bbsIntrcn || '',
      bbsTyCode: board.bbsTyCode || 'BBST01',
      bbsAttrbCode: board.bbsAttrbCode || 'BBSA01',
      replyPosblAt: board.replyPosblAt || 'Y',
      fileAtchPosblAt: board.fileAtchPosblAt || 'Y',
      atchPosblFileNumber: board.atchPosblFileNumber || 5,
      atchPosblFileSize: board.atchPosblFileSize || 10485760,
      useAt: board.useAt || 'Y'
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (bbsId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      deleteMutation.mutate(bbsId);
      toast.success('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedBoard) {
        // 수정
        updateMutation.mutate({
          bbsId: selectedBoard.bbsId,
          data: {
            ...formData,
            lastUpdtPnttm: new Date().toISOString(),
            lastUpdusrId: 'admin'
          }
        });
        toast.success('수정되었습니다.');
      } else {
        // 새로 등록
        createMutation.mutate({
          ...formData,
          frstRegistPnttm: new Date().toISOString(),
          frstRegisterId: 'admin',
          lastUpdtPnttm: new Date().toISOString(),
          lastUpdusrId: 'admin'
        });
        toast.success('등록되었습니다.');
      }
      
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedBoard(null);
      setFormData({
        bbsId: '',
        bbsNm: '',
        bbsIntrcn: '',
        bbsTyCode: 'BBST01',
        bbsAttrbCode: 'BBSA01',
        replyPosblAt: 'Y',
        fileAtchPosblAt: 'Y',
        atchPosblFileNumber: 5,
        atchPosblFileSize: 10485760,
        useAt: 'Y'
      });
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다.');
    }
  };

  // 게시판 목록용 컬럼 정의
  const columns: ColumnDefWithAlignment<BbsMstVO, unknown>[] = [
    {
      id: 'no',
      header: 'NO',
      cell: ({ row }) => {
        // 시스템 코드와 동일한 역순 NO 처리
        const no = totalRows - ((currentPage - 1) * rowsPerPage + row.index);
        return <span>{no}</span>;
      },
      enableSorting: false,
    },
    {
      id: 'BBS_ID',
      header: '게시판 ID',
      accessorKey: 'bbsId',
      enableSorting: true,
      cell: ({ row }) => (
        <button 
          className="text-orange-600 hover:text-orange-800 underline font-medium"
          onClick={() => router.push(`/admin/cms/board/${row.original.bbsId}`)}
        >
          {row.original.bbsId}
        </button>
      ),
    },
    {
      id: 'BBS_NM',
      header: '게시판명',
      accessorKey: 'bbsNm',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.bbsNm}</span>
      ),
    },
    {
      id: 'BBS_INTRCN',
      header: '게시판 소개',
      accessorKey: 'bbsIntrcn',
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-gray-900 max-w-xs truncate" title={row.original.bbsIntrcn || ''}>
          {row.original.bbsIntrcn || '-'}
        </span>
      ),
    },
    {
      id: 'BBS_TY_CODE',
      header: '게시판 유형',
      accessorKey: 'bbsTyCode',
      enableSorting: true,
      cell: ({ row }) => {
        const typeMap: { [key: string]: string } = {
          'BBST01': '일반게시판',
          'BBST02': '갤러리게시판',
          'BBST03': 'FAQ게시판'
        };
        return (
          <span className="text-gray-700 text-sm">
            {typeMap[row.original.bbsTyCode || ''] || row.original.bbsTyCode || '-'}
          </span>
        );
      },
    },
    {
      id: 'REPLY_POSBL_AT',
      header: '답글가능',
      accessorKey: 'replyPosblAt',
      enableSorting: true,
      cell: ({ row }) => (
        <span className={`text-xs px-2 py-1 rounded ${
          row.original.replyPosblAt === 'Y' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.replyPosblAt === 'Y' ? '가능' : '불가능'}
        </span>
      ),
    },
    {
      id: 'FILE_ATCH_POSBL_AT',
      header: '파일첨부',
      accessorKey: 'fileAtchPosblAt',
      enableSorting: true,
      cell: ({ row }) => (
        <span className={`text-xs px-2 py-1 rounded ${
          row.original.fileAtchPosblAt === 'Y' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {row.original.fileAtchPosblAt === 'Y' ? '가능' : '불가능'}
        </span>
      ),
    },
    {
      id: 'USE_AT',
      header: '사용여부',
      accessorKey: 'useAt',
      enableSorting: true,
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
      id: 'frstRegistPnttm',
      header: '등록일',
      accessorKey: 'frstRegistPnttm',
      enableSorting: true,
      cell: ({ row }) => (
        <span className={`text-gray-900`}>
          {row.original.frstRegistPnttm ? new Date(row.original.frstRegistPnttm).toLocaleDateString() : '-'}
          {row.original.frstRegisterId ? ` (${row.original.frstRegisterId})` : ''}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '관리',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row.original)}
            className="h-8 px-2"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/cms/board/${row.original.bbsId}`)}
            className="h-8 px-2"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.bbsId)}
            className="h-8 px-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <AdminHeader />

      <div className="flex pt-16">
        {/* 좌측 사이드바 - 시스템 관리 */}
        <SystemManagementSidebar />

        {/* 메인 콘텐츠 - QuickFlow 스타일 */}
        <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)] flex flex-col">
          {/* 상단 헤더 + 검색/필터 섹션 - 고정 영역 */}
          <div className="bg-white border-b border-gray-300 flex-shrink-0">
            {/* 타이틀 부분 */}
            <div className="px-8 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">게시판 관리</h1>
                </div>
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm text-sm"
                      onClick={() => {
                        setSelectedBoard(null);
                        setFormData({
                          bbsId: '',
                          bbsNm: '',
                          bbsIntrcn: '',
                          bbsTyCode: 'BBST01',
                          bbsAttrbCode: 'BBSA01',
                          replyPosblAt: 'Y',
                          fileAtchPosblAt: 'Y',
                          atchPosblFileNumber: 5,
                          atchPosblFileSize: 10485760,
                          useAt: 'Y'
                        });
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      새 게시판 등록
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedBoard ? '게시판 수정' : '새 게시판 등록'}
                      </DialogTitle>
                      <DialogDescription>
                        {selectedBoard ? '게시판 정보를 수정합니다.' : '새로운 게시판을 등록합니다.'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bbsId" className="text-sm font-medium text-gray-700">게시판 ID</Label>
                          <Input
                            id="bbsId"
                            value={formData.bbsId}
                            onChange={(e) => setFormData({...formData, bbsId: e.target.value})}
                            placeholder="예: NOTICE"
                            className="text-sm"
                            disabled={!!selectedBoard}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bbsNm" className="text-sm font-medium text-gray-700">게시판명</Label>
                          <Input
                            id="bbsNm"
                            value={formData.bbsNm}
                            onChange={(e) => setFormData({...formData, bbsNm: e.target.value})}
                            placeholder="예: 공지사항"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bbsIntrcn" className="text-sm font-medium text-gray-700">게시판 소개</Label>
                        <Input
                          id="bbsIntrcn"
                          value={formData.bbsIntrcn}
                          onChange={(e) => setFormData({...formData, bbsIntrcn: e.target.value})}
                          placeholder="게시판에 대한 설명"
                          className="text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bbsTyCode" className="text-sm font-medium text-gray-700">게시판 유형</Label>
                          <Select value={formData.bbsTyCode} onValueChange={(value: string) => setFormData({...formData, bbsTyCode: value})}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BBST01" className="text-sm">일반게시판</SelectItem>
                              <SelectItem value="BBST02" className="text-sm">갤러리게시판</SelectItem>
                              <SelectItem value="BBST03" className="text-sm">FAQ게시판</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="bbsAttrbCode" className="text-sm font-medium text-gray-700">게시판 속성</Label>
                          <Select value={formData.bbsAttrbCode} onValueChange={(value: string) => setFormData({...formData, bbsAttrbCode: value})}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BBSA01" className="text-sm">일반</SelectItem>
                              <SelectItem value="BBSA02" className="text-sm">공지</SelectItem>
                              <SelectItem value="BBSA03" className="text-sm">FAQ</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="replyPosblAt" className="text-sm font-medium text-gray-700">답글 가능</Label>
                          <Select value={formData.replyPosblAt} onValueChange={(value: string) => setFormData({...formData, replyPosblAt: value})}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Y" className="text-sm">가능</SelectItem>
                              <SelectItem value="N" className="text-sm">불가능</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="fileAtchPosblAt" className="text-sm font-medium text-gray-700">파일 첨부</Label>
                          <Select value={formData.fileAtchPosblAt} onValueChange={(value: string) => setFormData({...formData, fileAtchPosblAt: value})}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Y" className="text-sm">가능</SelectItem>
                              <SelectItem value="N" className="text-sm">불가능</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="atchPosblFileNumber" className="text-sm font-medium text-gray-700">첨부파일 개수</Label>
                          <Input
                            id="atchPosblFileNumber"
                            type="number"
                            value={formData.atchPosblFileNumber}
                            onChange={(e) => setFormData({...formData, atchPosblFileNumber: parseInt(e.target.value)})}
                            className="text-sm"
                            min="0"
                            max="10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="atchPosblFileSize" className="text-sm font-medium text-gray-700">첨부파일 크기 (MB)</Label>
                          <Input
                            id="atchPosblFileSize"
                            type="number"
                            value={Math.round(formData.atchPosblFileSize / 1024 / 1024)}
                            onChange={(e) => setFormData({...formData, atchPosblFileSize: parseInt(e.target.value) * 1024 * 1024})}
                            className="text-sm"
                            min="1"
                            max="100"
                          />
                        </div>
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
                      <Button onClick={handleSubmit} className="text-sm">
                        {selectedBoard ? '수정' : '등록'}
                      </Button>
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
                      placeholder="게시판 ID, 게시판명으로 검색..."
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
                  <RefreshCw className="w-4 h-4 mr-2" />
                  초기화
                </Button>
              </div>
            </div>
          </div>

          {/* 테이블 영역 - 스크롤 가능한 콘텐츠 */}
          <div className="px-8 py-8 flex-1 overflow-y-auto">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              <DataTable
                data={boards}
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
                emptyMessage="등록된 게시판이 없습니다."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 