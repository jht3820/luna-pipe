<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>
<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<script type="text/javascript" src="/js/ztree/jquery.ztree.all.min.js"></script>
<style>
	.groupClear {height: 0;}
	.layer_popup_box .popup{overflow:hidden !important;}
.ztree li span.button.folder_ico_docu {
    margin-right: 2px;
    background-position: -110px 0;
    vertical-align: top;
    *vertical-align: middle;
}
/* type이 local인경우 하단 자르기 */
.tab_contents.menu.rep1002_local .rep1002SelRivsionBtnFrame,
.tab_contents.menu.rep1002_local .selRvTitle, 
.tab_contents.menu.rep1002_local .rep1002SelRivisionFrame{display:none;}
.tab_contents.menu.rep1002_local .rep1002RevisionFrame.rep1002FrameBox{height: 590px;} 
</style>
<script>
	//상단 리비전 검색
	var svnSearchObj;
	
	//그리드
	var repPopupGrid;
	var selRepPopupGrid;
	
	var repTypeCd = "";
	
	//zTree (리비전 선택 파일, 선택 노드)
	var zTreeRep1002, zTree, revisionFileList;
	
	//마지막 리비전 번호
	var lastRevision;
	
	//리비전 파일 내용 목록 출력 갯수
	var revisionFilePahtListCnt = 30;
	var repNm = '<c:out value="${repInfo.repNm}"/>';
	
	//선택 리비전 중복 체크
	var overlapRevision = {};
	
	//스크립트 초기화
	$(document).ready(function(){
		//소스저장소 명
		$("form#rep1002PopupFrm > #repNm").val(repNm);
		//소스저장소 타입
		repTypeCd = $("form#rep1002PopupFrm > #repTypeCd").val();
		
		//가이드 상자 호출
		gfnGuideStack("add",fnRep1002GuideShow);

		//좌측 리비전 하위 1depth 목록 조회
		fnRepSubTreeSetting();
		
		//리비전 목록
		fnRepPopupGridView();
		
		//상단 검색 영역
		fnRepPopupSearchControl();
		
		//선택 리비전 그리드 세팅
		fnSelRepPopupGridView();
		
		//닫기 버튼
		$("#repDetailCloseBtn").click(function(){
			window.close();
		});
		
		//리비전 추가 버튼
		$("#selRevisionAddBtn").click(function(){
			//repPopupGrid
			var chkList = repPopupGrid.getList('selected');
			if (gfnIsNull(chkList)) {
				jAlert("선택한 리비전이 없습니다.", "알림창");
				return false;
			}

			//중복 개수
			var overlapCnt = 0;
			
			//실제 추가되는 row
			var addDataRow = [];
			
			//추가 인덱스 숫자
			var addDataIdx = 0;
			
			//job 중복 체크
			$.each(chkList, function(idx, map){
				//리비전있는지 체크
				if(overlapRevision.hasOwnProperty(map.revision)){
					overlapCnt++;
					return true;
				}
				
				map["__selected__"] = false;
				overlapRevision[map.revision] = true;
				addDataRow.push(map);
				addDataIdx++;
			});
			
			//alert 메시지
			var alertAddMsg = "";
			
			if(overlapCnt == chkList.length){
				jAlert("선택된 리비전은 이미 추가되있습니다.");
				return false;
			}
			else if(overlapCnt > 0){
				alertAddMsg = "</br>중복된 "+overlapCnt+"개의 리비전이 제외되었습니다.";
			}
			
			jAlert("리비전이 추가되었습니다."+alertAddMsg);
			
			//job추가
			selRepPopupGrid.addRow(addDataRow);
		});
		//리비전 제거 버튼
		$("#selRevisionDelBtn").click(function(){
			var chkList = selRepPopupGrid.getList('selected');
			if (gfnIsNull(chkList)) {
				jAlert("선택한 리비전이 없습니다.", "알림창");
				return false;
			}
			
			//선택 job 제거
			$.each(chkList, function(idx, map){
				//중복체크 제거
				delete overlapRevision[map.revision];
			});
			
			//row 삭제
			selRepPopupGrid.removeRow("selected");
		});
		
		//리비전 선택 버튼
		$("#repDataSendBtn").click(function(){
			var repId = $("form#rep1002PopupFrm > #repId").val();
			
			//선택한 JOB
			var selRepList = selRepPopupGrid.getList();
			
			//선택된 리비전 없는 경우
			if (gfnIsNull(selRepList)) {
				jAlert("선택한  리비전이 없습니다.</br>리비전을 선택해주세요.", "알림창");
				return false;
			}
			
			jConfirm("선택된 리비전 "+selRepList.length+"개를 연결하시겠습니까?</br></br>[선택 리비전]</br>"+addMsg,"알림창", function(result){
				if(result) {
					//필요 값
					var ticketId = $("form#rep1002PopupFrm > #ticketId").val();
					var apiId = $("form#rep1002PopupFrm > #apiId").val();
					var srcId = $("form#rep1002PopupFrm > #ciId").val();
					var svcId = $("form#rep1002PopupFrm > #svcId").val();
					var fId = $("form#rep1002PopupFrm > #fId").val();
					var eGeneUrl = $("form#rep1002PopupFrm > #eGeneUrl").val();
					var callbakApiId = $("form#rep1002PopupFrm > #callbakApiId").val();
					
					//저장소 param
					var urows = [];
					
					//선택된 리비전번호 문구
					var addMsg = "";
					$.each(selRepList, function(idx, map){
						if(idx > 0){
							addMsg += ", ";
						}
						addMsg += map.revision;
						
						//변경 파일 목록
						var svnFileList = [];
						
						//변경 파일 수
						var repChgFileCnt = 0;
						
						//변경 파일 목록 세팅
						if(!gfnIsNull(map.svnFileList)){
							repChgFileCnt = map.svnFileList.length;
							
							$.each(map.svnFileList, function(subIdx, subMap){
								svnFileList.push({
									"rsv_file_path": subMap.path
									, "rsv_file_type": subMap.type
									, "rsv_file_name": subMap.name
									//, "rsv_file_type": subMap.kind
								});
							});
						}
						
						//반환값 세팅
						var repInfo = {
							"key": ticketId+"-"+repId
							, "rsv_tgt_id": ticketId
							, "rsv_src_id": srcId
							, "rsv_revision_id": map.revision
							, "rsv_cmt_cnt": repChgFileCnt
							, "rsv_cmt_dttm": map.logDate
							, "rsv_cmt_descr": map.comment
							, "rsv_cmt_emp_id": map.author
							, "svn_file_list": svnFileList
						}
						
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
						, "callbak_api_id": callbakApiId
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
							var egene_controller = eGeneUrl+'plugins/jsp/lunaController.jsp?data='+encodeURIComponent(enCtlData);
							window.location.href = egene_controller;
							
						}else{
							jAlert(data.msg, "알림창");
							return false;
						}
					});
					
					//AJAX 전송
					ajaxObj.send();
				}
			});
		});
	});

	//repSubDirTree
	//
	function fnRepSubTreeSetting(){
		var repId = $("form#rep1002PopupFrm > #repId").val();
		var svnRepUrl = $("form#rep1002PopupFrm > #svnRepUrl").val();
		var svnUsrId = $("form#rep1002PopupFrm > #svnUsrId").val();
		var svnUsrPw = $("form#rep1002PopupFrm > #svnUsrPw").val();
		var repTypeCd = $("form#rep1002PopupFrm > #repTypeCd").val();
		
		//파라미터
		var param = {
			"svnRepUrl": svnRepUrl,
			"svnUsrId": svnUsrId,
			"svnUsrPw": svnUsrPw,
			"repTypeCd": repTypeCd
		};
		
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1001RepTreeListAjax.do'/>","loadingShow":true}
				, param );
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			if(data.MSG_CD =="SVN_EXCEPTION"){
				jAlert("소스저장소 접근 중 오류가 발생했습니다.","알림");
				return false;
			}else if(data.MSG_CD =="SVN_AUTHENTICATION_EXCEPTION"){
				jAlert("소스저장소에 접근이 불가능한 사용자 정보입니다.","알림");
				return false;
			}
			
			//job tree setting
		    var setting = {
	    		// zTree binding data key 설정
		        data: {
		        	key: {
						name: "name"
					},
		            simpleData: {
		                enable: true,
		                idKey: "id",
						pIdKey: "pId",
		            }
		        },
				callback: {
					onClick: function(event, treeId, treeNode){
						var treeNodePath = treeNode.path;
						
						//path가 있는 경우
						if(!gfnIsNull(treeNodePath)){
							//path변경
							$("form#rep1002PopupFrm > #selRepPath").val(treeNode.path);
						}else{
							$("form#rep1002PopupFrm > #selRepPath").val("/");
						}
						//그리드 데이터 불러오기
						fnRepPopupGridListSet();
					}
				}
		    };
			
			//job list
			var list = [];
			
			//root 추가
			list.push({
				"name": repNm
				, "id": repId
				, "path": ""
				, "urlStr": svnRepUrl
				, "isParent": true
				, "open": true
			});
			
		    $.each(data.list, function(idx, obj){
				if(obj["type"] == 0){
					list.push(obj);
					obj.isParent = false;
					obj["iconSkin"] = "folder";
					obj["pId"] = repId;
				}
			});
		    
		    // zTree 초기화
		    zTreeRep1002 = $.fn.zTree.init($("#rep1002SubDirTree"), setting, list);
		    
		    //접속 중 값 변경
		    svnConnCheckFlag = true;
		});
	
		//AJAX 전송
		ajaxObj.send();
	}
	
	//axisj5 그리드
	function fnRepPopupGridView(){
		//소스 저장소별 컬럼
		var columns = [];
		//git
		if(repTypeCd == "01"){
			columns = [
				{key: "revision", label: "Revision", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 200, align: "center"},
				{key: "comment", label: "Comment", width: 500, align: "left"}
	         ];
		}
		//svn
		else if(repTypeCd == "02"){
			columns = [
				{key: "revision", label: "Revision", width: 80, align: "right"},
				{key: "pathCnt", label: "Changes", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 200, align: "center"},
				{key: "comment", label: "Comment", width: 500, align: "left"}
	         ];
		}
		//gitlab
		else if(repTypeCd == "03"){
			columns = [
				{key: "commitId", label: "Commit ID", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 200, align: "center"},
				{key: "comment", label: "Comment", width: 500, align: "left"}
	         ];
		}
		
		repPopupGrid = new ax5.ui.grid();
		
		//팝업 type
		var type = $("form#rep1002PopupFrm > #type").val();
		
		//type이 local인경우 height 크게
		var gridHeight = 250;
		
		if(type == "local"){
			gridHeight = 575;
		}
		repPopupGrid.setConfig({
			height: gridHeight,
			target: $('[data-ax5grid="rep-grid"]'),
			showRowSelector: true,
			sortable:false,
			header: {align:"center",columnHeight: 30},
			frozenColumnIndex: 4,
			columns: columns,
			body: {
				align: "center",
				columnHeight: 30,
	            onClick:function(){
	            	// 클릭 이벤트
	   				this.self.select(this.doindex, {selected: !this.item.__selected__});	
	            	
	            	//커밋로그
					$("#svnCommitLogDetail").val(this.item.comment);
	            	/* 
	            	//리비전 파일목록 세팅
					fnSearchFileDirTree(this.item.revision, this.item.commitId);
	            	
	            	//리비전 그리드 목록 세팅
	            	fnFileGridView();
	            	
	            	//선택 리비전 갱신
	            	selRevision = this.item.revision;
	            	selCommitId = this.item.commitId;
	            	 */
	            },
	            onDBLClick:function(){
	            	var repId = $("form#rep1002PopupFrm > #repId").val();
	            	//대상 경로
	            	var selRepPath = $("form#rep1002PopupFrm > #selRepPath").val();
	            	
					//배정된 요구사항 팝업
					var data = {
               			 "repId": repId
               			, "revision": this.item.revision
               			, "commitId": this.item.commitId
               			, "selRepPath": selRepPath
                	};
	 				gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1004View.do',data,"1265","565",'scroll');	
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
					var pars = svnSearchObj.getParam();
					var ajaxParam = $('form#rep1002PopupFrm').serialize();

					if(!gfnIsNull(pars)){
						ajaxParam += "&"+pars;
					}
					fnRepPopupGridListSet(this.page.selectPage, ajaxParam);
				}
	        } 
		});
	}
	
	//그리드 데이터 넣는 함수
	function fnRepPopupGridListSet(_pageNo,ajaxParam){
		//리비전 데이터 초기화 후 마스크 처리 하기
		$("#revisionFileList").html("리비전을 선택해주세요.");
		$("#revisionFileList").show();
		$("#rep1002FileTree").html('');
		
		//그리드 데이터 마스크 영역
		$("#repGridList").show();
		
		/* 그리드 데이터 가져오기 */
	   	//파라미터 세팅
	   	if(gfnIsNull(ajaxParam)){
	 			ajaxParam = $('form#rep1002PopupFrm').serialize();
	 		}
	   	
	   	//페이지 세팅
	   	if(!gfnIsNull(_pageNo)){
	   		ajaxParam += "&pageNo="+_pageNo;
	   	}else if(typeof repPopupGrid.page.currentPage != "undefined"){
	   		ajaxParam += "&pageNo="+repPopupGrid.page.currentPage;
	   	}
	
	   	//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1002RepositoryPageListAjaxView.do'/>","loadingShow": false}
				,ajaxParam);
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			//마지막 리비전 번호
			lastRevision = data.lastRevision;

			//반환 받은 리비전 번호 세팅
			axdom("#" + svnSearchObj.getItemId("startRevisionVal")).val(data.startRevision);
			axdom("#" + svnSearchObj.getItemId("endRevisionVal")).val(data.lastRevision);
			
			var list = data.list;
			var page = data.page;
			
		   	repPopupGrid.setData({
             	list:list,
             	page: {
					currentPage: _pageNo || 0,
					pageSize: page.pageSize,
					totalElements: page.totalElements,
					totalPages: page.totalPages
	    		}
		    });
		   	
		  	//그리드 데이터 마스크 영역
			$("#repGridList").hide();
		  
		   	//커밋로그 내용 제거
		   	$("#svnCommitLogDetail").val("");
		});
		
		//AJAX 전송
		ajaxObj.send();
	}
	
	//검색 상자
	function fnRepPopupSearchControl(){
		var pageID = "repSearchTarget";
		svnSearchObj = new AXSearch();
		
		// 현재일과 현재일 기준 한달전 날짜 기본세팅
		var defaultStDt = new Date(new Date().setMonth(new Date().getMonth()-1)).format('yyyy-MM-dd');
		var defaultEdDt = new Date().format('yyyy-MM-dd');
		
		var searchItem1 = {}; 
		var searchItem2 = {}; 
		if(repTypeCd != '03'){
			searchItem1 = {label:"리비전 범위", labelWidth:"", type:"inputText", width:"60", key:"startRevisionVal", addClass:"secondItem sendBtn", value:"",};
			searchItem2 = {label:"~", labelWidth:"20", type:"inputText", width:"60", key:"endRevisionVal", addClass:"secondItem sendBtn labelBorderNone", valueBoxStyle:"", value:"",};
			
		}
		
		var fnObjSearch = {
			pageStart: function(){
				//검색도구 설정 01 ---------------------------------------------------------
				svnSearchObj.setConfig({
					targetID:"repSearchTarget",
					theme : "AXSearch",
					rows:[
						{display:true, addClass:"", style:"", list:[
							{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"50", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
								options:[

	                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
	                                {optionValue:'author', optionText:'작성자'},
	                                {optionValue:'comment', optionText:'작성 내용'},
	                                {optionValue:'logDate', optionText:'작성 일자',optionType:"date"},
	                                
	                            ],onChange: function(selectedObject, value){
	                            	//선택 값이 전체목록인지 확인 후 입력 상자를 readonly처리
	    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
										axdom("#" + svnSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
										axdom("#" + svnSearchObj.getItemId("searchTxt")).val('');	
									}else{
										axdom("#" + svnSearchObj.getItemId("searchTxt")).removeAttr("readonly");
									}
									
									//공통코드 처리 후 select box 세팅이 필요한 경우 사용
									if(!gfnIsNull(selectedObject.optionCommonCode)){
										gfnCommonSetting(svnSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
									}
									//날짜 기간 검색시
									else if(!gfnIsNull(selectedObject.optionType) && selectedObject.optionType == "date"){
										axdom("#" + svnSearchObj.getItemId("searchTxt")).val('date');	
										axdom("#" + svnSearchObj.getItemId("searchStDate")).val(defaultStDt);	
										axdom("#" + svnSearchObj.getItemId("searchEdDate")).val(defaultEdDt);	
										$(".searchTxt").hide();
										$(".searchCd").hide();
										$(".searchStDate").show();
										$(".searchEdDate").show();
									}else{
										//공통코드 처리(추가 date range 작업이 아닌 경우 type=text를 나타낸다.)
										axdom("#" + svnSearchObj.getItemId("searchTxt")).val('');	
										$(".searchTxt").show();
										$(".searchCd").hide();
										$(".searchStDate").hide();
										$(".searchEdDate").hide();
									}
	    						},
							},
							{label:"", labelWidth:"", type:"inputText", width:"120", key:"searchTxt", addClass:"secondItem sendBtn searchTxt", valueBoxStyle:"padding-left:0px;", value:"",
								onkeyup:function(e){
									if(e.keyCode == '13' ){
										axdom("#" + svnSearchObj.getItemId("btn_search_svn")).click();
									}
								} 
							},
							{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox searchCd", valueBoxStyle:"padding-left:0px;", value:"01",
								options:[]
							},
							{label:"", labelWidth:"0", type:"inputText", width:"120", key:"searchStDate", addClass:"secondItem sendBtn searchStDate", value: defaultStDt,},
							{label:"~", labelWidth:"20", type:"inputText", width:"120", key:"searchEdDate", addClass:"secondItem sendBtn labelBorderNone searchEdDate", valueBoxStyle:"", value: defaultEdDt,},
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
				 							var pars = svnSearchObj.getParam();
										    var ajaxParam = $('form#rep1002PopupFrm').serialize();

										    if(!gfnIsNull(pars)){
										    	ajaxParam += "&"+pars;
										    }
											
								            fnRepPopupGridListSet(0,ajaxParam);
			    						}
							},
							searchItem1,
							searchItem2,
							{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
								onclick:function(){
									$(repPopupGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
							}},
							
							{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_svn",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
								onclick:function(){
									repPopupGrid.exportExcel("<c:out value='${sessionScope.selMenuNm }'/>.xls");
							}},
							{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_svn",style:"float:right;", valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
								onclick:function(){
									/* 검색 조건 설정 후 reload */
		 							var pars = svnSearchObj.getParam();
								    var ajaxParam = $('form#rep1002PopupFrm').serialize();

								    if(!gfnIsNull(pars)){
								    	ajaxParam += "&"+pars;
								    }
									
						            fnRepPopupGridListSet(0,ajaxParam);
						            
						            
						            //폼 데이터 변경
									$('#searchSelect').val(axdom("#" + svnSearchObj.getItemId("searchSelect")).val());
									$('#searchTxt').val(axdom("#" + svnSearchObj.getItemId("searchTxt")).val());
							}}
						]}
					]
				});
			}
		};
		
		jQuery(document.body).ready(function(){
			
			fnObjSearch.pageStart();
			//검색 상자 로드 후 텍스트 입력 폼 readonly 처리
			axdom("#" + svnSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
			
			//공통코드 selectBox, date hide 처리
			$(".searchCd").hide();
			$(".searchStDate").hide();
			$(".searchEdDate").hide();
			
			//기간 검색 달기
			gfnCalRangeSet(svnSearchObj.getItemId("searchStDate"), svnSearchObj.getItemId("searchEdDate"));

			//리비전 범위 세팅하기 - 최초 100개
			axdom("#" + svnSearchObj.getItemId("startRevisionVal")).val((lastRevision-100));
			axdom("#" + svnSearchObj.getItemId("endRevisionVal")).val(lastRevision);

		});
	}
	//axisj5 그리드
	function fnSelRepPopupGridView(){
		//소스 저장소별 컬럼
		var columns = [];
		//git
		if(repTypeCd == "01"){
			columns = [
				{key: "revision", label: "Revision", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 200, align: "center"},
				{key: "comment", label: "Comment", width: 500, align: "left"}
	         ];
		}
		//svn
		else if(repTypeCd == "02"){
			columns = [
				{key: "revision", label: "Revision", width: 80, align: "right"},
				{key: "pathCnt", label: "Changes", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 200, align: "center"},
				{key: "comment", label: "Comment", width: 500, align: "left"}
	         ];
		}
		//gitlab
		else if(repTypeCd == "03"){
			columns = [
				{key: "commitId", label: "Commit ID", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 200, align: "center"},
				{key: "comment", label: "Comment", width: 500, align: "left"}
	         ];
		}
		
		selRepPopupGrid = new ax5.ui.grid();
	 
		selRepPopupGrid.setConfig({
			target: $('[data-ax5grid="selRep-grid"]'),
			showRowSelector: true,
			sortable:false,
			header: {align:"center",columnHeight: 30},
			frozenColumnIndex: 4,
			columns: columns,
	         body: {
				align: "center",
				columnHeight: 30,
	            onClick:function(){
	            	// 클릭 이벤트
	   				this.self.select(this.doindex, {selected: !this.item.__selected__});	
	            	
	            	//커밋로그
					$("#svnCommitLogDetail").val(this.item.comment);
	            	/* 
	            	//리비전 파일목록 세팅
					fnSearchFileDirTree(this.item.revision, this.item.commitId);
	            	
	            	//리비전 그리드 목록 세팅
	            	fnFileGridView();
	            	
	            	//선택 리비전 갱신
	            	selRevision = this.item.revision;
	            	selCommitId = this.item.commitId;
	            	 */
	            },
	            onDBLClick:function(){
	            	var repId = $("form#rep1002PopupFrm > #repId").val();
	            	//대상 경로
	            	var selRepPath = $("form#rep1002PopupFrm > #selRepPath").val();
					//배정된 요구사항 팝업
					var data = {
               			 "repId": repId
               			, "revision": this.item.revision
               			, "commitId": this.item.commitId
               			, "selRepPath": selRepPath
                	};
	 				gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1004View.do',data,"1100","690",'scroll');	
                }
			}
		});
	}
	
	function fnRep1002GuideShow(){
		var mainObj = $(".main_contents");
		
		//mainObj가 없는경우 false return
		if(mainObj.length == 0){
			return false;
		}
		//guide box setting
		var guideBoxInfo = globals_guideContents["rep1002"];
		gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
	}
</script>

<div class="main_contents" style="height: auto;" >
	<div class="tab_contents menu rep1002_${requestScope.type}" style="width:1300px;">
		<form id="rep1002PopupFrm" name="rep1002PopupFrm" method="post">
			<input type="hidden" name="repId" id="repId" value="${requestScope.repId}" />
			<input type="hidden" name="svnRepUrl" id="svnRepUrl" value="${repInfo.svnRepUrl}" />
			<input type="hidden" name="svnUsrId" id="svnUsrId" value="${repInfo.svnUsrId}" />
			<input type="hidden" name="svnUsrPw" id="svnUsrPw" value="${repInfo.svnUsrPw}" />
			<input type="hidden" name="repTypeCd" id="repTypeCd" value="${repInfo.repTypeCd}" />
			<input type="hidden" name="selRepPath" id="selRepPath" value="/" />
			<input type="hidden" name="ciId" id="ciId" value="${requestScope.ciId }"/>
			<input type="hidden" name="ticketId" id="ticketId" value="${requestScope.ticketId }"/>
			<input type="hidden" name="apiId" id="apiId" value="${requestScope.apiId }"/>
			<input type="hidden" name="svcId" id="svcId" value="${requestScope.svcId }"/>
			<input type="hidden" name="fId" id="fId" value="${requestScope.fId }"/>
			<input type="hidden" name="eGeneUrl" id="eGeneUrl" value="${requestScope.eGeneUrl }"/>
			<input type="hidden" name="callbakApiId" id="callbakApiId" value="${requestScope.callbakApiId }"/>
			<input type="hidden" name="type" id="type" value="${requestScope.type}"/>
		</form>
		<div class="rep1002LeftFrame">
			<div class="sub_title">
				소스저장소 하위 1depth 목록
			</div>
			<div class="rep1002RepSubTreeFrame rep1002FrameBox">
				<ul id="rep1002SubDirTree" class="ztree"></ul>
			</div>
		</div>
		<div class="rep1002RightFrame">
			<div class="svn_mask_repList" id="repGridList">
				좌측에서 리비전 목록 대상을 선택해주세요.
			</div>
			<div class="sub_title">
			소스저장소 상세정보 [ 선택 저장소: <span id="repNm"> </span> ]
			</div>
			<div class="rep1002SearchFrame rep1002FrameBox" id="repSearchTarget" guide="rep1002RepBtn"></div>
			<div class="rep1002RevisionFrame rep1002FrameBox">
				<div data-ax5grid="rep-grid" data-ax5grid-config="{}" guide="rep1002RepList"></div>	
			</div>
			<div class="rep1002CommitLogFrame rep1002FrameBox">
				<textarea id="svnCommitLogDetail" class="svnCommitLogDetail" readonly="readonly" guide="rep1002RepCommitLog"></textarea>
			</div>
			<div class="rep1002SelRivsionBtnFrame">
				<button type="button" class="AXButton revisionAddDelBtn" id="selRevisionAddBtn"><i class="fa fa-arrow-alt-circle-down"></i>&nbsp;추가</button>
				<button type="button" class="AXButton revisionAddDelBtn" id="selRevisionDelBtn"><i class="fa fa-arrow-alt-circle-up"></i>&nbsp;제거</button>
			</div>
			<div class="sub_title selRvTitle">
				선택 리비전 목록
			</div>
			<div class="rep1002SelRivisionFrame">
				<div data-ax5grid="selRep-grid" data-ax5grid-config="{}" style="height: 250px;" guide="rep1002SelRepList"></div>	
			</div>
		</div>
		<div class="btnFrame">
			<c:if test="${empty requestScope.type or requestScope.type ne 'local' }">
				<div class="mainPopupBtn" id="repDataSendBtn"><i class="fas fa-paperclip"></i>&nbsp;리비전 선택 완료</div>
			</c:if>
			<div class="mainPopupBtn" id="repDetailCloseBtn">닫기</div>
		</div>
	</div>
</div>
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />