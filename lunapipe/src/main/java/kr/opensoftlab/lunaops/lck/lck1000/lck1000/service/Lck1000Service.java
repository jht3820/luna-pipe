package kr.opensoftlab.lunaops.lck.lck1000.lck1000.service;

import java.util.List;
import java.util.Map;

import kr.opensoftlab.sdf.rep.com.vo.RepLockVO;



public interface Lck1000Service {
	
	
	@SuppressWarnings({"rawtypes"})
	List<Map> selectLck1000TktLockList(Map map)  throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	Map selectLck1000BaseInfo(Map map)  throws Exception;
	
	
	String insertLck1000LockInfo(RepLockVO repLockVo) throws Exception;
	
	
	void updateLck1000LockInfo(RepLockVO repLockVo) throws Exception;
}
