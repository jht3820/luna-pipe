<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>
<link rel='stylesheet' href='<c:url value='/css/lunaops/rep.css'/>' type='text/css'>
<script type="text/javascript" src="/js/ztree/jquery.ztree.all.min.js"></script>
<style>
	.groupClear {height: 0;}
	.layer_popup_box .popup{overflow:hidden !important;}
</style>
<script>
	//상단 리비전 검색
	var svnSearchObj;
	
	//그리드
	var repPopupGrid;
	
	var repTypeCd = "";
	
	//zTree (리비전 선택 파일, 선택 노드)
	var zTree, revisionFileList;
	
	//마지막 리비전 번호
	var lastRevision;
	
	//리비전 파일 내용 목록 출력 갯수
	var revisionFilePahtListCnt = 30;
	
	//선택 리비전
	var selRevision;
	//선택 커밋 ID
	var selCommitId;
	
	//소스저장소 정보
	var globals_repInfo;

	//스크립트 초기화
	$(document).ready(function(){
		//가이드 상자 호출
		gfnGuideStack("add",fnRep1002GuideShow);
		
		//소스저장소 접속 체크
		svnConnCheck();
		
		//닫기 버튼
		$("#repDetailCloseBtn").click(function(){
			window.close();
		});
		//리비전 선택 버튼
		$("#repDataSendBtn").click(function(){
			//팝업이 아닌 경우 동작 안함
			if(opener){
				var repId = $("form#rep1002PopupFrm > #repId").val();
				//callback function 값
				var rtnValue = [];
				
				//선택한 JOB
				var selRepList = repPopupGrid.getList("selected");
				
				//선택된 리비전 없는 경우
				if (gfnIsNull(selRepList)) {
					jAlert("선택한  리비전이 없습니다.</br>리비전을 선택해주세요.", "알림창");
					return false;
				}
				//선택된 리비전번호 문구
				var addMsg = "";
				$.each(selRepList, function(idx, map){
					if(idx > 0){
						addMsg += ", ";
					}
					addMsg += map.revision;
					
					//반환값 세팅
					var repInfo = {
						"rep_id": repId
						, "revision": map.revision
						, "comment": map.comment
						, "author": map.author
						, "logDate": map.logDate
						, "sDate": map.sDate
						, "svnFileList": map.svnFileList
					}
					
					rtnValue.push(repInfo);
				});
				console.log(rtnValue);
				jConfirm("선택된 리비전 "+selRepList.length+"개를 연결하시겠습니까?</br></br>[선택 리비전]</br>"+addMsg,"알림창", function(result){
					if(result){
						//function 체크
						if(typeof opener.parent.setRepItems == "function"){
							opener.parent.setRepItems(rtnValue);
						}
						window.close();
					}
				});
				
			}
		});
	});

	
	//소스저장소 접속 체크
	function svnConnCheck(){
		var repId = $("form#rep1002PopupFrm > #repId").val();
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1000ConfirmConnect.do'/>","loadingShow": false, "async": false}
				,{ "repId" : repId, "gitRepUrlCheckCd": "Y" });
		
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
			if(data.MSG_CD =="REP_OK"){
				//마지막 리비전 번호
				lastRevision = data.lastRevisionNum;
				
				//소스저장소 정보
				var globals_repInfo = data.repInfo;
				
				//소스저장소 종류
				repTypeCd = globals_repInfo.repTypeCd;
				
				
				//리비전 목록
				fnRepPopupGridView();
				
				//상단 검색 영역
				fnRepPopupSearchControl();
				
				//소스저장소 명
				$("#repNm").text(globals_repInfo.repNm);
			}else{
				// 그외 접속 불가인경우 팝업창 닫기
				gfnLayerPopupClose();
				jAlert("소스저장소 연결에 실패했습니다.", "알림창");
			} 	
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
				{key: "sDate", label: "Date", width: 250, align: "center"},
				{key: "comment", label: "Comment", width: 900, align: "left"}
	         ];
		}
		//svn
		else if(repTypeCd == "02"){
			columns = [
				{key: "revision", label: "Revision", width: 80, align: "right"},
				{key: "pathCnt", label: "Changes", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 250, align: "center"},
				{key: "comment", label: "Comment", width: 900, align: "left"}
	         ];
		}
		//gitlab
		else if(repTypeCd == "03"){
			columns = [
				{key: "commitId", label: "Commit ID", width: 80, align: "right"},
				{key: "author", label: "Author", width: 120, align: "center"},
				{key: "sDate", label: "Date", width: 250, align: "center"},
				{key: "comment", label: "Comment", width: 900, align: "left"}
	         ];
		}
		
		repPopupGrid = new ax5.ui.grid();
	 
		repPopupGrid.setConfig({
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
	            	
	            	//리비전 파일목록 세팅
					fnSearchFileDirTree(this.item.revision, this.item.commitId);
	            	
	            	//리비전 그리드 목록 세팅
	            	fnFileGridView();
	            	
	            	//선택 리비전 갱신
	            	selRevision = this.item.revision;
	            	selCommitId = this.item.commitId;
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
		fnFileGridView();
		
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

			//그리드 데이터 불러오기
			fnRepPopupGridListSet();
		});
	}
	

	function fnSearchFileDirTree(revisionIndex, commitId){
		var data = {"revision" : revisionIndex, "commitId" : commitId , "repId" : $('#repId').val()};
		
		//AJAX 설정
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/rep/rep1000/rep1000/selectRep1002FileDirAjaxList.do'/>","loadingShow": false}
				,data);
		
		//AJAX 전송 성공 함수
		ajaxObj.setFnSuccess(function(data){
			
	    
			//오류
			if(data.errorYn == "Y"){
				$("#revisionFileList").html(data.consoleText);
				$("#revisionFileList").show();
			}else{
		    	toast.push(data.message);
		    	
		    	// zTree 설정 
			    var setting = {
			        data: {
			        	key: {
							name: "name"
						},
			            simpleData: {
			                enable: true,
			                idKey: "currentKey",
							pIdKey: "parentKey",
							rootPId: "Root"
			            }
			        },
					callback: {
						onClick: function(event, treeId, treeNode){
							//우측 메뉴 정보
							getRepRevisionFileList(treeNode, revisionFileList);
						}
					},
					view : {
						fontCss: function(treeId, treeNode){
							return {};
						},
						showIcon : function(treeId, treeNode) {
							if(typeof zTree != "undefined" && treeNode.level != 3 && !treeNode.isParent){
								treeNode.isParent = true;
								zTree.refresh();	
							}
							return true;
						}
					}
			    };
		    	
			    revisionFileList = data.revisionFileList;
			    var dirList = data.revisionDirList;
			    // zTree 초기화
			    zTree = $.fn.zTree.init($("#rep1002FileTree"), setting, dirList);
			    
			    if(dirList.length >0){
			    	//리비전 파일목록 mask hide
			    	$("#revisionFileList").hide();
			    	getRepRevisionFileList(null,revisionFileList);
			    	zTree.expandAll(true);
			    	zTree.refresh();
			    }else{
			    	//리비전 파일목록 mask show
			    	$("#revisionFileList").show();
			    }
			}
		});
		
		//AJAX 전송
		ajaxObj.send();
	}
	
	//axisj5 그리드
	function fnFileGridView(){
		filePathGrid = new ax5.ui.grid();
 
		filePathGrid.setConfig({
            target: $('[data-ax5grid="filePath-grid"]'),
            sortable:false,
            header: {align:"center",columnHeight: 30},
            frozenColumnIndex: 2,
            columns: [
				{key: "type", label: "type", width: 100, align: "left"},
				{key: "name", label: "name", width: 300, align: "left"},
				{key: "path", label: "path", width: 600, align: "left"}
				
            ],
            body: {
                align: "center",
                columnHeight: 30,
                onDBLClick:function(){
                	var data = {"revision" : selRevision, "commitId" : selCommitId ,"path": this.item.path, "name": this.item.name, "repId" : $("#repId").val()}; 
					gfnLayerPopupOpen("/rep/rep1000/rep1000/selectRep1003View.do", data, "1200", "780",'auto');
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
                    {type: "revisionFileList", label: "대상 파일 리비전 목록", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
                ],
                popupFilter: function (item, param) {
                	var selItem = filePathGrid.list[param.doindex];
                	//선택 개체 없는 경우 중지
                	if(typeof selItem == "undefined"){
                		return false;
                	}
                	return true;
                },
                onClick: function (item, param) {
                	var selItem = filePathGrid.list[param.doindex];

                    if(item.type == "revisionFileList"){
            			//리비전 최소 범위
            			var startRevision = (lastRevision-100);
            			if(startRevision < 0){
            				startRevision = 0;
            			}
            			
                    	//배정된 요구사항 팝업
    					var data = {
                    			 "repId": $('#repId').val()
                    			, "revisionNum": selRevision
                    			, "commitId": selCommitId
                    			, "filePath": selItem.path
                    			, "startRevision": startRevision
                    			, "lastRevision": lastRevision
                    			, "selRevision": selRevision
                    			, "selCommitId": selCommitId
                    			, "fileName": selItem.name
                    			, "repTypeCd": repTypeCd
                    			};
    	 				gfnLayerPopupOpen('/rep/rep1000/rep1000/selectRep1005View.do',data,"1100","680",'scroll');	
                    }
                    filePathGrid.contextMenu.close();
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
                	getRepRevisionFileList(zTree.getSelectedNodes()[0], revisionFileList, this.page.selectPage);
                }
            }
           
        });
	}
	
	//리비전 파일 목록 불러오기	
	function getRepRevisionFileList(node, dataList, _pageNo){
		var returnList = [];
		var tmpList = [];
		
		//페이지 없는경우 0페이지
		if(gfnIsNull(_pageNo)){
			_pageNo = 0;
		}
		
		//시작점  (현재 페이지번호 * 표시 갯수)
		var firstIndex = (_pageNo * revisionFilePahtListCnt);
		
		//종료점 (시작점 + 표시 갯수)
		var lastIndex = (firstIndex + revisionFilePahtListCnt);
		
		//node값이 null인경우 전체 file 출력
		if(node == null){
			tmpList = dataList;
		}else{	//노드 정해져있는 경우 (좌측 디렉토리 선택)
			var selectKey = node.currentKey;
			$(dataList).each(function(index, item){
				//키 값이 같은 경우만 출력
				if(item.currentKey.indexOf(selectKey)==0){
					tmpList.push(item);	
				}
			});
		}
		
		//파일 목록 전체 갯수
		var totalFileCnt = tmpList.length;
		
		//페이지 수
		var totalPageCount = parseInt(((totalFileCnt - 1) / revisionFilePahtListCnt) + 1);
		
		//페이지 수 만큼 가져오기
		for(var i=firstIndex;i<lastIndex;i++){
			returnList.push(tmpList[i]);
		}
		
		//그리드 데이터 넣기
		filePathGrid.setData({
         	list:returnList,
         	page: {
				currentPage: _pageNo || 0,
				pageSize: revisionFilePahtListCnt,
				totalElements: totalFileCnt,
				totalPages: totalPageCount
    		}
	    });
		
		return returnList;
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
	<div class="tab_contents menu" style="width:1300px;">
		<form id="rep1002PopupFrm" name="rep1002PopupFrm" method="post">
			<input type="hidden" name="repId" id="repId" value="${param.repId}" />
		</form>
		<div class="sub_title">
			소스저장소 상세정보 [ 선택 저장소: <span id="repNm"></span> ]
		</div>
		<div class="rep1002SearchFrame rep1002FrameBox" id="repSearchTarget" guide="rep1002RepBtn"></div>
		<div class="rep1002RevisionFrame rep1002FrameBox">
			<div class="svn_mask_repList" id="repGridList">
				데이터를 조회중입니다.</br></br>
				<img class="fixed_loading" src="/images/loading.gif" style="width: 100px;height: 100px;">
			</div>
			<div data-ax5grid="rep-grid" data-ax5grid-config="{}" style="height: 250px;" guide="rep1002RepList"></div>	
		</div>
		<div class="rep1002CommitLogFrame rep1002FrameBox">
			<textarea id="svnCommitLogDetail" class="svnCommitLogDetail" readonly="readonly" guide="rep1002RepCommitLog"></textarea>
		</div>
		<div class="rep1002FileMainFrame" guide="rep1002RepChgLog">
			<div class="svn_mask_content" id="revisionFileList">리비전을 선택해주세요.</div>
			<div class="rep1002FileTreeFrame rep1002FrameBox">
				<ul id="rep1002FileTree" class="ztree"></ul>
			</div>
			<div class="rep1002FileListFrame rep1002FrameBox">
				<div data-ax5grid="filePath-grid" data-ax5grid-config="{}" style="height: 300px;"></div>
			</div>
		</div>
		<div class="btnFrame">
			<div class="mainPopupBtn" id="repDataSendBtn"><i class="fas fa-paperclip"></i>&nbsp;리비전 선택</div>
			<div class="mainPopupBtn" id="repDetailCloseBtn">닫기</div>
		</div>
	</div>
</div>
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />