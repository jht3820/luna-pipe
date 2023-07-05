<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<html lang="ko">
<title>OpenSoftLab</title>
<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<style type="text/css">
.layer_popup_box .pop_left, .layer_popup_box .pop_right { height: 54px; }
.button_normal { width: 39px; height: 22px; line-height: 22px; text-align: center; font-weight: bold; font-size: 1em; border-radius: 5px; box-shadow: 1px 1px 1px #ccd4eb; margin: 0 auto; border: 1px solid #b8b8b8; cursor: pointer; }
div.pop_sub .pop_left {width:28%;} /* common.css pop_left width값 오버라이딩 */
div.pop_sub .pop_right {width:72%;} /* common.css pop_left width값 오버라이딩 */
.input_txt {padding-left: 5px;}
.rep1005GridFrame {position: relative;}
</style>
<script type="text/javascript">

	var popSearch;
	var rep1005PathGrid;
	
	$(document).ready(function() {
		//그리드 및 검색 상자 호출
		fnRep1005PopSearchView(); // AXISJ Grid 초기화 실행 부분들
		
		//검색 상자 세팅
		fnSvnPopupSearchControl();
		
		/* 선택 */
		$("#btnPopRep1005Select").click(function(){
			fnRevisionSelect();
		});
		
		/* 취소 */
		$('#btnPopRep1005Cancle').click(function() {
			gfnLayerPopupClose();
		});
	});
	
	//비교 대상 리비전 선택
	function fnRevisionSelect(){
		var item = (!gfnIsNull(Object.keys(rep1005PathGrid.focusedColumn)))? rep1005PathGrid.list[rep1005PathGrid.focusedColumn[Object.keys(rep1005PathGrid.focusedColumn)].doindex]:null;
		
		if(gfnIsNull(item)){
			toast.push('비교 대상 리비전을 선택해주세요.');
			return;
		}
		
		//파일 내용 비교
		var data = {"repId": "${param.repId}", "repTypeCd": "${param.repTypeCd}", "revision": "${param.selRevision}", "diffRevision": item.revision, "commitId": "${param.selCommitId}", "diffCommitId": item.commitId, "path": "<c:out value='${param.filePath}'/>", "fileName": "<c:out value='${param.fileName}'/>"};
		gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1006View.do',data,"1200","780",'scroll');	
	}

	//axisj5 그리드
	function fnRep1005PopSearchView(){
		rep1005PathGrid = new ax5.ui.grid();
	 	var columns = [];
	 	var repTypeCd = "${param.repTypeCd}";
	 	if(repTypeCd == "03"){
			columns = [
				{key: "commitId", label: "Commit ID", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 250, align: "center"},
				{key: "comment", label: "Comment", width: 610, align: "left"}
	         ];
		}else{
			columns = [
				{key: "revision", label: "Revision", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 250, align: "center"},
				{key: "comment", label: "Comment", width: 610,  align: "left"}
	         ];
		}
	 	
		rep1005PathGrid.setConfig({
			target: $('[data-ax5grid="rep1005-grid"]'),
			sortable:false,
			header: {align:"center",columnHeight: 30},
			frozenColumnIndex: 4,
			columns: columns,
	         body: {
				align: "center",
				columnHeight: 30,
	            onClick:function(){
	            	//커밋로그
					$("#svnCommitLogDetailRep1005").val(this.item.comment);
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
					var ajaxParam = $('form#rep1005PopupFrm').serialize();

					if(!gfnIsNull(pars)){
						ajaxParam += "&"+pars;
					}
					fnRep1005PopSearchListSet(this.page.selectPage, ajaxParam);
				}
	        } 
		});
	}
	
	//그리드 데이터 넣는 함수
	function fnRep1005PopSearchListSet(_pageNo,ajaxParam){
		/* 그리드 데이터 가져오기 */
	   	//파라미터 세팅
	   	if(gfnIsNull(ajaxParam)){
	 			ajaxParam = $('form#rep1005PopupFrm').serialize()+ "&"+filePathSearchObj.getParam();
	 	}
	   	
	   	//페이지 세팅
	   	if(!gfnIsNull(_pageNo)){
	   		ajaxParam += "&pageNo="+_pageNo;
	   	}else if(typeof rep1005PathGrid.page.currentPage != "undefined"){
	   		ajaxParam += "&pageNo="+rep1005PathGrid.page.currentPage;
	   	}
	    
	   	//mask show
	   	$("#repPathGridList").show();
	   	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1002RepositoryPageListAjaxView.do'/>","loadingShow": false}
				,ajaxParam);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
			
			//반환 받은 리비전 번호 세팅
			axdom("#" + filePathSearchObj.getItemId("startRevisionVal")).val(data.startRevision);
			axdom("#" + filePathSearchObj.getItemId("endRevisionVal")).val(data.lastRevision);
			
			var list = data.list;
			var page = data.page;
			
		   	rep1005PathGrid.setData({
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

	 	var repTypeCd = "${param.repTypeCd}";
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
										    var ajaxParam = $('form#rep1005PopupFrm').serialize();

										    if(!gfnIsNull(pars)){
										    	ajaxParam += "&"+pars;
										    }
											
								            fnRep1005PopSearchListSet(0,ajaxParam);
			    						}
							},
							searchItem1,
							searchItem2,
							{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
								onclick:function(){
									$(rep1005PathGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
							}},
							
							{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
								onclick:function(){
									rep1005PathGrid.exportExcel("<c:out value='${sessionScope.selMenuNm }'/>.xls");
							}},
							{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_svn",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
								onclick:function(){
									/* 검색 조건 설정 후 reload */
		 							var pars = filePathSearchObj.getParam();
								    var ajaxParam = $('form#rep1005PopupFrm').serialize();

								    if(!gfnIsNull(pars)){
								    	ajaxParam += "&"+pars;
								    }
									
						            fnRep1005PopSearchListSet(0,ajaxParam);
							}}
						]}
					]
				});
			}
		};
		
		jQuery(document.body).ready(function(){
			
			fnObjSearch.pageStart();
			
			//리비전 범위 세팅하기 - 최초 100개
			axdom("#" + filePathSearchObj.getItemId("startRevisionVal")).val('<c:out value="${param.startRevision}" />');
			axdom("#" + filePathSearchObj.getItemId("endRevisionVal")).val('<c:out value="${param.lastRevision}" />');

			//그리드 데이터 불러오기
			fnRep1005PopSearchListSet();
		});
	}
