package kr.opensoftlab.lunaops.rep.rep1000.rep1000.service;

import java.util.List;
import java.util.Map;

import kr.opensoftlab.lunaops.rep.rep1000.rep1000.vo.Rep1000VO;
import kr.opensoftlab.sdf.rep.com.vo.RepVO;




public interface Rep1000Service {

	
	
	List<Rep1000VO> selectRep1000RepositoryList(Rep1000VO rep1000vo) throws Exception;

	
	int selectRep1000RepositoryListCnt(Rep1000VO rep1000vo) throws Exception;

	
	RepVO selectRep1000Info(Map<String, String> paramMap) throws Exception;

	
	Object saveRep1000Info(Map<String, String> paramMap) throws Exception;

	
	int selectRep1000UseCountInfo(Map<String, String> paramMap) throws Exception;

	
	void deleteRep1000Info(Map<String, String> paramMap) throws Exception;
	
	
	int deleteRep1000List(Map<String, Object> paramMap) throws Exception;
	
	
	@SuppressWarnings({"rawtypes" })
	List<Map> selectRep1001CIRepList(Map paramMap) throws Exception;
	
	
	void deleteRep1001CIRepInfo(Map<String, String> paramMap) throws Exception;
	
	
	String insertRep1001CIRepInfo(Map<String, String> paramMap) throws Exception;
}
