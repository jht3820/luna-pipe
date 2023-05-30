<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html lang="ko">
<title>OpenSoftLab</title>
<script src="<c:url value='/js/common/oslFile.js'/>"></script>
<script src="<c:url value='/js/common/comOslops.js'/>"></script>
<link rel='stylesheet' href='<c:url value='/css/common/fileUpload.css'/>' type='text/css'>
<style>
.layer_popup_box .close_btn{top:12px; width:18px; height:18px; background:url(/images/login/x_white.png) no-repeat}
.layer_popup_box .pop_left, .layer_popup_box .pop_right { height: 54px; }
.required_info { color: red; }

/*익스플로러 적용 위해 !important 추가*/
/* 팝업에 따라 pop_menu_col1, pop_menu_col2 높이 변경 */
.pop_menu_row .pop_menu_col1 { width: 20% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 80% !important; height: 45px !important; }
.pop_menu_row .menu_col1_subStyle { width: 40% !important; }
.pop_menu_row .menu_col2_subStyle { width: 60% !important; }
.pop_sub input[type="password"].input_txt { width:100% !important; height:100%!important; }
#popup_authFrame{display:none;}
/* SVN 수정시 알림 메시지 영역 */
.warning_message{display:none; text-align: left; font-size: 13px;}

/* 소스저장소 종류에따른 show/hide */
.stm2001SvnFrame{display:none;}
.stm2001GitUsrAuthIdFrame{display:none;}
</style>
<script>

globals_guideChkFn = fnStm2001GuideShow;

var fd = new FormData();
//중복 파일 업로드 방지 전역변수
var fileChk = new Array();


//현재 비밀번호 저장
var nowSvnPw = null;
var nowGitPw = null;

