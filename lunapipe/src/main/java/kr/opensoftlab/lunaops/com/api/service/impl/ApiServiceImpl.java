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
import kr.opensoftlab.lunaops.com.vo.OslErrorCode;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.sdf.util.CommonScrty;
import kr.opensoftlab.sdf.util.OslUtil;


@Service("apiService")
public class ApiServiceImpl  extends EgovAbstractServiceImpl implements ApiService{

	
	@Resource(name = "rep1000Service")
	protected Rep1000Service rep1000Service;
	
	
	@Resource(name = "jen1000Service")
	protected Jen1000Service jen1000Service;
	
	
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
			return OslErrorCode.CI_INSERT_FAIL;
		}
		
		return jsonObj;
	}
	
	
	
    
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String insertCIRepJenJob(Map paramMap) throws Exception {
		
		String data = (String) paramMap.get("data");
		
		
		Object checkParam = checkParamDataKey(data);
		
		
		if(checkParam instanceof String) {
			return (String) checkParam;
		}else {
			
			JSONObject jsonObj = (JSONObject) checkParam;
			
			
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			
			
			if(ciId == null) {
				return OslErrorCode.PARAM_CI_ID_NULL;
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
					for(int i=0;i<jsonArr.length();i++) {
						newMap = new HashMap<>();
						
						newMap.put("regUsrId", paramMap.get("regUsrId"));
						newMap.put("regUsrIp", paramMap.get("regUsrIp"));
						
						JSONObject inJsonObj = jsonArr.getJSONObject(i);
						
						
						String repId = OslUtil.jsonGetString(inJsonObj, "rep_id");
						
						
						if(repId == null) {
							return OslErrorCode.CI_REP_PARAM_PARSE_FAIL;
						}
						
						newMap.put("ciId", ciId);
						newMap.put("repId", repId);
						rep1000Service.insertRep1001CIRepInfo(newMap);
					}
				}catch(JSONException je) {
					return OslErrorCode.CI_REP_PARAM_PARSE_FAIL;
				}
			}
			
			
			if(jenJobIds != null) {
				
				paramIsFlag = true;

				Map newMap = new HashMap<>();
				newMap.put("ciId", ciId);
				
				
				jen1000Service.deleteJen1101CIJobInfo(newMap);
				
				try {
					
					JSONArray jsonArr = new JSONArray(jenJobIds);
					
					for(int i=0;i<jsonArr.length();i++) {
						newMap = new HashMap<>();
						
						newMap.put("regUsrId", paramMap.get("regUsrId"));
						newMap.put("regUsrIp", paramMap.get("regUsrIp"));
						
						JSONObject inJsonObj = jsonArr.getJSONObject(i);
						
						
						String jenId = OslUtil.jsonGetString(inJsonObj, "jen_id");
						
						
						String jobId = OslUtil.jsonGetString(inJsonObj, "job_id");
						
						
						if(jenId == null || jobId == null) {
							return OslErrorCode.CI_JOB_PARAM_PARSE_FAIL;
						}
						
						
						newMap.put("ciId", ciId);
						newMap.put("jenId", jenId);
						newMap.put("jobId", jobId);
						jen1000Service.insertJen1101CIJobInfo(newMap);
					}
				}catch(JSONException je) {
					return OslErrorCode.CI_JOB_PARAM_PARSE_FAIL;
				}
			}
			
			
			if(!paramIsFlag) {
				return OslErrorCode.CI_DATA_NULL;
			}
		}
		
		
		return "-1";
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
				rtnValue.put("is_error", true);
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
			
			
			rtnValue.put("rep_ids", ciRepList);
			rtnValue.put("jen_job_ids", ciJenJobList);
		}
		return rtnValue;
	}
}
