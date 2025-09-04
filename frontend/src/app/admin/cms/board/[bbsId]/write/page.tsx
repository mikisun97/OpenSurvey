'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import TinyMCEEditor from '@/components/ui/TinyMCEEditor';
import AdminHeader from '@/components/admin/AdminHeader';
import DynamicSidebar from '@/components/admin/DynamicSidebar';
import { getUserInfo, isAdmin } from '@/lib/auth';
import { bbsAPI } from '@/lib/api';
import { UserInfo, BbsVO, BbsMstVO } from '@/types';
import { useCreateBbs } from '@/hooks/useApi';
import { 
  Save, 
  ArrowLeft
} from 'lucide-react';
import { FileItem } from '@/components/ui/FileUpload';
import { ImageItem } from '@/components/ui/SortableImageGrid';
import RepresentativeImageUpload from '@/components/board/RepresentativeImageUpload';
import MainImageUpload from '@/components/board/MainImageUpload';
import MultiImageUpload from '@/components/board/MultiImageUpload';
import AttachmentUpload from '@/components/board/AttachmentUpload';
import { toast } from 'sonner';

// 기본 유효성 검사 스키마 정의
const createBoardFormSchema = (showCategoryField: boolean) => z.object({
  nttSj: z.string().min(1, '제목을 입력해주세요.').max(200, '제목은 200자 이하로 입력해주세요.'),
  nttCn: z.string().optional(), // 내용은 선택사항
  ntceAt: z.enum(['Y', 'N']).default('N'),
  exposureYn: z.enum(['Y', 'N']).default('Y'),
  categoryCode: showCategoryField 
    ? z.string().min(1, '구분을 선택해주세요.')
    : z.string().optional(),
  representImage: z.any().optional(),
  mainImage: z.any().optional(),
  representImageId: z.string().optional().or(z.literal('')),
  representImageName: z.string().optional().or(z.literal('')),
  mainImageId: z.string().optional().or(z.literal('')),
  mainImageName: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<ReturnType<typeof createBoardFormSchema>>;

export default function BoardWritePage() {
  const router = useRouter();
  const params = useParams();
  const bbsId = params.bbsId as string;
  const createBbsMutation = useCreateBbs();
  
  // 구분 코드 관련 상태 (useForm보다 먼저 선언)
  const [categoryDetailCodes, setCategoryDetailCodes] = useState<Array<{value: string, label: string}>>([]);
  const [showCategoryField, setShowCategoryField] = useState(false);
  
  // React Hook Form 설정
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(createBoardFormSchema(showCategoryField)),
    defaultValues: {
      nttSj: '',
      nttCn: '',
      ntceAt: 'N',
      exposureYn: 'Y',
      categoryCode: '',
      representImage: null,
      mainImage: null,
      representImageId: undefined,
      representImageName: undefined,
      mainImageId: undefined,
      mainImageName: undefined
    }
  });

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [boardInfo, setBoardInfo] = useState<BbsMstVO | null>(null);

  // 파일 업로드 관련 상태
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  // 다중이미지 업로드 관련 상태
  const [selectedMultiImages, setSelectedMultiImages] = useState<FileItem[]>([]);
  

  
  // 다중이미지 관련 상태 (ImageItem 배열로 통합 관리)
  const [allMultiImages, setAllMultiImages] = useState<ImageItem[]>([]);

  // 사용자 정보 확인
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

  // 게시판 정보 조회
  const fetchBoardInfo = useCallback(async () => {
    try {
      const response = await bbsAPI.getBbsMstDetail(bbsId);
      if (response.data.resultCode === 'SUCCESS') {
        const boardData = response.data.data;
        setBoardInfo(boardData);

        // 구분 코드 로드
        if (boardData.categoryCodeId) {
          await loadCategoryCodes(boardData.categoryCodeId);
        } else {
          setCategoryDetailCodes([]);
          setShowCategoryField(false);
        }
        
        setLoading(false);
      } else {
        toast.error('게시판 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    } catch {
      toast.error('게시판 정보를 불러오는데 실패했습니다.');
      setLoading(false);
    }
  }, [bbsId]);

  // 구분 코드 로드
  const loadCategoryCodes = async (categoryCodeId: string) => {
    try {
      if (!categoryCodeId) {
        setCategoryDetailCodes([]);
        setShowCategoryField(false);
        return;
      }

      const response = await bbsAPI.getCategoryCodeDetails(categoryCodeId);
      
      if (response.data && response.data.resultCode === 'SUCCESS') {
        const codes = response.data.data || [];
        setCategoryDetailCodes(codes);
        setShowCategoryField(true);
      } else {
        setCategoryDetailCodes([]);
        setShowCategoryField(false);
      }
    } catch {
      setCategoryDetailCodes([]);
      setShowCategoryField(false);
    }
  };

  // 데이터 조회
  useEffect(() => {
    if (userInfo && bbsId) {
      fetchBoardInfo();
    }
  }, [userInfo, bbsId, fetchBoardInfo]);

  // 파일 관련 함수들
  const handleFilesSelected = (files: FileItem[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const uploadAllFiles = async (): Promise<{ atchFileId: string | null; fileList: unknown[] }> => {
    if (selectedFiles.length === 0) {
      return { atchFileId: null, fileList: [] };
    }

    setUploadingFiles(true);
    
    try {
      // 파일 업로드 API 호출
      const formData = new FormData();
      selectedFiles.forEach(fileItem => {
        formData.append('files', fileItem.file);
      });

      const response = await bbsAPI.uploadFiles(formData);
      if (response.data.resultCode === 'SUCCESS') {
        const uploadedFiles = response.data.data.uploadedFiles || [];
        const atchFileId = response.data.data.atchFileId;
        
        return { atchFileId, fileList: uploadedFiles };
      } else {
        throw new Error(response.data.resultMessage || '파일 업로드에 실패했습니다.');
      }
    } catch {
      
      // 업로드 실패 시 파일 상태 업데이트
      setSelectedFiles(prev => prev.map(f => ({
        ...f,
        status: 'error' as const
      })));
      
      throw new Error('파일 업로드에 실패했습니다.');
    } finally {
      setUploadingFiles(false);
    }
  };

  // 대표이미지 관련 함수들
  const handleRepresentativeImageSelect = (file: File | null) => {
    setValue('representImage', file);
    setValue('representImageId', file ? `TEMP_${Date.now()}` : undefined);
    setValue('representImageName', file ? file.name : undefined);
  };

  const handleRepresentativeImageDelete = () => {
    setValue('representImage', null);
    setValue('representImageId', undefined);
    setValue('representImageName', undefined);
  };

  // 메인화면이미지 관련 함수들
  const handleMainImageSelect = (file: File | null) => {
    setValue('mainImage', file);
    setValue('mainImageId', file ? `TEMP_${Date.now()}` : undefined);
    setValue('mainImageName', file ? file.name : undefined);
  };

  const handleMainImageDelete = () => {
    setValue('mainImage', null);
    setValue('mainImageId', undefined);
    setValue('mainImageName', undefined);
  };

  // 다중이미지 관련 함수들
  const handleMultiImagesSelected = (files: FileItem[]) => {
    // 최대 개수 체크
    const currentCount = allMultiImages.length;
    const maxCount = boardInfo?.multiImageMaxCount || 10;
    
    if (currentCount + files.length > maxCount) {
      toast.error(`다중이미지는 최대 ${maxCount}개까지 업로드 가능합니다. (현재 ${currentCount}개)`);
      return;
    }
    
    // selectedMultiImages에 추가
    setSelectedMultiImages(prev => [...prev, ...files]);
    
    // allMultiImages에도 추가 (새로 추가된 이미지로 표시)
    setAllMultiImages(prev => {
      const newImageItems: ImageItem[] = files.map((fileItem, index) => ({
        id: fileItem.id,
        name: fileItem.name,
        url: URL.createObjectURL(fileItem.file),
        size: fileItem.size,
        type: 'new' as const,
        file: fileItem.file,
        order: prev.length + index + 1
      }));
      
      return [...prev, ...newImageItems];
    });
    
    toast.success(`${files.length}개의 이미지가 추가되었습니다.`);
  };

  const handleMultiImageRemove = (fileId: string) => {
    setSelectedMultiImages(prev => prev.filter(f => f.id !== fileId));
    
    // allMultiImages에서도 제거
    setAllMultiImages(prev => prev.filter(img => img.id !== fileId));
  };

  const handleMultiImageReorder = (reorderedImages: ImageItem[]) => {
    setAllMultiImages(reorderedImages);
    
    // selectedMultiImages도 동일한 순서로 재정렬
    const newTypeImages = reorderedImages.filter(img => img.type === 'new');
    const reorderedSelectedImages = newTypeImages.map(img => {
      const fileItem = selectedMultiImages.find(f => f.id === img.id);
      return fileItem;
    }).filter(Boolean) as FileItem[];
    
    setSelectedMultiImages(reorderedSelectedImages);
  };

  const handleMultiImageDelete = (imageId: string) => {
    setAllMultiImages(prev => prev.filter(img => img.id !== imageId));
    setSelectedMultiImages(prev => prev.filter(f => f.id !== imageId));
  };

  // 게시물 저장
  const handleSave = async (data: FormData) => {
    setSaving(true);

    try {
      // 1단계: 파일 업로드 (새 파일이 있는 경우에만)
      let finalAtchFileId: string | undefined = undefined;
      
      if (selectedFiles.length > 0) {
        const uploadResult = await uploadAllFiles();
        finalAtchFileId = uploadResult.atchFileId || undefined;
      }

      // 2단계: 대표이미지 처리
      let representativeImageId: string | undefined;
      let representativeImageName: string | undefined;
      
      if (data.representImage) {
        const imageFormData = new FormData();
        imageFormData.append('files', data.representImage);
        imageFormData.append('usageType', 'REPRESENTATIVE');
        
        try {
          const response = await bbsAPI.uploadFiles(imageFormData);
          if (response.data.resultCode === 'SUCCESS') {
            const uploadedFiles = response.data.data.uploadedFiles || [];
            if (uploadedFiles.length > 0) {
              representativeImageId = uploadedFiles[0].streFileNm;
              representativeImageName = data.representImage.name;
            } else {
              toast.error('대표이미지 업로드에 실패했습니다.');
              return;
            }
          } else {
            toast.error('대표이미지 업로드에 실패했습니다.');
            return;
          }
        } catch {
          toast.error('대표이미지 업로드 중 오류가 발생했습니다.');
          return;
        }
      }

      // 3단계: 메인화면이미지 처리
      let mainImageId: string | undefined;
      let mainImageName: string | undefined;
      
      if (data.mainImage) {
        const imageFormData = new FormData();
        imageFormData.append('files', data.mainImage);
        imageFormData.append('usageType', 'MAIN_IMAGE');
        
        try {
          const response = await bbsAPI.uploadFiles(imageFormData);
          if (response.data.resultCode === 'SUCCESS') {
            const uploadedFiles = response.data.data.uploadedFiles || [];
            if (uploadedFiles.length > 0) {
              mainImageId = uploadedFiles[0].streFileNm;
              mainImageName = data.mainImage.name;
            } else {
              toast.error('메인화면이미지 업로드에 실패했습니다.');
              return;
            }
          } else {
            toast.error('메인화면이미지 업로드에 실패했습니다.');
            return;
          }
        } catch {
          toast.error('메인화면이미지 업로드 중 오류가 발생했습니다.');
          return;
        }
      }

      // 4단계: 다중이미지 처리
      let multiImageIds: string[] = [];
      let multiImageOrder: number[] = [];
      let multiImageNames: string[] = [];
      
      if (selectedMultiImages.length > 0) {
        const imageFormData = new FormData();
        selectedMultiImages.forEach(fileItem => {
          imageFormData.append('files', fileItem.file);
        });
        imageFormData.append('usageType', 'MULTI_IMAGE');
        
        try {
          const response = await bbsAPI.uploadFiles(imageFormData);
          if (response.data.resultCode === 'SUCCESS') {
            const uploadedFiles = response.data.data.uploadedFiles || [];
            
            // 업로드된 파일 정보를 selectedMultiImages와 매핑
            const uploadedFileMap = new Map();
            uploadedFiles.forEach((uploadedFile: {streFileNm: string, atchFileId: string, fileSn: number, orignlFileNm: string}, index: number) => {
              if (index < selectedMultiImages.length) {
                const originalFileItem = selectedMultiImages[index];
                uploadedFileMap.set(originalFileItem.id, {
                  streFileNm: uploadedFile.streFileNm,
                  atchFileId: uploadedFile.atchFileId,
                  fileSn: uploadedFile.fileSn,
                  orignlFileNm: uploadedFile.orignlFileNm
                });
              }
            });
            
            // allMultiImages에서 신규 이미지들의 정보를 실제 업로드된 정보로 업데이트
            setAllMultiImages(prev => prev.map(img => {
              if (img.type === 'new') {
                const uploadedInfo = uploadedFileMap.get(img.id);
                if (uploadedInfo) {
                  return {
                    ...img,
                    id: uploadedInfo.streFileNm,
                    atchFileId: uploadedInfo.atchFileId,
                    fileSn: uploadedInfo.fileSn,
                    type: 'existing' as const,
                    name: uploadedInfo.orignlFileNm || img.name,
                    order: img.order
                  };
                }
              }
              return img;
            }));
          } else {
            toast.error('다중이미지 업로드에 실패했습니다.');
            return;
          }
        } catch {
          toast.error('다중이미지 업로드 중 오류가 발생했습니다.');
          return;
        }
      }
      
      // 모든 이미지 정보 전송 (기존 + 신규)
      if (allMultiImages.length > 0) {
        multiImageIds = allMultiImages.map(img => {
          if (img.type === 'existing') {
            return `${img.atchFileId}_${img.fileSn}`;
          } else {
            return img.id;
          }
        });
        
        multiImageNames = allMultiImages.map(img => img.name);
        multiImageOrder = allMultiImages.map(img => img.order);
      }

      // 5단계: 게시물 생성
      const createData = {
        bbsId: bbsId,
        nttSj: data.nttSj.trim(),
        nttCn: data.nttCn?.trim() || '',
        ntceAt: data.ntceAt,
        exposureYn: data.exposureYn,
        atchFileId: finalAtchFileId || undefined,
        nttCategory: data.categoryCode || undefined,
        representImageId: representativeImageId,
        representImageName: representativeImageName,
        representImageSize: data.representImage ? data.representImage.size : undefined,
        mainImageId: mainImageId,
        mainImageName: mainImageName,
        mainImageSize: data.mainImage ? data.mainImage.size : undefined,
        multiImageIds: multiImageIds,
        multiImageOrder: multiImageOrder,
        multiImageNames: multiImageNames
      };

      const response = await createBbsMutation.mutateAsync({
        bbsId: bbsId,
        data: createData
      });
      
      if (response && response.resultCode === 'SUCCESS') {
        toast.success('게시물이 작성되었습니다.');
        router.push(`/admin/cms/board/${bbsId}`);
      } else {
        toast.error(`게시물 작성에 실패했습니다: ${response?.resultMessage || '알 수 없는 오류'}`);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { resultMessage?: string } }; message?: string };
      if (axiosError.response) {
        toast.error(`게시물 작성 중 오류가 발생했습니다: ${axiosError.response.data?.resultMessage || axiosError.message || '알 수 없는 오류'}`);
      } else {
        toast.error('게시물 작성 중 오류가 발생했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBackToList = () => {
    router.push(`/admin/cms/board/${bbsId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex pt-16">
          <DynamicSidebar />
          <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)] flex flex-col">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">게시판 정보를 불러오는 중...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!boardInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex pt-16">
          <DynamicSidebar />
          <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)] flex flex-col">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">게시판을 찾을 수 없습니다.</h1>
                <Button onClick={handleBackToList}>
                  목록으로 돌아가기
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex pt-16">
        <DynamicSidebar />
        
        {/* 메인 콘텐츠 - QuickFlow 스타일 */}
        <main className="ml-72 bg-gray-50 h-[calc(100vh-64px)] w-[calc(100vw-288px)] flex flex-col">
          {/* 상단 헤더 - 게시물 상세보기와 동일한 스타일 */}
          <div className="bg-white border-b border-gray-300 flex-shrink-0">
            {/* 타이틀 부분 - 게시물 상세보기와 동일한 UI */}
            <div className="px-8 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {boardInfo?.bbsNm || '게시판'} 작성
                  </h1>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleBackToList}
                    className="text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    목록으로
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="px-8 py-8 flex-1 overflow-y-auto">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {/* 작성 폼 */}
              <div className="p-6">
              <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
                {/* 제목 */}
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    제목 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('nttSj')}
                    placeholder="제목을 입력하세요"
                    className="w-full"
                  />
                  {errors.nttSj && (
                    <p className="text-sm text-red-500">{errors.nttSj.message}</p>
                  )}
                </div>

                {/* 구분 */}
                {showCategoryField && (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-gray-700">
                      구분 <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={watch('categoryCode')}
                      onValueChange={(value) => setValue('categoryCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="구분을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryDetailCodes.map((code) => (
                          <SelectItem key={code.value} value={code.value}>
                            {code.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.categoryCode && (
                      <p className="text-sm text-red-500">{errors.categoryCode.message}</p>
                    )}
                  </div>
                )}

                {/* 공지여부 */}
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">공지여부</Label>
                  <RadioGroup
                    value={watch('ntceAt')}
                    onValueChange={(value) => setValue('ntceAt', value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="N" id="ntceAt-N" />
                      <Label htmlFor="ntceAt-N">일반</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Y" id="ntceAt-Y" />
                      <Label htmlFor="ntceAt-Y">공지</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 공개여부 */}
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">공개여부</Label>
                  <RadioGroup
                    value={watch('exposureYn')}
                    onValueChange={(value) => setValue('exposureYn', value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Y" id="exposureYn-Y" />
                      <Label htmlFor="exposureYn-Y">공개</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="N" id="exposureYn-N" />
                      <Label htmlFor="exposureYn-N">비공개</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 대표이미지 설정 */}
                <RepresentativeImageUpload
                  boardInfo={boardInfo}
                  currentImage={null}
                  selectedFile={watch('representImage')}
                  onImageSelect={handleRepresentativeImageSelect}
                  onImageDelete={handleRepresentativeImageDelete}
                  required={false}
                  disabled={saving || uploadingFiles}
                />

                {/* 메인화면이미지 설정 */}
                <MainImageUpload
                  boardInfo={boardInfo}
                  currentImage={null}
                  selectedFile={watch('mainImage')}
                  onImageSelect={handleMainImageSelect}
                  onImageDelete={handleMainImageDelete}
                  required={false}
                  disabled={saving || uploadingFiles}
                />

                {/* 다중이미지 설정 */}
                <MultiImageUpload
                  boardInfo={boardInfo}
                  selectedFiles={selectedMultiImages}
                  allImages={allMultiImages}
                  onFilesSelected={handleMultiImagesSelected}
                  onFileRemove={handleMultiImageRemove}
                  onReorder={handleMultiImageReorder}
                  onDelete={handleMultiImageDelete}
                  disabled={saving || uploadingFiles}
                />

                {/* 내용 */}
                <div className="space-y-2">
                  <Label className="block text-sm font-medium text-gray-700">
                    내용
                  </Label>
                  <TinyMCEEditor
                    content={watch('nttCn') || ''}
                    onChange={(content) => setValue('nttCn', content)}
                  />
                </div>

                {/* 첨부파일 설정 */}
                <AttachmentUpload
                  boardInfo={boardInfo}
                  existingFiles={[]}
                  selectedFiles={selectedFiles}
                  onFilesSelected={handleFilesSelected}
                  onFileRemove={handleFileRemove}
                  onExistingFileDelete={() => {}}
                  disabled={saving || uploadingFiles}
                />

                {/* 하단 버튼 */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={saving || uploadingFiles}
                    className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700"
                  >
                    {saving || uploadingFiles ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {uploadingFiles ? '파일 업로드 중...' : '저장 중...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        저장
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}