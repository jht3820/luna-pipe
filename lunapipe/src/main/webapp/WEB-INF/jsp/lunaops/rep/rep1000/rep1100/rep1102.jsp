<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>

<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<style type="text/css">
	.tab_contents.menu{width:1500px;}
	
</style>
<script>
var tktChgDataGridObj;
var buildDataGridObj;
var rsyncDataGridObj;
var commitTargetDataGridObj;

//선택 변경파일 중복 체크
var overlapFileChg = {};

//선택된 소스저장소 데이터 목록
var selRepData = [];

$(function(){
	//티켓 변경 파일 목록 조회
	fnTktChgDataGridSetting();
	//운영빌드 데이터 조회
	fnBuildDataGridSetting();
	//운영빌드 대상 변경 파일목록 조회
	fnRsyncDataGridSetting();
	//커밋대상 파일목록 조회
	fnCommitTargetDataGridSetting();
	
	//가이드 상자 호출
	gfnGuideStack("add",fnRep1102GuideShow);
	
	//추가
	$("#selFileChgAddBtn").click(function(){
		var chkList = rsyncDataGridObj.getList('selected');
		if (gfnIsNull(chkList)) {
			jAlert("선택한 JOB이 없습니다.", "알림창");
			return false;
		}
		
		//중복 개수
		var overlapCnt = 0;

		//추가 메시지
		var addMsg = "";
		
		//실제 추가되는 row
		var addDataRow = [];
		
		//추가 인덱스 숫자
		var addDataIdx = 0;
		
		//변경파일 중복 체크
		$.each(chkList, function(idx, map){
			//변경 파일 경로있는지 체크
			if(overlapFileChg.hasOwnProperty(map.filePath)){
				//해당 경로 빌드 번호
				var targetBldNum = overlapFileChg[map.filePath];
				
				//해당 파일 빌드 번호가 현재 빌드 번호보다 낮은 경우
				if(targetBldNum < map.bldNum) {
					addMsg += "</br>["+map.filePath+"] 선택 파일 빌드번호("+map.bldNum+")보다 추가된 파일의 빌드 번호("+targetBldNum+")가 낮습니다. 기존 파일을 제거해주세요.";
				}
				//해당 파일 빌드 번호가 현재 빌드 번호보다 높은 경우
				else if(targetBldNum > map.bldNum) {
					addMsg += "</br>["+map.filePath+"] 서택 파일 빌드번호("+map.bldNum+")보다 추가된 파일의 빌드 번호("+targetBldNum+")가 더 높습니다. ";
				}
				
				overlapCnt++;
				return true;
			}

			map["__selected__"] = false;
			overlapFileChg[map.filePath] = map.bldNum;
			
			addDataRow.push(map);
			addDataIdx++;
		});
		
		//alert 메시지
		var alertAddMsg = "";
		
		if(overlapCnt == chkList.length) {
			jAlert("선택된 변경 파일은 이미 추가되있습니다."+addMsg);
			return false;
		}
		else if(overlapCnt > 0) {
			alertAddMsg = "</br>중복된 "+overlapCnt+"개의 변경파일이 제외되었습니다.";
		}
		
		jAlert("commit 대상 변경 파일이 추가되었습니다."+alertAddMsg+addMsg);
		
		//변경 파일 추가
		commitTargetDataGridObj.addRow(addDataRow);
		
	});
	//제거
	$("#selFileChgDelBtn").click(function(){
		var chkList = commitTargetDataGridObj.getList('selected');
		if (gfnIsNull(chkList)) {
			jAlert("선택한 변경 파일이 없습니다.", "알림창");
			return false;
		}
		
		//선택 변경 파일 제거
		$.each(chkList, function(idx, map){
			//중복체크 제거
			delete overlapFileChg[map.filePath];
		});
		
		//row 삭제
		commitTargetDataGridObj.removeRow("selected");
	});
	
	//전송 버튼
	$("#selCommitDataCommitBtn").click(function(){
		
		var rtnValue = [];
		
		//선택한 저장소
		var selCommitTargetList = commitTargetDataGridObj.getList();
		
		if (gfnIsNull(selCommitTargetList)) {
			jAlert("커밋 대상 파일을 선택해주세요.", "알림창");
			return false;
		}
		jConfirm("선택된 파일 "+selCommitTargetList.length+"개를 커밋하시겠습니까?","알림창", function(result){
			if(result){
				//필요 값
				var empId = $("form#rep1102Form > #empId").val();
				
				//저장소 param
				var returnMap = [];
				
				//데이터 세팅
				$.each(selCommitTargetList, function(idx, map){
					var commitTargetInfo = {
						"ciId": map.ciId
						, "ticketId": map.ticketId
						, "empId": empId
						, "jobId": map.jobId
						, "bldNum": map.bldNum
						, "filePath": map.filePath
						, "fileRealPath": map.fileRealPath
						, "fileTypeNm": map.fileTypeNm
						, "repId": map.repId
					};
					
					returnMap.push(commitTargetInfo);
				});
				
				//data값 전달 후 해당 파일 커밋
				var ajaxObj = new gfnAjaxRequestAction(
					{"url":"<c:url value='/rep/rep1000/rep1100/insertRep1102TargetDataDeployCommitAjax.do'/>","loadingShow":true}
					,{
						//컨트롤러 전달 데이터
						returnMap: JSON.stringify(returnMap),
					}
				);
				
				//AJAX 전송 성공 함수
				ajaxObj.setFnSuccess(function(data){
					//결과 값
					var errorYn = data.errorYn;
					
					//오류 메시지
					var errorMsgList = data.errorMsgList;
					
					//오류 메시지 있는 경우 추가 메시지 담기
					var addMsg = "";
					if(!gfnIsNull(errorMsgList) && errorMsgList.length > 0){
						addMsg += "</br>[예외처리 내역]</br>"+errorMsgList.join("</br>");
					}
					
					//결과 처리 성공
					if(errorYn == "N"){
						jAlert(data.message+"</br>성공 개수: "+data.succCnt+addMsg, "알림창");
						
						//선택 rsync결과값 제거
						rsyncDataGridObj.setData([]);
						//추가된 대상 파일 목록 제거
						commitTargetDataGridObj.setData([]);
						//중복 변수 초기화
						overlapFileChg = {};
					}else{
						jAlert(data.message+addMsg, "알림창");
						return false;
					}
				});
				
				//AJAX 전송
				ajaxObj.send();
			}
		});
	});
	
	//닫기 버튼
	$("#repCloseBtn").click(function(){
		window.close();
	});
});

