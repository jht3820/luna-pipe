package kr.opensoftlab.lunaops.cmm.cmm1000.cmm1000.service.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.cmm.cmm1000.cmm1000.service.Cmm1000Service;


@Service("cmm1000Service")
public class Cmm1000ServiceImpl  extends EgovAbstractServiceImpl implements Cmm1000Service{

	
    @Resource(name="cmm1000DAO")
    private Cmm1000DAO cmm1000DAO;

    
    @SuppressWarnings("rawtypes")
    public List selectCmm1000MultiCommonCodeList(Map param) throws Exception {
    	return cmm1000DAO.selectCmm1000MultiCommonCodeList(param);
    }
}
