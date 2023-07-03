<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp"%>

<link rel='stylesheet' href='<c:url value='/css/oslops/dpl.css'/>' type='text/css'>
<link rel="stylesheet" type="text/css" href="<c:url value='/js/highlight/styles/ir-black.css'/>">
<script type="text/javascript" src="<c:url value='/js/highlight/highlight.pack.js'/>"></script>

<!-- bootstrap-progressbar -->
<script type="text/javascript" src="<c:url value='/vendors/bootstrap-progressbar/bootstrap-progressbar.js'/>"></script>
<link href="/vendors/bootstrap-progressbar/css/bootstrap-progressbar-3.3.4.min.css" rel="stylesheet">

<style type="text/css">
	.search_select select {font-size: 0.85em;}
	.search_select {width: 124px;height: 28px;margin: 0 5px 5px 0;}
	.search_box_wrap {width: calc(100% - 404px);} /* width:calc(100% - (.search_select너비 * 갯수 + 32px))  */
	.req_right_box {border-radius: 5px;}
	.req_left_table_wrap {width: 73%;}
	
	/* 모바일 @media 제거 */
	/*
	@media screen and (max-width: 1100px) {
		.search_box {height: 100%;}
		.search_select {width: 124px;}
		.search_select select {max-width: 124px;}
		.req_left_table_wrap {width: 100%;}
		.approval_btn {margin-right: 1%;}
	}
	*/
.bg-blue {background: #3498DB !important;color: #fff; }
.sub_progress {
    float: right;
    display: inline-block;
    position: relative;
    width: 340px;
    height: 28px;
    margin: 0 5px;
    border: 1px solid #ccc;
}
</style>

<script type="text/javascript">
//선택 배포 계획 ID
var selDplId;

//JOB 상태 체크 대기 초 (1/1000 s)
var jobStatusWaitTime = 5000;

//JOB 결과 대기(+콘솔 로그) 초 (1/1000 s)
var buildResultWaitTime = 3000;

//배포 목록 선택시 flag
var selJobStatusFlag = true;
//사용자 모니터링 중지 flag
var userJobStatusFlag = true;

//빌드 실행 item 정보
var buildStartItem = null;

//콘솔 로그
var jobConsoleLog = {};

//빌드중 콘솔 로그
var jobBuildingConsoleLog = '';

var mySearch;
var Grid = {
	init : function() {
		//그리드 및 검색 상자 호출
		fnAxGrid5View(); // Grid 초기화  설정
		fnSearchBoxControl(); // Search Grid 초기화 설정
		fnAxJobGrid5View();
	},
	columnOption : {
		dpl1000Search : [ 
                 {optionValue : "rn",optionText : "전체 보기",optionAll : true}, 
                 {optionValue : "dplStsCd",optionText : '배포 상태' , optionCommonCode:"DPL00001" }, 
                 {optionValue : "dplVer",optionText : '배포 버전'}, 
                 {optionValue : "dplNm",optionText : '배포 명'}, 
                 {optionValue : "dplTypeCd",optionText : '배포 방법' , optionCommonCode:"DPL00003"},
                 {optionValue : "dplUsrNm",optionText : "배포자"},
                 {optionValue : "dplDesc",optionText : "배포 설명"} 
        		]
		}
	}
	
//빌드 실행 정보 체크
function fnJobStatusCheckLoop(){
	//선택 배포 계획 ID가 있는 경우 체크
	if(!gfnIsNull(selDplId) && selJobStatusFlag && userJobStatusFlag){
	 	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1300DplJobListAjax.do'/>","loadingShow":false}
				,"&pageNo="+firstGrid.page.currentPage+"&dplId="+selDplId);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data, status, xhr, responeAjaxTime){
			//응답시간 체크
			$("#jobAutoCheckTime").html("( 응답시간: "+responeAjaxTime+" ms )");
			
			var list = data.list;
			var page = data.page;

			//1초 후 JOB 빌드 체크 유무
			var afterStartChk = true;
			
			//job이 존재할때
			if(!gfnIsNull(list)){
				//빌드중인 job 있는지 체크
				var progressChk = false;
				$.each(list,function(idx, map){
					if(!gfnIsNull(map.bldResult)){
						var bldResult = map.bldResult;
						var bldRestoreResult = map.bldRestoreResult;
						
						//소문자 변환
						if(!gfnIsNull(bldResult)){
							bldResult = bldResult.toLowerCase();
						}
						if(!gfnIsNull(bldRestoreResult)){
							bldRestoreResult = bldRestoreResult.toLowerCase();
						}
						
						//빌드 중 - 현재 페이지
						if(!gfnIsNull(bldResult) && bldResult == "progress"){
							progressChk = true;
							//해당 JOB 빌드 결과 및 콘솔 내역 조회
							fnJobBuildResultStatus(map.jobId, map.bldNum, map);
							return false;
						}else if(!gfnIsNull(bldRestoreResult) && bldRestoreResult == "progress"){
							progressChk = true;
							//해당 JOB 빌드 결과 및 콘솔 내역 조회
							fnJobBuildResultStatus(map.jobRestoreId, map.bldRestoreNum, map);
							return false;
						}
					}
				});
				
				//Job List 목록 갱신
				if(!progressChk){
					var list = data.list;
					var page = data.page;
					
					//기존 선택 Job 저장
					var selJobTmp = jobGrid.getList('selected')[0];
					
				   	jobGrid.setData({
				             	list:list,
				             	page: {
				                  currentPage: firstGrid.page.currentPage,
				                  pageSize: page.pageSize,
				                  totalElements: page.totalElements,
				                  totalPages: page.totalPages
				              }
				             });
				   	if(!gfnIsNull(selJobTmp)){
					   	//기존 Job 선택
					   	jobGrid.select(selJobTmp.__index);
				   	}
				}
			}
			
			if(afterStartChk){
				//전송 완료시 1초 후 다시 체크
				setTimeout(fnJobStatusCheckLoop, jobStatusWaitTime);
			}
			
		});
		
		//AJAX 전송 오류 함수
		ajaxObj.setFnError(function(xhr, status, err){
			//모니터링 중단 메시지 출력
			fnJobAutoCheckMsgChg(false,"배포 계획 JOB 빌드 정보 조회 중 오류가 발생했습니다. 자동 빌드 감지를 중지합니다.");
		});
		
		//AJAX 전송
		ajaxObj.send();
	}else{
		//1초 후 다시 체크
		setTimeout(fnJobStatusCheckLoop, jobStatusWaitTime);
	}
}

