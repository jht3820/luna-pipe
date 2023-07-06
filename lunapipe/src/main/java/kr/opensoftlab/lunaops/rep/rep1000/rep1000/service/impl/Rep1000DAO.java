package kr.opensoftlab.lunaops.rep.rep1000.rep1000.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;
import kr.opensoftlab.lunaops.rep.rep1000.rep1000.vo.Rep1000VO;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;



@Repository("rep1000DAO")
public class Rep1000DAO extends ComOslitsAbstractDAO {
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Rep1000VO> selectRep1000RepositoryList(Rep1000VO rep1000vo) throws Exception{
		return (List) list("rep1000DAO.selectRep1000RepositoryList", rep1000vo);
	}

	
	public int selectRep1000RepositoryListCnt(Rep1000VO rep1000vo) throws Exception{
		return (Integer) select("rep1000DAO.selectRep1000RepositoryListCnt", rep1000vo);
	}
	
	
	public RepVO selectRep1000Info(Map<String, String> paramMap) throws Exception{
		return (RepVO) select("rep1000DAO.selectRep1000Info", paramMap);
	}
	
	
	public String insertRep1000Info(Map<String, String> paramMap) throws Exception{
		return (String) insert("rep1000DAO.insertRep1000Info", paramMap);
	}
	
	
	public int updateRep1000Info(Map<String, String> paramMap) throws Exception{
		return update("rep1000DAO.updateRep1000Info", paramMap);
	}

	
	public int selectRep1000UseCountInfo(Map<String, String> paramMap) throws Exception{
		return (Integer) select("rep1000DAO.selectRep1000UseCountInfo", paramMap);
	}

	
	public void deleteRep1000Info(Map<String, String> paramMap) throws Exception{
		delete("rep1000DAO.deleteRep1000Info", paramMap);
	}	

	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public List<Map> selectRep1001CIRepList(Map paramMap) throws Exception{
		return (List) list("rep1000DAO.selectRep1001CIRepList", paramMap);
	}
	
	
	public void deleteRep1001CIRepInfo(Map<String, String> paramMap) throws Exception{
		delete("rep1000DAO.deleteRep1001CIRepInfo", paramMap);
	}	
	
	
	public String insertRep1001CIRepInfo(Map<String, String> paramMap) throws Exception{
		return (String) insert("rep1000DAO.insertRep1001CIRepInfo", paramMap);
	}
}
