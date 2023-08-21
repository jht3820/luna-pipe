package kr.opensoftlab.lunaops.com.api.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

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
import kr.opensoftlab.sdf.rep.com.RepModule;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;
import kr.opensoftlab.sdf.util.CommonScrty;
import kr.opensoftlab.sdf.util.OslUtil;


@Service("apiService")
public class ApiServiceImpl  extends EgovAbstractServiceImpl implements ApiService{

	
	@Resource(name = "rep1000Service")
	protected Rep1000Service rep1000Service;
	
	
	@Resource(name = "jen1000Service")
	protected Jen1000Service jen1000Service;
	
	
	@Resource(name = "dpl1000Service")
	protected Dpl1000Service dpl1000Service;

	
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
			da = CommonScrty.decryptedAria(data, salt);
		}catch(ArithmeticException ae) {
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
		
		
		rtnMap.put("total", total);
		rtnMap.put("executed", executed);
		
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(checkParam instanceof String) {
			rtnMap.put("result", false);
			rtnMap.put("error_code", checkParam);
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
				
				Map newMap = new HashMap<>();
				newMap.put("ciId", ciId);
				
				
				rep1000Service.deleteRep1001CIRepInfo(newMap);
				try {
					
					JSONArray jsonArr = new JSONArray(repIds);
					
					
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
								continue;
							}
							
							newMap.put("ciId", ciId);
							newMap.put("repId", repId);
							rep1000Service.insertRep1001CIRepInfo(newMap);
							
							
							executed++;
						} catch(Exception e) {
							
							continue;
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

				Map newMap = new HashMap<>();
				newMap.put("ciId", ciId);
				
				
				jen1000Service.deleteJen1101CIJobInfo(newMap);
				
				try {
					
					JSONArray jsonArr = new JSONArray(jenJobIds);
					
					
					total += jsonArr.length();
					
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
							
							
							newMap.put("ciId", ciId);
							newMap.put("jenId", jenId);
							newMap.put("jobId", jobId);
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
			rtnValue.put("error_code", OslErrorCode.SERVER_ERROR);
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
			rtnValue.put("error_code", OslErrorCode.SERVER_ERROR);
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
			
			
			String branchNm = EgovProperties.getProperty("Globals.svn.branchNm");
			String folderNm = branchNm+"_"+ticketId;
			
			
			rtnValue = repModule.createFolderInfo(repVo, folderNm);
			
		}else {
			rtnValue.put("result", false);
			rtnValue.put("error_code", OslErrorCode.SERVER_ERROR);
			return rtnValue;
		}
		
		rtnValue.put("result", true);
		
		return rtnValue;
	}
}
