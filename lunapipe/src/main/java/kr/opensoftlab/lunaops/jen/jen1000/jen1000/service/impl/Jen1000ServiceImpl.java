package kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1000VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1100VO;


@Service("jen1000Service")
public class Jen1000ServiceImpl  extends EgovAbstractServiceImpl implements Jen1000Service{

	
    @Resource(name="jen1000DAO")
    private Jen1000DAO jen1000DAO;

	
	@SuppressWarnings({ "rawtypes" })
	public List<Map> selectJen1000JenkinsNormalList(Map paramMap) throws Exception {
		return jen1000DAO.selectJen1000JenkinsNormalList(paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List<Map> selectJen1000JobNormalList(Map paramMap) throws Exception {
		return jen1000DAO.selectJen1000JobNormalList(paramMap);
	}
	
	
	public List<Jen1000VO> selectJen1000JenkinsList(Jen1000VO jen1000VO) throws Exception {
		return jen1000DAO.selectJen1000JenkinsList(jen1000VO);
	}
	
	
	public List<Jen1100VO> selectJen1000JobList(Jen1100VO jen1100VO) throws Exception {
		return jen1000DAO.selectJen1000JobList(jen1100VO);
	}
	
	
	public int selectJen1000JenkinsListCnt(Jen1000VO jen1000VO) throws Exception {
		return jen1000DAO.selectJen1000JenkinsListCnt(jen1000VO);
	}
	
	
	public int selectJen1000JobListCnt(Jen1100VO jen1100VO) throws Exception {
		return jen1000DAO.selectJen1000JobListCnt(jen1100VO);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.selectJen1000JenkinsInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectJen1000JobInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.selectJen1000JobInfo(paramMap);
	}
	
	
	public String insertJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.insertJen1000JenkinsInfo(paramMap);
	}
	
	
	public String insertJen1000JobInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.insertJen1000JobInfo(paramMap);
	}
	
	
	public int updateJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.updateJen1000JenkinsInfo(paramMap);
	}
	
	
	public int updateJen1000JobInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.updateJen1000JobInfo(paramMap);
	}

	
	public void deleteJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception{
		jen1000DAO.deleteJen1000JenkinsInfo(paramMap);
	}
	
	
	public void deleteJen1000JobInfo(Map<String, String> paramMap) throws Exception {
		
		
		jen1000DAO.deleteJen1000JobInfo(paramMap);

		
		
	}
	
	
	public int selectJen1000JenkinsUseCountInfo(Map<String, String> paramMap)  throws Exception{
		return jen1000DAO.selectJen1000JenkinsUseCountInfo(paramMap);
	}
	
	
	public int selectJen1000JobUseCountInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.selectJen1000JobUseCountInfo(paramMap);
	}

	
	public Object saveJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception{
		String insNewJenId ="";
		int result = 0;
		String popupGb = (String)paramMap.get("popupGb");
		
		if("insert".equals(popupGb)){
			insNewJenId = jen1000DAO.insertJen1000JenkinsInfo(paramMap);
			return insNewJenId;
		}else if("update".equals(popupGb)){
			result = jen1000DAO.updateJen1000JenkinsInfo(paramMap);
			return result;
		}
		return null;
	}
	
	
	public Object saveJen1000JobInfo(Map<String, String> paramMap)  throws Exception{
		String insNewJenId ="";
		int result = 0;
		String popupGb = (String)paramMap.get("popupGb");
		
		if("insert".equals(popupGb)){
			insNewJenId = jen1000DAO.insertJen1000JobInfo(paramMap);
			return insNewJenId;
		}else if("update".equals(popupGb)){
			
			String beforeJobTypeCd = (String)paramMap.get("beforeJobTypeCd");
			String jobTypeCd = (String)paramMap.get("jobTypeCd");
			
			
			if("03".equals(beforeJobTypeCd)){
				
				if(!jobTypeCd.equals(beforeJobTypeCd)) {
					
				
				}
			}
			
			result = jen1000DAO.updateJen1000JobInfo(paramMap);
			return result;
		}
		return null;
	}
	
	
	@SuppressWarnings({"rawtypes"})
	public List<Map> selectJen1000JenkinsUserList(Map map) throws Exception{
		return jen1000DAO.selectJen1000JenkinsUserList(map);
	}
}
