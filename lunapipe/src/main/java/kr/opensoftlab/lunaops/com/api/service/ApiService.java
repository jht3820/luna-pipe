package kr.opensoftlab.lunaops.com.api.service;

import java.util.Map;



public interface ApiService {

	
	@SuppressWarnings("rawtypes")
	String insertCIRepJenJob(Map paramMap) throws Exception;
	
	
	@SuppressWarnings("rawtypes")
	Map selectCIRepJenJob(Map paramMap) throws Exception;
}
