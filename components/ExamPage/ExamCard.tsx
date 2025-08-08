"use client"

import { useMemo } from "react"

interface ExamCardProps {
	workbook: {
		workbook_id: number
		group_id: number
		workbook_name: string
		problem_cnt: number
		description: string
		creation_date: string
		// 시험모드 관련
		is_test_mode: boolean
		test_start_time: string
		test_end_time: string
		publication_start_time: string
		publication_end_time: string
		workbook_total_points: number
	}
	onClick: () => void
	isGroupOwner: boolean
}

export default function ExamCard({ workbook, onClick, isGroupOwner }: ExamCardProps) {
	// 시간 포맷 함수
	const dateTimeFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat("ko-KR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				hour12: false,
			}),
		[]
	)
	// 2) 비교용 Date 객체
	const pubStartDate = useMemo(() => new Date(workbook.publication_start_time), [workbook.publication_start_time])
	const pubEndDate = useMemo(() => new Date(workbook.publication_end_time), [workbook.publication_end_time])
	const testStartDate = useMemo(() => new Date(workbook.test_start_time), [workbook.test_start_time])
	const testEndDate = useMemo(() => new Date(workbook.test_end_time), [workbook.test_end_time])
	const now = useMemo(() => new Date(), [])

	// 3) 표시용 문자열
	const pubStartStr = dateTimeFormatter.format(pubStartDate) // "2025.08.04. 19:00" 같은
	const pubEndStr = dateTimeFormatter.format(pubEndDate)
	const testStartStr = dateTimeFormatter.format(testStartDate)
	const testEndStr = dateTimeFormatter.format(testEndDate)

	// 4) Date끼리 비교
	const inPublication = workbook.is_test_mode ? now >= pubStartDate && now <= pubEndDate : true
	const inTestPeriod = workbook.is_test_mode ? now >= testStartDate && now <= testEndDate : true

	// 그룹장: 게시기간 상관없이, 학생: 게시기간 내에만 배너 표시
	const showTestBanner = workbook.is_test_mode && (isGroupOwner || inPublication)
	// // 날짜 문자열을 Date 객체로 변환
	// const pubStart = useMemo(() => new Date(workbook.publication_start_time), [workbook.publication_start_time])
	// const pubEnd = useMemo(() => new Date(workbook.publication_end_time), [workbook.publication_end_time])
	// const testStart = useMemo(() => new Date(workbook.test_start_time), [workbook.test_start_time])
	// const testEnd = useMemo(() => new Date(workbook.test_end_time), [workbook.test_end_time])
	// const now = useMemo(() => new Date(), [])

	// // 조건 정의
	// const inPublication = now >= pubStart && now <= pubEnd // 현재 시간이 게시기간 내에 있는지
	// const inTestPeriod = now >= testStart && now <= testEnd // 현재 시간이 제출기간 내에 있는지
	// // 👻 백엔드 구현 완료 후 주석 풀고 아래 코드 사용하기 (지금은 시험모드 정보가 없어서 그룹장인지로만 확인) -> 시험모드이고 교수자일 때만 시험 관련 정보 랜더링
	// const showTestBanner = inPublication && isGroupOwner // workbook.is_test_mode &&

	// // 👻 백엔드 구현 후 버튼 디자인 구상 ~
	// //   시험모드아님 => 문제풀기  *  시험모드+시험기간아님+게시기간+그룹장아님=> 결과 보러가기  *  시험모드+시험기간+그룹장아님=> 시험 보러가기
	// const isExamButton = !workbook.is_test_mode || inTestPeriod

	// // 📌 👻✨ - 7월 21일 회의에서 나온 내용
	// // 버튼 막기 = 제출 한번 하면 끝나게. 버튼 막기. 백엔드에서 제출 횟수 보내줄거임. 그게 한번이면 버튼 바꾸기.
	// // 게시기간+제출기간 수정할 수 있어야됨 => 게시기간

	return (
		<div
			onClick={onClick}
			className="group relative bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer shadow-md transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl transform-gpu flex flex-col justify-between w-full"
		>
			{/* 문제지 제목 */}
			<div>
				<h2 className="text-xl font-semibold mb-2 overflow-hidden text-ellipsis">
					📄 {workbook.workbook_name.length > 24 ? `${workbook.workbook_name.slice(0, 24)}...` : workbook.workbook_name}
				</h2>
			</div>

			{/* 설명 + 문제 수 */}
			{/* 문제지 정보 - 문제지 설명 + 문제 수 <- 일반학생만 보이게*/}
			<div>
				<p
					title={workbook.description}
					className="mb-1 w-full text-gray-600 text-sm overflow-hidden text-ellipsis line-clamp-2"
				>
					{workbook.description}
				</p>
				<p className="mb-2">📌 문제 수: {workbook.problem_cnt}개</p>
			</div>

			{/*  =========== 시험모드 배너 (교수) =========== */}
			{showTestBanner && (
				<div className="bg-red-50 rounded-lg p-4 mb-4 space-y-2">
					<div className="flex items-center gap-2 mb-3">
						<span className="font-medium text-red-800">🎯 시험 모드</span>
					</div>
					<div className="text-xs text-gray-700">
						📅 게시 기간: {pubStartStr} ~ {pubEndStr}
					</div>
					<div className="text-xs text-gray-700">
						📝 제출 기간: {testStartStr} ~ {testEndStr}
					</div>
					<div className="text-xs text-gray-700">✔️ 총 배점: {workbook.workbook_total_points}</div>
				</div>
			)}

			{/*  =========== 시험모드 배너 (학생) =========== */}

			<button
				onClick={(e) => {
					e.stopPropagation()
					onClick()
				}}
				className="w-full py-2 rounded-xl text-lg font-semibold transition-all duration-300 ease-in-out active:scale-95 bg-mygreen text-white hover:bg-opacity-80"
			>
				{workbook.is_test_mode
					? isGroupOwner
						? "시험 관리 →"
						: inTestPeriod
						? "시험 보러가기 →"
						: "결과 보러가기 →"
					: "문제지 펼치기 →"}
			</button>
		</div>
	)
}