//axisj5 그리드
function fnTktChgDataGridSetting(){
	tktChgDataGridObj = new ax5.ui.grid();
 
	tktChgDataGridObj.setConfig({
		target: $('[data-ax5grid="tktChgDataGridTarget"]'),
		/* frozenColumnIndex: 3, */
		sortable:false,
		showRowSelector: false,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "repChgTypeNm", label: "파일 변경 타입", width: 95, align: "center"} ,
			{key: "repChgFilePath", label: "변경 파일 경로", width: 1000, align: "left"} ,
			{key: "repChgFileNm", label: "변경 파일명", width: 240, align: "left"} ,
			{key: "repCmtDate", label: "커밋 일시", width: 135, align: "center"
				,formatter: function(){
					return new Date(this.item.repCmtDate).format('yyyy-MM-dd HH:mm:ss');
				}	
			} ,
			{key: "repCmtAuthor", label: "커밋 대상자", width: 100, align: "center"} ,
			{key: "repNm", label: "저장소 명", width: 260, align: "center"},
			{key: "repRv", label: "리비전", width: 80, align: "center"}
			 
        ],
        body: {
    		align: "center",
			columnHeight: 30
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
				fnInGridListSet(this.page.selectPage);
             }
         } 
		});
	//그리드 데이터 불러오기
	fnInGridListSet();
}

