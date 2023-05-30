/**
 * osl 객체 생성 순서대로 배치
 */

// osl.config.js begin /////////////////////////////////////////////////
	/**
	 * C: osl javascript 설정파일 클래스
	 * <pre>
	 * </pre>
	 * 
	 * @classDescription osl Javascript 설정파일 클래스로서 공통상수를 명시함 
	 * 
	 * */
	if( !osl ) var osl = {};

	/**
	* O: osl 공통상수
	*/
	osl.c = {
	 
	  /** 프레임워크 버전 */
	  VERSION : "0.5",

	  /** CONTEXT ROOT - JSP용*/
	  ROOT_PATH : "",
	  
	  /** CONTEXT ROOT - Javascript용*/
	  ROOT_PATH_JS : "/",

	  /** 화면명 */
	  JSP_NAME : "",

	  /** 세션만료체크 (종료시 몇 초 전) */
	  SESSION_CHK : 5 * 60,

	  /** 에러페이지 URL 경로 (세션중단) */
	  PATH_ERR_NOSESSION : "",

	  /** 토큰값 */
	  TOKEN  : "",

	  /** 웹페이지 기본 인코딩셋 */
	  CHAR_SET : "UTF-8"     // 웹페이지 기본 인코딩셋
	  
	};

	// 콤보
	osl.c.COMBO = {
	  LABEL_ALL    : "전체",
	  LABEL_SELECT : "선택"
	};

	// 각종 ID 모음
	osl.c.ID = {
	  LOADING_BAR : "#osl_LoadingBar",
	  WIN_FORM    : "#_osl_winForm",
	  WIN_POPUP   : "#_osl_winPopup",
	  WIN_TIP     : "_osl_tip",
	  DEBUG_PANEL : "#_osl_logPanel",
	  DEBUG_TXT   : "#_osl_logPanelDesc",
	  FILE_DN     : "_oslDownload"
	};

	// 서버요청
	osl.c.REQ = {
	  TYPE_FORM : "do",
	  TYPE_JSON : "ajax",
	  TYPE_XML  : "kxml",
	  DATA_JSON : "jsonp",
	  DATA_XML  : "xml"
	};

	// 테이블 관련 공통상수
	osl.c.TABLE = {
	  NAVI_PAGE        : "_duNaviPage",
	  NAVI_PAGE_CNT    : "_duNaviPageCnt",
	  NAVI_PAGE_SIZE   : "_duNaviPageSize",
	  NAVI_ROW         : "_duNaviRow",
	  NAVI_ROW_CNT     : "_duNaviRowCnt",
	  NAVI_ROW_SIZE    : "_duNaviRowSize",
	  NAVI_PARAM       : "_duNaviParam",
	  NAVI_URL         : "_duNaviUrl",
	  NAVI_RES         : "_duNaviRes",
	  NAVI_TARGET_ROW  : "devonTargetRow",
	  NO_DATA          : "조회결과가 존재하지 않습니다.",
	  NOT_ROW          : "notRow",
	  FIRST_ROW        : "duTableFirstRow",
	  PAGING_DATATYPE  : "komaf",
	  DEFAULT_DATATYPE : "local",
	  RELOAD           : "reloadGrid",
	  UPDATEPAGER      : "updatepager",
	  DATALLOADING     : "dataloading",
	  PAGE             : "page",
	  PREFIX           : "tab"
	};

	// window
	osl.c.WINDOW = {
	  ID_SEQ      : "_autoGenId_",
	  PARAM_TOKEN : "_metaToken"
	};


	// 클래스 관련 공통상수
	osl.c.CLASS = {
	  FOCUS   : "oslFocus",
	  INVALID : "oslInvalid",
	  TIP     : "oslTip"
	};

	// REDRAW 관련 공통상수
	osl.c.REDRAW = {
	  DIV_FOCUS : "_duRedrawFocus_"
	};

	// Validator
	osl.c.VD = {
	  DIV_INVALID : "_duVdInvalid_"
	};

	// Date
	osl.c.DATE = {
	  FORMAT      : "YYYYMMDD", // 기본 날짜형식
	  SERVER_DATE : null,
	  LOCAL_DATE  : null,
	  PICKER_BTN_IMG : "/images/content/btn_cal.gif"
	};

	// Biz 관련 공통상수
	osl.c.BIZ = {
	  serverDate      : null,
	  SESSION_VALID   : null,
	  SESSION_TIMEOUT : 30 * 60
	};

	// 정규식처리 관련 공통상수 (번역 대상에 포함되지 않음)
	osl.c.REG_PTN = {

	  TRIM : /(^ *)|( *$)/g,
	  LTRIM : /(^ *)/g,
	  RTRIM : /( *$)/g,
	  INNER_TRIM : / +/g,
	  INNER_SPACE : / /g,
	  NUM : /[0-9]/g,
	  NOT_NUM : /[^0-9]/g,
	  NOT_NUM_PARSE : /[^0-9\.-]/g,
	  ENG : /[a-zA-Z]/g,
	  NOT_ENG : /[^a-zA-Z]/g,
	  KOR : /[ㄱ-ㅎㅏ-ㅣ가-힣]/g,
	  NOT_KOR : /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g,
	  NOT_NUM_OR_ENG : /[^0-9a-zA-Z]/g,
	  MONEY : /(\d)(?=(?:\d{3})+(?!\d))/g,

	  HAS_HTML : /<\/?[a-zA-Z][a-zA-Z0-9]*[^<>]*>/,
	  IS_NUM : /^[0-9]+$/,
	  IS_NOT_NUM : /^[^0-9]+$/,
	  IS_ENG : /^[a-zA-Z]+$/,
	  IS_NUM_ENG : /^[0-9a-zA-Z]+$/,
	  IS_KOR : /^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/,
	  IS_NUM_KOR : /^[0-9ㄱ-ㅎㅏ-ㅣ가-힣]+$/,
	  IS_RRN : /^(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(|\D)[1-4](\d{6})$/,
	  IS_FGN : /^(\d{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])(|\D)[5-8](\d{6})$/,
	  IS_EMAIL : /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
	  IS_HOME_PHONE : /^(0[2-8][0-5]?)(|\D)([1-9]{1}[0-9]{2,3})(|\D)([0-9]{4})$/,
	  IS_CELL_PHONE1 : /^(01[1346-9])(|\D)([1-9]{1}[0-9]{2,3})(|\D)([0-9]{4})$/,
	  IS_CELL_PHONE2 : /^(010)(|\D)([2-9]{1}[0-9]{3})(|\D)([0-9]{4})$/,
	  IS_JUMIN : /^[0-9]{13}$/,
	  IS_UPPERCASE : /^[A-Z]+$/,
	  IS_LOWERCASE : /^[a-z]+$/,
	  IS_CURRENCY : /^[1-9][0-9]{0,2}(,[0-9]{3})*(\.[0-9]{1}[0-9]*)?$/,
	  
	  UNMASK : [ "X", "9", "*" ],

	  MASK_CHR : /[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]/,
	  MASK_NUM : /[0-9]/,
	  MASK_ALL : /./,

	  HAN_1ST : ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ' ],
	  HAN_2ND : ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'],
	  HAN_3RD : ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],

	  HAN_JOSA : ['은','는','이','가','을','를'],

	  HAN_JOSA_MERGE_1 : /(은\W는\W|는\W은\W)/,
	  HAN_JOSA_MERGE_2 : /(이\W가\W|가\W이\W)/,
	  HAN_JOSA_MERGE_3 : /(을\W를\W|를\W을\W)/

	};


	// 유효성 관련 상수
	osl.c.CHK = {
	IS_osl_HOME_PHONE : ["010", "011", "013", "0130", "016", "017", "018", "019", "02", "0303", "03033", "031", "032", "033", "041", "042", "043", "044", "050", "0502", "0505", "0506", "051", "052", "053", "054", "055", "061", "062", "063", "064", "070", "080"]
	};

	// Validator
	osl.c.VALIDATOR = {
	  SHOW_TIP       : true,            // 툴팁 표시여부
	  CHECK_INTERVAL : 200,             // 실시간 검사 체크주기 (msec)
	  /*
	  NEW_LINE       : ( $.browser.msie ) ? "\u000D\u000A" : ", ",  // 줄바꾸기
	  RULE_DESC      : ( $.browser.msie ) ? "\u000D\u000A---------\u000D\u000A" : "\u000D\u000A : \u000D\u000A"
	  */
	};

	// AJAX 설정
	osl.c.AJAX = {
	  debug    : false,     // 디버깅모드
	  focus    : true,      // 송신 후 버튼 Focus 복원기능
	  method   : "POST",    // GET/POST
	  loading  : true,      // 기본 로딩바 표시여부
	  dataType : "json",    // 데이터 전송타입 (json/jsonp)
	  sync     : false,     // 동기전송 여부
	  timeout  : 600 * 1000 // 조회대기시간 (sec * 1000)
	};

	/**
	* osl javascript 설정파일 클래스
	* 
	* @classDescription osl Javascript Configuration
	*/
	osl.conf = {};

	//AJAX
	osl.conf.ajax = {
	    debug        : false,     // 디버깅모드
	    method       : "POST",    // GET/POST
	    loading      : true,      // 기본 로딩바 표시여부
	    dataType     : "json",    // 데이터 전송타입 (json/jsonp)
	    sync         : false,     // 동기전송 여부
	    timeout      : 300 * 1000 // 조회대기시간 (sec * 1000)
	};

	//REDRAW
	osl.conf.redraw = {
	    label : true
	};

	//로그
	osl.conf.log = {
	    debug      : true,
	    panelExist : false,
	    window : {
	         width    : 400,
	         height   : 200,
	         fontSize : 11
	    }
	};

	//휴일을 배열로 설정
	var holidays = {
		// 아래와 같이 휴일을 설정하면 휴일이 적용됨	
		//"0101":{type:0, title:"신정"},
		//"0301":{type:0, title:"삼일절"},
		//"0505":{type:0, title:"어린이날"},
		//"0606":{type:0, title:"현충일"},
		//"0815":{type:0, title:"광복절"},
		//"1003":{type:0, title:"개천절"},
		//"1225":{type:0, title:"크리스마스"}
	};

	// datepicker 초기화 관련 내용
	var applyCustomStyleBeforeShow = function(input)
	{
		setTimeout(function() {   
			if($("#datepickerDelBtn")[0]) return;
			
			$(input).datepicker( "widget" ).find( ".ui-datepicker-month" ).before("년 ");
			$(input).datepicker( "widget" ).find( ".ui-datepicker-month" ).after("월");
			  
			var buttonPane = $( input )   
				.datepicker( "widget" )   
	 			.find( ".ui-datepicker-buttonpane" );   
			
			// start : 년도 이동 버튼 추가
			var btn = $('<BUTTON id="datepickerPrev" title="작년" class="ui-datepicker-clear ui-state-default ui-priority-secondary ui-corner-all">작년</BUTTON>');   
			btn.unbind("click")   
			    .bind("click", function () {   
			    	$.datepicker._adjustDate($(input), -1, 'Y');  
				});   
			btn.appendTo( buttonPane ); 
			
			var btn = $('<BUTTON id="datepickerNext" title="내년" class="ui-datepicker-clear ui-state-default ui-priority-secondary ui-corner-all">내년</BUTTON>');   
			btn.unbind("click")   
			    .bind("click", function () {   
			    	$.datepicker._adjustDate($(input), +1, 'Y');
				});   
			btn.appendTo( buttonPane );
			// end : 년도 이동 버튼 추가
			
			// 삭제 버튼
			var btn = $('<BUTTON id="datepickerDelBtn" class="ui-datepicker-clear ui-state-default ui-priority-secondary ui-corner-all">삭제</BUTTON>');   
			btn.unbind("click")   
			    .bind("click", function () {   
					$.datepicker._clearDate( input );   
				});   

			btn.appendTo( buttonPane );  
			
		}, 1 );
	};

	//datepicker 초기화 관련 내용
	var applyCustomStyleChange = function(input)
	{
		setTimeout(function() {   
			if($("#datepickerDelBtn")[0]) return;
			
			$(input).datepicker( "widget" ).find( ".ui-datepicker-month" ).before("년 ");
			$(input).datepicker( "widget" ).find( ".ui-datepicker-month" ).after("월");
			
			var buttonPane = $( input )   
				.datepicker( "widget" )   
	 			.find( ".ui-datepicker-buttonpane" );   
			
			// start : 년도 이동 버튼 추가
			var btn = $('<BUTTON id="datepickerPrev" title="작년" class="ui-datepicker-clear ui-state-default ui-priority-secondary ui-corner-all">작년</BUTTON>');   
			btn.unbind("click")   
			    .bind("click", function () {   
			    	$.datepicker._adjustDate($(input), -1, 'Y');
				});   
			btn.appendTo( buttonPane ); 
			
			var btn = $('<BUTTON id="datepickerNext" title="내년" class="ui-datepicker-clear ui-state-default ui-priority-secondary ui-corner-all">내년</BUTTON>');   
			btn.unbind("click")   
			    .bind("click", function () {   
			    	$.datepicker._adjustDate($(input), +1, 'Y');
				});   
			btn.appendTo( buttonPane );
			// end : 년도 이동 버튼 추가
			
			// 삭제 버튼
			var btn = $('<BUTTON id="datepickerDelBtn" class="ui-datepicker-clear ui-state-default ui-priority-secondary ui-corner-all">삭제</BUTTON>');   
			btn.unbind("click")   
			    .bind("click", function () {   
					$.datepicker._clearDate( input );   
				});   

			btn.appendTo( buttonPane );  

		}, 1 );
	};


	//beforeShow, onChangeMonthYear에 동일한 function 명 사용 불가
	jQuery(function($){
		  $.datepicker.regional['ko'] = {
		    closeText       : '닫기',
		    prevText        : '이전달',
		    nextText        : '다음달',
		    currentText     : '오늘',
		    monthNames      : ['1','2','3','4','5','6','7','8','9','10','11','12'],
		    monthNamesShort : ['1','2','3','4','5','6','7','8','9','10','11','12'],
		    dayNames        : ['일','월','화','수','목','금','토'],
		    dayNamesShort   : ['일','월','화','수','목','금','토'],
		    dayNamesMin     : ['일','월','화','수','목','금','토'],
		    dateFormat      : osl.c.DATE.FORMAT.replace( "YYYY", "YY" ).toLowerCase(),
		    firstDay        : 0,
		    isRTL           : false,
		    showMonthAfterYear : true,
		    changeMonth     : true,
		    changeYear      : true,
		    showButtonPanel : true,
		    showOn          : "button",
		    buttonText      : "달력으로 날짜입력",
	        buttonImage     : osl.c.ROOT_PATH_JS + osl.c.DATE.PICKER_BTN_IMG,
		    buttonImageOnly : true,
		    duration        : "",
		    showOtherMonths : true,
			selectOtherMonths: true,
			gotoCurrent     : true,
			beforeShow      : function( input ) {   
				applyCustomStyleBeforeShow(input);
			},
		    onChangeMonthYear : function( year, month, inst ) { 
		    	applyCustomStyleChange(inst.input);
		    },					    
		    beforeShowDay   : function(day) {
		    	var result;
	            var holiday = holidays[$.datepicker.formatDate("mmdd",day )]; //표시날이 휴일인지 체크
	            
	            // 공휴일인 경우, 공휴일 CSS 적용 
	            if (holiday) {
	              result =  [true, "ui-datepicker-holiday"+holiday.type, holiday.title];
	            } else {
	              switch (day.getDay()) {
	                case 0: // 일요일
	                  result = [true, "ui-datepicker-sunday"];	//일요일인 경우, 일요일 CSS 적용
	                  break;
	                case 6: // 토요일?
	                  result = [true, "ui-datepicker-saturday"];	//토요일인 경우, 토요일 CSS 적용
	                  break;
	                default:
	                  result = [true, ""];
	                  break;
	              }
	            }
	            
	            return result;
		    }
		    
		  };
		  $.datepicker.setDefaults($.datepicker.regional['ko']);
		});
	
