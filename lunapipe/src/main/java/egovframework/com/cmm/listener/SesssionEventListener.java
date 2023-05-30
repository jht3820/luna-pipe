package egovframework.com.cmm.listener;


import java.util.Enumeration;
import java.util.Hashtable;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import egovframework.com.cmm.LoginVO;



public class SesssionEventListener implements HttpSessionListener {

	public static SesssionEventListener loginSessionListener = null;
	
	@SuppressWarnings("rawtypes")
	public static Hashtable sessionMonitor;
		
	@SuppressWarnings("rawtypes")
	public SesssionEventListener() {
		if (sessionMonitor == null) sessionMonitor = new Hashtable();
		loginSessionListener = this;
	}
	
	public static synchronized SesssionEventListener getInstance() {
		if (loginSessionListener == null) loginSessionListener = new SesssionEventListener();
		return loginSessionListener;
	}
	
	/** 현재 활성화 된 session의 수를 반환한다. */
	public int getActiveSessionCount() {
		return sessionMonitor.size();
	}

	/** 현재 등록된 session의 id목록을 반환한다. */
	@SuppressWarnings("rawtypes")
	public Enumeration getIds() {
		return sessionMonitor.keys();
	}
	
	/** 중복 로그인 체크하여 기존 세션 강제 종료 메서드 */
	@SuppressWarnings("rawtypes")
	public boolean isDuplicateLogin(String sessionId, String userId){
		boolean ret = false;
		
		Enumeration eNum = sessionMonitor.elements();

		while(eNum.hasMoreElements()){
			HttpSession sh_session = null;
			
			try{
				//루프 돌며 저장되어 있는 세션 꺼내서 체크
				sh_session = (HttpSession) eNum.nextElement();
			}catch(Exception e){
				continue;
			}

			/** 전달받은 사번과 기존 세션값 중 사번이 동일한 것이 있으면 기존 세션을 소멸시킨다. */
			LoginVO sessionVO = (LoginVO) sh_session.getAttribute("loginVO");
			if(sessionVO != null){
				if(userId.equals(sessionVO.getId()) && !sessionId.equals(sh_session.getId())){
					ret = true;
					/** DB에 로그 처리할 것이 있다면 이곳에 처리 */
				}
			}
		}
		
		return ret;
	}
	
	
	
	@SuppressWarnings("rawtypes")
	public boolean closeDuplicateSession(String sessionId, String userId){
		boolean ret = false;
		
		Enumeration eNum = sessionMonitor.elements();

		System.out.println("session count : " + getActiveSessionCount());
		
		while(eNum.hasMoreElements()){
			HttpSession sh_session = null;
			
			try{
				//루프 돌며 저장되어 있는 세션 꺼내서 체크
				sh_session = (HttpSession) eNum.nextElement();
			}catch(Exception e){
				continue;
			}

			/** 전달받은 사번과 기존 세션값 중 사번이 동일한 것이 있으면 기존 세션을 소멸시킨다. */
			LoginVO sessionVO = (LoginVO) sh_session.getAttribute("loginVO");
			if(sessionVO != null){
				if(userId.equals(sessionVO.getId()) && !sessionId.equals(sh_session.getId())){
					sh_session.invalidate();
					ret = true;
					System.out.println("이전 세션 강제 종료함");
					/** DB에 로그 처리할 것이 있다면 이곳에 처리 */
					
				}
			}
		}
		
		return ret;
	}
	
	/** 현재 접속한 세션ID가 세션테이블에 존재하는지 비교하여 존재하지 않으면 true 리턴
	 *  받는쪽에서는 true 리턴이 갈 경우 이미 중복 로그인이나 세션 만료로 인해 해당 세션은 종료된 것임으로
	 *  로그인 페이지로 이동 시키거나 익셉션을 발생 시켜야 함.  
	 *  EX> DuplicationLoginException 
	 *  */
	
	@SuppressWarnings("rawtypes")
	public boolean checkDupSession(String sessionId) {
		boolean ret = false;
		
		Enumeration eNum = sessionMonitor.elements();
		
		while(eNum.hasMoreElements()){
			HttpSession sh_session = null;
			
			try{
				//루프 돌며 저장되어 있는 세션 꺼내서 체크
				sh_session = (HttpSession) eNum.nextElement();
			}catch(Exception e){
				continue;
			}
			
			/** 전달받은 기존 세션ID 중 동일한 세션ID가 있는지 체크하여 있다면 true 리턴 */
			LoginVO sessionVO = (LoginVO) sh_session.getAttribute("loginVO");
			if(sessionVO != null){
				if(sessionId.equals(sh_session.getId())){
					ret = true;
				}
			}
		}
		
		return ret;
	}

	@SuppressWarnings("unchecked")
	public void sessionCreated(HttpSessionEvent se) {
		HttpSession session = se.getSession();
		synchronized(sessionMonitor) {
			sessionMonitor.put(session.getId(), session);
			System.out.println(session.getId() + " : 세션 저장");
		}
	}

	public void sessionDestroyed(HttpSessionEvent se) {
		HttpSession session = se.getSession();
		synchronized( sessionMonitor ) {
			sessionMonitor.remove(session.getId());
			System.out.println(session.getId() + " : 세션 제거");
		}
	}
}
