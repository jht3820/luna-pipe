package kr.opensoftlab.lunaops.log.log1000.log1000.service.impl;

import org.springframework.stereotype.Repository;

import kr.opensoftlab.lunaops.com.dao.ComOslitsAbstractDAO;
import kr.opensoftlab.lunaops.log.log1000.log1000.vo.Log1000VO;

@Repository("log1000DAO")
public class Log1000DAO extends ComOslitsAbstractDAO {
	
	public void insertLog1000SystemUseLog(Log1000VO log1000vo) throws Exception{
		insert("log1000DAO.insertLog1000SystemUseLog", log1000vo);
	}
}




