package kr.opensoftlab.lunaops.whk.whk1000.whk1000.web;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import egovframework.com.cmm.EgovMessageSource;



@Controller
public class Whk1000Controller {

	
	

	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	
	
	@RequestMapping(value="/whk/whk1000/whk1000/selectWhk1000View.do")
	public String selectWhk1000View(HttpServletRequest request, HttpServletResponse response, ModelMap model ) throws Exception {
		return "/whk/whk1000/whk1000/whk1000";
	}

}
