package kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1000VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1100VO;



@Repository("jen1000DAO")
public class Jen1000DAO extends ComOslitsAbstractDAO {
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<Map> selectJen1000JenkinsNormalList(Map paramMap) throws Exception {
		return (List) list("jen1000DAO.selectJen1000JenkinsNormalList", paramMap);
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<Map> selectJen1100JobNormalList(Map paramMap) throws Exception {
		return (List) list("jen1000DAO.selectJen1100JobNormalList", paramMap);
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<Jen1000VO> selectJen1000JenkinsList(Jen1000VO jen1000VO) throws Exception {
		return (List) list("jen1000DAO.selectJen1000JenkinsList", jen1000VO);
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<Jen1100VO> selectJen1100JobList(Jen1100VO jen1100VO) throws Exception {
		return (List) list("jen1000DAO.selectJen1100JobList", jen1100VO);
	}
	
	
	public int selectJen1000JenkinsListCnt(Jen1000VO jen1000VO) throws Exception {
		return (Integer) select("jen1000DAO.selectJen1000JenkinsListCnt", jen1000VO);
	}
	
	
	public int selectJen1100JobListCnt(Jen1100VO jen1100VO) throws Exception {
		return (Integer) select("jen1000DAO.selectJen1100JobListCnt", jen1100VO);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return (Map) select("jen1000DAO.selectJen1000JenkinsInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectJen1100JobInfo(Map<String, String> paramMap) throws Exception {
		return (Map) select("jen1000DAO.selectJen1100JobInfo", paramMap);
	}
	
	
	public String insertJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return (String) insert("jen1000DAO.insertJen1000JenkinsInfo", paramMap);
	}
	
	
	public String insertJen1100JobInfo(Map<String, String> paramMap) throws Exception {
		return (String) insert("jen1000DAO.insertJen1100JobInfo", paramMap);
	}

	
	public int updateJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception{
		return update("jen1000DAO.updateJen1000JenkinsInfo", paramMap);
	}
	
	
	public int updateJen1100JobInfo(Map<String, String> paramMap)  throws Exception{
		return update("jen1000DAO.updateJen1100JobInfo", paramMap);
	}
	
	
	public void deleteJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception{
		update("jen1000DAO.deleteJen1000JenkinsInfo", paramMap);
	}
	
	
	public void deleteJen1100JobInfo(Map<String, String> paramMap) throws Exception {
		delete("jen1000DAO.deleteJen1100JobInfo", paramMap);
	}
	
	
	public int selectJen1000JenkinsUseCountInfo(Map<String, String> paramMap)  throws Exception{
		return (Integer) select("jen1000DAO.selectJen1000JenkinsUseCountInfo", paramMap);
	}
	
	
	public int selectJen1100JobUseCountInfo(Map<String, String> paramMap)  throws Exception{
		return (Integer) select("jen1000DAO.selectJen1100JobUseCountInfo", paramMap);
	}

	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public List<Map> selectJen1000JenkinsUserList(Map map) throws Exception{
		return (List) list("jen1000DAO.selectJen1000JenkinsUserList", map);
	}

	
	public int updateJen1100JenkinsJobRestoreInfo(Map<String, String> paramMap)  throws Exception{
		return update("jen1000DAO.updateJen1100JenkinsJobRestoreInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertJen1102ParameterInfo(Map paramMap) throws Exception{
		return (String) insert("jen1000DAO.insertJen1102ParameterInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteJen1102ParameterInfo(Map paramMap) throws Exception{
		update("jen1000DAO.deleteJen1102ParameterInfo", paramMap);
    }
	
	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public List<Map> selectJen1101CIJobList(Map paramMap) throws Exception{
		return (List) list("jen1000DAO.selectJen1101CIJobList", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public List<Map> selectJen1102CIJobParamList(Map paramMap) throws Exception{
		return (List) list("jen1000DAO.selectJen1102CIJobParamList", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteJen1101CIJobInfo(Map paramMap) throws Exception {
		delete("jen1000DAO.deleteJen1101CIJobInfo", paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public String insertJen1101CIJobInfo(Map paramMap) throws Exception{
		return (String) insert("jen1000DAO.insertJen1101CIJobInfo", paramMap);
	}
}
