package kr.opensoftlab.lunaops.whk.whk1000.whk1000.service;

import java.util.List;
import java.util.Map;




public interface Whk1000Service {

	
	@SuppressWarnings({"rawtypes" })
	Map selectWhk1000Info(Map paramMap) throws Exception;
	
	@SuppressWarnings({"rawtypes" })
	Map selectWhk1001Info(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({"rawtypes"})
	List<Map> selectWhk1000List(Map paramMap) throws Exception;

	
	@SuppressWarnings({"rawtypes"})
	int selectWhk1000ListCnt(Map paramMap) throws Exception;
	
	
	@SuppressWarnings({"rawtypes"})
	List<Map> selectWhk1001List(Map paramMap) throws Exception;
	
	
	String insertWhk1000Info(Map<String, String> paramMap) throws Exception;
	
	
	void updateWhk1000Info(Map<String, String> paramMap) throws Exception;
	
	
	void deleteWhk1000Info(Map<String, String> paramMap) throws Exception;
	
	
	String insertWhk1001Info(Map<String, String> paramMap) throws Exception;
	
	
	void deleteWhk1001Info(Map<String, String> paramMap) throws Exception;
	
	
	void deleteWhk1000List(Map<String, Object> paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map insertWhk1000SendData(String paramWhkTypeCd, String paramWhkChgTypeCd, String paramKey1, String paramKey2, String empId) throws Exception;
}
