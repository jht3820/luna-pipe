package kr.opensoftlab.lunaops.rep.rep1000.rep1000.vo;



import kr.opensoftlab.lunaops.com.vo.PageVO;

public class Rep1000VO extends PageVO {

	
	private String srchEvent;  
	private String srchReqNm;
	private String srchReqChargerNm;

	
	private String rn;
	private String loginUsrId ="";

	private String repId;               
	private String repNm;              
	private String repTypeCd;	
	private String repTypeNm;
	private String repTxt;              
	private String svnRepUrl;               
	private String gitRepUrl;               
	private String useCd;               
	private String useNm;              
	private String prjNm;
	private String gitUsrAuthTypeCd;
	

	
	public String getGitUsrAuthTypeCd() {
		return gitUsrAuthTypeCd;
	}
	public void setGitUsrAuthTypeCd(String gitUsrAuthTypeCd) {
		this.gitUsrAuthTypeCd = gitUsrAuthTypeCd;
	}
	public String getPrjNm() {
		return prjNm;
	}
	public void setPrjNm(String prjNm) {
		this.prjNm = prjNm;
	}
	public String getRepId() {
		return repId;
	}
	public void setRepId(String repId) {
		this.repId = repId;
	}
	public String getRepNm() {
		return repNm;
	}
	public void setRepNm(String repNm) {
		this.repNm = repNm;
	}
	public String getRepTypeCd() {
		return repTypeCd;
	}
	public void setRepTypeCd(String repTypeCd) {
		this.repTypeCd = repTypeCd;
	}
	public String getRepTypeNm() {
		return repTypeNm;
	}
	public void setRepTypeNm(String repTypeNm) {
		this.repTypeNm = repTypeNm;
	}
	public String getRepTxt() {
		return repTxt;
	}
	public void setRepTxt(String repTxt) {
		this.repTxt = repTxt;
	}
	public String getGitRepUrl() {
		return gitRepUrl;
	}
	public void setGitRepUrl(String gitRepUrl) {
		this.gitRepUrl = gitRepUrl;
	}
	public String getSvnRepUrl() {
		return svnRepUrl;
	}
	public void setSvnRepUrl(String svnRepUrl) {
		this.svnRepUrl = svnRepUrl;
	}
	public String getUseCd() {
		return useCd;
	}
	public void setUseCd(String useCd) {
		this.useCd = useCd;
	}
	public String getUseNm() {
		return useNm;
	}
	public void setUseNm(String useNm) {
		this.useNm = useNm;
	}
	public String getLoginUsrId() {
		return loginUsrId;
	}
	public void setLoginUsrId(String loginUsrId) {
		this.loginUsrId = loginUsrId;
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

}
