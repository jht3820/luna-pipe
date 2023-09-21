<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html lang="ko">
<title>OpenSoftLab</title>
<style>
.required_info { color: red; }
/*익스플로러 적용 위해 !important 추가*/
/* 팝업에 따라 pop_menu_col1, pop_menu_col2 높이 변경 */
.pop_menu_row .pop_menu_col1 { width: 23% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 77% !important; height: 45px !important; }
.pop_menu_row .menu_col1_subStyle { width: 46% !important; }
.pop_menu_row .menu_col2_subStyle { width: 54% !important; }
</style>
<script>
var fd = new FormData();

//유효성
var arrChkObj = {	
			        "webhookNm":{"type":"length","msg":"웹훅명은 100byte까지 입력이 가능합니다.","max":100},
			        "webhookTargetUrl":{"type":"length","msg":"웹훅 대상 URL은 500byte까지 입력이 가능합니다.","max":500}
			};
			
globals_guideChkFn = fnWhk1001GuideShow;			

$(document).ready(function() {

	/* 	
	*	공통코드 가져올때 한번 트랜잭션으로 여러 코드 가져와서 셀렉트박스에 세팅하는 함수(사용 권장)
	* 	1. 공통 대분류 코드를 순서대로 배열 담기(문자열)
	*	2. 사용구분 저장(Y: 사용중인 코드만, N: 비사용중인 코드만, 그 외: 전체)
	*	3. 공통코드 적용할 select 객체 직접 배열로 저장
	* 	4. 공통코드 가져와 적용할 콤보타입 객체 배열 ( S:선택, A:전체(코드값 A 세팅한 조회조건용), N:전체, E:공백추가, 그 외:없음 )
	*	5. 동기 비동기모드 선택 (true:비동기 통신, false:동기 통신)
	*	마스터 코드 = REQ00001:요구사항 타입, REQ00002:중요도 , CMM00001:
	*/
	// 팝업 공통코드 select 세팅
	var commonCodeArr = [
		{mstCd: "WHK00001", useYn: "Y", targetObj: "#webhookTypeCd", comboType:"OS"}, // 웹훅 타입
		{mstCd: "WHK00002", useYn: "Y", targetObj: "#contentTypeCd", comboType:"OS"}, // 전송 콘텐츠 타입
		{mstCd: "WHK00003", useYn: "Y", targetObj: "#webhookChgTypeCd", comboType:"OS"}, // 웹훅 변경 타입
		{mstCd: "CMM00001", useYn: "Y", targetObj: "#useCd", comboType:"OS"} // 사용유무
	];
	//공통코드 채우기
	gfnGetMultiCommonCodeDataForm(commonCodeArr , true);
	
	// 유효성 체크
	gfnInputValChk(arrChkObj);
	
	/* 타이틀 변경 및 버튼명 변경, 수정일경우 값 세팅 */
	if('${param.popupGb}' == 'insert'){
		$(".pop_title").text("웹훅 등록");
		$("form#whk1001PopupFrm #btn_update_popup").text('등록');
	}
	else if('${param.popupGb}' == 'update'){
		
		$(".pop_title").text("웹훅 수정");
		$("form#whk1001PopupFrm #btn_update_popup").text('수정');
		
		var webhookId = $("form#whk1001PopupFrm #webhookId").val();
		fnSelectWhk1001WebhookInfo(webhookId);
	}
	
	/**
	 * 	웹훅 기본정보 상세 조회
	 */
 	function fnSelectWhk1001WebhookInfo(webhookId){
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/whk/whk1000/whk1000/selectWhk1000WebhookInfoAjax.do'/>",loadingShow:false}
				,{ "webhookId" : webhookId });
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
        	//디테일폼 세팅
        	gfnSetData2ParentObj(data.whkInfo, "whk1001PopupFrm");
        	
        	//selectbox
        	$("form#whk1001PopupFrm #webhookTypeCd").data("osl-value", data.whkInfo.webhookTypeCd);
        	$("form#whk1001PopupFrm #webhookTypeCd").val(data.whkInfo.webhookTypeCd);
        	
        	$("form#whk1001PopupFrm #contentTypeCd").data("osl-value", data.whkInfo.contentTypeCd);
        	$("form#whk1001PopupFrm #contentTypeCd").val(data.whkInfo.contentTypeCd);
        	
        	$("form#whk1001PopupFrm #webhookChgTypeCd").data("osl-value", data.whkInfo.webhookChgTypeCd);
        	$("form#whk1001PopupFrm #webhookChgTypeCd").val(data.whkInfo.webhookChgTypeCd);
		});
		
		//AJAX 전송
		ajaxObj.send();
	} 
	
	/* 저장버튼 클릭 시 */
	$('form#whk1001PopupFrm #btn_update_popup').click(function() {
		
		/* 필수입력값 체크 공통 호출 */
		var strFormId = "whk1001PopupFrm";
		var strCheckObjArr = ["webhookNm", "webhookTargetUrl"];
		var sCheckObjNmArr = ["웹훅명", "웹훅 대상 URL" ];
		if(gfnRequireCheck(strFormId, strCheckObjArr, sCheckObjNmArr)){
			return;	
		}
		
		// 등록/수정 전 유효성 체크
		if(!gfnSaveInputValChk(arrChkObj)){
			return false;	
		}	

		fnInsertWhkInfoAjax("whk1001PopupFrm");

	});
	
	/* 취소버튼 클릭 시 팝업 창 사라지기*/
	$('form#whk1001PopupFrm #btn_cancle_popup').click(function() {
		
		gfnLayerPopupClose();
	});
	
	/* 웹훅 전송 테스트 */
	$('form#whk1001PopupFrm #webhookConnTestBtn').click(function() {
		/* 필수입력값 체크 공통 호출 */
		var strFormId = "whk1001PopupFrm";
		var strCheckObjArr = ["webhookNm", "webhookTargetUrl"];
		var sCheckObjNmArr = ["웹훅명", "웹훅 대상 URL" ];
		if(gfnRequireCheck(strFormId, strCheckObjArr, sCheckObjNmArr)){
			return;	
		}
		
		// 등록/수정 전 유효성 체크
		if(!gfnSaveInputValChk(arrChkObj)){
			return false;	
		}
		
		var webhookTypeCd = $("form#whk1001PopupFrm #webhookTypeCd").val();
		var connTestForm = new FormData();
		
		//FormData에 input값 넣기
		gfnFormDataAutoValue('whk1001PopupFrm',connTestForm);
		
		//기본 값과 type 넘기기
		fd.append("type",'${param.popupGb}');
		
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/whk/whk1000/whk1000/selecctWhk1001ConnTestAjax.do'/>"
					,"contentType":false
					,"processData":false
					,"cache":false}
				,connTestForm);

		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
    		jAlert(data.message, "알림창");
		});
		
		//AJAX 전송
		ajaxObj.send();
	});
});

