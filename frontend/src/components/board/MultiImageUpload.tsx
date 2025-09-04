'use client';

import { Label } from '@/components/ui/label';
import FileUpload, { FileItem } from '@/components/ui/FileUpload';
import SortableImageGrid, { ImageItem } from '@/components/ui/SortableImageGrid';

interface MultiImageUploadProps {
  // 게시판 설정 정보
  boardInfo?: {
    multiImageUseAt?: string;
    multiImageDisplayName?: string;
    multiImageMaxCount?: number;
    multiImageWidth?: number;
    multiImageHeight?: number;
  } | null;
  
  // 새로 선택된 이미지 파일들
  selectedFiles: FileItem[];
  
  // 모든 이미지 (기존 + 새로 선택된)
  allImages: ImageItem[];
  
  // 이벤트 핸들러
  onFilesSelected: (files: FileItem[]) => void;
  onFileRemove: (fileId: string) => void;
  onReorder: (images: ImageItem[]) => void;
  onDelete: (imageId: string) => void;
  
  // UI 설정
  disabled?: boolean;
  label?: string;
}

export default function MultiImageUpload({
  boardInfo,
  selectedFiles,
  allImages,
  onFilesSelected,
  onFileRemove,
  onReorder,
  onDelete,
  disabled = false,
  label
}: MultiImageUploadProps) {
  // 게시판에서 다중이미지를 사용하지 않는 경우 렌더링하지 않음
  if (boardInfo?.multiImageUseAt !== 'Y') {
    return null;
  }

  const displayName = boardInfo?.multiImageDisplayName || '다중이미지';
  const maxCount = boardInfo?.multiImageMaxCount || 10;
  const maxSize = 10; // MB

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Label className="block text-sm font-medium text-gray-700">
          {label || displayName}
        </Label>
        {boardInfo?.multiImageMaxCount && (
          <span className="text-xs text-gray-500">
            (최대 {boardInfo.multiImageMaxCount}개)
          </span>
        )}
        {boardInfo?.multiImageWidth && boardInfo?.multiImageHeight && (
          <span className="text-xs text-gray-500">
            (해상도 {boardInfo.multiImageWidth} × {boardInfo.multiImageHeight}px)
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        {/* 다중이미지 업로드 컴포넌트 (드래그앤드롭만 표시) */}
        <FileUpload
          selectedFiles={selectedFiles}
          onFilesSelected={(files: File[]) => {
            // File[]을 FileItem[]로 변환
            const fileItems: FileItem[] = files.map((file, index) => ({
              id: `${Date.now()}_${index}`,
              file,
              status: 'pending' as const,
              progress: 0,
              name: file.name,
              size: file.size,
              type: file.type
            }));
            onFilesSelected(fileItems);
          }}
          onFileRemove={onFileRemove}
          maxFiles={maxCount}
          maxSize={maxSize}
          acceptedTypes={['image/*']}
          disabled={disabled}
          title={`${displayName}를 드래그하거나 클릭하여 업로드`}
          description={`최대 ${maxCount}개, ${maxSize}MB 이하`}
          hideList
        />

        {/* 이미지 그리드 (기존 + 새로 선택된 이미지들) */}
        {allImages.length > 0 && (
          <div>
            <div className="mb-2">
              <span className="text-sm font-medium text-gray-700">이미지 순서 (드래그하여 순서 변경)</span>
            </div>
            <SortableImageGrid
              key={allImages.length} // 강제 리렌더링
              images={allImages}
              onReorder={onReorder}
              onDelete={onDelete}
              maxCount={maxCount}
            />
          </div>
        )}
      </div>
    </div>
  );
}
