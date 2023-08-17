package kr.opensoftlab.lunaops.com.vo;

import java.util.HashMap;
import java.util.Map;

public class OslErrorCode {
	
	@SuppressWarnings("serial")
	private static Map<String, String> errorMsg = new HashMap<String, String>() {{
		put("001", "파라미터 DATA값 없음");
		put("002", "인증 KEY 오류 (잘못된 KEY)");
		put("003", "파라미터 'CI_ID'값 없음");
		put("004", "데이터 복호화 오류");
		put("005", "파라미터 'TICKET_ID'값 없음");
		put("006", "파라미터 'REP_ID'값 없음");
		put("007", "파라미터 'DPL_ID'값 없음");
		put("100", "구성항목 저장 중 오류");
		put("101", "구성항목 저장 데이터 없음(소스저장소, JENKINS)");
		put("102", "구성항목 `소스저장소` 파라미터 추출 중 오류");
		put("103", "구성항목 `JENKINS&JOB` 파라미터 추출 중 오류");
		put("200", "Brache 명 중복");
		put("999", "서버 내 처리 중 오류");
	}};

	public static String getErrorMsg() {
		return "오류가 발생했습니다.";
	}
	
	public static String getErrorMsg(String errorCode) {
		if(!errorMsg.containsKey(errorCode)) {
			return getErrorMsg();
		}
		return errorMsg.get(errorCode);
	}
	
	public final static String PARAM_DATA_NULL = "001";
	
	
	public final static String AUTH_KEY_FAIL = "002";
	
	
	public final static String PARAM_CI_ID_NULL = "003";
	
	
	public final static String DATA_DECODE_FAIL = "004";

	
	public final static String PARAM_TICKET_ID_NULL = "005";

	
	public final static String PARAM_REP_ID_NULL = "006";
	
	
	public final static String PARAM_DPL_ID_NULL = "007";
	
	
	public final static String CI_INSERT_FAIL = "100";
	
	
	public final static String CI_DATA_NULL = "101";
	
	
	public final static String CI_REP_PARAM_PARSE_FAIL = "102";
	
	
	public final static String CI_JOB_PARAM_PARSE_FAIL = "103";
	
	
	public final static String BRANCHE_CREATE_DUPLE = "200";
	
	
	public final static String SERVER_ERROR = "999";
	
}
