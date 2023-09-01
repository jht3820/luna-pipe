package kr.opensoftlab.lunaops.whk.whk1000.whk1000.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.whk.whk1000.whk1000.service.Whk1000Service;


@Service("whk1000ServiceImpl")
public class Whk1000ServiceImpl extends EgovAbstractServiceImpl implements Whk1000Service{
	
	
	@Resource(name="whk1000DAO")
    private Whk1000DAO whk1000DAO;
	
	
	@SuppressWarnings({"rawtypes" })
	public Map selectWhk1000Info(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1000Info(paramMap);
	}
	
	@SuppressWarnings({"rawtypes" })
	public Map selectWhk1001Info(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1001Info(paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes" })
	public List<Map> selectWhk1000List(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1000List(paramMap);
	}
	
	
	@SuppressWarnings({"rawtypes"})
	public List<Map> selectWhk1001List(Map paramMap) throws Exception{
		return whk1000DAO.selectWhk1001List(paramMap);
	}
	
	
	public String insertWhk1000Info(Map<String, String> paramMap) throws Exception{
		return whk1000DAO.insertWhk1000Info(paramMap);
	}
	
	
	public void updateWhk1000Info(Map<String, String> paramMap) throws Exception{
		whk1000DAO.updateWhk1000Info(paramMap);
	}	
	
	
	public void deleteWhk1000Info(Map<String, String> paramMap) throws Exception{
		whk1000DAO.deleteWhk1000Info(paramMap);
	}	
	
	
	public String insertWhk1001Info(Map<String, String> paramMap) throws Exception{
		return whk1000DAO.insertWhk1001Info(paramMap);
	}
	
	
	public void deleteWhk1001Info(Map<String, String> paramMap) throws Exception{
		whk1000DAO.deleteWhk1001Info(paramMap);
	}
}