// osl.config.js end ///////////////////////////////////////////////////

// osl.mdata.js begin///////////////////////////////////////////////////
	/**
	 * C: 멀티 데이터셋 클래스
	 * 
	 * @classDescription  osl Javascript 내의 Object 멀티 데이터 구조의 객체를 컨트롤 한다.
	*/
	osl.mdata = function() {
		
	  var z_self = arguments.callee;
	  if(!(this instanceof z_self)) return new z_self();
		
	  this.z_data = new Object();
	};

	/**
	* F: 데이터를 더한다.
	* 
	* @param {String} key - 키
	* @param {Object} value - 값
	*/
	osl.mdata.prototype.add = function( key, value ) {

	  if( osl.chk.isNull(key) ) return;
	  if( osl.chk.isNull(value) ) {
	    value = "";
	  } else {
	    value = !isNaN(value) ? value : ( osl.chk.isTypStr(value) ) ? value :$(value).val();
	  }

	  if( !this.z_data[key] ) {
	    this.z_data[ key ] = [];
	  }
	  this.z_data[ key ].push( value );
	};

	/**
	 * F: 데이터를 삭제한다.
	 * 
	 * @param {String} key - 키
	 */
	osl.mdata.prototype.del = function( key ) {
	  if( osl.chk.isNull(key) ) return;
	  delete this.z_data[key];
	};

	/**
	* F: 폼데이터를 더한다.<br>
	* 개체의 name 속성이 키, value 속성이 값으로 세팅된다.
	* 
	* @param {String} expression - 셀렉터
	*/
	osl.mdata.prototype.addForm = function( expression ) {

	  var self = this;

	  $(expression).each( function() {

	    var th = $(this);

	    if( th.is("[type=button]") ) return true;

	    if( th.is(":input") ) {
	        var key = th.attr("name");

	        if( osl.chk.isEmpty(key) ) return true;
	        if( th.is(":checkbox") && !th.is(":checked") ) return true;
	        if( th.is(":radio")    && !th.is(":checked") ) return true;

	        self.add( key, osl.z_vdCore.getUnmaskedVal(th) );
	    } else {
	    	self.addForm( $(":input", th) );
	    }

	  }); 

	};
	
	
	/**
	 * F: 키와 인덱스 순서에 해당하는 값을 가져온다.
	 * 
	 * @param {String} key - 키
	 * @param {Number} index - 인덱스
	 * @return {String} 값
	 */
	osl.mdata.prototype.get = function( key, index ) {
	  if( !this.z_data[key] ) return null;
	  return this.z_data[ key ][ index ];
	};

	/**
	 * F: 데이터를 초기화한다.
	 */
	osl.mdata.prototype.clear = function() {
	  this.header = [];
	  this.z_data = new Object();
	};

	/**
	 * F: 데이터의 크기를 반환한다.
	 * 
	 * @return {Number} 데이터크기
	 */
	osl.mdata.prototype.size = function() {
	  var z_max = 0;
	  for( var c in this.z_data ) {
	    z_max = Math.max( z_max, this.z_data[c].length );
	  }
	  return z_max;
	};

	/**
	 * F: 헤더값을 반환한다.
	 * 
	 * @return {Array} 헤더값
	 */
	osl.mdata.prototype.getHeader = function() {
	  var z_header = [];
	  for( var c in this.z_data ) {
	    z_header.push( c );
	  }
	  return z_header;
	};

	/**
	 * F: JSON 형식의 raw 데이터를 반환한다.
	 * 
	 * @return {Object} JSON 데이터
	 */
	osl.mdata.prototype.getData = function() {
	  return this.z_data;
	};

	/**
	 * F: 데이터의 크기를 균일하게 맞춘다.
	 * 
	 * @private
	 */
	osl.mdata.prototype.z_setMaxSize = function() {
	  var size = this.size();
	  for( var c in this.z_data ) {
	    if( this.z_data[c].length < size ) {
	      for( var inx = 1; inx < size; inx++ ) {
	        if( this.z_data[c][inx] == undefined ) this.z_data[c][inx] = "";
	      }
	    }
	  }
	};

	/**
	 * F: URI 인코딩된 데이터 값을 가져온다.
	 * 
	 * @return {mdata}
	 */
	osl.mdata.prototype.getUriEncodeData = function() {
	  var result = this.z_data;
	  for( var c in result ) {
	    for( var inx = 0, inxCnt = result[c].length; inx < inxCnt; inx++ ) {
	      result[c][inx] = encodeURIComponent( result[c][inx] );
	    }
	  }
	  return result;
	};
// osl.mdata.js end ////////////////////////////////////////////////////

// osl.core.js begin ///////////////////////////////////////////////////
/**
 * C: 화면에 로딩바를 표시하는 클래스 
 * 
 * @classDescription 화면에 로딩바를 보여주는 유틸리티 (버튼 차단 역할도 수행)
 */
osl.loadingBar = {

  /**
   * F: 로딩바를 생성한다.
   */
  create : function() {

    if( $(osl.c.ID.LOADING_BAR).length > 0 ) return;

    $("<div>").attr({
      "id"    : osl.c.ID.LOADING_BAR.replace("#",""),
      "class" : osl.c.ID.LOADING_BAR.replace("#","")
    })
    .append("<img src='/images/loding/loadingBar.gif' alt='로딩중 표시 이미지' />")
    .appendTo("body").hide();

  },

  /**
   * F: 로딩바를 보여준다.
   */
  show : function() {

    osl.loadingBar.z_showCnt ++;

    if( osl.loadingBar.z_showCnt > 1 ) return;

    var width  = $(window).width();
    var height = $(window).height();
    
    $(osl.c.ID.LOADING_BAR).css({
      left   : 0,
      top    : 0,
      width  : width,
      height : height,
      cursor : "wait"
    }).show();
    /*
    if( $.browser.safari || $.browser.opera ) {
      osl.etc.wait( 0 );
    }*/

  },

  /**
  * F: 로딩바를 감춘다.
  */
  hide : function() {

    osl.loadingBar.z_showCnt --;

    if( osl.loadingBar.z_showCnt > 1 ) return;

    if( $.browser.msie || $.browser.safari ) {
      $(osl.c.ID.LOADING_BAR).css("cursor", "auto");
    }

    $(osl.c.ID.LOADING_BAR).hide();

  }

};

osl.loadingBar.z_showCnt = 0;


/**
* O: Request 관련 공통모듈
* 
* @classDescription Request 관련 공통모듈
*/
osl.req = {};

osl.req.z_req  = osl.mdata();
osl.req.z_ajax = {};
osl.req.meta   = {}; // 동기호출시 메타데이터가 저장되는 장소
osl.req.data   = {}; // 동기호출시 통신결과가 저장되는 장소
osl.req.formName = ""; //multipart인 경우 전송할 form명

/**
 * O: 동기호출시 호출에러 여부가 저장되는 장소
 * 
 * @return {Boolean}
 */
osl.req.err = false;


/**
* F: 파라미터를 추가한다.
* 
* @param {String} key - 키
* @param {String} value - 값
*/
osl.req.addParam = function( key, value ) {
  osl.req.z_req.add( key, value );
};

