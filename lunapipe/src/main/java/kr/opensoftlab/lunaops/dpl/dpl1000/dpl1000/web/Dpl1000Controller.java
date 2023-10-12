
package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.web;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
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

import org.apache.http.HttpStatus;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
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
import kr.opensoftlab.lunaops.com.vo.PageVO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.Dpl1000Service;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1100VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.Rep1100Service;
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

	
	@Resource(name = "rep1000Service")
	private Rep1000Service rep1000Service;
	
	
	@Resource(name = "rep1100Service")
	private Rep1100Service rep1100Service;
	
	
	@Resource(name = "newJenkinsClient")
	private NewJenkinsClient newJenkinsClient;
	
	
	@Resource(name = "buildService")
	private BuildService buildService;
    
    
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value="/dpl/dpl1000/dpl1000/selectDpl1000View.do")
    public String selectDpl1000View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try {
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "src_id");
			
			
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
			
			
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			
			
			String jobType = OslUtil.jsonGetString(jsonObj, "job_type");
			
			
			String ticketList = OslUtil.jsonGetString(jsonObj, "ticket_list");
			
			
			String eGeneDplId = OslUtil.jsonGetString(jsonObj, "egene_dpl_id");
			
			
			Map newMap = new HashMap<>();
			newMap.put("ticketId", ticketId);
			Map tktLastRvMap = rep1100Service.selectRep1101TktChgFileLastRvNum(newMap);
			
			
			String ticketLastRv = "HEAD";
			
			if(tktLastRvMap != null && tktLastRvMap.containsKey("maxRepRv")) {
				if(tktLastRvMap.get("maxRepRv") != null) {
					ticketLastRv = String.valueOf(tktLastRvMap.get("maxRepRv"));
				}
			}
			
			model.addAttribute("ciId", ciId);
			model.addAttribute("ticketId", ticketId);
			model.addAttribute("dplId", dplId);
			model.addAttribute("empId", empId);
			model.addAttribute("jobType", jobType);
			model.addAttribute("ticketList", ticketList);
			model.addAttribute("eGeneDplId", eGeneDplId);
			model.addAttribute("ticketLastRv", ticketLastRv);
			
			
			String jobParamTicketId = EgovProperties.getProperty("Globals.buildParam.ticketId");
			String jobParamRevision = EgovProperties.getProperty("Globals.buildParam.revision");
			String jobParamDplId = EgovProperties.getProperty("Globals.buildParam.eGeneDplId");
			model.addAttribute("jobParamTicketId", jobParamTicketId);
			model.addAttribute("jobParamRevision", jobParamRevision);
			model.addAttribute("jobParamDplId", jobParamDplId);
			
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
    
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
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
        	
			
			String jobTypeList = (String)paramMap.get("jobType");
			if(jobTypeList != null && !"".equals(jobTypeList)) {
				try {
					JSONArray jobTypeJson = new JSONArray(jobTypeList);
					String paramJobType = "";
					
					String regex = "[0-9]+";
					
					
					for(int i=0;i<jobTypeJson.length();i++) {
						JSONObject jsonObj = jobTypeJson.getJSONObject(i);
						String jobType = jsonObj.getString("job_type");
						
						
						if(!jobType.matches(regex)) {
							continue;
						}
						
						if(i > 0) {
							paramJobType += ",";
						}
						
						paramJobType += "'"+jobType+"'";
					}
					if(!"".equals(paramJobType)) {
						dpl1100VO.setParamJobType(paramJobType);
					}
				}catch(Exception e) {
					
					Log.debug(e);
					model.addAttribute("addMsg", "JOB_TYPE 데이터를 읽는 도중 오류가 발생했습니다.");
				}
			}
        	
        	PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(dpl1100VO); 
			List<Dpl1100VO> dpl1300List = null;
			
        	
        	dpl1300List = (List<Dpl1100VO>) dpl1000Service.selectDpl1100dplJobGridList(dpl1100VO);
        	
			int totCnt = dpl1000Service.selectDpl1100dplJobGridListCnt(dpl1100VO);
					
        	paginationInfo.setTotalRecordCount(totCnt);
        	
        	model.addAttribute("list", dpl1300List);
        	
        	List<Map> jobParamList = dpl1000Service.selectDpl1101JenParameterList(paramMap);
        	model.addAttribute("jobParamList", jobParamList);
        	
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",dpl1100VO.getPageIndex());
			pageMap.put("listCount", dpl1300List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);
			
			model.addAttribute("page", pageMap);
        	
        	
			model.addAttribute("errorYn", "N");
        	model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
        	
        	return new ModelAndView("jsonView", model);
    	}
    	catch(Exception ex){
    		Log.error("selectDpl1100DplJobListAjax()", ex);
    		
    		
    		model.addAttribute("errorYn", "Y");
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
			String jenId= (String)paramMap.get("jenId");
			String jobId= (String)paramMap.get("jobId");

			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String deJenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			
			
			jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, deJenUsrTok);
			jenStatusVo.setJenId(jenId);
			
			
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
			String dplTypeCd= (String)paramMap.get("dplTypeCd");
			String jobTypeCd= (String)paramMap.get("jobTypeCd");
			String ciId= (String)paramMap.get("ciId");
			String ticketId= (String)paramMap.get("ticketId");
			String dplId= (String)paramMap.get("dplId");
			String empId= (String)paramMap.get("empId");
			String jobParamList= (String)paramMap.get("jobParamList");
			String eGeneDplId= (String)paramMap.get("eGeneDplId");
			
			
			if("05".equals(jobTypeCd) || "06".equals(jobTypeCd) || "07".equals(jobTypeCd) || "08".equals(jobTypeCd)) {
				
				if(eGeneDplId == null || "".equals(eGeneDplId)) {
					model.addAttribute("errorYn", "Y");
					model.addAttribute("message", "JOB 실행에 필요한 E-GENE 배포계획 ID가 없습니다.");
					return new ModelAndView("jsonView", model);
				}
			}
			
			
			String jobParamTicketId = EgovProperties.getProperty("Globals.buildParam.ticketId");
			String jobParamRevision = EgovProperties.getProperty("Globals.buildParam.revision");
			String jobParamDplId = EgovProperties.getProperty("Globals.buildParam.eGeneDplId");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String deJenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			
			
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
			
			
			List<Map> newJobParamList = new ArrayList<Map>();
			
			
			if(jobParamList != null && !"".equals(jobParamList)) {
				try {
					
					boolean jobRecentRvCheckFlag = false;
					
					JSONArray jobParamArr = new JSONArray(jobParamList);
					
					for(int i=0;i<jobParamArr.length();i++) {
						Map jobParamMap = new HashMap<>();
						JSONObject jobParamInfo = jobParamArr.getJSONObject(i);
						
						
						if(!jobParamInfo.has("jobParamKey") || !jobParamInfo.has("jobParamVal")) {
							
							continue;
						}
						
						
						String jobParamKey = jobParamInfo.getString("jobParamKey");
						String jobParamVal = jobParamInfo.getString("jobParamVal");
						
						
						jobParamMap.put("jobParamKey", jobParamKey);

						
						if("04".equals(jobTypeCd) && jobParamRevision.equals(jobParamKey)) {
							if(jobParamVal == null || "".equals(jobParamVal)) {
								jobParamVal = "HEAD";
							}
							
							
							jobRecentRvCheckFlag = true;
						}
						
						jobParamMap.put("jobParamVal", jobParamVal);						
						
						newJobParamList.add(jobParamMap);
					}
					
					
					if("04".equals(jobTypeCd)) {
						Map jobParamMap = new HashMap<>();
						
						jobParamMap.put("jobParamKey", jobParamTicketId);
						jobParamMap.put("jobParamVal", ticketId);
						
						newJobParamList.add(jobParamMap);
						
						
						if(!jobRecentRvCheckFlag) {
							
							jobParamMap = new HashMap<>();
							
							jobParamMap.put("jobParamKey", jobParamRevision);
							jobParamMap.put("jobParamVal", "HEAD");
							
							newJobParamList.add(jobParamMap);
						}
					}
					
					
					else if("05".equals(jobTypeCd) || "06".equals(jobTypeCd) || "07".equals(jobTypeCd) || "08".equals(jobTypeCd)) {
						Map jobParamMap = new HashMap<>();
						
						jobParamMap.put("jobParamKey", jobParamDplId);
						jobParamMap.put("jobParamVal", eGeneDplId);
						
						newJobParamList.add(jobParamMap);
					}
				}catch(Exception e) {
					e.printStackTrace();
					
					model.addAttribute("errorYn", "Y");
					model.addAttribute("message", "파라미터 설정 중 오류가 발생했습니다.");
					return new ModelAndView("jsonView", model);
				}
			}
   		 
			
			if("05".equals(jobTypeCd) || "07".equals(jobTypeCd)) {
				
				String pDeployPath = EgovProperties.getProperty("Globals.p-deploy.path");
				
				String pDeployTicketFileNm = EgovProperties.getProperty("Globals.p-deploy.ticket.fileName");
				
				
				String ticketListStr= (String)paramMap.get("ticketList");
				List<String> ticketList = new ArrayList<String>();
				
				try {
					
					
					JSONArray ticketArr = new JSONArray(ticketListStr);
					
					
					if(ticketArr != null && ticketArr.length() > 0) {
						for(int i=0;i<ticketArr.length();i++) {
							JSONObject ticketInfo = ticketArr.getJSONObject(i);
							ticketList.add(ticketInfo.getString("ticket_id"));
						}
					}else {
						model.addAttribute("errorYn", "Y");
						model.addAttribute("message", "jOB 실행에 필요한 티켓 ID가 없습니다.");
						return new ModelAndView("jsonView", model);
					}
				}catch(Exception e) {
					e.printStackTrace();
					Log.error("파라미터 데이터 생성 중 오류 발생", e);
				}
				try {
					
					File pDeployPathCheck = new File(pDeployPath);
					
					if(!pDeployPathCheck.exists() || !pDeployPathCheck.isDirectory()) {
						pDeployPathCheck.mkdirs();
						
					}
					
					
					if(pDeployPath.lastIndexOf("/") == pDeployPath.length()) {
						pDeployPath = pDeployPath.substring(0, pDeployPath.length()-1);
					}
					
					
					File pDeployJobPath = new File(pDeployPath+"/"+eGeneDplId+"/"+jobId);
					
					
					if(!pDeployJobPath.exists() || !pDeployJobPath.isDirectory()) {
						pDeployJobPath.mkdirs();
					}

					
					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
					
					
					String fileNm = pDeployTicketFileNm+"_"+sdf.format(new Date())+".txt";
					
					
					File ticketFile = new File(pDeployPath+"/"+eGeneDplId+"/"+jobId+"/"+fileNm);
					
					
					if(!ticketFile.exists()) {
						ticketFile.createNewFile();
					}
					
					
					FileWriter fileWriter = new FileWriter(ticketFile);
				    PrintWriter printWriter = new PrintWriter(fileWriter);
				    
				    
				    for(String targetTicketId : ticketList) {
				    	printWriter.println(targetTicketId);
				    }
				    
				    
				    printWriter.close();
					
				}catch(Exception e) {
					e.printStackTrace();
					Log.error("배포 배포 필요 파일 생성 중 오류 발생", e);
				}
			}
			
			
			BuildVO buildVo = new BuildVO();
			buildVo.setJenId(jenId);
			buildVo.setJenUrl(jenUrl);
			buildVo.setUserId(jenUsrId);
			buildVo.setDeTokenId(deJenUsrTok);
			buildVo.setJobId(jobId);
			buildVo.setDplTypeCd(dplTypeCd);
			buildVo.setJenStatusVo(jenStatusVo);
			buildVo.setCiId(ciId);
			buildVo.setTicketId(ticketId);
			buildVo.setDplId(dplId);
			buildVo.setBldStartUsrId(empId);
			buildVo.setBldStartUsrIp(request.getRemoteAddr());
			buildVo.setJobParamList(newJobParamList);

			
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
			
			String ciId = paramMap.get("ciId");
			String ticketId = paramMap.get("ticketId");
			
			paramMap.remove("ciId");
			paramMap.remove("ticketId");
			
			
			Map jobMap = jen1000Service.selectJen1100JobInfo(paramMap);
			
			if(jobMap == null) {
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", "해당 티켓에서 실행된 JOB의 빌드 이력이 없습니다.");
				return new ModelAndView("jsonView", model);
			}
			
			
			
			Map bldInfo = null;
			
			paramMap.put("ciId", ciId);
			paramMap.put("ticketId", ticketId);
			
			
			bldInfo = jen1000Service.selectJen1200JobLastBuildInfo(paramMap);
			
			
			if(bldInfo != null) {
				
				bldInfo.remove("bldConsoleLog");
				
				
				String bldNum = String.valueOf(bldInfo.get("bldNum"));
				paramMap.put("bldNum", bldNum);
				
				
				List<Map> jobLastBuildChgList = jen1000Service.selectJen1201JobLastBuildChgList(paramMap);
				
				
				List<Map> jobLastBuildFileChgList = jen1000Service.selectJen1202JobLastBuildFileChgList(paramMap);

				
				bldInfo.put("bldChgList", jobLastBuildChgList);
				bldInfo.put("bldChgFileList", jobLastBuildFileChgList);
				
				String jenId = paramMap.get("jenId");
				String jobId = paramMap.get("jobId");
				
				
				Map newMap = new HashMap<>();
				newMap.put("jenId", jenId);
				newMap.put("jobId", jobId);
				
				
				Map jobLastBldInfo = jen1000Service.selectJen1200JobLastBuildInfo(newMap);
				
				
				String jobLastBldNum = String.valueOf(jobLastBldInfo.get("bldNum"));
				
				
				if(!bldNum.equals(jobLastBldNum)) {
					
					model.addAttribute("jobLastBldInfo", jobLastBldInfo);
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
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/dpl/dpl1000/dpl1100/selectDpl1102OprDplActionListAjax.do")
	public ModelAndView selectDpl1102OprDplActionListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
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
			rep1100List =  dpl1000Service.selectDpl1102OprDplActionList(paramMap);
			
			
			totCnt = dpl1000Service.selectDpl1102OprDplActionListCnt(paramMap);
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
			Log.error("selectDpl1102OprDplActionListAjax()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
}
