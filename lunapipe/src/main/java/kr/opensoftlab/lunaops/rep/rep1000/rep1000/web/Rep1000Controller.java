package kr.opensoftlab.lunaops.rep.rep1000.rep1000.web;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.http.HttpStatus;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.tmatesoft.svn.core.SVNAuthenticationException;
import org.tmatesoft.svn.core.SVNException;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.property.EgovPropertyService;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.opensoftlab.lunaops.com.api.service.ApiService;
import kr.opensoftlab.lunaops.com.exception.UserDefineException;
import kr.opensoftlab.lunaops.com.vo.PageVO;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.vo.Rep1000VO;
import kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.Rep1100Service;
import kr.opensoftlab.sdf.rep.com.RepGetLogModule;
import kr.opensoftlab.sdf.rep.com.RepModule;
import kr.opensoftlab.sdf.rep.com.vo.RepDirVO;
import kr.opensoftlab.sdf.rep.com.vo.RepResultVO;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;
import kr.opensoftlab.sdf.rep.git.GithubConnector;
import kr.opensoftlab.sdf.rep.git.GitlabConnector;
import kr.opensoftlab.sdf.rep.svn.SVNConnector;
import kr.opensoftlab.sdf.util.CommonScrty;
import kr.opensoftlab.sdf.util.OslAgileConstant;
import kr.opensoftlab.sdf.util.OslUtil;
import kr.opensoftlab.sdf.util.PagingUtil;
import kr.opensoftlab.sdf.util.RequestConvertor;



@Controller
public class Rep1000Controller {

	
	private static final Logger Log = Logger.getLogger(Rep1000Controller.class);

	
	public static final String REP_EXCEPTION = "SVN_EXCEPTION"; 

		
	public static final String REP_AUTHENTICATION_EXCEPTION = "SVN_AUTHENTICATION_EXCEPTION";

	
	public static final String REP_OK = "REP_OK";
	
	
	public static final String SVN_MODULE_USE_EXCEPTION = "SVN_MODULE_USE_EXCEPTION";

	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;
	
	
	@Resource(name = "rep1000Service")
	private Rep1000Service rep1000Service;

	
	@Resource(name = "rep1100Service")
	private Rep1100Service rep1100Service;
	
	
	@Resource(name = "svnConnector")
	private SVNConnector svnConnector;
	
	@Resource(name = "githubConnector")
	private GithubConnector githubConnector;
	
	@Resource(name = "gitlabConnector")
	private GitlabConnector gitlabConnector;
	
	
	@Resource(name = "repModule")
	private RepModule repModule;
	
	
	@Resource(name = "apiService")
	private ApiService apiService;

	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1000RepositoryView.do")
	public String selectRep1000RepositoryView(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try {
			
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "src_id"); 
			String apiId = OslUtil.jsonGetString(jsonObj, "api_id");
			String svcId = OslUtil.jsonGetString(jsonObj, "svc_id");
			String fId = OslUtil.jsonGetString(jsonObj, "f_id");
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			String callbakApiId = OslUtil.jsonGetString(jsonObj, "callbak_api_id");
			
			
			String items = OslUtil.jsonGetString(jsonObj, "items");
			String repIdList = "";
			
			if(items != null) {
				try {
					JSONArray jsonArr = new JSONArray(items);
					for(int i=0;i<jsonArr.length();i++) {
						JSONObject repIds = jsonArr.getJSONObject(i);
						
						
						if(repIds.has("svn_id")) {
							
							if(!"".equals(repIdList)) {
								repIdList += ",";
							}
							repIdList += repIds.getString("svn_id");
						}
					}
				}catch(Exception e) {
					Log.error(e);
					e.printStackTrace();
				}
			}

			
			String eGeneUrl = OslUtil.jsonGetString(jsonObj, "egene_url");
			
			
			if(eGeneUrl == null || "".equals(eGeneUrl)) {
				eGeneUrl = EgovProperties.getProperty("Globals.eGene.url");
			}
			
			
			if(eGeneUrl.lastIndexOf("/") != (eGeneUrl.length()-1)) {
				
				eGeneUrl = eGeneUrl + "/";
			}
			
			
			String salt = EgovProperties.getProperty("Globals.data.salt");
			
			
			String jsonParam = "{key: '"+salt+"', webhook_type_cd: '01', emp_id: '"+empId+"', current_date: '"+new Date().getTime()+"'}";
			String enParam = CommonScrty.encryptedAria(jsonParam, salt);
			
			model.addAttribute("ciId", ciId);
			model.addAttribute("apiId", apiId);
			model.addAttribute("svcId", svcId);
			model.addAttribute("fId", fId);
			model.addAttribute("empId", empId);
			model.addAttribute("eGeneUrl", eGeneUrl);
			model.addAttribute("callbakApiId", callbakApiId);
			model.addAttribute("repIdList", repIdList);
			model.addAttribute("webhookDataKey", enParam);
			
		}catch(Exception e) {
			Log.error(e);
			e.printStackTrace();
		}
		
