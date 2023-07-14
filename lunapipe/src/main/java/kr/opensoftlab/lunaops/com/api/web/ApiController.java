package kr.opensoftlab.lunaops.com.api.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import egovframework.rte.fdl.property.EgovPropertyService;
import kr.opensoftlab.lunaops.com.api.service.ApiService;
import kr.opensoftlab.lunaops.com.vo.OslErrorCode;



@Controller
public class ApiController {

	
	private static final Logger Log = Logger.getLogger(ApiController.class);

	
	@Resource(name = "apiService")
	protected ApiService apiService;
	
	
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;
	
	
	@RequestMapping(value="/api/insertCIRepJenJob", method=RequestMethod.POST)
	public ModelAndView insertCIRepJenJob(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			String rtnCode = apiService.insertCIRepJenJob(paramMap);

			
			if("-1".equals(rtnCode)) {
				model.addAttribute("result", true);
				model.addAttribute("message", "정상적으로 등록되었습니다.");
			}else {
				model.addAttribute("result", false);
				model.addAttribute("error_code", rtnCode);
				model.addAttribute("message", "오류가 발생했습니다.");
			}
		}catch(Exception ex){
			model.addAttribute("result", false);
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("message", "오류가 발생했습니다.");
			Log.error("insertCIRepJenJob()", ex);
			
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/selectCIRepList", method=RequestMethod.POST)
	public ModelAndView selectCIRepList(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map ciRepJenJobList = apiService.selectCIRepJenJob(paramMap);
			
			
			if(ciRepJenJobList.containsKey("is_Error") && (boolean) ciRepJenJobList.get("is_Error")) {
				model.addAttribute("result", false);
				model.addAttribute("error_code", ciRepJenJobList.get("error_code"));
				model.addAttribute("message", "오류가 발생했습니다.");
			}else {
				model.addAttribute("result", true);
				model.addAttribute("data", ciRepJenJobList);
				model.addAttribute("message", "정상적으로 조회되었습니다.");
			}
		} 
		catch(Exception ex){
			model.addAttribute("result", false);
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("message", "오류가 발생했습니다.");
			Log.error("selectCIRepList()", ex);
			ex.printStackTrace();
		}
		return new ModelAndView("jsonView");
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/api/selectCIRepJenJob", method=RequestMethod.POST)
	public ModelAndView selectCIRepJenJob(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map ciRepJenJobList = apiService.selectCIRepJenJob(paramMap);
			
			
			if(ciRepJenJobList.containsKey("is_Error") && (boolean) ciRepJenJobList.get("is_Error")) {
				model.addAttribute("result", false);
				model.addAttribute("error_code", ciRepJenJobList.get("error_code"));
				model.addAttribute("message", "오류가 발생했습니다.");
			}else {
				model.addAttribute("result", true);
				model.addAttribute("data", ciRepJenJobList);
			}
		} 
		catch(Exception ex){
			model.addAttribute("result", false);
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("message", "오류가 발생했습니다.");
			Log.error("insertCIRepJenJob()", ex);
		}
		return new ModelAndView("jsonView");
	}
	
	
	@RequestMapping(value="/api/insertCITicketJobList", method=RequestMethod.POST)
	public ModelAndView insertCITicketJobList(@RequestBody HashMap<String, Object> paramMap, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> rtnMap = apiService.insertCITicketJobList(paramMap);

			String errorYn = (String) rtnMap.get("errorYn");
			String errorCode = (String) rtnMap.get("errorCode");
			
			
			if("N".equals(errorYn)) {
				String newDplId = (String) rtnMap.get("newDplId");
				
				
				model.addAttribute("result", true);
				model.addAttribute("dpl_id", newDplId);
				model.addAttribute("message", "정상적으로 등록되었습니다.");
				
			}else {
				model.addAttribute("result", false);
				model.addAttribute("error_code", errorCode);
				model.addAttribute("message", "오류가 발생했습니다.");
			}
		}catch(Exception ex){
			model.addAttribute("result", false);
			model.addAttribute("error_code", OslErrorCode.SERVER_ERROR);
			model.addAttribute("message", "오류가 발생했습니다.");
			Log.error("insertCITicketJobList()", ex);
		}
		return new ModelAndView("jsonView");
	}
}
