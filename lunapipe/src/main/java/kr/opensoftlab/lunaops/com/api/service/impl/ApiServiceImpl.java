package kr.opensoftlab.lunaops.com.api.service.impl;

import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

import javax.annotation.Resource;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.kohsuke.github.GHRepository;
import org.springframework.stereotype.Service;
import org.tmatesoft.svn.core.SVNLock;
import org.tmatesoft.svn.core.io.SVNRepository;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.offbytwo.jenkins.JenkinsServer;
import com.offbytwo.jenkins.model.Build;
import com.offbytwo.jenkins.model.BuildCause;
import com.offbytwo.jenkins.model.BuildChangeSet;
import com.offbytwo.jenkins.model.BuildChangeSetItem;
import com.offbytwo.jenkins.model.BuildChangeSetPath;
import com.offbytwo.jenkins.model.BuildWithDetails;

import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.com.api.service.ApiService;
import kr.opensoftlab.lunaops.com.vo.OslErrorCode;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.Dpl1000Service;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.lunaops.lck.lck1000.lck1000.service.Lck1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.Rep1100Service;
import kr.opensoftlab.sdf.jenkins.NewJenkinsClient;
import kr.opensoftlab.sdf.jenkins.service.BuildService;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;
import kr.opensoftlab.sdf.jenkins.vo.JenStatusVO;
import kr.opensoftlab.sdf.rep.com.RepModule;
import kr.opensoftlab.sdf.rep.com.vo.RepDataVO;
import kr.opensoftlab.sdf.rep.com.vo.RepFileVO;
import kr.opensoftlab.sdf.rep.com.vo.RepLockVO;
import kr.opensoftlab.sdf.rep.com.vo.RepResultVO;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;
import kr.opensoftlab.sdf.util.CommonScrty;
import kr.opensoftlab.sdf.util.OslConnHttpClient;
import kr.opensoftlab.sdf.util.OslUtil;


