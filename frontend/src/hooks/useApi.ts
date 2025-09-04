import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commonCodeAPI, bbsAPI } from '@/lib/api';
import { CommonCodeVO, CommonCodeSearchVO, BbsMstVO, BbsVO, PaginationInfo } from '@/types';

// ===== 공통코드 관련 훅 =====

// 공통코드 목록 조회
export const useCommonCodeList = (params?: {
  pageIndex?: number;
  pageSize?: number;
  searchKeyword?: string;
  searchCondition?: string;
  searchUseAt?: string;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
}) => {
  return useQuery({
    queryKey: ['commonCodes', params],
    queryFn: async () => {
      const response = await commonCodeAPI.getList(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2분
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// 공통코드 상세 조회
export const useCommonCodeDetail = (codeId: string) => {
  return useQuery({
    queryKey: ['commonCode', codeId],
    queryFn: async () => {
      const response = await commonCodeAPI.getDetail(codeId);
      return response.data;
    },
    enabled: !!codeId,
  });
};

// 공통코드 생성
export const useCreateCommonCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<CommonCodeVO>) => {
      const response = await commonCodeAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commonCodes'] });
    },
  });
};

// 공통코드 수정
export const useUpdateCommonCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ codeId, data }: { codeId: string; data: Partial<CommonCodeVO> }) => {
      const response = await commonCodeAPI.update(codeId, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commonCodes'] });
    },
  });
};

// 공통코드 삭제
export const useDeleteCommonCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (codeId: string) => {
      const response = await commonCodeAPI.delete(codeId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commonCodes'] });
    },
  });
};

// ===== 게시판 관련 훅 =====

// 게시판 마스터 목록 조회
export const useBbsMstList = (params?: {
  pageIndex?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  searchKeyword?: string;
  searchUseAt?: string;
}) => {
  return useQuery({
    queryKey: ['bbsMstList', params],
    queryFn: async () => {
      const response = await bbsAPI.getBbsMstList(params);
      // 공통코드와 동일한 방식으로 response.data 그대로 반환
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2분
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// 게시판 마스터 상세 조회
export const useBbsMstDetail = (bbsId: string) => {
  return useQuery({
    queryKey: ['bbsMstDetail', bbsId],
    queryFn: async () => {
      const response = await bbsAPI.getBbsMstDetail(bbsId);
      // 공통코드와 동일한 방식으로 response.data 그대로 반환
      return response.data;
    },
    enabled: !!bbsId,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 게시물 목록 조회
export const useBbsList = (bbsId: string, params?: {
  pageIndex?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  searchKeyword?: string;
  searchExposureYn?: string;
  searchCategory?: string;
}) => {
  return useQuery({
    queryKey: ['bbsList', bbsId, 
      params?.pageIndex,
      params?.pageSize,
      params?.sortField,
      params?.sortOrder,
      params?.searchKeyword,
      params?.searchExposureYn,
      params?.searchCategory
    ],
    queryFn: async () => {
      const response = await bbsAPI.getBbsList(bbsId, params);
      // 공통코드와 동일한 방식으로 response.data 그대로 반환
      return response.data;
    },
    enabled: !!bbsId,
    staleTime: 1 * 60 * 1000, // 1분 (게시물은 자주 변경됨)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// 게시판 마스터 생성
export const useCreateBbsMst = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<BbsMstVO>) => {
      const response = await bbsAPI.createBbsMst(data as BbsMstVO);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bbsMstList'] });
    },
  });
};

// 게시판 마스터 수정
export const useUpdateBbsMst = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bbsId, data }: { bbsId: string; data: Partial<BbsMstVO> }) => {
      const response = await bbsAPI.updateBbsMst(bbsId, data as BbsMstVO);
      return response.data;
    },
    onSuccess: (_, { bbsId }) => {
      queryClient.invalidateQueries({ queryKey: ['bbsMstList'] });
    },
  });
};

// 게시판 마스터 삭제
export const useDeleteBbsMst = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bbsId: string) => {
      const response = await bbsAPI.deleteBbsMst(bbsId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bbsMstList'] });
    },
  });
};

// ===== 게시글 관련 훅 =====

// 게시글 생성
export const useCreateBbs = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bbsId, data }: { bbsId: string; data: Partial<BbsVO> }) => {
      const response = await bbsAPI.createBbs(bbsId, data as BbsVO);
      return response.data;
    },
    onSuccess: (_, { bbsId }) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['bbsList', bbsId],
        exact: false 
      });
      // 강제로 다시 조회
      queryClient.refetchQueries({ 
        queryKey: ['bbsList', bbsId],
        exact: false 
      });
    },
  });
};

// 게시글 수정
export const useUpdateBbs = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bbsId, nttId, data }: { bbsId: string; nttId: number; data: Partial<BbsVO> }) => {
      const response = await bbsAPI.updateBbs(bbsId, nttId, data as BbsVO);
      return response.data;
    },
    onSuccess: (_, { bbsId }) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['bbsList', bbsId],
        exact: false 
      });
      // 강제로 다시 조회
      queryClient.refetchQueries({ 
        queryKey: ['bbsList', bbsId],
        exact: false 
      });
    },
  });
};

// 게시물 삭제
export const useDeleteBbs = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bbsId, nttId }: { bbsId: string; nttId: number }) => {
      const response = await bbsAPI.deleteBbs(bbsId, nttId);
      return response.data;
    },
    onSuccess: (_, { bbsId }) => {
      console.log('useDeleteBbs onSuccess - bbsId:', bbsId);
      // 캐시 무효화
      queryClient.invalidateQueries({ 
        queryKey: ['bbsList', bbsId],
        exact: false 
      });
      // 강제로 다시 조회
      queryClient.refetchQueries({ 
        queryKey: ['bbsList', bbsId],
        exact: false 
      });
      console.log('useDeleteBbs - 캐시 무효화 및 재조회 완료');
    },
  });
}; 