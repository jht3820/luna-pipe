<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html lang="ko">
<title>OpenSoftLab</title>
<script type="text/javascript" src="/js/ztree/jquery.ztree.all.min.js"></script>
<style>
.layer_popup_box .close_btn{top:12px; width:18px; height:18px; background:url(/images/login/x_white.png) no-repeat}
.layer_popup_box .pop_left, .layer_popup_box .pop_right { height: 54px; }
.required_info { color: red; }

/* git 일 때 팝업 사이즈 강제 수정*/
.rep1001-layer_popup_box--size {height: 635px !important;}

/*익스플로러 적용 위해 !important 추가*/
/* 팝업에 따라 pop_menu_col1, pop_menu_col2 높이 변경 */
.pop_menu_row .pop_menu_col1 { width: 20% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 80% !important; height: 45px !important; }
.pop_menu_row .menu_col1_subStyle { width: 40% !important; }
.pop_menu_row .menu_col2_subStyle { width: 60% !important; }
.pop_sub input[type="password"].input_txt { width:100% !important; height:100%!important; }
/* SVN 수정시 알림 메시지 영역 */
.warning_message{display:none; text-align: left; font-size: 13px;}

.pop_dpl_div_sub.divDetail_sub_left{width: 590px;float: left;margin-right: 10px;/* height: 448px; */}
.pop_dpl_div_sub.divDetail_sub_right {width: 400px;float: left;position: relative;/* height: 448px; */}

/* 소스저장소 종류에따른 show/hide */
/* .rep1001GitFrame{display:none;} */
.rep1001SvnFrame{display:none;}
.rep1001GitUsrAuthIdFrame{display:none;}
.button_normal.button_col {
    width: 90%;
    height: 34px;
    line-height: 34px;
}
ul#repDetailTree {
    border: 1px solid #ccc;
    border-radius: 0.185rem;
    padding: 5px;
    float: left;
    width: calc(100% - 10px);
    margin: 5px 5px 0 5px;
    height: 378px;
	overflow: scroll;
}
.treeNodeUrlFrame {
    height: 30px;
    line-height: 30px;
    display: inline-block;
    width: 100%;
    padding: 0 5px;
}
input#selTreeNodeUrl{background-color: #fff !important;}
.pop_menu_btn_row {
    background: #f9f9f9;
    border: 1px solid #ccc;
    padding: 6px 5px;
    margin: 2px 5px;
}
</style>
<script>

globals_guideChkFn = fnRep1001GuideShow;

var fd = new FormData();

//현재 비밀번호 저장
var nowSvnPw = null;
var nowGitPw = null;
var nowGitTk = null;
var nowDplPw = null;

//zTree
var zTreeRep1001;

//접속 체크 플래그
var repConnCheckFlag = false;

//url, id, pw 변경 데이터 확인값
var chgDataFlag = {
		repTypeCd : "",
		svnRepUrl: "",
		svnUsrId: "",
		svnUsrId: "",
		gitRepUrl : "",
		gitUsrId : "",
		gitUsrPw : "",
		gitUsrTk : ""
};

