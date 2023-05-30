
package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.GsonBuilder;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.Dpl1000Service;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1000VO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1300VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.sdf.jenkins.AutoBuildInit;
import kr.opensoftlab.sdf.jenkins.JenkinsClient;
import kr.opensoftlab.sdf.util.OslAgileConstant;
import kr.opensoftlab.sdf.util.PagingUtil;
import kr.opensoftlab.sdf.util.RequestConvertor;



@Controller
public class Dpl1000Controller {

	
	protected Logger Log = Logger.getLogger(this.getClass());
	
	
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;
	
	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;
    
    
    @Resource(name = "dpl1000Service")
    private Dpl1000Service dpl1000Service;
    
	
    
    
    
    
	@Resource(name = "jen1000Service")
	private Jen1000Service jen1000Service;
	
	
    
    
	
	
	@Resource(name = "jenkinsClient")
	private JenkinsClient jenkinsClient;
	
	
	@Resource(name = "autoBuildInit")
	private AutoBuildInit autoBuildInit;
	
	@Value("${Globals.fileStorePath}")
	private String tempPath;
    
    
    
	@RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1000View.do")
    public String selectDpl1000View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	return "/dpl/dpl1000/dpl1000/dpl1000";
    }
	
    
     @SuppressWarnings({ "rawtypes", "unchecked" })
 	@RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1001View.do")
     public String selectDpl1001View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
 		
    	 try{
 			
 			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
 			
 			Map dpl1000DplInfo = null;
 			List<Map> dpl1000DplJobList = null;
 			String dpl1000DplJobListJson = "{}";
 			Map dpl1000DplJobParamMap = new HashMap<>();
 			String dpl1000DplJobParamListJson = "{}";
 			
 			
 			String pageType = paramMap.get("popupGb");
 			
 			
 			if( "update".equals(pageType) || "select".equals(pageType)){
 				dpl1000DplInfo = dpl1000Service.selectDpl1000DeployVerInfo(paramMap);
 				dpl1000DplJobList = dpl1000Service.selectDpl1300DeployJobList(paramMap);
 				
 				dpl1000DplJobListJson = (new GsonBuilder().serializeNulls().create()).toJsonTree(dpl1000DplJobList).toString();
 				
 				for(int i = 0 ; i<dpl1000DplJobList.size();i++) {
 					Map jobMap = (Map) dpl1000DplJobList.get(i);
 					paramMap.put("jenId", (String) jobMap.get("jenId"));
 					paramMap.put("jobId", (String) jobMap.get("jobId"));
 					
 					List<Map> dpl1000DplJobParamList = dpl1000Service.selectDpl1800JenParameterList(paramMap);
 					dpl1000DplJobParamMap.put(jobMap.get("jobId"), dpl1000DplJobParamList);
 					
 				}
 				
 				dpl1000DplJobParamListJson = (new GsonBuilder().serializeNulls().create()).toJsonTree(dpl1000DplJobParamMap).toString();
 			}
 			
 			model.put("dpl1000DplInfo", dpl1000DplInfo);
 			model.put("dpl1000DplJobList", dpl1000DplJobList);
 			model.put("dpl1000DplJobListJson", dpl1000DplJobListJson.replaceAll("<", "&lt"));
 			model.put("dpl1000DplJobParamMap", dpl1000DplJobParamMap);
 			model.put("dpl1000DplJobParamListJson", dpl1000DplJobParamListJson.replaceAll("<", "&lt"));

 			return "/dpl/dpl1000/dpl1000/dpl1001";
 		}
 		catch(Exception ex){
 			Log.error("selectReq1001View()", ex);
 			throw new Exception(ex.getMessage());
 		}
     }
    
     
     
     @RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1002View.do")
     public String selectDpl1002View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		 return "/dpl/dpl1000/dpl1000/dpl1002";
     }
     
     
     @SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1003View.do")
     public String selectDpl1003View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	  try{
 			
 			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
 			
 			
 			Map dpl1000DplInfo = dpl1000Service.selectDpl1000DeployVerInfo(paramMap);
 			List<Map> dpl1000DplJobList = dpl1000Service.selectDpl1300DeployJobList(paramMap);
			
 			model.put("dpl1000DplInfo", dpl1000DplInfo);
 			model.put("dpl1000DplJobList", dpl1000DplJobList);
 			
 			
 			
 			
 			model.put("callView", paramMap.get("callView"));

 			return "/dpl/dpl1000/dpl1000/dpl1003";
 		}
 		catch(Exception ex){
 			Log.error("selectDpl1003View()", ex);
 			throw new Exception(ex.getMessage());
 		}
    	 
     }
     
     
     @RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1004View.do")
     public String selectDpl1004View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		 return "/dpl/dpl1000/dpl1000/dpl1004";
     }
     
     
     @RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1005View.do")
     public String selectDpl1005View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	 return "/dpl/dpl1000/dpl1000/dpl1005";
     }

     
     @SuppressWarnings({ "unchecked", "rawtypes" })
     @RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1800JobParamList.do")
     public ModelAndView selectDpl1800JobParamList(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	 try{
    		 
    		 
    		 Map paramMap = RequestConvertor.requestParamToMap(request, true);
    		 
			List<Map> dpl1800JobParamList = dpl1000Service.selectDpl1800JenParameterList(paramMap);
    		 
    		 
    		 model.addAttribute("jobParamList", dpl1800JobParamList);
    		 
    		 
    		 model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
    		 
    		 return new ModelAndView("jsonView", model);
    	 }
    	 catch(Exception ex){
    		 Log.error("selectDpl1000DeployNmListAjax()", ex);
    		 
    		 
    		 model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
    		 return new ModelAndView("jsonView", model);
    	 }
     }
     
     
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1000DeployNmListAjax.do")
    public ModelAndView selectDpl1000DeployNmListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	try{

    		
        	Map paramMap = RequestConvertor.requestParamToMap(request, true);

        	
        	List<Map> dplDeployNmList = (List) dpl1000Service.selectDpl1000DeployNmList(paramMap);
        	
        	model.addAttribute("dplDeployNmList", dplDeployNmList);
        	
        	
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("selectDpl1000DeployNmListAjax()", ex);
    		
    		
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
    		return new ModelAndView("jsonView", model);
    	}
    }
    
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1000DeployVerInfoListAjax.do")
    public ModelAndView selectDpl1000DeployVerInfoListAjax(@ModelAttribute("dpl1000VO") Dpl1000VO dpl1000VO, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
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
			
			
			dpl1000VO.setPageIndex(_pageNo);
			dpl1000VO.setPageSize(_pageSize);
			dpl1000VO.setPageUnit(_pageSize);
        	
        	
        	PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(dpl1000VO); 
			List<Dpl1000VO> dpl1000List = null;
			
        	
        	dpl1000List = (List<Dpl1000VO>) dpl1000Service.selectDpl1000DeployVerInfoList(dpl1000VO);
        	
			int totCnt = dpl1000Service.selectDpl1000ListCnt(dpl1000VO);
					
        	paginationInfo.setTotalRecordCount(totCnt);
        	
        	model.addAttribute("list", dpl1000List);
        	
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",dpl1000VO.getPageIndex());
			pageMap.put("listCount", dpl1000List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);
			
			model.addAttribute("page", pageMap);
        	
        	
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("selectDpl1000DeployInfoListAjax()", ex);
    		
    		
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
    		return new ModelAndView("jsonView", model);
    	}
    }
	
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1300DplJobListAjax.do")
    public ModelAndView selectDpl1300DplJobListAjax(@ModelAttribute("dpl1300VO") Dpl1300VO dpl1300VO, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
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
			
			
			dpl1300VO.setPageIndex(_pageNo);
			dpl1300VO.setPageSize(_pageSize);
			dpl1300VO.setPageUnit(_pageSize);
        	
        	
        	PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(dpl1300VO); 
			List<Dpl1300VO> dpl1300List = null;
			
        	
        	dpl1300List = (List<Dpl1300VO>) dpl1000Service.selectDpl1300dplJobGridList(dpl1300VO);
        	
			int totCnt = dpl1000Service.selectDpl1300dplJobGridListCnt(dpl1300VO);
					
        	paginationInfo.setTotalRecordCount(totCnt);
        	
        	model.addAttribute("list", dpl1300List);
        	
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",dpl1300VO.getPageIndex());
			pageMap.put("listCount", dpl1300List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);
			
			model.addAttribute("page", pageMap);
        	
        	
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("selectDpl1300DplJobListAjax()", ex);
    		
    		
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
    		return new ModelAndView("jsonView", model);
    	}
    }
	
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/saveDpl1000DeployVerInfoAjax.do")
    public ModelAndView saveDpl1000DeployVerInfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	try{

    		
    		Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			if( paramMap.get("popupGb").toString().equals("insert") ){
	        	
	        	dpl1000Service.insertDpl1000DeployVerInfo(paramMap);
			} else {
				
				dpl1000Service.updateDpl1000DeployVerInfo(paramMap);
			}
        	
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.save"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("saveDpl1000DeployVerInfoAjax()", ex);
    		
    		
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
    		return new ModelAndView("jsonView", model);
    	}
	}
	
	
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/insertDpl1000DplsignRequestAjax.do")
    public ModelAndView insertDpl1000DplsignRequestAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	try{

    		
    		Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			dpl1000Service.insertDpl1000DplSignRequestList(paramMap);
			
        	
			model.addAttribute("errorYn", "N");
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.insert"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("insertDpl1000DplsignRequestAjax()", ex);
    		
    		
    		model.addAttribute("errorYn", "Y");
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.insert"));
    		return new ModelAndView("jsonView", model);
    	}
	}
	
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/deleteDpl1000DeployVerInfoListAjax.do")
    public ModelAndView deleteDpl1000DeployVerInfoListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model) throws Exception {
    	try{
    		
			Map<String, Object> paramMap = RequestConvertor.requestParamToMapAddSelInfoList(request, true,"dplId");
        	
    		dpl1000Service.deleteDpl1000DeployVerInfo(paramMap);
    		
    		
    		model.addAttribute("successYn", "Y");
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.delete"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("deleteSpr1000SprintInfoListAjax()", ex);
    		
    		
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.delete"));
    		return new ModelAndView("jsonView", model);
    	}
    }
	
	
	@RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1000BuildInfoListAjax.do")
    public ModelAndView selectDpl1000BuildInfoListAjax(@ModelAttribute("dpl1000VO") Dpl1000VO dpl1000VO, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
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
			
			
			dpl1000VO.setPageIndex(_pageNo);
			dpl1000VO.setPageSize(_pageSize);
			dpl1000VO.setPageUnit(_pageSize);
        	
        	
        	PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(dpl1000VO); 
			List<Dpl1000VO> dpl1000List = null;
						
        	
        	dpl1000List = (List<Dpl1000VO>) dpl1000Service.selectDpl1000BuildInfoList(dpl1000VO);
        	
			int totCnt = dpl1000Service.selectDpl1000BuildInfoListCnt(dpl1000VO);
					
        	paginationInfo.setTotalRecordCount(totCnt);
        	
        	model.addAttribute("list", dpl1000List);
        	
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",dpl1000VO.getPageIndex());
			pageMap.put("listCount", dpl1000List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);
			
			model.addAttribute("page", pageMap);
        	
        	
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("selectDpl1000BuildInfoListAjax()", ex);
    		
    		
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
    		return new ModelAndView("jsonView", model);
    	}
    }

     
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1000DplHistoryListAjax.do")
    public ModelAndView selectDpl1000DplHistoryListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	try{

    		
        	Map paramMap = RequestConvertor.requestParamToMap(request, true);

        	
        	List<Map> dplDplHistoryList = dpl1000Service.selectDpl1000DplHistoryList(paramMap);
        	
        	
        	List<Map> dplModifyHistoryList = dpl1000Service.selectDpl1500ModifyHistoryList(paramMap);
        	
        	
			List<Map> jobList = dpl1000Service.selectDpl1300DeployJobList(paramMap);
			
 			Map dpl1000DplJobParamMap = new HashMap<>();
			for(int i = 0 ; i<jobList.size();i++) {
				Map jobMap = (Map) jobList.get(i);
				paramMap.put("jenId", (String) jobMap.get("jenId"));
				paramMap.put("jobId", (String) jobMap.get("jobId"));
				
				List<Map> dpl1000DplJobParamList = dpl1000Service.selectDpl1800JenParameterList(paramMap);
				dpl1000DplJobParamMap.put(jobMap.get("jobId"), dpl1000DplJobParamList);
				
			}
			
        	model.addAttribute("dplDplHistoryList", dplDplHistoryList);
        	model.addAttribute("dplModifyHistoryList", dplModifyHistoryList);
        	model.addAttribute("jobList", jobList);
        	model.addAttribute("jobParamList", dpl1000DplJobParamMap);
        	
        	
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("selectDpl1000DplHistoryListAjax()", ex);
    		
    		
    		model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
    		return new ModelAndView("jsonView", model);
    	}
    }
	
	
	@SuppressWarnings({"rawtypes" })
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1400DplSelBuildConsoleLogAjax.do")
	public ModelAndView selectDpl1400DplSelBuildConsoleLogAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
    		
    		Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
    		
    		
    		Map dpl1400InfoMap = dpl1000Service.selectDpl1400DplSelBuildInfoAjax(paramMap);
 			
    		model.addAttribute("dpl1400InfoMap", dpl1400InfoMap);
			
    		model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView", model);
		}
		catch(Exception ex){
			Log.error("selectDpl1400DplSelBuildConsoleLogAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", "콘솔 내용 조회 오류");
			return new ModelAndView("jsonView", model);
		}
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1600DplSvnChangeLogListAjax.do")
	public ModelAndView selectDpl1600DplSvnChangeLogListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			List<Map> svnChangeLogList = dpl1000Service.selectDpl1600SvnChangeLogsList(paramMap);
			
			
			List<Map> svnChangePathsList = dpl1000Service.selectDpl1700SvnChangePathList(paramMap);
			
			model.addAttribute("svnChangeLogList", svnChangeLogList);
			model.addAttribute("svnChangePathsList", svnChangePathsList);
			
			
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView", model);
		}
		catch(Exception ex){
			Log.error("selectDpl1600DplSvnChangeLogListAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", "콘솔 내용 조회 오류");
			return new ModelAndView("jsonView", model);
		}
	}
	
}
