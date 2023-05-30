package egovframework.com.cmm.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import egovframework.com.cmm.CustomObjectMapper;
import egovframework.com.cmm.service.CommonService;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;

/**
 * @Class Name : CommonServiceImpl.java
 * @Description : 
 * @Modification Information
 *
 *    수정일       수정자         수정내용
 *    -------        -------     -------------------

 *
 * @author 공대영
 * @since 2018. 7. 24.
 * @version
 * @see
 *
 */
@Service("commonService")
public class CommonServiceImpl extends EgovAbstractServiceImpl implements CommonService {

    @Resource(name = "commonDAO")
    private CommonDAO commonDAO;

    public String selectServerTime(Map<String,String> paramMap) throws Exception {
    	return commonDAO.selectServerTime(paramMap);
    }

	@Override
	public List<Map> selectDynamicComboBoxAjax(Map<String, String> paramMap)
			throws Exception {
		// TODO Auto-generated method stub
		return commonDAO.selectDynamicComboBoxAjax(paramMap);
	}
	
	
	
	/**
     * MappingJackson2JsonView 객체를 생성
     *
     * @param textPlain - "text" 면 ContentType 을 text/plain 으로 반환함.       
     *  JSON 데이터를 IE 주소창에서 직접 호출시 파일다운로드가 되는 현상을 방지하기 위함임.
     * @return json view
     */
	@Override
    public MappingJackson2JsonView getJsonView(String textPlain) {
        MappingJackson2JsonView jsonView = new MappingJackson2JsonView();
        jsonView.setObjectMapper(new CustomObjectMapper()); // 문자열이 null 이면 공백("") 으로 치환함.

        if ("text".equals(textPlain))
            jsonView.setContentType("text/plain; charset=UTF-8");
        else
            jsonView.setContentType("application/json; charset=UTF-8");

        return jsonView;
    }
       
}
