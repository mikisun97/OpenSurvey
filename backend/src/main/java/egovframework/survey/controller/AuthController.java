package egovframework.survey.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import egovframework.survey.service.UserService;
import egovframework.survey.vo.EgovResponseVO;
import egovframework.survey.vo.LoginRequestVO;
import egovframework.survey.vo.LoginResponseVO;
import egovframework.survey.vo.EmplyrInfoVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/auth")
@Tag(name = "Auth", description = "인증 API")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    @Operation(summary = "로그인", description = "업무사용자 로그인을 처리합니다.")
    public EgovResponseVO<LoginResponseVO> login(@RequestBody LoginRequestVO loginRequest) {
        try {
            // 업무사용자 ID와 비밀번호로 인증
            EmplyrInfoVO emplyrInfo = userService.getUserByIdAndPassword(
                loginRequest.getUserId(), 
                loginRequest.getPassword()
            );
            
            if (emplyrInfo == null) {
                return EgovResponseVO.error("사용자 정보가 일치하지 않습니다.");
            }
            
            // 사용자 상태 확인
            if (!"A".equals(emplyrInfo.getEmplyrSttusCode())) {
                String statusMessage = getStatusMessage(emplyrInfo.getEmplyrSttusCode());
                return EgovResponseVO.error("로그인이 불가능한 상태입니다: " + statusMessage);
            }
            
            // JWT 토큰 생성
            String accessToken = userService.generateToken(emplyrInfo);
            
            // 응답 생성
            LoginResponseVO response = new LoginResponseVO();
            response.setAccessToken(accessToken);
            response.setUserId(emplyrInfo.getEmplyrId());
            response.setUserNm(emplyrInfo.getUserNm());
            response.setAuthorityCode(emplyrInfo.getAuthorCode());
            response.setAuthorityNm(emplyrInfo.getAuthorNm());
            response.setEsntlId(emplyrInfo.getEsntlId());
            response.setEmailAdres(emplyrInfo.getEmailAdres());
            response.setOfcpsNm(emplyrInfo.getOfcpsNm());
            response.setExpiresIn(3600); // 1시간
            
            return EgovResponseVO.success(response);
        } catch (Exception e) {
            return EgovResponseVO.error("로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    @Operation(summary = "내 정보 조회", description = "현재 로그인한 사용자의 정보를 조회합니다.")
    @SecurityRequirement(name = "bearerAuth")
    public EgovResponseVO<EmplyrInfoVO> getMyInfo(@RequestHeader("Authorization") String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return EgovResponseVO.error("유효하지 않은 Authorization 헤더입니다.");
            }
            
            String token = authorization.replace("Bearer ", "");
            String emplyrId = userService.getEmplyrIdFromToken(token);
            
            EmplyrInfoVO emplyrInfo = userService.getUserById(emplyrId);
            if (emplyrInfo == null) {
                return EgovResponseVO.error("사용자 정보를 찾을 수 없습니다.");
            }
            
            // 비밀번호 정보 제거
            emplyrInfo.setPassword(null);
            
            return EgovResponseVO.success(emplyrInfo);
        } catch (Exception e) {
            return EgovResponseVO.error("사용자 정보 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @PostMapping("/validate")
    @Operation(summary = "토큰 검증", description = "JWT 토큰의 유효성을 검증합니다.")
    @SecurityRequirement(name = "bearerAuth")
    public EgovResponseVO<Boolean> validateToken(@RequestHeader("Authorization") String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return EgovResponseVO.success(false);
            }
            
            String token = authorization.replace("Bearer ", "");
            boolean isValid = userService.validateToken(token);
            return EgovResponseVO.success(isValid);
        } catch (Exception e) {
            return EgovResponseVO.success(false);
        }
    }

    @PostMapping("/refresh")
    @Operation(summary = "토큰 갱신", description = "유효한 토큰을 새로운 토큰으로 갱신합니다.")
    @SecurityRequirement(name = "bearerAuth")
    public EgovResponseVO<LoginResponseVO> refreshToken(@RequestHeader("Authorization") String authorization) {
        try {
            if (authorization == null || !authorization.startsWith("Bearer ")) {
                return EgovResponseVO.error("유효하지 않은 Authorization 헤더입니다.");
            }
            
            String token = authorization.replace("Bearer ", "");
            String emplyrId = userService.getEmplyrIdFromToken(token);
            
            EmplyrInfoVO emplyrInfo = userService.getUserById(emplyrId);
            if (emplyrInfo == null || !"A".equals(emplyrInfo.getEmplyrSttusCode())) {
                return EgovResponseVO.error("토큰 갱신이 불가능합니다.");
            }
            
            // 새 토큰 생성
            String newAccessToken = userService.generateToken(emplyrInfo);
            
            LoginResponseVO response = new LoginResponseVO();
            response.setAccessToken(newAccessToken);
            response.setUserId(emplyrInfo.getEmplyrId());
            response.setUserNm(emplyrInfo.getUserNm());
            response.setAuthorityCode(emplyrInfo.getAuthorCode());
            response.setAuthorityNm(emplyrInfo.getAuthorNm());
            response.setEsntlId(emplyrInfo.getEsntlId());
            response.setEmailAdres(emplyrInfo.getEmailAdres());
            response.setOfcpsNm(emplyrInfo.getOfcpsNm());
            response.setExpiresIn(3600);
            
            return EgovResponseVO.success(response);
        } catch (Exception e) {
            return EgovResponseVO.error("토큰 갱신 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 업무사용자 상태코드에 따른 메시지 반환
     */
    private String getStatusMessage(String emplyrSttusCode) {
        switch (emplyrSttusCode) {
            case "P": return "가입 승인 대기 중";
            case "D": return "사용 중지됨";
            default: return "알 수 없는 상태";
        }
    }
} 