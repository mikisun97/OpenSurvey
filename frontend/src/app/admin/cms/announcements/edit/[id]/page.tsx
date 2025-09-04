'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import TinyMCEEditor from '@/components/ui/TinyMCEEditor';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemManagementSidebar from '@/components/admin/SystemManagementSidebar';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { toast } from 'sonner';

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

interface FormData {
  category: string;
  title: string;
  content: string;
  isPublic: string;
  isNew: string;
}

// 더미 데이터
const dummyAnnouncements: AnnouncementVO[] = [
  {
    id: 1,
    category: '홈페이지',
    title: '2024년 설 연휴 고객센터 운영 안내',
    content: '<p>안녕하세요.</p><p>2024년 설 연휴 기간 동안 고객센터 운영 시간이 변경됩니다.</p><p><strong>운영 시간:</strong></p><ul><li>2월 9일 (금): 09:00 ~ 18:00</li><li>2월 10일 (토) ~ 2월 12일 (월): 휴무</li><li>2월 13일 (화): 정상 운영</li></ul><p>문의사항이 있으시면 연휴 후에 연락주시기 바랍니다.</p><p>감사합니다.</p>',
    isPublic: 'Y',
    isNew: 'Y',
    viewCount: 156,
    registDate: '2024-02-05',
    registUser: '관리자',
    updateDate: '2024-02-05',
    updateUser: '관리자'
  },
  {
    id: 2,
    category: '전체공지',
    title: '시스템 점검 안내',
    content: '시스템 점검이 예정되어 있습니다.',
    isPublic: 'Y',
    isNew: 'N',
    viewCount: 89,
    registDate: '2024-02-01',
    registUser: '시스템관리자',
    updateDate: '2024-02-01',
    updateUser: '시스템관리자'
  }
];

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  
  const [userInfo, setUserInfo] = useState<{ username: string; email: string; role: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    category: '',
    title: '',
    content: '',
    isPublic: 'Y',
    isNew: 'N'
  });

  // 사용자 정보 확인
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUserInfo();
      if (!user || !isAdmin(user)) {
        router.push('/login');
        return;
      }
      setUserInfo(user);
    };
    checkAuth();
  }, [router]);

  // 게시물 데이터 로드
  useEffect(() => {
    const announcement = dummyAnnouncements.find(a => a.id === id);
    if (announcement) {
      setFormData({
        category: announcement.category,
        title: announcement.title,
        content: announcement.content,
        isPublic: announcement.isPublic,
        isNew: announcement.isNew
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('저장되었습니다.');
      router.push('/admin/cms/announcements');
    } catch (error) {
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/cms/announcements');
  };

  const announcement = dummyAnnouncements.find(a => a.id === id);
  
  if (!announcement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">게시물을 찾을 수 없습니다.</h1>
          <Button onClick={() => router.push('/admin/cms/announcements')}>
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
          <div className="max-w-5xl mx-auto p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">공지사항 수정</h1>
              {/* <p className="text-sm text-gray-600 mt-1">공지사항 정보를 수정합니다.</p> */}
            </div>

            {/* 기존 Card 컴포넌트 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>공지사항 수정</span>
                  <span className="text-sm text-red-500">* 표시는 필수 입니다.</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* 제목 */}
                  <div className="flex items-center border-b border-gray-300 bg-gray-50">
                    <div className="w-1/5 font-medium text-gray-700 p-4 border-r border-gray-300">
                      제목 <span className="text-red-500">*</span>
                    </div>
                    <div className="w-4/5 p-4 bg-white">
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="제목을 입력하세요"
                        className="w-full border-0 focus:ring-0 focus:border-0"
                      />
                    </div>
                  </div>

                  {/* 구분과 공개 - 한 줄에 2개 */}
                  <div className="flex items-center border-b border-gray-300">
                    <div className="w-1/5 font-medium text-gray-700 p-4 border-r border-gray-300 bg-gray-50">
                      구분 <span className="text-red-500">*</span>
                    </div>
                    <div className="w-2/5 p-4 bg-white border-r border-gray-300">
                      <Select 
                        value={formData.category} 
                        onValueChange={(value: string) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger className="w-full border-0 focus:ring-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="홈페이지">홈페이지</SelectItem>
                          <SelectItem value="전체공지">전체공지</SelectItem>
                          <SelectItem value="시스템관리">시스템관리</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-1/5 font-medium text-gray-700 p-4 border-r border-gray-300 bg-gray-50">
                      공개 <span className="text-red-500">*</span>
                    </div>
                    <div className="w-1/5 p-4 bg-white">
                      <RadioGroup 
                        value={formData.isPublic} 
                        onValueChange={(value: string) => setFormData({...formData, isPublic: value})}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Y" id="public-y" />
                          <Label htmlFor="public-y">공개</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="N" id="public-n" />
                          <Label htmlFor="public-n">비공개</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* 등록과 조회수 - 한 줄에 2개 */}
                  <div className="flex items-center border-b border-gray-300">
                    <div className="w-1/5 font-medium text-gray-700 p-4 border-r border-gray-300 bg-gray-50">등록</div>
                    <div className="w-2/5 text-sm text-gray-600 p-4 bg-white border-r border-gray-300">
                      {announcement.registUser} ({announcement.registDate})
                    </div>
                    <div className="w-1/5 font-medium text-gray-700 p-4 border-r border-gray-300 bg-gray-50">조회수</div>
                    <div className="w-1/5 text-sm text-gray-600 p-4 bg-white">
                      {announcement.viewCount}건
                    </div>
                  </div>

                  {/* NEW와 수정 - 한 줄에 2개 */}
                  <div className="flex items-center border-b border-gray-300">
                    <div className="w-1/5 font-medium text-gray-700 p-4 border-r border-gray-300 bg-gray-50">
                      NEW <span className="text-red-500">*</span>
                    </div>
                    <div className="w-2/5 p-4 bg-white border-r border-gray-300">
                      <RadioGroup 
                        value={formData.isNew} 
                        onValueChange={(value: string) => setFormData({...formData, isNew: value})}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Y" id="new-y" />
                          <Label htmlFor="new-y">Y</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="N" id="new-n" />
                          <Label htmlFor="new-n">N</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="w-1/5 font-medium text-gray-700 p-4 border-r border-gray-300 bg-gray-50">수정</div>
                    <div className="w-1/5 text-sm text-gray-600 p-4 bg-white">
                      {announcement.updateUser} ({announcement.updateDate})
                    </div>
                  </div>

                  {/* 내용 - 전체 영역 */}
                  <div className="border-b border-gray-300">
                    <div className="font-medium text-gray-700 p-4 border-b border-gray-300 bg-gray-50">
                      내용 <span className="text-red-500">*</span>
                    </div>
                    <div className="p-4 bg-white">
                      <TinyMCEEditor
                        content={formData.content}
                        onChange={(content: string) => setFormData({...formData, content})}
                        placeholder="내용을 입력하세요"
                      />
                    </div>
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    취소
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {saving ? '저장 중...' : '저장'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* KRDS 표준 카드뷰 */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* 카드 헤더 */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">KRDS 표준 게시물 수정</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">KRDS 표준</span>
                    </div>
                  </div>
                </div>

                {/* 카드 내용 */}
                <div className="p-6">
                  <div className="space-y-4">
                    {/* 제목 */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          제목 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="col-span-10">
                        <Input
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="제목을 입력하세요"
                          className="w-full"
                        />
                      </div>
                    </div>

                    {/* 구분과 공개 */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          구분 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="col-span-4">
                        <Select 
                          value={formData.category} 
                          onValueChange={(value: string) => setFormData({...formData, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="홈페이지">홈페이지</SelectItem>
                            <SelectItem value="전체공지">전체공지</SelectItem>
                            <SelectItem value="시스템관리">시스템관리</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          공개 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="col-span-4">
                        <RadioGroup 
                          value={formData.isPublic} 
                          onValueChange={(value: string) => setFormData({...formData, isPublic: value})}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Y" id="krds-public-y" />
                            <Label htmlFor="krds-public-y" className="text-sm">공개</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="N" id="krds-public-n" />
                            <Label htmlFor="krds-public-n" className="text-sm">비공개</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* 등록과 조회수 */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">등록</label>
                      </div>
                      <div className="col-span-4">
                        <div className="text-sm text-gray-600 py-2">
                          {announcement.registUser} ({announcement.registDate})
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">조회수</label>
                      </div>
                      <div className="col-span-4">
                        <div className="text-sm text-gray-600 py-2">
                          {announcement.viewCount}건
                        </div>
                      </div>
                    </div>

                    {/* NEW와 수정 */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NEW <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="col-span-4">
                        <RadioGroup 
                          value={formData.isNew} 
                          onValueChange={(value: string) => setFormData({...formData, isNew: value})}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Y" id="krds-new-y" />
                            <Label htmlFor="krds-new-y" className="text-sm">Y</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="N" id="krds-new-n" />
                            <Label htmlFor="krds-new-n" className="text-sm">N</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">수정</label>
                      </div>
                      <div className="col-span-4">
                        <div className="text-sm text-gray-600 py-2">
                          {announcement.updateUser} ({announcement.updateDate})
                        </div>
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          내용 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="col-span-10">
                        <TinyMCEEditor
                          content={formData.content}
                          onChange={(content: string) => setFormData({...formData, content})}
                          placeholder="내용을 입력하세요"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-4 py-2"
                    >
                      취소
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? '저장 중...' : '저장'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* KRDS 스타일 입력폼 (이미지 참조) */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* 카드 헤더 - 모범 사례 */}
                {/* <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">모범 사례</h3>
                  </div>
                </div> */}

                {/* 카드 내용 */}
                <div className="p-6">
                  <div className="space-y-6">
                    {/* 제목 */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="block text-base font-medium text-gray-700">
                          제목 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="제목을 입력해 주세요."
                        className="w-full h-10 text-base !text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* 구분 */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <label className="block text-base font-medium text-gray-700">
                            구분 <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value: string) => setFormData({...formData, category: value})}
                        >
                          <SelectTrigger className="w-full h-10 !h-10 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="구분을 선택해 주세요." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="홈페이지" className="text-base">홈페이지</SelectItem>
                            <SelectItem value="전체공지" className="text-base">전체공지</SelectItem>
                            <SelectItem value="시스템관리" className="text-base">시스템관리</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700">조회수</label>
                        <div className="text-base text-gray-600 py-2 px-3 bg-gray-50 rounded-md border border-gray-300">
                          {announcement.viewCount}건
                        </div>
                      </div>
                    </div>

                    {/* 공개 여부 */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <label className="block text-base font-medium text-gray-700">
                            공개 <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <RadioGroup 
                          value={formData.isPublic} 
                          onValueChange={(value: string) => setFormData({...formData, isPublic: value})}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="Y" id="krds-style-public-y" className="w-5 h-5" />
                            <Label htmlFor="krds-style-public-y" className="text-base">공개</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="N" id="krds-style-public-n" className="w-5 h-5" />
                            <Label htmlFor="krds-style-public-n" className="text-base">비공개</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      {/* NEW 여부 */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <label className="block text-base font-medium text-gray-700">
                            NEW <span className="text-red-500">*</span>
                          </label>
                        </div>
                        <RadioGroup 
                          value={formData.isNew} 
                          onValueChange={(value: string) => setFormData({...formData, isNew: value})}
                          className="flex space-x-6"
                        >
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="Y" id="krds-style-new-y" className="w-5 h-5" />
                            <Label htmlFor="krds-style-new-y" className="text-base">Y</Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value="N" id="krds-style-new-n" className="w-5 h-5" />
                            <Label htmlFor="krds-style-new-n" className="text-base">N</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* 등록 정보 */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700">등록</label>
                        <div className="text-base text-gray-600 py-2 px-3 bg-gray-50 rounded-md border border-gray-300 ">
                          {announcement.registUser} ({announcement.registDate})
                        </div>
                      </div>
                      {/* 수정 정보 */}
                      <div className="space-y-2">
                        <label className="block text-base font-medium text-gray-700">수정</label>
                        <div className="text-base text-gray-600 py-2 px-3 bg-gray-50 rounded-md border border-gray-300">
                          {announcement.updateUser} ({announcement.updateDate})
                        </div>
                      </div>
                    </div>

                    {/* 내용 */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <label className="block text-base font-medium text-gray-700">
                          내용 <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <TinyMCEEditor
                        content={formData.content}
                        onChange={(content: string) => setFormData({...formData, content})}
                        placeholder="내용을 입력해 주세요."
                      />
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-2 h-10 text-base border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      취소
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 h-10 text-base bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {saving ? '저장 중...' : '저장'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 