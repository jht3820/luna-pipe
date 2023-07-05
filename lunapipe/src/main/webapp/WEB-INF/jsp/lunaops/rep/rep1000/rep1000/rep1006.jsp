<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html lang="ko">

<title>OpenSoftLab</title>
<link rel="stylesheet" type="text/css" href="<c:url value='/js/highlight/styles/ir-black.css'/>">
<script type="text/javascript" src="<c:url value='/js/highlight/highlight.pack.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/diff/diff_match_patch_uncompressed.js'/>"></script>
<style>
#lx1 .pop_left, .layer_popup_box .pop_right { height: 54px; }
#lx1{ width:590px !important; height:845px !important; }
.lp10{padding-left: 10px}
input[type='radio']+label{font-weight: bold;}
.textarea_height{height:107px !important;}
.required_info{color:red}
.ui-menu-item {font-size: 0.5em !important; text-align:left;}
textarea#fileContentLeft,textarea#fileContentRight{resize: none;}
div.contentsFrame {
    width: 50%;
    height: 640px !important;
    text-align: left;
    line-height:20px;
    position: relative;
}
div#contentsFrameLeft{float:left;}
div#contentsFrameRight{float:right;}
div.contentsFrame > pre{
	width:584px;
	height:100%;
	overflow: scroll;
    background-color: #000;
    color: #fff;
}
div.contentsFrame > pre > code{    height: 100%;width: 100%;font-size: 10pt;}
.fileMainFrame{padding: 0 15px !important;}
.fileMainBtnFrame{margin-top:35px !important;text-align: center;}
.contentTopRevisionInfo {
    height: 25px;
    line-height: 25px;
    display: inline-block;
    width: 100%;
    background-color: #000;
    color: #fff;
    border: 1px solid #fff;
    border-left: none;
    margin-top: 5px;
    padding-left: 10px;
}
span.text-rep-add {background-color: #1f4acc;}
span.text-rep-del {background-color: #af3022;}
.codeLineFrame {
    width: 30px;
    /* height:100%; */
    text-align: right;
    background-color: #000;
    color: #fff;
    float: left;
    padding: 0 1px;
    /* overflow-y:hidden;
    overflow-x:scroll; */
    overflow:hidden;
    line-height: 21px;
    margin-right: 10px;
}
.diffScrollLineLeft {
    position: absolute;
    top: 84px;
    left: 567px;
    width: 18px;
    height: 2px;
    background-color: rgba(31, 74, 204, 0.5);
    pointer-events: none;
}
.diffScrollLineRight {
    position: absolute;
    top: 84px;
    left: 567px;
    width: 18px;
    height: 2px;
    background-color: rgba(175, 48, 34, 0.5);
    pointer-events: none;
}
.codeLineDiv {
    width: 100%;
    padding-right: 5px;
    float: left;
    line-height: 21px;
}
.pop_sub.fileMainFrame {
    position: relative;
}
#repFileDiffFrameMask {
    position: absolute;
    width: 100%;
    height: 670px;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    text-align: center;
    font-size: 12pt;
    padding-top: 250px;
    z-index: 2;
    top: 0;
    left: 0;
}
</style>
<script>
	
	$(document).ready(function() {
		//var content = "${content}";
		fnGetFileContent();
		
		/* 닫기버튼 클릭 시 팝업 창 사라지기*/
		$('#btn_cancle_rep1006').click(function() {
			gfnLayerPopupClose();
		});
	});

	// 지정자리 버림 (값, 자릿수)
	function Floor(n, pos) {
		var digits = Math.pow(10, pos);
		var num = Math.floor(n * digits) / digits;
		return num.toFixed(pos);
	}

	function fnGetFileContent(){
		//mask
	 	$("#repFileDiffFrameMask").show();
		
	 	/* 그리드 데이터 가져오기 */
	  	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1006FileDiffContentAjax.do'/>","loadingShow":false}
				, {"revision" : '${param.revision}',"commitId" : '${param.commitId}' ,  "path" : '${param.path}', "repId" : '${param.repId}', "diffRevision": '${param.diffRevision}', "diffCommitId": '${param.diffCommitId}'});
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
			

			//SVN 접속 실패
			if(data.MSG_CD =="REP_OK"){
				//로딩바 로드
				//gfnShowLoadingBar(true);

				var repTypeCd = '${param.repTypeCd}';
				
				if(repTypeCd != '03'){
					//리비전 정보 넣기
					$("span#rep1006Revision").text(data.revision);
					$("span#rep1006DiffRevision").text(data.diffRevision);
				}else{
					$("span#rep1006Revision").text(data.commitId);
					$("span#rep1006DiffRevision").text(data.diffCommitId);
				}
				

				//비교 후 결과 값
				var oldVal = "";
				var newVal = "";
				
				$('#fileContentLeft').text(data.content);
				$('#fileContentRight').text(data.diffContent);
				
				//문자열 비교
				var dmp = new diff_match_patch();
				var diffs = dmp.diff_main($('#fileContentRight').html(), $('#fileContentLeft').html());
				dmp.diff_cleanupEfficiency(diffs);
				
				//문자열 비교 값 loop돌면서 class 입히기
				for (var i = 0, j = diffs.length; i < j; i++) {
			        var arr = diffs[i];
			        if (arr[0] == 0) {	//변화 없음
			            oldVal += arr[1];
			            newVal += arr[1];
			        } else if (arr[0] == -1) { //이전 값에서 제거
			            oldVal += "<span class='text-rep-del'>" + arr[1] + "</span>";
			        } else { //변경 값에서 추가
			            newVal += "<span class='text-rep-add'>" + arr[1] + "</span>";
			        }
			    }
				
				$('#fileContentLeft').html(newVal);
				$('#fileContentRight').html(oldVal);
				
				//코드 라인 수
				var leftCodeLineCnt = 0;
				var rightCodeLineCnt = 0;
				
				//좌측 코드 라인 수
				if(!gfnIsNull(oldVal)){
					
					//라인 자르기
					var leftCodeLine = newVal.split("\n");
					leftCodeLineCnt = leftCodeLine.length;
					
					//코드 창 크기 높이
					var codeWindowHeight = $("#preFileContentLeft").height() - 50;
					
					//스크롤바 높이 제외
					codeWindowHeight = codeWindowHeight;
					
					//라인 마다 스크롤 높이 구하기
					var codeScrollLine = parseFloat((codeWindowHeight/leftCodeLineCnt));
					
					//스크롤 색상변경 계산
					$.each(leftCodeLine, function(idx, map){
						//text-rep-del 있는지 체크
						if(map.indexOf('text-rep-add') != -1){
							
							//해당 라인 스크롤 위치 구하기
							var targetLineScrollTop = ((idx+1)*codeScrollLine);
							targetLineScrollTop += 44;
							
							$("#contentsFrameLeft").append('<div class="diffScrollLineLeft" style="top:'+targetLineScrollTop+'px;"></div>');
						}
					});
					 
				}
				
				//우측 코드 라인 수
				if(!gfnIsNull(newVal)){
					//라인 자르기
					var rightCodeLine = oldVal.split("\n");
					rightCodeLineCnt = rightCodeLine.length;
					
					//코드 창 크기 높이
					var codeWindowHeight = $("#preFileContentRight").height() - 50;
					
					//라인 마다 스크롤 높이 구하기
					var codeScrollLine = parseFloat((codeWindowHeight/rightCodeLineCnt));
					
					//스크롤 색상변경 계산
					$.each(rightCodeLine, function(idx, map){
						//text-rep-del 있는지 체크
						if(map.indexOf('text-rep-del') != -1){
							
							//해당 라인 스크롤 위치 구하기 (기본 Top 84px)
							var targetLineScrollTop = ((idx+1)*codeScrollLine);
							targetLineScrollTop += 44;
							
							$("#contentsFrameRight").append('<div class="diffScrollLineRight" style="top:'+targetLineScrollTop+'px;"></div>');
							
						}
					});
				}
				
				//코드 라인 부여
				for(var i=0;i<leftCodeLineCnt;i++){
					//$("#codeLineFrameLeft").append(i+"</br>");
					$("#codeLineFrameLeft").append('<div class="codeLineDiv">'+(i+1)+'</div>');
				}
				for(var i=0;i<rightCodeLineCnt;i++){
					//$("#codeLineFrameRight").append(i+"</br>");
					$("#codeLineFrameRight").append('<div class="codeLineDiv">'+(i+1)+'</div>');
				}
				
				$("#fileContentLeft").prepend($("#codeLineFrameLeft"));
				$("#fileContentRight").prepend($("#codeLineFrameRight"));
				
				//가로 스크롤 동시 제어
				$("#preFileContentLeft").scroll(function(){
					//우측 가로,세로 스크롤 제어
					$('#preFileContentRight').scrollTop($("#preFileContentLeft").scrollTop());
					$('#preFileContentRight').scrollLeft($("#preFileContentLeft").scrollLeft());
					
					//코드 라인 스크롤 제어
					$('#codeLineFrameLeft').scrollTop($("#preFileContentLeft").scrollTop());
				});
				$("#preFileContentRight").scroll(function(){
					
					//코드 라인 스크롤 제어
					$('#codeLineFrameRight').scrollTop($("#preFileContentRight").scrollTop());
				});
				//mask
			 	$("#repFileDiffFrameMask").hide();
			}else{
				// 그외 접속 불가인경우 팝업창 닫기
				$("#btn_cancle_rep1006").click();
				jAlert("소스저장소 연결에 실패했습니다.", "알림창");
			}
			
			
		});
		
		//AJAX 전송
		ajaxObj.send();
	}

