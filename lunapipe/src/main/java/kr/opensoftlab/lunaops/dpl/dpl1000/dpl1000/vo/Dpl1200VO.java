package kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.vo;

import kr.opensoftlab.lunaops.com.vo.PageVO;
import kr.opensoftlab.lunaops.dpl.dpl1000.dpl1000.service.Dpl1000Service;
import kr.opensoftlab.sdf.jenkins.JenkinsClient;
import kr.opensoftlab.sdf.jenkins.service.BuildService;

public class Dpl1200VO extends PageVO{
	private String rn;
	
	
	private String dplTargetType = "main";
	
	
	private String dplId;
	private String jenId;
	private String jobId;
	private int bldSeq;
	private int bldNum;
	private int bldMainNum;
	private String bldResult;
	private String bldDurationTm;
	private String bldStartDtm;
	private String bldConsoleLog;
	private String userId;
	private String tokenId;
	private String jobRestoreId;
	private String jobToken;
	private String deTokenId;
	private String deJobToken;
	private long estimatedDuration;
	private String jenUrl;
	private String dplTypeCd;
	private String dplAutoAfterCd;
	private String dplRestoreCd;
	
	
	private int buildActionCnt = 1; 
			
	private JenkinsClient client;
	private Dpl1000Service dpl1000Service;
	private BuildService buildService;
	
	public String getDplTargetType() {
		return dplTargetType;
	}


	public void setDplTargetType(String dplTargetType) {
		this.dplTargetType = dplTargetType;
	}


	public String getRn() {
		return rn;
	}


	public void setRn(String rn) {
		this.rn = rn;
	}

	public String getDplId() {
		return dplId;
	}


	public void setDplId(String dplId) {
		this.dplId = dplId;
	}


	public String getJenId() {
		return jenId;
	}


	public void setJenId(String jenId) {
		this.jenId = jenId;
	}


	public String getJobId() {
		return jobId;
	}


	public void setJobId(String jobId) {
		this.jobId = jobId;
	}

	public int getBldSeq() {
		return bldSeq;
	}


	public void setBldSeq(int bldSeq) {
		this.bldSeq = bldSeq;
	}


	public int getBldNum() {
		return bldNum;
	}


	public void setBldNum(int bldNum) {
		this.bldNum = bldNum;
	}


	public String getBldResult() {
		return bldResult;
	}


	public void setBldResult(String bldResult) {
		this.bldResult = bldResult;
	}

	public String getBldDurationTm() {
		return bldDurationTm;
	}


	public void setBldDurationTm(String bldDurationTm) {
		this.bldDurationTm = bldDurationTm;
	}


	public String getBldStartDtm() {
		return bldStartDtm;
	}


	public void setBldStartDtm(String bldStartDtm) {
		this.bldStartDtm = bldStartDtm;
	}


	public int getBldMainNum() {
		return bldMainNum;
	}


	public void setBldMainNum(int bldMainNum) {
		this.bldMainNum = bldMainNum;
	}


	public String getBldConsoleLog() {
		return bldConsoleLog;
	}


	public void setBldConsoleLog(String bldConsoleLog) {
		this.bldConsoleLog = bldConsoleLog;
	}


	public String getUserId() {
		return userId;
	}


	public void setUserId(String userId) {
		this.userId = userId;
	}


	public String getTokenId() {
		return tokenId;
	}


	public void setTokenId(String tokenId) {
		this.tokenId = tokenId;
	}


	public String getJobRestoreId() {
		return jobRestoreId;
	}


	public void setJobRestoreId(String jobRestoreId) {
		this.jobRestoreId = jobRestoreId;
	}


	public String getJobToken() {
		return jobToken;
	}


	public void setJobToken(String jobToken) {
		this.jobToken = jobToken;
	}


	public String getDeTokenId() {
		return deTokenId;
	}


	public void setDeTokenId(String deTokenId) {
		this.deTokenId = deTokenId;
	}


	public String getDeJobToken() {
		return deJobToken;
	}


	public void setDeJobToken(String deJobToken) {
		this.deJobToken = deJobToken;
	}


	public long getEstimatedDuration() {
		return estimatedDuration;
	}


	public void setEstimatedDuration(long estimatedDuration) {
		this.estimatedDuration = estimatedDuration;
	}


	public String getJenUrl() {
		return jenUrl;
	}


	public void setJenUrl(String jenUrl) {
		this.jenUrl = jenUrl;
	}


	public JenkinsClient getClient() {
		return client;
	}


	public void setClient(JenkinsClient client) {
		this.client = client;
	}


	public int getBuildActionCnt() {
		return buildActionCnt;
	}


	public void setBuildActionCnt(int buildActionCnt) {
		this.buildActionCnt = buildActionCnt;
	}


	public Dpl1000Service getDpl1000Service() {
		return dpl1000Service;
	}


	public void setDpl1000Service(Dpl1000Service dpl1000Service) {
		this.dpl1000Service = dpl1000Service;
	}

	public String getDplTypeCd() {
		return dplTypeCd;
	}


	public void setDplTypeCd(String dplTypeCd) {
		this.dplTypeCd = dplTypeCd;
	}


	public String getDplAutoAfterCd() {
		return dplAutoAfterCd;
	}


	public void setDplAutoAfterCd(String dplAutoAfterCd) {
		this.dplAutoAfterCd = dplAutoAfterCd;
	}


	public String getDplRestoreCd() {
		return dplRestoreCd;
	}


	public void setDplRestoreCd(String dplRestoreCd) {
		this.dplRestoreCd = dplRestoreCd;
	}


	public BuildService getBuildService() {
		return buildService;
	}


	public void setBuildService(BuildService buildService) {
		this.buildService = buildService;
	}

	
}
