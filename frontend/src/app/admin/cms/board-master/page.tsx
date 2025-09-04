'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import AdminHeader from '@/components/admin/AdminHeader';
import DynamicSidebar from '@/components/admin/DynamicSidebar';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { BbsMstVO } from '@/types';
import { Plus, Search, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import DataTable from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useBbsMstList, useDeleteBbsMst } from '@/hooks/useApi';

// ColumnDef 타입 확장
type ColumnDefWithAlignment<TData, TValue> = ColumnDef<TData, TValue> & {
  textAlign?: 'left' | 'right' | 'center';
};



export default function BoardMasterPage() {
  const router = useRouter();



  // 검색 및 페이징 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const [searchUseAt, setSearchUseAt] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('bbsId');
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
  const { data: bbsMstData, isLoading } = useBbsMstList(queryParams);

  // 공통코드와 동일한 방식으로 데이터 접근
  const boards = bbsMstData?.data || [];
  const totalRows = bbsMstData?.paginationInfo?.totalRecordCount || 0;

  const deleteMutation = useDeleteBbsMst();

  // 권한 체크
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


    
    // 게시판 타입 코드 로드
    // loadBoardTypeCodes(); // 이 부분은 더 이상 필요 없음
  }, [router]);

  // 게시판 마스터 목록 조회
  // useEffect(() => {
  //   if (userInfo) {
  //     fetchBbsMstList();
  //   }
  // }, [userInfo, queryParams]); // 이 부분은 React Query 훅으로 대체됨

  const handleReset = () => {
    setSearchKeyword('');
    setDebouncedSearchKeyword('');
    setSearchUseAt('ALL');
    setCurrentPage(1);
  };



  const handleDelete = async (bbsId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteMutation.mutateAsync(bbsId);
      toast.success('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다.');
    }
  };



  // 게시판 마스터 목록용 컬럼 정의
  const columns: ColumnDefWithAlignment<BbsMstVO, unknown>[] = [
    {
      id: 'no',
      header: 'NO',
      cell: ({ row }) => {
        if (isLoading || boards.length === 0) {
          return <span>-</span>;
        }
        
        // 시스템 코드와 동일한 역순 NO 처리
        const no = boards.length - row.index;
        return <span>{no}</span>;
      },
      enableSorting: false,
    },
    {
      id: 'bbsId',
      header: '게시판 ID',
      accessorKey: 'bbsId',
      cell: ({ row }) => (
        <button 
          className="text-orange-600 hover:text-orange-800 underline font-medium"
          onClick={() => router.push(`/admin/cms/board-master/edit/${row.original.bbsId}`)}
        >
          {row.original.bbsId}
        </button>
      ),
    },
    {
      id: 'bbsNm',
      header: '게시판명',
      accessorKey: 'bbsNm',
      cell: ({ row }) => (
        <span className="text-gray-900">{row.original.bbsNm}</span>
      ),
    },

    {
      id: 'bbsTyCode',
      header: '게시판 유형',
      accessorKey: 'bbsTyCode',
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
      id: 'replyPosblAt',
      header: '답글가능',
      accessorKey: 'replyPosblAt',
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
      id: 'fileAtchPosblAt',
      header: '파일첨부',
      accessorKey: 'fileAtchPosblAt',
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
      id: 'useAt',
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
      id: 'frstRegistPnttm',
      header: '등록일',
      accessorKey: 'frstRegistPnttm',
      cell: ({ row }) => {
        const date = row.original.frstRegistPnttm ? new Date(row.original.frstRegistPnttm).toLocaleDateString() : '-';
        const user = row.original.frstRegisterId ? `(${row.original.frstRegisterId})` : '';
        return `${date} ${user}`;
      },
    },
    {
      id: 'actions',
      header: '관리',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('수정 버튼 클릭 - 게시판 ID:', row.original.bbsId);
              router.push(`/admin/cms/board-master/edit/${row.original.bbsId}`);
            }}
            className="text-xs px-2 py-1"
          >
            수정
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.bbsId)}
            className="text-xs px-2 py-1 text-red-600 hover:text-red-800"
          >
            삭제
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
                  <h1 className="text-2xl font-bold text-gray-900">게시판 관리</h1>
                </div>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm text-sm"
                  onClick={() => router.push('/admin/cms/board-master/write')}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  새 게시판 등록
                </Button>
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