/**
* F: FORM 파라미터를 추가한다.
* 
* @param {String} expression - 셀럭터
*/
osl.req.addForm = function( expression ) {
  osl.req.z_req.addForm( expression );
};

/**
 * F: 세팅한 파라미터를 초기화한다.
 */
osl.req.clearParam = function() {
  osl.req.z_req.clear();
};


/**
 * F: 서버와 통신이 성공했을 경우 수행한다.
 * 
 * @param {Object} res - 결과값이 담겨있는 JSON 오브젝트 (data,meta)
 * @param {Object} options - 옵션
 * @private
 */
osl.req.z_ajax.onComplete = function( res, options ) {

  if( options.loading == true ) osl.loadingBar.hide();

  var callFlag = false;

//  switch( res.meta.errCd ) {
//    case "100" : // BizException
//    case "800" : // DevonException
//      if( options.alert ) osl.msg.alert( res.meta.msg );
//      callFlag = true;
//      break;
//    case "900" : // RuntimeException
//    case "999" : // UnknownException
//      if( options.alert ) osl.msg.alert( res.meta.msg );
//      break;
//    case "220" : // TokenException
//    case "230" : // AuthenticationException
//      osl.msg.alert( res.meta.msg );
//      break;
//    case "210" : // InvalidSessionException
//      if( !osl.chk.isEmpty(osl.c.URL_NO_SESSION) ) osl.window.z_openLoginPopup();
//      break;
//    default :    // Success
//      if( res.meta.msg != "" && options.alert == true ) osl.msg.alert( res.meta.msg );
//      callFlag = true;
//      break;
//  }
  
  if(res.meta.err == "true") {
	if( options.alert ) osl.msg.alert( res.meta.msg );
  }
  else
  {
	if( res.meta.msg != "" && options.alert == true ) osl.msg.alert( res.meta.msg );
	callFlag = true;
  }

  // 동기방식일 경우 결과값을 전역변수에 세팅
  if( options.sync == true ) {
    osl.req.meta = res.meta;
    osl.req.data = res.data;
    osl.req.err  = (res.meta.err == "true");
  }

  // 후처리함수가 세팅되었다면 이를 실행
  if( osl.chk.isTypFn(options.func) && callFlag ) options.func( res.data, (res.meta.err == "true"), res.meta );

  // 중복실행방지를 위해 해제한 focus 원위치
  if( options.focus == true && options.focusId != "" ) $("#"+options.focusId).focus();

};

/**
 * F: 서버와 통신 자체를 실패했을 경우 실행된다.
 * 
 * @param {Object} xhr - 
 * @param {Object} options - 옵션
 * @private
 */
osl.req.z_ajax.onError = function( xhr, options ) {

  if( options.loading == true ) osl.loadingBar.hide();

  // 동기방식일 경우 결과값을 전역변수에 세팅
  if( options.sync == true ) {
    osl.req.data = {};
    osl.req.err  = true;
  }

  var errMsg = "";
  var header = xhr.getAllResponseHeaders();
  if( header == null ) header = "\n";
  errMsg += osl.msg.get("osl.api.xhr.errTitle");
  errMsg += "----------------------------------------------\n";
  switch( xhr.status ) {
    case 200 : errMsg += osl.msg.get("osl.api.xhr.err200"); break;
    case 404 : errMsg += osl.msg.get("osl.api.xhr.err404"); break;
    case 0   : errMsg += osl.msg.get("osl.api.xhr.err000"); break;
  }
  errMsg += "----------------------------------------------\n";
  errMsg += ">> Status : " + xhr.status + "\n";
  errMsg += ">> ReadyState : " + xhr.readyState + "\n";
  errMsg += "----------------------------------------------\n";

  osl.msg.alert( errMsg );

  // 중복실행방지를 위해 해제한 focus 원위치
  if( options.focus == true && options.focusId != "" ) $("#"+options.focusId).focus();

};

/**
* F: 서버에 요청을 날린다.
* <pre>
*   osl.req.z_ajax.send( "/test/test/TestJqAjaxCmd.ajax", {method:'GET', async:true, progressBar:false} );
* </pre>
* 
* @private
* @param    {String} url - 호출URL
* @param    {Object} options 옵션
* <pre>
*   domain  : {String}   URL의 메인도메인 (기본값 : rootContext, 외부링크로 전송하고 싶을 경우 해당 항목을 변경한다.)
*   func    : {Function} 비동기 방식일 때 호출할 CallBack 함수 (기본값:null)
*   sync    : {Boolean}  동기방식 호출여부 (기본값:false)
*   method  : {String}   전송형식 (POST/GET), (기본값:POST)
*   timeout : {Number}   호출 대기시간 (기본값 : osl.c.AJAX.timeout 설정값 )
*   loading : {Boolean}  로딩바 표시여부 (기본값:true)
*   alert   : {Boolean}  서버에서 보내주는 메세지 표시여부 (기본값:true)
*   focus   : {Boolean}  송신 후 버튼 Focus 복원 (기본값:true)
* </pre>
*/
osl.req.z_ajax.send = function( url, options ) {

  var op = $.extend({
    domain   : osl.c.ROOT_PATH,
    func     : null,
    method   : osl.c.AJAX.method,
    dataType : osl.c.AJAX.dataType,
    sync     : osl.c.AJAX.sync,
    loading  : osl.c.AJAX.loading,
    alert    : true,
    timeout  : osl.c.AJAX.timeout,
    focus    : osl.c.AJAX.focus,
    focusId  : osl.window.getFocusId()
  }, options || {} );

  if( op.loading == true ) osl.loadingBar.show();

  // add user param
  osl.req.z_req.add( osl.c.WINDOW.PARAM_TOKEN, osl.c.TOKEN );

  // compatible for 1.3
  jQuery.ajaxSettings.traditional = true;

  var reqData = osl.req.z_req.z_data;

  // hide cursor focus
  $(op.focusId).blur();

  // call ajax
  $.ajax({
    url      : op.domain + url,
    type     : op.method,
    data     : reqData,
    dataType : op.dataType,
    timeout  : op.timeout,
    async    : !op.sync,
    success  : function(data) { osl.req.z_ajax.onComplete(data,op); },
    error    : function(xhr) { osl.req.z_ajax.onError(xhr,op); }
  });

  // clear request param
  osl.req.z_req.clear();

  // return result when SJAX called
  if( op.sync == true ) return osl.req.data;

};

/**
* F: 서버에 요청을 날린다.
* <pre>
*   osl.req.send( "/test/test/TestJqAjaxCmd.ajax", fnCallBack, {method:'GET', async:true, loadingBar:false} );
*   osl.req.send( "/test/test/TestJqAjaxCmd.ajax", function( data, err ) {
*     if( err ) return;
*     if( data == null || data.someResult == null ) return;
*     // TODO something
*   });
* </pre>
* 
* @param  {String} url - 호출URL
* @param  {Function} fn - 후처리함수 (Ajax 호출 후 실행됨)
* <pre>
*   1. function fnCallBack( 결과데이터, 에러여부 ) {} 형식을 취해야 함
*   2. 서버의 CMD 클래스에서 Output.addParam( "keyName1", 데이터 ); 로 세팅한 값은
*      결과데이터.keyName1 에 담겨 들어온다.
*   3. 에러여부 변수의 true/false 비교로 에러 여부를 확인할 수 있다.
* </pre>
* @param  {Object} options - 옵션
* <pre>
*   domain  : {String}   URL의 메인도메인 (기본값 : rootContext, 외부링크로 전송하고 싶을 경우 해당 항목을 변경한다.)
*   func    : {Function} 비동기 방식일 때 호출할 CallBack 함수 (기본값:null)
*   sync    : {Boolean}  동기방식 호출여부 (기본값:false)
*   method  : {String}   전송형식 (POST/GET), (기본값:POST)
*   loading : {Boolean}  로딩바 표시여부 (기본값:true)
*   alert   : {Boolean}  서버에서 보내주는 메세지 표시여부 (기본값:true)
*   timeout : {Number}   호출 대기시간 (기본값 : osl.c.AJAX.timeout 설정값 )
*   focus   : {Boolean}  송신 후 버튼 Focus 복원 (기본값:true)
*   multipart : {String} MutipartRequest 여부 (기본값:false)   
* </pre>
* @return {Object} 동기방식 호출시 {} 형태로 결과값 리턴
*/
osl.req.send = function( url, fn, options ) {
	
  if( osl.str(url).isEmpty() ) return false;

  if( osl.chk.isTypFn(fn) ) {
    var options = options || {};
    options.func = fn;
  } else {
    var options = fn || {};
  }
  
  var sendType = url.replace( /^.*\./, "" );

  // 이중로그인 차단을 위해 userId 재전송
  /*
  try {
    osl.req.addParam("menuUserId", sessionUserId);
  } catch(e) {
	// sessionUserId가 없는 경우 예외 처리
  }*/
  
  switch( sendType ) {
    case osl.c.REQ.TYPE_FORM :
      //multipart인 경우
      if( options.multipart == true) {
        osl.window.formName = osl.req.formName;
        osl.window.z_req = osl.req.z_req;		//addForm에 의해 추가로 Form을 추가 세팅하기 위함
        if( options.loading == true ) osl.loadingBar.show();
        osl.window.openPage( url, {method:4} );    	  
      } else {
        osl.window.z_req = osl.req.z_req;
        if( options.loading == true ) osl.loadingBar.show();
        osl.window.openPage( url, {method:2, target : options.target, submitMethod: options.submitMethod } );  
      }
      break;
    case osl.c.REQ.TYPE_CGI :
    case osl.c.REQ.TYPE_JSON :
      return osl.req.z_ajax.send( url, options );
    case osl.c.REQ.TYPE_XML  :
      options.dataType = osl.c.REQ.DATA_XML;
      return osl.req.z_ajax.send( url, options );

  }
  
  // clear request param
  osl.req.z_req.clear();

};

/**
* F: Form 이름을 셋팅한다.
* 
* @param {String} formName - formName
*/
osl.req.setFormName = function( formName ) {
  osl.req.formName = formName;
};


/**
 * C: 세션 처리를 위한 Timer 클래스
 * 
 * @classDescription  세션 처리를 위한 Timer 클래스
*/
osl.timer = {
	
	interval : 1,				// Timer의 interval (default : 1초
	initRemainTime : 7200,		// Timer의 남은 시간 (단위 : 초)
	remainTime : 7200,			// Timer의 남은 시간 (단위 : 초)
	hours : null,				// Timer의 남은 시간의 시간 환산 값
	minutes : null,				// Timer의 남은 시간의 분 환산 값
	seconds : null,				// Timer의 남은 시간의 초 환산 값
	divName : "sessionTime",	// 잔여시간 표시하기 위한  Layer 이름
	warnFlag : "N",				// 잔여시간 경고 표시 여부

	/**
	 * F: interval과 표시영역을 파라미터로 Timer를 Start 한다.
	 * 
	 * @param {Number} remainTime - 잔여시간 시작값
	 * @param {Number} interval - 잔여시간 갱신 Interval
	 * @param {String} divName - 잔여시간 표시 영역
	 */
	start : function(remainTime, interval, divName) {
		if(remainTime != null) { 
			osl.timer.remainTime = remainTime;
			osl.timer.initRemainTime = remainTime;
		}
		if(interval != null) osl.timer.interval = interval;
		if(divName != null) osl.timer.divName = divName;
		osl.timer.convertRemainTime();
		osl.timer.displayRemainTime();
		
		// 정해진 Interval 에 맞춰 시간을 count down 한다.
		setTimeout(osl.timer.count, osl.timer.interval * 1000);
	},
	
	/**
	 * F: 셋팅된 interval 간격으로 시간을 count down 한다.
	 */
	count : function() {
		osl.timer.remainTime = osl.timer.remainTime - osl.timer.interval;
		osl.timer.convertRemainTime();
		osl.timer.displayRemainTime();

		// 잔여시간이 초기시간에 비해 90% 경과되면 Session 만료 경고를 한다.
		//if( osl.timer.warnFlag != "Y" && osl.timer.remainTime <= (osl.timer.initRemainTime * 0.1) ) {
		if( osl.timer.warnFlag != "Y" && osl.timer.remainTime <= 600 ) {	//10분으로 설정
			osl.timer.warnTimeout();
		}
		
		// 잔여시간이 만료가 되면 timer를 중단 시키고 로그아웃 처리를 한다.
		if( osl.timer.remainTime == 0) {
			osl.timer.timeoutSession();
			return;
		}
		
		// 정해진 Interval 에 맞춰 시간을 count down 한다.
		setTimeout(osl.timer.count, osl.timer.interval * 1000);
	},
	
	/**
	 * F: Timer를 초기화 시킨다. 초기에 셋팅된 시간으로 초기화 시킴
	 */
	reset : function() {
		// 잔여시간이 만료가 되면 timer를 중단 시키고 로그아웃 처리를 한다.
		if( osl.timer.remainTime == 0) {
			clearTimeout(osl.timer.count);
			alert("Session이 종료되었습니다.");
			return;
		}
		
		osl.timer.remainTime = osl.timer.initRemainTime;
		osl.timer.convertRemainTime();
		osl.timer.displayRemainTime();
	},
	
	/**
	 * F: Timer의 잔여시간을 HH:MM:SS 로 변환한다.
	 */
	convertRemainTime : function() {
		osl.timer.hours = Math.floor( osl.timer.remainTime/3600 );
		osl.timer.minutes = Math.floor( (osl.timer.remainTime - (osl.timer.hours * 3600)) / 60 );
		osl.timer.seconds = osl.timer.remainTime - (osl.timer.hours * 3600) - (osl.timer.minutes * 60);
	},
	
	/**
	 * F: 잔여시간을 지정된 영역에 표시한다.
	 */
	displayRemainTime : function() {
		var disText = osl.str( osl.timer.hours ).lpad(2,"0").val() 
		             + ":" + osl.str( osl.timer.minutes ).lpad(2,"0").val()
		             + ":" + osl.str( osl.timer.seconds ).lpad(2,"0").val(); 
		$('#'+osl.timer.divName).html(disText);
	},
	
	/**
	 * F: Session을 연장한다. 서버로 SessionTouch를 수행하고, Timer를 초기화 한다.
	 */
	touchSession : function() {
		//서버로 SessionTouch를 요청
		
		//warnFlag Reset
		osl.timer.warnFlag = "N";
		
		//Timer Reset
		osl.timer.reset();
	},

	/**
	 * F: Session 만료시점이 다가오면, 사용자에게 경고 화면을 표출한다.
	 */
	warnTimeout : function() {
		osl.timer.warnFlag = "Y";
		//alert("Session이 곧 종료됩니다. 연장하세요.");
		//top.document.getElementById("top_menu").contentWindow.f_warnTimeout();
		f_warnTimeout();
	},

	/**
	 * F: Session이 만료되면 서버로 logout 이벤트를 전송하고, 로그인 화면으로 이동한다. 
	 */
	timeoutSession : function() {
		clearTimeout(osl.timer.count);
		//alert("Session이 종료되었습니다.");
		top.location.href="/autoLogOut.jsp";
	}
	
};
// osl.core.js end /////////////////////////////////////////////////////

// osl.ajax.js begin ///////////////////////////////////////////////////
/**
 * C: osl ajax 컨트롤 클래스
 * <pre>
 *   var oslAjax = new osl.ajax("/ajaxCall.do", "POST", "json");
 * </pre>
 * 
 * @param {String} url - ajax 호출URL
 * @param {String} type - 전송방식("GET", "POST") 
 * @param {String} dataType - 결과형태 ("xml", "json", "text")
 * @return {osl.ajax} ajax
 * @classDescription ajax를 컨트롤 하는 클래스로 ajax 요청, 파라미터 전송, 결과셋 포맷을 컨트롤 한다.
 * 
 * 
 * */
osl.ajax = function (url, type, dataType) {
	
	this.url = url;
	this.type = type;
	this.dataType = dataType;
	this.param = "";
};

/**
 * F: ajax 호출URL에 원하는 파라미터 값을 셋팅한다.
 * 
 * @param {String} name - parameter 이름
 * @param {String} value  - parameter 값
 * @return {void}
 */
osl.ajax.prototype.addParam = function (name, value) {

	if(this.param.length == 0){
		this.param += name + "=" + encodeURIComponent(value);
	} else {
		this.param += "&" + name + "=" + encodeURIComponent(value);
	}
};


/**
 * F: ajax를 수행한다.
 * 
 * @param {functino} callBack - ajax 결과를 처리할 function명
 * @return {void}
 */
osl.ajax.prototype.send = function (callBack){
	
	var oThis	= this;

	$.ajax({
		type: this.type,
		url: this.url, 
		data: this.param,
		dataType: this.dataType,
		success: function(msg) {

			if(msg==null) return;
			
			try {
			
				return typeof callBack == 'function' ? callBack(msg, oThis) : eval(callBack+'(msg)');
			} catch (err) {
				alert(err);
				alert("CallBack Method가  없습니다.");
			}

		}
	});
};
// osl.ajax.js end /////////////////////////////////////////////////////

// osl.chk.js begin ////////////////////////////////////////////////////
/**
 * O: 정합성 체크 유틸리티
 * <pre>
 *   객체가 유효한지 검사
 *   var nullFlag = osl.chk.isEmpty(objectName);
 * </pre>
 * 
 * @classDescription 정합성 체크 유틸리티 모음으로 필요한 함수를 객체생성 없이 사용가능하다. 
 * 
 * */
osl.chk = {};

/**
* F: 입력값이 null인지 여부를 확인한다.
* 
* @param  {Object}  obj - 검사대상 객체
* @return {Boolean} <b>null, undefined</b> 인 경우 true를 반환
*/
osl.chk.isNull= function( obj ) {
	return ( obj == null || obj == undefined ) ? true : false;
};

/**
 * F: 입력항목의 값이 비어있는지 여부를 확인한다.
 * 
 * @param {Object, String} obj - 검사할 객체
 * @return {Boolean} <b>null, undefined, ""</b> 인 경우 true를 반환
 */
osl.chk.isEmpty = function( obj ) {
	return ( obj == null || obj == "" || obj == undefined ) ? true : false;
};

/**
 * F: 정규식을 테스트한다.
 * 
 * <pre>
 *   alert( osl.chk.isReg( "aaaab a", /.*b/ ) );
 * </pre>
 * @param {String} string - 패턴검사를 수행할 문자열
 * @param {Object} pattern - 정규식패턴 (또는 문자열)
 * @return {Boolean} 테스트 성공여부
 */
osl.chk.isReg = function( string, pattern ) {
	if( osl.chk.isEmpty(string) || osl.chk.isNull(pattern) ) return false;

	var regExp = pattern;
	return regExp.test( osl.str(string).val() );
};

/**
 * F: HTML 태그가 포함되어있는지 여부를 확인한다.
 * 
 * @param {String} string - 패턴검사를 수행할 문자열
 * @return {Boolean} 태그 포함여부
 */
osl.chk.hasHtml = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.HAS_HTML );
};

/**
 * F: String 타입 여부를 확인한다.
 * 
 * @param {Object} string - 검사할 개체
 * @return {Boolean} 타입이 문자일 경우 true 반환
 */
osl.chk.isTypStr = function( string ) {
	return typeof string == "string";
};

/**
 * F: Object 타입 여부를 확인한다.
 * 
 * @param {Object} obj - 검사할 개체
 * @return {Boolean} 타입이 object일 경우 true 반환
 */
osl.chk.isTypObj = function( obj ) {
	return typeof obj == "object";
};

/**
 * F: Date 타입 여부를 확인한다.
 * 
 * @param {Object} date - 검사할 개체
 * @return {Boolean} 타입이 date일 경우 true 반환
 */
osl.chk.isTypDate = function( date ) {
	return date instanceof Date;
};

/**
 * F: Number 타입 여부를 확인한다.
 * 
 * @param {Object} number - 검사할 개체
 * @return {Boolean} 타입이 number일 경우 true 반환
 */
osl.chk.isTypNum = function( number ) {
	return typeof number == "number";
};

/**
 * F: Function 타입 여부를 확인한다.
 * 
 * @param {Object} fn - 검사할 개체
 * @return {Boolean} 타입이 function일 경우 true 반환
 */
osl.chk.isTypFn = function( fn ) {
	return typeof fn == "function";
};

/**
 * F: Array 타입 여부를 확인한다.
 * 
 * @param {Object} array - 검사할 개체
 * @return {Boolean} 타입이 array일 경우 true 반환
 */
osl.chk.isTypArr = function( array ) {
	return array instanceof Array;
};

/**
 * F: 숫자로만 구성되어있는지 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isNum = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.IS_NUM );
};

/**
 * F: 숫자가 없는지 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isNotNum = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.IS_NOT_NUM );
};

/**
 * F: 영문자로만 구성되어있는지 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isEng = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.IS_ENG );
};

/**
 * F: 영문자와 숫자로만 구성되어있는지 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isNumEng = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.IS_NUM_ENG );
};

/**
 * F: 한글로만 구성되어있는지 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isKor = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.IS_KOR );
};

/**
 * F: 한글과 숫자로만 구성되어있는지 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isNumKor = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.IS_NUM_KOR );
};

/**
 * F: 주민등록번호 여부를 확인한다.
 * 
 * @param {String} string - 검사할 문자열
 * @return {Boolean} 검사결과
 */
osl.chk.isPsn = function( string ) {

	// 형식 체크
	if( ! osl.chk.isReg(string, osl.c.REG_PTN.IS_RRN) ) return false;
	var _rrn = osl.str(string).setNum().val();

	// 날짜정합성 체크
	var _birth = osl.chk.isReg( _rrn.substr(6,1), /[1|2]/ ) ? "19" : "20";
	_birth += _rrn.substr(0,6);

	if( osl.date(_birth).val() == null ) {
		return false;
	}

	// 체크섬
	var _sum = 0;
	var _chk = [ 2,3,4,5,6,7,8,9,2,3,4,5 ];

	for(var inx = 0; inx < 12; inx++ )
		_sum += ( Number(_rrn.charAt(inx)) * _chk[inx] );

	return !((11 - (_sum % 11)) % 10 != Number(_rrn.charAt(12)));

};

/**
 * F: 이메일 여부를 확인한다.
 * 
 * @param {Object|String} obj - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isEmail = function( obj ) {
	return osl.chk.isReg( obj, osl.c.REG_PTN.IS_EMAIL );
};

/**
 * F: 검사항목의 값이 최대 바이트수 이하인지 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @param {Number} chkByte - 최대 바이트수
 * @return {Boolean} 검사결과
 */
osl.chk.isMaxByte = function( string, chkByte ) {
	return osl.str(string).bytes() <= chkByte;
};

/**
 * F: 검사항목의 값이 최소 바이트수 이상인지 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @param {Number} chkByte - 최소 바이트수
 * @return {Boolean} 검사결과
 */
osl.chk.isMinByte = function( string, chkByte ) {
	return osl.str(string).bytes() >= chkByte;
};

/**
 * F: 검사항목의 값이 최대 길이 이하인지 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @param {Number} chkLen - 최대 길이
 * @return {Boolean} 최대길이 이하일 경우 true를 반환
 */
