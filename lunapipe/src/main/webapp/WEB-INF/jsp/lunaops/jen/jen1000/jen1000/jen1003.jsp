<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="ko">
<title>OpenSoftLab</title>
<script type="text/javascript" src="/js/ztree/jquery.ztree.all.min.js"></script>
<style type="text/css">
.layer_popup_box .pop_sub {width: 100%;padding: 20px 20px;text-align: center;display: inline-block;position:relative;font-size: 12px;}
	


.pop_menu_row .pop_menu_col1 { width: 26% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 74% !important; height: 45px !important; }
.layer_popup_box input[readonly],.layer_popup_box input:read-only {background-color:#fff;}
.pop_menu_row .pop_menu_col1 { width: 23% !important; height: 45px !important; padding-left: 6px !important; }
.pop_menu_row .pop_menu_col2 { width: 77% !important; height: 45px !important; }
.pop_menu_row .menu_col1_subStyle { width: 46% !important; }
.pop_menu_row .menu_col2_subStyle { width: 54% !important; }
.pop_sub input[type="password"] {width:100% !important; height:100% !important;}
.pop_dpl_div_sub.divDetail_sub_left{width: 530px;float: left;margin-right: 10px;height: 450px;}
.pop_dpl_div_sub.divDetail_sub_right {width: 460px;float: left;height: 450px;}
.jen1003_middle_row {height: 41px;display: inline-block;float: left;border-bottom: 1px solid #ccc;}
.jen1003_middle_row:first-child {border-top: 1px solid #ccc;}
.jen1003_middle_cell {display: inline-block;float: left;height: 100%;border-right: 1px solid #ccc;padding: 5px 2px;text-overflow: ellipsis;overflow: hidden;line-height: 30px;}
.jen1003_middle_job_header {display: inline-block;height: 40px;width: 100%;border: 1px solid #ccc;border-bottom: none;background-color: #f9f9f9;float: left;margin-top: 5px;}
.jen1003_middle_cell:nth-child(1) {width: 80px;}
.jen1003_middle_cell:nth-child(2) {width: 200px;}
.jen1003_middle_cell:nth-child(3) {width: 284px;border-right:none;}
.jen1003_middle_row.jobActive {background-color: #414352;color: #fff;}
.jenStatus-blue{color:#4b73eb;text-shadow: 0 0 1px #4b73eb;}
.jenStatus-red{color:#ff5643;text-shadow: 0 0 1px #ff5643;}
.jenStatus-yellow, .jenStatus-aborted{color:#fba450;text-shadow: 0 0 1px #ff9e41;}
.jenStatus-gray, .jenStatus-disabled, .jenStatus-nobuilt{color: gray;text-shadow: 0 0 1px #6c6c6c;}
ul#jenkinsDetailJobTree {
    border: 1px solid #ccc;
    border-radius: 0.185rem;
    padding: 5px;
    float: left;
    width: calc(100% - 10px);
    margin: 5px 5px 0 5px;
    height: 352px;
    overflow-y:auto;
}
</style>
<script type="text/javascript">

	
	var zTreeJen1003;

	$(document).ready(function() {
		
		var errorYn = '<c:out value="${requestScope.errorYn}"/>';
		
		if(errorYn == "Y"){
			var errorMessage = '<c:out value="${requestScope.message}"/>';
			
			jAlert(errorMessage,"알림창");
			gfnLayerPopupClose();
			return;
		}
		
		
		selectJen1003JobTreeSetting();
		
		
		$('#btnPopJen1003Cancle').click(function() {
			gfnLayerPopupClose();
		});
	});
	
	
	function selectJen1003JobTreeSetting(){
		
		var param = {
				"jenId" : '<c:out value="${param.jenId}" />',
			   };

		
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JenkinsJobListAjax.do'/>","loadingShow":true}
				, param );
		
		ajaxObj.setFnSuccess(function(data){
			
			
			
        	gfnSetData2ParentObj(data.jenMap, "jen1003PopupFrm");

			
			var jenIdValue = '<c:out value="${param.jenId}" />';
			var jenUsrTok = '<c:out value="${param.jenUsrTok}" />';
			var jenUsrId = '<c:out value="${param.jenUsrId}" />';
			
			
		    var setting = {
	    		
		        data: {
		        	key: {
						name: "viewName"
					},
		            simpleData: {
		                enable: true,
		                idKey: "jobId",
						pIdKey: "upperJobId",
		            }
		        },
		        
		        async: {
					enable: true, 
					contentType: "application/x-www-form-urlencoded; charset=UTF-8",
					url:"<c:url value='/jen/jen1000/jen1000/selectJen1000SubURLConnect.do'/>",
					autoParam:["jobId","url"],	
					otherParam:{"jenId": jenIdValue,"jenUsrTok" : jenUsrTok,"jenUsrId" : jenUsrId},  
					dataType: "json",
					dataFilter: fnTreeFilter	
				},
				callback: {
					onAsyncError: fnAsyncError
				},
				view : {
					fontCss: {color:"#333", "font-weight":"normal"},
					nameIsHTML : true
				}
		    };
			
			
			var list = data.list;
			
		    $.each(list, function(idx, obj){
				obj.viewName = obj.name;
				
				if(obj["_class"] == "com.cloudbees.hudson.plugins.folder.Folder"){
					obj.isParent = true;
				}else{
					obj.isParent = false;
				}
			});
		    
		    
		    zTreeJen1003 = $.fn.zTree.init($("#jenkinsDetailJobTree"), setting, list);
		    
		    
		    
		    zTreeJen1003.expandAll(false);
		});

		
		ajaxObj.send();
	}
	
	
	function fnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown){
		
	   	toast.push("하위 조직 조회에 실패하였습니다.");
	}
	
	
	function fnTreeFilter(treeId, parentNode, result) {
	 	
		
	 	var childNodes = result.list;
		
		
		
		$.each(childNodes, function(idx, node){
			node.viewName = node.name;
			
			
			if( node["_class"] == "com.cloudbees.hudson.plugins.folder.Folder"){
				node.isParent = true;
			}
			
			zTreeJen1003.updateNode(node);
			
		});
		
		
		return childNodes;
	}
</script>

<div class="popup">
		
	<div class="pop_title">[ <c:out value="${param.jenNm}" /> ] 상세 팝업</div>
	<div class="pop_sub">
		<div class="pop_dpl_div_sub divDetail_sub_left">
			<form id="jen1003PopupFrm" name="jen1003PopupFrm" method="post">
			<div class="sub_title">
					JENKINS 정보
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenNm">JENKINS NAME</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS NAME" class="input_txt" name="jenNm" id="jenNm" value='<c:out value="${param.jenNm}" />' readonly="readonly"  />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenUrl">JENKINS URL</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="URL" class="input_txt" name="jenUrl" id="jenUrl" value='<c:out value="${param.jenUrl}" />' readonly="readonly"  />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="jenUsrId">USER ID</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="USER ID" class="input_txt" name="jenUsrId" id="jenUsrId" value='<c:out value="${param.jenUsrId}" />' readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="_class">_class</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS _class" class="input_txt" name="_class" id="_class" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="mode">mode</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS mode" class="input_txt" name="mode" id="mode" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="mode">description</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS description" class="input_txt" name="description" id="description" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="nodeName">nodeName</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS nodeName" class="input_txt" name="nodeName" id="nodeName" readonly="readonly" />
				</div>
			</div>
			<div class="pop_menu_row pop_menu_oneRow">
				<div class="pop_menu_col1 pop_oneRow_col1"><label for="nodeDescription">nodeDescription</label></div>
				<div class="pop_menu_col2 pop_oneRow_col2">
					<input type="text" title="JENKINS nodeDescription" class="input_txt" name="nodeDescription" id="nodeDescription" readonly="readonly" />
				</div>
			</div>
			</form>
		</div>
		<div class="pop_dpl_div_sub divDetail_sub_right">
			<div class="sub_title">
					JOB 정보
			</div>
			<ul id="jenkinsDetailJobTree" class="ztree"></ul>
		</div>
		<div class="btn_div">
			<div class="button_normal exit_btn" id="btnPopJen1003Cancle" >닫기</div>
		</div>
	</div>
</div>
</html>