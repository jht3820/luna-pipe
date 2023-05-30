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
	public List<Map> selectJen1000JobNormalList(Map paramMap) throws Exception {
		return (List) list("jen1000DAO.selectJen1000JobNormalList", paramMap);
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<Jen1000VO> selectJen1000JenkinsList(Jen1000VO jen1000VO) throws Exception {
		return (List) list("jen1000DAO.selectJen1000JenkinsList", jen1000VO);
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public List<Jen1100VO> selectJen1000JobList(Jen1100VO jen1100VO) throws Exception {
		return (List) list("jen1000DAO.selectJen1000JobList", jen1100VO);
	}
	
	
	public int selectJen1000JenkinsListCnt(Jen1000VO jen1000VO) throws Exception {
		return (Integer) select("jen1000DAO.selectJen1000JenkinsListCnt", jen1000VO);
	}
	
	
	public int selectJen1000JobListCnt(Jen1100VO jen1100VO) throws Exception {
		return (Integer) select("jen1000DAO.selectJen1000JobListCnt", jen1100VO);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return (Map) select("jen1000DAO.selectJen1000JenkinsInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectJen1000JobInfo(Map<String, String> paramMap) throws Exception {
		return (Map) select("jen1000DAO.selectJen1000JobInfo", paramMap);
	}
	
	
	public String insertJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return (String) insert("jen1000DAO.insertJen1000JenkinsInfo", paramMap);
	}
	
	
	public String insertJen1000JobInfo(Map<String, String> paramMap) throws Exception {
		return (String) insert("jen1000DAO.insertJen1000JobInfo", paramMap);
	}

	
	public int updateJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception{
		return update("jen1000DAO.updateJen1000JenkinsInfo", paramMap);
	}
	
	
	public int updateJen1000JobInfo(Map<String, String> paramMap)  throws Exception{
		return update("jen1000DAO.updateJen1000JobInfo", paramMap);
	}
	
	
	public void deleteJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception{
		update("jen1000DAO.deleteJen1000JenkinsInfo", paramMap);
	}
	
	
	public void deleteJen1000JobInfo(Map<String, String> paramMap) throws Exception {
		delete("jen1000DAO.deleteJen1000JobInfo", paramMap);
	}
	
	
	public int selectJen1000JenkinsUseCountInfo(Map<String, String> paramMap)  throws Exception{
		return (Integer) select("jen1000DAO.selectJen1000JenkinsUseCountInfo", paramMap);
	}
	
	
	public int selectJen1000JobUseCountInfo(Map<String, String> paramMap)  throws Exception{
		return (Integer) select("jen1000DAO.selectJen1000JobUseCountInfo", paramMap);
	}

	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public List<Map> selectJen1000JenkinsUserList(Map map) throws Exception{
		return (List) list("jen1000DAO.selectJen1000JenkinsUserList", map);
	}
}
