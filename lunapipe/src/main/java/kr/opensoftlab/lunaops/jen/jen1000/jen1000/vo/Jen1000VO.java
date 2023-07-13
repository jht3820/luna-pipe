package kr.opensoftlab.lunaops.jen.jen1000.jen1000.vo;

import kr.opensoftlab.lunaops.com.vo.PageVO;




public class Jen1000VO extends PageVO {
	
	
	private String srchEvent;  
	private String srchReqNm;
	private String srchReqChargerNm;
	
	
	private String rn;
	private String loginUsrId;
	
	private String	  ciId;	
	private String    jenId;               
    private String    jenNm;              
    private String    jenUsrId;               
    private String    jenUsrTok;              
    private String    jenUrl; 				
    private String    jenDesc;              
    
    private String    useCd;               
    private String    useNm; 
    private String    delCd; 
	
    
    
	public String getCiId() {
		return ciId;
	}
	public void setCiId(String ciId) {
		this.ciId = ciId;
	}
	public String getUseNm() {
		return useNm;
	}
	public void setUseNm(String useNm) {
		this.useNm = useNm;
	}
	public String getJenUrl() {
		return jenUrl;
	}
	public void setJenUrl(String jenUrl) {
		this.jenUrl = jenUrl;
	}
	public String getLoginUsrId() {
		return loginUsrId;
	}
	public void setLoginUsrId(String loginUsrId) {
		this.loginUsrId = loginUsrId;
	}
	
	public String getJenId() {
		return jenId;
	}
	public void setJenId(String jenId) {
		this.jenId = jenId;
	}
	public String getJenNm() {
		return jenNm;
	}
	public void setJenNm(String jenNm) {
		this.jenNm = jenNm;
	}

	public String getJenDesc() {
		return jenDesc;
	}
	public void setJenDesc(String jenDesc) {
		this.jenDesc = jenDesc;
	}
	public String getJenUsrId() {
		return jenUsrId;
	}
	public void setJenUsrId(String jenUsrId) {
		this.jenUsrId = jenUsrId;
	}
	public String getJenUsrTok() {
		return jenUsrTok;
	}
	public void setJenUsrTok(String jenUsrTok) {
		this.jenUsrTok = jenUsrTok;
	}
	public String getUseCd() {
		return useCd;
	}
	public void setUseCd(String useCd) {
		this.useCd = useCd;
	}
	public String getSrchEvent() {
		return srchEvent;
	}
	public void setSrchEvent(String srchEvent) {
		this.srchEvent = srchEvent;
	}
	public String getSrchReqNm() {
		return srchReqNm;
	}
	public void setSrchReqNm(String srchReqNm) {
		this.srchReqNm = srchReqNm;
	}
	public String getSrchReqChargerNm() {
		return srchReqChargerNm;
	}
	public void setSrchReqChargerNm(String srchReqChargerNm) {
		this.srchReqChargerNm = srchReqChargerNm;
	}
	public String getRn() {
		return rn;
	}
	public void setRn(String rn) {
		this.rn = rn;
	}
	public String getDelCd() {
		return delCd;
	}
	public void setDelCd(String delCd) {
		this.delCd = delCd;
	}
	
}