//그리드 데이터 넣는 함수
function fnInGridListSet(_pageNo){
	/* 그리드 데이터 가져오기 */
	ajaxParam = $('form#rep1102Form').serialize();
   	
   	//페이지 세팅
   	if(typeof tktChgDataGridObj.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+tktChgDataGridObj.page.currentPage;
   	}
   	
	//조회 typeCd 넘기기
   	ajaxParam += "&repRvTypeCd=02&repChgfileKind=file&type=all";
	
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1100/selectRep1100TktRvFileChgListAjax.do'/>","loadingShow":true}
			,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		var list = data.list;
		
	   	tktChgDataGridObj.setData(list);
	});
	
	//AJAX 전송
	ajaxObj.send();
}

//axisj5 그리드
function fnBuildDataGridSetting(){
	buildDataGridObj = new ax5.ui.grid();
 
	buildDataGridObj.setConfig({
		target: $('[data-ax5grid="buildDataGridTarget"]'),
		sortable:false,
		showRowSelector: false,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "dplNm", label: "운영빌드 명", width: 150, align: "center"},
			{key: "jobId", label: "JOB ID", width: 150, align: "center"} ,
			{key: "bldNum", label: "빌드 번호", width: 80, align: "center"} ,
			{key: "regUsrId", label: "빌드 실행자", width: 100, align: "center"} ,
			{key: "bldStartDtm", label: "빌드 일시", width: 135, align: "center"
				,formatter: function(){
					return new Date(this.item.bldStartDtm).format('yyyy-MM-dd HH:mm:ss');
				}	
			} ,
        ],
        body: {
    		align: "center",
			columnHeight: 30,
			onClick: function () {
				buildDataGridObj.clearSelect();
				// 클릭 이벤트
   				buildDataGridObj.select(this.doindex, {selected: !this.item.__selected__});
				
				//rsync 결과 값 조회
				fuRsyncResultList(this.item);
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
				fnInGridListSet(this.page.selectPage);
             }
         } 
		});
	//그리드 데이터 불러오기
	fnBuildDataListSet();
}

//그리드 데이터 넣는 함수
function fnBuildDataListSet(_pageNo){
	/* 그리드 데이터 가져오기 */
	ajaxParam = $('form#rep1102Form').serialize();
   	
   	//페이지 세팅
   	if(typeof buildDataGridObj.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+buildDataGridObj.page.currentPage;
   	}
	
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl1000/dpl1100/selectDpl1102OprDplActionListAjax.do'/>","loadingShow":true}
			,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		var list = data.list;
		var page = data.page;
		
	   	buildDataGridObj.setData({
			list:list,
			page: {
				currentPage: _pageNo || 0,
				pageSize: page.pageSize,
				totalElements: page.totalElements,
				totalPages: page.totalPages
			}
		});
	});
	
	//AJAX 전송
	ajaxObj.send();
}

