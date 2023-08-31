package kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.rep.rep1000.rep1100.service.Rep1100Service;


@Service("rep1100Service")
public class Rep1100ServiceImpl extends EgovAbstractServiceImpl implements Rep1100Service{
	
	
	@Resource(name="rep1100DAO")
    private Rep1100DAO rep1100DAO;
	
	
	@SuppressWarnings("rawtypes")
	public Map selectRep1100RvInfo(Map paramMap) throws Exception {
		return rep1100DAO.selectRep1100RvInfo(paramMap);
	}

	
	@SuppressWarnings({ "rawtypes" })
	public List<Map> selectRep1100RvList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100RvList(paramMap);
	}
	
	@SuppressWarnings( "rawtypes")
	public List<Map> selectRep1100RvChgFileList(Map paramMap) throws Exception {
		return rep1100DAO.selectRep1100RvChgFileList(paramMap);
	}
	
	@SuppressWarnings("rawtypes")
	public String insertRep1100RvInfo(Map paramMap) throws Exception{
		return rep1100DAO.insertRep1100RvInfo(paramMap);
	}
	
	
	@SuppressWarnings("rawtypes")
	public int updateRep1100RvInfo(Map paramMap) throws Exception{
		return rep1100DAO.updateRep1100RvInfo(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public String insertRep1101RvChgInfo(Map paramMap) throws Exception{
		return rep1100DAO.insertRep1101RvChgInfo(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public void deleteRep1101RvChgList(Map paramMap) throws Exception{
		rep1100DAO.deleteRep1101RvChgList(paramMap);
	}

	
	@SuppressWarnings({ "rawtypes"})
	public List<Map> selectRep1100TktRvFileChgList(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktRvFileChgList(paramMap);
	}

	
	@SuppressWarnings("rawtypes")
	public int selectRep1100TktRvFileChgListCnt(Map paramMap) throws Exception{
		return rep1100DAO.selectRep1100TktRvFileChgListCnt(paramMap);
	}
}
