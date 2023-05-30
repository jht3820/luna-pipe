//배포계획 결재 그리드 설정 값
var dplSignGrid_config = {
      sortable:true,
      header: {align:"center",columnHeight: 30},
      columns: [
                {key: "rn", label: " ", width: '4%', align: "center"},	
          		{key: "signStsNm", label: "결재 상태", width: 100, align: "center"},
         		{key: "signRegUsrNm", label: "요청자", width: 100, align: "center"},
         		{key: "signUsrNm", label: "결재자", width: 100, align: "center"},
         		{key: "signDtm", label: "결재 요청 일자", width: 130, align: "center",formatter:function(){
         			var signDtm = this.item.signDtm;
					// IE에서는 날짜값 뒤에 시간값이 붙어있을경우 format("yyyy-MM-dd")이 정상동작 하지 않아 yyyy-MM-dd만 자른다.
					var signDtmStr = signDtm.substring(0, 10);
         			return new Date(signDtmStr).format("yyyy-MM-dd");
         		}},
         		{key: "dplNm", label: "배포계획 명", width: 269, align: "center"},
         		{key: "signTxt", label: "결재 의견", width: 320, align: "left"},
         		{key: "signRejectTxt", label: "반려내용", width: 320, align: "left"},
          		],
      body: {
          align: "center",
          columnHeight: 30,
          onClick: function () {
          	
          },onDBLClick:function(){
          	// 더블클릭 시 상세보기
          	var item = this.item;
          	var data = {"dplId" : item.dplId, "prjId" : item.prjId};
		gfnLayerPopupOpen('/dpl/dpl1000/dpl1000/selectDpl1003View.do',data, "1200", "907");
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
        	  {type: "signRegUsrDetailPopup", label: "요청자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
              {type: "signUsrDetailPopup", label: "결재자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
              {divide: true},
              {type: "reply", label: "쪽지 전송", icon:"<i class='fa fa-mail-reply' aria-hidden='true'></i>"}
              
          ],
          popupFilter: function (item, param) {
          	
          	// 배포 결재 그리드 외에 나머지 그리드의 contextMenu를 모두 닫는다.
          	fnGridContextMenuClose();
          
          	//선택 개체 없는 경우 중지
          	if(typeof param.gridSelf.list[param.doindex] == "undefined"){
          		return false;
          	}

          	return true;
          },
          onClick: function (item, param) {
        	  var selItem = param.gridSelf.list[param.doindex];
              if(item.type == "reply"){
              	/* 
              	 * 쪽지 구분타입
              	 * signChk(결재 요청자에게 쪽지) : 대시보드의 담당 요구사항&담당 배포계획 결재, 요구사항 결재승인관리, 배포계획 결재승인관리
              	 * signReq(결재 담당자에게 쪽지) : 요구사항 결재요청 현황, 배포계획 결재 요청현황
              	 * req(담당자에게 쪽지, 담당자 없을시 요청자에게) : 접수대기, 작업흐름의 요구사항, 전체 요구사항 현황, 전체 요구사항 관리
              	 * usr(사용자에게 쪽지) : 사용자 관리
              	 */
              	// 배포계획 결재 그리드에서 쪽지창 오픈	
           		gfnAlarmCheckPopOpen(param.item, "signChk");
              }else if(item.type == "signRegUsrDetailPopup"){
	          		if(selItem.signRegUsrNm == null || selItem.signRegUsrNm == ""){
	        			jAlert('요청자 정보가 없습니다.','알림창');
						return false;
	        		}else{
	        			var data = {"usrId": param.item.signRegUsrId}; 
						gfnLayerPopupOpen("/cmm/cmm1000/cmm1900/selectCmm1900View.do", data, "500", "370",'auto');
	        			
	        			
	        		}
	        	}else if(item.type == "signUsrDetailPopup"){
	        		if(selItem.signUsrNm == null || selItem.signUsrNm == ""){
	        			jAlert('결재자가 없습니다.','알림창');
						return false;
						
	        		}else{
	        			var data = {"usrId": param.item.signUsrId}; 
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
             fnInGridListSetting(this.page.selectPage,"&signUsrId=${sessionScope.loginVO.usrId}",gridObj["dplSign"],"/dpl/dpl2000/dpl2100/selectDpl2100AjaxView.do",false);
          }
      } 
  };

//요구사항 결재 그리드 설정 값
var signGrid_config = {
	showLineNumber: false,
	sortable:true,
	header: {align:"center",columnHeight: 30},
	columns: [
	    {key: "rn", label: " ", width: '4%', align: "center"},	
		{key: "signCdNm", label: "결재 상태", width: 80, align: "center"},
		{key: "signFlowNm", label: "작업흐름", width: 115, align: "center"},
		{key: "signUsrNm", label: "결재자", width: 80, align: "center"},
		{key: "signDtm", label: "결재 요청 일자", width: 130, align: "center",formatter:function(){
			return new Date(this.item.signDtm).format("yyyy-MM-dd");
		}},
		{key: "regUsrNm", label: "요청자", width: 80, align: "center"},
		{key: "signRejectCmnt", label: "반려내용", width: 197, align: "center"},
		],
	body: {
		align: "center",
		columnHeight: 30,
		onDBLClick:function(){
			//권한 체크해서 사용자인경우 상세보기로 전환
			if(usrTyp == "01"){
				var data = {"mode":"newReq","reqId": this.item.reqId, "reqProType":"02"}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4104View.do", data, '1470', '900','scroll');
			}else{
				var data = {"reqId": this.item.reqId}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4105View.do", data, '1470', '900',null,false);
			}
		}
	},
	contextMenu: {
		iconWidth: 20,
		acceleratorWidth: 100,
		itemClickAndClose: false,
		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
		items: [
			{type: "detailPopup", label: "상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
			{type: "regUsrDetailPopup", label: "요청자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
            {type: "signUsrDetailPopup", label: "결재자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
            {divide: true},
			{type: "reply", label: "쪽지 전송", icon:"<i class='fa fa-mail-reply' aria-hidden='true'></i>"}
		],
		popupFilter: function (item, param) {
			
			//요구사항 결재 그리드 외에 나머지 그리드의 contextMenu를 모두 닫는다.
          	fnGridContextMenuClose();
			
			//선택 개체 없는 경우 중지
			if(typeof param.item == "undefined"){
				return false;
			}
			return true;
		},
		onClick: function (item, param) {
			var selItem = param.gridSelf.list[param.doindex];
			if(item.type == "reply"){
				/* 
             	 * 쪽지 구분타입
             	 * signChk(결재 요청자에게 쪽지) : 대시보드의 담당 요구사항&담당 배포계획 결재, 요구사항 결재승인관리, 배포계획 결재승인관리
             	 * signReq(결재 담당자에게 쪽지) : 요구사항 결재요청 현황, 배포계획 결재 요청현황
             	 * req(담당자에게 쪽지, 담당자 없을시 요청자에게) : 접수대기, 작업흐름의 요구사항, 전체 요구사항 현황, 전체 요구사항 관리
             	 * usr(사용자에게 쪽지) : 사용자 관리
             	 */
             	// 담당 요구사항 결재 그리드 쪽지창 오픈
           		gfnAlarmCheckPopOpen(param.item, "signChk");
           	//상세 정보
			}else if(item.type == "detailPopup"){
				var data = {"mode":"newReq","reqId": param.item.reqId, "reqProType":"02"}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4104View.do", data, '1470', '900','scroll');
			}else if(item.type == "regUsrDetailPopup"){
          		if(selItem.reqUsrId == null || selItem.reqUsrId == ""){
        			jAlert('요청자 정보가 없습니다.','알림창');
					return false;
        		}else{
        			var data = {"usrId": param.item.regUsrId}; 
					gfnLayerPopupOpen("/cmm/cmm1000/cmm1900/selectCmm1900View.do", data, "500", "370",'auto');
        			
        			
        		}
        	}else if(item.type == "signUsrDetailPopup"){
        		if(selItem.signUsrNm == null || selItem.signUsrNm == ""){
        			jAlert('결재자가 없습니다.','알림창');
					return false;
					
        		}else{
        			var data = {"usrId": param.item.signUsrId}; 
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
             fnInGridListSetting(this.page.selectPage,"&signUsrId=${sessionScope.loginVO.usrId}",gridObj["sign"],"/chk/chk1000/chk1100/selectChk1100AjaxView.do",false);
          }
      } 
	
	
};

//작업 그리드 설정 값
var workGrid_config = {
	showLineNumber: true,
	sortable:true,
	frozenColumnIndex: 1,
	header: {align:"center",columnHeight: 30},
	columns: [
		{key: "processNm", label: "프로세스 명", width: 140, align: "center"},
		{key: "flowNm", label: "작업흐름 명", width: 140, align: "center"},
		{key: "reqNm", label: "요구사항 명", width: 160, align: "left"},
		{key: "workStatusNm", label: "작업상태", width: 70, align: "center"},
		{key: "workProStatusNm", label: "작업 처리 상태", width: 100, align: "center"},
		{key: "workChargerNm", label: "담당자", width: 85, align: "center"},
		{key: "workAdmContent", label: "작업 지시내용", width: 320, align: "left"},
		{key: "workAdmStDtm", label: "작업 시작예정일자", width: 135, align: "center"},
		{key: "workAdmEdDtm", label: "작업 종료예정일자", width: 135, align: "center"},
		{key: "workContent", label: "실제 작업 내용", width: 330, align: "left"},
		{key: "workProRate", label: "실제 작업 진척률 (%)", width: 140, align: "center",formatter:function(){
			return this.item.workProRate+"%";
		}},
		{key: "workStDtm", label: "실제 작업 시작일자", width: 135, align: "center"},
		{key: "workEdDtm", label: "실제 작업 종료일자", width: 135, align: "center"},
		],
	body: {
		align: "center",
		columnHeight: 30,
		onDBLClick:function(){
			//권한 체크해서 사용자인경우 상세보기로 전환
			if(usrTyp == "01"){
				var data = {"mode":"newReq","reqId": this.item.reqId, "reqProType":"02"}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4104View.do", data, '1470', '900','scroll');
			}else{
				var data = {"reqId": this.item.reqId}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4105View.do", data, '1470', '900',null,false);
			}
		}
	},
	contextMenu: {
		iconWidth: 20,
		acceleratorWidth: 100,
		itemClickAndClose: false,
		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
		items: [
			{type: "detailPopup", label: "상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
			{type: "workChargerDetailPopup", label: "담당자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"}
           
		],
		popupFilter: function (item, param) {
			
			// 담당 작업 그리드 외에 나머지 그리드의 contextMenu를 모두 닫는다.
          	fnGridContextMenuClose();
			
			//선택 개체 없는 경우 중지
			if(typeof param.item == "undefined"){
				return false;
			}
			return true;
		},
		onClick: function (item, param) {
			var selItem = param.gridSelf.list[param.doindex];
			//상세 정보
			if(item.type == "detailPopup"){
				var data = {"mode":"newReq","reqId": param.item.reqId, "reqProType":param.item.reqProType}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4104View.do", data, '1470', '900','scroll');
			}else if(item.type == "workChargerDetailPopup"){
        		if(selItem.workChargerNm == null || selItem.workChargerNm == ""){
        			jAlert('담당자가 없습니다.','알림창');
					return false;
					
        		}else{
        			var data = {"usrId": param.item.workChargerId}; 
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
        	fnInGridListSetting(this.page.selectPage,"&workChargerId="+usrId,gridObj["work"],"/req/req4000/req4400/selectReq4400ReqWorkListAjax.do",false);
        }
    }
};

//사용자별 작업 그리드 설정 값
var usrWorkGrid_config = {
	showLineNumber: true,
	sortable:true,
	frozenColumnIndex: 1,
	header: {align:"center",columnHeight: 30},
	columns: [
		{key: "workChargerNm", label: "작업 담당자", width: 150, align: "center"},
		{key: "allWorkCnt", label: "전체 작업 수", width: 120, align: "center"},
		{key: "proWorkCnt", label: "진행 작업 수", width: 120, align: "center"},
		{key: "doneWorkCnt", label: "종료 작업 수", width: 120, align: "center"},
		{key: "realProRate", label: "실제 작업 진척률 (%)", width: 190, align: "center",formatter:function(){
			var realProRate = this.item.realProRate;
			if(gfnIsNull(realProRate)){
				realProRate = "0";
			}
			return realProRate+"%";
		}},
		{key: "doneWorkRate", label: "처리 완료율 (%)", width: 120, align: "center",formatter:function(){
			var doneWorkRate = this.item.doneWorkRate;
			if(gfnIsNull(doneWorkRate)){
				doneWorkRate = "0";
			}
			return doneWorkRate+"%";
		}},
		{key: "wellDoneWorkRate", label: "적기 처리율 (%)", width: 120, align: "center",formatter:function(){
			var wellDoneWorkRate = this.item.wellDoneWorkRate;
			if(gfnIsNull(wellDoneWorkRate)){
				wellDoneWorkRate = "0";
			}
			return wellDoneWorkRate+"%";
		}},
		{label: "작업 처리 상태 건수", colspan: 2, align: "center", columns: [
			{label : "초과 수", key : "excCnt", width : 100, align : "center"}
			,{label : "임박 수", key : "soonCnt", width : 100, align : "center"}
			,{label : "여유 수", key : "nmlCnt", width : 100, align : "center"}
			,{label : "실패 수", key : "failCnt", width : 100, align : "center"}
			,{label : "적기 수", key : "successCnt", width : 100, align : "center"}
			]},
		],
	body: {
		align: "center",
		columnHeight: 30,
		onDBLClick:function(){
			//사용자 작업 목록 팝업 오픈
			var data = {prjId: this.item.prjId, workChargerId: this.item.workChargerId, workChargerNm: this.item.workChargerNm}; 
			gfnLayerPopupOpen("/req/req4000/req4100/selectReq4114View.do", data, '1300', '700','scroll');
		}
	},
	contextMenu: {
		iconWidth: 20,
		acceleratorWidth: 100,
		itemClickAndClose: false,
		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
		items: [
			{type: "detailPopup", label: "담당자 작업 목록", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
			{type: "workChargerDetailPopup", label: "작업 담당자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"}
		],
		popupFilter: function (item, param) {
			
			// 담당 작업 그리드 외에 나머지 그리드의 contextMenu를 모두 닫는다.
          	fnGridContextMenuClose();
			
			//선택 개체 없는 경우 중지
			if(typeof param.item == "undefined"){
				return false;
			}
			return true;
		},
		onClick: function (item, param) {
			var selItem = param.gridSelf.list[param.doindex];
			
			//상세 정보
			if(item.type == "detailPopup"){
				var data = {prjId: param.item.prjId, workChargerId: param.item.workChargerId, workChargerNm: param.item.workChargerNm}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4114View.do", data, '1300', '700','scroll');
			}else if(item.type == "workChargerDetailPopup"){
        		if(selItem.workChargerNm == null || selItem.workChargerNm == ""){
        			jAlert('담당자가 없습니다.','알림창');
					return false;
					
        		}else{
        			var data = {"usrId": param.item.workChargerId}; 
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
        	fnInGridListSetting(this.page.selectPage,"&pageSize=100",gridObj["usrWork"],"/req/req4000/req4400/selectReq4400UsrWorkListAjax.do",false);
        }
    }
};

//접수 대기 그리드 설정 값
var newReqGrid_config = {
	showLineNumber: false,
	sortable:true,
	header: {align:"center",columnHeight: 30},
	columns: [
		{key: "rn", label: " ", width: 50, align: "center"},	          
		{key: "reqOrd", label: "순번", width: 120, align: "center"},	          
		{key: "reqNo", label: "요구사항 번호", width: 170, align: "center"
			,formatter:function(){
				// 요구사항 번호 없을 경우 하이픈(-) 표시
				var reqNo = this.item.reqNo;
				if(gfnIsNull(reqNo)){
					reqNo = "-";
				}
      			return reqNo;
      		}
		},	          
		{key: "reqDtm", label: "요청일자", width: 120, align: "center"},
		{key: "reqChargerNm", label: "담당자", width: 120, align: "center"
			,formatter:function(){
				// 담당자 없을 경우 하이픈(-) 표시
				var reqChargerNm = this.item.reqChargerNm;
				if(gfnIsNull(reqChargerNm)){
					reqChargerNm = "-";
				}
      			return reqChargerNm;
      		}
		},
		{key: "reqUsrNm", label: "요청자", width: 120, align: "center"},
		{key: "reqUsrEmail", label: "이메일", width: 180, align: "center"},
		{key: "reqUsrNum", label: "연락처", width: 130, align: "center"},
		{key: "reqNm", label: "요청 명", width: 470, align: "left"},
		{key: "reqDesc", label: "요청 내용", width: 472, align: "left"}
		],
	body: {
		align: "center",
		columnHeight: 30,
		onDBLClick:function(){
			//권한 체크해서 사용자인경우 상세보기로 전환
			if(usrTyp == "01"){
				/*
               	 * reqPageType 추가
               	 * 요구사항 상세보기(req1002.jsp)에서 항목명 구분을 위해 사용
               	 * usrReqPage - 요구사항 요청(사용자) 
               	 * admReqPage - 전체 요구사항 목록, 요구사항 생성관리(관리자)
               	 */
            	var data = {
            			"mode": "req", 
            			"popupPrjId":this.item.prjId,
         				"reqId":this.item.reqId,
            			"reqPageType" : "usrReqPage"
            	}; 
        		
               	gfnLayerPopupOpen('/req/req1000/req1000/selectReq1002View.do',data,"800","850",null);
               	
			}else{
				var data = {"reqId": this.item.reqId}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4106View.do", data, '900', '930','auto');
			}
		}
	},
	contextMenu: {
		iconWidth: 20,
		acceleratorWidth: 100,
		itemClickAndClose: false,
		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
		items: [
			{type: "detailPopup", label: "상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
			{type: "reqUsrDetailPopup", label: "요청자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
            {divide: true},
			{type: "reply", label: "쪽지 전송", icon:"<i class='fa fa-mail-reply' aria-hidden='true'></i>"},
		],
		popupFilter: function (item, param) {
			
			// 접수대기 그리드 외에 나머지 그리드의 contextMenu를 모두 닫는다.
          	fnGridContextMenuClose();
			
			//선택 개체 없는 경우 중지
			if(typeof param.item == "undefined"){
				return false;
			}
			return true;
		},
		onClick: function (item, param) {
			var selItem = param.gridSelf.list[param.doindex];
			//쪽지 전송
			if(item.type == "reply"){
				/* 
             	 * 쪽지 구분타입
             	 * signChk(결재 요청자에게 쪽지) : 대시보드의 담당 요구사항&담당 배포계획 결재, 요구사항 결재승인관리, 배포계획 결재승인관리
             	 * signReq(결재 담당자에게 쪽지) : 요구사항 결재요청 현황, 배포계획 결재 요청현황
             	 * req(담당자에게 쪽지, 담당자 없을시 요청자에게) : 접수대기, 작업흐름의 요구사항, 전체 요구사항 현황, 전체 요구사항 관리
             	 * usr(사용자에게 쪽지) : 사용자 관리
             	 */
             	// 접수대기 그리드에서 쪽지창 오픈
				gfnAlarmCheckPopOpen(param.item, "req");
			}
			//상세 정보
			else if(item.type == "detailPopup"){
				/*
               	 * reqPageType 추가
               	 * 요구사항 상세보기(req1002.jsp)에서 항목명 구분을 위해 사용
               	 * usrReqPage - 요구사항 요청(사용자) 
               	 * admReqPage - 전체 요구사항 목록, 요구사항 생성관리(관리자)
               	 */
               	var data = {
            			"mode": "req", 
            			"popupPrjId":param.item.prjId,
         				"reqId":param.item.reqId,
            			"reqPageType" : "usrReqPage"
            	}; 
        		
               	gfnLayerPopupOpen('/req/req1000/req1000/selectReq1002View.do',data,"800","850",null);
               	
               	
			}else if(item.type == "reqUsrDetailPopup"){
        		if(selItem.reqUsrId == null || selItem.reqUsrId == ""){
        			jAlert('요청자 정보가 없습니다.','알림창');
					return false;
        		}else{
        			var data = {"usrId": param.item.reqUsrId}; 
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
        	fnInGridListSetting(this.page.selectPage,"&mode=dashboard&reqProType=01",gridObj["request"],"/req/req1000/req1000/selectReq1000ListAjaxView.do",false);
        }
    }
};

//그룹 요구사항 그리드 세팅
var reqGrpGrid_config = {
	showLineNumber: false,
	sortable:true,
	header: {align:"center",columnHeight: 30},
	columns: [
		{key: "rn", label: " ", width: 50, align: "center"},	          
		{key: "reqGrpNo", label: "그룹 요구사항 번호", width: 160, align: "center"},
		{key: "reqGrpNm", label: "그룹 요구사항 명", width: 380, align: "left"},	  
		{key: "reqGrpLinkCnt", label: "연결 요구사항 수", width: 120, align: "center"},
		{key: "acceptReqCnt", label: "접수 대기 수", width: 105, align: "center"},
		{key: "doReqCnt", label: "처리중 수", width: 100, align: "center"},
		{key: "doneReqCnt", label: "최종완료 수", width: 105, align: "center"},
		{key: "endReqPer", label: "처리 완료율(%)", width: 120, align: "center",formatter:function(){
			// 처리 완료율 = (최종완료 수/접수대기 수+처리중 수+최종완료 수)*100
			return this.item.endReqPer+"%";
		}},
		{key: "reqCompleteRatio", label: "진척률(%)", width: 110, align: "center",formatter:function(){
			return this.item.reqCompleteRatio+"%";
		}},
		{key: "reqGrpChargerNm", label: "담당자", width: 110, align: "center",formatter:function(){
			var reqGrpChargerNm = this.item.reqGrpChargerNm;
			// 담당자명 없을경우 하이픈
			if(gfnIsNull(reqGrpChargerNm)){
				reqGrpChargerNm = "-";
			}
			
			return reqGrpChargerNm;
		}},
		{key: "reqGrpUsrNm", label: "요청자", width: 110, align: "center"},
		{key: "email", label: "요청자 이메일", width: 150, align: "center"},
		{key: "telno", label: "요청자 연락처", width: 130, align: "center"},
		{key: "deptNm", label: "요청자 소속", width: 170, align: "left"}
		],
	body: {
		align: "center",
		columnHeight: 30,
		onDBLClick:function(){
			var data = {
				"prjGrpId": this.item.prjGrpId,
				"prjId": this.item.prjId,
				"reqGrpId": this.item.reqGrpId
			};
			// 그룹 요구사항 상세보기 팝업 오픈
			gfnLayerPopupOpen('/req/req3000/req3000/selectReq3003View.do',data,"1200", "860",null);
		}
	},
	contextMenu: {
		iconWidth: 20,
		acceleratorWidth: 100,
		itemClickAndClose: false,
		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
		items: [
			{type: "detailPopup", label: "상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
			{type: "reqGrpUsrDetailPopup", label: "요청자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
            {divide: true},
			{type: "reply", label: "쪽지 전송", icon:"<i class='fa fa-mail-reply' aria-hidden='true'></i>"}
		],
		popupFilter: function (item, param) {
			
			// 접수대기 그리드 외에 나머지 그리드의 contextMenu를 모두 닫는다.
          	fnGridContextMenuClose();
			
			//선택 개체 없는 경우 중지
			if(typeof param.item == "undefined"){
				return false;
			}
			return true;
		},
		onClick: function (item, param) {
			var selItem = param.gridSelf.list[param.doindex];
			
			//쪽지 전송
			if(item.type == "reply"){

				gfnAlarmCheckPopOpen(param.item, "reqGrp");
			}
			//상세 정보
			else if(item.type == "detailPopup"){
             	var data = {
        				"prjGrpId": param.item.prjGrpId,
        				"prjId": param.item.prjId,
        				"reqGrpId": param.item.reqGrpId
             	};
    			// 그룹 요구사항 상세보기 팝업 오픈
    			gfnLayerPopupOpen('/req/req3000/req3000/selectReq3003View.do',data,"1200", "860",null);
    			
			}else if(item.type == "reqGrpUsrDetailPopup"){
        		if(selItem.reqGrpUsrId == null || selItem.reqGrpUsrId == ""){
        			jAlert('요청자 정보가 없습니다.','알림창');
					return false;
        		}else{
        			var data = {"usrId": param.item.reqGrpUsrId}; 
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
    	  fnInGridListSetting(this.page.selectPage,"&pageSize=100",gridObj["reqGrp"],"/req/req3000/req3000/selectReq3000DshReqGrpListAjax.do",false);
      }
  }
};

//공지사항 그리드 설정 값 
var boardNoticeGrid_config = {
      sortable:true,
      header: {align:"center"},
      columns: [
    	  	{key: "badNum", label: "글번호", width: 65, align: "center"},
			{key: "noticeNm", label: "공지", width: 55, align: "center"},
			{key: "badTitle", label: "글제목", width: 760, align: "left"},
			{key: "usrNm", label: "작성자명", width: 100, align: "center"},
			{key: "usrPositionCdNm", label: "직급", width: 100, align: "center"},
			{key: "badCnt", label: "조회수", width: 70, align: "center"},
			{key: "regDtm", label: "작성일시", width: 150, align: "center"},
			{key: "modifyDtm", label: "수정일시", width: 150, align: "center"},
          ],
      body: {
          align: "center",
          columnHeight: 30,
          onClick: function () {
          	
          },onDBLClick:function(){
          	// 더블클릭 시 상세보기
          	var item = this.item;
			var data = {"badId": item.badId, "view":"dsh1000"};
			gfnLayerPopupOpen('/bad/bad1000/bad1000/selectbad1002View.do',data,"680","820",'scroll');
          }
      },
      contextMenu: {
    	  iconWidth: 20,
  		acceleratorWidth: 100,
  		itemClickAndClose: false,
  		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
  		items: [
  			{type: "detailPopup", label: "상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
  			{type: "badUsrDetailPopup", label: "작성자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
              {divide: true},
  			{type: "reply", label: "쪽지 전송", icon:"<i class='fa fa-mail-reply' aria-hidden='true'></i>"}
  		],
  		popupFilter: function (item, param) {
  			
  			// 접수대기 그리드 외에 나머지 그리드의 contextMenu를 모두 닫는다.
        	fnGridContextMenuClose();
  			
  			//선택 개체 없는 경우 중지
  			if(typeof param.item == "undefined"){
  				return false;
  			}
  			return true;
  		},
  		onClick: function (item, param) {
  			var selItem = param.gridSelf.list[param.doindex];
  			
  			//쪽지 전송
  			if(item.type == "reply"){
  				gfnAlarmCheckPopOpen(param.item, "usr");
  			}
  			//상세 정보
  			else if(item.type == "detailPopup"){
               	var data = {"badId": param.item.badId, "view":"dsh1000"};
      			// 공지사항 상세정보창 오픈
               	gfnLayerPopupOpen('/bad/bad1000/bad1000/selectbad1002View.do',data,"680","820",'scroll');
      			
  			}else if(item.type == "badUsrDetailPopup"){
          		if(selItem.usrId == null || selItem.usrId == ""){
          			jAlert('작성자 정보가 없습니다.','알림창');
  					return false;
          		}else{
          			var data = {"usrId": param.item.usrId}; 
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
             fnInGridListSetting(this.page.selectPage,"",gridObj["boardNotice"],"/bad/bad1000/bad1000/selectbad1000BoardListAjaxView.do",false);
          }
      } 
  };

//그리드 공통 설정 값 -- (항목 값 정해지면 수정필요)
var flowGrid_config = {
	showLineNumber: false,
	sortable:true,
	header: {align:"center",columnHeight: 30},
	columns: [
	    {key: "rn", label: " ", width: '3%', align: "center"},	
	    {key: "reqOrd", label: "순번", width: '7%', align: "center"},	
	    {key: "reqProTypeNm", label: "처리 상태", width: '6%', align: "center"},
	    {key: "signCdNm", label: "결재 상태", width: '6%', align: "center"},
	    {key: "signUsrNm", label: "결재자", width: '6%', align: "center"},
		{key: "reqChargerNm", label: "담당자", width: '6%', align: "center"},
		{key: "reqNo", label: "요구사항 번호", width: '10%', align: "center"},
		{key: "reqNm", label: "요청 제목", width: '32%', align: "left"},
		{key: "reqDesc", label: "요청 내용", width: '36%', align: "left"},
		{key: "reqStDtm", label: "작업 시작일자", width: '10%', align: "center"},
		{key: "reqEdDtm", label: "작업 종료일자", width: '10%', align: "center"},
		{key: "reqStDuDtm", label: "작업 시작 예정일자", width: '10%', align: "center"},
		{key: "reqEdDuDtm", label: "작업 종료 예정일자", width: '10%', align: "center"},
		{key: "reqDtm", label: "요청일자", width: '10%', align: "center"},
		{key: "reqUsrNm", label: "요청자", width: '6%', align: "center"},
		{key: "reqUsrEmail", label: "이메일", width: '10%', align: "center"},
		{key: "reqUsrNum", label: "연락처", width: '10%', align: "center"}
	],
	body: {
		align: "center",
		columnHeight: 30,
		onDBLClick:function(){
			//권한 체크해서 사용자인경우 상세보기로 전환
			if(usrTyp == "01"){
				var data = {"mode":"newReq","reqId": this.item.reqId, "reqProType":"02"}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4104View.do", data, '1470', '900','scroll');
			}else{
				var data = {"reqId": this.item.reqId}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4105View.do", data, '1470', '900',null,false);
			}
		}
	},
	contextMenu: {
		iconWidth: 20,
		acceleratorWidth: 100,
		itemClickAndClose: false,
		icons: {'arrow': '<i class="fa fa-caret-right"></i>'},
		items: [
			{type: "detailPopup", label: "상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
			{type: "regUsrDetailPopup", label: "요청자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
            {type: "signUsrDetailPopup", label: "결재자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
            {type: "reqChargerDetailPopup", label: "담당자 상세 정보", icon:"<i class='fa fa-info-circle' aria-hidden='true'></i>"},
            {divide: true},
			{type: "reply", label: "쪽지 전송", icon:"<i class='fa fa-mail-reply' aria-hidden='true'></i>"},
		],
		popupFilter: function (item, param) {
			
			// 작업흐름 요구사항 그리드의 contextMenu를 모두 닫는다.
          	fnGridContextMenuClose();
			
			//선택 개체 없는 경우 중지
			if(typeof param.item == "undefined"){
  				return false;
 			}
				return true;
			},
		onClick: function (item, param) {
			var selItem = param.gridSelf.list[param.doindex];
			//쪽지 전송
			if(item.type == "reply"){
				/* 
             	 * 쪽지 구분타입
             	 * signChk(결재 요청자에게 쪽지) : 대시보드의 담당 요구사항&담당 배포계획 결재, 요구사항 결재승인관리, 배포계획 결재승인관리
             	 * signReq(결재 담당자에게 쪽지) : 요구사항 결재요청 현황, 배포계획 결재 요청현황
             	 * req(담당자에게 쪽지, 담당자 없을시 요청자에게) : 접수대기, 작업흐름의 요구사항, 전체 요구사항 현황, 전체 요구사항 관리
             	 * usr(사용자에게 쪽지) : 사용자 관리
             	 */
             	// 작업흐름의 요구사항 그리드에서 쪽지창 오픈 
				gfnAlarmCheckPopOpen(param.item, "req");
			}
			//상세 정보
			else if(item.type == "detailPopup"){
				var data = {"mode":"newReq","reqId": param.item.reqId, "reqProType":param.item.reqProType}; 
				gfnLayerPopupOpen("/req/req4000/req4100/selectReq4104View.do", data, '1470', '900','scroll');
			}else if(item.type == "regUsrDetailPopup"){
          		if(selItem.reqUsrId == null || selItem.reqUsrId == ""){
        			jAlert('요청자 정보가 없습니다.','알림창');
					return false;
        		}else{
        			var data = {"usrId": param.item.reqUsrId}; 
					gfnLayerPopupOpen("/cmm/cmm1000/cmm1900/selectCmm1900View.do", data, "500", "370",'auto');
        			
        			
        		}
        	}else if(item.type == "signUsrDetailPopup"){
        		if(selItem.signUsrNm == null || selItem.signUsrNm == ""){
        			jAlert('결재자가 없습니다.','알림창');
					return false;
					
        		}else{
        			var data = {"usrId": param.item.signUsrId}; 
					gfnLayerPopupOpen("/cmm/cmm1000/cmm1900/selectCmm1900View.do", data, "500", "370",'auto');
        			
        		}
			}else if(item.type == "reqChargerDetailPopup"){
        		if(selItem.reqChargerNm == null || selItem.reqChargerNm == ""){
        			jAlert('담당자가 없습니다.','알림창');
					return false;
					
        		}else{
        			var data = {"usrId": param.item.reqChargerId}; 
					gfnLayerPopupOpen("/cmm/cmm1000/cmm1900/selectCmm1900View.do", data, "500", "370",'auto');
        			
        		}
			}
			//메뉴 닫기
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
        	fnFlowReqGridSetting(this.page.selectPage,this.self.processId, this.self.flowId, this.self.type);
        }
    }
};


//그리드 세팅
function fnDashboardGridSetting(gridId){
	//그리드 생성자 생성
	gridObj[gridId] = new ax5.ui.grid();
  	 
	//설정값 가져오기
	var tmp_config = flowGrid_config;
  	 
	//접수대기 그리드 세팅인경우 다른 세팅 값 호출
	if(gridId == "request"){
		tmp_config = newReqGrid_config;
	}
	//작업 목록 세팅
	else if(gridId == "work"){
		tmp_config = workGrid_config;
	}
	//사용자 작업 목록 세팅
	else if(gridId == "usrWork"){
		tmp_config = usrWorkGrid_config;
	}
	//요구사항 결재 목록 세팅
	else if(gridId == "sign"){
		tmp_config = signGrid_config;
	}
	//배포계획 결재 목록 세팅
	else if(gridId == "dplSign"){
		tmp_config = dplSignGrid_config;
	}
	//그룹 요구사항 목록 목록 세팅
	else if(gridId == "reqGrp"){
		tmp_config = reqGrpGrid_config;
	}
	//공지사항 목록 세팅
	else if(gridId == "boardNotice"){
		tmp_config = boardNoticeGrid_config;
	}
  	 
	//타겟 변경
	tmp_config.target = $('[data-ax5grid="dshGrid-'+gridId+'"]');
  	 
	//그리드 프레임 호출
	gridObj[gridId].setConfig(tmp_config);
}