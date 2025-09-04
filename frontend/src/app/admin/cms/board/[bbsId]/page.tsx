'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminHeader from '@/components/admin/AdminHeader';
import DynamicSidebar from '@/components/admin/DynamicSidebar';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { bbsAPI } from '@/lib/api';
import { BbsVO } from '@/types';
import { Plus, Search, RefreshCw, Paperclip } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useBbsMstDetail, useBbsList } from '@/hooks/useApi';


// ColumnDef 타입 확장
type ColumnDefWithAlignment<TData, TValue> = ColumnDef<TData, TValue> & {
  textAlign?: 'left' | 'right' | 'center';
};

export default function BoardListPage() {
  const router = useRouter();
  const params = useParams();
  const bbsId = params.bbsId as string;
  


  // 검색 및 페이징 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const [searchExposureYn, setSearchExposureYn] = useState('ALL');
  const [searchCategory, setSearchCategory] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('frstRegistPnttm');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // 구분 코드 관련 상태
  const [categoryDetailCodes, setCategoryDetailCodes] = useState<Array<{value: string, label: string}>>([]);

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
      searchExposureYn: searchExposureYn !== 'ALL' ? searchExposureYn : undefined,
      searchCategory: searchCategory !== 'ALL' ? searchCategory : undefined
    };
    console.log('API 요청 파라미터:', JSON.stringify(params, null, 2));
    return params;
  }, [debouncedSearchKeyword, searchExposureYn, searchCategory, currentPage, rowsPerPage, sortField, sortOrder]);

  // React Query 훅 사용
  const { data: boardInfoData, isLoading: boardInfoIsLoading } = useBbsMstDetail(bbsId);
  const { data: boardListData, isLoading: boardListIsLoading } = useBbsList(bbsId, queryParams);

  // 공통코드와 동일한 방식으로 데이터 접근
  const boardInfo = boardInfoData?.data || null;
  const boardList = boardListData?.data || [];
  const totalCount = boardListData?.paginationInfo?.totalRecordCount || 0;

  // 게시판 정보 로드 후 구분 코드 상세 정보 로드
  useEffect(() => {
    if (boardInfo?.categoryCodeId) {
      loadCategoryCodes(boardInfo.categoryCodeId);
    }
  }, [boardInfo?.categoryCodeId]);

  // 구분 코드 상세 정보 로드
  const loadCategoryCodes = async (categoryCodeId: string) => {
    try {
      const response = await bbsAPI.getCategoryCodeDetails(categoryCodeId);
      if (response.data.resultCode === 'SUCCESS') {
        setCategoryDetailCodes(response.data.data || []);
      }
    } catch (error) {
      console.error('구분 코드 상세 정보 로드 오류:', error);
    }
  };

  // 로딩 상태 통합
  const isLoading = boardInfoIsLoading || boardListIsLoading;

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


  }, [router]);

  const handleReset = () => {
    setSearchKeyword('');
    setDebouncedSearchKeyword('');
    setSearchExposureYn('ALL');
    setSearchCategory('ALL');
    setCurrentPage(1);
  };







  // 게시물 목록용 컬럼 정의 (구분 사용 여부에 따라 동적 생성)
  const columns: ColumnDefWithAlignment<BbsVO, unknown>[] = useMemo(() => {
    const baseColumns: ColumnDefWithAlignment<BbsVO, unknown>[] = [
      {
        id: 'no',
        header: 'NO',
        cell: ({ row }) => {
          if (isLoading || boardList.length === 0) {
            return <span>-</span>;
          }
          
          // 시스템 코드와 동일한 역순 NO 처리
          const no = totalCount - ((currentPage - 1) * rowsPerPage + row.index);
          return <span>{no}</span>;
        },
        enableSorting: false,
      },
      {
        id: 'nttSj',
        header: '제목',
        accessorKey: 'nttSj',
        cell: ({ row }) => {
          const hasFiles = row.original.atchFileId && row.original.fileList && row.original.fileList.length > 0;
          
          return (
            <button 
              className="text-orange-600 hover:text-orange-800 underline font-medium text-left flex items-center space-x-2 max-w-md"
              onClick={() => router.push(`/admin/cms/board/${bbsId}/${row.original.nttId}`)}
              title={row.original.nttSj} // 호버 시 전체 제목 표시
            >
              <span className="truncate">{row.original.nttSj}</span>
              {hasFiles && (
                <Paperclip className="w-3 h-3 text-gray-500 flex-shrink-0" />
              )}
            </button>
          );
        },
      },
      {
        id: 'ntcrnNm',
        header: '작성자',
        accessorKey: 'ntcrnNm',
        cell: ({ row }) => (
          <span className="text-gray-900">{row.original.ntcrnNm || '-'}</span>
        ),
      },
      {
        id: 'rdcnt',
        header: '조회수',
        accessorKey: 'rdcnt',
        cell: ({ row }) => (
          <span className="text-gray-700">{row.original.rdcnt || 0}</span>
        ),
      },
      {
        id: 'ntceAt',
        header: '공지여부',
        accessorKey: 'ntceAt',
        cell: ({ row }) => (
          <span className={`text-xs px-2 py-1 rounded ${
            row.original.ntceAt === 'Y' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {row.original.ntceAt === 'Y' ? '공지' : '일반'}
          </span>
        ),
      },
    ];

    // 구분을 사용하는 게시판인 경우에만 구분 컬럼 추가
    if (boardInfo?.categoryCodeId) {
      baseColumns.push({
        id: 'nttCategory',
        header: '구분',
        accessorKey: 'nttCategory',
        cell: ({ row }) => {
          const categoryCode = row.original.nttCategory;
          if (!categoryCode) {
            return <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">구분 없음</span>;
          }
          
          // 구분 코드를 구분명으로 변환
          const category = categoryDetailCodes.find(cat => cat.value === categoryCode);
          const categoryLabel = category ? category.label : categoryCode;
          
          return (
            <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
              {categoryLabel}
            </span>
          );
        },
      });
    }

    // 나머지 컬럼들 추가
    baseColumns.push(
      {
        id: 'exposureYn',
        header: '공개여부',
        accessorKey: 'exposureYn',
        cell: ({ row }) => (
          <span className={`text-xs px-2 py-1 rounded ${
            row.original.exposureYn === 'Y' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {row.original.exposureYn === 'Y' ? '공개' : '비공개'}
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
      }
    );

    return baseColumns;
  }, [boardInfo?.categoryCodeId, categoryDetailCodes, isLoading, boardList.length, totalCount, currentPage, rowsPerPage]);

  if (boardInfoIsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">게시판 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
                  <h1 className="text-2xl font-bold text-gray-900">
                    {boardInfo?.bbsNm || '게시판'} 관리
                  </h1>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => router.push(`/admin/cms/board/${bbsId}/write`)}
                    className="text-sm bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    게시물 작성
                  </Button>
                </div>
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
                      placeholder="제목, 내용으로 검색..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>
                <Select value={searchExposureYn} onValueChange={(value: string) => setSearchExposureYn(value)}>
                  <SelectTrigger className="w-32 text-sm">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-sm">전체</SelectItem>
                    <SelectItem value="Y" className="text-sm">공개</SelectItem>
                    <SelectItem value="N" className="text-sm">비공개</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* 구분 필터 - 게시판에서 구분을 사용하는 경우에만 표시 */}
                {boardInfo?.categoryCodeId && (
                  <Select value={searchCategory} onValueChange={(value: string) => setSearchCategory(value)}>
                    <SelectTrigger className="w-32 text-sm">
                      <SelectValue placeholder="전체" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL" className="text-sm">전체</SelectItem>
                      {categoryDetailCodes.map((category) => (
                        <SelectItem key={category.value} value={category.value} className="text-sm">
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
                data={boardList}
                columns={columns}
                loading={isLoading}
                onSortChange={(field, order) => {
                  console.log('정렬 변경:', field, order);
                  setSortField(field);
                  setSortOrder(order);
                  // setCurrentPage(1) 제거 - 정렬만 변경
                }}
                sortField={sortField}
                sortOrder={sortOrder}
                serverSidePagination={true}
                totalRows={totalCount}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newPageSize) => {
                  setRowsPerPage(newPageSize);
                  setCurrentPage(1);
                }}
                pageSizeOptions={[10, 20, 50]}
                showPagination={true}
                emptyMessage="등록된 게시물이 없습니다."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 