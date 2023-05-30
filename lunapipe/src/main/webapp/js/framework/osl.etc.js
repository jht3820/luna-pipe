// osl.etc.js begin ////////////////////////////////////////////////////
/**
 * O: 기타 유틸리티
 * 
 * @classDescription 파일명으로 구분한 Javascript 외의 기타 유틸리티 함수 모음
 */
osl.etc = {};

/**
 * F: 지정한 시간만큼 동작을 멈춘다.<br>
 * CPU 자원을 많이 소모하기 때문에 특별한 경우가 아니라면 사용을 금한다.
 * 
 * @param {Number} msecs - 동작을 멈출 시간 (단위:1/1000초)
 */
osl.etc.wait = function( msecs ) {
	var curr = strt = new Date();
	while(curr - strt < msecs) { curr = new Date(); }
};

/**
 * F: 값이 없다면 지정한 객체로 반환받는다.
 * 
 * @param {Object} obj - 검사할 객체
 * @param {Object} replace - null일 경우 치환할 객체
 * @return {Object}
 */
osl.etc.nvl = function( obj, replace ) {

	if( obj == null || obj == undefined ) return replace;
	return obj;

};

/**
 * F: 현재 포커스된 개체의 ID를 구한다.
 * 
 * @return {String} focus - 개체의 ID
 */
osl.etc.getFocusId = function() {
	var id = osl.etc.nvl(document.activeElement, {id:""} ).id;
	return id;
};

/**
 * F: 조회결과를 같은 name 속성을 가진 개체의 값으로 binding 한다.
 * 
 * @param {String} expression - jQuery 표현식
 * @param {Object} data - 데이터 (osl.ajax.res 에 들어있는 조회결과 데이터)
 */
osl.etc.bindByName = function( expression, data ) {

	var self = this;

	$(expression).each( function() {

		var th   = $(this);
		var name = th.attr("name");

		if( !osl.chk.isEmpty(name) ) {

			if( th.is(":input") ) {
				th.val( osl.str.unclearXss(osl.str.nvl(data[name], "")) );
			} else {
				th.html( osl.str.nvl(data[name], "") );
			}

		} else {
			self.bindByName( $("*[name]", th), data );
		}

	});
};

/**
 * F: 조회결과를 같은 id 속성을 가진 개체의 값으로 binding 한다.
 * 
 * @param {String} expression - jQuery 표현식
 * @param {Object} data - 데이터 (osl.ajax.res 에 들어있는 조회결과 데이터)
 */
osl.etc.bindById = function( expression, data ) {

	var self = this;
	
	$(expression).each( function() {

		var th   = $(this);
		var id = th.attr("id");

		if( !osl.chk.isEmpty(id) ) {

			if( th.is(":input") ) {
				th.val( osl.str.unclearXss(osl.str.nvl(data[id], "")) );
			} else {
				th.html( osl.str.nvl(data[id], "") );
			}

		} else {
			self.bindById( $("*[id]", th), data );
		}

	});
};

/**
 * F: document가 onready 상태일 경우 지정한 함수를 실행한다.
 * 
 * @param {Function} fn - onready 상태일 경우 실행할 함수
 */
osl.etc.onreadyCall = function( fn ) {

	if( !$isReady ) {};

	// initializing
	if( $.isReady ) {
		fn();
	} else {
		$(document).ready(function(){ fn(); });
	}
};

/**
 * DOM 엘리먼트의 tag name을 변경한다.<br/>
 * <INPUT> 태그를 <DIV> 태그로 바꾸는 등의 작업에 사용한다.
 *
 * @param {String} id - 개체의 ID
 * @param {String} tagName - 변경할 tag name (input, div, select ... )
 */
osl.etc.changeTagName = function( id, tagName ) {

    if( $(id).length != 1 ) return;

    var z_tagName = $(id).attr("tagName");

    if( z_tagName == tagName.toUpperCase() ) return;

    var z_srcTag = $("<div/>").append( $(id).clone(true) ).html();

    var z_trgTag = z_srcTag.replace( eval( "/<" + z_tagName + "/i" ), "<" + tagName ).replace( eval( "/\/" + z_tagName + ">/i" ),"/" + tagName + ">");

    $(id).replaceWith( z_trgTag );

};

/**
 * 배열의 차원을 구한다.
 *
 * @param {Array} array
 * @return {Number} 배열의 차원
 */
osl.etc.getArrDim = function( array, cnt ) {

	if( osl.chk.isNull(cnt) ) cnt = 0;
	if( ! osl.chk.isTypArr(array) ) return cnt;

	cnt++;

	try{
		return osl.etc.getArrDim( array[0], cnt );
	} catch(e) {
		return cnt;
	}

};
// osl.etc.js end //////////////////////////////////////////////////////



