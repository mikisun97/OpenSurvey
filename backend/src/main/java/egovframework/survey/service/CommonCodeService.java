package egovframework.survey.service;

import egovframework.survey.vo.CommonCodeResponseVO;
import egovframework.survey.vo.CommonCodeDetailResponseVO;
import egovframework.survey.vo.CommonCodeSearchVO;
import egovframework.survey.vo.CommonCodeVO;
import egovframework.survey.vo.CommonCodeDetailVO;
import egovframework.survey.vo.CommonCodeDetailSearchVO;

public interface CommonCodeService {

    // 공통코드 그룹 관련
    CommonCodeResponseVO selectCommonCodeList(CommonCodeSearchVO searchVO);
    CommonCodeVO selectCommonCode(String codeId);
    void insertCommonCode(CommonCodeVO commonCodeVO);
    void updateCommonCode(CommonCodeVO commonCodeVO);
    void deleteCommonCode(String codeId);
    
    // 공통코드 상세 관련
    CommonCodeDetailResponseVO selectCommonCodeDetailList(String codeId, CommonCodeDetailSearchVO searchVO);
    CommonCodeDetailVO selectCommonCodeDetail(CommonCodeSearchVO searchVO);
    void insertCommonCodeDetail(CommonCodeDetailVO commonCodeDetailVO);
    void updateCommonCodeDetail(CommonCodeDetailVO commonCodeDetailVO);
    void deleteCommonCodeDetail(CommonCodeSearchVO searchVO);
} 