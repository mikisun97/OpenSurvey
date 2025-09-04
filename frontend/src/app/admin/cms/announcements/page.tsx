'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { UserInfo, BbsVO, EgovResponseVO, PaginationInfo } from '@/types';
import { bbsAPI } from '@/lib/api';
import { 
  Plus, 
  Search, 
  RotateCcw,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

// ColumnDef 타입 확장
type ColumnDefWithAlignment<TData, TValue> = ColumnDef<TData, TValue> & {
  textAlign?: 'left' | 'right' | 'center';
};

import AdminHeader from '@/components/admin/AdminHeader';
import SystemManagementSidebar from '@/components/admin/SystemManagementSidebar';
import { toast } from 'sonner';
import DataTable from '@/components/ui/DataTable';

export default function AnnouncementsPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const [searchCondition, setSearchCondition] = useState('ALL');
  const [searchUseAt, setSearchUseAt] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('NTT_ID');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  
  // 공지사항 게시물 목록 상태
  const [announcements, setAnnouncements] = useState<BbsVO[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // 공지사항 게시판 ID (게시판 관리에서 생성한 ID)
  const BBS_ID = 'BBSMSTR_000001'; // 공지사항 게시판 ID

  // 디바운싱 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // API 요청 파라미터
  const queryParams = useMemo(() => {
    const params = {
      bbsId: BBS_ID,
      searchKeyword: debouncedSearchKeyword,
      useAt: searchUseAt === 'ALL' ? '' : searchUseAt,
      pageIndex: currentPage,
      pageUnit: rowsPerPage,
      pageSize: rowsPerPage,
      firstIndex: (currentPage - 1) * rowsPerPage,
      lastIndex: currentPage * rowsPerPage,
      recordCountPerPage: rowsPerPage,
      sortField,
      sortOrder
    };
    console.log('API 요청 파라미터:', JSON.stringify(params, null, 2));
    return params;
  }, [debouncedSearchKeyword, searchUseAt, currentPage, rowsPerPage, sortField, sortOrder]);

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

    setUserInfo(user);
  }, [router]);

  // 공지사항 목록 조회
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await bbsAPI.getBbsList(BBS_ID, queryParams);
      const data: EgovResponseVO<{
        resultList: BbsVO[];
        paginationInfo: PaginationInfo;
      }> = response.data;

      console.log('📡 API 응답:', data);

      if (data.resultCode === 'SUCCESS') {
        setAnnouncements(data.data.resultList || []);
        setTotalCount(data.data.paginationInfo.totalRecordCount || 0);
      } else {
        console.error('❌ API 오류:', data.resultMessage);
        toast.error(data.resultMessage);
      }
    } catch (error) {
      console.error('❌ 공지사항 목록 조회 오류:', error);
      toast.error('공지사항 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 데이터 조회 (페이지, 검색조건 변경 시)
  useEffect(() => {
    if (userInfo) {
      fetchAnnouncements();
    }
  }, [userInfo, queryParams]);

  const handleReset = () => {
    setSearchKeyword('');
    setDebouncedSearchKeyword('');
    setSearchCondition('ALL');
    setSearchUseAt('ALL');
    setCurrentPage(1);
  };

  const handleEdit = (announcement: BbsVO) => {
    router.push(`/admin/cms/announcements/edit/${announcement.nttId}`);
  };

  const handleDelete = async (nttId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      // TODO: 실제 삭제 API 호출
      setAnnouncements(prev => prev.filter(item => item.nttId !== nttId));
      toast.success('삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다.');
    }
  };

  // 공지사항 목록용 컬럼 정의
  const columns: ColumnDefWithAlignment<BbsVO, unknown>[] = [
    {
      id: 'no',
      header: 'NO',
      cell: ({ row }) => {
        if (loading || announcements.length === 0) {
          return <span>-</span>;
        }
        
        // 시스템 코드와 동일한 역순 NO 처리
        const no = announcements.length - row.index;
        return <span>{no}</span>;
      },
      enableSorting: false,
    },
    {
      id: 'nttId',
      header: '번호',
      accessorKey: 'nttId',
      cell: ({ row }) => (
        <span className="text-gray-700">{row.original.nttId || '-'}</span>
      ),
    },
    {
      id: 'nttSj',
      header: '제목',
      accessorKey: 'nttSj',
      cell: ({ row }) => (
        <button 
          className="text-orange-600 hover:text-orange-800 underline font-medium text-left"
          onClick={() => router.push(`/admin/cms/announcements/${row.original.nttId}`)}
        >
          {row.original.nttSj}
        </button>
      ),
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
            onClick={() => handleEdit(row.original)}
            className="h-8 px-2"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/cms/announcements/${row.original.nttId}`)}
            className="h-8 px-2"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.original.nttId!)}
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
                  <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
                  <p className="text-sm text-gray-600 mt-1">공지사항 게시물을 관리합니다.</p>
                </div>
                <Button
                  onClick={() => router.push(`/admin/cms/announcements/write`)}
                  className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  새 공지사항 작성
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
                      placeholder="제목, 내용으로 검색..."
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
                data={announcements}
                columns={columns}
                loading={loading}
                onSortChange={(field, order) => {
                  console.log('정렬 변경:', field, order);
                  setSortField(field);
                  setSortOrder(order);
                  setCurrentPage(1); // 정렬 변경 시 첫 페이지로 이동
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
                emptyMessage="등록된 공지사항이 없습니다."
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 