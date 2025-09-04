'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  Paperclip, 
  Trash2, 
  Check, 
  X,
  FileText,
  Image as ImageIcon,
  File
} from 'lucide-react';

export interface FileItem {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  name: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  selectedFiles: FileItem[];
  onFilesSelected: (files: File[]) => void;
  onFileRemove: (fileId: string) => void;
  maxFiles?: number;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  disabled?: boolean;
  title?: string;
  description?: string;
  hideList?: boolean;
}

export default function FileUpload({
  selectedFiles,
  onFilesSelected,
  onFileRemove,
  maxFiles = 5,
  maxSize = 10,
  acceptedTypes = ['*/*'],
  disabled = false,
  title = '파일을 드래그하거나 클릭하여 업로드',
  description = `최대 ${maxFiles}개, ${maxSize}MB 이하`,
  hideList = false
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      // 파일 크기 검사 (MB)
      if (file.size > maxSize * 1024 * 1024) {
        alert(`파일 크기는 ${maxSize}MB 이하여야 합니다: ${file.name}`);
        return;
      }
      
      // 파일 개수 검사
      if (selectedFiles.length + validFiles.length >= maxFiles) {
        alert(`최대 ${maxFiles}개까지만 첨부할 수 있습니다.`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />;
    } else {
      return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {/* 파일 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          {title}
        </p>
        <p className="text-xs text-gray-500">
          {description}
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* 선택된 파일 목록 */}
      {!hideList && selectedFiles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            선택된 파일 ({selectedFiles.length}/{maxFiles})
          </Label>
          
          <div className="space-y-2">
            {selectedFiles.map((fileItem) => (
              <div 
                key={fileItem.id} 
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                {/* 파일 아이콘 */}
                {getFileIcon(fileItem.type)}
                
                {/* 파일 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileItem.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileItem.size)}
                  </p>
                </div>
                
                {/* 상태 표시 */}
                {fileItem.status === 'pending' && (
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    대기 중
                  </span>
                )}
                
                {fileItem.status === 'uploading' && (
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">
                      {fileItem.progress}%
                    </span>
                  </div>
                )}
                
                {fileItem.status === 'success' && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <Check className="w-4 h-4" />
                    <span className="text-xs">완료</span>
                  </div>
                )}
                
                {fileItem.status === 'error' && (
                  <div className="flex items-center space-x-1 text-red-600">
                    <X className="w-4 h-4" />
                    <span className="text-xs">실패</span>
                  </div>
                )}
                
                {/* 삭제 버튼 (업로드 전까지만 표시) */}
                {fileItem.status === 'pending' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFileRemove(fileItem.id);
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={disabled}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 