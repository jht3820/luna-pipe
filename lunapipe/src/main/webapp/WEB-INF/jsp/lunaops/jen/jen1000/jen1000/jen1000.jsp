<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/lunaops/top/header.jsp" %>

<link rel='stylesheet' href='<c:url value='/css/lunaops/jen.css'/>' type='text/css'>
<style type="text/css">
	.accptFont{color:#4b73eb !important;text-shadow: none !important;}
	.rejectFont{color:#eb4b6a !important;text-shadow: none !important;}
	.defaultFont{color:#000 !important;}
	
</style>
<script>
var jenkinsGrid, jobGrid, selJobGrid;
var jenkinsSearchObj, jobSearchObj, selJobSearchObj;


$(function(){
	
	fnJenkinsGridSetting();
	fnJenkinsSearchSetting();
	
	
	fnJobGridSetting();
	fnJobSearchSetting();
	
	
	fnSelJobGridSetting();
	fnSelJobSearchSetting();
	
	
	gfnGuideStack("add",fnJen1000GuideShow);
});


function fnJenkinsGridSetting(){
	jenkinsGrid = new ax5.ui.grid();
 
        jenkinsGrid.setConfig({
            target: $('[data-ax5grid="jenkinsGrid"]'),
            
            sortable:false,
            header: {align:"center",columnHeight: 30},
            columns: [
				{key: "result", label: " ", width: 30, align: "center"
					,formatter:function(){
						var result = this.item.result;
						var faIcon = '';
						
						
						if(result == "fail"){
							faIcon = "times-circle";
						}
						else if(result == "success"){
							faIcon = "check-circle";
						}else if(result == "progress"){
							faIcon = "circle-notch fa-spin";
						}else{
							faIcon = "circle";
						}
						
						return '<i class="fas fa-'+faIcon+' result-'+result+'"></i>';
					}},
				{key: "jenNm", label: "JENKINS NAME", width: 180, align: "center"},
				{key: "jenUrl", label: "JENKINS URL", width: 280, align: "left"},
				{key: "jenUsrId", label: "JENKINS USER ID", width: 130, align: "center"},
				{key: "useNm", label: "사용유무", width: 85, align: "center"}
            ],
            body: {
                align: "center",
                columnHeight: 30,
                onClick:function(){
                	
                    this.self.select(jenkinsGrid.selectedDataIndexs[0]);
                	
                	
                    this.self.select(this.doindex);
                	
                	
                	$("#selJenkinsNm").text(this.item.jenNm);
                	
                	 
 					fnInJobGridListSet(0,jobSearchObj.getParam()+"&jenId="+this.item.jenId,false);
                },
                onDBLClick:function(){
                		var data = {"jenNm": this.item.jenNm,"jenId": this.item.jenId, "jenUrl": this.item.jenUrl, "jenUsrId":this.item.jenUsrId, "jenUsrTok": this.item.jenUsrTok};
						gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1003JenkinsDetailView.do',data,"1200","595",'scroll');
                }
            },
            contextMenu: {
        		iconWidth: 20,
        		acceleratorWidth: 100,
        		itemClickAndClose: false,
        		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
        		items: [
        			{type: "usrDetailPopup", label: "JENKINS 저장소 등록자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"}
        		],
        		popupFilter: function (item, param) {
        			
        			
        			if(typeof param.item == "undefined"){
          				return false;
         			}
        				return true;
        			},
        		onClick: function (item, param) {
        			var selItem = param.item;
        			
        			if(item.type == "usrDetailPopup"){
                  		if(gfnIsNull(selItem.regUsrId)){
                			jAlert('JENKINS 저장소 등록자가 없습니다.','알림창');
        					return false;
                		}else{
                			var data = {"usrId": param.item.regUsrId}; 
        					gfnLayerPopupOpen("/cmm/cmm1000/cmm1900/selectCmm1900View.do", data, "500", "370",'auto');
                		}
                	}
        			
        			param.gridSelf.contextMenu.close();
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
                   fnInJenkinsGridDataSet(this.page.selectPage,jenkinsSearchObj.getParam());
                }
            } 
        });
        
 		fnInJenkinsGridDataSet();
}


function fnInJenkinsGridDataSet(_pageNo,ajaxParam){
     	
     	
     	if(gfnIsNull(ajaxParam)){
   			ajaxParam = $('form#searchFrm').serialize();
   		}
     	
     	
     	if(!gfnIsNull(_pageNo)){
     		ajaxParam += "&pageNo="+_pageNo;
     	}else if(typeof jenkinsGrid.page.currentPage != "undefined"){
     		ajaxParam += "&pageNo="+jenkinsGrid.page.currentPage;
     	}
     	
     	
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JenkinsListAjax.do'/>","loadingShow":true}
				,ajaxParam);
		
		ajaxObj.setFnSuccess(function(data){
			data = JSON.parse(data);
			var list = data.list;
			var page = data.page;
			
		   	jenkinsGrid.setData({
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


function fnJobGridSetting(){
	jobGrid = new ax5.ui.grid();
 
        jobGrid.setConfig({
            target: $('[data-ax5grid="jobGrid"]'),
            showRowSelector: true,
            sortable:false,
            header: {align:"center",columnHeight: 30},
            columns: [
				{key: "result", label: " ", width: 30, align: "center"
					,formatter:function(){
						var result = this.item.result;
						var faIcon = '';
						
						
						if(result == "fail"){
							faIcon = "times-circle";
						}
						else if(result == "success"){
							faIcon = "check-circle";
						}else if(result == "progress"){
							faIcon = "circle-notch fa-spin";
						}else{
							faIcon = "circle";
						}
						
						return '<i class="fas fa-'+faIcon+' result-'+result+'"></i>';
					}},
				{key: "jobTypeNm", label: "JOB TYPE", width: 95, align: "center"},
				{key: "jobId", label: "JOB ID", width: 170, align: "center"},
				{key: "jobRestoreId", label: "원복 JOB ID", width: 170, align: "center"},
				{key: "jobParameter", label: "JOB 매개변수", width: 150, align: "center"
					,formatter:function(){
						var jobParameter = this.item.jobParameter;
						
						if(gfnIsNull(jobParameter)){
							jobParameter = '-';
						}
						return jobParameter;
					}
				},
				
				{key: "useNm", label: "사용유무", width: 80, align: "center"}
            ],
            body: {
                align: "center",
                columnHeight: 30,
                onDBLClick:function(){
                		var data = {"jenId": this.item.jenId, "jobId": this.item.jobId};
						gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1004JobDetailView.do',data,"1200", "870",'scroll');
                }
            } ,
            page: {
                navigationItemCount: 9,
                height: 30,
                display: true,
                firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
                prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
                nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
                lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
                onChange: function () {
                	var item = jenkinsGrid.getList('selected')[0];
					if(gfnIsNull(item)){
						toast.push('상단 목록에서 JENKINS를 선택해주세요.');
						return;
					}
					
					
		            fnInJobGridListSet(this.page.selectPage,jobSearchObj.getParam()+"&jenId="+item.jenId,true);
                }
            } 
        });
}


function fnInJobGridListSet(_pageNo,ajaxParam,loadingShow){
     	
     	
     	if(gfnIsNull(ajaxParam)){
   			ajaxParam = $('form#searchFrm').serialize();
   		}
     	
     	
     	if(!gfnIsNull(_pageNo)){
     		ajaxParam += "&pageNo="+_pageNo;
     	}else if(typeof jenkinsGrid.page.currentPage != "undefined"){
     		ajaxParam += "&pageNo="+jobGrid.page.currentPage;
     	}
     	
     	
		var ajaxObj = new gfnAjaxRequestAction(
				{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JobListAjax.do'/>","loadingShow":loadingShow}
				,ajaxParam);
		
		ajaxObj.setFnSuccess(function(data){
			data = JSON.parse(data);
			var list = data.list;
			var page = data.page;
			
		   	jobGrid.setData({
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



function fnDeleteJen1000JenkinsInfo(jenId){
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/deleteJen1000JenkinsInfoAjax.do'/>"}
			,{ "jenId" : jenId });
	
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
		fnInJenkinsGridDataSet();
		
		var gridList = jobGrid.getList();
		if(!gfnIsNull(gridList) && gridList.length > 0){
			$.each(gridList,function(){
				jobGrid.removeRow(0);
			});
		}
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
	});
	
	
	ajaxObj.send();
} 


function fnDeleteJen1000JobInfo(jenId, jobId){
	
	var ajaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/deleteJen1000JobInfoAjax.do'/>"}
			,{ "jenId" : jenId, "jobId" : jobId });
	
	ajaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
		fnInJobGridListSet(0,jobSearchObj.getParam()+"&jenId="+jenId);
	});
	
	
	ajaxObj.setFnError(function(xhr, status, err){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
	});
	
	
	ajaxObj.send();
} 


function fnJenkinsSearchSetting(){
	jenkinsSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			
			jenkinsSearchObj.setConfig({
				targetID:"AXSearchTarget-jenkins",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"30", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
							options:[
                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
                                {optionValue:'jenNm', optionText:'Jenkins 명'},
                                {optionValue:'jenDesc', optionText:'Jenkins 설명'},
                                {optionValue:'useCd', optionText:'사용 여부' , optionCommonCode:"CMM00001" }                                
                                
                            ],onChange: function(selectedObject, value){
                            	
    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
									axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(jenkinsSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									
									axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).show();
									axdom("#" + jenkinsSearchObj.getItemId("searchCd")).hide();
								}
    						},

						},
						{label:"", labelWidth:"", type:"inputText", width:"128", key:"searchTxt", addClass:"secondItem sendBtn", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + jenkinsSearchObj.getItemId("btn_search_jenkins")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						{label:"", labelWidth:"", type:"button", width:"80",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<span>전체 접속확인</span>",
       							onclick:function(){
       								
       								var gridLen = jenkinsGrid.getList().length;
       								
       								
       								if(gridLen > 0){
       									
       									fnSelectJen1000AllConfirmConnect(0);
       								}
                    	}},
						{label:"", labelWidth:"", type:"button", width:"100",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<i class='fas fa-angle-double-right' aria-hidden='true'></i>&nbsp;<span>선택 접속확인</span>",
   							onclick:function(){
   								var item = jenkinsGrid.getList('selected')[0];
   								if(gfnIsNull(item)){
   									toast.push('확인 할 목록을 선택하세요.');
   									return;
   								}
   								fnSelectJen1000ConfirmConnect(item.jenId,  jenkinsGrid.getList('selected')[0].__index );
                		}}
					]},
					{display:true, addClass:"", style:"", list:[
                    						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
							onclick:function(){
								$(jenkinsGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
						}},
						{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
							onclick:function(){
								jenkinsGrid.exportExcel("JENKINS_LIST.xls");
						}},
						{label : "",labelWidth : "",type : "button",width : "55",key : "btn_delete_jenkins",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-trash-alt' aria-hidden='true'></i>&nbsp;<span>삭제</span>",
							onclick : function() {
								var item = jenkinsGrid.getList('selected')[0];
								if(gfnIsNull(item)){
									toast.push('삭제 할 목록을 선택하세요.');
									return;
								}
								jConfirm("JENKINS를 삭제하시겠습니까?</br>연관된 모든 정보가 함께 삭제됩니다.", "알림창", function( result ) {
									if( result ){
										fnDeleteJen1000JenkinsInfo(item.jenId);
									}
								});
							}
						},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_update_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-edit' aria-hidden='true'></i>&nbsp;<span>수정</span>",
							onclick:function(){
								var item = jenkinsGrid.getList('selected')[0];
								if(gfnIsNull(item)){
									toast.push('수정 할 목록을 선택하세요.');
									return;
								}
								
								var data = {"popupGb": "update", "jenId": item.jenId};
        	                	
								gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1001JenkinsDetailView.do',data,"650","590",'scroll');
						}},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_insert_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-save' aria-hidden='true'></i>&nbsp;<span>등록</span>",
							onclick:function(){
								var data = {
									"popupGb": "insert"
								};
								gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1001JenkinsDetailView.do',data,"650","590",'scroll');
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_jenkins",style:"float:right;",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								
					            fnInJenkinsGridDataSet(0,jenkinsSearchObj.getParam());
								
								
								axdom("#" + jobSearchObj.getItemId("searchSelect")).val(0).change();
					            jobGrid.setData([]);
						}}
                    	]
                  		},
				]
			});
		}
		
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		
		axdom("#" + jenkinsSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		
		axdom("#" + jenkinsSearchObj.getItemId("searchCd")).hide();
	});
}


function fnJobSearchSetting(){
	jobSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			
			jobSearchObj.setConfig({
				targetID:"AXSearchTarget-job",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"<i class='fa fa-search'></i>&nbsp;", labelWidth:"30", type:"selectBox", width:"", key:"searchSelect", addClass:"", valueBoxStyle:"", value:"all",
							options:[
                                {optionValue:"0", optionText:"전체 보기",optionAll:true},
                                {optionValue:'jobId', optionText:'JOB ID'},
                                {optionValue:'jobDesc', optionText:'JOB 설명'},
                                {optionValue:'useCd', optionText:'사용 여부' , optionCommonCode:"CMM00001" }                                
                                
                            ],onChange: function(selectedObject, value){
                            	
    							if(!gfnIsNull(selectedObject.optionAll) && selectedObject.optionAll == true){
									axdom("#" + jobSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");	
									axdom("#" + jobSearchObj.getItemId("searchTxt")).val('');	
								}else{
									axdom("#" + jobSearchObj.getItemId("searchTxt")).removeAttr("readonly");
								}
								
								
								if(!gfnIsNull(selectedObject.optionCommonCode)){
									gfnCommonSetting(jobSearchObj,selectedObject.optionCommonCode,"searchCd","searchTxt");
								}else{
									
									axdom("#" + jobSearchObj.getItemId("searchTxt")).show();
									axdom("#" + jobSearchObj.getItemId("searchCd")).hide();
								}
    						},

						},
						{label:"", labelWidth:"", type:"inputText", width:"148", key:"searchTxt", addClass:"secondItem sendBtn", valueBoxStyle:"padding-left:0px;", value:"",
							onkeyup:function(e){
								if(e.keyCode == '13' ){
									axdom("#" + jobSearchObj.getItemId("btn_search_jenkins")).click();
								}
							} 
						},
						{label:"", labelWidth:"", type:"selectBox", width:"100", key:"searchCd", addClass:"selectBox", valueBoxStyle:"padding-left:0px;", value:"01",
							options:[]
						},
						{label:"", labelWidth:"", type:"button", width:"80",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<span>전체 접속확인</span>",
       							onclick:function(){
       								
       								var gridLen = jobGrid.getList().length;
       								
       								
       								if(gridLen > 0){
       									
										var gridJobInfo = jobGrid.getList()[0];
										var jenId = gridJobInfo.jenId;
										var jobId = gridJobInfo.jobId;
       									
       									fnSelectJen1000JobConfirmConnect("all",jenId, jobId, 0);
       								}else{
       									toast.push("JOB이 존재하지 않습니다.");
       								}
                    	}},
						{label:"", labelWidth:"", type:"button", width:"100",style:"float:right;", key:"btn_search_jenkins_connect",valueBoxStyle:"padding:5px;", value:"<i class='fas fa-angle-double-right' aria-hidden='true'></i>&nbsp;<span>선택 접속확인</span>",
   							onclick:function(){
   								var item = (!gfnIsNull(Object.keys(jobGrid.focusedColumn)))? jobGrid.list[jobGrid.focusedColumn[Object.keys(jobGrid.focusedColumn)].doindex]:null;
   								if(gfnIsNull(item)){
   									toast.push('확인 할 목록을 선택하세요.');
   									return;
   								}
   								fnSelectJen1000JobConfirmConnect("normal",item.jenId,item.jobId, jobGrid.focusedColumn[Object.keys(jobGrid.focusedColumn)].doindex );
                		}}
					]},
					{display:true, addClass:"", style:"", list:[
                    						
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_print_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-print' aria-hidden='true'></i>&nbsp;<span>프린트</span>",
							onclick:function(){
								$(jobGrid.exportExcel()).printThis({importCSS: false,importStyle: false,loadCSS: "/css/common/printThis.css"});
						}},
						{label:"", labelWidth:"", type:"button", width:"55",style:"float:right;", key:"btn_excel_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-file-excel' aria-hidden='true'></i>&nbsp;<span>엑셀</span>",
							onclick:function(){
								jobGrid.exportExcel("JENKINS-JOB_LIST.xls");
						}},
						{label : "",labelWidth : "",type : "button",width : "55",key : "btn_delete_jenkins",style : "float:right;",valueBoxStyle : "padding:5px;",value : "<i class='fa fa-trash-alt' aria-hidden='true'></i>&nbsp;<span>삭제</span>",
							onclick : function() {
								var item = (!gfnIsNull(Object.keys(jobGrid.focusedColumn)))? jobGrid.list[jobGrid.focusedColumn[Object.keys(jobGrid.focusedColumn)].doindex]:null;
								if(gfnIsNull(item)){
									toast.push('삭제 할 목록을 선택하세요.');
									return;
								}
								jConfirm("JOB을 삭제하시겠습니까?</br>연관된 모든 정보가 함께 삭제됩니다.", "알림창", function( result ) {
									if( result ){
										fnDeleteJen1000JobInfo(item.jenId,item.jobId);
									}
								});
							}
						},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_update_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-edit' aria-hidden='true'></i>&nbsp;<span>수정</span>",
							onclick:function(){
								var item = (!gfnIsNull(Object.keys(jobGrid.focusedColumn)))? jobGrid.list[jobGrid.focusedColumn[Object.keys(jobGrid.focusedColumn)].doindex]:null;
								if(gfnIsNull(item)){
									toast.push('수정 할 목록을 선택하세요.');
									return;
								}

								var data = {"popupGb": "update", "jenId": item.jenId, "jobId": item.jobId};
        	                	
								gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1002JobDetailView.do',data,"650","585",'scroll',false);
						}},
						{label:"", labelWidth:"", type:"button", width:"60",style:"float:right;", key:"btn_insert_jenkins",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-save' aria-hidden='true'></i>&nbsp;<span>등록</span>",
							onclick:function(){
								var item = jenkinsGrid.getList('selected')[0];
								var data = {
									"popupGb": "insert",
									"selJenId": (!gfnIsNull(item))? item.jenId : null
								};
								gfnLayerPopupOpen('/jen/jen1000/jen1000/selectJen1002JobDetailView.do',data,"1000","540",'scroll',false);
						}},
						{label:"", labelWidth:"", type:"button", width:"55", key:"btn_search_jenkins",style:"float:right;",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-list' aria-hidden='true'></i>&nbsp;<span>조회</span>",
							onclick:function(){
								var item = jenkinsGrid.getList('selected')[0];
								if(gfnIsNull(item)){
									toast.push('상단 목록에서 JENKINS를 선택해주세요.');
									return;
								}
								
								
					            fnInJobGridListSet(0,jobSearchObj.getParam()+"&jenId="+item.jenId);
						}}
                    	]
                  		},
				]
			});
		}
		
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		
		axdom("#" + jobSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		
		axdom("#" + jobSearchObj.getItemId("searchCd")).hide();
	});
}



