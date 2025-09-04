package egovframework.survey.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import egovframework.survey.vo.CommonCodeVO;
import egovframework.survey.vo.CommonCodeDetailVO;
import egovframework.survey.vo.CommonCodeSearchVO;
import egovframework.survey.vo.CommonCodeDetailSearchVO;

@Mapper
public interface CommonCodeMapper {
    
    // 공통코드 그룹 관련
    List<CommonCodeVO> selectCommonCodeList(CommonCodeSearchVO searchVO);
    int selectCommonCodeListTotCnt(CommonCodeSearchVO searchVO);
    CommonCodeVO selectCommonCode(String codeId);
    void insertCommonCode(CommonCodeVO commonCodeVO);
    void updateCommonCode(CommonCodeVO commonCodeVO);
    void deleteCommonCode(String codeId);
    
    // 공통코드 상세 관련
    List<CommonCodeDetailVO> selectCommonCodeDetailList(String codeId, CommonCodeDetailSearchVO searchVO);
    int selectCommonCodeDetailListTotCnt(String codeId, CommonCodeDetailSearchVO searchVO);
    CommonCodeDetailVO selectCommonCodeDetail(CommonCodeSearchVO searchVO);
    void insertCommonCodeDetail(CommonCodeDetailVO commonCodeDetailVO);
    void updateCommonCodeDetail(CommonCodeDetailVO commonCodeDetailVO);
    void deleteCommonCodeDetail(CommonCodeSearchVO searchVO);
} 