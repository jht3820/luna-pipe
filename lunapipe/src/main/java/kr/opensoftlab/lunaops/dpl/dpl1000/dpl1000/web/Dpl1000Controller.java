
package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpStatus;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.Dpl1000Service;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1000VO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1100VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.sdf.jenkins.AutoBuildInit;
import kr.opensoftlab.sdf.jenkins.NewJenkinsClient;
import kr.opensoftlab.sdf.jenkins.vo.JenStatusVO;
import kr.opensoftlab.sdf.util.OslAgileConstant;
import kr.opensoftlab.sdf.util.OslUtil;
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
	
	
    
    

	
	@Resource(name = "newJenkinsClient")
	private NewJenkinsClient newJenkinsClient;
	
	
	@Resource(name = "autoBuildInit")
	private AutoBuildInit autoBuildInit;
	
	@Value("${Globals.fileStorePath}")
	private String tempPath;
    
    
	@RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1000View.do")
    public String selectDpl1000View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try {
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			
			
			if(ciId == null) {
				response.setStatus(HttpStatus.SC_BAD_REQUEST);
				model.put("errorMsg", "구성항목 ID가 없습니다.");
				return "/err/error";
			}
			
			
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			
			if(ticketId == null) {
				response.setStatus(HttpStatus.SC_BAD_REQUEST);
				model.put("errorMsg", "티켓 ID가 없습니다.");
				return "/err/error";
			}
			
			
			
			String dplId = OslUtil.jsonGetString(jsonObj, "dpl_id");
			
			
			if(dplId == null) {
				response.setStatus(HttpStatus.SC_BAD_REQUEST);
				model.put("errorMsg", "배포계획 ID가 없습니다.");
				return "/err/error";
			}
			
			model.put("ciId", ciId);
			model.put("ticketId", ticketId);
			model.put("dplId", dplId);
			
		}catch(Exception e) {
			response.setStatus(HttpStatus.SC_BAD_REQUEST);
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}
		
    	return "/dpl/dpl1000/dpl1000/dpl1000";
    }
	
	
	@RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1001View.do")
	public String selectDpl1001View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/dpl/dpl1000/dpl1000/dpl1001";
	}

     
     @SuppressWarnings({ "unchecked", "rawtypes" })
     @RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1101JobParamList.do")
     public ModelAndView selectDpl1101JobParamList(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	 try{
    		 
    		 
    		 Map paramMap = RequestConvertor.requestParamToMap(request, true);
    		 
			List<Map> jobParamList = dpl1000Service.selectDpl1101JenParameterList(paramMap);
    		 
    		 model.addAttribute("jobParamList", jobParamList);
    		 
    		 
    		 model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
    		 model.addAttribute("errorYn", "N");
    		 return new ModelAndView("jsonView", model);
    	 }
    	 catch(Exception ex){
    		 Log.error("selectDpl1000DeployNmListAjax()", ex);
    		 
    		 
    		 model.addAttribute("errorYn", "Y");
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
	
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1100DplJobListAjax.do")
    public ModelAndView selectDpl1100DplJobListAjax(@ModelAttribute("dpl1300VO") Dpl1100VO dpl1300VO, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
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
			List<Dpl1100VO> dpl1300List = null;
			
        	
        	dpl1300List = (List<Dpl1100VO>) dpl1000Service.selectDpl1100dplJobGridList(dpl1300VO);
        	
			int totCnt = dpl1000Service.selectDpl1100dplJobGridListCnt(dpl1300VO);
					
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
    		Log.error("selectDpl1100DplJobListAjax()", ex);
    		
    		
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
        	
        	
			List<Map> jobList = dpl1000Service.selectDpl1100DeployJobList(paramMap);
			
 			Map dpl1000DplJobParamMap = new HashMap<>();
			for(int i = 0 ; i<jobList.size();i++) {
				Map jobMap = (Map) jobList.get(i);
				paramMap.put("jenId", (String) jobMap.get("jenId"));
				paramMap.put("jobId", (String) jobMap.get("jobId"));
				
				List<Map> dpl1000DplJobParamList = dpl1000Service.selectDpl1101JenParameterList(paramMap);
				dpl1000DplJobParamMap.put(jobMap.get("jobId"), dpl1000DplJobParamList);
				
			}
			
        	model.addAttribute("dplDplHistoryList", dplDplHistoryList);
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
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1200DplSelBuildConsoleLogAjax.do")
	public ModelAndView selectDpl1200DplSelBuildConsoleLogAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
    		
    		Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
    		
    		
    		Map dpl1400InfoMap = dpl1000Service.selectDpl1200DplSelBuildInfoAjax(paramMap);
 			
    		model.addAttribute("dpl1400InfoMap", dpl1400InfoMap);
			
    		model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView", model);
		}
		catch(Exception ex){
			Log.error("selectDpl1200DplSelBuildConsoleLogAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", "콘솔 내용 조회 오류");
			return new ModelAndView("jsonView", model);
		}
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1201DplSvnChangeLogListAjax.do")
	public ModelAndView selectDpl1201DplSvnChangeLogListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			List<Map> svnChangeLogList = dpl1000Service.selectDpl1201SvnChangeLogsList(paramMap);
			
			
			List<Map> svnChangePathsList = dpl1000Service.selectDpl1202SvnChangePathList(paramMap);
			
			model.addAttribute("svnChangeLogList", svnChangeLogList);
			model.addAttribute("svnChangePathsList", svnChangePathsList);
			
			
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView", model);
		}
		catch(Exception ex){
			Log.error("selectDpl1201DplSvnChangeLogListAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", "콘솔 내용 조회 오류");
			return new ModelAndView("jsonView", model);
		}
	}
	
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1000JobBuildAjax.do")
	public ModelAndView selectDpl1000JobBuildAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String jenUrl= (String)paramMap.get("jenUrl");
    		String jenUsrId= (String)paramMap.get("jenUsrId");
			String jenUsrTok= (String)paramMap.get("jenUsrTok");
			String jobId= (String)paramMap.get("jobId");
			
			
			JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, jenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView");
			}
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.deploy.build"));
			return new ModelAndView("jsonView", model);
		}
		catch(Exception ex){
			Log.error("selectDpl1000JobBuildAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.deploy.build"));
			return new ModelAndView("jsonView", model);
		}
	}
	
}
