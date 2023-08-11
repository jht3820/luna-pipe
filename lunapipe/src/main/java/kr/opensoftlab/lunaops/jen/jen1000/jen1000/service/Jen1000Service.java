package kr.opensoftlab.lunaops.jen.jen1000.jen1000.service;

import java.util.List;
import java.util.Map;

import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1000VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1100VO;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;



public interface Jen1000Service {

	
	@SuppressWarnings({ "rawtypes" })
	List<Map> selectJen1000JenkinsNormalList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({  "rawtypes" })
	List<Map> selectJen1100JobNormalList(Map paramMap) throws Exception;
	
	
	List<Jen1000VO> selectJen1000JenkinsList(Jen1000VO jen1000VO) throws Exception;
	
	
	List<Jen1100VO> selectJen1100JobList(Jen1100VO jen1100VO) throws Exception;
	
	
	int selectJen1000JenkinsListCnt(Jen1000VO jen1000VO) throws Exception;
	
	
	int selectJen1100JobListCnt(Jen1100VO jen1100VO) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectJen1100JobInfo(Map<String, String> paramMap) throws Exception;
	
	
	String insertJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception;
	
	
	String insertJen1100JobInfo(Map<String, String> paramMap) throws Exception;

	
	int updateJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception;
	
	
	int updateJen1100JobInfo(Map<String, String> paramMap) throws Exception;
	
	
	void deleteJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception;
	
	
	void deleteJen1100JobList(Map<String, Object> paramMap) throws Exception;
	
	
	int selectJen1000JenkinsUseCountInfo(Map<String, String> paramMap) throws Exception;
	
	
	int selectJen1100JobUseCountInfo(Map<String, String> paramMap) throws Exception;
	
	
	Object saveJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception;
	
	
	Object saveJen1000JobInfo(Map<String, String> paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes"})
	List<Map> selectJen1000JenkinsUserList(Map map) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertJen1102ParameterInfo(Map paramMap) throws Exception;

	
	
	@SuppressWarnings("rawtypes")
	void deleteJen1102ParameterInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List<Map> selectJen1101CIJobList(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	List<Map> selectJen1102CIJobParamList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	void deleteJen1101CIJobInfo(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	String insertJen1101CIJobInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	int insertJen1000BldLog(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	String insertJen1201JobBldChangeLogInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertJen1202JobBldChangeFileLogInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertJen1203JobBldParameterInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({ "rawtypes" })
	List<Map> selectJen1203JobBuildParamList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectJen1200JobLastBuildInfo(Map paramMap) throws Exception;


	
	@SuppressWarnings({ "rawtypes" })
	Map selectJen1200JobBuildInfo(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	List<Map> selectJen1201JobLastBuildChgList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	List<Map> selectJen1202JobLastBuildFileChgList(Map paramMap) throws Exception;
	

	
	@SuppressWarnings("rawtypes")
	List<Map> selectJen1200JobBuildList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	int selectJen1200JobBuildListCnt(Map paramMap) throws Exception;

	
	String insertJen1200DeployJobBuildLogInfo(BuildVO buildVo) throws Exception;

	
	int updateJen1200DeployJobBuildLogInfo(BuildVO buildVo)  throws Exception;
}
