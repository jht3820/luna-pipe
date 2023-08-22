package egovframework.com.cmm.service.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;


@Repository("commonDAO")
public class CommonDAO extends EgovComAbstractDAO {

    
    public String selectServerTime(Map<String,String> paramMap) throws Exception {
    	return (String) select("commonDAO.selectServerTime", paramMap);
    }

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<Map> selectDynamicComboBoxAjax(Map<String, String> paramMap) {
		
		
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
