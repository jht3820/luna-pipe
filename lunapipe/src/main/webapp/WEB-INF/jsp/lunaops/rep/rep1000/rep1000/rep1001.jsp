<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html lang="ko">
<title>OpenSoftLab</title>
<style>
.layer_popup_box .close_btn{top:12px; width:18px; height:18px; background:url(/images/login/x_white.png) no-repeat}
.layer_popup_box .pop_left, .layer_popup_box .pop_right { height: 54px; }
.required_info { color: red; }



.pop_menu_row .pop_menu_col1 { width: 20% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 80% !important; height: 45px !important; }
.pop_menu_row .menu_col1_subStyle { width: 40% !important; }
.pop_menu_row .menu_col2_subStyle { width: 60% !important; }
.pop_sub input[type="password"].input_txt { width:100% !important; height:100%!important; }

.warning_message{display:none; text-align: left; font-size: 13px;}


.rep1001GitFrame{display:none;}
.rep1001GitUsrAuthIdFrame{display:none;}
</style>
<script>

globals_guideChkFn = fnRep1001GuideShow;

var fd = new FormData();


var nowSvnPw = null;
var nowGitPw = null;


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

	
	
	var commonCodeArr = [
		{mstCd: "REP00001", useYn: "Y",targetObj: "#repTypeCd", comboType:"OS"}, 
		{mstCd: "REP00002", useYn: "Y",targetObj: "#gitUsrAuthTypeCd", comboType:"OS"}, 
		{mstCd: "CMM00001", useYn: "Y",targetObj: "#useCd", comboType:"OS"} 
	];
	
	gfnGetMultiCommonCodeDataForm(commonCodeArr , true);
	
	$("#repNm").focus();
	
	
	gfnInputValChk(arrChkObj);
	
	
	
	
	
	if('${param.popupGb}' == 'insert'){
		$(".pop_title").text("저장소 등록");
		$("#btn_update_popup").text('등록');
	}
	else if('${param.popupGb}' == 'update'){
		$(".pop_title").text("저장소 수정");
		$("#btn_update_popup").text('수정');
		
		var repId = '${param.repId}';
		fnSelectSvn1001RepInfo(repId);
		
		
		var assignCnt = '${param.assignCnt}';
		if(assignCnt > 0){
			
			$("#svnRepUrl").attr("readonly", true);
			
			$("#svnRepoUpdateMsg").show();
			$(".pop_menu_row").last().css("margin-bottom", "14px");
			
			$(".layer_popup_box").height(578);
		}
	}
	
	
	$('#btn_update_popup').click(function() {
		
		
		var strFormId = "rep1000PopupFrm";
		var strCheckObjArr = ["repNm"];
		var sCheckObjNmArr = ["저장소 명"];
		
		
		var repTypeCd = $("#repTypeCd").val();
		
		
		if(repTypeCd == "01" || repTypeCd == "03"){
			strCheckObjArr = strCheckObjArr.concat(["gitRepUrl"]);
			sCheckObjNmArr = sCheckObjNmArr.concat(["Repository URL"]);
			
			
			var gitUsrAuthTypeCd = $("#gitUsrAuthTypeCd").val();
			
			if(gitUsrAuthTypeCd == "01"){
				strCheckObjArr = strCheckObjArr.concat(["gitUsrTk"]);
				sCheckObjNmArr = sCheckObjNmArr.concat(["사용자 토큰"]);
			}
			
			else if(gitUsrAuthTypeCd == "02"){
				strCheckObjArr = strCheckObjArr.concat(["gitUsrId","gitUsrPw"]);
				sCheckObjNmArr = sCheckObjNmArr.concat(["사용자 ID" , "PASSWORD"]);
			}
		}
		
		else if(repTypeCd == "02"){
			strCheckObjArr = strCheckObjArr.concat(["svnRepUrl","svnUsrId","svnUsrPw"]);
			sCheckObjNmArr = sCheckObjNmArr.concat(["URL" ,"USER" , "PASSWORD"]);
		}
		if(gfnRequireCheck(strFormId, strCheckObjArr, sCheckObjNmArr)){
			return;	
		}
		
		var formObj = document.getElementById("rep1000PopupFrm");
		
		
		if(!gfnSaveInputValChk(arrChkObj)){
			return false;	
		}
		
		fnInsertReqInfoAjax("rep1000PopupFrm");

	});
	
	
	$('#btn_cancle_popup').click(function() {
		gfnLayerPopupClose();
	});

	
	$("#repTypeCd").on("change", function(){
		fnRepTypeCdChg(this.value);
	});
	
	
	$("#gitUsrAuthTypeCd").on("change", function(){
		fnGitUsrAuthTypeCdChg(this.value);
	});
	
});

	
	function fnRepTypeCdChg(chgValue){
		
		if(chgValue == "01"){
			$(".rep1001GitFrame").show();
			$(".rep1001SvnFrame").hide();
		}
		
		else if(chgValue == "02"){
			$(".rep1001SvnFrame").show();
			$(".rep1001GitFrame").hide();
		}else if(chgValue == "03"){
			$(".rep1001GitFrame").show();
			$(".rep1001SvnFrame").hide();
		}
	}
	
	function fnGitUsrAuthTypeCdChg(chgValue){
		
		if(chgValue == "01"){
			$(".rep1001GitUsrAuthTkFrame").show();
			$(".rep1001GitUsrAuthIdFrame").hide();
		}
		
		else if(chgValue == "02"){
			$(".rep1001GitUsrAuthIdFrame").show();
			$(".rep1001GitUsrAuthTkFrame").hide();
		}
	}
	
 	function fnSelectSvn1001RepInfo(repId){
		
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000InfoAjax.do'/>"}
				,{ "repId" : repId });
		
		ajaxObj.setFnSuccess(function(data){
			data = JSON.parse(data);
			
        	
        	gfnSetData2ParentObj(data.repInfo, "rep1000PopupFrm");
        	
        	var repTypeCd = data.repInfo.repTypeCd;
        	
        	
        	fnRepTypeCdChg(repTypeCd);
        	if(repTypeCd == "01" || repTypeCd == "03"){
	        	
	        	fnGitUsrAuthTypeCdChg(data.repInfo.gitUsrAuthTypeCd);
        	}

        	nowSvnPw = data.repInfo.svnUsrPw;
        	nowGitPw = data.repInfo.gitUsrPw;
		});
		
		
		ajaxObj.setFnError(function(xhr, status, err){
			data = JSON.parse(data);
			jAlert(data.message, "알림창");
		});
		
		
		ajaxObj.send();
	} 
	
	
	function fnInsertReqInfoAjax(formId){
		
		gfnFormDataAutoValue('rep1000PopupFrm',fd);
		
		
		fd.append("nowSvnPw",nowSvnPw);
		fd.append("nowGitPw",nowGitPw);
		
		
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/saveRep1000InfoAjax.do'/>"
					,"contentType":false
					,"processData":false
					,"cache":false}
				,fd);
		
		ajaxObj.setFnSuccess(function(data){
			data = JSON.parse(data);
	    	
	    	gfnShowLoadingBar(false);
	    	
	    	
	    	if(data.saveYN == 'N'){
	    		jAlert(data.message, '알림창');
	    		fd = new FormData();
	    		return;
	    	}
	    	
	    	
			fnInGridListSet(repGridObj.page.currentPage,$('form#searchFrm').serialize()+"&"+repSearchObj.getParam());
	    	
			jAlert(data.message, '알림창');
			gfnLayerPopupClose();
		});
		
		
		ajaxObj.setFnError(function(xhr, status, err) {
			jAlert("소스저장소 등록에 실패하였습니다.", "알림창");
    		fd = new FormData();
    		return;
		});

		
		ajaxObj.send();
	}