function fnSelJobGridSetting(){
	selJobGrid = new ax5.ui.grid();

  selJobGrid.setConfig({
      target: $('[data-ax5grid="selJobGrid"]'),
      showRowSelector: true,
      sortable:false,
      header: {align:"center",columnHeight: 30},
      columns: [
      	{key: "jenNm", label: "JENKINS NAME", width: 180, align: "center"},
			{key: "jobTypeNm", label: "JOB TYPE", width: 95, align: "center"},
			{key: "jobId", label: "JOB ID", width: 170, align: "center"},
			{key: "jobRestoreId", label: "원복 JOB ID", width: 170, align: "center"},
			{key: "jobParameter", label: "JOB 매개변수", width: 150, align: "center"
				,formatter:function(){
					var jobParameter = this.item.jobParameter;
					
					if(gfnIsNull(jobParameter)){
						jobParameter = '-';
					}
					return jobParameter;
				}
			},
			{key: "useNm", label: "사용유무", width: 80, align: "center"}
      ],
      body: {
          align: "center",
          columnHeight: 30,
          onDBLClick:function(){
          	var data = {"jenId": this.item.jenId, "jobId": this.item.jobId};
				gfnLayerPopupOpen('/jen/jen1000/jen1000/selectStm3004JobDetailView.do',data,"1200", "870",'scroll');
          }
      } ,
      page: {
          navigationItemCount: 9,
          height: 30,
          display: true,
          firstIcon: '<i class="fa fa-step-backward" aria-hidden="true"></i>',
          prevIcon: '<i class="fa fa-caret-left" aria-hidden="true"></i>',
          nextIcon: '<i class="fa fa-caret-right" aria-hidden="true"></i>',
          lastIcon: '<i class="fa fa-step-forward" aria-hidden="true"></i>',
          onChange: function () {
	            var item = jenkinsGrid.getList('selected')[0];
				if(gfnIsNull(item)){
					toast.push('상단 목록에서 JENKINS를 선택해주세요.');
					return;
				}
	
				
		        fnInJobGridListSet(this.page.selectPage,jobSearchObj.getParam()+"&jenId="+item.jenId,true);
          }
      } 
  });
}



