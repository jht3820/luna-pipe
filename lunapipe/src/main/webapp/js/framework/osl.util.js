// osl.util.js begin ///////////////////////////////////////////////////
/**
* F: 유틸리티 함수<br>
* 
* @classDescription 유틸리티 함수 모음
*/
osl.util = {
	/**
	 * F: 만나이를 가져옵니다.
	 * 
	 * @param {String} string - 주민번호13자리
	 * @return {int} 나이
	 */
	getManAge : function(resino) {
		var age = null;

		if(osl.chk.isReg(resino, osl.c.REG_PTN.IS_JUMIN)){
			
			var date      = new Date();			//날짜 객체
		    var year      = date.getFullYear(); //올해
		    var month     = date.getMonth()+1;	//이번달
		    var day       = date.getDate();		//현재일자

		    var jumin1    = resino.substring(0,6); //주민번호 앞자리
		    var jumin2    = resino.substring(6,13); //주민번호 뒷자리
		    
		    var juminType = jumin2.substr(0,1);  //2000년 이후 출생 구분을 위해
		    var bYear     = ''; //출생 년

		    if(juminType == '1' || juminType == '2' || juminType == '5' || juminType == '6'){
		        bYear = '19' + jumin1;
		    }else {
			    if(juminType == '3' || juminType == '4' || juminType == '7' || juminType == '8'){
			        bYear = '20' + jumin1;
			        if(juminType == '7' || juminType == '8') {
			        	if(bYear.substring(0,4) > year) {
			        		bYear = '19' + jumin1;
			        	}else {
			        		bYear = '20' + jumin1;
			        	}
			        }
			    }else{
			    	alert('주민등록번호를 확인해 주십시오.');
			    	return false;
			    }
		    }
		    
		    var fullDate  = year;
		        fullDate += (month < 10) ? "0" + month : ""+ month;
		        fullDate += (day   < 10) ? "0" + day   : ""+ day;

		    age = Number(fullDate) - Number(bYear);
		    age =  parseInt(age/10000);
			
		}
		
		return age;
	},
	
	/**
	 * F: 체크박스 전체 선택 해제 합니다.
	 * 
	 * @param {String} allchk - 기준이 되는 element Id
	 * @param {String} chk - 전체 선택할 체크박스 name
	 * @return {void}
	 */	
	chkboxFixChk : function (allchk, chk){
	    var all = document.getElementById(allchk);
	    var chk = document.getElementsByName(chk);

	    if( all.checked == true){
	        for( var i=0; i<chk.length; i++ ){
	            chk[i].checked = true;
	        }
	    }else{
	        for( var j=0; j<chk.length; j++ ){
	            chk[j].checked = false;
	        }
	    }
	},
	
	/**
	 * F: 체크박스 전체 선택 해제 합니다.
	 * 
	 * @param {String} objectName - 이동할 대상 Id
	 * @return {void}
	 */	
	focus : function (objectName){
	    document.getElementById(objectName).focus();
	},
	
	
	/**
	 * F: 라디오 버튼을 전체 선택 해제 합니다.
	 * 
	 * @param {boolean} flag - 해제 선택
	 * @param {String} chk - 해제 선택할 대상 이름 
	 * @return {void}
	 */	
	chkboxChk : function (flag, chk){
	    var chk = document.getElementsByName(chk);

	    for( var j=0; j<chk.length; j++ ){
            chk[j].checked = flag;
        }
	},
	
	
	/**
	 * F: 라디오 버튼을 전체 선택 해제 합니다.
	 * 
	 * @param {String} name - 라디오버튼 이름
	 * @return  {String} 라디오 Value
	 */	
	getRadioValue : function (name){
	    var radioElements = document.getElementsByName(name);
	    var radioValue = "";
	    
	    for( var i=0; i<radioElements.length; i++ ){
            if(radioElements[i].checked) radioValue = radioElements[i].value;
        }
	    
	    return radioValue;
	},
	

	/**
	 * F: 셀렉트박스 선택된 값을 가져옵니다.
	 * 
	 * @param {String} name - 라디오버튼 이름
	 * @return  {String} 라디오 Value
	 */	
	getSelectBoxValue : function (name){
	    var selectElements = document.getElementsByName(name);
	    var radioValue = "";
	                    
	    for( var i=0; i<selectElements.length; i++ ){
            if(selectElements[i].selected)radioValue = selectElements[i].value;
        }
	    
	    return radioValue;
	},
	
	
	/**
	 * F: 라디오박스 선택된 값을 가져옵니다.
	 * 
	 * @param {String} name - 라디오버튼 이름
	 * @return  {String} 라디오 Value
	 */	
	getRadaioBoxValue : function (name){
	    var radioElements = document.getElementsByName(name);
	    var radioValue = "";
	    
	    for( var i=0; i<radioElements.length; i++ ){
            if(radioElements[i].checked) radioValue = radioElements[i].value;
        }
	    
	    return radioValue;
	},
	
	
	/**
	 * F: 화면 가로, 세로 사이즈
	 * 
	 * @return {[int, int]}
	 */	
	page_size : function(){
		var de = document.documentElement;
		var w = window.innerWidth || self.innerWidth || (de&&de.clientWidth) || document.body.clientWidth;
		var h = window.innerHeight || self.innerHeight || (de&&de.clientHeight) || document.body.clientHeight
		return [w,h];
	},
	
	
	/**
	 * F: 자식윈도우 닫기
	 * 
	 * @param  {Object} childWin - 자식윈도우 Object
	 * @return {void}
	 */	
	
	closeWindow : function (childWin) {
	   for(i=0; i<childWin.length; i++) {
	      if("undefined" != typeof(childWin[i])) {
	         childWin[i].close();
	      }
	   }
	},
	
	/**
	 * F: 개인정보 포함 여부를 확인받는 공통 confirm 창
	 * 
	 * @param {Object} yesFunc
	 * @param {Object} noFunc
	 * @return {void}
	 */
	confirmPrivacyYN : function(yesFunc, noFunc) {
		var dialogHtml = "<div id='privacyDialog' title='개인정보 포함여부 확인'>";
		dialogHtml = dialogHtml + "<br/><br/><p><strong>개인정보를 표시하여 출력하시겠습니까?</strong>";
		dialogHtml = dialogHtml + "<br/><br/><br/>※ 개인정보를 표시하여 파일을 받을 경우 <br/>로그인한 상담원 주민번호 뒤 7자리로 암호가 자동설정됩니다.</p>";
		dialogHtml = dialogHtml + "</div>";
		
		$(dialogHtml).appendTo("body").hide();
		
		// Dialog
		$('#privacyDialog').dialog({
			autoOpen: false,
			width: 400,
			height: 200,
			modal: true,
			buttons: {
				"예": function() {
					$(this).dialog("close");
					$(this).data("yesFunc").call();
				},
				"아니오": function() {
					$(this).dialog("close");
					$(this).data("noFunc").call();
					
				},
				"취소": function() {
					$(this).dialog("close");					
				}				
			}
		});
		
		$('#privacyDialog').data("yesFunc", yesFunc).data("noFunc", noFunc).dialog('open');
		
	}
};

jQuery.fn.NumericOnly = function() {
    return this.each(function()
    {
    	$(this).css("ime-mode", "disabled");
        $(this).keypress(function(event)
        {
        	var chars = '0123456789';
        	var chr = String.fromCharCode(event.charCode == undefined ? event.keyCode : event.charCode);
        	return event.ctrlKey || event.metaKey || (chr < ' ' || !chars || chars.indexOf(chr) > -1);
        });
    });
};
	
jQuery.fn.AlphaNumericOnly = function() {
	this.each(function() {
		$(this).css("ime-mode", "disabled");
	});
};	

jQuery.fn.setImeMode = function( imeMode ) {
	this.each(function() {
		$(this).css("ime-mode", imeMode);
	});
};
// osl.util.js end /////////////////////////////////////////////////////

// osl.combo.js begin //////////////////////////////////////////////////
/**
 * C: 콤보박스 클래스
 * <pre>
 *   var combo1 = osl.combo("#cmbTemp1");
 *   var combo2 = osl.combo("#cmbTemp2", "A");
 * </pre>
 * 
 * @param {String} id - 개체 id
 * @param {String} defaultValue - ( A:전체('%'), S:선택(''), null:기본값이 없다. )
 * @return {osl.combo}
 * @classDescription 콤보박스 클래스 생성 클래스 
 * 
 * */
osl.combo = function( id, defaultValue ) {

	var z_self = arguments.callee;
	if(!(this instanceof z_self)) return new z_self( id, defaultValue );

	this.z_id    = id;
	this.z_dfVal = defaultValue;

	// initializing
	if( $.isReady ) {
		this.init();
	} else {
		$(document).ready( $.proxy(this, "init") );
	}
};


