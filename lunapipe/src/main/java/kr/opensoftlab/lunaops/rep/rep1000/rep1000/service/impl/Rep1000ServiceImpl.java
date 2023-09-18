package kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.com.cmm.service.EgovProperties;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.Rep1000Service;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.vo.Rep1000VO;
import kr.opensoftlab.lunaops.whk.whk1000.whk1000.service.Whk1000Service;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;
import kr.opensoftlab.sdf.util.CommonScrty;


@Service("rep1000Service")
public class Rep1000ServiceImpl extends EgovAbstractServiceImpl implements Rep1000Service{
	
	
	@Resource(name="rep1000DAO")
    private Rep1000DAO rep1000DAO;

	@Resource(name = "whk1000Service")
	private Whk1000Service whk1000Service;
	
	
	@Override
	public List<Rep1000VO> selectRep1000RepositoryList(Rep1000VO rep1000VO) throws Exception {
		return rep1000DAO.selectRep1000RepositoryList(rep1000VO);
	}

	
	@Override
	public int selectRep1000RepositoryListCnt(Rep1000VO rep1000VO) throws Exception {
		return rep1000DAO.selectRep1000RepositoryListCnt(rep1000VO);
	}

	
	@Override
	public RepVO selectRep1000Info(Map<String, String> paramMap) throws Exception{
		return rep1000DAO.selectRep1000Info(paramMap);
	}
	
	
	@Override
	public Object saveRep1000Info(Map<String, String> paramMap) throws Exception{
		String insNewRepId ="";
		int result = 0;
		
		
		String empId = (String)paramMap.get("empId");
		
		
		String popupGb = (String)paramMap.get("popupGb");
		
		
		String repTypeCd = (String)paramMap.get("repTypeCd");
		
		
		String salt = EgovProperties.getProperty("Globals.lunaops.salt");
		
		
		String newEnPw = "";
		
		
		String nowPw = "";
		
		
		String modifyPw = "";
		
		
		String pwKey = "";
		
		
		
		if(repTypeCd != null && "01".equals(repTypeCd)) {
			
			String gitUsrAuthTypeCd = (String) paramMap.get("ccgitUsrAuthTypeCd");
			
			
			if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
				
				nowPw = (String)paramMap.get("nowGitPw");
				
				
				modifyPw = (String)paramMap.get("gitUsrPw");
				
				
				paramMap.put("gitUsrTk", null);
			}
		}
		
		else if(repTypeCd != null && "02".equals(repTypeCd)) {
			
			
			nowPw = (String)paramMap.get("nowSvnPw");
			
			
			modifyPw = (String)paramMap.get("svnUsrPw");
		}
		
		else if(repTypeCd != null && "03".equals(repTypeCd)) {
			
			String gitUsrAuthTypeCd = (String) paramMap.get("ccgitUsrAuthTypeCd");
			
			
			if(gitUsrAuthTypeCd != null && "02".equals(gitUsrAuthTypeCd)) {
				
				nowPw = (String)paramMap.get("nowGitPw");
				
				
				modifyPw = (String)paramMap.get("gitUsrPw");
				
				
				paramMap.put("gitUsrTk", null);
			}
		}
		
		
		if("insert".equals(popupGb)){			
			insNewRepId = rep1000DAO.insertRep1000Info( paramMap);

			
			whk1000Service.insertWhk1000SendData("01", "01", insNewRepId, null, empId);
			
			return insNewRepId;
			
		}else if("update".equals(popupGb)){
			
			if(modifyPw != null && !"".equals(modifyPw)) {
				
				if(!nowPw.equals(modifyPw)){
					
					newEnPw = CommonScrty.encryptedAria(modifyPw, salt);
				}else{
					newEnPw = nowPw;
				}
				
				
				paramMap.put(pwKey, newEnPw);
			}
			
			result = rep1000DAO.updateRep1000Info(paramMap);
			if(result > 0) {
				String repId = (String) paramMap.get("repId");
				
				
				whk1000Service.insertWhk1000SendData("01", "02", repId, null, empId);
			}
			return result;
		}
		return null;
	}

	
	@Override
	public int selectRep1000UseCountInfo(Map<String, String> paramMap) throws Exception{
		return rep1000DAO.selectRep1000UseCountInfo(paramMap);
	}

	
	@Override
	public void deleteRep1000Info(Map<String, String> paramMap) throws Exception{
		
		rep1000DAO.deleteRep1000Info(paramMap);
		
		
		rep1000DAO.deleteRep1001RepInfo(paramMap);
		
		String repId = (String) paramMap.get("repId");
		String empId = (String) paramMap.get("empId");
		
		
		whk1000Service.insertWhk1000SendData("01", "02", repId, null, empId);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public int deleteRep1000List(Map<String, Object> paramMap) throws Exception{
		List<Map> paramRepIds = (List<Map>) paramMap.get("list");
		
		
		int delCount = 0;
		
		
		if(paramRepIds != null) {
			for(Map paramRepMap : paramRepIds) {
				String repId = (String) paramRepMap.get("repId");
				String empId = (String) paramRepMap.get("empId");
				
				Map newMap = new HashMap<>();
				newMap.put("repId", repId);
				
				rep1000DAO.deleteRep1000Info(newMap);
				
				
				rep1000DAO.deleteRep1001RepInfo(newMap);
				delCount++;
				
				
				whk1000Service.insertWhk1000SendData("01", "03", repId, null, empId);
			}
		}
		return delCount;
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List<Map> selectRep1001CIRepList(Map paramMap) throws Exception{
		return rep1000DAO.selectRep1001CIRepList(paramMap);
	}
	
	
	public void deleteRep1001CIRepInfo(Map<String, String> paramMap) throws Exception{
		rep1000DAO.deleteRep1001CIRepInfo(paramMap);
	}	
	
	
	public String insertRep1001CIRepInfo(Map<String, String> paramMap) throws Exception{
		return rep1000DAO.insertRep1001CIRepInfo(paramMap);
	}
}
