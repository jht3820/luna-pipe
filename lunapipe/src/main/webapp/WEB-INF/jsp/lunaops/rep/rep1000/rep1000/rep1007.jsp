<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>
<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<style>
.input_txt {padding-left: 5px;}
.rep1007GridFrame {position: relative;margin-bottom: 2px;}
</style>
<script>
var popSearch;
var rep1007PathGrid;

$(document).ready(function() {
	//그리드 및 검색 상자 호출
	fnRep1007PopSearchView(); // AXISJ Grid 초기화 실행 부분들
	
	//검색 상자 세팅
	fnSvnPopupSearchControl();
	
	/* 취소 */
	$('#btnPopRep1007Cancle').click(function() {
		window.close();
	});
});

//비교 대상 리비전 선택
function fnRevisionSelect(){
	var item = (!gfnIsNull(Object.keys(rep1007PathGrid.focusedColumn)))? rep1007PathGrid.list[rep1007PathGrid.focusedColumn[Object.keys(rep1007PathGrid.focusedColumn)].doindex]:null;
	
	if(gfnIsNull(item)){
		toast.push('비교 대상 리비전을 선택해주세요.');
		return;
	}
	
	var repId = $("form#rep1007PopupFrm > #repId").val();
	var repTypeCd = $("form#rep1007PopupFrm > #repTypeCd").val();
	var selRevision = $("form#rep1007PopupFrm > #selRevision").val();
	var filePath = $("form#rep1007PopupFrm > #filePath").val();
	var fileName = $("form#rep1007PopupFrm > #fileName").val();
	
	//파일 내용 비교
	var data = {"repId": repId, "repTypeCd": repTypeCd, "revision": selRevision, "diffRevision": item.revision, "commitId": null, "diffCommitId": item.commitId, "path": filePath, "fileName": fileName};
	gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1006View.do',data,"1200","780",'scroll');	
}

//axisj5 그리드
function fnRep1007PopSearchView(){
	rep1007PathGrid = new ax5.ui.grid();
 	var columns = [];
 	var repTypeCd = $("form#rep1007PopupFrm > #repTypeCd").val();
 	if(repTypeCd == "03"){
		columns = [
			{key: "commitId", label: "Commit ID", width: 80, align: "right"},
			{key: "author", label: "Author", width: 120, align: "center"},
			{key: "sDate", label: "Date", width: 250, align: "center"},
			{key: "comment", label: "Comment", width: 710, align: "left"}
         ];
	}else{
		columns = [
			{key: "revision", label: "Revision", width: 80, align: "right"},
			{key: "author", label: "Author", width: 120, align: "center"},
			{key: "sDate", label: "Date", width: 250, align: "center"},
			{key: "comment", label: "Comment", width: 710,  align: "left"}
         ];
	}
 	
	rep1007PathGrid.setConfig({
		target: $('[data-ax5grid="rep1007-grid"]'),
		sortable:false,
		header: {align:"center",columnHeight: 30},
		frozenColumnIndex: 4,
		columns: columns,
         body: {
			align: "center",
			columnHeight: 30,
            onClick:function(){
            	//커밋로그
				$("#svnCommitLogDetailRep1007").val(this.item.comment);
            },
            onDBLClick:function(){
            	fnRevisionSelect();
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
				/* 검색 조건 설정 후 reload */
				var pars = filePathSearchObj.getParam();
				var ajaxParam = $('form#rep1007PopupFrm').serialize();

				if(!gfnIsNull(pars)){
					ajaxParam += "&"+pars;
				}
				fnRep1007PopSearchListSet(this.page.selectPage, ajaxParam);
			}
        } 
	});
}

//그리드 데이터 넣는 함수
function fnRep1007PopSearchListSet(_pageNo,ajaxParam){
	/* 그리드 데이터 가져오기 */
   	//파라미터 세팅
   	if(gfnIsNull(ajaxParam)){
 			ajaxParam = $('form#rep1007PopupFrm').serialize()+ "&"+filePathSearchObj.getParam();
 	}
   	
   	//페이지 세팅
   	if(!gfnIsNull(_pageNo)){
   		ajaxParam += "&pageNo="+_pageNo;
   	}else if(typeof rep1007PathGrid.page.currentPage != "undefined"){
   		ajaxParam += "&pageNo="+rep1007PathGrid.page.currentPage;
   	}
    
   	//mask show
   	$("#repPathGridList").show();
   	//AJAX 설정
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1002RepositoryPageListAjaxView.do'/>","loadingShow": false}
			,ajaxParam);
	//AJAX 전송 성공 함수
	ajaxObj.setFnSuccess(function(data){
		var startRevision = $("form#rep1007PopupFrm > #startRevision").val();
		var lastRevision = $("form#rep1007PopupFrm > #lastRevision").val();
		
		//반환 받은 리비전 번호 세팅
		axdom("#" + filePathSearchObj.getItemId("startRevisionVal")).val(data.startRevision);
		axdom("#" + filePathSearchObj.getItemId("endRevisionVal")).val(data.lastRevision);
		
		var list = data.list;
		var page = data.page;
		
	   	rep1007PathGrid.setData({
         	list:list,
         	page: {
				currentPage: _pageNo || 0,
				pageSize: page.pageSize,
				totalElements: page.totalElements,
				totalPages: page.totalPages
    		}
	    });
	   	
	   	$("#repPathGridList").hide();
	});
	
	//AJAX 전송
	ajaxObj.send();
}