//수정일 때 체크로 사용 : 원래 정보
var oriRepInfo = null;

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
	// 팝업 공통코드 select 세팅
	var commonCodeArr = [
		{mstCd: "REP00001", useYn: "Y",targetObj: "#repTypeCd", comboType:"OS"}, // 저장소 유형
		{mstCd: "REP00002", useYn: "Y",targetObj: "#gitUsrAuthTypeCd", comboType:"OS"}, // git 인증 타입
		{mstCd: "CMM00001", useYn: "Y",targetObj: "#useCd", comboType:"OS"} // 사용유무
	];
	//공통코드 채우기
	var ajaxDone = gfnGetMultiCommonCodeDataForm(commonCodeArr , false);
	ajaxDone.done(function(){
		//소스저장소 종류 변경
		$("#repTypeCd").trigger("change");
	});
	$("#repNm").focus();
	
	// 유효성 체크
	gfnInputValChk(arrChkObj);
	
	//탭인덱스 부여
	//gfnSetFormAllObjTabIndex(document.getElementById("rep1001PopupFrm"));
	
	/* 타이틀 변경 및 버튼명 변경, 수정일경우 값 세팅 */
	if('${param.popupGb}' == 'insert'){
		$(".pop_title").text("저장소 등록");
		$("#btn_update_popup").text('등록');
	}
	else if('${param.popupGb}' == 'update'){
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
		var strFormId = "rep1001PopupFrm";
		var strCheckObjArr = ["repNm"];
		var sCheckObjNmArr = ["저장소 명"];
		
		//수정일 때
		if('${param.popupGb}' == 'update'){
			//저장소 유형 변경, url은 변경 금지로, 강제 변경되었을 수 있으므로 여기서 초기화
			$("#repTypeCd").val(oriRepInfo.repTypeCd).attr("disabled",true).trigger("change");
        	$("#gitRepUrl").val(oriRepInfo.gitRepUrl).attr("readonly",true);
        	$("#svnRepUrl").val(oriRepInfo.svnRepUrl).attr("readonly",true);
        	$("#dplRepUrl").val(oriRepInfo.dplRepUrl).attr("readonly",true);
		}
		
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
		
		//Deploy 사용여부에따라 필수 추가
		var deployInsertChkBoxVal = document.getElementById("deployInsertChkBox").checked;
		if(deployInsertChkBoxVal){
			strCheckObjArr = strCheckObjArr.concat(["dplRepUrl","dplUsrId","dplUsrPw"]);
			sCheckObjNmArr = sCheckObjNmArr.concat(["Deploy URL" ,"Deploy USER" , "Deploy PASSWORD"]);
		}
		
		if(gfnRequireCheck(strFormId, strCheckObjArr, sCheckObjNmArr)){
			return;	
		}
		
		var formObj = document.getElementById("rep1001PopupFrm");
		
		// 등록/수정 전 유효성 체크
		if(!gfnSaveInputValChk(arrChkObj)){
			return false;	
		}
		
		fnInsertReqInfoAjax("rep1001PopupFrm");

	});
	
	/* 취소버튼 클릭 시 팝업 창 사라지기*/
	$('#btn_cancle_popup').click(function() {
		gfnLayerPopupClose();
	});

	//소스저장소 종류 변경
	$("#repTypeCd").on("change", function(){
		fnRepTypeCdChg(this.value);
		
		//접속 중인경우
		if(repConnCheckFlag){
			//key값
			var key = $(this).attr("id");
			var value = this.value;
		
			//이전 데이터와 변경점 있는지 체크
			if(chgDataFlag[key] != value){
				//mask 보이기
			    $("#repTreeListMask").show();
				//트리 제거
				zTreeRep1001.destroy();
				//경로내용 제거
				$("#selTreeNodeUrl").val("");
			}
		}
	});
	
	//git 인증 방식 변경
	$("#gitUsrAuthTypeCd").on("change", function(){
		fnGitUsrAuthTypeCdChg(this.value);
		
		//접속 중인경우
		if(repConnCheckFlag){
			//key값
			var key = $(this).attr("id");
			var value = this.value;
		
			//이전 데이터와 변경점 있는지 체크
			if(chgDataFlag[key] != value){
				//mask 보이기
			    $("#repTreeListMask").show();
				//트리 제거
				zTreeRep1001.destroy();
				//경로내용 제거
				$("#selTreeNodeUrl").val("");
			}
		}
	});
	
	//url, user, pw 입력하는 경우 mask 생성
	$("#svnRepUrl, #svnUsrId, #svnUsrPw, #gitRepUrl, #gitUsrId, #gitUsrPw, #gitUsrTk").blur(function(){
		//접속 중인경우
		if(repConnCheckFlag){
			//key값
			var key = $(this).attr("id");
			var value = this.value;
		
			//이전 데이터와 변경점 있는지 체크
			if(chgDataFlag[key] != value){
				//mask 보이기
			    $("#repTreeListMask").show();
				//트리 제거
				zTreeRep1001.destroy();
				//경로내용 제거
				$("#selTreeNodeUrl").val("");
			}
		}
	});
	
	//접속 체크
	$("#btnRepConnCheck").click(function(){
		//현재 값 넣기
		chgDataFlag["svnRepUrl"] = $("#svnRepUrl").val();
		chgDataFlag["svnUsrId"] = $("#svnUsrId").val();
		chgDataFlag["svnUsrPw"] = $("#svnUsrPw").val();
		
		chgDataFlag["gitRepUrl"] = $("#gitRepUrl").val();
		chgDataFlag["gitUsrId"] = $("#gitUsrId").val();
		chgDataFlag["gitUsrPw"] = $("#gitUsrPw").val();
		chgDataFlag["gitUsrTk"] = $("#gitUsrTk").val();

		chgDataFlag["repTypeCd"] = $("#repTypeCd").val();
		chgDataFlag["gitUsrAuthTypeCd"] = $("#gitUsrAuthTypeCd").val();
		
		selectRep1001RepTreeSetting();
	})
});

	//소스저장소 종류 변경 함수
	function fnRepTypeCdChg(chgValue){
		//github, gitlab
		if(chgValue == "01" || chgValue == "03"){
			$(".rep1001GitFrame").show();
			$(".rep1001SvnFrame").hide();
			
			//사용여부 한줄 처리 및 스타일 변경
			$("#useCdDiv").addClass("pop_menu_oneRow");
			$("#useCdDiv > div:first-child").removeClass("menu_col1_subStyle pop_menu_col1_right").addClass("pop_oneRow_col1");
			$("#useCdDiv > div:last-child").removeClass("menu_col2_subStyle").addClass("pop_oneRow_col2");
			
			//인증 방식 사용자 토큰으로 고정
			$("#gitUsrAuthTypeCd").val("01").attr("disabled",true).trigger("change");
			
			//팝업 사이즈 변경
			$("#rep1001PopupFrm").parents(".layer_popup_box").addClass("rep1001-layer_popup_box--size");
		}
		//svn
		else if(chgValue == "02"){
			$(".rep1001SvnFrame").show();
			$(".rep1001GitFrame").hide();
			
			//사용여부 한줄 처리 및 스타일 변경
			$("#useCdDiv").removeClass("pop_menu_oneRow");
			$("#useCdDiv > div:first-child").addClass("menu_col1_subStyle pop_menu_col1_right").removeClass("pop_oneRow_col1");
			$("#useCdDiv > div:last-child").addClass("menu_col2_subStyle").removeClass("pop_oneRow_col2");
			
			//인증 방식 사용자 토큰 고정 해제
			$("#gitUsrAuthTypeCd").attr("disabled",false);
			
			//팝업 사이즈 변경
			$("#rep1001PopupFrm").parents(".layer_popup_box").removeClass("rep1001-layer_popup_box--size");
		}
	}
	
	//git 인증 방식 변경 함수
	function fnGitUsrAuthTypeCdChg(chgValue){
		//사용자 토큰
		if(chgValue == "01"){
			$(".rep1001GitUsrAuthTkFrame").show();
			$(".rep1001GitUsrAuthIdFrame").hide();
		}
		//사용자 id/pw
		else if(chgValue == "02"){
			//비권장이며, 접근 권한에서 현재 에러가 나기 때문에 강제 토큰으로 변경
			//svn이 아니면(01, 03)
			if($("#repTypeCd").val() != "02"){
				//인증 방식 사용자 토큰으로 고정
				$("#gitUsrAuthTypeCd").val("01").attr("disabled",true).trigger("change");
			}
		}
	}
	/**
	 * 	소스저장소 디테일 정보 조회
	 */
 	function fnSelectSvn1001RepInfo(repId){
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000InfoAjax.do'/>"}
				,{ "repId" : repId });
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			oriRepInfo = data.repInfo;
        	//디테일폼 세팅
        	gfnSetData2ParentObj(oriRepInfo, "rep1001PopupFrm");
        	
        	var repTypeCd = oriRepInfo.repTypeCd;
        	
        	//소스저장소 종류 변경
			$("#repTypeCd").val(repTypeCd).trigger("change");
        	
        	//Deploy 사용 여부
        	var dplUseCd = oriRepInfo.dplUseCd;
        	//Deploy 값 있는 경우
        	//임시) repTypeCd 가 02 svn일 때
        	if(!gfnIsNull(dplUseCd) && repTypeCd == "02"){
        		
        		//Deploy 사용 여부
	        	var dplUseCdObj = document.getElementById("deployInsertChkBox");
	        	if(dplUseCd == "01"){
	        		dplUseCdObj.checked = true;
	        	}else{
	        		dplUseCdObj.checked = false;
	        	}
        		fnDeployInsertChg(dplUseCdObj);
        	}

        	nowSvnPw = oriRepInfo.svnUsrPw;
        	nowGitPw = oriRepInfo.gitUsrPw;
        	nowGitTk = oriRepInfo.gitUsrTk;
        	nowDplPw = oriRepInfo.dplUsrPw;
        	
        	//저장소 유형 변경, url 변경 금지
        	$("#repTypeCd").attr("disabled",true);
        	$("#gitRepUrl").attr("readonly",true);
        	$("#svnRepUrl").attr("readonly",true);
        	
        	//기존 정보가 없었다면
        	if(gfnIsNull(oriRepInfo.dplRepUrl)){
	        	$("#dplRepUrl").attr("readonly",false);
        	}else{
	        	$("#dplRepUrl").attr("readonly",true);
        	}
		});
		
		//AJAX 전송
		ajaxObj.send();
	} 
	
	//소스저장소 등록 함수
	function fnInsertReqInfoAjax(formId){
		var reDisabled = false;
		if($("#gitUsrAuthTypeCd").attr("disabled") == "disabled"){
			$("#gitUsrAuthTypeCd").attr("disabled", false);
			reDisabled = true;
		}
		//수정일 때
		if('${param.popupGb}' == 'update'){
			$("#repTypeCd").attr("disabled", false);
        	$("#gitRepUrl").attr("readonly", false);
        	$("#svnRepUrl").attr("readonly", false);
        	$("#dplRepUrl").attr("readonly", false);
		}
		
		//FormData에 input값 넣기
		gfnFormDataAutoValue('rep1001PopupFrm',fd);
		
		//disabled 다시하기
		if(reDisabled){
			$("#gitUsrAuthTypeCd").attr("disabled", true);
			reDisabled = false;
		}
		//수정일 때
		if('${param.popupGb}' == 'update'){
			$("#repTypeCd").attr("disabled", true);
        	$("#gitRepUrl").attr("readonly", true);
        	$("#svnRepUrl").attr("readonly", true);
        	$("#dplRepUrl").attr("readonly", true);
		}
		
		//기존 비밀번호 넘기기
		fd.append("nowSvnPw",nowSvnPw);
		fd.append("nowGitPw",nowGitPw);
		fd.append("nowGitTk",nowGitTk);
		fd.append("nowDplPw",nowDplPw);
		
		//depoy체크박스 값
		var deployInsertChkBox = document.getElementById("deployInsertChkBox").checked;
		var dplUseCd = "02";
		//deploy 사용 여부 값
		if(deployInsertChkBox){
			dplUseCd = "01";
		}
		//deploy 사용 여부 넣기
		fd.append("dplUseCd",dplUseCd);
		
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/saveRep1000InfoAjax.do'/>"
					,"contentType":false
					,"processData":false
					,"cache":false}
				,fd);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
	    	//로딩바 숨김
	    	gfnShowLoadingBar(false);
	    	
	    	//코멘트 등록 실패의 경우 리턴
	    	if(data.saveYN == 'N'){
	    		jAlert(data.message, '알림창');
	    		fd = new FormData();
	    		return;
	    	}
	    	
	    	//그리드 새로고침
			fnInGridListSet(repGridObj.page.currentPage,$('form#searchFrm').serialize()+"&"+repSearchObj.getParam());
	    	
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
	
	function fnRep1001GuideShow(){
		var mainObj = $(".popup");
		
		//mainObj가 없는경우 false return
		if(mainObj.length == 0){
			return false;
		}
		//guide box setting
		var guideBoxInfo = globals_guideContents["rep1001"];
		gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
	}
	
	
	//repository 목록 트리 세팅하기
	function selectRep1001RepTreeSetting(){
		
		//svn url, id, password
		var svnRepUrl = chgDataFlag["svnRepUrl"];
		var svnUsrId = chgDataFlag["svnUsrId"];
		var svnUsrPw = chgDataFlag["svnUsrPw"];
		//git url, token
		var gitRepUrl = chgDataFlag["gitRepUrl"];
		var gitUsrId = chgDataFlag["gitUsrId"];
		var gitUsrPw = chgDataFlag["gitUsrPw"];
		var gitUsrTk = chgDataFlag["gitUsrTk"];
		
		var repTypeCd = chgDataFlag["repTypeCd"];
		var gitUsrAuthTypeCd = chgDataFlag["gitUsrAuthTypeCd"];
		
		//svn
		if(repTypeCd == "02"){
			//값이 없는 경우 중지
			if(gfnIsNull(svnRepUrl)){
				jAlert("SVN URL값을 입력해주세요.","알림");
				return false;
			}
			if(gfnIsNull(svnUsrId)){
				jAlert("SVN 사용자 ID값을 입력해주세요.","알림");
				return false;
			}
			else if(gfnIsNull(svnUsrPw)){
				jAlert("SVN 사용자 비밀번호 값을 입력해주세요.","알림");
				return false;
			}
		}
		//github, gitlab
		else{
			//값이 없는 경우 중지
			if(gfnIsNull(gitRepUrl)){
				jAlert("GIT URL값을 입력해주세요.","알림");
				return false;
			}
			//토큰 사용일 때
			if(gitUsrAuthTypeCd == "01"){
				if(gfnIsNull(gitUsrTk)){
					jAlert("GIT 사용자 토큰 값을 입력해주세요.","알림");
					return false;
				}
			}
			//id/pw 사용일 때
			else{
				if(gfnIsNull(gitUsrId)){
					jAlert("GIT 사용자 ID 값을 입력해주세요.","알림");
					return false;
				}
				if(gfnIsNull(gitUsrPw)){
					jAlert("GIT 사용자 비밀번호 값을 입력해주세요.","알림");
					return false;
				}
			}
		}
		
		//파라미터
		var param = {
				"svnRepUrl": svnRepUrl,
				"svnUsrId": svnUsrId,
				"svnUsrPw": svnUsrPw,
				"nowSvnPw": nowSvnPw,
				"gitRepUrl" : gitRepUrl,
				"gitUsrTk" : gitUsrTk,
				"nowGitTk" : nowGitTk,
				"repTypeCd": repTypeCd,
				"gitUsrAuthTypeCd" : gitUsrAuthTypeCd,
				"type": '${param.popupGb}'
			   };
	
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1001RepTreeListAjax.do'/>","loadingShow":true}
				, param );
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			if(data.MSG_CD =="SVN_EXCEPTION"){
				jAlert("소스저장소 접근 중 오류가 발생했습니다.","알림");
				return false;
			}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){
				jAlert("소스저장소에 접근이 불가능한 사용자 정보입니다.","알림");
				return false;
			}
			
			//job tree setting
		    var setting = {
	    		// zTree binding data key 설정
		        data: {
		        	key: {
						name: "name"
					},
		            simpleData: {
		                enable: true,
		                idKey: "id",
						pIdKey: "pId",
		            }
		        },
		        // 동적 트리 설정
		        async: {
					enable: true, // async 사용여부 (true:사용, false:미사용)
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					url:"<c:url value='/rep/rep1000/rep1000/selectRep1001RepTreeListAjax.do'/>",
					autoParam:["id", "path"],	// 노드의 값을 서버로 보낼경우 배열형식으로 autoParam에 세팅
					otherParam: param,  // 노드의 값을 제외한 다른 값을 서버로 보낼 경우 otherParam에 세팅
					dataType: "json",
					dataFilter: fnTreeFilter	// 데이터 조회 후 처리할 필터 function, async 사용시 dataFilter는 반드시 지정해야 한다.
				},
				
				callback: {
					onAsyncError: fnAsyncError,
					onClick: function(event, treeId, treeNode){
						$("#selTreeNodeUrl").val(decodeURIComponent(treeNode.urlStr));
					}
				}
		    };
			
			//job list
			var list = data.list;
			
		    $.each(list, function(idx, obj){
				if(obj["type"] == 0 || obj["type"] == "dir"){
					obj.isParent = true;
				}else{
					obj.isParent = false;
				}
			});
		    
		    // zTree 초기화
		    zTreeRep1001 = $.fn.zTree.init($("#repDetailTree"), setting, list);
		    
		    // expandAll(false)를 추가해야 트리의 폴더를 한번 클릭 시 하위 메뉴가 보여진다.
		    // 추가하지 않을 경우 두번 클릭을 해야 폴더가 펼쳐진다.
		    zTreeRep1001.expandAll(false);
		    
		    //mask 감추기
		    $("#repTreeListMask").hide();
		    
		    //접속 중 값 변경
		    repConnCheckFlag = true;
		});
	
		//AJAX 전송
		ajaxObj.send();
	}
	
	/*
	 * 동적트리 조회 실패시 처리
	 */
	function fnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown){
		// 조회 실패 메시지 출력
	   	toast.push("하위 디렉토리 조회에 실패하였습니다.");
	}
	
	/*
	* [+] 아이콘 클릭 또는 더블클릭하여 트리 확장시 조회된 결과에 대한 처리를 한다.
	*
	* @param treeId : 트리 ID
	* @param parentNode : 트리에서 [+]아이콘 클릭 또는 더블클릭한 노드
	* @param result : 동적조회 결과값
	*/
	function fnTreeFilter(treeId, parentNode, result) {
	 	
		// 조회된 하위 조직 목록
	 	var childNodes = result.list;
		// filter에서 모든 자식 노드를 부모형(폴더 아이콛)으로 변경한다.
		// 해당 옵션 추가해야  트리의  [+] 아이콘 클릭 시 한번에 트리가 펼쳐진다. 
		$.each(childNodes, function(idx, node){
			// 트리 노드가 부모형이 아닐 경우
			if(node["type"] == 0 || node["type"] == "dir"){
				node.isParent = true;
			}
			zTreeRep1001.updateNode(node);
		});
		// 선택한 노드의 자식 노드를 리턴하면 자동으로 트리에 자식 노드가 추가된다.
		return childNodes;
	}
	
	//deploy 정보 입력 체크박스 제어
	function fnDeployInsertChg(thisObj){
		//체크 처리
		if(thisObj.checked){
			$("#repDplInputMask").hide();
		}
		//체크 해제
		else{
			$("#repDplInputMask").show();
			//inputerror 있는 경우 제거 하기
			$(".rep1001DeployFrame input.inputError").removeClass("inputError");
		}
		
	}
