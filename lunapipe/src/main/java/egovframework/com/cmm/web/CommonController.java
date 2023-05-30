package egovframework.com.cmm.web;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.UUID;

import javax.annotation.Resource;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kr.opensoftlab.sdf.util.RequestConvertor;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;



import org.springframework.web.servlet.mvc.annotation.DefaultAnnotationHandlerMapping;

import egovframework.com.cmm.service.CommonService;



/**
 * @Class Name : CommonController.java
 * @Description :
 * @Modification Information
 *
 *    수정일       	수정자         수정내용
 *    ----------   ---------     -------------------

 *
 * @author  공대영
 * @since 2018. 7.24.
 * @version
 * @see
 *
 */
@Controller
public class CommonController  {
	/**
     * Logging 을 위한 선언
     * Log는 반드시 가이드에 맞춰서 작성한다. 개발용으로는 debug 카테고리를 사용한다.
     */
	protected Logger Log = Logger.getLogger(this.getClass());
	
    @Resource(name = "commonService")
    private CommonService commonService;
    
    @Autowired
    private ApplicationContext ac;
    
    @Value("${Globals.DbType}")
    private String dbType;


    /**
     * 
     * 서버 타임을 조회한다.
     * 
     * 
     * @param request
     * @param response
     * @param model
     * @return
     * @throws Exception
     */
    @RequestMapping(value="/cmm/selectSelectServerTimeAjax.do")
	public ModelAndView selectSelectServerTimeAjax( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			// request 파라미터를 map으로 변환
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			
			//마리아 db일 경우 변환
			if("mariadb".equals(dbType)) {
				// 포맷 변환
				String format = paramMap.get("format");
				// 대문자 변환
				format = format.toUpperCase();
				format = format.replace("YYYY", "%Y") //년
							.replace("MM", "%m") //월
								.replace("DD", "%d") //일
									.replace("AM", "%p") //오전
										.replace("PM", "%p") //오후
											.replace("HH", "%h") //12시간
												.replace("HH24", "%H") //24시간
													.replace("MI", "%i") // 분
														.replace("SS", "%s"); // 초
				paramMap.put("format", format);
			}
			
			//현재 페이지 값, 보여지는 개체 수
			String serverTime=commonService.selectServerTime(paramMap);
						
			model.addAttribute("serverTime", serverTime);
						
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectSelectServerTimeAjax()", ex);
			throw new Exception(ex.getMessage());
		}
	}
    
    @RequestMapping(value="/cmm/selectApiKeyAjax.do")
	public ModelAndView selectApiKeyAjax( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			// request 파라미터를 map으로 변환
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			//현재 페이지 값, 보여지는 개체 수
			
			String apiKey= UUID.randomUUID().toString().toUpperCase();
						
			model.addAttribute("apiKey", apiKey);
						
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectApiKeyAjax()", ex);
			throw new Exception(ex.getMessage());
		}
	}
    
    
 

    
    @RequestMapping(value="/cmm/selectUrlListAjax.do")
	public ModelAndView selectUrlListAjax( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			// request 파라미터를 map으로 변환
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			//현재 페이지 값, 보여지는 개체 수
			DefaultAnnotationHandlerMapping mapping = ac.getBean(DefaultAnnotationHandlerMapping.class);
			
			Map map = mapping.getHandlerMap();
			
			List urlList = new ArrayList();
			
			Set<String> keySet=map.keySet();
			
			for( String  key   : keySet) {
				urlList.add(key);	
			}
									
			model.addAttribute("urlList", urlList);
						
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectUrlListAjax()", ex);
			throw new Exception(ex.getMessage());
		}
	}
    
    
    @RequestMapping(value="/cmm/selectDynamicComboBoxAjax.do")
	public ModelAndView selectDynamicComboBoxAjax( HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {

		try{
			// request 파라미터를 map으로 변환
			Map<String, String> paramMap = RequestConvertor.requestParamToMapAddSelInfo(request, true);
			//현재 페이지 값, 보여지는 개체 수
			List<Map> comboList=commonService.selectDynamicComboBoxAjax(paramMap);
						
			model.addAttribute("comboList", comboList);
						
			return new ModelAndView("jsonView");
		}
		catch(Exception ex){
			Log.error("selectDynamicComboBoxAjax()", ex);
			throw new Exception(ex.getMessage());
		}
	}
    
    
}
