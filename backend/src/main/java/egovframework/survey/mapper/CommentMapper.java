package egovframework.survey.mapper;

import egovframework.survey.vo.CommentVO;
import egovframework.survey.vo.CommonVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 댓글 관련 MyBatis Mapper 인터페이스
 */
@Mapper
public interface CommentMapper {
    
    /**
     * 댓글 목록 조회
     */
    List<CommentVO> selectCommentList(@Param("nttId") Long nttId);
    
    /**
     * 댓글 총 개수 조회
     */
    int selectCommentListTotCnt(@Param("nttId") Long nttId);
    
    /**
     * 댓글 상세 조회
     */
    CommentVO selectCommentDetail(@Param("commentNo") Long commentNo);
    
    /**
     * 댓글 등록
     */
    int insertComment(CommentVO commentVO);
    
    /**
     * 댓글 수정
     */
    int updateComment(CommentVO commentVO);
    
    /**
     * 댓글 삭제
     */
    int deleteComment(@Param("commentNo") Long commentNo);
    
    /**
     * 게시글의 모든 댓글 삭제
     */
    int deleteCommentAll(@Param("nttId") Long nttId);
} 