//해당 JOB 빌드 결과 및 콘솔 내역 조회
function fnJobBuildResultStatus(targetJobId, targetBldNum, targetJobInfo){
	//빌드 실행 정보 체크 대기
	selJobStatusFlag = false;
	
	//선택 Job
	var selJobItem = jobGrid.getList('selected')[0];
	
	//콘솔로그 요청
	var requestConsole = "N";
	
	//Job이 있는 경우 Job check
	if(!gfnIsNull(selJobItem)){
		//main Job 또는 원복 Job을 선택한 경우
		if(targetJobId == selJobItem.jobId || targetJobId == selJobItem.jobRestoreId){
			//콘솔로그 요청
			requestConsole = "Y";
		}
	}
	
	//선택한 배포 계획 Id가 변경된 경우
	if(targetJobInfo.dplId != selDplId){
		//콘솔 로그 조회 마치고 자동 모니터링 시작
		selJobStatusFlag = true;
		return false;
	}
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl3000/dpl3000/selectDpl3000JobConsoleLogAjax.do'/>","loadingShow":false}
			,{jenUrl: targetJobInfo.jenUrl
				, jobUrl: targetJobInfo.jobUrl
				, jenUsrId: targetJobInfo.jenUsrId
				,jenUsrTok: targetJobInfo.jenUsrTok
				,dplId: targetJobInfo.dplId
				,jenId: targetJobInfo.jenId
				,jobId: targetJobId
				,bldNum: targetBldNum
				,requestConsole: requestConsole
				});
	
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		
		
		if(data.errorYn == "Y"){
			//모니터링 중단 메시지 출력
			fnJobAutoCheckMsgChg(false,"배포 계획 JOB 빌드 정보 조회 중 오류가 발생했습니다. 자동 빌드 감지를 중지합니다.");
			return false;
		}
		
		//빌드 정보
		var buildMap = data.buildMap;
		
		//빌드 정보 없는 경우 자동 감지 중지
		if(gfnIsNull(buildMap)){
			//모니터링 중단 메시지 출력
			fnJobAutoCheckMsgChg(false,"배포 계획 JOB 빌드 정보 조회 중 오류가 발생했습니다. 자동 빌드 감지를 중지합니다.");
			return false;
		}
		try{
			//콘솔 로그 재 조회
			var consoleRefreshFlag = false;
			
			//JOB 선택한 경우 콘솔로그 쓰기
			if(requestConsole == "Y" && !gfnIsNull(data.consoleText)){
				//선택 Job
				var selJobItem = jobGrid.getList('selected')[0];

				//Job이 있는 경우 Job check
				if(!gfnIsNull(selJobItem)){
					//main Job 또는 원복 Job을 선택한 경우
					if(targetJobId == selJobItem.jobId || targetJobId == selJobItem.jobRestoreId){
						//해당 Job active상태인지 체크
						if($("button.logBtnActive").attr("jobid") == targetJobId){
							//콘솔 로그 기억하기
							jobBuildingConsoleLog = data.consoleText;
							
							//콘솔 로그 출력
							$("#buildConsoleLog").html(data.consoleText);
							$("#buildConsoleLog").each(function(i, block) {hljs.highlightBlock(block);});
							
							//빌드 중인경우 로딩 icon 추가
							if(buildMap.building){
								$("#buildConsoleLog").append('<i class="fa fa-spinner fa-spin"></i>');
							}
							$("#buildConsoleLog").scrollTop(9999999);
						}else{
							//선택 안된 경우 해당 버튼 하이라이트
							if($("button.bldLogBtn[jobid="+targetJobId+"]").length > 0){
								$("button.bldLogBtn[jobid="+targetJobId+"]").animate({"background-color":"#4b73eb","color":"#fff"}, 500, function() {$(this).css({"background-color":"","color":""})});
							}
						}
					}
				}
			}
			//빌드 중인지 체크
			if(buildMap.building){
	
				//게이지바 계산
				var timestamp = buildMap.timestamp;
				var estimatedDuration = buildMap.estimatedDuration;
				
				//현재 시점
				var today = new Date().getTime();
				
				//흐른 시간
				var durationTime = (today-parseInt(timestamp));
				
				//남은 시간
				var arriveDurationTime = estimatedDuration-durationTime;
				
				//시간 지난 경우 99% 고정
				arrTime = 99;
				
				//시간 남은 경우
				if(arriveDurationTime > 0){
					//흐른 시간 값
					var arrTime = (100*(durationTime/parseInt(estimatedDuration)));
					if(arrTime > 99){
						arrTime = 99;
					}
				}
				//게이지바 적용
				$(".progress .progress-bar").attr('data-transitiongoal', arrTime).progressbar2({display_text: 'center', percent_format: function(p) {return buildMap.fullDisplayName+': ' + p+'%';}});
				
				//콘솔로그 재 조회
				consoleRefreshFlag = true;
			}else{
				//로컬 DB값 조회 체크
				var localBldInfo = data.localBldInfo;
				
				//로컬 DB 체크
				if(!gfnIsNull(localBldInfo)){
					//로컬 DB값 있는 경우 콘솔 조회 마치고 해당 JOB데이터 교체
					$.each(jobGrid.list,function(idx, map){
						//main Job인 경우
						if(map.jobId == localBldInfo.jobId){
							//정보 교체
							var selJobInfo = targetJobInfo;
							targetJobInfo["bldResult"] = localBldInfo.bldResult;
							targetJobInfo["bldResultMsg"] = localBldInfo.bldResultMsg;
							targetJobInfo["bldSeq"] = localBldInfo.bldSeq;
							targetJobInfo["bldNum"] = localBldInfo.bldNum;
							
							jobGrid.updateRow(targetJobInfo, map.__index);
							$(".progress .progress-bar").attr('data-transitiongoal', 100).progressbar2({display_text: 'center', percent_format: function(p) {return buildMap.fullDisplayName+': ' + p+'%';}});
							return false;
						}
						//원복 Job인 경우
						else if(!gfnIsNull(map.jobRestoreId) && map.jobRestoreId != "-" && map.jobRestoreId == localBldInfo.jobId){
							//정보 교체
							var selJobInfo = targetJobInfo;
							targetJobInfo["bldRestoreResult"] = localBldInfo.bldResult;
							targetJobInfo["bldRestoreResultMsg"] = localBldInfo.bldResultMsg;
							targetJobInfo["bldRestoreSeq"] = localBldInfo.bldSeq;
							targetJobInfo["bldRestoreNum"] = localBldInfo.bldNum;
							
							jobGrid.updateRow(targetJobInfo, map.__index);
							$(".progress .progress-bar").attr('data-transitiongoal', 100).progressbar2({display_text: 'center', percent_format: function(p) {return buildMap.fullDisplayName+': ' + p+'%';}});
							return false;
						}
					});
					
					//콘솔 로그 조회 마치고 자동 모니터링 시작
					selJobStatusFlag = true;
					return false;
				}
				//localDB에 결과 값 없음 콘솔 재 조회
				consoleRefreshFlag = true;
			}
			
			//콘솔 로그 재 조회
			if(consoleRefreshFlag){
				setTimeout(function(){
					fnJobBuildResultStatus(targetJobId, targetBldNum, targetJobInfo);
				}, buildResultWaitTime);
			}else{
				//콘솔 로그 조회 마치고 자동 모니터링 시작
				selJobStatusFlag = true;
				return false;
			}
		}catch(error){
			//모니터링 중단 메시지 출력
			fnJobAutoCheckMsgChg(false,"배포 계획 JOB 빌드 정보 조회 중 오류가 발생했습니다. 자동 빌드 감지를 중지합니다.");
			console.log(error);
			return false;
		}
		
	});
	
	//AJAX 전송 오류 함수
	ajaxObj.setFnError(function(xhr, status, err){
		//요청 실패한경우 실행 정보 재 실행
       	selJobStatusFlag = true;
       	fnJobStatusCheckLoop();
	});
	
	//AJAX 전송
	ajaxObj.send();
}

