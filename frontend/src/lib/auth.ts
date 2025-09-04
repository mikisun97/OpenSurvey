import { LoginResponse, UserInfo, EmplyrInfo } from '@/types';

// 토큰 저장/조회/삭제
export const setToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const removeToken = () => {
  localStorage.removeItem('accessToken');
};

// 사용자 정보 저장/조회/삭제 (기존 호환성)
export const setUserInfo = (userInfo: UserInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

export const getUserInfo = (): UserInfo | null => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

// 업무사용자 정보 저장/조회/삭제 (전자정부 표준)
export const setEmplyrInfo = (emplyrInfo: EmplyrInfo) => {
  localStorage.setItem('emplyrInfo', JSON.stringify(emplyrInfo));
};

export const getEmplyrInfo = (): EmplyrInfo | null => {
  const emplyrInfo = localStorage.getItem('emplyrInfo');
  return emplyrInfo ? JSON.parse(emplyrInfo) : null;
};

export const removeEmplyrInfo = () => {
  localStorage.removeItem('emplyrInfo');
};

// 사용자 정보 삭제 (기존 호환성)
export const removeUserInfo = () => {
  localStorage.removeItem('userInfo');
};

// 로그인 정보 저장 (전자정부 표준)
export const saveLoginInfo = (loginResponse: LoginResponse, emplyrInfo?: EmplyrInfo) => {
  setToken(loginResponse.accessToken);
  
  if (emplyrInfo) {
    setEmplyrInfo(emplyrInfo);
  }
  
  // 기존 호환성을 위한 UserInfo 형태로도 저장
  const userInfo: UserInfo = {
    userId: loginResponse.userId,
    userNm: loginResponse.userNm,
    email: loginResponse.emailAdres,
    authorityCode: loginResponse.authorityCode,
    authorityNm: loginResponse.authorityNm,
    useAt: 'Y',
    registDate: new Date().toISOString(),
  };
  setUserInfo(userInfo);
};

// 로그아웃
export const logout = () => {
  removeToken();
  removeUserInfo();
  removeEmplyrInfo();
  window.location.href = '/login';
};

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return !!getToken();
};

// 권한 확인
export const hasAuthority = (authorityCode: string): boolean => {
  const userInfo = getUserInfo();
  return userInfo?.authorityCode === authorityCode;
};

// 관리자 권한 확인
export const isAdmin = (): boolean => {
  const userInfo = getUserInfo();
  return ['ROLE_ADMIN', 'SYSTEM_ADMIN', 'SUPER_ADMIN', 'STAFF_ADMIN'].includes(userInfo?.authorityCode || '');
}; 