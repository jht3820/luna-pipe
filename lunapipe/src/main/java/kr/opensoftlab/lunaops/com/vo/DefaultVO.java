package kr.opensoftlab.lunaops.com.vo;


public abstract class DefaultVO{

    private String regDtm;
    private String regUsrId;
    private String regUsrIp;
    private String modifyDtm;
    private String modifyUsrId;
    private String modifyUsrIp;
    
	public String getRegDtm() {
		return regDtm;
	}
	public void setRegDtm(String regDtm) {
		this.regDtm = regDtm;
	}
	public String getRegUsrId() {
		return regUsrId;
	}
	public void setRegUsrId(String regUsrId) {
		this.regUsrId = regUsrId;
	}
	public String getRegUsrIp() {
		return regUsrIp;
	}
	public void setRegUsrIp(String regUsrIp) {
		this.regUsrIp = regUsrIp;
	}
	public String getModifyDtm() {
		return modifyDtm;
	}
	public void setModifyDtm(String modifyDtm) {
		this.modifyDtm = modifyDtm;
	}
	public String getModifyUsrId() {
		return modifyUsrId;
	}
	public void setModifyUsrId(String modifyUsrId) {
		this.modifyUsrId = modifyUsrId;
	}
	public String getModifyUsrIp() {
		return modifyUsrIp;
	}
	public void setModifyUsrIp(String modifyUsrIp) {
		this.modifyUsrIp = modifyUsrIp;
	}

}
