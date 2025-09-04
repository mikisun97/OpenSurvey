'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CommonCodeDetailVO } from '@/types';
import { commonCodeAPI } from '@/lib/api';
import { toast } from 'sonner';

// Zod 스키마 정의
const detailCodeSchema = z.object({
  code: z.string()
    .min(1, '코드를 입력해주세요.')
    .max(20, '코드는 20자 이내로 입력해주세요.')
    .regex(/^[A-Z0-9_]+$/, '코드는 영문 대문자, 숫자, 언더스코어만 사용 가능합니다.'),
  codeNm: z.string()
    .min(1, '코드명을 입력해주세요.')
    .max(50, '코드명은 50자 이내로 입력해주세요.'),
  codeDc: z.string()
    .max(200, '코드설명은 200자 이내로 입력해주세요.')
    .optional(),
  useAt: z.enum(['Y', 'N']),
  codeOrder: z.number()
    .min(0, '순서는 0 이상의 숫자를 입력해주세요.')
    .max(9999, '순서는 9999 이하의 숫자를 입력해주세요.'),
});

type DetailCodeFormData = z.infer<typeof detailCodeSchema>;

interface CommonCodeDetailEditorProps {
  codeId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDetail: CommonCodeDetailVO | null;
  onSave: () => void;
}

export default function CommonCodeDetailEditor({
  codeId,
  isOpen,
  onOpenChange,
  selectedDetail,
  onSave
}: CommonCodeDetailEditorProps) {
  const [detailSaving, setDetailSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<DetailCodeFormData>({
    resolver: zodResolver(detailCodeSchema),
    defaultValues: {
      code: '',
      codeNm: '',
      codeDc: '',
      useAt: 'Y',
      codeOrder: 0
    }
  });

  // selectedDetail이 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (selectedDetail) {
      // 수정 모드
      setValue('code', selectedDetail.code);
      setValue('codeNm', selectedDetail.codeNm);
      setValue('codeDc', selectedDetail.codeDc || '');
      setValue('useAt', selectedDetail.useAt as 'Y' | 'N');
      setValue('codeOrder', selectedDetail.codeOrder);
    } else {
      // 추가 모드
      reset({
        code: '',
        codeNm: '',
        codeDc: '',
        useAt: 'Y',
        codeOrder: 0
      });
    }
  }, [selectedDetail, setValue, reset]);

  const onSubmit = async (data: DetailCodeFormData) => {
    try {
      setDetailSaving(true);
      const detailData = {
        codeId: codeId,
        code: data.code,
        codeNm: data.codeNm,
        codeDc: data.codeDc || '',
        useAt: data.useAt,
        codeOrder: data.codeOrder,
        lastUpdusrId: 'admin'
      };

      if (selectedDetail) {
        // 수정
        const response = await commonCodeAPI.updateDetail(codeId, data.code, detailData);
        if (response.data.resultCode === 'SUCCESS') {
          toast.success('세부코드가 수정되었습니다.');
          onSave();
          onOpenChange(false);
        }
      } else {
        // 생성
        const response = await commonCodeAPI.createDetail(codeId, detailData);
        if (response.data.resultCode === 'SUCCESS') {
          toast.success('세부코드가 생성되었습니다.');
          onSave();
          onOpenChange(false);
        }
      }
    } catch (error) {
      console.error('세부코드 저장 실패:', error);
      toast.error('세부코드 저장 중 오류가 발생했습니다.');
    } finally {
      setDetailSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="!w-[550px] sm:!w-[650px] !max-w-none sm:!max-w-none flex flex-col">
        <SheetHeader className="pb-6 px-6 border-b border-gray-200 flex-shrink-0">
          <SheetTitle className="text-2xl font-bold text-gray-900">
            {selectedDetail ? '하위코드정보 수정' : '하위코드정보 추가'}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pt-6 pb-6 space-y-6">
          {/* 코드 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              코드 <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('code')}
              placeholder="코드를 입력해 주세요."
              disabled={!!selectedDetail}
              className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                selectedDetail ? '!text-sm border-gray-300 bg-gray-50' : ''
              } ${errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.code && (
              <p className="text-sm text-red-600">{errors.code.message}</p>
            )}
          </div>

          {/* 상위코드 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              상위코드 <span className="text-red-500">*</span>
            </label>
            <Input
              value={codeId}
              disabled
              className="w-full text-sm !text-sm border-gray-300 bg-gray-50"
            />
          </div>

          {/* 코드명 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              코드명 <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('codeNm')}
              placeholder="코드명을 입력해 주세요."
              className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                errors.codeNm ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.codeNm && (
              <p className="text-sm text-red-600">{errors.codeNm.message}</p>
            )}
          </div>

          {/* 코드설명 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              코드설명
            </label>
            <Input
              {...register('codeDc')}
              placeholder="코드설명을 입력해 주세요."
              className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                errors.codeDc ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.codeDc && (
              <p className="text-sm text-red-600">{errors.codeDc.message}</p>
            )}
          </div>

          {/* 순서 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">순서</label>
            <Input
              type="number"
              {...register('codeOrder', { valueAsNumber: true })}
              className={`w-full text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                errors.codeOrder ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.codeOrder && (
              <p className="text-sm text-red-600">{errors.codeOrder.message}</p>
            )}
          </div>

          {/* 사용여부 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              사용여부 <span className="text-red-500">*</span>
            </label>
            <RadioGroup 
              defaultValue="Y"
              onValueChange={(value: 'Y' | 'N') => setValue('useAt', value)}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="Y" id="detail-use-y" className="w-5 h-5" />
                <Label htmlFor="detail-use-y" className="text-sm">사용</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="N" id="detail-use-n" className="w-5 h-5" />
                <Label htmlFor="detail-use-n" className="text-sm">미사용</Label>
              </div>
            </RadioGroup>
            {errors.useAt && (
              <p className="text-sm text-red-600">{errors.useAt.message}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="text-sm"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={detailSaving || isSubmitting}
              className="text-sm bg-orange-600 hover:bg-orange-700"
            >
              {detailSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  저장 중...
                </>
              ) : (
                selectedDetail ? '수정' : '추가'
              )}
            </Button>
          </div>
        </form>
        </div>
      </SheetContent>
    </Sheet>
  );
} 