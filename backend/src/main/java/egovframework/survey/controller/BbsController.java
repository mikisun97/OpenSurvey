package egovframework.survey.controller;

import egovframework.survey.service.BbsService;
import egovframework.survey.service.UserService;
import egovframework.survey.vo.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import egovframework.survey.mapper.FileMapper;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

/**
 * 게시판 관리 Controller (전자정부 표준)
 */
@Tag(name = "게시판 관리", description = "게시판 관리 API")
@RestController
@RequestMapping("/sym/bbs")
@CrossOrigin(origins = "*")
public class BbsController {
    
    @Autowired
    private BbsService bbsService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private FileMapper fileMapper;
    
    // 파일 업로드 기본 경로 - 프로젝트 밖에 저장 (환경변수 또는 기본값)
    @Value("${file.upload.path}")
    private String uploadPath;
    
    // 기본값 설정 (환경변수가 없을 경우)
    private String getUploadDir() {
        String uploadDir = uploadPath != null ? uploadPath : System.getProperty("user.home") + "/uploads/opensurvey/";
        return uploadDir;
    }
    
    // 개발 환경에서는 프로젝트 안, 운영 환경에서는 프로젝트 밖
    // private static final String UPLOAD_DIR = System.getProperty("spring.profiles.active", "dev").equals("prod") 
    //     ? "/var/upload/opensurvey/" 
    //     : System.getProperty("user.dir") + "/../uploads/";
    
    // ===== 게시판 마스터 관리 =====
    
