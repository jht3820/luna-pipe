package egovframework.com.cmm.service;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import egovframework.com.cmm.EgovWebUtil;
import egovframework.com.cmm.util.EgovResourceCloseHelper;
import egovframework.rte.fdl.idgnr.EgovIdGnrService;


@Component("EgovFileMngUtil")
public class EgovFileMngUtil {

	public static final int BUFF_SIZE = 2048;

	@Resource(name = "egovFileIdGnrService")
	private EgovIdGnrService idgenService;
	
	
	public List<FileVO> fileUploadInsert(MultipartHttpServletRequest request,String inputAtchFileId, int inputFileSn, String addStrPath) throws Exception{
		
   		List<FileVO> _result = null;
   		
		inputFileSn = (inputFileSn<0)?0:inputFileSn;
		
		final Map<String, MultipartFile> files = request.getFileMap();
			
			if(!files.isEmpty()){
				
					_result = parseFileInf(files, "OSL_", inputFileSn, inputAtchFileId,"",addStrPath);
			}
		return _result;
	}
	
	
	public List<FileVO> parseFileInf(Map<String, MultipartFile> files, String KeyStr, int fileKeyParam, String atchFileId, String storePath, String addStrPath) throws Exception {
		int fileKey = fileKeyParam;
		String storePathString = "";
		String atchFileIdString = "";

		if ("".equals(storePath) || storePath == null) {
			storePathString = EgovProperties.getProperty("Globals.fileStorePath");
		} else {
			storePathString = EgovProperties.getProperty(storePath);
		}
		
		if(!"".equals(addStrPath) && addStrPath != null){
			storePathString += addStrPath+"/";
		}
		
		if ("".equals(atchFileId) || atchFileId == null) {
			atchFileIdString = idgenService.getNextStringId();
		} else {
			atchFileIdString = atchFileId;
		}

		File saveFolder = new File(EgovWebUtil.filePathBlackList(storePathString));

		if (!saveFolder.exists() || saveFolder.isFile()) {
			saveFolder.mkdirs();
		}

		Iterator<Entry<String, MultipartFile>> itr = files.entrySet().iterator();
		MultipartFile file;
		String filePath = "";
		List<FileVO> result = new ArrayList<FileVO>();
		FileVO fvo;

		
		long fileInfoMaxSize = Long.parseLong(EgovProperties.getProperty("Globals.lunaops.fileInfoMaxSize"));
		long fileSumMaxSize = Long.parseLong(EgovProperties.getProperty("Globals.lunaops.fileSumMaxSize"));
		
		long fileSumSize = 0;
		while (itr.hasNext()) {
			
			Entry<String, MultipartFile> entry = itr.next();

			file = entry.getValue();

			String orginFileName = file.getOriginalFilename();
			
			
			
			
			
			if ("".equals(orginFileName)) {
				
				
				orginFileName = "image.png";
			}
			

			int index = orginFileName.lastIndexOf(".");
			
			String fileExt = orginFileName.substring(index + 1);
			
			
			if(index == -1){
				continue;
			}
			
			
			if("UsrImg".equals(addStrPath)){
				
				String imgPattern = "(jpg|jpeg|png|gif)$";
				Pattern p = Pattern.compile(imgPattern);
				Matcher m = p.matcher(fileExt.toLowerCase());
				
				
				if(m.find() == false){
					continue;
				}
			}
			
			
			String newName = KeyStr + getTimeStamp() + fileKey;
			long size = file.getSize();

			
			if(size > fileInfoMaxSize || fileSumSize > fileSumMaxSize){
				continue;
			}
			
			fileSumSize += size;
			if (!"".equals(orginFileName)) {
				filePath = storePathString + File.separator + newName;
				file.transferTo(new File(EgovWebUtil.filePathBlackList(filePath)));
			}
			
			fvo = new FileVO();
			fvo.setFileExtsn(fileExt);
			fvo.setFileStreCours(storePathString);
			fvo.setFileMg(Long.toString(size));
			fvo.setOrignlFileNm(orginFileName);
			fvo.setStreFileNm(newName);
			fvo.setAtchFileId(atchFileIdString);
			fvo.setFileSn(String.valueOf(fileKey));

			result.add(fvo);

			fileKey++;
		}

		return result;
	}

	
	protected void writeUploadedFile(MultipartFile file, String newName, String stordFilePath) throws Exception {
		InputStream stream = null;
		OutputStream bos = null;

		try {
			stream = file.getInputStream();
			File cFile = new File(stordFilePath);

			if (!cFile.isDirectory()) {
				boolean _flag = cFile.mkdir();
				if (!_flag) {
					throw new IOException("Directory creation Failed ");
				}
			}

			bos = new FileOutputStream(stordFilePath + File.separator + newName);

			int bytesRead = 0;
			byte[] buffer = new byte[BUFF_SIZE];

			while ((bytesRead = stream.read(buffer, 0, BUFF_SIZE)) != -1) {
				bos.write(buffer, 0, bytesRead);
			}
		} finally {
			EgovResourceCloseHelper.close(bos, stream);
		}
	}

	
	public static void downFile(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String downFileName = "";
		String orgFileName = "";

		if ((String) request.getAttribute("downFile") == null) {
			downFileName = "";
		} else {
			downFileName = (String) request.getAttribute("downFile");
		}

		if ((String) request.getAttribute("orgFileName") == null) {
			orgFileName = "";
		} else {
			orgFileName = (String) request.getAttribute("orginFile");
		}

		orgFileName = orgFileName.replaceAll("\r", "").replaceAll("\n", "");

		File file = new File(EgovWebUtil.filePathBlackList(downFileName));

		if (!file.exists()) {
			throw new FileNotFoundException(downFileName);
		}

		if (!file.isFile()) {
			throw new FileNotFoundException(downFileName);
		}

		byte[] buffer = new byte[BUFF_SIZE]; 

		response.setContentType("application/x-msdownload");
		response.setHeader("Content-Disposition:", "attachment; filename*=UTF-8''" + new String(orgFileName.getBytes(), "UTF-8").replaceAll(",","%2C"));
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", "0");

		BufferedInputStream fin = null;
		BufferedOutputStream outs = null;

		try {
			fin = new BufferedInputStream(new FileInputStream(file));
			outs = new BufferedOutputStream(response.getOutputStream());
			int read = 0;

			while ((read = fin.read(buffer)) != -1) {
				outs.write(buffer, 0, read);
			}
		} finally {
			EgovResourceCloseHelper.close(outs, fin);
		}
	}

	
	public static HashMap<String, String> uploadFile(MultipartFile file) throws Exception {

		HashMap<String, String> map = new HashMap<String, String>();
		
		String newName = "";
		String stordFilePath = EgovProperties.getProperty("Globals.fileStorePath");
		String orginFileName = file.getOriginalFilename();

		int index = orginFileName.lastIndexOf(".");
		
		String fileExt = orginFileName.substring(index + 1);
		long size = file.getSize();

		
		newName = getTimeStamp(); 
		writeFile(file, newName, stordFilePath);
		
		map.put(Globals.ORIGIN_FILE_NM, orginFileName);
		map.put(Globals.UPLOAD_FILE_NM, newName);
		map.put(Globals.FILE_EXT, fileExt);
		map.put(Globals.FILE_PATH, stordFilePath);
		map.put(Globals.FILE_SIZE, String.valueOf(size));

		return map;
	}

	
	protected static void writeFile(MultipartFile file, String newName, String stordFilePath) throws Exception {
		InputStream stream = null;
		OutputStream bos = null;

		try {
			stream = file.getInputStream();
			File cFile = new File(EgovWebUtil.filePathBlackList(stordFilePath));

			if (!cFile.isDirectory())
				cFile.mkdir();

			bos = new FileOutputStream(EgovWebUtil.filePathBlackList(stordFilePath + File.separator + newName));

			int bytesRead = 0;
			byte[] buffer = new byte[BUFF_SIZE];

			while ((bytesRead = stream.read(buffer, 0, BUFF_SIZE)) != -1) {
				bos.write(buffer, 0, bytesRead);
			}
		} finally {
			EgovResourceCloseHelper.close(bos, stream);
		}
	}

	
	public void downFile(HttpServletResponse response, String streFileNm, String orignFileNm) throws Exception {
		String downFileName = streFileNm;
		String orgFileName = orignFileNm;

		File file = new File(downFileName);
		
		if (!file.exists()) {
			throw new FileNotFoundException(downFileName);
		}

		if (!file.isFile()) {
			throw new FileNotFoundException(downFileName);
		}

		int fSize = (int) file.length();
		if (fSize > 0) {
			BufferedInputStream in = null;

			try {
				in = new BufferedInputStream(new FileInputStream(file));

				String mimetype = "application/x-msdownload";

				
				response.setContentType(mimetype);
				response.setHeader("Content-Disposition:", "attachment; filename*=UTF-8''" + orgFileName.replaceAll(",","%2C"));
				response.setContentLength(fSize);
				
				
				
				FileCopyUtils.copy(in, response.getOutputStream());
			} finally {
				EgovResourceCloseHelper.close(in);
			}
			response.getOutputStream().flush();
			response.getOutputStream().close();
		}

		

		
	}

	
	private static String getTimeStamp() {

		String rtnStr = null;

		
		String pattern = "yyyyMMddhhmmssSSS";

		SimpleDateFormat sdfCurrent = new SimpleDateFormat(pattern, Locale.KOREA);
		Timestamp ts = new Timestamp(System.currentTimeMillis());

		rtnStr = sdfCurrent.format(ts.getTime());

		return rtnStr;
	}
	

	public static String deleteFile(String fileDeletePath) {

		
		if (fileDeletePath == null || fileDeletePath.equals("")) {
			return "";
		}
		String result = "";
		File file = new File(EgovWebUtil.filePathBlackList(fileDeletePath));
		if (file.isFile()) {
			result = deletePath(fileDeletePath);
		} else {
			result = "";
		}
		return result;
	}
	
	

	public static String deletePath(String filePath) {
		File file = new File(EgovWebUtil.filePathBlackList(filePath));
		String result = "";
		if (file.exists()) {
			result = file.getAbsolutePath();
			if (!file.delete()) {
				result = "";
			}
		}
		return result;
	}
}
