package kr.opensoftlab.lunaops.whk.whk1000.whk1000.service.impl;

import java.net.URI;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import jline.internal.Log;
import kr.opensoftlab.lunaops.whk.whk1000.whk1000.service.Whk1000Service;
import kr.opensoftlab.sdf.util.OslConnHttpClient;


@Service("whk1000Service")
public class Whk1000ServiceImpl extends EgovAbstractServiceImpl implements Whk1000Service{
	
	
	@Resource(name="whk1000DAO")
    private Whk1000DAO whk1000DAO;
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectWhk1000Info(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1000Info(paramMap);
	}
	
	@SuppressWarnings({"rawtypes" })
	public Map selectWhk1001Info(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1001Info(paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List<Map> selectWhk1000List(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1000List(paramMap);
	}

	
	@SuppressWarnings({"rawtypes"})
	public int selectWhk1000ListCnt(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1000ListCnt(paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes"})
	public List<Map> selectWhk1001List(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1001List(paramMap);
	}
	
	
	public String insertWhk1000Info(Map<String, String> paramMap) throws Exception{
		return whk1000DAO.insertWhk1000Info(paramMap);
	}
	
	
	public void updateWhk1000Info(Map<String, String> paramMap) throws Exception{
		whk1000DAO.updateWhk1000Info(paramMap);
	}	
	
	
	public void deleteWhk1000Info(Map<String, String> paramMap) throws Exception{
		whk1000DAO.deleteWhk1000Info(paramMap);
	}	
	
	
	public String insertWhk1001Info(Map<String, String> paramMap) throws Exception{
		return whk1000DAO.insertWhk1001Info(paramMap);
	}
	
	
	public void deleteWhk1001Info(Map<String, String> paramMap) throws Exception{
		whk1000DAO.deleteWhk1001Info(paramMap);
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public void deleteWhk1000List(Map<String, Object> paramMap) throws Exception{
		
		List<Map> webhookIdList = (List<Map>) paramMap.get("list");
		if(webhookIdList != null && webhookIdList.size() > 0) {
			
			for(Map webhookInfo : webhookIdList) {
				
				whk1000DAO.deleteWhk1000Info(webhookInfo);
			}
		}
	}	
	
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertWhk1000SendData(String paramWhkTypeCd, String paramWhkChgTypeCd, String paramKey1, String paramKey2, String empId) throws Exception{
		
		String webhookTypeCd = paramWhkTypeCd;
		String webhookChgTypeCd = paramWhkChgTypeCd;
		String webhookTargetKey1 = paramKey1;
		String webhookTargetKey2 = paramKey2;
		String webhookUsrId = empId;
		
		
		Map rtnMap = new HashMap<>();
		boolean result = false;
		
		int total = 0;
		
		int executed = 0;
				
		
		List<String> etcMsg = new ArrayList<String>();
		
		
		Map newMap = new HashMap<>();
		newMap.put("webhookTypeCd", webhookTypeCd);
		newMap.put("webhookChgTypeCd", webhookChgTypeCd);
		newMap.put("useCd", "01");
		
		
		List<Map> whkList = whk1000DAO.selectWhk1000List(newMap);
		
		if(whkList == null) {
			etcMsg.add("웹훅 목록 조회 중 오류 발생");
		}else {
			
			total = whkList.size();
			if(total > 0) {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
				
				
				for(Map whkInfo: whkList) {
					
					String webhookId = (String) whkInfo.get("webhookId");
					String webhookNm = (String) whkInfo.get("webhookNm");
					String webhookTargetUrl = (String) whkInfo.get("webhookTargetUrl");
					String contentTypeCd = (String) whkInfo.get("contentTypeCd");
					
					int resultStatusCode = -1;
					
					JSONObject paramJsonObj = new JSONObject();
					
					String resultContent = "";
					try {
						
						URI uri = new URI(webhookTargetUrl);
						
						
						HttpPost methodPost = new HttpPost();
						methodPost.setURI(uri);
						
						
						HttpHeaders headers = new HttpHeaders();
						
						
						paramJsonObj.put("whk_id", webhookId);
						paramJsonObj.put("whk_type", webhookTypeCd);
						paramJsonObj.put("whk_chg_type", webhookChgTypeCd);
						paramJsonObj.put("whk_target_key1", webhookTargetKey1);
						paramJsonObj.put("whk_target_key2", webhookTargetKey2);
						paramJsonObj.put("whk_usr_id", webhookUsrId);
						paramJsonObj.put("whk_dtm", sdf.format(new Date()));
						
						
						
						if("01".equals(contentTypeCd)) {
							
							headers.setContentType(MediaType.APPLICATION_JSON);
							
							
							methodPost.setEntity(new StringEntity(paramJsonObj.toString(), ContentType.APPLICATION_JSON));
						}
						
						else if("02".equals(contentTypeCd)) {
							headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
							
							
							
							
							List<NameValuePair> nameValuePair = new ArrayList<NameValuePair>(1);
							nameValuePair.add(new BasicNameValuePair("whk_id",webhookId));
							nameValuePair.add(new BasicNameValuePair("whk_type",webhookTypeCd));
							nameValuePair.add(new BasicNameValuePair("whk_chg_type",webhookChgTypeCd));
							nameValuePair.add(new BasicNameValuePair("whk_target_key1",webhookTargetKey1));
							nameValuePair.add(new BasicNameValuePair("whk_target_key2",webhookTargetKey2));
							nameValuePair.add(new BasicNameValuePair("whk_usr_id",webhookUsrId));
							nameValuePair.add(new BasicNameValuePair("whk_dtm",sdf.format(new Date())));
							
							
							methodPost.setEntity(new UrlEncodedFormEntity(nameValuePair));
							
						}else {
							etcMsg.add("[ID="+webhookId+", NAME="+webhookNm+"] 전송 실패 (전송 콘텐츠 타입 없음)");
							continue;
						}
						
						HttpClient client = OslConnHttpClient.getHttpClient();
						
						
						HttpResponse responseResult = client.execute(methodPost);
						
						
						if(responseResult.getStatusLine() != null) {
							
							if(responseResult.getStatusLine().getStatusCode() == 200) {
								etcMsg.add("[ID="+webhookId+", NAME="+webhookNm+"] 전송 성공");
								result = true;
							}else {
								etcMsg.add("[ID="+webhookId+", NAME="+webhookNm+"] 전송 실패(status_code="+responseResult.getStatusLine().getStatusCode()+")");
							}
							
							
							resultStatusCode = responseResult.getStatusLine().getStatusCode();
							
							resultContent = EntityUtils.toString(responseResult.getEntity());
						}
						
					}catch(Exception e) {
						
						Log.error(e);
						resultContent = e.getMessage();
						etcMsg.add("[ID="+webhookId+", NAME="+webhookNm+"] 전송 오류(error_msg="+resultContent+")");
					}
					
					
					try {
						Map logParamMap = new HashMap<>();
						logParamMap.put("webhookId", webhookId);
						logParamMap.put("webhookResult", resultStatusCode);
						logParamMap.put("webhookData", paramJsonObj.toString());
						logParamMap.put("webhookLog", webhookId);
						logParamMap.put("webhookResultData", resultContent);
						logParamMap.put("webhookUsrId", webhookUsrId);
						logParamMap.put("webhookTargetUrl", webhookTargetUrl);
						
						
						whk1000DAO.insertWhk1001Info(logParamMap);
					}catch(Exception e) {
						Log.error(e);
					}
				}
			}else {
				etcMsg.add("웹훅 대상 없음");
			}
		}
		
		rtnMap.put("total", total);
		rtnMap.put("executed", executed);
		rtnMap.put("etcMsg", etcMsg);
		rtnMap.put("result", result);
		return rtnMap;
	}
}
