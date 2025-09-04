'use client';

import { useState, useId } from 'react';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface MainImageData {
  id?: string;
  url?: string;
  name?: string;
  file?: File;
}

interface MainImageUploadProps {
  // 게시판 설정 정보
  boardInfo?: {
    mainImageUseAt?: string;
    mainImageWidth?: number;
    mainImageHeight?: number;
  } | null;
  
  // 현재 이미지 데이터 (수정 시 기존 이미지)
  currentImage?: MainImageData | null;
  
  // 새로 선택된 이미지 파일
  selectedFile?: File | null;
  
  // 이벤트 핸들러
  onImageSelect: (file: File | null) => void;
  onImageDelete?: () => void;
  
  // UI 설정
  required?: boolean;
  disabled?: boolean;
  label?: string;
}

export default function MainImageUpload({
  boardInfo,
  currentImage,
  selectedFile,
  onImageSelect,
  onImageDelete,
  required = false,
  disabled = false,
  label = '메인화면이미지'
}: MainImageUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputId = useId();

  // 게시판에서 메인화면이미지를 사용하지 않는 경우 렌더링하지 않음
  if (boardInfo?.mainImageUseAt !== 'Y') {
    return null;
  }

  const handleFileSelect = (file: File | null) => {
    if (disabled) return;
    onImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      handleFileSelect(imageFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {boardInfo?.mainImageWidth && boardInfo?.mainImageHeight && (
          <span className="text-xs text-gray-500">
            (해상도 {boardInfo.mainImageWidth} × {boardInfo.mainImageHeight}px, PNG)
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          {/* 현재 이미지 썸네일 (수정 시 기존 이미지) */}
          {currentImage && (
            <div className="relative">
              <div className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:border-gray-400 transition-colors">
                <img 
                  src={currentImage.url} 
                  alt="현재 메인화면이미지"
                  className="max-h-24 object-contain bg-gray-50"
                  onClick={() => {
                    if (!disabled) {
                      const input = document.getElementById(inputId) as HTMLInputElement;
                      input?.click();
                    }
                  }}
                />
              </div>
              {/* 삭제 버튼 */}
              {onImageDelete && (
                <button
                  onClick={onImageDelete}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  title="메인화면이미지 삭제"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* 이미지가 없거나 새 이미지 선택 영역 */}
          {!currentImage && (
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id={inputId}
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={disabled}
              />
              <label 
                htmlFor={inputId} 
                className={`cursor-pointer flex flex-col items-center space-y-2 ${disabled ? 'cursor-not-allowed' : ''}`}
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">이미지 추가</p>
                  <p className="text-xs text-gray-500">드래그하거나 클릭하여 업로드</p>
                </div>
              </label>
            </div>
          )}
          
          {/* 새로 선택된 이미지 썸네일 */}
          {selectedFile && (
            <div className="relative">
              <div className="border border-blue-200 rounded-lg overflow-hidden">
                <img 
                  src={URL.createObjectURL(selectedFile)} 
                  alt="선택된 이미지"
                  className="max-h-24 object-contain bg-blue-50"
                />
              </div>
              {/* 선택 취소 버튼 */}
              <button
                onClick={() => handleFileSelect(null)}
                disabled={disabled}
                className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                title="선택 취소"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
