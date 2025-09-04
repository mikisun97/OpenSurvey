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
import { useUpdateBbs } from '@/hooks/useApi';
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
  representImageId: z.string().optional().or(z.literal('')).or(z.null()),
  representImageName: z.string().optional().or(z.literal('')).or(z.null()),
  mainImage: z.any().optional(),
  mainImageId: z.string().optional().or(z.literal('')).or(z.null()),
  mainImageName: z.string().optional().or(z.literal('')).or(z.null()),
  multiImages: z.any().optional(),
});

type FormData = z.infer<ReturnType<typeof createBoardFormSchema>>;

export default function BoardEditPage() {
  const router = useRouter();
  const params = useParams();
  const bbsId = params.bbsId as string;
  const nttId = params.nttId as string;
  const updateBbsMutation = useUpdateBbs();
  
  // 구분 코드 관련 상태 (useForm보다 먼저 선언)
  const [categoryDetailCodes, setCategoryDetailCodes] = useState<Array<{value: string, label: string}>>([]);
  const [showCategoryField, setShowCategoryField] = useState(false);
  
  // React Hook Form 설정
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(createBoardFormSchema(showCategoryField)),
    defaultValues: {
    nttSj: '',
    nttCn: '',
    ntceAt: 'N',
    exposureYn: 'Y',
    categoryCode: undefined,
    representImage: null,
    representImageId: undefined,
      representImageName: undefined,
      mainImage: null,
      mainImageId: undefined,
      mainImageName: undefined,
      multiImages: undefined,
    }
  });

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [boardDetail, setBoardDetail] = useState<BbsVO | null>(null);
  const [boardInfo, setBoardInfo] = useState<BbsMstVO | null>(null);

  // 파일 업로드 관련 상태
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  // 다중이미지 업로드 관련 상태
  const [selectedMultiImages, setSelectedMultiImages] = useState<FileItem[]>([]);
  
  // 대표이미지 관련 상태 (별도 관리)
  const [representativeImage, setRepresentativeImage] = useState<{
    id: string;
    name: string;
    url: string;
    size: number;
  } | null>(null);
  
  // 메인화면이미지 관련 상태 (별도 관리)
  const [mainImage, setMainImage] = useState<{
    id: string;
    name: string;
    url: string;
    size: number;
  } | null>(null);
  
  // 다중이미지 관련 상태 (별도 관리)
  // 다중이미지 관련 상태 (ImageItem 배열로 통합 관리)
  const [allMultiImages, setAllMultiImages] = useState<ImageItem[]>([]);
  
  // 삭제 예정인 파일들 상태 관리
  const [filesToDelete, setFilesToDelete] = useState<{
    attachments: Array<{atchFileId: string, fileSn: number}>;
    representativeImage: boolean;
    mainImage: boolean;
    multiImages: Array<{id: string, name: string}>;
  }>({
    attachments: [],
    representativeImage: false,
    mainImage: false,
    multiImages: []
  });

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

  // 게시판 정보 조회
  const fetchBoardInfo = useCallback(async () => {
    try {
      const response = await bbsAPI.getBbsMstDetail(bbsId);
      if (response.data.resultCode === 'SUCCESS') {
        const boardData = response.data.data;
        setBoardInfo(boardData);
        
        // 구분 코드 사용 여부에 따라 구분 코드 로드
        if (boardData.categoryCodeId) {
          await loadCategoryCodes(boardData.categoryCodeId);
        } else {
          setShowCategoryField(false);
          setCategoryDetailCodes([]);
        }
      } else {
        toast.error('게시판 정보를 불러오는데 실패했습니다.');
      }
    } catch {
      toast.error('게시판 정보를 불러오는데 실패했습니다.');
    }
  }, [bbsId]);

  // 게시물 상세 조회
  const fetchBoardDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bbsAPI.getBbsDetail(bbsId, parseInt(nttId));
      if (response.data.resultCode === 'SUCCESS') {
        const board = response.data.data;
        setBoardDetail(board);
        
        // 대표이미지 정보 별도 설정
        // 대표이미지 정보 설정
        
        if (board.representImageId && board.representImageName) {
          const representativeImageData = {
            id: board.representImageId,
            name: board.representImageName,
            url: board.representImageUrl || '',
            size: board.representImageSize || 0
          };
          // 대표이미지 상태 설정
          setRepresentativeImage(representativeImageData);
        } else {
          // 대표이미지 정보 없음
          setRepresentativeImage(null);
        }
        
        // 메인화면이미지 정보 별도 설정
        // 메인화면이미지 정보 설정
        
        if (board.mainImageId && board.mainImageName) {
          const mainImageData = {
            id: board.mainImageId,
            name: board.mainImageName,
            url: board.mainImageUrl || '',
            size: board.mainImageSize || 0
          };
          // 메인화면이미지 상태 설정
          setMainImage(mainImageData);
        } else {
          // 메인화면이미지 정보 없음
          setMainImage(null);
        }
        
        // 다중이미지 정보 별도 설정 (백엔드에서 다중이미지 목록을 제공한다고 가정)
        // 실제로는 백엔드에서 multiImageList 필드를 제공해야 함
        if (board.multiImageList && Array.isArray(board.multiImageList)) {
          // 기존 코드를 ImageItem 형태로 수정
            const multiImageData = board.multiImageList.map((img: {id?: string; atchFileId?: string; name?: string; orignlFileNm?: string; url?: string; fileUrl?: string; size?: number; fileSize?: number; fileSn?: number}, index: number) => {
              const cleanAtchFileId = img.atchFileId ? img.atchFileId.trim() : '';
              const uniqueId = img.fileSn ? `${cleanAtchFileId}_${img.fileSn}` : `multi_${index}_${Date.now()}`;
              
              return {
                id: uniqueId,
                name: img.name || img.orignlFileNm || '',
                url: img.url || img.fileUrl || '',
                size: img.size || img.fileSize || 0,
                type: 'existing' as const,
                atchFileId: cleanAtchFileId,
                fileSn: img.fileSn,
                order: index + 1
              } as ImageItem;
            });
          
                     // 다중이미지 상태 설정
          setAllMultiImages(multiImageData);
        } else {
          // 다중이미지 정보 없음
          setAllMultiImages([]);
        }
        
        // React Hook Form에 데이터 설정
        reset({
          nttSj: board.nttSj || '',
          nttCn: board.nttCn || '',
          ntceAt: board.ntceAt || 'N',
          exposureYn: board.exposureYn || 'Y',
          categoryCode: board.nttCategory || undefined,  // null 대신 undefined 사용
          representImage: null,
          representImageId: board.representImageId,
          representImageName: board.representImageName,
          mainImage: null,
          mainImageId: board.mainImageId,
          mainImageName: board.mainImageName,
          multiImages: undefined,
        });
      } else {
        toast.error('게시물 정보를 불러오는데 실패했습니다.');
      }
    } catch {
      toast.error('게시물 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [bbsId, nttId]);

  // 데이터 조회
  useEffect(() => {
    if (userInfo && bbsId && nttId) {
      fetchBoardInfo();
      fetchBoardDetail();
    }
  }, [userInfo, bbsId, nttId, fetchBoardInfo, fetchBoardDetail]);

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

  // 파일 관련 함수들
  const handleFilesSelected = (files: FileItem[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (fileId: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };
  
  // 대표이미지 삭제 함수 (지연 처리)
  const handleRepresentativeImageDelete = () => {
    
    // 삭제 예정 목록에 추가
    setFilesToDelete(prev => {
      const newState = {
        ...prev,
        representativeImage: true
      };
      return newState;
    });
    
    // UI에서 즉시 제거 (실제 삭제는 게시물 저장 시)
    setRepresentativeImage(null);
    
    setValue('representImage', null);
    setValue('representImageId', undefined);
    setValue('representImageName', undefined);
    
    toast.success('대표이미지가 삭제 예정 목록에 추가되었습니다. (게시물 저장 시 실제 삭제)');
  };
  
  // 메인화면이미지 삭제 함수 (지연 처리)
  const handleMainImageDelete = () => {
    // 메인화면이미지 삭제 처리
    
    // 삭제 예정 목록에 추가
    setFilesToDelete(prev => {
      const newState = {
        ...prev,
        mainImage: true
      };
      return newState;
    });
    
    // UI에서 즉시 제거 (실제 삭제는 게시물 저장 시)
    setMainImage(null);
    
    setValue('mainImage', null);
    setValue('mainImageId', undefined);
    setValue('mainImageName', undefined);
    
    toast.success('메인화면이미지가 삭제 예정 목록에 추가되었습니다. (게시물 저장 시 실제 삭제)');
  };
  
  // 다중이미지 삭제 함수 (지연 처리)
  const handleMultiImageDelete = (imageId: string) => {
    const imageToDelete = allMultiImages.find(img => img.id === imageId);
    if (!imageToDelete) return;

    if (imageToDelete.type === 'existing') {
      // 기존 이미지 삭제 (지연 처리)
      setFilesToDelete(prev => ({
        ...prev,
        multiImages: [...prev.multiImages, { id: imageId, name: imageToDelete.name }]
      }));
    } else {
      // 새로 추가된 이미지 삭제 (즉시 처리)
      setSelectedMultiImages(prev => prev.filter(f => f.id !== imageId));
    }
    
    // allMultiImages에서 제거
    setAllMultiImages(prev => {
      return prev.filter(img => img.id !== imageId);
    });
    
    toast.success('이미지가 삭제 예정 목록에 추가되었습니다.');
  };
  
  // 다중이미지 순서 변경 핸들러
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
  // 다중이미지 파일 선택 처리
  const handleMultiImagesSelected = (files: FileItem[]) => {
    // 최대 개수 체크 (기존 이미지 + 새로 선택된 이미지)
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
  // 다중이미지 파일 제거 처리
  const handleMultiImageRemove = (fileId: string) => {
    setSelectedMultiImages(prev => prev.filter(f => f.id !== fileId));
    
    // allMultiImages에서도 제거
    setAllMultiImages(prev => prev.filter(img => img.id !== fileId));
  };
  
  // 삭제 예정 파일들을 실제로 삭제하는 함수
  const deleteScheduledFiles = async () => {
    try {
      // 1. 첨부파일 삭제
      for (const file of filesToDelete.attachments) {
        await bbsAPI.deleteFile(file.atchFileId, file.fileSn);
      }
      
      // 2. 대표이미지 삭제
      if (filesToDelete.representativeImage && representativeImage?.id) {
        await bbsAPI.deleteRepresentativeImage(representativeImage.id);
      }
      
      // 3. 메인화면이미지 삭제
      if (filesToDelete.mainImage && mainImage?.id) {
        await bbsAPI.deleteMainImage(mainImage.id);
      }
      
      // 4. 다중이미지 삭제
      for (const image of filesToDelete.multiImages) {
        try {
          // image.id에서 atchFileId와 fileSn 분리
          // image.id 형태: 'FILE_1755658490942_5' -> atchFileId: 'FILE_1755658490942', fileSn: 5
          const parts = image.id.split('_');
          if (parts.length >= 2) {
            const fileSn = parseInt(parts[parts.length - 1]); // 마지막 부분이 fileSn
            const atchFileId = parts.slice(0, -1).join('_'); // 나머지 부분이 atchFileId
            
            // 다중이미지 삭제 API 호출
            await bbsAPI.deleteFile(atchFileId, fileSn);
          }
        } catch {
          // 삭제 실패해도 계속 진행
        }
      }
      
      // 3. 삭제 예정 목록 초기화
      setFilesToDelete({
        attachments: [],
        representativeImage: false,
        mainImage: false,
        multiImages: []
      });
      
    } catch {
      // 삭제 실패해도 게시물 수정은 성공으로 처리
    }
  };

  // 기존 첨부파일 삭제 함수 (지연 처리)
  const handleExistingFileDelete = (atchFileId: string, fileSn: number) => {
    
    // 삭제 예정 목록에 추가
    setFilesToDelete(prev => ({
      ...prev,
      attachments: [...prev.attachments, { atchFileId, fileSn }]
    }));
    
    // UI에서 즉시 제거 (실제 삭제는 게시물 저장 시)
    if (boardDetail && boardDetail.fileList) {
      setBoardDetail(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          fileList: prev.fileList?.filter(file => file.fileSn !== fileSn) || []
        };
      });
    }
    
    toast.success('파일이 삭제 예정 목록에 추가되었습니다. (게시물 저장 시 실제 삭제)');
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
        // 업로드 성공 시 파일 상태 업데이트
        setSelectedFiles(prev => prev.map(f => ({
          ...f,
          status: 'success' as const,
          progress: 100
        })));

        // 백엔드 응답에서 atchFileId와 파일 정보 추출
        const responseData = response.data.data;
        const atchFileId = responseData.atchFileId;
        const uploadedFiles = responseData.uploadedFiles || [];
        
        
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

  const handleSave = async (data: FormData) => {
    try {
      setSaving(true);
      
      // 1단계: 파일 업로드 (새 파일이 있는 경우에만)
      let finalAtchFileId: string | undefined = boardDetail?.atchFileId || undefined; // 기본적으로 기존 atchFileId 유지
      
      if (selectedFiles.length > 0) {
        if (boardDetail?.atchFileId) {
          // 기존 첨부파일이 있으면 기존 그룹에 새 파일 추가
          const formData = new FormData();
          selectedFiles.forEach(fileItem => {
            formData.append('files', fileItem.file);
          });
          
          const addResult = await bbsAPI.addFilesToExistingGroup(boardDetail.atchFileId, formData);
          if (addResult.data.resultCode === 'SUCCESS') {
            finalAtchFileId = boardDetail.atchFileId; // 기존 atchFileId 유지
          } else {
            throw new Error('기존 그룹에 파일 추가 실패');
          }
        } else {
          // 기존 첨부파일이 없으면 새 그룹 생성
          const uploadResult = await uploadAllFiles();
          finalAtchFileId = uploadResult.atchFileId || undefined;
        }
      }
      
      // 2단계: 대표이미지 처리
      let representativeImageId: string | undefined;
      let representativeImageName: string | undefined;
      
      if (data.representImage) {
        // 새 이미지가 있는 경우 (추가 또는 삭제 후 추가)
        
        // 1. 기존 대표이미지가 있거나 삭제 예정인 경우 삭제
        if (representativeImage?.id || filesToDelete.representativeImage) {
          if (representativeImage?.id) {
            try {
              await bbsAPI.deleteRepresentativeImage(representativeImage.id);
            } catch {
              // 삭제 실패해도 새 이미지 업로드는 계속 진행
            }
          }
        }
        
        // 2. 새 이미지 업로드
        const imageFormData = new FormData();
        imageFormData.append('files', data.representImage);
        imageFormData.append('usageType', 'REPRESENTATIVE');
        
        try {
          const response = await bbsAPI.uploadFiles(imageFormData);
          if (response.data.resultCode === 'SUCCESS') {
            const uploadedFiles = response.data.data.uploadedFiles || [];
            if (uploadedFiles.length > 0) {
              representativeImageId = uploadedFiles[0].streFileNm; // 실제 저장된 파일명
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
      } else if (filesToDelete.representativeImage) {
        // 삭제만 하는 경우
        representativeImageId = ""; // 빈 문자열로 삭제 의도 표시
        representativeImageName = "";
      } else {
        // 기존 이미지 유지 (변경 없음)
        representativeImageId = undefined;  // 변경 없음 - undefined로 전송
        representativeImageName = undefined;  // 변경 없음 - undefined로 전송
      }
      
      // 3단계: 메인화면이미지 처리
      let mainImageId: string | undefined;
      let mainImageName: string | undefined;
      
      if (data.mainImage) {
        // 새 이미지가 있는 경우 (추가 또는 삭제 후 추가)
        
        // 1. 기존 메인화면이미지가 있거나 삭제 예정인 경우 삭제
        if (mainImage?.id || filesToDelete.mainImage) {
          if (mainImage?.id) {
            try {
              await bbsAPI.deleteMainImage(mainImage.id);
            } catch {
              // 삭제 실패해도 새 이미지 업로드는 계속 진행
            }
          }
        }
        
        // 2. 새 이미지 업로드
        const imageFormData = new FormData();
        imageFormData.append('files', data.mainImage);
        imageFormData.append('usageType', 'MAIN_IMAGE');
        
        try {
          const response = await bbsAPI.uploadFiles(imageFormData);
          if (response.data.resultCode === 'SUCCESS') {
            const uploadedFiles = response.data.data.uploadedFiles || [];
            if (uploadedFiles.length > 0) {
              mainImageId = uploadedFiles[0].streFileNm; // 실제 저장된 파일명
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
      } else if (filesToDelete.mainImage) {
        // 삭제만 하는 경우
        mainImageId = ""; // 빈 문자열로 삭제 의도 표시
        mainImageName = "";
      } else {
        // 기존 이미지 유지 (변경 없음)
        mainImageId = undefined;  // 변경 없음 - undefined로 전송
        mainImageName = undefined;  // 변경 없음 - undefined로 전송
      }
      
      // 4단계: 다중이미지 처리 (기존 이미지 유지하면서 순서 변경)
      let multiImageIds: string[] = [];
      let multiImageOrder: number[] = [];
      let multiImageNames: string[] = [];
      
      /// 신규 이미지가 있는 경우에만 업로드
      if (selectedMultiImages.length > 0) {
        
        // 새로 선택된 다중이미지들 업로드
        const imageFormData = new FormData();
        selectedMultiImages.forEach(fileItem => {
          imageFormData.append('files', fileItem.file);
        });
        imageFormData.append('usageType', 'MULTI_IMAGE');
        
        try {
          // 수정:
          let response;
          if (boardDetail?.atchFileId) {
              // 기존 게시물이 있으면 기존 그룹에 추가
              response = await bbsAPI.addFilesToExistingGroup(boardDetail.atchFileId, imageFormData);
          } else {
              // 기존 게시물이 없으면 새 그룹 생성
              response = await bbsAPI.uploadFiles(imageFormData);
          }

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
                    id: uploadedInfo.streFileNm, // 실제 저장된 파일명
                    atchFileId: uploadedInfo.atchFileId,
                    fileSn: uploadedInfo.fileSn,
                    type: 'existing' as const, // 업로드 완료 후 기존 이미지로 처리
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
            // 기존 이미지: atchFileId_fileSn 형태로 전송
            return `${img.atchFileId}_${img.fileSn}`;
          } else {
            // 신규 이미지: 업로드된 파일 ID
            return img.id;
          }
        });
        
        multiImageNames = allMultiImages.map(img => img.name);
        multiImageOrder = allMultiImages.map(img => img.order);
        
      }      
      // 4단계: 게시물 저장 (파일은 이미 업로드됨)
      const updateData = {
        bbsId: bbsId,
        nttId: parseInt(nttId),
        nttSj: data.nttSj.trim(),
        nttCn: data.nttCn?.trim() || '',
        ntceAt: data.ntceAt,
        exposureYn: data.exposureYn,
        atchFileId: finalAtchFileId || undefined,
        nttCategory: data.categoryCode || undefined, // null 대신 undefined 사용
        representImageId: representativeImageId,
        representImageName: representativeImageName,
        representImageSize: data.representImage ? data.representImage.size : (representativeImage?.size || undefined),
        mainImageId: mainImageId,
        mainImageName: mainImageName,
        mainImageSize: data.mainImage ? data.mainImage.size : (mainImage?.size || undefined),
        multiImageIds: multiImageIds,
        multiImageOrder: multiImageOrder,
        multiImageNames: multiImageNames
      };


      
      // useUpdateBbs 훅 사용 (자동으로 캐시 무효화됨)
      const response = await updateBbsMutation.mutateAsync({
        bbsId: bbsId,
        nttId: parseInt(nttId),
        data: updateData
      });
      
      if (response && response.resultCode === 'SUCCESS') {
        // 4단계: 삭제 예정 파일들 실제 삭제
        await deleteScheduledFiles();
        
        toast.success('게시물이 수정되었습니다.');
        router.push(`/admin/cms/board/${bbsId}`);
      } else {
        toast.error(`게시물 수정에 실패했습니다: ${response?.resultMessage || '알 수 없는 오류'}`);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { resultMessage?: string } }; message?: string };
      if (axiosError.response) {
        toast.error(`게시물 수정 중 오류가 발생했습니다: ${axiosError.response.data?.resultMessage || axiosError.message || '알 수 없는 오류'}`);
      } else {
        toast.error('게시물 수정 중 오류가 발생했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleBackToDetail = () => {
    router.push(`/admin/cms/board/${bbsId}/${nttId}`);
  };

  const handleBackToList = () => {
    router.push(`/admin/cms/board/${bbsId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">게시물을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!boardDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">게시물을 찾을 수 없습니다.</h1>
          <Button onClick={handleBackToList}>
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
                    {boardInfo?.bbsNm || '게시판'} 수정
                  </h1>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleBackToDetail}
                    className="text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    상세보기
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 영역 */}
          <div className="px-8 py-8 flex-1 overflow-y-auto">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {/* 수정 폼 */}
              <div className="p-6">
                <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
                  {/* 제목 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="nttSj" className="block text-sm font-medium text-gray-700">
                      제목 <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nttSj"
                      {...register('nttSj')}
                      placeholder="게시물 제목을 입력하세요"
                      className="text-sm"
                    />
                    {errors.nttSj && (
                      <p className="text-sm text-red-500">{errors.nttSj.message}</p>
                    )}
                  </div>

                  {/* 공지여부 및 공개여부 설정 - 한 줄에 배치 */}
                  <div className="flex space-x-8">
                    {/* 공지여부 설정 */}
                    <div className="flex-1 space-y-2">
                      <Label className="block text-sm font-medium text-gray-700">
                        공지여부
                      </Label>
                      <RadioGroup 
                        value={watch('ntceAt')} 
                        onValueChange={(value: string) => setValue('ntceAt', value)}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="N" id="ntce-n" className="w-5 h-5" />
                          <Label htmlFor="ntce-n" className="text-sm">일반</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Y" id="ntce-y" className="w-5 h-5" />
                          <Label htmlFor="ntce-y" className="text-sm">공지</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* 공개여부 설정 */}
                    <div className="flex-1 space-y-2">
                      <Label className="block text-sm font-medium text-gray-700">
                        공개여부
                      </Label>
                      <RadioGroup 
                        value={watch('exposureYn')} 
                        onValueChange={(value: string) => setValue('exposureYn', value)}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Y" id="exposure-y" className="w-5 h-5" />
                          <Label htmlFor="exposure-y" className="text-sm">공개</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="N" id="exposure-n" className="w-5 h-5" />
                          <Label htmlFor="exposure-n" className="text-sm">비공개</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  {/* 구분 선택 - 게시판에서 구분을 사용하는 경우에만 표시 */}
                  {showCategoryField && (
                    <div className="space-y-2">
                      <Label htmlFor="categoryCode" className="block text-sm font-medium text-gray-700">
                        구분 <span className="text-red-500">*</span>
                      </Label>
                      
                      <Select 
                        value={watch('categoryCode') || ''} 
                        onValueChange={(value: string) => setValue('categoryCode', value)}
                      >
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue placeholder="구분을 선택하세요" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryDetailCodes.map((category) => (
                            <SelectItem key={category.value} value={category.value} className="text-sm">
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryCode && (
                        <p className="text-sm text-red-500">{errors.categoryCode.message}</p>
                      )}
                    </div>
                  )}

                  {/* 대표이미지 설정 */}
                  <RepresentativeImageUpload
                    boardInfo={boardInfo}
                    currentImage={representativeImage}
                    selectedFile={watch('representImage')}
                    onImageSelect={(file) => {
                      const tempId = file ? `TEMP_${Date.now()}` : undefined;
                      setValue('representImage', file);
                      setValue('representImageId', tempId);
                      setValue('representImageName', file?.name);
                    }}
                    onImageDelete={handleRepresentativeImageDelete}
                    required={false}
                    disabled={saving}
                  />

                  {/* 메인화면이미지 설정 */}
                  <MainImageUpload
                    boardInfo={boardInfo}
                    currentImage={mainImage}
                    selectedFile={watch('mainImage')}
                    onImageSelect={(file) => {
                      const tempId = file ? `TEMP_${Date.now()}` : undefined;
                      setValue('mainImage', file);
                      setValue('mainImageId', tempId);
                      setValue('mainImageName', file?.name);
                    }}
                    onImageDelete={handleMainImageDelete}
                    disabled={saving}
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

                  {/* 내용 입력 */}
                  <div className="space-y-2">
                    <Label htmlFor="nttCn" className="block text-sm font-medium text-gray-700">
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
                    existingFiles={boardDetail?.fileList}
                        selectedFiles={selectedFiles}
                        onFilesSelected={handleFilesSelected}
                        onFileRemove={handleFileRemove}
                    onExistingFileDelete={handleExistingFileDelete}
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