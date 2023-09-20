package kr.opensoftlab.lunaops.lck.lck1000.lck1000.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.lck.lck1000.lck1000.service.Lck1000Service;
import kr.opensoftlab.sdf.rep.com.vo.RepLockVO;


@Service("lck1000Service")
public class Lck1000ServiceImpl  extends EgovAbstractServiceImpl implements Lck1000Service{
    
	
    @Resource(name="lck1000DAO")
    private Lck1000DAO lck1000DAO;
	
	
	@SuppressWarnings({"rawtypes"})
	public List<Map> selectLck1000TktLockList(Map map)  throws Exception{
		return lck1000DAO.selectLck1000TktLockList(map);
	} 
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectLck1000BaseInfo(Map map)  throws Exception{
		return lck1000DAO.selectLck1000BaseInfo(map);
	} 
	
	
	public String insertLck1000LockInfo(RepLockVO repLockVo) throws Exception{
		return lck1000DAO.insertLck1000LockInfo(repLockVo);
	}
	
	
	public void updateLck1000LockInfo(RepLockVO repLockVo) throws Exception{
		lck1000DAO.updateLck1000LockInfo(repLockVo);
	}
}