    @Operation(summary = "게시판 마스터 목록 조회", description = "게시판 마스터 목록을 페이징하여 조회합니다.")
    @GetMapping("/bbsmst")
    @ResponseBody
    public EgovResponseVO<List<BbsMstVO>> getBbsMstList(
            @ModelAttribute BbsMstSearchVO searchVO) {
        
        // 게시판 마스터 목록 조회 요청
        
        // 정렬 필드 변환 처리
        String convertedSortField = convertSortField(searchVO.getSortField());
        
        // searchVO에 변환된 정렬 필드 설정
        searchVO.setSortField(convertedSortField);
        
        try {
            Map<String, Object> result = bbsService.selectBbsMstList(searchVO);
            
            @SuppressWarnings("unchecked")
            List<BbsMstVO> list = (List<BbsMstVO>) result.get("resultList");
            PaginationInfo paginationInfo = (PaginationInfo) result.get("paginationInfo");
            
            return EgovResponseVO.success(list, paginationInfo);
        } catch (Exception e) {
            System.err.println("=== 게시판 마스터 목록 조회 중 오류 발생 ===");
            System.err.println("오류 메시지: " + e.getMessage());
            System.err.println("오류 원인: " + e.getCause());
            System.err.println("스택 트레이스:");
            e.printStackTrace();
            System.err.println("==========================================");
            return EgovResponseVO.error("게시판 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 정렬 필드를 데이터베이스 컬럼명으로 변환 (전자정부 프레임워크 표준)
     */
    private String convertSortField(String sortField) {
        // 허용된 정렬 필드 정의 (전자정부 프레임워크 표준)
        final String[] ALLOWED_SORT_FIELDS = {
            "BBS_ID", "BBS_NM", "BBS_TY_CODE", "REPLY_POSBL_AT", 
            "FILE_ATCH_POSBL_AT", "USE_AT", "FRST_REGIST_PNTTM"
        };
        
        return validateSortField(sortField, ALLOWED_SORT_FIELDS, "BBS_ID");
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
    
    @Operation(summary = "게시판 마스터 상세 조회", description = "게시판 마스터 상세 정보를 조회합니다.")
    @GetMapping("/bbsmst/{bbsId}")
    @ResponseBody
    public EgovResponseVO<BbsMstVO> getBbsMstDetail(
            @Parameter(description = "게시판ID") @PathVariable String bbsId) {
        
        try {
            BbsMstVO bbsMst = bbsService.selectBbsMst(bbsId);
            if (bbsMst != null) {
                return EgovResponseVO.success(bbsMst);
            } else {
                return EgovResponseVO.error("게시판을 찾을 수 없습니다.");
        }
        } catch (Exception e) {
            return EgovResponseVO.error("게시판 상세 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "게시판 마스터 등록", description = "새로운 게시판을 등록합니다.")
    @PostMapping("/bbsmst")
    @ResponseBody
    public EgovResponseVO<String> createBbsMst(@RequestBody BbsMstVO bbsMstVO) {
        try {
            int result = bbsService.insertBbsMst(bbsMstVO);
            if (result > 0) {
                return EgovResponseVO.success("SUCCESS");
            } else {
                return EgovResponseVO.error("게시판 등록에 실패했습니다.");
            }
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }
    
    @Operation(summary = "게시판 마스터 수정", description = "게시판 정보를 수정합니다.")
    @PutMapping("/bbsmst/{bbsId}")
    @ResponseBody
    public EgovResponseVO<String> updateBbsMst(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @RequestBody BbsMstVO bbsMstVO) {
        
        bbsMstVO.setBbsId(bbsId);
        
        // 게시판 마스터 수정 요청 로깅
        System.out.println("=== 게시판 마스터 수정 요청 ===");
        System.out.println("bbsId: " + bbsId);
        System.out.println("게시판명: " + bbsMstVO.getBbsNm());
        System.out.println("게시판소개: " + bbsMstVO.getBbsIntrcn());
        System.out.println("게시판유형코드: " + bbsMstVO.getBbsTyCode());
        System.out.println("게시판속성코드: " + bbsMstVO.getBbsAttrbCode());
        System.out.println("답글가능여부: " + bbsMstVO.getReplyPosblAt());
        System.out.println("파일첨부가능여부: " + bbsMstVO.getFileAtchPosblAt());
        System.out.println("첨부가능파일숫자: " + bbsMstVO.getAtchPosblFileNumber());
        System.out.println("첨부가능파일사이즈: " + bbsMstVO.getAtchPosblFileSize());
        System.out.println("사용여부: " + bbsMstVO.getUseAt());
        System.out.println("템플릿ID: " + bbsMstVO.getTmplatId());
        System.out.println("구분코드ID: " + bbsMstVO.getCategoryCodeId());
        
        // 이미지 관련 설정 로깅
        System.out.println("=== 이미지 설정 ===");
        System.out.println("대표이미지 사용여부: " + bbsMstVO.getRepresentImageUseAt());
        System.out.println("대표이미지 권장 너비: " + bbsMstVO.getRepresentImageWidth());
        System.out.println("대표이미지 권장 높이: " + bbsMstVO.getRepresentImageHeight());
        System.out.println("메인화면이미지 사용여부: " + bbsMstVO.getMainImageUseAt());
        System.out.println("메인화면이미지 권장 너비: " + bbsMstVO.getMainImageWidth());
        System.out.println("메인화면이미지 권장 높이: " + bbsMstVO.getMainImageHeight());
        System.out.println("다중이미지 사용여부: " + bbsMstVO.getMultiImageUseAt());
        System.out.println("다중이미지 표시명: " + bbsMstVO.getMultiImageDisplayName());
        System.out.println("다중이미지 최대개수: " + bbsMstVO.getMultiImageMaxCount());
        System.out.println("다중이미지 권장 너비: " + bbsMstVO.getMultiImageWidth());
        System.out.println("다중이미지 권장 높이: " + bbsMstVO.getMultiImageHeight());
        System.out.println("================================");
        
        try {
            int result = bbsService.updateBbsMst(bbsMstVO);
            if (result > 0) {
                return EgovResponseVO.success("SUCCESS");
            } else {
                return EgovResponseVO.error("게시판 수정에 실패했습니다.");
            }
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }
    
    @Operation(summary = "게시판 마스터 삭제", description = "게시판을 삭제합니다.")
    @DeleteMapping("/bbsmst/{bbsId}")
    @ResponseBody
    public EgovResponseVO<String> deleteBbsMst(
            @Parameter(description = "게시판ID") @PathVariable String bbsId) {
        
        try {
            int result = bbsService.deleteBbsMst(bbsId);
            if (result > 0) {
                return EgovResponseVO.success("SUCCESS");
            } else {
                return EgovResponseVO.error("게시판 삭제에 실패했습니다.");
            }
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }
    
    // ===== 게시글 관리 =====
    
    @Operation(summary = "게시글 목록 조회", description = "특정 게시판의 게시글 목록을 페이징하여 조회합니다.")
    @GetMapping("/{bbsId}/boards")
    @ResponseBody
    public EgovResponseVO<List<BbsVO>> getBbsList(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @ModelAttribute BbsSearchVO searchVO) {
        
        System.out.println("=== 게시글 목록 조회 요청 (전자정부 프레임워크 표준) ===");
        System.out.println("bbsId: " + bbsId);
        System.out.println("검색 키워드: " + searchVO.getSearchKeyword());
        System.out.println("공지 여부: " + searchVO.getSearchNtceAt());
        System.out.println("공개 여부: " + searchVO.getSearchExposureYn());
        System.out.println("구분 코드: " + searchVO.getSearchCategory());
        System.out.println("페이지: " + searchVO.getPageIndex());
        System.out.println("페이지 크기: " + searchVO.getPageSize());
        System.out.println("정렬 필드: " + searchVO.getSortField());
        System.out.println("정렬 방향: " + searchVO.getSortOrder());
        System.out.println("================================");
        
        // bbsId 설정
        searchVO.setBbsId(bbsId);
        
        // 정렬 필드 변환 처리
        String convertedSortField = convertBbsSortField(searchVO.getSortField());
        System.out.println("변환된 정렬 필드: " + convertedSortField);
        
        // searchVO에 변환된 정렬 필드 설정
        searchVO.setSortField(convertedSortField);
        
        System.out.println("BbsSearchVO 설정 완료:");
        System.out.println("  - bbsId: " + searchVO.getBbsId());
        System.out.println("  - pageIndex: " + searchVO.getPageIndex());
        System.out.println("  - pageSize: " + searchVO.getPageSize());
        System.out.println("  - sortField: " + searchVO.getSortField());
        System.out.println("  - sortOrder: " + searchVO.getSortOrder());
        
        try {
            Map<String, Object> result = bbsService.selectBbsList(searchVO);
            System.out.println("Service 호출 성공, 결과 타입: " + (result != null ? result.getClass().getSimpleName() : "null"));
        
        // 🚨 게시글 목록 조회 결과 로그
        System.out.println("=== 게시글 목록 조회 결과 ===");
        System.out.println("bbsId: " + bbsId);
        if (result != null && result.get("resultList") != null) {
            List<BbsVO> bbsList = (List<BbsVO>) result.get("resultList");
            System.out.println("조회된 게시글 수: " + bbsList.size());
            for (int i = 0; i < Math.min(bbsList.size(), 3); i++) { // 처음 3개만 로그
                BbsVO bbs = bbsList.get(i);
                System.out.println("게시글 " + (i+1) + ":");
                System.out.println("  nttId: " + bbs.getNttId());
                System.out.println("  nttSj: " + bbs.getNttSj());
                System.out.println("  exposureYn: " + bbs.getExposureYn() + " (null? " + (bbs.getExposureYn() == null) + ")");
            }
        }
        System.out.println("=== 게시글 목록 조회 결과 끝 ===");
        
            @SuppressWarnings("unchecked")
            List<BbsVO> list = (List<BbsVO>) result.get("resultList");
            PaginationInfo paginationInfo = (PaginationInfo) result.get("paginationInfo");
            
            return EgovResponseVO.success(list, paginationInfo);
        } catch (Exception e) {
            System.err.println("=== 게시글 목록 조회 중 오류 발생 ===");
            System.err.println("오류 메시지: " + e.getMessage());
            System.err.println("오류 원인: " + e.getCause());
            System.err.println("스택 트레이스:");
            e.printStackTrace();
            System.err.println("==========================================");
            return EgovResponseVO.error("게시글 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 게시글 정렬 필드를 데이터베이스 컬럼명으로 변환 (전자정부 프레임워크 표준)
     */
    private String convertBbsSortField(String sortField) {
        // 허용된 정렬 필드 정의 (전자정부 프레임워크 표준)
        final String[] ALLOWED_BBS_SORT_FIELDS = {
            "NTT_ID", "NTT_SJ", "NTT_CN", "NTCE_AT", 
            "EXPOSURE_YN", "FRST_REGIST_PNTTM", "LAST_UPDUSR_PNTTM", "RDCNT"
        };
        
        return validateSortField(sortField, ALLOWED_BBS_SORT_FIELDS, "FRST_REGIST_PNTTM");
    }
    
    @Operation(summary = "게시글 상세 조회", description = "특정 게시글의 상세 정보를 조회합니다.")
    @GetMapping("/{bbsId}/boards/{nttId}")
    @ResponseBody
    public EgovResponseVO<BbsVO> getBbsDetail(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @Parameter(description = "게시글번호") @PathVariable int nttId,
            @Parameter(description = "조회수 증가 여부") @RequestParam(defaultValue = "false") boolean incrementView) {
        
        try {
            BbsVO bbs = bbsService.selectBbs(bbsId, nttId);
            if (bbs != null) {
                // incrementView가 true일 때만 조회수 증가
                if (incrementView) {
                    System.out.println("조회수 증가 처리: bbsId=" + bbsId + ", nttId=" + nttId);
                    bbsService.updateRdcnt(bbsId, nttId);
                }
                return EgovResponseVO.success(bbs);
        } else {
                return EgovResponseVO.error("게시글을 찾을 수 없습니다.");
        }
        } catch (Exception e) {
            return EgovResponseVO.error("게시글 상세 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "게시글 등록", description = "새로운 게시글을 등록합니다.")
    @PostMapping("/{bbsId}/boards")
    @ResponseBody
    public EgovResponseVO<String> createBbs(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @RequestBody BbsVO bbsVO) {
        
        // 🚨 게시글 등록 요청 로그
        System.out.println("=== 게시글 등록 요청 ===");
        System.out.println("bbsId: " + bbsId);
        System.out.println("BbsVO 전체: " + bbsVO);
        System.out.println("각 필드별 값:");
        System.out.println("  nttSj: '" + bbsVO.getNttSj() + "' (null? " + (bbsVO.getNttSj() == null) + ")");
        System.out.println("  nttCn: '" + (bbsVO.getNttCn() != null ? "내용있음" : "null") + "' (null? " + (bbsVO.getNttCn() == null) + ")");
        System.out.println("  ntceAt: '" + bbsVO.getNtceAt() + "' (null? " + (bbsVO.getNtceAt() == null) + ")");
        System.out.println("  exposureYn: '" + bbsVO.getExposureYn() + "' (null? " + (bbsVO.getExposureYn() == null) + ")");
        System.out.println("  atchFileId: '" + bbsVO.getAtchFileId() + "' (null? " + (bbsVO.getAtchFileId() == null) + ")");
        System.out.println("  nttCategory: '" + bbsVO.getNttCategory() + "' (null? " + (bbsVO.getNttCategory() == null) + ")");
        System.out.println("  representImageId: '" + bbsVO.getRepresentImageId() + "' (null? " + (bbsVO.getRepresentImageId() == null) + ")");
        System.out.println("  representImageName: '" + bbsVO.getRepresentImageName() + "' (null? " + (bbsVO.getRepresentImageName() == null) + ")");
        System.out.println("  mainImageId: '" + bbsVO.getMainImageId() + "' (null? " + (bbsVO.getMainImageId() == null) + ")");
        System.out.println("  mainImageName: '" + bbsVO.getMainImageName() + "' (null? " + (bbsVO.getMainImageName() == null) + ")");
        System.out.println("  multiImageIds: " + (bbsVO.getMultiImageIds() != null ? bbsVO.getMultiImageIds().size() : 0));
        System.out.println("  multiImageNames: " + (bbsVO.getMultiImageNames() != null ? bbsVO.getMultiImageNames().size() : 0));
        System.out.println("=== 요청 데이터 끝 ===");
        
        try {
        bbsVO.setBbsId(bbsId);
        
        // 현재 로그인한 사용자 정보 설정
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String currentUserId = authentication.getName();
            System.out.println("현재 로그인한 사용자 ID: " + currentUserId);
            
            // 사용자 정보 조회하여 작성자명 설정
            try {
                EmplyrInfoVO currentUser = userService.getUserById(currentUserId);
                if (currentUser != null) {
                    bbsVO.setFrstRegisterId(currentUserId);   // 최초등록자ID
                    bbsVO.setNtcrnNm(currentUser.getUserNm()); // 작성자명
                    System.out.println("작성자 정보 설정: ID=" + currentUserId + ", 이름=" + currentUser.getUserNm());
                } else {
                    System.out.println("사용자 정보를 찾을 수 없습니다: " + currentUserId);
                    bbsVO.setFrstRegisterId(currentUserId);   // 최초등록자ID
                    bbsVO.setNtcrnNm(currentUserId);          // 사용자명이 없으면 ID 사용
                }
            } catch (Exception e) {
                System.out.println("사용자 정보 조회 중 오류: " + e.getMessage());
                bbsVO.setFrstRegisterId(currentUserId);   // 최초등록자ID
                bbsVO.setNtcrnNm(currentUserId);          // 오류 시 ID 사용
            }
        } else {
            System.out.println("인증된 사용자 정보가 없습니다.");
        }
        
            int result = bbsService.insertBbs(bbsVO);
            if (result > 0) {
                System.out.println("게시글 등록 성공: nttId=" + bbsVO.getNttId());
                
                // 🚨 게시글 등록 후 이미지 처리 로직 추가
                System.out.println("=== 게시글 등록 후 이미지 처리 시작 ===");
                
                // 대표이미지 처리
                if (bbsVO.getRepresentImageId() != null && !bbsVO.getRepresentImageId().trim().isEmpty()) {
                    System.out.println("대표이미지 처리 시작: " + bbsVO.getRepresentImageId());
                    try {
                        String atchFileId = bbsVO.getAtchFileId();
                        if (atchFileId == null || atchFileId.trim().isEmpty()) {
                            atchFileId = "FILE_" + System.currentTimeMillis();
                            bbsVO.setAtchFileId(atchFileId);
                            // 게시물에 atchFileId 업데이트
                            bbsService.updateBbsAtchFileId(bbsVO.getNttId().intValue(), atchFileId);
                        }
                        processRepresentativeImage(atchFileId, bbsVO.getRepresentImageId(), bbsVO.getRepresentImageName(), bbsVO.getRepresentImageSize());
                        System.out.println("대표이미지 처리 완료");
                    } catch (Exception e) {
                        System.out.println("대표이미지 처리 중 오류: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
                
                // 메인화면이미지 처리
                if (bbsVO.getMainImageId() != null && !bbsVO.getMainImageId().trim().isEmpty()) {
                    System.out.println("메인화면이미지 처리 시작: " + bbsVO.getMainImageId());
                    try {
                        String atchFileId = bbsVO.getAtchFileId();
                        if (atchFileId == null || atchFileId.trim().isEmpty()) {
                            atchFileId = "FILE_" + System.currentTimeMillis();
                            bbsVO.setAtchFileId(atchFileId);
                            // 게시물에 atchFileId 업데이트
                            bbsService.updateBbsAtchFileId(bbsVO.getNttId().intValue(), atchFileId);
                        }
                        processMainImage(atchFileId, bbsVO.getMainImageId(), bbsVO.getMainImageName(), bbsVO.getMainImageSize());
                        System.out.println("메인화면이미지 처리 완료");
                    } catch (Exception e) {
                        System.out.println("메인화면이미지 처리 중 오류: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
                
                // 다중이미지 처리
                if (bbsVO.getMultiImageIds() != null && !bbsVO.getMultiImageIds().isEmpty()) {
                    System.out.println("다중이미지 처리 시작: " + bbsVO.getMultiImageIds().size() + "개");
                    try {
                        String atchFileId = bbsVO.getAtchFileId();
                        if (atchFileId == null || atchFileId.trim().isEmpty()) {
                            atchFileId = "FILE_" + System.currentTimeMillis();
                            bbsVO.setAtchFileId(atchFileId);
                            // 게시물에 atchFileId 업데이트
                            bbsService.updateBbsAtchFileId(bbsVO.getNttId().intValue(), atchFileId);
                        }
                        
                        // 다중이미지를 게시물의 atchFileId 그룹으로 이동
                        processMultiImagesForCreate(atchFileId, bbsVO.getMultiImageIds(), bbsVO.getMultiImageNames(), bbsVO.getMultiImageOrder());
                        System.out.println("다중이미지 처리 완료");
                    } catch (Exception e) {
                        System.out.println("다중이미지 처리 중 오류: " + e.getMessage());
                        e.printStackTrace();
                    }
                }
                
                System.out.println("=== 게시글 등록 후 이미지 처리 완료 ===");
                
                // 🚨 게시물 목록 캐시 무효화 (목록 갱신을 위해)
                System.out.println("게시물 목록 캐시 무효화: bbsId=" + bbsId);
                
                return EgovResponseVO.success("게시글이 성공적으로 등록되었습니다.");
            } else {
                System.out.println("게시글 등록 실패: 영향받은 행 수=" + result);
                return EgovResponseVO.error("게시글 등록에 실패했습니다.");
            }
        } catch (Exception e) {
            System.out.println("게시글 등록 중 예외 발생");
            System.out.println("예외 메시지: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("게시글 등록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "게시글 수정", description = "게시글을 수정합니다.")
    @PutMapping("/{bbsId}/boards/{nttId}")
    @ResponseBody
    public EgovResponseVO<String> updateBbs(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @Parameter(description = "게시글ID") @PathVariable Long nttId,
            @RequestBody BbsVO bbsVO) {
        
        // 🚨 SQL 실행 전에 받은 데이터 상세 로그
        System.out.println("=== 게시물 수정 요청 데이터 ===");
        System.out.println("bbsId: " + bbsId);
        System.out.println("nttId: " + nttId);
        System.out.println("BbsVO 전체: " + bbsVO);
        System.out.println("각 필드별 값:");
        System.out.println("  nttSj: '" + bbsVO.getNttSj() + "' (null? " + (bbsVO.getNttSj() == null) + ")");
        System.out.println("  nttCn: '" + (bbsVO.getNttCn() != null ? "내용있음" : "null") + "' (null? " + (bbsVO.getNttCn() == null) + ")");
        System.out.println("  ntceAt: '" + bbsVO.getNtceAt() + "' (null? " + (bbsVO.getNtceAt() == null) + ")");
        System.out.println("  exposureYn: '" + bbsVO.getExposureYn() + "' (null? " + (bbsVO.getExposureYn() == null) + ")");
        System.out.println("  atchFileId: '" + bbsVO.getAtchFileId() + "' (null? " + (bbsVO.getAtchFileId() == null) + ")");
        System.out.println("  nttCategory: '" + bbsVO.getNttCategory() + "' (null? " + (bbsVO.getNttCategory() == null) + ")");
        System.out.println("  lastUpdusrId: '" + bbsVO.getLastUpdusrId() + "' (null? " + (bbsVO.getLastUpdusrId() == null) + ")");
        System.out.println("  representImageId: '" + bbsVO.getRepresentImageId() + "' (null? " + (bbsVO.getRepresentImageId() == null) + ")");
        System.out.println("  representImageName: '" + bbsVO.getRepresentImageName() + "' (null? " + (bbsVO.getRepresentImageName() == null) + ")");
        System.out.println("  mainImageId: '" + bbsVO.getMainImageId() + "' (null? " + (bbsVO.getMainImageId() == null) + ")");
        System.out.println("  mainImageName: '" + bbsVO.getMainImageName() + "' (null? " + (bbsVO.getMainImageName() == null) + ")");
        System.out.println("  multiImageIds: " + (bbsVO.getMultiImageIds() != null ? bbsVO.getMultiImageIds().size() : 0));
        System.out.println("  multiImageNames: " + (bbsVO.getMultiImageNames() != null ? bbsVO.getMultiImageNames().size() : 0));
        System.out.println("=== 요청 데이터 끝 ===");
        
        // 구분 코드 "NONE"을 null로 변환
        if ("NONE".equals(bbsVO.getNttCategory())) {
            System.out.println("구분 코드 'NONE'을 null로 변환");
            bbsVO.setNttCategory(null);
        }
        
        bbsVO.setBbsId(bbsId);
        bbsVO.setNttId(nttId);
        
        // 현재 로그인한 사용자 정보 설정 (수정자)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String currentUserId = authentication.getName();
            System.out.println("현재 로그인한 사용자 ID (수정자): " + currentUserId);
            bbsVO.setLastUpdusrId(currentUserId);   // 최종수정자ID 설정
        } else {
            System.out.println("인증된 사용자 정보가 없습니다.");
        }
        
        try {
            int result = bbsService.updateBbs(bbsVO);
            if (result > 0) {
                System.out.println("=== 게시물 수정 성공, 대표이미지 처리 확인 시작 ===");
                System.out.println("atchFileId: " + bbsVO.getAtchFileId());
                System.out.println("representImageId: " + bbsVO.getRepresentImageId());
                System.out.println("representImageName: " + bbsVO.getRepresentImageName());
                System.out.println("representImageId null 체크: " + (bbsVO.getRepresentImageId() == null));
                System.out.println("representImageId empty 체크: " + (bbsVO.getRepresentImageId() != null ? bbsVO.getRepresentImageId().trim().isEmpty() : "null이므로 체크불가"));
                
                // 대표이미지 처리 로직
                if (bbsVO.getRepresentImageId() != null) {
                    if (bbsVO.getRepresentImageId().trim().isEmpty()) {
                        // 1. 삭제 요청 (빈 문자열)
                        System.out.println("=== 대표이미지 삭제 요청 처리 ===");
                        try {
                            if (bbsVO.getAtchFileId() != null && !bbsVO.getAtchFileId().trim().isEmpty()) {
                                // 기존 대표이미지 삭제
                                deleteRepresentativeImage(bbsVO.getAtchFileId());
                                System.out.println("=== 대표이미지 삭제 완료 ===");
                            }
                        } catch (Exception e) {
                            System.out.println("=== 대표이미지 삭제 중 오류 발생 ===");
                            System.out.println("오류 메시지: " + e.getMessage());
                            e.printStackTrace();
                            // 삭제 실패해도 게시물 수정은 성공으로 처리
                        }
                    } else {
                        // 2. 새 이미지 추가 요청
                        System.out.println("=== 대표이미지 추가 요청 처리 ===");
                        System.out.println("atchFileId: " + bbsVO.getAtchFileId());
                        System.out.println("representImageId: " + bbsVO.getRepresentImageId());
                        System.out.println("representImageName: " + bbsVO.getRepresentImageName());
                        System.out.println("representImageSize: " + bbsVO.getRepresentImageSize());
                        
                        try {
                            // atchFileId가 null이면 새로운 파일 그룹 생성
                            String targetAtchFileId = bbsVO.getAtchFileId();
                            if (targetAtchFileId == null || targetAtchFileId.trim().isEmpty()) {
                                targetAtchFileId = "FILE_" + System.currentTimeMillis();
                                System.out.println("새로운 atchFileId 생성: " + targetAtchFileId);
                                
                                // 게시물에 atchFileId 업데이트
                                bbsVO.setAtchFileId(targetAtchFileId);
                                System.out.println("게시물 atchFileId 설정 완료: " + targetAtchFileId);
                            }
                            
                            // 대표이미지를 atchFileId 그룹에 추가
                            processRepresentativeImage(targetAtchFileId, bbsVO.getRepresentImageId(), bbsVO.getRepresentImageName(), bbsVO.getRepresentImageSize());
                            System.out.println("=== 대표이미지 추가 완료 ===");
                            
                            // 게시물에 atchFileId 업데이트 (새로 생성된 경우에만)
                            System.out.println("게시물 atchFileId 업데이트 시작: " + targetAtchFileId);
                            int updateResult = bbsService.updateBbsAtchFileId(bbsVO.getNttId().intValue(), targetAtchFileId);
                            if (updateResult > 0) {
                                System.out.println("게시물 atchFileId 업데이트 성공: " + targetAtchFileId);
                            } else {
                                System.out.println("게시물 atchFileId 업데이트 실패");
                            }
                        } catch (Exception e) {
                            System.out.println("=== 대표이미지 추가 중 오류 발생 ===");
                            System.out.println("오류 메시지: " + e.getMessage());
                            e.printStackTrace();
                            // 대표이미지 처리 실패해도 게시물 수정은 성공으로 처리
                        }
                    }
                } else {
                    // 3. 변경 없음 (representImageId가 null)
                    System.out.println("=== 대표이미지 변경 없음 ===");
                    System.out.println("representImageId가 null - 기존 이미지 유지");
                    // 기존 대표이미지는 삭제하지 않고 그대로 유지
                }
                
                // 메인화면이미지 처리 로직
                System.out.println("=== 메인화면이미지 처리 시작 ===");
                System.out.println("mainImageId null 체크: " + (bbsVO.getMainImageId() == null));
                if (bbsVO.getMainImageId() != null) {
                    System.out.println("mainImageId 값: '" + bbsVO.getMainImageId() + "'");
                    System.out.println("mainImageId 빈 문자열 체크: " + bbsVO.getMainImageId().trim().isEmpty());
                    System.out.println("mainImageName: '" + bbsVO.getMainImageName() + "'");
                    System.out.println("mainImageSize: " + bbsVO.getMainImageSize());
                    
                    if (bbsVO.getMainImageId().trim().isEmpty()) {
                        // 1. 삭제 요청 (빈 문자열)
                        System.out.println("=== 메인화면이미지 삭제 요청 처리 ===");
                        try {
                            if (bbsVO.getAtchFileId() != null && !bbsVO.getAtchFileId().trim().isEmpty()) {
                                // 기존 메인화면이미지 삭제
                                deleteMainImage(bbsVO.getAtchFileId());
                                System.out.println("=== 메인화면이미지 삭제 완료 ===");
                            }
                        } catch (Exception e) {
                            System.out.println("=== 메인화면이미지 삭제 중 오류 발생 ===");
                            System.out.println("오류 메시지: " + e.getMessage());
                            e.printStackTrace();
                            // 삭제 실패해도 게시물 수정은 성공으로 처리
                        }
                    } else {
                        // 2. 새 이미지 추가 요청
                        System.out.println("=== 메인화면이미지 추가 요청 처리 ===");
                        System.out.println("atchFileId: " + bbsVO.getAtchFileId());
                        System.out.println("mainImageId: " + bbsVO.getMainImageId());
                        System.out.println("mainImageName: " + bbsVO.getMainImageName());
                        System.out.println("mainImageSize: " + bbsVO.getMainImageSize());
                        
                        try {
                            // atchFileId가 null이면 새로운 파일 그룹 생성
                            String targetAtchFileId = bbsVO.getAtchFileId();
                            if (targetAtchFileId == null || targetAtchFileId.trim().isEmpty()) {
                                targetAtchFileId = "FILE_" + System.currentTimeMillis();
                                System.out.println("새로운 atchFileId 생성: " + targetAtchFileId);
                                
                                // 게시물에 atchFileId 업데이트
                                bbsVO.setAtchFileId(targetAtchFileId);
                                System.out.println("게시물 atchFileId 설정 완료: " + targetAtchFileId);
                            }
                            
                            // 메인화면이미지를 atchFileId 그룹에 추가
                            processMainImage(targetAtchFileId, bbsVO.getMainImageId(), bbsVO.getMainImageName(), bbsVO.getMainImageSize());
                            System.out.println("=== 메인화면이미지 추가 완료 ===");
                            
                            // 게시물에 atchFileId 업데이트 (새로 생성된 경우에만)
                            System.out.println("게시물 atchFileId 업데이트 시작: " + targetAtchFileId);
                            int updateResult = bbsService.updateBbsAtchFileId(bbsVO.getNttId().intValue(), targetAtchFileId);
                            if (updateResult > 0) {
                                System.out.println("게시물 atchFileId 업데이트 성공: " + targetAtchFileId);
                            } else {
                                System.out.println("게시물 atchFileId 업데이트 실패");
                            }
                        } catch (Exception e) {
                            System.out.println("=== 메인화면이미지 추가 중 오류 발생 ===");
                            System.out.println("오류 메시지: " + e.getMessage());
                            e.printStackTrace();
                            // 메인화면이미지 처리 실패해도 게시물 수정은 성공으로 처리
                        }
                    }
                } else {
                    // 3. 변경 없음 (mainImageId가 null)
                    System.out.println("=== 메인화면이미지 변경 없음 ===");
                    System.out.println("mainImageId가 null - 기존 이미지 유지");
                    // 기존 메인화면이미지는 삭제하지 않고 그대로 유지
                }
                System.out.println("=== 메인화면이미지 처리 완료 ===");

                // 다중이미지 처리 로직
                System.out.println("=== 다중이미지 처리 시작 ===");
                if (bbsVO.getMultiImageIds() != null && !bbsVO.getMultiImageIds().isEmpty()) {
                    try {
                        String targetAtchFileId = bbsVO.getAtchFileId();
                        if (targetAtchFileId == null || targetAtchFileId.trim().isEmpty()) {
                            targetAtchFileId = "FILE_" + System.currentTimeMillis();
                            bbsVO.setAtchFileId(targetAtchFileId);
                        }
                        processMultiImages(targetAtchFileId, bbsVO.getMultiImageIds(), bbsVO.getMultiImageNames(), bbsVO.getMultiImageOrder());
                        // atchFileId 업데이트
                        int updateResult = bbsService.updateBbsAtchFileId(bbsVO.getNttId().intValue(), targetAtchFileId);
                        System.out.println("다중이미지 atchFileId 업데이트 결과: " + updateResult);
                    } catch (Exception e) {
                        System.out.println("다중이미지 처리 중 오류: " + e.getMessage());
                        e.printStackTrace();
                    }
                } else {
                    System.out.println("다중이미지 변경 없음 또는 목록 비어있음");
                }
                System.out.println("=== 다중이미지 처리 완료 ===");
                
                // 🚨 게시물 목록 캐시 무효화 (목록 갱신을 위해)
                System.out.println("게시물 목록 캐시 무효화: bbsId=" + bbsId);
                
                return EgovResponseVO.success("SUCCESS");
            } else {
                return EgovResponseVO.error("게시글 수정에 실패했습니다.");
            }
        } catch (Exception e) {
            return EgovResponseVO.error(e.getMessage());
        }
    }
    
    @Operation(summary = "게시글 삭제", description = "게시글을 삭제합니다.")
    @DeleteMapping("/{bbsId}/boards/{nttId}")
    @ResponseBody
    public EgovResponseVO<String> deleteBbs(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @Parameter(description = "게시글번호") @PathVariable Long nttId) {
        
        // 🚨 게시글 삭제 요청 로그
        System.out.println("=== 게시글 삭제 요청 ===");
        System.out.println("bbsId: " + bbsId);
        System.out.println("nttId: " + nttId + " (타입: Long)");
        System.out.println("nttId 값 확인: " + nttId);
        System.out.println("========================");
        
        try {
            int result = bbsService.deleteBbs(bbsId, nttId);
            if (result > 0) {
                System.out.println("게시글 삭제 성공: nttId=" + nttId);
                
                // 🚨 게시물 목록 캐시 무효화 (목록 갱신을 위해)
                System.out.println("게시물 목록 캐시 무효화: bbsId=" + bbsId);
                
                return EgovResponseVO.success("게시글이 성공적으로 삭제되었습니다.");
            } else {
                System.out.println("게시글 삭제 실패: nttId=" + nttId + " (영향받은 행 수: " + result + ")");
                return EgovResponseVO.error("게시글 삭제에 실패했습니다.");
            }
        } catch (Exception e) {
            System.out.println("게시글 삭제 중 예외 발생: nttId=" + nttId);
            System.out.println("예외 메시지: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("게시글 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 대표이미지 처리 메서드
     * 게시물 저장 시 대표이미지를 atchFileId 그룹에 추가
     */
    private void processRepresentativeImage(String atchFileId, String representImageId, String representImageName, Long representImageSize) {
        System.out.println("=== processRepresentativeImage 시작 ===");
        System.out.println("atchFileId: " + atchFileId);
        System.out.println("representImageId: " + representImageId);
        System.out.println("representImageName: " + representImageName);
        
        try {
            // 1. 기존 대표이미지가 있다면 삭제
            boolean hasExistingImage = fileMapper.existsImageByType(atchFileId, "REPRESENTATIVE");
            if (hasExistingImage) {
                System.out.println("기존 대표이미지 발견, 삭제 중...");
                FileVO existingImage = fileMapper.selectRepresentativeImage(atchFileId);
                if (existingImage != null) {
                    // 기존 물리적 파일 삭제
                    String existingFilePath = existingImage.getFileStreCours() + "/" + existingImage.getStreFileNm();
                    File existingFile = new File(existingFilePath);
                    if (existingFile.exists()) {
                        boolean deleted = existingFile.delete();
                        System.out.println("기존 파일 삭제 결과: " + deleted);
                    }
                    // DB에서 기존 대표이미지 삭제
                    fileMapper.deleteImageByType(atchFileId, "REPRESENTATIVE");
                    System.out.println("기존 대표이미지 DB 삭제 완료");
                }
            }
            
                                // 2. 새 대표이미지 정보로 FileVO 생성
                    FileVO fileVO = new FileVO();
                    fileVO.setAtchFileId(atchFileId);
                    
                    // 기존 파일들의 최대 FILE_SN + 1을 사용하여 중복 방지
                    Long nextFileSn = getNextFileSn(atchFileId);
                    System.out.println("다음 사용 가능한 FILE_SN: " + nextFileSn);
                    fileVO.setFileSn(nextFileSn);
                    
                    fileVO.setFileStreCours(getUploadDir());
                    fileVO.setStreFileNm(representImageId); // representImageId를 저장 파일명으로 사용
                    fileVO.setOrignlFileNm(representImageName);
                    fileVO.setFileExtsn(getFileExtension(representImageName));
                    fileVO.setFileCn("REPRESENTATIVE"); // 대표이미지로 설정
                    
                    // 디버깅: 파일명 매핑 확인
                    System.out.println("=== 파일명 매핑 디버깅 ===");
                    System.out.println("representImageId: " + representImageId);
                    System.out.println("representImageName: " + representImageName);
                    System.out.println("streFileNm: " + fileVO.getStreFileNm());
                    System.out.println("orignlFileNm: " + fileVO.getOrignlFileNm());
                    System.out.println("업로드 디렉토리: " + getUploadDir());
                    System.out.println("=== 파일명 매핑 디버깅 끝 ===");
            
            // 파일 크기 설정 (프론트엔드에서 전달받은 크기 사용)
            if (representImageSize != null && representImageSize > 0) {
                fileVO.setFileSize(representImageSize);
                System.out.println("프론트엔드에서 전달받은 파일 크기 사용: " + representImageSize + " bytes");
            } else {
                // 실제 파일이 존재하는지 확인하고 크기 설정 (fallback)
                String fullFilePath = getUploadDir() + "/" + representImageId;
                File physicalFile = new File(fullFilePath);
                if (physicalFile.exists()) {
                    fileVO.setFileSize(physicalFile.length());
                    System.out.println("대표이미지 파일 존재 확인: " + fullFilePath + " (크기: " + physicalFile.length() + " bytes)");
                } else {
                    fileVO.setFileSize(0L);
                    System.out.println("⚠️ 대표이미지 파일이 존재하지 않음: " + fullFilePath);
                }
            }
            
            System.out.println("새 대표이미지 FileVO 생성 완료:");
            System.out.println("  - atchFileId: " + fileVO.getAtchFileId());
            System.out.println("  - fileSn: " + fileVO.getFileSn());
            System.out.println("  - streFileNm: " + fileVO.getStreFileNm());
            System.out.println("  - orignlFileNm: " + fileVO.getOrignlFileNm());
            System.out.println("  - fileCn: " + fileVO.getFileCn());
            
                                // 3. DB에 저장
            // 먼저 COMTNFILE 마스터 레코드가 존재하는지 확인
            try {
                // COMTNFILE 마스터 테이블에서 직접 확인 (selectFileList가 아닌)
                boolean masterExists = fileMapper.existsFileMaster(atchFileId);
                if (!masterExists) {
                    System.out.println("COMTNFILE 마스터 레코드가 없음, 새로 생성");
                    
                    // COMTNFILE 마스터 레코드 생성
                    FileVO masterFileVO = new FileVO();
                    masterFileVO.setAtchFileId(atchFileId);
                    int masterResult = fileMapper.insertFile(masterFileVO);
                    if (masterResult > 0) {
                        System.out.println("COMTNFILE 마스터 레코드 생성 성공");
                    } else {
                        System.out.println("COMTNFILE 마스터 레코드 생성 실패");
                        throw new RuntimeException("COMTNFILE 마스터 레코드 생성에 실패했습니다.");
                    }
                } else {
                    System.out.println("COMTNFILE 마스터 레코드 이미 존재");
                }
                
                // COMTNFILEDETAIL 상세 레코드 등록
                int detailResult = fileMapper.insertFileDetail(fileVO);
                if (detailResult > 0) {
                    System.out.println("대표이미지 DB 저장 성공");
                } else {
                    System.out.println("대표이미지 DB 저장 실패");
                    throw new RuntimeException("대표이미지 DB 저장에 실패했습니다.");
                }
            } catch (Exception e) {
                System.out.println("대표이미지 DB 저장 중 오류: " + e.getMessage());
                throw e;
            }
            
        } catch (Exception e) {
            System.out.println("processRepresentativeImage 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * 메인화면이미지 처리 메서드
     * 게시물 저장 시 메인화면이미지를 atchFileId 그룹에 추가
     */
    private void processMainImage(String atchFileId, String mainImageId, String mainImageName, Long mainImageSize) {
        System.out.println("=== processMainImage 시작 ===");
        System.out.println("atchFileId: " + atchFileId);
        System.out.println("mainImageId: " + mainImageId);
        System.out.println("mainImageName: " + mainImageName);
        System.out.println("mainImageSize: " + mainImageSize);
        
        // 파라미터 유효성 검사
        if (atchFileId == null || atchFileId.trim().isEmpty()) {
            System.out.println("❌ atchFileId가 null이거나 빈 문자열입니다.");
            throw new IllegalArgumentException("atchFileId는 필수입니다.");
        }
        if (mainImageId == null || mainImageId.trim().isEmpty()) {
            System.out.println("❌ mainImageId가 null이거나 빈 문자열입니다.");
            throw new IllegalArgumentException("mainImageId는 필수입니다.");
        }
        if (mainImageName == null || mainImageName.trim().isEmpty()) {
            System.out.println("❌ mainImageName이 null이거나 빈 문자열입니다.");
            throw new IllegalArgumentException("mainImageName은 필수입니다.");
        }
        System.out.println("✅ 파라미터 유효성 검사 통과");
        
        try {
            // 1. 기존 메인화면이미지가 있다면 삭제
            boolean hasExistingImage = fileMapper.existsImageByType(atchFileId, "MAIN_IMAGE");
            if (hasExistingImage) {
                System.out.println("기존 메인화면이미지 발견, 삭제 중...");
                FileVO existingImage = fileMapper.selectMainImage(atchFileId);
                if (existingImage != null) {
                    // 기존 물리적 파일 삭제
                    String existingFilePath = existingImage.getFileStreCours() + "/" + existingImage.getStreFileNm();
                    File existingFile = new File(existingFilePath);
                    if (existingFile.exists()) {
                        boolean deleted = existingFile.delete();
                        System.out.println("기존 파일 삭제 결과: " + deleted);
                    }
                    // DB에서 기존 메인화면이미지 삭제
                    fileMapper.deleteImageByType(atchFileId, "MAIN_IMAGE");
                    System.out.println("기존 메인화면이미지 DB 삭제 완료");
                }
            }
            
            // 2. 새 메인화면이미지 정보로 FileVO 생성
            FileVO fileVO = new FileVO();
            fileVO.setAtchFileId(atchFileId);
            
            // 기존 파일들의 최대 FILE_SN + 1을 사용하여 중복 방지
            Long nextFileSn = getNextFileSn(atchFileId);
            System.out.println("다음 사용 가능한 FILE_SN: " + nextFileSn);
            fileVO.setFileSn(nextFileSn);
            
            fileVO.setFileStreCours(getUploadDir());
            fileVO.setStreFileNm(mainImageId); // mainImageId를 저장 파일명으로 사용
            fileVO.setOrignlFileNm(mainImageName);
            fileVO.setFileExtsn(getFileExtension(mainImageName));
            fileVO.setFileCn("MAIN_IMAGE"); // 메인화면이미지로 설정
            
            // 디버깅: 파일명 매핑 확인
            System.out.println("=== 파일명 매핑 디버깅 ===");
            System.out.println("mainImageId: " + mainImageId);
            System.out.println("mainImageName: " + mainImageName);
            System.out.println("streFileNm: " + fileVO.getStreFileNm());
            System.out.println("orignlFileNm: " + fileVO.getOrignlFileNm());
            System.out.println("업로드 디렉토리: " + getUploadDir());
            System.out.println("=== 파일명 매핑 디버깅 끝 ===");
            
            // 파일 크기 설정 (프론트엔드에서 전달받은 크기 사용)
            if (mainImageSize != null && mainImageSize > 0) {
                fileVO.setFileSize(mainImageSize);
                System.out.println("프론트엔드에서 전달받은 파일 크기 사용: " + mainImageSize + " bytes");
            } else {
                // 실제 파일이 존재하는지 확인하고 크기 설정 (fallback)
                String fullFilePath = getUploadDir() + "/" + mainImageId;
                File physicalFile = new File(fullFilePath);
                if (physicalFile.exists()) {
                    fileVO.setFileSize(physicalFile.length());
                    System.out.println("메인화면이미지 파일 존재 확인: " + fullFilePath + " (크기: " + physicalFile.length() + " bytes)");
                } else {
                    fileVO.setFileSize(0L);
                    System.out.println("⚠️ 메인화면이미지 파일이 존재하지 않음: " + fullFilePath);
                }
            }
            
            System.out.println("새 메인화면이미지 FileVO 생성 완료:");
            System.out.println("  - atchFileId: " + fileVO.getAtchFileId());
            System.out.println("  - fileSn: " + fileVO.getFileSn());
            System.out.println("  - streFileNm: " + fileVO.getStreFileNm());
            System.out.println("  - orignlFileNm: " + fileVO.getOrignlFileNm());
            System.out.println("  - fileCn: " + fileVO.getFileCn());
            
            // 3. DB에 저장
            // 먼저 COMTNFILE 마스터 레코드가 존재하는지 확인
            try {
                // COMTNFILE 마스터 테이블에서 직접 확인 (selectFileList가 아닌)
                boolean masterExists = fileMapper.existsFileMaster(atchFileId);
                if (!masterExists) {
                    System.out.println("COMTNFILE 마스터 레코드가 없음, 새로 생성");
                    
                    // COMTNFILE 마스터 레코드 생성
                    FileVO masterFileVO = new FileVO();
                    masterFileVO.setAtchFileId(atchFileId);
                    int masterResult = fileMapper.insertFile(masterFileVO);
                    if (masterResult > 0) {
                        System.out.println("COMTNFILE 마스터 레코드 생성 성공");
                    } else {
                        System.out.println("COMTNFILE 마스터 레코드 생성 실패");
                        throw new RuntimeException("COMTNFILE 마스터 레코드 생성에 실패했습니다.");
                    }
                } else {
                    System.out.println("COMTNFILE 마스터 레코드 이미 존재");
                }
                
                // COMTNFILEDETAIL 상세 레코드 등록
                int detailResult = fileMapper.insertFileDetail(fileVO);
                if (detailResult > 0) {
                    System.out.println("메인화면이미지 DB 저장 성공");
                } else {
                    System.out.println("메인화면이미지 DB 저장 실패");
                    throw new RuntimeException("메인화면이미지 DB 저장에 실패했습니다.");
                }
            } catch (Exception e) {
                System.out.println("메인화면이미지 DB 저장 중 오류: " + e.getMessage());
                throw e;
            }
            
        } catch (Exception e) {
            System.out.println("processMainImage 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    /**
     * 파일명에서 확장자 추출
     */
    private String getFileExtension(String fileName) {
        if (fileName != null && fileName.contains(".")) {
            return fileName.substring(fileName.lastIndexOf(".") + 1);
        }
        return "";
    }
    
    /**
     * 다음 사용 가능한 FILE_SN 조회
     */
    private Long getNextFileSn(String atchFileId) {
        try {
            // 기존 파일들의 최대 FILE_SN 조회
            List<FileVO> existingFiles = fileMapper.selectFileList(atchFileId);
            if (existingFiles == null || existingFiles.isEmpty()) {
                System.out.println("기존 파일이 없음, FILE_SN = 1 반환");
                return 1L; // 파일이 없으면 1부터 시작
            }
            
            System.out.println("기존 파일 목록:");
            for (FileVO file : existingFiles) {
                System.out.println("  - FILE_SN: " + file.getFileSn() + ", FILE_CN: " + file.getFileCn() + ", 파일명: " + file.getOrignlFileNm());
            }
            
            // 최대 FILE_SN 찾기
            Long maxFileSn = existingFiles.stream()
                .mapToLong(FileVO::getFileSn)
                .max()
                .orElse(0L);
            
            Long nextFileSn = maxFileSn + 1;
            System.out.println("최대 FILE_SN: " + maxFileSn + ", 다음 FILE_SN: " + nextFileSn);
            
            return nextFileSn; // 최대값 + 1 반환
        } catch (Exception e) {
            System.out.println("getNextFileSn 중 오류 발생: " + e.getMessage());
            // 오류 발생 시 안전하게 1 반환
            return 1L;
        }
    }
    // ===== 파일 관리 =====
    
    @Operation(summary = "파일 업로드", description = "게시글에 첨부할 파일을 업로드합니다.")
    @PostMapping("/files")
    @ResponseBody
    public EgovResponseVO<Map<String, Object>> uploadFiles(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "usageType", defaultValue = "ATTACHMENT") String usageType) {
        if (files == null || files.length == 0) {
            return EgovResponseVO.error("업로드할 파일이 없습니다.");
        }
        
        try {
            // 업로드 디렉토리 생성
            File uploadDir = new File(getUploadDir());
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            // 새로운 atchFileId 생성
            String atchFileId = "FILE_" + System.currentTimeMillis();
            List<FileVO> uploadedFileList = new ArrayList<>();

            // COMTNFILE 마스터는 1회만 등록
            FileVO master = new FileVO();
            master.setAtchFileId(atchFileId);
            int masterInserted = fileMapper.insertFile(master);
            if (masterInserted <= 0) {
                return EgovResponseVO.error("파일 마스터 생성에 실패했습니다.");
            }
            
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                if (!file.isEmpty()) {
                    // 파일명 생성 (중복 방지)
                    String originalFileName = file.getOriginalFilename();
                    String fileExtension = "";
                    if (originalFileName != null && originalFileName.contains(".")) {
                        fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                    }
                    String storedFileName = System.currentTimeMillis() + "_" + i + fileExtension;
                    
                    // 파일 시스템에 저장
                    Path filePath = Paths.get(getUploadDir(), storedFileName);
                    Files.copy(file.getInputStream(), filePath);
                    
                    // FileVO 객체 생성 및 DB 저장
                    FileVO fileVO = new FileVO();
                    fileVO.setAtchFileId(atchFileId);
                    fileVO.setFileSn((long) (i + 1)); // 파일 순번 (1부터 시작) - Long 타입으로 변환
                    fileVO.setFileStreCours(getUploadDir());
                    fileVO.setStreFileNm(storedFileName);
                    fileVO.setOrignlFileNm(originalFileName);
                    fileVO.setFileExtsn(fileExtension.replace(".", ""));
                    // 파일 용도에 따라 FILE_CN 설정
                    switch (usageType) {
                        case "CONTENT_IMAGE":
                            fileVO.setFileCn("CONTENT_IMAGE"); // 게시물 내용 이미지
                            break;
                        case "REPRESENTATIVE":
                            fileVO.setFileCn("REPRESENTATIVE"); // 대표이미지 사전 업로드
                            break;
                        case "MAIN_IMAGE":
                            fileVO.setFileCn("MAIN_IMAGE"); // 메인화면이미지 사전 업로드
                            break;
                        case "MULTI_IMAGE":
                            fileVO.setFileCn("MULTI_IMAGE"); // 다중이미지 사전 업로드
                            break;
                        default:
                            fileVO.setFileCn("ATTACHMENT"); // 일반 첨부파일
                    }
                    fileVO.setFileSize((long) file.getSize()); // Long 타입으로 변환
                    
                    // 2. COMTNFILEDETAIL 상세 테이블에 등록 (마스터는 이미 생성됨)
                    int detailResult = fileMapper.insertFileDetail(fileVO);
                    if (detailResult > 0) {
                        uploadedFileList.add(fileVO);
                        System.out.println("파일 DB 저장 성공: " + originalFileName);
                    } else {
                        System.out.println("파일 상세 DB 저장 실패: " + originalFileName);
                    }
                }
            }
        
            Map<String, Object> result = new HashMap<>();
            result.put("atchFileId", atchFileId);
            result.put("uploadedFiles", uploadedFileList);
            result.put("uploadDir", getUploadDir());
            result.put("message", "파일 업로드 및 DB 저장 완료");
            
            System.out.println("=== 파일 업로드 완료 ===");
            System.out.println("atchFileId: " + atchFileId);
            System.out.println("업로드된 파일 수: " + uploadedFileList.size());
            System.out.println("업로드 디렉토리: " + getUploadDir());
                
            return EgovResponseVO.success(result);
        } catch (IOException e) {
            System.out.println("파일 업로드 중 IOException 발생: " + e.getMessage());
            return EgovResponseVO.error("파일 업로드 중 오류가 발생했습니다: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("파일 업로드 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("파일 업로드 중 예외가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "기존 그룹에 파일 추가", description = "기존 첨부파일 그룹에 새 파일을 추가합니다.")
    @PostMapping("/files/{atchFileId}/add")
    @ResponseBody
    public EgovResponseVO<Map<String, Object>> addFilesToExistingGroup(
            @Parameter(description = "첨부파일ID") @PathVariable String atchFileId,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "usageType", defaultValue = "ATTACHMENT") String usageType) {
        
        if (files == null || files.length == 0) {
            return EgovResponseVO.error("업로드할 파일이 없습니다.");
        }
        
        try {
            // 기존 파일 그룹의 최대 파일 순번 조회
            Long maxFileSn = fileMapper.selectNextFileSn(atchFileId);
            if (maxFileSn == null) maxFileSn = 1L;
            
            // 업로드 디렉토리 생성
            File uploadDir = new File(getUploadDir());
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }
            
            List<FileVO> uploadedFileList = new ArrayList<>();
            
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                if (!file.isEmpty()) {
                    // 파일명 생성 (중복 방지)
                    String originalFileName = file.getOriginalFilename();
                    String fileExtension = "";
                    if (originalFileName != null && originalFileName.contains(".")) {
                        fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
                    }
                    String storedFileName = System.currentTimeMillis() + "_" + i + fileExtension;
                    
                    // 파일 시스템에 저장
                    Path filePath = Paths.get(getUploadDir(), storedFileName);
                    Files.copy(file.getInputStream(), filePath);
                    
                    // FileVO 객체 생성 및 DB 저장
                    FileVO fileVO = new FileVO();
                    fileVO.setAtchFileId(atchFileId); // 기존 atchFileId 사용
                    fileVO.setFileSn(maxFileSn + i); // 기존 순번 다음부터 시작
                    fileVO.setFileStreCours(getUploadDir());
                    fileVO.setStreFileNm(storedFileName);
                    fileVO.setOrignlFileNm(originalFileName);
                    fileVO.setFileExtsn(fileExtension.replace(".", ""));
                    // 파일 용도에 따라 FILE_CN 설정 (기존 그룹에 추가되는 파일은 ATTACHMENT로 처리)
                    fileVO.setFileCn(usageType != null ? usageType : "ATTACHMENT");
                    fileVO.setFileSize((long) file.getSize()); // Long 타입으로 변환
                    
                    // DB에 파일 정보 저장 (기존 그룹이므로 COMTNFILEDETAIL만 등록)
                    // 기존 그룹에 파일 추가 시에는 COMTNFILE 마스터는 이미 존재하므로 COMTNFILEDETAIL만 등록
                    int detailResult = fileMapper.insertFileDetail(fileVO);
                    if (detailResult > 0) {
                        uploadedFileList.add(fileVO);
                        System.out.println("기존 그룹에 파일 추가 성공: " + originalFileName);
            } else {
                        System.out.println("기존 그룹에 파일 상세 DB 저장 실패: " + originalFileName);
                    }
                }
            }
            
            Map<String, Object> result = new HashMap<>();
            result.put("atchFileId", atchFileId); // 기존 atchFileId 반환
            result.put("uploadedFiles", uploadedFileList);
            result.put("uploadDir", getUploadDir());
            result.put("message", "기존 그룹에 파일 추가 완료");
            
            System.out.println("=== 기존 그룹에 파일 추가 완료 ===");
            System.out.println("atchFileId: " + atchFileId);
            System.out.println("추가된 파일 수: " + uploadedFileList.size());
            System.out.println("업로드 디렉토리: " + getUploadDir());
            
            return EgovResponseVO.success(result);
        } catch (IOException e) {
            System.out.println("파일 추가 중 IOException 발생: " + e.getMessage());
            return EgovResponseVO.error("파일 추가 중 오류가 발생했습니다: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("파일 추가 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("파일 추가 중 예외가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "파일 목록 조회", description = "첨부파일 ID로 파일 목록을 조회합니다.")
    @GetMapping("/files/{atchFileId}")
    @ResponseBody
    public EgovResponseVO<List<FileVO>> getFileList(
            @Parameter(description = "첨부파일ID") @PathVariable String atchFileId) {
        
        try {
            System.out.println("=== 파일 목록 조회 요청 ===");
            System.out.println("원본 atchFileId: " + atchFileId);
            
            // atchFileId에서 공백 제거
            String cleanAtchFileId = atchFileId.trim();
            System.out.println("정리된 atchFileId: " + cleanAtchFileId);
            
            List<FileVO> fileList = fileMapper.selectFileList(cleanAtchFileId);
            System.out.println("조회된 파일 수: " + (fileList != null ? fileList.size() : 0));
            
            return EgovResponseVO.success(fileList);
        } catch (Exception e) {
            System.out.println("파일 목록 조회 중 오류: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("파일 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "이미지 조회", description = "첨부파일 ID와 파일순번으로 이미지를 조회합니다.")
    @GetMapping("/images/{atchFileId}/{fileSn}")
    public ResponseEntity<Resource> getImage(
            @Parameter(description = "첨부파일ID") @PathVariable String atchFileId,
            @Parameter(description = "파일순번") @PathVariable Long fileSn) {
        
        try {
            System.out.println("=== 이미지 조회 요청 ===");
            System.out.println("원본 atchFileId: " + atchFileId);
            System.out.println("fileSn: " + fileSn);
            
            // atchFileId에서 공백 제거
            String cleanAtchFileId = atchFileId.trim();
            System.out.println("정리된 atchFileId: " + cleanAtchFileId);
            
            // 1. 파일 정보 조회
            List<FileVO> fileList = fileMapper.selectFileList(cleanAtchFileId);
            FileVO targetFile = null;
            
            for (FileVO file : fileList) {
                if (file.getFileSn().equals(fileSn)) {
                    targetFile = file;
                    break;
                }
            }
            
            if (targetFile == null) {
                System.out.println("파일을 찾을 수 없음: atchFileId=" + atchFileId + ", fileSn=" + fileSn);
                return ResponseEntity.notFound().build();
            }
            
            // 2. 실제 파일 경로 생성 (이중 슬래시 방지)
            String filePath = targetFile.getFileStreCours();
            if (!filePath.endsWith("/")) {
                filePath += "/";
            }
            filePath += targetFile.getStreFileNm();
            File file = new File(filePath);
            
            System.out.println("파일 경로: " + filePath);
            System.out.println("파일 존재 여부: " + file.exists());
            
            if (!file.exists()) {
                System.out.println("물리적 파일이 존재하지 않음: " + filePath);
                return ResponseEntity.notFound().build();
            }
            
            // 3. 파일 확장자에 따른 Content-Type 설정
            String contentType = getContentType(targetFile.getFileExtsn());
            
            // 4. 파일 리소스 반환
            Resource resource = new FileSystemResource(file);
            
            System.out.println("이미지 조회 성공: " + targetFile.getOrignlFileNm());
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
                    
        } catch (Exception e) {
            System.out.println("이미지 조회 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Operation(summary = "대표이미지 삭제", description = "특정 게시물의 대표이미지를 삭제합니다.")
    @DeleteMapping("/representative-image/{atchFileId}")
    @ResponseBody
    public EgovResponseVO<String> deleteRepresentativeImage(
            @Parameter(description = "첨부파일ID") @PathVariable String atchFileId) {
        
        try {
            System.out.println("=== 대표이미지 삭제 요청 ===");
            System.out.println("원본 atchFileId: " + atchFileId);
            
            // atchFileId에서 공백 제거
            String cleanAtchFileId = atchFileId.trim();
            System.out.println("정리된 atchFileId: " + cleanAtchFileId);
            
            // 1. 대표이미지 정보 조회
            FileVO representativeImage = fileMapper.selectRepresentativeImage(cleanAtchFileId);
            if (representativeImage == null) {
                System.out.println("삭제할 대표이미지가 없음");
                return EgovResponseVO.success("삭제할 대표이미지가 없습니다.");
            }
            
            System.out.println("삭제할 대표이미지: " + representativeImage.getOrignlFileNm());
            
            // 2. 물리적 파일 삭제
            String filePath = representativeImage.getFileStreCours();
            if (!filePath.endsWith("/")) {
                filePath += "/";
            }
            filePath += representativeImage.getStreFileNm();
            
            File file = new File(filePath);
            if (file.exists()) {
                boolean deleted = file.delete();
                System.out.println("물리적 파일 삭제 결과: " + deleted + " (경로: " + filePath + ")");
            } else {
                System.out.println("물리적 파일이 존재하지 않음: " + filePath);
            }
            
            // 3. DB에서 대표이미지 삭제
            int deleteResult = fileMapper.deleteImageByType(cleanAtchFileId, "REPRESENTATIVE");
            System.out.println("DB 삭제 결과: " + deleteResult);
            
            // 4. 게시물의 atchFileId를 null로 업데이트 (대표이미지만 있는 경우)
            // TODO: 게시물 ID도 필요하므로 이 부분은 별도 API로 처리하거나 수정 필요
            
            System.out.println("=== 대표이미지 삭제 완료 ===");
            return EgovResponseVO.success("대표이미지가 삭제되었습니다.");
            
        } catch (Exception e) {
            System.out.println("대표이미지 삭제 중 오류: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("대표이미지 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "메인화면이미지 삭제", description = "특정 게시물의 메인화면이미지를 삭제합니다.")
    @DeleteMapping("/main-image/{atchFileId}")
    @ResponseBody
    public EgovResponseVO<String> deleteMainImage(
            @Parameter(description = "첨부파일ID") @PathVariable String atchFileId) {
        
        try {
            System.out.println("=== 메인화면이미지 삭제 요청 ===");
            System.out.println("원본 atchFileId: " + atchFileId);
            
            // atchFileId에서 공백 제거
            String cleanAtchFileId = atchFileId.trim();
            System.out.println("정리된 atchFileId: " + cleanAtchFileId);
            
            // 1. 메인화면이미지 정보 조회
            FileVO mainImage = fileMapper.selectMainImage(cleanAtchFileId);
            if (mainImage == null) {
                System.out.println("삭제할 메인화면이미지가 없음");
                return EgovResponseVO.success("삭제할 메인화면이미지가 없습니다.");
            }
            
            System.out.println("삭제할 메인화면이미지: " + mainImage.getOrignlFileNm());
            
            // 2. 물리적 파일 삭제
            String filePath = mainImage.getFileStreCours();
            if (!filePath.endsWith("/")) {
                filePath += "/";
            }
            filePath += mainImage.getStreFileNm();
            
            File file = new File(filePath);
            if (file.exists()) {
                boolean deleted = file.delete();
                System.out.println("물리적 파일 삭제 결과: " + deleted + " (경로: " + filePath + ")");
            } else {
                System.out.println("물리적 파일이 존재하지 않음: " + filePath);
            }
            
            // 3. DB에서 메인화면이미지 삭제
            int deleteResult = fileMapper.deleteImageByType(cleanAtchFileId, "MAIN_IMAGE");
            System.out.println("DB 삭제 결과: " + deleteResult);
            
            System.out.println("=== 메인화면이미지 삭제 완료 ===");
            return EgovResponseVO.success("메인화면이미지가 삭제되었습니다.");
            
        } catch (Exception e) {
            System.out.println("메인화면이미지 삭제 중 오류: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("메인화면이미지 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 파일 확장자에 따른 Content-Type 반환
     */
    private String getContentType(String fileExtension) {
        if (fileExtension == null) {
            return "application/octet-stream";
        }
        
        String ext = fileExtension.toLowerCase();
        switch (ext) {
            case "jpg":
            case "jpeg":
                return "image/jpeg";
            case "png":
                return "image/png";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "webp":
                return "image/webp";
            default:
                return "application/octet-stream";
        }
    }
    
    @Operation(summary = "파일 다운로드", description = "특정 파일을 다운로드합니다.")
    @GetMapping("/files/{atchFileId}/{fileSn}/download")
    public ResponseEntity<Resource> downloadFile(
            @Parameter(description = "첨부파일ID") @PathVariable String atchFileId,
            @Parameter(description = "파일순번") @PathVariable Long fileSn) {
        
        try {
            System.out.println("=== 파일 다운로드 요청 ===");
            System.out.println("atchFileId: " + atchFileId);
            System.out.println("fileSn: " + fileSn);
            
            // atchFileId에서 공백 제거
            String cleanAtchFileId = atchFileId.trim();
            System.out.println("정리된 atchFileId: " + cleanAtchFileId);
            
            // 1. 파일 정보 조회
            FileVO fileInfo = fileMapper.selectFileDetail(cleanAtchFileId, fileSn);
            if (fileInfo == null) {
                System.out.println("파일을 찾을 수 없음");
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("다운로드할 파일 정보:");
            System.out.println("  - 원본 파일명: " + fileInfo.getOrignlFileNm());
            System.out.println("  - 저장 파일명: " + fileInfo.getStreFileNm());
            System.out.println("  - 저장 경로: " + fileInfo.getFileStreCours());
            
            // 2. 물리적 파일 경로 생성
            String filePath = fileInfo.getFileStreCours();
            if (!filePath.endsWith("/")) {
                filePath += "/";
            }
            filePath += fileInfo.getStreFileNm();
            
            System.out.println("전체 파일 경로: " + filePath);
            
            // 3. 파일 존재 확인
            File file = new File(filePath);
            if (!file.exists()) {
                System.out.println("물리적 파일이 존재하지 않음: " + filePath);
                return ResponseEntity.notFound().build();
            }
            
            // 4. 파일 리소스 생성
            Path path = file.toPath();
            Resource resource = new FileSystemResource(path);
            
            // 5. Content-Type 결정
            String contentType = getContentType(fileInfo.getFileExtsn());
            
            // 6. 다운로드 응답 생성
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + 
                    new String(fileInfo.getOrignlFileNm().getBytes("UTF-8"), "ISO-8859-1") + "\"")
                .body(resource);
                
        } catch (Exception e) {
            System.out.println("파일 다운로드 중 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @Operation(summary = "개별 파일 삭제", description = "특정 파일을 삭제합니다.")
    @DeleteMapping("/files/{atchFileId}/{fileSn}")
    @ResponseBody
    public EgovResponseVO<String> deleteFile(
            @Parameter(description = "첨부파일ID") @PathVariable String atchFileId,
            @Parameter(description = "파일순번") @PathVariable Long fileSn) {
        
        try {
            System.out.println("=== 파일 삭제 요청 ===");
            System.out.println("원본 atchFileId: " + atchFileId);
            System.out.println("fileSn: " + fileSn);
            
            // atchFileId에서 공백 제거
            String cleanAtchFileId = atchFileId.trim();
            System.out.println("정리된 atchFileId: " + cleanAtchFileId);
            
            // 1. 파일 정보 조회
            FileVO fileInfo = fileMapper.selectFileDetail(cleanAtchFileId, fileSn);
            if (fileInfo == null) {
                System.out.println("파일을 찾을 수 없음");
                return EgovResponseVO.error("파일을 찾을 수 없습니다.");
            }
            
            System.out.println("삭제할 파일 정보:");
            System.out.println("  - 원본 파일명: " + fileInfo.getOrignlFileNm());
            System.out.println("  - 저장 파일명: " + fileInfo.getStreFileNm());
            System.out.println("  - 저장 경로: " + fileInfo.getFileStreCours());
            
            // 2. DB에서 파일 정보 삭제
            int deleteResult = fileMapper.deleteFile(cleanAtchFileId, fileSn);
            if (deleteResult > 0) {
                System.out.println("DB에서 파일 정보 삭제 성공");
                
                // 3. 파일 시스템에서 물리적 파일 삭제
                String filePath = fileInfo.getFileStreCours() + "/" + fileInfo.getStreFileNm();
                File physicalFile = new File(filePath);
                if (physicalFile.exists()) {
                    if (physicalFile.delete()) {
                        System.out.println("물리적 파일 삭제 성공: " + filePath);
                    } else {
                        System.out.println("물리적 파일 삭제 실패: " + filePath);
                    }
                } else {
                    System.out.println("물리적 파일이 존재하지 않음: " + filePath);
                }
                
                System.out.println("=== 파일 삭제 완료 ===");
                return EgovResponseVO.success("파일이 성공적으로 삭제되었습니다.");
            } else {
                System.out.println("DB에서 파일 정보 삭제 실패");
                return EgovResponseVO.error("파일 삭제에 실패했습니다.");
            }
        } catch (Exception e) {
            System.out.println("파일 삭제 중 예외 발생: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("파일 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    // 대표이미지 업로드 API 제거됨 - 게시물 저장 시 함께 처리
    
    // 대표이미지 조회 API 제거됨 - 게시물 저장 시 함께 처리
    

    
    // ===== 댓글 관리 =====
    
    @Operation(summary = "댓글 목록 조회", description = "특정 게시글의 댓글 목록을 조회합니다.")
    @GetMapping("/{bbsId}/boards/{nttId}/comments")
    @ResponseBody
    public EgovResponseVO<List<CommentVO>> getCommentList(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @Parameter(description = "게시글번호") @PathVariable int nttId) {
        
        try {
            List<CommentVO> commentList = bbsService.selectCommentList(bbsId, nttId);
            return EgovResponseVO.success(commentList);
        } catch (Exception e) {
            return EgovResponseVO.error("댓글 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "댓글 등록", description = "새로운 댓글을 등록합니다.")
    @PostMapping("/{bbsId}/boards/{nttId}/comments")
    @ResponseBody
    public EgovResponseVO<String> createComment(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @Parameter(description = "게시글번호") @PathVariable int nttId,
            @RequestBody CommentVO commentVO) {
        
        try {
        commentVO.setNttId(nttId);
            int result = bbsService.insertComment(commentVO);
            if (result > 0) {
                return EgovResponseVO.success("댓글이 성공적으로 등록되었습니다.");
            } else {
                return EgovResponseVO.error("댓글 등록에 실패했습니다.");
            }
        } catch (Exception e) {
            return EgovResponseVO.error("댓글 등록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "댓글 수정", description = "기존 댓글을 수정합니다.")
    @PutMapping("/{bbsId}/boards/{nttId}/comments/{commentNo}")
    @ResponseBody
    public EgovResponseVO<String> updateComment(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @Parameter(description = "게시글번호") @PathVariable int nttId,
            @Parameter(description = "댓글번호") @PathVariable int commentNo,
            @RequestBody CommentVO commentVO) {
        
        try {
            commentVO.setCommentNo(commentNo);
            commentVO.setNttId(nttId);
            int result = bbsService.updateComment(commentVO);
            if (result > 0) {
                return EgovResponseVO.success("댓글이 성공적으로 수정되었습니다.");
            } else {
                return EgovResponseVO.error("댓글 수정에 실패했습니다.");
            }
        } catch (Exception e) {
            return EgovResponseVO.error("댓글 수정 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "댓글 삭제", description = "댓글을 삭제합니다.")
    @DeleteMapping("/{bbsId}/boards/{nttId}/comments/{commentNo}")
    @ResponseBody
    public EgovResponseVO<String> deleteComment(
            @Parameter(description = "게시판ID") @PathVariable String bbsId,
            @Parameter(description = "게시글번호") @PathVariable int nttId,
            @Parameter(description = "댓글번호") @PathVariable int commentNo) {
        
        try {
            int result = bbsService.deleteComment(commentNo);
            if (result > 0) {
                return EgovResponseVO.success("댓글이 성공적으로 삭제되었습니다.");
            } else {
                return EgovResponseVO.error("댓글 삭제에 실패했습니다.");
            }
        } catch (Exception e) {
            return EgovResponseVO.error("댓글 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    // ===== 구분 코드 관리 =====
    
    @Operation(summary = "게시판 구분 코드 목록 조회", description = "게시판에서 사용할 수 있는 구분 코드 목록을 조회합니다.")
    @GetMapping("/category-codes")
    @ResponseBody
    public EgovResponseVO<List<Map<String, Object>>> getCategoryCodes() {
        try {
            System.out.println("=== 게시판 구분 코드 목록 조회 요청 ===");
            
            // 구분 코드 목록 조회 (공통코드에서 CATEGORY로 끝나는 것들)
            List<Map<String, Object>> categoryCodes = new ArrayList<>();
            
            // 1. "구분 사용 안함" 옵션 추가
            Map<String, Object> noCategory = new HashMap<>();
            noCategory.put("value", null);
            noCategory.put("label", "구분 사용 안함");
            categoryCodes.add(noCategory);
            
            // 2. 실제 구분 코드들 추가 (하드코딩으로 우선 구현)
            String[][] codes = {
                {"BBCAT", "일반 게시판 구분"},
                {"FAQCAT", "FAQ 구분"},
                {"NOTCAT", "공지사항 구분"},
                {"DATCAT", "자료실 구분"},
                {"GALCAT", "갤러리 구분"}
            };
            
            for (String[] code : codes) {
                Map<String, Object> categoryCode = new HashMap<>();
                categoryCode.put("value", code[0]);
                categoryCode.put("label", code[1]);
                categoryCodes.add(categoryCode);
            }
            
            System.out.println("생성된 구분 코드 수: " + categoryCodes.size());
            return EgovResponseVO.success(categoryCodes);
            
        } catch (Exception e) {
            System.out.println("구분 코드 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("구분 코드 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    @Operation(summary = "구분 코드 상세 목록 조회", description = "특정 구분 코드의 하위 코드 목록을 조회합니다.")
    @GetMapping("/category-codes/{categoryCodeId}/details")
    @ResponseBody
    public EgovResponseVO<List<Map<String, Object>>> getCategoryCodeDetails(
            @Parameter(description = "구분코드ID") @PathVariable String categoryCodeId) {
        try {
            System.out.println("=== 구분 코드 상세 목록 조회 요청 ===");
            System.out.println("categoryCodeId: " + categoryCodeId);
            
            // 구분 코드별 하위 코드 목록 (하드코딩으로 우선 구현)
            List<Map<String, Object>> detailCodes = new ArrayList<>();
            
            switch (categoryCodeId) {
                case "BBCAT":
                    // 일반 게시판 구분
                    detailCodes.add(createDetailCode("CAT001", "시정소식"));
                    detailCodes.add(createDetailCode("CAT002", "보도자료"));
                    detailCodes.add(createDetailCode("CAT003", "채용정보"));
                    detailCodes.add(createDetailCode("CAT004", "민원신청"));
                    detailCodes.add(createDetailCode("CAT005", "정보공개"));
                    detailCodes.add(createDetailCode("CAT006", "참여"));
                    detailCodes.add(createDetailCode("CAT007", "행사"));
                    detailCodes.add(createDetailCode("CAT008", "기타"));
                    break;
                    
                case "FAQCAT":
                    // FAQ 구분
                    detailCodes.add(createDetailCode("FAQ001", "일반"));
                    detailCodes.add(createDetailCode("FAQ002", "기술"));
                    detailCodes.add(createDetailCode("FAQ003", "업무"));
                    detailCodes.add(createDetailCode("FAQ004", "민원"));
                    detailCodes.add(createDetailCode("FAQ005", "행정"));
                    detailCodes.add(createDetailCode("FAQ006", "기타"));
                    break;
                    
                case "NOTCAT":
                    // 공지사항 구분
                    detailCodes.add(createDetailCode("NOT001", "중요공지"));
                    detailCodes.add(createDetailCode("NOT002", "일반공지"));
                    detailCodes.add(createDetailCode("NOT003", "행사공지"));
                    detailCodes.add(createDetailCode("NOT004", "채용공지"));
                    detailCodes.add(createDetailCode("NOT005", "시정공지"));
                    detailCodes.add(createDetailCode("NOT006", "긴급공지"));
                    break;
                    
                case "DATCAT":
                    // 자료실 구분
                    detailCodes.add(createDetailCode("DAT001", "매뉴얼"));
                    detailCodes.add(createDetailCode("DAT002", "양식"));
                    detailCodes.add(createDetailCode("DAT003", "법규"));
                    detailCodes.add(createDetailCode("DAT004", "정책"));
                    detailCodes.add(createDetailCode("DAT005", "보고서"));
                    detailCodes.add(createDetailCode("DAT006", "기타자료"));
                    break;
                    
                case "GALCAT":
                    // 갤러리 구분
                    detailCodes.add(createDetailCode("GAL001", "행사사진"));
                    detailCodes.add(createDetailCode("GAL002", "시설사진"));
                    detailCodes.add(createDetailCode("GAL003", "작품사진"));
                    detailCodes.add(createDetailCode("GAL004", "풍경사진"));
                    detailCodes.add(createDetailCode("GAL005", "기념사진"));
                    detailCodes.add(createDetailCode("GAL006", "기타사진"));
                    break;
                    
                default:
                    System.out.println("알 수 없는 구분 코드: " + categoryCodeId);
                    return EgovResponseVO.error("알 수 없는 구분 코드입니다: " + categoryCodeId);
        }
            
            System.out.println("생성된 상세 코드 수: " + detailCodes.size());
            return EgovResponseVO.success(detailCodes);
            
        } catch (Exception e) {
            System.out.println("구분 코드 상세 목록 조회 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return EgovResponseVO.error("구분 코드 상세 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    /**
     * 상세 코드 생성 헬퍼 메서드
     */
    private Map<String, Object> createDetailCode(String code, String codeNm) {
        Map<String, Object> detailCode = new HashMap<>();
        detailCode.put("value", code);
        detailCode.put("label", codeNm);
        return detailCode;
    }

    /**
     * 다중이미지 처리 메서드
     * 목록을 받아 atchFileId 그룹에 순차 저장 (FILE_CN=MULTI_IMAGE)
     */
    /**
     * 게시물 작성 시 다중이미지 처리 메서드
     * 업로드된 다중이미지를 게시물의 atchFileId 그룹으로 이동
     */
    private void processMultiImagesForCreate(String targetAtchFileId, List<String> imageIds, List<String> imageNames, List<Integer> imageOrder) {
        System.out.println("=== processMultiImagesForCreate 시작 ===");
        System.out.println("targetAtchFileId: " + targetAtchFileId);
        System.out.println("imageIds: " + imageIds);
        System.out.println("imageNames: " + imageNames);
        System.out.println("imageOrder: " + imageOrder);
        
        if (imageIds == null || imageIds.isEmpty()) {
            System.out.println("이미지가 없음 - 처리 완료");
            return;
        }
        
        if (imageNames == null) imageNames = new ArrayList<>();
        if (imageOrder == null) imageOrder = new ArrayList<>();
        
        for (int i = 0; i < imageIds.size(); i++) {
            String imageId = imageIds.get(i);
            String imageName = (i < imageNames.size()) ? imageNames.get(i) : imageId;
            Integer order = (i < imageOrder.size()) ? imageOrder.get(i) : (i + 1);
            
            if (imageId == null || imageId.trim().isEmpty()) continue;
            
            System.out.println("다중이미지 처리: " + imageName + " (순서: " + order + ")");
            
            try {
                // 1. 기존 다중이미지 파일 정보 조회 (파일명으로 찾기)
                List<FileVO> allFiles = fileMapper.selectAllFiles(); // 모든 파일 조회
                FileVO sourceFile = null;
                
                for (FileVO file : allFiles) {
                    if (file.getOrignlFileNm() != null && file.getOrignlFileNm().equals(imageName)) {
                        sourceFile = file;
                        break;
                    }
                }
                
                if (sourceFile == null) {
                    System.out.println("다중이미지 파일을 찾을 수 없음: " + imageName);
                    continue;
                }
                
                System.out.println("다중이미지 파일 발견: " + sourceFile.getAtchFileId() + "/" + sourceFile.getFileSn());
                
                // 2. 새로운 atchFileId 그룹에 복사
                FileVO newFileVO = new FileVO();
                newFileVO.setAtchFileId(targetAtchFileId);
                
                // 기존 파일들의 최대 FILE_SN + 1을 사용
                Long nextFileSn = getNextFileSn(targetAtchFileId);
                newFileVO.setFileSn(nextFileSn);
                
                newFileVO.setFileStreCours(sourceFile.getFileStreCours());
                newFileVO.setStreFileNm(sourceFile.getStreFileNm());
                newFileVO.setOrignlFileNm(sourceFile.getOrignlFileNm());
                newFileVO.setFileExtsn(sourceFile.getFileExtsn());
                newFileVO.setFileCn("MULTI_IMAGE");
                newFileVO.setFileSize(sourceFile.getFileSize());
                newFileVO.setFileOrder(order != null ? order.longValue() : (long)(i + 1));
                
                // 3. COMTNFILE 마스터 레코드 확인 및 생성
                boolean masterExists = fileMapper.existsFileMaster(targetAtchFileId);
                if (!masterExists) {
                    FileVO masterFileVO = new FileVO();
                    masterFileVO.setAtchFileId(targetAtchFileId);
                    fileMapper.insertFile(masterFileVO);
                    System.out.println("COMTNFILE 마스터 레코드 생성: " + targetAtchFileId);
                }
                
                // 4. COMTNFILEDETAIL 상세 레코드 등록
                int detailResult = fileMapper.insertFileDetail(newFileVO);
                if (detailResult > 0) {
                    System.out.println("다중이미지 DB 저장 성공: " + imageName + " (FILE_SN: " + nextFileSn + ")");
                } else {
                    System.out.println("다중이미지 DB 저장 실패: " + imageName);
                }
                
            } catch (Exception e) {
                System.out.println("다중이미지 처리 중 오류: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        System.out.println("=== processMultiImagesForCreate 끝 ===");
    }

    /**
     * 다중이미지 처리 메서드 (기존 이미지 유지하면서 순서 변경)
     * 목록을 받아 atchFileId 그룹에 순차 저장 (FILE_CN=MULTI_IMAGE)
     */
    private void processMultiImages(String atchFileId, List<String> imageIds, List<String> imageNames, List<Integer> imageOrder) {
        System.out.println("=== processMultiImages 시작 (기존 이미지 유지) ===");
        System.out.println("atchFileId: " + atchFileId);
        System.out.println("imageIds: " + imageIds);
        System.out.println("imageNames: " + imageNames);
        System.out.println("imageOrder: " + imageOrder);
        
        if (imageIds == null || imageIds.isEmpty()) {
            System.out.println("이미지가 없음 - 처리 완료");
            return;
        }
        
        if (imageNames == null) imageNames = new ArrayList<>();
        if (imageOrder == null) imageOrder = new ArrayList<>();
        
        System.out.println("다중이미지 처리 시작");
        
        for (int i = 0; i < imageIds.size(); i++) {
            String imageId = imageIds.get(i);
            String imageName = (i < imageNames.size()) ? imageNames.get(i) : imageId;
            Integer order = (i < imageOrder.size()) ? imageOrder.get(i) : (i + 1);
            
            if (imageId == null || imageId.trim().isEmpty()) continue;
            
            // 기존 이미지인지 신규 이미지인지 구분
            if (imageId.contains("_") && imageId.startsWith("FILE_")) {
                // 기존 이미지: atchFileId_fileSn 형태
                System.out.println("기존 이미지 순서 업데이트: " + imageId + " -> 순서: " + order);
                
                String[] parts = imageId.split("_");
                if (parts.length >= 2) {
                    String existingAtchFileId = parts[0] + "_" + parts[1];
                    Long fileSn = Long.parseLong(parts[2]);
                    
                    // 기존 이미지의 순서만 업데이트
                    FileVO updateVO = new FileVO();
                    updateVO.setAtchFileId(existingAtchFileId);
                    updateVO.setFileSn(fileSn);
                    updateVO.setFileOrder(order.longValue());
                    
                    // FILE_ORDER 컬럼 업데이트 (새로운 메서드 필요
                    fileMapper.updateFileOrder(updateVO);
                }
            } else {
                // 신규 이미지: 이미 addFilesToExistingGroup에서 저장됨, 순서만 업데이트
                System.out.println("신규 이미지 순서 업데이트: " + imageName + " -> 순서: " + order);
                
                // 기존 파일 정보 조회 (파일명으로 찾기)
                List<FileVO> existingFiles = fileMapper.selectFileList(atchFileId);
                FileVO existingFile = null;
                
                for (FileVO file : existingFiles) {
                   if (file.getOrignlFileNm() != null && file.getOrignlFileNm().equals(imageName)) {
                        existingFile = file;
                        break;
                    }
                }
                
                if (existingFile != null) {
                    // FILE_ORDER만 업데이트
                    FileVO updateVO = new FileVO();
                    updateVO.setAtchFileId(atchFileId);
                    updateVO.setFileSn(existingFile.getFileSn());
                    updateVO.setFileOrder(order != null ? order.longValue() : (long)(i + 1));
                    fileMapper.updateFileOrder(updateVO);
                    System.out.println("신규 이미지 순서 업데이트 완료: " + imageName);
                } else {
                    System.out.println("신규 이미지를 찾을 수 없음: " + imageName);
                }
            }
        }
        System.out.println("=== processMultiImages 끝 ===");
    }} 