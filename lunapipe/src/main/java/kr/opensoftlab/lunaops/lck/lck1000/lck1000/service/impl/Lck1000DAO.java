package kr.opensoftlab.lunaops.lck.lck1000.lck1000.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;
import kr.opensoftlab.sdf.rep.com.vo.RepLockVO;



@Repository("lck1000DAO")
public class Lck1000DAO extends ComOslitsAbstractDAO {
	
	
	@SuppressWarnings({"rawtypes", "unchecked" })
	public List<Map> selectLck1000TktLockList(Map map)  throws Exception{
		return (List<Map>) list("lck1000DAO.selectLck1000TktLockList", map);
	} 
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectLck1000BaseInfo(Map map)  throws Exception{
		return (Map) select("lck1000DAO.selectLck1000BaseInfo", map);
	} 
	
	
	public String insertLck1000LockInfo(RepLockVO repLockVo) throws Exception{
		return (String) insert("lck1000DAO.insertLck1000LockInfo", repLockVo);
	}
	
	
	public void updateLck1000LockInfo(RepLockVO repLockVo) throws Exception{
		update("lck1000DAO.updateLck1000LockInfo", repLockVo);
	}
}