</script>

<div class="popup" >
<form id="rep1001PopupFrm" name="rep1001PopupFrm" method="post">
	<input type="hidden" name="popupGb" id="popupGb" value="${param.popupGb}"/>
	<input type="hidden" name="repId" id="repId" value="${param.repId}" />
	<input type="hidden" name="empId" id="empId" value="${param.empId}" />
	<input type="hidden" name="reqStatusCd" id="reqStatusCd" value="01"/>
	<!-- <input type="hidden" name="repTypeCd" id="repTypeCd" value="02"/> -->

	<div class="pop_title">저장소 등록</div>
	<div class="pop_sub">
		<div class="pop_dpl_div_sub divDetail_sub_left">
			<div class="pop_menu_row pop_menu_oneRow first_menu_row">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="repNm">저장소 명</label><span class="required_info">&nbsp;*</span></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="저장소 명" class="input_txt" name="repNm" id="repNm" value="" maxlength="500" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for=repTypeCd>저장소 유형</label><span class="required_info">&nbsp;*</span></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<span class="search_select">
						<select class="select_useCd" name="repTypeCd" id="repTypeCd" value="01" style="height:100%;"></select>
					</span>
				</div>
			</div>
			<div class="rep1001SvnFrame">
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="svnRepUrl">URL</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 pop_oneRow_col2" guide="svnUrl" >
						<input type="text" title="URL" class="input_txt" name="svnRepUrl" id="svnRepUrl" value=""  maxlength="500"  />
					</div>
				</div>
				<!-- 
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="svnBrcPath">Branche 생성 경로</label></div>
					<div class="pop_menu_col2 pop_oneRow_col2" guide="svnBrcPath" >
						<input type="text" title="Branche 생성 경로" class="input_txt" name="svnBrcPath" id="svnBrcPath" value=""  maxlength="500"  />
					</div>
				</div>
				 -->
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle"><label for="svnUsrId">USER</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle" guide="svnUser" ><input type="text" title="USER" class="input_txt" name="svnUsrId" id="svnUsrId" value="" maxlength="30" /></div>
				</div>
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle pop_menu_col1_right"><label for="svnUsrPw">PASSWORD</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle" guide="svnPassword" ><input type="password" title="PASSWORD" class="input_txt" name="svnUsrPw" id="svnUsrPw" value="" maxlength="50" /></div>
				</div>
			</div>
			<div class="rep1001GitFrame">
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
								<select class="select_useCd" name="gitUsrAuthTypeCd" id="gitUsrAuthTypeCd" value="" style="height:100%; width:100%;"></select>
							</span>
						</div>
					</div>
				<div class="rep1001GitUsrAuthTkFrame">
					<div class="pop_menu_row pop_menu_oneRow">
						<div class="pop_menu_col1 pop_oneRow_col1"><label for="gitUsrTk">사용자 토큰</label><span class="required_info">&nbsp;*</span></div>
						<div class="pop_menu_col2 pop_oneRow_col2" guide="gitUsrTk" >
							<input type="password" title="사용자 토큰" class="input_txt" name="gitUsrTk" id="gitUsrTk" value=""  maxlength="500"  />
						</div>
					</div>
				</div>
				<div class="rep1001GitUsrAuthIdFrame">
					<div class="pop_menu_row">
						<div class="pop_menu_col1 menu_col1_subStyle"><label for="svnUsrId">사용자 ID</label><span class="required_info">&nbsp;*</span></div>
						<div class="pop_menu_col2 menu_col2_subStyle" guide="gitUser" ><input type="text" title="사용자 ID" class="input_txt" name="gitUsrId" id="gitUsrId" value="" maxlength="30" /></div>
					</div>
					<div class="pop_menu_row">
						<div class="pop_menu_col1 menu_col1_subStyle pop_menu_col1_right"><label for="gitUsrPw">PASSWORD</label><span class="required_info">&nbsp;*</span></div>
						<div class="pop_menu_col2 menu_col2_subStyle" guide="gitPassword" ><input type="password" title="PASSWORD" class="input_txt" name="gitUsrPw" id="gitUsrPw" value="" maxlength="50" /></div>
					</div>
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_row rep1001SvnFrame">
					<div class="pop_menu_col1 menu_col1_subStyle"><label>Deploy 저장소 등록</label></div>
					<div class="pop_menu_col2 menu_col2_subStyle">
						<div class="rep_chk"> 
							<input type="checkbox" name="deployInsertChkBox" id="deployInsertChkBox" onchange="fnDeployInsertChg(this)"/>
							<label for="deployInsertChkBox"></label> 
						</div>
					</div>
				</div>
				<div class="pop_menu_row" id="useCdDiv">
					<div class="pop_menu_col1 menu_col1_subStyle pop_menu_col1_right"><label for="useCd">사용여부</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle">
						<span class="search_select">
							<select class="select_useCd" name="useCd" id="useCd" value="" style="height:100%; width:100%;"></select>
						</span>
					</div>
				</div>
			</div>
			<div class="rep1001DeployFrame rep1001SvnFrame">
				<div class="svn_mask_content" id="repDplInputMask">Deploy 저장소 등록 체크시 입력이 가능합니다.</div>
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="dplRepUrl">Deploy URL</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 pop_oneRow_col2" guide="dplUrl" >
						<input type="text" title="URL" class="input_txt" name="dplRepUrl" id="dplRepUrl" value=""  maxlength="500"  />
					</div>
				</div>
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle"><label for="dplUsrId">USER</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle" guide="dplUser" ><input type="text" title="USER" class="input_txt" name="dplUsrId" id="dplUsrId" value="" maxlength="30" /></div>
				</div>
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle pop_menu_col1_right"><label for="dplUsrPw">PASSWORD</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle" guide="dplPassword" ><input type="password" title="PASSWORD" class="input_txt" name="dplUsrPw" id="dplUsrPw" value="" maxlength="50" /></div>
				</div>
			</div>
			<div class="pop_note" style="margin-bottom:0px;">
				<div class="note_title">저장소 설명</div>
				<textarea class="input_note" title="저장소 설명" name="repTxt" id="repTxt" rows="7" value="" maxlength="1000"   ></textarea>
			</div>
		</div>
		<div class="pop_dpl_div_sub divDetail_sub_right" guide="rep1001SvnTree">
			<div class="svn_mask_content" id="repTreeListMask">소스저장소 정보(URL, ID, PW)를 입력해주세요.</div>
			<div class="sub_title">
					소스저장소 내부 정보
			</div>
			<ul id="repDetailTree" class="ztree"></ul>
			<div class="treeNodeUrlFrame">
				<input type="text" class="input_text" id="selTreeNodeUrl" name="selTreeNodeUrl" placeholder="선택한 노드의 전체 경로가 표시됩니다." readonly />
			</div>
			<div class="pop_menu_btn_row">
				<div class="button_normal button_col" id="btnRepConnCheck">접속 체크</div>
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