// input 유효성
var arrChkObj = {	"repNm":{"type":"length","msg":"저장소 명은 500byte까지 입력이 가능합니다.","max":500},
			        "svnRepUrl":{"type":"length","msg":"URL은 500byte까지 입력이 가능합니다.","max":500},
			        "svnUsrId":{"type":"length","msg":"User ID는 30byte까지 입력이 가능합니다.", "max":30},
			        "svnUsrPw":{"type":"length","msg":"Password는 200byte까지 입력이 가능합니다.", "max":200},
			        "gitRepUrl":{"type":"length","msg":"Repository URL은 500byte까지 입력이 가능합니다.","max":500},
			        "gitUsrId":{"type":"length","msg":"사용자 ID는 30byte까지 입력이 가능합니다.", "max":30},
			        "gitUsrPw":{"type":"length","msg":"Password는 200byte까지 입력이 가능합니다.", "max":200},
			        "repTxt":{"type":"length","msg":"저장소 설명은 1000byte까지 입력이 가능합니다.","max":1000}
				};

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
	var mstCdStrArr = "CMM00001|REP00001|REP00002";
	var strUseYn = 'Y';
	var arrObj = [ $("#useCd"), $("#repTypeCd"), $("#gitUsrAuthTypeCd")];
	var arrComboType = [ ""];
	gfnGetMultiCommonCodeDataForm(mstCdStrArr, strUseYn, arrObj, arrComboType , false);
	
	$("#repNm").focus();
	
	// 유효성 체크
	gfnInputValChk(arrChkObj);
	
	//탭인덱스 부여
	//gfnSetFormAllObjTabIndex(document.getElementById("svn1000PopupFrm"));
	
	/* 타이틀 변경 및 버튼명 변경, 수정일경우 값 세팅 */
	if('${param.popupGb}' == 'insert'){
		$(".pop_title").text("저장소 등록");
		$("#btn_update_popup").text('등록');
	}
	else if('${param.popupGb}' == 'update'){
		/* $("#popup_authFrame").show();
		//역할 목록 그리드 세팅
		fnAuthListGrid();
		 */
		$(".pop_title").text("저장소 수정");
		$("#btn_update_popup").text('수정');
		
		var repId = '${param.repId}';
		fnSelectSvn1001RepInfo(repId);
		
		// 해당 소스저장소의 리비전이 요구사항에 배정된 건수
		var assignCnt = '${param.assignCnt}';
		if(assignCnt > 0){
			// 요구사항에 리비전 배정되어있을 경우 URL 수정불가처리
			$("#svnRepUrl").attr("readonly", true);
			// 알림 메시지 show
			$("#svnRepoUpdateMsg").show();
			$(".pop_menu_row").last().css("margin-bottom", "14px");
			// 팝업 높이 변경
			$(".layer_popup_box").height(578);
		}
	}
	
	/* 저장버튼 클릭 시 */
	$('#btn_update_popup').click(function() {
		
		/* 필수입력값 체크 공통 호출 */
		var strFormId = "svn1000PopupFrm";
		var strCheckObjArr = ["repNm"];
		var sCheckObjNmArr = ["저장소 명"];
		
		//소스저장소 종류에 따라 필수 값 분기
		var repTypeCd = $("#repTypeCd").val();
		
		//git
		if(repTypeCd == "01" || repTypeCd == "03"){
			strCheckObjArr = strCheckObjArr.concat(["gitRepUrl"]);
			sCheckObjNmArr = sCheckObjNmArr.concat(["Repository URL"]);
			
			//사용자 인증 방식
			var gitUsrAuthTypeCd = $("#gitUsrAuthTypeCd").val();
			//토큰
			if(gitUsrAuthTypeCd == "01"){
				strCheckObjArr = strCheckObjArr.concat(["gitUsrTk"]);
				sCheckObjNmArr = sCheckObjNmArr.concat(["사용자 토큰"]);
			}
			//id/pw
			else if(gitUsrAuthTypeCd == "02"){
				strCheckObjArr = strCheckObjArr.concat(["gitUsrId","gitUsrPw"]);
				sCheckObjNmArr = sCheckObjNmArr.concat(["사용자 ID" , "PASSWORD"]);
			}
		}
		//svn
		else if(repTypeCd == "02"){
			strCheckObjArr = strCheckObjArr.concat(["svnRepUrl","svnUsrId","svnUsrPw"]);
			sCheckObjNmArr = sCheckObjNmArr.concat(["URL" ,"USER" , "PASSWORD"]);
		}
		if(gfnRequireCheck(strFormId, strCheckObjArr, sCheckObjNmArr)){
			return;	
		}
		
		var formObj = document.getElementById("svn1000PopupFrm");
		
		// 등록/수정 전 유효성 체크
		if(!gfnSaveInputValChk(arrChkObj)){
			return false;	
		}
		
		fnInsertReqInfoAjax("svn1000PopupFrm");

	});
	
	/* 취소버튼 클릭 시 팝업 창 사라지기*/
	$('#btn_cancle_popup').click(function() {
		gfnLayerPopupClose();
	});

	//소스저장소 종류 변경
	$("#repTypeCd").on("change", function(){
		fnRepTypeCdChg(this.value);
	});
	
	//git 인증 방식 변경
	$("#gitUsrAuthTypeCd").on("change", function(){
		fnGitUsrAuthTypeCdChg(this.value);
	});
	
});

	//소스저장소 종류 변경 함수
	function fnRepTypeCdChg(chgValue){
		//git
		if(chgValue == "01"){
			$(".stm2001GitFrame").show();
			$(".stm2001SvnFrame").hide();
		}
		//svn
		else if(chgValue == "02"){
			$(".stm2001SvnFrame").show();
			$(".stm2001GitFrame").hide();
		}else if(chgValue == "03"){
			$(".stm2001GitFrame").show();
			$(".stm2001SvnFrame").hide();
		}
	}
	//git 인증 방식 변경 함수
	function fnGitUsrAuthTypeCdChg(chgValue){
		//사용자 토큰
		if(chgValue == "01"){
			$(".stm2001GitUsrAuthTkFrame").show();
			$(".stm2001GitUsrAuthIdFrame").hide();
		}
		//사용자 id/pw
		else if(chgValue == "02"){
			$(".stm2001GitUsrAuthIdFrame").show();
			$(".stm2001GitUsrAuthTkFrame").hide();
		}
	}
	/**
	 * 	소스저장소 디테일 정보 조회
	 */
 	function fnSelectSvn1001RepInfo(repId){
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/stm/stm2000/stm2000/selectStm2000InfoAjax.do'/>"}
				,{ "repId" : repId });
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			data = JSON.parse(data);
        	//디테일폼 세팅
        	gfnSetData2ParentObj(data.repInfo, "svn1000PopupFrm");
        	
        	var repTypeCd = data.repInfo.repTypeCd;
        	
        	//소스저장소 종류
        	fnRepTypeCdChg(repTypeCd);
        	if(repTypeCd == "01" || repTypeCd == "03"){
	        	//git 인증 방식
	        	fnGitUsrAuthTypeCdChg(data.repInfo.gitUsrAuthTypeCd);
        	}

        	nowSvnPw = data.repInfo.svnUsrPw;
        	nowGitPw = data.repInfo.gitUsrPw;
		});
		
		//AJAX 전송 오류 함수
		ajaxObj.setFnError(function(xhr, status, err){
			data = JSON.parse(data);
			jAlert(data.message, "알림창");
		});
		
		//AJAX 전송
		ajaxObj.send();
	} 
	
	//소스저장소 등록 함수
	function fnInsertReqInfoAjax(formId){
		//FormData에 input값 넣기
		gfnFormDataAutoValue('svn1000PopupFrm',fd);
		
		//기존 비밀번호 넘기기
		fd.append("nowSvnPw",nowSvnPw);
		fd.append("nowGitPw",nowGitPw);
		
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/stm/stm2000/stm2000/saveSvn2000InfoAjax.do'/>"
					,"contentType":false
					,"processData":false
					,"cache":false}
				,fd);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			data = JSON.parse(data);
	    	//로딩바 숨김
	    	gfnShowLoadingBar(false);
	    	
	    	//코멘트 등록 실패의 경우 리턴
	    	if(data.saveYN == 'N'){
	    		jAlert(data.message, '알림창');
	    		fd = new FormData();
	    		return;
	    	}
	    	
	    	//그리드 새로고침
			fnInGridListSet(firstGrid.page.currentPage,$('form#searchFrm').serialize()+"&"+mySearch.getParam());
	    	
			jAlert(data.message, '알림창');
			gfnLayerPopupClose();
		});
		
		//AJAX 전송 오류 함수
		ajaxObj.setFnError(function(xhr, status, err) {
			jAlert("소스저장소 등록에 실패하였습니다.", "알림창");
    		fd = new FormData();
    		return;
		});

		//AJAX 전송
		ajaxObj.send();
	}

