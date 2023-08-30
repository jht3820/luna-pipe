package kr.opensoftlab.lunaops.usr.usr1000.usr1000.service.impl;


import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;


@Repository("usr1000DAO")
public class Usr1000DAO extends ComOslitsAbstractDAO {
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectUsr1000List(Map paramMap) throws Exception {
		return (List<Map>) list("usr1000DAO.selectUsr1000List", paramMap);
	}
	
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectDept1000TreeList(Map paramMap) throws Exception {
		return (List<Map>) list("usr1000DAO.selectDept1000TreeList", paramMap);
	}
	
}