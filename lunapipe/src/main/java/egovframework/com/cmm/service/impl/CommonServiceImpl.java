package egovframework.com.cmm.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import egovframework.com.cmm.CustomObjectMapper;
import egovframework.com.cmm.service.CommonService;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;


@Service("commonService")
public class CommonServiceImpl extends EgovAbstractServiceImpl implements CommonService {

    @Resource(name = "commonDAO")
    private CommonDAO commonDAO;

    public String selectServerTime(Map<String,String> paramMap) throws Exception {
    	return commonDAO.selectServerTime(paramMap);
    }

	@SuppressWarnings("rawtypes")
	@Override
	public List<Map> selectDynamicComboBoxAjax(Map<String, String> paramMap)
			throws Exception {
		
		return commonDAO.selectDynamicComboBoxAjax(paramMap);
	}
	
	
	
	
	@Override
    public MappingJackson2JsonView getJsonView(String textPlain) {
        MappingJackson2JsonView jsonView = new MappingJackson2JsonView();
        jsonView.setObjectMapper(new CustomObjectMapper()); 

        if ("text".equals(textPlain))
            jsonView.setContentType("text/plain; charset=UTF-8");
        else
            jsonView.setContentType("application/json; charset=UTF-8");

        return jsonView;
    }
       
}
