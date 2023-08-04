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



.pop_menu_row .pop_menu_col1 { width: 20% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 80% !important; height: 45px !important; }
.pop_menu_row .menu_col1_subStyle { width: 40% !important; }
.pop_menu_row .menu_col2_subStyle { width: 60% !important; }
.pop_sub input[type="password"].input_txt { width:100% !important; height:100%!important; }

.warning_message{display:none; text-align: left; font-size: 13px;}

.pop_dpl_div_sub.divDetail_sub_left{width: 530px;float: left;margin-right: 10px;height: 405px;}
.pop_dpl_div_sub.divDetail_sub_right {width: 460px;float: left;height: 402px;position: relative;}


.rep1001GitFrame{display:none;}
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
    height: 336px;
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
</style>
<script>

globals_guideChkFn = fnRep1001GuideShow;

var fd = new FormData();


var nowSvnPw = null;
var nowGitPw = null;


var zTreeRep1001;


var svnConnCheckFlag = false;


var chgDataFlag = {
		svnRepUrl: "",
		svnUsrId: "",
		svnUsrId: ""
};


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

	
	
	$("#gitUsrAuthTypeCd").on("change", function(){
		fnGitUsrAuthTypeCdChg(this.value);
	});
	
	
	$("#svnRepUrl, #svnUsrId, #svnUsrPw").blur(function(){
		
		if(svnConnCheckFlag){
			
			var key = $(this).attr("id");
			var value = this.value;
		
			
			if(chgDataFlag[key] != value){
				
			    $("#repTreeListMask").show();
				
				zTreeRep1001.destroy();
				
				$("#selTreeNodeUrl").val("");
			}
		}
	});
	
	
	$("#btnSvnConnCheck").click(function(){
		
		chgDataFlag["svnRepUrl"] = $("#svnRepUrl").val();
		chgDataFlag["svnUsrId"] = $("#svnUsrId").val();
		chgDataFlag["svnUsrPw"] = $("#svnUsrPw").val();
		
		selectRep1001SvnTreeSetting();
	})
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
        	
        	gfnSetData2ParentObj(data.repInfo, "rep1000PopupFrm");
        	
        	var repTypeCd = data.repInfo.repTypeCd;
        	
        	
        	fnRepTypeCdChg(repTypeCd);
        	if(repTypeCd == "01" || repTypeCd == "03"){
	        	
	        	fnGitUsrAuthTypeCdChg(data.repInfo.gitUsrAuthTypeCd);
        	}

        	nowSvnPw = data.repInfo.svnUsrPw;
        	nowGitPw = data.repInfo.gitUsrPw;
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
	
	
	
	function selectRep1001SvnTreeSetting(){
		
		var svnRepUrl = $("#svnRepUrl").val();
		var svnUsrId = $("#svnUsrId").val();
		var svnUsrPw = $("#svnUsrPw").val();
		var repTypeCd = $("#repTypeCd").val();
		
		
		if(gfnIsNull(svnRepUrl)){
			jAlert("SVN URL값을 입력해주세요.","알림");
			return false;
		}
		else if(gfnIsNull(svnUsrId)){
			jAlert("SVN 사용자 ID값을 입력해주세요.","알림");
			return false;
		}
		else if(gfnIsNull(svnUsrPw)){
			jAlert("SVN 사용자 비밀번호 값을 입력해주세요.","알림");
			return false;
		}
		
		
		var param = {
				"svnRepUrl": svnRepUrl,
				"svnUsrId": svnUsrId,
				"svnUsrPw": svnUsrPw,
				"repTypeCd": repTypeCd
			   };
	
		
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/saveRep1001RepTreeListAjax.do'/>","loadingShow":true}
				, param );
		
		ajaxObj.setFnSuccess(function(data){
			if(data.MSG_CD =="SVN_EXCEPTION"){
				jAlert("소스저장소 접근 중 오류가 발생했습니다.","알림");
				return false;
			}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){
				jAlert("소스저장소에 접근이 불가능한 사용자 정보입니다.","알림");
				return false;
			}
			
			
		    var setting = {
	    		
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
		        
		        async: {
					enable: true, 
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					url:"<c:url value='/rep/rep1000/rep1000/saveRep1001RepTreeListAjax.do'/>",
					autoParam:["id", "path"],	
					otherParam: param,  
					dataType: "json",
					dataFilter: fnTreeFilter	
				},
				
				callback: {
					onAsyncError: fnAsyncError,
					onClick: function(event, treeId, treeNode){
						$("#selTreeNodeUrl").val(decodeURIComponent(treeNode.urlStr));
					}
				}
		    };
			
			
			var list = data.list;
			
		    $.each(list, function(idx, obj){
				if(obj["type"] == 0){
					obj.isParent = true;
				}else{
					obj.isParent = false;
				}
			});
		    
		    
		    zTreeRep1001 = $.fn.zTree.init($("#repDetailTree"), setting, list);
		    
		    
		    
		    zTreeRep1001.expandAll(false);
		    
		    
		    $("#repTreeListMask").hide();
		    
		    
		    svnConnCheckFlag = true;
		});
	
		
		ajaxObj.send();
	}
	
	
	function fnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown){
		
	   	toast.push("하위 디렉토리 조회에 실패하였습니다.");
	}
	
	
	function fnTreeFilter(treeId, parentNode, result) {
	 	
		
	 	var childNodes = result.list;
		
		
		$.each(childNodes, function(idx, node){
			
			
			if(node["type"] == 0){
				node.isParent = true;
			}
			
			zTreeRep1001.updateNode(node);
			
		});
		
		return childNodes;
	}
</script>

<div class="popup" >
<form id="rep1000PopupFrm" name="rep1000PopupFrm" method="post">
	<input type="hidden" name="popupGb" id="popupGb" value="${param.popupGb}"/>
	<input type="hidden" name="repId" id="repId" value="${param.repId}" />
	<input type="hidden" name="reqStatusCd" id="reqStatusCd" value="01"/>
	<input type="hidden" name="repTypeCd" id="repTypeCd" value="02"/>

	<div class="pop_title">저장소 등록</div>
	<div class="pop_sub">
		<div class="pop_dpl_div_sub divDetail_sub_left">
			<div class="pop_menu_row pop_menu_oneRow first_menu_row">
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
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle"><label for="useCd">사용여부</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle">
						<span class="search_select">
							<select class="select_useCd" name="useCd" id="useCd" value="" style="height:100%; width:100%;"></select>
						</span>
					</div>
				</div>
				<div class="pop_menu_row">
					<div class="pop_menu_col2 pop_menu_col1_right" style="width:100% !important;">
						<div class="button_normal button_col" id="btnSvnConnCheck">접속 체크</div>
					</div>
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
		</div>
		<div class="btn_div">
			<div class="button_normal save_btn" id="btn_update_popup">등록</div>
			<div class="button_normal exit_btn" id="btn_cancle_popup">취소</div>
		</div>
	</div>
</form>
</div>

</html>