function fnSelJobSearchSetting(){
	selJobSearchObj = new AXSearch();

	var fnObjSearch = {
		pageStart: function(){
			
			selJobSearchObj.setConfig({
				targetID:"AXSearchTarget-selJob",
				theme : "AXSearch",
				rows:[
					{display:true, addClass:"", style:"", list:[
						{label:"", labelWidth:"", type:"button", width:"125", key:"btn_search_jenkins",style:"float:right;",valueBoxStyle:"padding:5px;", value:"<i class='fa fa-indent' aria-hidden='true'></i>&nbsp;<span>빌드 파라미터 입력</span>",
							onclick:function(){
								var item = jenkinsGrid.getList('selected')[0];
								
						}}
                  	]
                		},
				]
			});
		}
		
	};
	
	jQuery(document.body).ready(function(){
		
		fnObjSearch.pageStart();
		
		axdom("#" + selJobSearchObj.getItemId("searchTxt")).attr("readonly", "readonly");
		
		
		axdom("#" + selJobSearchObj.getItemId("searchCd")).hide();
	});
}


function fnSelectJen1000ConfirmConnect(jenId,index){
	jenkinsGrid.setValue(index, "result", "progress");
	
	
	var jenkinsConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000ConfirmConnect.do'/>","loadingShow":false}
			,{ "jenId" : jenId });
	
	jenkinsConnAjaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		if(data.MSG_CD=="JENKINS_OK"){
			jenkinsGrid.setValue(index, "result", "success");
			toast.push("접속 상태 정상");
		}else{
			jenkinsGrid.setValue(index, "result", "fail");
			toast.push(data.MSG_CD);
		}
		
	});
	
	
	jenkinsConnAjaxObj.setFnError(function(xhr, status, err){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
	});
	
	
	jenkinsConnAjaxObj.send();
} 


