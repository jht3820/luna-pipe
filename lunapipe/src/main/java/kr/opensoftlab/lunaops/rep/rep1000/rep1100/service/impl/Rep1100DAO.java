package kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;



@Repository("rep1100DAO")
public class Rep1100DAO extends ComOslitsAbstractDAO {
	
	
	@SuppressWarnings("rawtypes")
	public Map selectRep1100RvInfo(Map paramMap) throws Exception{
		return (Map) select("rep1100DAO.selectRep1100RvInfo", paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectRep1100RvList(Map paramMap) throws Exception{
		return (List<Map>) list("rep1100DAO.selectRep1100RvInfo", paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectRep1101RvChgFileList(Map paramMap) throws Exception{
		return (List<Map>) list("rep1100DAO.selectRep1101RvChgFileList", paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectRep1102DplChgFileList(Map paramMap) throws Exception{
		return (List<Map>) list("rep1100DAO.selectRep1102DplChgFileList", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public String insertRep1100RvInfo(Map paramMap) throws Exception{
		return (String) insert("rep1100DAO.insertRep1100RvInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public int updateRep1100RvInfo(Map paramMap) throws Exception{
		return update("rep1100DAO.updateRep1100RvInfo", paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public String insertRep1101RvChgInfo(Map paramMap) throws Exception{
		return (String) insert("rep1100DAO.insertRep1101RvChgInfo", paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public String insertRep1102RvChgInfo(Map paramMap) throws Exception{
		return (String) insert("rep1100DAO.insertRep1102RvChgInfo", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public void deleteRep1101RvChgList(Map paramMap) throws Exception{
		delete("rep1100DAO.deleteRep1101RvChgList", paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectRep1100TktRvFileChgList(Map paramMap) throws Exception{
		return (List) list("rep1100DAO.selectRep1100TktRvFileChgList", paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public int selectRep1100TktRvFileChgListCnt(Map paramMap) throws Exception{
		return (Integer) select("rep1100DAO.selectRep1100TktRvFileChgListCnt", paramMap);
	}

	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectRep1102TktDplFileChgList(Map paramMap) throws Exception{
		return (List) list("rep1100DAO.selectRep1102TktDplFileChgList", paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectRep1102TktDplSelFileChgList(Map paramMap) throws Exception{
		return (List) list("rep1100DAO.selectRep1102TktDplSelFileChgList", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public Map selectRep1102TktFileRecentBldNumList(Map paramMap) throws Exception{
		return (Map) select("rep1100DAO.selectRep1102TktFileRecentBldNumList", paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public int updateRep1102TktDplFileSelInfo(Map paramMap) throws Exception{
		return update("rep1100DAO.updateRep1102TktDplFileSelInfo", paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public int selectRep1100TktChgMaxRv(Map paramMap) throws Exception{
		return (Integer) select("rep1100DAO.selectRep1100TktChgMaxRv", paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public Map selectRep1101TktChgFileLastRvNum(Map paramMap) throws Exception{
		return (Map) select("rep1100DAO.selectRep1101TktChgFileLastRvNum", paramMap);
	}
}
