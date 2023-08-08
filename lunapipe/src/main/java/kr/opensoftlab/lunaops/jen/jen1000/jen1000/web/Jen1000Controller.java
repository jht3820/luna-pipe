package kr.opensoftlab.lunaops.jen.jen1000.jen1000.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.conn.HttpHostConnectException;
import org.apache.http.message.BasicNameValuePair;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.offbytwo.jenkins.client.util.UrlUtils;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.opensoftlab.lunaops.com.exception.UserDefineException;
import kr.opensoftlab.lunaops.com.vo.PageVO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1000VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo.Jen1100VO;
import kr.opensoftlab.sdf.jenkins.NewJenkinsClient;
import kr.opensoftlab.sdf.jenkins.vo.JenStatusVO;
import kr.opensoftlab.sdf.util.CommonScrty;
import kr.opensoftlab.sdf.util.OslAgileConstant;
import kr.opensoftlab.sdf.util.OslUtil;
import kr.opensoftlab.sdf.util.PagingUtil;
import kr.opensoftlab.sdf.util.RequestConvertor;



@Controller
public class Jen1000Controller {

	
	private static final Logger Log = Logger.getLogger(Jen1000Controller.class);

	public static final String JENKINS_OK = "JENKINS_OK";

	public static final String JENKINS_SETTING_WORNING = "JENKINS_SETTING_WORNING";

	public static final String JENKINS_WORNING_URL = "JENKINS_WORNING_URL";

	public static final String JENKINS_FAIL = "JENKINS_FAIL";
	
	public static final String TRIGGER_CRON_VALUE_ERR = "TRIGGER_CRON_VALUE_ERR";

	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	@Resource(name = "jen1000Service")
	private Jen1000Service jen1000Service;

    
    
   
	
	
	@Resource(name = "newJenkinsClient")
	private NewJenkinsClient newJenkinsClient;
	

	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000View.do")
	public String selectJen1000View( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/jen/jen1000/jen1000/jen1000";
	}
	

	

	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000CIJobView.do")
	public String selectJen1000CIJobView( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try {
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "ci_id");
			
			
			if(ciId == null) {
				response.setStatus(HttpStatus.SC_BAD_REQUEST);
				model.put("errorMsg", "구성항목 ID가 없습니다.");
				return "/err/error";
			}
			
			model.put("ciId", ciId);
			
		}catch(Exception e) {
			response.setStatus(HttpStatus.SC_BAD_REQUEST);
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}
		
		return "/jen/jen1000/jen1000/jen1007";
	}

	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1001JenkinsDetailView.do")
	public String selectJen1001JenkinsDetailView( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/jen/jen1000/jen1000/jen1001";
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1002JobDetailView.do")
	public String selectJen1002JobDetailView( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			List<Map> jenkinsList = jen1000Service.selectJen1000JenkinsNormalList(paramMap);
			model.addAttribute("jenkinsList",jenkinsList);
		}catch(Exception e){
			Log.error(e);
		}
		return "/jen/jen1000/jen1000/jen1002";
	}
	
	
	
	@SuppressWarnings({ "rawtypes"})
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1003JenkinsDetailView.do")
	public String selectJen1003JenkinsDetailView( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String userId= paramMap.get("jenUsrId");
			String tokenId= paramMap.get("jenUsrTok");
			String jenUrl= paramMap.get("jenUrl");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			if(tokenId == null || "".equals(tokenId)){
				
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", "JENKINS 연결에 실패했습니다.");
				return "/jen/jen1000/jen1000/jen1003";
			}
			
			
			String deTokenId = CommonScrty.decryptedAria(tokenId, salt);
			
			
			JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, userId, deTokenId);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return "/jen/jen1000/jen1000/jen1003";
			}
			
			try{
				
				List jobList = newJenkinsClient.getJobList(jenStatusVo);
				
				
				Map jenkinsMap = newJenkinsClient.getJenkinsInfo(jenStatusVo);
				
				model.addAttribute("jenMap",jenkinsMap);
				model.addAttribute("jobs",jobList);
				
			}catch(Exception e){
				System.out.println(e);
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", "JENKINS 연결에 실패했습니다.");
			}
		}catch(Exception e){
			Log.error(e);
		}
		return "/jen/jen1000/jen1000/jen1003";
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked"})
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JenkinsJobListAjax.do")
	public ModelAndView selectJen1000JenkinsJobListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			
			Map jenMap = jen1000Service.selectJen1000JenkinsInfo(paramMap);

			
			String userId= (String)jenMap.get("jenUsrId");
			String tokenId= (String)jenMap.get("jenUsrTok");
			String jenUrl = (String)jenMap.get("jenUrl");
			String upperJobId = (String)paramMap.get("jobId");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			if(tokenId == null || "".equals(tokenId)){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				return new ModelAndView("jsonView");
			}
			
			String deTokenId = CommonScrty.decryptedAria(tokenId, salt);
			
			
			JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, userId, deTokenId);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView");
			}
			
			
			Map addDatas = new HashMap<>();
			addDatas.put("upperJobId", upperJobId);
			
			
			List jobList = newJenkinsClient.getJobList(jenStatusVo, addDatas);
			
			
			Map jenkinsMap = newJenkinsClient.getJenkinsInfo(jenStatusVo);
			model.addAttribute("jenMap", jenkinsMap);
			
			
			model.addAttribute("list", jobList);
			model.addAttribute("MSG_CD", JENKINS_OK);
			
			
			newJenkinsClient.close(jenStatusVo);
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000JenkinsJobListAjax()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof IllegalArgumentException){
				model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
			}else if( ex instanceof UserDefineException){
					model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			model.addAttribute("message", ex.getMessage());
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1004JobDetailView.do")
	public String selectJen1004JenkinsDetailView( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/jen/jen1000/jen1000/jen1004";
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1005View.do")
	public String selectJen1005View( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/jen/jen1000/jen1000/jen1005";
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1006View.do")
	public String selectJen1006View( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/jen/jen1000/jen1000/jen1006";
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JenkinsListAjax.do")
	public ModelAndView selectJen1000JenkinsListAjax(@ModelAttribute("jen1000VO") Jen1000VO jen1000VO, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

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

			
			jen1000VO.setPageIndex(_pageNo);
			jen1000VO.setPageSize(_pageSize);
			jen1000VO.setPageUnit(_pageSize);
			
			String ciId = (String) paramMap.get("ciId");
			jen1000VO.setCiId(ciId);


			PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(jen1000VO);  

			List<Jen1000VO> jen1000List = null;

			
			

			

			
			int totCnt = 0;
			jen1000List =   jen1000Service.selectJen1000JenkinsList(jen1000VO);


			
			totCnt =  jen1000Service.selectJen1000JenkinsListCnt(jen1000VO);
			paginationInfo.setTotalRecordCount(totCnt);

			model.addAttribute("list", jen1000List);

			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",jen1000VO.getPageIndex());
			pageMap.put("listCount", jen1000List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);

			model.addAttribute("page", pageMap);

			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000JenkinsListAjax()", ex);
			throw new Exception(ex.getMessage());
		}
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JobListAjax.do")
	public ModelAndView selectJen1000JobListAjax(@ModelAttribute("jen1000VO") Jen1100VO jen1100VO, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

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

			
			jen1100VO.setPageIndex(_pageNo);
			jen1100VO.setPageSize(_pageSize);
			jen1100VO.setPageUnit(_pageSize);

			String ciId = (String) paramMap.get("ciId");
			jen1100VO.setCiId(ciId);
			
			
			if(ciId != null) {
				Map newMap = new HashMap<>();
				newMap.put("ciId", ciId);
				
				List<Map> jobParamList = jen1000Service.selectJen1102CIJobParamList(newMap);
				model.addAttribute("jobParamList", jobParamList);
			}
			
			PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(jen1100VO);  

			List<Jen1100VO> jen1000List = null;

			
			int totCnt = 0;
			jen1000List =   jen1000Service.selectJen1100JobList(jen1100VO);


			
			totCnt =  jen1000Service.selectJen1100JobListCnt(jen1100VO);
			paginationInfo.setTotalRecordCount(totCnt);

			model.addAttribute("list", jen1000List);

			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",jen1100VO.getPageIndex());
			pageMap.put("listCount", jen1000List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);

			model.addAttribute("page", pageMap);

			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000JobListAjax()", ex);
			throw new Exception(ex.getMessage());
		}
	}


	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JenkinsDetailAjax.do")
	public ModelAndView selectJen1000JenkinsDetailAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			
			Map jenMap = jen1000Service.selectJen1000JenkinsInfo(paramMap);

			model.addAttribute("jenInfo", jenMap);

			
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));

			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000JenkinsDetailAjax()", ex);


			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}

	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1100JobDetailAjax.do")
	public ModelAndView selectJen1100JobDetailAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			Map jobMap = jen1000Service.selectJen1100JobInfo(paramMap);
			
			String jenUrl = (String) jobMap.get("jenUrl");
			String jenUsrId = (String) jobMap.get("jenUsrId");
			String jenUsrTok = (String) jobMap.get("jenUsrTok");
			String jobId = (String) jobMap.get("jobId");
			String jobTriggerCd = "02";
			String jobTriggerVal = "";

			
			String jobFullPath = UrlUtils.toFullJobPath(jobId);
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String deJenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			
			
			JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, deJenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
			}
			
			
			jobTriggerVal = newJenkinsClient.getJobTriggerCron(jenStatusVo, jobFullPath);
			
			
			if(jobTriggerVal != null) {
				jobTriggerCd = "01";
			}
    		
    		
    		jobMap.put("jobTriggerCd", jobTriggerCd);
    		jobMap.put("jobTriggerVal", jobTriggerVal);
    		
			model.addAttribute("jobInfo", jobMap);
			
			
			
			
			
			
			
			
			
			List<Map> jobRestoreList = jen1000Service.selectJen1100JobNormalList(paramMap);
			model.addAttribute("jobRestoreList", jobRestoreList);
			
			
			model.addAttribute("MSG_CD", JENKINS_OK);
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));

			
			newJenkinsClient.close(jenStatusVo);
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1100JobDetailAjax()", ex);
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	


	
	@RequestMapping(value="/jen/jen1000/jen1000/saveJen1000JenkinsInfoAjax.do")
	public ModelAndView saveJen1000JenkinsInfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			
			String type = (String) paramMap.get("type");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String nowJenUsrTok = (String)paramMap.get("nowJenUsrTok");
			
			
			String jenUsrTok = (String)paramMap.get("jenUsrTok");
			
			
			String newJenUsrTok = "";
			JenStatusVO jenStatusVo = null;
			
			try{
				String jenUrl=(String)paramMap.get("jenUrl");
				String userId=(String)paramMap.get("jenUsrId");
				String tokenId=(String)paramMap.get("jenUsrTok");
				
				
				if(type != null && "update".equals(type)){
					
					if(tokenId == null || "".equals(tokenId)){
						model.addAttribute("MSG_CD", JENKINS_FAIL);
						return new ModelAndView("jsonView");
					}
					
					
					if(nowJenUsrTok.equals(jenUsrTok)){
						
						tokenId = CommonScrty.decryptedAria(tokenId, salt);
					}else{
						tokenId = jenUsrTok;
					}
				}
				
				
				jenStatusVo = newJenkinsClient.connect(jenUrl, userId, tokenId);
				
				
				if(jenStatusVo.isErrorFlag()) {
					
					newJenkinsClient.close(jenStatusVo);
					
					model.addAttribute("MSG_CD", JENKINS_FAIL);
					model.addAttribute("message", jenStatusVo.getErrorMsg());
					return new ModelAndView("jsonView");
				}
			}
			catch(Exception ex){
				
				if(jenStatusVo != null) {
					newJenkinsClient.close(jenStatusVo);
				}
				Log.error("saveJen1000JenkinsInfoAjax()", ex);
				if( ex instanceof HttpHostConnectException){
					model.addAttribute("MSG_CD", JENKINS_FAIL);
				}else if( ex instanceof ParseException){
					model.addAttribute("MSG_CD", JENKINS_FAIL);
				}else if( ex instanceof IllegalArgumentException){
					model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
				}else if( ex instanceof UserDefineException){
					model.addAttribute("MSG_CD", ex.getMessage());
				}else{
					model.addAttribute("MSG_CD", JENKINS_FAIL);
				}
				
				return new ModelAndView("jsonView");
			}
			
			
			if("update".equals(type)){
				
				if(!nowJenUsrTok.equals(jenUsrTok)){
					
					newJenUsrTok = CommonScrty.encryptedAria(jenUsrTok, salt);
				}else{
					newJenUsrTok = jenUsrTok;
				}
			}
			
			else{
				newJenUsrTok = CommonScrty.encryptedAria(jenUsrTok, salt);
			}

			
			paramMap.remove("jenUsrTok");
			
			
			paramMap.put("jenUsrTok", newJenUsrTok);
			
			
			jen1000Service.saveJen1000JenkinsInfo(paramMap);

			
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.save"));

			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("saveJen1000JenkinsInfoAjax()", ex);

			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/saveJen1100JobInfoAjax.do")
	public ModelAndView saveJen1100JobInfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String type = (String) paramMap.get("type");
			
			
			if(!"update".equals(type)){
				
				int jobCheck = jen1000Service.selectJen1100JobUseCountInfo(paramMap);
				
				if(jobCheck > 0){
					
					model.addAttribute("errorYn", "Y");
					model.addAttribute("message", "이미 추가된 JOB입니다.");
					return new ModelAndView("jsonView");
				}
			}
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String nowJobTok = (String)paramMap.get("nowJobTok");
			
			
			String jobTok = (String)paramMap.get("jobTok");
			
			
			String newJobTok = "";
			
			JenStatusVO jenStatusVo = null;
			try{
				String jenUrl=(String)paramMap.get("jenUrl");
				String jobId=(String)paramMap.get("jobId");
				String userId=(String)paramMap.get("jenUsrId");
				String tokenId=(String)paramMap.get("jenUsrTok");
				
				
				String jobFullPath = UrlUtils.toFullJobPath(jobId);
				
				
				if(tokenId == null || "".equals(tokenId)){
					model.addAttribute("MSG_CD", JENKINS_FAIL);
					return new ModelAndView("jsonView");
				}
				
				
				tokenId = CommonScrty.decryptedAria(tokenId, salt);
				
				
				jenStatusVo = newJenkinsClient.connect(jenUrl, userId, tokenId);
				
				
				if(jenStatusVo.isErrorFlag()) {
					newJenkinsClient.close(jenStatusVo);
					model.addAttribute("MSG_CD", JENKINS_FAIL);
					model.addAttribute("message", jenStatusVo.getErrorMsg());
					return new ModelAndView("jsonView");
				}
				
				
				String settingJobTok = newJenkinsClient.getJobTokenValue(jenStatusVo, jobFullPath);
				
				
				String deJobTok = jobTok;
				
				
				if(nowJobTok.equals(jobTok)){
					
					deJobTok = CommonScrty.decryptedAria(jobTok, salt);
				}
				
				if(deJobTok == null || "".equals(deJobTok)){
					newJenkinsClient.close(jenStatusVo);
					model.addAttribute("MSG_CD", "JOB TOKEN 값이 없습니다.");
					return new ModelAndView("jsonView");
				}
				
				
				if(!deJobTok.equals(settingJobTok)){
					newJenkinsClient.close(jenStatusVo);
					model.addAttribute("MSG_CD", "JOB TOKEN KEY값을 확인해주세요.");
					return new ModelAndView("jsonView");
				}
				
				
				String jobTriggerCd = (String) paramMap.get("jobTriggerCd");
				String jobTriggerVal = (String) paramMap.get("jobTriggerVal");
				
				
				if("01".equals(jobTriggerCd)) {
					jenStatusVo = newJenkinsClient.setJobTriggerCron(jenStatusVo, jobFullPath, jobTriggerVal);
				}else {
					jenStatusVo = newJenkinsClient.setJobTriggerCron(jenStatusVo, jobFullPath);
				}
				
				
				newJenkinsClient.close(jenStatusVo);

				
				if(jenStatusVo.isErrorFlag()) {
					newJenkinsClient.close(jenStatusVo);
					model.addAttribute("MSG_CD", jenStatusVo.getErrorCode());
					model.addAttribute("message", jenStatusVo.getErrorMsg());
					return new ModelAndView("jsonView");
				}
			}
			catch(Exception ex){
				
				if(jenStatusVo != null) {
					newJenkinsClient.close(jenStatusVo);
				}
				Log.error("saveJen1100JobInfoAjax()", ex);
				if( ex instanceof HttpHostConnectException){
					model.addAttribute("MSG_CD", JENKINS_FAIL);
				}else if( ex instanceof ParseException){
					model.addAttribute("MSG_CD", JENKINS_FAIL);
				}else if( ex instanceof IllegalArgumentException){
					model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
				}else if( ex instanceof UserDefineException){
					model.addAttribute("MSG_CD", ex.getMessage());
				}else{
					model.addAttribute("MSG_CD", JENKINS_FAIL);
				}
				
				return new ModelAndView("jsonView");
			}
			
			
			if("update".equals(type)){
				
				if(!nowJobTok.equals(jobTok)){
					
					newJobTok = CommonScrty.encryptedAria(jobTok, salt);
				}else{
					newJobTok = jobTok;
				}
			}
			
			else{
				newJobTok = CommonScrty.encryptedAria(jobTok, salt);
			}
			
			
			paramMap.remove("jobTok");
			
			
			paramMap.put("jobTok", newJobTok);
			
			
			jen1000Service.saveJen1000JobInfo(paramMap);
			
			
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.save"));
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("saveJen1100JobInfoAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
			return new ModelAndView("jsonView");
		}
	}

	
	@RequestMapping(value="/jen/jen1000/jen1000/deleteJen1000JenkinsInfoAjax.do")
	public ModelAndView deleteJen1000JenkinsInfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			paramMap.put("delCd", "01");
			
			jen1000Service.deleteJen1000JenkinsInfo(paramMap);
			
			
			model.addAttribute("message", egovMessageSource.getMessage("success.common.delete"));


			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("deleteJen1000JenkinsInfoAjax()", ex);

			
			model.addAttribute("saveYN", "N");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/deleteJen1000JobInfoAjax.do")
	public ModelAndView deleteJen1000JobInfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try{
			
			Map<String, Object> paramMap = RequestConvertor.requestParamToMapAddSelInfoList(request, true, "jobId");
			
			jen1000Service.deleteJen1100JobList(paramMap);
			
			
			model.addAttribute("message", egovMessageSource.getMessage("success.common.delete"));
			
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("deleteJen1000JobInfoAjax()", ex);
			
			
			model.addAttribute("saveYN", "N");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000ConfirmConnect.do")
	public ModelAndView selectJen1000ConfirmConnect(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{

			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			String jenUrl=(String)paramMap.get("jenUrl");
			String userId=(String)paramMap.get("jenUsrId");
			String tokenId=(String)paramMap.get("jenUsrTok");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String newTokenId = CommonScrty.decryptedAria(tokenId, salt);
			
			
			if(newTokenId == null || "".equals(newTokenId)){
				model.addAttribute("MSG_CD", JENKINS_SETTING_WORNING);
				return new ModelAndView("jsonView");
			}

			
			JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, userId, newTokenId);
			newJenkinsClient.close(jenStatusVo);
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView");
			}
			
			model.addAttribute("MSG_CD", JENKINS_OK);


			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000ConfirmConnect()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof UserDefineException){
					model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JobConfirmConnect.do")
	public ModelAndView selectJen1000JobConfirmConnect(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			Map jobMap = jen1000Service.selectJen1100JobInfo(paramMap);
			
			
			String jenUsrId=(String)jobMap.get("jenUsrId");
			String jenUsrTok=(String)jobMap.get("jenUsrTok");
			String jobTok=(String)jobMap.get("jobTok");
			String jenUrl=(String)jobMap.get("jenUrl");
			String jobId=(String)jobMap.get("jobId");

			
			String jobFullPath = UrlUtils.toFullJobPath(jobId);
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String deJenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			String deJobTok = CommonScrty.decryptedAria(jobTok, salt);
			
			
			if(deJenUsrTok == null || "".equals(deJenUsrTok)){
				model.addAttribute("MSG_CD", JENKINS_SETTING_WORNING);
				return new ModelAndView("jsonView");
			}
			if(deJobTok == null || "".equals(deJobTok)){
				model.addAttribute("MSG_CD", "JOB TOKEN 값이 없습니다.");
				return new ModelAndView("jsonView");
			}
			
			
			JenStatusVO jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, deJenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView");
			}
			
			String settingJobTok = newJenkinsClient.getJobTokenValue(jenStatusVo, jobFullPath);
			
			
			newJenkinsClient.close(jenStatusVo);
			
			
			if(!deJobTok.equals(settingJobTok)){
				model.addAttribute("MSG_CD", "JOB TOKEN KEY값을 확인해주세요.");
				
				return new ModelAndView("jsonView");
			}
			
			model.addAttribute("MSG_CD", JENKINS_OK);
			
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000JobConfirmConnect()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof UserDefineException){
				model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000URLConnect.do")
	public ModelAndView selectJen1000URLConnect(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		JenStatusVO jenStatusVo = null;
		try{

			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			String jenUrl= (String)paramMap.get("jenUrl");
			String userId= (String)paramMap.get("jenUsrId");
			String tokenId= (String)paramMap.get("jenUsrTok");
			String upperJobId = (String)paramMap.get("jobId");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			tokenId = CommonScrty.decryptedAria(tokenId, salt);
			
			
			if(tokenId == null || "".equals(tokenId)){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				return new ModelAndView("jsonView");
			}
			
			
			jenStatusVo = newJenkinsClient.connect(jenUrl, userId, tokenId);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
			}
			
			
			Map addDatas = new HashMap<>();
			addDatas.put("upperJobId", upperJobId);
			
			
			List jobList = newJenkinsClient.getJobList(jenStatusVo, addDatas);
			
			
			model.addAttribute("list", jobList);
			model.addAttribute("MSG_CD", JENKINS_OK);
			
			
			
			
			
			
			List<Map> jobRestoreList = jen1000Service.selectJen1100JobNormalList(paramMap);
			
			
			newJenkinsClient.close(jenStatusVo);
			model.addAttribute("jobRestoreList", jobRestoreList);
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			
			if(jenStatusVo != null) {
				newJenkinsClient.close(jenStatusVo);
			}
			
			Log.error("selectJen1000URLConnect()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof IllegalArgumentException){
				model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
			}else if( ex instanceof UserDefineException){
					model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000SubURLConnect.do")
	public ModelAndView selectJen1000SubURLConnect(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		
		JenStatusVO jenStatusVo = null;
		
		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			String url= (String)paramMap.get("url");
			String userId= (String)paramMap.get("jenUsrId");
			String tokenId= (String)paramMap.get("jenUsrTok");
			String upperJobId = (String)paramMap.get("jobId");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			tokenId = CommonScrty.decryptedAria(tokenId, salt);
			
			
			if(tokenId == null || "".equals(tokenId)){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				return new ModelAndView("jsonView");
			}
			
			
			jenStatusVo = newJenkinsClient.connect(url, userId, tokenId);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
			}
			
			
			Map addDatas = new HashMap<>();
			addDatas.put("upperJobId", upperJobId);
			
			
			List jobList = newJenkinsClient.getJobList(jenStatusVo, addDatas);
			
			
			model.addAttribute("list", jobList);
			model.addAttribute("MSG_CD", JENKINS_OK);
			
			
			paramMap.put("restoreSelJobType", "03");
			
			
			List<Map> jobRestoreList = jen1000Service.selectJen1100JobNormalList(paramMap);
			
			
			newJenkinsClient.close(jenStatusVo);
			model.addAttribute("jobRestoreList", jobRestoreList);
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			
			if(jenStatusVo != null) {
				newJenkinsClient.close(jenStatusVo);
			}
			Log.error("selectJen1000SubURLConnect()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof IllegalArgumentException){
				model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
			}else if( ex instanceof UserDefineException){
				model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JobParameter.do")
	public ModelAndView selectJen1000JobParameter(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		JenStatusVO jenStatusVo = null;
		
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);

			String jenUrl= (String)paramMap.get("jenUrl");
			String userId= (String)paramMap.get("jenUsrId");
			String tokenId= (String)paramMap.get("jenUsrTok");
			String jobId= (String)paramMap.get("jobId");
			
			
			String jobFullPath = UrlUtils.toFullJobPath(jobId);
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			tokenId = CommonScrty.decryptedAria(tokenId, salt);
			
			
			if(tokenId == null || "".equals(tokenId)){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				return new ModelAndView("jsonView");
			}
			
			
			jenStatusVo = newJenkinsClient.connect(jenUrl, userId, tokenId);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				
				return new ModelAndView("jsonView");
			}
			
			
			List<Map> jenJobParamList = newJenkinsClient.getJobParamList(jenStatusVo, jobFullPath);
			
			
			model.addAttribute("list", jenJobParamList);
			model.addAttribute("MSG_CD", JENKINS_OK);
			
			newJenkinsClient.close(jenStatusVo);
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			
			if(jenStatusVo != null) {
				newJenkinsClient.close(jenStatusVo);
			}
			Log.error("selectJen1000JobParameter()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof IllegalArgumentException){
				model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
			}else if( ex instanceof UserDefineException){
					model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			
			return new ModelAndView("jsonView");
		}
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1203JobBldParamList.do")
	public ModelAndView selectJen1203JobBldParamList(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			List jobBldParamList = jen1000Service.selectJen1203JobBuildParamList(paramMap);
			
			model.addAttribute("jobBldParamList", jobBldParamList);
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1203JobBldParamList()", ex);
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1002JobCronSpecCheck.do")
	public ModelAndView selectJen1002JobCronSpecCheck(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		JenStatusVO jenStatusVo = null;
		
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String jenUrl=(String)paramMap.get("jenUrl");
			String jobId=(String)paramMap.get("jobId");
			String jenUsrId=(String)paramMap.get("jenUsrId");
			String jenUsrTok=(String)paramMap.get("jenUsrTok");
			String jobTriggerVal=(String)paramMap.get("jobTriggerVal");
			
			
			String jobFullPath = UrlUtils.toFullJobPath(jobId);
			
			
			if(jenUsrTok == null || "".equals(jenUsrTok)){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				return new ModelAndView("jsonView");
			}
			
			
			jenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			
			
			jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, jenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView");
			}
			
			
			String triggerUrl = jenUrl+"/job/"+jobFullPath+"/descriptorByName/hudson.triggers.TimerTrigger/checkSpec";

			
			List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(1);
			nameValuePairs.add(new BasicNameValuePair("value", jobTriggerVal));
			
			
			String rtnCheckStr = newJenkinsClient.excutePost(jenStatusVo, triggerUrl, nameValuePairs);
			
			model.addAttribute("checkResult", rtnCheckStr);
			model.addAttribute("MSG_CD", JENKINS_OK);
			
			
			newJenkinsClient.close(jenStatusVo);
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			
			if(jenStatusVo != null) {
				newJenkinsClient.close(jenStatusVo);
			}
			
			Log.error("selectJen1000JobParameter()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof IllegalArgumentException){
				model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
			}else if( ex instanceof UserDefineException){
				model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1002JobCronSpec.do")
	public ModelAndView selectJen1002JobCronSpec(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		JenStatusVO jenStatusVo = null;
		
		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String jenUrl=(String)paramMap.get("jenUrl");
			String jobId=(String)paramMap.get("jobId");
			String jenUsrId=(String)paramMap.get("jenUsrId");
			String jenUsrTok=(String)paramMap.get("jenUsrTok");
			
			
			String jobFullPath = UrlUtils.toFullJobPath(jobId);
			
			String jobTriggerCd = "02";
			String jobTriggerVal = "";
			
			
			if(jenUsrTok == null || "".equals(jenUsrTok)){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				return new ModelAndView("jsonView");
			}
			
			
			jenUsrTok = CommonScrty.decryptedAria(jenUsrTok, salt);
			
			
			jenStatusVo = newJenkinsClient.connect(jenUrl, jenUsrId, jenUsrTok);
			
			
			if(jenStatusVo.isErrorFlag()) {
				model.addAttribute("MSG_CD", JENKINS_FAIL);
				model.addAttribute("message", jenStatusVo.getErrorMsg());
				return new ModelAndView("jsonView");
			}
			
			
			jobTriggerVal = newJenkinsClient.getJobTriggerCron(jenStatusVo, jobFullPath);
			
			
			if(jobTriggerVal != null) {
				jobTriggerCd = "01";
			}
    		
			model.addAttribute("jobTriggerCd", jobTriggerCd);
			model.addAttribute("jobTriggerVal", jobTriggerVal);
			model.addAttribute("MSG_CD", JENKINS_OK);
			
			
			newJenkinsClient.close(jenStatusVo);
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			
			if(jenStatusVo != null) {
				newJenkinsClient.close(jenStatusVo);
			}
			
			Log.error("selectJen1000JobParameter()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof IllegalArgumentException){
				model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
			}else if( ex instanceof UserDefineException){
				model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JobBldLogCheckOut.do")
	public ModelAndView selectJen1000JobBldLogCheckOut(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			
			Map<String, Object> paramMap = RequestConvertor.requestParamToMapAddSelInfoList(request, true, "jobId");
			
			
			int insertBldLogCnt = jen1000Service.insertJen1000BldLog(paramMap);
			
			model.addAttribute("MSG_CD", JENKINS_OK);
			model.addAttribute("insertBldLogCnt", insertBldLogCnt);
			
			return new ModelAndView("jsonView");
		}
		catch(UserDefineException ude) {
			Log.error("selectJen1000JobBldLogCheckOut()", ude);
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000JobBldLogCheckOut()", ex);
			if( ex instanceof HttpHostConnectException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof ParseException){
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}else if( ex instanceof IllegalArgumentException){
				model.addAttribute("MSG_CD", JENKINS_WORNING_URL);
			}else if( ex instanceof UserDefineException){
				model.addAttribute("MSG_CD", ex.getMessage());
			}else{
				model.addAttribute("MSG_CD", JENKINS_FAIL);
			}
			
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JobBuildInfo.do")
	public ModelAndView selectJen1000JobBuildInfo(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			Map jobBuildInfo = jen1000Service.selectJen1200JobBuildInfo(paramMap);
			
			List<Map> jobBuildChgList = null;
			
			List<Map> jobBuildFileChgList = null;
			
			
			if(jobBuildInfo != null) {
				
				jobBuildChgList = jen1000Service.selectJen1201JobLastBuildChgList(paramMap);
				
				
				jobBuildFileChgList = jen1000Service.selectJen1202JobLastBuildFileChgList(paramMap);
			}else {
				
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
				return new ModelAndView("jsonView");
			}
			
			model.addAttribute("jobBuildInfo", jobBuildInfo);
			model.addAttribute("jobBuildChgList", jobBuildChgList);
			model.addAttribute("jobBuildFileChgList", jobBuildFileChgList);
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000JobBuildInfo()", ex);
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/jen/jen1000/jen1000/selectJen1000JobBuildListAjax.do")
	public ModelAndView selectJen1000JobBuildListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

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

			
			paramMap.put("firstIndex", String.valueOf(pageVo.getFirstIndex()));
			paramMap.put("lastIndex", String.valueOf(pageVo.getLastIndex()));
			
			
			int totCnt = 0;
			List jen1000List = jen1000Service.selectJen1200JobBuildList(paramMap);

			
			totCnt =  jen1000Service.selectJen1200JobBuildListCnt(paramMap);
			paginationInfo.setTotalRecordCount(totCnt);

			model.addAttribute("list", jen1000List);

			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",pageVo.getPageIndex());
			pageMap.put("listCount", jen1000List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);

			model.addAttribute("page", pageMap);

			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectJen1000JobBuildListAjax()", ex);
			throw new Exception(ex.getMessage());
		}
	}
}
