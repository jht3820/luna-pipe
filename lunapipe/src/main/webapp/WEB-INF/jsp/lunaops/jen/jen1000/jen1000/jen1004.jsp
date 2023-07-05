<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="ko">
<title>OpenSoftLab</title>
<link rel="stylesheet" type="text/css" href="<c:url value='/js/highlight/styles/ir-black.css'/>">
<script type="text/javascript" src="<c:url value='/js/highlight/highlight.pack.js'/>"></script>
<style type="text/css">
.layer_popup_box .pop_sub {width: 100%;padding: 20px 20px;text-align: center;display: inline-block;position:relative;font-size: 12px;}
	


.pop_menu_row .pop_menu_col1 { width: 26% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 74% !important; height: 45px !important; }

.layer_popup_box input[readonly],.layer_popup_box input:read-only {background-color: #fff;}

.pop_dpl_div_sub.divDetailJen1004_sub_left{width: 561px;float: left;margin-right: 10px;height: 725px;}
.pop_dpl_div_sub.divDetailJen1004_sub_right {width: 585px;float: left;height: 725px;}
.jen1004_middle_row {height: 41px;display: inline-block;float: left;border-bottom: 1px solid #ccc;cursor:pointer;}
.jen1004_middle_row:first-child {border-top: 1px solid #ccc;}
.jen1004_middle_cell {display: inline-block;float: left;height: 100%;border-right: 1px solid #ccc;padding: 5px 2px;text-overflow: ellipsis;overflow: hidden;line-height: 30px;}
.jen1004_middle_job_header {display: inline-block;height: 40px;width: 100%;border: 1px solid #ccc;border-bottom: none;background-color: #f9f9f9;float: left;}
.jen1004_middle_cell:nth-child(1) {width: 80px;}
.jen1004_middle_cell:nth-child(2) {width: 80px;}
.jen1004_middle_cell:nth-child(3) {width: 150px;}
.jen1004_middle_cell:nth-child(4) {width: 120px;}
.jen1004_middle_cell:nth-child(5) {width: 100px;border-right:none;}
.jen1004_bottom_bld_content {display: inline-block;width: 100%;border: 1px solid #ccc;line-height: 25px;height: 635px;overflow-y: scroll;overflow-x: hidden;padding: 2px 0;}
.jen1004_bld_row {cursor: grab;}
.jen1004_bld_row:hover {background-color: #414352;color: #fff;}
.jen1004_middle_row.jobActive {background-color: #414352;color: #fff;}
.jen1004_sub_title {font-weight: bold;background: #f9f9f9;border: 1px solid #ccc;border-left: none;border-right: none;padding: 6px 5px;height: 35px;position: relative;text-align: left;font-size: 11pt;margin-bottom: 2px;line-height: 20px;}
div#dplPopJobContentsFrame{background: #23241f;color: #f8f8f2;height: 675px;display: inline-block;width: 100%;text-align: left;line-height: 20px;position: relative;}
div#dplPopJobContentsFrame > pre{width:100%;height:100%}
div#dplPopJobContentsFrame > pre > code {height: 100%;width: 100%;font-size: 10pt;position: absolute;top: 0;left: 0;padding: 0.5em;}
div#pop_dpl_job_consoleLogDiv.full_screen{position: absolute;top: 0;left: 0;width: 100%;height: 745px;z-index:2;background-color:#fff;}
</style>
<script type="text/javascript">
	$(document).ready(function() {
		
		$('#btnPopJen1004Cancle').click(function() {
			gfnLayerPopupClose();
		});
		
	});


function fnPopJobConsoleLogLoad(thisObj){
	
	$(".jen1004_middle_row.jobActive").removeClass("jobActive");
	
	
	$("#dplPopBuildConsoleLog").html('<i class="fa fa-spinner fa-spin"></i>');
	
	
	var $targetObj = $(thisObj);
	
	$targetObj.addClass("jobActive");
	
	
	var dplId = $targetObj.attr("dplid");
	var jenId = $targetObj.attr("jenid");
	var jobId = $targetObj.attr("jobId");
	var bldSeq = $targetObj.attr("bldseq");
	
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1200DplSelBuildConsoleLogAjax.do'/>","loadingShow":false}
			,{dplId: dplId, jenId: jenId, jobId: jobId, bldSeq: bldSeq});
	
	ajaxObj.setFnSuccess(function(data){
		
		
		if(data.errorYn == "Y"){
			$("#dplPopBuildJobConsoleLog").html(data.message);
			
		}else{
			var buildMap = data.dpl1400InfoMap;
			
			
			if(gfnIsNull(buildMap) || gfnIsNull(buildMap.bldConsoleLog)){
				$("#dplPopBuildJobConsoleLog").html("콘솔 로그가 없습니다.");
				return false;
			}
			
			$("#dplPopBuildJobConsoleLog").html(buildMap.bldConsoleLog);
			$('#dplPopBuildJobConsoleLog').each(function(i, block) {hljs.highlightBlock(block);});
						
			
			$("#dplPopBuildJobConsoleLog").scrollTop(9999);
		}
		
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
		$("#dplPopBuildConsoleLog").html("콘솔 내용 조회 오류");
	});
	
	
	ajaxObj.send();
	
}


$(".dplFullScreanBtn").click(function(){
	var $thisObj = $(this);
	
	var fullMode = $thisObj.attr("fullmode");
	
	var $targetObj = $("div.pop_dpl_div_sub[fullmode="+fullMode+"]");
	
	
	var fullCheck = $targetObj.hasClass("full_screen");
	
	
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
	<div class="pop_title">[ <c:out value="${param.jobId}"/> ] 상세 팝업</div>
	<div class="pop_sub">
		<div class="pop_dpl_div_sub divDetailJen1004_sub_left">
			<div class="jen1004_sub_title">
				JOB 빌드 목록 (최근 100건)
			</div>
			<div class="jen1004_middle_job_header">
				<div class="jen1004_middle_cell">빌드 번호</div>
				<div class="jen1004_middle_cell">빌드 상태</div>
				<div class="jen1004_middle_cell">빌드 시작 시간</div>
				<div class="jen1004_middle_cell">소요 시간</div>
				<div class="jen1004_middle_cell">배포자</div>
			</div>
			<div class="jen1004_bottom_bld_content" id="jen1004_bottom_bld_content">
				<c:if test="${not empty jobBldNumList}">
					<c:forEach items="${jobBldNumList}" var="map">
						<div class="jen1004_middle_row" dplid="${map.dplId}" jenid="${map.jenId}" jobid='<c:out value="${map.jobId}"/>' bldseq='<c:out value="${map.bldSeq}"/>' onclick="fnPopJobConsoleLogLoad(this)">
							<div class="jen1004_middle_cell"><c:out value="${map.bldNum}"/></div>
							<div class="jen1004_middle_cell"><c:out value="${map.bldResult}"/></div>
							<div class="jen1004_middle_cell"><fmt:formatDate value="${map.bldStartDtm}" pattern="yyyy-MM-dd HH:mm:ss"/></div>
							<div class="jen1004_middle_cell">
								<fmt:parseNumber var="durationMm" value="${(map.bldDurationTm/(1000))/60}" integerOnly="true" />
								<fmt:parseNumber var="durationSs" value="${(map.bldDurationTm/(1000))%60}" integerOnly="true" />
								<c:if test="${durationMm > 0}">${durationMm}분 </c:if>${durationSs}초
							</div>
							<div class="jen1004_middle_cell"><c:out value="${map.regUsrNm}"/></div>
						</div>
					</c:forEach>
				</c:if>
			</div>
		</div>
		<div class="pop_dpl_div_sub divDetailJen1004_sub_right" id="pop_dpl_job_consoleLogDiv" fullmode="2">
			<div class="jen1004_sub_title">
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
			<div class="button_normal exit_btn" id="btnPopJen1004Cancle" >닫기</div>
		</div>
	</div>
</div>
</html>