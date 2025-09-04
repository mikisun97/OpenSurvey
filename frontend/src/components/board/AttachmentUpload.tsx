
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import FileUpload, { FileItem } from '@/components/ui/FileUpload';

interface AttachmentFile {
  atchFileId: string;
  fileSn: number;
  orignlFileNm: string;
  fileSize?: number;
}

interface AttachmentUploadProps {
  boardInfo?: {
    fileAtchPosblAt?: string;
    atchPosblFileNumber?: number;
    atchPosblFileSize?: number;
  } | null;
  existingFiles?: AttachmentFile[];
  selectedFiles: FileItem[];
  onFilesSelected: (files: FileItem[]) => void;
  onFileRemove: (fileId: string) => void;
  onExistingFileDelete: (atchFileId: string, fileSn: number) => void;
  disabled?: boolean;
}

export default function AttachmentUpload({
  boardInfo,
  existingFiles = [],
  selectedFiles,
  onFilesSelected,
  onFileRemove,
  onExistingFileDelete,
  disabled = false
}: AttachmentUploadProps) {
  // 첨부파일 기능이 비활성화된 경우 렌더링하지 않음
  if (boardInfo?.fileAtchPosblAt !== 'Y') {
    return null;
  }

  const maxFiles = boardInfo?.atchPosblFileNumber || 5;
  const maxSize = boardInfo?.atchPosblFileSize ? Math.round(boardInfo.atchPosblFileSize / 1024 / 1024) : 10;

  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium text-gray-700">
        첨부파일
        {boardInfo?.atchPosblFileNumber && (
          <span className="text-xs text-gray-500 ml-2">
            (최대 {boardInfo.atchPosblFileNumber}개)
          </span>
        )}
      </Label>
      
      {/* 새로운 파일 업로드 컴포넌트 */}
      <FileUpload
        selectedFiles={selectedFiles}
        onFilesSelected={onFilesSelected}
        onFileRemove={onFileRemove}
        maxFiles={maxFiles}
        maxSize={maxSize}
        disabled={disabled}
        title="첨부파일을 드래그하거나 클릭하여 업로드"
        description={`최대 ${maxFiles}개, ${maxSize}MB 이하`}
      />
      
      {/* 기존 첨부파일 표시 */}
      {existingFiles && existingFiles.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-900 mb-2">
            <Paperclip className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">현재 첨부된 파일 ({existingFiles.length}개)</span>
          </div>
          <div className="space-y-1">
            {existingFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Paperclip className="w-3 h-3" />
                  <button className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                    {file.orignlFileNm}
                  </button>
                  <span className="text-gray-400">({file.fileSize ? Math.round(file.fileSize / 1024) : 0}KB)</span>
                </div>
                <Button
                  onClick={() => onExistingFileDelete(file.atchFileId, file.fileSn)}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs text-red-600 border-red-200 hover:bg-red-50"
                  disabled={disabled}
                >
                  파일삭제
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