$(document).ready(function() {
	//모니터링 메시지 출력
	fnJobAutoCheckMsgChg(true);
	
	//빌드 실행 정보 체크
	fnJobStatusCheckLoop();
	
	// AXISJ Grid 초기화 실행 부분들
	Grid.init(); 
	
	// 배포 계획 실행 가이드 상자 호출
	gfnGuideStack("add",fnDpl3000GuideShow);
	
	//log button
	$(".bldLogBtn").click(function(){
		var logType = $(this).attr("logtype");
		
		//선택 JobGrid
		var selJobInfo = jobGrid.getList('selected')[0];
		
		//main Log
		if(logType == "main"){
			//log있는지 체크
			if(jobConsoleLog.hasOwnProperty("bldConsoleLog")){
				//빈값체크
				if(gfnIsNull(jobConsoleLog.bldConsoleLog)){
					$('#buildConsoleLog').text("콘솔 로그가 없습니다.");
				}else{
					//Log 세팅
					$('#buildConsoleLog').html(jobConsoleLog.bldConsoleLog);
					$('#buildConsoleLog').each(function(i, block) {hljs.highlightBlock(block);});
					$("#buildConsoleLog").scrollTop(9999999);
				}
			}
		}
		//sub log
		else if(logType == "sub"){
			//log있는지 체크
			if(jobConsoleLog.hasOwnProperty("bldConsoleRestoreLog")){
				//빈값체크
				if(gfnIsNull(jobConsoleLog.bldConsoleRestoreLog)){
					$('#buildConsoleLog').text("콘솔 로그가 없습니다.");
				}else{
					//Log 세팅
					$('#buildConsoleLog').html(jobConsoleLog.bldConsoleRestoreLog);
					$('#buildConsoleLog').each(function(i, block) {hljs.highlightBlock(block);});
					$("#buildConsoleLog").scrollTop(9999999);
				}
			}
		}
		
		//버튼 클릭 처리
		$("button.logBtnActive").removeClass("logBtnActive");
		//메인 로그 active
		$(this).addClass("logBtnActive");
	});
	
	//수동배포 시작
	$("#btn_update_dplAction").click(function(){
		var item = jobGrid.getList('selected')[0];
		if(gfnIsNull(item)){
			toast.push('실행(빌드)하려는 JOB을 선택해주세요.');
			return;
		}
		
		jConfirm("선택 JOB("+item.jobId+")을 수동 실행 하시겠습니까?","알림창",
			function(result) {
				if (result) {
					//빌드중인 JOB이 있는 경우 빌드 중지
					var list = jobGrid.list;
					
					var bldProgressChk = false;
					
					//job이 존재할때
					if(!gfnIsNull(list)){
						$.each(list,function(idx, map){
							if(!gfnIsNull(map.bldResult)){
								var bldResult = map.bldResult.toLowerCase();
								//빌드 중
								if(bldResult == "progress" || bldResult == "start"){
									bldProgressChk = true;
								}
							}
						});
					}
					
					//빌드 중인지 체크
					if(bldProgressChk){
						jAlert("이미 실행중인 JOB이 존재합니다.", "알림창");
					}else{
						//수동배포 시작
						fnDplStart(item);
					}
					
				}
			}
		);
		
	});
	
	//풀스크린 버튼
	$(".dplFullScreanBtn").click(function(){
		var $thisObj = $(this);
		//풀스크린 대상 번호
		var fullMode = $thisObj.attr("fullmode");
		
		var $targetObj = $("div.frame_contents[fullmode="+fullMode+"]");
		
		//풀스크린인지 체크
		var fullCheck = $targetObj.hasClass("full_screen");
		
		//풀모드
		if(fullCheck){
			$targetObj.removeClass("full_screen");
			$thisObj.children("i").addClass("fa-expand");
			$thisObj.children("i").removeClass("fa-compress");
		}else{
			$targetObj.addClass("full_screen");
			$thisObj.children("i").removeClass("fa-expand");
			$thisObj.children("i").addClass("fa-compress");
		}
	});
});

