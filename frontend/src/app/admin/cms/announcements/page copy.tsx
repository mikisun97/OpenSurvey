'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { UserInfo } from '@/types';
import { 
  Plus, 
  Search, 
  RotateCcw, 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye
} from 'lucide-react';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemManagementSidebar from '@/components/admin/SystemManagementSidebar';
import AnnouncementTable from '@/components/admin/AnnouncementTable';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import TinyMCEEditor from '@/components/ui/TinyMCEEditor';

// 더미 데이터 타입 정의
interface AnnouncementVO {
  id: number;
  category: string;
  title: string;
  content: string;
  isPublic: string;
  isNew: string;
  viewCount: number;
  registDate: string;
  registUser: string;
  updateDate: string;
  updateUser: string;
}

// 더미 데이터
const dummyAnnouncements: AnnouncementVO[] = [
  {
    id: 1,
    category: '전체공지',
    title: '6월 공지 내용입니다.',
    content: '6월 공지 내용입니다. 시스템 점검 및 업데이트 관련 안내드립니다.',
    isPublic: 'Y',
    isNew: 'N',
    viewCount: 7,
    registDate: '2024-06-28 10:08:37',
    registUser: '(주) 엠브레인',
    updateDate: '2024-08-26 19:29:37',
    updateUser: '(주) 엠브레인'
  },
  {
    id: 2,
    category: '시스템관리',
    title: '2월 공지사항입니다',
    content: '2월 공지사항입니다. 새로운 기능 추가 및 개선사항 안내드립니다.',
    isPublic: 'Y',
    isNew: 'N',
    viewCount: 3,
    registDate: '2025-02-10 17:35:14',
    registUser: '(주) 엠브레인',
    updateDate: '2025-02-10 17:36:42',
    updateUser: '(주) 엠브레인'
  },
  {
    id: 3,
    category: '시스템관리',
    title: '시스템 점검 안내',
    content: '정기 시스템 점검을 실시합니다. 점검 시간 동안 서비스 이용이 제한될 수 있습니다.',
    isPublic: 'Y',
    isNew: 'Y',
    viewCount: 12,
    registDate: '2025-01-15 09:00:00',
    registUser: '시스템관리자',
    updateDate: '2025-01-15 09:00:00',
    updateUser: '시스템관리자'
  },
  {
    id: 4,
    category: '전체공지',
    title: '신년 인사',
    content: '새해 복 많이 받으세요. 올해도 좋은 서비스로 보답하겠습니다.',
    isPublic: 'Y',
    isNew: 'N',
    viewCount: 25,
    registDate: '2025-01-01 00:00:00',
    registUser: '관리자',
    updateDate: '2025-01-01 00:00:00',
    updateUser: '관리자'
  }
];

export default function AnnouncementsPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [publicFilter, setPublicFilter] = useState('ALL');
  const [newFilter, setNewFilter] = useState('ALL');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementVO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    category: '전체공지',
    title: '',
    content: '',
    isPublic: 'Y',
    isNew: 'N'
  });

  // 디바운싱 효과
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    return dummyAnnouncements.filter(item => {
      const matchesSearch = !debouncedSearchKeyword || 
        item.title.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
        item.content.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
        item.registUser.toLowerCase().includes(debouncedSearchKeyword.toLowerCase()) ||
        item.updateUser.toLowerCase().includes(debouncedSearchKeyword.toLowerCase());
      
      const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesPublic = publicFilter === 'ALL' || item.isPublic === publicFilter;
      const matchesNew = newFilter === 'ALL' || item.isNew === newFilter;
      
      return matchesSearch && matchesCategory && matchesPublic && matchesNew;
    });
  }, [debouncedSearchKeyword, categoryFilter, publicFilter, newFilter]);

  // 페이지네이션
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

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
    setCategoryFilter('ALL');
    setPublicFilter('ALL');
    setNewFilter('ALL');
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setFormData({
      category: '전체공지',
      title: '',
      content: '',
      isPublic: 'Y',
      isNew: 'N'
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (announcement: AnnouncementVO) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      category: announcement.category,
      title: announcement.title,
      content: announcement.content,
      isPublic: announcement.isPublic,
      isNew: announcement.isNew
    });
    setIsViewMode(false);
    setIsDrawerOpen(true);
  };

  const handleView = (announcement: AnnouncementVO) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      category: announcement.category,
      title: announcement.title,
      content: announcement.content,
      isPublic: announcement.isPublic,
      isNew: announcement.isNew
    });
    setIsViewMode(true);
    setIsDrawerOpen(true);
  };

  const handleEditPage = (announcement: AnnouncementVO) => {
    router.push(`/admin/cms/announcements/edit/${announcement.id}`);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    alert('삭제되었습니다. (더미 데이터)');
  };

  const handleSubmit = async () => {
    try {
      if (selectedAnnouncement) {
        alert('수정되었습니다. (더미 데이터)');
      } else {
        alert('등록되었습니다. (더미 데이터)');
      }
      
      setIsCreateDialogOpen(false);
      setIsDrawerOpen(false);
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 공통 헤더 */}
      <AdminHeader />

      <div className="flex pt-16">
        {/* 좌측 사이드바 - 시스템 관리 */}
        <SystemManagementSidebar />

        {/* 메인 콘텐츠 */}
        <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)]">
          <div className="space-y-6">
            {/* 상단 헤더 + 검색/필터 섹션 */}
            <div className="bg-white border-b border-gray-300">
              {/* 타이틀 부분 */}
              <div className="px-8 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">공지사항</h1>
                  </div>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
                        onClick={handleCreate}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        + 등록
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>새 공지사항 등록</DialogTitle>
                        <DialogDescription>
                          새로운 공지사항을 등록합니다.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="category">구분</Label>
                            <Select value={formData.category} onValueChange={(value: string) => setFormData({...formData, category: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="전체공지">전체공지</SelectItem>
                                <SelectItem value="시스템관리">시스템관리</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="isPublic">공개</Label>
                            <Select value={formData.isPublic} onValueChange={(value: string) => setFormData({...formData, isPublic: value})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Y">공개</SelectItem>
                                <SelectItem value="N">비공개</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="title">제목</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="공지사항 제목을 입력하세요"
                          />
                        </div>
                        <div>
                          <Label htmlFor="content">내용</Label>
                          <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            placeholder="공지사항 내용을 입력하세요"
                            className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none"
                          />
                        </div>
                        <div>
                          <Label htmlFor="isNew">NEW</Label>
                          <Select value={formData.isNew} onValueChange={(value: string) => setFormData({...formData, isNew: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Y">NEW</SelectItem>
                              <SelectItem value="N">일반</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          취소
                        </Button>
                        <Button onClick={handleSubmit}>등록</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* 검색/필터 부분 */}
              <div className="px-8 py-4">
                <div className="flex items-center space-x-4">
                  <Select value={categoryFilter} onValueChange={(value: string) => setCategoryFilter(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="구분" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">전체</SelectItem>
                      <SelectItem value="전체공지">전체공지</SelectItem>
                      <SelectItem value="시스템관리">시스템관리</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={publicFilter} onValueChange={(value: string) => setPublicFilter(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="공개" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">전체</SelectItem>
                      <SelectItem value="Y">공개</SelectItem>
                      <SelectItem value="N">비공개</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newFilter} onValueChange={(value: string) => setNewFilter(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="NEW" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">전체</SelectItem>
                      <SelectItem value="Y">NEW</SelectItem>
                      <SelectItem value="N">일반</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="제목/내용/등록자/수정자"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    초기화
                  </Button>
                </div>
              </div>
            </div>

            {/* 결과 요약 및 액션 버튼 */}
            <div className="px-8">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  총 {totalRows}건이 조회 되었습니다.
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={rowsPerPage.toString()} onValueChange={(value: string) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 테이블 영역 */}
            <div className="px-8">
              <AnnouncementTable
                data={paginatedData}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onEditPage={handleEditPage}
              />

              {/* 페이지네이션 */}
              {totalRows > 0 && (
                <div className="bg-white border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-700">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="!w-[800px] !sm:w-[800px] !max-w-[85vw]">
          <SheetHeader className="pb-6 border-b border-gray-200 px-8">
            <SheetTitle className="text-xl font-semibold text-gray-900">
              {isViewMode ? '공지사항 조회' : '공지사항 수정'}
            </SheetTitle>
          </SheetHeader>
                    <div className="py-6 px-8 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="drawerCategory" className="text-sm font-medium text-gray-700">구분</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: string) => setFormData({...formData, category: value})}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체공지">전체공지</SelectItem>
                    <SelectItem value="시스템관리">시스템관리</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="drawerIsPublic" className="text-sm font-medium text-gray-700">공개</Label>
                <Select 
                  value={formData.isPublic} 
                  onValueChange={(value: string) => setFormData({...formData, isPublic: value})}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">공개</SelectItem>
                    <SelectItem value="N">비공개</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="drawerTitle" className="text-sm font-medium text-gray-700">제목</Label>
              <Input
                id="drawerTitle"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="공지사항 제목을 입력하세요"
                readOnly={isViewMode}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="drawerContent" className="text-sm font-medium text-gray-700">내용</Label>
              <TinyMCEEditor
                content={formData.content}
                onChange={(content) => setFormData({...formData, content})}
                placeholder="공지사항 내용을 입력하세요"
                readOnly={isViewMode}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="drawerIsNew" className="text-sm font-medium text-gray-700">NEW</Label>
              <Select 
                value={formData.isNew} 
                onValueChange={(value: string) => setFormData({...formData, isNew: value})}
                disabled={isViewMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">NEW</SelectItem>
                  <SelectItem value="N">일반</SelectItem>
                </SelectContent>
              </Select>
            </div>
          
          {!isViewMode && (
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200 px-8">
              <Button 
                variant="outline" 
                onClick={() => setIsDrawerOpen(false)}
                className="px-6"
              >
                취소
              </Button>
              <Button 
                onClick={handleSubmit}
                className="px-6 bg-orange-600 hover:bg-orange-700"
              >
                {selectedAnnouncement ? '수정' : '등록'}
              </Button>
            </div>
          )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 