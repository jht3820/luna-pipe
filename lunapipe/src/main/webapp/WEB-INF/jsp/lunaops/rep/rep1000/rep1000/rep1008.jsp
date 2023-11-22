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
.rep1008-elem-group {
	display: flex;
	flex-flow: row;
	flex-wrap: nowrap;
	align-items:center;
	padding: 2px;
}
.rep1008-elem-group #questionArea {
	width:90%;
	border: 1px #c5c5c5 solid;
	border-radius: 3px;
	margin-left:2px;
	resize: none;
}
.rep1008-elem-group #questionCallBtn {
	display:flex;
	align-items:center;
	justify-content:center;
	height: 60px;
	width: 10%;
	border: 1px #c5c5c5 solid;
	border-radius: 3px;
	margin-left:2px;
}
.rep1008-elem-group #questionCallBtn i {
	font-size: 20px;
	color: #468ec9;
}
.rep1008-elem-group #questionCallBtn:hover {
	background-color: #468ec9;
	cursor: pointer;
}
.rep1008-elem-group #questionCallBtn:hover i {
	color: #fff;
}
div.contentsFrame {
    width: 50%;
    height: 640px !important;
    text-align: left;
    line-height:20px;
    position: relative;
}
div.rep1008ContentFrame {display: flex; flex-flow: row; flex-wrap: nowrap;}
div#contentsFrameLeft{float:left;}
div#contentsFrameRight{float:right;}
div.contentsFrame > pre {
	width:584px;
	height:100%;
	overflow: scroll;
    background-color: #000;
    color: #fff;
}
.chat-gpt--answer .chat-gpt--answer-area pre {
	width: 468px;
	max-height: 450px;
	overflow: scroll;
    background-color: #000;
    color: #fff;
}
div.contentsFrame > pre > code
,.chat-gpt--answer .chat-gpt--answer-area code {height: 100%;width: 100%;font-size: 10pt;}
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
.rep1008ChatGPTFrame .chatGptTopMessageInfo {
	height: 25px;
    line-height: 25px;
    display: inline-block;
    width: 100%;
    background-color: #b3c6ff;
    color: #000;
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
    overflow-y:scroll;
    overflow-x:scroll;
    overflow:hidden;
    line-height: 21px;
    margin-right: 10px;
}
.rep1008ChatGPTFrame .chatGptMessageFrame {
	padding: 5px 2px;
	float: left;
	line-height: 21px;
	margin-right: 10px;
	width: 100%;
	height: 90%;
	overflow:hidden;
	overflow-y:scroll;
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
#answerLodingMarsk {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
.user-question, .chat-gpt--answer {
	width: 90%;
	margin-bottom: 15px;
	display: flex;
}
.user-question {float: right; justify-content: flex-end;}
.chat-gpt--answer {float: left; justify-content: flex-start;}
.user-question .user-question--content {
	border: 1px solid #b3c6ff;
	border-radius: 5px;
	padding: 5px 10px;
	color: #000;
	background-color : #b3c6ff;
	max-width: 100%;
	width: fit-content;
}
.chat-gpt--answer .chat-gpt--answer--content {
	border: 1px solid #468ec9;
	border-radius: 5px;
	padding: 5px;
	color: #fff;
	background-color : #468ec9;
	display: flex;
	flex-flow: row;
	flex-wrap: nowrap;
	align-items: flex-start;
	max-width: 100%;
	width: fit-content;
}
.chat-gpt--answer .chat-gpt--answer-icon {
	width: 25px;
}
.chat-gpt--answer .chat-gpt--answer-icon>i {
	font-size: 20px;
	color: #fff;
	align-self: center;
}
.chat-gpt--answer .chat-gpt--answer-area {
	flex-grow: 1;
	margin-left: 5px;
}
.user-question .user-question--content
,.chat-gpt--answer .chat-gpt--answer-area {
	word-break: break-all;
	white-space: wrap;
	display:inline-block;
	width: 90%;
}
</style>
<script>
	//질문 누적하여 이전 대화를 고려하도록 하기 위해
	//var questionList = [{"role":"system", "content":"You're a great developer, so please don't answer non-development questions. Please answer in Korean except for the code. Please give a brief answer other than improving the code."}];
	//var questionList = [{"role":"system", "content":"Since you are a good developer, please answer code improvement questions in detail and other questions briefly in Korean."}];
	var questionList = [];
	
	$(document).ready(function() {
		fnGetFileContent();
		
		
		//질문
		$("#questionArea").keyup(function(e){
			if(e.key == "Enter" || e.keyCode == 13){
    			if(!e.shiftKey){
    				e.stopPropagation();
    				e.preventDefault();
    				
    				//chat gpt call
    				$("#questionCallBtn").click();
    			}
    		}
		});
		//전송
		$("#questionCallBtn").click(function(){
			var question = $("#questionArea").val().trim();
			$("#questionArea").val("");
			
			//값이 있으면
			if(!gfnIsNull(question)){
				fnChatGptCall(question);
			}
		});
		
		/* 닫기버튼 클릭 시 팝업 창 사라지기*/
		$('#btn_cancle_rep1008').click(function() {
			gfnLayerPopupClose();
		});
	});

	function fnGetFileContent(){
	  	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1008CodeImprovementAjax.do'/>","loadingShow":false}
				, {"revision" : '${param.revision}',"commitId" : '${param.commitId}',  "path" : '${param.path}', "repId" : '${param.repId}', "repTypeCd" : "${param.repTypeCd}"});
		
	  	//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
			//코드 영역에 표출
			var repTypeCd = '${param.repTypeCd}';
			
			//리비전 정보 넣기
			//github
			if(repTypeCd == '01'){
				$("span#rep1008Revision").text('${param.revisionNum}');
			}
			//svn
			else if(repTypeCd == '02'){
				$("span#rep1008Revision").text(data.revision);
			}
			//gitlab
			else if(repTypeCd == '03'){
				$("span#rep1008Revision").text(data.commitId);
			}
			
			$('#fileContentLeft').text(data.content);
			 
			//코드 라인 수
			var leftCodeLineCnt = 0;
			//좌측 코드 라인 수
			if(!gfnIsNull(data.content)){
				//라인 자르기
				var leftCodeLine = data.content.split("\n");
				leftCodeLineCnt = leftCodeLine.length;
			}
			
			//코드 라인 부여
			for(var i=0;i<leftCodeLineCnt;i++){
				$("#codeLineFrameLeft").append('<div class="codeLineDiv">'+(i+1)+'</div>');
			}
			
			$("#fileContentLeft").prepend($("#codeLineFrameLeft"));
			
			//mask
		 	$("#repFileDiffFrameMask").hide();
		});
		
		//AJAX 전송
		ajaxObj.send();
	}
	
	function fnChatGptCall(question){
		//질문 누적을 위해
		questionList.push({"role":"user", "content": question});
		
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1008CallChatGPTAjax.do'/>","loadingShow":false}
				, {"role":"programmer", "langCd":"ko", "questionList": JSON.stringify(questionList)});
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			var answer = '';
			var codeHtml = '';
			var codeAnswer = '';
			
			//답변 성공
			if(data.answerContent["success"]){
				answer = data.answerContent["data"];
				
				//질문 누적을 위해
				questionList.push({"role":"assistant", "content": answer});
				
				//```으로 감싸진 무언가가 전달된다면,
				var startIndex = answer.indexOf("```");
				var lastIndex = answer.lastIndexOf("```");
				if(startIndex != lastIndex && startIndex != -1){
					codeHtml = '<div class="codeLineFrame" id="'+data.answerContent["id"]+'_Div"></div>'
										+'<pre><code id="'+data.answerContent["id"]+'"></code></pre>';
					
					//answer에서 codeHtml에 들어갈 내용은 제거
					codeAnswer = answer.substring(startIndex+3, lastIndex);
					answer = answer.replace(codeAnswer, "");
					answer = answer.replace("``````", "");
				}
				
				//줄바꿈이나 탭이 있으면 적용하기 위해서
				answer = answer.replaceAll("\n", "<br/>");
				answer = answer.replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
				
				//코드와 코드 외 답변이 존재할 때, 답변 영역에서 br 태그가 첫번째에 없으면
				if(!gfnIsNull(codeHtml) && answer.indexOf("<br/>") != 0){
					answer = "<br/><br/>" + answer;
				}
				
			}else{
				answer = data.answerContent["message"];
				console.log("error", answer, data);
			}
			 
			var innerHtml = '<div class="chat-gpt--answer">'
										+'<div class="chat-gpt--answer--content">'
											+'<div class="chat-gpt--answer-icon">'
												+'<i class="fas fa-comment-dots"></i>'
											+'</div>'
											+'<div class="chat-gpt--answer-area">'
												+ codeHtml
												+ answer
											+'</div>'
										+'</div>'
									+'</div>';
			
			$('#rep1008MessageDiv').append(innerHtml);
			
			//잘라낸 코드가 존재하면
			if(!gfnIsNull(codeAnswer)){
				$('#'+data.answerContent["id"]).text(codeAnswer);
				
				//코드 라인 수
				var codeLineCnt = 0;
				//좌측 코드 라인 수
				if(!gfnIsNull(codeAnswer)){
					//라인 자르기
					var codeLine = codeAnswer.split("\n");
					codeLineCnt = codeLine.length;
				}
				
				//코드 라인 부여
				for(var i=0;i<codeLineCnt;i++){
					$("#"+data.answerContent["id"]+"_Div").append('<div class="codeLineDiv">'+(i+1)+'</div>');
				}
				
				$("#"+data.answerContent["id"]).prepend($("#"+data.answerContent["id"]+"_Div"));
			}
			
			//로딩 바
			$("#answerLodingMarsk").remove();
		});
		
		//질문 그려 넣기
		var questionHtml =  '<div class="user-question">'
										+'<div class="user-question--content">'
											+ gfnEscapeHtml(question)
										+'</div>'
									+'</div>';
		$('#rep1008MessageDiv').append(questionHtml);

		//AJAX 전송
		ajaxObj.send();
		
		//로딩 바
		var lodingHtml = '<div class="answerLodingMarsk" id="answerLodingMarsk">'
									+'<img class="fixed_loading" src="/images/loading.gif" style="width: 100px;height: 100px;">'
								+'</div>';
		$('#rep1008MessageDiv').append(lodingHtml);
		
		//스크롤 맨 아래로 이동
		$('#rep1008MessageDiv').animate({scrollTop: $('#rep1008MessageDiv')[0].scrollHeight}, 1000);
	}
</script>

	<div class="popup">
		<div class="pop_title" id="sourceTitle">[ <c:out value='${param.fileName}'/> ] Improve file by Chat gpt
		</div>
		<div class="pop_sub fileMainFrame">
			<div class="svn_mask_repList" id="repFileDiffFrameMask">
				데이터를 조회중입니다.<br><br>
				<img class="fixed_loading" src="/images/loading.gif" style="width: 100px;height: 100px;">
			</div>
			<div class="rep1008ContentFrame">
				<div class="contentsFrame" id="contentsFrameLeft">
					<div class="contentTopRevisionInfo">Revision: <span id="rep1008Revision"></span></div>
					<div class="codeLineFrame" id="codeLineFrameLeft"></div>
					<pre id="preFileContentLeft"><code id="fileContentLeft"></code></pre>
				</div>
				<div class="contentsFrame rep1008ChatGPTFrame" id="contentsFrameRight">
					<div class="chatGptTopMessageInfo">Chat GPT</div>
					<div class="chatGptMessageFrame" id="rep1008MessageDiv">
					</div>
					<div class="rep1008-elem-group">
						<textarea rows="3" cols="100" id="questionArea" style="height:60px;"></textarea>
						<div id="questionCallBtn">
							<div><i class="far fa-paper-plane"></i></div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="btn_div fileMainBtnFrame">
			<div class="button_normal exit_btn" id="btn_cancle_rep1008">닫기</div>
		</div>
	</div>
</html>