//axisj5 그리드
function fnAxGrid5View(){
	firstGrid = new ax5.ui.grid();
 
        firstGrid.setConfig({
            target: $('[data-ax5grid="first-grid"]'),
            showRowSelector: false,
            sortable:false,

            header: {align:"center",columnHeight: 30},
            columns: [
                {key : "signStsNm",label : "결재 상태",width : 91,align : "center"},
                {key : "dplStsNm",label : "배포 상태",width : 86,align : "center"},
                {key : "dplVer",label : "배포 버전",width : 95,align : "center"},
				{key : "dplNm",label : "배포 명",width : 355,align : "left"},
				{key : "dplTypeNm",label : "배포 방법",width : 90,align : "center"},
				{key : "dplDt",label : "배포 일자",width : 110,align : "center",
					formatter : function() {
						var fmtDt = this.item.dplDt;
						// IE에서는 날짜값 뒤에 시간값이 붙어있을경우 format("yyyy-MM-dd")이 정상동작 하지 않아 yyyy-MM-dd만 자른다.
						var fmtDtStr = fmtDt.substring(0, 10);
						return new Date(fmtDtStr).format("yyyy-MM-dd", true);
					}
				},
				{key : "dplRevisionNum",label : "배포 리비전 번호",width :120,align : "center",
					formatter : function() {
						var dplRevisionNum = this.item.dplRevisionNum;
						// 배포 리비전 번호가 없을 경우
						if(gfnIsNull(dplRevisionNum)){
							dplRevisionNum = "Last Revision";
						}
						
						return dplRevisionNum;
					}
				},
				{key : "dplUsrNm",label : "배포자",width :108,align : "center"},
				{key : "dplDesc",label : "배포 설명",width :390,align : "left"}
            ],
            body: {
                align: "center",
                columnHeight: 30,
                onClick: function () {
                	this.self.focus(this.dindex);
                	
                	//결재 승인상태 아닌경우 수동배포 불가능
                	if(this.item.signStsCd != "02"){
                		var signWaitTitle = "";
                		var signWaitMsg = "";
                		//결재 대기 상태
                		if(this.item.signStsCd == "01"){
                			signWaitTitle = "요청";
                			signWaitMsg = "결재 승인&반려 대기중입니다.";
                		}else if(this.item.signStsCd == "03"){
                			signWaitTitle = "반려";
                			signWaitMsg = "결재가 반려됬습니다.</br>재 결재가 필요합니다.";
                		}else if(this.item.signStsCd == "04"){
                			signWaitTitle = "기안";
                			signWaitMsg = "결재 요청 대기중입니다.";
                		}else if(this.item.signStsCd == "05"){
                			signWaitTitle = "기안(변경)";
                			signWaitMsg = "결재 요청 대기중입니다.";
                		}
                		$("#jobMaskFrame").show();
                		
                		//ago Time구하기
						var agoTime = gfnDtmAgoStr(new Date(this.item.signDtm).getTime());
				
                		$("#jobMaskFrame").html(
                				'<div class="pop_dpl_sign_frame">'
								+'	<div class="signFrameSub signFrameHalf">'
								+'		<img class="usrImgClass" src="/cmm/fms/getImage.do?fileSn=0&atchFileId='+this.item.signUsrImg+'">'
								+'	</div>'
								+'	<div class="signFrameSub signFrameHalf">'
								+'		['+this.item.signUsrNm+']</br>'
								+signWaitMsg
								+'	</div>'
								+'	<div class="signFrameSub" id="signDtmAgo">'
								+'['+signWaitTitle+' 일시] '+agoTime
								+'	</div>'
								+'</div>');
                	}
                	else{
                		$("#jobMaskFrame").hide();
                		
	                	//배포 방법이 수동이 아닌경우 배포 불가능
	                	if(this.item.dplTypeCd != "02"){
	                		//배포 방법이 자동이고 배포 상태가 실패일때 실패후 처리가 수동인경우 배포 가능
	                		if(this.item.dplStsCd == "03" && this.item.dplAutoAfterCd == "01"){
	                			$("#btn_update_dplAction").show();	
	                		}else{
		                		$("#btn_update_dplAction").hide();
	                		}
	                	}else{
	                		//배포자가 아닌경우 배포 불가능
	                		if("${sessionScope.loginVO.usrId}" != this.item.dplUsrId){
	                			$("#btn_update_dplAction").hide();	
	                		}else{
		                		$("#btn_update_dplAction").show();
	                		}
	                	}
	                	
	                	//배포 상태가 성공인경우 배포 불가능
	                	if(this.item.dplStsCd == "02"){
	                		$("#btn_update_dplAction").hide();
	                	}
	                	
	                	//배포ID 저장
	                	selDplId = this.item.dplId
	                	
	           			//JOB목록 조회
	           			fnInJobGridListSet(0,mySearch.getParam(),selDplId);
	                	
	                	//로그 초기화
	                	$("#buildConsoleLog").text("좌측에서 JOB을 선택해주세요.");
	                	
	                	//버튼 숨기기
	                	$(".bldLogBtn").hide();
                	}
                },onDBLClick:function(){
                	// 더블클릭 시 상세보기
                	var item = this.item;
                	var data = {"dplId" : item.dplId, "prjId" : item.prjId};
                	
					gfnLayerPopupOpen('/dpl/dpl1000/dpl1000/selectDpl1003View.do',data, "1200", "907");
                }
            },
            contextMenu: {
                iconWidth: 20,
                acceleratorWidth: 100,
                itemClickAndClose: false,
                icons: {
                    'arrow': '<i class="fa fa-caret-right"></i>'
                },
                items: [
                    {type: "detailPopup", label: "상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                    {type: "dplUsrDetailPopup", label: "배포자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"}
                ],
                popupFilter: function (item, param) {
                	var selItem = firstGrid.list[param.doindex];
                	//선택 개체 없는 경우 중지
                	if(typeof selItem == "undefined"){
                		return false;
                	}
                	return true;
                },
                onClick: function (item, param) {
                	var selItem = firstGrid.list[param.doindex];

                    //상세 정보
					if(item.type == "detailPopup"){
	                	var data = {"dplId" : selItem.dplId, "prjId" : selItem.prjId};
						gfnLayerPopupOpen('/dpl/dpl1000/dpl1000/selectDpl1003View.do',data, "1200", "907");
					}
					else if(item.type == "dplUsrDetailPopup"){
    	        		if(selItem.dplUsrNm == null || selItem.dplUsrNm == ""){
    	        			jAlert('배포자가 없습니다.','알림창');
    						return false;
    						
    	        		}else{
    	        			var data = {"usrId": param.item.dplUsrId}; 
    						gfnLayerPopupOpen("/cmm/cmm1000/cmm1900/selectCmm1900View.do", data, "500", "370",'auto');
    	        			
    	        		}
    				} 
                    firstGrid.contextMenu.close();
                    
                }
            },
            page: {
                navigationItemCount: 9,
                height: 30,
                display: true,
                firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
                prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
                onChange: function () {
                   fnInGridListSet(this.page.selectPage,mySearch.getParam());
                }
            }
        });
        //그리드 데이터 불러오기
 		fnInGridListSet();

}
//그리드 데이터 넣는 함수
function fnInGridListSet(_pageNo,ajaxParam){
     	/* 그리드 데이터 가져오기 */
     	//파라미터 세팅
     	if(gfnIsNull(ajaxParam)){
   			ajaxParam = $('form#searchFrm').serialize();
   		}
     	
     	//페이지 세팅
     	if(!gfnIsNull(_pageNo)){
     		ajaxParam += "&pageNo="+_pageNo;
     	}else if(typeof firstGrid.page.currentPage != "undefined"){
     		ajaxParam += "&pageNo="+firstGrid.page.currentPage;
     	}
     	
     	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1000DeployVerInfoListAjax.do'/>","loadingShow":false}
				,ajaxParam);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
			var list = data.list;
			var page = data.page;
			
		   	firstGrid.setData({
		             	list:list,
		             	page: {
		                  currentPage: _pageNo || 0,
		                  pageSize: page.pageSize,
		                  totalElements: page.totalElements,
		                  totalPages: page.totalPages
		              }
		             });
		   	
		   	//로그 초기화
            $("#buildConsoleLog").text("좌측에서 JOB을 선택해주세요.");
		});
		
		//AJAX 전송
		ajaxObj.send();
}

