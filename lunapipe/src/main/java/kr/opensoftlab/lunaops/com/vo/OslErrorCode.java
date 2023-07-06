package kr.opensoftlab.lunaops.com.vo;

public class OslErrorCode {
	
	/**
	 * 파라미터 DATA값 없음
	 * @see Error_Code: 001
	 */
	public final static String PARAM_DATA_NULL = "001";
	
	/**
	 * 인증 KEY 오류 (잘못된 KEY)
	 * @see Error_Code: 002
	 */
	public final static String AUTH_KEY_FAIL = "002";
	
	/**
	 * 파라미터 'CI_ID'값 없음
	 * @see Error_Code: 003
	 */
	public final static String PARAM_CI_ID_NULL = "003";
	
	/**
	 * 데이터 복호화 오류
	 * @see Error_Code: 004
	 */
	public final static String DATA_DECODE_FAIL = "004";
	
	/**
	 * 구성항목 저장 중 오류
	 * @see Error_Code: 100
	 */
	public final static String CI_INSERT_FAIL = "100";
	
	/**
	 * 구성항목 저장 데이터 없음(소스저장소, JENKINS)
	 * @see Error_Code: 101
	 */
	public final static String CI_DATA_NULL = "101";
	
	/**
	 * 구성항목 `소스저장소` 파라미터 추출 중 오류
	 * @see Error_Code: 102
	 */
	public final static String CI_REP_PARAM_PARSE_FAIL = "102";
	
	/**
	 * 구성항목 `JENKINS&JOB` 파라미터 추출 중 오류
	 * @see Error_Code: 103
	 */
	public final static String CI_JOB_PARAM_PARSE_FAIL = "103";
	
	/**
	 * 서버 내 처리 중 오류
	 * @see Error_Code: 999
	 */
	public final static String SERVER_ERROR = "999";
	
	
	
	
	
	
	
	
}