		return "/rep/rep1000/rep1000/rep1000";
	}

	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1000RepositoryListAjaxView.do")
	public ModelAndView selectRep1000RepositoryListAjaxView(@ModelAttribute("rep1000VO") Rep1000VO rep1000VO, HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

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
			
			
			rep1000VO.setPageIndex(_pageNo);
			rep1000VO.setPageSize(_pageSize);
			rep1000VO.setPageUnit(_pageSize);
			
			
			PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(rep1000VO);  

			List<Rep1000VO> rep1000List = null;

			
			int totCnt = 0;
			rep1000List =  rep1000Service.selectRep1000RepositoryList(rep1000VO);
			
			
			String salt = EgovProperties.getProperty("Globals.data.salt");
			
			
			for(Rep1000VO rep1000Info : rep1000List) {
				String jsonParam = "{key: '"+salt+"', type: 'local', rep_id: '"+rep1000Info.getRepId()+"'}";
				String enParam = CommonScrty.encryptedAria(jsonParam, salt);
				
				rep1000Info.setEnRepIdData(enParam);
			}
			
			
			
			totCnt =rep1000Service.selectRep1000RepositoryListCnt(rep1000VO);
			paginationInfo.setTotalRecordCount(totCnt);
			
			model.addAttribute("list", rep1000List);
			
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",rep1000VO.getPageIndex());
			pageMap.put("listCount", rep1000List.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);
			
			model.addAttribute("page", pageMap);
			
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1000RepositoryListAjaxView()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1001RepositoryDetailView.do")
	public String selectRep1001RepositoryDetailView(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		 try{
			 
			 Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			 
			 String pageType = paramMap.get("popupGb");
			
			if( "update".equals(pageType)){
				
				
			}
			
			return "/rep/rep1000/rep1000/rep1001";
		
		 }catch(Exception ex){
 			Log.error("selectRep1001RepositoryDetailView()", ex);
 			throw new Exception(ex.getMessage());
 		}
	}

	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1002View.do")
	public String selectRep1002View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try {
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");

			
			String type = OslUtil.jsonGetString(jsonObj, "type");
			
			
			String ciId = OslUtil.jsonGetString(jsonObj, "src_id"); 
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			String apiId = OslUtil.jsonGetString(jsonObj, "api_id");
			String svcId = OslUtil.jsonGetString(jsonObj, "svc_id");
			String fId = OslUtil.jsonGetString(jsonObj, "f_id");
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			String callbakApiId = OslUtil.jsonGetString(jsonObj, "callbak_api_id");

			
			String eGeneUrl = EgovProperties.getProperty("Globals.eGene.url");
			
			model.addAttribute("ciId", ciId);
			model.addAttribute("ticketId", ticketId);
			model.addAttribute("apiId", apiId);
			model.addAttribute("svcId", svcId);
			model.addAttribute("fId", fId);
			model.addAttribute("empId", empId);
			model.addAttribute("eGeneUrl", eGeneUrl);
			model.addAttribute("callbakApiId", callbakApiId);
			
			
			String repId = OslUtil.jsonGetString(jsonObj, "rep_id");
			
			paramMap.put("repId", repId);
			
			RepVO repInfo = rep1000Service.selectRep1000Info(paramMap);
			
			model.addAttribute("repInfo", repInfo);
			model.addAttribute("repId", repId);
			model.addAttribute("type", type);
			
		}catch(Exception e) {
			response.setStatus(HttpStatus.SC_BAD_REQUEST);
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}
		return "/rep/rep1000/rep1000/rep1002";
	}

	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1003View.do")
	public String selectRep1003View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/rep/rep1000/rep1000/rep1003";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1004View.do")
	public String selectRep1004View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/rep/rep1000/rep1000/rep1004";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1005View.do")
	public String selectRep1005View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/rep/rep1000/rep1000/rep1005";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1006View.do")
	public String selectRep1006View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/rep/rep1000/rep1000/rep1006";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1007View.do")
	public String selectRep1007View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try {
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String repId = OslUtil.jsonGetString(jsonObj, "rep_id");
			String selRevision = OslUtil.jsonGetString(jsonObj, "revision");
			String filePath = OslUtil.jsonGetString(jsonObj, "file_path");
			
			
			if(repId == null) {
				response.setStatus(HttpStatus.SC_BAD_REQUEST);
				model.put("errorMsg", "소스저장소 ID가 없습니다.");
				return "/err/error";
			}
			if(selRevision == null) {
				response.setStatus(HttpStatus.SC_BAD_REQUEST);
				model.put("errorMsg", "리비전 번호가 없습니다.");
				return "/err/error";
			}
			if(filePath == null) {
				response.setStatus(HttpStatus.SC_BAD_REQUEST);
				model.put("errorMsg", "파일 경로가 없습니다.");
				return "/err/error";
			}
			paramMap.put("repId", repId);
			
			RepVO repInfo = rep1000Service.selectRep1000Info(paramMap);
			
			if(repInfo == null) {
				response.setStatus(HttpStatus.SC_BAD_REQUEST);
				model.put("errorMsg", "소스저장소 정보를 찾을 수 없습니다.");
				return "/err/error";
			}
			
			String repTypeCd = "02";
			String fileName = filePath.substring(filePath.lastIndexOf("/")+1, filePath.length());
			
			
			long lastRevision = Long.parseLong(selRevision);
			long startRevision = lastRevision-100;
			
			
			if(startRevision <= 0) {
				startRevision = 1;
			}
			
			model.addAttribute("repId", repId);
			model.addAttribute("selRevision", selRevision);
			model.addAttribute("filePath", filePath);
			model.addAttribute("repTypeCd", repTypeCd);
			model.addAttribute("fileName", fileName);
			model.addAttribute("startRevision", startRevision);
			model.addAttribute("lastRevision", selRevision);
		}catch(Exception e) {
			response.setStatus(HttpStatus.SC_BAD_REQUEST);
			e.printStackTrace();
			throw new Exception(e.getMessage());
		}
		
		return "/rep/rep1000/rep1000/rep1007";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1008View.do")
	public String selectRep1008View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/rep/rep1000/rep1000/rep1008";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1000InfoAjax.do")
	public ModelAndView selectRep1000Info(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
	
			
			RepVO repMap = rep1000Service.selectRep1000Info(paramMap);
			
			model.addAttribute("repInfo", repMap);
	
			
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));

			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1000Info()", ex);

			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings("unused")
	@RequestMapping(value="/rep/rep1000/rep1000/saveRep1000InfoAjax.do")
	public ModelAndView saveRep1000InfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			RepVO repVo = new RepVO();
			BeanUtils.populate(repVo, paramMap);
			
			
			repVo.setGitRepUrlCheckCd(true);

			
			String popupGb = (String)paramMap.get("popupGb");

			
			String repTypeCd = (String)paramMap.get("repTypeCd");

			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			String dplUseCd = (String) paramMap.get("dplUseCd");
			
			
			
			if("insert".equals(popupGb)){
				
				if(repTypeCd != null && "01".equals(repTypeCd)) {
					
					String gitUsrAuthTypeCd = (String) paramMap.get("gitUsrAuthTypeCd");
					
					String gitUsrPw = null;
					String newEnPw = null;
					
					
					if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
						
						gitUsrPw = (String)paramMap.get("gitUsrPw");
					}
					
					else {
						
						gitUsrPw = (String)paramMap.get("gitUsrTk");
					}
					
					
					newEnPw = CommonScrty.encryptedAria(gitUsrPw, salt);
					
					
					
					if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
						paramMap.put("gitUsrPw", newEnPw);
						repVo.setGitUsrPw(newEnPw);
					}
					else {
						paramMap.put("gitUsrTk", newEnPw);
						repVo.setGitUsrTk(newEnPw);
					}
					
					
					
					String dplUsrId = (String) paramMap.get("gitUsrId");
					paramMap.put("dplUsrId", dplUsrId);
					repVo.setDplUsrId(dplUsrId);
					
					paramMap.put("dplUsrPw", newEnPw);
					repVo.setDplUsrPw(newEnPw);
					
				}
				
				else if(repTypeCd != null && "02".equals(repTypeCd)) {
					
					String svnUsrPw = (String)paramMap.get("svnUsrPw");
					
					
					String newEnPw = CommonScrty.encryptedAria(svnUsrPw, salt);
					
					
					paramMap.put("svnUsrPw", newEnPw);
					repVo.setSvnUsrPw(newEnPw);
				}
				
				else if(repTypeCd != null && "03".equals(repTypeCd)) {
					
					String gitUsrAuthTypeCd = (String) paramMap.get("gitUsrAuthTypeCd");
					
					String gitUsrPw = null;
					String newEnPw = null;
					
					
					if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
						
						gitUsrPw = (String)paramMap.get("gitUsrPw");
					}
					
					else {
						
						gitUsrPw = (String)paramMap.get("gitUsrTk");
					}
					
					
					newEnPw = CommonScrty.encryptedAria(gitUsrPw, salt);
					
					
					
					if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
						paramMap.put("gitUsrPw", newEnPw);
						repVo.setGitUsrPw(newEnPw);
					}
					else {
						paramMap.put("gitUsrTk", newEnPw);
						repVo.setGitUsrTk(newEnPw);
					}
				}
				
				if(dplUseCd != null && "01".equals(dplUseCd)) {
					
					String dplUsrPw = (String)paramMap.get("dplUsrPw");
					
					
					String newEnPw = CommonScrty.encryptedAria(dplUsrPw, salt);
					
					
					paramMap.put("dplUsrPw", newEnPw);
					repVo.setDplUsrPw(newEnPw);
				}
			}
			
			else if("update".equals(popupGb)){
				
				if(repTypeCd != null && "01".equals(repTypeCd)) {
					
					String gitUsrAuthTypeCd = (String) paramMap.get("gitUsrAuthTypeCd");
					
					
					String gitUsrPw = (String)paramMap.get("gitUsrPw");
					String newEnPw = "";
					
					
					String nowGitPw = (String)paramMap.get("nowGitPw");
					
					
					if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
						
						gitUsrPw = (String)paramMap.get("gitUsrPw");
					}
					
					else {
						
						gitUsrPw = (String)paramMap.get("gitUsrTk");
						
						
						nowGitPw = (String)paramMap.get("nowGitTk");
					}
					
					
					newEnPw = CommonScrty.encryptedAria(gitUsrPw, salt);
					
					
					
					if(!gitUsrPw.equals(nowGitPw) && !nowGitPw.equals(newEnPw)) {
						
						
						if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
							paramMap.put("gitUsrPw", newEnPw);
							repVo.setGitUsrPw(newEnPw);
						}
						else {
							paramMap.put("gitUsrTk", newEnPw);
							repVo.setGitUsrTk(newEnPw);
						}
					}
					
					
					
					String dplUsrId = (String) paramMap.get("gitUsrId");
					paramMap.put("dplUsrId", dplUsrId);
					repVo.setDplUsrId(dplUsrId);
					
					paramMap.put("dplUsrPw", newEnPw);
					repVo.setDplUsrPw(newEnPw);
				}
				
				else if(repTypeCd != null && "02".equals(repTypeCd)) {
					
					String nowSvnPw = (String)paramMap.get("nowSvnPw");
					
					
					String svnUsrPw = (String)paramMap.get("svnUsrPw");
					
					
					if(!nowSvnPw.equals(svnUsrPw)) {
						
						String newEnPw = CommonScrty.encryptedAria(svnUsrPw, salt);
						
						
						paramMap.put("svnUsrPw", newEnPw);
						repVo.setSvnUsrPw(newEnPw);
					}
				}
				
				else if(repTypeCd != null && "03".equals(repTypeCd)) {
					
					String gitUsrAuthTypeCd = (String) paramMap.get("gitUsrAuthTypeCd");
					
					
					String gitUsrPw = (String)paramMap.get("gitUsrPw");
					String newEnPw = "";
					
					
					String nowGitPw = (String)paramMap.get("nowGitPw");
					
					
					if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
						
						gitUsrPw = (String)paramMap.get("gitUsrPw");
					}
					
					else {
						
						gitUsrPw = (String)paramMap.get("gitUsrTk");
						
						
						nowGitPw = (String)paramMap.get("nowGitTk");
					}
					
					
					newEnPw = CommonScrty.encryptedAria(gitUsrPw, salt);
					
					
					
					if(!gitUsrPw.equals(nowGitPw) && !nowGitPw.equals(newEnPw)) {
						
						
						if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
							paramMap.put("gitUsrPw", newEnPw);
							repVo.setGitUsrPw(newEnPw);
						}
						else {
							paramMap.put("gitUsrTk", newEnPw);
							repVo.setGitUsrTk(newEnPw);
						}
					}
				}
				
				
				if(dplUseCd != null && "01".equals(dplUseCd)) {
					
					String nowDplPw = (String)paramMap.get("nowDplPw");
					
					
					String dplUsrPw = (String)paramMap.get("dplUsrPw");
					
					
					if(!nowDplPw.equals(dplUsrPw)) {
						
						String newEnPw = CommonScrty.encryptedAria(dplUsrPw, salt);
						
						
						paramMap.put("dplUsrPw", newEnPw);
						repVo.setDplUsrPw(newEnPw);
					}
				}
			}
			
			
			RepResultVO repResultVO = repModule.repAuthCheck(repVo);
			boolean repAuthCheck = repResultVO.isReturnValue();
			
			if(!repAuthCheck) {
				
				model.addAttribute("saveYN", "N");
				
				String resultCode = repResultVO.getResultCode();
				
				if(resultCode.equals(repResultVO.USER_AUTH_CHECK_FAIL)) {
					model.addAttribute("message", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.");
				}
				
				else if(resultCode.equals(repResultVO.REPOSITORY_NOT_ACCESS)) {
					model.addAttribute("message", repResultVO.getResultMsg()+"</br>입력된 값을 확인해주세요.</br>");
				}
				
				else if(resultCode.equals(repResultVO.DPL_USER_AUTH_CHECK_FAIL)) {
					model.addAttribute("message", repResultVO.getResultMsg()+"</br>입력된 값을 확인해주세요.</br>");
				}
				
				else if(resultCode.equals(repResultVO.DPL_USER_AUTH_CHECK_FAIL)) {
					model.addAttribute("message", repResultVO.getResultMsg()+"</br>입력된 값을 확인해주세요.</br>");
				}
				else {
					model.addAttribute("message", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.</br>"+repResultVO.getResultMsg());
				}
				
				return new ModelAndView("jsonView");
			}
			
			
			paramMap.put("repUuid", repResultVO.getUuid());
			paramMap.put("repDplUuid", repResultVO.getDplUuid());
			
			
			if(repTypeCd != null && !"02".equals(repTypeCd)) {
				paramMap.put("repDplUuid", repResultVO.getUuid());
				
				
				dplUseCd =  "01";
				paramMap.put("dplUseCd", dplUseCd);
			}
			
			
			Object insertKey = rep1000Service.saveRep1000Info(paramMap);
			
			
			if("insert".equals(popupGb)) {
				repVo.setRepId((String) insertKey);
			}
			
			else {
				
			}
				
			try {
				
				RepGetLogModule repGetLogModule = new RepGetLogModule();
				repGetLogModule.setTicketId("SYSTEM");
				repGetLogModule.setRepVO(repVo);
				repGetLogModule.setRepModule(repModule);
				repGetLogModule.setSvnConnector(svnConnector);
				repGetLogModule.setGithubConnector(githubConnector);
				repGetLogModule.setGitlabConnector(gitlabConnector);
				repGetLogModule.setRep1100Service(rep1100Service);
				repGetLogModule.start();
			}catch (Exception e) {
				Log.error("saveRep1000InfoAjax() - thread fail", e);
			}
	
			
			model.addAttribute("message", egovMessageSource.getMessage("success.common.save"));

			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("saveRep1000InfoAjax()", ex);

			
			model.addAttribute("saveYN", "N");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/rep/rep1000/rep1000/deleteRep1000InfoAjax.do")
	public ModelAndView deleteRep1000InfoAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, Object> paramMap = RequestConvertor.requestParamToMapAddSelInfoList(request, true, "repId");
			
			List paramRepIds = (List) paramMap.get("list");
			
			
			int paramRepIdCnt = 0;
			if(paramRepIds != null) {
				paramRepIdCnt = paramRepIds.size();
			}
			
			
			int succCnt = rep1000Service.deleteRep1000List(paramMap);
			
			if(paramRepIdCnt != 0 && succCnt > 0){
				model.addAttribute("errorYn", "N");
				
				String addMsg = "";
				
				if(succCnt != paramRepIdCnt) {
					addMsg = "</br>(구성항목에 배정되어있는 저장소 삭제 대상에서 제외)";
				}
				
				
				model.addAttribute("message", "선택된 데이터 "+succCnt+"건이 삭제되었습니다."+addMsg);
			}else {
				model.addAttribute("errorYn", "Y");
				
				model.addAttribute("message", "삭제 대상 저장소가 없습니다.");
			}
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("deleteRep1000InfoAjax()", ex);

			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1000ConfirmConnect.do")
	public ModelAndView selectRep1000ConfirmConnect(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{	
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);

			
			String GitRepUrlCheckCd = (String) paramMap.get("gitRepUrlCheckCd");
			if(GitRepUrlCheckCd != null && "Y".equals(GitRepUrlCheckCd)) {
				
				repVo.setGitRepUrlCheckCd(true);
			}
			
			
			RepResultVO repResultVO = repModule.repAuthCheck(repVo);
			boolean repAuthCheck = repResultVO.isReturnValue();

			
			if(!repAuthCheck) {
				model.addAttribute("MSG_CD", REP_AUTHENTICATION_EXCEPTION);
				model.addAttribute("saveYN", "N");
				model.addAttribute("message", repResultVO.getResultMsg());
				return new ModelAndView("jsonView");
			}

			model.addAttribute("MSG_CD", REP_OK);
			model.addAttribute("repInfo", repVo);
			model.addAttribute("lastRevisionNum", repResultVO.getLastRevisionNum());
			
			return new ModelAndView("jsonView");
		}
		catch(UserDefineException ude) {
			
			model.addAttribute("saveYN", "N");
			model.addAttribute("message", ude.getMessage());
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1000ConfirmConnect()", ex);
			if(ex instanceof SVNAuthenticationException ){
				model.addAttribute("MSG_CD", REP_AUTHENTICATION_EXCEPTION);
			}else if(ex instanceof SVNException ){
				model.addAttribute("MSG_CD", REP_EXCEPTION);
			} else{
				
				model.addAttribute("saveYN", "N");
				model.addAttribute("message", egovMessageSource.getMessage("fail.common.save"));
			}

			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1002RepositoryPageListAjaxView.do")
	public ModelAndView selectRep1002RepositoryPageListAjaxView(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);

			repVo.setGitRepUrlCheckCd(true);
			
			RepResultVO repResultVO = repModule.repAuthCheck(repVo);
			boolean repAuthCheck = repResultVO.isReturnValue();

			
			if(!repAuthCheck) {
				model.addAttribute("MSG_CD", REP_AUTHENTICATION_EXCEPTION);
				model.addAttribute("saveYN", "N");
				model.addAttribute("message", repResultVO.getResultMsg());
				
				
				model.addAttribute("errorYn", 'Y');
				return new ModelAndView("jsonView");
			}

			
			long lastRevisionNum = repResultVO.getLastRevisionNum();
			
			model.addAttribute("MSG_CD", REP_OK);
			
			
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
			
			
			PageVO pageVO = new PageVO();
			pageVO.setPageIndex(_pageNo);
			pageVO.setPageSize(_pageSize);
			pageVO.setPageUnit(_pageSize);
			PaginationInfo paginationInfo = PagingUtil.getPaginationInfo(pageVO);  
			
			
			paramMap.put("firstIndex", String.valueOf(pageVO.getFirstIndex()));
			paramMap.put("lastIndex", String.valueOf(pageVO.getLastIndex()));
			
			
			String startRevisionVal = (String)paramMap.get("startRevisionVal");
			String endRevisionVal = (String)paramMap.get("endRevisionVal");
			
			
			long lastRevision = lastRevisionNum;
			long startRevision = lastRevisionNum - 100;
			
			
			
			if(startRevisionVal != null && endRevisionVal != null && !"".equals(startRevisionVal) && !"".equals(endRevisionVal)) {
				
				startRevisionVal = startRevisionVal.replaceAll("/[^0-9]/g", "");
				endRevisionVal = endRevisionVal.replaceAll("/[^0-9]/g", "");
				
				long startRevisionValL = Long.valueOf(startRevisionVal);
				long endRevisionValL = Long.valueOf(endRevisionVal);
				
				
				if(endRevisionValL > lastRevision) {
					endRevisionValL = lastRevision;
				}
				if(startRevisionValL > lastRevision) {
					startRevisionValL = lastRevision;
				}
				
				
				if(startRevisionValL > endRevisionValL) {
					startRevisionValL = endRevisionValL;
				}
				
				startRevision = startRevisionValL;
				lastRevision = endRevisionValL;
			}
			
			
			if(startRevision < 0) {
				startRevision = 0;
			}
			
			
			if(lastRevision < 0) {
				lastRevision = 0;
			}
			
			paramMap.put("startRevisionVal", Long.toString(startRevision));
			paramMap.put("endRevisionVal", Long.toString(lastRevision));
			
			
			String selRepPath = (String) paramMap.get("selRepPath");
			
			
			if(selRepPath == null || "".equals(selRepPath)) {
				selRepPath = "/";
			}
			
			
			paramMap.put("selRepPath", selRepPath);
			
			
			int totCnt =  rep1100Service.selectRep1100RvListCnt(paramMap);
			paginationInfo.setTotalRecordCount(totCnt);
			
			
			List repDataList = (List) rep1100Service.selectRep1100RvList(paramMap);
			
			model.addAttribute("list", repDataList);
			
			
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",pageVO.getPageIndex());
			pageMap.put("listCount", repDataList.size());
			pageMap.put("totalPages", paginationInfo.getTotalPageCount());
			pageMap.put("totalElements", totCnt);
			pageMap.put("pageSize", _pageSize);
			
			model.addAttribute("page", pageMap);
			
			
			model.addAttribute("startRevision", startRevision);
			model.addAttribute("lastRevision", lastRevision);
			
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			
			
			
			
			return new ModelAndView("jsonView");
		}catch(UserDefineException ude) {
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", ude.getMessage());
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1002RepositoryPageListAjaxView()", ex);
			if(ex instanceof SVNAuthenticationException ){
				model.addAttribute("MSG_CD", REP_AUTHENTICATION_EXCEPTION);
			}else if(ex instanceof SVNException ){
				model.addAttribute("MSG_CD", REP_EXCEPTION);
			} else{
				
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			}

			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1002FileDirAjaxList.do")
	public ModelAndView selectRep1002FileDirAjaxList(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{

			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);
			
			Long revision =0l;
			
			if(paramMap.get("revision")!=null){
				
				try {
					revision = Long.parseLong((String) paramMap.get("revision"));
				}catch(NumberFormatException ne) {
					
				}
			}
			
			String commitId = "";
			
			if(paramMap.get("commitId")!=null){
				
				commitId = (String) paramMap.get("commitId");
			}

			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			String selRepPath = (String) paramMap.get("selRepPath");
			
			
			if(selRepPath == null || "".equals(selRepPath)) {
				selRepPath = "/";
			}
			
			
			String[] filePath = new String[] {selRepPath};
			
			
			RepDirVO repDirVO = repModule.setDirectoryList(repVo, revision, commitId, filePath);
			
			model.addAttribute("revisionDirList", repDirVO.getRevisionDirList());
			model.addAttribute("revisionFileList", repDirVO.getRevisionFileList());
			model.addAttribute("MSG_CD", Rep1000Controller.REP_OK);
			
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));

			return new ModelAndView("jsonView", paramMap);
		}
		catch(Exception ex){
			Log.error("selectRep1002FileDirAjaxList()", ex);
			
			if(ex instanceof SVNAuthenticationException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_AUTHENTICATION_EXCEPTION);
			}else if(ex instanceof SVNException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			} else{
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			}
			
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1003FileContentAjax.do")
	public ModelAndView selectRep1003FileContentAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{

			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);

			Long revision =0l;
			
			if(paramMap.get("revision")!=null){
				try {
					revision = Long.parseLong((String) paramMap.get("revision"));
				}catch(NumberFormatException ne) {
					
				}
			}
			
			String commitId = "";
			
			if(paramMap.get("commitId")!=null){
				
				commitId = (String) paramMap.get("commitId");
			}

			String path = (String) paramMap.get("path");

			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			String repTypeCd = repVo.getRepTypeCd();
			String content = null;
			
			if("01".equals(repTypeCd)) {
				
				content =  repModule.getFileContent(repVo, path, commitId, null);
			}
			
			else if("02".equals(repTypeCd)) {
				content =  repModule.getFileContent(repVo, path, revision);
			}
			
			else if("03".equals(repTypeCd)) {
			}
			
			model.addAttribute("content", content);

			
			model.addAttribute("MSG_CD", Rep1000Controller.REP_OK);
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));

			return new ModelAndView("jsonView", paramMap);
		}
		catch(Exception ex){
			Log.error("selectRep1003FileContentAjax()", ex);
			
			if(ex instanceof SVNAuthenticationException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_AUTHENTICATION_EXCEPTION);
			}else if(ex instanceof SVNException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			} else{
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			}
			
			
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1006FileDiffContentAjax.do")
	public ModelAndView selectRep1006FileDiffContentAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);

			
			HttpSession ss = request.getSession();
			paramMap.put("prjId", ss.getAttribute("selPrjId"));
			paramMap.put("authGrpId", ss.getAttribute("selAuthGrpId"));
			
			
			Long revision = 0l;
			if(paramMap.get("revision")!=null){
				try {
					revision = Long.parseLong((String) paramMap.get("revision"));
				}catch(NumberFormatException ne) {
					
				}
			}
			
			
			Long diffRevision = 0l;
			try {
				diffRevision = Long.parseLong((String) paramMap.get("diffRevision"));
			}catch(NumberFormatException ne) {
				
			}
			
			
			String commitId = (String) paramMap.get("commitId");
			
			
			String diffCommitId = (String) paramMap.get("diffCommitId");
			
			String path = (String) paramMap.get("path");

			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			String repTypeCd = repVo.getRepTypeCd();
			
			String content = null;
			
			if("01".equals(repTypeCd)) {
				
				content =  repModule.getFileContent(repVo, path, commitId, null);
			}
			
			else if("02".equals(repTypeCd)) {
				content =  repModule.getFileContent(repVo, path, revision);
			}
			
			else if("03".equals(repTypeCd)) {
			}
			
			
			String diffContent = null;
			
			if("01".equals(repTypeCd)) {
				
				diffContent =  repModule.getFileContent(repVo, path, diffCommitId, null);
			}
			
			else if("02".equals(repTypeCd)) {
				diffContent =  repModule.getFileContent(repVo, path, diffRevision);
			}
			
			else if("03".equals(repTypeCd)) {
			}
			

			model.addAttribute("content", content);
			model.addAttribute("diffContent", diffContent);

			
			model.addAttribute("MSG_CD", Rep1000Controller.REP_OK);
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));

			return new ModelAndView("jsonView", paramMap);
		}
		catch(Exception ex){
			Log.error("selectRep1006FileDiffContentAjax()", ex);
			
			if(ex instanceof SVNAuthenticationException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_AUTHENTICATION_EXCEPTION);
			}else if(ex instanceof SVNException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			} else{
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			}
			
			
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes" })
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1001RepTreeListAjax.do")
	public ModelAndView selectRep1001RepTreeListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			RepVO repVo = new RepVO();
			
			
			String svnRepUrl = (String) paramMap.get("svnRepUrl");
			String svnUsrId = (String) paramMap.get("svnUsrId");
			String svnUsrPw = (String) paramMap.get("svnUsrPw");
			String nowSvnPw = (String) paramMap.get("nowSvnPw");
			String gitRepUrl = (String) paramMap.get("gitRepUrl");
			String gitUsrTk = (String) paramMap.get("gitUsrTk");
			String nowGitTk = (String) paramMap.get("nowGitTk");
			String repTypeCd = (String) paramMap.get("repTypeCd");
			
			
			String type = (String) paramMap.get("type");
			
			
			String salt = EgovProperties.getProperty("Globals.lunaops.salt");
			
			
			if(type != null && "insert".equals(type)) {
				
				if("01".equals(repTypeCd)) {
					
					
					
					gitUsrTk = CommonScrty.encryptedAria(gitUsrTk, salt);
				}
				
				else if("02".equals(repTypeCd)) {
					
					
					svnUsrPw = CommonScrty.encryptedAria(svnUsrPw, salt);
				}
				
				else {
					
				}
			}
			
			else if("update".equals(type)) {
				if(!nowSvnPw.equals(svnUsrPw) || !nowGitTk.equals(gitUsrTk)) {
					
					if("01".equals(repTypeCd)) {
						
						
						
						gitUsrTk = CommonScrty.encryptedAria(gitUsrTk, salt);
					}
					
					else if("02".equals(repTypeCd)){
						
						svnUsrPw = CommonScrty.encryptedAria(svnUsrPw, salt);
					}
					
					else {
						
					}
				}
			}
			
			
			
			if("01".equals(repTypeCd)) {
				repVo.setGitRepUrl(gitRepUrl);
				repVo.setGitUsrTk(gitUsrTk);
			}
			
			else if("02".equals(repTypeCd)){
				repVo.setSvnRepUrl(svnRepUrl);
				repVo.setSvnUsrId(svnUsrId);
				repVo.setSvnUsrPw(svnUsrPw);
			}
			
			else {
				
			}
			repVo.setRepTypeCd(repTypeCd);
			
			
			repVo.setGitRepUrlCheckCd(true);
			
			
			RepResultVO repResultVO = repModule.repAuthCheck(repVo);
			boolean repAuthCheck = repResultVO.isReturnValue();
			
			
			if(!repAuthCheck) {
				model.addAttribute("MSG_CD", REP_AUTHENTICATION_EXCEPTION);
				model.addAttribute("errorYN", "Y");
				model.addAttribute("message", repResultVO.getResultMsg());
				return new ModelAndView("jsonView");
			}

			
			String path = (String) paramMap.get("path");
			
			List<Map> list = repModule.getPathList(repVo, path, null);
			model.addAttribute("list", list);
			
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("saveRep1001RepTreeListAjax()", ex);
			
			if(ex instanceof SVNAuthenticationException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_AUTHENTICATION_EXCEPTION);
			}else if(ex instanceof SVNException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			} else{
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			}
			
			
			model.addAttribute("errorYn", 'Y');
			
			
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1008CodeImprovementAjax.do")
	public ModelAndView selectRep1008CodeImprovementAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);

			
			HttpSession ss = request.getSession();
			paramMap.put("prjId", ss.getAttribute("selPrjId"));
			paramMap.put("authGrpId", ss.getAttribute("selAuthGrpId"));
			
			Long revision = 0l;
			if(paramMap.get("revision")!=null){
				try {
					revision = Long.parseLong((String) paramMap.get("revision"));
				}catch(NumberFormatException ne) {
					
				}
			}
			
			String commitId = "";
			
			if(paramMap.get("commitId")!=null){
				
				commitId = (String) paramMap.get("commitId");
			}
			
			String path = (String) paramMap.get("path");
			
			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			String repTypeCd = repVo.getRepTypeCd();
			
			String content = null;
			
			if("01".equals(repTypeCd)) {
				
				content =  repModule.getFileContent(repVo, path, commitId, null);
			}
			
			else if("02".equals(repTypeCd)) {
				content =  repModule.getFileContent(repVo, path, revision);
			}
			
			else if("03".equals(repTypeCd)) {
			}
			
			
			paramMap.put("content", content);
			
			
			model.addAttribute("revision", revision);
			model.addAttribute("commitId", commitId);
			model.addAttribute("path", path);
			model.addAttribute("content", content);
			
			
			
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1008CodeImprovementAjax()", ex);
			
			
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1008CallChatGPTAjax.do")
	public ModelAndView selectRep1008CallChatGPTAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);
			
			Map answerContent = repModule.getAnswerByChatGPT(paramMap);
			model.addAttribute("answerContent", answerContent);
			
			
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1008CallChatGPTAjax()", ex);
			
			
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
}
