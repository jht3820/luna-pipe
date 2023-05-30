var globals_guideContents =
	{
		//운영 대시보드
		"dsh1000":
			[{id:"dshGuide_autoRefresh",target:"autoRefresh",mainTitle:"[자동 조회 기능]",top:10,left:600,position:"right",targetPosition:"left"
						,subBox:[
						         {title:"<i class='fa fa-clock'></i>",content:"자동 조회까지 남은 시간"}
						         ,{title:"<i class='fa fa-infinity'></i>",content:"자동 조회 중지 상태"}
						         ,{title:"<i class='fa fa-cogs'></i>",content:"자동 조회 시간 설정"}
						         ,{title:"<i class='fa fa-arrows-alt'></i>",content:"대시보드 항목 순서 정렬"}
						         ,{title:"<i class='fa fa-redo'></i>",content:"대시보드 전체 새로고침"}
						         ,{title:"<i class='fa fa-times'></i>",content:"자동 조회 중지"}
						         ,{title:"<i class='fa fa-angle-up'></i>",content:"대시보드 위젯 전체 접기"}
						         ,{title:"<i class='fa fa-angle-down'></i>",content:"대시보드 위젯 전체 펼치기"}
						         ]}
						,{id:"dshGuide_dtmOver",target:"dtmOver",mainTitle:"[요구사항  기간 알림]",top:210,left:775,position:"top",targetPosition:"bottom"
							,subBox:[
						         {title:"<font color='#ff1a00'>초과</font>",content:"완료되지 않은 요구사항 중 현재일을 기준으로 작업시한을 넘긴 요구사항 수 입니다."}
						         ,{title:"<font color='#fba450'>임박</font>",content:"완료되지 않은 요구사항 중 현재일을 기준으로 완료시한이 3일 이하로 남은 요구사항 수 입니다."}
						         ,{title:"<font color='#00d200'>여유</font>",content:"완료되지 않은 요구사항 중 현재일을 기준으로 완료시한이 4일 이상 여유있는 요구사항 수 입니다."}
						         ,{title:"<font color='#ff5643'>실패</font>",content:"요구사항 중 완료시한을 초과하여 완료된 요구사항 수 입니다."}
						         ,{title:"<font color='#4b73eb'>적기</font>",content:"요구사항 중 완료시한 이내 정상완료된 요구사항 수 입니다."}
						         ]}
						,{id:"dshGuide_dshTopPrjBox",target:"dshTopPrjBox",mainTitle:"[프로세스별 요구사항 차트]",top:215,left:220,position:"left",targetPosition:"left"
							,subBox:[
						         {title:"프로세스별 요구사항 수",content:"각 프로세스별 배정된 요구사항 수"}
						         ,{title:"각 프로세스별 처리율",content:"최종완료된 요구사항을 기준으로</br>요구사항 종료 일시 기준으로 최종 완료된 요구사항 수"}
						         ,{title:"분기별 처리율",content:"1월, 2월, 3월: 1분기</br>4월, 5월, 6월: 2분기</br>7월, 8월, 9월: 3분기</br>10월, 11월, 12월: 4분기"}
						         ]}
						,{id:"dshGuide_request",target:"request",mainTitle:"[접수 대기 요청사항]",top:400,left:220,position:"left",targetPosition:"left"
							,subBox:[
						         {title:"접수 대기",content:"접수된 요청사항 대기 목록"}
						         ,{title:"두번 클릭",content:"접수 대기 요청사항 두번 클릭시 접수 승인&반려 업무 화면 팝업"}
						         ]}
						,{id:"dshGuide_processList",target:"processList",mainTitle:"[프로세스 목록]",top:500,left:220,position:"left",targetPosition:"left"
							,subBox:[
								{title:"프로세스",content:"프로세스 설정 마법사에서 확정 처리된 프로세스 목록"}
								,{title:"<i class='fa fa-key' title='필수'></i>&nbsp;필수",content:"작업흐름을 필수 단계로 지정합니다."}
								,{title:"<i class='fa fa-file-signature' title='결재'></i>&nbsp;결재 요청",content:"다음 작업흐름 변경시 결재를 받도록 지정합니다."}
								,{title:"<i class='fa fa-sign-out-alt' title='종료 분기'></i>&nbsp;종료 분기",content:"다음 작업흐름 변경시 바로 최종완료 작업흐름으로 변경이 가능하도록 합니다."}
								,{title:"<i class='fa fa-code' title='리비전 저장유무'></i>&nbsp;리비전 저장",content:"현재 작업흐름에서 리비전 번호를 입력 받도록 지정합니다."}
								,{title:"<i class='fa fa-puzzle-piece' title='배포계획 저장유무'></i>&nbsp;배포 계획 저장",content:"현재 작업흐름에서 베포계획을 배정합니다."}
								,{title:"<i class='fa fa-code-branch' title='작업'></i>&nbsp;작업",content:"현재 작업흐름에서 작업을 추가 할 수 있도록 지정합니다."}
								,{title:"<i class='fa fa-list' title='추가 항목'></i>&nbsp;추가 항목",content:"작업흐름의 추가 항목을 설정합니다."}
								,{title:"담당/전체 요구사항",content:"요구사항 수 클릭시 요구사항 목록 확인 가능"}
								]}
						,{id:"dshGuide_reqGrpList",target:"reqGrpList",mainTitle:"[그룹 요구사항 목록 목록]",top:500,left:907,position:"bottom",targetPosition:"right"
							,subBox:[
						         {title:"그룹 요구사항 목록",content:"프로젝트에 등록된 그룹 요구사항 목록"}
						         ,{title:"두번 클릭",content:"그룹 요구사항 두번 클릭 시 그룹 요구사항의 상세 정보를 확인할 수 있습니다."}
						         ,{title:"연결 요구사항 수",content:"그룹 요구사항에 연결된 총 요구사항 건수"}
						         ,{title:"접수 대기 수",content:"그룹 요구사항에 연결된 요구사항 중 접수 대기 상태인 요구사항 수"}
						         ,{title:"처리중 수",content:"그룹 요구사항에 연결된 요구사항 중 처리중 상태인 요구사항 수"}
						         ,{title:"최종완료 수",content:"그룹 요구사항에 연결된 요구사항 중 최종완료 상태인 요구사항 수"}
						         ,{title:"처리 완료율(%)",content:"그룹 요구사항에 연결된 요구사항의 처리 완료율 <br/>반려, 결재 반려종료, 중간종료된 요구사항을 제외하고 계산합니다."}
						         ,{title:"진척률(%)",content:"그룹 요구사항에 연결된 요구사항의 진척률 <br/>반려, 결재 반려종료, 중간종료된 요구사항을 제외하고 계산합니다."}
						         ]}
						,{id:"dshGuide_reqSignList",target:"reqSignList",mainTitle:"[담당 요구사항 결재 목록]",top:1100,left:168,position:"bottom",targetPosition:"top", curve:false
							,subBox:[
								{title:"담당 요구사항 결재 목록",content:"담당자가 결재를 해야할 요구사항 목록이 표시됩니다. <br/>결재 목록을 더블클릭 하여 결재 승인/반려를 할 수 있습니다."}
								]}
						,{id:"dshGuide_dplSignlList",target:"dplSignList",mainTitle:"[담당 배포계획 결재 목록]",top:1100,left:850,position:"bottom",targetPosition:"top", curve:false
							,subBox:[
							         {title:"담당 배포계획 결재 목록",content:"담당자가 결재를 해야할 배포계획 목록이 표시됩니다. <br/>결재 목록을 더블클릭 하여 결재 승인/반려를 할 수 있습니다."}
						         ]}
						,{id:"dshGuide_workList",target:"workList",mainTitle:"[담당 작업 목록]",top:1400,left:700,position:"bottom",targetPosition:"top", curve:false
							,subBox:[
							         {title:"담당 작업 목록",content:"담당자가 처리해야 할 작업 목록이 표시됩니다. <br/>상단의 <i class='fa fa-user-check'></i>작업 종료를 클릭하여 선택한 작업을 종료할 수 있습니다."}
						         ]}
					]
		//개발 대시보드
		,"dsh2000":
			[{id:"dsh2000_autoRefresh",target:"dsh2000AutoRefresh",mainTitle:"[자동 조회 기능]",top:10,left:600,position:"right",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fa fa-clock'></i>",content:"자동 조회까지 남은 시간"}
				         ,{title:"<i class='fa fa-infinity'></i>",content:"자동 조회 중지 상태"}
				         ,{title:"<i class='fa fa-cogs'></i>",content:"자동 조회 시간 설정"}
				         ,{title:"<i class='fa fa-arrows-alt'></i>",content:"대시보드 항목 순서 정렬"}
				         ,{title:"<i class='fa fa-redo'></i>",content:"대시보드 전체 새로고침"}
				         ,{title:"<i class='fa fa-times'></i>",content:"자동 조회 중지"}
				         ,{title:"<i class='fa fa-angle-up'></i>",content:"대시보드 위젯 전체 접기"}
				         ,{title:"<i class='fa fa-angle-down'></i>",content:"대시보드 위젯 전체 펼치기"}
			         ]}
			,{id:"dsh2000_dtmOver",target:"dsh2000DtmOver",mainTitle:"[요구사항  기간 알림]",top:210,left:950,position:"top",targetPosition:"bottom"
				,subBox:[
				         {title:"<font color='#ff1a00'>초과</font>",content:"완료되지 않은 요구사항 중 현재일을 기준으로 작업시한을 넘긴 요구사항 수 입니다."}
				         ,{title:"<font color='#fba450'>임박</font>",content:"완료되지 않은 요구사항 중 현재일을 기준으로 완료시한이 3일 이하로 남은 요구사항 수 입니다."}
				         ,{title:"<font color='#00d200'>여유</font>",content:"완료되지 않은 요구사항 중 현재일을 기준으로 완료시한이 4일 이상 여유있는 요구사항 수 입니다."}
				         ,{title:"<font color='#ff5643'>실패</font>",content:"요구사항 중 완료시한을 초과하여 완료된 요구사항 수 입니다."}
				         ,{title:"<font color='#4b73eb'>적기</font>",content:"요구사항 중 완료시한 이내 정상완료된 요구사항 수 입니다."}
			         ]}
		     
		    ,{id:"dsh2000_dshPrjProgressBox",target:"dsh2000DshPrjProgressBox",mainTitle:"[처리건수 및 진척률]",top:20,left:70,position:"right",targetPosition:"right"
					,subBox:[
					         {title:"처리건수 및 진척률 ",content:"요구사항 처리 건수 및 진척률"}
				         ]}
			,{id:"dsh2000_dshTopPrjBox",target:"dsh2000DshTopPrjBox",mainTitle:"[프로세스별 요구사항 차트]",top:215,left:170,position:"right",targetPosition:"bottom"//,curve:false
				,subBox:[
				         {title:"프로세스별 요구사항 수",content:"각 프로세스별 배정된 요구사항 수"}
				         ,{title:"각 프로세스별 처리율",content:"최종완료된 요구사항을 기준으로</br>요구사항 종료 일시 기준으로 최종 완료된 요구사항 수"}
				         ,{title:"분기별 처리율",content:"1월, 2월, 3월: 1분기</br>4월, 5월, 6월: 2분기</br>7월, 8월, 9월: 3분기</br>10월, 11월, 12월: 4분기"}
			         ]}
			,{id:"dsh2000_dshNotCmplReq",target:"dsh2000DshNotCmplReq",mainTitle:"[계획대비 미처리건수]",top:570,left:260,position:"left",targetPosition:"left" , curve:false
				,subBox:[
				         {title:"미처리 건수 차트",content:"작업 종료일시가 작업 종료예정일시를 넘긴 <br/>요구사항이 미처리 건수 차트로 표시됩니다."}
				         ,{title:"미처리 요구사항 목록",content:"미처리된 요구사항 목록이 표시됩니다. <br/>요구사항을 더블 클릭 시 업무 팝업이 나타나며, <br/>마우스 우클릭 시 요구사항의 상세정보를 볼 수 있습니다."}
			         ]}
			,{id:"dsh2000_docTimeOver",target:"dsh2000docTimeOver",mainTitle:"[예정일 대비 미제출 산출물 건수]",top:930,left:150,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"산물출 미제출 목록",content:"마감일까지 제출하지 않은 산출물 목록이 표시됩니다."}
			         ]}
			,{id:"dsh2000_request",target:"dsh2000Request",mainTitle:"[접수 대기 요청사항]",top:1550,left:250,position:"left",targetPosition:"left", curve:false
				,subBox:[
				         {title:"접수 대기",content:"접수된 요청사항 대기 목록"}
				         ,{title:"두번 클릭",content:"접수 대기 요청사항 두번 클릭시 접수 승인&반려 업무 화면 팝업"}
			         ]}
			,{id:"dsh2000_processList",target:"dsh2000ProcessList",mainTitle:"[프로세스 목록]",top:900,left:700,position:"bottom",targetPosition:"right"
				,subBox:[
				         {title:"프로세스",content:"프로세스 설정 마법사에서 확정 처리된 프로세스 목록"}
				         ,{title:"<i class='fa fa-key' title='필수'></i>&nbsp;필수",content:"작업흐름을 필수 단계로 지정합니다."}
				         ,{title:"<i class='fa fa-file-signature' title='결재'></i>&nbsp;결재 요청",content:"다음 작업흐름 변경시 결재를 받도록 지정합니다."}
				         ,{title:"<i class='fa fa-sign-out-alt' title='종료 분기'></i>&nbsp;종료 분기",content:"다음 작업흐름 변경시 바로 최종완료 작업흐름으로 변경이 가능하도록 합니다."}
				         ,{title:"<i class='fa fa-code' title='리비전 저장유무'></i>&nbsp;리비전 저장",content:"현재 작업흐름에서 리비전 번호를 입력 받도록 지정합니다."}
				         ,{title:"<i class='fa fa-puzzle-piece' title='배포계획 저장유무'></i>&nbsp;배포 계획 저장",content:"현재 작업흐름에서 베포계획을 배정합니다."}
				         ,{title:"<i class='fa fa-code-branch' title='작업'></i>&nbsp;작업",content:"현재 작업흐름에서 작업을 추가 할 수 있도록 지정합니다."}
				         ,{title:"<i class='fa fa-list' title='추가 항목'></i>&nbsp;추가 항목",content:"작업흐름의 추가 항목을 설정합니다."}
				         ,{title:"담당/전체 요구사항",content:"요구사항 수 클릭시 요구사항 목록 확인 가능합니다."}
			         ]}
			,{id:"dsh2000_signList",target:"dsh2000SignList",mainTitle:"[담당 요구사항 결재 목록]",top:2350,left:130,position:"left",targetPosition:"left", curve:false
				,subBox:[
				         {title:"담당 요구사항 결재 목록",content:"담당자가 결재를 해야할 요구사항 목록이 표시됩니다. <br/>결재 목록을 더블클릭 하여 결재 승인/반려를 할 수 있습니다."}
			         ]}
			,{id:"dsh2000_dplSignlList",target:"dsh2000DplSignList",mainTitle:"[담당 배포계획 결재 목록]",top:2350,left:850,position:"right",targetPosition:"right", curve:false
				,subBox:[
				         {title:"담당 배포계획 결재 목록",content:"담당자가 결재를 해야할 배포계획 목록이 표시됩니다. <br/>결재 목록을 더블클릭 하여 결재 승인/반려를 할 수 있습니다."}
			         ]}
			,{id:"dsh2000_workList",target:"dsh2000WorkList",mainTitle:"[담당 작업 목록]",top:2600,left:300,position:"left",targetPosition:"left", curve:false
				,subBox:[
				         {title:"담당 작업 목록",content:"담당자가 처리해야 할 작업 목록이 표시됩니다. <br/>상단의 <i class='fa fa-user-check'></i>작업 종료를 클릭하여 선택한 작업을 종료할 수 있습니다."}
			         ]}
			,{id:"dsh2000_reqGrpList",target:"dsh2000ReqGrpList",mainTitle:"[그룹 요구사항 목록 목록]",top:1850,left:300,position:"left",targetPosition:"left", curve:false
				,subBox:[
			         {title:"그룹 요구사항 목록",content:"프로젝트에 등록된 그룹 요구사항 목록"}
			         ,{title:"두번 클릭",content:"그룹 요구사항 두번 클릭 시 그룹 요구사항의 상세 정보를 확인할 수 있습니다."}
			         ,{title:"연결 요구사항 수",content:"그룹 요구사항에 연결된 총 요구사항 건수"}
			         ,{title:"접수 대기 수",content:"그룹 요구사항에 연결된 요구사항 중 접수 대기 상태인 요구사항 수"}
			         ,{title:"처리중 수",content:"그룹 요구사항에 연결된 요구사항 중 처리중 상태인 요구사항 수"}
			         ,{title:"최종완료 수",content:"그룹 요구사항에 연결된 요구사항 중 최종완료 상태인 요구사항 수"}
			         ,{title:"처리 완료율(%)",content:"그룹 요구사항에 연결된 요구사항의 처리 완료율 <br/>반려, 결재 반려종료, 중간종료된 요구사항을 제외하고 계산합니다."}
			         ,{title:"진척률(%)",content:"그룹 요구사항에 연결된 요구사항의 진척률 <br/>반려, 결재 반려종료, 중간종료된 요구사항을 제외하고 계산합니다."}
			         ]}
		]
		//업무 화면
		,"req4105":
			[{id:"reqGuide_topFlowList",target:"req4105TopFlowList",mainTitle:"[작업흐름 변경이력]",top:180,left:100,position:"top"
						,subBox:[
						         {title:"작업흐름",content:"해당 요구사항의 작업흐름 변경 목록입니다."}
						         ,{title:"작업흐름 클릭",content:"해당 작업흐름에 입력된 추가항목이 보여집니다."}
						         ]},
						{id:"reqGuide_rightFlowList",target:"req4105RightFlowList",mainTitle:"[변경가능 작업흐름 목록]",top:180,left:570,position:"bottom",targetPosition:"left",curve:false
						,subBox:[
						         {title:"작업흐름",content:"해당 요구사항의 변경이 가능한 작업흐름 목록입니다."}
						         ]},
						{id:"reqGuide_authUserChg",target:"req4105AuthUserChg",mainTitle:"[담당자 이관]",top:600,left:50,position:"bottom",targetPosition:"top",curve:false
						,subBox:[
						         {title:"담당자 이관",content:"현재 선택한 역할그룹에 업무 진행 권한이 없는경우 생기는 버튼입니다.</br>허용 역할그룹이 있는 사용자에게 이관해야 업무 진행이 가능합니다."}
						         ]},
						{id:"reqGuide_hlafSave",target:"req4105HlafSave",mainTitle:"[임시 저장]",top:600,left:32,position:"bottom",targetPosition:"top",curve:false
						,subBox:[
						         {title:"임시 저장",content:"업무 진행없이 현재 작업흐름에 입력된 정보만 저장합니다.</br>결재 기능이 있는경우 결재는 진행되지 않습니다.</br>담당자를 변경 후 임시 저장 시 현재 작업흐름의 담당자가 변경됩니다."}
						         ]},
						{id:"reqGuide_flowNext",target:"req4105FlowNext",mainTitle:"[다음]",top:600,left:530,position:"bottom",targetPosition:"top",curve:false
						,subBox:[
						         {title:"다음 작업흐름",content:"항목 입력을 완료하고 다음 선택 작업흐름으로 변경합니다."}
						         ]},
						{id:"reqGuide_signAccept",target:"req4105SignAccept",mainTitle:"[결재 승인]",top:600,left:50,position:"bottom",targetPosition:"top",curve:false
						,subBox:[
						         {title:"결재 승인",content:"해당 요구사항의 결재를 승인합니다.</br>입력된 다음 작업흐름으로 자동 변경됩니다."}
						         ]},
						{id:"reqGuide_signReject",target:"req4105SignReject",mainTitle:"[결재 반려]",top:600,left:530,position:"bottom",targetPosition:"top",curve:false
						,subBox:[
						         {title:"결재 반려",content:"해당 요구사항의 결재를 반려합니다.</br>해당 작업흐름에 결재 반려종료 기능이 있는경우 자동 종료처리됩니다."}
						         ]}
					]
		//프로세스 설정 마법사
		,"prj1100":
			[{id:"flwGuide_leftMenu",target:"leftMenu",mainTitle:"[프로세스 기능]",top:2,left:300,position:"left",targetPosition:"right"
						,subBox:[
						         {title:"조회",content:"프로세스 목록 조회"}
						         ,{title:"추가",content:"프로세스 추가"}
						         ,{title:"수정",content:"선택 프로세스 수정"}
						         ,{title:"삭제",content:"선택 프로세스 삭제"}
						         ,{title:"복사",content:"권한있는 프로젝트의 확정된 프로세스를 복사"}
						         ,{title:"확정",content:"선택 프로세스 확정</br>(확정 완료시 작업흐름의 명칭과 색상 값만 수정이 가능합니다.)"}
						         ,{title:"확정 취소",content:"선택 프로세스 확정 취소</br>(배정된 요구사항이 없을경우 확정 취소가 가능합니다.)"}
						         ]},
					{id:"flwGuide_functionList",target:"functionList",mainTitle:"[기능 목록]",top:290,left:300,position:"bottom",targetPosition:"top"
						,subBox:[
						         {title:"작업흐름 추가",content:"새 작업흐름 생성"}
						         ,{title:"선택 작업흐름 수정",content:"선택 작업흐름 정보 수정"}
						         ,{title:"선택 작업흐름 삭제",content:"선택 작업흐름 삭제"}
						         ,{title:"선택 작업흐름 링크 삭제",content:"선택 작업흐름 링크 삭제"}
						         ,{title:"추가 항목 관리",content:"권한있는 프로젝트의 확정된 프로세스를 복사"}
						         ]},
					{id:"flwGuide_zoom",target:"zoom",mainTitle:"[줌 인/아웃]",top:50,left:900,position:"top",targetPosition:"left"
						,subBox:[
						         {title:"줌 인",content:"작업흐름 설정 화면을 확대"}
						         ,{title:"줌 아웃",content:"작업흐름 설정 화면을 축소"}
						         ]},
					{id:"flwGuide_flowInfo",target:"flowInfo",mainTitle:"[작업흐름 정보]",top:520,left:400,position:"bottom",targetPosition:"bottom",curve:false
						,subBox:[
						         {title:"<i class='fa fa-key' title='필수'></i>&nbsp;필수",content:"작업흐름을 필수 단계로 지정합니다."}
						         ,{title:"<i class='fa fa-file-signature' title='결재'></i>&nbsp;결재 요청",content:"다음 작업흐름 변경시 결재를 받도록 지정합니다."}
						         ,{title:"<i class='fa fa-sign-out-alt' title='종료 분기'></i>&nbsp;종료 분기",content:"다음 작업흐름 변경시 바로 최종완료 작업흐름으로 변경이 가능하도록 합니다."}
						         ,{title:"<i class='fa fa-code' title='리비전 저장유무'></i>&nbsp;리비전 저장",content:"현재 작업흐름에서 리비전 번호를 입력 받도록 지정합니다."}
						         ,{title:"<i class='fa fa-puzzle-piece' title='배포계획 저장유무'></i>&nbsp;배포 계획 저장",content:"현재 작업흐름에서 베포계획을 배정합니다."}
						         ,{title:"<i class='fa fa-code-branch' title='작업'></i>&nbsp;작업",content:"현재 작업흐름에서 작업을 추가 할 수 있도록 지정합니다."}
						         ,{title:"<i class='fa fa-list' title='추가 항목'></i>&nbsp;추가 항목",content:"작업흐름의 추가 항목을 설정합니다."}
						         ]}
					]
		,//개인정보수정
		"prs3000":   
			[	/*{id:"prsGuide_mainProject",target:"mainProject",mainTitle:"[메인 프로젝트]",top:650,left:650,position:"right",targetPosition:"bottom"
				, subBox:[
				          {title:"<i></i>",content:"로그인한후 최초 선택되는 프로젝트를 지정합니다. "}
						 ]
				},
				{id:"prsGuide_dshDisplay",target:"dshDisplay",mainTitle:"[대시보드 표시 구분]",top:380,left:840,position:"bottom",targetPosition:"top"
					, subBox:[
					          {title:"<i class='fas fa-table' title='그리드'></i>&nbsp;그리드",content:"대시보드에 있는 작업흐름의 요구사항들의 상세 속성들을 테이블형식으로 확인할 수 있습니다."}
					          ,{title:"<i class='fas fa-chalkboard' title='칸반'></i>&nbsp;칸반",content:"대시보드에 있는 작업흐름의 요구사항의 제목과 내용을 보드형식으로 확인할 수 있습니다."}
							 ]
				},*/
				{id:"prsGuide_etcInfo",target:"etcInfo",mainTitle:"[기타 정보]",top:176,left:612,position:"bottom",targetPosition:"top",curve:false
					, subBox:[
								{title:"메인 프로젝트",content:"로그인한후 최초 선택되는 프로젝트입니다."}
								,{title:"대시보드 표시 구분",content:"그리드 : 대시보드에 있는 프로세스의 작업흐름(단계)의 요구사항 상세 속성들을 테이블형식으로 확인할 수 있습니다." +
										"<br/>칸반 : 대시보드에 있는 프로세스의 작업흐름(단계)의 요구사항 제목과 내용을 보드형식으로 확인할 수 있습니다."}
								,{title:"업무처리 화면 상단정보 표시",content:"요구사항 업무처리 화면 상단의 작업흐름(단계) 정보의 표시 유무입니다. [아니오] 선택시 작업흐름(단계) 정보가 접혀있는 상태가 됩니다."}
								,{title:"업무처리 화면 기본항목 표시",content:"요구사항 업무처리 화면 기본항목 정보의 표시 유무입니다. [아니오] 선택시 기본항목 정보가 접혀있는 상태가 됩니다."}
							 ]
					}
			]
		,//메뉴 및 권한 관리
		"adm1000":   
			[  {id:"admGuide_addDelMenu",target:"addDelMenu",mainTitle:"[메뉴 추가 삭제]",top:62,left:83,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fa fa-edit' title='추가'></i>&nbsp;추가",content:"추가 버튼 실행시에 메뉴가 생성되고 선택하여 우측 상세에서 수정할 수 있습니다."}
				        ,{title:"<i class='fa fa-trash-alt' title='삭제'></i>&nbsp;삭제",content:"메뉴 트리를 선택하고 하위 항목이 없을때 삭제 버튼을 눌러주면 메뉴가 삭제됩니다."}
				         ]
				}
			  ,{id:"admGuide_projectType",target:"projectType",mainTitle:"[프로젝트 유형]",top:835,left:829,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"프로젝트 생성시에 프로젝트 유형에 따라 해당 화면을 사용할지 지정할 수 있습니다.<br/>개발 : 개발 프로젝트 , 운영 : 운영프로젝트 , 공통 : 개발 프로젝트+운영 프로젝트 "}
				         
				         ]
				}
				
			]
		,"adm2300":   
			[  {id:"admGuide_adm2300button",target:"adm2300button",mainTitle:"[투입 인력 요청]",top:270,left:700,position:"top",targetPosition:"bottom"
					,subBox:[
				         {title:"<i class='fa fa-download' title='양식 다운로드'></i>&nbsp;양식 다운로드",content:"투입 인력 정보를 엑셀 양식으로 작성하여 등록할 수있는 양식을 다운로드 합니다."}
				         ,{title:"<i class='fa fa-upload' title='업로드'></i>&nbsp;업로드",content:"투입 인력 정보를 엑셀 양식으로 업로드 할 수 있는 팝업화면을 호출합니다."}
				         ,{title:"<i class='fa fa-save' title='등록'></i>&nbsp;등록",content:"투입 인력 등록 팝업을 오픈합니다."}
				         ,{title:"<i class='fa fa-edit' title='수정'></i>&nbsp;수정",content:"투입 인력 수정 팝업을 오픈합니다. 투입 인력 목록에서 수정할 사용자를 클릭 후 [수정] 버튼을 클릭합니다.<br>투입 상태가 요청 대기이고 처리 상태가 요청이 아닌 투입 인력만 수정 가능합니다."}
				         ,{title:"<i class='fa fa-edit' title='투입 요청'></i>&nbsp;투입 요청",content:"투입 상태가 요청 대기이며 처리 상태가 요청이 아닌 투입 인력에 대해 투입 요청을 합니다."}
				         ,{title:"<i class='fa fa-edit' title='기간 변경 요청'></i>&nbsp;기간 변경 요청",content:"투입 상태가 사용중, 투입 대기, 만료이며 처리 상태가 요청이 아닌 투입 인력에 대해 기간 변경 요청을 합니다."}
				         ,{title:"<i class='fa fa-trash-alt' title='해지 요청'></i>&nbsp;해지 요청",content:"투입 상태가 사용중, 투입 대기, 만료이며 처리 상태가 요청이 아닌 투입 인력에 대해 해지 요청을 합니다."}
				         ,{title:"<i class='fa fa-undo-alt' title='요청 회수'></i>&nbsp;요청 회수",content:"본인이 진행한 요청을 회수할 수 있습니다."}
				         ]
				}
				,{id:"admGuide_adm2300grid",target:"adm2300grid",mainTitle:"[조합 가능 상태 목록]",top:500,left:100,position:"left",targetPosition:"left",curve:false
					,subBox:[
							{title:"투입 요청 대기",content:"투입 인력이 등록만 된 상태로 투입 요청을 대기하고 있는 상태입니다."}
							,{title:"투입 요청",content:"투입이 요청된 상태로 승인, 반려가 가능합니다."}
						  	,{title:"투입 승인",content:"투입 요청이 승인된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"투입 반려",content:"투입 요청이 반려된 상태로 투입 요청이 가능합니다."}
						  	,{title:"투입 요청 회수",content:"투입 요청이 회수된 상태로 투입 요청이 가능합니다."}
						  	,{title:"기간 변경 요청",content:"기간 변경이 요청된 상태로 승인, 반려가 가능합니다."}
						  	,{title:"기간 변경 승인",content:"기간 변경 요청이 승인된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"기간 변경 반려",content:"기간 변경 요청이 반려된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"기간 변경 요청 회수",content:"기간 변경 요청이 회수된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"해지 요청",content:"투입 인력 해지가 요청된 상태로 승인, 반려가 가능합니다."}
						  	,{title:"해지 승인",content:"해지 요청이 승인된 상태로 해지된 투입 인력은 더이상 사용할 수 없습니다."}
						  	,{title:"해지 반려",content:"해지 요청이 반려된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"해지 요청 회수",content:"해지 요청이 회수된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
					         ]
					}
				
			]
		,//투입 인력 관리
		"adm2400":   
			[  {id:"admGuide_adm2400button",target:"adm2400button",mainTitle:"[투입 인력 관리]",top:270,left:700,position:"top",targetPosition:"bottom"
					,subBox:[
					  	{title:"라이선스 사용자 제한 수",content:"현재 라이선스 제한 수를 표시합니다. <br/>라이선스 사용자 수는 현재 시스템에 등록된 사용자 중 사용여부가 [사용]인 사용자를 기준으로 합니다."}
					  	,{title:"<i class='fa fa-check' title='승인'></i>&nbsp;승인",content:"투입 인력 요청에 대한 승인 팝업을 오픈합니다."}
					  	,{title:"<i class='fa fa-trash-alt' title='반려'></i>&nbsp;반려",content:"투입 인력 요청에 대한 반려 팝업을 오픈합니다."}
				         ,{title:"<i class='fa fa-download' title='양식 다운로드'></i>&nbsp;양식 다운로드",content:"투입 인력 정보를 엑셀 양식으로 작성하여 등록할 수있는 양식을 다운로드 합니다."}
				         ,{title:"<i class='fa fa-upload' title='업로드'></i>&nbsp;업로드",content:"투입 인력 정보를 엑셀 양식으로 업로드 할 수 있는 팝업화면을 호출합니다."}
				         ,{title:"<i class='fa fa-save' title='등록'></i>&nbsp;등록",content:"투입 인력 등록 팝업을 오픈합니다."}
				         ,{title:"<i class='fa fa-edit' title='수정'></i>&nbsp;수정",content:"투입 인력 수정 팝업을 오픈합니다. 투입 인력 목록에서 수정할 사용자를 클릭 후 [수정] 버튼을 클릭합니다.<br>투입 상태가 요청 대기인 경우 투입 인력의 정보를 수정하는 팝업을 오픈하며,<br>투입 상태가 사용중, 투입 대기, 만료인 경우 투입 인력의 IP만 수정하는 팝업을 오픈합니다."}
				         ,{title:"<i class='fa fa-edit' title='투입 요청'></i>&nbsp;투입 요청",content:"투입 상태가 요청 대기이며 처리 상태가 요청이 아닌 투입 인력에 대해 투입 요청을 합니다."}
				         ,{title:"<i class='fa fa-edit' title='기간 변경 요청'></i>&nbsp;기간 변경 요청",content:"투입 상태가 사용중, 투입 대기, 만료이며 처리 상태가 요청이 아닌 투입 인력에 대해 기간 변경 요청을 합니다."}
				         ,{title:"<i class='fa fa-trash-alt' title='해지 요청'></i>&nbsp;해지 요청",content:"투입 상태가 사용중, 투입 대기, 만료이며 처리 상태가 요청이 아닌 투입 인력에 대해 해지 요청을 합니다."}
				         ,{title:"<i class='fa fa-undo-alt' title='요청 회수'></i>&nbsp;요청 회수",content:"본인이 진행한 요청을 회수할 수 있습니다."}
				         ]
				}
				,{id:"admGuide_adm2400grid",target:"adm2400grid",mainTitle:"[조합 가능 상태 목록]",top:500,left:100,position:"left",targetPosition:"left",curve:false
					,subBox:[
							{title:"투입 요청 대기",content:"투입 인력이 등록만 된 상태로 투입 요청을 대기하고 있는 상태입니다."}
							,{title:"투입 요청",content:"투입이 요청된 상태로 승인, 반려가 가능합니다."}
						  	,{title:"투입 승인",content:"투입 요청이 승인된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"투입 반려",content:"투입 요청이 반려된 상태로 투입 요청이 가능합니다."}
						  	,{title:"투입 요청 회수",content:"투입 요청이 회수된 상태로 투입 요청이 가능합니다."}
						  	,{title:"기간 변경 요청",content:"기간 변경이 요청된 상태로 승인, 반려가 가능합니다."}
						  	,{title:"기간 변경 승인",content:"기간 변경 요청이 승인된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"기간 변경 반려",content:"기간 변경 요청이 반려된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"기간 변경 요청 회수",content:"기간 변경 요청이 회수된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"해지 요청",content:"투입 인력 해지가 요청된 상태로 승인, 반려가 가능합니다."}
						  	,{title:"해지 승인",content:"해지 요청이 승인된 상태로 해지된 투입 인력은 더이상 사용할 수 없습니다."}
						  	,{title:"해지 반려",content:"해지 요청이 반려된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
						  	,{title:"해지 요청 회수",content:"해지 요청이 회수된 상태로 기간 변경 요청, 해지 요청이 가능합니다."}
					         ]
					}
				
			]
		,// 역할 그룹 생성
		"prj2001":   
			[  {id:"prjGuide_acceptUse",target:"acceptUse",mainTitle:"[접수권한 사용유무]",top:438,left:38,position:"right",targetPosition:"right"
				,subBox:[
				         {title:"<i></i>",content:"접수권한 사용을 지정한 권한은 요구사항 접수시에 담당자로 지정할 수 있습니다."}
				        
				         ]
			}
							
			]
		,// 사용자 수정
		"adm2001":   
			[  {id:"admGuide_block",target:"block",mainTitle:"[차단여부]",top:217,left:395,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"사용자의 로그인 허용/차단 여부를 지정할 수 있습니다."}
				        
				         ]
			}
							
			]
		,// 사용자 엑셀 업로드
		"adm2002":   
			[  {id:"admGuide_selectDelete",target:"selectDelete",mainTitle:"[선택 삭제 및 중복 체크]",top:113,left:21,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"파일 업로드한 사용자를 선택 삭제를 할수 있습니다."}
				         ,{title:"<i></i>",content:"파일 업로드한 사용자를 아이디가 중복되어 입력 되어 있는지 확인합니다."}
				         ]
			},
			 {id:"admGuide_selectUpload",target:"selectUpload",mainTitle:"[파일선택 및 업로드]",top:113,left:593,position:"right",targetPosition:"right"
				,subBox:[
				         {title:"<i></i>",content:"작성한 사용자 엑셀 양식을 선택합니다."}
				         ,{title:"<i></i><img src='/images/contents/upload_img.png' alt='업로드' style='margin-right: 1px'/>",content:"엑셀에 작성한 사용자 정보를 화면으로 업로드합니다."}
				         ]
			},
			{id:"admGuide_sshowExcelErrorLog",target:"showExcelErrorLog",mainTitle:"[엑셀 파일 내용 검증 로그]",top:344,left:46,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"작성한 사용자 엑셀의 내용을 검증하여 업로드 불가능한 이유를 출력합니다."}
				         ]
			}
							
			]
		,// 사용자 관리
		"adm2000":   
			[  {id:"admGuide_adm2000button",target:"adm2000button",mainTitle:"[사용자 관리]",top:270,left:500,position:"top",targetPosition:"bottom"
				,subBox:[
					  	{title:"라이선스 사용자 제한 수",content:"현재 라이선스 제한 수를 표시합니다. <br/>라이선스 사용자 수는 현재 시스템에 등록된 사용자 중 사용여부가 [사용]인 사용자를 기준으로 합니다."}
				         ,{title:"<i class='fa fa-download' title='양식 다운로드'></i>&nbsp;양식 다운로드",content:"사용자 정보를 엑셀 양식으로 작성하여 등록할 수있는 양식을 다운로드 합니다."}
				         ,{title:"<i class='fa fa-upload' title='업로드'></i>&nbsp;업로드",content:"사용자 정보를 엑셀 양식으로 업로드 할 수 있는 팝업화면을 호출합니다."}
				         ,{title:"<i class='fa fa-save' title='등록'></i>&nbsp;등록",content:"사용자 등록 팝업을 오픈합니다."}
				         ,{title:"<i class='fa fa-edit' title='수정'></i>&nbsp;수정",content:"사용자 수정 팝업을 오픈합니다. 사용자 목록에서 수정할 사용자를 클릭 후 [수정] 버튼을 클릭합니다."}
				         ,{title:"<i class='fa fa-trash-alt' title='삭제'></i>&nbsp;삭제",content:"사용자 목록에서 [체크]한 사용자를 삭제합니다. 삭제 시 사용여부가 [미사용]으로 변경됩니다."}
				         ]
				}
				,{id:"admGuide_adm2000grid",target:"adm2000grid",mainTitle:"[사용자 목록]",top:500,left:400,position:"left",targetPosition:"left",curve:false
					,subBox:[
						  	{title:"사용자 목록",content:"현재 시스템에 등록된 사용자 목록을 표시합니다."}
					         ,{title:"더블클릭",content:"사용자 상세보기 팝업을 오픈합니다."}
					         ,{title:"차단여부 수정",content:"차단여부 컬럼을 클릭하여 차단여부를 변경할 수 있습니다."}
					         ]
					}
			
			]
		,// API 관리
		"stm1001":   
			[  {id:"stmGuide_apiUrl",target:"apiUrl",mainTitle:"[서비스 주소(URL)]",top:173,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"REST API으로 호출할 URL정보를 등록합니다."}						     
				         ]
			}
			
			]
		,// SVN 저장소 관리
		"stm2001":   
			[  {id:"stmGuide_svnUrl",target:"svnUrl",mainTitle:"[URL]",top:39,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"SVN REPOSITORY의 URL을 입력합니다."}						     
				         ]
			    }
			 , {id:"stmGuide_svnUser",target:"svnUser",mainTitle:"[USER]",top:277,left:24,position:"right",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"SVN 접속가능한 사용자 계정의 ID를 입력합니다."}						     
				         ]
			  }
			 , {id:"stmGuide_svnPassword",target:"svnPassword",mainTitle:"[PASSWORD]",top:206,left:205,position:"right",targetPosition:"right"
					,subBox:[
					         {title:"<i></i>",content:"SVN 접속가능한 사용자 계정의 PASSWORD를 입력합니다."}						     
					         ]
				  }
			]
		,// SVN 저장소 관리
		"stm2000":   
			[  {id:"stmGuide_stm2000button",target:"stm2000button",mainTitle:"[SVN 저장소 등록관리]",top:228,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fas fa-angle-double-right' title='접속확인'></i>&nbsp;접속확인",content:"등록된 SVN 저장소 정보가 정상적인지 확인합니다."}						     
				         ]
			}
			
			]
		,// JENKINS 설정 관리
		"stm3001":   
			[  {id:"stmGuide_jenkinsInfo",target:"jenkinsInfo",mainTitle:"[JENKINS 설정]",top:304,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i></i>",content:"URL : JEKINS 시스템의 접속 URL(http://URL:PORT/jenkins/)에<br/>jenkins/을 제거(http://URL:PORT/)하고 입력합니다 ."}
				         ,{title:"<i></i>",content:"USER : JEKINS 시스템의 접속가능한 사용자 ID를 입력합니다."}
				         ,{title:"<i></i>",content:"USER TOKEN KEY : JEKINS 시스템의 접속가능한 사용자의 API TOKEN을 가져와 입력합니다."}
				         ,{title:"<i></i>",content:"Job 명 : JEKINS 시스템의 등록된 JOB 정보를 입력합니다."}
				         ,{title:"<i></i>",content:"TOKEN KEY : JEKINS 시스템의 JOB 정보에 빌드 유발 KEY를 가져와 입력합니다."}
				         ]
			}
			
			]
		,// JENKINS 저장소 등록관리
		"stm3000":   
				[{id:"stm3000_jenkinsBtn",target:"stm3000JenkinsBtn",mainTitle:"[JENKINS 목록 그리드 버튼영역]",top:350,left:146,position:"top",targetPosition:"bottom", curve:false
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
				{id:"stm3000_jenkinsList",target:"stm3000JenkinsList",mainTitle:"[JENKINS 목록]",top:680,left:150,position:"bottom",targetPosition:"bottom", curve:false
					,subBox:[
						       {title:"<i class='fas fa fa-list' title='JENKINS 목록'></i>&nbsp;JENKINS 목록",content:"시스템에 등록된 JENKINS 목록이 표시됩니다. <br/>JENKINS 클릭 시 등록된 JOB 목록이 오른쪽 그리드에 표시됩니다."}
						    ]},
				{id:"stm3000_jobBtn",target:"stm3000JobBtn",mainTitle:"[JENKINS JOB 목록 그리드 버튼영역]",top:350,left:930,position:"top",targetPosition:"bottom", curve:false
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
				{id:"stm3000_jobList",target:"stm3000JobList",mainTitle:"[JENKINS JOB 목록]",top:680,left:930,position:"bottom",targetPosition:"bottom", curve:false
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='JOB 목록'></i>&nbsp;JOB 목록",content:"왼쪽 JENKINS 클릭 시 등록된 JOB 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-edit' title='더블클릭'></i>&nbsp;더블클릭", content:"[팝업] JOB을 더블클릭 할 경우 JOB 수정 팝업이 나타납니다. <br/>JENKINS에 일치하는 JOB이 없을 경우 수정 할 수 없습니다."}
							]}		
			]
		,// SVN 저장소 배정관리 관리
		"stm2100":   
			[  {id:"stmGuide_stm2100button",target:"stm2100button",mainTitle:"[SVN 저장소 배정관리]",top:228,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fas fa fa-save' title='SVN리비젼 확인'></i>&nbsp;SVN리비젼 확인",content:"권한 부여된 SVN 저장소 정보를 조회합니다."}
				         ,{title:"<i class='fas fa fa-save' title='역할그룹 설정'></i>&nbsp;역할그룹 설정",content:"SVN 저장소를 사용가능한 역할 그룹을 지정합니다."}
				         ,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록",content:"프로젝트에 SVN 저장소를 권한 배정합니다."}
				         ]
			}
			
			]
		,// JENKINS 저장소 배정관리 관리
		"stm3100":   
			[  {id:"stmGuide_stm3100button",target:"stm3100button",mainTitle:"[JENKINS 저장소 배정관리 버튼영역]",top:290,left:146,position:"left",targetPosition:"left"
				,subBox:[
				         {title:"<i class='fas fa fa-save' title='배포 권한 설정'></i>&nbsp;배포 권한 설정",content:"[팝업] JENKINS 저장소를 사용 가능한 역할 그룹을 지정합니다."}
				         ,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"프로젝트에 배정된 JENKINS JOB을 조회합니다."}
				         ,{title:"<i class='fas fa fa-save' title='등록'></i>&nbsp;등록", content:"[팝업] 프로젝트에 JENKINS JOB을 배정합니다."}
				         ,{title:"<i class='fa fa fa-trash-alt' title='삭제'></i>&nbsp;삭제", content:"프로젝트에 배정된 JENKINS JOB을 배정제외 합니다."}
				         ,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"프로젝트에 배정된 JENKINS JOB 목록을 엑셀 파일로 다운로드 합니다."}
				         ,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"프로젝트에 배정된 JENKINS JOB 목록을 프린트합니다."}
				         ]},
				{id:"stmGuide_stm3100projectListTree",target:"stm3100projectListTree",mainTitle:"[JENKINS JOB을 배정하기 위한 프로젝트 목록]",top:677,left:380,position:"top",targetPosition:"bottom"
				,subBox:[
				         {title:"프로젝트 목록",content:"JENKINS JOB을 배정하기 위한 프로젝트 목록이 트리 형태로 표출됩니다."}
				         ]},
				{id:"stmGuide_stm3100prjAddJobGrid",target:"stm3100prjAddJobGrid",mainTitle:"[프로젝트에 배정된 JENKINS JOB 목록]",top:500,left:380,position:"right",targetPosition:"right"
				,subBox:[
						 {title:"프로젝트에 배정된 JOB 목록",content:"조회 또는 왼쪽 트리에서 프로젝트 선택 시 프로젝트에 배정된 JENKINS JOB 목록이 표시됩니다."}
						]}
			
			]
		// 개발문서 양식 관리
		,"prj3000":
				[{id:"prj3000Guide_leftMenu",target:"leftMenu",mainTitle:"[개발문서 양식관리 기능]",top:2,left:120,position:"left",targetPosition:"left"
					,subBox:[
					         {title:"추가",content:"개발문서 추가"}
					         ,{title:"삭제",content:"개발문서 삭제</br>(선택된 개발문서 및 하위 개발문서, 업로드 된 파일도 삭제되며 삭제 시 되돌릴 수 없습니다.)"}
					         ,{title:"[+]",content:"개발문서 목록 전체를 펼칩니다."}
					         ,{title:"[-]",content:"개발문서 목록 전체를 닫습니다."}
					         ]},
				{id:"prj3000Guide_formFileZip",target:"formFileZip",mainTitle:"[확정 개발문서 양식 전체 다운로드]",top:188,left:900,position:"top",targetPosition:"bottom"
					,subBox:[
					         {title:"확정 개발문서 양식 전체 다운로드",content:"확정 개발문서 양식 목록을 압축파일로 다운로드 받습니다.</br>해당 버튼은 상위 개발문서 클릭 시 활성화 되며 2개 이상의</br>확정 개발문서 양식이 있어야 합니다."}
					         ]},
				{id:"prj3000Guide_docFileUpload",target:"docFileUpload",mainTitle:"[개발문서 양식 업로드]",top:20,left:800,position:"right",targetPosition:"top"
					,subBox:[
					         {title:"개발문서 양식 업로드",content:"선택한 개발문서에 파일을 업로드 합니다."}
					         ]},
				{id:"prj3000Guide_confirmDocFile",target:"confirmDocFile",mainTitle:"[확정 개발문서 양식]",top:330,left:350,position:"right",targetPosition:"top"
					,subBox:[
					         {title:"확정 개발문서 양식",content:"선택한 개발문서에서 확정된 개발문서 양식 입니다.</br>개발문서 양식 업로드 목록에 있는 파일 1개를 Drag&Drop</br>으로 확정 개발문서 양식 이동하면 확정 개발문서 양식으로 됩니다."}
					         ]},
				{id:"prj3000Guide_docFileList",target:"docFileList",mainTitle:"[개발문서 양식 목록]",top:570,left:700,position:"bottom",targetPosition:"top"
					,subBox:[
					         {title:"개발문서 양식 업로드 목록",content:"개발문서 양식 업로드 버튼 또는 Drag&Drop으로 파일을 업로드 합니다."}
					         ]}					         
				]
		// 개발문서  관리
		,"prj3100":
				[{id:"prj3100Guide_confirmFileZip",target:"confirmFileZip",mainTitle:"[확정 개발문서 전체 다운로드]",top:30,left:120,position:"right",targetPosition:"left"
					,subBox:[
					         {title:"확정 개발문서 전체 다운로드",content:"확정 개발문서 목록을 압축파일로 다운로드 받습니다.</br>해당 버튼은 상위 개발문서 클릭 시 활성화 되며 2개 이상의</br>확정 개발문서가 있어야 합니다."}
					         ]},
				{id:"prj3100Guide_docFileUpload",target:"docFileUpload",mainTitle:"[개발문서 업로드]",top:20,left:800,position:"right",targetPosition:"top"
					,subBox:[
					         {title:"개발문서 업로드",content:"선택한 개발문서에 파일을 업로드 합니다."}
					         ]},
				{id:"prj3100Guide_formFileDownload",target:"formFileDownload",mainTitle:"[양식 다운로드]",top:170,left:800,position:"right",targetPosition:"bottom"
					,subBox:[
					         {title:"양식 다운로드",content:"선택한 개발문서의 양식 파일을 다운로드 합니다. </br>양식 파일은 개발문서 양식 관리에서 확정 개발문서</br> 양식에 있는 파일이 다운로드 됩니다."}
							 ]},	         
				{id:"prj3100Guide_confirmDocFile",target:"confirmDocFile",mainTitle:"[확정 개발문서]",top:280,left:300,position:"right",targetPosition:"top"
					,subBox:[
					         {title:"확정 개발문서",content:"선택한 개발문서에서 확정된 개발문서입니다.</br>개발문서 업로드 목록에 있는 파일 1개를 Drag&Drop</br>으로 확정 개발문서로 이동하면 해당 파일이 확정 개발문서가 됩니다."}
					         ]},
				{id:"prj3100Guide_docFileList",target:"docFileList",mainTitle:"[개발문서 목록]",top:490,left:300,position:"right",targetPosition:"top"
					,subBox:[
					         {title:"개발문서 업로드 목록",content:"개발문서 업로드 버튼 또는 Drag&Drop으로 파일을 업로드 합니다."}
					         ]}					         
				]
		// 그룹 요구사항 관리
		,"req3000":
				[{id:"req3000_reqGrpGrid",target:"req3000Grid",mainTitle:"[그룹 요구사항 목록]",top:360,left:175,position:"left",targetPosition:"left",curve:false
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='그룹 요구사항 목록'></i>&nbsp;그룹 요구사항 목록",content:"그룹 요구사항 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-search' title='그룹 요구사항 상세보기'></i>&nbsp;그룹 요구사항 상세보기", content:"[팝업] 그룹 요구사항 목록에서 더블클릭 시, <br/>그룹 요구사항 상세보기 화면이 나타납니다. <br/>상세보기 화면에서 연결된 요구사항의 처리 정보를 확인할 수 있습니다."}
					         	,{title:" ", content:" "}
					         	,{title:"<i class='fas fa-columns' title='그룹 요구사항 그리드 항목 정보'></i>&nbsp;그리드 항목 정보", 
					         		content:"- 그룹 요구사항 번호 : 그룹 요구사항의 고유 번호입니다. <br/>- 그룹 요구사항 명 : 등록한 그룹 요구사항의 제목입니다.<br/>- 연결 요구사항 수 : 그룹 요구사항에 연결된 상세 요구사항 수 입니다." +
					         				"<br/>- 연결 요구사항 수 : 그룹 요구사항에 연결된 상세 요구사항 수 입니다.<br/>- 접수 대기 수 : 연결된 상세 요구사항 중 접수 대기인 요구사항 수 입니다." +
					         				"<br/>- 처리 중 : 연결된 상세 요구사항 중 처리중인 요구사항 수 입니다. <br/>- 최종 완료 : 연결된 상세 요구사항 중 최종 완료된 요구사항 수 입니다." +
					         				"<br/>- 진척률 : 그룹 요구사항의 진척률로 연결된 상세 요구사항의 진척률을 기준으로 계산됩니다.<br/>- 처리 완료율 : 연결된 상세 요구사항의 최종 완료 수를 기준으로 처리 완료율이 표시됩니다.<br/>&nbsp;&nbsp;처리 완료율 계산 시 접수 반려, 중간종료된 상세 요구사항은 제외됩니다." +
					         				"<br/>- 담당자 : 그룹 요구사항의 담당하고 있는 사용자입니다.<br/>- 요청자 : 그룹 요구사항을 요청한 사용자입니다."
					         	}
					         ]},
				{id:"req3000_reqGrpGridBtn",target:"req3000GridBtn",mainTitle:"[그룹 요구사항 관리 버튼영역]",top:300,left:920,position:"top",targetPosition:"bottom",curve:false
					,subBox:[
								{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"그룹 요구사항 목록을 조회합니다."}
								,{title:"<i class='fa fa-save' title='등록'></i>&nbsp;등록", content:"그룹 요구사항 등록 화면을 엽니다."}
								,{title:"<i class='fa fa-edit' title='수정'></i>&nbsp;수정", content:"선택한 그룹 요구사항의 수정 화면을 엽니다."}
								,{title:"<i class='fa fa-trash-alt' title='삭제'></i>&nbsp;삭제", content:"그리드에서 체크된 그룹 요구사항을 삭제 합니다."}
								,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"그룹 요구사항 목록을 엑셀 파일로 다운로드 합니다."}
								,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"그룹 요구사항 목록을 프린트 합니다."}
								,{title:"<i class='fa fa-download' title='그룹 요구사항 업로드 양식 파일 다운로드'></i>&nbsp;양식 다운로드", content:"그룹 요구사항 일괄 업로드를 위한 엑셀 양식 파일을 다운로드 합니다."}
								,{title:"<i class='fa fa-upload' title='양식 업로드'></i>&nbsp;업로드", content:"작성된 그룹 요구사항 양식 파일을 업로드 하는 화면을 엽니다."}
								,{title:"<i class='fas fa fa-list' title='목록 수'></i>&nbsp;목록 수", content:"그리드 한 페이지에 표시될 그룹 요구사항 목록 수를 지정합니다."}
								,{title:"<i class='fas fa-sort-amount-down' title='목록 높이'></i>&nbsp;목록 높이", content:"그룹 요구사항 목록 그리드의 높이를 변경합니다."}
								,{title:"<i class='fas fa-link' title='상세 요구사항 연결 유무'></i>&nbsp;연결 유무", content:"상세 요구사항의 연결 유무로 그룹 요구사항을 조회 합니다. <br/>- 전체 : 모든 그룹 요구사항을 조회합니다. <br/>- 연결 : 상세 요구사항이 연결된 그룹 요구사항만 조회합니다. <br/>- 미연결 : 상세 요구사항이 연결되지 않은 그룹 요구사항만 조회합니다."}
					         ]}
				]
		// 요구사항 분류 배정 관리
		,"req4200":
				[{id:"req4200Guide_assignReqList",target:"assignReqList",mainTitle:"[배정 요구사항]",top:30,left:120,position:"bottom",targetPosition:"left"
					,subBox:[
					         {title:"배정된 요구사항",content:"해당 분류에 배정된 요구사항 목록입니다. </br>업무 화면에서 요구사항의 분류를 지정하면</br>해당 분류의 배정된 요구사항 목록에 요구사항이 나타납니다.</br>배정된 요구사항 목록에 체크를 하고 [삭제<img src='/images/contents/bottom_red.png' alt='아래쪽 화살표' style='margin-left: 5px;'>] 버튼 클릭 시 해당</br>요구사항이 분류에서 삭제됩니다."}
					         ]},
				{id:"req4200Guide_notAssignReqList",target:"notAssignReqList",mainTitle:"[미배정 요구사항]",top:420,left:5,position:"bottom",targetPosition:"left"
					,subBox:[
					         {title:"미배정된 요구사항",content:"특정 분류에 배정되지 않은 요구사항 목록입니다. </br>미배정 요구사항 목록에는 접수 완료되었지만 분류가 </br>지정되지 않은 요구사항이 나타납니다.</br>미배정된 요구사항 목록에 체크를 하고 [<img src='/images/contents/top_blue.png' alt='위쪽 화살표' style='margin-right: 5px;'>추가] 버튼 클릭</br>시 해당 요구사항이 분류에 배정됩니다."}
					         ]}                  
				]
		//요구사항 결재 승인관리 
		,"chk1100":
				[{id:"chk1100_reqSignGrid",target:"reqSignApprovalGrid",mainTitle:"[요구사항 결재 목록]",top:410,left:200,position:"left",targetPosition:"left",curve:false
					,subBox:[
					         	{title:"<i class='fas fa fa-list' title='요구사항 결재 목록'></i>&nbsp;요구사항 결재 목록",content:"요구사항 결재 목록이 표시됩니다."}
					         	,{title:"<i class='fa fa-search' title='요구사항 업무처리 팝업 보기'></i>&nbsp;요구사항 업무처리 팝업 보기", content:"[팝업] 요구사항 결재 목록에서 더블클릭 시, <br/>해당 요구사항의 업무처리 화면이 나타납니다. <br/>요구사항의 결재자일 경우 팝업에서 결재 승인/반려를 할 수 있습니다."}
					         ]},
				{id:"chk1100_reqSignGridBtn",target:"reqSignApprovalGridBtn",mainTitle:"[요구사항 결재 목록 버튼영역]",top:300,left:920,position:"top",targetPosition:"bottom",curve:false
					,subBox:[
								{title:"<i class='fa fa-check' title='승인'></i>&nbsp;승인", content:"요구사항을 결재 승인합니다. 결재 상태가 대기인 요구사항만 승인 가능합니다."}
								,{title:"<i class='fa fa-trash-alt' title='반려'></i>&nbsp;반려", content:"요구사항을 결재 반려합니다. 결재 상태가 대기인 요구사항만 반려 가능합니다."}
								,{title:"<i class='fas fa fa-list' title='목록 수'></i>&nbsp;목록 수", content:"그리드 한 페이지에 표시될 요구사항 결재 목록 수를 지정합니다."}
								,{title:"<i class='fas fa-sort-amount-down' title='목록 높이'></i>&nbsp;목록 높이", content:"결재 요청 목록 그리드의 높이를 변경합니다."}
								,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"요구사항 결재 목록을 조회합니다."}
								,{title:"<i class='fa fa-file-excel' title='엑셀'></i>&nbsp;엑셀", content:"요구사항 결재 목록을 엑셀 파일로 다운로드 합니다."}
								,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"요구사항 결재 목록을 프린트 합니다."}
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
		//요구사항 상세 보기
		,"req4104":
			[{id:"req4104Guide_reqComment",target:"reqComment",mainTitle:"[요구사항 코멘트]",top:170,left:880,position:"bottom",targetPosition:"bottom",curve:false
				,subBox:[
				     {title:"<i></i>",content:"요구사항 진행중에 코멘트를 등록  및 확인합니다."}
				]},
		    {id:"req4104Guide_reqTabFooter",target:"reqTabFooter",mainTitle:"[요구사항 상세 정보]",top:550,left:499,position:"right",targetPosition:"right"
			   	 ,subBox:[
			   	     {title:"<i class='fa fa-th-list' title='작업흐름 변경이력'></i>&nbsp;작업흐름 변경이력",content:"요구사항의 작업으름 변경이력을 조회합니다."}
			   	    ,{title:"<i class='fa fa-history' title='요구사항 수정이력'></i>&nbsp;요구사항 수정이력",content:"요구사항의 수정이력을 조회합니다."}
			   	    ,{title:"<i class='fa fa-list' title='추가항목 정보'></i>&nbsp;추가항목 정보",content:"요구사항의 추가항목 정보을 조회합니다."}
			   	    ,{title:"<i class='fas fa-project-diagram' title='작업 내용'></i>&nbsp;작업 내용",content:"요구사항의 작업 내용 목록 조회합니다."}
			   	    ,{title:"<i class='fa fa-code-branch' title='리비젼 정보'></i>&nbsp;리비젼 정보",content:"요구사항의 저장된 리비젼의 SVN저장소 정보를 조회합니다."}
			   	    ,{title:"<i class='fa fa-puzzle-piece' title='배포 정보'></i>&nbsp;배포 정보",content:"요구사항이 배정된 배포계획과 배포계획에 배정된 JOB 목록을 조회합니다."}
			   	    ,{title:"<i class='fa fa-clipboard' title='메모장'></i>&nbsp;메모장",content:"요구사항의 메모를 조회합니다. 메모장에서는 메모를 등록, 수정, 삭제, <br/>상세보기를 할 수 있습니다."}
			   	]},
			{id:"req4104Guide_reqDescAndFile",target:"reqDescAndFile",mainTitle:"[요청 내용 및 첨부파일]",top:390,left:600,position:"top",targetPosition:"bottom",curve:false
				,subBox:[
					 {title:"",content:"요구사항의 내용 및 첨부파일을 확인합니다. 첨부파일 클릭 시 <br/>파일을 다운로드 받을 수 있으며, 전체 다운로드 버튼 클릭 시 <br/>첨부된 전체 파일을 압축파일로 다운로드 받을 수 있습니다."}
				]},
			{id:"req4104Guide_reqInfo",target:"reqInfo",mainTitle:"[요청 정보]",top:340,left:100,position:"top",targetPosition:"bottom",curve:false
				,subBox:[
				      {title:"",content:"요구사항 정보를 확인할 수 있습니다. <br/>[ <i class='fas fa-angle-down'></i> ] 버튼을 클릭하면 요구사항의 전체 정보를 볼 수 있습니다."}
				]}  	
		]
		//요구사항 접수
		,"req4106":
			[
		    {id:"req4106Guide_reject",target:"reject",mainTitle:"[접수 반려]",top:695,left:281,position:"bottom",targetPosition:"top"
			   	 ,subBox:[
			   	     {title:"<i class='fa fa-check' title='접수 반려'></i>&nbsp;접수 반려",content:"요구사항을 접수 반려 합니다.<br/>반려된 요구사항은 처리 종료됩니다."}
			   	    
			    ]}								         
		]
		//프로젝트 생성 마법사
		,"prj1004":
			[
			 	{id:"sw-btn-prev",target:"prevButton",mainTitle:"[이전 단계]",top:740,left:100,position:"right",targetPosition:"left"
			 		,subBox:[
				      {title:"<i class='fa fa-arrow-left' title='이전 단계'></i>&nbsp;이전 단계",content:"이전 단계로 돌아 갑니다."}
				]},
				{id:"sw-btn-next",target:"nextButton",mainTitle:"[다음 단계]",top:640,left:100,position:"right",targetPosition:"top"
					,subBox:[
					  {title:"다음 단계&nbsp;<i class='fa fa-arrow-right' title='다음 단계'></i>",content:"다음 단계로 돌아 갑니다."}
				]},
				{id:"prj1004_doneBtn",target:"projectWizrdComplete",mainTitle:"[완료]",top:550,left:600,position:"bottom",targetPosition:"top"
					,subBox:[
				      {title:"완료",content:"추가 마법사를 종료하고 </br>입력 및 선택된 정보를 토대로</br>프로젝트를 생성합니다."}
				]},
				{id:"prj1004_closeBtn",target:"projectWizrdClose",mainTitle:"[취소]",top:655,left:1100,position:"left",targetPosition:"right"
					 ,subBox:[
					  {title:"취소",content:"추가 마법사를 취소합니다.</br>입력된 모든 항목 값이 초기화 됩니다."}
				]},
				{id:"prj1004_stepMenu",target:"wizardStepMenu",mainTitle:"[추가 마법사 단계]",top:200,left:750,position:"right",targetPosition:"right"
					,subBox:[
					  {title:"프로젝트",content:"프로젝트 그룹 선택 후</br>생성할 프로젝트 정보를 입력 합니다."},
					  {title:"프로세스",content:"기본 프로세스 및</br>현재 진행중인 타 프로젝트의 확정 프로세스를 복사합니다.</br>복사된 프로세스는 자동 확정처리 되어있습니다.</br>프로세스 설정 마법사에서 요구사항이 배정되지 않은 프로세스는 확정 취소가 가능합니다."},
					  {title:"업무역할",content:"기본 업무역할 및</br>현재 진행중인 타 프로젝트의 업무역할을 복사합니다.</br>생성자는 복사된 업무역할에 자동 배정됩니다."},
					  {title:"개발문서 양식",content:"기본 개발문서 양식 및</br>현재 진행중인 타 프로젝트의 개발문서 양식을 복사합니다."},
					  {title:"요구사항 분류",content:"현재 진행중인 타 프로젝트의 요구사항 분류 메뉴를 복사합니다.</br>요구사항 분류를 추가 하지 않을 수 있씁니다."},
				]},
					      
					      
			 ]
		// 요구사항 WBS
		,"req4600":
			[{id:"req4600Guide_wbsBtn",target:"req4600button",mainTitle:"[WBS 버튼영역]",top:304,left:800,position:"top",targetPosition:"right"//, curve:false
				,subBox:[
							{title:"<i class='fas fa-arrow-up' title='요구사항 위로 이동'></i>&nbsp;요구사항 위로이동", content:"그리드에서 선택한 요구사항을 위로 이동합니다."}
							,{title:"<i class='fas fa-arrow-down' title='요구사항 아래로 이동'></i>&nbsp;요구사항 아래로 이동", content:"그리드에서 선택한 요구사항을 아래로 이동합니다."}
							,{title:"<i class='fas fa-search-minus' title='간트 차트 줌 아웃'></i>&nbsp;간트 차트 줌 아웃", content:"차트를 줌 아웃 합니다. <br/>ex).현재 월별로 차트가 그려진 상태에서 줌 아웃을 클릭하면 차트가 분기 별로 표시됩니다."}
							,{title:"<i class='fas fa-search-plus' title='간트 차트 줌 인'></i>&nbsp;간트 차트 줌 인", content:"차트를 줌 인 합니다. <br/>ex).현재 월별로 차트가 그려진 상태에서 줌 인을 클릭하면 차트가 주 별로 표시됩니다."}
							,{title:"<span class='teamworkIcon' style='font-size: 16px; font-weight: bold;'>F</span>&nbsp;차트 사이즈 확대", content:"오른쪽 영역의 차트 사이즈를 100%로 변경합니다."}
							,{title:"<span class='teamworkIcon' style='font-size: 16px; font-weight: bold;'>O</span>&nbsp;차트 사이즈 보통", content:"오른쪽 영역의 차트 사이즈를 50%로 변경합니다."}
							,{title:"<span class='teamworkIcon' style='font-size: 16px; font-weight: bold;'>O</span>&nbsp;차트 사이즈 축소", content:"오른쪽 영역의 차트 사이즈를 0%로 변경합니다."}
							,{title:"<i class='fas fa-expand' title='전체보기'></i>&nbsp;전체보기", content:"차트 화면을 전체보기로 확대합니다."}
							,{title:"<i class='far fa-calendar-alt' title='단위 기간'></i>&nbsp;단위 기간", content:"간트 차트가 보여지는 단위를 설정합니다. <br/>일별, 주별, 월별, 분기별, 반기별로 변경 가능하며 기본값은 월별입니다."}
					        ,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"WBS의 요구사항 목록을 조회합니다."}
					        ,{title:"<i class='fas fa fa-save' title='저장'></i>&nbsp;저장", content:"간트 차트  그리드에서 수정한 진척률을 저장합니다."}
					        ,{title:"<i class='fa fa-print' title='프린트'></i>&nbsp;프린트", content:"간트차트를 프린트 합니다."}
				         ]},
			{id:"req4600Guide_wbsGantt",target:"req4600WbsGantt",mainTitle:"[WBS 차트]",top:320,left:160,position:"bottom",targetPosition:"bottom", curve:false
				,subBox:[
				         	{title:"<i class='fas fa fa-list' title='왼쪽 그리드 영역'></i>&nbsp;그리드 영역", content:"왼쪽에는 조회한 요구사항이 목록이 표시됩니다. <br/>요구사항의 진척률을 수정할 수 있으며, <br/>더블클릭 시 요구사항 상세보기 팝업이 열립니다."}
				         	,{title:"<i class='fas fa-chart-bar' title='오른쪽 차트 영역'></i>&nbsp;차트 영역", content:"오른쪽에는 조회한 요구사항에 대한 차트가 표시됩니다. <br/>차트 영역에는 현재 날짜에 붉은 선이 표시되며, <br/>차트의 Bar를 더블클릭 시 요구사항 상세보기 팝업이 열립니다."}
				         	,{title:"", content:""}
				         	,{title:"<div class='taskStatus cvcColorSquare' status='STATUS_ACTIVE'></div>&nbsp; 상태 : 여유", content:"완료되지 않았으며 현재일을 기준으로 완료시한이 4일 이상 <br/>여유있는 요구사항입니다. 차트에서 <font color='#00d200' style='font-weight: bold;'>초록색 신호등</font>으로 표시됩니다."}
				         	,{title:"<div class='taskStatus cvcColorSquare' status='STATUS_WAITING'></div>&nbsp; 상태 : 임박", content:"완료되지 않았으며 현재일을 기준으로 완료시한이 3일 이하로 남은 <br/>요구사항입니다. 차트에서  <font color='#fba450' style='font-weight: bold;'>주황색 신호등</font>으로 표시됩니다."}
				         	,{title:"<div class='taskStatus cvcColorSquare' status='STATUS_SUSPENDED'></div>&nbsp; 상태 : 초과", content:"완료되지 않은 요구사항 중 현재일을 기준으로 작업시한을 넘긴 <br/>요구사항입니다. 차트에서 <font color='#ff1a00' style='font-weight: bold;'> 빨강색 신호등</font>으로 표시됩니다."}
				         	,{title:"<div class='taskStatus cvcColorSquare' status='STATUS_DONE'></div>&nbsp; 상태 : 적기", content:"완료시한 이내 정상완료된 요구사항입니다. <br/>차트에서  <font color='#4b73eb' style='font-weight: bold;'>파랑색 신호등</font>으로 표시됩니다."}
				         	,{title:"<div class='taskStatus cvcColorSquare' status='STATUS_FAILED'></div>&nbsp; 상태 : 실패", content:"완료시한을 초과하여 완료된 요구사항입니다. <br/>차트에서 짙은  <font color='#ff5643' style='font-weight: bold;'>주황색 신호등</font>으로 표시됩니다."}
				         	
				         ]}  
			]
		// 프로젝트 업무역할 사용자 배정
		,"stm4100":
			[{id:"stm4100Guide_search",target:"stm4100SearchArea",mainTitle:"[프로젝트 검색 영역]",top:9,left:523,position:"left",targetPosition:"left"//, curve:false
				,subBox:[
							{title:"<i class='fa fa-search' title='검색 콤보 박스'></i>&nbsp;검색 콤보박스", 
								content:"프로젝트를 검색 조건 콤보박스입니다. <br/>&nbsp;- 전체보기 : 라이선스 그룹의 전체 프로젝트 목록을 조회됩니다. <br/>&nbsp;- 프로젝트 : 프로젝트 콤보박스가 나오며, " +
										"프로젝트 선택 후 조회 시 트리에서 프로젝트가 선택됩니다. <br/>&nbsp;- 프로젝트 명 : 프로젝트 명으로 검색 시 트리에서 프로젝트가 선택됩니다."}
							,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"라이선스 그룹의 모든 프로젝트를 조회합니다."}
				         ]},
			{id:"stm4100Guide_prjTree",target:"stm4100PrjTree",mainTitle:"[프로젝트 및 역할그룹 목록]",top:553,left:150,position:"left",targetPosition:"left", curve:false
				,subBox:[
				         	{title:"<i class='fas fa fa-list' title='프로젝트 및 역할그룹 목록'></i>&nbsp;프로젝트 및 역할그룹", content:"왼쪽에는 프로젝트 및 프로젝트에 있는 <br/>역할 그룹 목록이 트리 형태로 표시됩니다."}
				         	,{title:"<i class='fas fa-mouse-pointer' title='역할그룹 선택'></i>&nbsp;역할그룹 선택", content:"트리에서 역할그룹 선택 시 오른쪽에 역할그룹에 <br/>배정된 사용자 및 배정되지 않은 사용자 목록이 <br/>표시됩니다."}
						]},
			{id:"stm4100Guide_authAddUsr",target:"stm4100AuthAddUsr",mainTitle:"[배정된 사용자 목록]",top:320,left:700,position:"left",targetPosition:"left", curve:false
				,subBox:[
							{title:"<i class='fas fa fa-list' title='배정된 사용자 목록'></i>&nbsp;역할그룹 배정된 사용자 목록", content:"왼쪽 트리에서 선택한 역할그룹에 배정된 사용자 목록이 표시됩니다."}
							,{title:"[<i class='fas fa-long-arrow-alt-down' title='삭제' style='color: red;'></i>&nbsp;삭제]", content:"배정된 사용자 목록에서 체크 후 삭제버튼 클릭 시 역할그룹에서 <br/>사용자가 삭제됩니다.<br/>프로젝트의 전체 역할그룹에서 배정된 사용자가 1명일 경우 삭제할 수 없습니다."}
						]},
			{id:"stm4100Guide_prjAllUsr",target:"stm4100PrjAllUsr",mainTitle:"[등록된 사용자 목록]",top:793,left:700,position:"left",targetPosition:"left", curve:false
				,subBox:[
							{title:"<i class='fas fa fa-list' title='등록된 사용자 목록'></i>&nbsp;프로젝트 등록된 사용자 목록", content:"왼쪽 트리에서 선택한 역할그룹에 배정되지 않은 사용자 목록이 표시됩니다."}
							,{title:"[<i class='fas fa-long-arrow-alt-up' title='추가' style='color: blue;'></i>&nbsp;추가]", content:"등록된 사용자 목록에서 체크 후 추가 버튼 클릭 시 역할그룹에 사용자가 <br/>배정됩니다."}
				]} 			
			]
		// 프로젝트 WBS
		,"wbs2100":
			[{id:"wbs2100Guide_wbsBtn",target:"wbs2100button",mainTitle:"[WBS 버튼영역]",top:304,left:800,position:"top",targetPosition:"right"//, curve:false
				,subBox:[
							{title:"<i class='far fa-calendar-alt' title='단위 기간'></i>&nbsp;단위 기간", content:"간트 차트가 보여지는 단위를 설정합니다. <br/>일별, 주별, 월별, 분기별, 반기별로 변경 가능하며 기본값은 월별입니다."}
							,{title:"<i class='fas fa-search-plus' title='간트 차트 단위기간 확대'></i>&nbsp;간트 차트 단위기간 확대", content:"간트 차트 단위기간을 확대 합니다. <br/>ex).현재 월별로 차트가 그려진 상태에서 확대를 클릭하면 차트가 주 별로 표시됩니다."}
							,{title:"<i class='fas fa-search-minus' title='간트 차트 단위기간 축소'></i>&nbsp;간트 차트 단위기간 축소", content:"간트 차트 단위기간을 축소 합니다. <br/>ex).현재 월별로 차트가 그려진 상태에서 줌 아웃을 클릭하면 차트가 분기 별로 표시됩니다."}
							,{title:"<i class='fas fa-plus' title='WBS Task 펼치기'></i>&nbsp;WBS Task 펼치기", content:"선택한 WBS Task의 하위 Task를 펼치기 합니다."}
							,{title:"<i class='fas fa-minus' title='WBS Task 접기'></i>&nbsp;WBS Task 접기", content:"선택한 WBS Task의 하위 Task를 접기 합니다."}
							,{title:"<img src='/images/icon/icon_gantt_reduce.png' style='width:21px;height:21px;'>&nbsp;차트 사이즈 확장", content:"오른쪽 영역의 차트 사이즈를 100%로 변경합니다."}
							,{title:"<img src='/images/icon/icon_gantt_middle.png' style='width:21px;height:21px;'>&nbsp;차트 사이즈 보통", content:"오른쪽 영역의 차트 사이즈를 50%로 변경합니다."}
							,{title:"<img src='/images/icon/icon_gantt_expend.png' style='width:21px;height:21px;'>&nbsp;차트 사이즈 축소", content:"오른쪽 영역의 차트 사이즈를 0%로 변경합니다."}
							,{title:"<i class='fas fa-expand' title='전체보기'></i>&nbsp;전체보기", content:"차트 화면을 전체보기로 확대합니다."}
							,{title:"<i class='far fa-calendar-alt' title='진척률 기준일자'></i>&nbsp;진척률 기준일자", content:"진척률 재계산시 기준이 되는 일자입니다."}
					        ,{title:"<i class='fas fa fa-list' title='조회'></i>&nbsp;조회", content:"WBS의 요구사항 목록을 조회합니다."}
					        ,{title:"<i class='fa fa-download' title='양식 다운로드'></i>&nbsp;양식 다운로드", content:"WBS 업로드 엑셀 양식 파일을 다운로드 합니다."}
					        ,{title:"<i class='fa fa-upload' title='엑셀 업로드'></i>&nbsp;엑셀 업로드", content:"WBS 엑셀 양식 파을을 업로드합니다."}
					        ,{title:"<i class='fa fa-file-excel' title='엑셀 다운로드'></i>&nbsp;엑셀 다운로드", content:"전체 WBS를 엑셀 파일로 다운로드 합니다."}
					        ,{title:"<i class='fa fa-file-excel' title='진척현황'></i>&nbsp;진척현황", content:"WBS 진척현황(3레벨 Task까지)을 엑셀 파일로 다운로드합니다."}
					        ,{title:"<i class='fa fa-calculator' title='진척률 재계산'></i>&nbsp;진척률 재계산", content:"진척률 기준일자를 기준으로 전체 WBS Task의 진척률을 재계산합니다."}
					        ,{title:"<i class='fa fa-calculator' title='가중치 설정'></i>&nbsp;가중치 설정", content:"등록된 프로세스의 단계별 가중치를 설정합니다."}
				         ]},
			{id:"wbs2100Guide_wbsGantt",target:"wbs2100WbsGantt",mainTitle:"[WBS 차트]",top:320,left:115,position:"bottom",targetPosition:"bottom", curve:false
				,subBox:[
				         	{title:"<i class='fas fa fa-list' title='왼쪽 Task 영역'></i>&nbsp;Task 영역", content:"왼쪽에는 조회한 WBS Task 목록이 표시됩니다. Task는 다음과 같이 구분됩니다.<br/>4레벨 까지는 일반 Task이며, 5레벨 Task는 상세 요구사항, 6레벨은 상세 요구사항이 있는 <br/>프로세스의 각 작업흐름(단계)입니다." +
				         			"<br/>4레벨 Task에 상세 요구사항을 연결하면 자동으로 5레벨, 6레벨 Task가 생성됩니다." +
				         			"<br/>Task를 더블 클릭 시 Task의 정보를 수정 및 상세 요구사항, 산출물을 연결할 수 있습니다."}
				         	,{title:"<i class='fas fa-chart-bar' title='오른쪽 차트 영역'></i>&nbsp;차트 영역", content:"오른쪽에는 조회한 WBS Task의 차트가 표시됩니다. <br/>차트의 주황색 라인은 계획 시작/종료일을 기준으로, 초록색 라인은 실적 시작/종료일을 <br/>기준으로 그려집니다."}
				         	,{title:"", content:""}
				         	
				         ]}
			]
	}