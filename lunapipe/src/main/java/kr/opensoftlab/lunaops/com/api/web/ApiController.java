package kr.opensoftlab.lunaops.com.api.web;

import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
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
import kr.opensoftlab.sdf.util.RequestConvertor;



@CrossOrigin
@Controller
public class ApiController {

	
	private static final Logger Log = Logger.getLogger(ApiController.class);

	
	@Resource(name = "apiService")
	protected ApiService apiService;
	
	
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/api/insertCIRepJenJob", method=RequestMethod.POST)
	public ModelAndView insertCIRepJenJob(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.insertCIRepJenJob(paramMap);
			
			
			boolean result = (boolean) rtnMap.get("result"); 
			
			
			int total = (int) rtnMap.get("total");
			int executed = (int) rtnMap.get("executed");
			
			
			List etcMsg = (List) rtnMap.get("etcMsg");
			
			
			if(executed == 0) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("total", total);
				model.addAttribute("executed", executed);
				model.addAttribute("error_code", OslErrorCode.DATA_INSERT_COUNT_NULL);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.DATA_INSERT_COUNT_NULL));
				model.addAttribute("etc_msg", String.join("\n", etcMsg));
			}
			
			else if(result) {
				
				if(executed < total) {
					model.addAttribute("etc_msg", String.join("\n", etcMsg));
				}
				
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("total", total);
				model.addAttribute("executed", executed);
				model.addAttribute("msg", "등록에 성공했습니다.");
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
				String ticketId = (String) rtnMap.get("ticketId");
				
				
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("dpl_id", newDplId);
				model.addAttribute("ticket_id", ticketId);
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
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/insertJobBldLogInfo", method=RequestMethod.GET)
	public ModelAndView insertJobBldLogInfo(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
						
			
			Map rtnMap = apiService.insertJobBldLogInfo(paramMap);
			
			if(rtnMap == null) {
				
				response.setStatus(500);
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
				return new ModelAndView("jsonView");
			}
			
			
			boolean result = (boolean) rtnMap.get("result");
			
			if(result) {
				response.setStatus(200);
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("msg", "정상적으로 생성되었습니다.");
			}else {
				response.setStatus(500);
				String errorCode = (String) rtnMap.get("error_code");
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}
			
			return new ModelAndView("jsonView");
			
			
		}catch(Exception ex){
			response.setStatus(500);
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("insertCITicketJobList()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/actionJobBuild", method=RequestMethod.GET)
	public ModelAndView actionJobBuild(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
						
			
			Map rtnMap = apiService.insertJobBldAction(paramMap);
			
			if(rtnMap == null) {
				
				response.setStatus(500);
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
				return new ModelAndView("jsonView");
			}
			
			
			boolean result = (boolean) rtnMap.get("result");
			
			String errorCode = (String) rtnMap.get("error_code");
			
			if(!result) {
				response.setStatus(500);
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				response.setStatus(200);
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("msg", "정상적으로 실행되었습니다.");
			}
		}catch(Exception ex){
			response.setStatus(500);
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("actionJobBuild()", ex);
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
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
				return new ModelAndView("jsonView");
			}
			
			boolean result = (boolean) rtnMap.get("result");
			
			String errorCode = (String) rtnMap.get("error_code");
			
			if(!result) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				model.addAttribute("result", "SUCCESS");
				
				
				String brancheNm = "";
				if(rtnMap.containsKey("brancheNm")) {
					brancheNm = (String) rtnMap.get("brancheNm");
				}
				
				String branchePath = "";
				if(rtnMap.containsKey("branchePath")) {
					branchePath = (String) rtnMap.get("branchePath");
				}
				
				
				String ticketId = "";
				if(rtnMap.containsKey("ticketId")) {
					ticketId = (String) rtnMap.get("ticketId");
				}
				
				String repId = "";
				if(rtnMap.containsKey("repId")) {
					repId = (String) rtnMap.get("repId");
				}
				
				model.addAttribute("branche_nm", brancheNm);
				model.addAttribute("branche_path", branchePath);
				model.addAttribute("ticket_id", ticketId);
				model.addAttribute("rep_id", repId);
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
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/insertRepRevisionInfo", method=RequestMethod.GET)
	public ModelAndView insertRepRevisionInfo(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			
			Map rtnMap = apiService.insertRepRevisionInfo(paramMap);
			if(rtnMap == null) {
				
				response.setStatus(500);
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
				return new ModelAndView("jsonView");
			}
			
			boolean result = (boolean) rtnMap.get("result");
			
			String errorCode = (String) rtnMap.get("error_code");
			
			if(!result) {
				response.setStatus(500);
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				response.setStatus(200);
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("rvInfoList", rtnMap.get("rvInfoList"));
				model.addAttribute("msg", "정상적으로 생성되었습니다.");
			}
		}catch(Exception ex){
			response.setStatus(500);
			ex.printStackTrace();
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("insertRepRevisionInfo()", ex);
		}
		return new ModelAndView("jsonView");
	}

	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/selectTicketRvDataList", method=RequestMethod.POST)
	public ModelAndView selectTicketRvDataList(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.selectTicketRvDataList(paramMap);
			
			if(rtnMap == null) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
				return new ModelAndView("jsonView");
			}
			
			boolean result = (boolean) rtnMap.get("result");
			
			String errorCode = (String) rtnMap.get("error_code");
			
			if(!result) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("ticket_rv_list", rtnMap.get("ticketRvList"));
				model.addAttribute("msg", "정상적으로 조회되었습니다.");
			}
			
		}catch(Exception ex){
			ex.printStackTrace();
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("selectTicketRvDataList()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/selectTicketDplFileDataList", method=RequestMethod.POST)
	public ModelAndView selectTicketDplFileDataList(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.selectTicketDplFileDataList(paramMap);
			
			if(rtnMap == null) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
				return new ModelAndView("jsonView");
			}
			
			boolean result = (boolean) rtnMap.get("result");
			
			String errorCode = (String) rtnMap.get("error_code");
			
			if(!result) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("ticket_deploy_file_list", rtnMap.get("ticketDplSelFileList"));
				model.addAttribute("msg", "정상적으로 조회되었습니다.");
			}
			
		}catch(Exception ex){
			ex.printStackTrace();
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("selectTicketRvDataList()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/selectTicketCheck", method=RequestMethod.GET)
	public ModelAndView selectTicketCheck(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			
			Map rtnMap = apiService.selectTicketCheck(paramMap);
			
			if(rtnMap == null) {
				
				response.setStatus(500);
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
				return new ModelAndView("jsonView");
			}
			
			boolean result = (boolean) rtnMap.get("result");
			
			String errorCode = (String) rtnMap.get("error_code");
			
			if(!result) {
				response.setStatus(500);
				model.addAttribute("result", "FAIL");
				model.addAttribute("error_code", errorCode);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(errorCode));
			}else {
				response.setStatus(200);
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("rvInfoList", rtnMap.get("rvInfoList"));
				model.addAttribute("msg", "데이터 체크 성공");
			}
		}catch(Exception ex){
			response.setStatus(500);
			ex.printStackTrace();
			model.addAttribute("result", "ERROR");
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.SERVER_ERROR));
			Log.error("selectTicketCheck()", ex);
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
			
			
			String eGeneUrl = (String) paramMap.get("eGeneUrl");
			
			
			if(eGeneUrl == null || "".equals(eGeneUrl)) {
				eGeneUrl = EgovProperties.getProperty("Globals.eGene.url");
			}
			
			
			if(eGeneUrl.lastIndexOf("/") != (eGeneUrl.length()-1)) {
				
				eGeneUrl = eGeneUrl + "/";
			}
			
			
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
			/*
			
			String salt = EgovProperties.getProperty("Globals.data.salt");

			
			String eGeneUrl = EgovProperties.getProperty("Globals.eGene.url");
			
			
			String reciverData = "{\"key\":\""+salt+"\", \"ticket_id\":\"CH2211-00009\"}";
			
			String enReciverData = CommonScrty.encryptedAria(reciverData, salt);
			
			
			HttpGet methodGet = new HttpGet();
			URI uri = new URI(eGeneUrl+"plugins/jsp/isTicket.jsp?data="+URLEncoder.encode(enReciverData,"UTF-8"));
			methodGet.setURI(uri);
			
			HttpClient client = OslConnHttpClient.getHttpClient();
			
			
			HttpResponse responseResult = client.execute(methodGet);
			
			
			if(responseResult.getStatusLine() != null && responseResult.getStatusLine().getStatusCode() == 200) {
				
	    		String returnContent = EntityUtils.toString(responseResult.getEntity());
	    		
	    		System.out.println("############");
	    		System.out.println("############");
	    		System.out.println(returnContent);
	    		String tmp = returnContent.replaceAll("\\s", "");
	    		if("true".equals(tmp)) {
	    			System.out.println("ok");
	    		}else {
	    			System.out.println("fail");
	    		}
			}
			*/
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return "/top/lunaReceiver_test";
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/api/deleteCIRepJenJob", method=RequestMethod.POST)
	public ModelAndView deleteCIRepJenJob(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map rtnMap = apiService.deleteCIRepJenJob(paramMap);
			
			
			boolean result = (boolean) rtnMap.get("result"); 
			
			
			int total = (int) rtnMap.get("total");
			int executed = (int) rtnMap.get("executed");
			
			
			List etcMsg = (List) rtnMap.get("etcMsg");
			
			
			if(executed == 0) {
				model.addAttribute("result", "FAIL");
				model.addAttribute("total", total);
				model.addAttribute("executed", executed);
				model.addAttribute("error_code", OslErrorCode.DATA_DELETE_COUNT_NULL);
				model.addAttribute("msg", OslErrorCode.getErrorMsg(OslErrorCode.DATA_DELETE_COUNT_NULL));
				model.addAttribute("etc_msg", String.join("\n", etcMsg));
			}
			
			else if(result) {
				
				if(executed < total) {
					model.addAttribute("etc_msg", String.join("\n", etcMsg));
				}
				
				model.addAttribute("result", "SUCCESS");
				model.addAttribute("total", total);
				model.addAttribute("executed", executed);
				model.addAttribute("msg", "삭제에 성공했습니다.");
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
			Log.error("deleteCIRepJenJob()", ex);
			
		}
		return new ModelAndView("jsonView");
	}
}
