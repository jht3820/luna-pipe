package kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.ModelAndView;

import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.BuildCause;
import com.offbytwo.jenkins.model.BuildChangeSet;
import com.offbytwo.jenkins.model.BuildChangeSetItem;
import com.offbytwo.jenkins.model.BuildChangeSetPath;
import com.offbytwo.jenkins.model.BuildWithDetails;

import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.com.exception.UserDefineException;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.impl.Dpl1000DAO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1000VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1100VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.web.Jen1000Controller;
import kr.opensoftlab.lunaops.whk.whk1000.whk1000.service.Whk1000Service;
import kr.opensoftlab.sdf.jenkins.NewJenkinsClient;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;
import kr.opensoftlab.sdf.jenkins.vo.JenStatusVO;
import kr.opensoftlab.sdf.util.CommonScrty;


@Service("jen1000Service")
public class Jen1000ServiceImpl  extends EgovAbstractServiceImpl implements Jen1000Service{

	
    @Resource(name="jen1000DAO")
    private Jen1000DAO jen1000DAO;
    
    
    @Resource(name="dpl1000DAO")
    private Dpl1000DAO dpl1000DAO;

	@Resource(name = "whk1000Service")
	private Whk1000Service whk1000Service;
	
	
	@Resource(name = "newJenkinsClient")
	private NewJenkinsClient newJenkinsClient;
	
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
		String newJenId = jen1000DAO.insertJen1000JenkinsInfo(paramMap);
		
		
		String empId = (String) paramMap.get("empId");
		whk1000Service.insertWhk1000SendData("02", "01", newJenId, null, empId);
		
