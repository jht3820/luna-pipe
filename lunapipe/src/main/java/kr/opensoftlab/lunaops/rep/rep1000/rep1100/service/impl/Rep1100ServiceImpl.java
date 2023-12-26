package kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;
import org.kohsuke.github.GHCommit;
import org.kohsuke.github.GHContent;
import org.kohsuke.github.GHFileNotFoundException;
import org.kohsuke.github.GHPullRequest.MergeMethod;
import org.kohsuke.github.GHRef;
import org.kohsuke.github.GHRepository;
import org.springframework.stereotype.Service;
import org.tmatesoft.svn.core.SVNCommitInfo;
import org.tmatesoft.svn.core.SVNDepth;
import org.tmatesoft.svn.core.SVNException;
import org.tmatesoft.svn.core.SVNLock;
import org.tmatesoft.svn.core.SVNNodeKind;
import org.tmatesoft.svn.core.SVNURL;
import org.tmatesoft.svn.core.io.ISVNEditor;
import org.tmatesoft.svn.core.io.SVNRepository;
import org.tmatesoft.svn.core.io.diff.SVNDeltaGenerator;
import org.tmatesoft.svn.core.wc.ISVNOptions;
import org.tmatesoft.svn.core.wc.SVNClientManager;
import org.tmatesoft.svn.core.wc.SVNRevision;
import org.tmatesoft.svn.core.wc.SVNUpdateClient;
import org.tmatesoft.svn.core.wc.SVNWCUtil;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import jline.internal.Log;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.Rep1100Service;
import kr.opensoftlab.sdf.rep.com.RepModule;
import kr.opensoftlab.sdf.rep.com.vo.RepDataVO;
import kr.opensoftlab.sdf.rep.com.vo.RepResultVO;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;


@Service("rep1100Service")
public class Rep1100ServiceImpl extends EgovAbstractServiceImpl implements Rep1100Service{
	
	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;
	
	
	@Resource(name="rep1100DAO")
    private Rep1100DAO rep1100DAO;

	
	@Resource(name = "rep1000Service")
	private Rep1000Service rep1000Service;

	
	@Resource(name = "repModule")
	private RepModule repModule;
	
	
	@SuppressWarnings("rawtypes")
	private static Map<String, List<Map>> rep1101List = new HashMap<>();
	
	
	@SuppressWarnings("rawtypes")
	public List<Map> getRep1101List(String repId) throws Exception {
		return rep1101List.get(repId);
	}
	
	@SuppressWarnings("rawtypes")
	public void setRep1101List(String repId, List<Map> fileList) throws Exception {
		rep1101List.put(repId, fileList);
	}
	
	public void removeRep1101List(String repId) throws Exception {
		rep1101List.remove(repId);
	}
	
	
	@SuppressWarnings("rawtypes")
	private static Map<String, List<Map>> rep1102List = new HashMap<>();
	
	
	@SuppressWarnings("rawtypes")
	public List<Map> getRep1102List(String repId) throws Exception {
		return rep1102List.get(repId);
	}
	
	@SuppressWarnings("rawtypes")
	public void setRep1102List(String repId, List<Map> fileList) throws Exception {
		rep1102List.put(repId, fileList);
	}
	
