package egovframework.survey.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import egovframework.survey.mapper.CommonCodeMapper;
import egovframework.survey.service.CommonCodeService;
import egovframework.survey.vo.CommonCodeSearchVO;
import egovframework.survey.vo.CommonCodeDetailSearchVO;
import egovframework.survey.vo.CommonCodeVO;
import egovframework.survey.vo.CommonCodeDetailVO;
import egovframework.survey.vo.CommonCodeResponseVO;
import egovframework.survey.vo.CommonCodeDetailResponseVO;
import egovframework.survey.vo.PaginationInfo;

@Service
public class CommonCodeServiceImpl implements CommonCodeService {

    @Autowired
    private CommonCodeMapper commonCodeMapper;

    // 공통코드 그룹 관련
    @Override
    public CommonCodeResponseVO selectCommonCodeList(CommonCodeSearchVO searchVO) {
        try {
            // 페이징 정보 설정 (전자정부 프레임워크 표준)
            PaginationInfo paginationInfo = new PaginationInfo();
            paginationInfo.setCurrentPageNo(searchVO.getPageIndex() + 1); // 0부터 시작하므로 +1
            paginationInfo.setRecordCountPerPage(searchVO.getPageSize());
            paginationInfo.setPageSize(searchVO.getPageSize());

            // 실제 DB에서 데이터 조회
            List<CommonCodeVO> list = commonCodeMapper.selectCommonCodeList(searchVO);

            // 총 개수 조회
            int totalCount = commonCodeMapper.selectCommonCodeListTotCnt(searchVO);
            paginationInfo.setTotalRecordCount(totalCount);

            return new CommonCodeResponseVO(list, paginationInfo);
        } catch (Exception e) {
            return new CommonCodeResponseVO("ERROR", "공통코드 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Override
    public CommonCodeVO selectCommonCode(String codeId) {
        return commonCodeMapper.selectCommonCode(codeId);
    }

    @Override
    public void insertCommonCode(CommonCodeVO commonCodeVO) {
        commonCodeMapper.insertCommonCode(commonCodeVO);
    }

    @Override
    public void updateCommonCode(CommonCodeVO commonCodeVO) {
        commonCodeMapper.updateCommonCode(commonCodeVO);
    }

    @Override
    public void deleteCommonCode(String codeId) {
        commonCodeMapper.deleteCommonCode(codeId);
    }

    // 공통코드 상세 관련
    @Override
    public CommonCodeDetailResponseVO selectCommonCodeDetailList(String codeId, CommonCodeDetailSearchVO searchVO) {
        try {
            // 페이징 정보 설정 (전자정부 프레임워크 표준)
            PaginationInfo paginationInfo = new PaginationInfo();
            paginationInfo.setCurrentPageNo(searchVO.getPageIndex() + 1); // 0부터 시작하므로 +1
            paginationInfo.setRecordCountPerPage(searchVO.getPageSize());
            paginationInfo.setPageSize(searchVO.getPageSize());

            // 실제 DB에서 데이터 조회
            List<CommonCodeDetailVO> list = commonCodeMapper.selectCommonCodeDetailList(codeId, searchVO);

            // 총 개수 조회
            int totalCount = commonCodeMapper.selectCommonCodeDetailListTotCnt(codeId, searchVO);
            paginationInfo.setTotalRecordCount(totalCount);

            return new CommonCodeDetailResponseVO(list, paginationInfo);
        } catch (Exception e) {
            return new CommonCodeDetailResponseVO("ERROR", "세부코드 목록 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Override
    public CommonCodeDetailVO selectCommonCodeDetail(CommonCodeSearchVO searchVO) {
        return commonCodeMapper.selectCommonCodeDetail(searchVO);
    }

    @Override
    public void insertCommonCodeDetail(CommonCodeDetailVO commonCodeDetailVO) {
        commonCodeMapper.insertCommonCodeDetail(commonCodeDetailVO);
    }

    @Override
    public void updateCommonCodeDetail(CommonCodeDetailVO commonCodeDetailVO) {
        commonCodeMapper.updateCommonCodeDetail(commonCodeDetailVO);
    }

    @Override
    public void deleteCommonCodeDetail(CommonCodeSearchVO searchVO) {
        commonCodeMapper.deleteCommonCodeDetail(searchVO);
    }
} 