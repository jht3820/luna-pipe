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


# 🙂 1. Introduction to LUNA™ PIPE

It is an open source-based integrated configuration management tool that links and integrates existing fragmented open source configuration management tools. 
It is a tool that can help configure CI/CD pipelines that are difficult to build and use due to low efficiency and high difficulty in utilization due to fragmented configuration management tools.

In LUNA PIPE, you can check the source details of the source repository and distribute it by connecting to the source repository (SVN, GIT) and Jenkine.

# 🌈 2. Preparing for LUNA™ PIPE installation

### 📌 2.1 Installation environment
 - OS
   ```
     - Linux
   ```
 - Server
   ```
     - JDK 1.8 or higher
     - Tomcat 7.0 or higher
     - Oracle 11g or higher
	 - Tomcat 8 or higher
   ```
 - Client 
   ```
     - Chrome 103 or higher
     - MS edge 103 or higher
   ```
   
   
### 📦 2.2 JENKINS, SVN installation
 - Installation Guide Link
	 - [JENKINS Installation(Red Hat/Fedora/Alma/Rocky/CentOS)](https://pkg.jenkins.io/redhat/)
	 - [JENKINS Installation(Ubuntu/Debian)](https://pkg.jenkins.io/debian/)
	 - [JENKINS Installation(Docker)](https://hub.docker.com/r/jenkins/jenkins/)
     - [SVN Installation](https://subversion.apache.org/packages.html)
	 - [Tomcat Installation](https://tomcat.apache.org/download-80.cgi)

### 📌 Preparation for LUNA™ PIPE installation
 - To install and run LUNA™ PIPE, DB installation and property settings are required.
 
 - After DB installation, settings are required in the order of environment file settings.
 
 - It is operated in accordance with the eGovFramework standards below.
 
### 📌 2.4 LUNA™ PIPE Verification Code
 - The default value of the parameter used in the call is an encrypted string in JSON format.
 - Proceed with encryption using the lunaDplScrty.jar file in the encryption folder.
 - The verification code operates according to the value set in `Globals.data.salt`.
   - If the encryption Salt value changes, the values inside `globals.properties` and `LunaDplScrty.jar` must be changed.
 - Encryption method
   ```
     java -jar lunaDplScrty.jar etc 1
	   [output]
	   key setting: {"key":"Additional grant value to be encrypted"}
       Encrypted key value
   ```
 
 
# ⚙️ 3. LUNA™ PIPE INSTALLATION

### 🛠 3.1 Setting up LUNA™ PIPE DB in Oracle
 - DB_install_script Install the installation scripts in the directory in order, starting from number 1.
   - [01_DB_INSTALL_SYS계정.sql]
       - Change the table space path to suit your environment.
   - [02_관련테이블_생성.sql]
   - [03_기초데이터_생성.sql]
   - [04_INDEX_생성.sql]
   - [05_SF_CMM1000_MST_CD_NM_Function생성.sql]
   - [06_SF_CMM1001_COM_CD_INFO_Function생성.sql]
  
### 🛠 3.2 LUNA™ PIPE DB connection address and environment settings
   ```
		/lunapipe/src/main/resources/egovframework/egovProps/globals.properties Change the settings as shown below.
    
		- common
		Globals.lunaops.oracle.driver= Your oracle Driver
		Globals.lunaops.oracle.url= Your oracle URL
		Globals.lunaops.oracle.username= Your DB username
		Globals.lunaops.oracle.password= Your DB password

		- git api address
		Globals.github.endpoint=GITHUB api URL
		Globals.gitlab.endpoint=GITLAB api URL
		
		- Encryption salt value
		Globals.data.salt=Additional grant values that are encrypted
   ```
   
### 🛠 3.3 Source repository settings

   
# 📖 4. Document

## 4.1 View
> Apply encryption data to pop-up services called with window.open\
> Encrypted data is passed to the get parameter ‘data’\
> The saturated string passed as 'data' is delivered as encodeURIComponent processed.

🖥Source repository management screen
  - URL: /rep/rep1000/rep1000/selectRep1000RepositoryView.do
  - PARAM: 
    - **key**: API communication encryption key
    - **current_date**: API request time value
    - **api_id**: LUNA VIEW ID
    - **svc_id**: Service ID
    - **src_id**: Configuration item ID
    - **emp_id**: user ID
    - **f_id**: relation fid
    - **callback_api_id**: Callback API ID
  - Callback
    - **svcid**: Service ID received when opening the screen
    - **urows**([]): Delivery source storage data Array
        - **key**: Source repository ID
        - **svn_name**: Source repository name
        - **svn_src_id**: Configuration item CI ID
        - **svn_url**: SVN URL
        - **svn_descr**: SVN description
        - **svn_used**: 1: used, 2: not used

🖥JENKINS & JOB management screen
  - URL: /jen/jen1000/jen1000/selectJen1000View.do
  - PARAM: 
    - **key**: API communication encryption key
    - **current_date**: API request time value
    - **api_id**: LUNA screen ID
    - **svc_id**: Service ID
    - **emp_id**: User ID
    - **f_id**:relation fid
    - **callback_api_id**: Callback API ID
  - Callback
    - **svcid**: Service ID received when opening the screen
    - **urows**([]): Delivery JOB data Array
        - **key**: JENKINS ID
        - **jks_name**: JENKINS name
        - **jks_src_id**: Configuration management CI ID
        - **jks_descr**: JENKINS description
        - **jks_used**: 1: used, 2: not used
        - **jks_order**: JOB order
        - **jks_job_id**: JOB ID
        - **jks_job_type**: JOB TYPE
        - **jks_var**: JOB parameter value

🖥Source repository details screen
  - URL: /rep/rep1000/rep1000/selectRep1002View.do
  - PARAM: 
    - **key**: API communication encryption key
    - **current_date**: API request time value
    - **api_id**: LUNA screen ID
    - **svc_id**: Service ID
    - **rep_id**: Source repository ID
    - **ticket_id**: Ticket ID
    - **f_id**: relation fid
    - **callback_api_id**: Callback API ID
  - Callback
    - **svcid**: Service ID received when opening the screen
    - **urows**([]): Array of forwarded revision data
        - **rep_id**: Source repository ID
        - **revision**: Revision ID
        - **comment**: commit comment
        - **author**: commit originator
        - **log_date**: Commit date (timestamp)
        - **s_date**: Commit date (String)
        - **svn_file_list**([]): Array of changed files
            - **kind**: File type (dir, file)
            - **path**: path
            - **type**: Change type (A: Added, M: Modified, D: Deleted)
            - **file_name**: File name

🖥Ticket JENKINS & JOB registration screen
  - URL: /jen/jen1000/jen1000/selectJen1000CIJobView.do
  - PARAM: 
    - **key**: API communication encryption key
    - **current_date**:API request time value
    - **api_id**: LUNA screen ID
    - **svc_id**: Service ID
    - **src_id**: Configuration item ID
    - **f_id**: relation fid
    - **callback_api_id**: Callback API ID
    - **job_type**([]): Screen output condition JOB TYPE
   - Callback
     - **svc_id**: Service ID received when opening the screen
     - **urows**([]): Delivery JOB data Array
     - **key**: JENKINS ID
     - **tkt_name**: JENKINS name
     - **tkt_src_id**: Configuration management CI ID
     - **tkt_descr**: JENKINS description
     - **tkt_used**: 1: used, 2 not used
     - **tkt_order**: JOB order
     - **tkt_job_id**: JOB ID
     - **tkt_job_type**: JOB TYPE
     - **tkt_var**: JOB parameter value

🖥Build execution screen
  - URL: /dpl/dpl1000/dpl1000/selectDpl1000View.do
  -PARAM:
   - **key**: API communication encryption key
   - **current_date**: API request time value
   - **ticket_id**: Ticket ID
   - **dpl_id**: Distribution plan ID
   - **emp_id**: Deployment executor ID (user ID)
   - **job_type**([]): Screen output condition JOB TYPE
   - **ticket_list**([]): Ticket ID parameter required for operational distribution Array([{ticket_id: 'TICKET_ID'}])
   - **egene_dpl_id**: Distribution plan ID (ticket bundle ID) used in E-GENE

🖥Branch → Trunk Commit processing screen
  - URL: /rep/rep1000/rep1100/selectRep1100View.do
  - PARAM: 
    - **key**: API communication encryption key
    - **current_date**: API request time value
    - **ticket_id**: Ticket ID
    - **emp_id**: commit executor ID (user ID)

🖥Source repository → Distribution repository Commit processing screen
  - URL: /rep/rep1000/rep1100/selectRep1102View.do
  - PARAM: 
    - **key**: API communication encryption key
    - **current_date**: API request time value
    - **src_id**: Configuration item ID
    - **ticket_id**: Ticket ID
    - **emp_id**: commit executor ID (user ID)

🖥Distribution repository build target selection screen
  - URL: /rep/rep1000/rep1100/selectRep1103View.do
  - PARAM: 
    - **key**: API communication encryption key
    - **current_date**: API request time value
    - **src_id**: Configuration item ID
    - **ticket_id**: Ticket ID
    - **emp_id**: commit executor ID (user ID)

## 4.2 API
✔Save connection data (source repository, JENKINS)
  - URL: /api/insertCIRepJenJob
  - Content-Type: application/json
  - PARAM:
     - **REP_IDS**([]): Source repository ID Array
       - **rep_id**: Source repository ID
     - **JEN_JOB_IDS**([]): JENKINS JOB Array
       - **jen_id**: JENKINS ID
       - **job_id**: JOB ID
       - **job_param_list**([]): JOB parameter list
           - **job_param_key**: Parameter key
           - **job_param_val**: Parameter value
     - **Payloads** (before encryption):
        - **key**: API communication encryption key
        - **current_date**: API request time value
        - **ci_id**: Configuration item ID
        - **rep_ids**([]): Source repository ID Array
        - **jen_job_ids**([]): JOB ID Array
  - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **executed**: Number of successful saves
     - **total**: Total number of data
     - **etc_msg**: Detailed error message for failed data (newline separator: \n)

✔ Remove connection data (source repository, JENKINS)
  - URL: /api/deleteCIRepJenJob
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **REP_IDS**([]): Source repository ID Array
       - **rep_id**: Source repository ID
    - **JEN_JOB_IDS**([]): JENKINS JOB Array
       - **jen_id**: JENKINS ID
       - **job_id**: JOB ID
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **ci_id**: Configuration item ID
         - **rep_ids**([]): Source repository ID Array
         - **jen_job_ids**([]): JOB ID Array
  - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **executed**: Number of successful deletions
     - **total**: Total number of data
     - **etc_msg**: Detailed error message for failed data (newline separator: \n)

✔Search connection data by CI_ID (source repository, JENKINS)
  - URL: /api/selectCIRepList
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **ci_id**: Configuration item ID
    - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **data**([]): Source repository, JENKINS information Array
        - **rep_ids**([]): Source repository information Array
             - **ci_id**: Configuration item ID
             - **rep_id**: Source repository ID
             - **rep_nm**: Source repository name
             - **rep_txt**: Source repository description
             - **svn_rep_url**: SVN source repository URL
        - **jen_job_ids**([]): JENKINS Information Array
             - **ci_id**: Configuration item ID
             - **jen_id**: JENKINS ID
             - **jen_nm**: JENKINS name
             - **jen_url**: JENKINS URL
             - **jen_desc**: JENKINS description
             - **job_id**: JOB ID
             - **job_desc**: JOB description
             - **job_url**: JOB URL
             - **job_param_list**([]): JOB build parameter Array
                 - **ci_id**: Configuration item ID
                 - **jen_id**: JENKINS ID
                 - **job_id**: JOB ID
                 - **job_param_key**: JOB parameter key
                 - **job_param_val**: JOB input parameter value

✔REGISTER JENKINS ON TICKET
  - URL: /api/insertCITicketJobList
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **JEN_JOB_IDS**([]): JENKINS JOB Array
       - **jen_id**: JENKINS ID
       - **job_id**: JOB ID
       - **job_start_ord**: JOB order
       - **job_param_list**([]): JOB build parameter Array
           - **ci_id**: Configuration item ID
           - **jen_id**: JENKINS ID
           - **job_id**: JOB ID
           - **job_param_key**: JOB parameter key
           - **job_param_val**: JOB input parameter value
     - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **ci_id**: Configuration item ID
         - **ticket_id**: Ticket ID
         - **jen_job_ids**([]): JOB ID Array
   - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **executed**: Number of successful saves
     - **total**: Total number of data
     - **dpl_id**: Distribution plan ID
     - **ticket_id**: Ticket ID

✔Check build status data of JOB assigned to ticket
  - URL: /api/selectTicketJobInfo
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **ci_id**: Configuration item ID
         - **ticket_id**: Ticket ID
         - **dpl_id**: Distribution plan ID
   - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **data**([]): JENKINS build information Array
         - **ci_id**: Configuration item ID
         - **ticket_id**: Ticket ID
         - **dpl_id**: Distribution plan ID
         - **jen_id**: JENKINS ID
         - **jen_nm**: JENKINS name
         - **jen_url**([]): JOB Array
         - **jen_desc**: JENKINS description
         - **job_id**: JOB name
         - **job_ord**: JOB order
         - **job_type_nm**: JOB type name
         - **bld_num**: Last build number
         - **bld_result**: Last build result
         - **bld_duration_tm**: Last build time
         - **bld_start_dtm**: Build start time

✔Create a source repository branch
> Source repository URL/{BRANCH PATH}/{config prefix}_{ticket ID}\
> Branch Path can be registered/edited in the source repository management screen 
  - URL: /api/insertRepTicketBranchInfo
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **ticket_id**: Ticket ID
         - **rep_id**: Source repository ID
   - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **branch_nm**: Created branch name
     - **branch_path**: Created branch path

✔Run build
> View the list of files for operationally distributed tickets\
> Can be searched without including ci_id and rep_id among parameters (search by ticket_id)
  - URL: /api/actionJobBuild
  - Http Method: GET
  - Content-Type: application/json
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **job_key**: Encrypted KEY value consisting of JENKINS ID and JOB ID
             1. Enter JENKINS registration and modification management screen (/jen/jen1000/jen1000/selectJen1000View.do)
             2. JENKINS data selection
             3. Right-click on JOB data in the JOB management list.
             4. Select the ‘JOB Encryption Code Inquiry’ menu to check.
         - **rv**: revision value
   - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)

✔View revision data saved in a ticket
  - URL: /api/selectTicketRvDataList
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **ticket_id**: Ticket ID
    - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **ticket_rv_list**([]): Revision information Array
         - **ticket_id**: Ticket ID
         - **rep_id**: Source repository ID
         - **rep_cmt_date**: Commit date and time
         - **rep_cmt_author**: Commit author
         - **rep_rv**: Revision number (ID)
         - **rep_comment**: commit comment
         - **rep_chg_file_cnt**: Number of changed files
         - **rep_chg_file_list**([]): Change file Array
             - **ticket_id**: Ticket ID
             - **rep_id**: Source repository ID
             - **rep_rv**: Revision number (ID)
             - **rep_chg_id**: Change file ID
             - **rep_chg_type**: Change type (A: Added, M: Modified, D: Deleted)
             - **rep_chg_file_path**: Change file path
             - **rep_chg_file_nm**: Change file name

✔View the distribution repository build target file registered in the ticket
  - URL: /api/selectTicketDplFileDataList
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **ci_id**: Configuration item ID
         - **rep_id**: Source repository ID
         - **ticket_id**: Ticket ID
   - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **ticket_deploy_file_list**([]): Array of files to select deployment target
         - **ticket_id**: Ticket ID
         - **ci_id**: Configuration item ID
         - **rep_id**: Source repository ID
         - **rep_rv**: Revision number (ID)
         - **rep_chg_id**: Deployment change file ID
         - **job_id**: Operation JOB ID
         - **bld_num**: Operational build number
         - **rep_chg_type_cd**: File change type (01: Add, 02 Modify, 03 Delete)
         - **rep_chg_file_path**: Change file path
         - **rep_chg_file_nm**: Change file name
         - **rep_chg_file_kind**: Target file type (dir, file)
         - **commit_emp_id**: commit user

✔SVN source repository target path file lock setting
  - URL: /api/insertRepFileLock
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **emp_id**: lock setter ID
         - **rep_id**: Source repository ID
         - **ticket_id**: Ticket ID
         - **force**: Whether to force lock (String true, false)
         - **path_list**([]): lock target path Array
             - **path**: lock target path
   - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **total**: Total number of lock target paths
     - **executed**: Number of lock settings completed
     - **data**([]): Lock setting result data Array
         - **ticket_id**: Ticket ID
         - **rep_id**: Source repository ID
         - **lockPath**: LOCK target path
         - **lockUsrId**: LOCK setting user ID
         - **lockComment**: LOCK commit content
         - **lockStateCd**: LOCK state value (01: LOCK, 02: UNLOCK)
         - **lockForce**: Whether to force LOCK (String true, false)
         - **lockTargetRv**: LOCK target revision
         - **result**: LOCK setting result (true, false)
         - **resultMsg**: LOCK setting result message
         - **regDtm**: LOCK setting date and time
         - **regUsrId**: LOCK setting user ID
         - **regUsrIp**: LOCK setting user IP

✔SVN source repository destination path file UnLock settings
  - URL: /api/insertRepFileUnLock
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **emp_id**: lock setter ID
         - **rep_id**: Source repository ID
         - **ticket_id**: Ticket ID
         - **force**: Whether to force lock (String true, false)
         - **path_list**([]): lock target path Array
             - **path**: lock target path
             - **lock_id**: lock ID (lock token)
   - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **msg**: Result message content
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **total**: Total number of unlock target paths
     - **executed**: Number of unlock settings completed
     - **data**([]): Unlock setting result data Array
         - **ticket_id**: Ticket ID
         - **rep_id**: Source repository ID
         - **lockPath**: UNLOCK target path
         - **lockUsrId**: UNLOCK setting user ID
         - **lockStateCd**: UNLOCK state value (01: LOCK, 02: UNLOCK)
         - **lockForce**: Whether to force UNLOCK (String true, false)
         - **lockTargetRv**: UNLOCK target revision
         - **result**: UNLOCK setting result (true, false)
         - **resultMsg**: UNLOCK setting result message
         - **regDtm**: UNLOCK setting date and time
         - **regUsrId**: UNLOCK setting user ID
         - **regUsrIp**: UNLOCK setting user IP

✔View list of routes set to LOCK by ticket ID
> If there is a value of 'lock_target_rv' or 'lock_state_cd' in the parameter condition, the condition is applied to all data\
> If the above two parameters are not present in the parameter conditions, only the data currently set to LOCK is searched.
  - URL: /api/insertRepFileUnLock
  - Http Method: POST
  - Content-Type: application/json;charset=UTF-8
  - PARAM:
    - **Payloads** (before encryption):
         - **key**: API communication encryption key
         - **current_date**: API request time value
         - **ticket_id**: Ticket ID
         - **lock_target_rv**: Target revision condition (all if none)
         - **lock_state_cd**: lock state value (01: lock, 02: unlock, if not present, all)
   - Response Definition:
     -**result**:
         - SUCCESS: success
         - FAIL: Request information is incorrect (failure while processing parameter information)
         - ERROR: An error occurred during API processing.
     - **error_code**: Forwarding property when an error occurs (see Error Code Chapter 3)
     - **data**([]): lock data Array
         - **ticket_id**: Ticket ID
         - **rep_id**: Source repository ID
         - **rep_nm**: Source repository name
         - **lock_id**: LOCK ID (LOCK TOKEN)
         - **lock_path**: LOCK target path
         - **lock_usr_id**: LOCK setting user ID
         - **lock_comment**: LOCK commit comment
         - **lock_state_cd**: LOCK state value (01: LOCK, 02: UNLOCK)
         - **lock_state_nm**: LOCK state name
         - **lock_force**: Whether to force LOCK (String true, false)
         - **lock_target_rv**: LOCK target revision number
         - **reg_dtm**: LOCK setting date and time
         - **reg_usr_id**: LOCK setting user ID
         - **reg_usr_ip**: LOCK setting user IP

## 4.3 Error Code
| Error Code | Description |
| --- | --- |
| 001 | Parameter DATA No value |
| 002 | Authentication KEY error (invalid KEY) |
| 003 | Parameter ‘CI_ID’ has no value |
| 004 | Data decryption error |
| 005 | Parameter ‘TICKET_ID’ has no value |
| 006 | Parameter ‘REP_ID’ has no value |
| 007 | Parameter 'DPL_ID' has no value |
| 008 | JOB_ID information not found |
| 009 | There is no source repository information corresponding to REP_ID |
| 010 | There is no JENKINS&JOB information corresponding to JEN_ID and JOB_ID |
| 011 | No registered data |
| 012 | Data check failed |
| 013 | No data deleted |
| 014 | Parameter 'PATH_LIST' has no value |
| 100 | Error saving configuration items |
| 101 | No configuration item storage data (source repository, JENKINS) |
| 102 | Error extracting configuration item `source repository` parameters |
| 103 | Error extracting configuration item `JENKINS&JOB` parameters |
| 200 | Branch name duplicate |
| 201 | Source repository unique identification ID 'UUID' has no value |
| 202 | Source repository revision 'rv' has no value |
| 203 | No copy destination in trunk path |
| 204 | Error occurred while LOCKing file |
| 205 | An error occurred while searching the REP_ID value using the source repository UUID |
| 300 | JENKINS connection failure |
| 301 | The corresponding JOB is already running |
| 302 | No build number information |
| 400 | Ticket validation error |
| 999 | Error processing within server |




# 📜 5. License information

- LUNA™ PIPE is licensed under the GPL3.0 License. For the full license text, see ([GPL3.0 License Information](https://www.olis.or.kr/license/Detailselect.do?lId=1072)).