function fnSelectJen1000AllConfirmConnect(index){
	
	if(index == -1){
		return false;
	}
	
	if(index >= jenkinsGrid.getList().length){
		return false;
	}
	
	jenkinsGrid.setValue(index, "result", "progress");
	
	
	var gridJenkinsInfo = jenkinsGrid.getList()[index];
	var jenId = gridJenkinsInfo.jenId;
	
	
	var jenkinsConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000ConfirmConnect.do'/>","loadingShow":false}
			,{ "jenId" : jenId });
	
	jenkinsConnAjaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		if(data.MSG_CD=="JENKINS_OK"){
			jenkinsGrid.setValue(index, "result", "success");
			toast.push(gridJenkinsInfo.jenNm+": 접속 상태 정상");
		}else{
			jenkinsGrid.setValue(index, "result", "fail");
			toast.push(gridJenkinsInfo.jenNm+": "+data.MSG_CD);
			
		}
		
		fnSelectJen1000AllConfirmConnect(++index);
	});
	
	
	jenkinsConnAjaxObj.setFnError(function(xhr, status, err){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
	});
	
	
	jenkinsConnAjaxObj.send();
}


function fnSelectJen1000JobConfirmConnect(type,jenId, jobId, index){
	
	if(type == "all"){
		
		if(index == -1){
			return false;
		}
	}
	
	jobGrid.setValue(index, "result", "progress");
	
	
	var gridJobInfo = jobGrid.getList()[index];
	
	var jenkinsConnAjaxObj = new gfnAjaxRequestAction(
			{"url":"<c:url value='/jen/jen1000/jen1000/selectJen1000JobConfirmConnect.do'/>","loadingShow":false}
			,{ "jenId" : jenId, "jobId" : jobId });
	
	jenkinsConnAjaxObj.setFnSuccess(function(data){
		data = JSON.parse(data);
		if(data.MSG_CD=="JENKINS_OK"){
			jobGrid.setValue(index, "result", "success");
			toast.push(gridJobInfo.jobId+": 접속 상태 정상");
		}else{
			jobGrid.setValue(index, "result", "fail");
			toast.push(gridJobInfo.jobId+": "+data.MSG_CD);
		}
		if(type == "all"){
			
			if((++index) >= jobGrid.getList().length){
				return false;
			}
			
			
			var inGridJobInfo = jobGrid.getList()[index];
			var jenId = inGridJobInfo.jenId;
			var jobId = inGridJobInfo.jobId;
			
			
			fnSelectJen1000JobConfirmConnect("all",jenId, jobId,index);
		}
		
	});
	
	
	jenkinsConnAjaxObj.setFnError(function(xhr, status, err){
		data = JSON.parse(data);
		jAlert(data.message, "알림창");
	});
	
	
	jenkinsConnAjaxObj.send();
}



