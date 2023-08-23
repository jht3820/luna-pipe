package egovframework.com.cmm.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.servlet.view.json.MappingJackson2JsonView;


public interface CommonService {
	
	public String selectServerTime(Map<String,String> paramMap) throws Exception ;

	@SuppressWarnings("rawtypes")
	public List<Map> selectDynamicComboBoxAjax(Map<String, String> paramMap) throws Exception;
	
	public MappingJackson2JsonView getJsonView(String textPlain) throws Exception;
}
