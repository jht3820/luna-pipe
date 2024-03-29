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
textarea#jobDesc{height:288px;}
input#jobTriggerVal{min-width: 100px;}
.input_txt.readonlyBgNone{background-color:#fff !important;}
textarea#jobTriggerVal {height: 100px;}
textarea#jobTriggerVal[readonly] {background-color: #eee;}
/*익스플로러 적용 위해 !important 추가*/
/* 팝업에 따라 pop_menu_col1, pop_menu_col2 높이 변경 */
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
    height: 415px;
}
.popup.jen1002-popup .hideMaskFrame {
    position: absolute;
    width: 960px;
    height: 420px;
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

//zTree, mask
var zTreeJen1002 = null;

//jenkins 선택 변수
var jenkinsChk = false;

//수정인경우 jobId
var updateJobId = '';
var jobArray = [];

//선택한 JOB ID
var selJobId = "";
var selJobPath = "";
var jobUrl = "";
//update 필요 변수
var selJobInfo;

//현재 값
var nowJobTok = null;
// JENKINS 유효성
var arrChkObj = {	
					//"jobParameter":{"type":"regExp","pattern":/^[0-9a-zA-Z]{0,50}$/ ,"msg":"JOB 매개변수는 영문, 숫자만 입력가능합니다.", "required":false},
					"jobParameter":{"type":"regExp","pattern":/^(?=.*?[a-zA-Z])(?=.*?[0-9])|[a-zA-Z]{2,50}$/ ,"msg":"JOB 매개변수는 영문,숫자 조합 또는 영문으로 2~50자까지 입력 가능합니다.", "required":false},
			        "jobDesc":{"type":"length","msg":"JOB 설명은 1000byte까지 입력이 가능합니다.","max":1000} 
			};
			
			// 
//기존 jobType
var beforeJobTypeCd;

//원복Id
var selJobRestoreId;

globals_guideChkFn = fnJen1002GuideShow;			

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
		{mstCd: "DPL00002", useYn: "Y",targetObj: "#jobTypeCd", comboType:"OS"},
		{mstCd: "CMM00001", useYn: "Y",targetObj: "#useCd", comboType:"OS"}, 
		{mstCd: "CMM00001", useYn: "Y",targetObj: "#jobTriggerCd", comboType:"OS"},
		{mstCd: "CMM00001", useYn: "Y",targetObj: "#jobBldActionCd", comboType:"OS"} 
	];
	//공통코드 채우기
	gfnGetMultiCommonCodeDataForm(commonCodeArr , true);
	
	//탭인덱스 부여
	//gfnSetFormAllObjTabIndex(document.getElementById("jen1100PopupFrm"));
	
	// 유효성 체크
	gfnInputValChk(arrChkObj);
	
	/* 타이틀 변경 및 버튼명 변경, 수정일경우 값 세팅 */
	if('${param.popupGb}' == 'insert'){
		//선택 jenId
		var selJenId = "${param.selJenId}";
		
		//jenId 선택되서 온경우 selected
		if(!gfnIsNull(selJenId)){
			$("#jenId").val(selJenId);
			
			//jenkins 연결시도 호출
			fnJenIdSelecetd();
			
		}else{
			$("#hideMaskFrame").show();
			//등록버튼 감추기
			$("#btn_update_popup").hide();
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

	//트리거 blur 이벤트로 cron값 체크 (빈 값도 보냄)
	$("#jobTriggerVal").blur(function(){
		//jobId 없는 경우
		if(gfnIsNull(selJobId)){
			jAlert("JOB을 선택해주세요.","알림창");
			return false;
		}
		//트리거 사용일때만
		var jobTriggerCd = $("#jobTriggerCd").val();
		if(jobTriggerCd == "01"){
			//cron 값
			var jobTriggerVal = $("#jobTriggerVal").val();
			
			var jenUrl = $("#jenId > option:selected").attr('jenurl');
			var jenUsrId = $("#jenId > option:selected").attr('jenusrid');
			var jenUsrTok = $("#jenId > option:selected").attr('jenusrtok');
			
			//AJAX 설정
			var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1002JobCronSpecCheck.do'/>",loadingShow:false}
					,{"jobId" : selJobId, "jenUrl": jenUrl, "jenUsrId": jenUsrId, "jenUsrTok": jenUsrTok , "jobTriggerVal": jobTriggerVal });
			//AJAX 전송 성공 함수
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
			
			//AJAX 전송
			ajaxObj.send();
			
		}
	});
	
	/* 저장버튼 클릭 시 */
	$('#btn_update_popup').click(function() {
		
		/* 필수입력값 체크 공통 호출 */
		//var strFormId = "jen1100PopupFrm";
		/* var strCheckObjArr = ["jobId","jobTok"];
		var sCheckObjNmArr = ["JOB ID","JOB TOKEN KEY"]; */
		/* var strCheckObjArr = ["jobTok"];
		var sCheckObjNmArr = ["JOB TOKEN KEY"];
		
		if(gfnRequireCheck(strFormId, strCheckObjArr, sCheckObjNmArr)){
			return;	
		}
 */
		// 등록/수정 전 유효성 체크
		if(!gfnSaveInputValChk(arrChkObj)){
			return false;	
		}	

		fnInsertJobInfoAjax("jen1100PopupFrm");

	});
	
	/* JOB 파라미터 입력될 경우 이벤트 */
	$('#jobParameter').keydown(function() {
		$("#jobParameter").removeClass("inputError");
	});
	
	/* 취소버튼 클릭 시 팝업 창 사라지기*/
	$('#btn_cancle_popup').click(function() {
		gfnLayerPopupClose();
	});
	
	/* job trigger 사용유무 변경되는 경우*/
	$("#jobTriggerCd").on("change", function(){
		var chgTriggerCdVal = this.value;
		
		//트리거 사용
		if(chgTriggerCdVal == "01"){
			//readonly 해제
			$("#jobTriggerVal").removeAttr("readonly");
		}
		//트리거 사용 안함
		else{
			//값 초기화
			$("#jobTriggerVal").val("");
			
			//readonly
			$("#jobTriggerVal").attr("readonly","readonly");
		}
		
	});
	
});
/**
 * 	젠킨스 job 기본정보 상세 조회
 */
function fnSelectJen1001JobInfo(jenId, jobId){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1100JobDetailAjax.do'/>",loadingShow:false}
			,{ "jenId" : jenId, "jobId" : jobId});
	//AJAX 전송 성공 함수
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

		//jenId선택
		$("#jenId").val(jenId);
		$("#jenId").attr("disabled","disabled");
		jobUrl = data.jobInfo.jobUrl;
		
		//jenkins 연결 가능 유무
		jenkinsChk = true;
		
		//jobInfo 저장
		selJobInfo = data.jobInfo;
		selJobId = data.jobInfo.jobId;
		
		$("#jobId").html('<option value="'+selJobId+'">'+selJobId+'</option>');
		
       	//디테일폼 세팅
       	gfnSetData2ParentObj(data.jobInfo, "jen1100PopupFrm");

       	//jobType
       	beforeJobTypeCd = data.jobInfo.jobTypeCd;
       	
       	//원복 job id
       	selJobRestoreId = data.jobInfo.jobRestoreId;
       		
		//nowJobTok = data.jobInfo.jobTok;
       	
		//JOBID
		updateJobId = data.jobInfo.jobId;
		
		//트리거
		$("#jobTriggerCd").data("osl-value", data.jobInfo.jobTriggerCd);
		if(data.jobInfo.jobTriggerCd == "01"){
			//readonly 해제
			$("#jobTriggerVal").removeAttr("readonly");
		}
		//jobRestoreList 세팅
		var jobRestoreList = data.jobRestoreList;
		
		//jobId, jobRestoreId담을 변수
		jobArray = [];
		var jobRestoreArray = [];
		
		
		if(!gfnIsNull(jobRestoreList)){
			var appendStr = '';
			
			//loop start
			$.each(jobRestoreList,function(idx, map){
				//Id담기
				jobArray.push(map.jobId);
				jobRestoreArray.push(map.jobRestoreId);
			});
			//loop end
			
			var restoreCnt = 0;
			//loop start
			$.each(jobRestoreList,function(idx, map){
				//원복 job만 불러오기
				if(map.jobTypeCd == "03"){
					var selectStr = "";
					//현재 선택된 JOB ID를 제외
					if(selJobRestoreId != map.jobId){
						//이미 원복 ID로 지정된 JOBID는 제외
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
			//loop end
			
			//원복 job 수 체크
			var selectStr = "";
			if(restoreCnt == 0) {
				selectStr = "selected";
			}
			
			//option 교체
			//$("#jobRestoreId").html('<option value="" '+selectStr+'>선 택</option>'+appendStr);
		}else{
			//없을경우
			//$("#jobRestoreId").html('<option value="" '+selectStr+'>선 택</option>'+appendStr);
		}
	});
	
	//AJAX 전송
	ajaxObj.send();
} 

//JOB 등록
function fnInsertJobInfoAjax(formId){
	//jenkins 연결 확인
	if(jenkinsChk == false){
		jAlert("JENKINS 연결을 확인해주세요.");
		return false;
	}
	
	//jobID
	var jobNm = selJobId;
	var alertMsg = "JOB("+jobNm+")을 저장하시겠습니까?";
	var selJobList = [];
	
	if('${param.popupGb}' == 'insert'){
		//선택 job
		selJobList = zTreeJen1002.getCheckedNodes();
		
		if(!selJobList || !selJobList.length){
			jAlert("등록하려는 JOB을 체크해주세요.");
			return;
		}
		//insert시 선택 job
		/* 
		selJobInfo = zTreeJen1002.getCheckedNodes()[0];
		jobNm = selJobInfo["name"];
		 */
		alertMsg = "JOB "+selJobList.length+"개를 등록하시겠습니까?";
	}

	jConfirm(alertMsg, "알림창", function( result ) {
		if( result ){

			var fd = new FormData();
			//FormData에 input값 넣기
			gfnFormDataAutoValue(formId,fd);
			
			//jenkins url 체크
			var jenId = $("#jenId").val();
			var jenUsrId = $("#jenId > option:selected").attr('jenusrid');
			var jenUsrTok = $("#jenId > option:selected").attr('jenusrtok');
			var jenUrl = $("#jenId > option:selected").attr('jenurl');
				
			//기본 값과 type 넘기기
			fd.append("type",'${param.popupGb}');
			fd.append("nowJobTok",nowJobTok);
			fd.append("jenUsrId",jenUsrId);
			fd.append("jenUsrTok",jenUsrTok);
			fd.append("beforeJobTypeCd",beforeJobTypeCd);

			fd.append("jenUrl",jenUrl);
			
			//등록인경우 선택된 job id 전체 전송
			if('${param.popupGb}' == 'insert'){
				var addJobList = [];
				$.each(selJobList, function(idx, map){
					addJobList.push({jobId: map.jobId, jobUrl: map.url});
				});
				fd.append("addJobList", JSON.stringify(addJobList));
			}else{
				fd.append("jobUrl",jobUrl);
				//job full name 넣기
				fd.set("jobId",selJobId);
			}
			//AJAX 설정
			var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/jen/jen1000/jen1000/saveJen1100JobInfoAjax.do'/>"
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
					}else if(data.MSG_CD == "TRIGGER_CRON_VALUE_ERR"){
						jAlert("트리거 Cron값에 문제가 있습니다.</br></br>[오류 내용]</br>"+data.message, "알림창");
					}
					else{
						jAlert("[jenkins 접속 오류]</br>오류 내용 : "+data.MSG_CD);
					}
					fd = new FormData();
					return false;
				}
		    	
		    	//오류 발생
		    	if(data.errorYn == 'Y'){
		    		jAlert(data.message);
		    		return;
		    	}
		    	
		    	//그리드 새로고침
				fnInJobGridListSet(0,jobSearchObj.getParam()+"&jenId="+jenId);
		    	
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

function fnJen1002GuideShow(){
	var mainObj = $(".popup");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["jen1002"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}

//jenkins 선택
function fnJenIdSelecetd(){
	//선택 JOB ID 초기화
	selJobId = "";
	selJobPath = "";
	var jenIdValue = $("#jenId").val();
	//빈 값인경우 mask처리
	if(gfnIsNull(jenIdValue)){
		$("#hideMaskFrame").html("JENKINS를 선택해주세요");
		jenkinsChk = false;
		$("#hideMaskFrame").show();
	}else{
		//등록버튼 보이기
		$("#btn_update_popup").show();
		
		//jenkins url 체크
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

		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000URLConnect.do'/>","loadingShow":true}
				, param );
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
			if(data.MSG_CD=="JENKINS_OK"){
				//jobRestoreList 세팅
				var jobRestoreList = data.jobRestoreList;
				
				//jobId, jobRestoreId담을 변수
				jobArray = [];
				var jobRestoreArray = [];
				
				
				if(!gfnIsNull(jobRestoreList)){
					var appendStr = '';
					
					//loop start
					$.each(jobRestoreList,function(idx, map){
						//Id담기
						jobArray.push(map.jobId);
						jobRestoreArray.push(map.jobRestoreId);
					});
					//loop end
					
					var restoreCnt = 0;
					//loop start
					$.each(jobRestoreList,function(idx, map){
						//원복 job만 불러오기
						if(map.jobTypeCd == "03"){
							var selectStr = "";
							//현재 선택된 JOB ID를 제외
							if(selJobRestoreId != map.jobId){
								//이미 원복 ID로 지정된 JOBID는 제외
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
					//loop end
					
					//원복 job 수 체크
					var selectStr = "";
					if(restoreCnt == 0) {
						selectStr = "selected";
					}
					
					//option 교체
					//$("#jobRestoreId").html('<option value="" '+selectStr+'>선 택</option>'+appendStr);
				}else{
					//없을경우
					//$("#jobRestoreId").html('<option value="" '+selectStr+'>선 택</option>'+appendStr);
				}
				
				//jobList 세팅
				var jobList = data.list;
				if(!gfnIsNull(jobList)){
					var appendStr = '';

			    	// zTree 설정
				    var setting = {
			    		// zTree binding data key 설정
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
				    		chkStyle: "checkbox",
				    		radioType: "all"
				    	},
				        // 동적 트리 설정
				        async: {
							enable: true, // async 사용여부 (true:사용, false:미사용)
							contentType: "application/x-www-form-urlencoded; charset=UTF-8",
							url:"<c:url value='/jen/jen1000/jen1000/selectJen1000SubURLConnect.do'/>",
							autoParam:["jobId","url"],	// 노드의 값을 서버로 보낼경우 배열형식으로 autoParam에 세팅
							otherParam:{"jenId":jenIdValue,"jenUsrTok" : jenUsrTok,"jenUsrId" : jenUsrId},  // 노드의 값을 제외한 다른 값을 서버로 보낼 경우 otherParam에 세팅
							dataType: "json",
							dataFilter: fnTreeFilter	// 데이터 조회 후 처리할 필터 function, async 사용시 dataFilter는 반드시 지정해야 한다.
						},
						callback: {
							onClick: function(event, treeId, treeNode){
								event.preventDefault();
								// 선택 이벤트
								if(treeNode["_class"] != "com.cloudbees.hudson.plugins.folder.Folder" && treeNode.useCd == "01"){
									// job 선택한 경우
									selJobId = treeNode.jobId;
									
									zTreeJen1002.checkNode(treeNode, true, false, true);
									
									//trigger 값 조회
									fnSelJobCronSpec(treeNode.jobId);
								}else{
									selJobId = "";
									selJobPath = "";
								}
							},
							onCheck: function(event, treeId, treeNode){
								//해당 job 선택
								zTreeJen1002.selectNode(treeNode);
							},
							onAsyncError: fnAsyncError
						},
						view : {
							fontCss: getFontCss,
							nameIsHTML : true
						}
				    };
				    
					//loop start
					$.each(jobList,function(idx, map){
						//이미 생성된 job인경우 skip
						if(jobArray.indexOf(map.jobId) != -1){
							map.useCd = "02";
							
							//radio 선택 불가
							map.chkDisabled = true;
							return true;
						}else{
							map.useCd = "01";
						}
						appendStr += '<option value="'+map.name+'">'+map.name+'</option>';
					});
					//loop end
					
					$("#hideMaskFrame").hide();
					list = data.list;
					$.each(list, function(idx, obj){
						obj.viewName = obj.name;
						
						if(obj["_class"] == "com.cloudbees.hudson.plugins.folder.Folder"){
							obj.isParent = true;
							
							//radio 선택 불가
							obj.chkDisabled = true;
						}else{
							obj.isParent = false;
						}
					});
				    // zTree 초기화
				    zTreeJen1002 = $.fn.zTree.init($("#jobTree"), setting, list);
				    
				    // expandAll(false)를 추가해야 트리의 폴더를 한번 클릭 시 하위 메뉴가 보여진다.
				    // 추가하지 않을 경우 두번 클릭을 해야 폴더가 펼쳐진다.
				    zTreeJen1002.expandAll(false);
					
					//job갯수가 없는경우
					if($("#jobId option").length == 0){
						//수정일때 자신의 JOB이 없는경우
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
			
			//팝업 창 닫기
			gfnLayerPopupClose();
		});
		
		//AJAX 전송
		ajaxObj.send();
		
	}
}

/*
 * zTree View Font 설정 함수
 * @param treeId : 트리 노드의 ID
 * @treeNode : 트리 노드
 */
function getFontCss(treeId, treeNode) {
	
	// 검색된 결과가 없고, 사용유무가 미사용일 경우	
	if( !treeNode.highlight && treeNode.useCd == "02"){
		return {color:"#ddd", "font-weight":"normal"};
	// 검색된 결과가 없고, 사용유무가 사용일 경우	
	}else if( !treeNode.highlight && treeNode.useCd == "01" ){
		return {color:"#333", "font-weight":"normal"};
	}
}

/*
 * 동적트리 조회 실패시 처리
 */
function fnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown){
	// 조회 실패 메시지 출력
   	toast.push("하위 조직 조회에 실패하였습니다.");
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
		//folder 아닌 경우 job앞에 현재 상태 icon
		/* 
		if(node["_class"] != "com.cloudbees.hudson.plugins.folder.Folder" && node.hasOwnProperty("color")){
			node.viewName = '<i class="fa fa-circle job-color-'+node.color+'"></i>&nbsp;'+gfnEscapeHtml(node.name);
		}else{
			
		} */
		node.viewName = node.name;
		
		// 트리 노드가 부모형이 아닐 경우
		if( node["_class"] == "com.cloudbees.hudson.plugins.folder.Folder"){
			//radio 선택 불가
			node.chkDisabled = true;
			
			node.isParent = true;
		}

		if(jobArray.indexOf(node.jobId) != -1){
			node.useCd = "02";
			
			//radio 선택 불가
			node.chkDisabled = true;
		}else{
			node.useCd = "01";
		}
		
		zTreeJen1002.updateNode(node);
		
	});
	
	// 선택한 노드의 자식 노드를 리턴하면 자동으로 트리에 자식 노드가 추가된다. ( zTreeJen1002.addNodes()를 사용할 필요 없음)
	return childNodes;
}

 /*
  * 선택 JOB trigger 내용 조회
  *
  */
function fnSelJobCronSpec(paramJobId){
	//cron 값
	var jobTriggerVal = $("#jobTriggerVal").val();
	
	var jenUrl = $("#jenId > option:selected").attr('jenurl');
	var jenUsrId = $("#jenId > option:selected").attr('jenusrid');
	var jenUsrTok = $("#jenId > option:selected").attr('jenusrtok');
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1002JobCronSpec.do'/>",loadingShow:false}
			,{"jobId" : paramJobId, "jenUrl": jenUrl, "jenUsrId": jenUsrId, "jenUsrTok": jenUsrTok });
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		if(data.MSG_CD == "JENKINS_OK"){
			//트리거값 세팅
			var jobTriggerCd = data.jobTriggerCd;
			var jobTriggerVal = data.jobTriggerVal;
			
			$("#jobTriggerCd").val(jobTriggerCd);
			$("#jobTriggerCd").change();
			//트리거 사용하는 경우 값 교체
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
	
	//AJAX 전송
	ajaxObj.send();
}
</script>

<div class="popup jen1002-popup" >
<form id="jen1100PopupFrm" name="jen1100PopupFrm" method="post">
	<input type="hidden" name="popupGb" id="popupGb" value="${param.popupGb}"/>
	<input type="hidden" name="empId" id="empId" value="${param.empId}"/>

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
				 <!-- 
				<div class="pop_menu_row pop_menu_oneRow">
					<div class="pop_menu_col1 pop_oneRow_col1"><label for="jobTok">TOKEN KEY</label><span class="required_info">&nbsp;*</span></div>
					<div class="pop_menu_col2 pop_oneRow_col2">
						<input type="password" title="TOKEN KEY" class="input_txt" name="jobTok" id="jobTok" value="" maxlength="50"  />
					</div>
				</div>
				 -->
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
					<div class="pop_menu_col1 menu_col1_subStyle"><label for="jobBldActionCd">수동 실행 가능 유무</label></div>
					<div class="pop_menu_col2 menu_col2_subStyle">
						<span class="search_select">
							<select class="select_useCd" name="jobBldActionCd" id="jobBldActionCd" value="" style="height:100%; width:100%;" data-osl-value="01"></select>
						</span>
					</div>
				</div>
				<!-- 
				<div class="pop_note" style="margin-bottom:0px;"> 
					<div class="note_title"><label for="jobTriggerVal">Cron 값</label></div>
					<textarea class="input_note" title="Cron 값" name="jobTriggerVal" id="jobTriggerVal" rows="7" value="" maxlength="2000" readonly></textarea>
				</div>
				<div class="jenkinsTriggerMsg" id="jenkinsTriggerMsg">
					* 값 체크 메시지가 출력되는 영역입니다. (포커스 해제 시)
				</div>
				 -->
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
