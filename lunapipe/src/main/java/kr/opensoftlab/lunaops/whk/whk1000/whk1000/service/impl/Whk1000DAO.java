package kr.opensoftlab.lunaops.whk.whk1000.whk1000.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;



@Repository("whk1000DAO")
public class Whk1000DAO extends ComOslitsAbstractDAO {
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectWhk1000Info(Map paramMap) throws Exception{
		return (Map) select("whk1000DAO.selectWhk1000Info", paramMap);
	}
	
	@SuppressWarnings({"rawtypes" })
	public Map selectWhk1001Info(Map paramMap) throws Exception{
		return (Map) select("whk1000DAO.selectWhk1001Info", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public List<Map> selectWhk1000List(Map paramMap) throws Exception{
		return (List) list("whk1000DAO.selectWhk1000List", paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public List<Map> selectWhk1001List(Map paramMap) throws Exception{
		return (List) list("whk1000DAO.selectWhk1001List", paramMap);
	}
	
	
	public String insertWhk1000Info(Map<String, String> paramMap) throws Exception{
		return (String) insert("whk1000DAO.insertWhk1000Info", paramMap);
	}
	
	
	public void updateWhk1000Info(Map<String, String> paramMap) throws Exception{
		update("whk1000DAO.updateWhk1000Info", paramMap);
	}	
	
	
	public void deleteWhk1000Info(Map<String, String> paramMap) throws Exception{
		delete("whk1000DAO.deleteWhk1000Info", paramMap);
	}	
	
	
	public String insertWhk1001Info(Map<String, String> paramMap) throws Exception{
		return (String) insert("whk1000DAO.insertWhk1001Info", paramMap);
	}
	
	
	public void deleteWhk1001Info(Map<String, String> paramMap) throws Exception{
		delete("whk1000DAO.deleteWhk1001Info", paramMap);
	}

}
