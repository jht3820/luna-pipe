package kr.opensoftlab.lunaops.whk.whk1000.whk1000.web;

import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.message.BasicNameValuePair;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.opensoftlab.lunaops.com.vo.PageVO;
import kr.opensoftlab.lunaops.whk.whk1000.whk1000.service.Whk1000Service;
import kr.opensoftlab.sdf.util.OslAgileConstant;
import kr.opensoftlab.sdf.util.OslConnHttpClient;
import kr.opensoftlab.sdf.util.OslUtil;
import kr.opensoftlab.sdf.util.PagingUtil;
import kr.opensoftlab.sdf.util.RequestConvertor;



@Controller
public class Whk1000Controller {

	
	private final Logger Log = Logger.getLogger(this.getClass());

	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	@Resource(name = "whk1000Service")
	private Whk1000Service whk1000Service;
	
	
	@RequestMapping(value="/whk/whk1000/whk1000/selectWhk1000View.do")
	public String selectWhk1000View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try {
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String webhook_type_cd = OslUtil.jsonGetString(jsonObj, "webhook_type_cd");
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			
			model.addAttribute("webhookTypeCd", webhook_type_cd);
			model.addAttribute("empId", empId);
			
		}catch(Exception e) {
			response.setStatus(HttpStatus.SC_BAD_REQUEST);
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}
		