		return newJenId;
	}
	
	
	public String insertJen1100JobInfo(Map<String, String> paramMap) throws Exception {
		
		String jenId = (String) paramMap.get("jenId");
		String jobId = (String) paramMap.get("jobId");
		String empId = (String) paramMap.get("empId");
		
		
		whk1000Service.insertWhk1000SendData("02", "01", jenId, jobId, empId);
				
		return jen1000DAO.insertJen1100JobInfo(paramMap);
	}
	
	
	public int updateJen1000JenkinsInfo(Map<String, String> paramMap) throws Exception {
		
		String jenId = (String) paramMap.get("jenId");
		String empId = (String) paramMap.get("empId");
		
		
		whk1000Service.insertWhk1000SendData("02", "02", jenId, null, empId);
		
		return jen1000DAO.updateJen1000JenkinsInfo(paramMap);
	}
	
	
	public int updateJen1100JobInfo(Map<String, String> paramMap) throws Exception {
		
		String jenId = (String) paramMap.get("jenId");
		String jobId = (String) paramMap.get("jobId");
		String empId = (String) paramMap.get("empId");
		
		
		whk1000Service.insertWhk1000SendData("02", "02", jenId, jobId, empId);
		
		return jen1000DAO.updateJen1100JobInfo(paramMap);
	}

	
	public void deleteJen1000JenkinsInfo(Map<String, String> paramMap)  throws Exception{
		
		String jenId = (String) paramMap.get("jenId");
		String empId = (String) paramMap.get("empId");
		
		
		whk1000Service.insertWhk1000SendData("02", "03", jenId, null, empId);
		
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

				
				dpl1000DAO.deleteDpl1100DplJobList(newMap);
				
				
				dpl1000DAO.deleteDpl1101ParameterInfo(newMap);
				
				
				dpl1000DAO.deleteDpl1102DplActionInfo(newMap);
				
				
				jen1000DAO.deleteJen1101CIJobInfo(newMap);
				
				
				jen1000DAO.deleteJen1102ParameterInfo(newMap);
				
				
				jen1000DAO.deleteJen1200DeployJobBuildLogList(newMap);
				
				
				jen1000DAO.deleteJen1201DeployJobBuildChgLogList(newMap);
				
				
				jen1000DAO.deleteJen1202DeployJobBuildFileChgLogList(newMap);
				
				
				jen1000DAO.deleteJen1203DeployJobBuildParamList(newMap);
				
				
				jen1000DAO.deleteJen1100JobInfo(newMap);
				
				
				String empId = (String) paramMap.get("empId");
				
				
				whk1000Service.insertWhk1000SendData("02", "03", jenId, jobId, empId);
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
			
			
			String empId = (String) paramMap.get("empId");
			
			
			whk1000Service.insertWhk1000SendData("02", "01", insNewJenId, null, empId);
			
			return insNewJenId;
		}else if("update".equals(popupGb)){
			result = jen1000DAO.updateJen1000JenkinsInfo(paramMap);
			
			if(result > 0) {
				
				String jenId = (String) paramMap.get("jenId");
				String empId = (String) paramMap.get("empId");
				
				
				whk1000Service.insertWhk1000SendData("02", "01", jenId, null, empId);
			}
			return result;
		}
		return null;
	}
	
	
	public void saveJen1000JobInfo(Map<String, String> paramMap)  throws Exception{
		int result = 0;
		String popupGb = (String)paramMap.get("popupGb");
		
		if("insert".equals(popupGb)){
			String jenId = (String) paramMap.get("jenId");
			String jobString = (String) paramMap.get("addJobList");
			
			
			String empId = (String) paramMap.get("empId");
			
			String currentJobId = "";
			try {
				JSONArray jobArr = new JSONArray(jobString);
				for(int i=0;i<jobArr.length();i++) {
					JSONObject jobObj = jobArr.getJSONObject(i);
					String jobId = jobObj.getString("jobId");
					
					
					currentJobId = jobId;
					paramMap.put("jobId", jobId);
					
					
					int jobCheck = jen1000DAO.selectJen1100JobUseCountInfo(paramMap);
					
					if(jobCheck > 0){
						throw new UserDefineException("[job_id="+jobId+"] 이미 추가된 JOB입니다.");
					}
					
					
					jen1000DAO.insertJen1100JobInfo(paramMap);
					
					
					whk1000Service.insertWhk1000SendData("02", "02", jenId, jobId, empId);
					
				}
			}
			catch(UserDefineException ude) {
				throw new UserDefineException(ude.getMessage());
			}
			catch(Exception e) {
				throw new UserDefineException("[job_id="+currentJobId+"] JOB 등록 중 오류가 발생했습니다.");
			}

		}else if("update".equals(popupGb)){
			result = jen1000DAO.updateJen1100JobInfo(paramMap);
			
			if(result > 0) {
				
				String jenId = (String) paramMap.get("jenId");
				String jobId = (String) paramMap.get("jobId");
				String empId = (String) paramMap.get("empId");
				
				
				whk1000Service.insertWhk1000SendData("02", "02", jenId, jobId, empId);
			}else {
				throw new UserDefineException("JOB 수정에 실패했습니다.");
			}
		}
	}
	
	
	@SuppressWarnings({"rawtypes"})
	public List<Map> selectJen1000JenkinsUserList(Map map) throws Exception{
		return jen1000DAO.selectJen1000JenkinsUserList(map);
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
	public void deleteJen1101CIList(Map paramMap) throws Exception {
		jen1000DAO.deleteJen1101CIList(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteJen1101CIJobInfo(Map paramMap) throws Exception {
		jen1000DAO.deleteJen1101CIJobInfo(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public String insertJen1101CIJobInfo(Map paramMap) throws Exception{
		return jen1000DAO.insertJen1101CIJobInfo(paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public int insertJen1000BldLog(Map paramMap) throws Exception{
		int rtnValue = -1;
		
		
		List jobList = (List)paramMap.get("list");

		String jenId= (String)paramMap.get("jenId");
		String jenUrl= (String)paramMap.get("jenUrl");
		String jenUsrId= (String)paramMap.get("jenUsrId");
		String jenUsrTok= (String)paramMap.get("jenUsrTok");
		
		
		if(jobList.size() == 1) {
			
			Map jobInfo = (Map) jobList.get(0);
			jenId= (String) jobInfo.get("jenId");
			jenUrl = (String) jobInfo.get("jenUrl");
			jenUsrId= (String) jobInfo.get("jenUsrId");
			jenUsrTok= (String) jobInfo.get("jenUsrTok");
		}
		
		
		String salt = EgovProperties.getProperty("Globals.lunaops.salt");
		
		
		jenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
		
		
		if(jenUsrTok == null || "".equals(jenUsrTok)){
			throw new UserDefineException(Jen1000Controller.JENKINS_FAIL);
		}
		
		
		JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, jenUsrTok);
		
		
		if(jenStatusVo.isErrorFlag()) {
			throw new UserDefineException(jenStatusVo.getErrorMsg());
		}
		
		
		JenkinsServer jenkins = jenStatusVo.getJenkins();
		
		
		int syncCnt = 0;
		
		
		for(int i=0;i<jobList.size();i++) {
			Map jobInfo = (Map) jobList.get(i);
			
			String jobId = (String) jobInfo.get("jobId");
			
			
			List<Build> builds = jenkins.getJob(jobId).getBuilds();
			
			
			
			Map newMap = new HashMap<>();
			newMap.put("jenId", jenId);
			newMap.put("jobId", jobId);
			
			
			for(int j=0;j<builds.size();j++) {
				Build build = builds.get(j);
				int bldNum = build.getNumber();
				
				
				newMap.put("bldNum", bldNum);
				
				
				int bldLogChk = jen1000DAO.selectJen1200JobBldLogCheck(newMap);
				
				
				if(bldLogChk > 0) {
					continue;
				}
				
				
				BuildWithDetails bwd = build.details();
				
				
				if(bwd.isBuilding()) {
					continue;
				}
				
				@SuppressWarnings("serial")
				Map<String, String> bldResultMap = new HashMap<String, String>() {{
				    put("BUILDING", "02");
				    put("SUCCESS", "03");
				    put("FAILURE", "04");
				    put("ABORTED", "05");
				    put("NOT_BUILT", "06");
				    put("UNSTABLE", "07");
				    put("UNKNOWN", "08");
				    put("CANCELLED", "09");
				    put("SYSTEM ERROR", "10");
				}};
				
				
				String bldResultCd = "08";
				
				if(bldResultMap.containsKey(bwd.getResult().name())) {
					bldResultCd = bldResultMap.get(bwd.getResult().name());
				}
				
				newMap.put("bldClass", bwd.get_class());
				newMap.put("bldResult", bwd.getResult().name());
				newMap.put("bldResultCd", bldResultCd);
				newMap.put("bldEtmDurationTm", bwd.getEstimatedDuration());
				newMap.put("bldDurationTm", bwd.getDuration());
				newMap.put("bldStartDtm", new Date(bwd.getTimestamp()));
				newMap.put("bldConsoleLog", bwd.getConsoleOutputHtml());
				newMap.put("regDtm", paramMap.get("regDtm"));
				
				
				List<BuildCause> bcList = bwd.getCauses();
				if(bcList != null && bcList.size() > 0) {
					newMap.put("bldCauses", bcList.get(0).getShortDescription());
				}
				
				
				jen1000DAO.insertJen1200JobBldLogInfo(newMap);
				
				
				BuildChangeSet bcs = bwd.getChangeSet();
				
				if(bcs != null) {
					List<BuildChangeSetItem> bcsiList = bcs.getItems();
					
					
					if(bcsiList != null && bcsiList.size() > 0) {
						for(int l=0;l<bcsiList.size();l++) {
							BuildChangeSetItem bcsInfo = bcsiList.get(l);
							
							
							Map changeItemMap = new HashMap<>();
							changeItemMap.put("jenId", jenId);
							changeItemMap.put("jobId", jobId);
							changeItemMap.put("bldNum", bldNum);
							changeItemMap.put("chgRevision", bcsInfo.getCommitId());
							changeItemMap.put("chgTimestamp", bcsInfo.getTimestamp());
							changeItemMap.put("chgDate", bcsInfo.getDate());
							changeItemMap.put("chgMsg", bcsInfo.getMsg());
							changeItemMap.put("chgUser", bcsInfo.getAuthor().getFullName());
							
							jen1000DAO.insertJen1201JobBldChangeLogInfo(changeItemMap);
							
							
							List<BuildChangeSetPath> bcspList = bcsInfo.getPaths();
							
							if(bcspList != null && bcspList.size() > 0) {
								for(int m=0;m<bcspList.size();m++) {
									BuildChangeSetPath bcsp = bcspList.get(m);
									
									
									Map changePathMap = new HashMap<>();
									changePathMap.put("jenId", jenId);
									changePathMap.put("jobId", jobId);
									changePathMap.put("bldNum", bldNum);
									changePathMap.put("chgRevision", bcsInfo.getCommitId());
									changePathMap.put("filePath", bcsp.getFile());
									changePathMap.put("editTypeCd", bcsp.getEditType());
									
									jen1000DAO.insertJen1202JobBldChangeFileLogInfo(changePathMap);
								}
							}
						}
					}
				}
				
				
				Map<String, String> buildParam = bwd.getParameters();
				if(!buildParam.isEmpty()) {
					Iterator itr = buildParam.keySet().iterator();
					while(itr.hasNext()) {
						String key = (String) itr.next();
						Map bldParamMap = new HashMap<>();
						bldParamMap.put("jenId", jenId);
						bldParamMap.put("jobId", jobId);
						bldParamMap.put("bldNum", bldNum);
						bldParamMap.put("jobParamKey", key);
						bldParamMap.put("jobParamVal", buildParam.get(key));
						
						
						jen1000DAO.insertJen1203JobBldParameterInfo(bldParamMap);
					}
				}
				
				syncCnt++;
			}
			
		}
		
		if(syncCnt > 0) {
			rtnValue = syncCnt;
		}

		
		newJenkinsClient.close(jenStatusVo);
		return rtnValue;
	}
	

	
	@SuppressWarnings("rawtypes")
	public Map selectJen1200JobLastBuildInfo(Map paramMap) throws Exception{
		return jen1000DAO.selectJen1200JobLastBuildInfo(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public String insertJen1201JobBldChangeLogInfo(Map paramMap) throws Exception{
		return jen1000DAO.insertJen1201JobBldChangeLogInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertJen1202JobBldChangeFileLogInfo(Map paramMap) throws Exception{
		return jen1000DAO.insertJen1202JobBldChangeFileLogInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertJen1203JobBldParameterInfo(Map paramMap) throws Exception{
		return jen1000DAO.insertJen1203JobBldParameterInfo(paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes" })
	public List<Map> selectJen1203JobBuildParamList(Map paramMap) throws Exception {
		return jen1000DAO.selectJen1203JobBuildParamList(paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes"})
	public Map selectJen1200JobBuildInfo(Map paramMap) throws Exception {
		return jen1000DAO.selectJen1200JobBuildInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public List<Map> selectJen1201JobLastBuildChgList(Map paramMap) throws Exception{
		return jen1000DAO.selectJen1201JobLastBuildChgList(paramMap);
	}

	
	
	@SuppressWarnings("rawtypes")
	public List<Map> selectJen1202JobLastBuildFileChgList(Map paramMap) throws Exception{
		return jen1000DAO.selectJen1202JobLastBuildFileChgList(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public List<Map> selectJen1200JobBuildList(Map paramMap) throws Exception {
		return jen1000DAO.selectJen1200JobBuildList(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public int selectJen1200JobBuildListCnt(Map paramMap) throws Exception {
		return jen1000DAO.selectJen1200JobBuildListCnt(paramMap);
	}

	
	public int selectJen1200DeployJobBuildLogCnt(BuildVO buildVo) throws Exception {
		return jen1000DAO.selectJen1200DeployJobBuildLogCnt(buildVo);
	}
	
	public String insertJen1200DeployJobBuildLogInfo(BuildVO buildVo) throws Exception {
		return jen1000DAO.insertJen1200DeployJobBuildLogInfo(buildVo);
	}

	
	public int updateJen1200DeployJobBuildLogInfo(BuildVO buildVo)  throws Exception{
		return jen1000DAO.updateJen1200DeployJobBuildLogInfo(buildVo);
	}
	
	@SuppressWarnings("rawtypes")
	public int selectJen1200JobBldLogCheck(Map paramMap) throws Exception {
		return jen1000DAO.selectJen1200JobBldLogCheck(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertJen1200JobBldLogInfo(Map paramMap) throws Exception{
		return jen1000DAO.insertJen1200JobBldLogInfo(paramMap);
	}
}