//웹훅 등록 함수
function fnInsertWhkInfoAjax(formId){
	jConfirm("웹훅 정보를 저장하시겠습니까?", "알림창", function( result ) {
		if( result ){
			fd = new FormData();
			//FormData에 input값 넣기
			gfnFormDataAutoValue('whk1001PopupFrm',fd);
			
			//기본 값과 type 넘기기
			fd.append("type",'${param.popupGb}');
			
			//AJAX 설정
			var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/whk/whk1000/whk1000/saveWhk1000WebhookInfoAjax.do'/>"
						,"contentType":false
						,"processData":false
						,"cache":false}
					,fd);
			//AJAX 전송 성공 함수
			ajaxObj.setFnSuccess(function(data){		    	
		    	//오류 발생
		    	if(data.errorYn == 'Y'){
		    		jAlert(data.message, "알림창");
		    		return;
		    	}
		    	
		    	//그리드 새로고침
				fnInWebhookGridDataSet(webhookGrid.page.currentPage, $('form#whk1000PopupFrm').serialize()+"&"+whkSearchObj.getParam());
				
				jAlert(data.message, '알림창');
				gfnLayerPopupClose();
			});
			
			//AJAX 전송 오류 함수
			ajaxObj.setFnError(function(xhr, status, err){
				toast.push(xhr.status+"("+err+")"+" 에러가 발생했습니다.");
		    	gfnLayerPopupClose();
			});
			//AJAX 전송
			ajaxObj.send();
		}
	});
}

