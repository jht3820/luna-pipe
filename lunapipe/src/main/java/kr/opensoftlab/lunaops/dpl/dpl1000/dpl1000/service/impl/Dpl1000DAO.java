package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.impl;

import java.util.List;
import java.util.Map;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1000VO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1300VO;
import kr.opensoftlab.sdf.excel.ExcelDataListResultHandler;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;
import kr.opensoftlab.sdf.jenkins.vo.ChangePathsVO;
import kr.opensoftlab.sdf.jenkins.vo.ChangeVO;

import org.springframework.stereotype.Repository;



@Repository("dpl1000DAO")
public class Dpl1000DAO extends ComOslitsAbstractDAO {
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1000DeployNmList(Map inputMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1000DeployNmList", inputMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1000DeployVerNormalList(Map inputMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1000DeployVerNormalList", inputMap);
	}
	
	
	@SuppressWarnings({"unchecked" })
	public List<Dpl1000VO> selectDpl1000DeployVerInfoList(Dpl1000VO dpl1000VO)  throws Exception{
		return (List<Dpl1000VO>) list("dpl1000DAO.selectDpl1000DeployVerInfoList", dpl1000VO);
	} 
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectDpl1000DeployVerInfo(Map map)  throws Exception{
		return (Map) select("dpl1000DAO.selectDpl1000DeployVerInfo", map);
	} 
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1300DeployJobList(Map inputMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1300DeployJobList", inputMap);
	}
	
	
	@SuppressWarnings({ "rawtypes" })
	public List selectDpl1300dplJobGridList(Dpl1300VO dpl1300VO)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1300dplJobGridList", dpl1300VO);
	} 
	
	
	public int selectDpl1300dplJobGridListCnt(Dpl1300VO dpl1300VO) throws Exception {
		return (Integer) select("dpl1000DAO.selectDpl1300dplJobGridListCnt", dpl1300VO);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertDpl1000DeployVerInfo(Map paramMap) throws Exception{
		return (String) insert("dpl1000DAO.insertDpl1000DeployVerInfo", paramMap);
    }
	
	
	@SuppressWarnings("rawtypes")
	public void insertDpl1300DeployJobInfo(Map paramMap) throws Exception{
		insert("dpl1000DAO.insertDpl1300DeployJobInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void updateDpl1000DeployVerInfo(Map paramMap) throws Exception{
		update("dpl1000DAO.updateDpl1000DeployVerInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void updateDpl1000DplStsCdInfo(Map paramMap) throws Exception{
		update("dpl1000DAO.updateDpl1000DplStsCdInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1000DeployVerInfo(Map paramMap) throws Exception{
		update("dpl1000DAO.deleteDpl1000DeployVerInfo", paramMap);
    }
	
	
	public int selectDpl1000ListCnt(Dpl1000VO dpl1000vo) throws Exception {
		return (Integer) select("dpl1000DAO.selectDpl1000ListCnt", dpl1000vo);
	}
	
	
	public void  selectDpl1000ExcelList(Dpl1000VO dpl1000vo, ExcelDataListResultHandler resultHandler) throws Exception {
		listExcelDownSql("dpl1000DAO.selectDpl1000ExcelList", dpl1000vo, resultHandler);
	}

	@SuppressWarnings({"unchecked" })
	public List<Dpl1000VO> selectDpl1000BuildInfoList(Dpl1000VO dpl1000VO)  throws Exception{
		return (List<Dpl1000VO>) list("dpl1000DAO.selectDpl1000BuildInfoList", dpl1000VO);
	} 

	public int selectDpl1000BuildInfoListCnt(Dpl1000VO dpl1000vo) throws Exception {
		return (Integer) select("dpl1000DAO.selectDpl1000BuildInfoListCnt", dpl1000vo);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectDpl1400DplJobBuildInfo(Map map)  throws Exception{
		return (Map) select("dpl1000DAO.selectDpl1400DplJobBuildInfo", map);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectDpl1400DplSelBuildInfoAjax(Map map)  throws Exception{
		return (Map) select("dpl1000DAO.selectDpl1400DplSelBuildInfoAjax", map);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1300DplJobList(Map paramMap)  throws Exception{
		 delete("dpl1000DAO.deleteDpl1300DplJobList", paramMap);
	}
	
	
	public int insertDpl1400DeployJobBuildLogInfo(BuildVO buildVo) throws Exception{
		return (int) insert("dpl1000DAO.insertDpl1400DeployJobBuildLogInfo", buildVo);
    }
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1000DplHistoryList(Map inputMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1000DplHistoryList", inputMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1400DplBldNumList(Map inputMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1400DplBldNumList", inputMap);
	}
	
		
	@SuppressWarnings("rawtypes")
	public String selectDpl1500NewChgId(Map paramMap) throws Exception{
		return (String)select("dpl1000DAO.selectDpl1500NewChgId", paramMap);
	}
	
		
	@SuppressWarnings("rawtypes")
	public String insertDpl1500ModifyHistoryInfo(Map paramMap) throws Exception{
		return (String)insert("dpl1000DAO.insertDpl1500ModifyHistoryInfo", paramMap);
	}
	
		
	@SuppressWarnings("rawtypes")
	public List selectDpl1500ModifyHistoryList(Map paramMap) throws Exception{
		return (List) list("dpl1000DAO.selectDpl1500ModifyHistoryList", paramMap);
	}
	
		
	@SuppressWarnings("rawtypes")
	public List selectDpl1000AllDplList(Map paramMap) throws Exception{
		return (List) list("dpl1000DAO.selectDpl1000AllDplList", paramMap);
	}
	
	
	public void insertDpl1600DeployBuildChgLogInfo(ChangeVO changeSetInfo) throws Exception{
		insert("dpl1000DAO.insertDpl1600DeployBuildChgLogInfo", changeSetInfo);
	}
	
	public void insertDpl1600DeployBuildChgPathLogInfo(ChangePathsVO ChangePathInfo) throws Exception{
		insert("dpl1000DAO.insertDpl1600DeployBuildChgPathLogInfo", ChangePathInfo);
	}

	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1600SvnChangeLogsList(Map paramMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1600SvnChangeLogsList", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1700SvnChangePathList(Map paramMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1700SvnChangePathList", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1400DplNoneResultList(Map paramMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1400DplNoneResultList", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1800JenParameterList(Map paramMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1800JenParameterList", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertDpl1800ParameterInfo(Map paramMap) throws Exception{
		return (String) insert("dpl1000DAO.insertDpl1800ParameterInfo", paramMap);
	}

	
	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1800ParameterInfo(Map paramMap) throws Exception{
		update("dpl1000DAO.deleteDpl1800ParameterInfo", paramMap);
    }
}