function fnRep1001GuideShow(){
	var mainObj = $(".popup");
	
	
	if(mainObj.length == 0){
		return false;
	}
	
	var guideBoxInfo = globals_guideContents["rep1001"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}

</script>

<div class="popup" >
<form id="rep1000PopupFrm" name="rep1000PopupFrm" method="post">
	<input type="hidden" name="popupGb" id="popupGb" value="${param.popupGb}"/>
	<input type="hidden" name="repId" id="repId" value="${param.repId}" />
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
		<div class="rep1001SvnFrame">
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
							<select class="select_useCd" name="gitUsrAuthTypeCd" id="gitUsrAuthTypeCd" value="" style="height:100%; width:36%;"></select>
						</span>
					</div>
				</div>
			<div class="rep1001GitUsrAuthTkFrame">
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="gitUsrTk">사용자 토큰</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 pop_oneRow_col2" guide="gitUsrTk" >
						<input type="text" title="사용자 토큰" class="input_txt" name="gitUsrTk" id="gitUsrTk" value=""  maxlength="500"  />
					</div>
				</div>
			</div>
			<div class="rep1001GitUsrAuthIdFrame">
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
		<div class="btn_div">
			<div class="button_normal save_btn" id="btn_update_popup">등록</div>
			<div class="button_normal exit_btn" id="btn_cancle_popup">취소</div>
		</div>
	</div>
</form>
</div>

</html>