osl.chk.isMaxLen = function( string, chkLen ) {
	return osl.str(string).length() <= chkLen;
};

/**
 * F: 검사항목의 값이 최소 길이 이상인지 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @param {Number} chkLen - 최소 길이
 * @return {Boolean} 최소길이 이하일 경우 true를 반환
 */
osl.chk.isMinLen = function( string, chkLen ) {
	return osl.str(string).length() >= chkLen;
};

/**
 * F: 올바른 날짜인지 여부를 확인한다.
 * 
 * @param {String} obj - 검사할 개체
 * @param {String} format - 날짜포맷 (YYYY:년도, MM:월, DD:일, HH:시, HI:분, SS:초)
 * @return {Boolean} 검사결과
 */
osl.chk.isDate = function( string, format ) {
	return osl.date( string, format ).val() != null;
};

/**
 * F: 일반 전화번호 형식 여부를 확인한다.
 * 
 * @param {String} string - 검사할 문자열
 * @return {Boolean} 검사결과
 */
osl.chk.isHomePhone = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.IS_HOME_PHONE );
};

/**
 * F: 핸드폰 전화번호 형식 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isCellPhone = function( string ) {

	var p = osl.str(string).substr(0,3).val();

	return osl.chk.isReg( obj, ( p == "010" ) ? osl.c.REG_PTN.IS_CELL_PHONE2 : osl.c.REG_PTN.IS_CELL_PHONE1 );
};

/**
 * F: 정의한 MASK형식에 맞는지 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @param {String} format - 패턴 ( X:문자, 9:숫자, *:문자 또는 숫자 )
 * @return {Boolean} 검사결과
 */
osl.chk.isMasked = function( string, format ) {

	var ptn = osl.str(format).val();

	ptn = ptn.replace( /[x|X]/g, "[a-zA-Zㄱ-ㅎㅏ-ㅣ가-힣]" );
	ptn = ptn.replace( /[9]/g, "[0-9]" );
	ptn = ptn.replace( /\*/g, "." );

	ptn = eval( "/" + ptn + "/g" );

	return osl.chk.isReg( string, ptn );
};

/**
 * F: 국내거소신고번호(외국인등록번호,재외국민등록번호) 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isFsn = function( string ) {

	// 형식 체크
	if( ! osl.chk.isReg(string, osl.c.REG_PTN.IS_FGN) ) return false;
	var _rrn = osl.str(string).setNum().val();

	if(((_rrn.substr(7,1) * 10) + _rrn.substr(8,1)) % 2 != 0)
		return false;

	// 날짜정합성 체크
	var _birth = osl.chk.isReg( _rrn.substr(6,1), /[5|6]/ ) ? "19" : "20";
	_birth += _rrn.substr(0,6);
	//_birth = osl.obj.getDate( _birth );
	if( _birth == null ){
		return false;
	}

	// 등록기관체크(7.외국국적동포, 8.재외국민, 9.외국인) : 실명번호 기준 발급일 경우 존재로 인한 로직 제외
	/*
	if( !osl.chk.isReg( _rrn.substr(11,1), /[7|8|9]/ ) )
		return false;
    */

	// 체크섬
	var _sum = 0;
	var _chk = [ 2,3,4,5,6,7,8,9,2,3,4,5 ];

	for(var inx = 0; inx < 12; inx++ )
		_sum += ( Number(_rrn.charAt(inx)) * _chk[inx] );

	return !(((11 - (_sum % 11)) + 2) % 10 != Number(_rrn.charAt(12)));

};

/**
 * F: 사업자등록번호 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isCsn = function( string ) {

	var _bun = osl.str(string).setNum().val();
	if( !osl.chk.isReg(_bun, osl.c.REG_PTN.IS_NUM) || !osl.chk.isReg(_bun, /^\d{10}$/))
		return false;

	var ckValue = new Array(10);
	ckValue[0] = ( parseFloat(_bun.substring(0 ,1)) * 1 ) % 10;
	ckValue[1] = ( parseFloat(_bun.substring(1 ,2)) * 3 ) % 10;
	ckValue[2] = ( parseFloat(_bun.substring(2 ,3)) * 7 ) % 10;
	ckValue[3] = ( parseFloat(_bun.substring(3 ,4)) * 1 ) % 10;
	ckValue[4] = ( parseFloat(_bun.substring(4 ,5)) * 3 ) % 10;
	ckValue[5] = ( parseFloat(_bun.substring(5 ,6)) * 7 ) % 10;
	ckValue[6] = ( parseFloat(_bun.substring(6 ,7)) * 1 ) % 10;
	ckValue[7] = ( parseFloat(_bun.substring(7 ,8)) * 3 ) % 10;
	ckTemp = String((parseFloat(_bun.substring(8 ,9)) * 5)) + "0";
	ckValue[8] = parseFloat( ckTemp.substring(0,1) ) + parseFloat( ckTemp.substring(1,2) );
	ckValue[9] = parseFloat(_bun.substring(9,10));
	ckLastid = (10 - (( ckValue[0]+ckValue[1]+ckValue[2]+ckValue[3]+ckValue[4]+ckValue[5]+ckValue[6]+ckValue[7]+ckValue[8] ) % 10 )) % 10;

	return !(ckValue[9] != ckLastid);
};

/**
 * F: 법인등록번호 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isLsn = function( string ) {

	// 형식 체크
	var _bin = osl.str(string).setNum().val();
	if( !osl.chk.isReg(_bin, osl.c.REG_PTN.IS_NUM) || !osl.chk.isReg(_bin, /^\d{13}$/))
		return false;

	var _chk = [ 1,2,1,2,1,2,1,2,1,2,1,2 ];
	var _sum = 0;
	for(var i = 0; i < _chk.length; i++){
		_sum += _chk[i] * _bin.substring(i ,i+1);
	}

	return ((10 - _sum % 10) % 10 == _bin.substring(12 ,13));

};

/**
 * F: 영문자와 숫자 두가지 혼합으로 구성되어있는지 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isNumAndEng = function( string ) {

	if(osl.chk.isReg( string, osl.c.REG_PTN.IS_NUM_ENG ))
		return (!osl.chk.isReg( string, osl.c.REG_PTN.IS_NUM ) && !osl.chk.isReg( string, osl.c.REG_PTN.IS_ENG));
	else
		return false;
};



/**
 * F: 실명인증시 14세 미만 체크 스크립트
 * 
 * @param {String} socno1 - 주민번호 앞자리 8자리
 * @param {String} checkYear - 주민번호 뒷자리 첫번째수 
 * @return {String} N 14세미만, M 14세이상 18세미만, Y 18세이상, I 입력형식 오류
 */
osl.chk.isMoreThan14age = function(socno1, checkYear){

    var u_year;
    var u_month;
    var u_day;
    var v_age;
    var v_today = new Date();

    if( checkYear > 0 &&  checkYear < 3)
       u_year = "19" + socno1.substring(0, 2);
    else if(checkYear > 2 &&  checkYear < 5)
       u_year = "20" + socno1.substring(0, 2);
    else return 'wrong';     // 2002.10.8 주민등록뒷자리 첫번째 번호 유효성 체크 (1,2,3,4) are only valid  -- by muse

    u_month = socno1.substring(2, 4);
    u_day = socno1.substring(4);

    var rVal = isValidDate(u_year, u_month, u_day );
    if( rVal == 'N' ) return 'I';
    else if( rVal == 'Y' ){
        v_age = v_today.getYear()*1 - u_year*1;
        if( u_month*1 > (v_today.getMonth*1+1) ){
            v_age -= 1;
        }
        else if( u_month*1 == (v_today.getMonth()*1+1) && u_day*1 > v_today.getDate()*1 ){
            v_age -= 1;
        }
    }
    
    if( v_age < 14 ) return 'N';
    else if( v_age >= 14 && v_age < 18 ) return 'M';
    else return 'Y';
    
    function isValidDate ( v_year, v_month, v_day){
        var today = new Date();
        var d_year = v_year*1;
        var d_month = v_month*1;
        var d_day = v_day*1;

        /* 과거 날짜여야 함. */
        if( v_year > today.getYear() )
            return 'N';
        else if( v_year == today.getYear() && v_month*1 > (today.getMonth()*1+1))
            return 'N';
        else if( v_year == today.getYear() && v_month*1 == (today.getMonth()*1+1) && v_day > today.getDate())
            return 'N';

        /* 달별 일 check */
        if( d_month == 1 || d_month == 3 || d_month == 5 || d_month == 7 || d_month == 8 || d_month == 10 || d_month == 12){
            if( d_day > 31 || d_day < 1) return 'N';
        }
        else if(d_month == 4 || d_month == 6 || d_month == 9 || d_month == 11 ){
            if( d_day > 30 || d_day < 1 ) return 'N';
        }
        else if( d_month == 2 )
        {
          if( ((d_year%4) == 0 && (d_year%100)!= 0) || ((d_year%100) == 0 && (d_year%400) == 0) ){
              if( d_day > 29 || d_day < 1 ) return 'N';
          }
          else {
              if( d_day > 28 || d_day < 1 ) return 'N';
          }
        }

        return 'Y';
    }
};

/**
 * F: 입력값이 대문자인지를 확인한다.
 * 
 * @param {String} string - 검사할 개체 
 * @return {boolean} 검사결과 
 */
osl.chk.uppercase = function(string){
	return (osl.chk.isReg(string, osl.c.REG_PTN.IS_UPPERCASE));
};


/**
 * F: 입력값이 소문자인지를 확인한다.
 * 
 * @param {String} string - 검사할 개체 
 * @return {boolean} 검사결과 
 */
osl.chk.lowercase = function(string){
	return (osl.chk.isReg(string, osl.c.REG_PTN.IS_LOWERCASE));
};

/**
 * F: 체크박스 라디오박스가 체크되어 있는지를 확인한다.
 * 
 * @param {String} objectName - 대상이름
 * @return {boolean} true 체크한값있음 false 체크한값없음 
 */
osl.chk.comboBoxChk = function(objectName){
	var flag = false;
	var chkList = document.getElementsByName(objectName);

	for(var i = 0; i < chkList.length; i++){

		if(chkList[i].checked){
			flag = true;
			break;
		}
	}
	return flag;
};

/**
* F: 국내 일반 전화번호를 입력 받아 오류가 있는 위치를 반환한다.
* 
* @param {String} no1 - 지역번호
* @param {String} no2 - 국번
* @param {String} no3 - 번호
* @return {int} 검사결과 (0:이상없음, 1:지역번호오류, 2:국번오류, 3:번호오류)
*/
osl.chk.invalidHomePhone = function() {
       var args     = arguments;
       var ptns     = [/^0[2-8][0-5]?$/, /^[1-9][\d]{2,3}$/, /^[0-9]{4}$/];

       if(!args[0] || !osl.chk.invalidoslHomePhoneNo1(args[0])) return 1;
       
       for (var i=1, ptn; ptn=ptns[i]; i++) if (!args[i] || !args[i].match(ptn)) return i+1;
       return 0;
};

/**
* F: 국내 핸드폰번호를 입력 받아 오류가 있는 위치를 반환한다.
* 
* @param {String} no1 - 사업자번호
* @param {String} no2 - 국번
* @param {String} no3 - 번호
* @return {int} 검사결과 (0:이상없음, 1:사업자번호오류, 2:국번오류, 3:번호오류)
*/
osl.chk.invalidCellPhone = function() {
       var args     = arguments;
       var fO10     = args[0] == '010';
       var ptns     = fO10 ? [/^010$/, /^[2-9]{1}[\d]{3}$/, /^[\d]{4}$/] : [/^01[1346-9]$/, /^[1-9]{1}[\d]{2,3}$/, /^[\d]{4}$/];

       for (var i=0, ptn; ptn=ptns[i]; i++) if (!args[i] || !args[i].match(ptn)) return i+1;

       return 0;
};


/**
* F:  국내 지역번호 전화번호를 입력 받아 오류가 있는 위치를 반환한다.(워크넷용)
* 
* @param {String} no1 - 지역번호
* @return {int} 검사결과 (true:이상없음, false:지역번호오류)
*/
osl.chk.invalidoslHomePhoneNo1 = function(no1) {
	var flag = false;
    var no1List = osl.c.CHK.IS_osl_HOME_PHONE;
    
    //지역번호 검사
    for(var i=0; i < no1List.length; i++){
    	if(!no1)return flag;
    	if(no1List[i] == no1){
    		flag = true; 
    		break;
    	}
    }
    return flag;
};

/**
 * F: 통화 형식 여부를 확인한다.
 * 
 * @param {String} string - 검사할 개체
 * @return {Boolean} 검사결과
 */
osl.chk.isCurrency = function( string ) {
	return osl.chk.isReg( string, osl.c.REG_PTN.IS_CURRENCY );
};
// osl.chk.js end //////////////////////////////////////////////////////



// osl.data.js begin ///////////////////////////////////////////////////
/**
 * C: 데이터셋 클래스
 * <pre>
 * </pre>
 * 
 * @classDescription osl Javascript 내의 Object 데이터 구조의 객체를 컨트롤 한다.
 */
osl.data = function() {
	this.z_data = new Object();
};

/**
 * F: 데이터를 세팅한다.
 * 
 * @param {String} key
 * @param {Object} value
 */
osl.data.prototype.add = function( key, value ) {
	if( osl.chk.isNull(key) ) return;
	this.z_data[ key ] = value;
};

/**
 * F: 데이터를 삭제한다.
 * 
 * @param {String} key
 */
osl.data.prototype.del = function( key ) {
	if( osl.chk.isNull(key) ) return;
	delete this.z_data[key];
};

/**
 * F: 데이터가 해당 키를 가지고 있는지 여부를 확인한다.
 * 
 * @param {String} key
 */
osl.data.prototype.hasKey = function( key ) {
	if( osl.chk.isNull(key) ) return false;
	return ( osl.chk.isNull(this.z_data[key]) ) ? false : true;
};

/**
 * F: 폼데이터를 더한다.<br>
 * 개체의 name 속성이 키, value 속성이 값으로 세팅된다.
 * 
 * @param {String} expression - jquery 셀렉터
 */
osl.data.prototype.addForm = function( expression ) {

	var self = this;

	$(expression).each( function() {

		var th = $(this);

		if( th.is("[type=button]") ) return true;
		if( th.attr("name") == "" ) return true;

		if( th.is(":input") ) {
			self.add( th.attr("name"), th.val() );
		} else {
			self.addForm( $(":input", th) );
		}

	});
};

/**
 * F: 키값에 해당하는 데이터를 추출한다.
 * 
 * @param {String} key - 키
 */
osl.data.prototype.get = function( key ) {
	return this.z_data[ key ];
};

/**
 * F: 데이터를 초기화한다.
 */
osl.data.prototype.clear = function() {
	this.z_data = new Object();
};

/**
 * F: 데이터의 크기를 반환한다.
 * 
 * @return {Number} 데이터크기
 */
osl.data.prototype.size = function() {
	var z_max = 0;
	for( var c in this.z_data ) {
		z_max++;
	}
	return z_max;
};

/**
 * F: 입력한 정보의 헤더값을 반환한다.
 * 
 * @return {Array} 헤더정보
 */
osl.data.prototype.getHeader = function() {
	var header = [];
	for( var c in this.z_data ) {
		header.push( c );
	}
	return header;
};

/**
 * F: JSON 형식의 raw 데이터를 반환한다.
 * 
 * @return {Object} JSON 데이터
 */
osl.data.prototype.getData = function() {
	return this.z_data;
};

/**
 * F: 데이터를 병합한다.
 * 
 * @param {osl.data} mergeData - 병합할 데이터
 */
osl.data.prototype.merge = function( mergeData ) {

	var src = this.z_data;
	var des = mergeData.getData();

	this.z_data = $.extend( src, des );

};

/**
 * F: 데이터가 동일한지 확인한다.
 * 
 * @param {osl.data} data - 비교할 데이터
 * @return {Boolean} 동일여부
 */
osl.data.prototype.equals = function( data ) {

	if( ! (data instanceof osl.data) ) return false;

	var thisHdr = this.getHeader();
	var dataHdr = data.getHeader();

	if( thisHdr.length != dataHdr.length ) return false;

	for( var i = 0, iCnt = thisHdr.length; i < iCnt; i++ ) {

		var key = thisHdr[ i ];
		var src = this.get( key );
		var trg = data.get( key );

		if( trg  == undefined ) return false;
		if( src != trg ) return false;
	}

	return true;

};
// osl.data.js end /////////////////////////////////////////////////////

// osl.msg.js begin ////////////////////////////////////////////////////
/**
* O: 메세지 처리 유틸리티
* 
* @classDescription 메세지 처리 유틸리티
*/
osl.msg = {
};

osl.msg.z_p = {
	msgPool   : [],
	debugPool : []
};

/**
* F: 메세지코드에 해당하는 문자열을 출력한다.
* <pre>
*   osl.msg.alert( "osl 프로젝트" );
*   osl.msg.alert( "@님  안녕하세요.", "홍길동" );
*   osl.msg.alert( "err.info.001", "hudson", "osl" );
* </pre>
* 
* @param  {String} msgCd - 메세지코드 또는 출력할 메세지
* @param  {Argument} replaceStr - 메세지에서 '@' 문자와 치환될 문자배열
*/
osl.msg.alert = function( msgCd ) {
	alert( osl.msg.get(arguments) );
};

/**
* F: 문자열을 confirm box로 보여준 후 사용자의 선택결과를 반환한다.
* <pre>
*   if( osl.msg.confirm( "ok??" ) ) processY(); else processN();
* </pre>
* 
* @param  {String} msgCd - 메세지코드 또는 출력할 메세지
* @param  {Argument} param - 메세지에서 '@' 문자와 치환될 문자배열
* @return {Boolean} true(Y)/false(N)
*/
osl.msg.confirm = function( msgCd ) {
	return confirm( osl.msg.get(arguments) );
};

/**
 * F: 로그를 출력한다.
 * 
 * @param {String} message - 출력할 메세지
 */
osl.msg.debug = function( message ) {

	if( ! osl.conf.log.debug ) return;
	
	var msg = "<p>" + osl.date().toString("[HH:MI:SS]") + " " + osl.str(message).clearXss().val() + "</p>";

	if( !osl.msg.z_p.makeDebugger(msg) ) return;

	$(osl.c.ID.DEBUG_TXT).append( msg ).scrollTop( 65535 );

};

/**
* F: '@' 문자에 해당하는 메세지를 치환해서 반환한다.
* <pre>
*   osl.msg.get( '@_@_TEST', 'merong', 'nuna' ); -> 반활할 문자는 'merong_nuna_TEST'
*   osl.msg.get( 'com.alt.001' ); -> 'com.alt.001' 코드에 해당하는 문자를 반환 (코드는 서버와 동일)
* </pre>
* 
* @param  {String} inputMsg - 출력할 메세지
* @param  {Argument} param - 메세지에서 '@' 문자와 치환될 문자열
* @return {String} 반환할 메세지
*/
osl.msg.get = function( inputMsg ) {

	if( osl.chk.isTypObj(arguments[0]) ) arguments = arguments[ 0 ];

	var argLen = arguments.length;

	if( argLen == 0 ) return '';

	var code = arguments[0] + "";

	var msg = osl.msg.z_p.msgPool[ code ];
	if( msg == null ) msg = code;

	if( argLen == 1 ) return msg;

	// bind @ to Input String (array)
	var idx = 0;

	for( var i = 1; i < argLen; i++ ) {

		idx = msg.indexOf( "@", idx );

		if( idx < 0 ) break;

		// "/@" 패턴일 경우 @문자를 그대로 출력
		if( msg.charAt(idx - 1) == "/" ) {

			msg = msg.substring( 0, idx - 1 ) + msg.substring( idx );
			i--;
			idx++;
			continue;
		}

		var param = osl.str( arguments[i] );

		var msgAfter = msg.substring( idx + 1 );

		// 한글문자일 경우 은/는/이/가 처리
		var charKr = param.getLastKr();
		if( charKr[0] != null ) {

			msgAfter = msgAfter.substring( 0, 4 )
			.replace( osl.c.REG_PTN.HAN_JOSA_MERGE_1, osl.c.REG_PTN.HAN_JOSA[0] )
			.replace( osl.c.REG_PTN.HAN_JOSA_MERGE_2, osl.c.REG_PTN.HAN_JOSA[2] )
			.replace( osl.c.REG_PTN.HAN_JOSA_MERGE_3, osl.c.REG_PTN.HAN_JOSA[4] )
			+ msgAfter.substring( 4 );

			var josa = msgAfter.charAt( 0 );
			var which;

			$.each( osl.c.REG_PTN.HAN_JOSA, function(n) {

				if( josa != this ) return true;

				which = n;
				return false;

			});

			switch( which ) {

			case 0 : case 1 :
				which = ( charKr[2] != "" ) ? 0 : 1; break;
			case 2 : case 3 :
				which = ( charKr[2] != "" ) ? 2 : 3; break;
			case 4 : case 5 :
				which = ( charKr[2] != "" ) ? 4 : 5; break;

			}

			if( which != undefined ) msgAfter = osl.c.REG_PTN.HAN_JOSA[which] + msgAfter.substring( 1 );
		}

		msg = msg.substr( 0, idx ) + param.val() + msgAfter;
		idx = idx + param.length();
	}
	return msg;
};

/**
 * F: 디버그용 창을 만든다.
 * 
 * @private
 */
osl.msg.z_p.makeDebugger = function( message ) {

	// 패널 생성가능 여부를 확인한다.
	if( !$.isReady ) {
		osl.msg.z_p.debugPool.push( message );
		setTimeout( arguments.callee, 50 );
		return false;
	}

	if( osl.conf.log.panelExist ) return true;

	// 화면 위치를 조정한다.
	var mL   = osl.conf.log.window.width - 190;
	var top  = $(window).height() - osl.conf.log.window.height - 10;
	var left = $(window).width()  - osl.conf.log.window.width  - 20;

	if( mL   < 0 ) ml   = 10;
	if( top  < 0 ) top  = 0;
	if( left < 0 ) left = 0;

	// 디버그 패널을 생성한다.
	$("<div>").css({
		"position"   : "fixed",
		"font-size"  : osl.conf.log.window.fontSize,
		"color"      : "#FFFFFF",
		"background" : "#000000",
		"border"     : "1px solid",
		"opacity"    : "0.7",
		"width"      : osl.conf.log.window.width,
		"height"     : osl.conf.log.window.height,
		"white-space": "nowrap",
		"top"        : top,
		"left"       : left
	}).attr("id", osl.c.ID.DEBUG_PANEL.replace("#",""))
	.append(
			$("<div>")
			.append( "<span style='font-weight:bold;text-decoration:underline;'>komaf-ui Logger</span>" )
			.append( "<a href='javascript:;' onclick='osl.msg.z_p.clearDebugger();' style='color:#FAEB78;margin-left:" + mL + "px;'>clear</a>")
			.append( "<a href='javascript:;' onclick='osl.msg.z_p.closeDeubgger();' style='color:#FAEB78;margin-left:10px'>close</a>")
	)
	.append(
			$("<div>").attr("id", osl.c.ID.DEBUG_PANEL.replace("#","") + "Desc" )
			.css({
				"overflow" : "scroll",
				"height"   : osl.conf.log.window.height - 15
			})
	).appendTo("body").show();

	// 미출력 메세지 출력
	$.each( osl.msg.z_p.debugPool, function() {
		$(osl.c.ID.DEBUG_TXT).append( this.toString() );
	});

//  $( osl.msg.z_p.debugPool ).each( function(i){
//    $(osl.c.ID.DEBUG_TXT).append( osl.msg.z_p.debugPool[i] );
//  });

	osl.msg.z_p.debugPool = null;
	osl.conf.log.panelExist = true;

	return true;
};

/**
 * F: 로그 창의 내용을 모두 지운다.
 */
osl.msg.z_p.clearDebugger = function() {
	$(osl.c.ID.DEBUG_TXT).html("");
};

/**
 * F: 로그 창을 숨긴다.
 */
osl.msg.z_p.closeDeubgger = function() {
	$(osl.c.ID.DEBUG_PANEL).hide();
};
// osl.msg.js end //////////////////////////////////////////////////////

// osl.message.api.js begin ////////////////////////////////////////////
osl.msg.z_p.msgPool["osl.api.loadingBar"  ] = "처리중입니다";
osl.msg.z_p.msgPool["osl.api.xhr.errTitle"] = "통신 중 오류가 발생하였습니다.\n";
osl.msg.z_p.msgPool["osl.api.xhr.err200"  ] = "응답유형이 다릅니다.\n";
osl.msg.z_p.msgPool["osl.api.xhr.err404"  ] = "요청하신 주소를 찾지 못하였습니다.\n";
osl.msg.z_p.msgPool["osl.api.xhr.err000"  ] = "서버와 연결하지 못하였습니다.\n";


osl.msg.z_p.msgPool["osl.api.file.btnAddFile"  ] = "파일선택";
osl.msg.z_p.msgPool["osl.api.file.cfm000"      ] = "동일한 이름[@]의 파일이 대기열에 이미 존재합니다.\n\n해당 파일로 교체하시겠습니까 ?";
osl.msg.z_p.msgPool["osl.api.file.err000"      ] = "@개까지만 파일을 전송할 수 있습니다.";

osl.msg.z_p.msgPool["osl.api.file.err002"      ] = "파일[@]의 크기가 최대 허용량[@ Mbyte]을 초과하였습니다.";
osl.msg.z_p.msgPool["osl.api.file.err003"      ] = "크기가 0인 파일[@]은 전송할 수 없습니다.";
osl.msg.z_p.msgPool["osl.api.file.err004"      ] = "파일[@]의 확장자가 전송가능한 확장자(@)가 아닙니다.";
osl.msg.z_p.msgPool["osl.api.file.err005"      ] = "최대 전송 허용량[@]을 초과하였습니다.";
osl.msg.z_p.msgPool["osl.api.file.err006"      ] = "해당 파일[@]은 보안상 위험할 수 있어 전송이 차단되었습니다.\n\n보안상 다음과 같은 형식을 갖는 파일은 전송을 허용하지 않습니다.\n(@)";
osl.msg.z_p.msgPool["osl.api.file.err007"      ] = "osl.file :객체[@]가 존재하지 않습니다.";
osl.msg.z_p.msgPool["osl.api.file.err008"      ] = "파일[@] 전송에 실패하였습니다.\n(@)";

osl.msg.z_p.msgPool["osl.api.vd.inputType"     ] = "입력형식";

osl.msg.z_p.msgPool["osl.api.vdRule.required"  ] = "필수입력";
osl.msg.z_p.msgPool["osl.api.vdRule.minlen"    ] = "최소 @자리 (현재 @자리)";
osl.msg.z_p.msgPool["osl.api.vdRule.maxlen"    ] = "최대 @자리 (현재 @자리)";
osl.msg.z_p.msgPool["osl.api.vdRule.fixlen"    ] = "고정 @자리 (현재 @자리)";
osl.msg.z_p.msgPool["osl.api.vdRule.minbyt"    ] = "최소 @바이트 (현재 @바이트)";
osl.msg.z_p.msgPool["osl.api.vdRule.maxbyt"    ] = "최대 @바이트 (현재 @바이트)";
osl.msg.z_p.msgPool["osl.api.vdRule.fixbyt"    ] = "고정 @바이트 (현재 @바이트)";
osl.msg.z_p.msgPool["osl.api.vdRule.date"      ] = "날짜형식 입력";
osl.msg.z_p.msgPool["osl.api.vdRule.email"     ] = "e-mail";
osl.msg.z_p.msgPool["osl.api.vdRule.homephone" ] = "전화번호";
osl.msg.z_p.msgPool["osl.api.vdRule.cellphone" ] = "휴대전화번호";
osl.msg.z_p.msgPool["osl.api.vdRule.num"       ] = "숫자만 허용";
osl.msg.z_p.msgPool["osl.api.vdRule.eng"       ] = "영문자만 허용";
osl.msg.z_p.msgPool["osl.api.vdRule.kor"       ] = "한글만 허용";
osl.msg.z_p.msgPool["osl.api.vdRule.noe"       ] = "영문자 또는 숫자만 허용";
osl.msg.z_p.msgPool["osl.api.vdRule.nae"       ] = "영문자와 숫자를 모두 포함";
osl.msg.z_p.msgPool["osl.api.vdRule.nok"       ] = "한글 또는 숫자만 허용";
osl.msg.z_p.msgPool["osl.api.vdRule.notnum"    ] = "숫자입력 금지";
osl.msg.z_p.msgPool["osl.api.vdRule.mask"      ] = "입력형식[@]";
osl.msg.z_p.msgPool["osl.api.vdRule.psn"       ] = "주민등록번호";
osl.msg.z_p.msgPool["osl.api.vdRule.fsn"       ] = "국내거소신고번호";
osl.msg.z_p.msgPool["osl.api.vdRule.csn"       ] = "사업자등록번호";
osl.msg.z_p.msgPool["osl.api.vdRule.lsn"       ] = "법인등록번호";
osl.msg.z_p.msgPool["osl.api.vdRule.currency"  ] = "통화형식만 허용";

osl.msg.z_p.msgPool["osl.api.vdMsg.required"   ] = "필수입력입니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.minlen"     ] = "@자리 이상 입력되어야 합니다. (현재 @자리)";
osl.msg.z_p.msgPool["osl.api.vdMsg.maxlen"     ] = "@자리 이하로 입력되어야 합니다. (현재 @자리)";
osl.msg.z_p.msgPool["osl.api.vdMsg.fixlen"     ] = "@자리만큼 입력되어야 합니다. (현재 @자리)";
osl.msg.z_p.msgPool["osl.api.vdMsg.minbyt"     ] = "@바이트 이상 입력되어야 합니다. (현재 @바이트)";
osl.msg.z_p.msgPool["osl.api.vdMsg.maxbyt"     ] = "@바이트 이하로 입력되어야 합니다. (현재 @바이트)";
osl.msg.z_p.msgPool["osl.api.vdMsg.fixbyt"     ] = "@바이트만큼 입력되어야 합니다. (현재 @바이트)";
osl.msg.z_p.msgPool["osl.api.vdMsg.date"       ] = "올바른 날짜가 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.email"      ] = "올바른 E-메일 형식이 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.homephone"  ] = "올바른 전화번호가 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.cellphone"  ] = "올바른 휴대전화번호가 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.num"        ] = "숫자만 입력하셔야 합니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.eng"        ] = "영문자만 입력하셔야 합니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.kor"        ] = "한글만 입력하셔야 합니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.noe"        ] = "영문자 또는 숫자만 입력하셔야 합니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.nae"        ] = "영문자와 숫자를 모두 포함하여 입력하셔야 합니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.nok"        ] = "한글 또는 숫자만 입력하셔야 합니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.notnum"     ] = "숫자를 입력하실 수 없습니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.mask"       ] = "올바른 입력형식[@]이 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.psn"        ] = "올바른 주민등록번호가 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.fsn"        ] = "올바른 국내거소신고번호가 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.csn"        ] = "올바른 사업자등록번호가 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.lsn"        ] = "올바른 법인등록번호가 아닙니다.";
osl.msg.z_p.msgPool["osl.api.vdMsg.currency"   ] = "통화형식으로 입력하셔야 합니다.";
// osl.message.api.js end //////////////////////////////////////////////

// osl.window.js begin /////////////////////////////////////////////////
/**
 * O: 윈도우 창 컨트롤에 관련된 유틸리티 클래스
 * 
 * @classDescription 윈도우 창 컨트롤에 관련된 유틸리티 클래스
 */
