package kr.opensoftlab.lunaops.rep.rep1000.rep1100.web;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.http.HttpStatus;
import org.apache.log4j.Logger;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.tmatesoft.svn.core.SVNAuthenticationException;
import org.tmatesoft.svn.core.SVNException;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.ptl.mvc.tags.ui.pagination.PaginationInfo;
import kr.opensoftlab.lunaops.com.api.service.ApiService;
import kr.opensoftlab.lunaops.com.vo.PageVO;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.web.Rep1000Controller;
import kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.Rep1100Service;
import kr.opensoftlab.sdf.rep.com.RepModule;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;
import kr.opensoftlab.sdf.rep.svn.SVNConnector;
import kr.opensoftlab.sdf.util.OslAgileConstant;
import kr.opensoftlab.sdf.util.OslUtil;
import kr.opensoftlab.sdf.util.PagingUtil;
import kr.opensoftlab.sdf.util.RequestConvertor;



@Controller
public class Rep1100Controller {

	
	private static final Logger Log = Logger.getLogger(Rep1100Controller.class);


	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	
	@Resource(name = "rep1000Service")
	private Rep1000Service rep1000Service;
	
	
	@Resource(name = "rep1100Service")
	private Rep1100Service rep1100Service;
	
	
	@Resource(name = "svnConnector")
	private SVNConnector svnConnector;
	
	
	@Resource(name = "repModule")
	private RepModule repModule;
	
	
	@Resource(name = "apiService")
	private ApiService apiService;
	
	
	@RequestMapping(value="/rep/rep1000/rep1100/selectRep1100View.do")
	public String selectRep1100View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try {
			
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			String ticketId = OslUtil.jsonGetString(jsonObj, "ticket_id");
			
			model.addAttribute("empId", empId);
			model.addAttribute("ticketId", ticketId);
		}catch(Exception e) {
			Log.error(e);
			e.printStackTrace();
		}
		
		return "/rep/rep1000/rep1100/rep1100";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1100/selectRep1102View.do")
	public String selectRep1102View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try {
			
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			
			
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
			
			model.addAttribute("empId", empId);
			model.addAttribute("ciId", ciId);
			model.addAttribute("ticketId", ticketId);
		}catch(Exception e) {
			Log.error(e);
			e.printStackTrace();
		}
		
		return "/rep/rep1000/rep1100/rep1102";
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1100/selectRep1103View.do")
	public String selectRep1103View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try {
			
			JSONObject jsonObj = (JSONObject) request.getAttribute("decodeJsonData");
			
			
			String empId = OslUtil.jsonGetString(jsonObj, "emp_id");
			
			
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
			
			model.addAttribute("empId", empId);
			model.addAttribute("ciId", ciId);
			model.addAttribute("ticketId", ticketId);
		}catch(Exception e) {
			Log.error(e);
			e.printStackTrace();
		}
		
		return "/rep/rep1000/rep1100/rep1103";
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/rep/rep1000/rep1100/selectRep1100TktRvFileChgListAjax.do")
	public ModelAndView selectRep1100TktRvFileChgListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			Object typeObj = paramMap.get("type");
			String type = null;
			if(typeObj != null) {
				type = (String) paramMap.get("type");
			}
			
			
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
			
			
			int totCnt = rep1100Service.selectRep1100TktRvFileChgListCnt(paramMap);

			
			if(type != null && "all".equals(type)) {
				paramMap.put("lastIndex", String.valueOf(totCnt));
			}else {
				paramMap.put("lastIndex", String.valueOf(pageVo.getLastIndex()));
			}
			
			
			rep1100List =  rep1100Service.selectRep1100TktRvFileChgList(paramMap);
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
			Log.error("selectRep1100TktRvFileChgListAjax()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@RequestMapping(value="/rep/rep1000/rep1100/selectRep1101View.do")
	public String selectRep1101View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/rep/rep1000/rep1100/rep1101";
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1100/selectRep1101FileDiffContentAjax.do")
	public ModelAndView selectRep1101FileDiffContentAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);
			
			
			Long revision = Long.parseLong((String) paramMap.get("revision"));
			
			
			String path = (String) paramMap.get("path");
			
			
			String buildBrancheNm = EgovProperties.getProperty("Globals.svn.buildBranchNm");
			
			
			String branchePath = "/branches/"+buildBrancheNm;
			
			
			if(branchePath.lastIndexOf("/") == (branchePath.length()-1)) {
				
				branchePath = branchePath.substring(0, branchePath.length()-1);
			}
			
			
			if(path.indexOf(branchePath) == -1) {
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", "정상적인 빌드 브런치에서 변경 생성된 파일이 아닙니다.");
				return new ModelAndView("jsonView");
			}
			
			
			String trunkPath = path.replace(branchePath, "/trunk");

			
			RepVO repVo = rep1000Service.selectRep1000Info(paramMap);
			
			
			String diffContent = repModule.getFileContent(repVo, trunkPath, -1, null);
			
			
			if(diffContent == null) {
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", "대상 경로 ("+trunkPath+")에 파일이 존재하지 않습니다.");
				return new ModelAndView("jsonView");
			}
			
			
			String content = repModule.getFileContent(repVo, path, revision, null);
			
			
			model.addAttribute("content", content);
			model.addAttribute("diffContent", diffContent);
			
			
			model.addAttribute("revision", revision);

			
			model.addAttribute("errorYn", "N");
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));

			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1101FileDiffContentAjax()", ex);
			
			if(ex instanceof SVNAuthenticationException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_AUTHENTICATION_EXCEPTION);
			}else if(ex instanceof SVNException ){
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			} else{
				model.addAttribute("MSG_CD", Rep1000Controller.REP_EXCEPTION);
			}
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1100/insertRep1100SelTktFileCommitAjax.do")
	public ModelAndView insertRep1100SelTktFileCommitAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);
			
			
			Map rtnMap = rep1100Service.insertRep1100SelTktFileCommitAjax(paramMap);
			
			
			boolean result = (boolean)rtnMap.get("result");
			
			int succCnt = (int)rtnMap.get("succCnt");
			
			List<String> errorMsgList = (List<String>) rtnMap.get("errorMsg");
			
			model.addAttribute("succCnt", succCnt);
			model.addAttribute("errorMsgList", errorMsgList);
			
			if(result) {
				
				model.addAttribute("errorYn", "N");
				model.addAttribute("message", egovMessageSource.getMessage("success.common.insert"));
			}else {
				
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", egovMessageSource.getMessage("fail.common.insert"));
			}
			
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("insertRep1100SelTktFileCommitAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.insert"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1100/selectRep1102RsyncResultListAjax.do")
	public ModelAndView selectRep1102RsyncResultListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);
			
			
			String errorYn = "N";
			String message = egovMessageSource.getMessage("success.common.select");
			
			
			String rsyncResultPathStr = EgovProperties.getProperty("Globals.rsyncResult.path");
			
			
			String ciId = (String) paramMap.get("ciId");
			String ticketId = (String) paramMap.get("ticketId");
			String jobId = (String) paramMap.get("jobId");
			String bldNum = String.valueOf(paramMap.get("bldNum"));
			
			
			String checkPath = rsyncResultPathStr;
			
			
			File checkPathFile = new File(checkPath);
			if(checkPathFile.exists() && checkPathFile.isDirectory()) {
				
				if(checkPath.lastIndexOf("/") != (checkPath.length()-1)) {
					checkPath += "/";
				}
				
				checkPath += ticketId;
				checkPathFile = new File(checkPath);
				if(checkPathFile.exists() && checkPathFile.isDirectory()) {
					
					checkPath += "/";
					
					
					checkPath += jobId;
					
					
					checkPathFile = new File(checkPath);
					if(checkPathFile.exists() && checkPathFile.isDirectory()) {
						
						checkPath += "/";
						
						checkPath += bldNum;
						
						checkPathFile = new File(checkPath);
						if(checkPathFile.exists() && checkPathFile.isDirectory()) {
							
							checkPath += "/";
							
							
							File uuidText = new File(checkPath+"uuid.txt");
							if(uuidText.exists() && uuidText.isFile()) {
								List<String> repUuidArr = FileUtils.readLines(uuidText, "UTF-8");
								
								Map newParamMap = new HashMap<>();
								newParamMap.put("repDplUuid", repUuidArr.get(0));
								
								RepVO repInfo = rep1000Service.selectRep1000Info(newParamMap);
								
								
								if(repInfo == null) {
									errorYn = "Y";
									message = "소스저장소 정보를 불러오는 도중 오류가 발생했습니다. (SVN_UUID 값 오류)";
								}else {
									
									String repId = repInfo.getRepId();
									
									
									newParamMap.put("ciId", ciId);
									newParamMap.put("ticketId", ticketId);
									newParamMap.put("jobId", jobId);
									newParamMap.put("bldNum", bldNum);
									newParamMap.put("repId", repId);
									
									
									List<Map> dplFileChgList = rep1100Service.selectRep1102DplChgFileList(newParamMap);
									
									List<String> dupleCheckPath = new ArrayList<String>();
									
									
									for(Map dplFileChgInfo : dplFileChgList) {
										
										String repChgFilePath = (String) dplFileChgInfo.get("rep_chg_file_path");
										
										
										if(dupleCheckPath.indexOf(repChgFilePath) != -1) {
											continue;
										}
										
										dupleCheckPath.add(repChgFilePath);
										System.out.println(repChgFilePath);
									}
									
									model.addAttribute("dplFileChgList", dplFileChgList);
									
									
									String[] fileNmList = checkPathFile.list();
									
									long fileDate = 0;
									for(String fileNm : fileNmList) {
										if(fileNm.contains("change_file_")) {
											
											String[] splitNm = fileNm.split("change_file_");
											long cursorFileDate = Long.parseLong(splitNm[1].substring(0,splitNm[1].indexOf(".")));
											
											if(cursorFileDate > fileDate) {
												fileDate = cursorFileDate;
											}
										}
									}
									
									if(fileDate != 0) {
										String changeFileNm = "change_file_"+String.valueOf(fileDate)+".txt"; 
										
										File changeFile = new File(checkPath+changeFileNm);
										if(changeFile.exists() && changeFile.isFile()) {
											
											List<String> rsyncResultContents = FileUtils.readLines(changeFile, "UTF-8");
											
											
											List<Map> fileChgList = new ArrayList<Map>();
											for(int i=0;i<rsyncResultContents.size();i++) {
												String readContent = rsyncResultContents.get(i);
												
												if(readContent == null || readContent.length() == 0) {
													continue;
												}
												
												char fileTypeNm = readContent.charAt(0);
												
												
												String fileChgPath = readContent.substring(1, readContent.length());
												
												
												if(fileChgPath.indexOf("/") != 0) {
													fileChgPath += "/";
												}
												
												
												if(dupleCheckPath.indexOf(fileChgPath) != -1) {
													continue;
												}
												
												String fileTypeCd = "02";
												if(fileTypeNm == 'A') {
													fileTypeCd = "01";
												}
												else if(fileTypeNm == 'M') {
													fileTypeCd = "02";
												}
												else if(fileTypeNm == 'D') {
													fileTypeCd = "03";
												}else {
													fileTypeCd = "02";
												}
												
												Map newMap = new HashMap<>();
												newMap.put("fileRealPath", checkPath+fileChgPath);
												newMap.put("filePath", fileChgPath);
												newMap.put("fileTypeNm", fileTypeNm);
												newMap.put("fileTypeCd", fileTypeCd);
												newMap.put("changeFilePath", fileChgPath);
												newMap.put("ciId", ciId);
												newMap.put("ticketId", ticketId);
												newMap.put("repId", repId);
												newMap.put("jobId", jobId);
												newMap.put("bldNum", bldNum);
												fileChgList.add(newMap);
											}
											model.addAttribute("fileChgList", fileChgList);
											
										}else {
											errorYn = "Y";
											message = "변경 정보를 가진 파일을 찾을 수 없습니다. (change_file_*.txt)";
										}
									}else {
										errorYn = "Y";
										message = "변경 정보를 가진 파일을 찾을 수 없습니다. (change_file_*.txt)";
									}
								}
							}else {
								errorYn = "Y";
								message = "root경로를 가진 정보 파일을 찾을 수 없습니다. (path.txt)";
							}
						}else {
							
							errorYn = "Y";
							message = "빌드 번호("+bldNum+")에 해당하는 경로 없음";
						}
					}else {
						
						errorYn = "Y";
						message = "job("+jobId+")에 해당하는 경로 없음";
					}
				}else {
					
					errorYn = "Y";
					message = "티켓 경로 없음";
				}
				
			}else {
				
				errorYn = "Y";
				message = "rsync결과 경로 없음";
			}
			
			
			model.addAttribute("errorYn", errorYn);
			model.addAttribute("message", message);
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1102RsyncResultListAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1100/insertRep1102TargetDataDeployCommitAjax.do")
	public ModelAndView insertRep1102TargetDataDeployCommitAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);
			
			
			Map rtnMap = rep1100Service.insertRep1102TargetDataDeployCommitAjax(paramMap);
			
			
			boolean result = (boolean)rtnMap.get("result");
			
			int succCnt = (int)rtnMap.get("succCnt");
			
			List<String> errorMsgList = (List<String>) rtnMap.get("errorMsg");
			
			model.addAttribute("succCnt", succCnt);
			model.addAttribute("errorMsgList", errorMsgList);
			
			if(result) {
				
				model.addAttribute("errorYn", "N");
				model.addAttribute("message", egovMessageSource.getMessage("success.common.insert"));
			}else {
				
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", egovMessageSource.getMessage("fail.common.insert"));
			}
			
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			ex.printStackTrace();
			Log.error("insertRep1102TargetDataDeployCommitAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.insert"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value="/rep/rep1000/rep1100/selectRep1103TktDplFileChgListAjax.do")
	public ModelAndView selectRep1103TktDplFileChgListAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			
			paramMap.put("notDelete", "Y");
			
			List<Map> rep1103List =  rep1100Service.selectRep1102TktDplFileChgList(paramMap);
			
			model.addAttribute("list", rep1103List);
			
			
			model.addAttribute("errorYn", 'N');
			model.addAttribute("message", egovMessageSource.getMessage("success.common.select"));
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectRep1103TktDplFileChgListAjax()", ex);
			
			model.addAttribute("errorYn", 'Y');
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.select"));
			return new ModelAndView("jsonView");
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value="/rep/rep1000/rep1100/insertRep1103TktDplFileSelectAjax.do")
	public ModelAndView insertRep1103TktDplFileSelectAjax(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{
			
			Map paramMap = RequestConvertor.requestParamToMap(request,true);
			
			
			Map rtnMap = rep1100Service.insertRep1103TktDplFileSelectAjax(paramMap);
			
			
			boolean result = (boolean)rtnMap.get("result");
			
			int succCnt = (int)rtnMap.get("succCnt");
			
			List<String> errorMsgList = (List<String>) rtnMap.get("errorMsg");
			
			model.addAttribute("succCnt", succCnt);
			model.addAttribute("errorMsgList", errorMsgList);
			
			if(result) {
				
				model.addAttribute("errorYn", "N");
				model.addAttribute("message", egovMessageSource.getMessage("success.common.insert"));
			}else {
				
				model.addAttribute("errorYn", "Y");
				model.addAttribute("message", egovMessageSource.getMessage("fail.common.insert"));
			}
			
			
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("insertRep1103TktDplFileSelectAjax()", ex);
			
			
			model.addAttribute("errorYn", "Y");
			model.addAttribute("message", egovMessageSource.getMessage("fail.common.insert"));
			return new ModelAndView("jsonView");
		}
	}
}
