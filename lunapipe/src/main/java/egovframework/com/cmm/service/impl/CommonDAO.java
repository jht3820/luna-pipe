package egovframework.com.cmm.service.impl;

import java.util.List;
import java.util.Map;

import egovframework.com.cmm.ComDefaultCodeVO;
import egovframework.com.cmm.service.CmmnDetailCode;

import org.springframework.stereotype.Repository;

/**
 * @Class Name : CommonDAO.java
 * @Description : 
 * @Modification Information
 *
 *    수정일       수정자         수정내용
 *    -------        -------     -------------------
 *    
 *
 * @author 공대영
 * @since 2018. 7. 24.
 * @version
 * @see
 *
 */
@Repository("commonDAO")
public class CommonDAO extends EgovComAbstractDAO {

    /**
     * 오라클 서버시간을 조회한다.
     * 
     * @param vo
     * @return
     * @throws Exception
     */
    @SuppressWarnings("unchecked")
    public String selectServerTime(Map<String,String> paramMap) throws Exception {
    	return (String) select("commonDAO.selectServerTime", paramMap);
    }

	public List<Map> selectDynamicComboBoxAjax(Map<String, String> paramMap) {
		// TODO Auto-generated method stub
		
		String conditionColSize = paramMap.get("conditionColSize");
		StringBuffer condBuffer = new StringBuffer();
		if(!"0".equals(conditionColSize)){
			int condSize = Integer.parseInt( conditionColSize );
			
			for (int i = 0; i < condSize; i++) {
				condBuffer.append( "   AND   "+ paramMap.get("condCol"+i)+"  =   '"+ paramMap.get("condVal"+i)+"'    "  );
			}
			
			paramMap.put("condtion", condBuffer.toString());
		}
		
		return (List<Map>) list("commonDAO.selectDynamicComboBoxAjax", paramMap);
	}
}
