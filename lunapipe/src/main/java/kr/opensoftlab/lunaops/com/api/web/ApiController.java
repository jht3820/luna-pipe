package kr.opensoftlab.lunaops.com.api.web;

import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.rte.fdl.property.EgovPropertyService;
import kr.opensoftlab.sdf.util.RequestConvertor;



@Controller
public class ApiController {

	
	private static final Logger Log = Logger.getLogger(ApiController.class);

	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;
	
	
	
	@RequestMapping(value="/api/insertCIRepJenJob")
	public ModelAndView insertCIRepJenJob(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		try{

			 
			 
		}catch(Exception ex){
			Log.error("insertCIRepJenJob()", ex);
		}
		 return new ModelAndView("jsonView");
	}
}
