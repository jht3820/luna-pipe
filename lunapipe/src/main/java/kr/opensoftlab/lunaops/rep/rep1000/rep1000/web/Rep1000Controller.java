package kr.opensoftlab.lunaops.rep.rep1000.rep1000.web;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.http.HttpStatus;
import org.apache.log4j.Logger;
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
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.vo.Rep1000VO;
import kr.opensoftlab.sdf.rep.com.RepModule;
import kr.opensoftlab.sdf.rep.com.vo.RepDirVO;
import kr.opensoftlab.sdf.rep.com.vo.RepResultVO;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;
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
	
	
	@Resource(name = "svnConnector")
	private SVNConnector svnConnector;
	
	
	@Resource(name = "repModule")
	private RepModule repModule;
	
	
	@Resource(name = "apiService")
	private ApiService apiService;
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1000RepositoryView.do")
	public String selectRep1000RepositoryView(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		
		try {
			
			String salt = EgovProperties.getProperty("Globals.data.salt");
			
			
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			jsonObj.put("current_date", new Date().getTime());
			
			
			byte[] arr = new byte[8];
	        new Random().nextBytes(arr);
	        
	        StringBuilder result = new StringBuilder();
	        for (byte temp : arr) {
	            result.append(String.format("%02x", temp));
	        }

			
			jsonObj.put("lunaCheckCode", result.toString());
			
			
			request.getSession().setAttribute("lunaCheckCode", result.toString());
			
			
			String rtnData = CommonScrty.encryptedAria(jsonObj.toString(), salt);
			
			model.put("rtnData", rtnData);
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
						
			
			String repId = paramMap.get("repId");
			
			if(repId != null) {
				
				String lunaCheckCode = (String) request.getSession().getAttribute("lunaCheckCode");
				
				
				if(lunaCheckCode == null) {
					response.setStatus(HttpStatus.SC_BAD_REQUEST);
					model.put("errorMsg", "인증 코드를 읽는 중 오류가 발생했습니다.");
					return "/err/error";
				}
				
				String data = (String) paramMap.get("data");
				
				
				Object checkParam = apiService.checkParamDataKey(data);
				
				
				if(checkParam instanceof String) {
					model.put("errorMsg", "오류 코드: "+ checkParam.toString());
					return "/err/error";
				}else {
					
					JSONObject jsonObj = (JSONObject) checkParam;
					
					
					if(!jsonObj.has("lunaCheckCode")) {
						response.setStatus(HttpStatus.SC_METHOD_NOT_ALLOWED);
						model.put("errorMsg", "인증 코드를 읽는 중 오류가 발생했습니다.");
						return "/err/error";
					}
					
					String jsonLunaCheckCode = OslUtil.jsonGetString(jsonObj, "lunaCheckCode");
					
					if(jsonLunaCheckCode == null || !jsonLunaCheckCode.equals(lunaCheckCode)) {
						response.setStatus(HttpStatus.SC_METHOD_NOT_ALLOWED);
						model.put("errorMsg", "인증 코드를 읽는 중 오류가 발생했습니다.");
						return "/err/error";
					}
				}
			}else {
				JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
				
				
				repId = OslUtil.jsonGetString(jsonObj, "repId");
			}
			model.put("repId", "repId");
			
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
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1005View.do")
	public String selectRep1005View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/rep/rep1000/rep1000/rep1005";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1000/selectRep1006View.do")
	public String selectRep1006View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/rep/rep1000/rep1000/rep1006";
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
			
			
			if("insert".equals(popupGb)){
				
				if(repTypeCd != null && "01".equals(repTypeCd)) {
					
					String gitUsrAuthTypeCd = (String) paramMap.get("gitUsrAuthTypeCd");
					
					
					if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
						
						String gitUsrPw = (String)paramMap.get("gitUsrPw");
						
						
						String newEnPw = CommonScrty.encryptedAria(gitUsrPw, salt);
						
						
						paramMap.put("gitUsrPw", newEnPw);
						repVo.setGitUsrPw(newEnPw);
					}
					
				}
				
				else if(repTypeCd != null && "02".equals(repTypeCd)) {
					
					String svnUsrPw = (String)paramMap.get("svnUsrPw");
					
					
					String newEnPw = CommonScrty.encryptedAria(svnUsrPw, salt);
					
					
					paramMap.put("svnUsrPw", newEnPw);
					repVo.setSvnUsrPw(newEnPw);
				}
				
				else if(repTypeCd != null && "03".equals(repTypeCd)) {
					
					String gitUsrAuthTypeCd = (String) paramMap.get("gitUsrAuthTypeCd");
					
					
					if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
						
						String gitUsrPw = (String)paramMap.get("gitUsrPw");
						
						
						String newEnPw = CommonScrty.encryptedAria(gitUsrPw, salt);
						
						
						paramMap.put("gitUsrPw", newEnPw);
						repVo.setGitUsrPw(newEnPw);
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
				else {
					model.addAttribute("message", "입력하신 소스저장소 사용자 인증에 실패했습니다.</br>입력된 값을 확인해주세요.</br>"+repResultVO.getResultMsg());
				}
				
				return new ModelAndView("jsonView");
			}
			
			
			Object insertKey = rep1000Service.saveRep1000Info(paramMap);
	
			
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
				
				
				model.addAttribute("message", "선택된 데이터 "+paramRepIdCnt+"건 중 "+succCnt+"건이 삭제되었습니다."+addMsg);
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
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
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
				return new ModelAndView("jsonView");
			}

			
			long lastRevisionNum = repResultVO.getLastRevisionNum();
			
			model.addAttribute("MSG_CD", REP_OK);
			
			
			String _pageNo_str = paramMap.get("pageNo");
			String _pageSize_str = paramMap.get("pageSize");
			
			int _pageNo = 0;
			int _pageSize = OslAgileConstant.pageSize;
			
			if(_pageNo_str != null && !"".equals(_pageNo_str)){
				_pageNo = Integer.parseInt(_pageNo_str);  
			}
			if(_pageSize_str != null && !"".equals(_pageSize_str)){
				_pageSize = Integer.parseInt(_pageSize_str);  
			}
			
			
			String searchFilePath = (String)paramMap.get("filePath");
			
			
			Map searchMap = null;
			
			
			String searchSelect = (String)paramMap.get("searchSelect");
			
			
			String searchTxt = (String)paramMap.get("searchTxt");
			String searchStDate = (String)paramMap.get("searchStDate");
			String searchEdDate = (String)paramMap.get("searchEdDate");
			
			
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
			
			
			if(searchSelect != null && !"".equals(searchSelect)) {
				searchMap = new HashMap<>();
				searchMap.put("searchSelect", searchSelect);
				searchMap.put("searchTxt", searchTxt);
				searchMap.put("searchStDate", searchStDate);
				searchMap.put("searchEdDate", searchEdDate);
			}
			
			String[] filePath = new String[] {};
			
			
			if(searchFilePath != null && !"".equals(searchFilePath)) {
				filePath = new String[] {searchFilePath};
			}
			
			Map repDataMap = repModule.selectRepLogPageList(repResultVO, filePath, startRevision, lastRevision, _pageNo, _pageSize, searchMap);
			
			
			int totCnt = Integer.valueOf(String.valueOf(repDataMap.get("repDataAllSize")));
			List repDataList = (List)repDataMap.get("repDataList");
			
			model.addAttribute("list", repDataList);
			
			
			int totalPageCount = ((totCnt - 1) / _pageSize) + 1;
			
			
			Map<String, Integer> pageMap = new HashMap<String, Integer>();
			pageMap.put("pageNo",(_pageNo+1));
			pageMap.put("listCount", repDataList.size());
			pageMap.put("totalPages", totalPageCount);
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
			Log.error("selectRep1000RepositoryListAjaxView()", ex);
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
				
				revision = Long.parseLong((String) paramMap.get("revision"));	
			}
			
			String commitId = "";
			
			if(paramMap.get("commitId")!=null){
				
				commitId = (String) paramMap.get("commitId");	
			}

			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			RepDirVO repDirVO = repModule.setDirectoryList(repVo, revision, commitId);
			
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
				revision = Long.parseLong((String) paramMap.get("revision"));	
			}
			
			String commitId = "";
			
			if(paramMap.get("commitId")!=null){
				
				commitId = (String) paramMap.get("commitId");	
			}

			String path = (String) paramMap.get("path");

			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			String content = repModule.getFileContent(repVo, path, revision, commitId);
			
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
			
			
			Long revision = Long.parseLong((String) paramMap.get("revision"));
			
			
			Long diffRevision = Long.parseLong((String) paramMap.get("diffRevision"));	
			
			
			String commitId = (String) paramMap.get("commitId");
			
			
			String diffCommitId = (String) paramMap.get("diffCommitId");	

			String path = (String) paramMap.get("path");

			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			String content = repModule.getFileContent(repVo, path, revision, commitId);
			
			
			String diffContent = repModule.getFileContent(repVo, path, diffRevision, diffCommitId);

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
	@RequestMapping(value="/rep/rep1000/rep1000/saveRep1001RepTreeListAjax.do")
	public ModelAndView saveRep1001RepTreeListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			RepVO repVo = new RepVO();
			
			
			String svnRepUrl = (String) paramMap.get("svnRepUrl");
			String svnUsrId = (String) paramMap.get("svnUsrId");
			String svnUsrPw = (String) paramMap.get("svnUsrPw");
			String repTypeCd = (String) paramMap.get("repTypeCd");
			
			repVo.setSvnRepUrl(svnRepUrl);
			repVo.setSvnUsrId(svnUsrId);
			repVo.setSvnUsrPw(svnUsrPw);
			repVo.setRepTypeCd(repTypeCd);
			
			
			repVo.setGitRepUrlCheckCd(true);

			
			String path = (String) paramMap.get("path");
			
			List<Map> list = repModule.getPathList(repVo, path, null);
			model.addAttribute("list", list);
			
			
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
			
			
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
}
