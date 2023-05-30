<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="ko">
<title>OpenSoftLab</title>
<link rel='stylesheet' href='<c:url value='/css/lunaops/dpl.css'/>' type='text/css'>
<style type="text/css">
.layer_popup_box .pop_sub {width: 100%;padding: 20px 20px;text-align: center;display: inline-block;position:relative;font-size: 12px;}
	
/*익스플로러 적용 위해 !important 추가*/
/* 팝업에 따라 pop_menu_col1, pop_menu_col2 높이 변경 */
.pop_menu_row .pop_menu_col1 { width: 26% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 74% !important; height: 45px !important; }
.layer_popup_box input[readonly],.layer_popup_box input:read-only {background-color:#fff;}
.pop_menu_row .pop_menu_col1 { width: 23% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 77% !important; height: 45px !important; }
.pop_menu_row .menu_col1_subStyle { width: 46% !important; }
.pop_menu_row .menu_col2_subStyle { width: 54% !important; }
.pop_sub input[type="password"] {width:100% !important; height:100% !important;}
.pop_dpl_div_sub.divDetail_sub_left{width: 530px;float: left;margin-right: 10px;height: 450px;}
.pop_dpl_div_sub.divDetail_sub_right {width: 595px;float: left;height: 450px;}
.stm3003_middle_row {height: 41px;display: inline-block;float: left;border-bottom: 1px solid #ccc;}
.stm3003_middle_row:first-child {border-top: 1px solid #ccc;}
.stm3003_middle_cell {display: inline-block;float: left;height: 100%;border-right: 1px solid #ccc;padding: 5px 2px;text-overflow: ellipsis;overflow: hidden;line-height: 30px;}
.stm3003_middle_job_header {display: inline-block;height: 40px;width: 100%;border: 1px solid #ccc;border-bottom: none;background-color: #f9f9f9;float: left;}
.stm3003_middle_cell:nth-child(1) {width: 80px;}
.stm3003_middle_cell:nth-child(2) {width: 200px;}
.stm3003_middle_cell:nth-child(3) {width: 284px;border-right:none;}
.stm3003_bottom_bld_content {display: inline-block;width: 100%;border: 1px solid #ccc;line-height: 25px;height: 365px;overflow-y: scroll;overflow-x: hidden;padding: 2px 0;}
.stm3003_middle_row.jobActive {background-color: #414352;color: #fff;}
.jenStatus-blue{color:#4b73eb;text-shadow: 0 0 1px #4b73eb;}
.jenStatus-red{color:#ff5643;text-shadow: 0 0 1px #ff5643;}
.jenStatus-yellow, .jenStatus-aborted{color:#fba450;text-shadow: 0 0 1px #ff9e41;}
.jenStatus-gray, .jenStatus-disabled, .jenStatus-nobuilt{color: gray;text-shadow: 0 0 1px #6c6c6c;}
</style>
<script type="text/javascript">

	$(document).ready(function() {
		var errorYn = "${errorYn}";
		
		//JENKINS 연결 오류
		if(!gfnIsNull(errorYn)){
			jAlert("JENKINS 정보를 불러오는 중 문제가 발생했습니다.</br>${message}");
			gfnLayerPopupClose();
		}
		
		/* 취소 */
		$('#btnPopStm3003Cancle').click(function() {
			gfnLayerPopupClose();
		});
	});
</script>

<div class="popup">
		
	<div class="pop_title">[ ${param.jenNm} ] 상세 팝업</div>
	<div class="pop_sub">
		<div class="pop_dpl_div_sub divDetail_sub_left">
			<div class="sub_title">
					JENKINS 정보
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenNm">JENKINS NAME</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS NAME" class="input_txt" name="jenNm" id="jenNm" value="${param.jenNm}" readonly="readonly"  />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenUrl">JENKINS URL</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="URL" class="input_txt" name="jenUrl" id="jenUrl" value="${param.jenUrl}" readonly="readonly"  />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenUsrId">USER ID</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="USER ID" class="input_txt" name="jenUsrId" id="jenUsrId" value="${param.jenUsrId}" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="_class">_class</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS _class" class="input_txt" name="_class" id="_class" value="${jenMap._class}" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="mode">mode</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS mode" class="input_txt" name="mode" id="mode" value="${jenMap.mode}" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="mode">description</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS description" class="input_txt" name="description" id="description" value="${jenMap.description}" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="nodeName">nodeName</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS nodeName" class="input_txt" name="nodeName" id="nodeName" value="${jenMap.nodeName}" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="nodeDescription">nodeDescription</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS nodeDescription" class="input_txt" name="nodeDescription" id="nodeDescription" value="${jenMap.nodeDescription}" readonly="readonly" />
				</div>
			</div>
		</div>
		<div class="pop_dpl_div_sub divDetail_sub_right">
			<div class="sub_title">
					JOB 정보
			</div>
			<div class="stm3003_middle_job_header">
				<div class="stm3003_middle_cell">상태</div>
				<div class="stm3003_middle_cell">JOB ID</div>
				<div class="stm3003_middle_cell">_class</div>
			</div>
			<div class="stm3003_bottom_bld_content" id="stm3003_bottom_bld_content">
				<c:if test="${not empty jobs}">
					<c:forEach items="${jobs}" var="map">
						<div class="stm3003_middle_row">
							<div class="stm3003_middle_cell"><i class="fas fa-circle fa-lg jenStatus-${map.color}"></i></div>
							<div class="stm3003_middle_cell">${map.name}</div>
							<div class="stm3003_middle_cell">${map._class }</div>
						</div>
					</c:forEach>
				</c:if>
			</div>
		</div>
		<div class="btn_div">
			<div class="button_normal exit_btn" id="btnPopStm3003Cancle" >닫기</div>
		</div>
	</div>
</div>
</html>