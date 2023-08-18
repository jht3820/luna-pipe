package kr.opensoftlab.lunaops.com.api.web;

import java.net.URI;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.apache.logging.log4j.core.util.KeyValuePair;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.property.EgovPropertyService;
import kr.opensoftlab.lunaops.com.api.service.ApiService;
import kr.opensoftlab.lunaops.com.vo.OslErrorCode;
import kr.opensoftlab.sdf.util.CommonScrty;
import kr.opensoftlab.sdf.util.OslConnHttpClient;
import kr.opensoftlab.sdf.util.OslUtil;
import kr.opensoftlab.sdf.util.RequestConvertor;



@CrossOrigin
@Controller
public class ApiController {

	
	private static final Logger Log = Logger.getLogger(ApiController.class);

	
	@Resource(name = "apiService")
	protected ApiService apiService;
	
	
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/insertCIRepJenJob", method=RequestMethod.POST)
	public ModelAndView insertCIRepJenJob(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.insertCIRepJenJob(paramMap);
			
			
			boolean result = (boolean) rtnMap.get("result"); 

			
			if(result) {
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("msg", "정상적으로 등록되었습니다.");
			}else {
				
				String errorCode = (String) rtnMap.get("error_code");
				
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}
		}catch(Exception ex){
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("insertCIRepJenJob()", ex);
			
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/selectCIRepJenList", method=RequestMethod.POST)
	public ModelAndView selectCIRepJenList(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.selectCIRepJenJob(paramMap);
			
			
			boolean result = (boolean) rtnMap.get("result"); 
			
			
			if(!result) {
				
				String errorCode = (String) rtnMap.get("error_code");
				
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				model.addAttribute("result", "SUCCESS");
				rtnMap.remove("result");
				model.addAttribute("data", rtnMap);
				model.addAttribute("msg", "정상적으로 조회되었습니다.");
			}
		} 
		catch(Exception ex){
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("selectCIRepJenList()", ex);
			ex.printStackTrace();
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/selectTicketJobInfo", method=RequestMethod.POST)
	public ModelAndView selectTicketJobInfo(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.selectTicketJobInfo(paramMap);
			
			
			boolean result = (boolean) rtnMap.get("result"); 
			
			
			if(!result) {
				
				String errorCode = (String) rtnMap.get("error_code");
				
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				model.addAttribute("result", "SUCCESS");
				rtnMap.remove("result");
				model.addAttribute("data", rtnMap.get("dplJobList"));
				model.addAttribute("msg", "정상적으로 조회되었습니다.");
			}
		} 
		catch(Exception ex){
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("selectTicketJobInfo()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/insertCITicketJobList", method=RequestMethod.POST)
	public ModelAndView insertCITicketJobList(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.insertCITicketJobList(paramMap);

			
			boolean result = (boolean) rtnMap.get("result"); 
			
			
			if(result) {
				String newDplId = (String) rtnMap.get("newDplId");
				
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("dpl_id", newDplId);
				model.addAttribute("total", rtnMap.get("total"));
				model.addAttribute("executed", rtnMap.get("executed"));
				model.addAttribute("msg", "정상적으로 등록되었습니다.");
				
			}else {
				String errorCode = (String) rtnMap.get("error_code");
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}
		}catch(Exception ex){
			ex.printStackTrace();
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("insertCITicketJobList()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	
	@RequestMapping(value="/api/insertJobBldLogInfo", method=RequestMethod.GET)
	public ModelAndView insertJobBldLogInfo(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
						
			
			apiService.insertJobBldLogInfo(paramMap);
			
		}catch(Exception ex){
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("insertCITicketJobList()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/insertRepTicketBranchInfo", method=RequestMethod.POST)
	public ModelAndView insertRepTicketBranchInfo(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.insertRepTicketBranchInfo(paramMap);
			
			if(rtnMap == null) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
				model.addAttribute("msg", "오류가 발생했습니다.");
				return new ModelAndView("jsonView");
			}
			
			boolean result = (boolean) rtnMap.get("result");
			
			String errorCode = (String) rtnMap.get("errorCode");
			
			if(!result) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("msg", "정상적으로 생성되었습니다.");
			}
			
		}catch(Exception ex){
			ex.printStackTrace();
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("insertRepTicketBranchInfo()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	
	@RequestMapping(value="/api/selectSendDataReceiver", method=RequestMethod.POST)
	public ModelAndView selectSendDataReceiver(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String salt = EgovProperties.getProperty("Globals.data.salt");
			
			
			String data = (String) paramMap.get("data");
			
			
			String enData = CommonScrty.encryptedAria(data, salt);
			
			
			String ctlData = (String) paramMap.get("ctlData");
			
			
			String enCtlData = CommonScrty.encryptedAria(ctlData, salt);
			
			
			String eGeneUrl = EgovProperties.getProperty("Globals.eGene.url");
			
			
			HttpPost methodPost = new HttpPost();
			
			URI uri = new URI(eGeneUrl+"plugins/jsp/lunaReceiver.jsp");
			
			methodPost.setURI(uri);
			
			
			
			List<NameValuePair> nameValuePair = new ArrayList<NameValuePair>(1);
			
			nameValuePair.add(new BasicNameValuePair("data",enData));
			
			
			methodPost.setEntity(new UrlEncodedFormEntity(nameValuePair));
			
			HttpClient client = OslConnHttpClient.getHttpClient();
			
			
			HttpResponse responseResult = client.execute(methodPost);
			
			
			if(responseResult.getStatusLine() != null && responseResult.getStatusLine().getStatusCode() == 200) {
				
	    		String jsonStr = EntityUtils.toString(responseResult.getEntity());
	    		
	    		JSONObject returnJsonData = new JSONObject(jsonStr);
	    		
	    		
	    		if(returnJsonData.has("result")) {
	    			String result = returnJsonData.getString("result");
		    		
	    			if("SUCCESS".equals(result)) {
	    				model.addAttribute("result", "SUCCESS");
	    				model.addAttribute("msg", "정상적으로 생성되었습니다.");
	    				model.addAttribute("enCtlData", enCtlData);
	    			}else {
	    				model.addAttribute("result", "ERROR");
						model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
						model.addAttribute("msg", "데이터 전송 처리 후 오류가 발생했습니다.");
	    			}
	    		}else {
	    			model.addAttribute("result", "ERROR");
					model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
					model.addAttribute("msg", "데이터 전송에 성공했으나 결과 값을 받지 못했습니다.");
	    		}
			}else {
				model.addAttribute("result", "ERROR");
				model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
				model.addAttribute("msg", uri+" </br>데이터 전송 중 오류가 발생했습니다. </br>[http status code = "+responseResult.getStatusLine().getStatusCode()+"]");
			}
			
		}catch(Exception ex){
			ex.printStackTrace();
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("selectSendDataReceiver()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	@RequestMapping(value="/api/test/receiver.do")
	public String selectTestReceiver(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try {
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
						
			String data = (String) paramMap.get("data");
			System.out.println("###########");
			System.out.println(data);
			
						
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return "/top/lunaReceiver_test";
	}
}
