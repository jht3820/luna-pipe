
//차트 세팅
function fnChartSetting(data){
	//[차트1] 프로세스별 총개수 + 최종 완료 개수
	var processReqCnt = data.processReqCnt;
	
	//차트2
	var monthProcessReqCnt = data.monthProcessReqCnt;
	
	//차트3
	var wbsCurrentData = data.wbsCurrentDataList;
	
	//차트1 있을때만 데이터 세팅
	if(!gfnIsNull(processReqCnt)){
		//차트1 - 데이터 세팅
		var chart_processNm = [];
		var chart_reqAllCnt = [];
		var chart_reqEndCnt = [];
		var chart_reqChargerCnt = [];
		var chart_processId = [];
		//차트1 데이터 분기
		$.each(processReqCnt,function(idx, map){
			//프로세스 명
			chart_processNm.push(map.processNm);
			
			//요구사항 총 개수
			chart_reqAllCnt.push(map.allCnt);
			
			//담당 개수
			chart_reqChargerCnt.push(map.chargerCnt);
			
			//프로세스 ID
			chart_processId.push(map.processId);
			//접수 대기의 경우 총개수와 최종 종료개수 맞춤
			//if(map.processId == "request"){
				//요구사항 최종 종료 개수
			//	chart_reqEndCnt.push(map.allCnt);
			//}else{
				//요구사항 최종 종료 개수
				chart_reqEndCnt.push(map.endCnt);	
			//}
		});
		
		var ctx1 = document.getElementById("reqTotalCntChart").getContext('2d');
		
		//차트 데이터 있는지 체크하고 이미 있는경우 차트 소멸하고 다시 세팅
		if(!gfnIsNull(dashboardChart[0])){
			dashboardChart[0].destroy();
		}
		
		//차트 생성
		dashboardChart[0] = new Chart(ctx1, {
		    type: 'bar',
		    data: {
		    	labels: chart_processNm,
		    	processIdArr: chart_processId,
		        datasets: [{
		        	type:'line',
		            label: '최종완료 요구사항 수',
		            data: chart_reqEndCnt,
		            // IE에서 최종 완료 수 그래프 색상이 담당 요구사항 수 그래프와 같은 색으로 표시되어 해당부분 주석
		            //backgroundColor:'rgb(255, 125, 110)',
		            //borderColor: 'rgb(255, 86, 67, 1)',
		            backgroundColor:'#f77768',
		            borderColor: '#f77768',
		            borderWidth: 2,
		            pointStyle: 'rectRot',
		            fill: false,
		            pointRadius: 4,
	           	 valueShow:false
		        },{
		        	type:'line',
		            label: '담당 요구사항 수',
		            data: chart_reqChargerCnt,
		            backgroundColor: 'rgb(255, 217, 123)',
		            borderColor: 'rgba(255, 206, 86, 1)',
		            borderWidth: 2,
		            pointStyle: 'circle',
		            fill: false,
		            pointRadius: 4,
	            	valueShow:false
		        },{
		        	type:'bar',
		            label: '총 요구사항 수',
		            data: chart_reqAllCnt,
		            backgroundColor:'#4b73eb',
		            borderColor: 'rgb(75, 115, 235, 1)',
		            borderWidth: 2,
		            pointStyle: 'rect',
			        valueShow: 'barY'
		        }]
		    },
		    options: {
					responsive: false,
					title: {display: true,text:'프로세스별 요구사항 수'},
					tooltips: {mode: 'index',intersect: false},
					legend: false//{labels: {usePointStyle: true}}
					,scales: {
			            xAxes: [{
			                display:false
			            }],
			            // 프로세스별 요구사항 수 차트 Y축이 0부터 시작되고, 정수만 표시되도록 추가
			            yAxes: [{
							ticks: {
								min: 0, // Y축 최소값 지정
								callback: function(value){
									if(value % 1 === 0){ // Y축 정수만 표시
										return value;
									}
								}
							}
						}]
			        } 
					,'onClick' : function (evt, item) {
			           if(!gfnIsNull(item) && item.length >2){
			       			var label  = item[2]._model.label;
			       			var processId = item[2]._chart.config.data.processIdArr[item[2]._index];
			       			var data = {};
			            	if(label =="접수 대기"){
			            		data = { "reqProType" : "01" , "popTitleMsg" : label};	
			            	}else{
			            		data = { "processId" : processId, "popTitleMsg" : label};
			            	}
			       			
			            	gfnLayerPopupOpen('/dsh/dsh1000/dsh1000/selectDsh1001View.do',data, "1200", "600",'scroll');
			            }
			          }
				}
		});
	}
	
	//차트2 데이터 있는경우에만
	if(!gfnIsNull(monthProcessReqCnt)){
		//차트2 준비 데이터
		var chart2_x = ["01월","02월","03월","04월","05월","06월","07월","08월","09월","10월","11월","12월"];	//월별 라벨
		var chart2_y_label = [];	//프로세스 목록
		var chart2_y_proNm = {};	//프로세스 명
		var chart2_y_mmCnt = {};	//프로세스별 요구사항 개수
		var chart2_y_chargerCnt = {};	//월별 담당 요구사항 개수
		var chart2_datasets = [];	//차트 데이터 세팅
		var chart2_bgColor = ["#4b73eb","#936de9","#ff5643","#58c3e5","#fba450","#eb4ba4","#89eb4b","#c4eb4b","#9f4beb","#fba450","#ff5643","#58c3e5","#fba450"];	//차트 배경색
		
		//차트3 준비 데이터
		var chart3_idxIf = {"01월":0,"02월":0,"03월":0,"04월":1,"05월":1,"06월":1,"07월":2,"08월":2,"09월":2,"10월":3,"11월":3,"12월":3};
		var chart3_quarter = [0,0,0,0];
		var chart3_chargerQuarter = [0,0,0,0];
		var chart3_reqMmCnt = {}; 
		var chart3_quarterCnt = {}; 
		
		var ctx2 = document.getElementById("reqMonthCntChart").getContext('2d');
		
		//차트2 데이터 분기
		$.each(monthProcessReqCnt,function(idx, map){
			var reqEdDtmMm = map.reqEdDuMm;
			//'월' 붙이기
			reqEdDtmMm += "월";
			
			//프로세스명 없는경우 push
			if(chart2_y_label.indexOf(map.processId) == -1){
				//프로세스명
				chart2_y_label.push(map.processId);
				
				//json 조합
				var tempJson = {};
				tempJson[map.processId] = map.processNm;
				$.extend(chart2_y_proNm,tempJson);
			}
			
			//데이터 배열 만들기
			if(Object.keys(chart2_y_mmCnt).indexOf(reqEdDtmMm) == -1){
				chart2_y_mmCnt[reqEdDtmMm] = {};
				chart2_y_chargerCnt[reqEdDtmMm] = {};
				
				// 차트3 - 월별 적기 요구사항 건수, 전체 요구사항 건수
				chart3_reqMmCnt[reqEdDtmMm] = {"done":0, "total":0};
			}
			//월별 프로세스별 요구사항 완료율 세팅
			if(Object.keys(chart2_y_mmCnt[reqEdDtmMm]).indexOf(map.processId) == -1){
				//완료율 계산
				//월별 요구사항 총 갯수
				var reqTotalCnt = map.reqTotalCnt;
				//월별 완료 갯수
				var reqEdMmCnt = map.reqEdMmCnt;
				//완료율
				var reqEdMmRatio = 0;
				
				// 적기 요구사항 건수, 월별 전체 요구사항 건수 세팅
				chart3_reqMmCnt[reqEdDtmMm]["done"] += reqEdMmCnt; // 적기 요구사항 건수
				chart3_reqMmCnt[reqEdDtmMm]["total"] = reqTotalCnt; // 전체 요구사항 건수
				
				//갯수가 0이상일 경우
				if(reqEdMmCnt > 0 && reqTotalCnt > 0){
					reqEdMmRatio = ((reqEdMmCnt/reqTotalCnt)*100);
					reqEdMmRatio = reqEdMmRatio.toFixed(0);
				}
				
				chart2_y_mmCnt[reqEdDtmMm][map.processId] = reqEdMmRatio;
				chart2_y_chargerCnt[reqEdDtmMm][map.processId] = map.reqChargerCnt;
			}
		});

		// 차트 3 데이터 가공 - 월별 요구사항 건수를 분기별 요구사항 건수로 가공
		$.each(chart3_reqMmCnt, function(idx, map){
			
			if(gfnIsNull(chart3_quarterCnt[chart3_idxIf[idx]])){
				chart3_quarterCnt[chart3_idxIf[idx]] = {"quarter":chart3_idxIf[idx], "done":0, "total":0};
			}
			
			// 분기별 적기 요구사항, 전체 요구사항 건수 세팅
			chart3_quarterCnt[chart3_idxIf[idx]]["done"] += map.done;
			chart3_quarterCnt[chart3_idxIf[idx]]["total"] += map.total;
		});
		
		// 차트3 분기별 처리율(%) 값 가공 및 세팅
		$.each(chart3_quarterCnt, function(idx, map){
			
			// 분기별 처리율
			var quarterRatio = 0;
			// 분기별 적기 요구사항 건수
			var doneCnt = map.done;
			// 분기별 최종완료 요구사항 건수
			var totalCnt = map.total;
			// 분기 index
			var quarterIdx = map.quarter;
			
			// 갯수가 0이상일 경우
			if(doneCnt > 0 && totalCnt > 0){
				// 처리율 계산
				quarterRatio = ((doneCnt/totalCnt)*100);
				quarterRatio = quarterRatio.toFixed(0);
			}
			
			// 차트3 분기별 처리율 데이터 세팅
			chart3_quarter[quarterIdx] = quarterRatio;
		});
		
		//담당자 데이터 배열
		var chargerDataArr = [];
		//data 세팅 - 프로세스 루프
		$.each(chart2_y_label,function(idx, map){
			//데이터 배열
			var mmCntDataArr = [];
			
			//월별 루프
			$.each(chart2_x,function(inIdx, inMap){
				//월 데이터 없는경우
				if(gfnIsNull(chart2_y_mmCnt[inMap])){
					mmCntDataArr.push(0);
				}else{
					//월별 프로세스 데이터 체크
					if(gfnIsNull(chart2_y_mmCnt[inMap][map])){	//없는경우 0(배열 크기 맞추기 위함)
						mmCntDataArr.push(0);
					}else{	//있는경우 데이터 가져와서 push
						mmCntDataArr.push(chart2_y_mmCnt[inMap][map]);
					
						//분기별 % /3
						var mmCntVal = chart2_y_mmCnt[inMap][map];
						if(mmCntVal > 0){
							mmCntVal = (mmCntVal/3);
						}
						
						//차트3 - 분기별 검사하고 데이터 추가
						//chart3_quarter[chart3_idxIf[inMap]] += mmCntVal;
						
					}
				}
				//월 데이터 없는경우
				if(gfnIsNull(chart2_y_chargerCnt[inMap])){
					chargerDataArr[inIdx] = 0;
				}else{
					//월별 프로세스 담당 데이터 체크
					if(!gfnIsNull(chart2_y_chargerCnt[inMap][map])){
						//데이터 없는경우 초기값 0
						if(gfnIsNull(chargerDataArr[inIdx])){
							chargerDataArr[inIdx] = 0;
						}
						//데이터 있는경우 모두 더하기
						chargerDataArr[inIdx] = chargerDataArr[inIdx]+chart2_y_chargerCnt[inMap][map];
						
						//차트3 - 담당자
						chart3_chargerQuarter[chart3_idxIf[inMap]] += chart2_y_chargerCnt[inMap][map];
					}
				}
			});
			
			//배경색 인덱스
			var bgIdx = idx;
			
			//프로세스 수가 가진 색상을 넘어서는경우
			if(idx > chart2_bgColor.length-1){
				bgIdx = idx%chart2_bgColor.length;
			}
			
			//차트에 입력되는 데이터 세팅
			chart2_datasets.push({
				type:'bar',
	            label: chart2_y_proNm[map],
	            data: mmCntDataArr,
	            backgroundColor: chart2_bgColor[bgIdx],
	            borderWidth: 0,
	            pointStyle: 'rect',
	            fill: false,
	            pointRadius: 4,
		        valueShow: 'barY',
		        valueShowStr: "%"
			});
		});
		/* 
		//담당 차트 추가
		chart2_datasets.unshift({
				type:'line',
	            label: "담당 요구사항 수",
	            data: chargerDataArr,
	            backgroundColor: 'rgb(255, 217, 123)',
	            borderColor: 'rgba(255, 206, 86, 1)',
	            borderWidth: 1,
	            pointStyle: 'circle',
	            fill: false,
	            pointRadius: 2
			});
		 */
		//차트 데이터 있는지 체크하고 이미 있는경우 차트 소멸하고 다시 세팅
		if(!gfnIsNull(dashboardChart[1])){
			dashboardChart[1].destroy();
		}
		
		//차트 생성
		dashboardChart[1] = new Chart(ctx2, {
		    type: 'bar',
		    data: {
		        labels: chart2_x,
		        datasets: chart2_datasets
		    },
		    options: {
			    	'onClick' : function (evt, item) {
		    	 		if(item.length>0){
		    	 			var label =  item[0]._model.label;
		    	 			var month = label.substring(0,2);
		    	 			var data = {};
			            	
			            	data = { "processMonth" : month, "popTitleMsg" : label};	
			            	
			            	gfnLayerPopupOpen('/dsh/dsh1000/dsh1000/selectDsh1001View.do',data, "1200", "600",'scroll');
		    	 		}
		    	 		
		    	 	},
					responsive: true,
					scales: {
						xAxes: [{
							stacked: true,
						}],
						yAxes: [{
							stacked: true,
							ticks: {
								beginAtZero: true,
								suggestedMin: 0,
			                    callback: function(value, index, values) {
			                        return value+'%';
			                    }
			                }
						}]
					},
					title: {display: true,text:'각 프로세스별 처리율 (월)'},
					tooltips: {
						mode: 'index'
						,intersect: false
						,callbacks: {
							label:function(tooltipItems, data){
								var thisLabel = data.datasets[tooltipItems.datasetIndex].label;
								return thisLabel+": "+tooltipItems.yLabel+"%";
							}
							,
							footer: function(tooltipItems, data) {
								var sum = 0;
	
								tooltipItems.forEach(function(tooltipItem) {
										sum += parseInt(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
								});
								
								return '총 처리율: ' + sum+"%";
							},
						}
					},
					legend: {labels: {usePointStyle: true}}
				}
		});
		
		//차트2 데이터 있는 경우 월별로 분기 데이터 생성
		var ctx3 = document.getElementById("reqQuarterCntChart").getContext('2d');
		
		//차트 데이터 있는지 체크하고 이미 있는경우 차트 소멸하고 다시 세팅
		if(!gfnIsNull(dashboardChart[2])){
			dashboardChart[2].destroy();
		}
		
		//차트 생성
		dashboardChart[2] = new Chart(ctx3, {
		    type: 'bar',
		    data: {
		        labels: ["1분기","2분기","3분기","4분기"],
		        datasets: [/* {
							type:'line',
				            label: "담당 요구사항 수",
				            data: chart3_chargerQuarter,
				            backgroundColor: 'rgb(255, 217, 123)',
				            borderColor: 'rgba(255, 206, 86, 1)',
				            borderWidth: 1,
				            pointStyle: 'circle',
				            fill: false,
				            pointRadius: 2
						}, */{
						type:'bar',
			            label: "처리율",
			            data: chart3_quarter,
			            backgroundColor: chart2_bgColor,
			            borderWidth: 0,
			            pointStyle: 'rect',
			            fill: false,
			            pointRadius: 4,
				        valueShow: 'barY',
				        valueShowStr: "%"
					}]
		    },
		    options: {
			    	'onClick' : function (evt, item) {
			    		if(item.length>0){
		    	 			var label =  item[0]._model.label;
		    	 			var quarter = label.substring(0,1);
		    	 			var data = {};
			            	if(quarter=="1"){
			            		data = { "processStartMonth" : "01" ,"processEndMonth" : "03", "popTitleMsg" : "1분기"};	
			            	}else if(quarter=="2"){
			            		data = { "processStartMonth" : "04" ,"processEndMonth" : "06", "popTitleMsg" : "2분기"};
			            	}else if(quarter=="3"){
			            		data = { "processStartMonth" : "07" ,"processEndMonth" : "09", "popTitleMsg" : "3분기"};
			            	}else if(quarter=="4"){
			            		data = { "processStartMonth" : "10" ,"processEndMonth" : "12", "popTitleMsg" : "4분기"};
			            	}
			            	
			            	gfnLayerPopupOpen('/dsh/dsh1000/dsh1000/selectDsh1001View.do',data, "1200", "600",'scroll');
		    	 		}
		    	 	},
					responsive: true,
					scales: {
						xAxes: [{
							stacked: true,
						}],
						yAxes: [{
							stacked: true,
							ticks: {
								beginAtZero: true,
								suggestedMin: 0,
			                    callback: function(value, index, values) {
			                        return value+'%';
			                    }
			                }
						}]
					},
					title: {display: true,text:'분기별 처리율'},
					tooltips: {
						mode: 'index'
						,intersect: false
						,callbacks: {
							label:function(tooltipItems, data){
								return "";
							},
							footer: function(tooltipItems, data) {
								return '처리율: ' +parseInt(tooltipItems[0].yLabel)+"%";
							},
						}
					},
					legend: false
				}
		});
		
	}
	
	// TODO
	//차트3(WBS 실적현황) 있을때만 데이터 세팅
	if(!gfnIsNull(wbsCurrentData)){
		//차트1 - 데이터 세팅
		var chart_tskNm = []; 
		var chart_tskWeightPlan = [];
		var chart_tskWeightComp = [];
		//차트1 데이터 분기
		$.each(wbsCurrentData,function(idx, map){
			//테스크 명
			chart_tskNm.push(map.wbsTskNm);
			
			//테스크 계획
			chart_tskWeightPlan.push(map.tskWeightPlan);
			
			//테스크 실적
			chart_tskWeightComp.push(map.tskWeightComp);
		});
		
		var ctx5 = document.getElementById("wbsCurrentDataChart").getContext('2d');
		
		//차트 데이터 있는지 체크하고 이미 있는경우 차트 소멸하고 다시 세팅
		if(!gfnIsNull(dashboardChart[4])){
			dashboardChart[4].destroy();
		}
		
		//차트 생성
		dashboardChart[4] = new Chart(ctx5, {
		    type: 'bar',
		    data: {
		    	labels: chart_tskNm,
		        datasets: [{
		        	type:'bar',
		            label: '계획',
		            data: chart_tskWeightPlan,
		            backgroundColor:'#f77768',
		            borderColor: '#f77768',
		            borderWidth: 2,
		            pointStyle: 'rect',
			        valueShow: 'barY',
			        valueShowStr: "%"
		        },{
		        	type:'bar',
		            label: '실적',
		            data: chart_tskWeightComp,
		            backgroundColor:'#4b73eb',
		            borderColor: 'rgb(75, 115, 235, 1)',
		            borderWidth: 2,
		            pointStyle: 'rect',
			        valueShow: 'barY',
			        valueShowStr: "%"
		        }]
		    },
		    options: {
					responsive: false,
					title: {display: false,text:'WBS 실적 현황'},
					tooltips: {
						mode: 'index'
						,intersect: false
						,callbacks: {
							label:function(tooltipItems, data){
								var thisLabel = data.datasets[tooltipItems.datasetIndex].label;
								return thisLabel+": "+tooltipItems.yLabel+"%";
							}, 
							footer: function(tooltipItems, data) {
								return "";
							},
						}
					},
					legend: {labels: {usePointStyle: true}}
					,scales: {
			            xAxes: [{
			                display:false,
			                barPercentage: 1.0 // X축 bar 차트간 간격 설정 옵션
			            }],
			            // WBS 진척 현황 차트 Y축이 0부터 시작되고, 정수만 표시되도록 추가
			            yAxes: [{
							ticks: {
								min: 0, // Y축 최소값 지정
								max: 100, // Y축 최대값 지정
								callback: function(value){
									return value+'%';
								}
							}
						}]
			        } 
				}
		});
	}
}