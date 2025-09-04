import axios from 'axios';
import { BbsMstVO, BbsVO, CommentVO } from '@/types';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    console.log('axios 인터셉터 - 요청 URL:', config.url);
    const token = localStorage.getItem('accessToken');
    console.log('axios 인터셉터 - localStorage 토큰:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('axios 인터셉터 - Authorization 헤더 설정:', config.headers.Authorization);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('emplyrInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API (전자정부 표준)
export const authAPI = {
  // 로그인 - 업무사용자 인증
  login: (data: { userId: string; password: string }) =>
    api.post('/auth/login', data),
  // 토큰 검증
  validate: () => api.post('/auth/validate'),
  // 내 정보 조회 - 업무사용자 정보
  me: () => api.get('/auth/me'),
  // 토큰 갱신
  refresh: () => api.post('/auth/refresh'),
};

// 공통코드 관련 API (전자정부 표준)
export const commonCodeAPI = {
  getList: (params?: {
    pageIndex?: number;
    pageSize?: number;
    searchKeyword?: string;
    searchCondition?: string;
    searchUseAt?: string;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) => api.get('/sym/ccm/codes', { params }),
  getDetail: (codeId: string) => api.get(`/sym/ccm/codes/${codeId}`),
  create: (data: unknown) => api.post('/sym/ccm/codes', data),
  update: (codeId: string, data: unknown) => api.put(`/sym/ccm/codes/${codeId}`, data),
  delete: (codeId: string) => api.delete(`/sym/ccm/codes/${codeId}`),
  getDetailList: (codeId: string, params?: {
    pageIndex?: number;
    pageSize?: number;
    searchKeyword?: string;
    searchCondition?: string;
    searchUseAt?: string;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) => api.get(`/sym/ccm/codes/${codeId}/details`, { params }),
  // 세부코드 관련 API
  createDetail: (codeId: string, data: unknown) => api.post(`/sym/ccm/codes/${codeId}/details`, data),
  updateDetail: (codeId: string, code: string, data: unknown) => 
    api.put(`/sym/ccm/codes/${codeId}/details/${code}`, data),
  deleteDetail: (codeId: string, code: string) => 
    api.delete(`/sym/ccm/codes/${codeId}/details/${code}`),
};

// 게시판 관리 API (전자정부 표준)
export const bbsAPI = {
  // 게시판 마스터 관리
  getBbsMstList: (params?: {
    pageIndex?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    searchKeyword?: string;
    searchUseAt?: string;
  }) => api.get('/sym/bbs/bbsmst', { params }),
  getBbsMstDetail: (bbsId: string) => api.get(`/sym/bbs/bbsmst/${bbsId}`),
  createBbsMst: (data: BbsMstVO) => api.post('/sym/bbs/bbsmst', data),
  updateBbsMst: (bbsId: string, data: BbsMstVO) => api.put(`/sym/bbs/bbsmst/${bbsId}`, data),
  deleteBbsMst: (bbsId: string) => api.delete(`/sym/bbs/bbsmst/${bbsId}`),
  
  // 게시글 관리
  getBbsList: (bbsId: string, params?: {
    pageIndex?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
    searchKeyword?: string;
    searchExposureYn?: string;
  }) => api.get(`/sym/bbs/${bbsId}/boards`, { params }),
  getBbsDetail: (bbsId: string, nttId: number, params?: {
    incrementView?: boolean;
  }) => api.get(`/sym/bbs/${bbsId}/boards/${nttId}`, { params }),
  createBbs: (bbsId: string, data: BbsVO) => api.post(`/sym/bbs/${bbsId}/boards`, data),
  updateBbs: (bbsId: string, nttId: number, data: BbsVO) => 
    api.put(`/sym/bbs/${bbsId}/boards/${nttId}`, data),
  deleteBbs: (bbsId: string, nttId: number) => 
    api.delete(`/sym/bbs/${bbsId}/boards/${nttId}`),
  
  // 파일 관리
  uploadFiles: (files: FormData) => api.post('/sym/bbs/files', files, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getFileList: (atchFileId: string) => api.get(`/sym/bbs/files/${atchFileId}`),
  deleteFile: (atchFileId: string, fileSn: number) => 
    api.delete(`/sym/bbs/files/${atchFileId}/${fileSn}`),
  downloadFile: (atchFileId: string, fileSn: number) => 
    api.get(`/sym/bbs/files/${atchFileId}/${fileSn}/download`, { responseType: 'blob' }),
  addFilesToExistingGroup: (atchFileId: string, files: FormData) => 
    api.post(`/sym/bbs/files/${atchFileId}/add`, files, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  // 대표이미지 관리
  deleteRepresentativeImage: (atchFileId: string) => 
    api.delete(`/sym/bbs/representative-image/${atchFileId}`),
  
  // 메인화면이미지 관리
  deleteMainImage: (atchFileId: string) => 
    api.delete(`/sym/bbs/main-image/${atchFileId}`),
  
  // 댓글 관리
  getCommentList: (bbsId: string, nttId: number) => 
    api.get(`/sym/bbs/${bbsId}/boards/${nttId}/comments`),
  createComment: (bbsId: string, nttId: number, data: CommentVO) => 
    api.post(`/sym/bbs/${bbsId}/boards/${nttId}/comments`, data),
  updateComment: (bbsId: string, nttId: number, commentNo: number, data: CommentVO) => 
    api.put(`/sym/bbs/${bbsId}/boards/${nttId}/comments/${commentNo}`, data),
  deleteComment: (bbsId: string, nttId: number, commentNo: number) => 
    api.delete(`/sym/bbs/${bbsId}/boards/${nttId}/comments/${commentNo}`),
  
  // 구분 코드 관리
  getCategoryCodes: () => api.get('/sym/bbs/category-codes'),
  getCategoryCodeDetails: (categoryCodeId: string) => 
    api.get(`/sym/bbs/category-codes/${categoryCodeId}/details`),
};

export default api; 