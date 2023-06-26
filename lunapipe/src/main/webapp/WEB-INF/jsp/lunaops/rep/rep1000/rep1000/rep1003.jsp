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
		
		fnGetFileContent();
		
		$('#sourceTitle').html( '${param.name}');
		
		
		
		$('#btn_cancle_rep1003').click(function() {
			gfnLayerPopupClose();
		});
	});


	function fnGetFileContent(){
	 	
	 	
	 	gfnShowLoadingBar(true);
	  	
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1003FileContentAjax.do'/>","loadingShow": false}
				, {"revision" : '${param.revision}', "commitId" : '${param.commitId}' ,  "path" : '${param.path}', "repId" : '${param.repId}'});
		
		ajaxObj.setFnSuccess(function(data){
			
			data = JSON.parse(data);

			
			if(data.MSG_CD =="REP_OK"){
				$('#fileContent').text(data.content);
				
				
				$('#fileContent').each(function(i, block) {hljs.highlightBlock(block);});
				
			}else{
				
				$("#btn_cancle_rep1003").click();
				jAlert("소스저장소 연결에 실패했습니다.", "알림창");
			}
			
			
		});
		
		
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