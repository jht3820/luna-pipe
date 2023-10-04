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
		put("008", "JOB_ID 정보 찾을 수 없음");
		put("009", "REP_ID에 해당하는 소스저장소 정보가 없음");
		put("010", "JEN_ID, JOB_ID에 해당하는 JENKINS&JOB 정보가 없음");
		put("011", "등록된 데이터 없음");
		put("012", "데이터 체크 실패");
		put("013", "삭제된 데이터 없음");
		put("014", "파라미터 'PATH_LIST'값 없음");
		
		
		put("100", "구성항목 저장 중 오류");
		put("101", "구성항목 저장 데이터 없음(소스저장소, JENKINS)");
		put("102", "구성항목 `소스저장소` 파라미터 추출 중 오류");
		put("103", "구성항목 `JENKINS&JOB` 파라미터 추출 중 오류");
		
		
		put("200", "Brache 명 중복");
		put("201", "소스저장소 고유 식별 ID 'UUID' 값 없음");
		put("202", "소스저장소 리비전 'rv' 값 없음");
		put("203", "Trunk 경로에 복사 대상이 없음");
		put("204", "파일 락 중 오류가 발생했습니다.");
		put("205", "소스저장소 UUID로 REP_ID값 조회 중 오류 발생.");
		
		
		put("300", "JENKINS 연결 실패");
		put("301", "해당 JOB이 실행 중입니다.");
		put("302", "빌드 번호 정보가 없습니다.");
		
		
		put("400", "티켓 검증 오류");
		
		
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
	
	
	public final static String JOB_ID_INFO_NULL = "008";
	
	
	public final static String REP_ID_INFO_NULL = "009";
	
	
	public final static String JEN_JOB_ID_INFO_NULL = "010";
	
	
	public final static String DATA_INSERT_COUNT_NULL = "011";
	
	
	public final static String DATA_CHECK_FAIL = "012";

	
	public final static String DATA_DELETE_COUNT_NULL = "013";
	
	
	public final static String PARAM_PATH_LIST_NULL = "014";
	
	
	public final static String CI_INSERT_FAIL = "100";
	
	
	public final static String CI_DATA_NULL = "101";
	
	
	public final static String CI_REP_PARAM_PARSE_FAIL = "102";
	
	
	public final static String CI_JOB_PARAM_PARSE_FAIL = "103";
	
	
	public final static String BRANCHE_CREATE_DUPLE = "200";
	
	
	public final static String REP_UUID_PARAM_NULL = "201";
	
	
	public final static String REP_REVISION_PARAM_NULL = "202";
	
	
	
	public final static String REP_TRUNK_PATH_NULL = "203";
	
	
	public final static String FILE_LOCKED_FAIL = "204";
	
	
	public final static String UUID_TO_REP_ID_FAIL = "205";
	
	
	public final static String JENKINS_CONN_FAIL = "300";
	
	
	public final static String JOB_DUPLE_ACTION = "301";
	
	
	public final static String BLD_NUM_NULL = "302";
	
	
	public final static String IS_TICKET_FAIL = "400";
	
	
	public final static String SERVER_ERROR = "999";
	
}