//검색 상자
function fnSearchBoxControl() {
	mySearch = new AXSearch();

	var fnObjSearch = {
		pageStart : function() {
			//검색도구 설정 01 ---------------------------------------------------------
			mySearch.setConfig({
				targetID : "AXSearchTarget",
				theme : "AXSearch",
				rows : [ {
					display : true,
					addClass : "",
					style : "",
					list : [{label : "<i class='fa fa-search'></i>&nbsp;",labelWidth : "50",type : "selectBox",width : "",key : "searchSelect",addClass : "",valueBoxStyle : "",value : "all",
						options : Grid.columnOption.dpl1000Search,
							onChange : function(selectedObject,value) {
									//선택 값이 전체목록인지 확인 후 입력 상자를 readonly처리
									if (!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true) {
										axdom("#"+ mySearch.getItemId("searchTxt")).attr("readonly","readonly");
										axdom("#"+ mySearch.getItemId("searchTxt")).val('');
									} else {
										axdom("#"+ mySearch.getItemId("searchTxt")).removeAttr("readonly");
									}
	
									//공통코드 처리 후 select box 세팅이 필요한 경우 사용
									if (!gfnIsNull(selectedObject.optionCommonCode)) {
										gfnCommonSetting(mySearch,selectedObject.optionCommonCode,"searchCd","searchTxt");
									} else if (value == "flowId") {
										//option 초기화
										axdom("#"+ mySearch.getItemId("searchCd")).html('');
										//목록 불러오기
										axdom("#"+ mySearch.getItemId("searchCd")).append('<option value="ALL">전체</option>');
										$.each(JSON.parse(flowList),function() {
											axdom("#"+ mySearch.getItemId("searchCd")).append('<option value="'+this.flowId+'">'+ this.flowNm+ '</option>');
										});
										axdom("#"+ mySearch.getItemId("searchCd")).append('<option value="FLW">미분류</option>');
										axdom("#"+ mySearch.getItemId("searchTxt")).hide();
										axdom("#"+ mySearch.getItemId("searchCd")).show();
									} else if (value == "sprintId") {//option 초기화
										axdom("#"+ mySearch.getItemId("searchCd")).html('');
									//개발주기가 있는 경우 목록 조회
									if (gfnIsNull(sprintList)) {
										axdom("#"+ mySearch.getItemId("searchCd")).append('<option value="">없음</option>');
									} else {
										//목록 불러오기
										$.each(JSON.parse(sprintList),function() {
											axdom("#"+ mySearch.getItemId("searchCd")).append('<option value="'+this.sprintId+'">'+ this.sprintNm+ '</option>');
										});
									}
										axdom("#"+ mySearch.getItemId("searchTxt")).hide();
										axdom("#"+ mySearch.getItemId("searchCd")).show()
									} else {
										//공통코드 처리(추가 selectbox 작업이 아닌 경우 type=text를 나타낸다.)
										axdom("#"+ mySearch.getItemId("searchTxt")).show();
										axdom("#"+ mySearch.getItemId("searchCd")).hide();
									}
								}
								},
								{label : "",labelWidth : "",type : "inputText",width : "225",key : "searchTxt",addClass : "secondItem sendBtn",valueBoxStyle : "padding-left:0px;",value : "",
									onkeyup:function(e){
										if(e.keyCode == '13' ){
											axdom("#" + mySearch.getItemId("btn_search_dlp")).click();
										}
									}
								},
								{label : "",labelWidth : "",type : "selectBox",width : "100",key : "searchCd",addClass : "selectBox",valueBoxStyle : "padding-left:0px;",value : "01",options : []},
								{label:"<i class='fas fa-list-ol'></i>&nbsp;목록 수&nbsp;", labelWidth:"60", type:"selectBox", width:"", key:"pageSize", addClass:"", valueBoxStyle:"", value:"30",
									options:[
												{optionValue:15, optionText:"15"},
				                                {optionValue:30, optionText:"30"},
				                                {optionValue:50, optionText:"50"},
				                                {optionValue:100, optionText:"100"},
				                                {optionValue:200, optionText:"200"},
				                                {optionValue:300, optionText:"300"},
												{optionValue:600, optionText:"600"},
												{optionValue:1000, optionText:"1000"},
												{optionValue:5000, optionText:"5000"},
												{optionValue:10000, optionText:"10000"}
				                                
				                            ],onChange: function(selectedObject, value){
				                            	fnInGridListSet(0,$('form#searchFrm').serialize()+"&"+mySearch.getParam());
				    						}
								},
								{label:"<i class='fas fa-arrows-v'></i>&nbsp;목록 높이&nbsp;", labelWidth:"60", type:"selectBox", width:"", key:"gridHeight", addClass:"", valueBoxStyle:"", value:"600",
									options:[
									         	{optionValue:300, optionText:"300px"},
				                                {optionValue:600, optionText:"600px"},
				                                {optionValue:1000, optionText:"1000px"},
				                                {optionValue:1200, optionText:"1200px"},
				                                {optionValue:2000, optionText:"2000px"},
				                                
				                            ],onChange: function(selectedObject, value){
				                            	firstGrid.setHeight(value);
				    						}
								},
								{label : "",labelWidth : "",type : "button",width : "70",key : "btn_print_newReqDemand",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
									onclick : function() {
										$(firstGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
									}
								},									
								{label : "",labelWidth : "",type : "button",width : "55",key : "btn_excel_newReqDemand",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
									onclick : function() {
										firstGrid.exportExcel("<c:out value='${sessionScope.selMenuNm }'/>.xls");
									}
								},
								{label : "",labelWidth : "",type : "button",width : "55",key : "btn_search_dlp",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
									onclick : function() {
										/* 검색 조건 설정 후 reload */
							            fnInGridListSet(0,mySearch.getParam());
									}
								},
								{label : "",labelWidth : "",type : "button",width : "100",key : "btn_update_dplStsCd",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-edit' aria-hidden='true'></i>&nbsp;<span>배포완료 처리</span>",
									onclick : function() {
										var item = firstGrid.getList('selected')[0];
										if(gfnIsNull(item)){
											toast.push('변경하려는 배포 계획을 선택해주세요.');
											return;
										}
										
										//배포 상태가 성공인경우 변경 불가능
										if(item.dplStsCd == "02"){
											jAlert("배포 상태가 성공일경우 변경이 불가능합니다.", "알림창");
											return false;
										}

										//결재상태가 승인이 아닌경우 변경 불가능
										if(item.signStsCd != "02"){
											jAlert("결재 상태가 승인이 아닌 경우 변경이 불가능합니다.", "알림창");
											return false;
										}
										
										//배포 방법이 자동인경우 조건 체크
										if(item.dplTypeCd == "01"){
											
											if(item.dplStsCd == "03" && item.dplAutoAfterCd == "01"){
												jConfirm("선택 배포 계획을 성공 처리 하시겠습니까?","알림창",
													function(result) {
														if (result) {
															fnDplStsCdUpdate(item.dplId,[{subCd: "02"}]);
														}
													});
											}else{
												jAlert("자동 배포 계획의 실패 후 처리가 수동인 경우에만 변경이 가능 합니다.", "알림창");
												return false;
											}
										}else{
											//배포 상태 변경 팝업 오픈
											gfnCommonPopup("배포 상태", null ,false,"${sessionScope.loginVO.licGrpId}","DPL00001",function(objs){
												//변경 값이 현재 값과 같은 경우
												if(item.dplStsCd == objs[0].subCd){
													jAlert("현재 값과 동일한 값이 선택되었습니다.", "알림창");
												}else{
													//배포 상태 변경 ajax
													fnDplStsCdUpdate(item.dplId,objs);
												}
											});
										}
										
									}
								}
								
						]}]
					});
		}
	};

	jQuery(document.body).ready(
			function() {
				fnObjSearch.pageStart();
				//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
				axdom("#" + mySearch.getItemId("searchTxt")).attr("readonly", "readonly");

				//공통코드 selectBox hide 처리
				axdom("#" + mySearch.getItemId("searchCd")).hide();

			});
	}
	
//배포 상태 변경
function fnDplStsCdUpdate(dplId, selCommonObj){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl3000/dpl3000/updateDpl3000DplStsCdView.do'/>","loadingShow":false}
			,{"dplId": dplId, "dplStsCd": selCommonObj[0].subCd});
	
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		

		//오류 없는경우
		if(data.errorYn != "Y"){
			//그리드 재조회
			 fnInGridListSet(firstGrid.page.currentPage,mySearch.getParam());
			
   			//JOB목록 조회
   			fnInJobGridListSet(0,mySearch.getParam(),selDplId);
		}
		jAlert(data.message, "알림창");
	});
	
	//AJAX 전송
	ajaxObj.send();
}

