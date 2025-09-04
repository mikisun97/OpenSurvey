package egovframework.survey.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import egovframework.survey.vo.BbsMstVO;
import egovframework.survey.vo.BbsVO;
import egovframework.survey.vo.BbsMstSearchVO;
import egovframework.survey.vo.BbsSearchVO;
import egovframework.survey.vo.CommentVO;

@Mapper
public interface BbsMapper {
    
    // 게시판 마스터 관련
    List<BbsMstVO> selectBbsMstList(BbsMstSearchVO searchVO);
    int selectBbsMstListTotCnt(BbsMstSearchVO searchVO);
    BbsMstVO selectBbsMst(String bbsId);
    int insertBbsMst(BbsMstVO bbsMstVO);
    int updateBbsMst(BbsMstVO bbsMstVO);
    int deleteBbsMst(String bbsId);
    
    // 게시글 관련
    List<BbsVO> selectBbsList(BbsSearchVO searchVO);
    int selectBbsListTotCnt(BbsSearchVO searchVO);
    BbsVO selectBbs(String bbsId, int nttId);
    int insertBbs(BbsVO bbsVO);
    int updateBbs(BbsVO bbsVO);
    int deleteBbs(String bbsId, Long nttId);
    int updateBbsAtchFileId(int nttId, String atchFileId);
    int updateRdcnt(String bbsId, int nttId);
    
    // 댓글 관련
    List<CommentVO> selectCommentList(String bbsId, int nttId);
    int insertComment(CommentVO commentVO);
    int updateComment(CommentVO commentVO);
    int deleteComment(int commentNo);
} 