//역할 그룹 그리드
function fnAuthListGrid(){
	authGrid = new ax5.ui.grid();
 
    authGrid.setConfig({
        target: $('[data-ax5grid="auth-grid"]'),
        sortable:true,
        showRowSelector: true,
        header: {align:"center",columnHeight: 30},
        columns: [
         {key: "authGrpNm", label: "역할그룹 명", width: 160, align: "center"},
         {key: "usrTypNm", label: "사용자유형", width: 120, align: "center"},
         {key: "authGrpDesc", label: "역할그룹 설명", width: 225, align: "center"},
        ],
        body: {
            align: "center",
            columnHeight: 30
        },
        page:{display:false}
    });
}

function fnStm2001GuideShow(){
	var mainObj = $(".popup");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["stm2001"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}

</script>

<div class="popup" >
<form id="svn1000PopupFrm" name="svn1000PopupFrm" method="post">
	<input type="hidden" name="popupGb" id="popupGb" value="${param.popupGb}"/>
	<input type="hidden" name="repId" id="repId" value="${param.repId}" />
	<input type="hidden" name="prjId" id="prjId" value="${sessionScope.selPrjId}"/>
	<input type="hidden" name="reqStatusCd" id="reqStatusCd" value="01"/>

	<div class="pop_title">저장소 등록</div>
	<div class="pop_sub">
		<div class="pop_menu_row pop_menu_oneRow first_menu_row">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="repTypeCd">저장소 종류</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<span class="search_select">
					<select class="select_useCd" name="repTypeCd" id="repTypeCd" value="" style="height:100%; width:36%;"></select>
				</span>
			</div>
		</div>
		
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="repNm">저장소 명</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<input type="text" title="저장소 명" class="input_txt" name="repNm" id="repNm" value="" maxlength="500" />
			</div>
		</div>
		<div class="stm2001SvnFrame">
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="svnRepUrl">URL</label><span class="required_info">&nbsp;*</span></div>
				<div class="pop_menu_col2 pop_oneRow_col2" guide="svnUrl" >
					<input type="text" title="URL" class="input_txt" name="svnRepUrl" id="svnRepUrl" value=""  maxlength="500"  />
				</div>
			</div>
			<div class="pop_menu_row">
				<div class="pop_menu_col1 menu_col1_subStyle"><label for="svnUsrId">USER</label><span class="required_info">&nbsp;*</span></div>
				<div class="pop_menu_col2 menu_col2_subStyle" guide="svnUser" ><input type="text" title="USER" class="input_txt" name="svnUsrId" id="svnUsrId" value="" maxlength="30" /></div>
			</div>
			<div class="pop_menu_row">
				<div class="pop_menu_col1 menu_col1_subStyle pop_menu_col1_right"><label for="svnUsrPw">PASSWORD</label><span class="required_info">&nbsp;*</span></div>
				<div class="pop_menu_col2 menu_col2_subStyle" guide="svnPassword" ><input type="password" title="PASSWORD" class="input_txt" name="svnUsrPw" id="svnUsrPw" value="" maxlength="50" /></div>
			</div>
			<div class="warning_message required_info" id="svnRepoUpdateMsg">* 소스저장소의 리비전이 요구사항에 배정되어 있어 URL을 수정할 수 없습니다.</div>
		</div>
		<div class="stm2001GitFrame">
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="gitRepUrl">Repository URL</label><span class="required_info">&nbsp;*</span></div>
				<div class="pop_menu_col2 pop_oneRow_col2" guide="gitRepUrl" >
					<input type="text" title="URL" class="input_txt" name="gitRepUrl" id="gitRepUrl" value=""  maxlength="500"  />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="gitUsrAuthTypeCd">인증 방식</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 pop_oneRow_col2">
						<span class="search_select">
							<select class="select_useCd" name="gitUsrAuthTypeCd" id="gitUsrAuthTypeCd" value="" style="height:100%; width:36%;"></select>
						</span>
					</div>
				</div>
			<div class="stm2001GitUsrAuthTkFrame">
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="gitUsrTk">사용자 토큰</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 pop_oneRow_col2" guide="gitUsrTk" >
						<input type="text" title="사용자 토큰" class="input_txt" name="gitUsrTk" id="gitUsrTk" value=""  maxlength="500"  />
					</div>
				</div>
			</div>
			<div class="stm2001GitUsrAuthIdFrame">
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle"><label for="svnUsrId">사용자 ID</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle" guide="gitUser" ><input type="text" title="사용자 ID" class="input_txt" name="gitUsrId" id="gitUsrId" value="" maxlength="30" /></div>
				</div>
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle pop_menu_col1_right"><label for="svnUsrPw">PASSWORD</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle" guide="gitPassword" ><input type="password" title="PASSWORD" class="input_txt" name="gitUsrPw" id="gitUsrPw" value="" maxlength="50" /></div>
				</div>
			</div>
		</div>
		<div class="pop_menu_row pop_menu_oneRow">
			<div class="pop_menu_col1 pop_oneRow_col1"><label for="useCd">사용여부</label><span class="required_info">&nbsp;*</span></div>
			<div class="pop_menu_col2 pop_oneRow_col2">
				<span class="search_select">
					<select class="select_useCd" name="useCd" id="useCd" value="" style="height:100%; width:36%;"></select>
				</span>
			</div>
		</div>
		<div class="pop_note" style="margin-bottom:0px;">
			<div class="note_title">저장소 설명</div>
			<textarea class="input_note" title="저장소 설명" name="repTxt" id="repTxt" rows="7" value="" maxlength="1000"   ></textarea>
		</div>
		<div id="popup_authFrame">
			<div class="pop_note" style="margin-bottom:0px;">
				<div class="note_title">
					<div class="note_leftBtn">접근 허용 역할 목록</div>
					<div class="note_rightBtn">
						<div class="button_normal note_btn" id="btn_insert_auth">추가</div>
						<div class="button_normal note_btn" id="btn_update_auth">삭제</div>
					</div>
				</div>
				<div data-ax5grid="auth-grid" data-ax5grid-config="{}" style="height: 100px;"></div>	
			</div>
		</div>
		
		<div class="btn_div">
			<div class="button_normal save_btn" id="btn_update_popup">등록</div>
			<div class="button_normal exit_btn" id="btn_cancle_popup">취소</div>
		</div>
	</div>
</form>
</div>

</html>
