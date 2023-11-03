<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="ko">
<title>OpenSoftLab</title>

<style type="text/css">

.jobChk input[type="checkbox"] {
    margin: 6px 0px 0px 0px;
    opacity: 0;
}

.jobChk input[type="checkbox"]+label {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url(/images/contents/normal_check.png) no-repeat;
    font-size: 1em;
    line-height: 24px;
    vertical-align: middle;
    cursor: pointer;
    z-index: 1;
    border-radius: 3px;
    margin-top: 5px;
}

.jobChk input[type="checkbox"]:checked+label {
    display: inline-block;
    width: 18px;
    height: 18px;
    background: url(/images/contents/normal_check_on.png) no-repeat;
    line-height: 24px;
    vertical-align: middle;
    cursor: pointer;
    margin-top: 5px;
}
.jobChk input[type="checkbox"]{display:none;}

.layer_popup_box .pop_left, .layer_popup_box .pop_right { height: 54px; }
.button_normal { width: 39px; height: 22px; line-height: 22px; text-align: center; font-weight: bold; font-size: 1em; border-radius: 5px; box-shadow: 1px 1px 1px #ccd4eb; margin: 0 auto; border: 1px solid #b8b8b8; cursor: pointer; }
div.pop_sub .pop_left {width:28%;} /* common.css pop_left width값 오버라이딩 */
div.pop_sub .pop_right {width:72%;} /* common.css pop_left width값 오버라이딩 */
.input_txt {padding-left: 5px;}

.popup.jen1005-popup .job-parameter-div{
    width: 100%;
    max-height: 248px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 0.185rem;
}
.popup.jen1005-popup .pop_menu_row:first-child,.popup.jen1005-popup .pop_menu_row:nth-child(2){border-top: 1px solid #ddd;}
.popup.jen1005-popup .pop_menu_row:nth-child(2n){border-left: 1px solid #ddd;}
.popup.jen1005-popup .pop_menu_row .pop_menu_col1{width: 35% !important;padding: 5px 6px;}
.popup.jen1005-popup .pop_menu_row .pop_menu_col1>label{text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
.popup.jen1005-popup .pop_menu_row .pop_menu_col2{width: 65% !important;}
.popup.jen1005-popup .param-no-data{display: inline-block;height: 140px;line-height: 140px;font-size: 14px;text-align: center;font-weight: bold;}
.popup.jen1005-popup .job-parameter-div .input_note {
    height: 90px;
}
</style>
<script type="text/javascript">
	var jen1005ParamList = [];
	
	$(document).ready(function() {

		var jenId = 	'<c:out value="${param.jenId}" />';
		var jenUrl = 	'<c:out value="${param.jenUrl}" />';
		var jobUrl = 	'<c:out value="${param.jobUrl}" />';
		var jobId = 	'<c:out value="${param.jobId}" />';
		var jenUsrId = 	'<c:out value="${param.jenUsrId}" />';
		var jenUsrTok = '<c:out value="${param.jenUsrTok}" />';
		var jobTok = 	'<c:out value="${param.jobTok}" />';
		var jobTypeCd = 	'<c:out value="${param.jobTypeCd}" />';
		var ticketLastRv = 	'<c:out value="${param.ticketLastRv}" />';
		
		//jenId 있는지 체크
		if(!ADD_JOB_PARAM_LIST.hasOwnProperty(jenId)){
			ADD_JOB_PARAM_LIST[jenId] = {};
		}
		jen1005ParamList = ADD_JOB_PARAM_LIST[jenId][jobId];
		
		
		var jobParamMap = {
				"jenUrl" : jenUrl,
				"jobUrl" : jobUrl,
				"jobId" : jobId,
				"jenUsrId" : jenUsrId,
				"jenUsrTok" : jenUsrTok,
				"jobTok" : jobTok
		}
		
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JobParameter.do'/>","loadingShow":true}
				, jobParamMap );
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			if(data.MSG_CD=="JENKINS_OK"){
				//jobParamList 세팅
				var jobParamList = data.list;
				if(!gfnIsNull(jobParamList)){
					// html
					var paramHtml = "";
					
					//popup height
					var popupHeight = 0;
					
					//항목 개수
					var paramDivCnt = 0;
					
					//운영빌드 리비전 값 있는지 체크
					var isRvParamCheck = false;
					
					//이전 데이터가 있으면 값 채우기
					$.each(jobParamList,function(idx, map){
						var paramDivNum = 1;
						
						if(!gfnIsNull(jen1005ParamList)){
							$.each(jen1005ParamList,function(idx, map2){
								if(map.jobParamKey == map2.jobParamKey){
									//운영빌드일때 최종 리비전 값
									if(jobTypeCd == "04" && map.jobParamKey == '<c:out value="${requestScope.jobParamRevision}"/>' && !gfnIsNull(map2.jobParamVal)){
										isRvParamCheck = true;
									}
									map["jobParamVal"] = map2.jobParamVal;
									return false;
								}
							});
						}
						
						//추가되는 height
						var addHeight = 0;
						if(idx == 0){
							addHeight = 48;
						}
						
						//height 추가
						if((idx%2) == 0){
							addHeight = 48;
						}
						
						var paramValue = map.jobParamVal;
						if(gfnIsNull(paramValue)){
							paramValue = "";
						}


						var defaultVal = "";
						if(map.hasOwnProperty('defaultVal')){
							defaultVal = map.defaultVal;
						}
						
						if(map.jobParamType == "choice"){
							// 셀렉트박스
							var choiceList = map.choiceList;
							paramHtml += 	 '<div class="pop_menu_row">'
											+'	<div class="pop_menu_col1" title="'+map.jobParamKey+'"><label for="'+map.jobParamKey+'">'+map.jobParamKey+'</label></div>'
											+'	<div class="pop_menu_col2 pop_oneRow_col2">'
											+'		<span class="search_select">'
											+'			<select class="select_useCd" name="'+map.jobParamKey+'" id="'+map.jobParamKey+'" title="'+map.jobParamKey+'" style="height:100%; width:100%;">'
							$.each(choiceList,function(idx, obj){
								if(paramValue == obj){
									paramHtml += '<option value="'+obj+'" selected>'+obj+'</option>'
								}else{
									paramHtml += '<option value="'+obj+'">'+obj+'</option>'
								}
							});
											
							paramHtml +=' 			</select>'
										+'		</span>'
										+'	</div>'
										+'</div>';
						}else if(map.jobParamType == "boolean"){
							var chkHtml ="";
							if(paramValue == "true"){
								chkHtml = "checked";
							}else if(paramValue == "" && defaultVal == "true"){
								chkHtml = "checked";
							}
							
							//체크박스
							paramHtml += 	 '<div class="pop_menu_row">'
											+'	<div class="pop_menu_col1" title="'+map.jobParamKey+'" ><label for="'+map.jobParamKey+'">'+map.jobParamKey+'</label></div>'
											+'	<div class="pop_menu_col2 pop_oneRow_col2 jobChk">'
											+'		<input type="checkbox" title="'+map.jobParamKey+'" class="input_txt" name="'+map.jobParamKey+'" id="'+map.jobParamKey+'" '+chkHtml+' value="true"/>'
											+'		<label for="'+map.jobParamKey+'"></label>'
											+'	</div>'
											+'</div>';
						}
						else if(map.jobParamType == "text"){
							paramDivNum = 2;
							
							//text 추가하는데 홀수인경우 빈영역 추가
							if(paramDivCnt > 0 && (paramDivCnt % 2) != 0){
								paramHtml += 	 '<div class="pop_menu_row">'
												+'	<div class="pop_menu_col1"></div>'
												+'	<div class="pop_menu_col2 pop_oneRow_col2"></div>'
												+'</div>';
								paramDivNum = 3;
							}
							addHeight = 120;
							
							//문자열
							paramHtml += 	 '<div class="pop_note">'
											+'	<div class="note_title" title="'+map.jobParamKey+'"><label for="'+map.jobParamKey+'">'+map.jobParamKey+'</label></div>'
											+'	<textarea class="input_note" title="'+map.jobParamKey+'" name="'+map.jobParamKey+'" id="'+map.jobParamKey+'" rows="3" value="" maxlength="2000" placeholder="'+defaultVal+'">'+paramValue+'</textarea>'
											+'</div>';
						
						}else{
							var readonlyStr = "";
							//job이 운영 빌드일 때
							if(!gfnIsNull(jobTypeCd) && jobTypeCd == "04"){
								//key값이 ticket_id,input skip
								if(map.jobParamKey == '<c:out value="${requestScope.jobParamTicketId}"/>'){
									return true;
									//readonlyStr = "readonly=\"readonly\"";
								}
								
								//key값이 recent_rv이고 리비전 값이 없는 경우
								if(!isRvParamCheck && map.jobParamKey == '<c:out value="${requestScope.jobParamRevision}"/>'){
									paramValue = ticketLastRv;
								}
							}
							//job이 운영 배포,원복일때
							else if(!gfnIsNull(jobTypeCd) && (jobTypeCd == "05" || jobTypeCd == "06" || jobTypeCd == "07" || jobTypeCd == "08")){
								//key값이 e-Egene 배포계획 ID skip
								if(map.jobParamKey == '<c:out value="${requestScope.jobParamDplId}"/>'){
									return true;
								}
							}
							//문자열
							paramHtml += 	 '<div class="pop_menu_row">'
											+'	<div class="pop_menu_col1" title="'+map.jobParamKey+'"><label for="'+map.jobParamKey+'">'+map.jobParamKey+'</label></div>'
											+'	<div class="pop_menu_col2 pop_oneRow_col2">'
											+'		<input type="text" title="'+map.jobParamKey+'" class="input_txt" name="'+map.jobParamKey+'" id="'+map.jobParamKey+'" placeholder="'+defaultVal+'" value="'+paramValue+'" maxlength="500" '+readonlyStr+'/>'
											+'	</div>'
											+'</div>';
						}
						
						//팝업 크기 추가
						popupHeight += addHeight;
						//항목 개수 추가
						paramDivCnt += paramDivNum;
					});
					
					//팝업사이즈 조절
					var listLength = jobParamList.length;
					var targetHeight;
					

					$('.layer_popup_box[layerurl="/jen/jen1000/jen1000/selectJen1005View.do"]').height(popupHeight + 206);
					
					if(popupHeight > 780){
						$('.layer_popup_box[layerurl="/jen/jen1000/jen1000/selectJen1005View.do"]').height(780);
					}
					
					if( (paramDivCnt % 2) != 0){
						paramHtml += 	 '<div class="pop_menu_row">'
										+'	<div class="pop_menu_col1"></div>'
										+'	<div class="pop_menu_col2 pop_oneRow_col2"></div>'
										+'</div>';
					}
					
					$("#jobParameterDiv").html(paramHtml);
					jen1005ParamList = jobParamList;
					ADD_JOB_PARAM_LIST[jenId][jobId] = jobParamList;
					
				}else{
					//파라미터가 없는 경우 html
					var paramHtml = "<span class='param-no-data'>빌드 파라미터가 없습니다.</span>";
					$("#btnPopJen1005Select").hide();
					$("#jobParameterDiv").html(paramHtml);
				}
				
				return true;
			}else if(data.MSG_CD=="JENKINS_FAIL"){
				jAlert("설정 정보가 잘못 입력 되었거나, JENKINS 서버에 문제가 있습니다.<br/><br/>입력한 URL, USER, USER TOKEN KEY 를 확인 하시거나, JENKINS 서버를 확인 해주시기 바랍니다.", "알림창");			
			}else if(data.MSG_CD=="JENKINS_WORNING_URL"){
				jAlert("허용되지 않는 URL입니다.<br/><br/>입력한 URL를 확인하십시오", "알림창");
			}else{
				jAlert("[jenkins 접속 오류]</br>오류 내용 : "+data.MSG_CD);
			}

		});
		
		//AJAX 전송
		ajaxObj.send();
		
		
		//선택 버튼 클릭
		$('#btnPopJen1005Select').click(function() {
			//오류 여부
			var isError = false;
			
			if(!gfnIsNull(jen1005ParamList)){
				$.each(jen1005ParamList,function(idx, map){
					if(map.jobParamType == "boolean"){
						if($("[id='"+map.jobParamKey+"']").prop("checked")){
							map["jobParamVal"] = "true";
						}else{
							map["jobParamVal"] = "false";
						}
					}else{
						var paramValue = $("#"+map.jobParamKey).val();
						//운영빌드일때 최종 리비전 값 검증
						if(jobTypeCd == "04" && map.jobParamKey == '<c:out value="${requestScope.jobParamRevision}"/>'){
							//정규식 숫자 or 'HEAD'
							var regex = new RegExp(/^[0-9]+$|^\bHEAD\b/);
							
							//값 체크
							if(!regex.test(paramValue)){
								jAlert("리비전 값은 숫자 또는 'HEAD'만 입력 가능합니다.");
								isError = true;
								return false;
							}
							
						}
						map["jobParamVal"] = paramValue;
					}
				});
				ADD_JOB_PARAM_LIST[jenId][jobId] = jen1005ParamList;
			}
			if(!isError){
				//팝업 창 닫기
				gfnLayerPopupClose();
			}
		});
		
		/* 취소 */
		$('#btnPopJen1005Cancle').click(function() {
			gfnLayerPopupClose();
		});
	});
	
</script>

<div class="popup jen1005-popup">
	<div class="pop_title">JOB 파라미터 등록</div>
	<div class="pop_sub">
		<div class="tab_contents">
			<div class="job-parameter-div" id="jobParameterDiv">
			</div>
		</div>
		<div class="btn_div">
			<div class="button_normal save_btn" id="btnPopJen1005Select" >저장</div>
			<div class="button_normal exit_btn" id="btnPopJen1005Cancle" >취소</div>
		</div>
	</div>
	</div>
	</form>
</div>
</html>