/*------------------------------------------------------------------------------
-- 개체 이름: SF_CMM1000_MST_CD_NM
-- 만든 날짜: 2022-07-08 오후 1:44:57
-- 마지막 수정 날짜: 2022-07-08 오후 1:44:57
-- 상태: VALID
------------------------------------------------------------------------------*/
CREATE OR REPLACE FUNCTION SF_CMM1000_MST_CD_NM
(
		I_MST_CD		IN	VARCHAR2
)

/*******************************************************************************************************
 FUNCTION 명 	  :	SF_CMM1000_MST_CD_NM
 FUNCTION 설명     : 대분류명 얻기 함수
 사용화면          : 공통, CMM1000
 INPUT        : I_MST_CD 		: 대분류 CD
 RETURN			   : 공통코드 대분류 명
 작성자/작성일     : 노민준 / 2022-07-08
 관련테이블        : CMM1000
 수정자/수정일     : 2022-07-08
 수정내용          : 최초생성
*******************************************************************************************************/

RETURN VARCHAR2 IS

 	RTN_MST_CD_NM		VARCHAR2(1000);

BEGIN

	BEGIN

    	SELECT	MST_CD_NM
        INTO	RTN_MST_CD_NM
        FROM	CMM1000 A
        WHERE	1=1
        AND		A.MST_CD = I_MST_CD
        ;

    EXCEPTION
        WHEN NO_DATA_FOUND THEN
           RTN_MST_CD_NM :=  '';
        WHEN OTHERS THEN
           RTN_MST_CD_NM :=  '';
    END;

 	RETURN RTN_MST_CD_NM;
END;


