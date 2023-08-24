package kr.opensoftlab.lunaops.com.api.service.impl;

import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
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
import org.springframework.stereotype.Service;

import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.com.api.service.ApiService;
import kr.opensoftlab.lunaops.com.exception.UserDefineException;
import kr.opensoftlab.lunaops.com.vo.OslErrorCode;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.Dpl1000Service;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.Rep1100Service;
import kr.opensoftlab.sdf.jenkins.NewJenkinsClient;
import kr.opensoftlab.sdf.jenkins.service.BuildService;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;
import kr.opensoftlab.sdf.jenkins.vo.JenStatusVO;
import kr.opensoftlab.sdf.rep.com.RepModule;
import kr.opensoftlab.sdf.rep.com.vo.RepDataVO;
import kr.opensoftlab.sdf.rep.com.vo.RepResultVO;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;
import kr.opensoftlab.sdf.rep.svn.vo.SVNFileVO;
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
		
		
		String da = "";
		
		try {
			
			Log.debug("paramData: "+data);
			
			
			if(data.indexOf("%") != -1) {
				
				data = URLDecoder.decode(data,"utf-8");
			}
			
			da = CommonScrty.decryptedAria(data, salt);
		}catch(ArithmeticException ae) {
			ae.printStackTrace();
			return OslErrorCode.DATA_DECODE_FAIL;
		}
		
		
		JSONObject jsonObj = new JSONObject(da);
		
		
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
								
								
								String jobParamListStr = OslUtil.jsonGetString(jsonObj, "job_param_list");
								if(jobParamListStr != null) {
									
									JSONArray jobParamList = new JSONArray(jobParamListStr);
									
									for(int j=0;j<jobParamList.length();j++) {
										
										String jobParamKey = OslUtil.jsonGetString(jsonObj, "job_param_key");
										String jobParamVal = OslUtil.jsonGetString(jsonObj, "job_param_val");
										
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
									JSONObject inParamJson = jsonArr.getJSONObject(i);
									
									
									String jobParamKey = OslUtil.jsonGetString(inParamJson, "job_param_key");
									
									
									String jobParamVal = OslUtil.jsonGetString(inParamJson, "job_param_val");
									
									
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
	public void insertJobBldLogInfo(Map paramMap) throws Exception {
		
		String paramKey = (String) paramMap.get("key");
		
		
		String salt = EgovProperties.getProperty("Globals.data.salt");
		
		String addSalt = EgovProperties.getProperty("Globals.data.addSalt");
		
		
		String deKey = CommonScrty.decryptedAria(paramKey, salt);
		
		
		String[] deKeys = deKey.split(addSalt);
		
		
		String jenId = CommonScrty.decryptedAria(deKeys[0],salt);
		
		
		String jobId = CommonScrty.decryptedAria(deKeys[1],salt);
		
		Map newMap = new HashMap<>();
		newMap.put("jenId", jenId);
		newMap.put("jobId", jobId);
		
		
		Map jobInfo = jen1000Service.selectJen1100JobInfo(newMap);
		
		if(jobInfo == null) {
			throw new UserDefineException("JOB 정보가 없습니다.");
		}
		
		
		
		
		
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertJobBldAction(Map paramMap) throws Exception {
		Map rtnValue = new HashMap<>();
		
		
		JenStatusVO jenStatusVo = null;
		
		try {
			
			
			
			
			String paramKey = (String) paramMap.get("key");

			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String dataSalt = EgovProperties.getProperty("Globals.data.salt");
			
			String addSalt = EgovProperties.getProperty("Globals.data.addSalt");
			
			
			String deKey = CommonScrty.decryptedAria(paramKey, dataSalt);
			
			
			String[] deKeys = deKey.split(Pattern.quote(addSalt));
			
			
			String jenId = CommonScrty.decryptedAria(deKeys[0],dataSalt);
			
			
			String jobId = CommonScrty.decryptedAria(deKeys[1],dataSalt);
			
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
			
			
			String branchePath = OslUtil.jsonGetString(jsonObj, "branche_path");
			
			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			String branchNm = EgovProperties.getProperty("Globals.svn.branchNm");
			String folderNm = branchNm+"_"+ticketId;
			
			
			rtnValue = repModule.createFolderInfo(repVo, folderNm, branchePath);
			
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

		
		String salt = EgovProperties.getProperty("Globals.data.salt");
		
		
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
				
				
				List<SVNFileVO> chgFileList = rvInfo.getSvnFileList();
				
				
				int chgFileCnt = 0;
				if(chgFileList != null) {
					chgFileCnt = chgFileList.size();
				}
				
				
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
				
				
				Map newMap = new HashMap<>();
				newMap.put("repId", repVo.getRepId());
				newMap.put("repRv", rvInfo.getRevision());
				newMap.put("repComment", rvInfo.getComment());
				newMap.put("repDate", sdf.format(rvInfo.getLogDate()));
				newMap.put("repAuthor", rvInfo.getAuthor());
				newMap.put("repChgFileCnt", chgFileCnt);
				
				
				if(rvInfo.getComment() != null) {
					String[] comments = rvInfo.getComment().split("\n");
					String ticketId = comments[0];
					
					
					
					String reciverData = "{\"key\":\""+salt+"\", \"ticket_id\":\""+ticketId+"\"}";
					String enReciverData = CommonScrty.encryptedAria(reciverData, salt);
					
					
					HttpGet methodGet = new HttpGet();
					URI uri = new URI(eGeneUrl+"plugins/jsp/isTicket.jsp?data="+URLEncoder.encode(enReciverData,"UTF-8"));
					methodGet.setURI(uri);
					
					HttpClient client = OslConnHttpClient.getHttpClient();
					
					
					HttpResponse responseResult = client.execute(methodGet);
					
					
					if(responseResult.getStatusLine() != null && responseResult.getStatusLine().getStatusCode() == 200) {
						
			    		String returnContent = EntityUtils.toString(responseResult.getEntity());
			    		returnContent = returnContent.replaceAll("\\s", "");
			    		
			    		
			    		if(!"true".equals(returnContent)) {
			    			
							rtnValue.put("result", false);
							rtnValue.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
							return rtnValue;
			    		}
					}else {
						
						rtnValue.put("result", false);
						rtnValue.put("error_code", OslErrorCode.PARAM_TICKET_ID_NULL);
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
						for(SVNFileVO chgFileInfo : chgFileList) {
							try {
								
								String path = chgFileInfo.getPath();
								
								String fileNm = path.substring(path.lastIndexOf("/")+1, path.length());
								
								
								char type = chgFileInfo.getType();
								
								
								newMap = new HashMap<>();
								newMap.put("repId", repVo.getRepId());
								newMap.put("ticketId", ticketId);
								newMap.put("repRv", rvInfo.getRevision());
								newMap.put("repChgType", String.valueOf(type));
								newMap.put("repChgFilePath", path);
								newMap.put("repChgFileNm", fileNm);
								
								
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
					String repRv = (String)ticketRvInfo.get("rep_rv");
					
					
					newMap.put("ticketId", ticketId);
					newMap.put("repId", repId);
					newMap.put("repRv", repRv);
					
					List<Map> ticketRvChgList = rep1100Service.selectRep1100RvChgFileList(newMap);
					
					
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
}
