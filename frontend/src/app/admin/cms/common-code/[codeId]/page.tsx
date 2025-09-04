'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { commonCodeAPI } from '@/lib/api';
import { UserInfo, CommonCodeVO, CommonCodeDetailVO, CommonCodeSearchVO } from '@/types';
import { ArrowLeft, Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { toast } from 'sonner';

export default function CommonCodeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const codeId = params.codeId as string;
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [commonCode, setCommonCode] = useState<CommonCodeVO | null>(null);
  const [detailCodes, setDetailCodes] = useState<CommonCodeDetailVO[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<CommonCodeDetailVO | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    codeNm: '',
    codeDc: '',
    useAt: 'Y',
    codeOrder: 0
  });

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
    setLoading(false);
    loadCommonCode();
    loadDetailCodes();
  }, [router, codeId]);

  const loadCommonCode = async () => {
    try {
      const response = await commonCodeAPI.getDetail(codeId);
      if (response.data.resultCode === 'SUCCESS') {
        setCommonCode(response.data.data);
      }
    } catch (error) {
      console.error('공통코드 조회 실패:', error);
    }
  };

  const loadDetailCodes = async () => {
    try {
      const searchVO: CommonCodeSearchVO = {
        codeId,
        pageIndex: 1,
        pageUnit: 100,
        pageSize: 100,
        firstIndex: 0,
        lastIndex: 1,
        recordCountPerPage: 100
      };

      const response = await commonCodeAPI.getDetailList(codeId, searchVO);
      if (response.data.resultCode === 'SUCCESS') {
        setDetailCodes(response.data.data || []);
      }
    } catch (error) {
      console.error('세부코드 목록 조회 실패:', error);
    }
  };

  const handleCreate = () => {
    setFormData({
      code: '',
      codeNm: '',
      codeDc: '',
      useAt: 'Y',
      codeOrder: detailCodes.length + 1
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (detail: CommonCodeDetailVO) => {
    setSelectedDetail(detail);
    setFormData({
      code: detail.code,
      codeNm: detail.codeNm,
      codeDc: detail.codeDc || '',
      useAt: detail.useAt,
      codeOrder: detail.codeOrder
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (code: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await commonCodeAPI.deleteDetail(codeId, code);
      toast.success('삭제되었습니다.');
      loadDetailCodes();
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditDialogOpen && selectedDetail) {
        await commonCodeAPI.updateDetail(codeId, selectedDetail.code, formData);
        toast.success('수정되었습니다.');
      } else {
        await commonCodeAPI.createDetail(codeId, formData);
        toast.success('등록되었습니다.');
      }
      
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      loadDetailCodes();
    } catch (error) {
      console.error('저장 실패:', error);
      toast.error('저장에 실패했습니다.');
    }
  };

  const moveSortOrder = async (code: string, direction: 'up' | 'down') => {
    const currentIndex = detailCodes.findIndex(d => d.code === code);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= detailCodes.length) return;

    const currentCode = detailCodes[currentIndex];
    const targetCode = detailCodes[newIndex];

    try {
      // 순서 변경 로직 (실제로는 백엔드에서 처리)
      const tempCodeOrder = currentCode.codeOrder;
      currentCode.codeOrder = targetCode.codeOrder;
      targetCode.codeOrder = tempCodeOrder;

      // 백엔드 API 호출하여 순서 업데이트
      await commonCodeAPI.updateDetail(codeId, currentCode.code, currentCode);
      await commonCodeAPI.updateDetail(codeId, targetCode.code, targetCode);

      loadDetailCodes();
    } catch (error) {
      console.error('순서 변경 실패:', error);
      toast.error('순서 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
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
                  {commonCode?.codeIdNm || '공통코드 상세'}
                </h1>
                <p className="text-sm text-gray-600">
                  {commonCode?.codeId} - {commonCode?.codeIdDc}
                </p>
              </div>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center" onClick={handleCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  새 세부코드 등록
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>새 세부코드 등록</DialogTitle>
                  <DialogDescription>
                    새로운 세부코드를 등록합니다.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="code">코드</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value})}
                      placeholder="예: ACTIVE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="codeNm">코드명</Label>
                    <Input
                      id="codeNm"
                      value={formData.codeNm}
                      onChange={(e) => setFormData({...formData, codeNm: e.target.value})}
                      placeholder="예: 활성"
                    />
                  </div>
                  <div>
                    <Label htmlFor="codeDc">설명</Label>
                    <Input
                      id="codeDc"
                      value={formData.codeDc}
                      onChange={(e) => setFormData({...formData, codeDc: e.target.value})}
                      placeholder="세부코드에 대한 설명"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">정렬 순서</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.codeOrder}
                      onChange={(e) => setFormData({...formData, codeOrder: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="useAt">사용 여부</Label>
                    <select
                      id="useAt"
                      value={formData.useAt}
                      onChange={(e) => setFormData({...formData, useAt: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="Y">사용</option>
                      <option value="N">미사용</option>
                    </select>
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
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 세부코드 목록 */}
        <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">세부코드 목록</h3>
            <p className="text-sm text-gray-600 mt-1">
              {commonCode?.codeIdNm}의 세부코드를 관리합니다.
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {detailCodes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  등록된 세부코드가 없습니다.
                </div>
              ) : (
                detailCodes.map((detail, index) => (
                  <div key={detail.code} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-500 w-8">
                        {detail.codeOrder}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{detail.code}</h4>
                        <p className="text-sm text-gray-600">{detail.codeNm}</p>
                        {detail.codeDc && (
                          <p className="text-xs text-gray-500 mt-1">{detail.codeDc}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        detail.useAt === 'Y' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {detail.useAt === 'Y' ? '사용' : '미사용'}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => moveSortOrder(detail.code, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => moveSortOrder(detail.code, 'down')}
                        disabled={index === detailCodes.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(detail)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(detail.code)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 수정 다이얼로그 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>세부코드 수정</DialogTitle>
              <DialogDescription>
                세부코드 정보를 수정합니다.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="editCode">코드</Label>
                <Input
                  id="editCode"
                  value={formData.code}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="editCodeNm">코드명</Label>
                <Input
                  id="editCodeNm"
                  value={formData.codeNm}
                  onChange={(e) => setFormData({...formData, codeNm: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editCodeDc">설명</Label>
                <Input
                  id="editCodeDc"
                  value={formData.codeDc}
                  onChange={(e) => setFormData({...formData, codeDc: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editSortOrder">정렬 순서</Label>
                <Input
                  id="editSortOrder"
                  type="number"
                  value={formData.codeOrder}
                  onChange={(e) => setFormData({...formData, codeOrder: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="editUseAt">사용 여부</Label>
                <select
                  id="editUseAt"
                  value={formData.useAt}
                  onChange={(e) => setFormData({...formData, useAt: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSubmit}>수정</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
} 