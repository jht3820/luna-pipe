<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>

<link rel='stylesheet' href='<c:url value='/css/lunaops/stm.css'/>' type='text/css'>
<style type="text/css">
	.accptFont{color:#4b73eb !important;text-shadow: none !important;}
	.rejectFont{color:#eb4b6a !important;text-shadow: none !important;}
	.defaultFont{color:#000 !important;}
	.tab_contents.menu{width:1500px;}
</style>
<script>
var mySearch;

$(function(){
	//그리드 검색 호출
	fnAxGrid5View();
	fnSearchBoxControl();
	
	//가이드 상자 호출
	gfnGuideStack("add",fnStm2000GuideShow);
});


//검색조건 변경되었을때 이벤트
function fnSelectChg(){
	var selVal = $("#searchSelect option:selected").val();
	if(selVal == '0'){
		$("#searchTxt").val("");
		$("#searchTxt").attr("readonly", true);
	}else{
		$("#searchTxt").attr("readonly", false);
	}
}

//axisj5 그리드
function fnAxGrid5View(){
	firstGrid = new ax5.ui.grid();
 
	firstGrid.setConfig({
		target: $('[data-ax5grid="first-grid"]'),
		sortable:false,
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
             onDBLClick:function(){
             	var data = {"prjId":"${sessionScope.selPrjId}", "repId": firstGrid.list[this.doindex].repId};
 				gfnLayerPopupOpen('/stm/stm2000/stm2000/selectStm2002View.do',data,"1300","850", "scroll");	
             	
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
                fnInGridListSet(this.page.selectPage,mySearch.getParam());
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
   	}else if(typeof firstGrid.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+firstGrid.page.currentPage;
   	}
    	
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/stm/stm2000/stm2000/selectStm2000RepositoryListAjaxView.do'/>","loadingShow":true}
			,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		var list = data.list;
		var page = data.page;
		
	   	firstGrid.setData({
	             	list:list,
	             	page: {
	                  currentPage: _pageNo || 0,
	                  pageSize: page.pageSize,
	                  totalElements: page.totalElements,
	                  totalPages: page.totalPages
	              }
	             });
	});
	
	//AJAX 전송 오류 함수
	ajaxObj.setFnError(function(xhr, status, err){
		//세션이 만료된 경우 로그인 페이지로 이동
          	if(status == "999"){
          		alert('세션이 만료되어 로그인 페이지로 이동합니다.');
       		document.location.href="<c:url value='/cmm/cmm4000/cmm4000/selectCmm4000View.do'/>";
       		return;
          	}
	});
	
	//AJAX 전송
	ajaxObj.send();
}
/**
 * SVN Repository 삭제
 */
function fnDeleteStm2000Info(repId){
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/stm/stm2000/stm2000/deleteStm2000InfoAjax.do'/>"}
			,{ "repId" : repId });
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
		axdom("#" + mySearch.getItemId("btn_search_svn")).click();
	});
	
	//AJAX 전송 오류 함수
	ajaxObj.setFnError(function(xhr, status, err){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
	});
	
	//AJAX 전송
	ajaxObj.send();
} 
//검색 상자
function fnSearchBoxControl(){
	var pageID = "AXSearch";
	mySearch = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			//검색도구 설정 01 ---------------------------------------------------------
			mySearch.setConfig({
				targetID:"AXSearchTarget",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"", labelWidth:"", type:"button", width:"80",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<span>전체 접속확인</span>",
   							onclick:function(){
   								//그리드 목록 갯수
   								var gridLen = firstGrid.getList().length;
   								
   								//1개 이상인경우 체크
   								if(gridLen > 0){
   									//job 정보
									var gridJobInfo = firstGrid.getList()[0];
									var repId = gridJobInfo.repId;
   									//전체 svn conn 확인
   									fnSelectStm2000AllConfirmConnect(repId, 0);
   								}else{
   									toast.push("등록된 저장소가 존재하지 않습니다.");
   								}
                		}}
					  ]
					},
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
									axdom("#" + mySearch.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + mySearch.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + mySearch.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								//공통코드 처리 후 select box 세팅이 필요한 경우 사용
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(mySearch,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									//공통코드 처리(추가 selectbox 작업이 아닌 경우 type=text를 나타낸다.)
									axdom("#" + mySearch.getItemId("searchTxt")).show();
									axdom("#" + mySearch.getItemId("searchCd")).hide();
								}
    						},

						},
						{label:"", labelWidth:"", type:"inputText", width:"225", key:"searchTxt", addClass:"secondItem sendBtn", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + mySearch.getItemId("btn_search_svn")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						
						
						{label:"<i class='fas fa-list-ol'></i>&nbsp;목록 수&nbsp;", labelWidth:"60", type:"selectBox", width:"", key:"pageSize", addClass:"", valueBoxStyle:"", value:"30",
							options:[
							         	{optionValue:15, optionText:"15"},
		                                {optionValue:30, optionText:"30"},
		                                {optionValue:50, optionText:"50"},
		                                {optionValue:100, optionText:"100"},
		                                {optionValue:300, optionText:"300"},
		                                {optionValue:600, optionText:"600"},
		                                {optionValue:1000, optionText:"1000"},
		                                {optionValue:5000, optionText:"5000"},
		                                {optionValue:10000, optionText:"10000"},
		                                
		                            ],onChange: function(selectedObject, value){
		                            	fnInGridListSet(0,$('form#searchFrm').serialize()+"&"+mySearch.getParam());
		    						}
						},
						{label:"<i class='fas fa-arrows-alt-v'></i>&nbsp;목록 높이&nbsp;", labelWidth:"60", type:"selectBox", width:"", key:"gridHeight", addClass:"", valueBoxStyle:"", value:"600",
							options:[
							         	{optionValue:300, optionText:"300px"},
		                                {optionValue:600, optionText:"600px"},
		                                {optionValue:1000, optionText:"1000px"},
		                                {optionValue:1200, optionText:"1200px"},
		                                {optionValue:2000, optionText:"2000px"},
		                                
		                            ],onChange: function(selectedObject, value){
		                            	firstGrid.setHeight(value);
		    						}
						},
						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
							onclick:function(){
								$(firstGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
						}},
						
						{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
							onclick:function(){
								firstGrid.exportExcel("<c:out value='${sessionScope.selMenuNm }'/>.xls");
						}},
						
						{label : "",labelWidth : "",type : "button",width : "55",key : "btn_delete_svn",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-trash-alt' aria-hidden='true'></i>&nbsp;<span>삭제</span>",
							onclick : function() {
								var item = (!gfnIsNull(Object.keys(firstGrid.focusedColumn)))? firstGrid.list[firstGrid.focusedColumn[Object.keys(firstGrid.focusedColumn)].doindex]:null;
								if(gfnIsNull(item)){
									toast.push('삭제 할 목록을 선택하세요.');
									return;
								}
								jConfirm("삭제 하시겠습니까?</br>배정된 프로젝트가 있는 경우 삭제가 불가능합니다.","알림", function(result){
									if(result){
										fnDeleteStm2000Info(item.repId);
									}
								});
							}
						},
						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_update_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-edit' aria-hidden='true'></i>&nbsp;<span>수정</span>",
							onclick:function(){
								var item = (!gfnIsNull(Object.keys(firstGrid.focusedColumn)))? firstGrid.list[firstGrid.focusedColumn[Object.keys(firstGrid.focusedColumn)].doindex]:null;
								if(gfnIsNull(item)){
									toast.push('수정 할 목록을 선택하세요.');
									return;
								}
								
								var data = {"popupGb": "update", "repId": item.repId};
        	                	
								gfnLayerPopupOpen('/stm/stm2000/stm2000/selectStm2001RepositoryDetailView.do',data,"650","630",'scroll');
						}},
						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_insert_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-save' aria-hidden='true'></i>&nbsp;<span>등록</span>",
							onclick:function(){
								var data = {
									"popupGb": "insert"
								};
								gfnLayerPopupOpen('/stm/stm2000/stm2000/selectStm2001RepositoryDetailView.do',data,"650","630",'scroll');
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_svn",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								/* 검색 조건 설정 후 reload */
	 							var pars = mySearch.getParam();
							    var ajaxParam = $('form#searchFrm').serialize();

							    if(!gfnIsNull(pars)){
							    	ajaxParam += "&"+pars;
							    }
								
					            fnInGridListSet(0,ajaxParam);
					            
					            //폼 데이터 변경
								$('#searchSelect').val(axdom("#" + mySearch.getItemId("searchSelect")).val());
								$('#searchCd').val(axdom("#" + mySearch.getItemId("searchCd")).val());
								$('#searchTxt').val(axdom("#" + mySearch.getItemId("searchTxt")).val());
						}},
						{label:"", labelWidth:"", type:"button", width:"100",style:"float:right;", key:"btn_connect_svn",valueBoxStyle:"padding:5px;", value:"<i class='fas fa-angle-double-right' aria-hidden='true'></i>&nbsp;<span>선택 접속확인</span>",
							onclick:function(){
								var item = (!gfnIsNull(Object.keys(firstGrid.focusedColumn)))? firstGrid.list[firstGrid.focusedColumn[Object.keys(firstGrid.focusedColumn)].doindex]:null;
								if(gfnIsNull(item)){
									toast.push('확인 할 목록을 선택하세요.');
									return;
								}
								fnSelectStm2000ConfirmConnect(item.repId,  firstGrid.focusedColumn[Object.keys(firstGrid.focusedColumn)].doindex );
						}}    
					]}
				]
			});
		}
		/*,
		search1: function(){
			var pars = mySearch.getParam();
			fnAxGridView(pars);
		}
		*/
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
		axdom("#" + mySearch.getItemId("searchTxt")).attr("readonly", "readonly");
		
		//공통코드 selectBox hide 처리
		axdom("#" + mySearch.getItemId("searchCd")).hide();

		//버튼 권한 확인
		fnBtnAuthCheck(mySearch);
	});
}

