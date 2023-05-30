
/*
 * 간트차트에서 사용할 기본 줌 단계를 설정한다.
 */
Ganttalendar.prototype.initZoomlevels = function () {

  var self = this;

  // define the zoom level arrays 
  this.zoomLevels = [];
  this.zoomDrawers = {};


  function _addZoom(zoom,zoomDrawer){
    self.zoomLevels.push(zoom);
    self.zoomDrawers[zoom] = zoomDrawer;

    //compute the scale
    // ganttDrawsSVG.js에서 _createTaskSVG() 에서 차트 그려줄 때의
    // x, width 값 계산에 사용되는 fx 값
    self.zoomDrawers[zoom].computedScaleX=600/millisFromString(zoom);
  }


  //-----------------------------  3 DAYS  600px-----------------------------
  // 일간 차트 헤더(줌인(+) 최대로 했을 경우), 다음과 같이 효시
  //       2019년 4월 14일 - 4월 20일(w.16)
  //	4월 14일 (일) | 4월 15일 (월) | 4월 16일 (화) ...
	_addZoom("3d", {
	    adjustDates: function (start, end) {
	    	start.setFirstDayOfThisWeek();
	    	end.setFirstDayOfThisWeek();
	    	end.setDate(end.getDate() + 6);
	    },
	    // 상단 ROW,
	    row1 : function (date, ctxHead) {
	    		var start = new Date(date.getTime());
	    		date.setDate(date.getDate() + 6);
				    
	    		// 상단 ROW 텍스트
	    		// date.js의 getWeekNumber() 함수로 주차를 가져온다. 시작은 0 부터이므로 +1을 해준다.
	    		var topRowTitle = start.format("yyyy")+"년 "+(start.getMonth()+1)+"월 "+start.getDate() +"일 - "+(date.getMonth()+1)+"월 "+date.getDate() +"일"+" (w."+(start.getWeekNumber()+1) +")";
	    		
	    		// 상단 ROW의 Head 세팅
	    		self.createHeadCell(1, this, ctxHead, topRowTitle, 7, "", start, date);
	    		date.setDate(date.getDate() + 1);
	    },
	    // 하단 ROW, 월 일 표시 (ex) 4월 19일
	    row2 : function (date, ctxHead, ctxBody) {
	    		var start = new Date(date.getTime());
			    date.setDate(date.getDate() + 1);
			      
			    // 주말 체크, 헤더 상단의 날짜가 주말인지 체크한다.
			    // 주말일 경우 holy class 추가
			    var holyClass = isHolidayCss(start) ? "holy" : "";

			    // 하단 ROW 텍스트
			    // date.js의 getDayAbbreviation() 함수로 한글자로 표시되는 요일을 가져온다.
			    var bottomRowTitle = (start.getMonth() + 1)+"월 "+ start.getDate() +"일 ("+start.getDayAbbreviation()+")";

			    // 하단 ROW의 Head와 Body 세팅
			    self.createHeadCell(2, this, ctxHead, bottomRowTitle, 1, "headSmall "+holyClass, start,date);
			    self.createBodyCell(this, ctxBody,1, start.getDay() % 7 == (self.master.firstDayOfWeek + 6) % 7, holyClass);
	    }
	});

  //-----------------------------  1 WEEK  600px -----------------------------
  // 주단위로 표시
/*	_addZoom("1w", {
		adjustDates: function (start, end) {

		    //reset day of week
			start.setFirstDayOfThisWeek();
		    start.setDate(start.getDate() - 7);
		    end.setFirstDayOfThisWeek();
		    end.setDate(end.getDate() + 13);
		},
		row1 : function (date, ctxHead) {  
				var start = new Date(date.getTime());
				date.setDate(date.getDate() + 6);
				
				//date.setTime(date.getTime() - 1000 * 60 * 60 * 1);
				
				// 상단 ROW 텍스트
	    		// date.js의 getWeekNumber() 함수로 주차를 가져온다. 시작은 0 부터이므로 +1을 해준다.
	    		var topRowTitle = start.format("yyyy")+"년 "+(start.getMonth()+1)+"월 "+start.getDate() +"일 - "+(date.getMonth()+1)+"월 "+date.getDate() +"일"+" (w."+(start.getWeekNumber()+1) +")";
				
	    		// 상단 ROW의 Head 세팅
	    		self.createHeadCell(1, this, ctxHead, topRowTitle, 7, "", start,date);
				date.setDate(date.getDate() + 1);
		},
		row2 : function (date, ctxHead, ctxBody) {
				var start = new Date(date.getTime());
				date.setDate(date.getDate() + 1);
				
				// 주말 체크
				var holyClass = isHolidayCss(start) ? "holy" : "";
				
				// 하단 ROW 텍스트
			    // date.js의 getDayAbbreviation() 함수로 한글자로 표시되는 요일을 가져온다.
				var bottomRowTitle = start.getDate()+" ("+start.getDayAbbreviation()+")";
				
				// 하단 ROW의 Head와 Body 세팅
				//self.createHeadCell(2, this, ctxHead, bottomRowTitle, 1, "headSmall "+holyClass, start, date);
				self.createHeadCellWeek(2, this, ctxHead, bottomRowTitle, 1, "headSmall "+holyClass, start, date);
				self.createBodyCell(this, ctxBody, 1, start.getDay() % 7 == (self.master.firstDayOfWeek + 6) % 7, holyClass);

		}
	});*/


  //-----------------------------  2 WEEKS  600px -----------------------------
	// 주단위 표시 - 1w보다 축소된 주단위, 다음과 같이 차트 헤더 표시
	//       2019년 5월 5일 ~ 5월 11일 (w.19)
	//	 	5 |  6  | 7  | 8 |  9 |  10 |  11 
	_addZoom( "2w",{
		adjustDates: function (start, end) {
			
			start.setFirstDayOfThisWeek();
			// start 날짜 기준 -7일까지 헤더 표시
			start.setDate(start.getDate() - 7);
			end.setFirstDayOfThisWeek();
			// end 날짜 기준  +20일까지 헤더 표시
			end.setDate(end.getDate() + 20); // 원본 소스값 end.setDate(end.getDate() + 18);
	    },
	    row1 : function (date, tr1) {
	    		var start = new Date(date.getTime());
	    		date.setDate(date.getDate() + 6);
	    		
	    		// 상단 ROW 텍스트
	    		// date.js의 getWeekNumber() 함수로 주차를 가져온다. 시작은 0 부터이므로 +1을 해준다.
	    		var topRowTitle = start.format("yyyy")+"년 "+(start.getMonth()+1)+"월 "+start.getDate() +"일 - "+(date.getMonth()+1)+"월 "+date.getDate() +"일"+" (w."+(start.getWeekNumber()+1) +")";
	    		
	    		// 상단 ROW의 Head 세팅
	    		self.createHeadCell(1, this, tr1, topRowTitle, 7, "", start, date);
	    		date.setDate(date.getDate() + 1);
	    },
	    row2 : function (date, tr2, trBody) {
	    		var start = new Date(date.getTime());
	    		date.setDate(date.getDate() + 1);
	    		
	    		// 주말 체크
	    		var holyClass = isHolidayCss(start) ? "holy" : "";

	    		// 하단 ROW title
	    		var bottomRowTitle = start.getDate();//+"("+start.getDayAbbreviation()+")";
	    		
	    		// 하단 ROW의 Head와 Body 세팅
	    		self.createHeadCell(2, this, tr2, bottomRowTitle, 1, "headSmall "+holyClass, start,date);
	    		self.createBodyCell(this,trBody,1, start.getDay() % 7 == (self.master.firstDayOfWeek + 6) % 7, holyClass);
	    }
	});
	

	//-----------------------------  1 MONTH  600px  -----------------------------
	// 월단위 표시, 다음과 같이 차트 헤더 표시
	//             2019년 05월 
	//		1 | 2 | 3 | 4 | 5 | 6 | 7 ....
	_addZoom( "1M",{
	    adjustDates: function (start, end) {
	    	start.setMonth(start.getMonth()-1);
	    	start.setDate(15);
	    	end.setDate(1);
	    	//end.setMonth(end.getMonth() + 1);
	    	end.setMonth(end.getMonth() + 2);
	    	//end.setDate(end.getDate() + 14);
	    	end.setDate(end.getDate() + 16);
	    },
	    row1 : function (date, tr1) {
	    		var start = new Date(date.getTime());
			    date.setDate(1);
			    date.setMonth(date.getMonth() + 1);
			    date.setDate(date.getDate() - 1);
			    // 각 달의 일수를 구한다.
			    var inc=date.getDate()-start.getDate()+1;
			    date.setDate(date.getDate() + 1);
			    
			    // 상단 ROW의 Head 세팅
			    // 5번째 인수는 span 수가 들어가고 여기에는 각 달의 일수가 들어간다. 
			    self.createHeadCell(1, this, tr1, start.format("yyyy년 MM월"), inc, "", start, date);
	    },
	    row2 : function (date, tr2, trBody) {
	    		var start = new Date(date.getTime());
	    		date.setDate(date.getDate() + 1);
	    		
	    		// 주말 체크
	    		var holyClass = isHolidayCss(start) ? "holy" : "";
	    		
	    		// 하단 ROW의 Head와 Body 세팅
	    		self.createHeadCell(2, this, tr2, start.getDate(), 1, "headSmall "+holyClass, start, date);
	    		var nd = new Date(start.getTime());
	    		nd.setDate(start.getDate() + 1);
	    		self.createBodyCell(this, trBody, 1, nd.getDate() == 1, holyClass);
	    }
	});



    //-----------------------------  1 QUARTERS  ----------------------------
	// 분기 단위 표시
	/*_addZoom( "1Q", {
	      adjustDates: function (start, end) {
		        start.setDate(1);
		        start.setMonth(Math.floor(start.getMonth() / 3) * 3 -1 );
		        end.setDate(1);
		        end.setMonth(Math.floor(end.getMonth() / 3) * 3 + 4);
		        end.setDate(end.getDate() - 1);
	      },
	      row1 : function (date, tr1) {
	    	  		var start = new Date(date.getTime());
	    	  		date.setMonth(Math.floor(date.getMonth() / 3) * 3 + 3);
	    	  		var inc = (date.getMonth()-start.getMonth());
	    	  		
	    	  		// 분기를 구한다.
	    	  		var quarter = (Math.floor(start.getMonth() / 3) + 1);
	    	  		
	    	  		// 상단 ROW 텍스트
	    	  		var topRowTitle = start.format("yyyy년")+" "+ quarter +GanttMaster.messages["GANTT_QUARTER"];
	    	  		
	    	  		// 상단 ROW의 Head 세팅
	    	  		self.createHeadCell(1, this, tr1, topRowTitle, inc, "", start, date);
	      },
	      row2 : function (date, tr2, trBody) {
	    	  		var start = new Date(date.getTime());
	    	  		date.setMonth(date.getMonth() + 1);
	    	  		
	    	  		// 하단 ROW 텍스트
					var bottomRowTitle = (start.getMonth()+1) + GanttMaster.messages["GANTT_MONTH"];
	    	  		
	    	  		self.createHeadCell(2, this, tr2, bottomRowTitle, 1, "headSmall", start, date);
	    	  		self.createBodyCell(this,trBody,1, start.getMonth() % 3 == 2);
	      }
    });*/

    //-----------------------------  2 QUARTERS   -----------------------------
	// 분기 단위 표시, 다음과 같이 차트 헤더 표시
	// 			2019년 2분기		2019년 3분기 ...
	//			4월	5월	6월		7월	8월	9월 ...
	_addZoom( "2Q", {
	    adjustDates: function (start, end) {
	    	start.setDate(1);
	    	start.setMonth(Math.floor(start.getMonth() / 3) * 3 -3);
	    	end.setDate(1);
	    	end.setMonth(Math.floor(end.getMonth() / 3) * 3 + 6);
	    	end.setDate(end.getDate() - 1);
	    },
	    row1 : function (date, tr1) {
	    		var start = new Date(date.getTime());
	    		date.setMonth(date.getMonth() + 3);
	    		
	    		// 분기를 구한다.
	    		var quarter = (Math.floor(start.getMonth() / 3) + 1);
	    		
	    		// 상단 ROW 텍스트
    	  		var topRowTitle = start.format("yyyy년")+" "+ quarter + GanttMaster.messages["GANTT_QUARTER"];
	    		
	    		self.createHeadCell(1, this, tr1, topRowTitle, 3, "", start, date);
	    },
	    row2 : function (date, tr2, trBody) {
	    		var start = new Date(date.getTime());
	    		date.setMonth(date.getMonth() + 1);
	    		
	    		// 하단 ROW 텍스트
				var bottomRowTitle = (start.getMonth()+1) + GanttMaster.messages["GANTT_MONTH"];

	    		self.createHeadCell(2, this, tr2, bottomRowTitle, 1, "headSmall", start, date);
	    		self.createBodyCell(this,trBody,1, start.getMonth() % 3 == 2);
	    }
	});


  //-----------------------------  1 YEAR  -----------------------------
  // 반기별 표시, 다음과 같이 차트 헤더 표시
  //			2019년 상반기 
  //	1월 | 2월 | 3월 | 4월 | 5월 | 6월 ... 로 표시한다
	_addZoom( "1y", {
	    adjustDates: function (start, end) {
	    	start.setDate(1);
	    	start.setMonth(Math.floor(start.getMonth() / 6) * 6 -6);
	    	end.setDate(1);
	    	end.setMonth(Math.floor(end.getMonth() / 6) * 6 + 12);
	    	end.setDate(end.getDate() - 1);
	    },
	    // 상단 ROW, 년 - 반기 표시 (ex) 2019년 상반기
	    row1 : function (date, tr1) {
			      var start = new Date(date.getTime());
			      date.setMonth(date.getMonth() + 6);
			      var sem = (Math.floor(start.getMonth() / 6) + 1);
			      
			      var semsterMessage = GanttMaster.messages["GANTT_FIRST_SEMESTER"]; // 상반기
			      // 하반기 여부 체크
			      if(sem == 2){
			    	  semsterMessage = GanttMaster.messages["GANTT_SECOND_SEMESTER"]; // 하반기
			      }
			      
			      self.createHeadCell(1, this, tr1, start.format("yyyy")+"년 "+semsterMessage, 6, "", start, date);
	    },
	    row2 : function (date, tr2, trBody) {
			      var start = new Date(date.getTime());
			      date.setMonth(date.getMonth() + 1);

			      self.createHeadCell(2, this, tr2, (start.getMonth()+1)+"월", 1, "headSmall", start, date);
			      self.createBodyCell(this,trBody,1, (start.getMonth() + 1) % 6 == 0);
	    }
	});


	//-----------------------------  2 YEAR ()-----------------------------
	// 연별 표시, 다음과 같이 차트 헤더 표시
	//      2019년
	//  상반기  | 하반기 ...
	_addZoom( "2y", {
	    adjustDates: function (start, end) {
	      start.setDate(1);
	      start.setMonth(-6);
	      end.setDate(30);
	      end.setMonth(17);
	    },
	    // 상단 ROW, 년도 표시
	    row1 : function (date, tr1) {
	    			var start = new Date(date.getTime());
	    			var inc = 12 - start.getMonth();
	    			date.setMonth(date.getMonth() + inc);
	    			self.createHeadCell(1, this, tr1, start.format("yyyy")+"년", inc/6, "", start, date);
	    },
	    // 하단 ROW, 상반기/하반기 표시
	    row2 : function (date, tr2, trBody) {
	    			var start = new Date(date.getTime());
	    			date.setMonth(date.getMonth() + 6);
	    			// 상반기/하반기 값 계산
	    			var sem = (Math.floor(start.getMonth() / 6) + 1);
	      
	    			// 상반기 텍스트
	    			var semsterMessage = GanttMaster.messages["GANTT_FIRST_SEMESTER"]; // 상반기
	    			// 하반기일 경우 텍스트 변경
	    			if(sem == 2){
	    				semsterMessage = GanttMaster.messages["GANTT_SECOND_SEMESTER"]; // 하반기
	    			}
	      
	    			self.createHeadCell(2, this, tr2, semsterMessage, 1, "headSmall", start, date);
	    			self.createBodyCell(this, trBody, 1, sem == 2);
	    }
    });



};

