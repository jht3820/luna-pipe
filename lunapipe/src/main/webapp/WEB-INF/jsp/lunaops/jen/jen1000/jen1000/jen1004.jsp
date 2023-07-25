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

.jen1004_sub_title {font-weight: bold;background: #f9f9f9;border: 1px solid #ccc;border-left: none;border-right: none;padding: 6px 5px;height: 35px;position: relative;text-align: left;font-size: 11pt;margin-bottom: 2px;line-height: 20px;}
div#dplPopJobContentsFrame{background: #23241f;color: #f8f8f2;height: 675px;display: inline-block;width: 100%;text-align: left;line-height: 20px;position: relative;}
div#dplPopJobContentsFrame > pre{width:100%;height:100%}
div#dplPopJobContentsFrame > pre > code {height: 100%;width: 100%;font-size: 10pt;position: absolute;top: 0;left: 0;padding: 0.5em;    overflow: auto;}
div#dplPopJobContentsFrame > pre > code > a {color: #67a8e9;}
div#pop_dpl_job_consoleLogDiv.full_screen{position: absolute;top: 0;left: 0;width: 100%;height: 745px;z-index:2;background-color:#fff;}
</style>
<script type="text/javascript">


var jen1004BldListGrid;

var jen1004BldSearchObj;

$(document).ready(function() {
	
	fnJobBldListGridSetting();
	
	
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


function fnJobBldListGridSetting(){
	jen1004BldListGrid = new ax5.ui.grid();
 
	jen1004BldListGrid.setConfig({
		target: $('[data-ax5grid="jobBldListGrid"]'),
		
		sortable:false,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "bldNum", label: "빌드 번호", width: 60, align: "center"},
			{key: "bldResult", label: "빌드 결과", width: 100, align: "center"},
			{key: "bldDurationTm", label: "소요시간", width: 90, align: "center"
				,formatter:function(){
					return gfnHourCalc(this.item.bldDurationTm/1000);
				}
			},
			{key: "bldStartDtm", label: "빌드 시작 시간", width: 150, align: "center"
				,formatter:function(){
					return new Date(this.item.bldStartDtm).format("yyyy-MM-dd HH:mm:ss");
				}
			},
			{key: "bldCauses", label: "실행 원인", width: 144, align: "center"}
		],
		
		body: {
			align: "center",
			columnHeight: 30,
			onClick:function(){
				
   				this.self.select(jen1004BldListGrid.selectedDataIndexs[0]);
             	
				
				this.self.select(this.doindex);
				
				
				fnSelJobBuildInfo(this.item);
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
				fnJobBldListGridDataSet(this.page.selectPage);
			}
		} 
	});
	
	fnJobBldListGridDataSet();
}


function fnJobBldListGridDataSet(_pageNo){
	
   	
 	var ajaxParam = "";

   	
   	
   	if(!gfnIsNull(_pageNo)){
   		ajaxParam += "&pageNo="+_pageNo;
   	}else if(typeof jen1004BldListGrid.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+jen1004BldListGrid.page.currentPage;
   	}
   	
   	
   	var jenId = '<c:out value="${param.jenId}"/>';
   	var jobId = '<c:out value="${param.jobId}"/>';
   	ajaxParam += "&jenId="+jenId+"&jobId="+jobId;
   	
   	
   	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JobBuildListAjax.do'/>","loadingShow":true}
			,ajaxParam);
	
	ajaxObj.setFnSuccess(function(data){
		var list = data.list;
		var page = data.page;
		
		jen1004BldListGrid.setData({
			list:list,
			page: {
				currentPage: _pageNo || 0,
				pageSize: page.pageSize,
				totalElements: page.totalElements,
				totalPages: page.totalPages
			}
		});
	});
	
	
	ajaxObj.send();
}


function fnSelJobBuildInfo(paramBldItem){

	
	var jenId = paramBldItem.jenId;
	var jobId = paramBldItem.jobId;
	var bldNum = paramBldItem.bldNum;
	
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JobBuildInfo.do'/>","loadingShow":true}
			,{"jenId": jenId, "jobId": jobId, "bldNum": bldNum});
	
	ajaxObj.setFnSuccess(function(data){
		var bldConsoleLogStr = "";
		
		if(data.errorYn == "Y"){
			jAlert(data.message,"알림창");
			return;
		}else{
			
			bldConsoleLogStr = data.jobBuildInfo.bldConsoleLog;
		}
		
	});
	
	
	ajaxObj.send();
}
</script>

<div class="popup">
	<div class="pop_title">[ <c:out value="${param.jobId}"/> ] 빌드 상세 정보</div>
	<div class="pop_sub">
		<div class="pop_dpl_div_sub divDetailJen1004_sub_left">
			<div class="jen1004_sub_title">
				JOB 빌드 목록
			</div>
			<div id="AXSearchTarget-jenkins" guide="jen1000JenkinsBtn"></div>
			<div class="dpl_wrap white">
				<div data-ax5grid="jobBldListGrid" data-ax5grid-config="{}" style="height: 673px;" guide="jen1000JenkinsList"></div>	
			</div>
		</div>
		<div class="pop_dpl_div_sub divDetailJen1004_sub_right" id="pop_dpl_job_consoleLogDiv" fullmode="2">
		
			<div class="jen1004_sub_title">
				JOB 빌드 상세 정보
			</div>
			<div class="jen1004JobDetailInfoFrame">
				<form name="jen1004JobInfoForm" id="jen1004JobInfoForm" onsubmit="return false;">
				<div class="descMainFrame">
					<div class="descSubFrame">
						<div class="descLabelFrame"><label>CI ID</label></div>
						<div class="descValueFrame">
							<span id="ciId"></span>
						</div>
					</div>
					<div class="descSubFrame">
						<div class="descLabelFrame"><label>TICKET ID</label></div>
						<div class="descValueFrame">
							<span id="ticketId"></span>
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
					<div class="descSubFrame">
						<div class="descLabelFrame"><label>JOB ID</label></div>
						<div class="descValueFrame">
							<span id="jobId"></span>
						</div>
					</div>
					<div class="descSubFrame">
						<div class="descLabelFrame"><label>JOB 타입</label></div>
						<div class="descValueFrame">
							<span id="jobTypeNm"></span>
						</div>
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
				<div class="descMainFrame">
					<div class="descHeaderLabelFrame"><label>변경 내용</label></div>
					<div class="descBodyValueFrame" id="buildChgContent"></div>
				</div>
				</form>
			</div>
		</div>
		<div class="btn_div">
			<div class="button_normal exit_btn" id="btnPopJen1004Cancle" >닫기</div>
		</div>
	</div>
</div>
</html>