function fnJen1000GuideShow(){
	var mainObj = $(".main_contents");
	
	
	if(mainObj.length == 0){
		return false;
	}
	
	var guideBoxInfo = globals_guideContents["jen1000"];
	gfnGuideBoxDraw(true,mainObj,guideBoxInfo);
}
</script>


<div class="main_contents" style="height: auto;">
	<form:form commandName="jen1000VO" id="searchFrm" name="searchFrm" method="post" onsubmit="return false;">
		
	</form:form>
	<div class = "tab_contents menu" >
		<div class="main_frame left">
			<div class="frame_contents">
				<div class="sub_title">
					JENKINS 관리
				</div>
				<div id="AXSearchTarget-jenkins" guide="jen1000JenkinsBtn"></div>
				<div class="dpl_wrap white">
					<input type="hidden" name="strInSql" id="strInSql" />
					<div data-ax5grid="jenkinsGrid" data-ax5grid-config="{}" style="height: 200px;" guide="jen1000JenkinsList"></div>	
				</div>
			</div>
			<div class="frame_contents">
				<div class="sub_title">
					JOB 관리 <small>[선택 JENKINS: <span id="selJenkinsNm">-</span>]</small>
				</div>
				<div id="AXSearchTarget-job" guide="jen1000JobBtn"></div>
				<div class="dpl_wrap white">
					<div data-ax5grid="jobGrid" data-ax5grid-config="{}" style="height: 300px;" guide="jen1000JobList"></div>	
				</div>
			</div>
		</div>
		<div class="main_frame middle">
			<button type="button" class="AXButton jobAddDelBtn"><i class="fa fa-arrow-alt-circle-right"></i>&nbsp;추가</button>
			<button type="button" class="AXButton jobAddDelBtn"><i class="fa fa-arrow-alt-circle-left"></i>&nbsp;제거</button>
		</div>
		<div class="main_frame right">
			<div class="frame_contents selectJobFrame">
				<div class="sub_title">
					선택 JENKINS&JOB 목록
				</div>
				<div id="AXSearchTarget-selJob"></div>
				<div class="dpl_wrap white">
					<div data-ax5grid="selJobGrid" data-ax5grid-config="{}" style="height: 700px;"></div>	
				</div>
			</div>
		</div>
	</div>
</div>
		
<jsp:include page="/WEB-INF/jsp/lunaops/bottom/footer.jsp" />