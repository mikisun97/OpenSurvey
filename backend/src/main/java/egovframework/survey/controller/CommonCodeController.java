package egovframework.survey.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ResponseBody;

import egovframework.survey.service.CommonCodeService;
import egovframework.survey.vo.CommonCodeResponseVO;
import egovframework.survey.vo.CommonCodeDetailResponseVO;
import egovframework.survey.vo.CommonCodeSearchVO;
import egovframework.survey.vo.CommonCodeVO;
import egovframework.survey.vo.CommonCodeDetailVO;
import egovframework.survey.vo.EgovResponseVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import egovframework.survey.vo.CommonCodeDetailSearchVO;

@RestController
@RequestMapping("/sym/ccm")
@Tag(name = "CommonCode", description = "공통코드 관리 API")
@CrossOrigin(origins = "*")
public class CommonCodeController {

    @Autowired
    private CommonCodeService commonCodeService;

    // 공통코드 그룹 관련 API (RESTful 방식)
    @GetMapping("/codes")
    @Operation(summary = "공통코드 목록 조회", description = "공통코드 목록을 페이징하여 조회합니다.")
    @ResponseBody
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "공통코드 목록 조회 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public EgovResponseVO<List<CommonCodeVO>> getCommonCodeList(
            @ModelAttribute CommonCodeSearchVO searchVO) {
        
        System.out.println("=== 공통코드 목록 조회 요청 (전자정부 프레임워크 표준) ===");
        System.out.println("검색 키워드: " + searchVO.getSearchKeyword());
        System.out.println("검색 조건: " + searchVO.getSearchCondition());
        System.out.println("사용 여부: " + searchVO.getSearchUseAt());
        System.out.println("페이지: " + searchVO.getPageIndex());
        System.out.println("페이지 크기: " + searchVO.getPageSize());
        System.out.println("정렬 필드: " + searchVO.getSortField());
        System.out.println("정렬 방향: " + searchVO.getSortOrder());
        System.out.println("================================");
        
        // 정렬 필드 변환 처리
        String convertedSortField = convertSortField(searchVO.getSortField());
        System.out.println("변환된 정렬 필드: " + convertedSortField);
        
        // searchVO에 변환된 정렬 필드 설정
        searchVO.setSortField(convertedSortField);
        
        System.out.println("CommonCodeSearchVO 설정 완료:");
        System.out.println("  - pageIndex: " + searchVO.getPageIndex());
        System.out.println("  - pageSize: " + searchVO.getPageSize());
        System.out.println("  - sortField: " + searchVO.getSortField());
        System.out.println("  - sortOrder: " + searchVO.getSortOrder());
        
        try {
            CommonCodeResponseVO responseVO = commonCodeService.selectCommonCodeList(searchVO);
            
            if ("SUCCESS".equals(responseVO.getResultCode())) {
                return EgovResponseVO.success(responseVO.getList(), responseVO.getPaginationInfo());
            } else {
                return EgovResponseVO.error(responseVO.getResultMessage());
            }
        } catch (Exception e) {
            System.err.println("=== 공통코드 목록 조회 중 오류 발생 ===");
            System.err.println("오류 메시지: " + e.getMessage());
            System.err.println("오류 원인: " + e.getCause());
            System.err.println("스택 트레이스:");
            e.printStackTrace();
            System.err.println("==========================================");
            return EgovResponseVO.error("공통코드 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/codes/{codeId}")
    @Operation(summary = "공통코드 상세 조회", description = "특정 공통코드를 조회합니다.")
    @ResponseBody
    public EgovResponseVO<CommonCodeVO> getCommonCode(@PathVariable String codeId) {
        CommonCodeVO data = commonCodeService.selectCommonCode(codeId);
        return EgovResponseVO.success(data);
    }

    @PostMapping("/codes")
    @Operation(summary = "공통코드 등록", description = "새로운 공통코드를 등록합니다.")
    @ResponseBody
    public EgovResponseVO<String> createCommonCode(@RequestBody CommonCodeVO commonCodeVO) {
        try {
            commonCodeService.insertCommonCode(commonCodeVO);
            return EgovResponseVO.success("SUCCESS");
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }

    @PutMapping("/codes/{codeId}")
    @Operation(summary = "공통코드 수정", description = "기존 공통코드를 수정합니다.")
    @ResponseBody
    public EgovResponseVO<String> updateCommonCode(@PathVariable String codeId, @RequestBody CommonCodeVO commonCodeVO) {
        try {
            commonCodeVO.setCodeId(codeId);
            commonCodeService.updateCommonCode(commonCodeVO);
            return EgovResponseVO.success("SUCCESS");
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }

    @DeleteMapping("/codes/{codeId}")
    @Operation(summary = "공통코드 삭제", description = "공통코드를 삭제합니다.")
    @ResponseBody
    public EgovResponseVO<String> deleteCommonCode(@PathVariable String codeId) {
        try {
            commonCodeService.deleteCommonCode(codeId);
            return EgovResponseVO.success("SUCCESS");
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }

    // 공통코드 상세 관련 API
    @GetMapping("/codes/{codeId}/details")
    @Operation(summary = "공통코드 상세 목록 조회", description = "특정 공통코드의 상세 목록을 페이징하여 조회합니다.")
    @ResponseBody
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "공통코드 상세 목록 조회 성공"),
        @ApiResponse(responseCode = "400", description = "잘못된 요청"),
        @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public EgovResponseVO<List<CommonCodeDetailVO>> getCommonCodeDetailList(
            @Parameter(description = "공통코드 ID") @PathVariable String codeId,
            @ModelAttribute CommonCodeDetailSearchVO searchVO) {
        
        System.out.println("=== 공통코드 상세 목록 조회 요청 (전자정부 프레임워크 표준) ===");
        System.out.println("codeId: " + codeId);
        System.out.println("검색 키워드: " + searchVO.getSearchKeyword());
        System.out.println("검색 조건: " + searchVO.getSearchCondition());
        System.out.println("사용 여부: " + searchVO.getSearchUseAt());
        System.out.println("페이지: " + searchVO.getPageIndex());
        System.out.println("페이지 크기: " + searchVO.getPageSize());
        System.out.println("정렬 필드: " + searchVO.getSortField());
        System.out.println("정렬 방향: " + searchVO.getSortOrder());
        System.out.println("================================");
        
        // 정렬 필드 변환 처리
        String convertedSortField = convertDetailSortField(searchVO.getSortField());
        System.out.println("변환된 정렬 필드: " + convertedSortField);
        
        // searchVO에 변환된 정렬 필드 설정
        searchVO.setSortField(convertedSortField);
        
        System.out.println("CommonCodeDetailSearchVO 설정 완료:");
        System.out.println("  - pageIndex: " + searchVO.getPageIndex());
        System.out.println("  - pageSize: " + searchVO.getPageSize());
        System.out.println("  - sortField: " + searchVO.getSortField());
        System.out.println("  - sortOrder: " + searchVO.getSortOrder());
        
        try {
            CommonCodeDetailResponseVO responseVO = commonCodeService.selectCommonCodeDetailList(codeId, searchVO);
            
            if ("SUCCESS".equals(responseVO.getResultCode())) {
                return EgovResponseVO.success(responseVO.getList(), responseVO.getPaginationInfo());
            } else {
                return EgovResponseVO.error(responseVO.getResultMessage());
            }
        } catch (Exception e) {
            System.err.println("=== 공통코드 상세 목록 조회 중 오류 발생 ===");
            System.err.println("오류 메시지: " + e.getMessage());
            System.err.println("오류 원인: " + e.getCause());
            System.err.println("스택 트레이스:");
            e.printStackTrace();
            System.err.println("==========================================");
            return EgovResponseVO.error("공통코드 상세 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/codes/{codeId}/details/{code}")
    @Operation(summary = "세부코드 상세 조회", description = "특정 세부코드를 조회합니다.")
    @ResponseBody
    public EgovResponseVO<CommonCodeDetailVO> getCommonCodeDetail(@PathVariable String codeId, @PathVariable String code) {
        CommonCodeSearchVO searchVO = new CommonCodeSearchVO();
        searchVO.setCodeId(codeId);
        searchVO.setCode(code);
        CommonCodeDetailVO data = commonCodeService.selectCommonCodeDetail(searchVO);
        return EgovResponseVO.success(data);
    }

    @PostMapping("/codes/{codeId}/details")
    @Operation(summary = "세부코드 등록", description = "새로운 세부코드를 등록합니다.")
    @ResponseBody
    public EgovResponseVO<String> createCommonCodeDetail(@PathVariable String codeId, @RequestBody CommonCodeDetailVO commonCodeDetailVO) {
        try {
            commonCodeDetailVO.setCodeId(codeId);
            commonCodeService.insertCommonCodeDetail(commonCodeDetailVO);
            return EgovResponseVO.success("SUCCESS");
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }

    @PutMapping("/codes/{codeId}/details/{code}")
    @Operation(summary = "세부코드 수정", description = "기존 세부코드를 수정합니다.")
    @ResponseBody
    public EgovResponseVO<String> updateCommonCodeDetail(@PathVariable String codeId, @PathVariable String code, @RequestBody CommonCodeDetailVO commonCodeDetailVO) {
        try {
            commonCodeDetailVO.setCodeId(codeId);
            commonCodeDetailVO.setCode(code);
            commonCodeService.updateCommonCodeDetail(commonCodeDetailVO);
            return EgovResponseVO.success("SUCCESS");
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }

    @DeleteMapping("/codes/{codeId}/details/{code}")
    @Operation(summary = "세부코드 삭제", description = "세부코드를 삭제합니다.")
    @ResponseBody
    public EgovResponseVO<String> deleteCommonCodeDetail(@PathVariable String codeId, @PathVariable String code) {
        try {
            CommonCodeSearchVO searchVO = new CommonCodeSearchVO();
            searchVO.setCodeId(codeId);
            searchVO.setCode(code);
            commonCodeService.deleteCommonCodeDetail(searchVO);
            return EgovResponseVO.success("SUCCESS");
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }

    /**
     * 정렬 필드를 데이터베이스 컬럼명으로 변환 (전자정부 프레임워크 표준)
     */
    private String convertSortField(String sortField) {
        // 허용된 정렬 필드 정의 (전자정부 프레임워크 표준)
        final String[] ALLOWED_COMMON_CODE_SORT_FIELDS = {
            "CODE_ID", "CODE_ID_NM", "CODE_ID_DC", "USE_AT", 
            "CL_CODE", "FRST_REGIST_PNTTM"
        };
        
        return validateSortField(sortField, ALLOWED_COMMON_CODE_SORT_FIELDS, "CODE_ID");
    }
    
    /**
     * 정렬 필드 검증 및 변환 (전자정부 프레임워크 표준)
     */
    private String validateSortField(String sortField, String[] allowedFields, String defaultField) {
        if (sortField == null || sortField.trim().isEmpty()) {
            System.out.println("정렬 필드가 비어있음, 기본값 " + defaultField + " 사용");
            return defaultField;
        }
        
        // 허용된 필드인지 검증 (대소문자 무관)
        for (String allowedField : allowedFields) {
            if (allowedField.equalsIgnoreCase(sortField)) {
                System.out.println("허용된 정렬 필드: " + sortField + " → " + allowedField);
                return allowedField;
            }
        }
        
        // 허용되지 않은 필드는 기본값 반환
        System.out.println("허용되지 않은 정렬 필드: " + sortField + ", 기본값 " + defaultField + " 사용");
        return defaultField;
    }

    /**
     * 공통 상세코드 정렬 필드를 데이터베이스 컬럼명으로 변환 (전자정부 프레임워크 표준)
     */
    private String convertDetailSortField(String sortField) {
        // 허용된 정렬 필드 정의 (전자정부 프레임워크 표준)
        final String[] ALLOWED_COMMON_CODE_DETAIL_SORT_FIELDS = {
            "CODE_ORDER", "CODE_NM", "CODE_DC", "USE_AT", 
            "FRST_REGIST_PNTTM"
        };
        
        return validateSortField(sortField, ALLOWED_COMMON_CODE_DETAIL_SORT_FIELDS, "CODE_ORDER");
    }
} 