osl.combo.prototype = {

  /**
   * F: 콤보박스를 초기화한다.
   * 
   * @return {osl.combo}
   */
	init : function() {

		if( $(this.z_id).length != 1 ) return this;

		var tagName = $(this.z_id).prop("tagName");

		if( osl.chk.isNull(tagName) || tagName != "SELECT" ) {
			osl.etc.changeTagName( this.z_id, "select" );
		}

		this.setDefault( this.z_dfVal );

		return this;
	},

  /**
   * F: 콤보의 초기값 설정을 변경한다.
   * 
   * @param {String} flag - ( A:전체('%'), S:선택(''), null:기본값이 없다. )
   * @return {osl.combo}
   */
	setDefault : function( flag ) {

		if( flag != "A" && flag != "S" && ! osl.chk.isEmpty(flag) ) return;

		this.z_dfVal = flag;

		var value = $(this.z_id+">option:eq(0)").val();
		var label = $(this.z_id+">option:eq(0)").text();

		var dfVal1 = ( value == "%" && label == osl.c.COMBO.LABEL_ALL );
		var dfVal2 = ( value == ""  && label == osl.c.COMBO.LABEL_SELECT );

		switch( flag ) {
			// 설정값 변경이 없다면
			case value : break;
			// 설정값을 지우려면
			case undefined : case null : case "" :
				
				if( !dfVal1 && !dfVal2 ) break;
				$(this.z_id+">option:eq(0)").remove();
			break;
			// 설정값을 변경하려면
			default    :
				if( !dfVal1 && !dfVal2 ) {
					$(this.z_id).prepend( "<option>");
				}
				$(this.z_id+">option:eq(0)").val( flag );
				$(this.z_id+">option:eq(0)").text( flag=="A" ? osl.c.COMBO.LABEL_ALL : osl.c.COMBO.LABEL_SELECT );
				this.val( flag );
		}

		return this;
	},

  /**
   * F: 콤보 데이터를 초기화한다.
   * 
   * @return {osl.combo}
   */
	clear : function() {
		if( $(this.z_id).length == 1 ) {
			$(this.z_id).empty();
			this.setDefault( this.z_dfVal );
		}

		return this;
	},

  /**
   * F: 콤보객체의 값을 가져오거나 세팅한다.
   * 
   * @param {String} value - 세팅할 값
   * @return {String} 객체의 값
   */
	val : function( value ) {
		if( value == undefined ) return $(this.z_id).val();
		$(this.z_id).val( value );
		return value;
	},

  /**
   * F: 콤보에 데이터를 bind 한다.
   * 
   * @param {JSON} data - JSON 데이터
   * <pre>
   *   입력되는 데이터는 label, value 속성을 가지고 있어야 한다.
   *   데이터 형식은 다음과 같다.
   *   var tempData = [
   *    {value:'1', label:'a-1' },
   *    {value:'2', label:'a-2' }
   *   ]
   * </pre>
   * @param {Boolean} appendYn - 데이터 추가여부 (기본값:false)
   * @return {osl.combo}
   */
	bind : function( data, appendYn ) {

		if( appendYn != true ) this.clear();

		try {
			for (var inx = 0, inxCnt = data.length; inx < inxCnt; inx++) {
				this.addOption( data[inx].value, osl.str.unclearXss(data[inx].label) );
			}
		} catch (e) {}

		return this;
	},

  /**
   * F: 콤보객체에 option 데이터를 추가한다.
   * 
   * @param {String} value - 값
   * @param {String} label - 라벨
   * @return {osl.combo}
   */
	addOption : function( value, label ) {
		var option = new Option( label, value );
		try {
			if( $.browser.msie ) {
				$(this.z_id)[0].add( option );
			} else {
				$(this.z_id)[0].add( option, null );
			}
		} catch( e ) {
			osl.msg.debug( e );
		}

		return this;
	},

  /**
   * F: 콤보객체의 option 데이터를 삭제한다. <br>
   * 일반적으로는 value값만 지정해서 삭제하면 된다.<br>
   * 만약 value 값이 동일한 다건의 option 중 특정 label을 갖는 요소만 삭제하고 싶은 경우에는
   * value와 label을 동시에 지정해준다.
   * 
   * @param {String} value - 값
   * @param {String} label - 라벨 (Optional)
   * @return {osl.combo}
   */
	delOption : function( value, label ) {

		var option = $(this.z_id).find("option[value=" + value + "]");

		if( !osl.chk.isNull(label) ) {
			option.each( function() {
				if( $(this).html() == label ) $(this).remove();
			});
		} else {
			option.remove();
		}
		return this;
	},
	
  /**
   * F: 콤보에 데이터를 bind 한다. (CommonCodeVO 형식)
   * 
   * @param {JSON} data - JSON 데이터
   * <pre>
   *   입력되는 데이터는 label, value 속성을 가지고 있어야 한다.
   *   데이터 형식은 다음과 같다.
   *   var tempData = [
   *    {value:'1', label:'a-1' },
   *    {value:'2', label:'a-2' }
   *   ]
   * </pre>
   * @param {Boolean} appendYn - 데이터 추가여부 (기본값:false)
   * @return {osl.combo}
   */
	bindCodeData : function( data, appendYn ) {

		if( appendYn != true ) this.clear();

		try {
			for (var inx = 0, inxCnt = data.length; inx < inxCnt; inx++) {
				this.addOption( data[inx].cdKey, data[inx].cdKorNm );
			}
		} catch (e) {}

		return this;
	}

};
// osl.combo.js end ////////////////////////////////////////////////////

// osl.cookie.js begin /////////////////////////////////////////////////
/**
 * O: 쿠키 관련 유틸클래스.
 * <pre>
 * 보안상 중요한 정보는 절대로 쿠기에 저장해서는 안된다.
 * </pre>
 * 
 * @classDescription 쿠키 관련 유틸 클래스로서 쿠키를 컨트롤 한다.
 */
osl.cookie = {};

/**
 * F: 쿠키지원여부를 확인한다.
 * 
 * @return {Boolean} 확인결과
 * 
 * */
osl.cookie.isSupported = function() {

  var result;

  if( $.browser.msie ) {

    var chkKey = "_duChkCookieEnabled";
    var chkVal = Math.round( Math.random() * 10000 ) + "";

    osl.cookie.set( chkKey, chkVal, {} );
    result = ( osl.cookie.get(chkKey) == chkVal ) ? true : false;
    osl.cookie.del( chkKey );

  } else {

    result = navigator.cookieEnabled;

  }

  return result;

};

/**
 * F: 쿠키를 설정한다.
 * 
 * <pre>
 *   osl.cookie.set( "key", "1" ); -> 현재 디렉토리부터 사용할 쿠키 세팅
 *   osl.cookie.set( "key", "1", { path:"/pls/pls000/"} ); -> 특정 디렉토리부터 사용할 쿠키를 세팅
 *   osl.cookie.set( "key", "1", { path:"/", expires:100} ); -> 전체범위 쿠키 세팅, 만기일은 생성시부터 100일 후
 * </pre>
 * 
 * @param {Object} key - 키
 * @param {Object} value - 값
 * @param {Object} option - 옵션
 * <pre>
 *   expires : {Number}  만료기간(일자, 기본값:365)
 *   path    : {String}  쿠키가 유효하게 사용될 수 있는 URL 디렉토리 (위치는 하위상속됨, 기본값 : 현재위치)
 *   secure  : {Boolean} HTTPS 사용여부 (기본값 : false)
 * </pre>
 */
osl.cookie.set = function( key, value, option ) {

  var _path = location.pathname;
  _path = _path.substr( 0, _path.lastIndexOf("/") + 1 );

  var op = $.extend({
    expires : 365,
    path    : _path,
//    domain  : "", IE 에서 domain 설정이 들어가면 쿠키값이 저장이 안된다.
    secure  : false
  }, option || {} );

  var expires = new Date();
  expires.setDate( expires.getDate() + op.expires );

  document.cookie = key + "=" + encodeURIComponent( value )
   + "; expires=" + expires.toUTCString()
   + "; path="    + op.path
   + ( op.secure != false ? "; secure" : "" );

};

/**
 * F: 쿠키를 삭제한다.
 * <pre>
 *   osl.cookie.del( "key" ); -> 현재 디렉토리부터 세팅된 쿠키 삭제
 *   osl.cookie.del( "key", "/pls/pls000/" ); -> 해당 디렉토리부터 세팅된 쿠키를 삭제
 *   osl.cookie.del( "key", "/" ); -> 전체범위 쿠키 삭제
 * </pre>
 * 
 * @param {Object} key - 키
 * @param {Object} path - 쿠키가 유효하게 사용될 수 있는 URL 디렉토리 (위치는 하위상속됨, 기본값 : 현재위치)
 */
osl.cookie.del = function( key, path ) {

  var _path = location.pathname;
  _path = _path.substr( 0, _path.lastIndexOf("/") + 1 );

  path = path || _path;

  var expires = new Date();

  expires.setDate( expires.getDate() - 1 );

  document.cookie = key + "=; expires=" + expires.toGMTString() + "; path=" + path;

};

/**
 * F: 쿠키값을 가져온다.
 * 키가 존재하지 않을 경우 false를 반환받는다.
 * 
 * @param {Object} key - 키
 * @return {String|Boolean} 값 또는 false
 */
osl.cookie.get = function( key ) {

  var result;

  if( result = new RegExp(key + "=(.*?)(?:;|$)").exec(document.cookie) ) {
    try {
      return decodeURIComponent( result[1] );
    } catch(e) {
    }
  }

  return false;

};
// osl.cookie.js end ///////////////////////////////////////////////////

