package kr.opensoftlab.lunaops.rep.rep1000.rep1100.service;

import java.util.List;
import java.util.Map;




public interface Rep1100Service {
	
	@SuppressWarnings("rawtypes")
	Map selectRep1100RvInfo(Map paramMap) throws Exception;

	
	@SuppressWarnings({ "rawtypes"})
	List<Map> selectRep1100RvList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({ "rawtypes" })
	List<Map> selectRep1101RvChgFileList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({ "rawtypes"})
	List<Map> selectRep1102DplChgFileList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertRep1100RvInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	int updateRep1100RvInfo(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	String insertRep1101RvChgInfo(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertRep1102RvChgInfo(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	void deleteRep1101RvChgList(Map paramMap) throws Exception;

	
	@SuppressWarnings({ "rawtypes" })
	List<Map> selectRep1100TktRvFileChgList(Map paramMap) throws Exception;

	
	@SuppressWarnings("rawtypes")
	int selectRep1100TktRvFileChgListCnt(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map insertRep1100SelTktFileCommitAjax(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map insertRep1102TargetDataDeployCommitAjax(Map paramMap) throws Exception;

	
	@SuppressWarnings({ "rawtypes"})
	List<Map> selectRep1102TktDplFileChgList(Map paramMap) throws Exception;

	
	@SuppressWarnings({ "rawtypes"})
	List<Map> selectRep1102TktDplSelFileChgList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectRep1102TktFileRecentBldNumList(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map insertRep1103TktDplFileSelectAjax(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	int updateRep1102TktDplFileSelInfo(Map paramMap) throws Exception;
}
