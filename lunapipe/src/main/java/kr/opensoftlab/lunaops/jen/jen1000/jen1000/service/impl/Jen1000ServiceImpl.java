package kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.impl;

import java.util.HashMap;
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
	public List<Map> selectJen1100JobNormalList(Map paramMap) throws Exception {
		return jen1000DAO.selectJen1100JobNormalList(paramMap);
	}
	
	
	public List<Jen1000VO> selectJen1000JenkinsList(Jen1000VO jen1000VO) throws Exception {
		return jen1000DAO.selectJen1000JenkinsList(jen1000VO);
	}
	
	
	public List<Jen1100VO> selectJen1100JobList(Jen1100VO jen1100VO) throws Exception {
		return jen1000DAO.selectJen1100JobList(jen1100VO);
	}
	
	
	public int selectJen1000JenkinsListCnt(Jen1000VO jen1000VO) throws Exception {
		return jen1000DAO.selectJen1000JenkinsListCnt(jen1000VO);
	}
	
	
	public int selectJen1100JobListCnt(Jen1100VO jen1100VO) throws Exception {
		return jen1000DAO.selectJen1100JobListCnt(jen1100VO);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.selectJen1000JenkinsInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectJen1100JobInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.selectJen1100JobInfo(paramMap);
	}
	
	
	public String insertJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.insertJen1000JenkinsInfo(paramMap);
	}
	
	
	public String insertJen1100JobInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.insertJen1100JobInfo(paramMap);
	}
	
	
	public int updateJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.updateJen1000JenkinsInfo(paramMap);
	}
	
	
	public int updateJen1100JobInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.updateJen1100JobInfo(paramMap);
	}

	
	public void deleteJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception{
		jen1000DAO.deleteJen1000JenkinsInfo(paramMap);
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void deleteJen1100JobList(Map<String, Object> paramMap) throws Exception {
		List<Map> paramJenIds = (List<Map>) paramMap.get("list");
		
		
		String jenId = (String) paramMap.get("jenId");
				
		
		if(paramJenIds != null) {
			
			if(jenId == null) {
				jenId = (String) paramJenIds.get(0).get("jenId");
			}
			
			for(Map paramJenMap : paramJenIds) {
				String jobId = (String) paramJenMap.get("jobId");
				
				Map newMap = new HashMap<>();
				newMap.put("jenId", jenId);
				newMap.put("jobId", jobId);

				
				jen1000DAO.updateJen1100JenkinsJobRestoreInfo(newMap);
				
				
				jen1000DAO.deleteJen1100JobInfo(newMap);
			}
		}

	}
	
	
	public int selectJen1000JenkinsUseCountInfo(Map<String, String> paramMap)  throws Exception{
		return jen1000DAO.selectJen1000JenkinsUseCountInfo(paramMap);
	}
	
	
	public int selectJen1100JobUseCountInfo(Map<String, String> paramMap) throws Exception {
		return jen1000DAO.selectJen1100JobUseCountInfo(paramMap);
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
			insNewJenId = jen1000DAO.insertJen1100JobInfo(paramMap);
			return insNewJenId;
		}else if("update".equals(popupGb)){
			
			String beforeJobTypeCd = (String)paramMap.get("beforeJobTypeCd");
			String jobTypeCd = (String)paramMap.get("jobTypeCd");
			
			
			if("03".equals(beforeJobTypeCd)){
				
				if(!jobTypeCd.equals(beforeJobTypeCd)) {
					
				
				}
			}
			
			result = jen1000DAO.updateJen1100JobInfo(paramMap);
			return result;
		}
		return null;
	}
	
	
	@SuppressWarnings({"rawtypes"})
	public List<Map> selectJen1000JenkinsUserList(Map map) throws Exception{
		return jen1000DAO.selectJen1000JenkinsUserList(map);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectJen1102JenParameterList(Map paramMap)  throws Exception{
		return jen1000DAO.selectJen1102JenParameterList(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertJen1102ParameterInfo(Map paramMap) throws Exception{
		return jen1000DAO.insertJen1102ParameterInfo(paramMap);
	}

	
	
	@SuppressWarnings("rawtypes")
	public void deleteJen1102ParameterInfo(Map paramMap) throws Exception{
		jen1000DAO.deleteJen1102ParameterInfo(paramMap);
    }
	
	
	@SuppressWarnings({"rawtypes"})
	public List<Map> selectJen1101CIJobList(Map paramMap) throws Exception{
		return jen1000DAO.selectJen1101CIJobList(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public List<Map> selectJen1102CIJobParamList(Map paramMap) throws Exception{
		return jen1000DAO.selectJen1102CIJobParamList(paramMap);
	}
	
	@SuppressWarnings("rawtypes")
	public void deleteJen1101CIJobInfo(Map paramMap) throws Exception {
		jen1000DAO.deleteJen1101CIJobInfo(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public String insertJen1101CIJobInfo(Map paramMap) throws Exception{
		return jen1000DAO.insertJen1101CIJobInfo(paramMap);
	}
}
