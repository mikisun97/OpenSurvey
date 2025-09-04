package egovframework.survey.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import egovframework.survey.vo.EmplyrInfoVO;

@Mapper
public interface UserMapper {
    
    /**
     * 업무사용자 ID로 사용자 정보 조회
     * @param emplyrId 업무사용자ID
     * @return 업무사용자정보
     */
    EmplyrInfoVO selectUserById(@Param("emplyrId") String emplyrId);
    
    /**
     * 업무사용자 ID와 비밀번호로 사용자 정보 조회 (로그인용)
     * @param emplyrId 업무사용자ID
     * @param password 비밀번호
     * @return 업무사용자정보
     */
    EmplyrInfoVO selectUserByIdAndPassword(@Param("emplyrId") String emplyrId, @Param("password") String password);
    
    /**
     * 사용자 권한명 조회
     * @param emplyrId 업무사용자ID
     * @return 권한명
     */
    String selectAuthorityNm(@Param("emplyrId") String emplyrId);
    
    /**
     * 업무사용자 정보 등록
     * @param emplyrInfoVO 업무사용자정보
     * @return 등록 결과
     */
    int insertEmplyrInfo(EmplyrInfoVO emplyrInfoVO);
    
    /**
     * 업무사용자 정보 수정
     * @param emplyrInfoVO 업무사용자정보
     * @return 수정 결과
     */
    int updateEmplyrInfo(EmplyrInfoVO emplyrInfoVO);
    
    /**
     * 업무사용자 비밀번호 수정
     * @param params 파라미터 맵
     * @return 수정 결과
     */
    int updateEmplyrPassword(Map<String, Object> params);
    
    /**
     * 업무사용자 상태 수정
     * @param params 파라미터 맵
     * @return 수정 결과
     */
    int updateEmplyrStatus(Map<String, Object> params);
    
    /**
     * 업무사용자 권한 설정
     * @param params 파라미터 맵
     * @return 설정 결과
     */
    int insertEmplyrAuthority(Map<String, Object> params);
    
    /**
     * 업무사용자 권한 삭제
     * @param params 파라미터 맵
     * @return 삭제 결과
     */
    int deleteEmplyrAuthority(Map<String, Object> params);
    
    /**
     * 업무사용자 목록 조회
     * @param params 검색 조건
     * @return 업무사용자 목록
     */
    List<EmplyrInfoVO> selectEmplyrInfoList(Map<String, Object> params);
    
    /**
     * 업무사용자 목록 총 개수 조회
     * @param params 검색 조건
     * @return 총 개수
     */
    int selectEmplyrInfoListTotCnt(Map<String, Object> params);
} 