	public void removeRep1102List(String repId) throws Exception {
		rep1102List.remove(repId);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectRep1100RvInfo(Map paramMap) throws Exception {
		return rep1100DAO.selectRep1100RvInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public int selectRep1100RvListCnt(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100RvListCnt(paramMap);
	}
	

	
	@SuppressWarnings({ "rawtypes" })
	public List<Map> selectRep1100RvList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100RvList(paramMap);
	}
	
	@SuppressWarnings( "rawtypes")
	public List<Map> selectRep1101RvChgFileList(Map paramMap) throws Exception {
		return rep1100DAO.selectRep1101RvChgFileList(paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes" })
	public List<Map> selectRep1102DplChgFileList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1102DplChgFileList(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertRep1100RvInfo(Map paramMap) throws Exception{
		return rep1100DAO.insertRep1100RvInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public int updateRep1100RvInfo(Map paramMap) throws Exception{
		return rep1100DAO.updateRep1100RvInfo(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public String insertRep1101RvChgInfo(Map paramMap) throws Exception{
		return rep1100DAO.insertRep1101RvChgInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertRep1102RvChgInfo(Map paramMap) throws Exception{
		return rep1100DAO.insertRep1102RvChgInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteRep1101RvChgList(Map paramMap) throws Exception{
		rep1100DAO.deleteRep1101RvChgList(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public int selectRep1100TktRvFileChgListCnt(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktRvFileChgListCnt(paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes"})
	public List<Map> selectRep1100TktRvFileChgList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktRvFileChgList(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public int selectRep1100TktTrunkRvFileChgListCnt(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktTrunkRvFileChgListCnt(paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes"})
	public List<Map> selectRep1100TktTrunkRvFileChgList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktTrunkRvFileChgList(paramMap);
	}
	
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRep1100SelTktFileCommitAjax(Map paramMap) throws Exception{
		
		
		Map rtnMap = new HashMap<>();
		
		
		int succCnt = 0;
		
		
		boolean result = false;
		
		
		List<String> errorMsg = new ArrayList<String>();
		
		
		Map<String, RepResultVO> repInfoMap = new HashMap<String, RepResultVO>();
		
		
		Map<String, List<JSONObject>> repFileMap = new HashMap<String, List<JSONObject>>();
		
		
		Map<String, List<JSONObject>> repDirMap = new HashMap<String, List<JSONObject>>();
		
		
		String returnMap = (String) paramMap.get("returnMap");
		
		
		JSONArray jsonArr = new JSONArray(returnMap);
		
		
		String buildBranchNm = EgovProperties.getProperty("Globals.svn.buildBranchNm");
		
		
		JSONObject jsonInfoIdx0 = null;
		String ticketIdIdx0 = "";
		if(jsonArr != null && jsonArr.length() > 0) {
			jsonInfoIdx0 = jsonArr.getJSONObject(0);
			ticketIdIdx0 = (String) jsonInfoIdx0.get("ticketId");
			
			buildBranchNm += "_"+ticketIdIdx0;
		}
		
		
		String branchePath = "/branches/"+buildBranchNm;
		
		
		if(branchePath.lastIndexOf("/") == (branchePath.length()-1)) {
			
			branchePath = branchePath.substring(0, branchePath.length()-1);
		}
		
		if(jsonArr != null && jsonArr.length() > 0) {
			
			List<String> makePathCheck = new ArrayList<String>();
			List<String> checkDirList = new ArrayList<String>();
			
			
			for(int i=0;i<jsonArr.length();i++) {
				JSONObject jsonInfo = jsonArr.getJSONObject(i);
				
				String repChgFileKind = (String) jsonInfo.get("repChgFileKind");
				if("dir".equals(repChgFileKind)) {
					
					String repChgFilePath = (String) jsonInfo.get("repChgFilePath");
					
					
					String trunkPath = repChgFilePath.replace(branchePath, "/trunk");
							
					
					checkDirList.add(trunkPath);
				}
			}

			
			for(int i=0;i<jsonArr.length();i++) {
				JSONObject jsonInfo = jsonArr.getJSONObject(i);

				
				String repId = (String) jsonInfo.get("repId");
				
				String repChgFilePath = (String) jsonInfo.get("repChgFilePath");
				
				Long repRv = 0l;
				
				if(jsonInfo.get("repRv")!=null){
					
					try {
						repRv = Long.parseLong((String) jsonInfo.get("repRv"));
					}catch(NumberFormatException ne) {
						
					}
				}
				
				
				String ticketId = (String) jsonInfo.get("ticketId");
				
				String empId = (String) jsonInfo.get("empId");
				
				RepResultVO repResultVo = null;
				
				if(!repFileMap.containsKey(repId)) {
					
					Map newMap = new HashMap<>();
					newMap.put("repId", repId);
					
					
					RepVO repVo = rep1000Service.selectRep1000Info(newMap);

					
					repResultVo = repModule.repAuthCheck(repVo);
					repResultVo.setLastRevisionNum(repRv);
					repResultVo.setLastRevision(String.valueOf(repRv));
					repResultVo.setEmpId(empId);
					repResultVo.setTicketId(ticketId);
					
					
					repInfoMap.put(repId, repResultVo);
					
					
					repDirMap.put(repId, new ArrayList<JSONObject>());
					repFileMap.put(repId, new ArrayList<JSONObject>());
				}
				
				repResultVo = repInfoMap.get(repId);
				
				
				if(!repResultVo.isReturnValue()) {
					errorMsg.add("- 소스저장소 연결 실패 [repNm="+repResultVo.getRepVo().getRepNm()+"]");
					continue;
				}
				
				ObjectMapper objectMapper = new ObjectMapper();
				Map<String, Object> resultMap = objectMapper.readValue(jsonInfo.toString(), Map.class);
				
				
				Map newRepoMap = new HashMap<>();
				newRepoMap.putAll(resultMap);
				newRepoMap.put("repResultVo", repResultVo);
				
				newRepoMap.put("makePathCheck", makePathCheck);
				
				newRepoMap.put("checkDirList", checkDirList);
				
				
				
				Map repRtnMap = null;
				
				
				RepVO repVo = repResultVo.getRepVo();
				
				if("01".equals(repVo.getRepTypeCd())){
					repRtnMap= insertRep1100SelTktFileCommitByGitHub(newRepoMap);
				}
				
				else if("02".equals(repVo.getRepTypeCd())){
					
					if(repChgFilePath.indexOf(branchePath) == -1) {
						errorMsg.add("- 대상 파일 경로가 지정된 브런치 경로가 아닙니다. [path="+repChgFilePath+"]");
						continue;
					}
					repRtnMap= insertRep1100SelTktFileCommitBySVN(newRepoMap);
				}
				
				else if("03".equals(repVo.getRepTypeCd())){
					
				}
				
				errorMsg.addAll((List) repRtnMap.get("errorMsg"));
				List<Map> fileList = (List) repFileMap.get(repId);
				fileList.addAll((List) repRtnMap.get("fileList"));
				
				repFileMap.put(repId, (List) fileList);
				List<Map> dirList = (List) repDirMap.get(repId);
				dirList.addAll((List) repRtnMap.get("dirList"));
				
				repFileMap.put(repId, (List) fileList);
				repDirMap.put(repId, (List) dirList);
			}
			
			
			Iterator itr = repInfoMap.keySet().iterator();
			while(itr.hasNext()) {
				
				String repId = (String) itr.next();
				
				
				RepResultVO repResultVo = repInfoMap.get(repId);
				RepVO repVo = repResultVo.getRepVo();
				
				Map newParamMap = new HashMap<>();
				newParamMap.put("repResultVo", repResultVo);
				newParamMap.put("fileList", repFileMap.get(repId));
				newParamMap.put("dirList", repDirMap.get(repId));
				
				newParamMap.put("makePathCheck", makePathCheck);
				
				Map rtnCommitMap = null;
				
				if("01".equals(repVo.getRepTypeCd())) {
					rtnCommitMap = insertRep1100CommitByGitHub(newParamMap);
				}
				
				else if("02".equals(repVo.getRepTypeCd())) {
					rtnCommitMap = insertRep1100CommitBySVN(newParamMap);
				}
				
				else if("03".equals(repVo.getRepTypeCd())) {
					
				}
				
				if((boolean) rtnCommitMap.get("isLockFile")) {
					
					rtnMap.put("result", (boolean) rtnCommitMap.get("result"));
					
					rtnMap.put("succCnt", 0);
					
					rtnMap.put("errorMsg", rtnCommitMap.get("errorMsg"));
					
					return rtnMap;
				}
				
				errorMsg.addAll((List) rtnCommitMap.get("errorMsg"));
				succCnt = Integer.parseInt(String.valueOf(rtnCommitMap.get("succCnt")));
				result = (boolean) rtnCommitMap.get("result");
			}
			
			if(errorMsg.size() == 0) {
				
				result = true;
			}
		}
		
		
		rtnMap.put("result", result);
		
		rtnMap.put("succCnt", succCnt);
		
		rtnMap.put("errorMsg", errorMsg);

		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private Map insertRep1100SelTktFileCommitBySVN(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap<>();
		
		
		List<String> errorMsg = new ArrayList<String>();
		
		List<Map> fileList = new ArrayList<Map>();
		
		List<Map> dirList = new ArrayList<Map>();
		
		
		RepResultVO repResultVo =(RepResultVO) paramMap.get("repResultVo");
		SVNRepository repository = repResultVo.getSvnRepo();
		
		
		String buildBranchNm = EgovProperties.getProperty("Globals.svn.buildBranchNm");
		String ticketId = (String) paramMap.get("ticketId");
		
		buildBranchNm += "_"+ticketId;
		
		String branchePath = "/branches/"+buildBranchNm;
		
		
		if(branchePath.lastIndexOf("/") == (branchePath.length()-1)) {
			
			branchePath = branchePath.substring(0, branchePath.length()-1);
		}
		
		
		List<String> makePathCheck = (List) paramMap.get("makePathCheck");
		
		List<String> checkDirList = (List) paramMap.get("checkDirList");
		
		
		String repChgFilePath = (String) paramMap.get("repChgFilePath");
		
		String repChgFileKind = (String) paramMap.get("repChgFileKind");
		
		String trunkPath = repChgFilePath.replace(branchePath, "/trunk");
		
		Long repRv = Long.parseLong(String.valueOf(paramMap.get("repRv")));
		
		
		String repChgTypeCd = (String) paramMap.get("repChgTypeCd");
		
		if("02".equals(repChgTypeCd)) {
			
			SVNNodeKind trunkNode =  repository.checkPath(trunkPath, -1);
			
			
			if(trunkNode.getID() == SVNNodeKind.NONE.getID()) {
				repChgTypeCd = "01";
				paramMap.put("repChgTypeCd", repChgTypeCd);
			}
		}
		
		else if("01".equals(repChgTypeCd)) {
			
			SVNNodeKind trunkNode =  repository.checkPath(trunkPath, -1);
			
			
			if((trunkNode.getID() != SVNNodeKind.NONE.getID()) && (trunkNode.getID() != SVNNodeKind.UNKNOWN.getID())) {
				repChgTypeCd = "02";
				paramMap.put("repChgTypeCd", repChgTypeCd);
			}
		}
		
		
		if("dir".equals(repChgFileKind)) {
			
			if("01".equals(repChgTypeCd)) {
				
				String checkDir = trunkPath;
				
				
				int parentCnt = (trunkPath.split("/").length)-1;
				
				
				List<String> makePathList = new ArrayList<String>();
				
				
				boolean dirErrorFlag = false;
				
				
				for(int j=parentCnt;j>0;j--) {
					
					if(makePathCheck.indexOf(checkDir) != -1) {
						
						
						System.out.println("dir 중복: "+checkDir);
						break;
					}
					
					SVNNodeKind node =  repository.checkPath(checkDir, -1);
					if(node.getID() == SVNNodeKind.NONE.getID()) {
						
						if(checkDirList.indexOf(checkDir) == -1) {
							
	            			errorMsg.add("- 해당 파일 커밋에 필요한 상위 디렉토리 정보가 함께 선택되지 않았습니다. [path="+checkDir+"]");
	            			dirErrorFlag = true;
	            			break;
						}
						
						
						makePathCheck.add(checkDir);
						
						makePathList.add(checkDir);
						System.out.println("dir 추가: "+checkDir);
					} else {
						
						
						break;
					}
					checkDir = checkDir.substring(0, checkDir.lastIndexOf("/"));
				}
				
				if(dirErrorFlag) {
					return rtnMap;
				}
			}
			else if("03".equals(repChgTypeCd)) {
				
				SVNNodeKind trunkNode =  repository.checkPath(trunkPath, -1);
				
				if(trunkNode == null || (trunkNode.getID() == SVNNodeKind.NONE.getID()) || (trunkNode.getID() == SVNNodeKind.UNKNOWN.getID())) {
					
					paramMap.put("delSkip", true);
				}
			}
			
			dirList.add(paramMap);
			
			rtnMap.put("dirList", dirList);
		}else if("file".equals(repChgFileKind)) {
			
			
			if("01".equals(repChgTypeCd)) {
				String checkParentPath = trunkPath.substring(0, trunkPath.lastIndexOf("/"));
				
				SVNNodeKind trunkNode =  repository.checkPath(checkParentPath, -1);
				
				if(trunkNode == null || (trunkNode.getID() == SVNNodeKind.NONE.getID()) || (trunkNode.getID() == SVNNodeKind.UNKNOWN.getID())) {
					
					if(checkDirList.indexOf(checkParentPath) == -1) {
						errorMsg.add("- 해당 파일 커밋에 필요한 상위 디렉토리 정보가 함께 선택되지 않았습니다. [path="+trunkPath+"]");
						rtnMap.put("errorMsg", errorMsg);
						return rtnMap;
					}
				}
				
				ByteArrayOutputStream baos = new ByteArrayOutputStream( );
	            repository.getFile(repChgFilePath, repRv, null, baos);
	    		baos.close();
	    		
	    		
	    		paramMap.put("brancheContent", baos.toByteArray());
			}
			
			else if("02".equals(repChgTypeCd)) {
				
				List<RepDataVO> trunkLogList = repModule.selectRepLogList(repResultVo, 1, -1, new String[]{trunkPath});
				
				if(trunkLogList != null && trunkLogList.size() > 0) {
					
					RepDataVO trunkLogInfo = trunkLogList.get(trunkLogList.size()-1);
					
					if(trunkLogInfo.getRevisionNum() > repRv) {
						errorMsg.add("- Trunk에 있는 파일 리비전("+trunkLogInfo.getRevision()+")이 현재 대상 파일("+repRv+")보다 최신입니다. [path="+trunkPath+"]");
						rtnMap.put("errorMsg", errorMsg);
						return rtnMap;
					}
				}
				
				
				ByteArrayOutputStream baos = new ByteArrayOutputStream( );
	            repository.getFile(repChgFilePath, repRv, null, baos);
	    		baos.close();
	    		
	    		
	    		paramMap.put("brancheContent", baos.toByteArray());
			}
			
			else if("03".equals(repChgTypeCd)) {
				
				SVNNodeKind trunkNode =  repository.checkPath(trunkPath, -1);
				
				if(trunkNode == null || (trunkNode.getID() == SVNNodeKind.NONE.getID()) || (trunkNode.getID() == SVNNodeKind.UNKNOWN.getID())) {
					errorMsg.add("- 삭제 대상 파일이 Trunk에 없습니다. [path="+trunkPath+"]");
					rtnMap.put("errorMsg", errorMsg);
					return rtnMap;
				}
			}
			
			fileList.add(paramMap);
			
			rtnMap.put("fileList", fileList);
		}
		else {
			
			return rtnMap;
		}
		
		rtnMap.put("errorMsg", errorMsg);
		rtnMap.put("fileList", fileList);
		rtnMap.put("dirList", dirList);
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private Map insertRep1100CommitBySVN(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap<>();
		
		List<String> errorMsg = new ArrayList<String>();
		
		
		int succCnt = 0;
		
		
		boolean result = false;
		
		
		RepResultVO repResultVo = (RepResultVO) paramMap.get("repResultVo");
		RepVO repVo = repResultVo.getRepVo();
		
		
		String ticketId = repResultVo.getTicketId();
		
		
		String commitAuthor = repResultVo.getEmpId();
		
		
		SVNRepository repository = repResultVo.getSvnRepo();
		
		
		List<Map> fileList = (List<Map>) paramMap.get("fileList");
		
		List<Map> dirList = (List<Map>) paramMap.get("dirList");
		
		
		boolean isLockFile = false;
		
		
		String repId = repVo.getRepId();
		
		String buildBranchNm = EgovProperties.getProperty("Globals.svn.buildBranchNm");
		
		buildBranchNm += "_"+ticketId;
		
		String branchePath = "/branches/"+buildBranchNm;
		
		
		if(branchePath.lastIndexOf("/") == (branchePath.length()-1)) {
			
			branchePath = branchePath.substring(0, branchePath.length()-1);
		}
				
		
		for(Map fileInfo: fileList) {
			try {
				
				String repChgFilePath = (String) fileInfo.get("repChgFilePath");
				
				String trunkPath = repChgFilePath.replace(branchePath, "/trunk");
				
				String filePath = String.valueOf(trunkPath);
				
				
				SVNLock svnLock = repository.getLock(filePath);
				
				if(svnLock != null) {
					errorMsg.add("- Lock상태의 파일입니다. [path="+filePath+"]");
					isLockFile = true;
				}
			}catch(Exception e) {
				Log.debug(e);
				break;
			}
		}
		
		
		if(isLockFile) {
			errorMsg.add("- 커밋 대상 파일 중 Lock 상태의 파일이 발견되어 커밋을 전체 중지했습니다.");
			
			
			rtnMap.put("result", result);
			
			rtnMap.put("succCnt", 0);
			
			rtnMap.put("errorMsg", errorMsg);
			
			
			rtnMap.put("isLockFile", isLockFile);
			return rtnMap;
		}
		
		
		List<Map> rep1101InsertList = new ArrayList<Map>();
		
		
		int commitCnt = dirList.size()+fileList.size();
		
		
		String commitComment = "[insert_data_no-flag]\n [커밋 정보] \n emp_id: "+commitAuthor+"\n ticket_id: "+ticketId+" \n 파일 개수: "+commitCnt;
		
		
		ISVNEditor editor = repository.getCommitEditor(commitComment, null);
		editor.openRoot(-1);
		List<String> makePathArr = (List) paramMap.get("makePathCheck");
		
		
		Collections.sort( makePathArr, new Comparator<String>() {
			@Override
			public int compare(String a, String b) {
				
				String pathA = a;
				String pathB = b;
				
				int valueA = pathA.split("/").length;
				int valueB = pathB.split("/").length;
					
				return Integer.compare(valueA, valueB);
			}
		});
		
		
		if(makePathArr.size() > 0) {
			for(int j=0;j<makePathArr.size();j++) {
				String makePath = makePathArr.get(j);
				
				
				
				int openDirCnt = 0;
				
				String[] parentPath = makePath.split("/");
				
				for(int l=1;l<(parentPath.length-1);l++) {
					String path = parentPath[l];
					editor.openDir(path, -1);
					openDirCnt++;
					
				}
				
				
				
				
				try {
					editor.addDir(makePath.substring(makePath.lastIndexOf("/")+1, makePath.length()), null, -1);
					
					
					editor.closeDir();
				}catch(SVNException svnE) {
					svnE.printStackTrace();
					int errorCode = svnE.getErrorMessage().getErrorCode().getCode();
					if(errorCode == 160013) {
						
						errorMsg.add("- 해당 파일 커밋에 필요한 상위 디렉토리 정보가 함께 선택되지 않았습니다. [path="+makePath+"]");
					}else {
						errorMsg.add("- 해당 파일 커밋 중 오류가 발생했습니다. [path="+makePath+", error="+svnE.getMessage()+"]");
					}
				}
				
				
				for(int l=0;l<openDirCnt;l++) {
					editor.closeDir();
				}
			}
		}
		
		
		
		
		for(Map dirInfo: dirList) {
			
			String repChgFilePath = (String) dirInfo.get("repChgFilePath");
			
			String repChgFileKind = (String) dirInfo.get("repChgFileKind");
			
			String repChgTypeCd = (String) dirInfo.get("repChgTypeCd");
			
			String repChgFileNm = (String) dirInfo.get("repChgFileNm");
			
			String trunkPath = repChgFilePath.replace(branchePath, "/trunk");
			
			Long repRv = Long.parseLong(String.valueOf(dirInfo.get("repRv")));
			
			String empId = (String) dirInfo.get("empId");
			
			if("03".equals(repChgTypeCd)) {
				
				if(!dirInfo.containsKey("delSkip")) {
					
					editor.deleteEntry(trunkPath, -1);
				}
			}
			
			
			Map dataMap = new HashMap<>();
			dataMap.put("repId", repId);
			dataMap.put("ticketId", ticketId);
			dataMap.put("repChgTypeCd", repChgTypeCd);
			dataMap.put("repChgFilePath", trunkPath);
			dataMap.put("repChgFileKind", repChgFileKind);
			dataMap.put("repTargetFilePath", repChgFilePath);
			dataMap.put("repChgFileNm", repChgFileNm);
			dataMap.put("repTargetRv", repRv);
			dataMap.put("empId", empId);
			
			
			rep1101InsertList.add(dataMap);
			
			
			succCnt++;
		}
		
		for(Map fileInfo: fileList) {
			
			String repChgFilePath = (String) fileInfo.get("repChgFilePath");
			
			String repChgFileKind = (String) fileInfo.get("repChgFileKind");
			
			String repChgTypeCd = (String) fileInfo.get("repChgTypeCd");
			
			String repChgFileNm = (String) fileInfo.get("repChgFileNm");
			
			String trunkPath = repChgFilePath.replace(branchePath, "/trunk");
			
			
			Long repRv = Long.parseLong(String.valueOf(fileInfo.get("repRv")));
			
			
			Map dataMap = new HashMap<>();
			dataMap.put("repId", repId);
			dataMap.put("repTargetRv", repRv);
			dataMap.put("ticketId", ticketId);
			dataMap.put("repChgTypeCd", repChgTypeCd);
			dataMap.put("repChgFilePath", trunkPath);
			dataMap.put("repChgFileKind", repChgFileKind);
			dataMap.put("repTargetFilePath", repChgFilePath);
			dataMap.put("repChgFileNm", repChgFileNm);
			
			
			rep1101InsertList.add(dataMap);
			
			 
			
			if("01".equals(repChgTypeCd)) {
				
				
				byte[] brancheContent = (byte[]) fileInfo.get("brancheContent");
				
				String checksum = null;
				try {
					
					
					
					
					int openDirCnt = 0;
					String parentPathStr = trunkPath.substring(0, trunkPath.lastIndexOf("/"));
					String fileNm = trunkPath.substring((trunkPath.lastIndexOf("/")+1), trunkPath.length());
					
					String[] parentPath = parentPathStr.split("/");
					
					for(int l=0;l<parentPath.length;l++) {
						String path = parentPath[l];
						
						if(path == null || "".equals(path)) {
							continue;
						}
						editor.openDir(path, -1);
						openDirCnt++;
						
					}
					
					
					editor.addFile(fileNm, null, -1);
					
					editor.applyTextDelta( trunkPath , null );
					SVNDeltaGenerator deltaGenerator = new SVNDeltaGenerator( );
					checksum = deltaGenerator.sendDelta( trunkPath , new ByteArrayInputStream(brancheContent) , editor , true );
					
					
					editor.closeFile(fileNm, checksum);
					
					
					for(int l=0;l<openDirCnt;l++) {
						editor.closeDir();
					}
				}catch(SVNException svnE) {
					svnE.printStackTrace();
					int errorCode = svnE.getErrorMessage().getErrorCode().getCode();
					if(errorCode == 160013) {
						
						errorMsg.add("- 해당 파일 커밋에 필요한 상위 디렉토리 정보가 함께 선택되지 않았습니다. [path="+trunkPath+"]");
					}else {
						errorMsg.add("- 해당 파일 커밋 중 오류가 발생했습니다. [path="+trunkPath+", error="+svnE.getMessage()+"]");
					}
					continue;
				}
				
				
				
			}
			
			else if("02".equals(repChgTypeCd)) {
				
				byte[] brancheContent = (byte[]) fileInfo.get("brancheContent");
				
				
				
				
				
				int openDirCnt = 0;
				String parentPathStr = trunkPath.substring(0, trunkPath.lastIndexOf("/"));
				String fileNm = trunkPath.substring((trunkPath.lastIndexOf("/")+1), trunkPath.length());
				
				String[] parentPath = parentPathStr.split("/");
				
				for(int l=0;l<parentPath.length;l++) {
					String path = parentPath[l];
					
					if(path == null || "".equals(path)) {
						continue;
					}
					editor.openDir(path, -1);
					openDirCnt++;
					
				}
				
				
				editor.openFile(fileNm, -1);
				
				
				editor.applyTextDelta(trunkPath , null );
				SVNDeltaGenerator deltaGenerator = new SVNDeltaGenerator( );
				String checksum = deltaGenerator.sendDelta( trunkPath , new ByteArrayInputStream(brancheContent) , editor , true );
				
				
				editor.closeFile(fileNm, checksum);
				
			  
				for(int l=0;l<openDirCnt;l++) {
					editor.closeDir();
				}
				
				
				
			}
			else if("03".equals(repChgTypeCd)) {
				
				editor.deleteEntry(trunkPath, -1);
			}
			else {
				
				editor.closeDir();
				continue;
			}
			
			succCnt++;
			
		}
		editor.closeDir();
		

		if(succCnt > 0) {
			
			SVNCommitInfo commitInfo = editor.closeEdit();
			
			Long commitRv = commitInfo.getNewRevision();
			
			
			Map dataMap = new HashMap<>();
			dataMap.put("repId", repId);
			dataMap.put("repRv", commitRv);
			dataMap.put("repComment", commitComment);
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
			
			dataMap.put("repCmtDate", sdf.format(new Date()));
			
			
			if(commitAuthor == null || "".equals(commitAuthor)) {
				commitAuthor = "SYSTSEM";
			}
			dataMap.put("repCmtAuthor", commitAuthor);
			dataMap.put("repChgFileCnt", fileList.size());
			dataMap.put("ticketId", ticketId);
			
			dataMap.put("repRvTypeCd", "02");
			
			rep1100DAO.insertRep1100RvInfo(dataMap);
			
			
			for(Map rep1101InsertInfo : rep1101InsertList) {
				rep1101InsertInfo.put("repRv", commitRv);
				rep1101InsertInfo.put("repRvn", commitRv);
				rep1100DAO.insertRep1101RvChgInfo(rep1101InsertInfo);
			}
		}else {
			
			editor.abortEdit();
		}
		
		
		rtnMap.put("errorMsg", errorMsg);
		rtnMap.put("succCnt", succCnt);
		rtnMap.put("result", result);
		rtnMap.put("isLockFile", isLockFile);
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private Map insertRep1100SelTktFileCommitByGitHub(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap<>();
		
		
		List<String> errorMsg = new ArrayList<String>();
		
		List<Map> fileList = new ArrayList<Map>();
		
		List<Map> dirList = new ArrayList<Map>();
		
		RepResultVO repResultVo =(RepResultVO) paramMap.get("repResultVo");
		GHRepository repository = repResultVo.getGitRepo();
		GHContent content = null;
		
		String masterBranchNm = repository.getDefaultBranch();
		
		String opsBranchNm = EgovProperties.getProperty("Globals.github.operation.branch");
		
		String baseTargetBranchNm = masterBranchNm;
		
		
		List<String> makePathCheck = (List) paramMap.get("makePathCheck");
		
		List<String> checkDirList = (List) paramMap.get("checkDirList");
		
		
		String repChgFilePath = (String) paramMap.get("repChgFilePath");
		
		String repChgFileKind = (String) paramMap.get("repChgFileKind");
		
		String branchNm = (String) paramMap.get("gitBrcNm");
		
		String trunkPath = repChgFilePath.replace(branchNm, "/trunk");
		
		
		String repChgTypeCd = (String) paramMap.get("repChgTypeCd");
		
		try {
			content = repository.getFileContent(trunkPath, baseTargetBranchNm);
		}catch (GHFileNotFoundException notFileE) {
			content = null;
		}
		
		
		if("02".equals(repChgTypeCd) && content == null) {
			
			repChgTypeCd = "01";
			paramMap.put("repChgTypeCd", repChgTypeCd);
		}
		
		else if("01".equals(repChgTypeCd) && content != null) {
			
			repChgTypeCd = "02";
			paramMap.put("repChgTypeCd", repChgTypeCd);
		}
		
		else if("03".equals(repChgTypeCd) && content == null) {
			
			paramMap.put("delSkip", true);
			
			
			
		}
		
		
		
		if("dir".equals(repChgFileKind)) {
			
			if("01".equals(repChgTypeCd)) {
				
				String checkDir = trunkPath;
				
				
				int parentCnt = (trunkPath.split("/").length)-1;
				
				
				List<String> makePathList = new ArrayList<String>();
				
				
				boolean dirErrorFlag = false;
				
				
				for(int j=parentCnt;j>0;j--) {
					
					if(makePathCheck.indexOf(checkDir) != -1) {
						System.out.println("dir 중복: "+checkDir);
						break;
					}
					
					
					GHContent chkDirContent =  repository.getFileContent(checkDir, baseTargetBranchNm);
					
					
					if(chkDirContent == null) {
						
						if(checkDirList.indexOf(checkDir) == -1) {
							errorMsg.add("- 해당 파일 커밋에 필요한 상위 디렉토리 정보가 함께 선택되지 않았습니다. [path="+checkDir+"]");
							dirErrorFlag = true;
							break;
						}
						
						
						makePathCheck.add(checkDir);
						
						makePathList.add(checkDir);
						System.out.println("dir 추가: "+checkDir);
					}
					
					else {
						
						break;
					}
					checkDir = checkDir.substring(0, checkDir.lastIndexOf("/"));
				}
				
				
				if(dirErrorFlag) {
					return rtnMap;
				}
			}
			
			else if("03".equals(repChgTypeCd)) {
				
				GHContent chkDirContent =  repository.getFileContent(trunkPath, baseTargetBranchNm);
				
				
				if(chkDirContent == null) {
					
					paramMap.put("delSkip", true);
				}
			}
			
			dirList.add(paramMap);
			
			rtnMap.put("dirList", dirList);
		}
		
		
		else if("file".equals(repChgFileKind)) {
			
			
			String gitCmtSha = (String) paramMap.get("gitCmtSha");
			
			List<GHCommit.File> listCmtFiles = repository.getCommit(gitCmtSha).getFiles();
			
			paramMap.put("brancheContentCmtMsg", repository.getCommit(gitCmtSha).getCommitShortInfo().getMessage());
			try {
				
				
				content = repository.getFileContent(repChgFilePath, branchNm);
			}catch (GHFileNotFoundException notFileE) {
				
				try {
					
					content = repository.getFileContent(repChgFilePath, baseTargetBranchNm);
				}catch (GHFileNotFoundException notFileE2) {
					content = null;
				}
				
				if("03".equals(repChgTypeCd) && content == null) {
					
					
					paramMap.put("delSkip", true);
					
					
					
				}
			}
			
			
			
			if("01".equals(repChgTypeCd)) {
				
				
				if(listCmtFiles != null && listCmtFiles.size() > 0) {
					for(int chkFileIdx=0; chkFileIdx<listCmtFiles.size(); chkFileIdx++) {
						GHCommit.File fileInfo = listCmtFiles.get(chkFileIdx);
						
						
						if(fileInfo.getFileName().equals(trunkPath)) {
							
							byte buffer[] = new byte[32];
							
							
							InputStream is = null;
							ByteArrayOutputStream baos = null;
							
							try {
								is = repository.getBlob(fileInfo.getSha()).read();
								
								
								baos = new ByteArrayOutputStream();
								
								
								int readBuffer = 0;
								while((readBuffer = is.read(buffer)) != -1) {
									
									baos.write(buffer, 0, readBuffer);
								}
							}catch(IOException ioE) {
								
							}finally {
								
								if(baos != null) {
									baos.close();
								}
								if(is != null) {
									is.close();
								}
								
								
								paramMap.put("brancheContent", baos.toByteArray());
							}
							
							break;
						}
					}
				}
			}
			
			else if("02".equals(repChgTypeCd)) {
				
				
				
				
				if(listCmtFiles != null && listCmtFiles.size() > 0) {
					for(int chkFileIdx=0; chkFileIdx<listCmtFiles.size(); chkFileIdx++) {
						GHCommit.File fileInfo = listCmtFiles.get(chkFileIdx);
						
						
						if(fileInfo.getFileName().equals(trunkPath)) {
							
							byte buffer[] = new byte[32];
							
							
							InputStream is = null;
							ByteArrayOutputStream baos = null;
							
							try {
								is = repository.getBlob(fileInfo.getSha()).read();
								
								
								baos = new ByteArrayOutputStream();
								
								
								int readBuffer = 0;
								while((readBuffer = is.read(buffer)) != -1) {
									
									baos.write(buffer, 0, readBuffer);
								}
							}catch(IOException ioE) {
								
							}finally {
								
								if(baos != null) {
									baos.close();
								}
								if(is != null) {
									is.close();
								}
								
								
								paramMap.put("brancheContent", baos.toByteArray());
							}
							
							break;
						}
					}
				}
			}
			
			else if("03".equals(repChgTypeCd)) {
				paramMap.put("brancheContent", null);
				
			}
			
			
			fileList.add(paramMap);
		}
		
		else {
			
			return rtnMap;
		}
		
		rtnMap.put("errorMsg", errorMsg);
		rtnMap.put("fileList", fileList);
		rtnMap.put("dirList", dirList);
		
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private Map insertRep1100CommitByGitHub(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap<>();
		
		List<String> errorMsg = new ArrayList<String>();
		
		
		int succCnt = 0;
		
		
		boolean result = false;
		
		
		RepResultVO repResultVo = (RepResultVO) paramMap.get("repResultVo");
		RepVO repVo = repResultVo.getRepVo();
		
		
		String ticketId = repResultVo.getTicketId();
		
		
		String commitAuthor = repResultVo.getEmpId();
		
		
		GHRepository repository = repResultVo.getGitRepo();
		
		
		List<Map> fileList = (List<Map>) paramMap.get("fileList");
		
		List<Map> dirList = (List<Map>) paramMap.get("dirList");
		
		
		boolean isLockFile = false;
		
		
		String repId = repVo.getRepId();
		
		String masterBranchNm = repository.getDefaultBranch();
		
		String opsBranchNm = EgovProperties.getProperty("Globals.github.operation.branch");
		
		String baseTargetBranchNm = masterBranchNm;
				
		
		if(fileList == null || fileList.size() == 0) {
			
			errorMsg.add("최종 반영할 파일이 없습니다. 커밋을 종료합니다.");
			rtnMap.put("errorMsg", errorMsg);
			rtnMap.put("succCnt", succCnt);
			rtnMap.put("result", true);
			rtnMap.put("isLockFile", isLockFile);
			
			return rtnMap;
		}
		
		
		
		
		
		List<Map> rep1101InsertList = new ArrayList<Map>();
		
		
		int commitCnt = dirList.size()+fileList.size();
		
		
		String commitComment = "[insert_data_no-flag]\n [커밋 정보] \n emp_id: "+commitAuthor+"\n ticket_id: "+ticketId+" \n 파일 개수: "+commitCnt;
		
		
		
		String targetBranchHeadSha = repository.getRef("heads/"+baseTargetBranchNm).getObject().getSha();
		
		
		String buildBranchNm = EgovProperties.getProperty("Globals.svn.buildBranchNm");
		
		String branchePath = "branches/"+buildBranchNm+"_"+ticketId;
		
		String newCommitBranch = branchePath+"_trunkCommit";
		
		try {
			
			repository.createRef("refs/heads/"+newCommitBranch, targetBranchHeadSha);
		}catch (Exception e) {
			
			
			
			GHRef mstRef = repository.getRef("heads/"+masterBranchNm);
			repository.getRef("heads/"+newCommitBranch).updateTo(mstRef.getObject().getSha(),true);
		}
		
		
		
		for(Map fileInfo: fileList) {
			
			String branchNm = (String) fileInfo.get("gitBrcNm");
			
			String gitCmtSha = (String) fileInfo.get("gitCmtSha");
			
			String repChgFilePath = (String) fileInfo.get("repChgFilePath");
			
			String repChgFileKind = (String) fileInfo.get("repChgFileKind");
			
			String repChgTypeCd = (String) fileInfo.get("repChgTypeCd");
			
			String repChgFileNm = (String) fileInfo.get("repChgFileNm");
			
			String trunkPath = repChgFilePath.replace(branchNm, "/trunk");
			
			
			Long repRv = 0l;
			
			if(fileInfo.get("repRv")!=null){
				
				try {
					repRv = Long.parseLong((String) fileInfo.get("repRv"));
				}catch(NumberFormatException ne) {
					
				}
			}
			
			Map dataMap = new HashMap<>();
			dataMap.put("repId", repId);
			dataMap.put("repTargetRv", gitCmtSha);
			dataMap.put("ticketId", ticketId);
			dataMap.put("repChgTypeCd", repChgTypeCd);
			dataMap.put("repChgFilePath", trunkPath);
			dataMap.put("repChgFileKind", repChgFileKind);
			dataMap.put("repTargetFilePath", repChgFilePath);
			dataMap.put("repChgFileNm", repChgFileNm);
			
			
			rep1101InsertList.add(dataMap);
			
			GHContent newBrcFileContent = null;
			String fileCmtMessage = (String) fileInfo.get("brancheContentCmtMsg");
			String fileContent = null;
			try {
				
				newBrcFileContent = repository.getFileContent(trunkPath, newCommitBranch);
				if ("02".equals(repChgTypeCd)) {
					
					byte[] brancheContent = (byte[]) fileInfo.get("brancheContent");
					if(brancheContent == null) {
						fileContent = new String("");
					}else {
						fileContent = new String(brancheContent);
					}
					newBrcFileContent.update(fileContent, fileCmtMessage, newCommitBranch);
				}else if ("03".equals(repChgTypeCd)) {
					
					newBrcFileContent.delete(commitComment, newCommitBranch);
				}else {
					continue;
				}
			}catch (GHFileNotFoundException notFileE) {
				
				if ("01".equals(repChgTypeCd)) {
					
					byte[] brancheContent = (byte[]) fileInfo.get("brancheContent");
					if(brancheContent == null) {
						fileContent = new String("");
					}else {
						fileContent = new String(brancheContent);
					}
					
					
					
					repository.createContent()
						.branch(newCommitBranch)
						.path(trunkPath)
						.message(fileCmtMessage)
						.content(fileContent)
						.commit();
					
				}else if ("02".equals(repChgTypeCd)) {
					
					byte[] brancheContent = (byte[]) fileInfo.get("brancheContent");
					if(brancheContent == null) {
						fileContent = new String("");
					}else {
						fileContent = new String(brancheContent);
					}
					
					
					repository.createContent()
					.branch(newCommitBranch)
					.path(trunkPath)
					.message(fileCmtMessage)
					.content(fileContent)
					.commit();
					
				} else if ("03".equals(repChgTypeCd)) {
					
					if(newBrcFileContent == null) {
						
						succCnt++;
						
						continue;
					}
				}else {
					continue;
				}
			}
			
			succCnt++;
			
		}
		
		if(succCnt > 0) {
			
			setRep1101List(newCommitBranch, rep1101InsertList);
			
			
			
			try {
				String newBranchHeadSha = repository.getRef("heads/" + newCommitBranch).getObject().getSha();
				if(!targetBranchHeadSha.equals(newBranchHeadSha)) {
						System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PULL REQUEST START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
						System.out.println("param map : "+paramMap.entrySet());
						
						repository.createPullRequest(commitComment, newCommitBranch, baseTargetBranchNm,  commitComment).merge(commitComment, newBranchHeadSha, MergeMethod.MERGE);
						System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PULL REQUEST END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
				}
			}catch (Exception e) {
				e.printStackTrace();
				
				
				
				removeRep1102List(newCommitBranch);
				
				errorMsg.add("Pull Request에 실패하였습니다. "+masterBranchNm+"에 커밋할 수 없습니다.");
				rtnMap.put("errorMsg", errorMsg);
				rtnMap.put("succCnt", 0);
				rtnMap.put("result", false);
				rtnMap.put("isLockFile", isLockFile);
				
				return rtnMap;
			}
		}else {
			
			
		}
		
		rtnMap.put("errorMsg", errorMsg);
		rtnMap.put("succCnt", succCnt);
		rtnMap.put("result", result);
		rtnMap.put("isLockFile", isLockFile);
		
		return rtnMap;
		
	}

	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRep1102TargetDataDeployCommitAjax(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap<>();
		
		
		int succCnt = 0;
		
		
		boolean result = false;
		
		
		List<String> errorMsg = new ArrayList<String>();
		
		
		String returnMap = (String) paramMap.get("returnMap");
		
		
		JSONArray jsonArr = new JSONArray(returnMap);
		
		
		Map<String, RepResultVO> repInfoMap = new HashMap<String, RepResultVO>();
		
		
		Map<String, List<JSONObject>> repFilePathMap = new HashMap<String, List<JSONObject>>();
		
		
		Map<String, List<String>> repMakePathMap = new HashMap<String, List<String>>();
		
		if(jsonArr != null && jsonArr.length() > 0) {
			
			for(int i=0;i<jsonArr.length();i++) {
				JSONObject jsonInfo = jsonArr.getJSONObject(i);
				
				
				String repId = (String) jsonInfo.get("repId");
				String ciId = (String) jsonInfo.get("ciId");
				String jobId = (String) jsonInfo.get("jobId");
				String bldNum = String.valueOf(jsonInfo.get("bldNum"));
				String empId = (String) jsonInfo.get("empId");
				String ticketId = (String) jsonInfo.get("ticketId");
				String filePath = (String) jsonInfo.get("filePath");
				String fileRealPath = (String) jsonInfo.get("fileRealPath");
				String fileTypeNm = (String) jsonInfo.get("fileTypeNm");
				
				
				if(filePath.indexOf("/") != 0) {
					filePath = "/"+filePath;
					jsonInfo.put("filePath", filePath);
				}
				if(fileRealPath.indexOf("/") != 0) {
					fileRealPath = "/"+fileRealPath;
					jsonInfo.put("fileRealPath", fileRealPath);
				}
				
				
				Map newParamMap = new HashMap<>();
				newParamMap.put("ciId", ciId);
				newParamMap.put("ticketId", ticketId);
				newParamMap.put("repId", repId);
				newParamMap.put("jobId", jobId);
				newParamMap.put("repChgFilePath", filePath);
				
				
				Map recentBldInfo = rep1100DAO.selectRep1102TktFileRecentBldNumList(newParamMap);
				
				
				if(recentBldInfo != null) {
					String recentBldNum = String.valueOf(recentBldInfo.get("maxBldNum"));
					
					
					int castBldNum = Integer.parseInt(bldNum);
					
					int castRecentBldNum = Integer.parseInt(recentBldNum);
					if(castBldNum < castRecentBldNum) {
						errorMsg.add("- 배포 저장소에 커밋된 빌드 번호보다 현재 대상 빌드 번호가 낮습니다. [최근 커밋된 빌드 번호="+castRecentBldNum+", 파일 경로="+filePath+"]");
						continue;
					}
				}
				
				
				
				
				RepResultVO repResultVo = null;
				RepVO repVo= null;
				
				
				if(!repInfoMap.containsKey(repId)) {
					
					Map newMap = new HashMap<>();
					newMap.put("repId", repId);
					
					
					repVo = rep1000Service.selectRep1000Info(newMap);
					
					
					repResultVo = repModule.repAuthCheck(repVo);
					repResultVo.setEmpId(empId);
					repResultVo.setTicketId(ticketId);
					
					repInfoMap.put(repId, repResultVo);
					
					
					repFilePathMap.put(repId, new ArrayList<JSONObject>());
					
					
					repMakePathMap.put(repId, new ArrayList<String>());
				}
				
				repResultVo = repInfoMap.get(repId);
				
				
				if(!repResultVo.isReturnValue()) {
					errorMsg.add("- Deploy 소스저장소 연결 실패 [repNm="+repResultVo.getRepVo().getRepNm()+"]");
					continue;
				}
				
				repVo = repResultVo.getRepVo();
				
				String repTypeCd = repVo.getRepTypeCd();
				
				Map<String, Object> subParamMap = new HashMap<>();
				subParamMap.put("repResultVO", repResultVo);
				subParamMap.put("repFilePathMap", repFilePathMap);
				subParamMap.put("repMakePathMap", repMakePathMap);
				subParamMap.put("chgFileInfo", jsonInfo);
				
				
				List<JSONObject> fileList = (List<JSONObject>) repFilePathMap.get(repId);
				
				Map rtnParamMap = null;
				
				if("01".equals(repTypeCd)) {
					rtnParamMap = insertRep1102TargetDataDeployCommitFileByGitHub(subParamMap);
				}
				
				else if("02".equals(repTypeCd)) {
					rtnParamMap = insertRep1102TargetDataDeployCommitFileBySVN(subParamMap);
				}
				
				else if("03".equals(repTypeCd)) {
					
				}
				
				
				fileList.addAll((List<JSONObject>) rtnParamMap.get("fileList"));
				
				repFilePathMap.put(repId, fileList);
				
				repMakePathMap.put(repId, (List<String>) rtnParamMap.get("makePathList"));
			}
			
			
			Iterator itr = repInfoMap.keySet().iterator();
			while(itr.hasNext()) {
				
				String repId = (String) itr.next();
				
				
				RepResultVO repResultVo = repInfoMap.get(repId);
				
				String repTypeCd = repResultVo.getRepVo().getRepTypeCd();
				
				Map rtnCommitMap = null;
				Map<String, Object> newParamMap = new HashMap<>();
				newParamMap.put("repId", repId);
				newParamMap.put("repResultVO", repResultVo);
				newParamMap.put("repFilePathMap", repFilePathMap);
				newParamMap.put("repMakePathMap", repMakePathMap);
				
				
				if("01".equals(repTypeCd)) {
					rtnCommitMap = insertRep1102TargetDataDeployCommitByGitHub(newParamMap);
				}
				
				else if("02".equals(repTypeCd)) {
					rtnCommitMap = insertRep1102TargetDataDeployCommitBySVN(newParamMap);
				}
				else if("03".equals(repTypeCd)) {
					
				}
				
				if((boolean) rtnCommitMap.get("isLockFile")) {
					
					rtnMap.put("result", (boolean) rtnCommitMap.get("result"));
					
					rtnMap.put("succCnt", 0);
					
					rtnMap.put("errorMsg", rtnCommitMap.get("errorMsg"));
					
					return rtnMap;
				}
				
				errorMsg.addAll((List) rtnCommitMap.get("errorMsg"));
				succCnt = Integer.parseInt(String.valueOf(rtnCommitMap.get("succCnt")));
				result = (boolean) rtnCommitMap.get("result");
			}
			
			
			if(errorMsg.size() == 0) {
				
				result = true;
			}
		}
		
		rtnMap.put("result", result);
		
		rtnMap.put("succCnt", succCnt);
		
		rtnMap.put("errorMsg", errorMsg);
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private Map insertRep1102TargetDataDeployCommitFileBySVN(Map paramMap) throws Exception {
		
		Map rtnMap = new HashMap<>();
		
		
		List<String> errorMsg = new ArrayList<String>();
		RepResultVO repResultVo = (RepResultVO) paramMap.get("repResultVO");
		
		Map<String, List<JSONObject>> repFilePathMap = (Map<String, List<JSONObject>>) paramMap.get("repFilePathMap");
		
		Map<String, List<String>> repMakePathMap= (Map<String, List<String>>) paramMap.get("repMakePathMap");
		
		JSONObject jsonInfo = (JSONObject) paramMap.get("chgFileInfo");
		
		String repId = (String) jsonInfo.get("repId");
		String fileTypeNm = (String) jsonInfo.get("fileTypeNm");
		String filePath = (String) jsonInfo.get("filePath");
		String fileRealPath = (String) jsonInfo.get("fileRealPath");
		
		
		List<JSONObject> fileList = (List<JSONObject>) repFilePathMap.get(repId);
		
		List<String> makePathList = repMakePathMap.get(repId);
		
		
		SVNRepository repository = repResultVo.getDplRepo();
		
		
		if("M".equals(fileTypeNm)) {
			
			SVNNodeKind trunkNode =  repository.checkPath(filePath, -1);
			System.out.println("####### LOG ######### : 경로 체크 ["+filePath+"] : "+trunkNode);
			
			if(trunkNode.getID() == SVNNodeKind.NONE.getID()) {
				fileTypeNm = "A";
				jsonInfo.put("fileTypeNm", fileTypeNm);
			}
		}
		
		else if("A".equals(fileTypeNm)) {
			
			SVNNodeKind trunkNode =  repository.checkPath(filePath, -1);
			System.out.println("####### LOG ######### : 경로 체크 ["+filePath+"] : "+trunkNode);
			
			if((trunkNode.getID() != SVNNodeKind.NONE.getID()) && (trunkNode.getID() != SVNNodeKind.UNKNOWN.getID())) {
				fileTypeNm = "M";
				jsonInfo.put("fileTypeNm", fileTypeNm);
			}
		}
		
		
		if("A".equals(fileTypeNm) || "M".equals(fileTypeNm)) {
			String checkParentPath = filePath.substring(0, filePath.lastIndexOf("/"));
			
			
			SVNNodeKind trunkNode =  repository.checkPath(checkParentPath, -1);
			System.out.println("####### LOG ######### : 경로 체크 ["+filePath+"] : "+trunkNode);
			
			
			if(trunkNode == null ||trunkNode.getID() == SVNNodeKind.NONE.getID()) {
				String[] dirPaths = checkParentPath.split("/");
				
				String checkDir = "";
				
				
				for(String dirPath : dirPaths) {
					
					if(dirPath == null || "".equals(dirPath)) {
						continue;
					}
					checkDir = checkDir+"/"+dirPath;
					
					SVNNodeKind checkNode =  repository.checkPath(checkDir, -1);
					System.out.println("####### LOG ######### : DIR 경로 체크 ["+checkDir+"] : "+checkNode);
					
					
					if(checkNode.getID() == SVNNodeKind.NONE.getID()) {
						
						if(makePathList.indexOf(checkDir) != -1) {
							continue;
						}else {
							
							makePathList.add(checkDir);
						}
					}
				}
			}
		}
		
		
		if("A".equals(fileTypeNm)) {
			
			File sourceTrunkFile = new File(fileRealPath);
			
			
			if(!sourceTrunkFile.exists() || !sourceTrunkFile.isFile()) {
				errorMsg.add("- 물리적 경로에 파일이 없습니다. [path="+fileRealPath+"]");
				
				rtnMap.put("fileList", fileList);
				rtnMap.put("makePathList", makePathList);
				rtnMap.put("errorMsg", errorMsg);
				return rtnMap;
			}
			Path path = sourceTrunkFile.toPath();
			byte[] sourceTrunkFileData = Files.readAllBytes(path);
			
			
			jsonInfo.put("sourceTrunkFileData", sourceTrunkFileData);
		}
		else if("M".equals(fileTypeNm)) {
			
			File sourceTrunkFile = new File(fileRealPath);
			
			
			if(!sourceTrunkFile.exists() || !sourceTrunkFile.isFile()) {
				errorMsg.add("- 물리적 경로에 파일이 없습니다. [path="+fileRealPath+"]");
				
				rtnMap.put("fileList", fileList);
				rtnMap.put("makePathList", makePathList);
				rtnMap.put("errorMsg", errorMsg);
				return rtnMap;
			}
			Path path = sourceTrunkFile.toPath();
			byte[] sourceTrunkFileData = Files.readAllBytes(path);
			
			
			jsonInfo.put("sourceTrunkFileData", sourceTrunkFileData);
		}
		else if("D".equals(fileTypeNm)) {
			
			SVNNodeKind dplTrunkNode =  repository.checkPath(filePath, -1);
			
			if(dplTrunkNode == null || (dplTrunkNode.getID() == SVNNodeKind.NONE.getID()) || (dplTrunkNode.getID() == SVNNodeKind.UNKNOWN.getID())) {
				errorMsg.add("- 삭제 대상 파일이 Deploy Trunk에 없습니다. [path="+filePath+"]");
				
				rtnMap.put("fileList", fileList);
				rtnMap.put("makePathList", makePathList);
				rtnMap.put("errorMsg", errorMsg);
				return rtnMap;
			}
		}
		
		
		fileList.add(jsonInfo);
		
		rtnMap.put("fileList", fileList);
		rtnMap.put("makePathList", makePathList);
		rtnMap.put("errorMsg", errorMsg);
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private Map insertRep1102TargetDataDeployCommitFileByGitHub(Map paramMap) throws Exception {
		
		Map rtnMap = new HashMap<>();
		
		
		List<String> errorMsg = new ArrayList<String>();
		RepResultVO repResultVo = (RepResultVO) paramMap.get("repResultVO");
		
		
		
		Map<String, List<String>> repMakePathMap= (Map<String, List<String>>) paramMap.get("repMakePathMap");
		
		JSONObject jsonInfo = (JSONObject) paramMap.get("chgFileInfo");
		String repId = (String) jsonInfo.get("repId");
		String fileTypeNm = (String) jsonInfo.get("fileTypeNm");
		
		String filePath = (String) jsonInfo.get("filePath");
		
		if(filePath.indexOf("classTrunk/") == -1) {
			filePath = "classTrunk/"+filePath;
		}
		filePath = filePath.replaceAll("
		
		if(filePath.lastIndexOf("/") == filePath.length()-1) {
			filePath = filePath.substring(0, filePath.length()-1);
		}
		
		String fileRealPath = (String) jsonInfo.get("fileRealPath");
		fileRealPath = fileRealPath.replaceAll("
		
		if(fileRealPath.lastIndexOf("/") == fileRealPath.length()-1) {
			fileRealPath = fileRealPath.substring(0, fileRealPath.length()-1);
		}
		
		jsonInfo.put("filePath", filePath);
		jsonInfo.put("fileRealPath", fileRealPath);
		
		
		
		List<JSONObject> fileList = new ArrayList<>();;
		
		List<String> makePathList = repMakePathMap.get(repId);
		
		
		GHRepository repository = repResultVo.getGitRepo();
		
		String opsBranchNm = EgovProperties.getProperty("Globals.github.operation.branch");
		GHRef opsRef = null;
		try {
			
			opsRef = repository.getRef("heads/"+opsBranchNm);
		}catch (Exception e) {
			GHRef defaultBranch = repository.getRef("heads/"+repository.getDefaultBranch());
			
			opsRef = repository.createRef("refs/heads/"+opsBranchNm, defaultBranch.getObject().getSha());
		}
		
		
		System.out.println(">>>>>>>>>>>>>>>filePath:"+filePath);
		
		GHContent file = null;
		try{
			file = repository.getFileContent(filePath, opsRef.getRef());
		}
		catch (Exception e) {
			
			
		}
		
		
		if("M".equals(fileTypeNm)) {
			System.out.println("####### LOG ######### : 경로 체크 ["+filePath+"] : "+file);
			
			if(file == null) {
				fileTypeNm = "A";
				jsonInfo.put("fileTypeNm", fileTypeNm);
			}
		}
		
		else if("A".equals(fileTypeNm)) {
			System.out.println("####### LOG ######### : 경로 체크 ["+filePath+"] : "+file);
			
			if(file != null) {
				fileTypeNm = "M";
				jsonInfo.put("fileTypeNm", fileTypeNm);
			}
		}
		
		
		if("A".equals(fileTypeNm)) {
			
			File sourceTrunkFile = new File(fileRealPath);
			
			
			if(!sourceTrunkFile.exists() || !sourceTrunkFile.isFile()) {
				errorMsg.add("- 물리적 경로에 파일이 없습니다. [path="+fileRealPath+"]");
				
				rtnMap.put("fileList", fileList);
				rtnMap.put("makePathList", makePathList);
				rtnMap.put("errorMsg", errorMsg);
				return rtnMap;
			}
			Path path = sourceTrunkFile.toPath();
			byte[] sourceTrunkFileData = Files.readAllBytes(path);
			
			
			jsonInfo.put("sourceTrunkFileData", sourceTrunkFileData);
		}
		else if("M".equals(fileTypeNm)) {
			
			File sourceTrunkFile = new File(fileRealPath);
			
			
			if(!sourceTrunkFile.exists() || !sourceTrunkFile.isFile()) {
				errorMsg.add("- 물리적 경로에 파일이 없습니다. [path="+fileRealPath+"]");
				
				rtnMap.put("fileList", fileList);
				rtnMap.put("makePathList", makePathList);
				rtnMap.put("errorMsg", errorMsg);
				return rtnMap;
			}
			Path path = sourceTrunkFile.toPath();
			byte[] sourceTrunkFileData = Files.readAllBytes(path);
			
			
			jsonInfo.put("sourceTrunkFileData", sourceTrunkFileData);
		}
		else if("D".equals(fileTypeNm)) {
			
			if(file == null) {
				errorMsg.add("- 삭제 대상 파일이 Deploy Trunk에 없습니다. [path="+filePath+"]");
				
				rtnMap.put("fileList", fileList);
				rtnMap.put("makePathList", makePathList);
				rtnMap.put("errorMsg", errorMsg);
				return rtnMap;
			}
		}
		
		
		fileList.add(jsonInfo);
		
		rtnMap.put("fileList", fileList);
		rtnMap.put("makePathList", makePathList);
		rtnMap.put("errorMsg", errorMsg);
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private Map insertRep1102TargetDataDeployCommitBySVN(Map paramMap) throws Exception {
		
		Map rtnMap = new HashMap<>();
		
		
		int succCnt = 0;
		
		boolean result = false;
		
		List<String> errorMsg = new ArrayList<String>();
		
		RepResultVO repResultVo = (RepResultVO) paramMap.get("repResultVO");
		
		
		String repId = (String) paramMap.get("repId");
		if(repId == null || "".equals(repId)) {
			repId = repResultVo.getRepVo().getRepId();
		}
		
		String ticketId = repResultVo.getTicketId();
		
		String commitAuthor = repResultVo.getEmpId();
		
		
		SVNRepository repository = repResultVo.getDplRepo();
		
		Map<String, List<JSONObject>> repFilePathMap = (Map<String, List<JSONObject>>) paramMap.get("repFilePathMap");
		
		List<JSONObject> fileList = repFilePathMap.get(repId);
		
		Map<String, List<String>> repMakePathMap= (Map<String, List<String>>) paramMap.get("repMakePathMap");
		
		
		boolean isLockFile = false;
		
		for(JSONObject fileInfo: fileList) {
			try {
				String filePath = (String) fileInfo.get("filePath");
				
				
				SVNLock svnLock = repository.getLock(filePath);
				
				if(svnLock != null) {
					errorMsg.add("- Lock상태의 파일입니다. [path="+filePath+"]");
					isLockFile = true;
				}
			}catch(SVNException svnE) {
				if(svnE.getErrorMessage().getErrorCode().getCode() == 160013) {
					Log.debug("########### Lock 대상 파일 없음");
				}
				Log.debug(svnE);
				break;
			}catch(Exception e) {
				Log.debug(e);
				break;
			}
		}
		
		
		if(isLockFile) {
			errorMsg.add("- 커밋 대상 파일 중 Lock 상태의 파일이 발견되어 커밋을 전체 중지했습니다.");
			
			
			rtnMap.put("result", result);
			
			rtnMap.put("succCnt", 0);
			
			rtnMap.put("errorMsg", errorMsg);
			
			
			rtnMap.put("isLockFile", isLockFile);
			return rtnMap;
		}
		
		
		List<Map> rep1102InsertList = new ArrayList<Map>();
		
		
		List<String> makePathList = repMakePathMap.get(repId);
		
		
		Collections.sort( makePathList, new Comparator<String>() {
			@Override
			public int compare(String a, String b) {
				
				String pathA = a;
				String pathB = b;
				
				int valueA = pathA.split("/").length;
				int valueB = pathB.split("/").length;
				
				return Integer.compare(valueA, valueB);
			}
		});
		
		
		int commitCnt = fileList.size();
		
		
		String commitComment = "[insert_data_no-flag]\n [커밋 정보] \n emp_id: "+commitAuthor+"\n ticket_id: "+ticketId+" \n 파일 개수: "+commitCnt;
		
		
		ISVNEditor editor = repository.getCommitEditor(commitComment, null);
		editor.openRoot(-1);
		
		
		if(makePathList.size() > 0) {
			for(int j=0;j<makePathList.size();j++) {
				String makePath = makePathList.get(j);
				
				
				
				int openDirCnt = 0;
				
				String[] parentPath = makePath.split("/");
				
				for(int l=1;l<(parentPath.length-1);l++) {
					String path = parentPath[l];
					editor.openDir(path, -1);
					openDirCnt++;
					
				}
				
				
				
	            
				
				try {
					editor.addDir(makePath.substring(makePath.lastIndexOf("/")+1, makePath.length()), null, -1);
					
					
					editor.closeDir();
				}catch(SVNException svnE) {
        			svnE.printStackTrace();
        			int errorCode = svnE.getErrorMessage().getErrorCode().getCode();
        			if(errorCode == 160013) {
        				
            			errorMsg.add("- 해당 파일 커밋에 필요한 상위 디렉토리 정보가 함께 선택되지 않았습니다. [path="+makePath+"]");
        			}else {
        				errorMsg.add("- 해당 파일 커밋 중 오류가 발생했습니다. [path="+makePath+", error="+svnE.getMessage()+"]");
        			}
        		}
				
				
				for(int l=0;l<openDirCnt;l++) {
					editor.closeDir();
				}
			}
		}
		
		
		for(JSONObject fileInfo: fileList) {
			
			String filePath = (String) fileInfo.get("filePath");
			String fileTypeNm = (String) fileInfo.get("fileTypeNm");
			String ciId = (String) fileInfo.get("ciId");
			String empId = (String) fileInfo.get("empId");
			String jobId = (String) fileInfo.get("jobId");
			String bldNum = (String) fileInfo.get("bldNum");
			
			
			String repChgFileNm = filePath.substring((filePath.lastIndexOf("/")+1), filePath.length());
			
			
			String repChgTypeCd = "";
			if("A".equals(fileTypeNm)) {
				repChgTypeCd = "01";
			}
			else if("M".equals(fileTypeNm)) {
				repChgTypeCd = "02";
			}
			else if("D".equals(fileTypeNm)) {
				repChgTypeCd = "03";
			}
			
			
			Map dataMap = new HashMap<>();
			dataMap.put("ciId", ciId);
			dataMap.put("jobId", jobId);
			dataMap.put("bldNum", bldNum);
			dataMap.put("commitEmpId", empId);
			dataMap.put("repId", repId);
			dataMap.put("ticketId", ticketId);
			dataMap.put("repChgTypeCd", repChgTypeCd);
			dataMap.put("repChgFilePath", filePath);
			dataMap.put("repChgFileKind", "file");
			dataMap.put("repChgFileNm", repChgFileNm);
			dataMap.put("repChgSelCd", "02");
			
			
			rep1102InsertList.add(dataMap);
			
			 
			
			if("A".equals(fileTypeNm)) {
				
				
				byte[] sourceTrunkFileData = (byte[]) fileInfo.get("sourceTrunkFileData");
				
				try {
					
					int openDirCnt = 0;
					String parentPathStr = filePath.substring(0, filePath.lastIndexOf("/"));
					
					String[] parentPath = parentPathStr.split("/");
					
					for(int l=0;l<parentPath.length;l++) {
						String path = parentPath[l];
						editor.openDir(path, -1);
						openDirCnt++;
						
					}
					
    				
    				
    				
	    			editor.addFile(repChgFileNm, null, -1);
	    			
	    			editor.applyTextDelta( filePath , null );
	    			SVNDeltaGenerator deltaGenerator = new SVNDeltaGenerator( );
	    			String checksum = deltaGenerator.sendDelta( filePath , new ByteArrayInputStream(sourceTrunkFileData) , editor , true );
	    			
	    			
    				editor.closeFile(repChgFileNm, checksum);
    				
    				
					for(int l=0;l<openDirCnt;l++) {
						editor.closeDir();
					}
    				
	    			
        		}catch(SVNException svnE) {
        			svnE.printStackTrace();
        			int errorCode = svnE.getErrorMessage().getErrorCode().getCode();
        			if(errorCode == 160013) {
        				
            			errorMsg.add("- 해당 파일 커밋에 필요한 상위 디렉토리 정보가 함께 선택되지 않았습니다. [path="+filePath+"]");
        			}else {
        				errorMsg.add("- 해당 파일 커밋 중 오류가 발생했습니다. [path="+filePath+", error="+svnE.getMessage()+"]");
        			}
        			break;
        		}
			}
			
			else if("M".equals(fileTypeNm)) {
				System.out.println("### 파일 수정: "+filePath);
				
				byte[] sourceTrunkFileData = (byte[]) fileInfo.get("sourceTrunkFileData");
				
				
				int openDirCnt = 0;
				String parentPathStr = filePath.substring(0, filePath.lastIndexOf("/"));
				
				String[] parentPath = parentPathStr.split("/");
				
				for(int l=0;l<parentPath.length;l++) {
					String path = parentPath[l];
					editor.openDir(path, -1);
					openDirCnt++;
					System.out.println("open: "+path);
				}
				
	    		
	    		editor.openFile(repChgFileNm, -1);
	    		
	    		
	    		editor.applyTextDelta(filePath , null );
	            SVNDeltaGenerator deltaGenerator = new SVNDeltaGenerator( );
	            String checksum = deltaGenerator.sendDelta( filePath , new ByteArrayInputStream(sourceTrunkFileData) , editor , true );
	            
	            
	            editor.closeFile(repChgFileNm, checksum);
	            
	            
				for(int l=0;l<openDirCnt;l++) {
					editor.closeDir();
				}
			}
			
			else if("D".equals(fileTypeNm)) {
				
	    		editor.deleteEntry(filePath, -1);
			}
			
			succCnt++;
		}
		
		editor.closeDir();
		
		
		if(errorMsg != null && errorMsg.size() > 0) {
			editor.abortEdit();
		}else if(succCnt > 0) {
			
			SVNCommitInfo commitInfo = editor.closeEdit();
			
			Long commitRv = commitInfo.getNewRevision();
			

			
			Map dataMap = new HashMap<>();
			dataMap.put("repId", repId);
			dataMap.put("repRv", commitRv);
			dataMap.put("repComment", commitComment);
			
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
			
			dataMap.put("repCmtDate", sdf.format(new Date()));
			
			
			if(commitAuthor == null || "".equals(commitAuthor)) {
				commitAuthor = "SYSTSEM";
			}
			
			dataMap.put("repCmtAuthor", commitAuthor);
			dataMap.put("repChgFileCnt", fileList.size());
			dataMap.put("ticketId", ticketId);
			
			dataMap.put("repRvTypeCd", "03");
			
			rep1100DAO.insertRep1100RvInfo(dataMap);
			
			
			for(Map rep1102InsertInfo : rep1102InsertList) {
				rep1102InsertInfo.put("repRv", commitRv);
				rep1100DAO.insertRep1102RvChgInfo(rep1102InsertInfo);
			}

			result = true;
		}else {
			editor.abortEdit();
		}
		editor.abortEdit();
		
		
		rtnMap.put("result", result);
		
		rtnMap.put("succCnt", succCnt);
		
		rtnMap.put("errorMsg", errorMsg);
		
		rtnMap.put("isLockFile", isLockFile);
				
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private Map insertRep1102TargetDataDeployCommitByGitHub(Map paramMap) throws Exception {
		
		Map rtnMap = new HashMap<>();
		
		
		int succCnt = 0;
		
		boolean result = false;
		
		List<String> errorMsg = new ArrayList<String>();
		
		RepResultVO repResultVo = (RepResultVO) paramMap.get("repResultVO");
		
		
		String repId = (String) paramMap.get("repId");
		if(repId == null || "".equals(repId)) {
			repId = repResultVo.getRepVo().getRepId();
		}
		
		String ticketId = repResultVo.getTicketId();
		
		String commitAuthor = repResultVo.getEmpId();
		
		
		GHRepository repository = repResultVo.getGitRepo();
		
		Map<String, List<JSONObject>> repFilePathMap = (Map<String, List<JSONObject>>) paramMap.get("repFilePathMap");
		
		List<JSONObject> fileList = repFilePathMap.get(repId);
		
		
		String masterBranchNm = repository.getDefaultBranch();
		
		String opsBranchNm = EgovProperties.getProperty("Globals.github.operation.branch");
		
		
		boolean isLockFile = false;
		
		
		
		
		
		List<Map> rep1102InsertList = new ArrayList<Map>();
				
		
		int commitCnt = fileList.size();
		
		
		String commitComment = "[insert_data_no-flag]\n [커밋 정보] \n emp_id: "+commitAuthor+"\n ticket_id: "+ticketId+" \n 파일 개수: "+commitCnt;
		
		
		
		String newOpsBranch = opsBranchNm+"_trunkCommit";
		
		String mstBranchHeadSha = repository.getRef("heads/"+masterBranchNm).getObject().getSha();
		try {
			
			repository.createRef("refs/heads/"+newOpsBranch, mstBranchHeadSha);
		}catch (Exception e){
			
			
			GHRef opsCommitRef = repository.getRef("heads/"+masterBranchNm);
			repository.getRef("heads/"+newOpsBranch).updateTo(opsCommitRef.getObject().getSha(),true);
		}
		
		
		
		for(JSONObject fileInfo: fileList) {
			
			String filePath = (String) fileInfo.get("filePath");
			
			if(filePath.indexOf("/") == 0) {
				filePath = filePath.substring(1);
			}
			String fileTypeNm = (String) fileInfo.get("fileTypeNm");
			String ciId = (String) fileInfo.get("ciId");
			String empId = (String) fileInfo.get("empId");
			String jobId = (String) fileInfo.get("jobId");
			String bldNum = (String) fileInfo.get("bldNum");
			
			
			
			
			
			
			String repChgFileNm = filePath.substring((filePath.lastIndexOf("/")+1), filePath.length());
			
			
			String repChgTypeCd = "";
			if("A".equals(fileTypeNm)) {
				repChgTypeCd = "01";
			}
			else if("M".equals(fileTypeNm)) {
				repChgTypeCd = "02";
			}
			else if("D".equals(fileTypeNm)) {
				repChgTypeCd = "03";
			}
			
			
			Map dataMap = new HashMap<>();
			dataMap.put("ciId", ciId);
			dataMap.put("jobId", jobId);
			dataMap.put("bldNum", bldNum);
			dataMap.put("commitEmpId", empId);
			dataMap.put("repId", repId);
			dataMap.put("ticketId", ticketId);
			dataMap.put("repChgTypeCd", repChgTypeCd);
			dataMap.put("repChgFilePath", filePath);
			dataMap.put("repChgFileKind", "file");
			dataMap.put("repChgFileNm", repChgFileNm);
			dataMap.put("repChgSelCd", "02");
			
			
			rep1102InsertList.add(dataMap);
			
			GHContent newBrcFileContent = null;
			String fileCmtMessage = ticketId + " \n\n bld_num: "+bldNum+" \n ticket_id: "+ticketId;
			String fileContent = null;
			try {
				
				newBrcFileContent = repository.getFileContent(filePath, newOpsBranch);
				if ("02".equals(repChgTypeCd)) {
					
					byte[] brancheContent = (byte[]) fileInfo.get("sourceTrunkFileData");
					if(brancheContent == null) {
						fileContent = new String("");
					}else {
						fileContent = new String(brancheContent);
					}
					newBrcFileContent.update(fileContent, fileCmtMessage, newOpsBranch);
				}else if ("03".equals(repChgTypeCd)) {
					
					newBrcFileContent.delete(commitComment, newOpsBranch);
				}else {
					continue;
				}
			}catch (GHFileNotFoundException notFileE) {
				
				if ("01".equals(repChgTypeCd)) {
					
					byte[] brancheContent = (byte[]) fileInfo.get("sourceTrunkFileData");
					if(brancheContent == null) {
						fileContent = new String("");
					}else {
						fileContent = new String(brancheContent);
					}
					
					repository.createContent()
						.branch(newOpsBranch)
						.path(filePath)
						.message(fileCmtMessage)
						.content(fileContent)
						.commit();
					
				}else if ("02".equals(repChgTypeCd)) {
					
					byte[] brancheContent = (byte[]) fileInfo.get("sourceTrunkFileData");
					if(brancheContent == null) {
						fileContent = new String("");
					}else {
						fileContent = new String(brancheContent);
					}
					
					
					repository.createContent()
					.branch(newOpsBranch)
					.path(filePath)
					.message(fileCmtMessage)
					.content(fileContent)
					.commit();
					
				} else if ("03".equals(repChgTypeCd)) {
					
					if(newBrcFileContent == null) {
						
						succCnt++;
						
						continue;
					}
				}else {
					continue;
				}
			}
			
			succCnt++;
			
		}
		
		if(succCnt > 0) {
			
			String bldNum = (String) ((JSONObject) fileList.get(0)).get("bldNum");
			setRep1102List(newOpsBranch+bldNum, rep1102InsertList);
			
			
			
			try {
				String newBranchHeadSha = repository.getRef("heads/" + newOpsBranch).getObject().getSha();
				if(!mstBranchHeadSha.equals(newBranchHeadSha)) {
						System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PULL REQUEST START>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
						System.out.println("param map : "+paramMap.entrySet());
						
						repository.createPullRequest(commitComment, newOpsBranch, opsBranchNm,  commitComment).merge(commitComment);
						System.out.println(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PULL REQUEST END>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
				}
			}catch (Exception e) {
				e.printStackTrace();
				
				
				
				
				removeRep1102List(newOpsBranch);
				
				errorMsg.add("Pull Request에 실패하였습니다. "+masterBranchNm+"에 커밋할 수 없습니다.");
				rtnMap.put("errorMsg", errorMsg);
				rtnMap.put("succCnt", 0);
				rtnMap.put("result", false);
				rtnMap.put("isLockFile", isLockFile);
				
				return rtnMap;
			}
		}
		
		
		rtnMap.put("result", result);
		
		rtnMap.put("succCnt", succCnt);
		
		rtnMap.put("errorMsg", errorMsg);
		
		rtnMap.put("isLockFile", isLockFile);
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes"})
	public List<Map> selectRep1102TktDplFileChgList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1102TktDplFileChgList(paramMap);
	}

	
	@SuppressWarnings({ "rawtypes"})
	public List<Map> selectRep1102TktDplSelFileChgList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1102TktDplSelFileChgList(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public Map selectRep1102TktFileRecentBldNumList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1102TktFileRecentBldNumList(paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRep1103TktDplFileSelectAjax(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap<>();
		
		
		int succCnt = 0;
		
		
		boolean result = false;
		
		
		List<String> errorMsg = new ArrayList<String>();

		
		String deployFilePath = EgovProperties.getProperty("Globals.deployFile.path");
		
		
		File checkPath = new File(deployFilePath);
		if(checkPath == null || !checkPath.isDirectory()) {
			errorMsg.add("- Deploy 저장 디렉토리가 없습니다. [path="+deployFilePath+"]");
			
			rtnMap.put("result", result);
			
			rtnMap.put("succCnt", succCnt);
			
			rtnMap.put("errorMsg", errorMsg);
			return rtnMap;
		}
		
		
		if(deployFilePath.lastIndexOf("/") == (deployFilePath.length()-1)) {
			deployFilePath = deployFilePath.substring(0, deployFilePath.length());
		}
		
		
		String returnMap = (String) paramMap.get("returnMap");
		
		
		JSONArray jsonArr = new JSONArray(returnMap);
				
		
		Map<String, RepResultVO> repInfoMap = new HashMap<String, RepResultVO>();
		
		
		Map<String, List<Map>> repSelDplFileMap = new HashMap<String, List<Map>>();
		
		if(jsonArr != null && jsonArr.length() > 0) {
			
			for(int i=0;i<jsonArr.length();i++) {
				JSONObject jsonInfo = jsonArr.getJSONObject(i);
				
				
				String ciId = (String) jsonInfo.get("ciId");
				String ticketId = (String) jsonInfo.get("ticketId");
				String repId = (String) jsonInfo.get("repId");
				String repRv = (String) jsonInfo.get("repRv");
				String jobId = (String) jsonInfo.get("jobId");
				String bldNum = String.valueOf(jsonInfo.get("bldNum"));
				String repChgId = (String) jsonInfo.get("repChgId");
				String repChgFilePath = (String) jsonInfo.get("repChgFilePath");
				String empId = (String) jsonInfo.get("empId");
				
				
				String repTypeCd= "";
				 
	            
	            String exportTargetPath = deployFilePath+"/"+ticketId;
	            
				
				RepResultVO repResultVo = null;
				List repSelFileList = null;
				
				RepVO repVo = null;
				
				
				if(!repInfoMap.containsKey(repId)) {
					
					Map newMap = new HashMap<>();
					newMap.put("repId", repId);
					
					
					repVo = rep1000Service.selectRep1000Info(newMap);
					
					
					repResultVo = repModule.repAuthCheck(repVo);
					repResultVo.setEmpId(empId);
					repResultVo.setTicketId(ticketId);
					
					repInfoMap.put(repId, repResultVo);
					
					
					newMap.put("ciId", ciId);
					newMap.put("ticketId", ticketId);
					
					
					repTypeCd = repVo.getRepTypeCd();
					
					
					repSelFileList = rep1100DAO.selectRep1102TktDplSelFileChgList(newMap);
					repSelDplFileMap.put(repId, repSelFileList);
					
					
					if(i == 0) {
						
						folderSubDelete(exportTargetPath);
					}
				}
				
				repResultVo = repInfoMap.get(repId);
				repSelFileList = repSelDplFileMap.get(repId);
				
				repVo = repResultVo.getRepVo();
				
				repTypeCd = repVo.getRepTypeCd();
				
				
				if(!repResultVo.isReturnValue()) {
					errorMsg.add("- Deploy 소스저장소 연결 실패 [repNm="+repResultVo.getRepVo().getRepNm()+"]");
					continue;
				}
				
				Map subParamMap = new HashMap<>();
				subParamMap.put("repResultVO", repResultVo);
				
				subParamMap.put("ticketId", ticketId);
				subParamMap.put("ciId", ciId);
				subParamMap.put("repId", repId);
				subParamMap.put("repChgId", repChgId);
				subParamMap.put("repRv", repRv);
				subParamMap.put("commitEmpId", empId);
				subParamMap.put("repChgSelCd", "01");
				
	            subParamMap.put("exportTargetPath", exportTargetPath);
				subParamMap.put("repChgFilePath", repChgFilePath);
				subParamMap.put("repSelFileList", repSelFileList);
				subParamMap.put("jobId", jobId);
				subParamMap.put("bldNum", bldNum);
				
				
				
				Map subRtnMap = new HashMap<>();
				
				
				
				if("01".equals(repTypeCd)) {
					
					subRtnMap = insertRep1103TktDplFileSelectByGitHub(subParamMap);
				}
				
				else if("02".equals(repTypeCd)) {
					
					subRtnMap = insertRep1103TktDplFileSelectBySVN(subParamMap);
				}
				
				else if("03".equals(repTypeCd)) {
					
				}
				
	            
				if(!Boolean.parseBoolean(String.valueOf(subRtnMap.get("checkUpdate")))) {
					errorMsg.add("- 선택 파일 데이터베이스 값 업데이트 중 오류 발생 [path="+exportTargetPath+"]");
					continue;
				}
				
				
				if(!Boolean.parseBoolean(String.valueOf(subRtnMap.get("fileDown")))) {
					String errorCode = (String) subRtnMap.get("errorCode");
					String errorMassage = (String) subRtnMap.get("errorMassage");
					errorMsg.add("- 저장소 파일 Export 오류 발생 [error_code="+errorCode+", error_msg="+errorMassage+", path="+exportTargetPath+"]");
					continue;
				}
	            
	            
	            succCnt++;
			}
			
			
			Iterator itr = repSelDplFileMap.keySet().iterator();
			while(itr.hasNext()) {
				
				String repId = (String) itr.next();
				
				
				List<Map> repSelFileList = repSelDplFileMap.get(repId);
				for(Map repSelFileInfo: repSelFileList) {
					String infoTicketId = (String) repSelFileInfo.get("ticketId");
	            	String infoCiId = (String) repSelFileInfo.get("ciId");
	            	String infoRepRv = String.valueOf(repSelFileInfo.get("repRv"));
	            	String infoRepChgId = (String) repSelFileInfo.get("repChgId");
	            	String infoEmpId = (String) repSelFileInfo.get("empId");
	            	
	            	
	            	Map newMap = new HashMap<>();
		            newMap.put("ticketId", infoTicketId);
		            newMap.put("ciId", infoCiId);
		            newMap.put("repId", repId);
		            newMap.put("repRv", infoRepRv);
		            newMap.put("repChgId", infoRepChgId);
		            newMap.put("commitEmpId", infoEmpId);
		            newMap.put("repChgSelCd", "02"); 
		            rep1100DAO.updateRep1102TktDplFileSelInfo(newMap);
				}
			}
			
			result = true;
		}
		
		
		rtnMap.put("result", result);
		
		rtnMap.put("succCnt", succCnt);
		
		rtnMap.put("errorMsg", errorMsg);
		
		return rtnMap;
	}
	
	
	private void folderSubDelete(String path) {
		File pathFile = new File(path);
		if(pathFile != null) {
			
			File[] files = pathFile.listFiles();
			
			
			if(files != null && files.length > 0) {
				
				for(File file : files) {
					
					if(file.isFile()) {
						
						file.delete();
					}
					
					else if(file.isDirectory()){
						
						folderSubDelete(file.getAbsolutePath());
						
						file.delete();
					}
				}
			}
		}
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRep1103TktDplFileSelectBySVN(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap<>();
		
		RepResultVO repResultVo = (RepResultVO) paramMap.get("repResultVO");
		
		
		SVNRepository repository = repResultVo.getDplRepo();
		
		
		ISVNOptions options = SVNWCUtil.createDefaultOptions(true);
		SVNClientManager clientManager = SVNClientManager.newInstance(options, repository.getAuthenticationManager());
        
		
		SVNUpdateClient updateClient = clientManager.getUpdateClient();
        
		
		String rootUrl = repository.getRepositoryRoot(true).toString();

		String ticketId = (String) paramMap.get("ticketId");
		String ciId = (String) paramMap.get("ciId");
		String repId = (String) paramMap.get("repId");
		String repChgId = (String) paramMap.get("repChgId");
		String repRv = (String) paramMap.get("repRv");
		String commitEmpId = (String) paramMap.get("commitEmpId");
		String repChgSelCd = (String) paramMap.get("repChgSelCd");
		
		String jobId = (String) paramMap.get("jobId");
		String bldNum = (String) paramMap.get("bldNum");
		
		
		Map updateInfo = new HashMap<>();
		updateInfo.put("ticketId", ticketId);
		updateInfo.put("ciId", ciId);
		updateInfo.put("repId", repId);
		updateInfo.put("repChgId", repChgId);
		updateInfo.put("repRv", repRv);
		updateInfo.put("commitEmpId", commitEmpId);
		updateInfo.put("repChgSelCd", repChgSelCd);
		int checkUpdate = rep1100DAO.updateRep1102TktDplFileSelInfo(updateInfo);
		
		if(checkUpdate != 1) {
			rtnMap.put("checkUpdate", false);
			return rtnMap;
		}
		
		else {
			rtnMap.put("checkUpdate", true);
		}
		
		
		String exportTargetPath = (String) paramMap.get("exportTargetPath");
		
		String repChgFilePath = (String) paramMap.get("repChgFilePath");
		
		
		if(repChgFilePath.indexOf("/") != 0) {
			exportTargetPath += "/";
			}
        
		try {
			
			updateClient.doExport(SVNURL.parseURIEncoded(rootUrl+repChgFilePath), new File(exportTargetPath+repChgFilePath), SVNRevision.parse(repRv), SVNRevision.parse(repRv), null, true, SVNDepth.EMPTY);
			
			
			rtnMap.put("fileDown", true);
		}catch(SVNException svnE) {
			
			int svnErrorCode = svnE.getErrorMessage().getErrorCode().getCode();
			String svnErrorMsg = svnE.getErrorMessage().getMessage();
			
			
			rtnMap.put("fileDown", false);
			rtnMap.put("errorCode", svnErrorCode);
			rtnMap.put("errorMassage", svnErrorMsg);
			
			return rtnMap;
		}
        
		List repSelFileList = (List) paramMap.get("repSelFileList");
		
		for(int j=0;j<repSelFileList.size();j++) {
			Map repSelDplFileInfo = (Map) repSelFileList.get(j);
			
			String infoTicketId = (String) repSelDplFileInfo.get("ticketId");
			String infoCiId = (String) repSelDplFileInfo.get("ciId");
			String infoRepId = (String) repSelDplFileInfo.get("repId");
			String infoJobId = (String) repSelDplFileInfo.get("jobId");
			String infoBldNum = String.valueOf(repSelDplFileInfo.get("bldNum"));
			String infoRepChgFilePath = (String) repSelDplFileInfo.get("repChgFilePath");
			
			
			if(infoTicketId.equals(ticketId) && infoCiId.equals(ciId)
					&& infoRepId.equals(repId) && infoJobId.equals(jobId)
					&& infoBldNum.equals(bldNum) && infoRepChgFilePath.equals(repChgFilePath)) {
				
				repSelFileList.remove(j);
				break;
			}
		}
		
		return rtnMap;
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public Map insertRep1103TktDplFileSelectByGitHub(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap<>();
		
		RepResultVO repResultVo = (RepResultVO) paramMap.get("repResultVO");
		
		
		
		
		GHRepository repository = repResultVo.getGitRepo();
		
		
		GHContent content = null;
		String rtnContent = "";
		
		
		String masterBranchNm = repository.getDefaultBranch();
		
		String opsBranchNm = EgovProperties.getProperty("Globals.github.operation.branch");
		
		
		String ticketId = (String) paramMap.get("ticketId");
		String ciId = (String) paramMap.get("ciId");
		String repId = (String) paramMap.get("repId");
		String repChgId = (String) paramMap.get("repChgId");
		String repRv = (String) paramMap.get("repRv");
		String commitEmpId = (String) paramMap.get("commitEmpId");
		String repChgSelCd = (String) paramMap.get("repChgSelCd");
		
		String jobId = (String) paramMap.get("jobId");
		String bldNum = (String) paramMap.get("bldNum");
		
		
		Map updateInfo = new HashMap<>();
		updateInfo.put("ticketId", ticketId);
		updateInfo.put("ciId", ciId);
		updateInfo.put("repId", repId);
		updateInfo.put("repChgId", repChgId);
		updateInfo.put("repRv", repRv);
		updateInfo.put("commitEmpId", commitEmpId);
		updateInfo.put("repChgSelCd", repChgSelCd);
		int checkUpdate = rep1100DAO.updateRep1102TktDplFileSelInfo(updateInfo);
		
		if(checkUpdate != 1) {
			rtnMap.put("checkUpdate", false);
			return rtnMap;
		}
		
		else {
			rtnMap.put("checkUpdate", true);
		}
		
		
		String exportTargetPath = (String) paramMap.get("exportTargetPath");
		
		String repChgFilePath = (String) paramMap.get("repChgFilePath");
		
		
		if(repChgFilePath.indexOf("/") != 0) {
			exportTargetPath += "/";
		}
		
		try {
			
			content = repository.getFileContent(repChgFilePath, opsBranchNm);
			
			if(content != null) {
				
				byte buffer[] = new byte[32];
				
				
				InputStream is = null;
				ByteArrayOutputStream baos = null;
				
				try {
					is = repository.getBlob(content.getSha()).read();
					
					
					baos = new ByteArrayOutputStream();
					
					
					int readBuffer = 0;
					while((readBuffer = is.read(buffer)) != -1) {
						
						baos.write(buffer, 0, readBuffer);
					}
					
					rtnContent = baos.toString("UTF-8");
					
				}catch(IOException ioE) {
					
				}finally {
					
					if(baos != null) {
						baos.close();
					}
					if(is != null) {
						is.close();
					}
				}
			}
		}catch(GHFileNotFoundException notFileE) {
			
			content = null;
			
			
			int githubErrorCode = notFileE.hashCode();
			String githubErrorMsg = notFileE.getMessage();
			
			
			rtnMap.put("fileDown", false);
			rtnMap.put("errorCode", githubErrorCode);
			rtnMap.put("errorMassage", githubErrorMsg);
			
			return rtnMap;
		}
		
		
		rtnMap.put("fileDown", true);
		
		try {
			
			String filePath = exportTargetPath+repChgFilePath;
			
			String fileNm = filePath.substring(filePath.lastIndexOf("/")+1);
			
			filePath = filePath.substring(0, filePath.lastIndexOf("/"));
			
			
			File exportDir = new File(filePath);
			
			if(!exportDir.exists()) {
				exportDir.mkdirs();
			}
			
			
			File exportFile = new File(exportDir, fileNm);
			
			
			exportFile.setWritable(true); 
			
			FileOutputStream fw = new FileOutputStream(exportFile, true);
			fw.write(rtnContent.getBytes());
			fw.close();
			
			
			rtnMap.put("fileDown", true);
		}catch (Exception e) {
			
			
			int githubErrorCode = e.hashCode();
			String githubErrorMsg = e.getMessage();
			
			
			rtnMap.put("fileDown", false);
			rtnMap.put("errorCode", githubErrorCode);
			rtnMap.put("errorMassage", githubErrorMsg);
			
			return rtnMap;
		}
		
		List repSelFileList = (List) paramMap.get("repSelFileList");
		
		for(int j=0;j<repSelFileList.size();j++) {
			Map repSelDplFileInfo = (Map) repSelFileList.get(j);
			
			String infoTicketId = (String) repSelDplFileInfo.get("ticketId");
			String infoCiId = (String) repSelDplFileInfo.get("ciId");
			String infoRepId = (String) repSelDplFileInfo.get("repId");
			String infoJobId = (String) repSelDplFileInfo.get("jobId");
			String infoBldNum = String.valueOf(repSelDplFileInfo.get("bldNum"));
			String infoRepChgFilePath = (String) repSelDplFileInfo.get("repChgFilePath");
			
			
			if(infoTicketId.equals(ticketId) && infoCiId.equals(ciId)
					&& infoRepId.equals(repId) && infoJobId.equals(jobId)
					&& infoBldNum.equals(bldNum) && infoRepChgFilePath.equals(repChgFilePath)) {
				
				repSelFileList.remove(j);
				break;
			}
		}
		
		return rtnMap;
	}
	
	
	@SuppressWarnings("rawtypes")
	public int updateRep1102TktDplFileSelInfo(Map paramMap) throws Exception{
		return rep1100DAO.updateRep1102TktDplFileSelInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public int selectRep1100TktChgMaxRv(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktChgMaxRv(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectRep1101TktChgFileLastRvNum(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1101TktChgFileLastRvNum(paramMap);
	}
	
	@SuppressWarnings({ "rawtypes"})
	public List<Map> selectTempDataList(Map paramMap) throws Exception{
		return rep1100DAO.selectTempDataList(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public int updateTempDataInfo(Map paramMap) throws Exception{
		return rep1100DAO.updateTempDataInfo(paramMap);
	}
	
}
