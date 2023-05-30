package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service;

import java.util.List;
import java.util.Map;

import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1000VO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1300VO;
import kr.opensoftlab.sdf.excel.ExcelDataListResultHandler;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;
import kr.opensoftlab.sdf.jenkins.vo.ChangePathsVO;
import kr.opensoftlab.sdf.jenkins.vo.ChangeVO;



public interface Dpl1000Service {

	
	@SuppressWarnings("rawtypes")
	List selectDpl1000DeployNmList(Map inputMap) throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1000DeployVerNormalList(Map inputMap)  throws Exception;
	
	
	List<Dpl1000VO> selectDpl1000DeployVerInfoList(Dpl1000VO dpl1000VO) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectDpl1000DeployVerInfo(Map map) throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1300DeployJobList(Map inputMap)  throws Exception;
	
	
	List<Dpl1300VO> selectDpl1300dplJobGridList(Dpl1300VO dpl1300VO)  throws Exception;
	
	
	int selectDpl1300dplJobGridListCnt(Dpl1300VO dpl1300VO) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	void insertDpl1000DeployVerInfo(Map paramMap) throws Exception;
	
	
	
	@SuppressWarnings("rawtypes")
	void updateDpl1000DeployVerInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	void updateDpl1000DplStsCdInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	void deleteDpl1000DeployVerInfo(Map paramMap) throws Exception;
	
	
	int selectDpl1000ListCnt(Dpl1000VO dpl1000VO) throws Exception;
	
	
	
	void selectDpl1000ExcelList(Dpl1000VO dpl1000vo,ExcelDataListResultHandler resultHandler) throws Exception;

	int selectDpl1000BuildInfoListCnt(Dpl1000VO dpl1000vo) throws Exception;

	List<Dpl1000VO> selectDpl1000BuildInfoList(Dpl1000VO dpl1000vo) throws Exception;


	
	@SuppressWarnings({"rawtypes" })
	Map selectDpl1400DplJobBuildInfo(Map map)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	Map selectDpl1400DplSelBuildInfoAjax(Map map)  throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	void deleteDpl1300DplJobList(Map paramMap)  throws Exception;
	
	
	
	int insertDpl1400DeployJobBuildLogInfo(BuildVO buildVo) throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	Map selectDpl1300ToJen1000JobInfo(Map map)  throws Exception;
	
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1000DplHistoryList(Map inputMap)  throws Exception;
	
	
	
	@SuppressWarnings({"rawtypes" })
	void insertDpl1000DplSignRequestList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1400DplBldNumList(Map inputMap)  throws Exception;
	
		
	@SuppressWarnings("rawtypes")
	String selectDpl1500NewChgId(Map paramMap) throws Exception;
	
		
	@SuppressWarnings("rawtypes")
	String insertDpl1500ModifyHistoryInfo(Map paramMap) throws Exception;
	
		
	@SuppressWarnings("rawtypes")
	void insertDpl1500DplInfoModifyList(Map paramMap) throws Exception;
	
		
	@SuppressWarnings("rawtypes")
	List selectDpl1500ModifyHistoryList(Map paramMap) throws Exception;
	
		
	@SuppressWarnings("rawtypes")
	List selectDpl1000AllDplList(Map paramMap) throws Exception;
	

	
	void insertDpl1600DeployBuildChgLogInfo(ChangeVO changeSetInfo) throws Exception;
	
	void insertDpl1600DeployBuildChgPathLogInfo(ChangePathsVO ChangePathInfo) throws Exception;

	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1600SvnChangeLogsList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1700SvnChangePathList(Map paramMap)  throws Exception;

	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1400DplNoneResultList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1800JenParameterList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	public String insertDpl1800ParameterInfo(Map paramMap) throws Exception;

	
	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1800ParameterInfo(Map paramMap) throws Exception;
}