//axisj5 그리드
function fnRsyncDataGridSetting(){
	rsyncDataGridObj = new ax5.ui.grid();

	rsyncDataGridObj.setConfig({
		target: $('[data-ax5grid="rsyncDataGridTarget"]'),
		/* frozenColumnIndex: 1, */
		sortable:false,
		showRowSelector: true,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "fileTypeNm", label: "파일 변경 타입", width: 95, align: "center",
				formatter: function(){
					var fileTypeNm = this.item.fileTypeNm;
					var fileKindStr = "-";
					//파일 변경 타입에따라 문자열 구하기
					if(fileTypeNm == "A"){
						fileKindStr = "등록"
					}
					else if(fileTypeNm == "M"){
						fileKindStr = "수정"
					}
					else if(fileTypeNm == "D"){
						fileKindStr = "삭제"
					}
					return fileKindStr;
				}
			},
			{key: "filePath", label: "파일 경로", width: 676, align: "left"},
		],
		body: {
	  		align: "center",
			columnHeight: 30,
			onClick: function () {
				// 클릭 이벤트
	  			rsyncDataGridObj.select(this.doindex, {selected: !this.item.__selected__});
			}
		},
	});
}
//rsync 결과 값 조회
function fuRsyncResultList(paramItem){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1100/selectRep1102RsyncResultListAjax.do'/>","loadingShow":true}
			,{"ciId": paramItem.ciId, "ticketId": paramItem.ticketId, "jobId": paramItem.jobId, "bldNum": paramItem.bldNum});
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		//오류 발생 여부
		if(data.errorYn == "Y"){
			jAlert(data.message,"알림");
		}else{
			var fileChgList = data.fileChgList;
			rsyncDataGridObj.setData(fileChgList);
		}
	});
	
	//AJAX 전송
	ajaxObj.send();
}
//axisj5 그리드
function fnCommitTargetDataGridSetting(){
	commitTargetDataGridObj = new ax5.ui.grid();

	commitTargetDataGridObj.setConfig({
		target: $('[data-ax5grid="selCommitDataGridTarget"]'),
		/* frozenColumnIndex: 2,  */
		sortable:false,
		showRowSelector: true,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "fileTypeNm", label: "파일 변경 타입", width: 95, align: "center",
				formatter: function(){
					var fileTypeNm = this.item.fileTypeNm;
					var fileKindStr = "-";
					//파일 변경 타입에따라 문자열 구하기
					if(fileTypeNm == "A"){
						fileKindStr = "등록"
					}
					else if(fileTypeNm == "M"){
						fileKindStr = "수정"
					}
					else if(fileTypeNm == "D"){
						fileKindStr = "삭제"
					}
					return fileKindStr;
				}
			},
			{key: "bldNum", label: "빌드 번호", width: 80, align: "center"} ,
			{key: "filePath", label: "파일 경로", width: 700, align: "left"},
			{key: "jobId", label: "JOB ID", width: 150, align: "center"} ,
      ],
      body: {
  			align: "center",
			columnHeight: 30,
			onClick: function () {
				// 클릭 이벤트
   				commitTargetDataGridObj.select(this.doindex, {selected: !this.item.__selected__});
			}
		},
	});
}

//가이드 상자
function fnRep1102GuideShow(){
	var mainObj = $(".main_contents");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["rep1102"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}

</script>


<div class="main_contents" style="height: auto;" >
	<form name="rep1102Form" id="rep1102Form">
		<input type="hidden" name="ciId" id="ciId" value="${requestScope.ciId }"/>
		<input type="hidden" name="ticketId" id="ticketId" value="${requestScope.ticketId }"/>
		<input type="hidden" name="empId" id="empId" value="${requestScope.empId }"/>
	</form>
	<div class="tab_contents menu">
		<div class="rep1102MainMiddleFrame">
			<div class="rep1102MiddleLeftFrame">
				<div class="sub_title">
					운영빌드 목록
				</div>
				<div data-ax5grid="buildDataGridTarget" data-ax5grid-config="{}" style="height: 250px;"></div>
			</div>
			<div class="rep1102MiddleRightFrame">
				<div class="sub_title">
					Source-Deploy 비교 결과 변경 파일
				</div>
				<div data-ax5grid="rsyncDataGridTarget" data-ax5grid-config="{}" style="height: 250px;"></div>
			</div>
		</div>
		<div class="rep1102DataTransferBtnFrame">
			<button type="button" class="AXButton" id="selFileChgAddBtn"><i class="fa fa-arrow-alt-circle-down"></i>&nbsp;추가</button>
			<button type="button" class="AXButton" id="selFileChgDelBtn"><i class="fa fa-arrow-alt-circle-up"></i>&nbsp;제거</button>
		</div>
		<div class="rep1102MainMiddleFrame">
			<div class="rep1102MiddleLeftFrame">
				<div class="sub_title">
					[<c:out value="${requestScope.ticketId}"/>] 티켓 소스저장소별 Trunk 변경 파일 목록
				</div>
				<div data-ax5grid="tktChgDataGridTarget" data-ax5grid-config="{}" style="height: 450px;"></div>
			</div>
			<div class="rep1102MiddleRightFrame">
				<div class="sub_title">
					선택 변경 파일
				</div>
				<div data-ax5grid="selCommitDataGridTarget" data-ax5grid-config="{}" style="height: 450px;"></div>
			</div>
		</div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="selCommitDataCommitBtn"><i class="fas fa-paperclip"></i>&nbsp;Commit</div>
			<div class="mainPopupBtn" id="repCloseBtn"><i class="fas fa-times-circle"></i>&nbsp;닫기</div>
		</div>
	</div>
</div>
		
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />