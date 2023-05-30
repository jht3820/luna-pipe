
package kr.opensoftlab.lunaops.usr.usr1000.usr1000.web;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Controller;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.rte.fdl.property.EgovPropertyService;
import kr.opensoftlab.lunaops.usr.usr1000.usr1000.service.Usr1000Service;



@Controller
@PropertySource("classpath:/egovframework/egovProps/globals.properties")
public class Usr1000Controller {

	
	protected Logger Log = Logger.getLogger(this.getClass());

	
	@Resource(name = "propertiesService")
	protected EgovPropertyService propertiesService;

	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;

	
	@Resource(name = "usr1000Service")
	private Usr1000Service usr1000Service;
}
