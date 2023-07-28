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
div.pop_sub .pop_left {width:28%;} 
div.pop_sub .pop_right {width:72%;} 
.input_txt {padding-left: 5px;}

.popup.dpl1001-popup .job-parameter-div{
    width: 100%;
    max-height: 248px;
    overflow-y: auto;
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 0.185rem;
}
.popup.dpl1001-popup .pop_menu_row:first-child,.popup.dpl1001-popup .pop_menu_row:nth-child(2){border-top: 1px solid #ddd;}
.popup.dpl1001-popup .pop_menu_row:nth-child(2n){border-left: 1px solid #ddd;}
.popup.dpl1001-popup .pop_menu_row .pop_menu_col1{width: 35% !important;padding: 5px 6px;}
.popup.dpl1001-popup .pop_menu_row .pop_menu_col1>label{text-overflow: ellipsis;overflow: hidden;white-space: nowrap;}
.popup.dpl1001-popup .pop_menu_row .pop_menu_col2{width: 65% !important;}
.popup.dpl1001-popup .param-no-data{display: inline-block;height: 140px;line-height: 140px;font-size: 14px;text-align: center;font-weight: bold;}
</style>
<script type="text/javascript">
	var dpl1001ParamList = [];
	
	$(document).ready(function() {

		var ciId = 	'<c:out value="${param.ciId}" />';
		var ticketId = 	'<c:out value="${param.ticketId}" />';
		var dplId = 	'<c:out value="${param.dplId}" />';
		var jenId = 	'<c:out value="${param.jenId}" />';
		var jobId = 	'<c:out value="${param.jobId}" />';
		
		var jobParamMap = {
				"ciId": ciId,
				"ticketId": ticketId,
				"dplId": dplId,
				"jenId" : jenId,
				"jobId" : jobId
		}
		
		
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/dpl/dpl1000/dpl1000/selectDpl1101JobParamList.do'/>","loadingShow":true}
				, jobParamMap );
		
		ajaxObj.setFnSuccess(function(data){
			if(data.errorYn == "N"){
				
				var jobParamList = data.jobParamList;
				
				if(!gfnIsNull(jobParamList)){
					
					var paramHtml = "";
					
					
					$.each(jobParamList,function(idx, map){
						
						var paramValue = map.jobParamVal;
						if(gfnIsNull(paramValue)){
							paramValue = "";
						}
						
						
						paramHtml += 	 '<div class="pop_menu_row">'
										+'	<div class="pop_menu_col1" title="'+map.jobParamKey+'"><label for="'+map.jobParamKey+'">'+map.jobParamKey+'</label></div>'
										+'	<div class="pop_menu_col2 pop_oneRow_col2">'
										+'		<input type="text" title="'+map.jobParamKey+'" class="input_txt" name="'+map.jobParamKey+'" id="'+map.jobParamKey+'" value="'+paramValue+'" readonly maxlength="500" />'
										+'	</div>'
										+'</div>';
						
					})
					
					
					var listLength = jobParamList.length;
					var targetHeight;

					if(listLength%2==1){
						$('.layer_popup_box[layerurl="/dpl/dpl1000/dpl1000/selectDpl1001View.do"]').height(46*((listLength+1)/2) + 158);
					}else{
						$('.layer_popup_box[layerurl="/dpl/dpl1000/dpl1000/selectDpl1001View.do"]').height(46*(listLength/2) + 158);
					}
					
					if(listLength>10){
						$('.layer_popup_box[layerurl="/dpl/dpl1000/dpl1000/selectDpl1001View.do"]').height(385);
					}
					
					if( (jobParamList.length % 2) != 0){
						paramHtml += 	 '<div class="pop_menu_row">'
										+'	<div class="pop_menu_col1"></div>'
										+'	<div class="pop_menu_col2 pop_oneRow_col2"></div>'
										+'</div>';
					}
				}else{
					
					var paramHtml = "<span class='param-no-data'>빌드 파라미터가 없습니다.</span>";
				}
				
				$("#jobParameterDiv").html(paramHtml);
				
				return true;
			}else{
				jAlert("빌드 파라미터 조회 중 오류가 발생했습니다.","알림창");
			}

		});
		
		
		ajaxObj.send();
		
		
		$('#btnPopDpl1001Cancle').click(function() {
			gfnLayerPopupClose();
		});
	});
	
</script>

<div class="popup dpl1001-popup">
	<div class="pop_title">[<span><c:out value="${param.jobId}" /></span>]JOB 빌드 파라미터 값</div>
	<div class="pop_sub">
		<div class="tab_contents">
			<div class="job-parameter-div" id="jobParameterDiv">
			</div>
		</div>
		<div class="btn_div">
			<div class="button_normal exit_btn" id="btnPopDpl1001Cancle" >닫기</div>
		</div>
	</div>
	</div>
	</form>
</div>
</html>