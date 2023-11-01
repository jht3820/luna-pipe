package kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
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
import org.springframework.stereotype.Service;
import org.tmatesoft.svn.core.SVNCommitInfo;
import org.tmatesoft.svn.core.SVNDepth;
import org.tmatesoft.svn.core.SVNException;
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

import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.Rep1100Service;
import kr.opensoftlab.sdf.rep.com.RepModule;
import kr.opensoftlab.sdf.rep.com.vo.RepDataVO;
import kr.opensoftlab.sdf.rep.com.vo.RepResultVO;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;


@Service("rep1100Service")
public class Rep1100ServiceImpl extends EgovAbstractServiceImpl implements Rep1100Service{
	
	
	@Resource(name="rep1100DAO")
    private Rep1100DAO rep1100DAO;

	
	@Resource(name = "rep1000Service")
	private Rep1000Service rep1000Service;

	
	@Resource(name = "repModule")
	private RepModule repModule;
	
	
	@SuppressWarnings("rawtypes")
	public Map selectRep1100RvInfo(Map paramMap) throws Exception {
		return rep1100DAO.selectRep1100RvInfo(paramMap);
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

	
	@SuppressWarnings({ "rawtypes"})
	public List<Map> selectRep1100TktRvFileChgList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktRvFileChgList(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public int selectRep1100TktRvFileChgListCnt(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktRvFileChgListCnt(paramMap);
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
		
		
		String buildBrancheNm = EgovProperties.getProperty("Globals.svn.buildBranchNm");
		
		
		
		String branchePath = "/branches/"+buildBrancheNm;
		
		
		
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
				
				String repChgFileKind = (String) jsonInfo.get("repChgFileKind");
				
				String trunkPath = repChgFilePath.replace(branchePath, "/trunk");
				
				Long repRv = Long.parseLong(String.valueOf(jsonInfo.get("repRv")));
				
				String ticketId = (String) jsonInfo.get("ticketId");
				
				String empId = (String) jsonInfo.get("empId");
				
				
				if(repChgFilePath.indexOf(branchePath) == -1) {
					errorMsg.add("- 대상 파일 경로가 지정된 브런치 경로가 아닙니다. [path="+repChgFilePath+"]");
					
				}
				
				RepResultVO repResultVo = null;
				
				if(!repFileMap.containsKey(repId)) {
					
					Map newMap = new HashMap<>();
					newMap.put("repId", repId);
					
					
					RepVO repVo = rep1000Service.selectRep1000Info(newMap);

					
					repResultVo = repModule.repAuthCheck(repVo);
					repResultVo.setLastRevisionNum(repRv);
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

				
				SVNRepository repository = repResultVo.getSvnRepo();
				
				
				List dirList = repDirMap.get(repId);
				
				
				List fileList = repFileMap.get(repId);
				
				
				String repChgTypeCd = (String) jsonInfo.get("repChgTypeCd");
				
				
				if("02".equals(repChgTypeCd)) {
					
					SVNNodeKind trunkNode =  repository.checkPath(trunkPath, -1);
					
					
					if(trunkNode.getID() == SVNNodeKind.NONE.getID()) {
						repChgTypeCd = "01";
						jsonInfo.put("repChgTypeCd", repChgTypeCd);
					}
				}
				
				else if("01".equals(repChgTypeCd)) {
					
					SVNNodeKind trunkNode =  repository.checkPath(trunkPath, -1);
					
					
					if((trunkNode.getID() != SVNNodeKind.NONE.getID()) && (trunkNode.getID() != SVNNodeKind.UNKNOWN.getID())) {
						repChgTypeCd = "02";
						jsonInfo.put("repChgTypeCd", repChgTypeCd);
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
							continue;
						}
					}
					else if("03".equals(repChgTypeCd)) {
						
						SVNNodeKind trunkNode =  repository.checkPath(trunkPath, -1);
						
						if(trunkNode == null || (trunkNode.getID() == SVNNodeKind.NONE.getID()) || (trunkNode.getID() == SVNNodeKind.UNKNOWN.getID())) {
							
							jsonInfo.put("delSkip", true);
						}
					}
					
					dirList.add(jsonInfo);
					
					repDirMap.put(repId, dirList);
				}else if("file".equals(repChgFileKind)) {
					
					
					if("01".equals(repChgTypeCd)) {
						String checkParentPath = trunkPath.substring(0, trunkPath.lastIndexOf("/"));
						
						SVNNodeKind trunkNode =  repository.checkPath(checkParentPath, -1);
						
						if(trunkNode == null || (trunkNode.getID() == SVNNodeKind.NONE.getID()) || (trunkNode.getID() == SVNNodeKind.UNKNOWN.getID())) {
							
							if(checkDirList.indexOf(checkParentPath) == -1) {
								errorMsg.add("- 해당 파일 커밋에 필요한 상위 디렉토리 정보가 함께 선택되지 않았습니다. [path="+trunkPath+"]");
								continue;
							}
						}
						
						ByteArrayOutputStream baos = new ByteArrayOutputStream( );
			            repository.getFile(repChgFilePath, repRv, null, baos);
			            String brancheContent = baos.toString("UTF-8");
			    		baos.close();
			    		
			    		
			    		jsonInfo.put("brancheContent", brancheContent);
					}
					
					else if("02".equals(repChgTypeCd)) {
						
						List<RepDataVO> trunkLogList = repModule.selectRepLogList(repResultVo, 1, -1, new String[]{trunkPath});
						
						if(trunkLogList != null && trunkLogList.size() > 0) {
							
							RepDataVO trunkLogInfo = trunkLogList.get(trunkLogList.size()-1);
							if(trunkLogInfo.getRevision() > repRv) {
								errorMsg.add("- Trunk에 있는 파일 리비전("+trunkLogInfo.getRevision()+")이 현재 대상 파일("+repRv+")보다 최신입니다. [path="+trunkPath+"]");
								continue;
							}
						}
						
						
						ByteArrayOutputStream baos = new ByteArrayOutputStream( );
			            repository.getFile(repChgFilePath, repRv, null, baos);
			            String brancheContent = baos.toString("UTF-8");
			    		baos.close();
			    		
			    		
			    		jsonInfo.put("brancheContent", brancheContent);
					}
					
					else if("03".equals(repChgTypeCd)) {
						
						SVNNodeKind trunkNode =  repository.checkPath(trunkPath, -1);
						
						if(trunkNode == null || (trunkNode.getID() == SVNNodeKind.NONE.getID()) || (trunkNode.getID() == SVNNodeKind.UNKNOWN.getID())) {
							errorMsg.add("- 삭제 대상 파일이 Trunk에 없습니다. [path="+trunkPath+"]");
							continue;
						}
					}
					
					fileList.add(jsonInfo);
					
					repFileMap.put(repId, fileList);
				}
				else {
					
					continue;
				}
			}
			
			
			Iterator itr = repInfoMap.keySet().iterator();
			while(itr.hasNext()) {
				
				String repId = (String) itr.next();
				
				
				RepResultVO repResultVo = repInfoMap.get(repId);
				
				
				String ticketId = repResultVo.getTicketId();
				
				
				String commitAuthor = repResultVo.getEmpId();
				
				
				SVNRepository repository = repResultVo.getSvnRepo();
				
				
				List<JSONObject> dirList = repDirMap.get(repId);
				
				
				List<JSONObject> fileList = repFileMap.get(repId);
				
				
				List<Map> rep1101InsertList = new ArrayList<Map>();
				
				
				int commitCnt = dirList.size()+fileList.size();
				
				
				String commitComment = "[insert_data_no-flag]branche 변경 파일 "+commitCnt+"개 trunk에 commit";
				
				
				ISVNEditor editor = repository.getCommitEditor(commitComment, null);
				editor.openRoot(-1);
				List<String> makePathArr = makePathCheck;
				
				
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

				
				for(JSONObject dirInfo: dirList) {
					
					String repChgFilePath = (String) dirInfo.get("repChgFilePath");
					
					String repChgFileKind = (String) dirInfo.get("repChgFileKind");
					
					String repChgTypeCd = (String) dirInfo.get("repChgTypeCd");
					
					String repChgFileNm = (String) dirInfo.get("repChgFileNm");
					
					String trunkPath = repChgFilePath.replace(branchePath, "/trunk");
					
					Long repRv = Long.parseLong(String.valueOf(dirInfo.get("repRv")));
					
					String empId = (String) dirInfo.get("empId");
					
					if("03".equals(repChgTypeCd)) {
						
						if(!dirInfo.has("delSkip")) {
							
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

				
				for(JSONObject fileInfo: fileList) {
					
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
						
						
			            String brancheContent = (String) fileInfo.get("brancheContent");
			    		
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
			    			checksum = deltaGenerator.sendDelta( trunkPath , new ByteArrayInputStream(brancheContent.getBytes()) , editor , true );
			    			
			    			
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
						
						String brancheContent = (String) fileInfo.get("brancheContent");
						
			    		
			    		
			            
			            
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
			            String checksum = deltaGenerator.sendDelta( trunkPath , new ByteArrayInputStream(brancheContent.getBytes()) , editor , true );
			            
			            
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
						rep1100DAO.insertRep1101RvChgInfo(rep1101InsertInfo);
					}
				}else {
					
					editor.abortEdit();
				}
				
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
				
				
				if(!repInfoMap.containsKey(repId)) {
					
					Map newMap = new HashMap<>();
					newMap.put("repId", repId);
					
					
					RepVO repVo = rep1000Service.selectRep1000Info(newMap);
					
					
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
				
				
				SVNRepository repository = repResultVo.getDplRepo();
				
				
				List fileList = repFilePathMap.get(repId);
				
				
				List<String> makePathList = repMakePathMap.get(repId);
				
				
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
						continue;
					}
					Path path = sourceTrunkFile.toPath();
					byte[] sourceTrunkFileData = Files.readAllBytes(path);
					
					
					jsonInfo.put("sourceTrunkFileData", sourceTrunkFileData);
				}
				else if("M".equals(fileTypeNm)) {
					
					File sourceTrunkFile = new File(fileRealPath);
					
					
					if(!sourceTrunkFile.exists() || !sourceTrunkFile.isFile()) {
						errorMsg.add("- 물리적 경로에 파일이 없습니다. [path="+fileRealPath+"]");
						continue;
					}
					Path path = sourceTrunkFile.toPath();
					byte[] sourceTrunkFileData = Files.readAllBytes(path);
					
					
					jsonInfo.put("sourceTrunkFileData", sourceTrunkFileData);
				}
				else if("D".equals(fileTypeNm)) {
					
					SVNNodeKind dplTrunkNode =  repository.checkPath(filePath, -1);
					
					if(dplTrunkNode == null || (dplTrunkNode.getID() == SVNNodeKind.NONE.getID()) || (dplTrunkNode.getID() == SVNNodeKind.UNKNOWN.getID())) {
						errorMsg.add("- 삭제 대상 파일이 Deploy Trunk에 없습니다. [path="+filePath+"]");
						continue;
					}
				}
				
				
				fileList.add(jsonInfo);
				
				repFilePathMap.put(repId, fileList);
				
				repMakePathMap.put(repId, makePathList);
			}
			
			
			Iterator itr = repInfoMap.keySet().iterator();
			while(itr.hasNext()) {
				
				String repId = (String) itr.next();
				
				
				List<Map> rep1102InsertList = new ArrayList<Map>();
				
				
				RepResultVO repResultVo = repInfoMap.get(repId);
				
				
				String ticketId = repResultVo.getTicketId();
				
				
				String commitAuthor = repResultVo.getEmpId();
				
				
				SVNRepository repository = repResultVo.getDplRepo();
				
				
				List<JSONObject> fileList = repFilePathMap.get(repId);
				
				
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
				
				
				String commitComment = "[insert_data_no-flag]source-trunk 변경 파일 "+commitCnt+"개 deploy-trunk에 commit";
				
				
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
			}
		}
		
		rtnMap.put("result", result);
		
		rtnMap.put("succCnt", succCnt);
		
		rtnMap.put("errorMsg", errorMsg);
		
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
				 
	            
	            String exportTargetPath = deployFilePath+"/"+ticketId;
	            
				
				RepResultVO repResultVo = null;
				List repSelFileList = null;
				
				
				if(!repInfoMap.containsKey(repId)) {
					
					Map newMap = new HashMap<>();
					newMap.put("repId", repId);
					
					
					RepVO repVo = rep1000Service.selectRep1000Info(newMap);
					
					
					repResultVo = repModule.repAuthCheck(repVo);
					repResultVo.setEmpId(empId);
					repResultVo.setTicketId(ticketId);
					
					repInfoMap.put(repId, repResultVo);
					
					
					newMap.put("ciId", ciId);
					newMap.put("ticketId", ticketId);
					
					
					repSelFileList = rep1100DAO.selectRep1102TktDplSelFileChgList(newMap);
					repSelDplFileMap.put(repId, repSelFileList);
					
					
					if(i == 0) {
						
						folderSubDelete(exportTargetPath);
					}
				}
				
				repResultVo = repInfoMap.get(repId);
				repSelFileList = repSelDplFileMap.get(repId);
				
				
				if(!repResultVo.isReturnValue()) {
					errorMsg.add("- Deploy 소스저장소 연결 실패 [repNm="+repResultVo.getRepVo().getRepNm()+"]");
					continue;
				}
				
				
				SVNRepository repository = repResultVo.getDplRepo();
				
				
				ISVNOptions options = SVNWCUtil.createDefaultOptions(true);
	            SVNClientManager clientManager = SVNClientManager.newInstance(options, repository.getAuthenticationManager());
	            
	            
	            SVNUpdateClient updateClient = clientManager.getUpdateClient();
	            
	            
	            String rootUrl = repository.getRepositoryRoot(true).toString();
	            
	            
	            Map newMap = new HashMap<>();
	            newMap.put("ticketId", ticketId);
	            newMap.put("ciId", ciId);
	            newMap.put("repId", repId);
	            newMap.put("repChgId", repChgId);
	            newMap.put("repRv", repRv);
	            newMap.put("commitEmpId", empId);
	            newMap.put("repChgSelCd", "01"); 
	            int checkUpdate = rep1100DAO.updateRep1102TktDplFileSelInfo(newMap);
	            
	            
	            if(checkUpdate != 1) {
	            	errorMsg.add("- 선택 파일 데이터베이스 값 업데이트 중 오류 발생 [path="+exportTargetPath+"]");
					continue;
	            }
	            
	            
	            if(repChgFilePath.indexOf("/") != 0) {
	            	exportTargetPath += "/";
	            }
	            
	            try {
	            	
	            	updateClient.doExport(SVNURL.parseURIEncoded(rootUrl+repChgFilePath), new File(exportTargetPath+repChgFilePath), SVNRevision.parse(repRv), SVNRevision.parse(repRv), null, true, SVNDepth.EMPTY);
	            }catch(SVNException svnE) {
	            	
	            	int svnErrorCode = svnE.getErrorMessage().getErrorCode().getCode();
	            	String svnErrorMsg = svnE.getErrorMessage().getMessage();
	            	
	            	errorMsg.add("- 저장소 파일 Export 오류 발생 [error_code="+svnErrorCode+", error_msg="+svnErrorMsg+", path="+exportTargetPath+"]");
					continue;
	            }
	            
	            
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
}