function fnWhk1001GuideShow(){
	var mainObj = $(".popup");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["whk1001"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}

</script>

<div class="popup" >
<form id="whk1001PopupFrm" name="whk1001PopupFrm" method="post">
	<input type="hidden" name="popupGb" id="popupGb" value="${param.popupGb}"/>
	<input type="hidden" name="webhookId" id="webhookId" value="${param.webhookId}" />
	<input type="hidden" name="paramWebhookTypeCd" id="paramWebhookTypeCd" value="${param.paramWebhookTypeCd}" />
	<input type="hidden" name="empId" id="empId" value="${param.empId}" />

	<div class="pop_title">Webhook 설정 등록</div>
	<div class="pop_sub" guide="jenkinsInfo" >
		<div class="pop_menu_row pop_menu_oneRow first_menu_row">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="webhookTypeCd">웹훅 타입</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<span class="search_select">
					<select class="select_useCd" name="webhookTypeCd" id="webhookTypeCd" value="" style="height:100%; width:100%;" disabled="disabled" data-osl-value="${param.paramWebhookTypeCd}"></select>
				</span>
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="webhookNm">웹훅명</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<input type="text" title="웹훅명" class="input_txt" name="webhookNm" id="webhookNm" value="" maxlength="100"  />
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="webhookChgTypeCd">웹훅 전송 조건</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<span class="search_select">
					<select class="select_useCd" name="webhookChgTypeCd" id="webhookChgTypeCd" value="" style="height:100%; width:100%;"></select>
				</span>
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="contentTypeCd">전송 콘텐츠 타입</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<span class="search_select">
					<select class="select_useCd" name="contentTypeCd" id="contentTypeCd" value="" style="height:100%; width:100%;"></select>
				</span>
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="webhookTargetUrl">웹훅 대상 URL</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<input type="text" title="웹훅 대상 URL" class="input_txt" name="webhookTargetUrl" id="webhookTargetUrl" value="" maxlength="5000" />
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="useCd">사용여부</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<span class="search_select">
					<select class="select_useCd" name="useCd" id="useCd" value="" style="height:100%; width:100%;"></select>
				</span>
			</div>
		</div>
		<div class="pop_note" style="margin-bottom:0px;">
			<div class="note_title">전송 데이터 예제</div>
			
			<textarea class="input_note" rows="7" value="" maxlength="2000" readonly="readonly">
ex) application/json
{
	whk_id: '웹훅 고유 ID(KEY)',
	whk_type: '웹훅 발생 타입(01 - 소스저장소, 02 - JENKINS)',
	whk_chg_type: '웹훅 변경 타입(01 - Add, 02 - Modify, 03 - Delete)',
	whk_target_key1: '웹훅 발생 대상 key1 (소스저장소 ID, JENKINS ID)',
	whk_target_key2: '웹훅 발생 대상 key2 (JOB ID)',
	whk_usr_id: '웹훅 발생 사용자 id',
	whk_dtm: '웹훅 발생 일시'
}
[소스저장소]=>
{
	whk_id: 'WHK2023012500001',
	whk_type: '01',
	whk_chg_type: '03',
	whk_target_key1: 'REP2022110800001',
	whk_target_key2: null,
	whk_usr_id: 'admin',
	whk_dtm: '2023-01-25 15:30:13'
}
[JENKINS&JOB]=>
{
	whk_id: 'WHK2023012500002',
	whk_type: '02',
	whk_chg_type: '01',
	whk_target_key1: 'JEN2022072200001',
	whk_target_key2: 'LUNA-OPS_DPL',
	whk_usr_id: 'admin',
	whk_dtm: '2023-01-25 15:30:13'
}
			</textarea>
		</div>
		<div class="btn_div">
			<div class="button_normal save_btn" id="webhookConnTestBtn">웹훅 테스트</div>
			<div class="button_normal save_btn" id="btn_update_popup"></div>
			<div class="button_normal exit_btn" id="btn_cancle_popup">취소</div>
		</div>
	</div>
</form>
</div>

</html>
