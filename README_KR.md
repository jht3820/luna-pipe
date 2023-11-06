![GitHub closed pull requests](https://img.shields.io/github/issues-pr-closed/jht3820/luna-pipe)
[![GitHub issues](https://img.shields.io/github/issues/jht3820/luna-pipe)](https://github.com/jht3820/luna-pipe/issues)
[![GitHub forks](https://img.shields.io/github/forks/jht3820/luna-pipe)](https://github.com/jht3820/luna-pipe/network)
[![GitHub stars](https://img.shields.io/github/stars/jht3820/luna-pipe)](https://github.com/jht3820/luna-pipe/stargazers)
[![GitHub license](https://img.shields.io/github/license/jht3820/luna-pipe)](https://github.com/jht3820/luna-pipe/blob/master/LICENSE)
![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/jht3820/luna-pipe)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/jht3820/luna-pipe?include_prereleases)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/jht3820/luna-pipe/CI)

<br/>
<br/>
<br/>

![opensoftlab_logo](https://user-images.githubusercontent.com/22164616/99226155-a06b7100-282c-11eb-9649-5bcdc839a1d6.jpg)  
<br/>
<br/>
<br/>


# 🙂 1. LUNA™ PIPE 소개

기존 파편화된 오픈소스 형상관리 도구를 연계하여 통합한 오픈소스 기반 통합 형상관리 도구입니다.
파편화된 형상 관리 도구로 인해 낮은 효율성, 높은 활용 난이도로 쉽게 구축 및 사용이 어려운
CI/CD 파이프라인 구성을 도와줄 수 있는 도구입니다.

LUNA PIPE에서 소스저장소(SVN, GIT) 및 Jenkine 연결을 통해 소스저장소의 소스 내역 확인 및 배포를 진행할 수 있습니다.

# 🌈 2. LUNA™ PIPE 설치 준비

### 📌 2.1 설치 환경
 - OS
   ```
     - Linux
   ```
 - Server
   ```
     - JDK 1.8 이상
     - Tomcat 7.0 이상
     - Oracle 11g 이상
	 - Tomcat 8 이상
   ```
 - Client 
   ```
     - Chrome 103 이상
     - MS edge 103 이상
   ```
   
   
### 📦 2.2 JENKINS, SVN 설치
 - 설치 가이드 링크
	 - [JENKINS 설치(Red Hat/Fedora/Alma/Rocky/CentOS)](https://pkg.jenkins.io/redhat/)
	 - [JENKINS 설치(Ubuntu/Debian)](https://pkg.jenkins.io/debian/)
	 - [JENKINS 설치(Docker)](https://hub.docker.com/r/jenkins/jenkins/)
     - [SVN 설치](https://subversion.apache.org/packages.html)
	 - [톰캣 설치](https://tomcat.apache.org/download-80.cgi)

### 📌 2.3 LUNA™ PIPE 설치 준비 사항
 - LUNA™ PIPE 설치와 실행을 위하여 DB 설치 및 property 설정이 필요합니다.
 
 - DB설치 이후 환경파일 설정 순으로 세팅이 필요합니다.
 
 - 이하 전자정부프레임워크(eGovFramework) 표준에 준하여 구동됩니다.
 
### 📌 2.4 LUNA™ PIPE 검증 코드
 - 호출에 사용되는 파라미터 기본 값은 JSON형태의 암호화된 문자열입니다.
 - `Globals.data.salt`에 설정된 값에 따라 검증 코드가 동작됩니다.
   - 암호화 Salt 값이 변경되면 `globals.properties`, `LunaDplScrty.jar` 내부 값을 변경해야 합니다. 
 - 암호화 방법
   ```
     java -jar lunaDplScrty.jar etc 1
	   [output]
	   key setting: {"key":"암호화 처리되는 추가 부여 값"}
       암호화된 key 값
   ```
 
 
# ⚙️ 3. LUNA™ PIPE 설치

### 🛠 3.1 Oracle에 LUNA™ PIPE DB 세팅
 - DB_install_script 디렉토리에 설치 스크립트들을 1번부터 순서대로 설치 진행합니다.
   - [01. LUNAOPSDPLDB_INSTALL(sys계정).sql]
       - 테이블 스페이스 경로 변경 필요
         - TS_LUNA_OPS_DPL_DAT01.DBF
         - TS_LUNA_OPS_DPL_IDX01.DBF
   - [02. LUNAOPSDPLDB_테이블_생성.sql]
   - [03. 기초데이터_생성(LUNAOPSDPLDB계정).sql]
   - [04. INDEX.sql]
   - [05. DB_SF_SP\1. SF_CMM1000_MST_CD_NM.sql]
   - [05. DB_SF_SP\2. SF_CMM1001_COM_CD_INFO.sql]
  
### 🛠 3.2 LUNA™ PIPE DB 접속 주소 및 환경설정
   ```
		/lunapipe/src/main/resources/egovframework/egovProps/globals.properties 아래와 같이 설정을 변경합니다.
    
		- 공통
		Globals.lunaops.oracle.driver= Your oracle Driver
		Globals.lunaops.oracle.url= Your oracle URL
		Globals.lunaops.oracle.username= Your DB username
		Globals.lunaops.oracle.password= Your DB password

		- git api 주소
		Globals.github.endpoint=GITHUB api URL
		Globals.gitlab.endpoint=GITLAB api URL
		
		- 암호화 salt 값
		Globals.data.salt=암호화 처리되는 추가 부여 값
   ```
   
### 🛠 3.3 소스저장소 설정

   
# 📖 4. Document

## 4.1 화면
> window.open으로 호출되는 팝업 서비스에 암호화 데이터를 적용\
> 암호화된 데이터는 get 파라미터 'data'로 전달\
> 'data'로 전달되는 암포화 문자열은 encodeURIComponent 처리된 상태로 전달

🖥소스저장소 관리 화면
  - URL: /rep/rep1000/rep1000/selectRep1000RepositoryView.do
  - PARAM: 
    - **key**: API 통신 암호화 키
    - **current_date**: API 요청 시간 값
    - **api_id**: LUNA 화면 ID
    - **svc_id**: Service ID
    - **src_id**: 구성항목 ID
    - **emp_id**: 사용자 ID
    - **f_id**: 릴레이션 fid
    - **callback_api_id**: Callback API ID
  - Callback
    - **svcid**: 화면 오픈 시 전달 받은 서비스 ID
    - **urows**([]): 전달 소스저장소 데이터 Array
        - **key**: 소스저장소 ID
        - **svn_name**: 소스저장소명
        - **svn_src_id**: 구성관리 CI ID
        - **svn_url**: SVN URL
        - **svn_descr**: SVN 설명
        - **svn_used**: 1: 사용, 2: 미사용

🖥JENKINS & JOB 관리 화면
  - URL: /jen/jen1000/jen1000/selectJen1000View.do
  - PARAM: 
    - **key**: API 통신 암호화 키
    - **current_date**: API 요청 시간 값
    - **api_id**: LUNA 화면 ID
    - **svc_id**: Service ID
    - **emp_id**: 사용자 ID
    - **f_id**: 릴레이션 fid
    - **callback_api_id**: Callback API ID
  - Callback
    - **svcid**: 화면 오픈 시 전달 받은 서비스 ID
    - **urows**([]): 전달 JOB 데이터 Array
        - **key**: JENKINS ID
        - **jks_name**: JENKINS명
        - **jks_src_id**: 구성관리 CI ID
        - **jks_descr**: JENKINS 설명
        - **jks_used**: 1: 사용, 2: 미사용
        - **jks_order**: JOB 순서
        - **jks_job_id**: JOB ID
        - **jks_job_type**: JOB TYPE
        - **jks_var**: JOB 파라미터 값

🖥소스저장소 상세정보 화면
  - URL: /rep/rep1000/rep1000/selectRep1002View.do
  - PARAM: 
    - **key**: API 통신 암호화 키
    - **current_date**: API 요청 시간 값
    - **api_id**: LUNA 화면 ID
    - **svc_id**: Service ID
    - **rep_id**: 소스저장소 ID
    - **ticket_id**: 티켓 ID
    - **f_id**: 릴레이션 fid
    - **callback_api_id**: Callback API ID
  - Callback
    - **svcid**: 화면 오픈 시 전달 받은 서비스 ID
    - **urows**([]): 전달 리비전 데이터 Array
        - **rep_id**: 소스저장소 ID
        - **revision**: 리비전 ID
        - **comment**: 커밋 코멘트
        - **author**: 커밋 발생자
        - **log_date**: 커밋 일시(timestamp)
        - **s_date**: 커밋 일시(String)
        - **svn_file_list**([]): 변경 파일 Array
            - **kind**: 파일 타입(dir, file)
            - **path**: 경로
            - **type**: 변경 타입(A: Added, M: Modified, D: Deleted)
            - **file_name**: 파일명

🖥티켓 JENKINS & JOB 등록 화면
  - URL: /jen/jen1000/jen1000/selectJen1000CIJobView.do
  - PARAM: 
    - **key**: API 통신 암호화 키
    - **current_date**: API 요청 시간 값
    - **api_id**: LUNA 화면 ID
    - **svc_id**: Service ID
    - **src_id**: 구성항목 ID
    - **f_id**: 릴레이션 fid
    - **callback_api_id**: Callback API ID
    - **job_type**([]): 화면 출력 조건 JOB TYPE
  - Callback
    - **svc_id**: 화면 오픈 시 전달 받은 서비스 ID
    - **urows**([]): 전달 JOB 데이터 Array
        - **key**: JENKINS ID
        - **tkt_name**: JENKINS명
        - **tkt_src_id**: 구성관리 CI ID
        - **tkt_descr**: JENKINS 설명
        - **tkt_used**: 1:사용, 2 미사용
        - **tkt_order**: JOB 순서
        - **tkt_job_id**: JOB ID
        - **tkt_job_type**: JOB TYPE
        - **tkt_var**: JOB 파라미터 값

🖥빌드 실행 화면
  - URL: /dpl/dpl1000/dpl1000/selectDpl1000View.do
  - PARAM: 
    - **key**: API 통신 암호화 키
    - **current_date**: API 요청 시간 값
    - **ticket_id**: 티켓 ID
    - **dpl_id**: 배포계획 ID
    - **emp_id**: 배포 실행자 ID(사용자 ID)
    - **job_type**([]): 화면 출력 조건 JOB TYPE
    - **ticket_list**([]): 운영 배포시 필요한 티켓 ID 파라미터 Array([{ticket_id: 'TICKET_ID'}])
    - **egene_dpl_id**: E-GENE에서 사용되는 배포계획 ID(티켓 묶음 ID)

🖥Branch → Trunk Commit 처리 화면
  - URL: /rep/rep1000/rep1100/selectRep1100View.do
  - PARAM: 
    - **key**: API 통신 암호화 키
    - **current_date**: API 요청 시간 값
    - **ticket_id**: 티켓 ID
    - **emp_id**: 커밋 실행자 ID(사용자 ID)

🖥소스저장소 → 배포저장소 Commit 처리 화면
  - URL: /rep/rep1000/rep1100/selectRep1102View.do
  - PARAM: 
    - **key**: API 통신 암호화 키
    - **current_date**: API 요청 시간 값
    - **src_id**: 구성항목 ID 
    - **ticket_id**: 티켓 ID
    - **emp_id**: 커밋 실행자 ID(사용자 ID)

🖥배포저장소 빌드 대상 선택 화면
  - URL: /rep/rep1000/rep1100/selectRep1103View.do
  - PARAM: 
    - **key**: API 통신 암호화 키
    - **current_date**: API 요청 시간 값
    - **src_id**: 구성항목 ID 
    - **ticket_id**: 티켓 ID
    - **emp_id**: 커밋 실행자 ID(사용자 ID)

## 4.2 API
✔연결 데이터 저장(소스저장소, JENKINS)
  - URL: /api/insertCIRepJenJob
  - Content-Type: application/json
  - PARAM:
    - **REP_IDS**([]): 소스저장소 ID Array
      - **rep_id**: 소스저장소 ID
    - **JEN_JOB_IDS**([]): JENKINS JOB Array
      - **jen_id**: JENKINS ID
      - **job_id**: JOB ID
      - **job_param_list**([]): JOB 파라미터 목록
          - **job_param_key**: 파라미터 key
          - **job_param_val**: 파라미터 값
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ci_id**: 구성항목 ID
        - **rep_ids**([]): 소스저장소 ID Array
        - **jen_job_ids**([]): JOB ID Array
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **executed**: 저장에 성공한 건 수
    - **total**: 전체 데이터 수
    - **etc_msg**: 실패 처리된 데이터 상세 오류 메시지(개행 구분: \n)

✔연결 데이터 제거(소스저장소, JENKINS)
  - URL: /api/deleteCIRepJenJob
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **REP_IDS**([]): 소스저장소 ID Array
      - **rep_id**: 소스저장소 ID
    - **JEN_JOB_IDS**([]): JENKINS JOB Array
      - **jen_id**: JENKINS ID
      - **job_id**: JOB ID
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ci_id**: 구성항목 ID
        - **rep_ids**([]): 소스저장소 ID Array
        - **jen_job_ids**([]): JOB ID Array
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **executed**: 삭제에 성공한 건 수
    - **total**: 전체 데이터 수
    - **etc_msg**: 실패 처리된 데이터 상세 오류 메시지(개행 구분: \n)

✔CI_ID 로 연결 데이터 조회(소스저장소, JENKINS)
  - URL: /api/selectCIRepList
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ci_id**: 구성항목 ID
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **data**([]): 소스저장소, JENKINS 정보 Array
       - **rep_ids**([]): 소스저장소 정보 Array
            - **ci_id**: 구성항목 아이디
            - **rep_id**: 소스저장소 ID
            - **rep_nm**: 소스저장소명
            - **rep_txt**: 소스저장소 설명
            - **svn_rep_url**: SVN 소스저장소 URL
        - **jen_job_ids**([]): JENKINS 정보 Array
            - **ci_id**: 구성항목 ID
            - **jen_id**: JENKINS ID
            - **jen_nm**: JENKINS명
            - **jen_url**: JENKINS URL
            - **jen_desc**: JENKINS 설명
            - **job_id**: JOB ID
            - **job_desc**: JOB 설명
            - **job_url**: JOB URL
            - **job_param_list**([]): JOB 빌드 파라미터 Array
                - **ci_id**: 구성항목 ID
                - **jen_id**: JENKINS ID
                - **job_id** : JOB ID
                - **job_param_key**: JOB 파라미터 Key
                - **job_param_val**: JOB 입력 파라미터 값

✔티켓에 JENKINS 등록
  - URL: /api/insertCITicketJobList
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **JEN_JOB_IDS**([]): JENKINS JOB Array
      - **jen_id**: JENKINS ID
      - **job_id**: JOB ID
      - **job_start_ord**: JOB 순서
      - **job_param_list**([]): JOB 빌드 파라미터 Array
          - **ci_id**: 구성항목 ID
          - **jen_id**: JENKINS ID
          - **job_id**: JOB ID
          - **job_param_key**: JOB 파라미터 key
          - **job_param_val**: JOB 입력 파라미터 값
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ci_id**: 구성항목 ID
        - **ticket_id**: 티켓 ID
        - **jen_job_ids**([]): JOB ID Array
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **executed**: 저장에 성공한 건 수
    - **total**: 전체 데이터 수
    - **dpl_id**: 배포계획 ID
    - **ticket_id**: 티켓 ID

✔티켓에 배정된 JOB의 빌드 현황 데이터 조회
  - URL: /api/selectTicketJobInfo
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ci_id**: 구성항목 ID
        - **ticket_id**: 티켓 ID
        - **dpl_id**: 배포계획 ID
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **data**([]): JENKINS 빌드 정보 Array
        - **ci_id**: 구성항목 ID
        - **ticket_id**: 티켓 ID
        - **dpl_id**: 배포계획 ID
        - **jen_id**: JENKINS ID
        - **jen_nm**: JENKINS명
        - **jen_url**([]): JOB Array
        - **jen_desc**: JENKINS 설명
        - **job_id**: JOB명
        - **job_ord**: JOB 순서
        - **job_type_nm**: JOB 타입명
        - **bld_num**: 마지막 빌드 번호
        - **bld_result**: 마지막 빌드 결과
        - **bld_duration_tm**: 마지막 빌드 소요 시간
        - **bld_start_dtm**: 빌드 시작 시간

✔소스저장소 브랜치 생성
> 소스 저장소 URL/{BRANCH PATH}/{설정 접두어}_{티켓 ID}\
> Branch Path는 소스저장소 관리 화면에서 등록/수정 가능 
  - URL: /api/insertRepTicketBranchInfo
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ticket_id**: 티켓 ID
        - **rep_id**: 소스저장소 ID
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **branch_nm**: 생성된 브랜치명
    - **branch_path**: 생성된 브랜치 경로

✔빌드 실행
> 운영배포되는 티켓 대상 파일 목록 조회\
> 파라미터 중 ci_id, rep_id 미 포함 조회 가능(ticket_id로 조회)
  - URL: /api/actionJobBuild
  - Http Method: GET
  - Content-Type: application/json
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **job_key**: JENKINS ID, JOB ID로 이루어진 암호화 KEY 값
            1. JENKINS 등록, 수정 관리 화면 진입(/jen/jen1000/jen1000/selectJen1000View.do)
            2. JENKINS 데이터 선택
            3. JOB 관리 목록에서 JOB 데이터 마우스 우클릭
            4. 'JOB 암호화 코드 조회' 메뉴 선택하여 확인
        - **rv**: 리비전 값
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)

✔티켓에 저장된 리비전 데이터 조회
  - URL: /api/selectTicketRvDataList
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ticket_id**: 티켓 ID
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **ticket_rv_list**([]): 리비전 정보 Array
        - **ticket_id**: 티켓 ID
        - **rep_id**: 소스저장소 ID
        - **rep_cmt_date**: 커밋 일시
        - **rep_cmt_author**: 커밋 대상자
        - **rep_rv**: 리비전 번호(ID)
        - **rep_comment**: 커밋 코멘트
        - **rep_chg_file_cnt**: 변경 파일 개수
        - **rep_chg_file_list**([]): 변경 파일 Array
            - **ticket_id**: 티켓 ID
            - **rep_id**: 소스저장소 ID
            - **rep_rv**: 리비전 번호(ID)
            - **rep_chg_id**: 변경 파일 ID
            - **rep_chg_type**: 변경 타입(A: Added, M: Modified, D: Deleted)
            - **rep_chg_file_path**: 변경 파일 경로
            - **rep_chg_file_nm**: 변경 파일명

✔티켓에 등록된 배포 저장소 빌드 대상 파일 조회
  - URL: /api/selectTicketDplFileDataList
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ci_id**: 구성항목 ID
        - **rep_id**: 소스저장소 ID
        - **ticket_id**: 티켓 ID
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **ticket_deploy_file_list**([]): 배포 대상 선택 파일 Array
        - **ticket_id**: 티켓 ID
        - **ci_id**: 구성항목 ID
        - **rep_id**: 소스저장소 ID
        - **rep_rv**: 리비전 번호(ID)
        - **rep_chg_id**: 배포 변경 파일 ID
        - **job_id**: 운영 JOB ID
        - **bld_num**: 운영 빌드 번호
        - **rep_chg_type_cd**: 파일 변경 타입(01: 추가, 02 수정, 03 삭제)
        - **rep_chg_file_path**: 변경 파일 경로
        - **rep_chg_file_nm**: 변경 파일명
        - **rep_chg_file_kind**: 대상 파일 종류(dir, file)
        - **commit_emp_id**: 커밋 사용자

✔SVN 소스저장소 대상 경로 파일 Lock 설정
  - URL: /api/insertRepFileLock
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **emp_id**: lock 설정자 ID
        - **rep_id**: 소스저장소 ID
        - **ticket_id**: 티켓 ID
        - **force**: 강제 lock 여부(String true, false)
        - **path_list**([]): lock 대상 경로 Array
            - **path**: lock 대상 경로
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **total**: lock 대상 경로 전체 개수
    - **executed**: lock 설정 완료 개수
    - **data**([]): lock 설정 결과 데이터 Array
        - **ticket_id**: 티켓 ID
        - **rep_id**: 소스저장소 ID
        - **lockPath**: LOCK 대상 경로
        - **lockUsrId**: LOCK 설정 사용자 ID
        - **lockComment**: LOCK 커밋 내용
        - **lockStateCd**: LOCK 상태 값(01: LOCK, 02: UNLOCK)
        - **lockForce**: LOCK 강제 설정 여부(String true, false)
        - **lockTargetRv**: LOCK 대상 리비전
        - **result**: LOCK 설정 결과(true, false)
        - **resultMsg**: LOCK 설정 결과 메시지
        - **regDtm**: LOCK 설정 일시
        - **regUsrId**: LOCK 설정 사용자 ID
        - **regUsrIp**: LOCK 설정 사용자 IP

✔SVN 소스저장소 대상 경로 파일 UnLock 설정
  - URL: /api/insertRepFileUnLock
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **emp_id**: lock 설정자 ID
        - **rep_id**: 소스저장소 ID
        - **ticket_id**: 티켓 ID
        - **force**: 강제 lock 여부(String true, false)
        - **path_list**([]): lock 대상 경로 Array
            - **path**: lock 대상 경로
            - **lock_id**: lock ID (lock token)
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **msg**: 결과 메시지 내용
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **total**: un lock 대상 경로 전체 개수
    - **executed**: un lock 설정 완료 개수
    - **data**([]): un lock 설정 결과 데이터 Array
        - **ticket_id**: 티켓 ID
        - **rep_id**: 소스저장소 ID
        - **lockPath**: UNLOCK 대상 경로
        - **lockUsrId**: UNLOCK 설정 사용자 ID
        - **lockStateCd**: UNLOCK 상태 값(01: LOCK, 02: UNLOCK)
        - **lockForce**: UNLOCK 강제 설정 여부(String true, false)
        - **lockTargetRv**: UNLOCK 대상 리비전
        - **result**: UNLOCK 설정 결과(true, false)
        - **resultMsg**: UNLOCK 설정 결과 메시지
        - **regDtm**: UNLOCK 설정 일시
        - **regUsrId**: UNLOCK 설정 사용자 ID
        - **regUsrIp**: UNLOCK 설정 사용자 IP

✔티켓 ID로 LOCK 설정된 경로 목록 조회
> 파라미터 조건에 'lock_target_rv' 또는 'lock_state_cd'값이 있으면 모든 데이터에서 해당 조건을 적용\
> 파라미터 조건에 위 2개 파라미터가 없으면, 현재 LOCK 설정되어 있는 데이터만 조회 
  - URL: /api/insertRepFileUnLock
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads**(암호화 전):
        - **key**: API 통신 암호화 키
        - **current_date**: API 요청 시간 값
        - **ticket_id**: 티켓 ID
        - **lock_target_rv**: 대상 리비전 조건(없으면 전체)
        - **lock_state_cd**: lock 상태 값(01: lock, 02: unlock, 없으면 전체)
  - Response Definition:
    - **result**:
        - SUCCESS: 성공
        - FAIL: Request 정보 정확하지 않음(파라미터 정보 처리 중 실패)
        - ERROR: API 처리 작업 중 오류 발생
    - **error_code**: 오류 발생 시 전달 속성 (오류코드 3장 참조)
    - **data**([]): lock 데이터 Array
        - **ticket_id**: 티켓 ID
        - **rep_id**: 소스저장소 ID
        - **rep_nm**: 소스저장소명
        - **lock_id**: LOCK ID (LOCK TOKEN)
        - **lock_path**: LOCK 대상 경로
        - **lock_usr_id**: LOCK 설정 사용자 ID
        - **lock_comment**: LOCK 커밋 코멘트
        - **lock_state_cd**: LOCK 상태 값(01: LOCK, 02: UNLOCK)
        - **lock_state_nm**: LOCK 상태명
        - **lock_force**: LOCK 강제 설정 여부(String true, false)
        - **lock_target_rv**: LOCK 대상 리비전 번호
        - **reg_dtm**: LOCK 설정 일시
        - **reg_usr_id**: LOCK 설정 사용자 ID
        - **reg_usr_ip**: LOCK 설정 사용자 IP

## 4.3 Error Code
| Error Code | Description |
| --- | --- |
| 001 | 파라미터 DATA 값 없음 |
| 002 | 인증 KEY 오류 (잘못된 KEY) |
| 003 | 파라미터 ‘CI_ID’값 없음 |
| 004 | 데이터 복호화 오류 |
| 005 | 파라미터 ‘TICKET_ID’값 없음 |
| 006 | 파라미터 ‘REP_ID’값 없음 |
| 007 | 파라미터 'DPL_ID'값 없음 |
| 008 | JOB_ID 정보 찾을 수 없음 |
| 009 | REP_ID 에 해당하는 소스저장소 정보가 없음 |
| 010 | JEN_ID, JOB_ID 에 해당하는 JENKINS&JOB 정보가 없음 |
| 011 | 등록된 데이터 없음 |
| 012 | 데이터 체크 실패 |
| 013 | 삭제된 데이터 없음 |
| 014 | 파라미터 'PATH_LIST'값 없음 |
| 100 | 구성항목 저장 중 오류 |
| 101 | 구성항목 저장 데이터 없음(소스저장소, JENKINS) |
| 102 | 구성항목 `소스저장소` 파라미터 추출 중 오류 |
| 103 | 구성항목 `JENKINS&JOB` 파라미터 추출 중 오류 |
| 200 | Branch명 중복 |
| 201 | 소스저장소 고유 식별 ID 'UUID' 값 없음 |
| 202 | 소스저장소 리비전 'rv' 값 없음 |
| 203 | Trunk 경로에 복사 대상이 없음 |
| 204 | 파일 LOCK 중 오류 발생 |
| 205 | 소스저장소 UUID 로 REP_ID 값 조회 중 오류 발생 |
| 300 | JENKINS 연결 실패 |
| 301 | 해당 JOB 이 이미 실행 중 |
| 302 | 빌드 번호 정보가 없음 |
| 400 | 티켓 검증 오류 |
| 999 | 서버 내 처리 중 오류 |




# 📜 5. 라이선스 정보

- LUNA™ PIPE는 GPL3.0 라이선스에 따라 라이선스가 부여됩니다. 전체 라이센스 텍스트는 ([GPL3.0 라이센스 정보](https://www.olis.or.kr/license/Detailselect.do?lId=1072)) 를 참조하세요.