@Service("apiService")
public class ApiServiceImpl  extends EgovAbstractServiceImpl implements ApiService{
	
	
	private static final Logger Log = Logger.getLogger(ApiServiceImpl.class);
	
	
	@Resource(name = "rep1000Service")
	protected Rep1000Service rep1000Service;
	
	
	@Resource(name = "rep1100Service")
	protected Rep1100Service rep1100Service;
	
	
	@Resource(name = "jen1000Service")
	protected Jen1000Service jen1000Service;
	
	
	@Resource(name = "dpl1000Service")
	protected Dpl1000Service dpl1000Service;
	
	
	@Resource(name = "lck1000Service")
	protected Lck1000Service lck1000Service;

	
	@Resource(name = "newJenkinsClient")
	private NewJenkinsClient newJenkinsClient;

	
	@Resource(name = "buildService")
	private BuildService buildService;
	
	
	@Resource(name = "repModule")
	private RepModule repModule;
	
	
	public Object checkParamDataKey(String paramData) throws Exception {
		
		String data = paramData;
		
		
		if(data == null) {
			return OslErrorCode.PARAM_DATA_NULL;
		}
		
		
		String salt = EgovProperties.getProperty("Globals.data.salt");
		
		
		String decryptedData;
		
		try {
			
			if(data.indexOf("%") != -1) {
				
				data = URLDecoder.decode(data,"UTF-8");
			}
			
			
			decryptedData = CommonScrty.decryptedAria(data, salt);
		}catch(ArithmeticException ae) {
			ae.printStackTrace();
			return OslErrorCode.DATA_DECODE_FAIL;
		}
		
		
		JSONObject jsonObj;
	    try {
	        jsonObj = new JSONObject(decryptedData);
	    } catch (JSONException je) {
	    	je.printStackTrace();
	    	return OslErrorCode.DATA_DECODE_FAIL;
	    }
		
		
		String dataKey = OslUtil.jsonGetString(jsonObj, "key");

		
		if(!salt.equals(dataKey)) {
			return OslErrorCode.AUTH_KEY_FAIL;
		}
		
		return jsonObj;
	}
	
	
	
    
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertCIRepJenJob(Map paramMap) throws Exception {
		
		Map rtnMap = new HashMap<>();
		
		
		int total = 0;
		
		int executed = 0;
		
		
		List<String> etcMsg = new ArrayList<String>();
		
		
		rtnMap.put("total", total);
		rtnMap.put("executed", executed);
		
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(checkParam instanceof String) {
			rtnMap.put("result", false);
			rtnMap.put("error_code", checkParam.toString());
			return rtnMap;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			
			
			if(ciId == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.PARAM_CI_ID_NULL);
				return rtnMap;
			}
			
			
			String repIds = OslUtil.jsonGetString(jsonObj, "rep_ids");
			
			
			String jenJobIds = OslUtil.jsonGetString(jsonObj, "jen_job_ids");
			
			
			boolean paramIsFlag = false;
			
			
			if(repIds != null) {
				
				paramIsFlag = true;
				
				try {
					
					JSONArray jsonArr = new JSONArray(repIds);

					
					if(jsonArr.length() > 0) {
						Map newMap = new HashMap<>();
						newMap.put("ciId", ciId);
						
						
						rep1000Service.deleteRep1001CIRepInfo(newMap);
						
						
						total += jsonArr.length();
						
						for(int i=0;i<jsonArr.length();i++) {
							try {
								newMap = new HashMap<>();
								
								newMap.put("regUsrId", paramMap.get("regUsrId"));
								newMap.put("regUsrIp", paramMap.get("regUsrIp"));
								
								JSONObject inJsonObj = jsonArr.getJSONObject(i);
								
								
								String repId = OslUtil.jsonGetString(inJsonObj, "rep_id");
								
								
								if(repId == null) {
									rtnMap.put("result", false);
									rtnMap.put("error_code", OslErrorCode.CI_REP_PARAM_PARSE_FAIL);
									etcMsg.add("파라미터 값에 소스저장소 REP_ID가 없음");
									continue;
								}
								
								
								newMap.put("ciId", ciId);
								newMap.put("repId", repId);
								
								
								RepVO repInfo = rep1000Service.selectRep1000Info(newMap);
								
								
								if(repInfo == null) {
									rtnMap.put("result", false);
									rtnMap.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
									etcMsg.add("소스저장소 {REP_ID="+repId+"}에 대한 정보 없음");
									continue;
								}
										
								rep1000Service.insertRep1001CIRepInfo(newMap);
								
								
								executed++;
							} catch(Exception e) {
								
								continue;
							}
						}
					}
				}catch(JSONException je) {
					rtnMap.put("result", false);
					rtnMap.put("error_code", OslErrorCode.CI_REP_PARAM_PARSE_FAIL);
					return rtnMap;
				}
			}
			
			
			if(jenJobIds != null) {
				
				paramIsFlag = true;
				try {
					
					JSONArray jsonArr = new JSONArray(jenJobIds);
					
					
					if(jsonArr.length() > 0) {
						
						total += jsonArr.length();
						
						Map newMap = new HashMap<>();
						newMap.put("ciId", ciId);
						
						
						jen1000Service.deleteJen1101CIList(newMap);
						
						for(int i=0;i<jsonArr.length();i++) {
							try {
								newMap = new HashMap<>();
								
								newMap.put("regUsrId", paramMap.get("regUsrId"));
								newMap.put("regUsrIp", paramMap.get("regUsrIp"));
								
								JSONObject inJsonObj = jsonArr.getJSONObject(i);
								
								
								String jenId = OslUtil.jsonGetString(inJsonObj, "jen_id");
								
								
								String jobId = OslUtil.jsonGetString(inJsonObj, "job_id");
								
								
								if(jenId == null || jobId == null) {
									rtnMap.put("result", false);
									rtnMap.put("error_code", OslErrorCode.CI_REP_PARAM_PARSE_FAIL);
									return rtnMap;
								}
								
								
								newMap.put("jenId", jenId);
								newMap.put("jobId", jobId);

								
								Map jobInfo = jen1000Service.selectJen1100JobInfo(newMap);
								
								newMap.put("ciId", ciId);
								
								
								if(jobInfo == null) {
									rtnMap.put("result", false);
									rtnMap.put("error_code", OslErrorCode.JEN_JOB_ID_INFO_NULL);
									etcMsg.add("JENKINS&JOB {JEN_ID="+jenId+", JOB_ID="+jobId+"}에 대한 정보 없음");
									continue;
								}
								
								jen1000Service.insertJen1101CIJobInfo(newMap);
								
								
								String jobParamListStr = OslUtil.jsonGetString(inJsonObj, "job_param_list");
								if(jobParamListStr != null) {
									
									JSONArray jobParamList = new JSONArray(jobParamListStr);
									
									for(int j=0;j<jobParamList.length();j++) {
										JSONObject jobParamInfo =  jobParamList.getJSONObject(j);
										
										String jobParamKey = OslUtil.jsonGetString(jobParamInfo, "job_param_key");
										String jobParamVal = OslUtil.jsonGetString(jobParamInfo, "job_param_val");
										
										newMap.put("jobParamKey", jobParamKey);
										newMap.put("jobParamVal", jobParamVal);
										
										
										jen1000Service.insertJen1102ParameterInfo(newMap);
									}
									
								}
								
								executed++;
							}catch(Exception e) {
								continue;
							}
						}
					}
				}catch(JSONException je) {
					rtnMap.put("result", false);
					rtnMap.put("error_code", OslErrorCode.CI_REP_PARAM_PARSE_FAIL);
					return rtnMap;
				}
			}
			
			
			if(!paramIsFlag) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.CI_DATA_NULL);
				return rtnMap;
			}
		}
		
		rtnMap.put("result", true);
		rtnMap.put("total", total);
		rtnMap.put("executed", executed);
		rtnMap.put("etcMsg", etcMsg);
		return rtnMap;
    }
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map selectCIRepJenJob(Map paramMap) throws Exception {
		Map rtnValue = new HashMap<>();
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(!(checkParam instanceof String)) {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			
			
			if(ciId == null) {
				rtnValue.put("result", false);
				rtnValue.put("errorCode", OslErrorCode.PARAM_CI_ID_NULL);
				return rtnValue;
			}
			
			paramMap.put("ciId", ciId);
			
			
			List<Map> ciRepList = rep1000Service.selectRep1001CIRepList(paramMap);
			
			
			List<Map> ciJenJobList = jen1000Service.selectJen1101CIJobList(paramMap);
			
			
			List<Map> ciJenJobParamList = jen1000Service.selectJen1102CIJobParamList(paramMap);
			
			
			Map<String, List> paramKeyMap = new HashMap<String, List>();
			
			
			for(Map ciJenJobParamInfo : ciJenJobParamList) {
				
				String jenId = (String) ciJenJobParamInfo.get("jen_id");
				String jobId = (String) ciJenJobParamInfo.get("job_id");
				
				
				String paramKey = jenId+"_"+jobId;
				
				
				if(!paramKeyMap.containsKey(paramKey)) {
					paramKeyMap.put(paramKey, new ArrayList<Map>());
				}
				
				
				List paramList = paramKeyMap.get(paramKey);
				paramList.add(ciJenJobParamInfo);
			}
			
			
			for(Map ciJenJobInfo : ciJenJobList) {
				
				String jenId = (String) ciJenJobInfo.get("jen_id");
				String jobId = (String) ciJenJobInfo.get("job_id");
				
				
				String paramKey = jenId+"_"+jobId;
				
				
				if(paramKeyMap.containsKey(paramKey)) {
					ciJenJobInfo.put("job_param_list", paramKeyMap.get(paramKey));
				}
			}
			
			rtnValue.put("result", true);
			
			
			rtnValue.put("rep_ids", ciRepList);
			rtnValue.put("jen_job_ids", ciJenJobList);
		}else {
			rtnValue.put("result", false);
			rtnValue.put("error_code", checkParam.toString());
			return rtnValue;
		}
		return rtnValue;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map selectTicketJobInfo(Map paramMap) throws Exception {
		Map rtnValue = new HashMap<>();
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(!(checkParam instanceof String)) {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			String dplId = OslUtil.jsonGetString(jsonObj, "dpl_id");
			
			
			if(ciId == null) {
				rtnValue.put("result", false);
				rtnValue.put("errorCode", OslErrorCode.PARAM_CI_ID_NULL);
				return rtnValue;
			}
			if(ticketId == null) {
				rtnValue.put("result", false);
				rtnValue.put("errorCode", OslErrorCode.PARAM_TICKET_ID_NULL);
				return rtnValue;
			}
			if(dplId == null) {
				rtnValue.put("result", false);
				rtnValue.put("errorCode", OslErrorCode.PARAM_DPL_ID_NULL);
				return rtnValue;
			}
			
			paramMap.put("ciId", ciId);
			paramMap.put("ticketId", ticketId);
			paramMap.put("dplId", dplId);
			
			
			List dplJobList = dpl1000Service.selectExternalDpl1100DeployJobList(paramMap);
			
			
			rtnValue.put("result", true);
			
			
			rtnValue.put("dplJobList", dplJobList);
		}else {
			rtnValue.put("result", false);
			rtnValue.put("error_code", checkParam.toString());
			return rtnValue;
		}
		return rtnValue;
	}
	
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertCITicketJobList(Map paramMap) throws Exception {
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		Map rtnMap = new HashMap<String, String>();
		
		
		int total = 0;
		
		int executed = 0;
		
		
		rtnMap.put("total", total);
		rtnMap.put("executed", executed);
				
		String newDplId;
		
		if(checkParam instanceof String) {
			rtnMap.put("result", false);
			rtnMap.put("error_code", checkParam.toString());
			return rtnMap;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			
			
			if(ciId == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.PARAM_CI_ID_NULL);
				return rtnMap;
			}
			
			
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			
			if(ticketId == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
				return rtnMap;
			}
			
			
			rtnMap.put("ticketId", ticketId);
			
			
			String jenJobIds = OslUtil.jsonGetString(jsonObj, "jen_job_ids");
			
			
			Map newMap = new HashMap<>();
			newMap.put("ciId", ciId);
			newMap.put("ticketId", ticketId);
			
			
			newMap.put("dplNm", "temp");
			
			newMap.put("dplVer", "v1.0");
			
			
			
			
			
			
			
			newMap.put("dplStsCd", "01");
			
			newMap.put("dplTypeCd", "02");
			
			newMap.put("dplAutoAfterCd", "01");
			
			
			newDplId = dpl1000Service.insertDpl1000DeployVerInfo(newMap);
			
			
			boolean paramIsFlag = false;
			
			try {
				
				JSONArray jsonArr = new JSONArray(jenJobIds);
				
				
				total += jsonArr.length();
				
				for(int i=0;i<jsonArr.length();i++) {
					try {
						newMap = new HashMap<>();
						
						newMap.put("ciId", ciId);
						newMap.put("ticketId", ticketId);
						newMap.put("dplId", newDplId);
						
						
						newMap.put("regUsrId", paramMap.get("regUsrId"));
						newMap.put("regUsrIp", paramMap.get("regUsrIp"));
						
						JSONObject inJsonObj = jsonArr.getJSONObject(i);
						
						
						String jenId = OslUtil.jsonGetString(inJsonObj, "jen_id");
						
						
						String jobId = OslUtil.jsonGetString(inJsonObj, "job_id");
						
						
						String jobStartOrd = OslUtil.jsonGetString(inJsonObj, "job_start_ord");
						
						
						if(jenId == null || jobId == null) {
							rtnMap.put("result", false);
							rtnMap.put("error_code", OslErrorCode.CI_JOB_PARAM_PARSE_FAIL);
							continue;
						}
						
						
						newMap.put("jenId", jenId);
						newMap.put("jobId", jobId);
						newMap.put("jobStartOrd", jobStartOrd);
						
						
						dpl1000Service.insertDpl1100DeployJobInfo(newMap);
						
						
						String jobParamListStr = OslUtil.jsonGetString(inJsonObj, "job_param_list");
						
						if(jobParamListStr != null) {
							
							JSONArray jobParamJsonList = new JSONArray(jobParamListStr);
							
							if(jobParamJsonList.length() > 0) {
								
								for(int j=0;j<jobParamJsonList.length();j++) {
									
									JSONObject jobParamInfo =  jobParamJsonList.getJSONObject(j);
									
									
									String jobParamKey = OslUtil.jsonGetString(jobParamInfo, "job_param_key");
									
									
									String jobParamVal = OslUtil.jsonGetString(jobParamInfo, "job_param_val");
									
									
									newMap.put("jobParamKey", jobParamKey);
									newMap.put("jobParamVal", jobParamVal);
									
									dpl1000Service.insertDpl1101ParameterInfo(newMap);
								}
							}
						}
						
						paramIsFlag = true;
						
						
						executed++;
					}catch(Exception e) {
						e.printStackTrace();
						continue;
					}
				}
				
			}catch(JSONException je) {
				je.printStackTrace();
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.CI_JOB_PARAM_PARSE_FAIL);
				return rtnMap;
			}
			
			
			if(!paramIsFlag) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.CI_DATA_NULL);
				return rtnMap;
			}
		}
		rtnMap.put("result", true);
		rtnMap.put("newDplId", newDplId);
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertJobBldLogInfo(Map paramMap) throws Exception {
		
		String data = (String) paramMap.get("data");
				
		
		Object checkParam = checkParamDataKey(data);
		
		Map rtnMap = new HashMap<String, String>();
		
		if(checkParam instanceof String) {
			rtnMap.put("result", false);
			rtnMap.put("error_code", checkParam.toString());
			return rtnMap;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String paramJobKey = OslUtil.jsonGetString(jsonObj, "jobKey");
			
			
			if(paramJobKey == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.JEN_JOB_ID_INFO_NULL);
				return rtnMap;
			}
			
			
			String paramBldNum = OslUtil.jsonGetString(jsonObj, "bldNum");
			
			
			if(paramBldNum == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.BLD_NUM_NULL);
				return rtnMap;
			}
			
			
			if(paramJobKey.indexOf("%") != -1) {
				
				paramJobKey = URLDecoder.decode(paramJobKey,"utf-8");
			}
			
			
			String salt = EgovProperties.getProperty("Globals.data.salt");
			
			String addSalt = EgovProperties.getProperty("Globals.data.addSalt");
			
			
			String deJobKey = CommonScrty.decryptedAria(paramJobKey, salt);
			
			
			String[] deJobKeys = deJobKey.split(Pattern.quote(addSalt));

			
			String jenId = CommonScrty.decryptedAria(deJobKeys[0],salt);
			
			
			String jobId = CommonScrty.decryptedAria(deJobKeys[1],salt);
			
			Map newMap = new HashMap<>();
			newMap.put("jenId", jenId);
			newMap.put("jobId", jobId);
			
			
			Map jobInfo = jen1000Service.selectJen1100JobInfo(newMap);
			
			if(jobInfo == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.JEN_JOB_ID_INFO_NULL);
				return rtnMap;
			}
			
			String jenUsrId = (String) jobInfo.get("jenUsrId");
			String jenUsrTok = (String) jobInfo.get("jenUsrTok");
			String jenUrl = (String) jobInfo.get("jenUrl");
			
			
			String pwSalt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			jenUsrTok = CommonScrty.decryptedAria(jenUsrTok, pwSalt);
			
			
			if(jenUsrTok == null || "".equals(jenUsrTok)){
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.DATA_DECODE_FAIL);
				return rtnMap;
			}
			
			
			JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, jenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.JENKINS_CONN_FAIL);
				return rtnMap;
			}
			
			
			JenkinsServer jenkins = jenStatusVo.getJenkins();
			
			
			int bldNum = Integer.parseInt(paramBldNum);
			
			
			newMap.put("bldNum", bldNum);
			
			
			int bldLogChk = jen1000Service.selectJen1200JobBldLogCheck(newMap);
			
			
			if(bldLogChk > 0) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.SERVER_ERROR);
				return rtnMap;
			}

			
			Build build = jenkins.getJob(jobId).getBuildByNumber(bldNum);
			
			
			BuildWithDetails bwd = build.details();
			
			
			if(bwd.isBuilding()) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.JOB_DUPLE_ACTION);
				return rtnMap;
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
			
			
			jen1000Service.insertJen1200JobBldLogInfo(newMap);
			
			
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
						
						jen1000Service.insertJen1201JobBldChangeLogInfo(changeItemMap);
						
						
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
								
								jen1000Service.insertJen1202JobBldChangeFileLogInfo(changePathMap);
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
					
					
					jen1000Service.insertJen1203JobBldParameterInfo(bldParamMap);
				}
			}
			
			rtnMap.put("result", true);
		}
		
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertJobBldAction(Map paramMap) throws Exception {
		
		Map rtnValue = new HashMap<>();
				
		
		String data = (String) paramMap.get("data");
				
		
		Object checkParam = checkParamDataKey(data);
		
		Map rtnMap = new HashMap<String, String>();
		
		if(checkParam instanceof String) {
			rtnMap.put("result", false);
			rtnMap.put("error_code", checkParam.toString());
			return rtnMap;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String jobKey = OslUtil.jsonGetString(jsonObj, "job_Key");
			
			
			if(jobKey == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.JEN_JOB_ID_INFO_NULL);
				return rtnMap;
			}
			
			
			String rv = OslUtil.jsonGetString(jsonObj, "rv");
			
			
			if(rv == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.REP_REVISION_PARAM_NULL);
				return rtnMap;
			}
			
			
			JenStatusVO jenStatusVo = null;
			
			try {
				
				String salt = EgovProperties.getProperty("Globals.lunaops.salt");
				
				String dataSalt = EgovProperties.getProperty("Globals.data.salt");
				
				String addSalt = EgovProperties.getProperty("Globals.data.addSalt");
				
				
				if(jobKey.indexOf("%") != -1) {
					jobKey = URLDecoder.decode(jobKey, "UTF-8");
				}
				
				
				String deJobKey = CommonScrty.decryptedAria(jobKey, dataSalt);
				
				
				String[] deJobKeys = deJobKey.split(Pattern.quote(addSalt));
				
				
				String jenId = CommonScrty.decryptedAria(deJobKeys[0],dataSalt);
				
				
				String jobId = CommonScrty.decryptedAria(deJobKeys[1],dataSalt);
				
				Map newMap = new HashMap<>();
				newMap.put("jenId", jenId);
				newMap.put("jobId", jobId);
				
				
				Map jobDbInfo = jen1000Service.selectJen1100JobInfo(newMap);
				
				
				if(jobDbInfo == null) {
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.JOB_ID_INFO_NULL);
					return rtnValue;
				}
				
				
				String jenUrl= (String)jobDbInfo.get("jenUrl");
				String jenUsrId= (String)jobDbInfo.get("jenUsrId");
				String jenUsrTok= (String)jobDbInfo.get("jenUsrTok");
				String dplTypeCd= (String)paramMap.get("dplTypeCd");
				
				
				String deJenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
				
				
				jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, deJenUsrTok);
				
				
				if(jenStatusVo.isErrorFlag()) {
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.JENKINS_CONN_FAIL);
					return rtnValue;
				}
				
				
				Map jobInfo = newJenkinsClient.getJobInfo(jenStatusVo, jobId);
				
				
				if(jobInfo == null) {
					newJenkinsClient.close(jenStatusVo);
					
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.JOB_ID_INFO_NULL);
					return rtnValue;
				}
				
				
				boolean isStartBuildable = (boolean) jobInfo.get("isStartBuildable");
				
				
				if(!isStartBuildable) {
					newJenkinsClient.close(jenStatusVo);
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.JOB_DUPLE_ACTION);
					return rtnValue;
				}
				
				
				
				
				
				
				
				
				
				BuildVO buildVo = new BuildVO();
				buildVo.setJenId(jenId);
				buildVo.setJenUrl(jenUrl);
				buildVo.setUserId(jenUsrId);
				buildVo.setDeTokenId(deJenUsrTok);
				buildVo.setJobId(jobId);
				buildVo.setDplTypeCd(dplTypeCd);
				buildVo.setJenStatusVo(jenStatusVo);
				
				
				
				buildVo.addBldActionLog(jobId+" JOB 빌드를 준비 중입니다.");
				
				
				BuildVO rtnBuildVo = buildService.insertJobBuildAction(buildVo);
				
				rtnValue.put("result", true);
				rtnValue.put("bldNum", rtnBuildVo.getBldNum());
				rtnValue.put("bldActionLog", rtnBuildVo.getBldActionLog());
				rtnValue.put("bldResult", rtnBuildVo.getBldResult());
				
			}catch(Exception e) {
				Log.error("insertJobBldAction()", e);
				rtnValue.put("result", false);
				rtnValue.put("error_code", OslErrorCode.SERVER_ERROR);
				return rtnValue;
			}
		}
		
		return rtnValue;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRepTicketBranchInfo(Map paramMap) throws Exception {
		Map rtnValue = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(!(checkParam instanceof String)) {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			
			if(ticketId == null) {
				rtnValue.put("result", false);
				rtnValue.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
				return rtnValue;
			}
			
			
			String repId = OslUtil.jsonGetString(jsonObj, "rep_id");
			
			
			if(repId == null) {
				rtnValue.put("result", false);
				rtnValue.put("error_code", OslErrorCode.PARAM_REP_ID_NULL);
				return rtnValue;
			}
			paramMap.put("repId", repId);
			
			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			String branchePath = repVo.getSvnBrcPath();
			
			
			String branchNm = EgovProperties.getProperty("Globals.svn.branchNm");
			String folderNm = branchNm+"_"+ticketId;
			
			
			rtnValue = repModule.createFolderInfo(repVo, folderNm, branchePath);
			
			
			rtnValue.put("repId", repId);
			rtnValue.put("ticketId", ticketId);
			
			return rtnValue;
			
		}else {
			rtnValue.put("result", false);
			rtnValue.put("error_code", OslErrorCode.DATA_DECODE_FAIL);
			return rtnValue;
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRepRevisionInfo(Map paramMap) throws Exception {
		Map rtnValue = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");

		
		
		
		
		Object checkParam = checkParamDataKey(data);

		
		String eGeneUrl = EgovProperties.getProperty("Globals.eGene.url");
		
		
		if(eGeneUrl.lastIndexOf("/") != (eGeneUrl.length()-1)) {
			
			eGeneUrl = eGeneUrl + "/";
		}
		
		
		if(!(checkParam instanceof String)) {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String repUuid = OslUtil.jsonGetString(jsonObj, "repUuid");
			
			
			String paramRv = (String) OslUtil.jsonGetString(jsonObj, "rv");
			
			try {
				
				if(repUuid == null) {
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.REP_UUID_PARAM_NULL);
					return rtnValue;
				}
				if(paramRv == null) {
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.REP_REVISION_PARAM_NULL);
					return rtnValue;
				}
				
				long rv = Long.parseLong(paramRv);
				
				paramMap.put("repUuid", repUuid);
				
				
				RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
				
				
				RepResultVO repResultVO = repModule.repAuthCheck(repVo);
				boolean repAuthCheck = repResultVO.isReturnValue();
				
				if(!repAuthCheck) {
					
					rtnValue.put("result", false);
					
					String resultCode = repResultVO.getResultCode();
					rtnValue.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
					
					
					if(resultCode.equals(repResultVO.USER_AUTH_CHECK_FAIL)) {
						rtnValue.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.");
					}
					
					else if(resultCode.equals(repResultVO.REPOSITORY_NOT_ACCESS)) {
						rtnValue.put("etcMsg", repResultVO.getResultMsg()+"</br>입력된 값을 확인해주세요.</br>");
					}
					else {
						rtnValue.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.</br>"+repResultVO.getResultMsg());
					}
					return rtnValue;
				}
				
				
				List<RepDataVO> rvInfoList = repModule.selectRepLogList(repResultVO, rv, rv, new String[] {"/"});
				
				
				if(rvInfoList == null || rvInfoList.size() == 0) {
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
					return rtnValue;
				}
				
				
				RepDataVO rvInfo = rvInfoList.get(0);
				
				
				
				List<RepFileVO> chgFileList = rvInfo.getRepFileList();
				
				
				int chgFileCnt = 0;
				if(chgFileList != null) {
					chgFileCnt = chgFileList.size();
				}
				
				
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
				
				
				String author = rvInfo.getAuthor();
				
				
				Map newMap = new HashMap<>();
				newMap.put("repId", repVo.getRepId());
				newMap.put("repRv", rvInfo.getRevision());
				newMap.put("repRvn", rvInfo.getRevisionNum());
				newMap.put("repComment", rvInfo.getComment());
				newMap.put("repCmtDate", sdf.format(rvInfo.getLogDate()));
				newMap.put("repCmtAuthor", author);
				newMap.put("repChgFileCnt", chgFileCnt);
				
				
				
				newMap.put("repRvTypeCd", "01");
				
				
				if(rvInfo.getComment() != null) {
					String[] comments = rvInfo.getComment().split("\n");
					String ticketId = comments[0].trim();
					
					
					if(ticketId.indexOf("[insert_data_no-flag]") != -1) {
						
						rtnValue.put("result", true);
						return rtnValue;
					}
					
					 
					
					
					newMap.put("ticketId", ticketId);
					
					
					Map dbRvInfo = rep1100Service.selectRep1100RvInfo(newMap);
					
					
					if(dbRvInfo == null) {
						rep1100Service.insertRep1100RvInfo(newMap);
					}else {
						
						rep1100Service.updateRep1100RvInfo(newMap);
						
						
						rep1100Service.deleteRep1101RvChgList(newMap);
					}
					
					
					if(chgFileCnt > 0) {
						
						for(RepFileVO chgFileInfo : chgFileList) {
							try {
								
								String path = chgFileInfo.getPath();
								
								String fileNm = path.substring(path.lastIndexOf("/")+1, path.length());
								
								
								char type = chgFileInfo.getType();
								

								String typeName = "";
								if( 'A'==type ) {
									typeName = "01";
								}else if( 'M'==type ) {
									typeName = "02";
								}else if( 'D'==type ) {
									typeName = "03";
								}else {
									typeName = "02";
								}

								newMap = new HashMap<>();
								newMap.put("repId", repVo.getRepId());
								newMap.put("ticketId", ticketId);
								newMap.put("repRv", rvInfo.getRevision());
								newMap.put("repRvn", rvInfo.getRevisionNum());
								newMap.put("repChgTypeCd", typeName);
								newMap.put("repChgFilePath", path);
								newMap.put("repChgFileNm", fileNm);
								newMap.put("repChgFileKind", chgFileInfo.getKind());
								newMap.put("repTargetRv", "-1");
								
								
								rep1100Service.insertRep1101RvChgInfo(newMap);
							}
							catch(Exception e) {
								Log.debug(e);
								continue;
							}
						}
					}
				}else {
					
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
					return rtnValue;
				}
				
				rtnValue.put("rvInfoList", rvInfoList);
				
			}catch(Exception e) {
				e.printStackTrace();
				rtnValue.put("result", false);
				rtnValue.put("error_code", OslErrorCode.SERVER_ERROR);
				return rtnValue;
			}
		}else {
			rtnValue.put("result", false);
			rtnValue.put("error_code", OslErrorCode.DATA_DECODE_FAIL);
			return rtnValue;
		}
		
		
		rtnValue.put("result", true);
		return rtnValue;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map selectTicketRvDataList(Map paramMap) throws Exception {
		Map rtnValue = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(!(checkParam instanceof String)) {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			
			if(ticketId == null) {
				rtnValue.put("result", false);
				rtnValue.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
				return rtnValue;
			}
			
			
			paramMap.put("ticketId", ticketId);
			
			
			List<Map> ticketRvList = rep1100Service.selectRep1100RvList(paramMap);

			if(ticketRvList != null && ticketRvList.size() > 0) {
				Map newMap = null;
				
				for(Map ticketRvInfo : ticketRvList) {
					newMap = new HashMap<>();
					
					
					String repId = (String)ticketRvInfo.get("rep_id");
					String repRv = String.valueOf(ticketRvInfo.get("rep_rv"));
					
					
					newMap.put("ticketId", ticketId);
					newMap.put("repId", repId);
					newMap.put("repRv", repRv);
					
					List<Map> ticketRvChgList = rep1100Service.selectRep1101RvChgFileList(newMap);
					
					
					ticketRvInfo.put("rep_chg_file_list", ticketRvChgList);
				}
			}
			rtnValue.put("result", true);
			rtnValue.put("ticketRvList", ticketRvList);
			
			return rtnValue;
			
		}else {
			rtnValue.put("result", false);
			rtnValue.put("error_code", OslErrorCode.DATA_DECODE_FAIL);
			return rtnValue;
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map selectTicketDplFileDataList(Map paramMap) throws Exception {
		Map rtnMap = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(!(checkParam instanceof String)) {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			
			if(ticketId == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
				return rtnMap;
			}
			
			
			paramMap.put("ticketId", ticketId);
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			if(ciId != null) {
				
				
				String repId = OslUtil.jsonGetString(jsonObj, "rep_id");
				if(repId != null) {
					
					paramMap.put("ciId", ciId);
					paramMap.put("repId", repId);
				}
			}
			
			
			paramMap.put("repChgSelCd", "01");
			
			
			List<Map> ticketDplSelFileList = rep1100Service.selectRep1102DplChgFileList(paramMap);
			
			rtnMap.put("result", true);
			rtnMap.put("ticketDplSelFileList", ticketDplSelFileList);
			
			return rtnMap;
			
		}else {
			rtnMap.put("result", false);
			rtnMap.put("error_code", OslErrorCode.DATA_DECODE_FAIL);
			return rtnMap;
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map selectTicketCheck(Map paramMap) throws Exception {
		Map rtnValue = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");
		
		
		String eGeneUrl = EgovProperties.getProperty("Globals.eGene.url");
		
		
		if(eGeneUrl.lastIndexOf("/") != (eGeneUrl.length()-1)) {
			
			eGeneUrl = eGeneUrl + "/";
		}
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(checkParam instanceof String) {
			
			rtnValue.put("result", false);
			rtnValue.put("error_code", OslErrorCode.DATA_DECODE_FAIL);
			return rtnValue;
		}else {
			try {
				
				JSONObject jsonObj = (JSONObject) checkParam;
				
				
				String ent_id = OslUtil.jsonGetString(jsonObj, "ent_id");
				
				
				String repUuid = OslUtil.jsonGetString(jsonObj, ent_id.toLowerCase()+"_svn_url");
				
				
				paramMap.put("repUuid", repUuid);
				
				
				RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
				
				
				String repId = repVo.getRepId();
				jsonObj.put(ent_id.toLowerCase()+"_svn_url", repId);
				
				
				String salt = EgovProperties.getProperty("Globals.data.salt");
				
				
				data = URLEncoder.encode(CommonScrty.encryptedAria(jsonObj.toString(), salt),"UTF-8");
				
				Log.debug("#### 요청 파라미터 복호화 값: "+jsonObj.toString());
			}catch(Exception e) {
				e.printStackTrace();
				
				rtnValue.put("result", false);
				rtnValue.put("error_code", OslErrorCode.UUID_TO_REP_ID_FAIL);
				return rtnValue;
			}

			
			HttpGet methodGet = new HttpGet();
			URI uri = new URI(eGeneUrl+"plugins/jsp/isTicket.jsp?data="+URLEncoder.encode(data,"UTF-8"));
			methodGet.setURI(uri);
			
			Log.debug("#### 티켓 검증 요청");
			Log.debug(eGeneUrl+"plugins/jsp/isTicket.jsp?data="+URLEncoder.encode(data,"UTF-8"));
			
			HttpClient client = OslConnHttpClient.getHttpClient();
			
			
			HttpResponse responseResult = client.execute(methodGet);
			
			
			if(responseResult.getStatusLine() != null && responseResult.getStatusLine().getStatusCode() == 200) {
				
	    		String returnContent = EntityUtils.toString(responseResult.getEntity());
	    		returnContent = returnContent.replaceAll("\\s", "");
	    		
	    		Log.debug("#### 티켓 검증 결과 값: "+returnContent);
	    		
	    		if(!"true".equals(returnContent)) {
	    			
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.IS_TICKET_FAIL);
	    		}else {
	    			rtnValue.put("result", true);
	    		}
			}else {
				
				rtnValue.put("result", false);
				rtnValue.put("error_code", OslErrorCode.DATA_CHECK_FAIL);
			}
		}
		
		return rtnValue;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map deleteCIRepJenJob(Map paramMap) throws Exception {
		
		Map rtnMap = new HashMap<>();
		
		
		int total = 0;
		
		int executed = 0;
		
		
		List<String> etcMsg = new ArrayList<String>();
		
		
		rtnMap.put("total", total);
		rtnMap.put("executed", executed);
		
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(checkParam instanceof String) {
			rtnMap.put("result", false);
			rtnMap.put("error_code", checkParam.toString());
			return rtnMap;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			
			
			if(ciId == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.PARAM_CI_ID_NULL);
				return rtnMap;
			}
			
			
			String repIds = OslUtil.jsonGetString(jsonObj, "rep_ids");
			
			
			String jenJobIds = OslUtil.jsonGetString(jsonObj, "jen_job_ids");
			
			
			boolean paramIsFlag = false;
			
			
			if(repIds != null) {
				
				paramIsFlag = true;
				
				try {
					
					JSONArray jsonArr = new JSONArray(repIds);

					
					if(jsonArr.length() > 0) {
						Map newMap = new HashMap<>();
						newMap.put("ciId", ciId);
						
						
						total += jsonArr.length();
						
						for(int i=0;i<jsonArr.length();i++) {
							try {
								newMap = new HashMap<>();
								
								newMap.put("regUsrId", paramMap.get("regUsrId"));
								newMap.put("regUsrIp", paramMap.get("regUsrIp"));
								
								JSONObject inJsonObj = jsonArr.getJSONObject(i);
								
								
								String repId = OslUtil.jsonGetString(inJsonObj, "rep_id");
								
								
								if(repId == null) {
									rtnMap.put("result", false);
									rtnMap.put("error_code", OslErrorCode.CI_REP_PARAM_PARSE_FAIL);
									etcMsg.add("파라미터 값에 소스저장소 REP_ID가 없음");
									continue;
								}
								
								
								newMap.put("ciId", ciId);
								newMap.put("repId", repId);
								
								
								RepVO repInfo = rep1000Service.selectRep1000Info(newMap);
								
								
								if(repInfo == null) {
									rtnMap.put("result", false);
									rtnMap.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
									etcMsg.add("소스저장소 {REP_ID="+repId+"}에 대한 정보 없음");
									continue;
								}
								
								
								rep1000Service.deleteRep1001CIRepInfo(newMap);
								
								
								executed++;
							} catch(Exception e) {
								
								continue;
							}
						}
					}
				}catch(JSONException je) {
					rtnMap.put("result", false);
					rtnMap.put("error_code", OslErrorCode.CI_REP_PARAM_PARSE_FAIL);
					return rtnMap;
				}
			}
			
			
			if(jenJobIds != null) {
				
				paramIsFlag = true;
				try {
					
					JSONArray jsonArr = new JSONArray(jenJobIds);
					
					
					if(jsonArr.length() > 0) {
						
						total += jsonArr.length();
						
						Map newMap = new HashMap<>();
						newMap.put("ciId", ciId);
						
						for(int i=0;i<jsonArr.length();i++) {
							try {
								newMap = new HashMap<>();
								
								newMap.put("regUsrId", paramMap.get("regUsrId"));
								newMap.put("regUsrIp", paramMap.get("regUsrIp"));
								
								JSONObject inJsonObj = jsonArr.getJSONObject(i);
								
								
								String jenId = OslUtil.jsonGetString(inJsonObj, "jen_id");
								
								
								String jobId = OslUtil.jsonGetString(inJsonObj, "job_id");
								
								
								if(jenId == null || jobId == null) {
									rtnMap.put("result", false);
									rtnMap.put("error_code", OslErrorCode.CI_REP_PARAM_PARSE_FAIL);
									return rtnMap;
								}
								
								
								newMap.put("jenId", jenId);
								newMap.put("jobId", jobId);

								
								Map jobInfo = jen1000Service.selectJen1100JobInfo(newMap);
								
								newMap.put("ciId", ciId);
								
								
								if(jobInfo == null) {
									rtnMap.put("result", false);
									rtnMap.put("error_code", OslErrorCode.JEN_JOB_ID_INFO_NULL);
									etcMsg.add("JENKINS&JOB {JEN_ID="+jenId+", JOB_ID="+jobId+"}에 대한 정보 없음");
									continue;
								}
								
								
								jen1000Service.deleteJen1101CIJobInfo(newMap);
								
								
								jen1000Service.deleteJen1102ParameterInfo(newMap);
								
								
								executed++;
							}catch(Exception e) {
								continue;
							}
						}
					}
				}catch(JSONException je) {
					rtnMap.put("result", false);
					rtnMap.put("error_code", OslErrorCode.CI_REP_PARAM_PARSE_FAIL);
					return rtnMap;
				}
			}
			
			
			if(!paramIsFlag) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.CI_DATA_NULL);
				return rtnMap;
			}
		}
		
		rtnMap.put("result", true);
		rtnMap.put("total", total);
		rtnMap.put("executed", executed);
		rtnMap.put("etcMsg", etcMsg);
		return rtnMap;
    }
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertPostRepFileLock(Map paramMap) throws Exception {
		Map rtnMap = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");
		
		
		List<String> etcMsg = new ArrayList<String>();
				
		
		Object checkParam = checkParamDataKey(data);
		
		
		int executed = 0;
		
		
		if(checkParam instanceof String) {
			rtnMap.put("result", false);
			rtnMap.put("error_code", checkParam.toString());
			return rtnMap;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			String pathListStr = OslUtil.jsonGetString(jsonObj, "path_list");
			
			
			if(pathListStr == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.PARAM_PATH_LIST_NULL);
				return rtnMap;
			}
			
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			
			
			String lockForce = OslUtil.jsonGetString(jsonObj, "force");
			
			if(lockForce == null) {
				lockForce = "false";
			}
			
			
			String repId = OslUtil.jsonGetString(jsonObj, "rep_id");
			
			
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			
			if(repId == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.PARAM_REP_ID_NULL);
				return rtnMap;
			}
			
			paramMap.put("repId", repId);
			
			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			if(repVo == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
				rtnMap.put("etcMsg", "소스저장소 {REP_ID="+repId+"}에 대한 정보 없음");
				return rtnMap;
			}
			
			
			RepResultVO repResultVO = repModule.repAuthCheck(repVo);
			boolean repAuthCheck = repResultVO.isReturnValue();
			
			if(!repAuthCheck) {
				
				rtnMap.put("result", false);
				
				String resultCode = repResultVO.getResultCode();
				rtnMap.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
				
				
				if(resultCode.equals(repResultVO.USER_AUTH_CHECK_FAIL)) {
					rtnMap.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.");
				}
				
				else if(resultCode.equals(repResultVO.REPOSITORY_NOT_ACCESS)) {
					rtnMap.put("etcMsg", repResultVO.getResultMsg()+"</br>입력된 값을 확인해주세요.</br>");
				}
				else {
					rtnMap.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.</br>"+repResultVO.getResultMsg());
				}
				return rtnMap;
			}
			
			boolean force = false;
			try {
				force =  Boolean.valueOf(lockForce);
			}catch(Exception e) {
				Log.debug(e);
			}
			
			
			try {
				JSONArray pathList = new JSONArray(pathListStr);
				
				
				if(pathList == null || pathList.length() == 0) {
					rtnMap.put("error_code", OslErrorCode.SERVER_ERROR);
					rtnMap.put("etcMsg", "lock 대상 파일 정보가 없습니다.");
					return rtnMap;
				}

				
				Map resultDataMap = new HashMap<>();
				
				
				rtnMap.put("total", pathList.length());
				
				
				ObjectMapper om = new ObjectMapper();
				
				
				for(int i=0;i<pathList.length();i++) {
					JSONObject pathObj = pathList.getJSONObject(i);
					if(!pathObj.has("path")) {
						etcMsg.add("파일 경로 목록에서 경로(path) 데이터를 찾을 수 없습니다.");
						continue;
					}
					
					
					String filePath = pathObj.getString("path");
					
					
					String comment = "[사용자 ID="+empId+", path="+filePath+"] 파일을 락 설정 했습니다.";
					
					RepLockVO repLockVo = repModule.fileLockHandle(repVo, filePath, comment, force);
					repLockVo.setLockUsrId(empId);
					repLockVo.setRegDtm(String.valueOf(new Date().getTime()));
					repLockVo.setRegUsrIp(String.valueOf(paramMap.get("regUsrIp")));
					repLockVo.setLockForce(lockForce);
					repLockVo.setRegUsrId(empId);
					repLockVo.setLockTargetRv("HEAD");
					repLockVo.setTicketId(ticketId);
					repLockVo.setRepType("01");
					
					
					if(repLockVo.isResult()) {
						
						lck1000Service.insertLck1000LockInfo(repLockVo);
						
						
						resultDataMap.put(filePath, om.convertValue(repLockVo, Map.class));
						executed++;
					}else {
						Map resultMap = new HashMap<>();
						resultMap.put("result", false);
						resultMap.put("lockPath", filePath);
						resultMap.put("lockUsrId", empId);
						resultMap.put("etcMsg", repLockVo.getResultMsg());
						
						resultDataMap.put(filePath, om.convertValue(repLockVo, Map.class));
					}
				}

				rtnMap.put("data", resultDataMap);
				
			}catch(JSONException jsonE) {
				Log.debug(jsonE);
			}
		}
		rtnMap.put("executed", executed);
		rtnMap.put("etcMsg", etcMsg);
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertGetRepFileLock(Map paramMap) throws Exception {
		Map rtnValue = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(!(checkParam instanceof String)) {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			String repUuid = OslUtil.jsonGetString(jsonObj, "repUuid");
			
			
			String paramRv = (String) OslUtil.jsonGetString(jsonObj, "rv");
			
			try {
				
				if(repUuid == null) {
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.REP_UUID_PARAM_NULL);
					return rtnValue;
				}
				if(paramRv == null) {
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.REP_REVISION_PARAM_NULL);
					return rtnValue;
				}
				
				long rv = Long.parseLong(paramRv);
				
				paramMap.put("repUuid", repUuid);
				
				
				RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
				
				
				RepResultVO repResultVO = repModule.repAuthCheck(repVo);
				boolean repAuthCheck = repResultVO.isReturnValue();
				
				if(!repAuthCheck) {
					
					rtnValue.put("result", false);
					
					String resultCode = repResultVO.getResultCode();
					rtnValue.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
					
					
					if(resultCode.equals(repResultVO.USER_AUTH_CHECK_FAIL)) {
						rtnValue.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.");
					}
					
					else if(resultCode.equals(repResultVO.REPOSITORY_NOT_ACCESS)) {
						rtnValue.put("etcMsg", repResultVO.getResultMsg()+"</br>입력된 값을 확인해주세요.</br>");
					}
					else {
						rtnValue.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.</br>"+repResultVO.getResultMsg());
					}
					return rtnValue;
				}
				
				
				List<RepDataVO> rvInfoList = repModule.selectRepLogList(repResultVO, rv, rv, new String[] {"/"});
				
				
				if(rvInfoList == null || rvInfoList.size() == 0) {
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
					return rtnValue;
				}
				
				
				RepDataVO rvInfo = rvInfoList.get(0);
				
				
				
				List<RepFileVO> chgFileList = rvInfo.getRepFileList();
				
				
				int chgFileCnt = 0;
				if(chgFileList != null) {
					chgFileCnt = chgFileList.size();
				}
				
				
				String author = rvInfo.getAuthor();
				
				
				if(rvInfo.getComment() != null) {
					String[] comments = rvInfo.getComment().split("\n");
					String ticketId = comments[0].trim();
					
					
					if(ticketId.indexOf("[insert_data_no-flag]") != -1) {
						
						rtnValue.put("result", true);
						return rtnValue;
					}
					
					
					if(chgFileCnt > 0) {
						
						int execute = 0;
						
						
						for(RepFileVO chgFileInfo : chgFileList) {
							try {
								
								String path = chgFileInfo.getPath();
								
								
								char type = chgFileInfo.getType();

								
								if('D' == type) {
									continue;
								}
								
								
								String comment = "[사용자 ID="+author+", path="+path+"] 파일을 락 설정 했습니다.";
								
								
								RepLockVO repLockVo = repModule.fileLockHandle(repVo, path, rv, comment, false);
								repLockVo.setLockUsrId(author);
								repLockVo.setRegDtm(String.valueOf(new Date().getTime()));
								repLockVo.setRegUsrIp(String.valueOf(paramMap.get("regUsrIp")));
								repLockVo.setLockForce("true");
								repLockVo.setRegUsrId(author);
								repLockVo.setTicketId(ticketId);
								repLockVo.setLockTargetRv(paramRv);
								repLockVo.setRepType("01");
								
								
								if(repLockVo.isResult()) {
									
									lck1000Service.insertLck1000LockInfo(repLockVo);
									
									
									execute++;
								}
							}
							catch(Exception e) {
								Log.debug(e);
								e.printStackTrace();
								continue;
							}
						}
						
						
						if(execute == 0) {
							rtnValue.put("result", false);
							rtnValue.put("error_code", OslErrorCode.FILE_LOCKED_FAIL);
							return rtnValue;
						}
					}
				}else {
					
					rtnValue.put("result", false);
					rtnValue.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
					return rtnValue;
				}
				
				
				
				
				rtnValue.put("rvInfoList", rvInfoList);
				
			}catch(Exception e) {
				e.printStackTrace();
				rtnValue.put("result", false);
				rtnValue.put("error_code", OslErrorCode.SERVER_ERROR);
				return rtnValue;
			}
		}else {
			rtnValue.put("result", false);
			rtnValue.put("error_code", OslErrorCode.DATA_DECODE_FAIL);
			return rtnValue;
		}
		
		
		rtnValue.put("result", true);
		return rtnValue;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRepFileUnLock(Map paramMap) throws Exception {
		Map rtnMap = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");
		
		
		List<String> etcMsg = new ArrayList<String>();
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		int executed = 0;
		
		
		String result = "FAIL";
		
		
		if(checkParam instanceof String) {
			rtnMap.put("result", result);
			rtnMap.put("error_code", checkParam.toString());
			return rtnMap;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			String pathListStr = OslUtil.jsonGetString(jsonObj, "path_list");
			
			
			if(pathListStr == null) {
				rtnMap.put("result", result);
				rtnMap.put("error_code", OslErrorCode.PARAM_PATH_LIST_NULL);
				return rtnMap;
			}
			
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			
			
			String lockForce = OslUtil.jsonGetString(jsonObj, "force");
			
			
			String repId = OslUtil.jsonGetString(jsonObj, "rep_id");
			
			
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			
			if(repId == null) {
				rtnMap.put("result", result);
				rtnMap.put("error_code", OslErrorCode.PARAM_REP_ID_NULL);
				return rtnMap;
			}
			
			paramMap.put("repId", repId);
			
			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			if(repVo == null) {
				rtnMap.put("result", result);
				rtnMap.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
				rtnMap.put("etcMsg", "소스저장소 {REP_ID="+repId+"}에 대한 정보 없음");
				return rtnMap;
			}
			
			
			RepResultVO repResultVO = repModule.repAuthCheck(repVo);
			boolean repAuthCheck = repResultVO.isReturnValue();
			
			if(!repAuthCheck) {
				
				rtnMap.put("result", result);
				
				String resultCode = repResultVO.getResultCode();
				rtnMap.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
				
				
				if(resultCode.equals(repResultVO.USER_AUTH_CHECK_FAIL)) {
					rtnMap.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.");
				}
				
				else if(resultCode.equals(repResultVO.REPOSITORY_NOT_ACCESS)) {
					rtnMap.put("etcMsg", repResultVO.getResultMsg()+"</br>입력된 값을 확인해주세요.</br>");
				}
				else {
					rtnMap.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.</br>"+repResultVO.getResultMsg());
				}
				return rtnMap;
			}
			
			
			boolean force = false;
			try {
				force =  Boolean.valueOf(lockForce);
			}catch(Exception e) {
				Log.debug(e);
			}
			
			
			try {
				JSONArray pathList = new JSONArray(pathListStr);
				
				
				if(pathList == null || pathList.length() == 0) {
					rtnMap.put("error_code", OslErrorCode.SERVER_ERROR);
					rtnMap.put("etcMsg", "unlock 대상 파일 정보가 없습니다.");
					return rtnMap;
				}
				
				
				Map resultDataMap = new HashMap<>();
				
				
				rtnMap.put("total", pathList.length());
				
				
				for(int i=0;i<pathList.length();i++) {
					JSONObject pathObj = pathList.getJSONObject(i);
					if(!pathObj.has("path")) {
						etcMsg.add("파일 경로 목록에서 경로(path) 데이터를 찾을 수 없습니다.");
						continue;
					}

					
					String filePath = pathObj.getString("path");
					
					
					if(!force && !pathObj.has("lock_id")) {
						Map resultMap = new HashMap<>();
						resultMap.put("result", false);
						resultMap.put("lockPath", filePath);
						resultMap.put("lockUsrId", empId);
						resultMap.put("etcMsg", "파일 경로 목록에서 lock id(lock_id) 데이터를 찾을 수 없습니다.");
						
						resultDataMap.put(filePath, resultMap);
						continue;
					}
					
					
					String lockId = null;
					String lockTargetRv = "HEAD";
					String repType = "01";
					
					if(!force) {
						lockId = pathObj.getString("lock_id");
						
						
						Map newMap = new HashMap<>();
						newMap.put("repId", repId);
						newMap.put("lockId", lockId);
						newMap.put("lockStateCd", "01");
						
						
						Map lckInfo = lck1000Service.selectLck1000BaseInfo(newMap);
						
						
						if(lckInfo == null) {
							Map resultMap = new HashMap<>();
							resultMap.put("result", result);
							resultMap.put("lockPath", filePath);
							resultMap.put("lockUsrId", empId);
							resultMap.put("etcMsg", "해당하는 데이터를 찾을 수 없습니다.");
							
							resultDataMap.put(filePath, resultMap);
							continue;
						}
						
						
						String lockUsrId = (String) lckInfo.get("lockUsrId");
						
						
						if(!lockUsrId.equals(empId)) {
							Map resultMap = new HashMap<>();
							resultMap.put("result", result);
							resultMap.put("lockPath", filePath);
							resultMap.put("lockUsrId", empId);
							resultMap.put("etcMsg", "Lock 설정한 사용자가 아닙니다.");
							
							resultDataMap.put(filePath, resultMap);
							continue;
						}
						
						
						lockTargetRv = (String) lckInfo.get("lockTargetRv");
						
						
						String infoRepType = (String)lckInfo.get("repType");
						if(infoRepType != null && "02".equals(infoRepType)) {
							repType = "02";
						}
					}
					
					repVo.setSvnRepoType(repType);
					
					
					String comment = "[사용자 ID="+empId+", path="+filePath+"] 파일을 락 해제 했습니다.";
					
					
					RepLockVO repLockVo = repModule.fileUnLockHandle(repVo, filePath, lockId, force);
					repLockVo.setLockUsrId(empId);
					repLockVo.setRegDtm(String.valueOf(new Date().getTime()));
					repLockVo.setRegUsrIp(String.valueOf(paramMap.get("regUsrIp")));
					repLockVo.setLockForce(lockForce);
					repLockVo.setRegUsrId(empId);
					repLockVo.setTicketId(ticketId);
					repLockVo.setLockTargetRv(lockTargetRv);
					
					
					if(repLockVo.isResult()) {
						repLockVo.setLockComment(comment);
						
						
						lck1000Service.insertLck1000LockInfo(repLockVo);
						
						
						resultDataMap.put(filePath, repLockVo);
						executed++;
					}else {
						repLockVo.setResultMsg(repLockVo.getResultMsg());
						resultDataMap.put(filePath, repLockVo);
					}
				}
				
				rtnMap.put("data", resultDataMap);
				
				if(executed > 0) {
					result = "SUCCESS";
				}
				
				rtnMap.put("result", result);
				
			}catch(JSONException jsonE) {
				Log.debug(jsonE);
			}
		}
		rtnMap.put("executed", executed);
		rtnMap.put("etcMsg", etcMsg);
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked"})
	public Map selectRepFileLockList(Map paramMap) throws Exception {
		Map rtnMap = new HashMap<>();
		
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(checkParam instanceof String) {
			rtnMap.put("result", false);
			rtnMap.put("error_code", checkParam.toString());
			return rtnMap;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			
			if(ticketId == null) {
				rtnMap.put("result", false);
				rtnMap.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
				return rtnMap;
			}
			
			
			String lockTargetRv = OslUtil.jsonGetString(jsonObj, "lock_target_rv");
			
			
			String lockStateCd = OslUtil.jsonGetString(jsonObj, "lock_state_cd");
			
			
			Map newMap = new HashMap<>();
			newMap.put("ticketId", ticketId);
			
			
			if(lockTargetRv != null) {
				newMap.put("lockTargetRv", lockTargetRv);
			}
			if(lockStateCd != null) {
				newMap.put("lockStateCd", lockStateCd);
			}
			List<Map> lckList = lck1000Service.selectLck1000TktLockList(newMap);
			rtnMap.put("data", lckList);
			rtnMap.put("result", true);
		}
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked"})
	public Map insertTempRepFileLock(Map paramMap) throws Exception {
		Map rtnMap = new HashMap<>();
		
		boolean result = false;
		
		
		List<String> etcMsg = new ArrayList<String>();

		
		Map<String, RepResultVO> repInfoMap = new HashMap<String, RepResultVO>();
		
		
		int total = 0;
		
		int execute = 0;
		
		List<Map> tempList = rep1100Service.selectTempDataList(paramMap);
		
		if(tempList != null && tempList.size() > 0) {
			
			total = tempList.size();
			
			for(Map tempInfo : tempList) {
				String repId = (String) tempInfo.get("repId");
				String path = (String) tempInfo.get("path");
				String empId = (String) tempInfo.get("empId");
				
				RepResultVO repResultVo = null;
				
				if(!repInfoMap.containsKey(repId)) {
					
					Map newMap = new HashMap<>();
					newMap.put("repId", repId);
					
					
					RepVO repVo = rep1000Service.selectRep1000Info(newMap);
					
					
					repVo.setSvnRepoType("02");
					
					
					repResultVo = repModule.repAuthCheck(repVo);
					repResultVo.setEmpId(empId);
					
					
					repInfoMap.put(repId, repResultVo);
				}
				
				repResultVo = repInfoMap.get(repId);
				
				
				if(!repResultVo.isReturnValue()) {
					etcMsg.add("- 배포저장소 연결 실패 [repNm="+repResultVo.getRepVo().getRepNm()+"]");
					continue;
				}

				
				SVNRepository repository = repResultVo.getDplRepo();
				
				if(repository == null) {
					etcMsg.add("- 배포저장소 연결 실패 [repNm="+repResultVo.getRepVo().getRepNm()+"]");
					continue;
				}
				
				
				SVNLock svnLock = repository.getLock(path);
				
				if(svnLock != null) {
					etcMsg.add("- 이미 lock 상태의 파일입니다. [path="+path+"]");
					continue;
				}
				
				
				String comment = "[사용자 ID="+empId+", path="+path+"] 파일을 락 설정 했습니다.";
				

				
				RepLockVO repLockVo = repModule.fileLockHandle(repResultVo.getRepVo(), path, -1l, comment, false);
				repLockVo.setLockUsrId(empId);
				repLockVo.setRegDtm(String.valueOf(new Date().getTime()));
				repLockVo.setRegUsrIp(String.valueOf(paramMap.get("regUsrIp")));
				repLockVo.setLockForce("true");
				repLockVo.setRegUsrId(empId);
				repLockVo.setLockTargetRv("HEAD");
				repLockVo.setRepType("02");
				
				
				if(repLockVo.isResult()) {
					
					Map newMap = new HashMap<>();
					newMap.put("repId", repId);
					newMap.put("path", path);
					rep1100Service.updateTempDataInfo(newMap);
					
					
					lck1000Service.insertLck1000LockInfo(repLockVo);
					
					
					execute++;
				}
				if(execute > 0) {
					result = true;
				}
			}
			
		}else {
			etcMsg.add("조회된 데이터가 없습니다.");
		}
		
		rtnMap.put("result", result);
		rtnMap.put("total", total);
		rtnMap.put("execute", execute);
		rtnMap.put("etcMsg", etcMsg);
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRepRevisionInfoByGitHub(Map paramMap) throws Exception{
		
		Map rtnValue = new HashMap<>();
		
		
		Map repoMap = (Map) paramMap.get("repository");
		
		
		String repoUuid = (String) repoMap.get("clone_url");
		
		Map chkParamMap = new HashMap<>();
		chkParamMap.put("repUuid", repoUuid);
		
		
		RepVO repVo = rep1000Service.selectRep1000Info(chkParamMap);
		
		
		RepResultVO repResultVO = repModule.repAuthCheck(repVo);
		boolean repAuthCheck = repResultVO.isReturnValue();
		
		
		String actionType = (String) paramMap.get("actionType");
		
		if(!repAuthCheck) {
			
			rtnValue.put("result", false);
			
			String resultCode = repResultVO.getResultCode();
			rtnValue.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
			
			
			if(resultCode.equals(repResultVO.USER_AUTH_CHECK_FAIL)) {
				rtnValue.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.");
			}
			
			else if(resultCode.equals(repResultVO.REPOSITORY_NOT_ACCESS)) {
				rtnValue.put("etcMsg", repResultVO.getResultMsg()+"</br>입력된 값을 확인해주세요.</br>");
			}
			else {
				rtnValue.put("etcMsg", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.</br>"+repResultVO.getResultMsg());
			}
			return rtnValue;
		}
		
		
		String masterBranchNm = (String) repResultVO.getGitRepo().getDefaultBranch();
		masterBranchNm = masterBranchNm.replace("refs/heads/", "");
		
		String branchNm = (String) paramMap.get("ref");
		branchNm = branchNm.replace("refs/heads/", "");
		
		String opsBranchNm = EgovProperties.getProperty("Globals.github.operation.branch");
		
		
		List<Map<String, Object>> commitList = (List<Map<String, Object>>) paramMap.get("commits");
		
		String startRv = "";
		String lastRv = "";
		
		if(commitList == null || commitList.size() == 0) {
			startRv = "-1";
			lastRv = "HEAD";
		}else if(commitList.size() != 0){
			startRv = (String) ((Map) commitList.get(0)).get("id");
			lastRv = (String) ((Map) commitList.get(commitList.size() -1)).get("id");
		}
		
		Map headCmt = null;
		boolean mergeYn = false;
		if(paramMap.containsKey("head_commit")) {
			headCmt = (Map) paramMap.get("head_commit");
		}
		
		if(actionType.indexOf("Merge") > -1) {
			mergeYn = true;
		}
		
		
		if(headCmt != null) {
			if(headCmt.containsKey("message") && ((String) headCmt.get("message")).indexOf("Merge") == 0) {
				
				if("operationMerge".equals(actionType)) {
					branchNm = opsBranchNm;
				}
				else {
					branchNm = masterBranchNm;
				}
				startRv = "-1";
				lastRv = "HEAD";
			}
		}
		
		Map<String, Object> commitFileList = new HashMap<>();
		for(Object obj : commitList) {
			Map commitInfo = (Map) obj;
			for(String filePath : (List<String>) commitInfo.get("added")) {
				if(!commitFileList.containsKey(filePath)) {
					commitFileList.put(filePath, OffsetDateTime.parse((String) commitInfo.get("timestamp")));
				}else {
					
					OffsetDateTime mapData = (OffsetDateTime) commitFileList.get("filePath");
					
					OffsetDateTime commitData = OffsetDateTime.parse((String) commitInfo.get("timestamp"));
					
					if(mapData == null && commitData != null) {
						
						commitFileList.put(filePath, commitData);
					}else if(mapData.isAfter(commitData)) {
						
						commitFileList.put(filePath, commitData);
					}
				}
			}
			for(String filePath : (List<String>) commitInfo.get("removed")) {
				if(!commitFileList.containsKey(filePath)) {
					commitFileList.put(filePath, OffsetDateTime.parse((String) commitInfo.get("timestamp")));
				}else {
					
					OffsetDateTime mapData = (OffsetDateTime) commitFileList.get("filePath");
					
					OffsetDateTime commitData = OffsetDateTime.parse((String) commitInfo.get("timestamp"));
					if(mapData == null && commitData != null) {
						
						commitFileList.put(filePath, commitData);
					}else if(mapData.isAfter(commitData)) {
						
						commitFileList.put(filePath, commitData);
					}
				}
			}
			for(String filePath : (List<String>) commitInfo.get("modified")) {
				if(!commitFileList.containsKey(filePath)) {
					commitFileList.put(filePath, OffsetDateTime.parse((String) commitInfo.get("timestamp")));
				}else {
					
					OffsetDateTime mapData = (OffsetDateTime) commitFileList.get("filePath");
					
					OffsetDateTime commitData = OffsetDateTime.parse((String) commitInfo.get("timestamp"));
					if(mapData == null && commitData != null) {
						
						commitFileList.put(filePath, commitData);
					}else if(mapData.isAfter(commitData)) {
						
						commitFileList.put(filePath, commitData);
					}
				}
			}
		}
		
		
		List<RepDataVO> rvInfoList = repModule.selectRepLogListByGitHub(repResultVO, branchNm, startRv ,lastRv, commitFileList);

		
		if(rvInfoList == null || rvInfoList.size() == 0) {
			rtnValue.put("result", false);
			rtnValue.put("error_code", OslErrorCode.REP_ID_INFO_NULL);
			return rtnValue;
		}
		
		
		RepDataVO rvInfo = rvInfoList.get(0);
		
		
		
		List<RepFileVO> chgFileList = rvInfo.getRepFileList();
		
		
		int chgFileCnt = 0;
		if(commitList != null && commitList.size() != 0) {
			chgFileCnt = chgFileList.size();
		}else {
			chgFileCnt = chgFileList.size();
		}
		
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
		
		
		String author = rvInfo.getAuthor();
		
		
		Map newMap = new HashMap<>();
		newMap.put("repId", repVo.getRepId());
		newMap.put("repRv", rvInfo.getRevision());
		newMap.put("repRvn", repResultVO.getLastRevisionNum());
		newMap.put("repComment", rvInfo.getComment());
		newMap.put("repCmtDate", sdf.format(rvInfo.getLogDate()));
		newMap.put("repCmtAuthor", author);
		
		if(author == null || "".equals(author)) {
			author = "SYSTSEM";
			newMap.put("repCmtAuthor", author);
		}
		newMap.put("repChgFileCnt", chgFileCnt);
		newMap.put("gitCmtSha", rvInfo.getGitCmtSha());
		newMap.put("gitBrcNm", rvInfo.getGitBrcNm());
		
		
		if(rvInfo.getComment() != null) {
			String[] comments = rvInfo.getComment().split("\n");
			String ticketId = comments[0].trim();
			
			
			for(String cmtMsg : comments) {
				if(cmtMsg.trim().indexOf("ticket_id:") == 0) {
					ticketId = cmtMsg.trim().replace("ticket_id:", "");
					ticketId = ticketId.replaceAll("\\s+", "");
					break;
				}
			}
			
			if("".equals(ticketId)) {
				ticketId = "SYSTEM";
			}
			
			
			for(String cmtMsg : comments) {
				if(cmtMsg.trim().indexOf("[insert_data_no-flag]") != -1) {
					
					rtnValue.put("result", true);
					return rtnValue;
				}
			}
			
			
			String bldNum = "1";
			if("operationMerge".equals(actionType)) {
				for(String cmtMsg : comments) {
					if(cmtMsg.trim().indexOf("bld_num:") == 0) {
						bldNum = cmtMsg.trim().replace("bld_num:", "");
						bldNum = bldNum.replaceAll("\\s+", "");
						
						
						
						newMap.put("repRvTypeCd", "03");
						break;
					}
				}
			}
			
			
			if("operationMerge".equals(actionType)) {
				
				newMap.put("repRvTypeCd", "03");
				newMap.put("gitBrcNm", opsBranchNm);
			}
			else if("masterMerge".equals(actionType)){
				
				newMap.put("repRvTypeCd", "02");
				newMap.put("gitBrcNm", masterBranchNm);
			}
			else if("push".equals(actionType)){
				
				newMap.put("repRvTypeCd", "01");
				newMap.put("gitBrcNm", branchNm);
			}
			
			
			newMap.put("ticketId", ticketId);
			
			
			if("operationMerge".equals(actionType)) {
				
				
				
					
					rep1100Service.insertRep1100RvInfo(newMap);

					
					String opsBranchBuildNm = (String) paramMap.get("ref")+bldNum;
					opsBranchBuildNm = opsBranchBuildNm.replace("refs/heads/", "");
					List<Map> rep1102InsertList = rep1100Service.getRep1102List(opsBranchBuildNm);
					if(rep1102InsertList != null && rep1102InsertList.size() > 0) {
						
						for(Map rep1102InsertInfo : rep1102InsertList) {
							rep1102InsertInfo.put("repRv", rvInfo.getGitCmtSha());
							rep1100Service.insertRep1102RvChgInfo(rep1102InsertInfo);
						}
						
						
						rep1100Service.removeRep1102List(opsBranchBuildNm);
					}
				
			}
			
			else {
				
				Map dbRvInfo = rep1100Service.selectRep1100RvInfo(newMap);
				
				
				if(dbRvInfo == null) {
					rep1100Service.insertRep1100RvInfo(newMap);
				}else {
					
					rep1100Service.updateRep1100RvInfo(newMap);
					
					
					rep1100Service.deleteRep1101RvChgList(newMap);
				}
				
				
				if(chgFileCnt > 0) {
					
					for(RepFileVO chgFileInfo : chgFileList) {
						try {
							
							String path = chgFileInfo.getPath();
							
							System.out.println(">>>>>>>>>>>>>>>chgFilePath: "+path);
							
							String fileNm = path.substring(path.lastIndexOf("/")+1, path.length());
							
							
							char type = chgFileInfo.getType();
							

							String typeName = "";
							if( 'A'==type ) {
								typeName = "01";
							}else if( 'M'==type ) {
								typeName = "02";
							}else if( 'D'==type ) {
								typeName = "03";
							}else {
								typeName = "02";
							}

							newMap = new HashMap<>();
							newMap.put("repId", repVo.getRepId());
							newMap.put("ticketId", ticketId);
							newMap.put("repRv", rvInfo.getRevision());
							newMap.put("repRvn", repResultVO.getLastRevisionNum());
							newMap.put("repChgTypeCd", typeName);
							newMap.put("repChgFilePath", path);
							newMap.put("repChgFileNm", fileNm);
							newMap.put("repChgFileKind", chgFileInfo.getKind());
							
							
							newMap.put("repTargetRv", chgFileInfo.getParentSha());
							
							
							rep1100Service.insertRep1101RvChgInfo(newMap);
						}
						catch(Exception e) {
							Log.debug(e);
							continue;
						}
					}
				}
			}
		}else {
			
			rtnValue.put("result", false);
			rtnValue.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
			return rtnValue;
		}
		
		rtnValue.put("rvInfoList", rvInfoList);
		return rtnValue;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRepTempBranchByGitHub(Map paramMap) throws Exception{
		
		Map rtnValue = new HashMap<>();
		
		
		Map repoMap = (Map) paramMap.get("repository");
		String repoUuid = (String) repoMap.get("clone_url");
		Map chkParamMap = new HashMap<>();
		chkParamMap.put("repUuid", repoUuid);
		
		RepVO repVo = rep1000Service.selectRep1000Info(chkParamMap);
		
		RepResultVO repResultVO = repModule.repAuthCheck(repVo);
		GHRepository repository = repResultVO.getGitRepo();
		
		String tempBranchNm = (String) paramMap.get("ref");
		tempBranchNm = tempBranchNm.replace("refs/heads/", "");
		
		repository.getRef("heads/"+tempBranchNm).delete();
		rtnValue.put("reslult", true);
		
		return rtnValue;
	};
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map deleteRepTempBranchByGitHub(Map paramMap) throws Exception{
		
		Map rtnValue = new HashMap<>();
		
		
		Map repoMap = (Map) paramMap.get("repository");
		String repoUuid = (String) repoMap.get("clone_url");
		Map chkParamMap = new HashMap<>();
		chkParamMap.put("repUuid", repoUuid);
		
		RepVO repVo = rep1000Service.selectRep1000Info(chkParamMap);
		
		RepResultVO repResultVO = repModule.repAuthCheck(repVo);
		GHRepository repository = repResultVO.getGitRepo();
		
		String tempBranchNm = (String) paramMap.get("ref");
		tempBranchNm = tempBranchNm.replace("refs/heads/", "");
		
		repository.getRef("heads/"+tempBranchNm).delete();
		rtnValue.put("reslult", true);
		
		return rtnValue;
	};
}
