<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %> 
<html lang="ko">
<title>OpenSoftLab</title>
<script type="text/javascript" src="/js/ztree/jquery.ztree.all.min.js"></script>
<style>
.layer_popup_box .popup.jen1002-popup .pop-left{
	width: calc(60% - 10px);
	overflow: hidden;
	float: left;
}
.layer_popup_box .popup.jen1002-popup .pop-right {
	width: calc(40% - 10px);
	overflow: hidden;
	float: left;
}
.layer_popup_box .popup.jen1002-popup .pop-right {
	margin-left: 20px;
} 
.ztree {
	overflow: scroll;
}
textarea#jobDesc{height:110px;}
input#jobTriggerVal{min-width: 100px;}
.input_txt.readonlyBgNone{background-color:#fff !important;}
textarea#jobTriggerVal {height: 100px;}
textarea#jobTriggerVal[readonly] {background-color: #eee;}


.popup.jen1002-popup .pop_menu_row .pop_menu_col1 { width: 23%; height: 45px; padding-left: 6px; }
.popup.jen1002-popup .pop_menu_row .pop_menu_col2 { width: 77%; height: 45px; }
.popup.jen1002-popup .pop_menu_row .pop_menu_col1.menu_col1_subStyle { width: 46%; }
.popup.jen1002-popup .pop_menu_row .pop_menu_col2.menu_col2_subStyle { width: 54%; }

.layer_popup_box .popup.jen1002-popup input[type="password"].input_txt {width:100%; height:100%;}
.popup.jen1002-popup .pop_sub .display_none { display: none;}

.popup.jen1002-popup .ztree-title{
    float: left;
    padding-left: 10px;
    padding-top: 5px;
    width: 100%;
    height: 45px;
    line-height: 30px;
    background: #f9f9f9;
    border-width: 1px 0 1px 0;
    border-style: solid;
    border-color: #ddd;
    text-align: left;
}
.popup.jen1002-popup .ztree{
    border: 1px solid #ccc;
    border-radius: 0.185rem;
    padding: 5px;
    float: left;
    width: calc(100% - 10px);
    margin: 5px 5px 0 5px;
    height: 460px;
}
.popup.jen1002-popup .hideMaskFrame {
    position: absolute;
    width: 960px;
    height: 510px;
    color: #fff;
    font-weight: 700;
    font-size: 13pt;
    background-color: rgba(0, 0, 0, 0.85);
    line-height: 360px;
    border-radius: 2px;
    z-index: 2;
    top: 105px;
    padding: 0;
    display: none;
}
div.jenkinsTriggerMsg {
    height: 30px;
    display: inline-block;
    width: 100%;
    text-align: left;
}

.jenkinsTriggerMsg .error {
  color: #c00;
  font-weight: bold;
  padding-left: 20px;
  min-height: 16px;
  line-height: 16px;
  background-image: url("/images/svgs/error.svg");
  background-position: left top;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}
.jenkinsTriggerMsg .warning {
  color: #c4a000;
  font-weight: bold;
  padding-left: 20px;
  min-height: 16px;
  line-height: 16px;
  background-image: url("/images/svgs/warning.svg");
  background-position: left top;
  background-repeat: no-repeat;
  background-size: 16px 16px;
}
</style>
<script>


var zTreeJen1002 = null;


var jenkinsChk = false;


var updateJobId = '';
var jobArray = [];


var selJobId = "";
var selJobPath = "";
var jobUrl = "";

var selJobInfo;


var nowJobTok = null;

var arrChkObj = {	
					
					"jobParameter":{"type":"regExp","pattern":/^(?=.*?[a-zA-Z])(?=.*?[0-9])|[a-zA-Z]{2,50}$/ ,"msg":"JOB 매개변수는 영문,숫자 조합 또는 영문으로 2~50자까지 입력 가능합니다.", "required":false},
			        "jobDesc":{"type":"length","msg":"JOB 설명은 1000byte까지 입력이 가능합니다.","max":1000} 
			};
			
			

var beforeJobTypeCd;


var selJobRestoreId;

globals_guideChkFn = fnJen1002GuideShow;			

$(document).ready(function() {
	
	
	var commonCodeArr = [
		{mstCd: "DPL00002", useYn: "Y",targetObj: "#jobTypeCd", comboType:"OS"}, 
		{mstCd: "CMM00001", useYn: "Y",targetObj: "#useCd", comboType:"OS"}, 
		{mstCd: "CMM00001", useYn: "Y",targetObj: "#jobTriggerCd", comboType:"OS"} 
	];
	
	gfnGetMultiCommonCodeDataForm(commonCodeArr , true);
	
	
	
	
	
	gfnInputValChk(arrChkObj);
	
	
	if('${param.popupGb}' == 'insert'){
		
		var selJenId = "${param.selJenId}";
		
		
		if(!gfnIsNull(selJenId)){
			$("#jenId").val(selJenId);
			
			
			fnJenIdSelecetd();
			
		}else{
			$("#hideMaskFrame").show();
		}
	
		$(".pop_title").text("JOB 설정 등록");
		$("#btn_update_popup").text('등록');
		$(".pop-right").removeClass('display_none');
	}
	else if('${param.popupGb}' == 'update'){
		
		$(".pop_title").text("JOB 설정 수정");
		$("#btn_update_popup").text('수정');
		
		var jenId = '${param.jenId}';
		var jobId = '<c:out value="${param.jobId}" />';
		fnSelectJen1001JobInfo(jenId,jobId);
		
		$(".popup.jen1002-popup .pop-left").css({width: "100%"});
		$("#jobDiv").removeClass('display_none');
	}

	
	$("#jobTriggerVal").blur(function(){
		
		if(gfnIsNull(selJobId)){
			jAlert("JOB을 선택해주세요.","알림창");
			return false;
		}
		
		var jobTriggerCd = $("#jobTriggerCd").val();
		if(jobTriggerCd == "01"){
			
			var jobTriggerVal = $("#jobTriggerVal").val();
			
			var jenUrl = $("#jenId > option:selected").attr('jenurl');
			var jenUsrId = $("#jenId > option:selected").attr('jenusrid');
			var jenUsrTok = $("#jenId > option:selected").attr('jenusrtok');
			
			
			var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1002JobCronSpecCheck.do'/>",loadingShow:false}
					,{"jobId" : selJobId, "jenUrl": jenUrl, "jenUsrId": jenUsrId, "jenUsrTok": jenUsrTok , "jobTriggerVal": jobTriggerVal });
			
			ajaxObj.setFnSuccess(function(data){
				if(data.MSG_CD == "JENKINS_OK"){
					var checkResult = data.checkResult;
					checkResult = checkResult.replace("img src='", "img src='"+jenUrl);
					$("#jenkinsTriggerMsg").html(checkResult);
				}
				else if(data.MSG_CD=="JENKINS_FAIL"){
					jAlert("설정 정보가 잘못 입력 되었거나, JENKINS 서버에 문제가 있습니다.<br/><br/>입력한 URL, USER, USER TOKEN KEY 를 확인 하시거나, JENKINS 서버를 확인 해주시기 바랍니다.", "알림창");
				}else if(data.MSG_CD=="JENKINS_WORNING_URL"){
					jAlert("허용되지 않는 URL입니다.<br/><br/>입력한 URL를 확인하십시오", "알림창");
				}else if(data.MSG_CD == "TRIGGER_CRON_VALUE_ERR"){
					jAlert("트리거 Cron값에 문제가 있습니다.</br></br>[오류 내용]</br>"+data.MSG_STR, "알림창");
				}
			});
			
			
			ajaxObj.send();
			
		}
	});
	
	
	$('#btn_update_popup').click(function() {
		
		
		var strFormId = "jen1100PopupFrm";
		
		var strCheckObjArr = ["jobTok"];
		var sCheckObjNmArr = ["JOB TOKEN KEY"];
		
		if(gfnIsNull(selJobId)){
			jAlert("JOB ID은(는) 필수 입력 사항입니다.\n\n\r JOB ID 항목을 입력하세요.",'알림창');
			return;
		}
		if(gfnRequireCheck(strFormId, strCheckObjArr, sCheckObjNmArr)){
			return;	
		}

		
		
		if(!gfnSaveInputValChk(arrChkObj)){
			return false;	
		}	

		fnInsertJobInfoAjax("jen1100PopupFrm");

	});
	
	
	$('#jobParameter').keydown(function() {
		$("#jobParameter").removeClass("inputError");
	});
	
	
	$('#btn_cancle_popup').click(function() {
		gfnLayerPopupClose();
	});
	
	
	$("#jobTriggerCd").on("change", function(){
		var chgTriggerCdVal = this.value;
		
		
		if(chgTriggerCdVal == "01"){
			
			$("#jobTriggerVal").removeAttr("readonly");
		}
		
		else{
			
			$("#jobTriggerVal").val("");
			
			
			$("#jobTriggerVal").attr("readonly","readonly");
		}
		
	});
	
});

function fnSelectJen1001JobInfo(jenId, jobId){
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1100JobDetailAjax.do'/>",loadingShow:false}
			,{ "jenId" : jenId, "jobId" : jobId});
	
	ajaxObj.setFnSuccess(function(data){
		if(data.MSG_CD=="JENKINS_FAIL"){
			jAlert("설정 정보가 잘못 입력 되었거나, JENKINS 서버에 문제가 있습니다.<br/><br/>입력한 URL, USER, USER TOKEN KEY 를 확인 하시거나, JENKINS 서버를 확인 해주시기 바랍니다.", "알림창");
			return false;
		}
		
		if(data.errorYn == "Y"){
			jAlert("JOB 정보 조회 중 오류가 발생했습니다.");
			gfnLayerPopupClose();
			return false;
		}

		
		$("#jenId").val(jenId);
		$("#jenId").attr("disabled","disabled");
		jobUrl = data.jobInfo.jobUrl;
		
		
		jenkinsChk = true;
		
		
		selJobInfo = data.jobInfo;
		selJobId = data.jobInfo.jobId;
		
		$("#jobId").html('<option value="'+selJobId+'">'+selJobId+'</option>');
		
       	
       	gfnSetData2ParentObj(data.jobInfo, "jen1100PopupFrm");

       	
       	beforeJobTypeCd = data.jobInfo.jobTypeCd;
       	
       	
       	selJobRestoreId = data.jobInfo.jobRestoreId;
       		
		nowJobTok = data.jobInfo.jobTok;
       	
		
		updateJobId = data.jobInfo.jobId;
		
		
		$("#jobTriggerCd").data("osl-value", data.jobInfo.jobTriggerCd);
		if(data.jobInfo.jobTriggerCd == "01"){
			
			$("#jobTriggerVal").removeAttr("readonly");
		}
		
		var jobRestoreList = data.jobRestoreList;
		
		
		jobArray = [];
		var jobRestoreArray = [];
		
		
		if(!gfnIsNull(jobRestoreList)){
			var appendStr = '';
			
			
			$.each(jobRestoreList,function(idx, map){
				
				jobArray.push(map.jobId);
				jobRestoreArray.push(map.jobRestoreId);
			});
			
			
			var restoreCnt = 0;
			
			$.each(jobRestoreList,function(idx, map){
				
				if(map.jobTypeCd == "03"){
					var selectStr = "";
					
					if(selJobRestoreId != map.jobId){
						
						if(jobRestoreArray.indexOf(map.jobId) != -1){
							return true;
						}
					}else{
						selectStr = "selected";
					}
					appendStr += '<option value="'+map.jobId+'" '+selectStr+'>'+map.jobId+'</option>';
					restoreCnt++;
				}
			});
			
			
			
			var selectStr = "";
			if(restoreCnt == 0) {
				selectStr = "selected";
			}
			
			
			
		}else{
			
			
		}
	});
	
	
	ajaxObj.send();
} 


function fnInsertJobInfoAjax(formId){
	
	if(jenkinsChk == false){
		jAlert("JENKINS 연결을 확인해주세요.");
		return false;
	}
	
	
	var jobNm = selJobId;
	
	if('${param.popupGb}' == 'insert'){
		
		selJobInfo = zTreeJen1002.getCheckedNodes()[0];
		jobNm = selJobInfo["name"];
	}

	jConfirm("JOB("+jobNm+")을 저장하시겠습니까?", "알림창", function( result ) {
		if( result ){

			var fd = new FormData();
			
			gfnFormDataAutoValue(formId,fd);
			
			
			var jenId = $("#jenId").val();
			var jenUsrId = $("#jenId > option:selected").attr('jenusrid');
			var jenUsrTok = $("#jenId > option:selected").attr('jenusrtok');
			var jenUrl = $("#jenId > option:selected").attr('jenurl');
				
			
			fd.append("type",'${param.popupGb}');
			fd.append("nowJobTok",nowJobTok);
			fd.append("jenUsrId",jenUsrId);
			fd.append("jenUsrTok",jenUsrTok);
			fd.append("beforeJobTypeCd",beforeJobTypeCd);

			fd.append("jenUrl",jenUrl);
			
			
			if(!gfnIsNull(zTreeJen1002)){
				fd.append("jobUrl",selJobInfo.url);
			}else{
				fd.append("jobUrl",jobUrl);
			}
			
			
			fd.set("jobId",selJobId);
			
			
			var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/jen/jen1000/jen1000/saveJen1100JobInfoAjax.do'/>"
						,"contentType":false
						,"processData":false
						,"cache":false}
					,fd);
			
			ajaxObj.setFnSuccess(function(data){
				
		    	
		    	
				if(!gfnIsNull(data.MSG_CD)){
					if(data.MSG_CD=="JENKINS_FAIL"){
						jAlert("설정 정보가 잘못 입력 되었거나, JENKINS 서버에 문제가 있습니다.<br/><br/>입력한 URL, USER, USER TOKEN KEY 를 확인 하시거나, JENKINS 서버를 확인 해주시기 바랍니다.", "알림창");
					}else if(data.MSG_CD=="JENKINS_WORNING_URL"){
						jAlert("허용되지 않는 URL입니다.<br/><br/>입력한 URL를 확인하십시오", "알림창");
					}else if(data.MSG_CD == "TRIGGER_CRON_VALUE_ERR"){
						jAlert("트리거 Cron값에 문제가 있습니다.</br></br>[오류 내용]</br>"+data.message, "알림창");
					}
					else{
						jAlert("[jenkins 접속 오류]</br>오류 내용 : "+data.MSG_CD);
					}
					fd = new FormData();
					return false;
				}
		    	
		    	
		    	if(data.errorYn == 'Y'){
		    		jAlert(data.message);
		    		return;
		    	}
		    	
		    	
				fnInJobGridListSet(0,jobSearchObj.getParam()+"&jenId="+jenId);
		    	
				jAlert(data.message, '알림창');
				gfnLayerPopupClose();
			});
			
			
			ajaxObj.setFnError(function(xhr, status, err){
				toast.push(xhr.status+"("+err+")"+" 에러가 발생했습니다.");
		    	gfnLayerPopupClose();
			});
			
			ajaxObj.send();
		}
	});	
}

function fnJen1002GuideShow(){
	var mainObj = $(".popup");
	
	
	if(mainObj.length == 0){
		return false;
	}
	
	var guideBoxInfo = globals_guideContents["jen1002"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}


function fnJenIdSelecetd(){
	
	selJobId = "";
	selJobPath = "";
	var jenIdValue = $("#jenId").val();
	
	if(gfnIsNull(jenIdValue)){
		$("#hideMaskFrame").html("JENKINS를 선택해주세요");
		jenkinsChk = false;
		$("#hideMaskFrame").show();
	}else{
		
		var jenUsrId = $("#jenId > option:selected").attr('jenusrid');
		var jenUsrTok = $("#jenId > option:selected").attr('jenusrtok');
		var jenUrl = $("#jenId > option:selected").attr('jenurl');
		
		var param = {
				"jenId" : jenIdValue,
				"jenUsrId" : jenUsrId ,
				 "jenUsrTok" : jenUsrTok ,
				 "jenUrl" : jenUrl ,
				 "jobUrl" : jobUrl
			   };

		
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000URLConnect.do'/>","loadingShow":true}
				, param );
		
		ajaxObj.setFnSuccess(function(data){
			
			if(data.MSG_CD=="JENKINS_OK"){
				
				var jobRestoreList = data.jobRestoreList;
				
				
				jobArray = [];
				var jobRestoreArray = [];
				
				
				if(!gfnIsNull(jobRestoreList)){
					var appendStr = '';
					
					
					$.each(jobRestoreList,function(idx, map){
						
						jobArray.push(map.jobId);
						jobRestoreArray.push(map.jobRestoreId);
					});
					
					
					var restoreCnt = 0;
					
					$.each(jobRestoreList,function(idx, map){
						
						if(map.jobTypeCd == "03"){
							var selectStr = "";
							
							if(selJobRestoreId != map.jobId){
								
								if(jobRestoreArray.indexOf(map.jobId) != -1){
									return true;
								}
							}else{
								selectStr = "selected";
							}
							appendStr += '<option value="'+map.jobId+'" '+selectStr+'>'+map.jobId+'</option>';
							restoreCnt++;
						}
					});
					
					
					
					var selectStr = "";
					if(restoreCnt == 0) {
						selectStr = "selected";
					}
					
					
					
				}else{
					
					
				}
				
				
				var jobList = data.list;
				if(!gfnIsNull(jobList)){
					var appendStr = '';

			    	
				    var setting = {
			    		
				        data: {
				        	key: {
								name: "viewName"
							},
				            simpleData: {
				                enable: true,
				                idKey: "jobId",
								pIdKey: "upperJobId",
				            }
				        },
				        check: {
				    		enable: true,
				    		chkStyle: "radio",
				    		radioType: "all"
				    	},
				        
				        async: {
							enable: true, 
							contentType: "application/x-www-form-urlencoded; charset=UTF-8",
							url:"<c:url value='/jen/jen1000/jen1000/selectJen1000SubURLConnect.do'/>",
							autoParam:["jobId","url"],	
							otherParam:{"jenId":jenIdValue,"jenUsrTok" : jenUsrTok,"jenUsrId" : jenUsrId},  
							dataType: "json",
							dataFilter: fnTreeFilter	
						},
						callback: {
							onClick: function(event, treeId, treeNode){
								event.preventDefault();
								
								if(treeNode["_class"] != "com.cloudbees.hudson.plugins.folder.Folder" && treeNode.useCd == "01"){
									
									selJobId = treeNode.jobId;
									
									zTreeJen1002.checkNode(treeNode, true);
									
									
									fnSelJobCronSpec(treeNode.jobId);
								}else{
									selJobId = "";
									selJobPath = "";
								}
							},
							onAsyncError: fnAsyncError
						},
						view : {
							fontCss: getFontCss,
							nameIsHTML : true
						}
				    };
				    
					
					$.each(jobList,function(idx, map){
						
						if(jobArray.indexOf(map.jobId) != -1){
							map.useCd = "02";
							
							
							map.chkDisabled = true;
							return true;
						}else{
							map.useCd = "01";
						}
						appendStr += '<option value="'+map.name+'">'+map.name+'</option>';
					});
					
					
					$("#hideMaskFrame").hide();
					list = data.list;
					$.each(list, function(idx, obj){
						obj.viewName = obj.name;
						
						if(obj["_class"] == "com.cloudbees.hudson.plugins.folder.Folder"){
							obj.isParent = true;
							
							
							obj.chkDisabled = true;
						}else{
							obj.isParent = false;
						}
					});
				    
				    zTreeJen1002 = $.fn.zTree.init($("#jobTree"), setting, list);
				    
				    
				    
				    zTreeJen1002.expandAll(false);
					
					
					if($("#jobId option").length == 0){
						
						if('${param.popupGb}' == 'update'){
							$("#hideMaskFrame").html("JENKINS에 일치하는 JOB이 없습니다.");
							return false;
						}else{
							$("#hideMaskFrame").html("추가 할수 있는 JOB이 없습니다.");
							return false;
						}
					}
					
					
				}
				
				jenkinsChk = true;
				$("#hideMaskFrame").hide();
				
				return true;
			}else if(data.MSG_CD=="JENKINS_FAIL"){
				jAlert("설정 정보가 잘못 입력 되었거나, JENKINS 서버에 문제가 있습니다.<br/><br/>입력한 URL, USER, USER TOKEN KEY 를 확인 하시거나, JENKINS 서버를 확인 해주시기 바랍니다.", "알림창");			
			}else if(data.MSG_CD=="JENKINS_WORNING_URL"){
				jAlert("허용되지 않는 URL입니다.<br/><br/>입력한 URL를 확인하십시오", "알림창");
			}else{
				jAlert("[jenkins 접속 오류]</br>오류 내용 : "+data.MSG_CD);
			}
			
			
			gfnLayerPopupClose();
		});
		
		
		ajaxObj.send();
		
	}
}


function getFontCss(treeId, treeNode) {
	
	
	if( !treeNode.highlight && treeNode.useCd == "02"){
		return {color:"#ddd", "font-weight":"normal"};
	
	}else if( !treeNode.highlight && treeNode.useCd == "01" ){
		return {color:"#333", "font-weight":"normal"};
	}
}


function fnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown){
	
   	toast.push("하위 조직 조회에 실패하였습니다.");
}
	

function fnTreeFilter(treeId, parentNode, result) {
 	
	
 	var childNodes = result.list;
	
	
	
	$.each(childNodes, function(idx, node){
		
		
		node.viewName = node.name;
		
		
		if( node["_class"] == "com.cloudbees.hudson.plugins.folder.Folder"){
			
			node.chkDisabled = true;
			
			node.isParent = true;
		}

		if(jobArray.indexOf(node.jobId) != -1){
			node.useCd = "02";
			
			
			node.chkDisabled = true;
		}else{
			node.useCd = "01";
		}
		
		zTreeJen1002.updateNode(node);
		
	});
	
	
	return childNodes;
}

 
function fnSelJobCronSpec(paramJobId){
	
	var jobTriggerVal = $("#jobTriggerVal").val();
	
	var jenUrl = $("#jenId > option:selected").attr('jenurl');
	var jenUsrId = $("#jenId > option:selected").attr('jenusrid');
	var jenUsrTok = $("#jenId > option:selected").attr('jenusrtok');
	
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1002JobCronSpec.do'/>",loadingShow:false}
			,{"jobId" : paramJobId, "jenUrl": jenUrl, "jenUsrId": jenUsrId, "jenUsrTok": jenUsrTok });
	
	ajaxObj.setFnSuccess(function(data){
		if(data.MSG_CD == "JENKINS_OK"){
			
			var jobTriggerCd = data.jobTriggerCd;
			var jobTriggerVal = data.jobTriggerVal;
			
			$("#jobTriggerCd").val(jobTriggerCd);
			$("#jobTriggerCd").change();
			
			if(jobTriggerCd == "01"){
				$("#jobTriggerVal").val(jobTriggerVal);
			}else{
				$("#jobTriggerVal").val("");
			}
		}
		else if(data.MSG_CD=="JENKINS_FAIL"){
			jAlert("설정 정보가 잘못 입력 되었거나, JENKINS 서버에 문제가 있습니다.<br/><br/>입력한 URL, USER, USER TOKEN KEY 를 확인 하시거나, JENKINS 서버를 확인 해주시기 바랍니다.", "알림창");
		}else if(data.MSG_CD=="JENKINS_WORNING_URL"){
			jAlert("허용되지 않는 URL입니다.<br/><br/>입력한 URL를 확인하십시오", "알림창");
		}else if(data.MSG_CD == "TRIGGER_CRON_VALUE_ERR"){
			jAlert("트리거 Cron값에 문제가 있습니다.</br></br>[오류 내용]</br>"+data.MSG_STR, "알림창");
		}
	});
	
	
	ajaxObj.send();
}
</script>

<div class="popup jen1002-popup" >
<form id="jen1100PopupFrm" name="jen1100PopupFrm" method="post">
	<input type="hidden" name="popupGb" id="popupGb" value="${param.popupGb}"/>

	<div class="pop_title">JOB 설정 등록</div>
	<div class="pop_sub" guide="jobInfo" >
		<div class="hideMaskFrame" id="hideMaskFrame">JENKINS를 선택해주세요</div>
		<div class="pop-left" guide="jen1002LeftJobForm">
			<div class="pop_menu_row pop_menu_oneRow first_menu_row">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenId">JENKINS</label><span class="required_info">&nbsp;*</span></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<span class="search_select">
						<select class="select_useCd" name="jenId" id="jenId" value="" style="height:100%; width:100%;" onchange="fnJenIdSelecetd()">
							<c:choose>
								<c:when test="${empty jenkinsList}">
									<option value="">JENKINS 생성이 필요합니다.</option>
								</c:when>
								<c:otherwise>
									<c:if test="${fn:length(jenkinsList) > 0 }">
										<option value="">선 택</option>
									</c:if>
									<c:forEach items="${jenkinsList}" var="map">
										<c:if test="${map.useCd == '01'}">
											<option value="${map.jenId}" jenusrid='<c:out value="${map.jenUsrId}"/>' jenusrtok='<c:out value="${map.jenUsrTok}"/>' jenurl='<c:out value="${map.jenUrl}"/>'><c:out value="${map.jenNm}"/>(<c:out value="${map.jenUrl}"/>)</option>
										</c:if>
									</c:forEach>
								</c:otherwise>
							</c:choose>
						</select>
					</span>
				</div>
			</div>
			<div class="jenkinsSelBeforeHideFrame">
				<div class="pop_menu_row pop_menu_oneRow display_none" id="jobDiv">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="jobId">JOB ID(NAME)</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 pop_oneRow_col2">
						<span class="search_select">
							<select class="select_useCd" name="jobId" id="jobId" value="" style="height:100%; width:100%;">
									<option value="">선 택</option>
							</select>
						</span>
					</div>
				</div>
			<!-- 
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="jobRestoreId">원복 JOB ID</label></div>
					<div class="pop_menu_col2 pop_oneRow_col2">
						<span class="search_select">
							<select class="select_useCd" name="jobRestoreId" id="jobRestoreId" value="" style="height:100%; width:100%;">
									
							</select>
						</span>
					</div>
				</div>
				 -->
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="jobTok">TOKEN KEY</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 pop_oneRow_col2">
						<input type="password" title="TOKEN KEY" class="input_txt" name="jobTok" id="jobTok" value="" maxlength="50"  />
					</div>
				</div>
				<!-- 
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="jobTok">JOB 매개변수</label></div>
					<div class="pop_menu_col2 pop_oneRow_col2">
						<input type="text" placeholder="매개변수는 영문,숫자 조합 또는 영문으로 2~50자 까지 입력가능" title="JOB 매개변수" class="input_txt" name="jobParameter" id="jobParameter" value="" maxlength="50"  />
					</div>
				</div> -->
				
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle"><label for="jobTypeCd">JOB TYPE</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle">
						<span class="search_select">
							<select class="select_useCd" name="jobTypeCd" id="jobTypeCd" value="" style="height:100%; width:100%;"></select>
						</span>
					</div>
				</div>
				
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle"><label for="useCd">사용유무</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 menu_col2_subStyle">
						<span class="search_select">
							<select class="select_useCd" name="useCd" id="useCd" value="" style="height:100%; width:100%;"></select>
						</span>
					</div>
				</div>
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle"><label for="jobTriggerCd">트리거 사용유무</label></div>
					<div class="pop_menu_col2 menu_col2_subStyle">
						<span class="search_select">
							<select class="select_useCd" name="jobTriggerCd" id="jobTriggerCd" value="" style="height:100%; width:100%;" data-osl-value="02"></select>
						</span>
					</div>
				</div>
				<div class="pop_menu_row">
					<div class="pop_menu_col1 menu_col1_subStyle"></div>
					<div class="pop_menu_col2 menu_col2_subStyle">
					</div>
				</div>
				<div class="pop_note" style="margin-bottom:0px;">
					<div class="note_title"><label for="jobTriggerVal">Cron 값</label></div>
					<textarea class="input_note" title="Cron 값" name="jobTriggerVal" id="jobTriggerVal" rows="7" value="" maxlength="2000" readonly></textarea>
				</div>
				<div class="jenkinsTriggerMsg" id="jenkinsTriggerMsg">
					* 값 체크 메시지가 출력되는 영역입니다. (포커스 해제 시)
				</div>
				<div class="pop_note" style="margin-bottom:0px;">
					<div class="note_title">JOB 설명</div>
					<textarea class="input_note" title="JOB 설명" name="jobDesc" id="jobDesc" rows="7" value="" maxlength="2000"  ></textarea>
				</div>
			</div>
		</div>
		
		<div class="pop-right display_none" guide="jen1002RightJobList">
			<div class="menu_lists_wrap" id="ztreeDiv">
				<div class="ztree-title">
					<label for="jobId">JOB 목록</label>
					<span class="required_info">&nbsp;*</span>
				</div>
				<ul id="jobTree" class="ztree"></ul>
			</div>
		</div>
		
		<div class="btn_div">
			<div class="button_normal save_btn" id="btn_update_popup"></div>
			<div class="button_normal exit_btn" id="btn_cancle_popup">취소</div>
		</div>
	</div>
</form>
</div>

</html>
