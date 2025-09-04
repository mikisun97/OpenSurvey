package egovframework.survey.service.impl;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import egovframework.survey.mapper.BbsMapper;
import egovframework.survey.mapper.FileMapper;
import egovframework.survey.service.BbsService;
import egovframework.survey.vo.BbsMstVO;
import egovframework.survey.vo.BbsVO;
import egovframework.survey.vo.BbsMstSearchVO;
import egovframework.survey.vo.BbsSearchVO;
import egovframework.survey.vo.CommentVO;
import egovframework.survey.vo.FileVO;
import egovframework.survey.vo.PaginationInfo;

@Service
public class BbsServiceImpl implements BbsService {

    @Autowired
    private BbsMapper bbsMapper;
    
    @Autowired
    private FileMapper fileMapper;

    // 게시판 마스터 관련
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> selectBbsMstList(BbsMstSearchVO searchVO) {
        try {
            // 페이징 정보 설정 (전자정부 프레임워크 표준)
            PaginationInfo paginationInfo = new PaginationInfo();
            paginationInfo.setCurrentPageNo(searchVO.getPageIndex() + 1); // 0부터 시작하므로 +1
            paginationInfo.setRecordCountPerPage(searchVO.getPageSize());
            paginationInfo.setPageSize(searchVO.getPageSize());

            // 실제 DB에서 데이터 조회
            List<BbsMstVO> list = bbsMapper.selectBbsMstList(searchVO);

            // 총 개수 조회
            int totalCount = bbsMapper.selectBbsMstListTotCnt(searchVO);
            paginationInfo.setTotalRecordCount(totalCount);

            Map<String, Object> result = new HashMap<>();
            result.put("resultList", list);
            result.put("paginationInfo", paginationInfo);

            return result;
        } catch (Exception e) {
            throw new RuntimeException("게시판 마스터 목록 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BbsMstVO selectBbsMst(String bbsId) {
        return bbsMapper.selectBbsMst(bbsId);
    }

    @Override
    @Transactional
    public int insertBbsMst(BbsMstVO bbsMstVO) {
        return bbsMapper.insertBbsMst(bbsMstVO);
    }

    @Override
    @Transactional
    public int updateBbsMst(BbsMstVO bbsMstVO) {
        return bbsMapper.updateBbsMst(bbsMstVO);
    }

    @Override
    @Transactional
    public int deleteBbsMst(String bbsId) {
        return bbsMapper.deleteBbsMst(bbsId);
    }

    // 게시글 관련
    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> selectBbsList(BbsSearchVO searchVO) {
        try {
            // 페이징 정보 설정 (전자정부 프레임워크 표준)
            PaginationInfo paginationInfo = new PaginationInfo();
            paginationInfo.setCurrentPageNo(searchVO.getPageIndex() + 1); // 0부터 시작하므로 +1
            paginationInfo.setRecordCountPerPage(searchVO.getPageSize());
            paginationInfo.setPageSize(searchVO.getPageSize());

            // 실제 DB에서 데이터 조회
            List<BbsVO> list = bbsMapper.selectBbsList(searchVO);

            // 각 게시글에 첨부파일 정보 설정
            for (BbsVO bbs : list) {
                if (bbs.getAtchFileId() != null && !bbs.getAtchFileId().isEmpty()) {
                    List<FileVO> fileList = fileMapper.selectFileList(bbs.getAtchFileId());
                    bbs.setFileList(fileList);
                }
            }

            // 총 개수 조회
            int totalCount = bbsMapper.selectBbsListTotCnt(searchVO);
            paginationInfo.setTotalRecordCount(totalCount);

            Map<String, Object> result = new HashMap<>();
            result.put("resultList", list);
            result.put("paginationInfo", paginationInfo);

            return result;
        } catch (Exception e) {
            throw new RuntimeException("게시글 목록 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BbsVO selectBbs(String bbsId, int nttId) {
        // 게시물 조회
        
        BbsVO bbs = bbsMapper.selectBbs(bbsId, nttId);
        
        if (bbs != null) {
            
            // 첨부파일 정보 설정
            if (bbs.getAtchFileId() != null && !bbs.getAtchFileId().isEmpty()) {
                
                // 1. 대표이미지 별도 조회
                FileVO representativeImage = fileMapper.selectRepresentativeImage(bbs.getAtchFileId());
                if (representativeImage != null) {
                    bbs.setRepresentImageId(representativeImage.getStreFileNm());
                    bbs.setRepresentImageName(representativeImage.getOrignlFileNm());
                    if (bbs.getAtchFileId() != null && !bbs.getAtchFileId().trim().isEmpty()) {
                        bbs.setRepresentImageUrl("/api/sym/bbs/images/" + bbs.getAtchFileId().trim() + "/" + representativeImage.getFileSn());
                    } else {
                        bbs.setRepresentImageUrl(null);
                    }
                    bbs.setRepresentImageSize(representativeImage.getFileSize());
                }
                
                // 2. 메인화면이미지 별도 조회
                FileVO mainImage = fileMapper.selectMainImage(bbs.getAtchFileId());
                if (mainImage != null) {
                    bbs.setMainImageId(mainImage.getStreFileNm());
                    bbs.setMainImageName(mainImage.getOrignlFileNm());
                    if (bbs.getAtchFileId() != null && !bbs.getAtchFileId().trim().isEmpty()) {
                        bbs.setMainImageUrl("/api/sym/bbs/images/" + bbs.getAtchFileId().trim() + "/" + mainImage.getFileSn());
                    } else {
                        bbs.setMainImageUrl(null);
                    }
                    bbs.setMainImageSize(mainImage.getFileSize());
                }

                // 3. 다중이미지 목록 조회
                List<FileVO> multiImages = fileMapper.selectMultiImages(bbs.getAtchFileId());
                if (multiImages != null) {
                    for (FileVO img : multiImages) {
                        if (bbs.getAtchFileId() != null && !bbs.getAtchFileId().trim().isEmpty()) {
                            img.setFileUrl("/api/sym/bbs/images/" + bbs.getAtchFileId().trim() + "/" + img.getFileSn());
                        }
                    }
                }
                bbs.setMultiImageList(multiImages);

                // 4. 첨부파일만 조회 (대표/메인/다중이미지 제외 필터는 SQL에서 처리)
                List<FileVO> fileList = fileMapper.selectAttachmentFiles(bbs.getAtchFileId());
                bbs.setFileList(fileList);
            }
        }
        return bbs;
    }

    @Override
    @Transactional
    public int insertBbs(BbsVO bbsVO) {
        // 게시판별 특화 처리 로직 실행
        processBoardTypeSpecificLogic(bbsVO, bbsVO.getBbsId());
        
        // 기본값 설정
        if (bbsVO.getNttStatusCode() == null) {
            bbsVO.setNttStatusCode("NTTSTATUS01"); // 정상 상태
        }
        if (bbsVO.getNttViewCount() == null) {
            bbsVO.setNttViewCount(0); // 조회수 초기화
        }
        if (bbsVO.getNttLikeCount() == null) {
            bbsVO.setNttLikeCount(0); // 좋아요수 초기화
        }
        
        return bbsMapper.insertBbs(bbsVO);
    }

    @Override
    @Transactional
    public int updateBbs(BbsVO bbsVO) {
        // 게시판별 특화 처리 로직 실행
        processBoardTypeSpecificLogic(bbsVO, bbsVO.getBbsId());
        
        return bbsMapper.updateBbs(bbsVO);
    }

    @Override
    @Transactional
    public int deleteBbs(String bbsId, Long nttId) {
        return bbsMapper.deleteBbs(bbsId, nttId);
    }

    @Override
    @Transactional
    public int updateBbsAtchFileId(int nttId, String atchFileId) {
        return bbsMapper.updateBbsAtchFileId(nttId, atchFileId);
    }

    @Override
    @Transactional
    public int updateRdcnt(String bbsId, int nttId) {
        return bbsMapper.updateRdcnt(bbsId, nttId);
    }

    /**
     * 게시판 유형별 게시물 처리 로직
     * 전자정부 프레임워크 표준에 따른 게시판별 특화 기능
     */
    private void processBoardTypeSpecificLogic(BbsVO bbsVO, String bbsId) {
        try {
            // 1. 게시판 마스터 정보 조회
            BbsMstVO bbsMst = bbsMapper.selectBbsMst(bbsId);
            if (bbsMst == null) {
                // 게시판 마스터 정보 없음
                return;
            }
            
            String bbsTyCode = bbsMst.getBbsTyCode();      // 게시판 유형
            String bbsAttrbCode = bbsMst.getBbsAttrbCode(); // 게시판 속성
            
                    // 게시판별 특화 처리
            
            // 2. 게시판 유형별 처리
            switch (bbsTyCode) {
                case "BBST01": // 일반게시판
                    processGeneralBoard(bbsVO);
                    break;
                case "BBST02": // 공지게시판
                    processNoticeBoard(bbsVO);
                    break;
                case "BBST03": // FAQ게시판
                    processFaqBoard(bbsVO);
                    break;
                case "BBST04": // QNA게시판
                    processQnaBoard(bbsVO);
                    break;
                case "BBST05": // 갤러리게시판
                    processGalleryBoard(bbsVO);
                    break;
                case "BBST06": // 블로그게시판
                    processBlogBoard(bbsVO);
                    break;
                default:
                    // 알 수 없는 게시판 유형
                    processGeneralBoard(bbsVO); // 기본 처리
            }
            
            // 3. 게시판 속성별 처리
            switch (bbsAttrbCode) {
                case "BBSA01": // 일반속성
                    processGeneralAttribute(bbsVO);
                    break;
                case "BBSA02": // 공지속성
                    processNoticeAttribute(bbsVO);
                    break;
                case "BBSA03": // 자료실속성
                    processDataRoomAttribute(bbsVO);
                    break;
                case "BBSA04": // 갤러리속성
                    processGalleryAttribute(bbsVO);
                    break;
                case "BBSA05": // 커뮤니티속성
                    processCommunityAttribute(bbsVO);
                    break;
                default:
                    System.out.println("알 수 없는 게시판 속성: " + bbsAttrbCode);
                    processGeneralAttribute(bbsVO); // 기본 처리
            }
            
            System.out.println("=== 게시판별 특화 처리 완료 ===");
            
        } catch (Exception e) {
            System.out.println("게시판별 특화 처리 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * 일반게시판 처리
     */
    private void processGeneralBoard(BbsVO bbsVO) {
        // 기본 게시물 처리 (추가 로직 없음)
    }
    
    /**
     * 공지게시판 처리
     */
    private void processNoticeBoard(BbsVO bbsVO) {
        // 공지 우선순위 설정
        if (bbsVO.getNtceAt() != null && "Y".equals(bbsVO.getNtceAt())) {
            bbsVO.setNttPriority(10); // 공지 우선순위 높게 설정
        }
        // 만료일 설정 (기본 1년)
        if (bbsVO.getNttExpiryDate() == null) {
            bbsVO.setNttExpiryDate(LocalDate.now().plusYears(1));
        }
    }
    
    /**
     * FAQ게시판 처리
     */
    private void processFaqBoard(BbsVO bbsVO) {
        // 카테고리 필수 설정
        if (bbsVO.getNttCategory() == null || bbsVO.getNttCategory().trim().isEmpty()) {
            bbsVO.setNttCategory("NTTCAT01"); // 기본 카테고리
        }
        // FAQ는 답변 형태로 처리
        bbsVO.setAnswerAt("Y");
    }
    
    /**
     * QNA게시판 처리
     */
    private void processQnaBoard(BbsVO bbsVO) {
        // 카테고리 필수 설정
        if (bbsVO.getNttCategory() == null || bbsVO.getNttCategory().trim().isEmpty()) {
            bbsVO.setNttCategory("NTTCAT01"); // 기본 카테고리
        }
        // QNA는 질문 형태로 처리
        bbsVO.setAnswerAt("N");
    }
    
    /**
     * 갤러리게시판 처리
     */
    private void processGalleryBoard(BbsVO bbsVO) {
        // 이미지 중심 게시판이므로 첨부파일 필수
        if (bbsVO.getAtchFileId() == null || bbsVO.getAtchFileId().trim().isEmpty()) {
            // 갤러리게시판은 이미지 첨부가 권장됩니다
        }
    }
    
    /**
     * 블로그게시판 처리
     */
    private void processBlogBoard(BbsVO bbsVO) {
        // 태그 설정 (선택사항)
        if (bbsVO.getNttTag() == null || bbsVO.getNttTag().trim().isEmpty()) {
            // 제목에서 키워드 추출하여 태그 자동 생성
            String title = bbsVO.getNttSj();
            if (title != null && title.length() > 0) {
                String[] keywords = title.split("\\s+");
                if (keywords.length > 0) {
                    bbsVO.setNttTag(keywords[0]); // 첫 번째 키워드를 태그로 설정
                }
            }
        }
    }
    
    /**
     * 일반속성 처리
     */
    private void processGeneralAttribute(BbsVO bbsVO) {
        // 기본 게시물 처리
    }
    
    /**
     * 공지속성 처리
     */
    private void processNoticeAttribute(BbsVO bbsVO) {
        // 공지 우선순위 자동 설정
        if (bbsVO.getNttPriority() == null || bbsVO.getNttPriority() == 0) {
            bbsVO.setNttPriority(5); // 기본 우선순위
        }
    }
    
    /**
     * 자료실속성 처리
     */
    private void processDataRoomAttribute(BbsVO bbsVO) {
        // 파일 첨부 필수 체크
        if (bbsVO.getAtchFileId() == null || bbsVO.getAtchFileId().trim().isEmpty()) {
            // 자료실게시판은 파일 첨부가 권장됩니다
        }
    }
    
    /**
     * 갤러리속성 처리
     */
    private void processGalleryAttribute(BbsVO bbsVO) {
        // 이미지 파일 타입 체크 (서비스 레벨에서 처리)
    }
    
    /**
     * 커뮤니티속성 처리
     */
    private void processCommunityAttribute(BbsVO bbsVO) {
        // 댓글 활성화 및 좋아요 기능 활성화
        // bbsVO에는 replyPosblAt이 없으므로 제거
        // 댓글 기능은 게시판 마스터(BbsMstVO)에서 관리됨
    }

    // 댓글 관련
    @Override
    @Transactional(readOnly = true)
    public List<CommentVO> selectCommentList(String bbsId, int nttId) {
        return bbsMapper.selectCommentList(bbsId, nttId);
    }

    @Override
    @Transactional
    public int insertComment(CommentVO commentVO) {
        return bbsMapper.insertComment(commentVO);
    }

    @Override
    @Transactional
    public int updateComment(CommentVO commentVO) {
        return bbsMapper.updateComment(commentVO);
    }

    @Override
    @Transactional
    public int deleteComment(int commentNo) {
        return bbsMapper.deleteComment(commentNo);
    }
} 