// osl.date.js begin ///////////////////////////////////////////////////
/**
* F: 날짜처리함수<br>
* <pre>
*   osl.date().val() -> 서버기준 시간을 초기값으로 가지고 있는 신규 Date객체
*   osl.date(new Date(2011,3-1,5)).val() -> Date객체 (2011-03-05)
*   osl.date("03-05-2011","MM-DD-YYYY").val() -> Date객체 (2011-03-05)
* </pre>
* 
* @param {String/Date/osl.date} date - 날짜
* @param {String} format - 입력포맷 (기본값 : {@link osl.c.DATE.FORMAT} )
* @return {osl.date}
*/
osl.date = function( date, format ) {

  var z_self = arguments.callee;

  if(!(this instanceof z_self)) return new z_self( date, format );

  this.z_format = format || osl.c.DATE.FORMAT;

  if( osl.chk.isEmpty(date) ) {
    this.val( this.getNow(), this.z_format );
  } else {
    this.val( date, this.z_format );
  }

};

osl.date.prototype = {

  /**
  * F: Date 객체를 가져온다.<br>
  * 처리에 필요한 Date 객체를 세팅할 수도 있다.
  * 잘못된 정보로 Date 객체가 세팅될 경우 null이 저장된다.
  * <pre>
  *   osl.date().val() -> Date객체(신규)
  *   osl.date().val(new Date(2011,3-1,5)).val() -> Date객체 (2011-03-05)
  *   osl.date().val("03-05-2011","MM-DD-YYYY").val() -> Date객체 (2011-03-05)
  * </pre>
  * 
  * @param {String,Date} date - 날짜
  * @param {String} format - 입력포맷 (기본값:YYYY-MM-DD, YYYY,MM,DD,HH,MI,SS조합)
  * @return {Date,osl.date}
  */
  val : function( date, format ) {

    if( arguments.length == 0 ) return this.z_val;

    if( osl.chk.isTypDate(date) ) {
      this.z_val = date;
      return this;
    } else if( date instanceof osl.date ) {
        this.z_val = date.val();
        return this;
    }

    // get dateArray through format
    var z_dtArr = osl.str(date).getDateArray( format || this.z_format );

    $(z_dtArr).each(function(i){
      if( z_dtArr[i] == null ) return true;
      z_dtArr[i] = Number(z_dtArr[i]);
    });

    // calibrate date
    z_dtArr[1] = (z_dtArr[1]==null) ? null : z_dtArr[1] - 1; // 월데이터 보정
    z_dtArr[2] = (z_dtArr[2]==null) ? 1 : z_dtArr[2]; // 일데이터 보정

    // create Date object
    var z_date = new Date( z_dtArr[0], z_dtArr[1], z_dtArr[2], z_dtArr[3], z_dtArr[4], z_dtArr[5], 1 );

    // check validation
    var z_chk  = [];
    z_chk.push( "" + z_date.getFullYear() );
    z_chk.push( "" + z_date.getMonth() );
    z_chk.push( "" + z_date.getDate() );
    z_chk.push( "" + z_date.getHours() );
    z_chk.push( "" + z_date.getMinutes() );
    z_chk.push( "" + z_date.getSeconds() );

    var z_flag = true;

    $(z_chk).each(function(i){
      if( z_dtArr[i] != null && z_dtArr[i] != z_chk[i] ) {
        z_flag = false;
        return false;
      }
    });

    // save result
    this.z_val = (z_flag) ? z_date : null;

    return this;

  },

  /**
   * F: 포맷을 가져오거나 변경한다.
   *
   * <pre>
   *   var d = osl.date( "2011-01-01" );
   *
   *   d.format(); -> "YYYY-MM-DD"
   *   d.format( "YYYYMMDD" );
   *   d.format(); -> "YYYYMMDD"
   * </pre>
   *
   * @param {Object} format - 날짜포멧
   * @return {String} 포맷으로 변환된 결과 문자열
   */
  format : function ( format ) {

    if( arguments.length == 0 ) return this.z_format;
    this.z_format = osl.str( format ).val();

  },

  /**
   * F: 날짜를 포맷에 맞게 변환한다.
   * 
   * @param {String} format - 포맷 (기본값:시간데이터 세팅시 입력한 포맷(미입력시 YYYY-MM-DD), YYYY,MM,DD,HH,MI,SS조합)
   * @return {String} 포맷이 적용된 날짜
   */
  toString : function( format ) {

    if( this.z_val == null ) return "";

    var z_result = osl.str(format||this.z_format).toUpperCase().val();
    var z_date   = this.z_val;

    return osl.str(z_result).replace( "YYYY", z_date.getFullYear() )
      .replace( "MM", osl.str(z_date.getMonth()+1).lpad(2,"0").val() )
      .replace( "DD", osl.str(z_date.getDate()   ).lpad(2,"0").val() )
      .replace( "HH", osl.str(z_date.getHours()  ).lpad(2,"0").val() )
      .replace( "MI", osl.str(z_date.getMinutes()).lpad(2,"0").val() )
      .replace( "SS", osl.str(z_date.getSeconds()).lpad(2,"0").val() ).val();

    return result;

  },

  /**
   * F: 현재시간 추출 관련 환경 초기화
   * 
   * @param {String} date - YYYYMMDDHHMISS 형식의 문자열
   */
  initNow : function( date ) {

    if( osl.chk.isEmpty(date) ) {
      osl.c.DATE.SERVER_DATE = new Date();
    } else {
      osl.c.DATE.SERVER_DATE = this.val(date,"YYYYMMDDHHMISS").val();
    }

    osl.c.DATE.LOCAL_DATE = new Date();

  },

  /**
   * F: 현재 시간을 구한다.<br>
   * new Date() 함수는 로컬 PC 의 시간을 구하기 때문에 현재 시간을 구하는 용도로 사용해서는 안된다.
   * 
   * @return {Date}
   */
  getNow : function() {

    if( osl.c.DATE.SERVER_DATE == null ) this.initNow();

    var gap = new Date() - osl.c.DATE.LOCAL_DATE;
    var now = osl.c.DATE.SERVER_DATE.valueOf() + gap;

    return new Date( now );

  },

  /**
   * F: 년도(4자리)를 구한다.
   *
   * @return {Number} 년도
   */
  getYear  : function()  {
    return this.z_val.getFullYear();
  },

  /**
   * F: 월을 구한다.
   *
   * @return {Number} 월 (1-12)
   */
  getMonth : function()  {
    return this.z_val.getMonth() + 1;
  },

  /**
   * F: 일을 구한다.
   *
   * @return {Number} 일
   */
  getDate : function()  {
    return this.z_val.getDate();
  },

  /**
   * F: 시간을 구한다.
   *
   * @return {Number} 시간
   */
  getHour : function() {
    return this.z_val.getHours();
  },

  /**
   * F: 분을 구한다.
   *
   * @return {Number} 분
   */
  getMin : function() {
    return this.z_val.getMinutes();
  },

  /**
   * F: 초를 구한다.
   *
   * @return {Number} 초
   */
  getSec : function() {
    return this.z_val.getSeconds();
  },

  /**
   * F: 요일을 구한다.
   *
   * @return {Number} 요일에 해당하는 숫자 (0:일요일 - 6:토요일)
   */
  getDay   : function()  {
    return this.z_val.getDay();
  },


  /**
   * F: 두 날짜간 차이를 구한다.
   * <pre>
   *   var a = osl.date("2011-01-01");
   *   var b = osl.date("2011-01-03");
   *   osl.msg.debug( "날짜차이 : " + b.getBetweenDate( a ) ); -> -2일 차이
   * </pre>
   *
   * @param {String/Date/osl.date} date - 날짜
   * @param {String} format - 포멧
   * @return {Number} 일자
   */
  getBetweenDate : function(date, format) {

    var cDate;

    if( osl.chk.isTypDate(date) ) {
      cDate = date;
    } else if( osl.chk.isTypStr(date) ) {
      cDate = osl.date( date, format );
    } else if( date instanceof osl.date ) {
      cDate = date.val();
    }

    return ( cDate - this.val() ) / 1000 / 60 / 60 / 24;

  },


  /**
   * F: 월말로 세팅한다.
   *
   * <pre>
   *   osl.Date("2011-04-17").setLastDate().toString(); -> "2011-04-30" 반환
   * </pre>
   *
   * @return {osl.date}
   */
  setLastDate : function() {
    if( this.z_val != null ) this.z_val = new Date( this.getYear(), this.getMonth(), 0, this.getHour(), this.getMin(), this.getSec(), 1 );
    return this;
  },

  /**
   * F: 년을 더한다.
   *
   * <pre>
   *   osl.date().addYear( 1  ); -> 현재시간에서 1년을 더한다.
   *   osl.date().addYear( -1 ); -> 현재시간에서 1년을 뺀다.
   * </pre>
   *
   * @param {Number} num - 더할 년
   * @return {osl.date}
   */
  addYear : function( num )  {

    if( this.z_val != null ) this.z_val.setFullYear( this.z_val.getFullYear() + num );
    return this;

  },

  /**
   * F: 월을 더한다.
   * <pre>
   *   osl.date().addMonth( 1  ); -> 현재시간에서 1달을 더한다.
   *   osl.date().addMonth( -1 ); -> 현재시간에서 1달을 뺀다.
   * </pre>
   *
   * @param {Number} num - 더할 월
   * @return {osl.date}
   */
  addMonth : function( num )  {

    if( this.z_val != null ) this.z_val.setMonth( this.z_val.getMonth() + num );
    return this;

  },

  /**
   * F: 일을 더한다.
   * <pre>
   *   osl.date().addDate( 1  ); -> 현재시간에서 1일을 더한다.
   *   osl.date().addDate( -1 ); -> 현재시간에서 1일을 뺀다.
   * </pre>
   *
   * @param {Number} num - 더할 일
   * @return {osl.date}
   */
  addDate : function( num )  {

    if( this.z_val != null ) this.z_val.setDate( this.z_val.getDate() + num );
    return this;

  },

  /**
   * F: 시간을 더한다.
   * <pre>
   *   osl.date().addHour( 1  ); -> 현재시간에서 1시간을 더한다.
   *   osl.date().addHour( -1 ); -> 현재시간에서 1시간을 뺀다.
   * </pre>
   *
   * @param {Number} num - 더할 시간
   * @return {osl.date}
   */
  addHour : function( num )  {

    if( this.z_val != null ) this.z_val.setHours( this.z_val.getHours() + num );
    return this;
  }

};
// osl.date.js end /////////////////////////////////////////////////////

