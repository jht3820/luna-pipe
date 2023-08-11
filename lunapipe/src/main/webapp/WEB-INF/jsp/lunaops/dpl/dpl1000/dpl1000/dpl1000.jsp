<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp"%>

<link rel='stylesheet' href='<c:url value='/css/lunaops/dpl.css'/>' type='text/css'>
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
//JOB 목록 그리드
var dplJobGrid;
//search var
var dplJobSearchObj;

//JOB 상태 체크 대기 초 (1/1000 s)
var jobStatusWaitTime = 5000;

//JOB 결과 대기(+콘솔 로그) 초 (1/1000 s)
var buildResultWaitTime = 3000;

//선택 JOB 있는 경우
var selJobStatusFlag = true;
//사용자 모니터링 중지 flag
var userJobStatusFlag = true;

//콘솔 로그
var jobConsoleLog = {};

//빌드중 콘솔 로그
var jobBuildingConsoleLog = '';

//구성항목ID, 티켓ID, 배포계획ID
var ciId = '<c:out value="${requestScope.ciId}"/>';
var ticketId = '<c:out value="${requestScope.ticketId}"/>';
var dplId = '<c:out value="${requestScope.dplId}"/>';

//console timer
var consoleTimer;

$(document).ready(function() {
	/* 
	//모니터링 메시지 출력
	fnJobAutoCheckMsgChg(true);
	*/
	
	//빌드 실행 정보 체크
	fnJobStatusCheckLoop();
	
	//JENKINS&JOB 목록, 검색영역
	fnAxGrid5View();
	fnDplJobSearchSetting();
	
	// 배포 계획 실행 가이드 상자 호출
	gfnGuideStack("add",fnDpl1000GuideShow);
	
	//log button
	$(".bldLogBtn").click(function(){
		var logType = $(this).attr("logtype");
		
		//선택 JobGrid
		var selJobInfo = dplJobGrid.getList('selected')[0];
		
		//main Log
		if(logType == "main"){
			//log있는지 체크
			if(jobConsoleLog.hasOwnProperty("bldConsoleLog")){
				//빈값체크
				if(gfnIsNull(jobConsoleLog.bldConsoleLog)){
					$('#buildConsoleLog').text("-");
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
					$('#buildConsoleLog').text("-");
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
		var item = dplJobGrid.getList('selected')[0];
		if(gfnIsNull(item)){
			toast.push('실행(빌드)하려는 JOB을 선택해주세요.');
			return;
		}
		
		jConfirm("선택 JOB("+item.jobId+")을 수동 실행 하시겠습니까?","알림창",
			function(result) {
				if (result) {
					//수동배포 시작
					fnDplStart(item);
					return;
					
					/* JOB 실행 조건 넣을지 체크 필요 */
					//빌드중인 JOB이 있는 경우 빌드 중지
					var list = dplJobGrid.list;
					
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
	
	//빌드 중지 버튼 클릭 이벤트
	$("#btn_update_dplActionStop").click(function(){
		var item = dplJobGrid.getList('selected')[0];
		if(gfnIsNull(item)){
			toast.push('실행(빌드) 중지하려는 JOB을 선택해주세요.');
			return;
		}
		
		jConfirm("선택 JOB("+item.jobId+")을 실행 중지 시키겠습니까?","알림창",
			function(result) {
				if (result) {
					//빌드 중지 처리 fn
					fnDplActionStop(item);
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
			//풀스크린인 객체가 없는 경우
			if($(".frame_contents.full_screen").length == 0){
				$("#bottomJobInfoFrame").addClass("bottomJobInfoFrame");
			}
		}else{
			//풀스크린인 객체가 없는 경우
			if($(".frame_contents.full_screen").length == 0){
				$("#bottomJobInfoFrame").removeClass("bottomJobInfoFrame");
			}
			$targetObj.addClass("full_screen");
			$thisObj.children("i").removeClass("fa-expand");
			$thisObj.children("i").addClass("fa-compress");
		}
	});
	
	//빌드 파라미터 값 팝업
	$("#btn_select_bldParam").click(function(){
		var jenId = $(this).data("jenId");
		var jobId = $(this).data("jobId");
		var bldNum = $(this).data("bldNum");
		
		var data = {
				"jenId" : jenId,
				"jobId" : jobId,
				"bldNum" : bldNum
		};
		
		// jen1006 파라미터 조회 팝업 호출
		gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1006View.do',data,"840","300",'scroll');
	});
});

//빌드 실행 정보 체크
function fnJobStatusCheckLoop(){
	//중단 없는 경우
	if(selJobStatusFlag && userJobStatusFlag && !gfnIsNull(dplJobGrid)){
	    //AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1100BldingJobList.do'/>","loadingShow":false}
			,"&pageNo="+dplJobGrid.page.currentPage+"&ciId="+ciId+"&ticketId="+ticketId+"&dplId="+dplId);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			//job이 존재할때
			if(!gfnIsNull(data.bldingJobList) && data.bldingJobList.length > 0){
				//빌드중인 job 있는지 체크
				var progressChk = false;

				//현재 선택된 JOB
				var selJobInfo = dplJobGrid.getList('selected')[0];
				
				//조회 JOB Map 분류
				var bldingJobList = {};
				
				$.each(data.bldingJobList,function(idx, map){
					//jenkins id
					if(!bldingJobList.hasOwnProperty(map.jenId)){
						bldingJobList[map.jenId] = {};
					}
					//job id
					if(!bldingJobList[map.jenId].hasOwnProperty(map.jobId)){
						bldingJobList[map.jenId][map.jobId] = {};
					}
					bldingJobList[map.jenId][map.jobId] = map;
				});
				
				//그리드 목록
				$.each(dplJobGrid.list,function(idx, map){
					//해당 JOB데이터가 빌드중 JOB에 있는 경우
					if(bldingJobList.hasOwnProperty(map.jenId) && bldingJobList[map.jenId].hasOwnProperty(map.jobId)){
						//빌드JOB 데이터
						var bldJobInfoData = bldingJobList[map.jenId][map.jobId];
						
						//빌드된 데이터가 있는 경우
						if(!gfnIsNull(bldJobInfoData["bldResultCd"]) && map.bldResultCd != bldJobInfoData["bldResultCd"]){
							//데이터 값 변경
							map.bldResultCd = bldJobInfoData["bldResultCd"];
							map.bldResult = bldJobInfoData["bldResult"];
							map.bldNum = bldJobInfoData["bldNum"];
							
							//그리드 데이터 변경
							progressChk = true;
							
							//해당 JOB이 선택된 JOB인 경우 빌드 정보, 콘솔 로그 조회
							if(!gfnIsNull(selJobInfo) && selJobInfo["jenId"] == map["jenId"] && selJobInfo["jobId"] == map["jobId"]) {
								fnJobBuildResultStatus(map);
							}
						}
					}
				});
				
				//그리드 데이터 변경된 경우
				if(progressChk){
					dplJobGrid.repaint();
				}
			}
		   	
			//전송 완료시 다시 체크
			setTimeout(fnJobStatusCheckLoop, jobStatusWaitTime);
		});
		
		//AJAX 전송
		ajaxObj.send();
	}else{
		// 다시 체크
		setTimeout(fnJobStatusCheckLoop, jobStatusWaitTime);
	}
}

//해당 JOB 빌드 결과 및 콘솔 내역 조회
function fnJobBuildResultStatus(targetJobInfo){
	//console log timer 중지
	if(!gfnIsNull(consoleTimer)){
		clearTimeout(consoleTimer);
	}
	
	var targetJenId = targetJobInfo["jenId"];
	var targetJobId = targetJobInfo["jobId"];
	var targetBldNum = targetJobInfo["bldNum"];
	
	//빌드 실행 정보 체크 대기
	selJobStatusFlag = false;
	
	//선택 Job
	var selJobItem = dplJobGrid.getList('selected')[0];
	
	//현재 선택된 대상 JOB이 아닌 경우 (변경된 경우 중지)
	if(gfnIsNull(selJobItem) || (targetJenId != selJobItem.jenId && targetJobId != selJobItem.jobId)){
		//빌드 실행 감지
		selJobStatusFlag = true;
		return true;
	}
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1000JobConsoleLogAjax.do'/>","loadingShow":false}
			,{jenId: targetJobInfo.jenId, jobId: targetJobId, targetBldNum: targetBldNum});
	
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		if(data.errorYn == "Y"){
			jAlert("빌드 정보 조회 중 오류가 발생했습니다.</br>페이지를 새로고침해주세요.</br></br>[Message]</br>"+data.message);
			return false;
		}
		
		//빌드 정보
		var bldInfo = data.bldInfo;
		var bldChgList;
		var bldChgFileList;
		
		//JOB 정보
		var jobInfo = data.jobMap;
		
		try{
			//콘솔 로그 재 조회
			var consoleRefreshFlag = false;
			
			//JOB 선택한 경우 콘솔로그 쓰기
			if(!gfnIsNull(bldInfo)){
				//빌드 변경 정보
				bldChgList = bldInfo["bldChgList"];
				bldChgFileList = bldInfo["bldChgFileList"];
			}else{
				//빌드 정보가 아예 없는 경우
				fnBldFormDataReset();
				return false;
			}
			
			//변경 정보 세팅
			bldDetailFrameSet(jobInfo, bldInfo, bldChgList, bldChgFileList);
			
			//빌드 중인지 체크
			if(!gfnIsNull(bldInfo["isBuilding"]) && bldInfo["isBuilding"]) {
				//수동배포 버튼 감추기
				$("#btn_update_dplAction").hide();
				//빌드중지 버튼 보이기
				$("#btn_update_dplActionStop").show();
				
				//building 표시
				if(bldInfo["bldResultCd"] != selJobItem["bldResultCd"]){
					dplJobGrid.setValue(selJobItem.__original_index, "bldResult", bldInfo["bldResult"]);
					dplJobGrid.setValue(selJobItem.__original_index, "bldResultCd", bldInfo["bldResultCd"]);
				}
				
				//빌드 중인경우 로딩 icon 추가
				$("#buildConsoleLog").append('<i class="fa fa-spinner fa-spin"></i>');
				$("#buildConsoleLog").scrollTop(9999999);
				
				//게이지바 계산
				var timestamp = bldInfo["bldStartDtm"];
				var estimatedDuration = bldInfo["bldEtmDurationTm"];
				
				//현재 시점
				var today = new Date().getTime();
				
				//흐른 시간
				var durationTime = (today-parseInt(timestamp));
				
				//남은 시간
				var arriveDurationTime = estimatedDuration-durationTime;
				//console.log("(estimatedDuration: "+estimatedDuration+") durationTime: "+durationTime+" / arriveDurationTime: "+arriveDurationTime );
				//시간 지난 경우 99% 고정
				var arrTime = 99;
				
				//시간 남은 경우
				if(arriveDurationTime > 0){
					//흐른 시간 값
					var arrTime = (100*(durationTime/parseInt(estimatedDuration)));
					if(arrTime > 99){
						arrTime = 99;
					}
				}
				//게이지바 적용
				$("#bldProgressBar.progress .progress-bar").attr('data-transitiongoal', arrTime).progressbar2({display_text: 'center', percent_format: function(p) {return bldInfo["jobId"]+': ' + p+'%';}});
				
				//콘솔로그 재 조회
				consoleRefreshFlag = true;
			}else{
				//Queue에 있거나 현재 빌드번호와 데이터 빌드번호가 다를때
				if((!gfnIsNull(bldInfo["isInQueue"]) && bldInfo["isInQueue"]) || (!gfnIsNull(targetBldNum) && targetBldNum != bldInfo["bldNum"])){
					//console.log("log 재 조회1");
					//콘솔로그 재 조회
					consoleRefreshFlag = true;
					//수동배포 버튼 감추기
					$("#btn_update_dplAction").hide();
					//빌드중지 버튼 보이기
					$("#btn_update_dplActionStop").show();
				}else{
					//console.log("target bldnum: "+targetBldNum+" / bldnum: "+bldInfo["bldNum"]);
					//target 빌드 번호와 데이터 빌드 번호가 다른 경우 콘솔 재 조회
					//console.log("기존 cd : "+selJobItem["bldResultCd"]+"  msg: "+selJobItem["bldResult"]);
					//console.log("값 변경 cd : "+bldInfo["bldResultCd"]+"  msg: "+bldInfo["bldResult"]);
					//그리드 갱신
					dplJobGrid.setValue(selJobItem.__original_index, "bldResult", bldInfo["bldResult"]);
					dplJobGrid.setValue(selJobItem.__original_index, "bldResultCd", bldInfo["bldResultCd"]);
					dplJobGrid.setValue(selJobItem.__original_index, "bldNum", bldInfo["bldNum"]);
					
					$("#bldProgressBar.progress .progress-bar").attr('data-transitiongoal', 100).progressbar2({display_text: 'center', percent_format: function(p) {return bldInfo["jobId"]+': ' + p+'%';}});
						
					//스크롤 맨 밑
					$("#buildConsoleLog").scrollTop(9999999);
					
					//수동배포 버튼 보이기
					$("#btn_update_dplAction").show();
					
					//빌드중지 버튼 감추기
					$("#btn_update_dplActionStop").hide();
				}
			}
			
			//콘솔 로그 재 조회
			if(consoleRefreshFlag){
				consoleTimer = setTimeout(function(){fnJobBuildResultStatus(targetJobInfo);}, buildResultWaitTime);
			}else{
				//콘솔 로그 조회 마치고 자동 모니터링 시작
				selJobStatusFlag = true;
				return false;
			}
		}catch(error){
			//모니터링 중단 메시지 출력
			//fnJobAutoCheckMsgChg(false,"배포 계획 JOB 빌드 정보 조회 중 오류가 발생했습니다. 자동 빌드 감지를 중지합니다.");
			console.log(error);
			return false;
		}
		
	});
	
	//AJAX 전송 오류 함수
	ajaxObj.setFnError(function(xhr, status, err){
		//요청 실패한경우 실행 정보 재 실행
       	selJobStatusFlag = true;
	});
	
	//AJAX 전송
	ajaxObj.send();
}

//배포계획에 배정된 JOB 목록
function fnAxGrid5View(){
	dplJobGrid = new ax5.ui.grid();
 
        dplJobGrid.setConfig({
            target: $('[data-ax5grid="dplJobGrid"]'),
            showRowSelector: false,
            sortable:false,

            header: {align:"center",columnHeight: 30},
            columns: [
            	{key: "bldResultCd", label: " ", width: 30, align: "center"
					,formatter:function(){
						var result = this.item.bldResultCd;
						
						var faIcon = "circle";
						var iconColor = result;
						//실행 결과가 있는 경우 체크로
						//icon
						if(!gfnIsNull(result)){
							if(result == "04" || result == "10"){
								faIcon = "times-circle";
							}
							else if(result == "03"){
								faIcon = "check-circle";
							}else if(result == "01" || result == "02"){
								faIcon = "circle-notch fa-spin";
							}else if(result == "05"){
								faIcon = "exclamation-circle";
							}else{
								faIcon = "question-circle";
								iconColor = "etc";
							}
						}
						
						return '<i class="fas fa-'+faIcon+' result-'+result+'"></i>';
				}},
    			{key: "bldResult", label: "빌드 상태", width: 150, align: "center",
					formatter: function(){
						var result = this.item.bldResult;
						
						if(gfnIsNull(result)){
							result = "-";
						}
						return result;
					}},
    			{key: "bldNum", label: "빌드 번호", width: 80, align: "center",
					formatter: function(){
						var result = this.item.bldNum;
						
						if(gfnIsNull(result)){
							result = 0;
						}
						return result;
					}
    			},
    			{key: "jobStartOrd", label: "순서", width: 80, align: "center"},
              	{key: "jenNm", label: "JENKINS NAME", width: 211, align: "center"},
    			{key: "jobId", label: "JOB ID", width: 230, align: "center"},
    			{key: "jobTypeNm", label: "JOB TYPE", width: 95, align: "center"},
              	{key: "jenUrl", label: "JENKINS URL", width: 180, align: "center"},
              	{key: "jenDesc", label: "JENKINS 설명", width: 200, align: "center"},
    			{key: "jobDesc", label: "JOB 설명", width: 200, align: "center"},
          ],
            body: {
                align: "center",
                columnHeight: 30,
                onClick: function () {
                	//이전 선택 row 해제
       				this.self.select(this.self.selectedDataIndexs[0]);
    				
    				//현재 선택 row 전체 선택
    				this.self.select(this.doindex);
                	
                	//mask 해제
                	$("#jobMaskFrame").hide();
                		
                	//선택 JOB 콘솔로그 불러오기
               		fnJobBuildResultStatus(this.item);
                },onDBLClick:function(){
                	// 더블클릭 시 상세보기
					var data = {"jenId": this.item.jenId, "jobId": this.item.jobId};
					gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1004JobDetailView.do',data,"1200", "870",'scroll');
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
                	var selItem = dplJobGrid.list[param.doindex];
                	//선택 개체 없는 경우 중지
                	if(typeof selItem == "undefined"){
                		return false;
                	}
                	return true;
                },
                onClick: function (item, param) {
                	var selItem = dplJobGrid.list[param.doindex];

                    //상세 정보
					if(item.type == "detailPopup"){
						var data = {
							"jenId": selItem.jenId, "jobId": selItem.jobId
						};
						gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1004JobDetailView.do',data,"1200", "870",'scroll');

						
					}else if(item.type == "detailParamPopup"){
						// 빌드 파라미터 상세 보기
						var data = {
								"ciId": selItem.ciId,
								"ticketId": selItem.ticketId,
								"dplId": selItem.dplId,
								"jenId" : selItem.jenId,
								"jobId" : selItem.jobId
						};
						
						// dpl1004 팝업 호출
						gfnLayerPopupOpen('/dpl/dpl1000/dpl1000/selectDpl1001View.do',data,"840","300",'scroll');
					}
					dplJobGrid.contextMenu.close();
                    
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
                   fnInGridListSet(this.page.selectPage,dplJobSearchObj.getParam());
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
   	}else if(typeof dplJobGrid.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+dplJobGrid.page.currentPage;
   	}
   	
   	//매개변수 세팅
   	ajaxParam += "&ciId="+ciId+"&ticketId="+ticketId+"&dplId="+dplId;
    	
    	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
		{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1100DplJobListAjax.do'/>","loadingShow":false}
		,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		
		var list = data.list;
		var page = data.page;
		
	   	dplJobGrid.setData({
			list:list,
			page: {
				currentPage: _pageNo || 0,
				pageSize: page.pageSize,
				totalElements: page.totalElements,
				totalPages: page.totalPages
			}
		});
	   	
	   	//로그 초기화
		$("#buildConsoleLog").text("-");
	});
	
	//AJAX 전송
	ajaxObj.send();
}

//검색 상자
function fnDplJobSearchSetting() {
	dplJobSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart : function() {
			//검색도구 설정 01 ---------------------------------------------------------
			dplJobSearchObj.setConfig({
				targetID : "dplJobSearch",
				theme : "AXSearch",
				rows : [ {
					display : true,
					addClass : "",
					style : "",
					list : [{label : "<i class='fa fa-search'></i>&nbsp;",labelWidth : "50",type : "selectBox",width : "",key : "searchSelect",addClass : "",valueBoxStyle : "",value : "all",
						options : [
							{optionValue : "rn",optionText : "전체 보기",optionAll : true}, 
							{optionValue : "jenNm",optionText : 'JENKINS 명'}, 
							{optionValue : "jenUrl",optionText : 'JENKINS URL'}, 
							{optionValue : "jobId",optionText : 'JOB ID'}, 
							{optionValue : "jobTypeCd", optionText : 'JOB 타입' , optionCommonCode:"DPL00002"},
						],
							onChange : function(selectedObject,value) {
									//선택 값이 전체목록인지 확인 후 입력 상자를 readonly처리
									if (!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true) {
										axdom("#"+ dplJobSearchObj.getItemId("searchTxt")).attr("readonly","readonly");
										axdom("#"+ dplJobSearchObj.getItemId("searchTxt")).val('');
									} else {
										axdom("#"+ dplJobSearchObj.getItemId("searchTxt")).removeAttr("readonly");
									}
	
									//공통코드 처리 후 select box 세팅이 필요한 경우 사용
									if (!gfnIsNull(selectedObject.optionCommonCode)) {
										gfnCommonSetting(dplJobSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
									}  else {
										//공통코드 처리(추가 selectbox 작업이 아닌 경우 type=text를 나타낸다.)
										axdom("#"+ dplJobSearchObj.getItemId("searchTxt")).show();
										axdom("#"+ dplJobSearchObj.getItemId("searchCd")).hide();
									}
								}
								},
								{label : "",labelWidth : "",type : "inputText",width : "225",key : "searchTxt",addClass : "secondItem sendBtn",valueBoxStyle : "padding-left:0px;",value : "",
									onkeyup:function(e){
										if(e.keyCode == '13' ){
											axdom("#" + dplJobSearchObj.getItemId("btn_search_dlp")).click();
										}
									}
								},
								{label : "",labelWidth : "",type : "selectBox",width : "100",key : "searchCd",addClass : "selectBox",valueBoxStyle : "padding-left:0px;",value : "01",options : []},
								{label : "",labelWidth : "",type : "button",width : "70",key : "btn_print_newReqDemand",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
									onclick : function() {
										$(dplJobGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
									}
								},									
								{label : "",labelWidth : "",type : "button",width : "55",key : "btn_excel_newReqDemand",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
									onclick : function() {
										dplJobGrid.exportExcel("<c:out value='${sessionScope.selMenuNm }'/>.xls");
									}
								},
								{label : "",labelWidth : "",type : "button",width : "55",key : "btn_search_dlp",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
									onclick : function() {
										/* 검색 조건 설정 후 reload */
							            fnInGridListSet(0,dplJobSearchObj.getParam());
									}
								},
						]}]
					});
		}
	};

	jQuery(document.body).ready(
			function() {
				fnObjSearch.pageStart();
				//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
				axdom("#" + dplJobSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");

				//공통코드 selectBox hide 처리
				axdom("#" + dplJobSearchObj.getItemId("searchCd")).hide();

			});
	}
//배포 중지 함수
function fnDplActionStop(item){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1000JobBuildStopAjax.do'/>","loadingShow":false}
			,item);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		if(data.errorYn == "Y"){
			jAlert(data.message, "알림창");
			
			dplJobGrid.setValue(item.__original_index, "bldResultCd", "10");
			dplJobGrid.setValue(item.__original_index, "bldResult", "SYSTEM ERROR");
			return false;
		}else{
			//그리드 JOB 정보 변경
			dplJobGrid.setValue(item.__original_index, "bldResult", data.bldResult);
			dplJobGrid.setValue(item.__original_index, "bldResultCd", data.bldResultCd);
		}
		
		//console log 조회 재 시작
		consoleTimer = setTimeout(function(){fnJobBuildResultStatus(dplJobGrid.getList('selected')[0]);}, buildResultWaitTime);
		
	});
	
	//AJAX 전송
	ajaxObj.send();
	
}

//수동배포 시작
function fnDplStart(item){
	//수동배포 버튼 감추기
	$("#btn_update_dplAction").hide();
	//게이지바 초기화
	$(".progress .progress-bar").attr('data-transitiongoal', 0).progressbar2({display_text: 'center'});

	if(!gfnIsNull(item)){
		dplJobGrid.setValue(item.__original_index, "bldResultCd", "01");
		dplJobGrid.setValue(item.__original_index, "bldResult", "PROGRESS");
	}

	//console log timer 중지
	if(!gfnIsNull(consoleTimer)){
		clearTimeout(consoleTimer);
	}
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1000JobBuildAjax.do'/>","loadingShow":false}
			,item);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		if(data.errorYn == "Y"){
			jAlert(data.message, "알림창");
			
			dplJobGrid.setValue(item.__original_index, "bldResultCd", "10");
			dplJobGrid.setValue(item.__original_index, "bldResult", "SYSTEM ERROR");
			return false;
		}else{
			//그리드 JOB 정보 변경
			dplJobGrid.setValue(item.__original_index, "bldResult", data.bldResult);
			dplJobGrid.setValue(item.__original_index, "bldResultCd", data.bldResultCd);
			dplJobGrid.setValue(item.__original_index, "bldNum", data.bldNum);
		}
		
		//console log 조회 재 시작
		consoleTimer = setTimeout(function(){fnJobBuildResultStatus(dplJobGrid.getList('selected')[0]);}, buildResultWaitTime);
		
	});
	
	//AJAX 전송
	ajaxObj.send();
}

// 배포 계획 실행 가이드 상자
function fnDpl1000GuideShow(){
	var mainObj = $(".main_contents");
	
	// mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	// guide box setting
	var guideBoxInfo = globals_guideContents["dpl1000"];
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


/**
 * 빌드 상세 정보+콘솔로그 초기화
 */
function fnBldFormDataReset(){
	$("form#dpl1000JobInfoForm #jenNm").text("");
	$("form#dpl1000JobInfoForm #jenUrl").text("");
	$("form#dpl1000JobInfoForm #jobId").text("");
	$("form#dpl1000JobInfoForm #jobTypeNm").text("");
	$("#btn_select_bldParam").hide();
	
	//job 빌드 정보 세팅
	$("form#dpl1000JobInfoForm #buildCauses").text("");
	$("form#dpl1000JobInfoForm #jobClass").text("");
	$("form#dpl1000JobInfoForm #building").text("");
	$("form#dpl1000JobInfoForm #buildDate").text("");
	$("form#dpl1000JobInfoForm #buildNumber").text("");
	$("form#dpl1000JobInfoForm #buildResult").text("");
	$("form#dpl1000JobInfoForm #buildDurationStr").text("");
	$("form#dpl1000JobInfoForm #buildEstimatedDurationStr").text("");
	$("form#dpl1000JobInfoForm #buildChgLog").html("");
	
	//console 세팅
	$("#buildConsoleLog").html("");
}

/**
 * 빌드 상세정보 세팅
 * @param paramJobInfo : JOB 정보
 * @param paramBldInfo : 빌드 정보
 * @param paramBldChgList : 빌드 변경 정보
 * @param paramBldFileChgList : 빌드 파일 변경 정보
**/
function bldDetailFrameSet(paramJobInfo, paramBldInfo, paramBldChgList, paramBldFileChgList){
	//jenkins, job 정보 세팅
	$("form#dpl1000JobInfoForm #jenNm").text(paramJobInfo.jenNm);
	$("form#dpl1000JobInfoForm #jenUrl").text(paramJobInfo.jenUrl);
	$("form#dpl1000JobInfoForm #jobId").text(paramJobInfo.jobId);
	$("form#dpl1000JobInfoForm #jobTypeNm").text(paramJobInfo.jobTypeNm);
	
	//빌드 ci_id, ticket_id, dpl_id
	var ciIdStr = "-";
	var ticketIdStr = "-";
	var dplIdStr = "-";
	
	//빌드 기본 정보
	var buildCauses = "-";
	var building = false;
	var buildDate = "-";
	var buildNumber = "-";
	var buildResult = "-";
	var buildDurationStr = "-";
	var buildEstimatedDurationStr = "-";
	var buildChgLog = "-";
	var buildConsoleLog = "-";
	var jobClass = "-";
	var bldActionLog = "-";
	$("#btn_select_bldParam").hide();
	
	if(!gfnIsNull(paramBldInfo)){
		try{
			//id정보 세팅
			ciIdStr = (paramBldInfo.hasOwnProperty("ciId"))?paramBldInfo["ciId"]:"-";
			ticketIdStr = (paramBldInfo.hasOwnProperty("ticketId"))?paramBldInfo["ticketId"]:"-";
			dplIdStr = (paramBldInfo.hasOwnProperty("dplId"))?paramBldInfo["dplId"]:"-";
		}catch(e){
			console.log(e);
		}
		try{
			//빌드 정보 세팅
			jobClass = paramBldInfo["bldClass"];
			buildCauses = paramBldInfo["bldCauses"];
			buildDate = new Date(paramBldInfo["bldStartDtm"]).format("yyyy-MM-dd HH:mm:ss");
			buildNumber = paramBldInfo["bldNum"];
			buildResult = paramBldInfo["bldResult"];
			buildDurationStr = gfnHourCalc(paramBldInfo["bldDurationTm"]/1000);
			buildEstimatedDurationStr = gfnHourCalc(paramBldInfo["bldEtmDurationTm"]/1000);
			buildConsoleLog = paramBldInfo["bldConsoleLog"];
			bldActionLog = paramBldInfo["bldActionLog"];
			
			//actionlog 줄바꿈
			if(!gfnIsNull(bldActionLog)){
				bldActionLog = bldActionLog.replace(/\n/g,"</br>");
			}
			//파라미터 개수 있는 경우
			if(paramBldInfo["bldParamCnt"] > 0){
				//마지막 빌드번호, jenId, jobId
				$("#btn_select_bldParam").data("bldNum", buildNumber);
				$("#btn_select_bldParam").data("jenId",paramBldInfo["jenId"]);
				$("#btn_select_bldParam").data("jobId",paramBldInfo["jobId"]);
				
				//빌드 파라미터 팝업 버튼 보이기
				$("#btn_select_bldParam").show();
			}
		}catch(e){
			console.log(e);
		}
		try{
			//빌드 내용 세팅
			var buildChgLogStr = "";
			
			//변경 내용 있는지
			if(!gfnIsNull(paramBldChgList)){
				//파일 변경이력 리비전-빌드번호별 Map
				var jobLastBuildFileChgMap = {};
				
				//파일 변경이력 리비전-빌드번호별 Map 세팅
				if(!gfnIsNull(paramBldFileChgList)){
					$.each(paramBldFileChgList, function(idx, map){
						//bldNum 없는 경우
						if(!jobLastBuildFileChgMap.hasOwnProperty(map.bldNum)){
							jobLastBuildFileChgMap[map.bldNum] = {};
						}
						//리비전 번호 없는 경우
						if(!jobLastBuildFileChgMap[map.bldNum].hasOwnProperty(map.chgRevision)){
							jobLastBuildFileChgMap[map.bldNum][map.chgRevision] = [];
						}
						
						//데이터 넣기
						jobLastBuildFileChgMap[map.bldNum][map.chgRevision].push(map);
					});
				}
				
				//변경 내용 세팅
				$.each(paramBldChgList, function(idx, map){
					//빌드 변경 파일 내용
					var buildChgFileStr = "";
					//빌드 내용 세팅
					buildChgLogStr += 
						'<div class="buildChgMainFrame">'
							+'<div class="buildChgHeader"><b>'+map.chgRevision+'</b> - '+map.chgUser+' ('+(new Date(parseInt(map.chgTimestamp)).format("yyyy-MM-dd HH:mm:ss"))+') </div>'
							+'<div class="buildChgBody">'+(map.chgMsg).replace(/\n/g,"</br>")+'</div>'
					
					//변경된 파일 내용 있는지 체크
					if(jobLastBuildFileChgMap.hasOwnProperty(map.bldNum) && jobLastBuildFileChgMap[map.bldNum].hasOwnProperty(map.chgRevision)){
						//파일 내용 추가
						$.each(jobLastBuildFileChgMap[map.bldNum][map.chgRevision], function(subIdx, subMap){
							buildChgFileStr += '<span class="buildFileChgLog fa '+subMap.editTypeCd+'">'+subMap.filePath+'</span>';
						});
						buildChgLogStr += '<div class="buildChgFooter">'+buildChgFileStr+'</div>';
					}
					buildChgLogStr += '</div>';
				});
				buildChgLog = buildChgLogStr;
			}
			
		}catch(e){
			console.log(e);
		}
		
		//job 빌드 정보 세팅
		$("form#dpl1000JobInfoForm #buildCauses").text(buildCauses);
		$("form#dpl1000JobInfoForm #jobClass").text(jobClass);
		$("form#dpl1000JobInfoForm #building").text(building);
		$("form#dpl1000JobInfoForm #buildDate").text(buildDate);
		$("form#dpl1000JobInfoForm #buildNumber").text(buildNumber);
		$("form#dpl1000JobInfoForm #buildResult").text(buildResult);
		$("form#dpl1000JobInfoForm #buildDurationStr").text(buildDurationStr);
		$("form#dpl1000JobInfoForm #buildEstimatedDurationStr").text(buildEstimatedDurationStr);
		$("form#dpl1000JobInfoForm #buildChgLog").html(buildChgLog);
		$("form#dpl1000JobInfoForm #bldActionLog").html(bldActionLog);
		
		//console 세팅
		$("#buildConsoleLog").html(buildConsoleLog);
		$("#buildConsoleLog").each(function(i, block) {hljs.highlightBlock(block);});
	}
}
</script>
<div class="main_contents" style="height: auto;">
	<div class="tab_contents menu" style="max-width: 1500px;position: relative;">
		<form:form commandName="dpl1000VO" id="searchFrm" name="searchFrm" method="post" onsubmit="return false"></form:form>
		<div id="dplJobSearch" style="border-top: 1px solid #ccc;" guide="dpl1000DplJobBtn"></div>
		<br />
		<div data-ax5grid="dplJobGrid" data-ax5grid-config="{}" style="height: 250px;" guide="dpl1000DplJobList"></div>
		<div class="main_frame middleJobInfoFrame">
			<div class="jobBuildAutoCheckDiv sub_title">
				<div class="jobAutoCheckIcon" id="jobAutoCheckIcon"></div>
				<div class="jobAutoCheckMsg" id="jobAutoCheckMsg"></div>
				<div class="jobAutoCheckTime" id="jobAutoCheckTime"></div>
				<button type="button" id="btn_select_jobAutoCheckOn" onclick="fnJobAutoCheckSwitch(true)" title="" placeholder="" style="width:120px;" class="AXButton searchButtonItem "><i class="fa fa-play-circle" aria-hidden="true"></i>&nbsp;<span>모니터링 재 시작</span></button>
				<button type="button" id="btn_select_jobAutoCheckOff" onclick="fnJobAutoCheckSwitch(false)" title="" placeholder="" style="width:120px;" class="AXButton searchButtonItem "><i class="fa fa-pause-circle" aria-hidden="true"></i>&nbsp;<span>모니터링 중지</span></button>
			</div>
		</div>
		<div class="main_frame bottomJobInfoFrame" id="bottomJobInfoFrame">
			<div class="jobMaskFrame" id="jobMaskFrame">상단의 배포계획을 선택해주세요.</div>
			<div class="frame_contents left" fullmode="1" guide="dpl1000DplJobBldInfo">
				<div class="sub_title">
					선택 JOB 정보
					<div class="sub_title_btn right">
						<div class="dplFullScreanBtn" fullmode="1"><i class="fas fa-expand"></i></div>
						<div class="progress progress_sm sub_progress" id="bldProgressBar">
							<div class="progress-bar bg-blue" role="progressbar" data-transitiongoal="100"></div>
						</div>
						<button type="button" id="btn_update_dplAction" title="" placeholder="" style="width:90px;" class="AXButton searchButtonItem "><i class="fa fa-play-circle" aria-hidden="true"></i>&nbsp;<span>수동 실행</span></button>
						<button type="button" id="btn_update_dplActionStop" title="" placeholder="" style="width:90px;display:none;" class="AXButton searchButtonItem "><i class="fa fa-stop-circle" aria-hidden="true"></i>&nbsp;<span>실행 중지</span></button>
					</div>
				</div>
				<div class="jobDetailInfoFrame">
					<form name="dpl1000JobInfoForm" id="dpl1000JobInfoForm" onsubmit="return false;">
					<div class="descMainFrame">
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>CI ID</label></div>
							<div class="descValueFrame">
								<span id="ciId"><c:out value="${requestScope.ciId}"/></span>
							</div>
						</div>
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>TICKET ID</label></div>
							<div class="descValueFrame">
								<span id="ticketId"><c:out value="${requestScope.ticketId}"/></span>
							</div>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>DPL ID</label></div>
							<div class="descValueFrame">
								<span id="dplId"><c:out value="${requestScope.dplId}"/></span>
							</div>
						</div>
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>빌드 파라미터 값</label></div>
							<div class="descValueFrame">
								<button type="button" id="btn_select_bldParam" style="width:125px;display:none;" class="AXButton searchButtonItem"><i class="fa fa-external-link"></i>&nbsp;<span>보기</span></button>
							</div>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descLabelFrame"><label>JENKINS 명</label></div>
						<div class="descValueFrame">
							<span id="jenNm"></span>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descLabelFrame"><label>JENKINS URL</label></div>
						<div class="descValueFrame">
							<span id="jenUrl"></span>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descLabelFrame"><label>JOB ID</label></div>
						<div class="descValueFrame">
							<span id="jobId"></span>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descLabelFrame"><label>JOB _class</label></div>
						<div class="descValueFrame">
							<span id="jobClass"></span>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>JOB 타입</label></div>
							<div class="descValueFrame">
								<span id="jobTypeNm"></span>
							</div>
						</div>
						<div class="descSubFrame">
							<div class="descLabelFrame"><label></label></div>
							<div class="descValueFrame">
								<span></span>
							</div>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>building</label></div>
							<div class="descValueFrame">
								<span id="building""></span>
							</div>
						</div>
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>빌드 일시</label></div>
							<div class="descValueFrame">
								<span id="buildDate"></span>
							</div>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>빌드번호</label></div>
							<div class="descValueFrame">
								<span id="buildNumber"></span>
							</div>
						</div>
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>빌드 결과</label></div>
							<div class="descValueFrame">
								<span id="buildResult"></span>
							</div>
						</div>
					</div>
					<div class="descMainFrame">
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>예상 소요시간</label></div>
							<div class="descValueFrame">
								<span id="buildEstimatedDurationStr"></span>
							</div>
						</div>
						<div class="descSubFrame">
							<div class="descLabelFrame"><label>소요시간</label></div>
							<div class="descValueFrame">
								<span id="buildDurationStr"></span>
							</div>
						</div>
					</div>
					<div class="descMainFrame descFullFrame">
						<div class="descHeaderLabelFrame"><label>변경 내용</label></div>
						<div class="descBodyValueFrame" id="buildChgLog"></div>
					</div>
					<div class="descMainFrame descFullFrame">
						<div class="descHeaderLabelFrame"><label>빌드 로그</label></div>
						<div class="descBodyValueFrame" id="bldActionLog"></div>
					</div>
					</form>
				</div>
			</div>
			<div class="frame_contents right" fullmode="2" guide="dpl1000JobConsolLog">
				<div class="sub_title">
					빌드 실행 Console Log
					<div class="sub_title_btn right">
						<button type="button" id="btn_bldMainLog" title="" style="width:150px;" class="AXButton searchButtonItem bldLogBtn" logtype="main"><i class="fa fa-desktop" aria-hidden="true"></i>&nbsp;<span id="bldMainConsoleLog"></span></button>
						<div class="dplFullScreanBtn" fullmode="2"><i class="fas fa-expand"></i></div>
					</div>
				</div>
				<div id="contentsFrame">
					<pre>
						<code id="buildConsoleLog">-</code>
					</pre>
				</div>
			</div>
		</div>
	</div>
</div>

<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />