package egovframework.com.cmm.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

/**
 * @Class Name : CommonService.java
 * @Description : 
 * @Modification Information
 *
 *    수정일       수정자         수정내용
 *    -------        -------     -------------------
 *
 * @author 공통 서비스 개발팀 이삼섭
 * @since 2018. 7. 24.
 * @version
 * @see
 *
 */
public interface CommonService {
	
	public String selectServerTime(Map<String,String> paramMap) throws Exception ;

	public List<Map> selectDynamicComboBoxAjax(Map<String, String> paramMap) throws Exception;
	
	public MappingJackson2JsonView getJsonView(String textPlain) throws Exception;
}
