/*------------------------------------------------------------------------------
-- ��ü �̸�: SF_CMM1000_MST_CD_NM
-- ���� ��¥: 2022-07-08 ���� 1:44:57
-- ������ ���� ��¥: 2022-07-08 ���� 1:44:57
-- ����: VALID
------------------------------------------------------------------------------*/
CREATE OR REPLACE FUNCTION SF_CMM1000_MST_CD_NM
(
		I_MST_CD		IN	VARCHAR2
)

/*******************************************************************************************************
 FUNCTION �� 	  :	SF_CMM1000_MST_CD_NM
 FUNCTION ����     : ��з��� ��� �Լ�
 ���ȭ��          : ����, CMM1000
 INPUT        : I_MST_CD 		: ��з� CD
 RETURN			   : �����ڵ� ��з� ��
 �ۼ���/�ۼ���     : ����� / 2022-07-08
 �������̺�        : CMM1000
 ������/������     : 2022-07-08
 ��������          : ���ʻ���
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


