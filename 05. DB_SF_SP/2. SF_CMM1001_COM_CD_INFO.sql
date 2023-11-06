/*------------------------------------------------------------------------------
-- 개체 이름: SF_CMM1001_COM_CD_INFO
-- 만든 날짜: 2022-07-08 오후 1:44:57
-- 마지막 수정 날짜: 2022-07-08 오후 1:44:57
-- 상태: VALID
------------------------------------------------------------------------------*/
CREATE OR REPLACE FUNCTION SF_CMM1001_COM_CD_INFO
(
		I_MST_CD		IN	VARCHAR2
    ,	I_SUB_CD		IN	VARCHAR2
    ,	I_GB			IN	VARCHAR2
)

/*******************************************************************************************************
 FUNCTION 명 	 : SF_CMM1001_COM_CD_INFO
 FUNCTION 설명     : 공통코드명 얻기 함수
 사용화면          	: 공통, ADM1000
 INPUT             : 
 					 I_MST_CD 		: 대분류 CD
                     I_SUB_CD		: 소분류 CD
                     I_GB			: 리턴값 구분
                     	- 1 : 공통코드명(SUB_CD_NM)
                        - 2 : 보조필드1(SUB_CD_REF1)
                        - 3 : 보조필드2(SUB_CD_REF1)
                        - 4 : 사용여부(USE_YN)
                        - 5 : 화면표시순서(ORD)
 RETURN			  : 공통코드 대분류 명
 작성자/작성일     	: 진주영 / 2022-07-19
 관련테이블        	: CMM1001
 수정자/수정일     	: 2022-07-19
 수정내용          	: 최초생성
*******************************************************************************************************/

RETURN VARCHAR2 IS

 	RTN_NM			VARCHAR2(1000);

	V_SUB_CD_NM		VARCHAR2(1000);
    V_SUB_CD_REF1	VARCHAR2(1000);
    V_SUB_CD_REF2	VARCHAR2(1000);
    V_USE_YN		VARCHAR2(1);
    V_ORD			VARCHAR2(100);

BEGIN

	BEGIN
		/* 공통코드 정보 변수 저장 */
    	SELECT	SUB_CD_NM, 		SUB_CD_REF1, 	SUB_CD_REF2,
        		USE_YN, 		ORD
        INTO	V_SUB_CD_NM, 	V_SUB_CD_REF1, 	V_SUB_CD_REF2,
        		V_USE_YN, 		V_ORD
        FROM	CMM1001 A
        WHERE	1=1
        AND		A.MST_CD 		= I_MST_CD
        AND		A.SUB_CD 		= I_SUB_CD
        ;

		/* 구분에 따라 정보 리턴함수에 저장 */
        IF I_GB = '1' THEN
        	RTN_NM := V_SUB_CD_NM;
        ELSIF I_GB = '2' THEN
        	RTN_NM := V_SUB_CD_REF1;
        ELSIF I_GB = '3' THEN
        	RTN_NM := V_SUB_CD_REF2;
        ELSIF I_GB = '4' THEN
        	RTN_NM := V_USE_YN;
        ELSIF I_GB = '5' THEN
        	RTN_NM := V_ORD;
        ELSE
        	RTN_NM := '';
        END IF;

	EXCEPTION
    	WHEN NO_DATA_FOUND THEN
        	RTN_NM := '';
            RETURN RTN_NM;
        WHEN OTHERS THEN
        	RTN_NM := '';
            RETURN RTN_NM;
	END;

 	RETURN RTN_NM;
END;


