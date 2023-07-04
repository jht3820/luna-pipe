<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<html lang="ko">

<title>OpenSoftLab</title>
<link rel="stylesheet" type="text/css" href="<c:url value='/js/highlight/styles/ir-black.css'/>">
<script type="text/javascript" src="<c:url value='/js/highlight/highlight.pack.js'/>"></script>
<style>
#lx1 .pop_left, .layer_popup_box .pop_right { height: 54px; }
#lx1{ width:590px !important; height:845px !important; }
.lp10{padding-left: 10px}
input[type='radio']+label{font-weight: bold;}
.textarea_height{height:107px !important;}
.required_info{color:red}
.ui-menu-item {font-size: 0.5em !important; text-align:left;}
textarea#fileContent{resize: none;}
div#contentsFrame {
    width: 100%;
    height: 640px !important;
    text-align: left;
    line-height:20px;
}
div#contentsFrame > pre{width:100%;height:100%;}
div#contentsFrame > pre > code{    height: 100%;width: 100%;font-size: 10pt;}
.fileMainFrame{padding: 0 15px !important;}
.fileMainBtnFrame{margin-top:35px !important;text-align: center;}
</style>
<script>
	
	$(document).ready(function() {
		//var content = "${content}";
		fnGetFileContent();
		//
		$('#sourceTitle').html( '${param.name}');
		
		
		/* 닫기버튼 클릭 시 팝업 창 사라지기*/
		$('#btn_cancle_rep1003').click(function() {
			gfnLayerPopupClose();
		});
	});


	function fnGetFileContent(){
	 	/* 그리드 데이터 가져오기 */
	 	//파라미터 세팅
	 	gfnShowLoadingBar(true);
	  	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1003FileContentAjax.do'/>","loadingShow": false}
				, {"revision" : '${param.revision}', "commitId" : '${param.commitId}' ,  "path" : '${param.path}', "repId" : '${param.repId}'});
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
			

			//소스저장소 접속 실패
			if(data.MSG_CD =="REP_OK"){
				$('#fileContent').text(data.content);
				
				//코드 뷰어 달기
				$('#fileContent').each(function(i, block) {hljs.highlightBlock(block);});
				/*console.time() .promise().done( function(){ gfnShowLoadingBar(false);console.timeEnd() } ); */
			}else{
				// 그외 접속 불가인경우 팝업창 닫기
				$("#btn_cancle_rep1003").click();
				jAlert("소스저장소 연결에 실패했습니다.", "알림창");
			}
			
			
		});
		
		//AJAX 전송
		ajaxObj.send();
	}

</script>

	<div class="popup">
		<div class="pop_title" id="sourceTitle">
		</div>
		<div class="pop_sub fileMainFrame">
			<div id="contentsFrame">
				<pre>
					<code id="fileContent">
					
					</code>
				</pre>
			</div>
		</div>
		<div class="btn_div fileMainBtnFrame">
			<div class="button_normal exit_btn" id="btn_cancle_rep1003">닫기</div>
		</div>
	</div>
</html>