/**
 * 
 */
function fnSelectStm2000ConfirmConnect(repId,index){
	//ajax동작전 progress 주입
	firstGrid.setValue(index, "result", "progress");
	firstGrid.setValue(index, "resultMsg", "확인중");
	
	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/stm/stm2000/stm2000/selectStm2000ConfirmConnect.do'/>","loadingShow":false}
			,{ "repId" : repId , "gitRepUrlCheckCd": "Y"});
	
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		if(data.MSG_CD =="REP_OK"){
			firstGrid.setValue(index, "result", "success");
			firstGrid.setValue(index, "resultMsg", "접속성공");
			
		}else if(data.MSG_CD =="SVN_EXCEPTION"){
			firstGrid.setValue(index, "result", "exception");
			firstGrid.setValue(index, "resultMsg", "SVN 접속오류");
		}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){
			firstGrid.setValue(index, "result", "authException");
			firstGrid.setValue(index, "resultMsg", "사용자 권한없음");
		}else{
			firstGrid.setValue(index, "result", "fail");
			firstGrid.setValue(index, "resultMsg", "기타 오류");
		}
		if(data.saveYN == "N"){
			jAlert(data.message,"경고");
		}
	});
	
	//AJAX 전송
	ajaxObj.send();
} 


//저장소 전체 접속 확인
function fnSelectStm2000AllConfirmConnect(repId, index){
	// 재귀 멈춤 조건
	//index -1인경우 return
	if(index == -1){
		return false;
	}
	
	firstGrid.setValue(index, "result", "progress");
	
	//job 정보
	var gridJobInfo = firstGrid.getList()[index];
	
	//AJAX 설정
	var repConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/stm/stm2000/stm2000/selectStm2000ConfirmConnect.do'/>","loadingShow":false}
			,{ "repId" : repId });
	//AJAX 전송 성공 함수
	repConnAjaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		
		//return 값 확인
		if(data.MSG_CD =="REP_OK"){	//접속 성공
			firstGrid.setValue(index, "result", "success");
			firstGrid.setValue(index, "resultMsg", "접속성공");
		}else if(data.MSG_CD =="SVN_EXCEPTION"){ //URL 및 입력 값 오류
			firstGrid.setValue(index, "result", "exception");
			firstGrid.setValue(index, "resultMsg", "SVN 접속오류");
		}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){ //권한 오류
			firstGrid.setValue(index, "result", "authException");
			firstGrid.setValue(index, "resultMsg", "사용자 권한없음");
		}else{ //그 외 오류
			firstGrid.setValue(index, "result", "fail");
			firstGrid.setValue(index, "resultMsg", "기타 오류");
		} 	
		
		//index가 현재 grid갯수보다 크면 return
		if((++index) >= firstGrid.getList().length){
			return false;
		}
		
		//job 정보
		var inGridJobInfo = firstGrid.getList()[index];
		var repId = inGridJobInfo.repId;
		
		//실패해도 다음 job 체크
		fnSelectStm2000AllConfirmConnect(repId, index);
		
	});
	
	//AJAX 전송 오류 함수
	repConnAjaxObj.setFnError(function(xhr, status, err){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
	});
	
	//AJAX 전송
	repConnAjaxObj.send();
}
//가이드 상자
function fnStm2000GuideShow(){
	var mainObj = $(".main_contents");
	
	//mainObj가 없는경우 false return
	if(mainObj.length == 0){
		return false;
	}
	//guide box setting
	var guideBoxInfo = globals_guideContents["stm2000"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}
</script>


<div class="main_contents" style="height: auto;" >
	<form:form commandName="req1000VO" id="searchFrm" name="searchFrm" method="post" onsubmit="return false;">
	</form:form>
	<div class="stm2000_title"><c:out value="${sessionScope.selMenuNm }"/></div>
	<div class="tab_contents menu">
		<input type="hidden" name="strInSql" id="strInSql" />
		<div id="AXSearchTarget" style="border-top:1px solid #ccc;" guide="stm2000button" ></div>
		<br />
		<div data-ax5grid="first-grid" data-ax5grid-config="{}" style="height: 600px;"></div>	
	</div>
</div>
		
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />