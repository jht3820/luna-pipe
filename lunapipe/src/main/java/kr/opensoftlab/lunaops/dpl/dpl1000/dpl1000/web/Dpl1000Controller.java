
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
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.Dpl1000Service;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1100VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.sdf.jenkins.AutoBuildInit;
import kr.opensoftlab.sdf.jenkins.NewJenkinsClient;
import kr.opensoftlab.sdf.jenkins.service.BuildService;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;
import kr.opensoftlab.sdf.jenkins.vo.JenStatusVO;
import kr.opensoftlab.sdf.util.CommonScrty;
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
	
	
	@Resource(name = "buildService")
	private BuildService buildService;
    
    
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
     
     
     @SuppressWarnings({ "unchecked", "rawtypes" })
     @RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1100BldingJobList.do")
     public ModelAndView selectDpl1100BldingJobList(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
    	 try{
    		 
    		 
    		 Map paramMap = RequestConvertor.requestParamToMap(request, true);
    		 
    		 
    		 paramMap.put("buildingChkFlag", "Y");
    		 
    		 List<Map> bldingJobList = dpl1000Service.selectDpl1100DeployJobList(paramMap);
    		 
    		 model.addAttribute("bldingJobList", bldingJobList);
    		 
    		 
    		 model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
    		 model.addAttribute("errorYn", "N");
    		 return new ModelAndView("jsonView", model);
    	 }
    	 catch(Exception ex){
    		 Log.error("selectDpl1100BldingJobList()", ex);
    		 
    		 
    		 model.addAttribute("errorYn", "Y");
    		 model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
    		 return new ModelAndView("jsonView", model);
    	 }
     }
    
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1100DplJobListAjax.do")
    public ModelAndView selectDpl1100DplJobListAjax(@ModelAttribute("dpl1100VO") Dpl1100VO dpl1100VO, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
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
			
			
			dpl1100VO.setPageIndex(_pageNo);
			dpl1100VO.setPageSize(_pageSize);
			dpl1100VO.setPageUnit(_pageSize);
        	
        	
        	PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(dpl1100VO); 
			List<Dpl1100VO> dpl1300List = null;
			
        	
        	dpl1300List = (List<Dpl1100VO>) dpl1000Service.selectDpl1100dplJobGridList(dpl1100VO);
        	
			int totCnt = dpl1000Service.selectDpl1100dplJobGridListCnt(dpl1100VO);
					
        	paginationInfo.setTotalRecordCount(totCnt);
        	
        	model.addAttribute("list", dpl1300List);
        	
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",dpl1100VO.getPageIndex());
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
	
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1000JobBuildStopAjax.do")
	public ModelAndView selectDpl1000JobBuildStopAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		JenStatusVO jenStatusVo = null;
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String jenUrl= (String)paramMap.get("jenUrl");
    		String jenUsrId= (String)paramMap.get("jenUsrId");
			String jenUsrTok= (String)paramMap.get("jenUsrTok");
			String jobId= (String)paramMap.get("jobId");

			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String deJenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			
			
			jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, deJenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView");
			}
			
			jenStatusVo = newJenkinsClient.executeJobBldStop(jenStatusVo, jobId);
			
			
			int statusCode = jenStatusVo.getStatusCode();
			
			
			if(jenStatusVo.isErrorFlag()) {
				
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView", model);
			}
			
			else if(statusCode == 204){
				
				model.addAttribute("bldResultCd", "09");
				model.addAttribute("bldResult", "CANCELLED");
				
				model.addAttribute("errorYn", "N");
				model.addAttribute("message", jenStatusVo.getResultMsg());
				return new ModelAndView("jsonView", model);
			}
			else if(statusCode == 200){
				
				model.addAttribute("bldResultCd", "05");
				model.addAttribute("bldResult", "ABORTED");
				
				model.addAttribute("errorYn", "N");
				model.addAttribute("message", jenStatusVo.getResultMsg());
				return new ModelAndView("jsonView", model);
			}
			else {
				
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", "[CODE="+statusCode+"] 빌드 중지 중 오류가 발생했습니다.");
				return new ModelAndView("jsonView", model);
			}
		}
		catch(Exception ex){
			Log.error("selectDpl1000JobBuildStopAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", "빌드 중지 실패");
			return new ModelAndView("jsonView", model);
		}finally {
			
			if(jenStatusVo != null) {
				newJenkinsClient.close(jenStatusVo);
			}
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(method=RequestMethod.POST, value="/dpl/dpl1000/dpl1000/selectDpl1000JobBuildAjax.do")
	public ModelAndView selectDpl1000JobBuildAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		JenStatusVO jenStatusVo = null;
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String jenId= (String)paramMap.get("jenId");
			String jenUrl= (String)paramMap.get("jenUrl");
    		String jenUsrId= (String)paramMap.get("jenUsrId");
			String jenUsrTok= (String)paramMap.get("jenUsrTok");
			String jobId= (String)paramMap.get("jobId");
			String jobTok= (String)paramMap.get("jobTok");
			String dplTypeCd= (String)paramMap.get("dplTypeCd");
			String ciId= (String)paramMap.get("ciId");
			String ticketId= (String)paramMap.get("ticketId");
			String dplId= (String)paramMap.get("dplId");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String deJenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			String deJobToken = CommonScrty.decryptedAria(jobTok, salt);
			
			
			jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, deJenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView");
			}
			
			
			Map jobInfo = newJenkinsClient.getJobInfo(jenStatusVo, jobId);
			
			
			if(jobInfo == null) {
				newJenkinsClient.close(jenStatusVo);
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", "JOB 정보 조회 중 오류가 발생했습니다.");
				return new ModelAndView("jsonView", model);
			}
			
			
			boolean isStartBuildable = (boolean) jobInfo.get("isStartBuildable");
			
			
			if(!isStartBuildable) {
				newJenkinsClient.close(jenStatusVo);
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", egovMessageSource.getMessage("fail.deploy.building"));
				return new ModelAndView("jsonView", model);
			}
			
			List<Map> jobParamList = dpl1000Service.selectDpl1101JenParameterList(paramMap);
   		 
			
			BuildVO buildVo = new BuildVO();
			buildVo.setJenId(jenId);
			buildVo.setJenUrl(jenUrl);
			buildVo.setUserId(jenUsrId);
			buildVo.setDeTokenId(deJenUsrTok);
			buildVo.setDeJobToken(deJobToken);
			buildVo.setJobId(jobId);
			buildVo.setDplTypeCd(dplTypeCd);
			buildVo.setJenStatusVo(jenStatusVo);
			buildVo.setJobParamList(jobParamList);
			buildVo.setCiId(ciId);
			buildVo.setTicketId(ticketId);
			buildVo.setDplId(dplId);
			
			
			buildVo.addBldActionLog(jobId+" JOB 빌드를 준비 중입니다.");
			
			
			BuildVO rtnBuildVo = buildService.insertJobBuildAction(buildVo);
			
			
			model.addAttribute("bldEtmDurationTm", rtnBuildVo.getBldEtmDurationTm());
			
			model.addAttribute("bldResultCd", rtnBuildVo.getBldResultCd());
			model.addAttribute("bldResult", rtnBuildVo.getBldResult());
			
			model.addAttribute("bldActionLog", rtnBuildVo.getBldActionLog());
			model.addAttribute("bldNum", rtnBuildVo.getBldNum());
			
			
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
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1000JobConsoleLogAjax.do")
	public ModelAndView selectDpl1000JobConsoleLogAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			Map jobMap = jen1000Service.selectJen1100JobInfo(paramMap);
			
			String jenUrl = (String) jobMap.get("jenUrl");
			String jenUsrId = (String) jobMap.get("jenUsrId");
			String jenUsrTok = (String) jobMap.get("jenUsrTok");
			String jobId = (String) jobMap.get("jobId");
			String targetBldNum = (String) paramMap.get("targetBldNum");
			
			
			
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String deJenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			
			
			JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, deJenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", jenStatusVo.getErrorMsg());
			}
			
			
			Map jobInfo = newJenkinsClient.getJobInfo(jenStatusVo, jobId);

			
			if(jobInfo == null) {
				newJenkinsClient.close(jenStatusVo);
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", "JENKINS에서 해당 JOB을 찾을 수 없습니다.");
				return new ModelAndView("jsonView", model);
			}
			
			
			boolean isBuilding = (boolean) jobInfo.get("isBuilding");
			boolean isInQueue = (boolean) jobInfo.get("isInQueue");
			
			
			Map bldInfo = null;
			
			
			if(isBuilding || isInQueue) {
				int bldNum = 0;
				
				if(targetBldNum == null) {
					bldNum = (int)jobInfo.get("lastBuildNum");
				}else {
					bldNum = Integer.parseInt(targetBldNum);
				}
				
				
				bldInfo = newJenkinsClient.getJobBldNumInfo(jenStatusVo, jobId, bldNum);
				bldInfo.put("bldResultCd", "02");
				bldInfo.put("bldResult", "BUILDING");
			}else {
				
				
				bldInfo = jen1000Service.selectJen1200JobLastBuildInfo(paramMap);
				
				
				String bldResultCd = null;
				String bldResult = null;
				if(bldInfo != null) {
					bldResultCd = (String) bldInfo.get("bldResultCd");
					bldResult = (String) bldInfo.get("bldResult");
				}
				
				
				if(bldInfo != null && !"01".equals(bldResultCd) && !"02".equals(bldResultCd)) {
					
					String bldNum = String.valueOf(bldInfo.get("bldNum"));
					paramMap.put("bldNum", bldNum);
					
					
					List<Map> jobLastBuildChgList = jen1000Service.selectJen1201JobLastBuildChgList(paramMap);
					
					
					List<Map> jobLastBuildFileChgList = jen1000Service.selectJen1202JobLastBuildFileChgList(paramMap);

					
					bldInfo.put("bldChgList", jobLastBuildChgList);
					bldInfo.put("bldChgFileList", jobLastBuildFileChgList);
				}else {
					
					
					if(!jobInfo.isEmpty()) {
						boolean hasLastBuildRun = (boolean)jobInfo.get("hasLastBuildRun"); 
						
						
						if(hasLastBuildRun) {
							int lastBuildNum = (int)jobInfo.get("lastBuildNum");
							
							
							bldInfo = newJenkinsClient.getJobBldNumInfo(jenStatusVo, jobId, lastBuildNum);
							
							if(bldInfo != null) {
								bldResultCd = (String) bldInfo.get("bldResultCd");
								bldResult = (String) bldInfo.get("bldResult");
								
								
								if("01".equals(bldResultCd) || "02".equals(bldResultCd)) {
									
									bldInfo.put("bldResultCd", bldResultCd);
									bldInfo.put("bldResult", bldResult);
								}
							}
						}
					}
				}
			}
			
			model.addAttribute("bldInfo", bldInfo);
			
			
			model.addAttribute("jobMap", jobMap);
			
			model.addAttribute("errorYn", "N");
			return new ModelAndView("jsonView");
			
		}catch(Exception ex){
			Log.error("selectDpl1000JobConsoleLogAjax()", ex);
			
			
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			model.addAttribute("errorYn", "Y");
			return new ModelAndView("jsonView");
		}
	}
	
}