// osl.table.js begin //////////////////////////////////////////////////
/**
* F: 테이블 처리 클래스
*
* <pre>
*   var table = osl.table( "#tblFile", {onClick:fnOnClick} );
*   table.setModel([
*     {title:"파일KEY", field:"key"  },
*     {title:"파일명",  field:"name" },
*   ]);
*
*   table.addRow({key:"1", name:"yahoo"}); -> 단건 데이터 추가
*   table.bind( {...} ); -> 다건 데이터 추가
* </pre>
*
* @param {String} id - 테이블 객체로 사용할 화면 div 의 id
* @param {Object} option - 테이블 옵션
* <pre>
*  rowNum       : {Number} 테이블 에 표시될 rows 수, 서버에서 n개를 리턴하더라도 표기된 수 만큼만 표시 해 줌. -1 값일경우는 무제한으로 표시 (기본값 : 10)<br>
*  rowHeight    : {Number} 각 행의 높이  (기본값 : 200 )
*  height       : {String} 테이블 전체 높이 설정 (기본값 : 100%)
*  sortname     : {String} 정렬할 필드 설정
*  sortorder    : {String} 데이타 정렬이 필요한 필드 지정. ( 옵션 : [기본값 : none , 오름차순 : asc , 내림차순 : desc ])
*  initNoData   : {Boolean} 테이블 초기구성시 조회결과 없음 문장 표시여부 (기본값 : true )
*  multiselect  : {Boolean} 다중선택 여부 (기본 값 :false)
*  rownumbers   : {Boolean} 로우 값 표시. (기본값 : false)
*  navi         : {Object} 페이징처리 {@link osl.config.js [osl.c.TABLE]}
*  onClick      : {Function} onClick 이벤트 발생시 실행할 function 지정
* </pre>
*
*/
osl.table = function( id, option ) {

  var z_self = arguments.callee;
  if(!(this instanceof z_self)) return new z_self( id, option );

  // 파라미터 id
  this.orgin_id = id;

  // 테이블 id 조합
  this.pure_id = id.replace("#","");

  // 테이블 id
  this.t_id = "#"+osl.c.TABLE.PREFIX+this.pure_id;

  // 사용자 정의 컴포넌트 추가여부
  this.customComp = [];

  // 테이블 옵션
  this._option = $.extend({
  width      : 800,
  rowHeight  : 200,
  height     : '100%',
  sortname   : '',
  sortorder  : 'desc',
  page       : false,
  initNoData : true,
  multiselect: false,
  navi       :{},
  rownumbers : false,
  onClick    : function() {}
  }, option || {} );

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 변수 초기화
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /** 행 index */
  this.rowIndx = 0;

  /** 컬럼 key */
  this.colKey = "";

  /** 테이블 데이타 */
  this.data = {};

  /** 행 index*/
  this.save = [];

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // 브라우저 체크 및 초기화
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if( $.isReady ) this.z_init();  else  $().ready( $.proxy(this, "z_init") );

};

