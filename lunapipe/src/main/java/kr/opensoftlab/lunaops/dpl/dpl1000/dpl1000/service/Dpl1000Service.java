package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service;

import java.util.List;
import java.util.Map;

import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1000VO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1100VO;
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
	List selectDpl1100DeployJobList(Map inputMap)  throws Exception;
	
	
	List<Dpl1100VO> selectDpl1100dplJobGridList(Dpl1100VO dpl1300VO)  throws Exception;
	
	
	int selectDpl1100dplJobGridListCnt(Dpl1100VO dpl1300VO) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertDpl1000DeployVerInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({ "rawtypes" })
	void  insertDpl1100DeployJobInfo(Map paramMap) throws Exception;
	
	
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
	Map selectDpl1200DplJobBuildInfo(Map map)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	Map selectDpl1200DplSelBuildInfoAjax(Map map)  throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	void deleteDpl1100DplJobList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	Map selectDpl1100ToJen1000JobInfo(Map map)  throws Exception;
	
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1000DplHistoryList(Map inputMap)  throws Exception;
	
	
	
	@SuppressWarnings({"rawtypes" })
	void insertDpl1000DplSignRequestList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1200DplBldNumList(Map inputMap)  throws Exception;
	
		
	@SuppressWarnings("rawtypes")
	List selectDpl1000AllDplList(Map paramMap) throws Exception;
	

	
	void insertDpl1201DeployBuildChgLogInfo(ChangeVO changeSetInfo) throws Exception;
	
	void insertDpl1201DeployBuildChgPathLogInfo(ChangePathsVO ChangePathInfo) throws Exception;

	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1201SvnChangeLogsList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1202SvnChangePathList(Map paramMap)  throws Exception;

	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1200DplNoneResultList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List selectDpl1101JenParameterList(Map paramMap)  throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertDpl1101ParameterInfo(Map paramMap) throws Exception;

	
	
	@SuppressWarnings("rawtypes")
	void deleteDpl1101ParameterInfo(Map paramMap) throws Exception;

	
	String insertDpl1102DplBuildInfo(BuildVO buildVo) throws Exception;
}