osl.window = {

  z_idSeq : 0, 					// 오브젝트에 부여하는 ID
  z_req   : new osl.mdata(), 	// 화면에 넘겨주는 데이터가 저장되는 공간
  formName : "", 				//multipart인 경우 전송할 form명

  /**
  * F: 팝업을 호출한다.<br>
  * <pre>
  *   var popup = osl.window.openPopup( "", 200, 300 );
  *
  *   1. 팝업창의 입력상자에 접근해 값을 변경
  *   $("#inputPopup", popup.document ).val( "merong" );
  *   $( popup.document ).find("#inputPopup").val("merong");
  *
  *   2. 팝업창의 스크립트를 실행
  *   $(popup)[0].fnPopupScript();
  *  
  *   3. 팝업창에서 부모창에 접근해 값을 변경
  *   $("#inputOpner", opner.document).val("merong");
  * </pre>
  *
  * @param {String} url - 호출할 페이지
  * @param {String} width - 창 너비
  * @param {String} height - 창 높이
  * @param {Object} option - 옵션
  * <pre>
  *   scrollbars  : {Boolean} 스크롤바 생성여부 (기본값 : false )
  *   status      : {Boolean} 상태바 생성여부 (기본값 : false )
  *   toolbar     : {Boolean} 툴바 생성여부 (기본값 : false )
  *   copyhistory : {Boolean} ? (기본값 : false )
  *   menubar     : {Boolean} 메뉴바 생성여부 (기본값 : false )
  *   location    : {Boolean} 주소입력창 생성여부 (기본값 : false )
  *   directories : {Boolean} ? (기본값 : false )
  *   method      : {String}  팝업화면에 데이터를 보내는 방법 (POST (기본값) / GET)
  *   domain      : {String}  URL의 메인도메인 (외부링크를 열고 싶을 경우 해당 항목을 "" 처리한 후 full-URL을 입력한다.)
  * </pre>
  * @return {Object} 팝업윈도우 핸들러
  */
  openPopup : function( url, width, height, option ) {

	if( osl.chk.isEmpty(url) ) return;
	
    var op = $.extend({
      id          : osl.c.ID.WIN_POPUP,
      scrollbars  : false,
      status      : false,
      resizable   : true, // 크기조절을 막는 기능은 IE에서만 된다.
      toolbar     : false,
      copyhistory : false,
      menubar     : false,
      location    : false,
      directories : false,
      method      : "post",
      domain      : osl.c.ROOT_PATH
    }, option || {} );

    op.width       = width;
    op.innerWidth  = width + 6;
    op.height      = height;
    op.innerHeight = height + 32;

    var param = "";
    var temp = "";
    for( var c in op ) {
      // IE 7 오동작에 따른 불필요한 option 정보 삭제
      if (typeof(op[c]) == "function") continue;
      switch( op[c] ) {
        case true  : temp = "yes"; break;
        case false : temp = "no";  break;
        default    : if(!osl.chk.isEmpty(op[c])) temp = op[c];
      }
      param += ( c + "=" + temp + "," );
    }
    param = param.replace( /,$/, "" );

    var id = op.id.replace("#","") + "_" + (osl.window.z_idSeq++);
    var popup = window.open( "", id, param );

    var form = osl.window.getForm( osl.window.z_req );

    form.attr({
      "method" : "post",
      "target" : id,
      "action" : op.domain + url
    }).submit();
    
    return popup;

  },

  /**
  * F: 현재 화면에 페이지를 연다. (페이지를 이동한다.)
  *
  * @param {String} url - 페이지 주소
  * @param {Object} option - 옵션
  * <pre>
  *   method  : {Number} 1.back history 안남기고 이동, 2.단순이동, 3.리로딩, 4.멀티파트폼전송
  *   target  : {String} 페이지가 전송될 타겟윈도우ID
  *   domain  : {String} URL의 메인도메인 (외부링크를 열고 싶을 경우 해당 항목을 "" 처리한다.)
  *   encrypt : {Boolean} 전송값 암호화여부 (기본값:true)
  * </pre>
  */
  openPage : function( url, option ) {
	  
	if( osl.chk.isEmpty(url) ) return;

    var op = $.extend({
      method  : 1,
      target  : "_self",
      domain  : osl.c.ROOT_PATH,
      submitMethod : "post"
    }, option || {} );

    switch( op.method ) {
      case 1 :  // not permit to record back history
        var form = osl.window.getForm( osl.window.z_req );
        form.attr({
          "method" : "post",
          "target" : op.target,
          "action" : op.domain + url
        }).submit();
        break;

      case 2 :  // forward
    	var form = osl.window.getForm( osl.window.z_req );
    	form.attr({
          "method" : op.submitMethod,
          "target" : op.target,
          "action" : op.domain + url
        }).submit();
        break;

      case 3 :  // reload
        document.location.reload();
        break;
        
      case 4 :  // multipart
      	var form = $( osl.window.formName );
      	form = osl.window.mergeForm( form, osl.window.z_req);
      	form.attr({
            "method" : "post",
            "target" : "_self",
            "enctype" : "multipart/form-data",
            "action" : op.domain + url
          }).submit();
          break;
    }

  },

  /**
  * F: 화면에 넘겨주기 위한 파라미터를 추가한다.
  * 
  * @param {String} key - 키
  * @param {String} value - 값
  */
  addParam : function( key, value ) {
    osl.window.z_req.add( key, value );
  },

  /**
  * F: 화면에 넘겨주기 위한 FORM 파라미터를 추가한다.
  * 
  * @param {String} expression - 셀럭터
  */
  addForm : function( expression ) {
   osl.window.z_req.addForm( expression );
  },

  /**
   * F: 세팅한 파라미터를 초기화한다.
   */
  clearParam : function() {
    osl.window.z_req.clear();
  },

  /**
  * F: 데이터 전송을 위한 form 객체를 가져온다.
  * 
  * @param {osl.mdata} mdata - form에 담을 데이터
  */
  getForm : function( mdata ) {

    // 폼을 가져온다. (없으면 하나 만든다.)
    var form = $(osl.c.ID.WIN_FORM);
    if( form.length == 0 ) {
      form = $("<form>").attr({
        id : osl.c.ID.WIN_FORM.replace("#",""),
        "accept-charset" : osl.window.getCharset()
      }).appendTo("body");
    }

    // 폼 데이터를 초기화시킨다.
    form.children().remove();

    // TOKEN 데이터 추가
    $("<input>").attr({
      type  : "hidden",
      name  : osl.c.WINDOW.PARAM_TOKEN,
      value : osl.c.TOKEN
    }).appendTo(form);

    // 데이터가 없다면 메서드를 종료한다.
    if( osl.chk.isNull(mdata) ) return form;

    // 전송할 데이터셋을 만든다.
    var hd  = mdata.getHeader();

    for( var i = 0, icnt = hd.length; i < icnt; i++ ) {
      for( var j = 0, jcnt = mdata.getData()[hd[i]].length; j < jcnt; j ++ ) {
        $("<input>").attr({
          type  : "hidden",
          name  : hd[i],
          value : mdata.get(hd[i],j)
        }).appendTo(form);
      }
    }

    return form;

  },
  
  /**
   * F: 데이터 전송을 위한 form을 Merge 한다.
   *    Multipart전송에서 필요한 기능으로,
   *    기준이 되는 Form에 추가Form Parameter를 합친다. 
   * 
   * @param {form} orgForm - 기준이 되는 Form
   * @param {osl.mdata} mdata - 기준이 되는 Form
   */
  mergeForm : function( orgForm, mdata ) {

	// 데이터가 없다면 메서드를 종료한다.
	if( osl.chk.isNull(mdata) ) return orgForm;

	// 전송할 데이터셋을 만든다.
	var hd  = mdata.getHeader();

	for( var i = 0, icnt = hd.length; i < icnt; i++ ) {
	  for( var j = 0, jcnt = mdata.getData()[hd[i]].length; j < jcnt; j ++ ) {
	    $("<input>").attr({
	      type  : "hidden",
	      name  : hd[i],
	      value : mdata.get(hd[i],j)
	    }).appendTo(orgForm);
	  }
	}

	return orgForm;

  },  

  /**
   * F: 툴팁을 붙인다.
   * <pre>
   *   osl.window.showTip( "툴팁에 보여줄 텍스트", {id:"idInput", top:10, left:20} );
   * </pre>
   * 
   * @param {String} text - 툴팁에 보여줄 텍스트
   * @param {Object} option - 옵션
   * <pre>
   *   id   : {String} 툴팁을 붙일 개체 id
   *   top  : {Number} 툴팁이 위치할 top  좌표
   *   left : {Number} 툴팁이 위치할 left 좌표
   * </pre>
   */
  showTip : function( text, option ) {

    var op = $.extend({
      id    : "",
      top   :  0,
      left  :  0,
      width :  0,
      height : 0
    }, option || {} );

    // top, left 를 설정한다.
    if( $("#"+op.id).length == 1 ) {
      var p = $("#"+op.id).offset();
      op.top    = p.top;
      op.width  = $("#"+op.id).width();
      op.left   = p.left + op.width + 7;
      op.height = $("#"+op.id).height();
    }

    // TIP 객체를 생성한다.
    var tip = $("#"+osl.c.ID.WIN_TIP );
    if( tip.length == 0 ) {
      tip = $("<div>").addClass(osl.c.CLASS.TIP).attr("id", osl.c.ID.WIN_TIP).appendTo("body");
    }

    // 출력내용을 설정한다.
    if( osl.chk.isTypArr(text) ) {
      var _msg = "";
      $.each( text, function() {
        _msg += this + "<br />";
      });
      text = _msg;
    }

    // TIP을 설정한다.
    tip.html( text ).css({
      "top"   : op.top,
      "left"  : op.left
    }).show();

  },

  /**
   * F: 툴팁을 지운다.
   */
  hideTip : function() {
    $("#" + osl.c.ID.WIN_TIP ).hide();
  },

  /**
   * F: 화면에 부여할 ID를 구한다.<br>
   * ID는 한 화면에서 순차적으로 부여된다
   * .
   * @param {Object} obj
   */
  getId : function( obj ) {
    if( !osl.chk.isTypObj(obj) ) return "";
    if( $(obj).prop("id") == "" ) {
      osl.window.z_idSeq ++;
      $(obj).prop( "id", osl.c.WINDOW.ID_SEQ + osl.window.z_idSeq );
    }
    
    // Modiby by YounByongSuk(2012.12.24)
    var rtnVal = "";
    if(obj != null && $(obj).prop("id") != undefined) {
    	rtnVal = $(obj).prop("id").replace(/(:|\.)/g,'\\$1');
    }
    return rtnVal;
  },

  /**
   * F: URL에서 파라미터를 추출한다.
   * 
   * @param {String} param - 파라미터명
   * @return {String} 파라미터값
   */
  getUrlParam : function( param ) {

    var strReturn = "";
    var strHref = window.location.href;
    var bFound = false;

    var cmpstring = param + "=";
    var cmplen = cmpstring.length;

    if ( strHref.indexOf("?") > -1 ){

      var strQueryString = strHref.substr(strHref.indexOf("?")+1);
      var aQueryString = strQueryString.split("&");

      for ( var iParam = 0; iParam < aQueryString.length; iParam++ ){

        if (aQueryString[iParam].substr(0,cmplen)==cmpstring){
          var aParam = aQueryString[iParam].split("=");
          strReturn = aParam[1];
          bFound=true;
          break;
        }

      }

    }

    if( bFound == false ) return null;
    return strReturn;

  },

  /**
   * F: 현재 창이 팝업으로 열렸는지 확인한다.
   * 
   * @return {Boolean}
   */
  isPopup : function() {
    return ( opener != null && opener.document != null );
  },

  /**
   * F: 현재 창의 문자셋을 가져온다.
   * 
   * @return {String} 문자셋(대문자)
   */
  getCharset : function() {
    return ( document.charset || document.characterSet || document.defaultCharset || osl.c.CHAR_SET ).toUpperCase();
  },
  
  /**
   * F: 현재 포커스된 개체의 ID 를 구한다.
   * 
   * @return {String} focus 개체의 ID (focus가 BODY에 있을 경우 "" 을 리턴)
   */
  getFocusId : function() {

    if( $(document.activeElement).prop("tagName") == "BODY" ) return "";

    return osl.window.getId( document.activeElement );

  },
  
  /**
   * F: 웹접근성 팝업 오픈
   * 
   * @param {String} a_str_windowURL - 팝업에 표시할 URL
   * @param {String} a_str_windowName - 팝업창 Name
   * @param {String} a_int_windowWidth - 팝업창 너비
   * @param {String} a_int_windowHeight - 팝업창 높이
   * @param {String} a_bool_scrollbars - 스크롤바 표시여부
   * @param {String} a_bool_resizable - 창 크기 가능여부
   * @param {String} a_bool_menubar - 메뉴바 표시 여부
   * @param {String} a_bool_toolbar - 툴바 표시 여부
   * @param {String} a_bool_addressbar - 주소바 표시여부
   * @param {String} a_bool_statusbar - 상태바 표시여부
   * @param {String} a_bool_fullscreen - Fullscreen 여부
   * @return {void}
   */
  newWindow : function (a_str_windowURL, a_str_windowName, a_int_windowWidth, a_int_windowHeight, a_bool_scrollbars, a_bool_resizable, a_bool_menubar, a_bool_toolbar, a_bool_addressbar, a_bool_statusbar, a_bool_fullscreen) {
		var int_windowLeft = (screen.width - a_int_windowWidth) / 2;
		var int_windowTop = (screen.height - a_int_windowHeight) / 2;
		var str_windowProperties = 'height=' + a_int_windowHeight + ',width=' + a_int_windowWidth + ',top=' + int_windowTop + ',left=' + int_windowLeft + ',scrollbars=' + a_bool_scrollbars + ',resizable=' + a_bool_resizable + ',menubar=' + a_bool_menubar + ',toolbar=' + a_bool_toolbar + ',location=' + a_bool_addressbar + ',statusbar=' + a_bool_statusbar + ',fullscreen=' + a_bool_fullscreen + '';
		var obj_window = window.open(a_str_windowURL, a_str_windowName, str_windowProperties)
		if (parseInt(navigator.appVersion) >= 4) {
			obj_window.window.focus();
		}
		return obj_window;
  }
};
// osl.window.js end ///////////////////////////////////////////////////

$().ready( function(){
	  // 로딩바 생성
	  osl.loadingBar.create();
});