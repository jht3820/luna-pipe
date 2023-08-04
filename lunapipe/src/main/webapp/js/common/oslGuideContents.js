var globals_guideContents =
	{
		
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
		,
		"rep1001":   
			[  {id:"repGuide_svnUrl",target:"svnUrl",mainTitle:"[URL]",top:100,left:280,position:"left",targetPosition:"left", curve:false
				,subBox:[
				         {title:"<i></i>",content:"SVN REPOSITORY의 URL을 입력합니다."}						     
				         ]
			    }
			 , {id:"repGuide_svnUser",target:"svnUser",mainTitle:"[USER]",top:277,left:24,position:"top",targetPosition:"bottom", curve:false
				,subBox:[
				         {title:"<i></i>",content:"SVN 접속가능한 사용자 계정의 ID를 입력합니다."}						     
				         ]
			  }
			 , {id:"repGuide_svnPassword",target:"svnPassword",mainTitle:"[PASSWORD]",top:340,left:205,position:"top",targetPosition:"bottom", curve:false
					,subBox:[
					         {title:"<i></i>",content:"SVN 접속가능한 사용자 계정의 PASSWORD를 입력합니다."}						     
					         ]
				  }
			 , {id:"repGuide_svnTree",target:"rep1001SvnTree",mainTitle:"[SVN 구조 목록]",top:200,left:535,position:"bottom",targetPosition:"bottom", curve:false
				 ,subBox:[
					 {title:"<i></i>",content:"SVN 접속 정보 입력 후 `접속 체크` 버튼 클릭 시 저장소 내부 구조가 표시됩니다."}						     
					 ]
			 }
			]
		,
		"rep1002":   
			[  {id:"repGuide_repBtn",target:"rep1002RepBtn",mainTitle:"[소스저장소 리비전 버튼 영역]",top:100,left:280,position:"left",targetPosition:"left", curve:false
				,subBox:[
					{title:"<i class='fas fa-search' title='리비전 범위'></i>&nbsp;리비전 범위", content:"선택 소스저장소의 리비전 표시 범위를 지정합니다. "}
					,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"선택 소스저장소의 리비전 목록을 조회합니다."}
					,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"리비전 목록을 엑셀 파일로 다운로드 합니다."}
					,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"리비전 목록을 프린트 합니다."}						     
					]
			}
			, {id:"repGuide_repList",target:"rep1002RepList",mainTitle:"[소스저장소 리비전 목록]",top:355,left:200,position:"left",targetPosition:"left", curve:false
				,subBox:[
					{title:"<i></i>",content:"소스저장소에 변경 리비전 목록을 표시합니다."}						     
					]
			}
			, {id:"repGuide_repCommitLog",target:"rep1002RepCommitLog",mainTitle:"[선택 리비전 코멘트]",top:340,left:205,position:"top",targetPosition:"bottom", curve:false
				,subBox:[
					{title:"<i></i>",content:"상단 리비전 목록에서 선택된 리비전의 코멘트 내용입니다."}						     
					]
			}
			, {id:"repGuide_repChgLog",target:"rep1002RepChgLog",mainTitle:"[선택 리비전 변경 파일 목록]",top:550,left:135,position:"top",targetPosition:"top", curve:false
				,subBox:[
					{title:"<i></i>",content:"상단 리비전 목록에서 선택된 리비전의 파일 변경 목록입니다."}						     
					]
			}
			]
		,
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
								 {title:"<i class='fas fa-angle-double-right' title='빌드 이력 동기화'></i>&nbsp;빌드 이력 동기화", content:"JENKINS JOB 빌드 이력 데이터를 동기화합니다."}
						         ,{title:"<i class='fas fa-angle-double-right' title='전체 접속확인'></i>&nbsp;전체 접속확인", content:"버튼 클릭 시 등록된 모든 JOB의 접속 여부를 체크합니다. " +
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
					         	,{title:"<i class='fa fa-edit' title='더블클릭'></i>&nbsp;더블클릭", content:"[팝업] JOB을 더블클릭 할 경우 JOB 빌드 이력 페이지가 팝업됩니다."}
							]},	
				{id:"jen1000_selJobBtnt",target:"jen1000SelJobBtn",mainTitle:"[선택 JOB 버튼 영역]",top:310,left:860,position:"right",targetPosition:"right", curve:false
					,subBox:[
						{title:"<i class='fa fa-indent' title='빌드 파라미터 입력'></i>&nbsp;빌드 파라미터 입력",content:"등록되는 JOB에 기본 파라미터 값을 입력합니다."}
						]},	
				{id:"jen1000_selJobList",target:"jen1000SelJobList",mainTitle:"[선택 JOB 목록]",top:380,left:860,position:"right",targetPosition:"right", curve:false
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='JOB 목록'></i>&nbsp;JOB 목록",content:"구성항목에 등록하려는 선택된 JOB 목록입니다."}
							]},		
			]
		,
		"jen1007":   
			[{id:"jen1007_jenkinsBtn",target:"jen1007JenkinsBtn",mainTitle:"[JENKINS 목록 그리드 버튼영역]",top:10,left:800,position:"left",targetPosition:"right", curve:false
				,subBox:[
							{title:"<i class='fas fa-angle-double-right' title='전체 접속확인'></i>&nbsp;전체 접속확인", content:"버튼 클릭 시 등록된 모든 JENKINS의 접속 여부를 체크합니다. " +
									"<br/><i class='fas fa-check-circle result-success'></i> 정상접속, <i class='fas fa-times-circle result-fail'></i> 접속실패"}
							,{title:"<i class='fas fa-angle-double-right' title='선택 접속확인'></i>&nbsp;선택 접속확인", content:"목록에서 선택한 JENKINS의 접속 여부를 체크합나다."}
							,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"등록된 JENKINS를 조회합니다."}
							,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"JENKINS 목록을 엑셀 파일로 다운로드 합니다."}
							,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"JENKINS 목록을 프린트 합니다."}						     
				         ]},
			{id:"jen1007_jenkinsList",target:"jen1007JenkinsList",mainTitle:"[JENKINS 목록]",top:195,left:120,position:"right",targetPosition:"right", curve:false
				,subBox:[
					       {title:"<i class='fas fa fa-list' title='JENKINS 목록'></i>&nbsp;JENKINS 목록",content:"시스템에 등록된 JENKINS 목록이 표시됩니다. <br/>JENKINS 클릭 시 등록된 JOB 목록이 오른쪽 그리드에 표시됩니다."}
					    ]},
			{id:"jen1007_jobBtn",target:"jen1007JobBtn",mainTitle:"[JENKINS JOB 목록 그리드 버튼영역]",top:560,left:850,position:"top",targetPosition:"right", curve:false
				,subBox:[
					         {title:"<i class='fas fa-angle-double-right' title='전체 접속확인'></i>&nbsp;전체 접속확인", content:"버튼 클릭 시 등록된 모든 JOB의 접속 여부를 체크합니다. " +
									"<br/><i class='fas fa-check-circle result-success'></i> 정상접속, <i class='fas fa-times-circle result-fail'></i> 접속실패"}
							 ,{title:"<i class='fas fa-angle-double-right' title='선택 접속확인'></i>&nbsp;선택 접속확인", content:"목록에서 선택한 JOB의 접속 여부를 체크합나다."}
							 ,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"등록된 JOB을 조회합니다."}
							 ,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"JOB 목록을 엑셀 파일로 다운로드 합니다."}
							 ,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"JOB 목록을 프린트 합니다."}						     
						]},	
			{id:"jen1007_jobList",target:"jen1007JobList",mainTitle:"[JENKINS JOB 목록]",top:595,left:120,position:"right",targetPosition:"right", curve:false
				,subBox:[
				         	{title:"<i class='fas fa fa-list' title='JOB 목록'></i>&nbsp;JOB 목록",content:"왼쪽 JENKINS 클릭 시 등록된 JOB 목록이 표시됩니다."}
				         	,{title:"<i class='fa fa-edit' title='더블클릭'></i>&nbsp;더블클릭", content:"[팝업] JOB을 더블클릭 할 경우 JOB 빌드 이력 페이지가 팝업됩니다."}
						]},	
			{id:"jen1007_selJobBtnt",target:"jen1007SelJobBtn",mainTitle:"[선택 JOB 버튼 영역]",top:210,left:860,position:"right",targetPosition:"right", curve:false
				,subBox:[
					{title:"<i class='fa fa-indent' title='빌드 파라미터 입력'></i>&nbsp;빌드 파라미터 입력",content:"등록되는 JOB에 기본 파라미터 값을 입력합니다."}
					,{title:"<i class='fa fa-arrow-up' title='위로'></i>&nbsp;위로",content:"선택 JOB 순서를 바로 이전 순서로 변경합니다."}
					,{title:"<i class='fa fa-arrow-down' title='아래로'></i>&nbsp;아래로",content:"선택 JOB 순서를 바로 다음 순서로 변경합니다."}
					]},	
			{id:"jen1007_selJobList",target:"jen1007SelJobList",mainTitle:"[선택 JOB 목록]",top:380,left:860,position:"right",targetPosition:"right", curve:false
				,subBox:[
				         	{title:"<i class='fas fa fa-list' title='JOB 목록'></i>&nbsp;JOB 목록",content:"구성항목에 등록하려는 선택된 JOB 목록입니다."}
						]},		
		]
		,
		"jen1001":   
			[  {id:"jenGuide_jenkinsInfo",target:"jenkinsInfo",mainTitle:"[JENKINS 설정]",top:304,left:146,position:"top",targetPosition:"top", curve: false
				,subBox:[
				         {title:"<i></i>",content:"URL : JEKINS 시스템의 접속 URL(http://URL:PORT/jenkins/)에<br/>jenkins/을 제거(http://URL:PORT/)하고 입력합니다 ."}
				         ,{title:"<i></i>",content:"USER : JEKINS 시스템의 접속가능한 사용자 ID를 입력합니다."}
				         ,{title:"<i></i>",content:"USER TOKEN KEY : JEKINS 시스템의 접속가능한 사용자의 API TOKEN을 가져와 입력합니다."}
				         ]
			}
			
			]
		,
		"jen1002":   
			[	{id:"jen1002Guide_jobInfo",target:"jen1002LeftJobForm",mainTitle:"[JOB 정보 입력]",top:304,left:46,position:"top",targetPosition:"top", curve: false
					,subBox:[
				         {title:"<i></i>",content:"- JOB ID(NAME) : JENKINS에 생성한 JOB을 선택합니다."}
				         ,{title:"<i></i>",content:"- TOKEN KEY : JEKINS 시스템에서 해당 JOB에서 설정한 Authentication Token을 입력합니다."}
				         ,{title:"<i></i>",content:"- CRON : JOB에 등록되있는 `Build periodically` 값 입니다. </br> 등록, 수정 중 값이 변경되는 경우 실제 JENNKINS에서 값이 변경됩니다."}
				    ]
				},
				{id:"jen1002Guide_jobList",target:"jen1002RightJobList",mainTitle:"[JOB 목록]",top:175,left:600,position:"top",targetPosition:"top", curve: false
					,subBox:[
					         {title:"<i></i>",content:"- 좌측에서 선택된 JENKINS에 등록되있는 JOB 목록입니다."}
					]
				}
			
			]
		,
		"jen1004":   
			[	{id:"jen1004Guide_jobBldDetailInfo",target:"jen1004JobBldDetailInfo",mainTitle:"[JOB 빌드 상세 정보]",top:175,left:715,position:"top",targetPosition:"top", curve: false
				,subBox:[
					{title:"<i></i>",content:"좌측 JOB 목록에서 선택된 빌드의 상세 이력을 표시합니다."}
					]
			},
			{id:"jen1004Guide_jobBldList",target:"jen1004JobBldList",mainTitle:"[JOB 빌드 이력 목록]",top:180,left:150,position:"top",targetPosition:"top", curve: false
				,subBox:[
					{title:"<i></i>",content:"JOB에서 빌드된 이력 목록을 표시합니다."}
					,{title:"<i></i>",content:"빌드 이력 클릭 시 해당 빌드 상세정보가 표시됩니다."}
					]
			},
			{id:"jen1004Guide_jobBldConsoleLog",target:"jen1004JobBldConsoleLog",mainTitle:"[JOB 콘솔로그 영역]",top:600,left:80,position:"top",targetPosition:"top",curve:false	
	        	 ,subBox:[
	        		 {title:"콘솔 로그",content:"선택한 JOB의 콘솔 로그가 표시됩니다. <br/>콘솔 로그 상단에는 JOB 배정목록과 콘솔 로그를 확대할 수 있는 <br/><i class='fas fa-expand'></i> 버튼이있습니다."}
	        		 ]} 
			
			]
		
		,"dpl1000":
			[{id:"dpl1000_dplJobList",target:"dpl1000DplJobList",mainTitle:"[배포 계획 배정 JOB 목록]",top:155,left:500,position:"bottom",targetPosition:"top",curve:false	
			,subBox:[
			         	{title:"<i class='fas fa fa-list' title='배포 계획 배정 JOB 목록'></i>&nbsp;배포 계획 배정 JOB 목록",content:"배포계획에 배정된 JOB 목록입니다."}
			         	,{title:"<i class='fa fa-search' title='배포 계획 상세보기'></i>&nbsp;배포 계획 상세보기", content:"[팝업] 목록에서 JOB을 더블클릭 하면, <br/>해당 JOB의 빌드 이력 페이지가 팝업됩니다."}
			         ]},
			         {id:"dpl1000_dplJobBldInfo",target:"dpl1000DplJobBldInfo",mainTitle:"[JOB 빌드 내용]",top:450,left:160,position:"top",targetPosition:"top",curve:false	
			,subBox:[
			         	{title:"<i class='fas fa fa-list' title='진행 상태'></i>&nbsp;진행 상태",content:"JOB 실행의 진행 상태가 표시됩니다. <br/>JOB이 빌드 중인 경우 해당 빌드 내용이 실시간으로 표시됩니다.</br>빌드 중이 아닌 경우 마지막 빌드 이력이 표시됩니다."}
			         	,{title:"<i class='fa fa-play-circle' title='수동 실행'></i>&nbsp;수동 실행",content:"선택 JOB을 수동으로 빌드 실행합니다.</br>이미 빌드가 진행중이거나 Queue에 JOB이 있는 경우 실행이 불가능합니다."}
			         ]}, 
			         {id:"dpl1000JobConsolLog",target:"dpl1000JobConsolLog",mainTitle:"[JOB 콘솔로그 영역]",top:450,left:900,position:"top",targetPosition:"top",curve:false	
			,subBox:[
			         	{title:"콘솔 로그",content:"선택한 JOB의 콘솔 로그가 표시됩니다. <br/>콘솔 로그 상단에는 JOB 배정목록과 콘솔 로그를 확대할 수 있는 <br/><i class='fas fa-expand'></i> 버튼이있습니다."}
					]} 	
			         ]
	}