//검색 상자
function fnSvnPopupSearchControl(){
	var pageID = "filePathSearchTarget";
	filePathSearchObj = new AXSearch();
	
	// 현재일과 현재일 기준 한달전 날짜 기본세팅
	var defaultStDt = new Date(new Date().setMonth(new Date().getMonth()-1)).format('yyyy-MM-dd');
	var defaultEdDt = new Date().format('yyyy-MM-dd');

	var repTypeCd = $("form#rep1007PopupFrm > #repTypeCd").val();
	var searchItem1 = {}; 
	var searchItem2 = {}; 
	if(repTypeCd != '03'){
		searchItem1 = {label:"리비전 범위", labelWidth:"", type:"inputText", width:"60", key:"startRevisionVal", addClass:"secondItem sendBtn", value:"",}
		searchItem2 = {label:"~", labelWidth:"20", type:"inputText", width:"60", key:"endRevisionVal", addClass:"secondItem sendBtn labelBorderNone", valueBoxStyle:"", value:"",}
		
	}
	
	var fnObjSearch = {
		pageStart: function(){
			//검색도구 설정 01 ---------------------------------------------------------
			filePathSearchObj.setConfig({
				targetID:"filePathSearchTarget",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"<i class='fas fa-list-ol'></i>&nbsp;목록 수&nbsp;", labelWidth:"75", type:"selectBox", width:"", key:"pageSize", addClass:"secondItem", valueBoxStyle:"", value:"30",
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
		                            	/* 검색 조건 설정 후 reload */
			 							var pars = filePathSearchObj.getParam();
									    var ajaxParam = $('form#rep1007PopupFrm').serialize();

									    if(!gfnIsNull(pars)){
									    	ajaxParam += "&"+pars;
									    }
										
							            fnRep1007PopSearchListSet(0,ajaxParam);
		    						}
						},
						searchItem1,
						searchItem2,
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_svn",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								/* 검색 조건 설정 후 reload */
	 							var pars = filePathSearchObj.getParam();
							    var ajaxParam = $('form#rep1007PopupFrm').serialize();

							    if(!gfnIsNull(pars)){
							    	ajaxParam += "&"+pars;
							    }
								
					            fnRep1007PopSearchListSet(0,ajaxParam);
						}}
					]}
				]
			});
		}
	};
	
	jQuery(document.body).ready(function(){
		var startRevision = $("form#rep1007PopupFrm > #startRevision").val();
		var lastRevision = $("form#rep1007PopupFrm > #lastRevision").val();
		fnObjSearch.pageStart();
		
		//리비전 범위 세팅하기 - 최초 100개
		axdom("#" + filePathSearchObj.getItemId("startRevisionVal")).val(startRevision);
		axdom("#" + filePathSearchObj.getItemId("endRevisionVal")).val(lastRevision);

		//그리드 데이터 불러오기
		fnRep1007PopSearchListSet();
	});
}
</script>

<div class="main_contents" style="height: auto;" >
	<div class="tab_contents menu" style="width:1200px;">
		<form id="rep1007PopupFrm" name="rep1007PopupFrm" method="post">
			<input type="hidden" name="repId" id="repId" value="${requestScope.repId}" />
			<input type="hidden" name="filePath" id="filePath" value="${requestScope.filePath}" />
			<input type="hidden" name="selRevision" id="selRevision" value="${requestScope.selRevision}" />
			<input type="hidden" name="selRepPath" id="selRepPath" value="/" />
			<input type="hidden" name="repTypeCd" id="repTypeCd" value="${requestScope.repTypeCd}" />
			<input type="hidden" name="fileName" id="fileName" value="${requestScope.fileName}" />
			<input type="hidden" name="startRevision" id="startRevision" value="${requestScope.startRevision}" />
			<input type="hidden" name="lastRevision" id="lastRevision" value="${requestScope.lastRevision}" />
		</form>
		<div class="sub_title">
			[ <c:out value="${requestScope.fileName}"/> ] 비교 대상 파일 리비전 선택
		</div>
		<div class="rep1007SearchFrame rep1007FrameBox" id="filePathSearchTarget"></div>
		<div class="rep1007GridFrame">
			<div class="svn_mask_repList" id="repPathGridList">
				데이터를 조회중입니다.<br><br>
				<img class="fixed_loading" src="/images/loading.gif" style="width: 100px;height: 100px;">
			</div>
			<div data-ax5grid="rep1007-grid" data-ax5grid-config="{}" style="height: 500px;"></div>
		</div>		
		<div class="rep1007CommitLogFrame rep1007FrameBox">
			<textarea id="svnCommitLogDetailRep1007" class="svnCommitLogDetail" readonly="readonly"></textarea>
		</div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="repDetailCloseBtn">닫기</div>
		</div>
	</div>
</div>
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />