'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AdminHeader from '@/components/admin/AdminHeader';
import SystemManagementSidebar from '@/components/admin/SystemManagementSidebar';
import TinyMCEEditor from '@/components/ui/TinyMCEEditor';
import { getUserInfo } from '@/lib/auth';
import { toast } from 'sonner';

interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: string;
}

export default function WriteAnnouncementPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '홈페이지',
    isPublic: 'Y',
    isNew: 'N',
    content: ''
  });

  useEffect(() => {
    const user = getUserInfo();
    if (!user) {
      router.push('/login');
      return;
    }
    setUserInfo(user);
  }, [router]);

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
      // TODO: API 호출로 게시물 저장
      console.log('저장할 데이터:', formData);
      toast.success('게시물이 저장되었습니다.');
      router.push('/admin/cms/announcements');
    } catch (error) {
      console.error('저장 중 오류:', error);
      toast.error('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('작성을 취소하시겠습니까?')) {
      router.push('/admin/cms/announcements');
    }
  };

  if (!userInfo) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <SystemManagementSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">공지사항 작성</h1>
              <p className="text-sm text-gray-600 mt-1">새로운 공지사항을 작성합니다.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>공지사항 작성</span>
                  <span className="text-sm text-red-500">* 표시는 필수 입니다.</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 제목 */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    제목 <span className="text-red-500">*</span>
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="제목을 입력하세요"
                      className="w-full"
                    />
                  </div>
                </div>

                {/* 구분 */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    구분 <span className="text-red-500">*</span>
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={formData.category} 
                      onValueChange={(value: string) => setFormData({...formData, category: value})}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="홈페이지">홈페이지</SelectItem>
                        <SelectItem value="전체공지">전체공지</SelectItem>
                        <SelectItem value="시스템관리">시스템관리</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 공개 여부 */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-sm font-medium text-gray-700">
                    공개 <span className="text-red-500">*</span>
                  </Label>
                  <div className="col-span-3">
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

                {/* 등록 정보 */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-sm font-medium text-gray-700">등록</Label>
                  <div className="col-span-3 text-sm text-gray-600">
                    {userInfo.username} ({new Date().toLocaleDateString('ko-KR')} {new Date().toLocaleTimeString('ko-KR')})
                  </div>
                </div>

                {/* 조회수 */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-sm font-medium text-gray-700">조회수</Label>
                  <div className="col-span-3 text-sm text-gray-600">
                    0건
                  </div>
                </div>

                {/* NEW */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-sm font-medium text-gray-700">
                    NEW <span className="text-red-500">*</span>
                  </Label>
                  <div className="col-span-3">
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
                </div>

                {/* 수정 정보 */}
                <div className="grid grid-cols-4 gap-4 items-center">
                  <Label className="text-sm font-medium text-gray-700">수정</Label>
                  <div className="col-span-3 text-sm text-gray-600">
                    -
                  </div>
                </div>

                {/* 내용 */}
                <div className="grid grid-cols-4 gap-4 items-start">
                  <Label className="text-sm font-medium text-gray-700 mt-2">
                    내용 <span className="text-red-500">*</span>
                  </Label>
                  <div className="col-span-3">
                    <TinyMCEEditor
                      content={formData.content}
                      onChange={(content) => setFormData({...formData, content})}
                      placeholder="내용을 입력하세요"
                    />
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex justify-end space-x-3 pt-6 border-t">
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
          </div>
        </main>
      </div>
    </div>
  );
} 