</script>

<div class="popup">
	<form id="rep1005PopupFrm" name="rep1005PopupFrm" method="post">
		<input type="hidden" name="repId" id="repId" value="${param.repId}" />
		<input type="hidden" name="filePath" id="filePath" value="${param.filePath}" />
	</form>
	<div class="pop_title">[ <c:out value="${param.fileName}"/> ] 비교 대상 파일 리비전 선택</div>
	<div class="rep1005Pop_sub">
		<div class="rep1002SearchFrame rep1002FrameBox" id="filePathSearchTarget"></div>
		<div class="rep1005GridFrame">
			<div class="svn_mask_repList" id="repPathGridList">
				데이터를 조회중입니다.<br><br>
				<img class="fixed_loading" src="/images/loading.gif" style="width: 100px;height: 100px;">
			</div>
			<div data-ax5grid="rep1005-grid" data-ax5grid-config="{}" style="height: 380px;"></div>
		</div>		
		<div class="rep1002CommitLogFrame rep1002FrameBox">
			<textarea id="svnCommitLogDetailRep1005" class="svnCommitLogDetail" readonly="readonly"></textarea>
		</div>
		<div class="btn_div">
			<div class="button_normal save_btn" id="btnPopRep1005Select" >선택</div>		
			<div class="button_normal exit_btn" id="btnPopRep1005Cancle" >닫기</div>
		</div>
	</div>
	</form>
</div>
</html>