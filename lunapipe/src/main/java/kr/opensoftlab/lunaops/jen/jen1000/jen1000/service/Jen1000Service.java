package kr.opensoftlab.lunaops.jen.jen1000.jen1000.service;

import java.util.List;
import java.util.Map;

import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1000VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1100VO;



public interface Jen1000Service {

	
	@SuppressWarnings({ "rawtypes" })
	List<Map> selectJen1000JenkinsNormalList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({  "rawtypes" })
	List<Map> selectJen1000JobNormalList(Map paramMap) throws Exception;
	
	
	List<Jen1000VO> selectJen1000JenkinsList(Jen1000VO jen1000VO) throws Exception;
	
	
	List<Jen1100VO> selectJen1000JobList(Jen1100VO jen1100VO) throws Exception;
	
	
	int selectJen1000JenkinsListCnt(Jen1000VO jen1000VO) throws Exception;
	
	
	int selectJen1000JobListCnt(Jen1100VO jen1100VO) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectJen1000JobInfo(Map<String, String> paramMap) throws Exception;
	
	
	String insertJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception;
	
	
	String insertJen1000JobInfo(Map<String, String> paramMap) throws Exception;

	
	int updateJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception;
	
	
	int updateJen1000JobInfo(Map<String, String> paramMap) throws Exception;
	
	
	void deleteJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception;
	
	
	void deleteJen1000JobInfo(Map<String, String> paramMap) throws Exception;
	
	
	int selectJen1000JenkinsUseCountInfo(Map<String, String> paramMap) throws Exception;
	
	
	int selectJen1000JobUseCountInfo(Map<String, String> paramMap) throws Exception;
	
	
	Object saveJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception;
	
	
	Object saveJen1000JobInfo(Map<String, String> paramMap)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes"})
	List<Map> selectJen1000JenkinsUserList(Map map) throws Exception;
	
}
