<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>

<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<style type="text/css">
	.accptFont{color:#4b73eb !important;text-shadow: none !important;}
	.rejectFont{color:#eb4b6a !important;text-shadow: none !important;}
	.defaultFont{color:#000 !important;}
	.tab_contents.menu{width:1500px;}
</style>
<script>
var repGridObj;
var repSearchObj;

$(function(){	
	
	fnRepGridSetting();
	fnSearchBoxControl();
	
	
	gfnGuideStack("add",fnRep1000GuideShow);
	
	
	$("#repDataSendBtn").click(function(){
		
		
		if(opener){
			var rtnValue = [];	
			
			
			var selRepList = repGridObj.getList('selected');
			
			if (gfnIsNull(selRepList)) {
				jAlert("선택한 저장소가 없습니다.", "알림창");
				return false;
			}
			jConfirm("선택된 저장소 "+selRepList.length+"개를 연결하시겠습니까?","알림창", function(result){
				
				$.each(selRepList, function(idx, map){
					var repInfo = {
						"rep_id": map.repId
						, "svn_name": map.repNm
						, "svn_descr": map.repTxt
						
						, "svn_url": map.svnRepUrl
					};
					
					 
					
					rtnValue.push(repInfo);
				});
				
				
				if(typeof opener.parent.setSvnItems == "function"){
					opener.parent.setSvnItems(rtnValue);
				}
				window.close();
			});
			
		}else{
			jAlert("비정상적인 페이지 호출입니다.</br>데이터를 전달하려는 대상이 없습니다.");
		}
	});
	
	
	$("#repCloseBtn").click(function(){
		window.close();
	});
});


function fnRepGridSetting(){
	repGridObj = new ax5.ui.grid();
 
	repGridObj.setConfig({
		target: $('[data-ax5grid="repGridTarget"]'),
		sortable:false,
		showRowSelector: true,
		header: {align:"center",columnHeight: 30},
		columns: [
			{key: "result", label: "접속확인 결과", width: 120, align: "center"
				,formatter:function(){
					var result = this.item.result;
					var faIcon = '';
					
					
					if(result == "fail" || result == "exception"){
						faIcon = "times-circle";
					}
					else if(result == "success"){
						faIcon = "check-circle";
					}else if(result == "authException"){
						faIcon = "exclamation-circle";
					}else if(result == "progress"){
						faIcon = "circle-notch fa-spin";
					}else{
						faIcon = "circle";
					}
					
					return '<i class="fas fa-'+faIcon+' result-'+result+'"></i>';
				}
			},
			{key: "resultMsg", label: "접속확인 내용", width: 110, align: "center"},
			{key: "repTypeNm", label: "저장소", width: 80, align: "center"},
			{key: "gitUsrAuthTypeCd", label: "인증 방식", width: 80, align: "center",
				formatter:function(){
					var rtnValue = "ID/PW";
					
					if(this.item.repType == "02"){
						return rtnValue;
					}
					
					var gitUsrAuthTypeCd = this.item.gitUsrAuthTypeCd;
					
					
					if(gitUsrAuthTypeCd == "01"){
						rtnValue = "TOKEN";
					}
					
					return rtnValue;
					
				}},
			{key: "repNm", label: "저장소 명", width: 250, align: "center"},
			{key: "repTxt", label: "저장소 설명", width: 350, align: "center"},
			{key: "repUrl", label: "저장소 URL", width: 466, align: "center",
				formatter:function(){
					var repUrl = "";
					
					if(this.item.repTypeCd == "01"){
						repUrl = this.item.gitRepUrl;
					}
					
					else if(this.item.repTypeCd == "02"){
						repUrl = this.item.svnRepUrl;
					}
					
					else if(this.item.repTypeCd == "03"){
						repUrl = this.item.gitRepUrl;
					}
					return repUrl;
				}
			},
			{key: "useNm", label: "사용여부", width: 80, align: "center"} ,
         ],
         body: {
             align: "center",
             columnHeight: 30,
             onClick: function () {
            	
        		
   				repGridObj.select(this.doindex, {selected: !this.item.__selected__});	
             },
             onDBLClick:function(){
             	
             	var paramData = '<c:out value="${rtnData}"/>'
 				window.open("/rep/rep1000/rep1000/selectRep1002View.do?data="+encodeURIComponent(paramData)+"&repId="+repGridObj.list[this.doindex].repId, "repositoryDetailPopup", "width=1320, height=850, status=no, menubar=no");
             }
         },
         contextMenu: {
             iconWidth: 20,
             acceleratorWidth: 100,
             itemClickAndClose: false,
             icons: {
                 'arrow': '<i class="fa fa-caret-right"></i>'
             },
             items: [
                 {type: "repConnCheck", label: "접속 확인", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                 {type: "repUpdate", label: "수정", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                 {type: "repDelete", label: "삭제", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
             ],
             popupFilter: function (item, param) {
             	var selItem = repGridObj.list[param.doindex];
             	
             	if(typeof selItem == "undefined"){
             		return false;
             	}
             	return true;
             },
             onClick: function (item, param) {
             	var selItem = repGridObj.list[param.doindex];

             	
				if(item.type == "repConnCheck"){
					
					var idxList = [];
					
					
					idxList.push(selItem.__original_index);
					
					fnSelectRep1000ConfirmConnect(idxList);
					
             	}
             	
             	else if(item.type == "repUpdate"){
             		var data = {"popupGb": "update", "repId": selItem.repId};
					gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1001RepositoryDetailView.do',data,"1040","590",'scroll');
             	}
             	
             	else if(item.type == "repDelete"){
             		jConfirm("저장소를 삭제 하시겠습니까?</br>배정된 구성항목이 있는 경우 삭제 대상에서 제외됩니다.","알림", function(result){
						if(result){
							var repIdListStr = "&repId="+selItem.repId;
							
							fnDeleteRep1000Info(repIdListStr);
						}
					});
             	}
             	
				
				repGridObj.contextMenu.close();
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
				fnInGridListSet(this.page.selectPage,repSearchObj.getParam());
             }
         } 
		});
	
	fnInGridListSet();

}


function fnInGridListSet(_pageNo,ajaxParam){
	
   	
   	if(gfnIsNull(ajaxParam)){
 			ajaxParam = $('form#searchFrm').serialize();
 		}
   	
   	
   	if(!gfnIsNull(_pageNo)){
   		ajaxParam += "&pageNo="+_pageNo;
   	}else if(typeof repGridObj.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+repGridObj.page.currentPage;
   	}
    	
   	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000RepositoryListAjaxView.do'/>","loadingShow":true}
			,ajaxParam);
	
	ajaxObj.setFnSuccess(function(data){
		
		var list = data.list;
		var page = data.page;
		
	   	repGridObj.setData({
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

function fnDeleteRep1000Info(repIds){
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/deleteRep1000InfoAjax.do'/>"}
			,repIds);
	
	ajaxObj.setFnSuccess(function(data){
		
		jAlert(data.message, "알림창");
		
		
		if(errorYn == "N"){
			axdom("#" + repSearchObj.getItemId("btn_search_rep")).click();
		}
	});
	
	
	ajaxObj.send();
} 

function fnSearchBoxControl(){
	var pageID = "AXSearch";
	repSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			
			repSearchObj.setConfig({
				targetID:"AXSearchTarget",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"50", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
							options:[

                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
                                {optionValue:'repNm', optionText:'저장소 명'},
                                {optionValue:'repTxt', optionText:'저장소 설명'},
                                {optionValue:'useCd', optionText:'사용 여부' , optionCommonCode:"CMM00001" }                                
                                
                            ],onChange: function(selectedObject, value){
                            	
    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
									axdom("#" + repSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + repSearchObj.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + repSearchObj.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(repSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									
									axdom("#" + repSearchObj.getItemId("searchTxt")).show();
									axdom("#" + repSearchObj.getItemId("searchCd")).hide();
								}
    						},

						},
						{label:"", labelWidth:"", type:"inputText", width:"225", key:"searchTxt", addClass:"secondItem sendBtn", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + repSearchObj.getItemId("btn_search_rep")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
							onclick:function(){
								$(repGridObj.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
						}},
						
						{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
							onclick:function(){
								repGridObj.exportExcel("저장소 목록.xls");
						}},
						
						{label : "",labelWidth : "",type : "button",width : "55",key : "btn_delete_svn",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-trash-alt' aria-hidden='true'></i>&nbsp;<span>삭제</span>",
							onclick : function() {
								var chkList = repGridObj.getList('selected');
								
								if (gfnIsNull(chkList)) {
									jAlert("선택한 저장소가 없습니다.", "알림창");
									return false;
								}
								
								jConfirm("저장소 "+chkList.length+"개를 삭제 하시겠습니까?</br>배정된 구성항목이 있는 경우 삭제 대상에서 제외됩니다.","알림", function(result){
									if(result){
										var repIdListStr = "";
										$.each(chkList, function(idx, map){
											repIdListStr += "&repId="+map.repId;
										});
										
										fnDeleteRep1000Info(repIdListStr);
									}
								});
							}
						},
						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_update_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-edit' aria-hidden='true'></i>&nbsp;<span>수정</span>",
							onclick:function(){
								var chkList = repGridObj.getList('selected');
								
								if (gfnIsNull(chkList)) {
									jAlert("선택한 저장소가 없습니다.", "알림창");
									return false;
								}
								if(chkList.length > 1){
									jAlert("1개의 저장소만 선택해주세요.", "알림창");
									return false;
								}
								
								var data = {"popupGb": "update", "repId": chkList[0].repId};
        	                	
								gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1001RepositoryDetailView.do',data,"1040","590",'scroll');
						}},
						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_insert_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-save' aria-hidden='true'></i>&nbsp;<span>등록</span>",
							onclick:function(){
								var data = {
									"popupGb": "insert"
								};
								gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1001RepositoryDetailView.do',data,"1040","590",'scroll');
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_rep",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								
	 							var pars = repSearchObj.getParam();
							    var ajaxParam = $('form#searchFrm').serialize();

							    if(!gfnIsNull(pars)){
							    	ajaxParam += "&"+pars;
							    }
								
					            fnInGridListSet(0,ajaxParam);
					            
					            
								$('#searchSelect').val(axdom("#" + repSearchObj.getItemId("searchSelect")).val());
								$('#searchCd').val(axdom("#" + repSearchObj.getItemId("searchCd")).val());
								$('#searchTxt').val(axdom("#" + repSearchObj.getItemId("searchTxt")).val());
						}},
						{label:"", labelWidth:"", type:"button", width:"100",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<i class='fas fa-angle-double-right' aria-hidden='true'></i>&nbsp;<span>전체 접속확인</span>",
   							onclick:function(){
   								
   								var gridLen = repGridObj.getList().length;
   								
   								
   								if(gridLen > 0){
   									
									var repGridListData = repGridObj.getList()[0];
									var repId = repGridListData.repId;
   									
   									fnSelectRep1000AllConfirmConnect(repId, 0);
   								}else{
   									toast.push("등록된 저장소가 존재하지 않습니다.");
   								}
                		}},
						{label:"", labelWidth:"", type:"button", width:"100",style:"float:right;", key:"btn_connect_svn",valueBoxStyle:"padding:5px;", value:"<i class='fas fa-angle-double-right' aria-hidden='true'></i>&nbsp;<span>선택 접속확인</span>",
							onclick:function(){
								var chkList = repGridObj.getList('selected');
								if (gfnIsNull(chkList)) {
									jAlert("선택한 저장소가 없습니다.", "알림창");
									return false;
								}
								
								
								var idxList = [];
								
								
								$.each(chkList, function(idx, map){
									idxList.push(map.__original_index);
								});
								
								fnSelectRep1000ConfirmConnect(idxList);
						}}
					]}
				]
			});
		}
		
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		
		axdom("#" + repSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		
		axdom("#" + repSearchObj.getItemId("searchCd")).hide();
	});
}


function fnSelectRep1000ConfirmConnect(indexList){
	if(gfnIsNull(indexList) || indexList.length == 0){
		return false;
	}
	
	
	var targetIdx = indexList[0];
	
	
	indexList.splice(0, 1);
	
	
	var repGridListData = repGridObj.getList()[targetIdx];
	
	
	repGridObj.setValue(targetIdx, "result", "progress");
	repGridObj.setValue(targetIdx, "resultMsg", "확인중");
	
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000ConfirmConnect.do'/>","loadingShow":false}
			,{ "repId" : repGridListData.repId , "gitRepUrlCheckCd": "Y"});
	
	
	ajaxObj.setFnSuccess(function(data){
		
		if(data.MSG_CD =="REP_OK"){
			repGridObj.setValue(targetIdx, "result", "success");
			repGridObj.setValue(targetIdx, "resultMsg", "접속성공");
			
		}else if(data.MSG_CD =="SVN_EXCEPTION"){
			repGridObj.setValue(targetIdx, "result", "exception");
			repGridObj.setValue(targetIdx, "resultMsg", "SVN 접속오류");
		}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){
			repGridObj.setValue(targetIdx, "result", "authException");
			repGridObj.setValue(targetIdx, "resultMsg", "사용자 권한없음");
		}else{
			repGridObj.setValue(targetIdx, "result", "fail");
			repGridObj.setValue(targetIdx, "resultMsg", "기타 오류");
		}
		if(data.saveYN == "N"){
			jAlert(data.message,"경고");
		}
		
		fnSelectRep1000ConfirmConnect(indexList);
	});
	
	
	ajaxObj.send();
} 



function fnSelectRep1000AllConfirmConnect(repId, index){
	
	
	if(index == -1){
		return false;
	}
	
	repGridObj.setValue(index, "result", "progress");
	
	
	var repGridListData = repGridObj.getList()[index];
	
	
	var repConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000ConfirmConnect.do'/>","loadingShow":false}
			,{ "repId" : repId });
	
	repConnAjaxObj.setFnSuccess(function(data){
		
		
		
		if(data.MSG_CD =="REP_OK"){	
			repGridObj.setValue(index, "result", "success");
			repGridObj.setValue(index, "resultMsg", "접속성공");
		}else if(data.MSG_CD =="SVN_EXCEPTION"){ 
			repGridObj.setValue(index, "result", "exception");
			repGridObj.setValue(index, "resultMsg", "SVN 접속오류");
		}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){ 
			repGridObj.setValue(index, "result", "authException");
			repGridObj.setValue(index, "resultMsg", "사용자 권한없음");
		}else{ 
			repGridObj.setValue(index, "result", "fail");
			repGridObj.setValue(index, "resultMsg", "기타 오류");
		} 	
		
		
		if((++index) >= repGridObj.getList().length){
			return false;
		}
		
		
		var repGridListData = repGridObj.getList()[index];
		var repId = repGridListData.repId;
		
		
		fnSelectRep1000AllConfirmConnect(repId, index);
		
	});
	
	
	repConnAjaxObj.setFnError(function(xhr, status, err){
		
		jAlert(data.message, "알림창");
	});
	
	
	repConnAjaxObj.send();
}

function fnRep1000GuideShow(){
	var mainObj = $(".main_contents");
	
	
	if(mainObj.length == 0){
		return false;
	}
	
	var guideBoxInfo = globals_guideContents["rep1000"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}
</script>


<div class="main_contents" style="height: auto;" >
	<form:form commandName="rep1000VO" id="searchFrm" name="searchFrm" method="post" onsubmit="return false;">
	</form:form>
	<div class="tab_contents menu">
		<div class="sub_title">
			소스저장소 관리
		</div>
		<div id="AXSearchTarget" guide="rep1000button" ></div>
		<div data-ax5grid="repGridTarget" data-ax5grid-config="{}" style="height: 600px;"></div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="repDataSendBtn"><i class="fas fa-paperclip"></i>&nbsp;소스저장소 연결</div>
			<div class="mainPopupBtn" id="repCloseBtn"><i class="fas fa-times-circle"></i>&nbsp;닫기</div>
		</div>
			
	</div>
</div>
		
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />