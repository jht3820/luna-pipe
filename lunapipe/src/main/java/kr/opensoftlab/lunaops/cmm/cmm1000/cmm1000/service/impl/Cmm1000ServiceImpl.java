package kr.opensoftlab.lunaops.cmm.cmm1000.cmm1000.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.rte.fdl.cmmn.EgovAbstractServiceImpl;
import kr.opensoftlab.lunaops.cmm.cmm1000.cmm1000.service.Cmm1000Service;


@Service("cmm1000Service")
public class Cmm1000ServiceImpl  extends EgovAbstractServiceImpl implements Cmm1000Service{

	
    @Resource(name="cmm1000DAO")
    private Cmm1000DAO cmm1000DAO;

    
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public Map selectCmm1000MultiCommonCodeList(Map paramMap) throws Exception {
    	
		String commonCodeArr = (String)paramMap.get("commonCodeArr");

		
		JSONParser jsonParser = new JSONParser();
		
		
		JSONArray jsonArray = (JSONArray) jsonParser.parse(commonCodeArr);

		
		Map reqDatas = new HashMap();
		
		for(int i=0; i<jsonArray.size(); i++){
			JSONObject token = (JSONObject)jsonArray.get(i);

			
			HashMap<String, String> tokenObj = new ObjectMapper().readValue(token.toString(), HashMap.class) ;
			
			
			List commonCodeInfo = (List)cmm1000DAO.selectCmm1000MultiCommonCodeList(tokenObj);
			
			reqDatas.put((String) tokenObj.get("targetObj"), commonCodeInfo);
		}
		
		return reqDatas;
    }
}