osl.table.prototype = {

  /**
  * F: 초기화 작업을 수행한다.
  * 
  * @private
  */
  z_init : function () {

    // tag 체크 ( jquery 1.6 에서는 attr : undefined , prop 로 체크 )
    if ($(this.orgin_id).prop('tagName') != "TABLE")
      $(this.orgin_id).append("<table id=" + osl.c.TABLE.PREFIX + this.pure_id + "/>").attr("id", this.pure_id);
    else {
      $(this.orgin_id).attr("id", osl.c.TABLE.PREFIX + this.pure_id);
      $("<div id=" + this.pure_id + "></div>").insertBefore("#" + osl.c.TABLE.PREFIX + this.pure_id);
      $($(this.orgin_id)).append($("#" + osl.c.TABLE.PREFIX + this.pure_id));
    }

    // 헤더정보가 존재
    if( this.headerInfo ) this.z_createTable();

    /** 데이타 바인딩 이벤트 리스너 */
    $(this.t_id).bind( "tevtDataloading", $.proxy(this, "z_bind") );

    /** 테이블 헤더 생성 이벤트 리스너 */
    $(this.t_id).bind( "tevtHeaderDraw",  $.proxy(this, "z_createTable") );

  },

  /**
  * F: 컬럼 설정.
  * <pre>
  *  tblSample.setModel = [ {title:'인벤토리',field:'id', width:100,align:"center",sorttype:"int"},
  *                         {title:'제목',field:'title', width:120},
  *                         {mergeInfo: [ { indexes: "0, 1", title: "The combined title" }] ]
  * </pre>
  * @param {Object} options - 컬럼 헤드 옵션
  * <pre>
  *    title       : {String} (필수) 화면에 표시되는 제목
  *    field       : {String} (필수) 데이타 매핑되는 필드
  *    width       : {Number|string} 각 컬럼 넓이  (기본값 : 200 )
  *    align       : {String} 컬럼 위치 ( 옵션 : [기본값 : left , 오른쪽 : right , 가운데 : center ])
  *
  *    formatter   : {Boolean} 테이블 초기구성시 조회결과 없음 문장 표시여부 (기본값 : false )
  *    sorttype    : {String} int, string , date
  *
  *    combo        : {Object} 컬럼 에디팅 옵션 <pre> combo: {value:'optionvalue1:lable1;optionvalue2:lable2'} </pre> ( 구분 => ";" )
  *    input       : {Object} 컬럼 에디팅 옵션 <pre>size: , maxlength: </pre>
  *    check       : {Object} 컬럼 에디팅 옵션 <pre> check:{value: ''}</pre> ( 구분 => ":" )
  *    text        : {Object} 컬럼 에디팅 옵션 (textarea)[ <pre>rows: , cols: </pre> ]
  *    summaryType : {string} 컬럼 에디팅 옵션
  *
  *    mergeInfo   : {Array}  헤더 머지 정보 { indexes : '시작 컬럼 인덱스, 종료 컬럼 인덱스', title : 헤더 제목 }
  *    rowspan     : {string} 데이타 의존적 행 합침
  *    colspan     : {string} 데이타 의존적 열 합침
  * </pre>
  *
  * @return {osl.table}
  */
  setModel : function( options ){

    if( !osl.chk.isTypArr(arguments[0]) ) {
      var tmpArr = [];
      $.each( arguments, function(){ tmpArr.push(this); });
      options = tmpArr;
    }

    var moptions = $.extend([{
    key:false,
    title:'',
    field:'',
    width:200,
    align:'left',
    formatter:'',
    sorttype:'',
    //edit option
    combo:$.extend({value:''}),
    input:$.extend({size:'',maxlength:''}),
    check:$.extend({value:''}),
    text: $.extend({rows:'', cols:''}),
    summaryType:'', // sum
    // 헤더 머지 정보
    mergeInfo : $.extend({title:'',indexs:''}),
    // 데이타 rowspan/colspan
    rowspan : '',
    colspan : '',
    tag:''
    }] , options);

    var _colNames         = new Array();
    var _colModel         = new Array();
    var headerColspan     = new Array();
    var customElementInfo = new Array();

    var _colspan = new Array();
    var _rowspan = new Array();

    var editabled = false;
    var isSummary = false;
    var _colKey = "";

    try {

      /** 테이블 컬럼 옵션 */
      for (var pos in moptions) {

        var itm = moptions[pos];

        // rowspan 속성이 존재
        if (itm.hasOwnProperty("rowspan"))
          _rowspan = itm.rowspan;
        // colspan 속성이 존재
        else
          if (itm.hasOwnProperty("colspan"))
            _colspan = itm.colspan;
          // mergeInfo 속성이 존재
          else
            if (itm.hasOwnProperty("mergeInfo"))
              headerColspan = itm.mergeInfo;
            else {

              ///////////////////////////////////////////////////////////////////////////////////////////////////////////
              // 필수 값 체크
              ///////////////////////////////////////////////////////////////////////////////////////////////////////////

              if (!itm.hasOwnProperty("field"))
                throw osl.msg.get("table.rqd.0001", "field");
              if (!itm.hasOwnProperty("title"))
                throw osl.msg.get("table.rqd.0001", "title");

              var _m = {};

              if (itm.hasOwnProperty("tag")) {
                this.z_setCustomComp( itm.field , itm.tag );
              }

              /** 설정된 컬럼 속성 셋팅 */
              for (var j in itm) {
                if( !itm.hasOwnProperty("field") ) throw osl.msg.get("table.rqd.0001", "field");
                if( !itm.hasOwnProperty("title") ) throw osl.msg.get("table.rqd.0001", "title");

                _m.name = itm.field;
                _m.index = itm.field;


                if (itm.hasOwnProperty("key")) {
                  _m.key = itm.field;
                  if (itm.key) {
                    _colKey = itm.field;
                  }
                }
                if (itm.hasOwnProperty("width"))
                  _m.width = itm.width;
                if (itm.hasOwnProperty("align"))
                  _m.align = itm.align;

                if (!this._option.page) {

                  if (itm.hasOwnProperty("sorttype")) {
                    _m.sortable = true;
                    _m.sorttype = itm.sorttype;
                  }
                  else {
                    _m.sortable = false;
                  }

                }

                if (itm.hasOwnProperty("formatter"))
                  _m.formatter = itm.formatter;
                if (itm.hasOwnProperty("summary")) {
                  if (itm.summary) {
                    _m.summaryType = 'sum'; // sum
                    isSummary = true;
                  }
                }

                if (itm.hasOwnProperty("combo")) {
                  _m.edittype = "select";
                  _m.editoptions = itm.combo;
                  _m.editable = true;
                  editabled = true;
                }
                if (itm.hasOwnProperty("input")) {
                  _m.editoptions = itm.input;
                  _m.editable = true;
                  editabled = true;
                }
                if (itm.hasOwnProperty("text")) {
                  _m.edittype = "textarea";
                  _m.editoptions = itm.text;
                  _m.editable = true;
                  editabled = true;
                }
                if (itm.hasOwnProperty("check")) {
                  _m.edittype = "checkbox";
                  _m.editoptions = itm.check;
                  _m.editable = true;
                  editabled = true;
                }
              }

              _colNames[pos] = itm.title;
              _colModel[pos] = _m;
            }
      }

    }
    catch (err) {
      osl.msg.alert(err);
    }

    // 헤더 정보
    this.headerInfo = { colNames:_colNames,
                  colModel:_colModel ,
                  editabled: editabled ,
                  headerColspan:headerColspan,
                  colKey : _colKey,
                  rowspan:_rowspan,
                  colspan:_colspan,
                  isSummary:isSummary};

    // 이벤트 발생
    $(this.t_id).trigger("tevtHeaderDraw",this.headerInfo);

    return this;

  },

  /**
  * 테이블 컴포넌트를 생성한다.
  * 
  * @private
  */
  z_createTable : function () {

    var current = this;
    var t_id = current.t_id;

    var currentoption =current._option;
    var headerdata = current.headerInfo;
    current.colKey = headerdata.colKey;

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 테이블 셋팅 시작
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    var grid = new Object();

    // 페이징 체크
    if (currentoption.page) {
    var _divPage = current.pure_id + "divPage";
    $(t_id).after($("<div>").attr("id", _divPage));
    grid.pager = _divPage;
    grid.onPaging = function(){current.z_onPaging(); };
    }
    grid.datatype = osl.c.TABLE.DEFAULT_DATATYPE;
    grid.colNames = headerdata.colNames;
    grid.colModel = headerdata.colModel;
    grid.height = currentoption.height;
    grid.width = "100%";
    grid.height = currentoption.height;

    if(currentoption.sortname) { grid.sortorder = currentoption.sortorder;  grid.sortname = currentoption.sortname;}
    if (currentoption.multiselect) grid.multiselect = currentoption.multiselect;

    // 수정가능여부체크
    if(headerdata.editabled) {
//      osl.msg.debug(t_id+" =>> "+ headerdata.editabled);
      grid.cellEdit= headerdata.editabled;
      grid.afterSaveCell= function(rowid,name,val,iRow,iCol) {
        current.z_datamanage( rowid , 'U');
      };
      grid.cellsubmit= 'clientArray';
    }

    // 선택한 로우 콜백처리
    if (current._option.onClick) {
      grid.onCellSelect = function(irow, iCol, cellcontent, e){
//      osl.msg.debug("onCellSelect  ==>  "+ irow+" , "+iCol+" , "+cellcontent);
        current.z_callback(irow, iCol, cellcontent, currentoption.onClick);
      }
    }

    // 테이블 생성
    $(t_id).jqGrid(grid);

    // 헤더그룹
    if ( headerdata.headerColspan != '') $(t_id).plugColSpan({cols:headerdata.headerColspan});

  },

  /**
  *
  * F: row를 click 할 때 실행할 함수를 지정한다.
  *
  * <pre>
  *   var table = osl.table("#plist47",{page:true});
  *
  *   table.setModel ([
  *     {title:'아이디',field:'id', width:100,align:"center",key:true,sorttype:"int"},
  *     {title:'제목',field:'title', width:120},
  *     {mergeInfo: [ { indexes: "0, 1", title: "The combined title" }]}
  *   ]) ;
  *
  *   table.onClick( fnClick );  <-- 함수명을 지정해 준다.
  *
  *   function fnClick( rowIdx, colIdx, cellData ) {
  *     // table의 click 이벤트 발생시 실행될 로직
  *   }
  *
  * </pre>
  * @param {Function} fn - 함수 ( 인자는 rowIndex, colIndex, cell의 data 를 넘겨받는다. )
  * @return {osl.table}
  */
  onClick : function (fn) {
    this._option.onClick = fn;
    return this;
  },

  /**
   * F: 사용자 정의 컴포넌트( checkbox , image, button ) 추가
   * 
   * @param {string} field - 컬럼 필드
   * @param {string} tag - 추가 될 컴포넌트
   * @private
   */
  z_setCustomComp : function ( field , tag ) {
    var comp = {}
    comp[field] = tag;
    this.customComp.push(comp);
  },

  /**
  * F: 사용자 정의 콜백함수를 call 한다.
  * 
  * @param {int} irow - 행 인덱스
  * @param {int} iCol - 열 인덱스
  * @param {String} cellcontent - 선택한 열 내용
  * @param {Function} optionfn - 사용자 콜백함수 ( this._option.onClick )
  * @private
  */
  z_callback:function( rowIdx, colIdx, cellData , optionfn ) {
    optionfn.call( this, rowIdx, colIdx, cellData );
  },

  /**
  * F: 데이타를 바인딩한다.
  * 
  * @private
  */
  z_bind : function () {

    var current = this;
    var t_id = current.t_id;
    var rowdata = current.data;
    var headerdata = current.headerInfo;

    if ( !rowdata ) return;

    // 첫번째 데이타는 네비게이션 정보.
    var navi_info = rowdata[0];

    // 데이타 mapping
    for( var itm, i=-1;  itm = rowdata[++i]; )  $(t_id).addRowData(i, itm);

    this.rowIndx = i;

    if ( rowdata.length > 0) {

      // 페이징 관련 데이타 셋팅
      current._option.navi = new Object();
      current._option.navi.page      = navi_info._duNaviPage;
      current._option.navi.page_cnt  = navi_info._duNaviPageCnt;
      current._option.navi.page_size = navi_info._duNaviPageSize;
      current._option.navi.row_cnt   = navi_info._duNaviRowCnt;
      current._option.navi.row_size  = navi_info._duNaviRowSize;
      current._option.navi.param     = navi_info._duNaviParam;
      current._option.navi.url       = navi_info._duNaviUrl;
      current._option.navi.res       = navi_info._duNaviRes;
      current.refresh();

    }

    // 테이블 초기구성시 조회결과 없음 문장 표시여부
    if ( i == 0  && current._option.initNoData ) {
      $(t_id).addRowData(0, osl.c.TABLE.NO_DATA);
      current.dataColspan(1);
      current.rowIndx = 0;
      current._option.rownumbers = false;
      $(t_id).setCell( 0, 0, osl.c.TABLE.NO_DATA );
      $(t_id).setGridParam({page:1 , lastpage:1}).trigger("updatepager");
    }

    // 데이타 로우스판
    if ( headerdata.rowspan ) {
      var indexs = eval("([" + headerdata.rowspan + "])");
      for ( var i = 0; i < indexs.length; i++) {
        current.dataRowspan(indexs[i]);
      }
    }

    //데이타 콜스판
    if ( headerdata.colspan ) {

      var indexs = eval("([" + headerdata.colspan + "])");

      for ( var i = 0; i < indexs.length; i++) {
        current.dataColspan(indexs[i]);
      }

    }

    // 커스텀 태그( 사용자 정의 컴포넌트 ) 추가
    if ( current.customComp ) {

      var ids = $(this.t_id).getDataIDs();
      for (var i = 0; i < ids.length; i++) {
       var cl = ids[i];
        for( var j = 0; j < current.customComp.length;j++ ) {
          var target = current.customComp[j];
          $(this.t_id).setRowData( cl ,target );
        }
      }
    }

  },

  /**
  *
  * F: 테이블에 데이터를 바인딩.
  *
  * <pre>
  *   var table = ....
  *         :
  *         :
  *        ((생략..))
  *
  *   osl.req.send( "xxxx.kajx", function(data,err){
  *     table.bind( data.result );
  *   });
  * </pre>
  * @param {Object} rowdata - 바인딩 대상 데이터
  * @return {osl.table}
  */
  bind : function ( rowdata ){
    $(this.t_id).clearGridData();
    this.data = rowdata;
    $(this.t_id).trigger( "tevtDataloading", rowdata);
    return this;
  },

  /**
  * F: 선택한 행의 인덱스 반환.
  * 
  * @return {Number} 행의 Index
  */
  getSelectedRowId : function (){
    return $(this.t_id).getGridParam('selrow');
  },

  /**
  *  F: 페이징 처리 및 전송.
  *  
  *  @private
  */
  z_onPaging : function (){

    var current = this;
    var t_id = current.t_id;
    var navi  = current._option.navi;
    var requestedPage =$(t_id).getGridParam(osl.c.TABLE.PAGE);
    osl.req.addParam(osl.c.TABLE.NAVI_PAGE      ,requestedPage);
    osl.req.addParam(osl.c.TABLE.NAVI_PAGE_CNT  ,navi.page_cnt);
    osl.req.addParam(osl.c.TABLE.NAVI_PAGE_SIZE ,navi.page_size);
    osl.req.addParam(osl.c.TABLE.NAVI_ROW_CNT   ,navi.row_cnt);
    osl.req.addParam(osl.c.TABLE.NAVI_ROW_SIZE  ,navi.row_size);
    osl.req.addParam(osl.c.TABLE.NAVI_RES       ,navi.res);

    var targetPage = requestedPage-1;
    if ( targetPage < 0 ) targetPage = 1;
    if ( targetPage > navi.page_cnt ) targetPage = navi.page_cnt;
    var startPage = navi.page_size * targetPage + 1;

    osl.req.addParam(osl.c.TABLE.NAVI_TARGET_ROW  , startPage);
    osl.req.addParam(osl.c.TABLE.NAVI_ROW         , startPage);

    var data = osl.req.send( navi.url , {sync:true});
    $(t_id).clearGridData();

    for(var key in data){
      this.data = data[key];
      break;
    }

    current.z_bind();
  },


  /**
  * F: 행 추가
  * 
  * @param {Object}  data - 추가 데이타
  * @param {Number}  index - 위치
  * @param {Boolean} before - 지정 위치 이전에 추가할지 여부 (기본값 : false)
  * @return {osl.table}
  */
  addRow : function( data, index, before ) {

    if ( this.rowIndx == 0 )  $(this.t_id).clearGridData();

    var targetpos = "last";
    var rowidx =  Number(++this.rowIndx);
    var targetidx =  index;

    if ( before ){

    if ( !targetidx ) return;
     targetpos = "before";
     targetidx = index;
    } else {
      targetidx = rowidx;
    }

    $(this.t_id).addRowData( rowidx, data,targetpos, targetidx );
    this.z_datamanage( rowidx , 'I');

    return this;

  },

  /**
  * F: 행 선택
  * 
  * @param {Number} index - 선택할 행의 인덱스
  * @return {osl.table}
  */
  setRowSelect : function (index) {

    $(this.t_id).resetSelection();
    $(this.t_id).setSelection(index);

    return this;

  },

  /**
  * F: 행 삭제
  * 
  * @param {Number} index - 삭제할 행의 인덱스
  * @return {osl.table}
  */
  delRow : function( index ) {

    var selected = -1;

    if ( index ){
      selected = this.z_getGridRowID(index);
    } else {
    // index 값이 존재하지 않으면 현재 선택한 행 삭제
      selected = this.getSelectedRowId();
    }
//    osl.msg.debug("delRow  index => "+selected +","+$(this.t_id).getGridParam("selrow") +","+this.t_id);

    // 삭제 및 데이타 관리
    if( selected ) {
      this.z_datamanage(selected , 'D');
      $(this.t_id).delRowData(selected);
    }

    return this;

  },


  /**
  * F: 특정 행의 데이터 수정
  * <pre>
  *   var vdata = {};
  *   vdata.message = $("input[name=message]").val();
  *   vdata.issueMemo = $("input[name=issueMemo]").val();
  *
  *   table.setRow({data:vdata, index:"3", css:{color:'red'}});
  * </pre>
  * 
  * @param {Object} data - (필수) 변경 데이타
  * @param {Number} index - (필수) 변경 index
  * @param {String} css - 변경 style
  * @return {osl.table}
  */
  setRow : function( data , index , css ) {

    /** index 값이 존재 할 경우 시행*/
    if ( index ){
      var idx = this.z_getGridRowID(index);
      if ( idx ){
//        osl.msg.debug("setRow =>> "+ idx);
        $(this.t_id).setRowData( idx , data, css );
        this.z_datamanage( idx , 'U');
      }
    }
    return this;

  },

  /**
  * F: 데이타 관리
  * 
  * @param {int} id - 삽입, 수정 : tr id  , 삭제 : (0 ~  )index
  * @param {string} target - [I,U,D]
  * @private
  */
  z_datamanage : function ( id , target ) {

    var _savedData = this.save;
    var ispush = true;
    var currObj = $(this.t_id).getRowData(id);

    for( var key=0 ; key < _savedData.length ; key++ ){

      var tmp =  _savedData[key] ;
      if ( id  == tmp.idx  ){
        _savedData.pop(key);
        if ( target ==  tmp.flag ) ispush = false;
        break;
      }
    }
//osl.msg.debug("z_datamanage  => "+id+","+target+","+ispush);

    if (ispush) _savedData.push({idx:id , flag:target , data:currObj});

  },

  /**
  *
  * F: 특정 행에서 데이터 추출.
  * <pre>
  *  table.getData(); -> 현재 선택된 행 데이터 추출
  *  table.getData(1); -> "<tr id="1">" 행 데이타 추출
  * </pre>
  * 
  * @param {int} index - 테이블의 키 값 (default : 현재 선택된 id값)
  * @return {Object} 특정행의 데이타
  *
  */
  getData : function( index ) {

    var current = this;
    var idx = -1;

    if ( index ) {
      idx = current.z_getGridRowID(index);
    } else {
      idx = current.getSelectedRowId();
    }

    if ( idx ) return $(this.t_id).getRowData(idx);

  },

  /**
  * F: 특정 셀의 값을 가져오거나 바꿈.
  * <pre>
  *   table.cell( 1, 0 ); -> 1번째 row의 0번째 컬럼에 저장된 값을 추출
  *   table.cell( 1, 'fieldName; ) -> 1번째 row의 'fieldName' 이름으로 저장된 값을 추출
  *   table.cell( 1, 1, 'merong' ) -> 1번째 row의 1번째 컬럼에 저장된 값을 'merong' 으로 변경
  * </pre>
  * 
  * @param {Number} rowIndex
  * @param {Number|String} colIndex
  * @param {String} data
  * @return {String} 셀의 값
  */
  cell : function( rowIndex, colIndex, data ) {

    var rowIdx = this.z_getGridRowID(rowIndex);

    if ( rowIdx ){
      if( typeof colIndex == "string" ) {
        return $(this.t_id).getCell( rowIdx, colIndex );
      } else if( typeof colIndex == "number" ) {

        if( this._option.multiselect) colIndex++;
        if( this._option.rownumbers) colIndex++;

        if ( data ) {
          $(this.t_id).setCell( rowIdx, colIndex, data );
          this.z_datamanage( rowIndex , 'U');
        } else {
          return $(this.t_id).getCell( rowIdx, colIndex );
        }
      }
    }
  },

  /**
  * F: 테이블를 삭제한다.
  * 
  * @return {osl.table}
  */
  clear : function() {

    var t_id = this.t_id;
    this._option = {}
    this.rowIndx = 0;
    this.data = {};
    this.headerInfo = {}
    $(t_id).clearGridData();
    $(t_id).unbind("tevtDataloading");
    $(t_id).unbind("tevtHeaderDraw");

    $("#gbox_"+osl.c.TABLE.PREFIX+this.pure_id).remove();

    return this;
  },
  
  /**
  * F: 테이블의 모든 데이터를 삭제한다.
  * 
  * @return {osl.table}
  */
  clearData : function() {

    var t_id = this.t_id;
    $(t_id).clearGridData();

    return this;
  },

  /**
  * F: 페이징 모드일 경우 데이터를 갱신(refresh) 한다.
  * 
  * @return {osl.table}
  */
  refresh : function() {

  var currentTarget = this._option;
  if( currentTarget.page == true ) {
    $(this.t_id).trigger("reloadGrid");
    $(this.t_id).setGridParam({ datatype:osl.c.TABLE.PAGING_DATATYPE, page:currentTarget.navi.page , lastpage:currentTarget.navi.page_cnt}).trigger("updatepager");
   }
    return this;

  },

  /**
  * F: 테이블의 row 개수를 추출
  * 
  * @return {Number} 행 갯수
  */
  getRowCnt : function() {
    return this._option.navi.row_cnt;
  },

  /**
  * F: 테이블의 column 개수를 추출
  * 
  * @return {Number} 컬럼 갯수
  */
  getColCnt : function() {
    return $(this.t_id).getGridParam("colNames").length;
  },


  /**
  * F: 테이블의 컬럼모델을 구성하고 있는 field key 정보를 추출
  * 
  * @return {Array} field key
  */
  getFieldKey : function() {
    return this.colKey;
  },

  /**
  * F: 현재 테이블의 너비를 추출하거나, 세팅
  * 
  * @param {Number} width
  * @return {Number} 테이블의 너비
  */
  width : function( width ) {

    var t_id = this.t_id;

    if( width ){
      $(t_id).setGridWidth(width);
    } else {
      return $(t_id).getGridParam("width");
    }
  },

  /**
  * F: 현재 테이블의 높이를 추출하거나, 세팅
  * 
  * @param {Number} height
  * @return {Number} 테이블의 높이
  */
  height : function( height ) {
    var t_id = this.t_id;

    if( height ) {
     $(t_id).setGridHeight(height);
    } else {
      return $(t_id).getGridParam("height");
    }
  },

  /**
  * F: 특정 컬럼의 너비를 반환하거나, 세팅
  * 
  * @param {Number} index
  * @param {Number} width
  * @return {Number} 특정 컬럼의 너비
  */
  colWidth : function( index, width ) {

    var nIdx = Number(index) ;

    if( nIdx < 0 ) return;

    if( width ) {
      var vals =  Number(width) + "px";
      $("#gview_"+osl.c.TABLE.PREFIX+this.pure_id+" th:eq("+nIdx+")").css({ width:vals });
      $("table"+this.t_id+" tbody tr.jqgfirstrow td:eq("+nIdx+")").css({ width:vals });
    } else {
      return $("table"+this.t_id+" tbody tr.jqgfirstrow td:eq("+nIdx+")").css("width");
    }

  },

  /**
  * F: 특정 행의 높이를 반환하거나, 세팅
  * 
  * @param {Number} index
  * @param {Number} height
  * @return {Number} 특정 행의 높이
  */
  rowHeight : function( index, height ) {

    var nIdx = Number(index) ;

    if( nIdx < 0 ) return;

    if( height ) {
      this.z_getRow(nIdx).attr("height", height);
    } else {
      return this.z_getRow(nIdx).attr("height");
    }

  },
  /**
   * F: 행을 반환한다.
   * 
   * @param {Number} id 행 인덱스
   * @private
   */
  z_getRow : function ( id ) {
    return $( "table"+this.t_id+" tr#"+id )
  },

  /**
   * F: 행 인덱스 값을 아이디로 반환한다.
   * 
   * @param {Number} index 행 인덱스
   * @private
   */
  z_getGridRowID : function ( index ){
    var nIdx = Number(index) ;
    if( nIdx < 1 ) return;
    return $("table"+this.t_id+" tr:eq("+nIdx+")").attr("id");

  },

  /**
  * F: 행 아이디 값을 인덱스로 반환한다.
  * 
  * @param {Number} id 행 아이디 값
  */
  getRowIndex : function ( id ){
    return this.z_getRow(id).index();
  },

  /**
  * F: 특정 컬럼을 숨기거나 보여준다.
  * 
  * @param {Number} index
  * @param {Boolean} showYn
  * @return {osl.table}
  */
  hideCol : function( field, showYn ) {

    var t_id = this.t_id;
    if (showYn)
      $(t_id).showCol(field);
    else
      $(t_id).hideCol(field);

    return this;
  },

  /**
  * F: 특정 행을 숨기거나 보여준다.
  * @param {Number} idnex - 인덱스
  * @param {Boolean}showYn
  * @return {osl.table}
  */
  hideRow : function( index , showYn ) {

    var nIdx = this.z_getGridRowID(index);
    var _css = "";

    if( nIdx < 0 ) return;
    if( !showYn ) _css = "none";

    this.z_getRow(nIdx).css("display",_css );

    return this;

  },

  /**
  * F: 페이지 테이블일 경우, 페이지 데이터를 처리하기 위한 파라미터 정보를 반환한다.
  * 
  * @return {Object} {@link osl.config.js [osl.c.TABLE 변수]}
  * <pre>
  *    _duNaviPage     : 현재 페이지
  *    _duNaviPageCnt  : 페이지 건수
  *    _duNaviPageSize : 페이지 크기
  *    _duNaviRow      : 현재 열
  *    _duNaviRowCnt   : 전체 건수
  *    _duNaviRowSize  : 열 크기
  *    _duNaviParam    : 페이징 처리시 파라미터 정보
  *    _duNaviUrl      : 요청 URL
  *    _duNaviRes      : 결과 반환 변수
  * </pre>
  */
  getPageParam : function() {
    return this._option.navi.param;
  },

  /**
  * F: 테이블에 적재된 전체 데이타를 추출한다.
  * 
  * @return {Array} 전체 데이터
  */
  getAllData : function(){
    var c = this;
    var t_id = this.t_id;
    var alldata =  new Array();

    $(t_id + " tbody tr ").each(function(){

      var rowid = this.id;
      if (rowid) {
        var chArr = c.getChangedData();
        var rowdata = $(t_id).getRowData(rowid);
        for (var i in chArr) {
          var citem = chArr[i];
          if (rowid == citem.id)
            rowdata.flag = citem.flag;
        }
        alldata.push(rowdata);
      }
    });

    return alldata;
  },

  /**
  * F: 테이블에 적재된 데이터 중 변경된 데이타를 추출한다.
  * 
  * @return {Array} 변경된 데이터
  */
  getChangedData : function(){

    var _saveData = this.save;
    var _basicData = this.data;
    var _model = this.headerInfo.colModel;
    var changedata =  new Array();

    // 변경된 데이타 값 셋팅
    for( var i in _saveData ){
      var item = _saveData[i];
      var _data= item.data;

      // 값 셋팅
      if(_data){
        _data["flag"] = item.flag;
        changedata.push(_data);
      }
    }

    return changedata;

  },

  /**
  * F: 선택된 행의 데이터를 추출한다.
  * 
  * @return {Array} 선택된 행의 데이터
  */
  getCheckSelected : function () {
    var selectedArr = new Array();
    var selarrrow = $("input[id $= jqg_"+this.t_id+"]:checked") ;
    for ( var i = 0, cnt = selarrrow.length; i <cnt; i++) {
      selectedArr.push( $(this.t_id).getRowData( $(selarrrow[i]).parent().parent().attr("id") ) );
    }
    return selectedArr;
  },

  /**
  * F: 열 기준으로 데이타위주로 rowspan
  * <pre>
  *  table.setModel([
  *    ((생략..))
  *    {rowspan: '2'} -> 2번째 컬럼 기준으로 행 데이타 같을 경우 rowspan
  *  ]);
  * </pre>
  * 
  * @param {Object} colIdx
  */
  dataRowspan : function (colIdx) {

    var t_id = this.t_id;
    return $(t_id).each( function() {
        var that = null;

        $('tbody tr',this).each( function(row) {

          $('td:eq(' + colIdx + ')', this).filter(':visible').each( function(col) {

          // 인덱스 값을 계산하기 위해 체크 한다.
          // 한번 로우스판 했을 경우 datarowspan 속성이 추가된다.
          if( ! $(this).attr("datarowspan") ) {

            // 값이 동일한지 비교한다.
            if (that != null && $(this).html() == $(that).html()) {

              rowspan = $(that).attr("rowspan");

              if (rowspan == undefined) {

                $(that).attr("rowspan",1);
                rowspan = $(that).attr("rowspan");

              }

              rowspan = Number(rowspan) + 1;

              $(that).attr("rowspan",rowspan);
              $(that).attr("datarowspan",colIdx);


              $(this).remove(); // .hide();

            } else {

              that = this;

            }

          }

        });
      });
    });
  },

  /**
  * F: 행 기준으로 데이타위주로 colspan
  * <pre>
  *  table.setModel([
  *    ((생략..))
  *    {colspan: '13'} -> 13번째 행 기준으로 데이타가 같을 경우 colspan
  *  ]);
  * </pre>
  * 
  * @param {Object} rowIndex
  */
  dataColspan : function (rowIndex) {

    var t_id = this.t_id;

    return $(t_id).each( function() {

      var that = null;

      $('tbody tr:eq(' + rowIndex + ')',this).filter(':visible').each( function(row) {

        $('td', this).each( function(col) {

        // 인덱스 값을 계산하기 위해 체크 한다.
        // 한번 로우스판 했을 경우 datarowspan 속성이 추가된다.
        if( ! $(this).attr("datacolspan") ) {

          // 값이 동일한지 비교한다.
          if (that != null && $(this).html() == $(that).html()) {

            colspan = $(that).attr("colspan");

            if (colspan == undefined) {

              $(that).attr("colspan",1);

              colspan = $(that).attr("colspan");

            }

            colspan = Number(colspan) + 1;

            $(that).attr("colspan",colspan);
            $(that).attr("datacolspan",rowIndex);


            $(this).remove(); // .hide();

          } else {

            that = this;

          }

        }

        });
      });
    });

  }

};
// osl.table.js end ////////////////////////////////////////////////////
