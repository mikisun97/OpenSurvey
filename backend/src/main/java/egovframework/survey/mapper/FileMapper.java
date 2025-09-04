package egovframework.survey.mapper;

import egovframework.survey.vo.FileVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 첨부파일 관련 MyBatis Mapper 인터페이스
 * 전자정부 프레임워크 표준 구조 지원
 */
@Mapper
public interface FileMapper {
    
    /**
     * 첨부파일 목록 조회 (COMTNFILE + COMTNFILEDETAIL 조인)
     */
    List<FileVO> selectFileList(@Param("atchFileId") String atchFileId);
    
    /**
     * 첨부파일 상세 조회 (COMTNFILE + COMTNFILEDETAIL 조인)
     */
    FileVO selectFileDetail(@Param("atchFileId") String atchFileId, @Param("fileSn") Long fileSn);
    
    /**
     * 첨부파일 등록 (COMTNFILE + COMTNFILEDETAIL)
     */
    int insertFile(FileVO fileVO);
    
    /**
     * 첨부파일 삭제 (COMTNFILEDETAIL에서만 삭제)
     */
    int deleteFile(@Param("atchFileId") String atchFileId, @Param("fileSn") Long fileSn);
    
    /**
     * 첨부파일 전체 삭제 (COMTNFILE + COMTNFILEDETAIL)
     */
    int deleteFileAll(@Param("atchFileId") String atchFileId);
    
    /**
     * 첨부파일ID로 다음 파일순번 조회 (COMTNFILEDETAIL에서 조회)
     */
    Long selectNextFileSn(@Param("atchFileId") String atchFileId);
    
    /**
     * 첨부파일ID로 파일 개수 조회 (COMTNFILEDETAIL에서 조회)
     */
    int selectFileCount(@Param("atchFileId") String atchFileId);
    
    /**
     * 게시물 내용에서 사용되는 이미지 목록 조회 (COMTNFILEDETAIL에서 조회)
     */
    List<FileVO> selectContentImages(@Param("atchFileId") String atchFileId);
    
    /**
     * 첨부파일로만 사용되는 파일 목록 조회 (COMTNFILEDETAIL에서 조회)
     */
    List<FileVO> selectAttachmentFiles(@Param("atchFileId") String atchFileId);
    
    /**
     * 첨부파일 마스터 정보 조회 (COMTNFILE)
     */
    FileVO selectFileMaster(@Param("atchFileId") String atchFileId);
    
    /**
     * 첨부파일 마스터 존재 여부 확인 (COMTNFILE)
     */
    boolean existsFileMaster(@Param("atchFileId") String atchFileId);
    
    /**
     * 첨부파일 마스터 등록 (COMTNFILE)
     */
    int insertFileMaster(FileVO fileVO);
    
    /**
     * 첨부파일 마스터 수정 (COMTNFILE)
     */
    int updateFileMaster(FileVO fileVO);
    
    /**
     * 첨부파일 상세만 등록 (COMTNFILEDETAIL)
     */
    int insertFileDetail(FileVO fileVO);
    
    /**
     * 대표이미지 조회
     */
    FileVO selectRepresentativeImage(@Param("atchFileId") String atchFileId);
    
    /**
     * 메인이미지 조회
     */
    FileVO selectMainImage(@Param("atchFileId") String atchFileId);
    
    /**
     * 다중이미지 목록 조회
     */
    List<FileVO> selectMultiImages(@Param("atchFileId") String atchFileId);
    
    /**
     * 특정 타입의 이미지 삭제
     */
    int deleteImageByType(@Param("atchFileId") String atchFileId, @Param("fileCn") String fileCn);
    
    /**
     * 대표이미지 수정 (기존 파일 정보 업데이트)
     */
    int updateRepresentativeImage(FileVO fileVO);
    
    /**
     * 특정 타입의 이미지가 존재하는지 확인
     */
    boolean existsImageByType(@Param("atchFileId") String atchFileId, @Param("fileCn") String fileCn);
    
    /**
     * 파일 순서 업데이트 (COMTNFILEDETAIL)
     */
    int updateFileOrder(FileVO fileVO);
    
    /**
     * 모든 파일 목록 조회 (다중이미지 처리용)
     */
    List<FileVO> selectAllFiles();
} 