package kr.opensoftlab.lunaops.log.log1000.log1000.service.impl;


import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.log.log1000.log1000.service.Log1000Service;
import kr.opensoftlab.lunaops.log.log1000.log1000.vo.Log1000VO;

@Service("log1000Service")
public class Log1000ServiceImpl extends EgovAbstractServiceImpl implements Log1000Service {
	
	
    @Resource(name="log1000DAO")
    private Log1000DAO log1000DAO;  

    
	public void insertLog1000SystemUseLog(Log1000VO log1000vo) throws Exception{
		log1000DAO.insertLog1000SystemUseLog(log1000vo);
	}
	
}