// osl.str.js begin ////////////////////////////////////////////////////
/**
* F: 문자열 처리함수<br>
* <pre>
*   alert( osl.str("M123erong").getNum().val() ); -> "123"  출력
* </pre>
* 
* @classDescription 문자열 관련 유틸리티
* @return {osl.str}
*/
osl.str = function( string ) {

  var z_self = arguments.callee;

  if(!(this instanceof z_self)) return new z_self(string);

  this.val( string );

};

osl.str.prototype = {

  /**
  * F: 처리된 문자열을 가져온다.<br>
  * 처리에 필요한 문자열을 세팅할 수도 있다.
  * <pre>
  *   alert( osl.str("Merong").val() ); -> "Merong"  출력
  *   alert( osl.str("Merong).val(A).val() ); -> "A" 출력
  * </pre>
  * 
  * @param {Object|String} value - 세팅할 문자열 (또는 오브젝트)
  * @return {String,osl.str}
  */
  val : function( value ) {

    if( arguments.length == 0 ) return this.z_val;

    if( osl.chk.isNull(value) ) {
      this.z_val = "";
    } else if( osl.chk.isTypStr(value) ) {
      this.z_val = value;
    } else if( value instanceof osl.str ) {
      this.z_val = value.val();
    } else if( osl.chk.isTypObj(value) ) {
      this.z_val = "" + $(value).val();
    } else {
      this.z_val = "" + value;
    }

    return this;

  },

  /**
  * F: 문자열을 치환한다.
  * <pre>
  *   alert( osl.str( "my body is male" ).replace("male", "female").val() );
  *   --> "my body is female"
  * </pre>
  * 
  * @param {String,RegExp} pattern - 찾을 문자열 또는 정규식 패턴
  * @param {String} replaceStr - 치환할 문자열
  * @return {osl.str}
  */
  replace : function( pattern, replaceStr ) {

    if( pattern != null && (osl.chk.isTypStr(replaceStr) || osl.chk.isTypNum(replaceStr)) ) {
      this.z_val = this.z_val.replace( pattern, replaceStr );
    }

    return this;

  },

  /**
  * F: 문자열을 모두 치환한다.
  * <pre>
  *   alert( osl.str( "m A m" ).replace("m", "a").val() ); --> "a A m"
  *   alert( osl.str( "m A m" ).replaceAll("m", "a").val() ); --> "a A a"
  * </pre>
  * 
  * @param {String} pattern - 찾을 문자열
  * @param {String} replaceStr - 치환할 문자열
  * @return {osl.str}
  */
  replaceAll : function( pattern, replaceStr ) {
    var ptn = ( osl.chk.isTypStr(pattern) || osl.chk.isTypNum(replaceStr) ) ? eval( "/" + pattern + "/g" ) : pattern;
    return this.replace( ptn, replaceStr );
  },

  /**
  * F: 문자열을 없앤다.
  * 
  * @param {String,RegExp} pattern - 찾을 문자열 또는 정규식 패턴
  * @return {osl.str}
  */
  remove : function( pattern ) {
    return this.replace( pattern, "" );
  },

  /**
  * F: 문자열을 모두 없앤다.
  * @param {String,RegExp} pattern - 찾을 문자열 또는 정규식 패턴
  * @return {osl.str}
  */
  removeAll : function( pattern ) {
    return this.replaceAll( pattern, "" );
  },

  /**
  * F: 앞뒤 공백문자를 제거한다.
  * 
  * @return {osl.str}
  */
  trim : function() {
    return this.remove( osl.c.REG_PTN.TRIM );
  },

  /**
  * F: 앞 공백문자를 제거한다.
  * 
  * @return {osl.str}
  */
  ltrim : function() {
    return this.remove( osl.c.REG_PTN.LTRIM );
  },

  /**
  * F: 뒤 공백문자를 제거한다.
  * 
  * @return {osl.str}
  */
  rtrim : function() {
    return this.remove( osl.c.REG_PTN.RTRIM );
  },

  /**
  * F: 모든 공백문자를 제거한다.
  * 
  * @return {osl.str}
  */
  allTrim : function( string ) {
    return this.remove( osl.c.REG_PTN.INNER_SPACE );
  },

  /**
  * F: 중복 빈칸을 1개의 빈칸으로 만든다.
  * 
  * @return {osl.str}
  */
  innerTrim : function() {
    return this.replace( osl.c.REG_PTN.INNER_TRIM, " " );
  },

  /**
  * F: LPAD 처리를 수행한다.
  * <pre>
  *   alert( osl.str("A").lpad(3,'0').val() ); -> 00A
  * </pre>
  * 
  * @param {Number} length - 전체길이
  * @param {String} fillChar - 패딩문자
  * @return {osl.str}
  */
  lpad : function( length, fillChar ) {

    if( !osl.chk.isEmpty(this.z_val) ) {
      var srcStr = this.z_val.substr( 0, length );
      var cnt = 0;
      for( var i = srcStr.length; i < length; i++ ) {
        srcStr = fillChar.charAt(cnt) + srcStr;
        cnt++;
        cnt = ( cnt == fillChar.length ) ? 0 : cnt;
      }
      this.z_val = srcStr;
    }

    return this;

  },

  /**
  * F: RPAD 처리를 수행한다.
  * <pre>
  *   alert( osl.str("A").rpad(3,'0').val() ); -> A00
  * </pre>
  * 
  * @param {Number} length - 전체길이
  * @param {String} fillChar - 패딩문자
  * @return {osl.str}
  */
  rpad : function( length, fillChar ) {

      if( !osl.chk.isEmpty(this.z_val) ) {
        var srcStr = this.z_val.substr( 0, length );
        var cnt = 0;
        for( var i = srcStr.length; i < length; i++ ) {
          srcStr = srcStr + fillChar.charAt(cnt);
          cnt++;
          cnt = ( cnt == fillChar.length ) ? 0 : cnt;
        }
        this.z_val = srcStr;
      }

      return this;

  },

  /**
  * F: byte 수를 확인한다.
  * 
  * @return {Number} 문자열의바이트
  */
  bytes : function() {
    var z_add = ( osl.window.getCharset() == "UTF-8" ) ? 2 : 1;
    var z_len = 0;
    for( var i = 0, cnt = this.z_val.length; i < cnt; i++, z_len++ ) {
      if( this.z_val.charCodeAt(i) < 0 || this.z_val.charCodeAt(i) > 127 ) z_len += z_add;
    }
    return z_len;
  },

  /**
  * F: 숫자만 남긴다.
  * 
  * @return {osl.str}
  */
  setNum : function() {
    return this.remove( osl.c.REG_PTN.NOT_NUM );
  },

  /**
  * F: 부호와 소수점을 포함한 숫자만 남긴다.
  * 
  * @return {osl.str}
  */
  setParseNum : function() {
    return this.remove( osl.c.REG_PTN.NOT_NUM_PARSE );
  },

  /**
  * F: 숫자만 제외시킨다.
  * 
  * @return {osl.str}
  */
  setNotNum : function() {
    return this.remove( osl.c.REG_PTN.NUM );
  },

  /**
  * F: 정수 형태로 추출한다.
  * 
  * @return {Number} 정수
  */
  parseInt : function() {
    this.setParseNum();
    if( this.z_val == "" ) return 0;
    return parseInt( this.z_val );
  },

  /**
   * F: 실수 형태로 추출한다.
   * 
   * @return {Number} 실수
   */
  parseFloat : function() {
    this.setParseNum();
    if( this.z_val == "" ) return 0.0;
    return parseFloat( this.z_val );
  },

  /**
  * F: 영문자만 남긴다.
  * 
  * @return {osl.str}
  */
  setEng : function() {
    return this.remove( osl.c.REG_PTN.NOT_ENG );
  },

  /**
  * F: 영문자만 제외시킨다.
  * 
  * @return {osl.str}
  */
  setNotEng : function() {
    return this.remove( osl.c.REG_PTN.ENG );
  },

  /**
  * F: 숫자에 3자리마다 콤마를 찍는다.
  * 
  * @return {osl.str}
  */
  setMoney : function() {

    var _val = "" + this.parseFloat();
    var _pos = _val.lastIndexOf(".");

    if( _pos >= 0 ) {
      this.z_val = _val.substring( 0, _pos - 1).replace( osl.c.REG_PTN.MONEY, "$1," ) + _val.substring( _pos );
    } else {
      this.z_val = _val.replace( osl.c.REG_PTN.MONEY, "$1," );
    }

    return this;

  },

  /**
  * F: 값이 없다면 지정 문자로 치환한다.
  * 
  * @param {String} replaceStr - 값이 없을 경우 치환할 문자열
  * @return {osl.str}
  */
  nvl : function( replaceStr ) {
    if( this.z_val == "" ) this.val( replaceStr );
    return this;
  },

  /**
  * F: 문자열이 특정 패턴을 가지고 있는지 검사한다.
  * 
  * @param {String} pattern - 패턴
  * @return {Boolean}
  */
  hasValue : function( pattern ) {
    if( pattern == null ) return false;
    return ( this.z_val.indexOf( pattern ) >= 0 ) ? true : false;
  },

  /**
  * F: 문자열이 비어있는지 검사한다.
  * 
  * @return {Boolean}
  */
  isEmpty : function( pattern ) {
    return this.z_val == "";
  },

  /**
  * F: 문자열의 XSS 처리를 해제한다.
  * 
  * @return {osl.str}
  */
  unclearXss : function() {

     this.z_val = this.z_val
      .replace( /&lt;/g,  "<" )
      .replace( /&gt;/g,  ">" )
      .replace( /&#60;/g, "<" )
      .replace( /&#62;/g, ">" )
      .replace( /&#34;/g, '"' )
      .replace( /&#39;/g, "'" )
      .replace( /&#92;/g, "W" )
      .replace( /&#40;/g, "(" )
      .replace( /&#41;/g, ")" );;

     return this;

  },

  /**
  * F: 문자열에 XSS 처리를 수행한다.
  * 
  * @return {osl.str}
  */
  clearXss : function() {

     this.z_val = this.z_val
      .replace( /</g, "&#60;" )
      .replace( />/g, "&#62;" )
      .replace( /"/g, "&#34;" )
      .replace( /'/g, "&#39;" )
      .replace( /\\/g,"&#92;" )
      .replace( /\(/g,"&#40;" )
      .replace( /\)/g,"&#41;" );

     return this;

  },

  /**
  * F: 마지막 한글문자의 초성/중성/종성을 나누어 가져온다.
  * <pre>
  *   var c = osl.str( "홍길동" ).getLastKrChr(); -> ['ㄷ','ㅗ','ㅇ']
  *   var c = osl.str( "손상욱" ).getLastKrChr(); -> ['ㅇ','ㅜ','ㄱ']
  *   var c = osl.str( "Name" ).getLastKrChr(); -> [null,null,null]
  * </pre>
  * 
  * @return {Array} 초성/중성/종성이 나누어진 배열 (한글이 아닐 경우 null이 반환됨)
  */
  getLastKr : function() {

    var result = [null,null,null];
    var word   = this.z_val;
    var schar  = word.charCodeAt( word.length - 1 );

    if( schar < 0xAC00 || schar > 0xD79F ) return result;

    schar = schar - 0xAC00;

    var jong = schar % 28;
    var jung = ( (schar - jong) / 28 ) % 21;
    var cho  = parseInt( ((schar-jong) / 28) / 21 );

    result[0] = osl.c.REG_PTN.HAN_1ST[cho];
    result[1] = osl.c.REG_PTN.HAN_2ND[jung];
    result[2] = osl.c.REG_PTN.HAN_3RD[jong];

    return result;

  },

  /**
   * F: 문자열 길이를 구한다.
   * 
   * @return {Number}
   */
  length : function() {
    return this.z_val.length;
  },

  /**
   * F: 시작위치부터 지정 길이만큼 문자열을 자른다.
   * 
   * @param {Number} start - 시작위치
   * @param {Number} length - 길이
   * @return {osl.str}
   */
  substr : function( start,length ) {
    this.z_val = this.z_val.substr( start, length );
    return this;
  },

  /**
   * F: 지정한 위치대로 문자열을 자른다.
   * 
   * @param {Number} startIndex - 시작위치
   * @param {Number} endIndex - 종료위치
   * @return {osl.str}
   */
  substring : function( startIndex, endIndex ) {
    this.z_val = this.z_val.substring( startIndex, endIndex );
    return this;
  },

  /**
   * 문자열이 시작하는 위치를 반환한다.
   * <pre>
   *   osl.str( "Play Station" ).indexOf( "y" ); ->  3 을 반환
   * </pre>
   * 
   * @param {String} searchValue - 검색할 문자열
   * @param {Number} fromIndex - 검색시작위치
   * @return {Number} 문자열 검색위치
   */
  indexOf : function( searchValue, fromIndex ) {
    return this.z_val.indexOf( searchValue, fromIndex );
  },

  /**
   * 문자열이 시작하는 위치를 뒤부터 검색하여 반환한다.
   * <pre>
   *   osl.str( "xbox" ).lastIndexOf( "x" ); -> 3 을 반환
   * </pre>
   * 
   * @param {String} searchValue - 검색할 문자열
   * @param {Number} fromIndex - 검색시작위치
   * @return {Number} 문자열 검색위치
   */
  lastIndexOf : function( searchValue, fromIndex ) {
    return this.z_val.lastIndexOf( searchValue, fromIndex );
  },


  /**
   * F: 대문자로 변환한다.
   * <pre>
   *   osl.str( "xbox" ).toUpperCase().val(); -> "XBOX" 반환
   * </pre>
   * 
   * @return {osl.str}
   */
  toUpperCase : function() {
    this.z_val = this.z_val.toUpperCase()
    return this;
  },

  /**
   * F: 소문자로 변환한다.
   * <pre>
   *   osl.str( "XboX" ).toLowerCase().val(); -> "xbox" 반환
   * </pre>
   * 
   * @return {osl.str}
   */
  toLowerCase : function() {
    this.z_val = this.z_val.toLowerCase()
    return this;
  },

  /**
   * F: FORMAT 형식의 날짜문자열을 [YYYY,MM,DD,HH,MI,SS] 순서의 배열로 읽어온다.
   * <pre>
   *   alert( osl.str("03-23-2011 12:32").getDateArray("MM-DD-YYYY MI SS") ); -> [2011,03,23,,12,32]
   * </pre>
   * 
   * @param {String} format - 포맷 (YYYY,MM,DD,HH,MI,SS 조합)
   * @return {Array}
   */
  getDateArray : function( format ) {

    var z_format  = osl.str(format||osl.conf.com.dateFormat).setEng().toUpperCase().val();
    var z_dateStr = this.setNum().val();

    var z_div = [ 'YYYY', 'MM', 'DD', 'HH', 'MI', 'SS' ];
    var z_pos = [], z_res = [];

    // get position according to format
    $(z_div).each(function(i){
      z_pos.push( z_format.indexOf(z_div[i]) );
    });

    // extract data
    $(z_div).each(function(i){
      if( z_pos[i] < 0 ) {
        z_res[i] = null;
        return true;
      }
      z_res[i] = z_dateStr.substr( z_pos[i], z_div[i].length );
    });

    return z_res;

  },

  /**
   * F: 문자열이 달라지는 위치를 검색한다.
   * <pre>
   *   alert( osl.str("가12나").getDiffIndex("가나") ); -> 1을 반환
   * </pre>
   *
   * @param {String} string - 비교할 문자열
   * @return {Number} 문자열이 달라지는 시작점 (문자열이 동일하다면 -1 반환)
   */
  getDiffIndex : function( string ) {

    var diffTxt = osl.str( string ).val();

    if( this.z_val == diffTxt ) return -1;

    var iCnt = Math.max( this.z_val.length, diffTxt.length ), c0, c1;

    for( var i = 0; i < iCnt; i++ ) {

      c0 = this.z_val.charAt( i );
      c1 = diffTxt.charAt( i );

      if( c0 == "" || c1 == "" || c0 != c1 ) return i;

    }

  },

  /**
   * F: 문자열을 배열로 만든다.
   *
   * @param {String} seperator - 배열을 나눌 구분기호
   * @param {Number} limit - 최대 배열 개수
   * @return {Array} 구분기호로 분리된 배열
   */
  split : function( seperator, limit ) {
    return this.z_val.split( seperator || "", limit );
  },

  /**
   * F: 마스크를 적용한다.
   *
   * @param {String} format - 패턴 ( X:문자, 9:숫자, *:문자 또는 숫자 )
   * @return {osl.str}
   */
  setMask : function( format ) {

    var ptn = osl.str(format).val().toUpperCase();

    var result = "";

    var flag, j = 0, chStr, chPtn;

    for( var i = 0, iCnt = ptn.length; i < iCnt; i++ ) {

      flag = true;

      chStr = this.z_val.charAt(j);
      chPtn = ptn.charAt(i);

      if( chStr == "" ) break;

      switch( chPtn ) {

        case "X":
          if( ! osl.chk.isReg(chStr, osl.c.REG_PTN.MASK_CHR) ) flag = false;
          break;

        case "9" :
          if( ! osl.chk.isReg(chStr, osl.c.REG_PTN.MASK_NUM) ) {
            flag = false;
          }
          break;

        case "*" :
          if( ! osl.chk.isReg(chStr, osl.c.REG_PTN.MASK_ALL) ) flag = false;
          break;

        default :

          if( chStr == chPtn ) j++;
          result += chPtn;
          continue;

      }

      if( flag == true ) {
        result += chStr;
      } else {
        i--;
      }

      j++;

    }

    this.z_val = result;

    return this;

  },

  /**
   * F: 마스크를 해제한다.
   *
   * @param {String} format - 패턴 ( X:문자, 9:숫자, *:문자 또는 숫자 )
   * @return {osl.str}
   */
  setUnmask : function( format ) {

    var ptn = osl.str(format).remove(/[x|X|9|\*]/g).split();

    ptn = $.unique( ptn );

    for( var i = 0, iCnt = ptn.length; i < iCnt; i++ ) {
      this.removeAll( ptn[i] );
    }

    return this;

  }

};
// osl.str.js end //////////////////////////////////////////////////////

// osl.validation.js begin /////////////////////////////////////////////
/**
 * O : 정합성 검사엔진<br>
 *
 * @classDescription 정합성 검사를 하기위한 엔진을 컨트롤 한다.
 */
osl.z_vdCore = {

  rulePool : [], // 규칙목록 (인덱스 별)
  chkPool  : [], // 검사목록 (인덱스 별)
  observe  : [], // 감시목록 (전체)

  checkBlurEvent : true, // Blur 이벤트 발생시 체크를 계속 진행하기 위한 flag
  
  /**
   * 개체를 생성한다.
   * 
   * @return {Number} 개체 index
   */
  getInstance : function() {

    osl.z_vdCore.rulePool.push( {} );

    return osl.z_vdCore.rulePool.length - 1;

  },

  /**
   * 정합성 체크엔진을 구동한다.
   * 
   * @param {Number} idx rule 인덱스
   */
  init : function( idx ) {

    this.rulePool[idx].init = true;

    this.chkPool[ idx ] = {};
    this.chkPool[ idx ].rule = [];

    for( var exp in this.rulePool[idx].rule ) {

      $(exp).each( function(){
        osl.z_vdCore.setChkPool( osl.window.getId(this), exp );
      });

      $(exp)
        .die( "blur.kuValid" )
        .die( "focus.kuValid" )
        .die( "liveCreate.kuValid" )
        .live( "liveCreate.kuValid", $.proxy(this, "liveCreate") )
        .live( "blur.kuValid",       $.proxy(this, "blur")       )
        .live( "focus.kuValid",      $.proxy(this, "focus")      );

    }

  },

  /**
   * F: 입력받은 모든 데이터에 대해서 정합성 엔진을 초기화한다.
   */
  initAll : function() {
    for( var i = 0, cnt = osl.z_vdCore.rulePool.length; i < cnt; i++ ) {
      osl.z_vdCore.init( i );
    }
  },

  /**
   * F: 정합성 검사결과를 화면에 출력한다.
   *
   * @param {Object} result 정합성 검사결과
   */
  showValidResult : function( id, result ) {

    if( osl.c.VALIDATOR.SHOW_TIP != true ) return;

    if( result.msg.length == 0 ) {
      osl.window.hideTip();
    } else {
      osl.window.showTip( result.msg, {id:id} );
    }

  },

  /**
   * F: 검사목록에 활성화된 INPUT 객체의 Validation 규칙을 추가한다.
   * 
   * @param {String} id - 활성화된 INPUT 객체의 id
   * @param {String} selector - 셀렉터
   */
  setChkPool : function( id, selector ) {
	  
    for( var i = 0, iCnt = this.rulePool.length; i < iCnt; i++ ) {

      if( osl.chk.isNull(this.chkPool[i]) ) continue;
      
      var param = this.rulePool[i].rule[selector];
      
      if( osl.chk.isNull(param) ) continue;
      
      var chkParam = this.chkPool[i].rule[id];
      
      if( osl.chk.isNull(chkParam) ) {
        this.chkPool[i].rule[id] = param;
        this.setObserveRule( id, param );
      }

    }

  },

  /**
   * F: 감시목록에 활성화된 INPUT 객체의 Validation 규칙을 추가한다.
   *
   * @param {String} id - input 객체 id
   * @param {osl.data} param - 검사할 규칙
   */
  setObserveRule : function( id, param ) {
	 
    var flag = false;

    if( osl.chk.isNull(this.observe[id]) ) {
      this.observe[id] = {};
      this.observe[id].rule = param;
      this.observe[id].val  = $("#"+id).val();
      this.observe[id].observed = false;

      flag = true;

    } else if( ! this.observe[id].rule.equals(param) )  {
      this.observe[id].rule.merge( param );
      flag = true;
    }

    if( flag == true ) {
    	      var chkResult = this.chkValid( $("#"+id).val(), this.observe[id].rule );
      //this.setLabel( id, chkResult.msg );

      var obj = $("#"+id);

      for( var attr in this.observe[id].rule.getData() ) {

        switch( attr.toLowerCase() ) {
          case "maxlen" :
          case "maxbyt" :
          case "fixlen" :
          case "fixbyt" :
            obj.prop( "maxlength", param.get(attr) );
            break;
          case "mask" :
            obj.prop( "maxlength", param.get(attr).length );
            break;
          case "date" :
              var dtFormat = param.get(attr).format;
              var dtFn     = param.get(attr).fn;

              obj.datepicker({
            	  dateFormat      : dtFormat.replace( "YYYY", "YY" ).toLowerCase()
              });
              obj.prop( "maxlength", dtFormat.length );
            break;
        }
      }

    }

  },

  /**
   * F: 동적으로 생성될 때 실행될 이벤트
   * 
   * @param {Object} event
   */
  liveCreate : function( event ) {

    var selector = event.handleObj.selector;
    var id       = osl.window.getId( event.currentTarget );
    var self     = $("#"+id);

    if( self.prop("liveCreated") != true ) {
      this.setChkPool( id, selector );
      self.prop( "liveCreated", true );
    }

  },


  /**
   * F: 포커스 로직을 처리한다.
   * 
   * @param {Object} event
   */
  focus : function( event ) {
	  
	this.liveCreate( event );
	
    var selector = event.handleObj.selector;
    var id       = osl.window.getId( event.currentTarget );

    var chkParam  = this.observe[id].rule;
    var chkResult = this.chkValid( $("#"+id).val(), chkParam );

    this.showValidResult( id, chkResult );

    //this.setLabel( id, chkResult.msg );

    // 포커스 상태에 들어갈 경우 감시 이벤트 활성화
    this.observe[id].observed = true;
    this.observe[id].preVal = $("#"+id).val();

    this.keyObserve( id );

  },

  /**
   * F: 입력상자에서 포커스가 빠져나갔을 경우 이벤트를 처리한다.
   * 
   * @param {Object} event
   */
  blur : function( event ) {

    osl.window.hideTip();
    
    if( this.checkBlurEvent == false ) return false;

    var id  = $(event.currentTarget).prop("id").replace(/(:|\.)/g,'\\$1');
    var obj = $("#"+id);

    // 감시 제거
    this.observe[id].observed = false;

    var chkRule = this.observe[id].rule;
    
    // focus-out 시 정합성 체크
    var chkRslt = this.chkValid( obj.val(), chkRule );

    if( osl.c.VALIDATOR.SHOW_ALERT && ! chkRslt.result ) {

        this.checkBlurEvent = false;

        setTimeout( function(){
          osl.z_vdCore.showErrorMsg( id, osl.z_vdCore.getUserFriendlyMsg( chkRslt ) );
          $("#"+id).focus();
          osl.z_vdCore.checkBlurEvent = true;
        }, 0 );

      }
    
    // 입력값에 mask 적용
    if( chkRule.hasKey("mask") ) {

      var mask   = chkRule.get("mask");
      var mskVal = osl.str(obj).setUnmask(mask).setMask(mask).val();

      obj.val(mskVal);
      osl.z_vdCore.observe[id].val = mskVal;

    } else if( chkRule.hasKey("date") ) {

      if(!osl.chk.isEmpty(obj.val()))
      {
          var format = chkRule.get( "date" ).format;    	
          var date = osl.date( obj.val(), format );
          if( date.val() != null ) obj.val( date.toString() );    	  
      }

    } else if( chkRule.hasKey("psn") ) {

        var mask   = "9999999999999";
        var mskVal = osl.str(obj).setUnmask(mask).setMask(mask).val();

        obj.val(mskVal);
        osl.z_vdCore.observe[id].val = mskVal;

    }

  },

  /**
   * F: 키 입력 이벤트를 지속적으로 감시한다.
   * 
   * @param {osl.data} id
   */
  keyObserve : function( id ) {

    // 감시상태가 아니라면 함수 종료
    if( this.observe[id].observed != true ) return;

    var obj = $( "#" + id );

    // 입력값이 바뀔 때까지 기다린다.
    if (osl.z_vdCore.observe[id].val == obj.val()) {
      setTimeout( function(){ osl.z_vdCore.keyObserve(id); }, osl.c.VALIDATOR.CHECK_INTERVAL );
      return false;
    }

    this.observe[id].preVal = this.observe[id].val;
    this.observe[id].val    = obj.val();

    // 검사를 수행한다.
    var chkParam  = this.observe[id].rule;
    var chkResult = this.chkValid( obj.val(), chkParam );

    this.showValidResult( id, chkResult );
    //this.setLabel( id, chkResult.msg );

    // 입력값을 다시 체크한다.
    if( this.observe[id].observed != true ) return;
    setTimeout( function(){ osl.z_vdCore.keyObserve(id); }, osl.c.VALIDATOR.CHECK_INTERVAL );

  },

  /**
   * F: id에 해당하는 오브젝트의 validation을 수행한다.<br>
   * 
   * @param {String} chkVal - 정합성 검사를 수행할 값
   * @param {osl.data} rule - 정합성 규칙
   * @return {Object} 수행결과를 담은 JSON 데이터 {result:true/false, msg:[에러메세지], rule:[검사한 규칙], param:[규칙에 설정한 파라미터], chkVal:[검사한 값] }
   */
  chkValid : function( chkVal, rule ) {

    var result = {};
    result.result = true;
    result.msg    = [];
    result.rule   = [];
    result.param  = [];
    result.chkVal = [];

    var param, errMsg;
   
    var opt = rule.getData();

    for( var attr in opt ) {

      param  = opt[ attr ];
      errMsg = "";

      switch( attr ) {
        case "required" :
          if( osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "minlen" :
          if( !osl.chk.isMinLen(osl.str(chkVal), param) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr, param, osl.str(chkVal).length() );
          break;
        case "maxlen" :
          if( !osl.chk.isMaxLen(osl.str(chkVal), param) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr, param, osl.str(chkVal).length() );
          break;
        case "fixlen" :
          if( (!osl.chk.isMinLen(osl.str(chkVal), param) || !osl.chk.isMaxLen(osl.str(chkVal), param)) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr, param, osl.str(chkVal).length() );
          break;
        case "minbyt" :
          if( !osl.chk.isMinByte(osl.str(chkVal), param) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr, param, osl.str(chkVal).bytes() );
          break;
        case "maxbyt" :
          if (!osl.chk.isMaxByte(osl.str(chkVal), param) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr, param, osl.str(chkVal).bytes() );
          break;
        case "fixbyt" :
          if( (!osl.chk.isMinByte(osl.str(chkVal), param) || !osl.chk.isMaxByte(osl.str(chkVal), param)) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr, param, osl.str(chkVal).bytes() );
          break;
        case "num" :
          if( !osl.chk.isNum(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "eng" :
          if( !osl.chk.isEng(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "noe" :
          if( !osl.chk.isNumEng(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "kor" :
          if( !osl.chk.isKor(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "nok" :
          if( !osl.chk.isKor(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "nae" :
          if( !osl.chk.isNumAndEng(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "notnum" :
          if( !osl.chk.isNotNum(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "date" :
          if( !osl.chk.isEmpty(chkVal) && !osl.chk.isDate(chkVal, param.format) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "psn" :
        	// PSN일 경우 FSN도 포함하여 허용
          if( !(osl.chk.isPsn(chkVal) || osl.chk.isFsn(chkVal)) && (chkVal!='7811111111111') && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "fsn" :
          if( !osl.chk.isFsn(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "csn" :
          if( !osl.chk.isCsn(chkVal) && (chkVal!='1111111111') && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "lsn" :
          if (!osl.chk.isLsn(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "email" :
          if( !osl.chk.isEmail(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "homephone" :
          if( !osl.chk.isHomePhone(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "cellphone" :
          if( !osl.chk.isCellPhone(chkVal) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
          break;
        case "mask" :
          if( !osl.chk.isMasked( osl.str(chkVal).setUnmask(param).setMask(param), param) && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr, param );
          break;
        case "currency" :
            if( !osl.chk.isCurrency(chkVal) && (chkVal!='0') && !osl.chk.isEmpty(chkVal) ) errMsg = getMsg( attr );
            break;          
      }

      if( errMsg != "" ) {
        result.result = false;
        result.msg.push( errMsg );
        result.rule.push( attr );
        result.param.push( param );
        result.chkVal.push( chkVal );
      }

    }

    return result;

    function getMsg( ruleName, param ) {
      arguments[0] = "osl.api.vdRule." + arguments[0];
      return osl.msg.get( arguments );
    }

  },

  /**
   * F: 라벨을 변경한다.
   * 
   * @param {String} id
   * @param {Array} msg
   */
  setLabel : function( id, msg ) {

    if( msg.length > 0 ) {

      var txt = osl.z_vdCore.getLabelTitle(id) + osl.c.VALIDATOR.RULE_DESC + msg.join( osl.c.VALIDATOR.NEW_LINE );
      $("#"+id).attr( "title", txt );

    }

  },

  /**
   * F: 라벨을 초기화한다.
   * @param {String} id
   * @private
   */
  clearLabel : function( id ) {

    $("#"+id).attr( "title", osl.z_vdCore.getLabelTitle(id) );

  },

  /**
   * F: 라벨의 원래 title 값을 구한다.
   * 
   * @param {String} id
   * @return {String} 원래 title 값
   */
  getLabelTitle : function( id ) {

    var obj = $("#"+id);
    var title = obj.prop("title");

    if( title.indexOf(osl.c.VALIDATOR.RULE_DESC) >= 0 ) {

      title = title.split(osl.c.VALIDATOR.RULE_DESC)[0];

      return title;

    }

    return "";

  },

  /**
   * F: (ID에 해당하는) 개체의 포맷이 적용되기 이전값을 반환한다.
   * 
   * @param {String} id - 개체의 ID
   * @return {String}
   */
  getUnmaskedVal : function( id ) {

    var obj = ( osl.chk.isTypStr(id) ) ? $("#"+id) : $(id);
    if( obj.length != 1 ) return "";

    var val = obj.val();
    if( val == "" ) return "";

    var param = osl.z_vdCore.observe[id];

    if( osl.chk.isNull(param) ) return val;

    param = param.getData();

    for( var attr in param ) {

      switch( attr ) {
        case "date" :

          var d = osl.date( val );
          var f = osl.str( d.format() ).remove( /[-|.|:| ]/g ).val();

          return d.toString( f );

        case "mask" :

          return osl.str( val ).setUnmask( param[attr] ).val();

        default :
      }

    }

    return val;

  },

  /**
   * 특정 id를 가진 객체를 대상으로 에러메세지를 출력한다.
   *
   * @param {String} id   에러 출력대상 id
   * @param {String} msg  에러메세지
   * @return {Boolean} 에러출력여부
   */
  showErrorMsg : function( id, msg ) {

    if( msg == "" ) return false;

    var title = $("#"+id).prop("title");

    if( title != "" ) {
      msg = "@" + osl.c.REG_PTN.HAN_JOSA[0] + "(" + osl.c.REG_PTN.HAN_JOSA[1] + ") " + msg;
    }

    osl.msg.alert( msg, title );

    return true;

  },


  /**
   * 사용자 친화적인 메세지를 구한다.
   *
   * @param {Object} chkRslt osl.z_vdCore.chkValid 함수 수행결과
   * @return {String} 출력할 에러메세지
   */
  getUserFriendlyMsg : function( chkRslt ) {

    if( chkRslt.result ) return  "";

    var idx = 0, msg = "";

    for( var z = 0; z <= 1; z++ ) {

      switch( z ) {

        case 0 :
               if( chkRule("required") ) msg = getMsg( "required" );
          else if( chkRule("minlen") )   msg = getMsg( "minlen", chkRslt.param[idx], osl.str(chkRslt.chkVal[idx]).length() );
          else if( chkRule("maxlen") )   msg = getMsg( "maxlen", chkRslt.param[idx], osl.str(chkRslt.chkVal[idx]).length() );
          else if( chkRule("fixlen") )   msg = getMsg( "fixlen", chkRslt.param[idx], osl.str(chkRslt.chkVal[idx]).length() );
          else if( chkRule("minbyt") )   msg = getMsg( "minbyt", chkRslt.param[idx], osl.str(chkRslt.chkVal[idx]).bytes() );
          else if( chkRule("maxbyt") )   msg = getMsg( "maxbyt", chkRslt.param[idx], osl.str(chkRslt.chkVal[idx]).bytes() );
          else if( chkRule("fixbyt") )   msg = getMsg( "fixbyt", chkRslt.param[idx], osl.str(chkRslt.chkVal[idx]).bytes() );
          else if( chkRule("numeric") )  msg = getMsg( "numeric" );
          else if( chkRule("num") )      msg = getMsg( "num" );
          else if( chkRule("eng") )      msg = getMsg( "eng" );
          else if( chkRule("noe") )      msg = getMsg( "noe" );
          else if( chkRule("kor") )      msg = getMsg( "kor" );
          else if( chkRule("nok") )      msg = getMsg( "nok" );
          else if( chkRule("nae") )      msg = getMsg( "nae" );
          else if( chkRule("notnum") )   msg = getMsg( "notnum" );
          else if( chkRule("notkor") )   msg = getMsg( "notkor" );
          else if( chkRule("date") )     msg = getMsg( "date" );
          else if( chkRule("currency") )      msg = getMsg( "currency" );
          break;

        case 1 :
               if( chkRule("psn") )      msg = getMsg( "psn" );
          else if( chkRule("fsn") )      msg = getMsg( "fsn" );
          else if( chkRule("csn") )      msg = getMsg( "csn" );
          else if( chkRule("lsn") )      msg = getMsg( "lsn" );
          else if( chkRule("email") )    msg = getMsg( "email" );
          else if( chkRule("homephone")) msg = getMsg( "homephone" );
          else if( chkRule("cellphone")) msg = getMsg( "cellphone" );
          else if( chkRule("mask") )     msg = getMsg( "mask", chkRslt.param[idx] );

          break;
      }

      if( msg != "" ) return msg;

    }

    return "";

    function chkRule( ruleName ) {
      idx = $.inArray( ruleName, chkRslt.rule );
      return idx >= 0;
    }

    function getMsg( ruleName, param ) {
      arguments[0] = "osl.api.vdMsg." + arguments[0];
      return osl.msg.get( arguments );
    }


  },
  

  /**
   * F: 동적 생성 객체를 감시목록에 추가한다.
   *
   * @param {Number} idx - rule 인덱스
   */
  refresh : function( idx ) {

    var idFocused = osl.etc.getFocusId();

    if( this.rulePool[idx].init != true ) return;

    for( var exp in this.rulePool[idx].rule ) {
        $(exp).each( function(){
            var id       = osl.window.getId(this);
            var self     = $("#"+id);
            if( self.prop("liveCreated") != true ) {
            	osl.z_vdCore.setChkPool( id, exp );
            	self.prop( "liveCreated", true );
            }
        });

    }

    $("#"+idFocused).focus();

  },

  /**
   * F: 감시그룹에 속한 모든 동적 생성 객체를 감시목록에 추가한다.
   */
  refreshAll : function() {

    for( var i = 0, cnt = this.rulePool.length; i < cnt; i++ ) {
      this.refresh( i );
    }

  }

};


/**
 * F: 정합성 검사  개체
 * <pre>
 *   // 객체 선언
 *   var group = osl.validator();
 *
 *   // 규칙 선언
 *   group.add("#inpDate", {date:true} ).add( "[name^=item]", {required:true} ).init();
 *
 *   // 정합성 검사
 *   group.isValid();
 * </pre>
 *
 * @classDescription 정합성 검사를 수행한다.
 * @return {osl.validator}
 */
osl.validator = function() {

  var z_self = arguments.callee;
  if(!(this instanceof z_self)) return new z_self();

  this.idx      = osl.z_vdCore.getInstance();
  this.rulePool = osl.z_vdCore.rulePool[ this.idx ];

};

osl.validator.prototype = {

  /**
   * F: 정합정 체크로직을 세팅한다.<br><br>
   *
   * required  : {Boolean} 필수입력<br>
   * minlen    : {Number}  최소길이<br>
   * maxlen    : {Number}  최대길이<br>
   * minbyt    : {Number}  최소글자<br>
   * maxbyt    : {Number}  최대글자<br>
   * fixlen    : {Number}  고정길이<br>
   * fixbyt    : {Number}  고정글자<br>
   * date      : {String}  날짜포맷 (YYYY-MM-DD)
   * date      : {Array}   [ 날짜포맷 (YYYY-MM-DD), 실행함수 ]
   * psn       : {Boolean} 주민등록번호<br>
   * email     : {Boolean} 이메일<br>
   * homephone : {Boolean} 집전화번호<br>
   * cellphone : {Boolean} 휴대전화번호<br>
   * num       : {Boolean} 숫자만 허용<br>
   * eng       : {Boolean} 영문만 허용<br>
   * kor       : {Boolean} 한글만 허용<br>
   * noe       : {Boolean} 영문숫자만 허용<br>
   * nae       : {Boolean} 영문&숫자만 허용<br>
   * nok       : {Boolean} 한글숫자만 허용<br>
   * notnum    : {Boolean} 숫자 비허용<br>
   * mask      : {String}  패턴 (X:문자, 9:숫자, *:문자 또는 숫자) <br>
   * fsn       : {Boolean} 국내거소신고번호<br>
   * csn       : {Boolean} 사업자등록번호<br>
   * lsn       : {Boolean} 법인등록번호<br>
   * focus     : {String} 포커스 이동 위치<br>
   * msghead   : {String} 사용자 메시지<br>    
   * currency  : {String} 통화형식(1,000.12)<br> 
   *
   * @param {String} expression - 셀렉터
   * @param {Object} param - 정합성 체크옵션
   * @return {osl.validator}
   */
  add : function( expression, param ) {

    if( osl.chk.isNull(param) || osl.chk.isEmpty(expression) ) return this;

    this.rulePool.rule = this.rulePool.rule || [];

    var realParam = new osl.data();

    for( var i in param ) {

      attr = i.toLowerCase();

      switch( attr ) {
        case "lsn"       :
          if( param[i] != true ) continue;
          break;
        case "fixbyt"    :
          if( !osl.chk.isNum(param[i]) ) continue;
          break;
        case "date"      :

            var dtFormat = osl.c.DATE.FORMAT;
            var dtFn     = function() {};

            if( osl.chk.isTypStr(param[i]) ) {
              dtFormat = param[i];
            } else if( osl.chk.isTypStr(param[i]) ) {
              dtFn = param[i];
            } else if( osl.chk.isTypArr(param[i]) ) {

              for( var z = 0, zCnt = param[i].length; z < zCnt; z++ ) {

                if( osl.chk.isTypStr(param[i][z]) ) {
                  dtFormat = param[i][z];
                } else if( osl.chk.isTypFn(param[i][z]) ) {
                  dtFn = param[i][z];
                }

              }

            }

            param[i] = {};
            param[i].format = dtFormat;
            param[i].fn     = dtFn;

            break; 
        default :
          if( osl.chk.isEmpty(param[i]) ) continue;
          break;
         
      }
	
      realParam.add( attr, param[i] );

    }

    if( realParam.size() > 0 ) {
      this.rulePool.rule[ expression ] = realParam;
    }

    return this;

  },

  /**
   * F: 입력항목의 정합성 여부를 확인한다.
   * 
   * @param {Boolean} showAlert - 알람창 출력여부
   * @return {Boolean} 정합성 검사 성공여부
   */
  isValid : function( showAlert ) {

	if( showAlert != false ) showAlert = true;
	
	this.refresh();

    var chkPool = osl.z_vdCore.chkPool[this.idx];

    for( var id in chkPool.rule ) {
    	
    	if( $("#"+id).length == 0  ) {
    		delete chkPool.rule[id];
    		continue;
    	}

      
      var chkRslt =  osl.z_vdCore.chkValid( $("#"+id).val(), chkPool.rule[id] );

      if( chkRslt.result ) continue;

      if( showAlert == true ) {

        var errMsg = osl.z_vdCore.getUserFriendlyMsg( chkRslt );

        osl.z_vdCore.showErrorMsg( id, errMsg );

        $("#"+id).focus();

      }

      return false;

    }

    return true;

  },


  /**
   * F: validation 엔진을 초기화한다.
   */
  init : function( blurAlert, realtimeAlert ) {

	var idx = this.idx;
	
    if( $.isReady ) {
      osl.z_vdCore.init( idx );
    } else {
	  $().ready( function() {
	    osl.z_vdCore.init( idx );
      });
    }
    
    if( blurAlert     == true ) osl.c.VALIDATOR.SHOW_ALERT = true;
    
    // 무조건 false 로 셋팅. 파라미터 값이 동작하지 않도록 함. 하드코딩 처리
    if( realtimeAlert == true ) osl.c.VALIDATOR.SHOW_TIP = false;
    else osl.c.VALIDATOR.SHOW_TIP   = false;

  },
  
  /**
   * Validation 엔진의 감시목록을 갱신한다.<br/>
   *
   * 동적으로 생성한 객체가 감시목록규칙에 포함되는 항목이라면,
   * 해당 함수를 프로그램에서 호출하여 정합정 엔진을 갱신해주어야 한다.
   */
  refresh : function() {
    osl.z_vdCore.refresh( this.idx );
  },
  
  /**
   * F: 특정 Rule Check 대상 객체를 Check 대상에서 제외시킨다.
   * (공식적으로 제공하기 전)
   * 
   * @param expression
   */
  remove : function(expression) {
	  var tgtObj = this.rulePool.rule[ expression ];
	  var tgtObj1 = osl.z_vdCore.observe[osl.window.getId($(expression))];
	  
	  if( !osl.chk.isNull(tgtObj)) {
    	  tgtObj.clear();
      }
	  
	  if( !osl.chk.isNull(tgtObj1)) {
    	  tgtObj1.rule.clear();
      }
	  
  }

};
// osl.validation.js end ///////////////////////////////////////////////
