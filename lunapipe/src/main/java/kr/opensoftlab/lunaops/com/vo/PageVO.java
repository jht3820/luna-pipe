package kr.opensoftlab.lunaops.com.vo;



import java.beans.Expression;
import java.lang.reflect.Method;

import kr.opensoftlab.sdf.util.OslAgileConstant;
import egovframework.com.utl.fcc.service.EgovStringUtil;

	public class PageVO extends DefaultVO{ 
	
	
	private String sortOrdr = "";
	
	
	private String searchSelect = "";
	
	
	private String searchTxt = "";

	
	private String searchCd = "";
	
	
	private int pageIndex = OslAgileConstant.pageIndex;

	
	private int pageUnit = OslAgileConstant.pageUnit;

	
	private int pageSize = OslAgileConstant.pageSize; 
 
	
	private int firstIndex = OslAgileConstant.firstIndex;

	
	private int lastIndex = OslAgileConstant.lastIndex;

	
	private int recordCountPerPage = OslAgileConstant.recordCountPerPage;

	 
	private int rowNo = OslAgileConstant.rowNo; 
	
	
	private int pageNo;
	
	private Integer firstRecordIndex;

	
	public String getSortOrdr() {
		return sortOrdr;
	}

	
	public void setSortOrdr(String sortOrdr) {
		this.sortOrdr = sortOrdr;
	}

	
	public int getPageIndex() {
		return pageIndex;
	}

	
	public void setPageIndex(int pageIndex) {
		this.pageIndex = pageIndex;
	}

	
	public int getPageUnit() {
		return pageUnit;
	}

	
	public void setPageUnit(int pageUnit) {
		this.pageUnit = pageUnit;
	}

	public String getSearchTxt() {
		return searchTxt;
	}

	public void setSearchTxt(String searchTxt) {
		this.searchTxt = searchTxt;
	}

	
	public int getPageSize() {
		return pageSize;
	}

	
	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	
	public int getFirstIndex() {
		return firstIndex;
	}

	
	public void setFirstIndex(int firstIndex) {
		this.firstIndex = firstIndex;
	}

	
	public int getLastIndex() {
		return lastIndex;
	}

	public String getSearchSelect() {
		return searchSelect;
	}

	public void setSearchSelect(String searchSelect) {
		this.searchSelect = searchSelect;
	}

	
	public void setLastIndex(int lastIndex) {
		this.lastIndex = lastIndex;
	}

	
	public int getRecordCountPerPage() {
		return recordCountPerPage;
	}

	
	public void setRecordCountPerPage(int recordCountPerPage) {
		this.recordCountPerPage = recordCountPerPage;
	}

	
	public int getRowNo() {
		return rowNo;
	}

	
	public int getPageNo() {
		return pageNo;
	}

	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}

	
	public void setRowNo(int rowNo) {
		this.rowNo = rowNo;
	}
	public String toPrint() {
		StringBuffer sb = new StringBuffer();
		Method[] mth = this.getClass().getMethods();
		Expression exp = null;
		String key = "";
		sb.append("this Class Name =>" + this.getClass().getName());
		sb.append("\n");
		for( int i = 0 ; i < mth.length ; i ++) {
			if ( mth[i].getReturnType().getName().equals("java.lang.String") ) {
				if ( !mth[i].getName().equals("toPrint") ) {
					exp = new Expression(this, mth[i].getName(), null);
					try {
						key = exp.getMethodName();
						sb.append(  key + "=>" + EgovStringUtil.nullConvert(exp.getValue()) );
						sb.append("\n");
					} catch (Exception e) {
						System.out.println(e.getMessage());
						
					};
				}
			}
		}
		return sb.toString();
	}
	
	
	public void initDefaultInfo(){
		this.setPageUnit(OslAgileConstant.pageUnit);
		this.setPageSize(OslAgileConstant.pageSize);
		this.setSortOrdr(OslAgileConstant.sortOrdr);
		this.setSearchSelect(OslAgileConstant.searchSelect);
		this.setSearchTxt(OslAgileConstant.searchTxt);
		this.setPageIndex(OslAgileConstant.pageIndex);
		this.setFirstIndex(OslAgileConstant.firstIndex);
		this.setLastIndex(OslAgileConstant.lastIndex);
		this.setRecordCountPerPage(OslAgileConstant.recordCountPerPage);
		this.setRowNo(OslAgileConstant.rowNo);
	}

	
	public String getSearchCd() {
		return searchCd;
	}

	
	public void setSearchCd(String searchCd) {
		this.searchCd = searchCd;
	}

	public Integer getFirstRecordIndex() {
		return firstRecordIndex;
	}

	public void setFirstRecordIndex(Integer firstRecordIndex) {
		this.firstRecordIndex = firstRecordIndex;
	}
	
}
