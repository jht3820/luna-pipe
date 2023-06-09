package kr.opensoftlab.lunaops.com.dao;

import javax.annotation.Resource;

import kr.opensoftlab.sdf.excel.ExcelDataListResultHandler;

import org.springframework.stereotype.Repository;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapSession;

import egovframework.rte.psl.dataaccess.EgovAbstractDAO;



@Repository("comEgmisAbstractDAO")
public class ComOslitsAbstractDAO extends EgovAbstractDAO{

	@Resource(name="lunaops.sqlMapClient")
	public void setSuperSqlMapClient(SqlMapClient sqlMapClient) {
        super.setSuperSqlMapClient(sqlMapClient);
    }
	
	
	@SuppressWarnings("deprecation")
	public void listExcelDownSql(String sqlId, Object param, ExcelDataListResultHandler resultHandler) throws Exception{
		SqlMapSession sqlMap = getSqlMapClient().openSession();
		sqlMap.queryWithRowHandler(sqlId, param, resultHandler);
		sqlMap.close();
	}
}