</script>

	<div class="popup">
		<div class="pop_title" id="sourceTitle">[ <c:out value='${param.fileName}'/> ] Revision File Compare
		</div>
		<div class="pop_sub fileMainFrame">
			<div class="svn_mask_repList" id="repFileDiffFrameMask">
				데이터를 조회중입니다.<br><br>
				<img class="fixed_loading" src="/images/loading.gif" style="width: 100px;height: 100px;">
			</div>
			<div id="contentsFrameLeft" class="contentsFrame">
				<div class="contentTopRevisionInfo">Revision: <span id="rep1006Revision"></span></div>
				<div class="codeLineFrame" id="codeLineFrameLeft"></div>
				<pre id="preFileContentLeft"><code id="fileContentLeft"></code></pre>
			</div>
			<div id="contentsFrameRight" class="contentsFrame">
				<div class="contentTopRevisionInfo">Revision: <span id="rep1006DiffRevision"></span></div>
				<div class="codeLineFrame" id="codeLineFrameRight"></div>
				<pre id="preFileContentRight"><code id="fileContentRight"></code></pre>
			</div>
		</div>
		<div class="btn_div fileMainBtnFrame">
			<div class="button_normal exit_btn" id="btn_cancle_rep1006">닫기</div>
		</div>
	</div>
</html>