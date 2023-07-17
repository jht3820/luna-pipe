package kr.opensoftlab.lunaops.com.api.service;

import java.util.Map;



public interface ApiService {
	
	Object checkParamDataKey(String paramData) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	String insertCIRepJenJob(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectCIRepJenJob(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map<String, String> insertCITicketJobList(Map paramMap) throws Exception;
}
