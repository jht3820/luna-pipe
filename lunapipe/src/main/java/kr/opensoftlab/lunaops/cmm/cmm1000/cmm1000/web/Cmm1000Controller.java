package kr.opensoftlab.lunaops.cmm.cmm1000.cmm1000.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

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

	
	@SuppressWarnings({ "rawtypes", "unchecked", "finally" })
	@RequestMapping(method = RequestMethod.POST, value = "/cmm/cmm1000/cmm1000/selectCmm1000MultiCommonCodeList.do")
	public ModelAndView selectCmm1000MultiCommonCodeList(
			HttpServletRequest request, HttpServletResponse response,
			ModelMap modelMap) throws Exception {
		
		String code = "";
		String text = "";

		String mstCdStr = (String) request.getParameter("mstCdStr");
		StringTokenizer st = new StringTokenizer(mstCdStr, "|");

		Map rtnMap = new HashMap();

		try {
			
			Map<String, String> param = RequestConvertor.requestParamToMap(
					request, true);
			param.put("mstCds", param.get("mstCds").replaceAll("&apos;", "'"));

			
			List<Map> commonCodeList = cmm1000Service.selectCmm1000MultiCommonCodeList(param);

			
			while (st.hasMoreElements()) {

				
				String mstCd = st.nextElement().toString();
				code = "";
				text = "";

				for (Map comboMap : commonCodeList) {
					if (mstCd.equals(comboMap.get("mstCd"))) {
						code += comboMap.get("subCd") + "|";
						text += comboMap.get("subCdNm") + "|";
						
						
						
					}
				}

				
				if (code.length() > 0) {
					code = code.substring(0, code.length() - 1);
					text = text.substring(0, text.length() - 1);
				}

				
				rtnMap.put("mstCd" + mstCd + "code", code);
				rtnMap.put("mstCd" + mstCd + "text", text);
				
				
				
				
			}

			rtnMap.put("commonCodeList", commonCodeList);
			rtnMap.put("ERROR_CODE", "1");
			rtnMap.put("ERROR_MSG", egovMessageSource.getMessage("cmm1000.success.cmmCom.select"));

			

		} catch (Exception ex) {
			ex.printStackTrace();
			rtnMap = new HashMap();
			rtnMap.put("ERROR_CODE", "-1");
			rtnMap.put("ERROR_MSG", egovMessageSource.getMessage("cmm1000.fail.cmmCom.select"));

		} finally {
			return new ModelAndView("jsonView", rtnMap);
		}
	}
}
