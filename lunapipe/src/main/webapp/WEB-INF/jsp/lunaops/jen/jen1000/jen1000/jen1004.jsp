<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="ko">
<title>OpenSoftLab</title>
<link rel="stylesheet" type="text/css" href="<c:url value='/js/highlight/styles/ir-black.css'/>">
<script type="text/javascript" src="<c:url value='/js/highlight/highlight.pack.js'/>"></script>
<style type="text/css">
.layer_popup_box .pop_sub {width: 100%;padding: 20px 20px;padding-bottom:0;text-align: center;display: inline-block;position:relative;font-size: 12px;}
	


.pop_menu_row .pop_menu_col1 { width: 26% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 74% !important; height: 45px !important; }

.layer_popup_box input[readonly],.layer_popup_box input:read-only {background-color: #fff;}

.pop_dpl_div_sub.divDetailJen1004_sub_left{width: 49%;float: left;margin-right: 10px;height: 740px;}
.pop_dpl_div_sub.divDetailJen1004_sub_right {width: 50%;float: right;height: 740px;}

.jen1004_sub_title {font-weight: bold;background: #f9f9f9;border: 1px solid #ccc;border-left: none;border-right: none;padding: 6px 5px;height: 35px;position: relative;text-align: left;font-size: 11pt;margin-bottom: 2px;line-height: 20px;}
div.jen1004JobContentsFrame{background: #23241f;color: #f8f8f2;height: 301px;display: inline-block;width: 100%;text-align: left;line-height: 20px;position: relative;border: 1px solid #ccc;}
div.jen1004JobContentsFrame > pre{width:100%;height:100%}
div.jen1004JobContentsFrame > pre > code {height: 100%;width: 100%;font-size: 10pt;position: absolute;top: 0;left: 0;padding: 0.5em;    overflow: auto;}
div.jen1004JobContentsFrame > pre > code > a {color: #67a8e9;}
div#pop_dpl_job_consoleLogDiv.full_screen{position: absolute;top: 0;left: 0;width: 100%;height: 745px;z-index:2;background-color:#fff;}
.jen1004_grid_frame{margin-bottom: 5px;}
form#jen1004JobInfoForm div#buildChgLog {
    height: 303px;
    overflow-y: scroll;
    margin-top: 1px;
}
.jen1004JobDetailInfoFrame{
    display: inline-block;
    width: 100%;
    height: 690px;
    overflow: hidden;
    border: 1px solid #ccc;
    text-align: left;
}
.jen1004BldConsoleFullScreanBtn {
    display: inline-block;
    width: 35px;
    margin: 0 5px;
    height: 29px;
    text-align: center;
    font-size: 14pt;
    float: right;
    padding: 3px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
}
.jen1004BldConsoleFullScreanBtn:hover{background: #e8e8e8;text-decoration: none;color: #6e7a85;}
.jen1004BldConsoleMainFrame.full_screen {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 20px;
    height: 94%;
    background-color: #fff;
}
.jen1004BldConsoleMainFrame.full_screen .jen1004JobContentsFrame {
    height: 696px;
}
</style>
<script type="text/javascript">


var jen1004BldListGrid;

var jen1004BldSearchObj;

$(document).ready(function() {
	
	fnJobBldListGridSetting();
	
	
	$('#btnPopJen1004Cancle').click(function() {
		gfnLayerPopupClose();
	});
	
	
	$("#jen1004BldParamBtn").click(function(){
		var jenId = $(this).data("jenId");
		var jobId = $(this).data("jobId");
		var bldNum = $(this).data("bldNum");
		
		var data = {
				"jenId" : jenId,
				"jobId" : jobId,
				"bldNum" : bldNum
		};
		
		
		gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1006View.do',data,"840","300",'scroll');
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
			$("#jen1004BuildJobConsoleLog").html(data.message);
			
		}else{
			var buildMap = data.dpl1400InfoMap;
			
			
			if(gfnIsNull(buildMap) || gfnIsNull(buildMap.bldConsoleLog)){
				$("#jen1004BuildJobConsoleLog").html("콘솔 로그가 없습니다.");
				return false;
			}
			
			$("#jen1004BuildJobConsoleLog").html(buildMap.bldConsoleLog);
			$('#jen1004BuildJobConsoleLog').each(function(i, block) {hljs.highlightBlock(block);});
						
			
			$("#jen1004BuildJobConsoleLog").scrollTop(9999);
		}
		
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
		$("#dplPopBuildConsoleLog").html("콘솔 내용 조회 오류");
	});
	
	
	ajaxObj.send();
	
}


$(".jen1004BldConsoleFullScreanBtn").click(function(){
	var $thisObj = $(this);
	
	var $targetObj = $("div#jen1004BldConsoleMainFrame");
	
	
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
			{key: "bldDurationTm", label: "소요시간", width: 105, align: "center"
				,formatter:function(){
					return gfnHourCalc(this.item.bldDurationTm/1000);
				}
			},
			{key: "bldStartDtm", label: "빌드 시작 시간", width: 150, align: "center"
				,formatter:function(){
					return new Date(this.item.bldStartDtm).format("yyyy-MM-dd HH:mm:ss");
				}
			},
			{key: "bldCauses", label: "실행 원인", width: 151, align: "center"}
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
		
		
		var jenNmStr = "-";
		var jenUrlStr = "-";
		var jobIdStr = "-";
		var jobTypeNmStr = "-";
		
		
		var ciIdStr = "-";
		var ticketIdStr = "-";
		var dplIdStr = "-";
		
		
		var buildCauses = "-";
		var building = false;
		var buildDate = "-";
		var buildNumber = "-";
		var buildResult = "-";
		var buildDurationStr = "-";
		var buildEstimatedDurationStr = "-";
		var buildChgLog = '<div class="buildChgMainFrame">-</div>';
		var buildConsoleLog = "-";
		var jobClass = "-";
		
		if(data.errorYn == "Y"){
			jAlert(data.message,"알림창");
			return;
		}else{
			
			var jobBuildInfo = data.jobBuildInfo;
			var jobBuildChgList = data.jobBuildChgList;
			var jobBuildFileChgList = data.jobBuildFileChgList;
			
			if(!gfnIsNull(jobBuildInfo)){
				try{
					
					ciIdStr = (jobBuildInfo.hasOwnProperty("ciId"))?jobBuildInfo["ciId"]:"-";
					ticketIdStr = (jobBuildInfo.hasOwnProperty("ticketId"))?jobBuildInfo["ticketId"]:"-";
					dplIdStr = (jobBuildInfo.hasOwnProperty("dplId"))?jobBuildInfo["dplId"]:"-";
				}catch(e){
					console.log(e);
				}
				try{
					
					jenNmStr = jobBuildInfo["jenNm"];
					jenUrlStr = jobBuildInfo["jenUrl"];
					jobIdStr = jobBuildInfo["jobId"];
					jobTypeNmStr = jobBuildInfo["jobTypeNm"];
					
					
					var jobBldParamCnt = jobBuildInfo["bldParamCnt"];
					
					if(jobBldParamCnt > 0){
						
						$("#jen1004BldParamBtn").show();
						
						
						$("#jen1004BldParamBtn").data("bldNum", paramBldItem.bldNum);
						$("#jen1004BldParamBtn").data("jenId", paramBldItem.jenId);
						$("#jen1004BldParamBtn").data("jobId", paramBldItem.jobId);
					}else{
						
						$("#jen1004BldParamBtn").hide();
					}
				}catch(e){
					console.log(e);
				}
				try{
					
					jobClass = jobBuildInfo["bldClass"];
					buildCauses = jobBuildInfo["bldCauses"];
					buildDate = new Date(jobBuildInfo["bldStartDtm"]).format("yyyy-MM-dd HH:mm:ss");
					buildNumber = jobBuildInfo["bldNum"];
					buildResult = jobBuildInfo["bldResult"];
					buildDurationStr = gfnHourCalc(jobBuildInfo["bldDurationTm"]/1000);
					buildEstimatedDurationStr = gfnHourCalc(jobBuildInfo["bldEtmDurationTm"]/1000);
					buildConsoleLog = jobBuildInfo["bldConsoleLog"];
					
				}catch(e){
					console.log(e);
				}
				try{
					
					var buildChgLogStr = "";
					
					
					if(!gfnIsNull(jobBuildChgList)){
						
						var jobLastBuildFileChgMap = {};
						
						
						if(!gfnIsNull(jobBuildFileChgList)){
							$.each(jobBuildFileChgList, function(idx, map){
								
								if(!jobLastBuildFileChgMap.hasOwnProperty(map.bldNum)){
									jobLastBuildFileChgMap[map.bldNum] = {};
								}
								
								if(!jobLastBuildFileChgMap[map.bldNum].hasOwnProperty(map.chgRevision)){
									jobLastBuildFileChgMap[map.bldNum][map.chgRevision] = [];
								}
								
								
								jobLastBuildFileChgMap[map.bldNum][map.chgRevision].push(map);
							});
						}
						
						
						$.each(jobBuildChgList, function(idx, map){
							
							var buildChgFileStr = "";
							
							buildChgLogStr += 
								'<div class="buildChgMainFrame">'
									+'<div class="buildChgHeader"><b>'+map.chgRevision+'</b> - '+map.chgUser+' ('+(new Date(parseInt(map.chgTimestamp)).format("yyyy-MM-dd HH:mm:ss"))+') </div>'
									+'<div class="buildChgBody">'+(map.chgMsg).replace(/\n/g,"</br>")+'</div>'
							
							
							if(jobLastBuildFileChgMap.hasOwnProperty(map.bldNum) && jobLastBuildFileChgMap[map.bldNum].hasOwnProperty(map.chgRevision)){
								
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
			}
		}
		
		$("form#jen1004JobInfoForm #jenNm").text(jenNmStr);
		$("form#jen1004JobInfoForm #jenUrl").text(jenUrlStr);
		$("form#jen1004JobInfoForm #jobId").text(jobIdStr);
		$("form#jen1004JobInfoForm #jobTypeNm").text(jobTypeNmStr);
		
		
		$("form#jen1004JobInfoForm #ciId").text(ciIdStr);
		$("form#jen1004JobInfoForm #ticketId").text(ticketIdStr);
		$("form#jen1004JobInfoForm #dplId").text(dplIdStr);
		
		
		$("form#jen1004JobInfoForm #buildCauses").text(buildCauses);
		$("form#jen1004JobInfoForm #jobClass").text(jobClass);
		$("form#jen1004JobInfoForm #building").text(building);
		$("form#jen1004JobInfoForm #buildDate").text(buildDate);
		$("form#jen1004JobInfoForm #buildNumber").text(buildNumber);
		$("form#jen1004JobInfoForm #buildResult").text(buildResult);
		$("form#jen1004JobInfoForm #buildDurationStr").text(buildDurationStr);
		$("form#jen1004JobInfoForm #buildEstimatedDurationStr").text(buildEstimatedDurationStr);
		$("form#jen1004JobInfoForm #buildChgLog").html(buildChgLog);
		
		
		$("#jen1004BuildJobConsoleLog").html(buildConsoleLog);
	});
	
	
	ajaxObj.send();
}
</script>

<div class="popup">
	<div class="pop_title">[ <c:out value="${param.jobId}"/> ] 빌드 상세 정보</div>
	<div class="pop_sub" style="position: relative;">
		<div class="pop_dpl_div_sub divDetailJen1004_sub_left">
			<div class="jen1004_sub_title">
				JOB 빌드 목록
			</div>
			<div class="jen1004_grid_frame">
				<div data-ax5grid="jobBldListGrid" data-ax5grid-config="{}" style="height: 345px;" guide="jen1000JenkinsList"></div>	
			</div>
			<div class="jen1004BldConsoleMainFrame" id="jen1004BldConsoleMainFrame">
				<div class="jen1004_sub_title">
					선택 빌드 콘솔 로그
					<div class="sub_title_btn right">
						<div class="jen1004BldConsoleFullScreanBtn"><i class="fas fa-expand"></i></div>
					</div>
				</div>
				<div class="jen1004JobContentsFrame">
					<pre>
						<code id="jen1004BuildJobConsoleLog">상단 빌드 이력을 선택해주세요.</code>
					</pre>
				</div>
			</div>
		</div>
		<div class="pop_dpl_div_sub divDetailJen1004_sub_right" id="pop_dpl_job_consoleLogDiv" fullmode="2">
		
			<div class="jen1004_sub_title">
				선택 빌드 상세 정보
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
					<div class="descSubFrame">
						<div class="descLabelFrame"><label>DPL ID</label></div>
						<div class="descValueFrame">
							<span id="dplId"></span>
						</div>
					</div>
					<div class="descSubFrame">
						<div class="descLabelFrame"><label>빌드 파라미터 값</label></div>
						<div class="descValueFrame">
							<button type="button" id="jen1004BldParamBtn" style="width:100px;display:none;" class="AXButton searchButtonItem"><i class="fa fa-external-link"></i>&nbsp;<span>보기</span></button>
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
					<div class="descLabelFrame"><label>빌드 실행 원인</label></div>
					<div class="descValueFrame">
						<span id="buildCauses"></span>
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
					<div class="descBodyValueFrame" id="buildChgLog"><div class="buildChgMainFrame">-</div></div>
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