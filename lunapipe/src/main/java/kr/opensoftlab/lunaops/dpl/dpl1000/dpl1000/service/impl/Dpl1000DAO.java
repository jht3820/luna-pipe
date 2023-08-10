package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1000VO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo.Dpl1100VO;
import kr.opensoftlab.sdf.excel.ExcelDataListResultHandler;
import kr.opensoftlab.sdf.jenkins.vo.BuildVO;
import kr.opensoftlab.sdf.jenkins.vo.ChangePathsVO;
import kr.opensoftlab.sdf.jenkins.vo.ChangeVO;



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
	public List selectDpl1100DeployJobList(Map inputMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1100DeployJobList", inputMap);
	}
	
	
	@SuppressWarnings({ "rawtypes" })
	public List selectDpl1100dplJobGridList(Dpl1100VO dpl1300VO)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1100dplJobGridList", dpl1300VO);
	} 
	
	
	public int selectDpl1100dplJobGridListCnt(Dpl1100VO dpl1300VO) throws Exception {
		return (Integer) select("dpl1000DAO.selectDpl1100dplJobGridListCnt", dpl1300VO);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertDpl1000DeployVerInfo(Map paramMap) throws Exception{
		return (String) insert("dpl1000DAO.insertDpl1000DeployVerInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void insertDpl1100DeployJobInfo(Map paramMap) throws Exception{
		insert("dpl1000DAO.insertDpl1100DeployJobInfo", paramMap);
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
	public Map selectDpl1200DplJobBuildInfo(Map map)  throws Exception{
		return (Map) select("dpl1000DAO.selectDpl1200DplJobBuildInfo", map);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectDpl1200DplSelBuildInfoAjax(Map map)  throws Exception{
		return (Map) select("dpl1000DAO.selectDpl1200DplSelBuildInfoAjax", map);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1100DplJobList(Map paramMap)  throws Exception{
		 delete("dpl1000DAO.deleteDpl1100DplJobList", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1000DplHistoryList(Map inputMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1000DplHistoryList", inputMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1200DplBldNumList(Map inputMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1200DplBldNumList", inputMap);
	}
	
		
	@SuppressWarnings("rawtypes")
	public List selectDpl1000AllDplList(Map paramMap) throws Exception{
		return (List) list("dpl1000DAO.selectDpl1000AllDplList", paramMap);
	}
	
	
	public void insertDpl1201DeployBuildChgLogInfo(ChangeVO changeSetInfo) throws Exception{
		insert("dpl1000DAO.insertDpl1201DeployBuildChgLogInfo", changeSetInfo);
	}
	
	public void insertDpl1201DeployBuildChgPathLogInfo(ChangePathsVO ChangePathInfo) throws Exception{
		insert("dpl1000DAO.insertDpl1201DeployBuildChgPathLogInfo", ChangePathInfo);
	}

	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1201SvnChangeLogsList(Map paramMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1201SvnChangeLogsList", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1202SvnChangePathList(Map paramMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1202SvnChangePathList", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1200DplNoneResultList(Map paramMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1200DplNoneResultList", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List selectDpl1101JenParameterList(Map paramMap)  throws Exception{
		return (List) list("dpl1000DAO.selectDpl1101JenParameterList", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertDpl1101ParameterInfo(Map paramMap) throws Exception{
		return (String) insert("dpl1000DAO.insertDpl1101ParameterInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1101ParameterInfo(Map paramMap) throws Exception{
		delete("dpl1000DAO.deleteDpl1101ParameterInfo", paramMap);
    }

	
	public String insertDpl1102DplBuildInfo(BuildVO buildVo) throws Exception{
		return (String) insert("dpl1000DAO.insertDpl1102DplBuildInfo", buildVo);
	}

	
	@SuppressWarnings("rawtypes")
	public void deleteDpl1102DplActionInfo(Map paramMap) throws Exception{
		delete("dpl1000DAO.deleteDpl1102DplActionInfo", paramMap);
    }
}