		return "/whk/whk1000/whk1000/whk1000";
	}
	
	
	@RequestMapping(value="/whk/whk1000/whk1000/selectWhk1001View.do")
	public String selectWhk1001View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/whk/whk1000/whk1000/whk1001";
	}

	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/whk/whk1000/whk1000/selectWhk1000WebhookListAjax.do")
	public ModelAndView selectWhk1000WebhookListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			String _pageNo_str = paramMap.get("pageNo");
			String _pageSize_str = paramMap.get("pageSize");
			
			int _pageNo = 1;
			int _pageSize = OslAgileConstant.pageSize;
			
			if(_pageNo_str != null && !"".equals(_pageNo_str)){
				_pageNo = Integer.parseInt(_pageNo_str)+1;  
			}
			if(_pageSize_str != null && !"".equals(_pageSize_str)){
				_pageSize = Integer.parseInt(_pageSize_str);  
			}
			
			
			PageVO pageVo = new PageVO();
			
			
			pageVo.setPageIndex(_pageNo);
			pageVo.setPageSize(_pageSize);
			pageVo.setPageUnit(_pageSize);
			
			
			PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(pageVo);  

			List<Map> rep1100List = null;

			
			paramMap.put("firstIndex", String.valueOf(pageVo.getFirstIndex()));
			paramMap.put("lastIndex", String.valueOf(pageVo.getLastIndex()));
			
			
			int totCnt = 0;
			rep1100List =  whk1000Service.selectWhk1000List(paramMap);
			
			
			totCnt = whk1000Service.selectWhk1000ListCnt(paramMap);
			paginationInfo.setTotalRecordCount(totCnt);
			
			model.addAttribute("list", rep1100List);
			
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",pageVo.getPageIndex());
			pageMap.put("listCount", rep1100List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);
			
			model.addAttribute("page", pageMap);
			
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectWhk1000WebhookListAjax()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/whk/whk1000/whk1000/saveWhk1000WebhookInfoAjax.do")
	public ModelAndView saveWhk1000WebhookInfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			
			String type = (String) paramMap.get("type");
			
			
			String webhookTargetUrl = (String) paramMap.get("webhookTargetUrl");
			
			URI targetUrl = new URI(webhookTargetUrl);
			
			
			if(!targetUrl.isAbsolute()) {
				
				model.addAttribute("errorYn", 'Y');
				model.addAttribute("message", "웹훅 대상 URL 값을 확인해주세요.");
				return new ModelAndView("jsonView");
			}
			
			
			if("insert".equals(type)) {
				String newWebhookId = whk1000Service.insertWhk1000Info(paramMap);
				model.addAttribute("newWebhookId", newWebhookId);
			}
			
			else if("update".equals(type)) {
				whk1000Service.updateWhk1000Info(paramMap);
			}
			
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", egovMessageSource.getMessage("success.common.save"));
			
			return new ModelAndView("jsonView");
		}
		catch(URISyntaxException uriE) {
			Log.error("saveWhk1000WebhookInfoAjax()", uriE);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", "웹훅 대상 URL 값을 확인해주세요.");
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("saveWhk1000WebhookInfoAjax()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/whk/whk1000/whk1000/selectWhk1000WebhookInfoAjax.do")
	public ModelAndView selectWhk1000WebhookInfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			Map whkInfo = whk1000Service.selectWhk1000Info(paramMap);
			model.addAttribute("whkInfo", whkInfo);
			
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectWhk1000WebhookInfoAjax()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/whk/whk1000/whk1000/deleteWhk1000WebhookListAjax.do")
	public ModelAndView deleteWhk1000WebhookListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, Object> paramMap = RequestConvertor.requestParamToMapAddSelInfoList(request, true, "webhookId");
			
			
			whk1000Service.deleteWhk1000List(paramMap);
			
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", egovMessageSource.getMessage("success.common.delete"));
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("deleteWhk1000WebhookListAjax()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.delete"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/whk/whk1000/whk1000/selecctWhk1001ConnTestAjax.do")
	public ModelAndView selecctWhk1001ConnTestAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String webhookTypeCd = paramMap.get("webhookTypeCd");
			String webhookNm = paramMap.get("webhookNm");
			String webhookTargetUrl = paramMap.get("webhookTargetUrl");
			String contentTypeCd = paramMap.get("contentTypeCd");
			String type = paramMap.get("type");
			String empId = paramMap.get("empId");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
			
			
			String webhookId = "WHK0000000000001";
			
			
			if("update".equals(type)) {
				String paramWebhookId = paramMap.get("webhookId");
				webhookId = paramWebhookId;
			}
			
			String key1 = null;
			String key2 = null;
			
			
			if("01".equals(webhookTypeCd)) {
				key1 = "REP0000000000001";
			}
			
			else if("02".equals(webhookTypeCd)) {
				key1 = "JEN0000000000001";
				key2 = "CONN_TEST_JOB";
			}
			
			try {
				
				URI uri = new URI(webhookTargetUrl);
				
				
				HttpPost methodPost = new HttpPost();
				methodPost.setURI(uri);
				
				
				HttpHeaders headers = new HttpHeaders();
				
				
				JSONObject paramJsonObj = new JSONObject();
				paramJsonObj.put("whk_id", webhookId);
				paramJsonObj.put("whk_type", webhookTypeCd);
				paramJsonObj.put("whk_chg_type", "01");
				paramJsonObj.put("whk_target_key1", key1);
				paramJsonObj.put("whk_target_key2", key2);
				paramJsonObj.put("whk_usr_id", empId);
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
					nameValuePair.add(new BasicNameValuePair("whk_chg_type","01"));
					nameValuePair.add(new BasicNameValuePair("whk_target_key1",key1));
					nameValuePair.add(new BasicNameValuePair("whk_target_key2",key2));
					nameValuePair.add(new BasicNameValuePair("whk_usr_id",empId));
					nameValuePair.add(new BasicNameValuePair("whk_dtm",sdf.format(new Date())));
					
					
					methodPost.setEntity(new UrlEncodedFormEntity(nameValuePair));
				}else {
					
					
				}
				
				HttpClient client = OslConnHttpClient.getHttpClient();
				
				
				HttpResponse responseResult = client.execute(methodPost);
				
				
				if(responseResult.getStatusLine() != null) {
					
					if(responseResult.getStatusLine().getStatusCode() == 200) {
						
						model.addAttribute("errorYn", 'N');
						model.addAttribute("message", "[NAME="+webhookNm+"] 접속 테스트 성공");
						return new ModelAndView("jsonView");
					}else {
						
						model.addAttribute("errorYn", 'Y');
						model.addAttribute("message", "[NAME="+webhookNm+"] 전송 실패(status_code="+responseResult.getStatusLine().getStatusCode()+")");
						return new ModelAndView("jsonView");
					}
				}
			}catch(Exception e) {
				
				Log.error(e);
				
				
				model.addAttribute("errorYn", 'Y');
				model.addAttribute("message", e.getMessage());
				return new ModelAndView("jsonView");
			}
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", "[NAME="+webhookNm+"] 접속 테스트 성공");
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selecctWhk1001ConnTestAjax()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
}
