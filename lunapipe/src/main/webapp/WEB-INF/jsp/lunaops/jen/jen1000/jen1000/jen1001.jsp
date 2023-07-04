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
.pop_sub input[type="password"] {width:100% !important; height:100% !important;}
</style>
<script>
var fd = new FormData();

//현재 값
var nowJenUsrTok = null;
var nowJenTok = null;
// JENKINS 유효성
var arrChkObj = {	
			        "jenNm":{"type":"length","msg":"Jenkins name은 500byte까지 입력이 가능합니다.","max":500},
			        "jenUrl":{"type":"length","msg":"URL은 500byte까지 입력이 가능합니다.","max":500},
			        "jenUsrId":{"type":"length","msg":"User Id는 20byte까지 입력이 가능합니다.","max":20},
			        "jenDesc":{"type":"length","msg":"Jenkins 설명은 2000byte까지 입력이 가능합니다.","max":2000} 
			};
			
globals_guideChkFn = fnJen1001GuideShow;			

$(document).ready(function() {

	$('#jenNm').focus();
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
		{mstCd: "CMM00001", useYn: "Y", targetObj: "#useCd", comboType:"OS"} // 사용유무
	];
	//공통코드 채우기
	gfnGetMultiCommonCodeDataForm(commonCodeArr , true);
	
	// 유효성 체크
	gfnInputValChk(arrChkObj);
	
	/* 타이틀 변경 및 버튼명 변경, 수정일경우 값 세팅 */
	if('${param.popupGb}' == 'insert'){
		$(".pop_title").text("JENKINS 설정 등록");
		$("#btn_update_popup").text('등록');
	}
	else if('${param.popupGb}' == 'update'){
		
		$(".pop_title").text("JENKINS 설정 수정");
		$("#btn_update_popup").text('수정');
		
		var jenId = '${param.jenId}';
		fnSelectJen1001JobInfo(jenId);
	}
	
	/**
	 * 	젠킨스 기본정보 상세 조회
	 */
 	function fnSelectJen1001JobInfo(jenId){
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JenkinsDetailAjax.do'/>",loadingShow:false}
				,{ "jenId" : jenId });
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
        	//디테일폼 세팅
        	gfnSetData2ParentObj(data.jenInfo, "jen1000PopupFrm");

        	nowJenUsrTok = data.jenInfo.jenUsrTok;
		});
		
		//AJAX 전송
		ajaxObj.send();
	} 
	
	/* 저장버튼 클릭 시 */
	$('#btn_update_popup').click(function() {
		
		/* 필수입력값 체크 공통 호출 */
		var strFormId = "jen1000PopupFrm";
		var strCheckObjArr = ["jenNm", "jenUsrId","jenUsrTok"];
		var sCheckObjNmArr = ["Jenkins name", "USER ID" ,"USER TOKEN KEY" ];
		if(gfnRequireCheck(strFormId, strCheckObjArr, sCheckObjNmArr)){
			return;	
		}
		
		// 등록/수정 전 유효성 체크
		if(!gfnSaveInputValChk(arrChkObj)){
			return false;	
		}	

		fnInsertReqInfoAjax("jen1000PopupFrm");

	});
	
	/* 취소버튼 클릭 시 팝업 창 사라지기*/
	$('#btn_cancle_popup').click(function() {
		
		gfnLayerPopupClose();
	});
});

//jenkins 등록 함수
function fnInsertReqInfoAjax(formId){
	jConfirm("JENKINS를 저장하시겠습니까?", "알림창", function( result ) {
		if( result ){
			fd = new FormData();
			//FormData에 input값 넣기
			gfnFormDataAutoValue('jen1000PopupFrm',fd);
			
			//기본 값과 type 넘기기
			fd.append("type",'${param.popupGb}');
			fd.append("nowJenUsrTok",nowJenUsrTok);
			
			//AJAX 설정
			var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/jen/jen1000/jen1000/saveJen1000JenkinsInfoAjax.do'/>"
						,"contentType":false
						,"processData":false
						,"cache":false}
					,fd);
			//AJAX 전송 성공 함수
			ajaxObj.setFnSuccess(function(data){
				//jenkins 접속 오류 인경우
				if(!gfnIsNull(data.MSG_CD)){
					if(data.MSG_CD=="JENKINS_FAIL"){
						jAlert("설정 정보가 잘못 입력 되었거나, JENKINS 서버에 문제가 있습니다.<br/><br/>입력한 URL, USER, USER TOKEN KEY 를 확인 하시거나, JENKINS 서버를 확인 해주시기 바랍니다.", "알림창");
					}else if(data.MSG_CD=="JENKINS_WORNING_URL"){
						jAlert("허용되지 않는 URL입니다.<br/><br/>입력한 URL를 확인하십시오", "알림창");
					}else{
						jAlert("[jenkins 접속 오류]</br>오류 내용 : "+data.MSG_CD);
					}
					fd = new FormData();
					return false;
				}
		    	
		    	//오류 발생
		    	if(data.errorYn == 'Y'){
		    		toast.push(data.message);
		    		return;
		    	}
		    	
		    	//그리드 새로고침
				fnInJenkinsGridDataSet(jenkinsGrid.page.currentPage,$('form#searchFrm').serialize()+"&"+jenkinsSearchObj.getParam());
				
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

function fnJen1001GuideShow(){
	var mainObj = $(".popup");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["jen1001"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}

</script>

<div class="popup" >
<form id="jen1000PopupFrm" name="jen1000PopupFrm" method="post">
	<input type="hidden" name="popupGb" id="popupGb" value="${param.popupGb}"/>
	<input type="hidden" name="jenId" id="jenId" value="${param.jenId}" />
	<input type="hidden" name="reqStatusCd" id="reqStatusCd" value="01"/>

	<div class="pop_title">JENKINS 설정 등록</div>
	<div class="pop_sub" guide="jenkinsInfo" >
		<div class="pop_menu_row pop_menu_oneRow first_menu_row">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenNm">JENKINS NAME</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<input type="text" title="JENKINS NAME" class="input_txt" name="jenNm" id="jenNm" value="" maxlength="500"  />
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenUrl">JENKINS URL</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<input type="text" title="URL" class="input_txt" name="jenUrl" id="jenUrl" value="" maxlength="500" placeholder="http://, https:// 전체 입력 필요" />
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenUsrId">USER ID</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<input type="text" title="USER ID" class="input_txt" name="jenUsrId" id="jenUsrId" value="" maxlength="20" />
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenUsrTok">USER TOKEN KEY</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<input type="password" title="USER TOKEN KEY" class="input_txt" name="jenUsrTok" id="jenUsrTok" value="" maxlength="50" />
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
			<div class="note_title">JENKINS 설명</div>
			<textarea class="input_note" title="JOB 설명" name="jenDesc" id="jenDesc" rows="7" value="" maxlength="2000"  ></textarea>
		</div>
		<div class="btn_div">
			<div class="button_normal save_btn" id="btn_update_popup"></div>
			<div class="button_normal exit_btn" id="btn_cancle_popup">취소</div>
		</div>
	</div>
</form>
</div>

</html>
