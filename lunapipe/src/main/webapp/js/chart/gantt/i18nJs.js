
/*
 * i18n.js는 일반적인 언더.국가별 데이터를 관리하는데 사용된다.
 * 여기에서는 월 이름, 요일 이름, 통화 형식, 날짜 형식 및 일부 기본 메시지 문자열의 값을
 * 변경할 수 있다.
 */

function dateToRelative(localTime){
  var diff=new Date().getTime()-localTime;
  var ret="";

  var min=60000;
  var hour=3600000;
  var day=86400000;
  var wee=604800000;
  var mon=2629800000;
  var yea=31557600000;

  if (diff<-yea*2)
    ret ="in ## years".replace("##",(-diff/yea).toFixed(0));

  else if (diff<-mon*9)
    ret ="in ## months".replace("##",(-diff/mon).toFixed(0));

  else if (diff<-wee*5)
    ret ="in ## weeks".replace("##",(-diff/wee).toFixed(0));

  else if (diff<-day*2)
    ret ="in ## days".replace("##",(-diff/day).toFixed(0));

  else if (diff<-hour)
    ret ="in ## hours".replace("##",(-diff/hour).toFixed(0));

  else if (diff<-min*35)
    ret ="in about one hour";

  else if (diff<-min*25)
    ret ="in about half hour";

  else if (diff<-min*10)
    ret ="in some minutes";

  else if (diff<-min*2)
    ret ="in few minutes";

  else if (diff<=min)
    ret ="just now";

  else if (diff<=min*5)
    ret ="few minutes ago";

  else if (diff<=min*15)
    ret ="some minutes ago";

  else if (diff<=min*35)
    ret ="about half hour ago";

  else if (diff<=min*75)
    ret ="about an hour ago";

  else if (diff<=hour*5)
    ret ="few hours ago";

  else if (diff<=hour*24)
    ret ="## hours ago".replace("##",(diff/hour).toFixed(0));

  else if (diff<=day*7)
    ret ="## days ago".replace("##",(diff/day).toFixed(0));

  else if (diff<=wee*5)
    ret ="## weeks ago".replace("##",(diff/wee).toFixed(0));

  else if (diff<=mon*12)
    ret ="## months ago".replace("##",(diff/mon).toFixed(0));

  else
    ret ="## years ago".replace("##",(diff/yea).toFixed(0));

  return ret;
}

//override date format i18n
/* 원본소스 주석
Date.monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
//Month abbreviations. Change this for local month names
Date.monthAbbreviations = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
// Full day names. Change this for local month names
Date.dayNames =["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// Day abbreviations. Change this for local month names
Date.dayAbbreviations = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
// Used for parsing ambiguous dates like 1/2/2000 - default to preferring 'American' format meaning Jan 2.
// Set to false to prefer 'European' format meaning Feb 1
*/

Date.monthNames = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
Date.monthAbbreviations = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
Date.dayNames =["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
Date.dayAbbreviations = ["일","월","화","수","목","금","토"];

Date.preferAmericanFormat = false;

Date.firstDayOfWeek =0;
//Date.defaultFormat = "M/d/yyyy"; // 기본 날짜 포맷
// 기본 날짜 포맷
Date.defaultFormat = "yyyy-MM-dd";
Date.masks = {
  //fullDate:       "EEEE, MMMM d, yyyy",
  //shortTime:      "h:mm a"
	fullDate:      "yyyy-MM-dd",
	shortTime:      "HH:mm:ss"		
};
Date.today="Today";

Number.decimalSeparator = ".";
Number.groupingSeparator = ",";
Number.minusSign = "-";
Number.currencyFormat = "###,##0.00";



var millisInWorkingDay =28800000;
var workingDaysPerWeek =5;

/*
 * custom - 입력받은 날짜가 주말인지 체크한다.
 * 현재 요구사항 작업 일시 지정시 주말도 지정가능하므로  false(주말아님)로 리턴한다.
 * @param date 날짜
 * @return boolean 주말여부 true/false
 */
function isHoliday(date) {
  var friIsHoly =false;
  var satIsHoly =true;
  var sunIsHoly =true;

  var pad = function (val) {
    val = "0" + val;
    return val.substr(val.length - 2);
  };

  var holidays = "##";

  var ymd = "#" + date.getFullYear() + "_" + pad(date.getMonth() + 1) + "_" + pad(date.getDate()) + "#";
  var md = "#" + pad(date.getMonth() + 1) + "_" + pad(date.getDate()) + "#";
  var day = date.getDay();

  return false;
  //return  (day == 5 && friIsHoly) || (day == 6 && satIsHoly) || (day == 0 && sunIsHoly) || holidays.indexOf(ymd) > -1 || holidays.indexOf(md) > -1;
}

/*
 * custom - 왼쪽 간트차트의 상단의 날짜가 주말인지 체크한다.
 * @param date 날짜
 * @return boolean 주말여부 true/false
 */
function isHolidayCss(date) {
	  var friIsHoly =false;
	  var satIsHoly =true;
	  var sunIsHoly =true;

	  var pad = function (val) {
	    val = "0" + val;
	    return val.substr(val.length - 2);
	  };

	  var holidays = "##";

	  var ymd = "#" + date.getFullYear() + "_" + pad(date.getMonth() + 1) + "_" + pad(date.getDate()) + "#";
	  var md = "#" + pad(date.getMonth() + 1) + "_" + pad(date.getDate()) + "#";
	  var day = date.getDay();

	  return  (day == 5 && friIsHoly) || (day == 6 && satIsHoly) || (day == 0 && sunIsHoly) || holidays.indexOf(ymd) > -1 || holidays.indexOf(md) > -1;
}

// default message
var i18n = {
  YES:                 "Yes",
  NO:                  "No",
  FLD_CONFIRM_DELETE:  "confirm the deletion?",
  INVALID_DATA:        "The data inserted are invalid for the field format.",
  ERROR_ON_FIELD:      "Error on field",
  OUT_OF_BOUDARIES:      "Out of field admitted values:",
  CLOSE_ALL_CONTAINERS:"close all?",
  DO_YOU_CONFIRM:      "Do you confirm?",
  ERR_FIELD_MAX_SIZE_EXCEEDED:      "Field max size exceeded",
  WEEK_SHORT:      "W.",

  FILE_TYPE_NOT_ALLOWED:"File type not allowed.",
  FILE_UPLOAD_COMPLETED:"File upload completed.",
  UPLOAD_MAX_SIZE_EXCEEDED:"Max file size exceeded",
  ERROR_UPLOADING:"Error uploading",
  UPLOAD_ABORTED:"Upload aborted",
  DROP_HERE:"Drop files here",

  FORM_IS_CHANGED:     "You have some unsaved data on the page!",

  PIN_THIS_MENU: "PIN_THIS_MENU",
  UNPIN_THIS_MENU: "UNPIN_THIS_MENU",
  OPEN_THIS_MENU: "OPEN_THIS_MENU",
  CLOSE_THIS_MENU: "CLOSE_THIS_MENU",
  PROCEED: "Proceed?",

  PREV: "Previous",
  NEXT: "Next",
  HINT_SKIP: "Got it, close this hint.",

  WANT_TO_SAVE_FILTER: "save this filter",
  NEW_FILTER_NAME: "name of the new filter",
  SAVE: "Save",
  DELETE: "Delete",
  HINT_SKIP: "Got it, close this hint.",

  COMBO_NO_VALUES: "no values available...?",

  FILTER_UPDATED:"Filter updated.",
  FILTER_SAVED:"Filter correctly saved."

};


