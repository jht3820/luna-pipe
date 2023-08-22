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
	//그리드 검색 호출
	fnRepGridSetting();
	fnSearchBoxControl();
	
	//가이드 상자 호출
	gfnGuideStack("add",fnRep1000GuideShow);
	
	//전송 버튼
	$("#repDataSendBtn").click(function(){
		
		var rtnValue = [];
		
		//선택한 저장소
		var selRepList = repGridObj.getList('selected');
		
		if (gfnIsNull(selRepList)) {
			jAlert("선택한 저장소가 없습니다.", "알림창");
			return false;
		}
		jConfirm("선택된 저장소 "+selRepList.length+"개를 연결하시겠습니까?","알림창", function(result){
			//필요 값
			var apiId = $("form#rep1000Form > #apiId").val();
			var srcId = $("form#rep1000Form > #ciId").val();
			var svcId = $("form#rep1000Form > #svcId").val();
			var fId = $("form#rep1000Form > #fId").val();
			var eGeneUrl = $("form#rep1000Form > #eGeneUrl").val();
			
			//저장소 param
			var urows = [];
			
			//선택 저장소 값 loop
			$.each(selRepList, function(idx, map){
				var repInfo = {
					"key": map.repId
					, "svn_name": map.repNm
					, "svn_src_id": srcId
					, "svn_mod": ""
					, "svn_url": map.svnRepUrl
					, "svn_descr": map.repTxt
					, "svn_used": (map.useCd == "01")?1:2
				};
				
				urows.push(repInfo);
			});
			
			//리시브 전달 데이터
			var returnMap = {
				"svc_id": svcId
				, "urows": urows
			};
			
			//컨트롤러 전달 데이터
			var ctrlMap = {
				"f_id": fId
				, "src_id": srcId
				, "api_id": apiId
			};
			
			//data값 receiver에 전달
			var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/api/selectSendDataReceiver'/>","loadingShow":true}
				,{
					//리시브 반환 데이터
					data: JSON.stringify(returnMap),
					//컨트롤러 전달 데이터
					ctlData: JSON.stringify(ctrlMap)
				}
			);
			
			//AJAX 전송 성공 함수
			ajaxObj.setFnSuccess(function(data){
				//결과 값
				var result = data.result;
				
				//결과 처리 성공
				if(result == "SUCCESS"){
					//컨트롤러 데이터
					var enCtlData = data.enCtlData;
					
					//eController 호출
					var egene_controller = eGeneUrl+'/plugins/jsp/lunaController.jsp?data='+encodeURIComponent(enCtlData);
					window.location.href = egene_controller;
					
				}else{
					jAlert(data.msg, "알림창");
					return false;
				}
			});
			
			//AJAX 전송
			ajaxObj.send();
		});
	});
	
	//닫기 버튼
	$("#repCloseBtn").click(function(){
		window.close();
	});
});

//axisj5 그리드
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
					
					//icon
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
					//svn
					if(this.item.repType == "02"){
						return rtnValue;
					}
					//인증 방식
					var gitUsrAuthTypeCd = this.item.gitUsrAuthTypeCd;
					
					//token
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
					//github
					if(this.item.repTypeCd == "01"){
						repUrl = this.item.gitRepUrl;
					}
					//svn
					else if(this.item.repTypeCd == "02"){
						repUrl = this.item.svnRepUrl;
					}
					//gitlab
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
            	
        		// 클릭 이벤트
   				repGridObj.select(this.doindex, {selected: !this.item.__selected__});	
             },
             onDBLClick:function(){
             	//data값
             	var paramData = '<c:out value="${rtnData}"/>'
 				window.open("/rep/rep1000/rep1000/selectRep1002View.do?data="+encodeURIComponent(paramData)+"&repId="+repGridObj.list[this.doindex].repId, "repositoryDetailPopup", "width=1320, height=870, status=no, menubar=no");
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
             	//선택 개체 없는 경우 중지
             	if(typeof selItem == "undefined"){
             		return false;
             	}
             	return true;
             },
             onClick: function (item, param) {
             	var selItem = repGridObj.list[param.doindex];

             	//접속 확인
				if(item.type == "repConnCheck"){
					//접속확인 index 목록
					var idxList = [];
					
					//선택 저장소 추가
					idxList.push(selItem.__original_index);
					
					fnSelectRep1000ConfirmConnect(idxList);
					
             	}
             	//수정
             	else if(item.type == "repUpdate"){
             		var empId = $("form#rep1000Form > #empId").val();
             		
             		var data = {"popupGb": "update", "repId": selItem.repId, "empId": empId};
					gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1001RepositoryDetailView.do',data,"1040","590",'scroll');
             	}
             	//삭제
             	else if(item.type == "repDelete"){
             		jConfirm("저장소를 삭제 하시겠습니까?</br>배정된 구성항목이 있는 경우 연결 정보가 함께 삭제됩니다.","알림", function(result){
						if(result){
							var repIdListStr = "&repId="+selItem.repId;
							
							fnDeleteRep1000Info(repIdListStr);
						}
					});
             	}
             	
				//닫기
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
	//그리드 데이터 불러오기
	fnInGridListSet();

}

//그리드 데이터 넣는 함수
function fnInGridListSet(_pageNo,ajaxParam){
	/* 그리드 데이터 가져오기 */
   	//파라미터 세팅
   	if(gfnIsNull(ajaxParam)){
 			ajaxParam = $('form#searchFrm').serialize();
 		}
   	
   	//페이지 세팅
   	if(!gfnIsNull(_pageNo)){
   		ajaxParam += "&pageNo="+_pageNo;
   	}else if(typeof repGridObj.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+repGridObj.page.currentPage;
   	}
    	
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000RepositoryListAjaxView.do'/>","loadingShow":true}
			,ajaxParam);
	//AJAX 전송 성공 함수
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
	
	//AJAX 전송
	ajaxObj.send();
}
/**
 * Repository 삭제
 */
function fnDeleteRep1000Info(repIds){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/deleteRep1000InfoAjax.do'/>"}
			,repIds);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		
		jAlert(data.message, "알림창");
		
		//삭제된 데이터 1건 이상인경우
		if(data.errorYn == "N"){
			axdom("#" + repSearchObj.getItemId("btn_search_rep")).click();
		}
	});
	
	//AJAX 전송
	ajaxObj.send();
} 
//검색 상자
function fnSearchBoxControl(){
	var pageID = "AXSearch";
	repSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			//검색도구 설정 01 ---------------------------------------------------------
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
                            	//선택 값이 전체목록인지 확인 후 입력 상자를 readonly처리
    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
									axdom("#" + repSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + repSearchObj.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + repSearchObj.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								//공통코드 처리 후 select box 세팅이 필요한 경우 사용
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(repSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									//공통코드 처리(추가 selectbox 작업이 아닌 경우 type=text를 나타낸다.)
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
								
								jConfirm("저장소 "+chkList.length+"개를 삭제 하시겠습니까?</br>배정된 구성항목이 있는 경우 연결 정보가 함께 삭제됩니다.","알림", function(result){
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
								var empId = $("form#rep1000Form > #empId").val();
								var data = {"popupGb": "update", "repId": chkList[0].repId, "empId": empId};
        	                	
								gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1001RepositoryDetailView.do',data,"1040","590",'scroll');
						}},
						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_insert_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-save' aria-hidden='true'></i>&nbsp;<span>등록</span>",
							onclick:function(){
								var empId = $("form#rep1000Form > #empId").val();
								var data = {
									"popupGb": "insert"
									, "empId": empId
								};
								
								gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1001RepositoryDetailView.do',data,"1040","590",'scroll');
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_rep",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								/* 검색 조건 설정 후 reload */
	 							var pars = repSearchObj.getParam();
							    var ajaxParam = $('form#searchFrm').serialize();

							    if(!gfnIsNull(pars)){
							    	ajaxParam += "&"+pars;
							    }
								
					            fnInGridListSet(0,ajaxParam);
					            
					            //폼 데이터 변경
								$('#searchSelect').val(axdom("#" + repSearchObj.getItemId("searchSelect")).val());
								$('#searchCd').val(axdom("#" + repSearchObj.getItemId("searchCd")).val());
								$('#searchTxt').val(axdom("#" + repSearchObj.getItemId("searchTxt")).val());
						}},
						{label:"", labelWidth:"", type:"button", width:"100",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<i class='fas fa-angle-double-right' aria-hidden='true'></i>&nbsp;<span>전체 접속확인</span>",
   							onclick:function(){
   								//그리드 목록 갯수
   								var gridLen = repGridObj.getList().length;
   								
   								//1개 이상인경우 체크
   								if(gridLen > 0){
   									//job 정보
									var repGridListData = repGridObj.getList()[0];
									var repId = repGridListData.repId;
   									//전체 svn conn 확인
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
								
								//접속확인 index 목록
								var idxList = [];
								
								//선택 저장소 loop
								$.each(chkList, function(idx, map){
									idxList.push(map.__original_index);
								});
								
								fnSelectRep1000ConfirmConnect(idxList);
						}}
					]}
				]
			});
		}
		/*,
		search1: function(){
			var pars = repSearchObj.getParam();
			fnAxGridView(pars);
		}
		*/
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
		axdom("#" + repSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		//공통코드 selectBox hide 처리
		axdom("#" + repSearchObj.getItemId("searchCd")).hide();
	});
}

/**
 * 선택 소스저장소 연결 체크
 */
function fnSelectRep1000ConfirmConnect(indexList){
	if(gfnIsNull(indexList) || indexList.length == 0){
		return false;
	}
	
	//첫번째 index 빼기
	var targetIdx = indexList[0];
	
	//index 제거
	indexList.splice(0, 1);
	
	//소스저장소 정보
	var repGridListData = repGridObj.getList()[targetIdx];
	
	//ajax동작전 progress 주입
	repGridObj.setValue(targetIdx, "result", "progress");
	repGridObj.setValue(targetIdx, "resultMsg", "확인중");
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000ConfirmConnect.do'/>","loadingShow":false}
			,{ "repId" : repGridListData.repId , "gitRepUrlCheckCd": "Y"});
	
	//AJAX 전송 성공 함수
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
	
	//AJAX 전송
	ajaxObj.send();
} 


//저장소 전체 접속 확인
function fnSelectRep1000AllConfirmConnect(repId, index){
	// 재귀 멈춤 조건
	//index -1인경우 return
	if(index == -1){
		return false;
	}
	
	repGridObj.setValue(index, "result", "progress");
	
	//소스저장소 정보
	var repGridListData = repGridObj.getList()[index];
	
	//AJAX 설정
	var repConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000ConfirmConnect.do'/>","loadingShow":false}
			,{ "repId" : repId });
	//AJAX 전송 성공 함수
	repConnAjaxObj.setFnSuccess(function(data){
		
		
		//return 값 확인
		if(data.MSG_CD =="REP_OK"){	//접속 성공
			repGridObj.setValue(index, "result", "success");
			repGridObj.setValue(index, "resultMsg", "접속성공");
		}else if(data.MSG_CD =="SVN_EXCEPTION"){ //URL 및 입력 값 오류
			repGridObj.setValue(index, "result", "exception");
			repGridObj.setValue(index, "resultMsg", "SVN 접속오류");
		}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){ //권한 오류
			repGridObj.setValue(index, "result", "authException");
			repGridObj.setValue(index, "resultMsg", "사용자 권한없음");
		}else{ //그 외 오류
			repGridObj.setValue(index, "result", "fail");
			repGridObj.setValue(index, "resultMsg", "기타 오류");
		} 	
		
		//index가 현재 grid갯수보다 크면 return
		if((++index) >= repGridObj.getList().length){
			return false;
		}
		
		//job 정보
		var repGridListData = repGridObj.getList()[index];
		var repId = repGridListData.repId;
		
		//실패해도 다음 job 체크
		fnSelectRep1000AllConfirmConnect(repId, index);
		
	});
	
	//AJAX 전송 오류 함수
	repConnAjaxObj.setFnError(function(xhr, status, err){
		
		jAlert(data.message, "알림창");
	});
	
	//AJAX 전송
	repConnAjaxObj.send();
}
//가이드 상자
function fnRep1000GuideShow(){
	var mainObj = $(".main_contents");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["rep1000"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}
</script>


<div class="main_contents" style="height: auto;" >
	<form name="rep1000Form" id="rep1000Form">
		<input type="hidden" name="ciId" id="ciId" value="${requestScope.ciId }"/>
		<input type="hidden" name="apiId" id="apiId" value="${requestScope.apiId }"/>
		<input type="hidden" name="svcId" id="svcId" value="${requestScope.svcId }"/>
		<input type="hidden" name="fId" id="fId" value="${requestScope.fId }"/>
		<input type="hidden" name="empId" id="empId" value="${requestScope.empId }"/>
		<input type="hidden" name="eGeneUrl" id="eGeneUrl" value="${requestScope.eGeneUrl }"/>
	</form>
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