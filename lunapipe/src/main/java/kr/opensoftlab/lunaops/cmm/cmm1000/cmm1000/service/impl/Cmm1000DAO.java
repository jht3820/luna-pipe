package kr.opensoftlab.lunaops.cmm.cmm1000.cmm1000.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;



@Repository("cmm1000DAO")
public class Cmm1000DAO extends ComOslitsAbstractDAO {

    
    @SuppressWarnings("rawtypes")
    public List selectCmm1000MultiCommonCodeList(Map param) throws Exception {
    	return list("cmm1000DAO.selectCmm1000MultiCommonCodeList", param);   
    }
}
