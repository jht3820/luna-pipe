package kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
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
import org.tmatesoft.svn.core.SVNException;
import org.tmatesoft.svn.core.SVNNodeKind;
import org.tmatesoft.svn.core.io.ISVNEditor;
import org.tmatesoft.svn.core.io.SVNRepository;
import org.tmatesoft.svn.core.io.diff.SVNDeltaGenerator;

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
	public List<Map> selectRep1100RvChgFileList(Map paramMap) throws Exception {
		return rep1100DAO.selectRep1100RvChgFileList(paramMap);
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
						if(trunkLogList == null || trunkLogList.size() == 0) {
							errorMsg.add("- Trunk에 대상 파일이 존재하지 않습니다. [path="+trunkPath+"]");
							continue;
						}
						
						RepDataVO trunkLogInfo = trunkLogList.get(trunkLogList.size()-1);
						if(trunkLogInfo.getRevision() > repRv) {
							errorMsg.add("- Trunk에 있는 파일 리비전("+trunkLogInfo.getRevision()+")이 현재 대상 파일("+repRv+")보다 최신입니다. [path="+trunkPath+"]");
							continue;
						}
						
						
						ByteArrayOutputStream baos = new ByteArrayOutputStream( );
			            repository.getFile(repChgFilePath, repRv, null, baos);
			            String brancheContent = baos.toString("UTF-8");
			    		baos.close();
			    		
						
			    		baos = new ByteArrayOutputStream( );
			            repository.getFile(trunkPath, -1, null, baos);
			            String trunkContent = baos.toString("UTF-8");
			    		baos.close();
			    		
			    		
			    		jsonInfo.put("brancheContent", brancheContent);
			    		
			    		
			    		jsonInfo.put("trunkContent", trunkContent);
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
				
				
				String commitComment = "[insert_data_no-flag]branche 변경 파일 "+fileList.size()+"개 trunk에 commit";
				
				
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
						
						
						System.out.println("dir생성: "+makePath);
						editor.addDir(makePath, null, -1);
					}
				}

				
				for(JSONObject dirInfo: dirList) {
					
					String repChgFilePath = (String) dirInfo.get("repChgFilePath");
					
					String repChgFileKind = (String) dirInfo.get("repChgFileKind");
					
					String repChgTypeCd = (String) dirInfo.get("repChgTypeCd");
					
					String repChgFileNm = (String) dirInfo.get("repChgFileNm");
					
					String trunkPath = repChgFilePath.replace(branchePath, "/trunk");
					
					Long repRv = Long.parseLong(String.valueOf(dirInfo.get("repRv")));
					
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
					dataMap.put("ticketId", ticketId);
					dataMap.put("repChgTypeCd", repChgTypeCd);
					dataMap.put("repChgFilePath", trunkPath);
					dataMap.put("repChgFileKind", repChgFileKind);
					dataMap.put("repTargetFilePath", repChgFilePath);
					dataMap.put("repChgFileNm", repChgFileNm);
					dataMap.put("repTargetRv", repRv);
					
					
					rep1101InsertList.add(dataMap);
					
					 
					
					if("01".equals(repChgTypeCd)) {
						
						
			            String brancheContent = (String) fileInfo.get("brancheContent");
			            
			            
			    		
			    		
		    			String checksum = null;
		    			try {
		    				System.out.println("파일 생성: "+trunkPath);
		    				
		    				
			    			editor.addFile(trunkPath, null, -1);
			    			
			    			editor.applyTextDelta( trunkPath , null );
			    			SVNDeltaGenerator deltaGenerator = new SVNDeltaGenerator( );
			    			checksum = deltaGenerator.sendDelta( trunkPath , new ByteArrayInputStream(brancheContent.getBytes()) , editor , true );
			    			
			    			
            				editor.closeFile(trunkPath, checksum);
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
			    		
			    		
			            String trunkContent = (String) fileInfo.get("trunkContent");
						
			    		
			    		editor.openDir(trunkPath, -1);
			    		
			    		editor.openFile(trunkPath, -1);
			    		
			    		
			    		editor.applyTextDelta(trunkPath , null );
			            SVNDeltaGenerator deltaGenerator = new SVNDeltaGenerator( );
			            String checksum = deltaGenerator.sendDelta( trunkPath , new ByteArrayInputStream( trunkContent.getBytes() ) , 0 , new ByteArrayInputStream( brancheContent.getBytes() ) , editor , true );
			            
			            
			            editor.closeFile(trunkPath, checksum);
			            
			            
			            editor.closeDir();
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
				editor.abortEdit();

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
}
