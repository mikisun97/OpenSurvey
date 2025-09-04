package egovframework.survey.service;

import java.util.List;
import java.util.Map;

import egovframework.survey.vo.EmplyrInfoVO;

public interface UserService {

    /**
     * 업무사용자 ID로 사용자 정보 조회
     * @param emplyrId 업무사용자ID
     * @return 업무사용자정보
     */
    EmplyrInfoVO getUserById(String emplyrId);

    /**
     * 업무사용자 ID와 비밀번호로 사용자 정보 조회 (로그인용)
     * @param emplyrId 업무사용자ID
     * @param password 비밀번호
     * @return 업무사용자정보
     */
    EmplyrInfoVO getUserByIdAndPassword(String emplyrId, String password);
    
    /**
     * 사용자 권한명 조회
     * @param emplyrId 업무사용자ID
     * @return 권한명
     */
    String getAuthorityNm(String emplyrId);
    
    /**
     * JWT 토큰 생성
     * @param emplyrInfo 업무사용자정보
     * @return JWT 토큰
     */
    String generateToken(EmplyrInfoVO emplyrInfo);
    
    /**
     * JWT 토큰에서 업무사용자ID 추출
     * @param token JWT 토큰
     * @return 업무사용자ID
     */
    String getEmplyrIdFromToken(String token);
    
    /**
     * JWT 토큰 유효성 검증
     * @param token JWT 토큰
     * @return 유효성 여부
     */
    boolean validateToken(String token);
    
    /**
     * 업무사용자 정보 등록
     * @param emplyrInfoVO 업무사용자정보
     * @return 등록된 업무사용자정보
     */
    EmplyrInfoVO createEmplyrInfo(EmplyrInfoVO emplyrInfoVO);
    
    /**
     * 업무사용자 정보 수정
     * @param emplyrInfoVO 업무사용자정보
     * @return 수정된 업무사용자정보
     */
    EmplyrInfoVO updateEmplyrInfo(EmplyrInfoVO emplyrInfoVO);
    
    /**
     * 업무사용자 비밀번호 수정
     * @param esntlId 고유ID
     * @param newPassword 새 비밀번호
     * @param lastUpdusrId 수정자ID
     * @return 수정 결과
     */
    boolean updateEmplyrPassword(String esntlId, String newPassword, String lastUpdusrId);
    
    /**
     * 업무사용자 상태 수정
     * @param esntlId 고유ID
     * @param emplyrSttusCode 상태코드
     * @param lastUpdusrId 수정자ID
     * @return 수정 결과
     */
    boolean updateEmplyrStatus(String esntlId, String emplyrSttusCode, String lastUpdusrId);
    
    /**
     * 업무사용자 권한 설정
     * @param esntlId 고유ID
     * @param authorCode 권한코드
     * @param mberTyCode 회원유형코드
     * @return 설정 결과
     */
    boolean setEmplyrAuthority(String esntlId, String authorCode, String mberTyCode);
    
    /**
     * 업무사용자 권한 삭제
     * @param esntlId 고유ID
     * @param authorCode 권한코드
     * @return 삭제 결과
     */
    boolean removeEmplyrAuthority(String esntlId, String authorCode);
    
    /**
     * 업무사용자 목록 조회
     * @param searchCondition 검색 조건
     * @param searchKeyword 검색 키워드
     * @param searchEmplyrSttusCode 상태코드
     * @param searchAuthorCode 권한코드
     * @param pageIndex 페이지 번호
     * @param pageUnit 페이지당 개수
     * @return 업무사용자 목록
     */
    List<EmplyrInfoVO> getEmplyrInfoList(String searchCondition, String searchKeyword, 
            String searchEmplyrSttusCode, String searchAuthorCode, int pageIndex, int pageUnit);
    
    /**
     * 업무사용자 목록 총 개수 조회
     * @param searchCondition 검색 조건
     * @param searchKeyword 검색 키워드
     * @param searchEmplyrSttusCode 상태코드
     * @param searchAuthorCode 권한코드
     * @return 총 개수
     */
    int getEmplyrInfoListTotCnt(String searchCondition, String searchKeyword, 
            String searchEmplyrSttusCode, String searchAuthorCode);
} 