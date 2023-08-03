package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;

import javax.annotation.Resource;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.Dpl1000Service;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1000VO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1100VO;
import kr.opensoftlab.lunaops.jen.jen1000.jen1000.service.Jen1000Service;
import kr.opensoftlab.sdf.excel.ExcelDataListResultHandler;
import kr.opensoftlab.sdf.jenkins.vo.AutoBuildVO;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;
import kr.opensoftlab.sdf.jenkins.vo.ChangePathsVO;
import kr.opensoftlab.sdf.jenkins.vo.ChangeVO;
import kr.opensoftlab.sdf.jenkins.vo.GlobalDplListVO;


@Service("dpl1000Service")
public class Dpl1000ServiceImpl  extends EgovAbstractServiceImpl implements Dpl1000Service{
    
	
    @Resource(name="dpl1000DAO")
    private Dpl1000DAO dpl1000DAO;
    
	@Resource(name = "jen1000Service")
	private Jen1000Service jen1000Service;
	
    
	@SuppressWarnings("rawtypes")
	public List selectDpl1000DeployNmList(Map inputMap) throws Exception {
		return dpl1000DAO.selectDpl1000DeployNmList(inputMap);
    }
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1000DeployVerNormalList(Map inputMap)  throws Exception{
		return dpl1000DAO.selectDpl1000DeployVerNormalList(inputMap);
	} 
	
    
	public List<Dpl1000VO> selectDpl1000DeployVerInfoList(Dpl1000VO dpl1000VO) throws Exception {
		return dpl1000DAO.selectDpl1000DeployVerInfoList(dpl1000VO);
    }
	
	
	@SuppressWarnings("rawtypes")
	public Map selectDpl1000DeployVerInfo(Map map) throws Exception {
		return dpl1000DAO.selectDpl1000DeployVerInfo(map);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1100DeployJobList(Map inputMap)  throws Exception{
		return dpl1000DAO.selectDpl1100DeployJobList(inputMap);
	}
	
	
	@SuppressWarnings("unchecked")
	public List<Dpl1100VO> selectDpl1100dplJobGridList(Dpl1100VO dpl1300VO)  throws Exception{
		return dpl1000DAO.selectDpl1100dplJobGridList(dpl1300VO);
	} 
	
	
	public int selectDpl1100dplJobGridListCnt(Dpl1100VO dpl1300VO) throws Exception {
		return dpl1000DAO.selectDpl1100dplJobGridListCnt(dpl1300VO);
	}
	
	
	@SuppressWarnings({ "rawtypes" })
	public String insertDpl1000DeployVerInfo(Map paramMap) throws Exception{
		return dpl1000DAO.insertDpl1000DeployVerInfo(paramMap);
    }
	
	
	@SuppressWarnings({ "rawtypes" })
	public void  insertDpl1100DeployJobInfo(Map paramMap) throws Exception{
		dpl1000DAO.insertDpl1100DeployJobInfo(paramMap);
	}

	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void updateDpl1000DeployVerInfo(Map paramMap) throws Exception{
		
		Map rtnMap = new HashMap();
		for( Object key : paramMap.keySet() ) {
			String jsonVal = "";
			try{
				jsonVal = (String) paramMap.get(key);
			}catch(ClassCastException cce){	
				continue;
			}
			
			JSONObject jsonObj = null;
			
			
			try{
				jsonObj = new JSONObject(jsonVal);
				rtnMap.put(key, jsonObj.getString("optVal"));
			}catch(JSONException jsonE){
				rtnMap.put(key, jsonVal);
			}catch(NullPointerException npe){
				rtnMap.put(key, jsonVal);
			}
		}
		paramMap = rtnMap;
		
		
		Map beforeDplInfo = dpl1000DAO.selectDpl1000DeployVerInfo(paramMap);
		
		
		dpl1000DAO.deleteDpl1100DplJobList(paramMap);
		
		
		
		String prjId = (String)paramMap.get("prjId");
		
    	
    	dpl1000DAO.updateDpl1000DeployVerInfo(paramMap);
    	
		
		String dplId = (String)beforeDplInfo.get("dplId");
		paramMap.put("dplId", dplId);
		
    	
    	JSONArray selJobList = new JSONArray(paramMap.get("selJobList").toString());
    	
    	
    	for(int i=0; i<selJobList.length(); i++){
    		JSONObject jsonObj = selJobList.getJSONObject(i);
    		
    		
    		HashMap<String, Object> jobInfo = new ObjectMapper().readValue(jsonObj.toString(), HashMap.class) ;
    		jobInfo.put("prjId", prjId);
    		jobInfo.put("dplId", dplId);
    		
    		dpl1000DAO.insertDpl1100DeployJobInfo(jobInfo);

    		
    		List jobParamList = (ArrayList<HashMap>) jobInfo.get("paramList");
    		
    		
    		dpl1000DAO.deleteDpl1101ParameterInfo(jobInfo);
    		if(null != jobParamList && jobParamList.size() != 0) {
	    		for(int jobIdx=0; jobIdx<jobParamList.size(); jobIdx++){
	    			HashMap paramInfo = (HashMap) jobParamList.get(jobIdx);
	    			paramInfo.put("prjId", prjId);
	    			paramInfo.put("dplId", dplId);
	    			paramInfo.put("jenId", jobInfo.get("jenId"));
	    			paramInfo.put("jobId", jobInfo.get("jobId"));
	    	    	paramMap.put("regUsrId", paramMap.get("regUsrId"));
	    	    	paramMap.put("regUsrIp", paramMap.get("regUsrIp"));
	    			
	    			dpl1000DAO.insertDpl1101ParameterInfo(paramInfo);
	    		}
    		}
    	}
    	
    	
    	paramMap.put("signRegUsrId", paramMap.get("regUsrId"));
    	
    	
    	paramMap.put("signRegUsrId", paramMap.get("regUsrId"));
    	paramMap.put("signStsCd", "05");
    	paramMap.put("signTxt", paramMap.get("dplSignTxt"));
    	
    	
    	
	}
	
	
	@SuppressWarnings({ "rawtypes"})
	public void updateDpl1000DplStsCdInfo(Map paramMap) throws Exception{
		
		dpl1000DAO.updateDpl1000DplStsCdInfo(paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void deleteDpl1000DeployVerInfo(Map paramMap) throws Exception{
		
		List<Map<String,String>> list = (List<Map<String,String>>) paramMap.get("list");
		
		
		String prjId = (String)paramMap.get("prjId");
		
		int listSize = list.size();
		List<AutoBuildVO> autoList = GlobalDplListVO.getDplList();
		
		for (int i = 0; i < listSize; i++) {
			Map<String,String> dplMap = list.get(i);
			dplMap.put("prjId", prjId);
			
			
			String dplId = dplMap.get("dplId");
			
			
			dpl1000DAO.deleteDpl1000DeployVerInfo(dplMap);
			
			
			for(int j=0;j<autoList.size();j++){
				AutoBuildVO autoInfo = autoList.get(j);
				
				
				String targetPrjId = autoInfo.getPrjId();
				String targetDplId = autoInfo.getDplAutoAfterCd();

				
				if(prjId.equals(targetPrjId) && dplId.equals(targetDplId)){
					
					Timer timer = autoInfo.getAutoDplTimer();
					timer.cancel();
					
					
					autoList.remove(j);
					break;
				}
			}
		}
    }
	
	
	@Override
	public int selectDpl1000ListCnt(Dpl1000VO dpl1000VO) throws Exception{
		return dpl1000DAO.selectDpl1000ListCnt(dpl1000VO);
	}
	

	
	@Override
	public void selectDpl1000ExcelList(Dpl1000VO dpl1000vo, ExcelDataListResultHandler resultHandler) throws Exception {
		dpl1000DAO.selectDpl1000ExcelList(dpl1000vo, resultHandler);
	}

	
	@Override
	public List<Dpl1000VO> selectDpl1000BuildInfoList(Dpl1000VO dpl1000VO) throws Exception{
		return dpl1000DAO.selectDpl1000BuildInfoList(dpl1000VO);
	}
	
	
	@Override
	public int selectDpl1000BuildInfoListCnt(Dpl1000VO dpl1000VO) throws Exception{
		return dpl1000DAO.selectDpl1000BuildInfoListCnt(dpl1000VO);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectDpl1200DplJobBuildInfo(Map map)  throws Exception{
		return dpl1000DAO.selectDpl1200DplJobBuildInfo(map);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectDpl1200DplSelBuildInfoAjax(Map map)  throws Exception{
		return dpl1000DAO.selectDpl1200DplSelBuildInfoAjax(map);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1100DplJobList(Map paramMap)  throws Exception{
		dpl1000DAO.deleteDpl1100DplJobList(paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public Map selectDpl1100ToJen1000JobInfo(Map map)  throws Exception{
		return jen1000Service.selectJen1100JobInfo(map);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1000DplHistoryList(Map inputMap)  throws Exception{
		return dpl1000DAO.selectDpl1000DplHistoryList(inputMap);
	}
	
	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public void insertDpl1000DplSignRequestList(Map paramMap)  throws Exception{
		
    	paramMap.put("signRegUsrId", paramMap.get("regUsrId"));
    	
    	paramMap.put("signStsCd", "01");
    	paramMap.put("signTxt", paramMap.get("dplSignTxt"));
    	
    	
    	
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1200DplBldNumList(Map inputMap)  throws Exception{
		return dpl1000DAO.selectDpl1200DplBldNumList(inputMap);
	}
	
		
	@SuppressWarnings("rawtypes")
	public List selectDpl1000AllDplList(Map paramMap) throws Exception{
		return dpl1000DAO.selectDpl1000AllDplList(paramMap);
	}
	

	
	public void insertDpl1201DeployBuildChgLogInfo(ChangeVO changeSetInfo) throws Exception{
		dpl1000DAO.insertDpl1201DeployBuildChgLogInfo(changeSetInfo);
	}
	
	public void insertDpl1201DeployBuildChgPathLogInfo(ChangePathsVO ChangePathInfo) throws Exception{
		dpl1000DAO.insertDpl1201DeployBuildChgPathLogInfo(ChangePathInfo);
	}
	

	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1201SvnChangeLogsList(Map paramMap)  throws Exception{
		return dpl1000DAO.selectDpl1201SvnChangeLogsList(paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1202SvnChangePathList(Map paramMap)  throws Exception{
		return dpl1000DAO.selectDpl1202SvnChangePathList(paramMap);
	}

	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1200DplNoneResultList(Map paramMap)  throws Exception{
		return dpl1000DAO.selectDpl1200DplNoneResultList(paramMap);
	}
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1101JenParameterList(Map paramMap)  throws Exception{
		return dpl1000DAO.selectDpl1101JenParameterList(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertDpl1101ParameterInfo(Map paramMap) throws Exception{
		return dpl1000DAO.insertDpl1101ParameterInfo(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1101ParameterInfo(Map paramMap) throws Exception{
		dpl1000DAO.deleteDpl1101ParameterInfo(paramMap);
    }

	
	public String insertDpl1102DplBuildInfo(BuildVO buildVo) throws Exception{
		return dpl1000DAO.insertDpl1102DplBuildInfo(buildVo);
	}
}
