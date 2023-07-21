package kr.opensoftlab.lunaops.cmm.cmm1000.cmm1000.web;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import egovframework.com.cmm.EgovMessageSource;
import kr.opensoftlab.lunaops.cmm.cmm1000.cmm1000.service.Cmm1000Service;
import kr.opensoftlab.sdf.util.RequestConvertor;



@Controller
public class Cmm1000Controller {

	
	protected Logger Log = Logger.getLogger(this.getClass());
	
	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;
	
	
    @Resource(name = "cmm1000Service")
    private Cmm1000Service cmm1000Service;

	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(method = RequestMethod.POST, value = "/cmm/cmm1000/cmm1000/selectCmm1000MultiCommonCodeList.do")
	public ModelAndView selectCmm1000MultiCommonCodeList(HttpServletRequest request, HttpServletResponse response, ModelMap modelMap) throws Exception {
		
		Map paramMap = RequestConvertor.requestParamToMap(request,true);
				
		
		Map rtnMap = new HashMap();
		try {
			
			Map commonCodeList = cmm1000Service.selectCmm1000MultiCommonCodeList(paramMap);

			if(commonCodeList == null || commonCodeList.size() == 0){
				rtnMap = new HashMap();
				rtnMap.put("ERROR_CODE", "-1");
				rtnMap.put("ERROR_MSG", egovMessageSource.getMessage("cmm1000.fail.cmmCom.select"));
			}else{
				rtnMap.put("commonCodeList", commonCodeList);
				rtnMap.put("ERROR_CODE", "1");
				rtnMap.put("ERROR_MSG", egovMessageSource.getMessage("cmm1000.success.cmmCom.select"));
			}

		}catch(Exception e){
			e.printStackTrace();
			Log.debug(e);
			rtnMap = new HashMap();
			rtnMap.put("ERROR_CODE", "-1");
			rtnMap.put("ERROR_MSG", egovMessageSource.getMessage("cmm1000.fail.cmmCom.select"));
		}
		
		return new ModelAndView("jsonView", rtnMap);
	}
}
