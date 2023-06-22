var globals_guideContents =
	{
		// SVN 저장소 관리
		"rep1000":   
			[  {id:"repGuide_rep1000button",target:"rep1000button",mainTitle:"[소스 저장소 등록관리]",top:228,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fas fa-angle-double-right' title='전체 접속확인'></i>&nbsp;전체 접속확인", content:"버튼 클릭 시 등록된 모든 소스저장소의 접속 여부를 체크합니다. " +
							"<br/><i class='fas fa-check-circle result-success'></i> 정상접속, <i class='fas fa-times-circle result-fail'></i> 접속실패"}
						,{title:"<i class='fas fa-angle-double-right' title='선택 접속확인'></i>&nbsp;선택 접속확인", content:"목록에서 선택한 소스 저장소의 접속 여부를 체크합나다."}
						,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"등록된 소스 저장소를 조회합니다."}
						,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록", content:"[팝업] 소스 저장소를 등록합니다."}
						,{title:"<i class='fa fa-edit' title='수정'></i>&nbsp;수정", content:"[팝업] 목록에서 선택한 소스 저장소를 수정합니다."}
						,{title:"<i class='fa fa fa-trash-alt' title='삭제'></i>&nbsp;삭제", content:"목록에서 선택한 소스 저장소를 삭제합니다."}
						,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"소스 저장소 목록을 엑셀 파일로 다운로드 합니다."}
						,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"소스 저장소 목록을 프린트 합니다."}					
				         ]},
		         {id:"rep1000Guide_grid",target:"grid",mainTitle:"[소스 저장소 목록]",top:505,left:146,position:"left",targetPosition:"left", curve:false
						,subBox:[
						         	{title:"<i class='fas fa fa-list' title='소스 저장소 목록'></i>&nbsp;소스 저장소 목록", content:"시스템에 등록된 소스저장소 목록이 표시됩니다."}
								]}      
			]
		,// 저장소 관리
		"rep1001":   
			[  {id:"repGuide_svnUrl",target:"svnUrl",mainTitle:"[URL]",top:39,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"SVN REPOSITORY의 URL을 입력합니다."}						     
				         ]
			    }
			 , {id:"repGuide_svnUser",target:"svnUser",mainTitle:"[USER]",top:277,left:24,position:"right",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"SVN 접속가능한 사용자 계정의 ID를 입력합니다."}						     
				         ]
			  }
			 , {id:"repGuide_svnPassword",target:"svnPassword",mainTitle:"[PASSWORD]",top:206,left:205,position:"right",targetPosition:"right"
					,subBox:[
					         {title:"<i></i>",content:"SVN 접속가능한 사용자 계정의 PASSWORD를 입력합니다."}						     
					         ]
				  }
			]
		,// SVN 저장소 관리
		"rep2000":   
			[  {id:"repGuide_rep2000button",target:"rep2000button",mainTitle:"[SVN 저장소 등록관리]",top:228,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fas fa-angle-double-right' title='접속확인'></i>&nbsp;접속확인",content:"등록된 SVN 저장소 정보가 정상적인지 확인합니다."}						     
				         ]
			}
			
			]
		,// JENKINS 저장소 등록관리
		"jen1000":   
				[{id:"jen1000_jenkinsBtn",target:"jen1000JenkinsBtn",mainTitle:"[JENKINS 목록 그리드 버튼영역]",top:10,left:800,position:"left",targetPosition:"right", curve:false
					,subBox:[
								{title:"<i class='fas fa-angle-double-right' title='전체 접속확인'></i>&nbsp;전체 접속확인", content:"버튼 클릭 시 등록된 모든 JENKINS의 접속 여부를 체크합니다. " +
										"<br/><i class='fas fa-check-circle result-success'></i> 정상접속, <i class='fas fa-times-circle result-fail'></i> 접속실패"}
								,{title:"<i class='fas fa-angle-double-right' title='선택 접속확인'></i>&nbsp;선택 접속확인", content:"목록에서 선택한 JENKINS의 접속 여부를 체크합나다."}
								,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"등록된 JENKINS를 조회합니다."}
								,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록", content:"[팝업] JENKINS를 등록합니다."}
								,{title:"<i class='fa fa-edit' title='수정'></i>&nbsp;수정", content:"[팝업] 목록에서 선택한 JENKINS를 수정합니다."}
								,{title:"<i class='fa fa fa-trash-alt' title='삭제'></i>&nbsp;삭제", content:"목록에서 선택한 JENKINS를 삭제합니다."}
								,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"JENKINS 목록을 엑셀 파일로 다운로드 합니다."}
								,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"JENKINS 목록을 프린트 합니다."}						     
					         ]},
				{id:"jen1000_jenkinsList",target:"jen1000JenkinsList",mainTitle:"[JENKINS 목록]",top:195,left:120,position:"right",targetPosition:"right", curve:false
					,subBox:[
						       {title:"<i class='fas fa fa-list' title='JENKINS 목록'></i>&nbsp;JENKINS 목록",content:"시스템에 등록된 JENKINS 목록이 표시됩니다. <br/>JENKINS 클릭 시 등록된 JOB 목록이 오른쪽 그리드에 표시됩니다."}
						    ]},
				{id:"jen1000_jobBtn",target:"jen1000JobBtn",mainTitle:"[JENKINS JOB 목록 그리드 버튼영역]",top:560,left:850,position:"top",targetPosition:"right", curve:false
					,subBox:[
						         {title:"<i class='fas fa-angle-double-right' title='전체 접속확인'></i>&nbsp;전체 접속확인", content:"버튼 클릭 시 등록된 모든 JOB의 접속 여부를 체크합니다. " +
										"<br/><i class='fas fa-check-circle result-success'></i> 정상접속, <i class='fas fa-times-circle result-fail'></i> 접속실패"}
								 ,{title:"<i class='fas fa-angle-double-right' title='선택 접속확인'></i>&nbsp;선택 접속확인", content:"목록에서 선택한 JOB의 접속 여부를 체크합나다."}
								 ,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"등록된 JOB을 조회합니다."}
								 ,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록", content:"[팝업] JOB을 등록합니다."}
								 ,{title:"<i class='fa fa-edit' title='수정'></i>&nbsp;수정", content:"[팝업] 목록에서 선택한 JOB을 수정합니다. <br/>JENKINS에 일치하는 JOB이 없을 경우 수정 할 수 없습니다."}
								 ,{title:"<i class='fa fa fa-trash-alt' title='삭제'></i>&nbsp;삭제", content:"목록에서 선택한 JOB을 삭제합니다."}
								 ,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"JOB 목록을 엑셀 파일로 다운로드 합니다."}
								 ,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"JOB 목록을 프린트 합니다."}						     
							]},	
				{id:"jen1000_jobList",target:"jen1000JobList",mainTitle:"[JENKINS JOB 목록]",top:595,left:120,position:"right",targetPosition:"right", curve:false
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='JOB 목록'></i>&nbsp;JOB 목록",content:"왼쪽 JENKINS 클릭 시 등록된 JOB 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-edit' title='더블클릭'></i>&nbsp;더블클릭", content:"[팝업] JOB을 더블클릭 할 경우 JOB 수정 팝업이 나타납니다. <br/>JENKINS에 일치하는 JOB이 없을 경우 수정 할 수 없습니다."}
							]}		
			]
		,// JENKINS 설정 관리
		"jen1001":   
			[  {id:"jenGuide_jenkinsInfo",target:"jenkinsInfo",mainTitle:"[JENKINS 설정]",top:304,left:146,position:"top",targetPosition:"top", curve: false
				,subBox:[
				         {title:"<i></i>",content:"URL : JEKINS 시스템의 접속 URL(http://URL:PORT/jenkins/)에<br/>jenkins/을 제거(http://URL:PORT/)하고 입력합니다 ."}
				         ,{title:"<i></i>",content:"USER : JEKINS 시스템의 접속가능한 사용자 ID를 입력합니다."}
				         ,{title:"<i></i>",content:"USER TOKEN KEY : JEKINS 시스템의 접속가능한 사용자의 API TOKEN을 가져와 입력합니다."}
				         ,{title:"<i></i>",content:"Job 명 : JEKINS 시스템의 등록된 JOB 정보를 입력합니다."}
				         ,{title:"<i></i>",content:"TOKEN KEY : JEKINS 시스템의 JOB 정보에 빌드 유발 KEY를 가져와 입력합니다."}
				         ]
			}
			
			]
		,// JENKINS 설정 관리(JOB 등록 팝업)
		"jen1002":   
			[  {id:"jen1002Guide_jobInfo",target:"jobInfo",mainTitle:"[JOB 설정]",top:304,left:46,position:"top",targetPosition:"top", curve: false
				,subBox:[
				         {title:"<i></i>",content:"- JOB ID(NAME) : JENKINS에 생성한 JOB을 선택합니다."}
				         ,{title:"<i></i>",content:"- 원복 JOB ID(NAME) : 원복 JOB이 있을 경우 원복 JOB을 선택합니다."}
				         ,{title:"<i></i>",content:"- TOKEN KEY : JEKINS 시스템에서 해당 JOB에서 설정한 Authentication Token을 입력합니다."}
				         ]
			}
			
			]
		,// SVN 저장소 배정관리 관리
		"rep2100":   
			[  {id:"repGuide_rep2100button",target:"rep2100button",mainTitle:"[SVN 저장소 배정관리]",top:228,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fas fa fa-save' title='SVN리비젼 확인'></i>&nbsp;SVN리비젼 확인",content:"권한 부여된 SVN 저장소 정보를 조회합니다."}
				         ,{title:"<i class='fas fa fa-save' title='역할그룹 설정'></i>&nbsp;역할그룹 설정",content:"SVN 저장소를 사용가능한 역할 그룹을 지정합니다."}
				         ,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록",content:"프로젝트에 SVN 저장소를 권한 배정합니다."}
				         ]
			}
			
			]
		,// JENKINS 저장소 배정관리 관리
		"rep3100":   
			[  {id:"repGuide_rep3100button",target:"rep3100button",mainTitle:"[JENKINS 저장소 배정관리 버튼영역]",top:290,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fas fa fa-save' title='배포 권한 설정'></i>&nbsp;배포 권한 설정",content:"[팝업] JENKINS 저장소를 사용 가능한 역할 그룹을 지정합니다."}
				         ,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"프로젝트에 배정된 JENKINS JOB을 조회합니다."}
				         ,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록", content:"[팝업] 프로젝트에 JENKINS JOB을 배정합니다."}
				         ,{title:"<i class='fa fa fa-trash-alt' title='삭제'></i>&nbsp;삭제", content:"프로젝트에 배정된 JENKINS JOB을 배정제외 합니다."}
				         ,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"프로젝트에 배정된 JENKINS JOB 목록을 엑셀 파일로 다운로드 합니다."}
				         ,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"프로젝트에 배정된 JENKINS JOB 목록을 프린트합니다."}
				         ]},
				{id:"repGuide_rep3100projectListTree",target:"rep3100projectListTree",mainTitle:"[JENKINS JOB을 배정하기 위한 프로젝트 목록]",top:677,left:380,position:"top",targetPosition:"bottom"
				,subBox:[
				         {title:"프로젝트 목록",content:"JENKINS JOB을 배정하기 위한 프로젝트 목록이 트리 형태로 표출됩니다."}
				         ]},
				{id:"repGuide_rep3100prjAddJobGrid",target:"rep3100prjAddJobGrid",mainTitle:"[프로젝트에 배정된 JENKINS JOB 목록]",top:500,left:380,position:"right",targetPosition:"right"
				,subBox:[
						 {title:"프로젝트에 배정된 JOB 목록",content:"조회 또는 왼쪽 트리에서 프로젝트 선택 시 프로젝트에 배정된 JENKINS JOB 목록이 표시됩니다."}
						]}
			
			]
		// 배포 계획 생성 관리
		,"dpl1000":
				[{id:"dpl1000Guide_DplBtn",target:"dpl1000button",mainTitle:"[배포 계획 생성 관리 버튼영역]",top:264,left:798,position:"top",targetPosition:"bottom", curve:false
					,subBox:[
								{title:"<i class='fas fa fa-list' title='목록 수'></i>&nbsp;목록 수", content:"그리드 한 페이지에 표시될 배포 계획 목록 수를 지정합니다."}
								,{title:"<i class='fas fa-sort-amount-down' title='목록 높이'></i>&nbsp;목록 높이", content:"배포 계획 목록 그리드의 높이를 변경합니다."}
						        ,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"등록된 배포계획을 조회합니다."}
						        ,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록", content:"[팝업] 배포 계획을 등록합니다."}
						        ,{title:"<i class='fa fa-edit' title='수정'></i>&nbsp;수정", content:"[팝업] 배포 계획을 수정합니다. <br/>결재 상태가 승인 또는 배포 상태가 성공인 경우 수정할 수 없습니다."}
						        ,{title:"<i class='fa fa fa-trash-alt' title='삭제'></i>&nbsp;삭제", content:"그리드에서 체크한 배포 계획을 삭제 합니다."}
						        ,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"배포 계획 목록을 엑셀 파일로 다운로드 합니다."}
						        ,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"배포 계획 목록을 프린트 합니다."}
					         ]},
				{id:"dpl1000Guide_DplList",target:"dpl1000Grid",mainTitle:"[배포 계획 목록]",top:384,left:130,position:"lefr",targetPosition:"left", curve:false
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='배포 계획 목록'></i>&nbsp;배포 계획 목록", content:"시스템에 등록된 배포 계획 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-search' title='배포 계획 상세보기'></i>&nbsp;배포 계획 상세보기", content:"[팝업] 배포 계획 목록에서 배포 계획을 더블클릭 하면, <br/>해당 배포 계획의 상세보기 팝업이 나타납니다."}
							]}      
				]
		// 배포 계획 등록/수정 팝업
		,"dpl1001":
			[{id:"dpl1001_dplInfo",target:"dpl1001dplInfo",mainTitle:"[배포 계획 정보 입력 영역]",top:570,left:350,position:"left",targetPosition:"bottom", curve:false
				,subBox:[
					        {title:"<i class='fa fa-edit' title='배포 계획 정보'></i>&nbsp;배포 계획 정보", content:"배포 계획 정보를 입력합니다. 입력 값 중 <font color='#ff1a00'>*</font> 표시된 값은 필수 입력값입니다."}
					        ,{title:"배포 상태", content:"배포 상태를 지정합니다. 배포 계획 등록 시에는 배포 상태가 대기로 고정됩니다."}
					        ,{title:"배포 방법", content:"배포 방법을 지정합니다. 배포 방법이 자동일 경우<br/> 배포 실패 후 처리, 자동 실행 일시, 원복 타입을 지정해야 합니다."}
					        ,{title:"실패 후 처리", content:"배포 방법이 자동일 경우의 배포 실패 후 처리를 지정합니다. "}
					        ,{title:"원복 타입", content:"자동 배포 실패 시 원복 타입을 지정합니다."}
				         ]},
			{id:"dpl1001_dplJobBtn",target:"dpl1001dplJobBtn",mainTitle:"[배포 계획 JOB 배정 버튼영역]",top:207,left:459,position:"top",targetPosition:"bottom"
				,subBox:[
				         	{title:"<i class='fas fa-long-arrow-alt-up' title='위로'></i>&nbsp;위로", content:"배정할 JOB 목록에서 체크한 JOB을 위로 올립니다."}
							,{title:"<i class='fas fa-long-arrow-alt-down' title='아래로'></i>&nbsp;아래로", content:"배정할 JOB 목록에서 체크한 JOB을 아래로 내립니다."}	
					        ,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록", content:"[팝업] 등록 클릭 시 배포 계획에 배정할 JOB을 선택하는 팝업 창을 오픈합니다."}
						    ,{title:"<i class='fa fa fa-trash-alt' title='삭제'></i>&nbsp;삭제", content:"배정 JOB 목록에서 체크한 JOB을 삭제합니다."}		
						 ]},
			{id:"dpl1001_dplJobInfo",target:"dpl1001dplJobInfo",mainTitle:"[배포 계획 JOB 배정 목록]",top:440,left:500,position:"right",targetPosition:"right", curve:false
				,subBox:[
				         	{title:"배정 JOB 목록", content:"배포 계획에 배정할 JOB 목록이 표시됩니다."}
						]}  			 
		]
		,"dpl1003":
			[{id:"dpl1003_dplInfo",target:"dpl1003dplInfo",mainTitle:"[배포 계획 정보]",top:520,left:90,position:"bottom",targetPosition:"bottom", curve:false
				,subBox:[
					        {title:"<i class='fa fa-edit' title='배포 계획 정보'></i>&nbsp;배포 계획 정보", content:"배포 계획의 정보가 표시됩니다."}
				         ]},
			{id:"dpl1003_dplReq",target:"dpl1003DplReq",mainTitle:"[배포 계획 배정된 요구사항]",top:190,left:459,position:"top",targetPosition:"top", curve:false
				,subBox:[
				         	{title:"<i class='fas fa fa-list' title='배정된 요구사항'></i>&nbsp;배정된 요구사항", content:"해당 배포계획에 배정된 요구사항 목록을 보여줍니다."}
				         	,{title:"<i class='fa fa-search' title='요구사항 상세보기'></i>&nbsp;요구사항 상세보기", content:"[팝업] 요구사항을 더블클릭 하면 <br/>해당 요구사항의 상세보기 팝업이 나타납니다."}
						 ]},
			{id:"dpl1003_dplHistory",target:"dpl1003DplHistory",mainTitle:"[배포 이력 정보]",top:330,left:540,position:"bottom",targetPosition:"right", curve:false
				,subBox:[
				         	{title:"전체 이력", content:"해당 배포 계획의 전체 이력이 시간순으로 표시됩니다."}
				         	,{title:"빌드 이력", content:"해당 배포 계획의 빌드 이력이 시간순으로 표시됩니다."}
				         	,{title:"결재 이력", content:"해당 배포 계획의 결재 이력이 시간순으로 표시됩니다."}
				         	,{title:"<i class='fas fa-expand' title='이력 창 확대'></i>&nbsp;이력 창 확대", content:"<i class='fas fa-expand'></i> 버튼을 클릭하면 이력창을 확대하여 볼 수 있습니다."}
				         	,{title:"<i class='fas fa-desktop' title='콘솔 로그 보기'></i>&nbsp;콘솔 로그 보기", content:"전체 이력, 빌드 이력에 있는 <i class='fas fa-desktop'></i> 버튼 클릭 시 해당 이력의 <br/>콘솔 로그를 볼 수 있습니다."}
				         ]}  			 
		]
		//배포 버전 요구사항 배정
		,"dpl1100":
			[{id:"dpl1100Guide_dplList",target:"dpl1100DplList",mainTitle:"[배포 계획 목록]",top:500,left:120,position:"top",targetPosition:"left"
				,subBox:[
					       {title:"<i class='fas fa fa-list' title='배포 계획 목록'></i>&nbsp;배포 계획 목록",content:"시스템에 등록된 배포 계획 목록이 표시됩니다. <br/>배포 계획 선택 시 오른쪽에 배포계획에 배정된 요구사항 및 <br/>미배정된 요구사항이 표시됩니다."}
					       ,{title:"<i class='fa fa-search' title='배포 계획 상세보기'></i>&nbsp;배포 계획 상세보기", content:"[팝업] 배포 계획 목록에서 배포 계획을 더블클릭 하면, <br/>해당 배포 계획의 상세보기 팝업이 나타납니다."}
					    ]},
				 
			{id:"dpl1100Guide_assignDplReqList",target:"assignDpl1100ReqList",mainTitle:"[배포 계획 배정 요구사항]",top:300,left:700,position:"right",targetPosition:"right", curve:false
				,subBox:[
					        {title:"배정된 요구사항",content:"배포 계획에 배정된 요구사항 목록입니다. </br>업무 화면에서 배포 계획을 지정하면, 요구사항이 배포 계획에 배정됩니다.</br>배정된 요구사항 목록에서 요구사항에 체크를 하고 [제외<img src='/images/contents/bottom_red.png' alt='아래쪽 화살표' style='margin-left: 5px;'>] 버튼을 클릭 </br>하면 해당 요구사항이 배포 계획에서 제외됩니다."}
					        ,{title:"<i class='fa fa-search' title='요구사항 상세보기'></i>&nbsp;요구사항 상세보기", content:"[팝업] 배정 요구사항 목록에서 요구사항을 더블클릭 하면, <br/>해당 요구사항의 상세보기 팝업이 나타납니다."}
					    ]},
			{id:"dpl1100Guide_notAssignDplReqList",target:"notAssignDpl1100ReqList",mainTitle:"[배포 계획 미배정 요구사항]",top:770,left:700,position:"right",targetPosition:"right", curve:false
				,subBox:[
					        {title:"미배정된 요구사항",content:"배포 계획에 배정되지 않은 요구사항 목록입니다. </br>미배정된 요구사항 목록에서 요구사항에 체크를 하고 </br>[<img src='/images/contents/top_blue.png' alt='위쪽 화살표' style='margin-right: 5px;'>배정] 버튼을 클릭하면 하면 해당 요구사항이 </br>선택한 배포 계획에 배정됩니다."}
					        ,{title:"<i class='fa fa-search' title='요구사항 상세보기'></i>&nbsp;요구사항 상세보기", content:"[팝업] 미배정 요구사항  목록에서 요구사항을 더블클릭 하면, <br/>해당 요구사항의 상세보기 팝업이 나타납니다."}
					    ]}                  
		]
		// 배포 계획 결재 요청현황
		,"dpl2000":
				[{id:"dpl2000_dplSignGrid",target:"dplSignGrid",mainTitle:"[배포 계획 결재 요청 목록]",top:410,left:200,position:"left",targetPosition:"left",curve:false
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='배포 계획 결재 요청 목록'></i>&nbsp;배포 계획 결재 요청 목록",content:"배포 계획의 결재 요청 목록이 표시됩니다. <br/>결재 요청 목록은 로그인한 사용자가 올린 배포 계획 결재 요청만 표시됩니다."}
					         	,{title:"<i class='fa fa-search' title='배포 계획 상세보기'></i>&nbsp;배포 계획 상세보기", content:"[팝업] 배포 계획 결재 요청 목록에서 배포 계획을 더블클릭 하면, <br/>해당 배포 계획의 상세보기 팝업이 나타납니다."}
					         ]},
				{id:"dpl2000_dplSignGridBtn",target:"dplSignGridBtn",mainTitle:"[배포 계획 결재 요청 목록 버튼영역]",top:250,left:780,position:"right",targetPosition:"right"
					,subBox:[
								{title:"<i class='fas fa fa-list' title='목록 수'></i>&nbsp;목록 수", content:"그리드 한 페이지에 표시될 배포 계획 결재 요청 목록 수를 지정합니다."}
								,{title:"<i class='fas fa-sort-amount-down' title='목록 높이'></i>&nbsp;목록 높이", content:"결재 요청 목록 그리드의 높이를 변경합니다."}
								,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"등록된 배포 계획 결재 요청 목록을 조회합니다."}
								,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"배포 계획 결재 요청 목록을 엑셀 파일로 다운로드 합니다."}
								,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"배포 계획 결재 요청 목록을 프린트 합니다."}
					         ]}
				]
		// 배포 계획 결재 승인관리
		,"dpl2100":
				[{id:"dpl2100_dplSignGrid",target:"dplSignApprovalGrid",mainTitle:"[배포 계획 결재 목록]",top:410,left:200,position:"left",targetPosition:"left",curve:false
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='배포 계획 결재 목록'></i>&nbsp;배포 계획 결재 목록",content:"배포 계획의 결재 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-search' title='배포 계획 상세보기'></i>&nbsp;배포 계획 상세보기", content:"[팝업] 배포 계획 결재 목록에서 배포 계획을 더블클릭 하면, <br/>해당 배포 계획의 상세보기 팝업이 나타납니다. <br/>배포 계획의 결재자일 경우 상세보기 팝업에서 결재 승인/반려를 할 수 있습니다."}
					         ]},
				{id:"dpl2100_dplSignGridBtn",target:"ddplSignApprovalGridBtn",mainTitle:"[배포 계획 결재 목록 버튼영역]",top:300,left:920,position:"top",targetPosition:"bottom",curve:false
					,subBox:[
								{title:"<i class='fa fa-check' title='승인'></i>&nbsp;승인", content:"결재 요청 배포 계획을 승인합니다. 결재 상태가 대기인 배포 계획만 승인 가능합니다."}
								,{title:"<i class='fa fa-trash-alt' title='반려'></i>&nbsp;반려", content:"결재 요청 배포 계획을 반려합니다. 결재 상태가 대기인 배포 계획만 반려 가능합니다."}
								,{title:"<i class='fas fa fa-list' title='목록 수'></i>&nbsp;목록 수", content:"그리드 한 페이지에 표시될 배포 계획 결재 목록 수를 지정합니다."}
								,{title:"<i class='fas fa-sort-amount-down' title='목록 높이'></i>&nbsp;목록 높이", content:"결재 목록 그리드의 높이를 변경합니다."}
								,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"등록된 배포 계획 결재 목록을 조회합니다."}
								,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"배포 계획 결재 목록을 엑셀 파일로 다운로드 합니다."}
								,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"배포 계획 결재 목록을 프린트 합니다."}
					         ]}
				]
		// 배포 계획 실행
		,"dpl3000":
				[{id:"dpl3000_dplList",target:"dpl3000DplList",mainTitle:"[배포 계획 목록]",top:30,left:700,position:"bottom",targetPosition:"top",curve:false	
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='배포 계획 목록'></i>&nbsp;배포 계획 목록",content:"실행할 배포 계획 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-search' title='배포 계획 상세보기'></i>&nbsp;배포 계획 상세보기", content:"[팝업] 배포 계획 목록에서 배포 계획을 더블클릭 하면, <br/>해당 배포 계획의 상세보기 팝업이 나타납니다."}
					         ]},
				{id:"dpl3000_dplJobList",target:"dpl3000DplJobList",mainTitle:"[JOB 배정 목록]",top:590,left:160,position:"left",targetPosition:"left",curve:false	
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='진행 상태'></i>&nbsp;진행 상태",content:"JOB 실행의 진행 상태가 표시됩니다. <br/>배포 방법이 수동일 경우 [<i class='fa fa-play-circle'></i>수동 실행 버튼]이 표시됩니다."}
					         	,{title:"<i class='fas fa fa-list' title='JOB 배정 목록'></i>&nbsp;JOB 배정 목록",content:"상단에서 선택한 배포 계획에 배정된 JOB 목록이 표시됩니다."}
					         ]}, 
			    {id:"dpl3000_jobConsolLog",target:"dpl3000JobConsolLog",mainTitle:"[JOB 콘솔로그 영역]",top:590,left:900,position:"left",targetPosition:"left",curve:false	
					,subBox:[
					         	{title:"콘솔 로그",content:"JOB 배정 목록에서 선택한 JOB의 콘솔 로그가 표시됩니다. <br/>콘솔 로그 상단에는 JOB 배정목록과 콘솔 로그를 확대할 수 있는 <br/><i class='fas fa-expand'></i> 버튼이있습니다."}
							]} 	         
				]
		// 배포 계획 통합 정보
		,"dpl4000":
				[{id:"dpl4000_dplList",target:"dpl4000DplList",mainTitle:"[배포 계획 목록]",top:30,left:700,position:"bottom",targetPosition:"top",curve:false	
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='배포 계획 목록'></i>&nbsp;배포 계획 목록",content:"실행할 배포 계획 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-search' title='배포 계획 상세보기'></i>&nbsp;배포 계획 상세보기", content:"[팝업] 배포 계획 목록에서 배포 계획을 더블클릭 하면, <br/>해당 배포 계획의 상세보기 팝업이 나타납니다."}
					         ]},
				{id:"dpl4000_dplJobList",target:"dpl4000DplJobList",mainTitle:"[JOB 배정 목록]",top:720,left:950,position:"left",targetPosition:"left",curve:false	
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='JOB 배정 목록'></i>&nbsp;JOB 배정 목록",content:"상단에서 선택한 배포 계획에 배정된 JOB 목록이 표시됩니다."}
					         ]}, 
			    {id:"dpl4000_dplAddReq",target:"dpl4000DplAddReq",mainTitle:"[요구사항 배정 목록]",top:670,left:160,position:"left",targetPosition:"left",curve:false	
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='요구사항 배정 목록'></i>&nbsp;요구사항 배정 목록",content:"상단에서 선택한 배포 계획에 배정된 요구사항 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-search' title='요구사항 상세보기'></i>&nbsp;요구사항 상세보기", content:"[팝업] 요구사항 배정 목록에서 요구사항을 더블클릭 하면, <br/>해당 요구사항의 상세보기 팝업이 나타납니다."}
							]} 	 
				]
		//SVN 리비젼 선택
		,"cmm1400":
			[{id:"cmm1400Guide_repositoryList",target:"repositoryList",mainTitle:"[SVN 저장소 목록]",top:177,left:37,position:"left",targetPosition:"top"
				,subBox:[
				         {title:"<i></i>",content:"프로젝트에 부여된 SVN 저장소 목록을 조회합니다."}
				         ]},
			{id:"cmm1400Guide_revisionList",target:"revisionList",mainTitle:"[SVN REVISION 목록]",top:190,left:499,position:"right",targetPosition:"right"
				,subBox:[
				         {title:"<i></i>",content:"SVN 저장소에 반영된 리비젼 목록을 조회합니다."}
				         ]},
			{id:"cmm1400Guide_fileTree",target:"fileTree",mainTitle:"[REVISION 반영 파일 경로]",top:539,left:62,position:"top",targetPosition:"top"
				,subBox:[
				         {title:"<i></i>",content:"선택한 REVISION에 반영된 파일 경로를 조회합니다."}
				         ]},
			{id:"cmm1400Guide_fileList",target:"fileList",mainTitle:"[REVISION 반영 파일 목록]",top:613,left:834,position:"top",targetPosition:"top"	
				,subBox:[
				         {title:"<i></i>",content:"선택한 REVISION에 반영된 파일 목록을 조회합니다."}
				         ]}								         
			]
	}