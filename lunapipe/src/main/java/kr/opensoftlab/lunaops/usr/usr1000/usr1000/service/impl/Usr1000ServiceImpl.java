package kr.opensoftlab.lunaops.usr.usr1000.usr1000.service.impl;



import javax.annotation.Resource;

import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import egovframework.com.cmm.EgovMessageSource;
import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.usr.usr1000.usr1000.service.Usr1000Service;

@Service("usr1000Service")
@PropertySource("classpath:/egovframework/egovProps/globals.properties")
public class Usr1000ServiceImpl extends EgovAbstractServiceImpl implements Usr1000Service {

	
	@Resource(name = "usr1000DAO")
	private Usr1000DAO usr1000DAO;
	
	
	@Resource(name = "egovMessageSource")
	EgovMessageSource egovMessageSource;
	
}
