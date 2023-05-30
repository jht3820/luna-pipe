package kr.opensoftlab.lunaops.com.exception;



public class UserDefineException extends Exception{
	static final long serialVersionUID = -3387516993124229948L;
	public UserDefineException(){
		super();
	}
	public UserDefineException(String msg){
		super(msg);
	}
}