//job목록 그리드
function fnAxJobGrid5View(){
	jobGrid = new ax5.ui.grid();
 
        jobGrid.setConfig({
            target: $('[data-ax5grid="job-grid"]'),
            showRowSelector: false,
            sortable:false,

            header: {align:"center",columnHeight: 30},
            columns: [
                {key: "bldResult", label: " ", width: 30, align: "center"
					,formatter:function(){
						var result = this.item.bldResult;
						
						//소문자로 변경
						if(!gfnIsNull(result)){
							result = result.toLowerCase();
						}
						
						//원복 JOB RESULT있는경우 교체 - JOB_ID PROGRESS 또는 RESTORE인경우
						if(!gfnIsNull(this.item.jobRestoreId) && !gfnIsNull(this.item.bldRestoreResult)){
							if(result != "success"){
								result = (this.item.bldRestoreResult).toLowerCase();
							}
						} 
						
						var faIcon = "circle";
						
						//실행 결과가 있는 경우 체크로
						//icon
						if(result == "fail" || result == "failure"){
							faIcon = "times-circle";
						}
						else if(result == "success"){
							faIcon = "check-circle";
						}else if(result == "progress" || result == "start"){
							faIcon = "circle-notch fa-spin";
						}else if(result == "restore"){
							faIcon = "circle-notch fa-spin";
						}else if(result == "aborted"){
							faIcon = "exclamation-circle";
						}
						
						return '<i class="fas fa-'+faIcon+' result-'+result+'"></i>';
					}},
                {key: "jobStartOrd", label: "실행 순서", width: 70, align: "center"},
                {key: "jobTypeNm", label: "JOB TYPE", width: 80, align: "center"},
                {key: "bldNum", label: "빌드 번호", width: 80, align: "center"},
				{key: "jobId", label: "JOB ID", width: 120, align: "left"},
				{key: "jobParameter", label: "JOB 매개변수", width: 100, align: "center"},
				{key: "bldResultMsg", label: "실행 결과", width: 200, align: "center"},
				{key: "bldRestoreNum", label: "원복 빌드 번호", width: 120, align: "center"},
				{key: "jobRestoreId", label: "원복 JOB ID", width: 120, align: "center"},
				{key: "bldRestoreResultMsg", label: "원복 결과", width: 200, align: "center"},
            ],
            body: {
                align: "center",
                columnHeight: 30,
                onClick: function () {
                	this.self.focus(this.dindex);
                	
                	//콘솔 버튼
    				$("#btn_bldMainLog").show();
    				$("#btn_bldMainLog").attr("jobid",this.item.jobId);
    				$("#bldMainConsoleLog").html(this.item.jobId);
    				
    				//메인 로그 active
    				$("#btn_bldMainLog").addClass("logBtnActive");
    				
    				//원복 ID있는경우 버튼
    				if(!gfnIsNull(this.item.jobRestoreId)){
    					$("#btn_bldSubLog").show();
    					$("#btn_bldSubLog").attr("jobid",this.item.jobRestoreId);
    					$("#bldSubConsoleLog").html(this.item.jobRestoreId);
    				}else{
    					$("#btn_bldSubLog").hide();	
    				}
    				
    				//선택 JOB 콘솔로그 불러오기
    				fnSelJobConsoleLogLoad(this.item);
    				
                },onDBLClick:function(){
                	// 더블클릭 시 상세보기
                	var data = {"jenId": this.item.jenId, "jobId": this.item.jobId};
					gfnLayerPopupOpen('/stm/stm3000/stm3000/selectStm3004JobDetailView.do',data,"1200", "870",'scroll');
                }
            },
            contextMenu: {
                iconWidth: 20,
                acceleratorWidth: 100,
                itemClickAndClose: false,
                icons: {
                    'arrow': '<i class="fa fa-caret-right"></i>'
                },
                items: [
                    {type: "detailPopup", label: "상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                    {type: "detailParamPopup", label: "빌드 파라미터", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                ],
                popupFilter: function (item, param) {
                	var selItem = jobGrid.list[param.doindex];
                	//선택 개체 없는 경우 중지
                	if(typeof selItem == "undefined"){
                		return false;
                	}
                	return true;
                },
                onClick: function (item, param) {
                	var selItem = jobGrid.list[param.doindex];

                    //상세 정보
					if(item.type == "detailPopup"){
						// 더블클릭 시 상세보기
	                	var data = {"jenId": selItem.jenId, "jobId": selItem.jobId};
						gfnLayerPopupOpen('/stm/stm3000/stm3000/selectStm3004JobDetailView.do',data,"1200", "870",'scroll');
					}else if(item.type == "detailParamPopup"){
						// 빌드 파라미터 상세 보기

						var data = {
								"prjId" : selItem.prjId,
								"dplId" : selItem.dplId,
								"jobId" : selItem.jobId,
								"jenId" : selItem.jenId
						};
						
						// dpl1004 팝업 호출
						gfnLayerPopupOpen('/dpl/dpl1000/dpl1000/selectDpl1005View.do',data,"840","300",'scroll');
					}
					jobGrid.contextMenu.close();
                    
                }
            },
            page: {
                navigationItemCount: 9,
                height: 30,
                display: true,
                firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
                prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
                onChange: function () {
                	//게이지바 초기화
		    		$(".progress .progress-bar").attr('data-transitiongoal', 0).progressbar2({display_text: 'center', percent_format: function(p) {return '0%';}});
					fnInJobGridListSet(this.page.selectPage,mySearch.getParam(),selDplId);
                }
            }
        });
}

//선택 JOB 콘솔로그 불러오기
function fnSelJobConsoleLogLoad(jobItem){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl3000/dpl3000/selectDpl3000DplConsoleLogView.do'/>","loadingShow":false}
			,{dplId: jobItem.dplId
				,jenId: jobItem.jenId
				,jobId: jobItem.jobId});
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		
		var localJobInfo = data.localJobInfo;
		
		//반환 데이터
		if(!gfnIsNull(localJobInfo)){
			//로그 데이터 세팅
			jobConsoleLog = {bldConsoleLog: localJobInfo.bldConsoleLog, bldConsoleRestoreLog: localJobInfo.bldConsoleRestoreLog};
			
			//메인에 콘솔 세팅 체크
			var mainConsoleSetChk = false;
			
			//빌드 중이 아닐경우 Main Log 세팅
			if(selJobStatusFlag){
				mainConsoleSetChk = true;
			}else{
				//빌드 중인경우 빌드중인 Job체크하고 선택 Job과 비교
				$.each(jobGrid.list,function(idx, map){
					if(map.jobId == localJobInfo.jobId){
						//빌드 진행 중이 아닌 경우 콘솔 보이기
						if(map.bldResult != "PROGRESS"){
							mainConsoleSetChk = true;
							return false;
						}
					}
				});
			}
			
			//콘솔 보이기
			if(mainConsoleSetChk){
				$('#buildConsoleLog').html(localJobInfo.bldConsoleLog);
				$('#buildConsoleLog').each(function(i, block) {hljs.highlightBlock(block);});
				$("#buildConsoleLog").scrollTop(9999999);
			}else{
				//빌드 중인경우 이전 콘솔 로그 넣기
				$('#buildConsoleLog').html(jobBuildingConsoleLog);
				$('#buildConsoleLog').each(function(i, block) {hljs.highlightBlock(block);});
				$("#buildConsoleLog").append('<i class="fa fa-spinner fa-spin"></i>');
				$("#buildConsoleLog").scrollTop(9999999);
			}
		}
	});
	
	//AJAX 전송
	ajaxObj.send();
}

