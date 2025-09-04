package egovframework.survey.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import egovframework.survey.mapper.UserMapper;
import egovframework.survey.service.UserService;
import egovframework.survey.vo.EmplyrInfoVO;
import egovframework.survey.util.JwtUtil;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 업무사용자 ID로 사용자 정보 조회
     */
    @Override
    @Transactional(readOnly = true)
    public EmplyrInfoVO getUserById(String emplyrId) {
        return userMapper.selectUserById(emplyrId);
    }

    /**
     * 업무사용자 ID와 비밀번호로 사용자 정보 조회 (로그인용)
     */
    @Override
    @Transactional(readOnly = true)
    public EmplyrInfoVO getUserByIdAndPassword(String emplyrId, String password) {
        // 로그인 처리
        
        EmplyrInfoVO user = userMapper.selectUserById(emplyrId);
        
        if (user != null) {
            boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
            
            if (passwordMatches) {
                // 비밀번호가 일치하면 권한 정보까지 포함하여 반환
                return userMapper.selectUserByIdAndPassword(emplyrId, user.getPassword());
            }
        }
        
        return null;
    }
    
    /**
     * 사용자 권한명 조회
     */
    @Override
    @Transactional(readOnly = true)
    public String getAuthorityNm(String emplyrId) {
        return userMapper.selectAuthorityNm(emplyrId);
    }
    
    /**
     * JWT 토큰 생성
     */
    @Override
    public String generateToken(EmplyrInfoVO emplyrInfo) {
        return jwtUtil.generateToken(emplyrInfo.getEmplyrId(), emplyrInfo.getAuthorCode());
    }
    
    /**
     * JWT 토큰에서 업무사용자ID 추출
     */
    @Override
    public String getEmplyrIdFromToken(String token) {
        return jwtUtil.getUserIdFromToken(token);
    }
    
    /**
     * JWT 토큰 유효성 검증
     */
    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
    
    /**
     * 업무사용자 정보 등록
     */
    @Override
    public EmplyrInfoVO createEmplyrInfo(EmplyrInfoVO emplyrInfoVO) {
        // 고유ID 생성
        String esntlId = "USRCNFRM_" + System.currentTimeMillis();
        emplyrInfoVO.setEsntlId(esntlId);
        
        // 비밀번호 암호화
        if (emplyrInfoVO.getPassword() != null) {
            String encodedPassword = passwordEncoder.encode(emplyrInfoVO.getPassword());
            emplyrInfoVO.setPassword(encodedPassword);
        }
        
        // 기본값 설정
        if (emplyrInfoVO.getEmplyrSttusCode() == null) {
            emplyrInfoVO.setEmplyrSttusCode("P"); // 신청 상태
        }
        
        // 업무사용자 정보 등록
        userMapper.insertEmplyrInfo(emplyrInfoVO);
        
        // 기본 권한 설정 (일반사용자)
        if (emplyrInfoVO.getAuthorCode() != null) {
            Map<String, Object> authorityParams = new HashMap<>();
            authorityParams.put("esntlId", esntlId);
            authorityParams.put("authorCode", emplyrInfoVO.getAuthorCode());
            authorityParams.put("mberTyCode", "USR01"); // 업무사용자
            
            userMapper.insertEmplyrAuthority(authorityParams);
        }
        
        return getUserById(emplyrInfoVO.getEmplyrId());
    }
    
    /**
     * 업무사용자 정보 수정
     */
    @Override
    public EmplyrInfoVO updateEmplyrInfo(EmplyrInfoVO emplyrInfoVO) {
        userMapper.updateEmplyrInfo(emplyrInfoVO);
        return getUserById(emplyrInfoVO.getEmplyrId());
    }
    
    /**
     * 업무사용자 비밀번호 수정
     */
    @Override
    public boolean updateEmplyrPassword(String esntlId, String newPassword, String lastUpdusrId) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        
        Map<String, Object> params = new HashMap<>();
        params.put("esntlId", esntlId);
        params.put("password", encodedPassword);
        params.put("lastUpdusrId", lastUpdusrId);
        
        return userMapper.updateEmplyrPassword(params) > 0;
    }
    
    /**
     * 업무사용자 상태 수정
     */
    @Override
    public boolean updateEmplyrStatus(String esntlId, String emplyrSttusCode, String lastUpdusrId) {
        Map<String, Object> params = new HashMap<>();
        params.put("esntlId", esntlId);
        params.put("emplyrSttusCode", emplyrSttusCode);
        params.put("lastUpdusrId", lastUpdusrId);
        
        return userMapper.updateEmplyrStatus(params) > 0;
    }
    
    /**
     * 업무사용자 권한 설정
     */
    @Override
    public boolean setEmplyrAuthority(String esntlId, String authorCode, String mberTyCode) {
        Map<String, Object> params = new HashMap<>();
        params.put("esntlId", esntlId);
        params.put("authorCode", authorCode);
        params.put("mberTyCode", mberTyCode);
        
        return userMapper.insertEmplyrAuthority(params) > 0;
    }
    
    /**
     * 업무사용자 권한 삭제
     */
    @Override
    public boolean removeEmplyrAuthority(String esntlId, String authorCode) {
        Map<String, Object> params = new HashMap<>();
        params.put("esntlId", esntlId);
        params.put("authorCode", authorCode);
        
        return userMapper.deleteEmplyrAuthority(params) > 0;
    }
    
    /**
     * 업무사용자 목록 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<EmplyrInfoVO> getEmplyrInfoList(String searchCondition, String searchKeyword, 
            String searchEmplyrSttusCode, String searchAuthorCode, int pageIndex, int pageUnit) {
        
        Map<String, Object> params = new HashMap<>();
        params.put("searchCondition", searchCondition);
        params.put("searchKeyword", searchKeyword);
        params.put("searchEmplyrSttusCode", searchEmplyrSttusCode);
        params.put("searchAuthorCode", searchAuthorCode);
        params.put("firstIndex", (pageIndex - 1) * pageUnit);
        params.put("pageUnit", pageUnit);
        
        return userMapper.selectEmplyrInfoList(params);
    }
    
    /**
     * 업무사용자 목록 총 개수 조회
     */
    @Override
    @Transactional(readOnly = true)
    public int getEmplyrInfoListTotCnt(String searchCondition, String searchKeyword, 
            String searchEmplyrSttusCode, String searchAuthorCode) {
        
        Map<String, Object> params = new HashMap<>();
        params.put("searchCondition", searchCondition);
        params.put("searchKeyword", searchKeyword);
        params.put("searchEmplyrSttusCode", searchEmplyrSttusCode);
        params.put("searchAuthorCode", searchAuthorCode);
        
        return userMapper.selectEmplyrInfoListTotCnt(params);
    }
} 