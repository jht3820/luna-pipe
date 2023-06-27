<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="ko">
<title>OpenSoftLab</title>
<link rel="stylesheet" type="text/css" href="<c:url value='/js/highlight/styles/ir-black.css'/>">
<script type="text/javascript" src="<c:url value='/js/highlight/highlight.pack.js'/>"></script>
<link rel='stylesheet' href='<c:url value='/css/lunaops/dpl.css'/>' type='text/css'>
<style type="text/css">
.layer_popup_box .pop_sub {width: 100%;padding: 20px 20px;text-align: center;display: inline-block;position:relative;font-size: 12px;}
	
/*익스플로러 적용 위해 !important 추가*/
/* 팝업에 따라 pop_menu_col1, pop_menu_col2 높이 변경 */
.pop_menu_row .pop_menu_col1 { width: 26% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 74% !important; height: 45px !important; }

.layer_popup_box input[readonly],.layer_popup_box input:read-only {background-color: #fff;}

.pop_dpl_div_sub.divDetailStm3004_sub_left{width: 561px;float: left;margin-right: 10px;height: 725px;}
.pop_dpl_div_sub.divDetailStm3004_sub_right {width: 585px;float: left;height: 725px;}
.stm3004_middle_row {height: 41px;display: inline-block;float: left;border-bottom: 1px solid #ccc;cursor:pointer;}
.stm3004_middle_row:first-child {border-top: 1px solid #ccc;}
.stm3004_middle_cell {display: inline-block;float: left;height: 100%;border-right: 1px solid #ccc;padding: 5px 2px;text-overflow: ellipsis;overflow: hidden;line-height: 30px;}
.stm3004_middle_job_header {display: inline-block;height: 40px;width: 100%;border: 1px solid #ccc;border-bottom: none;background-color: #f9f9f9;float: left;}
.stm3004_middle_cell:nth-child(1) {width: 80px;}
.stm3004_middle_cell:nth-child(2) {width: 80px;}
.stm3004_middle_cell:nth-child(3) {width: 150px;}
.stm3004_middle_cell:nth-child(4) {width: 120px;}
.stm3004_middle_cell:nth-child(5) {width: 100px;border-right:none;}
.stm3004_bottom_bld_content {display: inline-block;width: 100%;border: 1px solid #ccc;line-height: 25px;height: 635px;overflow-y: scroll;overflow-x: hidden;padding: 2px 0;}
.stm3004_bld_row {cursor: grab;}
.stm3004_bld_row:hover {background-color: #414352;color: #fff;}
.stm3004_middle_row.jobActive {background-color: #414352;color: #fff;}
.stm3004_sub_title {font-weight: bold;background: #f9f9f9;border: 1px solid #ccc;border-left: none;border-right: none;padding: 6px 5px;height: 35px;position: relative;text-align: left;font-size: 11pt;margin-bottom: 2px;line-height: 20px;}
div#dplPopJobContentsFrame{background: #23241f;color: #f8f8f2;height: 675px;display: inline-block;width: 100%;text-align: left;line-height: 20px;position: relative;}
div#dplPopJobContentsFrame > pre{width:100%;height:100%}
div#dplPopJobContentsFrame > pre > code {height: 100%;width: 100%;font-size: 10pt;position: absolute;top: 0;left: 0;padding: 0.5em;}
div#pop_dpl_job_consoleLogDiv.full_screen{position: absolute;top: 0;left: 0;width: 100%;height: 745px;z-index:2;background-color:#fff;}
</style>
<script type="text/javascript">
	$(document).ready(function() {
		/* 취소 */
		$('#btnPopStm3004Cancle').click(function() {
			gfnLayerPopupClose();
		});
		
	});
	
	// 세션에 있는 현재 선택된 프로젝트 Id
	var selPrjId = "${sessionScope.selPrjId}";

//콘솔 내용 조회
function fnPopJobConsoleLogLoad(thisObj){
	//target active
	$(".stm3004_middle_row.jobActive").removeClass("jobActive");
	
	//로딩 아이콘 삽입
	$("#dplPopBuildConsoleLog").html('<i class="fa fa-spinner fa-spin"></i>');
	
	//타겟
	var $targetObj = $(thisObj);
	
	$targetObj.addClass("jobActive");
	
	//정보
	var prjId = $targetObj.attr("prjid");
	var dplId = $targetObj.attr("dplid");
	var jenId = $targetObj.attr("jenid");
	var jobId = $targetObj.attr("jobId");
	var bldSeq = $targetObj.attr("bldseq");
	
	// job 빌드 이력 선택 시 프로젝트 Id와 세션의 선택된 프로젝트 Id가 같을 경우
	if(prjId == selPrjId){
		// 프로젝트 Id를 넘기지 않는다.
		// 프로젝트 Id를 넘기지 않을 경우 현재 프로젝트에 선택된 권한을 가지고 콘솔로그 볼 수 있는 권한을 체크한다.
		prjId = "";
	}
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1200DplSelBuildConsoleLogAjax.do'/>","loadingShow":false}
			,{prjId:prjId, dplId: dplId, jenId: jenId, jobId: jobId, bldSeq: bldSeq});
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		
		if(data.errorYn == "Y"){
			$("#dplPopBuildJobConsoleLog").html(data.message);
			
		}else{
			var buildMap = data.dpl1400InfoMap;
			
			//로그 빈값
			if(gfnIsNull(buildMap) || gfnIsNull(buildMap.bldConsoleLog)){
				$("#dplPopBuildJobConsoleLog").html("콘솔 로그가 없습니다.");
				return false;
			}
			//콘솔로그 출력
			$("#dplPopBuildJobConsoleLog").html(buildMap.bldConsoleLog);
			$('#dplPopBuildJobConsoleLog').each(function(i, block) {hljs.highlightBlock(block);});
						
			//스크롤 최 하단
			$("#dplPopBuildJobConsoleLog").scrollTop(9999);
		}
		
	});
	
	//AJAX 전송 오류 함수
	ajaxObj.setFnError(function(xhr, status, err){
		$("#dplPopBuildConsoleLog").html("콘솔 내용 조회 오류");
	});
	
	//AJAX 전송
	ajaxObj.send();
	
}

//풀스크린 버튼
$(".dplFullScreanBtn").click(function(){
	var $thisObj = $(this);
	//풀스크린 대상 번호
	var fullMode = $thisObj.attr("fullmode");
	
	var $targetObj = $("div.pop_dpl_div_sub[fullmode="+fullMode+"]");
	
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
</script>

<div class="popup">
	<div class="pop_title">[ ${param.jobId} ] 상세 팝업</div>
	<div class="pop_sub">
		<div class="pop_dpl_div_sub divDetailStm3004_sub_left">
			<div class="stm3004_sub_title">
				JOB 빌드 목록 (최근 100건)
			</div>
			<div class="stm3004_middle_job_header">
				<div class="stm3004_middle_cell">빌드 번호</div>
				<div class="stm3004_middle_cell">빌드 상태</div>
				<div class="stm3004_middle_cell">빌드 시작 시간</div>
				<div class="stm3004_middle_cell">소요 시간</div>
				<div class="stm3004_middle_cell">배포자</div>
			</div>
			<div class="stm3004_bottom_bld_content" id="stm3004_bottom_bld_content">
				<c:if test="${not empty jobBldNumList}">
					<c:forEach items="${jobBldNumList}" var="map">
						<div class="stm3004_middle_row" prjid="${map.prjId}" dplid="${map.dplId}" jenid="${map.jenId}" jobid="${map.jobId}" bldseq="${map.bldSeq}" onclick="fnPopJobConsoleLogLoad(this)">
							<div class="stm3004_middle_cell">${map.bldNum}</div>
							<div class="stm3004_middle_cell">${map.bldResult}</div>
							<div class="stm3004_middle_cell"><fmt:formatDate value="${map.bldStartDtm}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
							<div class="stm3004_middle_cell">
								<fmt:parseNumber var="durationMm" value="${(map.bldDurationTm/(1000))/60}" integerOnly="true" />
								<fmt:parseNumber var="durationSs" value="${(map.bldDurationTm/(1000))%60}" integerOnly="true" />
								<c:if test="${durationMm > 0}">${durationMm}분 </c:if>${durationSs}초
							</div>
							<div class="stm3004_middle_cell">${map.regUsrNm}</div>
						</div>
					</c:forEach>
				</c:if>
			</div>
		</div>
		<div class="pop_dpl_div_sub divDetailStm3004_sub_right" id="pop_dpl_job_consoleLogDiv" fullmode="2">
			<div class="stm3004_sub_title">
				콘솔 로그
				<div class="sub_title_btn right">
					<div class="dplFullScreanBtn" fullmode="2"><i class="fas fa-expand"></i></div>
				</div>
			</div>
			<div id="dplPopJobContentsFrame">
				<pre>
					<code id="dplPopBuildJobConsoleLog">좌측 빌드 정보를 선택해주세요.</code>
				</pre>
			</div>
		</div>
		<div class="btn_div">
			<div class="button_normal exit_btn" id="btnPopStm3004Cancle" >닫기</div>
		</div>
	</div>
</div>
</html>