//JOB목록 그리드 데이터 넣는 함수
function fnInJobGridListSet(_pageNo,ajaxParam,dplId){
     	/* 그리드 데이터 가져오기 */
     	//파라미터 세팅
     	if(gfnIsNull(ajaxParam)){
   			ajaxParam = $('form#searchFrm').serialize();
   		}
     	
     	//페이지 세팅
     	if(!gfnIsNull(_pageNo)){
     		ajaxParam += "&pageNo="+_pageNo;
     	}else if(typeof jobGrid.page.currentPage != "undefined"){
     		ajaxParam += "&pageNo="+jobGrid.page.currentPage;
     	}
     	
     	ajaxParam += "&dplId="+dplId;
     	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1300DplJobListAjax.do'/>","loadingShow":false}
				,ajaxParam);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
			var list = data.list;
			var page = data.page;
			
		   	jobGrid.setData({
		             	list:list,
		             	page: {
		                  currentPage: _pageNo || 0,
		                  pageSize: page.pageSize,
		                  totalElements: page.totalElements,
		                  totalPages: page.totalPages
		              }
		             });
			
			//빌드 중인 JOB이 없는경우 게이지바 초기화
		    $(".progress .progress-bar").attr('data-transitiongoal', 0).progressbar2({display_text: 'center', percent_format: function(p) {return '0%';}});
	    		
		});
		
		//AJAX 전송
		ajaxObj.send();
}

//수동배포 시작
function fnDplStart(item){
	//게이지바 초기화
	$(".progress .progress-bar").attr('data-transitiongoal', 0).progressbar2({display_text: 'center'});

	if(!gfnIsNull(item)){
		jobGrid.setValue(item.__original_index, "bldResult", "START");
		jobGrid.setValue(item.__original_index, "bldResultMsg", "빌드 준비 중");
	}
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl3000/dpl3000/selectDpl3000JobBuildAjax.do'/>","loadingShow":false}
			,item);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		
		
		if(data.errorYn == "Y"){
			jAlert(data.message, "알림창");
			
			jobGrid.setValue(item.__original_index, "bldResult", "FAILURE");
			jobGrid.setValue(item.__original_index, "bldResultMsg", "빌드 오류");
			return false;
		}else{
			//콘솔 로그 초기화
			jobBuildingConsoleLog = '';
			
			//빌드중인 JOB넣기
			buildStartItem = item;

			//빌드 번호, 예상 소요시간, 시작 시간
    		buildStartItem["bldNum"] = data.bldNum;
    		buildStartItem["estimatedDuration"] = data.estimatedDuration;
    		buildStartItem["timestamp"] = data.timestamp;

    		//선택 배포 계획 변경 안된 경우 그리드 정보 변경
			if(selDplId != item.dplId){
				//그리드 JOB 정보 변경
				jobGrid.setValue(item.__original_index, "bldResult", data.bldResult);
				jobGrid.setValue(item.__original_index, "bldResultMsg", data.bldResultMsg);
			}
		}
		
	});
	
	//AJAX 전송
	ajaxObj.send();
}

// 배포 계획 실행 가이드 상자
function fnDpl3000GuideShow(){
	var mainObj = $(".main_contents");
	
	// mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	// guide box setting
	var guideBoxInfo = globals_guideContents["dpl3000"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}

//JOB 실행 자동 모니터링 상태 체크
function fnJobAutoCheckMsgChg(successFlag, failureMsg){
	//모니터링 중
	if(successFlag){
		$("#jobAutoCheckIcon").html('<i class="fas fa-spinner fa-spin  fa-blue"></i>');
		$("#jobAutoCheckMsg").html('JOB 실행 자동 모니터링 중');
		$("#jobAutoCheckTime").html("( 응답시간: 0 ms )");
		
		//버튼 보이기
		$("#btn_select_jobAutoCheckOn").hide();
		$("#btn_select_jobAutoCheckOff").show();
	}
	//모니터링 중단
	else{
		$("#jobAutoCheckIcon").html('<i class="fas fa-pause-circle fa-red"></i>');
		$("#jobAutoCheckMsg").html(failureMsg);
		$("#jobAutoCheckTime").html("( 응답시간: 0 ms )");
		
		//버튼 보이기
		$("#btn_select_jobAutoCheckOn").show();
		$("#btn_select_jobAutoCheckOff").hide();
	}
}

//자동 모니터링 on/off
function fnJobAutoCheckSwitch(onOffValue){
	//시작
	if(onOffValue){
		fnJobAutoCheckMsgChg(true);
		userJobStatusFlag = true;
	}
	//중지
	else{
		fnJobAutoCheckMsgChg(false,"사용자에 의해 중지되었습니다.");
		//모니터링 중지 없음 - 20200113
		//userJobStatusFlag = false;
	}
}
</script>
<div class="main_contents" style="height: auto;">
	<div class="dpl_title"><c:out value="${sessionScope.selMenuNm }"/></div>
	<div class="tab_contents menu" style="max-width: 1500px;position: relative;">
		<form:form commandName="dpl1000VO" id="searchFrm" name="searchFrm" method="post" onsubmit="return false"></form:form>
		<div id="AXSearchTarget" style="border-top: 1px solid #ccc;"></div>
		<br />
		<div data-ax5grid="first-grid" data-ax5grid-config="{}" style="height: 250px;" guide="dpl3000DplList"></div>
		<div class="main_frame middleJobInfoFrame">
			<div class="jobBuildAutoCheckDiv sub_title">
				<div class="jobAutoCheckIcon" id="jobAutoCheckIcon"></div>
				<div class="jobAutoCheckMsg" id="jobAutoCheckMsg"></div>
				<div class="jobAutoCheckTime" id="jobAutoCheckTime"></div>
				<button type="button" id="btn_select_jobAutoCheckOn" onclick="fnJobAutoCheckSwitch(true)" title="" placeholder="" style="width:120px;" class="AXButton searchButtonItem "><i class="fa fa-play-circle" aria-hidden="true"></i>&nbsp;<span>모니터링 재 시작</span></button>
				<button type="button" id="btn_select_jobAutoCheckOff" onclick="fnJobAutoCheckSwitch(false)" title="" placeholder="" style="width:120px;" class="AXButton searchButtonItem "><i class="fa fa-pause-circle" aria-hidden="true"></i>&nbsp;<span>모니터링 중지</span></button>
			</div>
		</div>
		<div class="main_frame bottomJobInfoFrame">
			<div class="jobMaskFrame" id="jobMaskFrame">상단의 배포계획을 선택해주세요.</div>
			<div class="frame_contents left" fullmode="1" guide="dpl3000DplJobList">
				<div class="sub_title">
					JOB 배정 목록
					<div class="sub_title_btn right">
						<div class="progress progress_sm sub_progress">
							<div class="progress-bar bg-blue" role="progressbar" data-transitiongoal="100"></div>
						</div>
						<button type="button" id="btn_update_dplAction" title="" placeholder="" style="width:90px;" class="AXButton searchButtonItem "><i class="fa fa-play-circle" aria-hidden="true"></i>&nbsp;<span>수동 실행</span></button>
					</div>
				</div>
				<div data-ax5grid="job-grid" data-ax5grid-config="{}" style="height: 300px;"></div>
			</div>
			<div class="frame_contents right" fullmode="2" guide="dpl3000JobConsolLog">
				<div class="sub_title">
					선택 JOB 콘솔 로그
					<div class="sub_title_btn right">
						<button type="button" id="btn_bldMainLog" title="" style="width:150px;" class="AXButton searchButtonItem bldLogBtn" logtype="main"><i class="fa fa-desktop" aria-hidden="true"></i>&nbsp;<span id="bldMainConsoleLog"></span></button>
						<button type="button" id="btn_bldSubLog" title="" style="width:150px;" class="AXButton searchButtonItem bldLogBtn" logtype="sub"><i class="fa fa-desktop" aria-hidden="true"></i>&nbsp;<span id="bldSubConsoleLog"></span></button>
						<div class="dplFullScreanBtn" fullmode="2"><i class="fas fa-expand"></i></div>
					</div>
				</div>
				<div id="contentsFrame">
					<pre>
						<code id="buildConsoleLog">좌측에서 JOB을 선택해주세요.</code>
					</pre>
				</div>
			</div>
		</div>
	</div>
</div>

<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />