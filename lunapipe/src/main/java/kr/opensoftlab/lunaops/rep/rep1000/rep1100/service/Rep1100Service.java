package kr.opensoftlab.lunaops.rep.rep1000.rep1100.service;

import java.util.List;
import java.util.Map;




public interface Rep1100Service {
	
	@SuppressWarnings("rawtypes")
	Map selectRep1100RvInfo(Map paramMap) throws Exception;

	
	@SuppressWarnings({ "rawtypes"})
	List<Map> selectRep1100RvList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({ "rawtypes" })
	List<Map> selectRep1100RvChgFileList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertRep1100RvInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	int updateRep1100RvInfo(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	String insertRep1101RvChgInfo(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	void deleteRep1101RvChgList(Map paramMap) throws Exception;

	
	@SuppressWarnings({ "rawtypes" })
	List<Map> selectRep1100TktRvFileChgList(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	int selectRep1100TktRvFileChgListCnt(Map paramMap) throws Exception;
}
