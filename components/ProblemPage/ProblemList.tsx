"use client"
// 문제 배점 가져와서 랜더링 - Api 관련
// 상단에 시험모드 게시기간 랜더링 - Api 관련
// 페이지 작아지면 채점하기랑 문제 추가하기 버튼 로고만 보이게 (글씨 안 보이게)

import { useRouter } from "next/navigation"
import { useState } from "react"
import { problem_api, problem_ref_api } from "@/lib/api"

interface Problem {
	problem_id: number
	title: string
	description: string
	attempt_count: number
	pass_count: number
	points: number
}

interface ProblemListProps {
	problems: Problem[]
	groupId: number
	workbookId: number
	isGroupOwner: boolean
	refresh: boolean // Added refresh prop
	setRefresh: React.Dispatch<React.SetStateAction<boolean>> // Added setRefresh prop
}

const ProblemList = ({ problems, groupId, workbookId, isGroupOwner, refresh, setRefresh }: ProblemListProps) => {
	const router = useRouter()
	const [currentProblems, setCurrentProblems] = useState<Problem[]>(problems)

	// 문제 배점 수정 모달창 관련 필드
	const [editingProblem, setEditingProblem] = useState<Problem | null>(null)
	const [editScore, setEditScore] = useState<number>(0)

	const deleteProblem = async (problemId: number) => {
		if (!confirm("정말 삭제하시겠습니까?")) return
		try {
			await problem_ref_api.problem_ref_delete(groupId, workbookId, problemId)
			setCurrentProblems((prev) => prev.filter((p) => p.problem_id !== problemId))
			setRefresh(!refresh) // Trigger refresh by toggling the state
		} catch (error) {
			console.error("문제 삭제 실패:", error)
			alert("문제 삭제 중 오류가 발생했습니다.")
		}
	}

	return (
		<section>
			<div className="w-full overflow-x-auto">
				<table className="w-full border-collapse bg-white shadow-md rounded-2xl overflow-hidden">
					<thead className="bg-gray-200">
						<tr className="border-b-4 border-gray-200 text-gray-800">
							<th className="px-5 py-4 text-center text-lg font-semibold">#</th>
							<th className="px-5 py-4 text-center text-lg font-semibold">문제 유형</th>
							<th className="px-5 py-4 text-center text-lg font-semibold">문제 제목</th>
							<th className="px-5 py-4 text-center text-lg font-semibold">시도한 횟수</th>
							<th className="px-5 py-4 text-center text-lg font-semibold">맞은 횟수</th>
							{isGroupOwner && <th className="px-5 py-4 text-center text-lg font-semibold">베점</th>}
							{/* <th className="px-5 py-4 text-center text-lg font-semibold"></th> */}
							{isGroupOwner && <th className="px-5 py-4 text-center text-lg font-semibold"></th>}
							{isGroupOwner && <th className="px-5 py-4 text-center text-lg font-semibold"></th>}
						</tr>
					</thead>
					<tbody>
						{currentProblems.length > 0 ? (
							currentProblems.map((p, index) => {
								const PROBLEM_TYPES = [
									{ value: "코딩", label: "코딩", color: "bg-blue-100 text-blue-800" },
									{ value: "디버깅", label: "디버깅", color: "bg-red-100 text-red-800" },
									{ value: "객관식", label: "객관식", color: "bg-green-100 text-green-800" },
									{ value: "주관식", label: "주관식", color: "bg-purple-100 text-purple-800" },
									{ value: "단답형", label: "단답형", color: "bg-yellow-100 text-yellow-800" },
								] as const

								const typeInfo = PROBLEM_TYPES.find((t) => t.value === (p as any).problem_type) ?? {
									label: "코딩",
									color: "bg-blue-100 text-blue-800",
								}

								return (
									<tr
										key={p.problem_id}
										className="transition-colors duration-200 border-b border-gray-300 hover:bg-gray-100 cursor-pointer"
									>
										<td className="px-5 py-4 text-center">{index + 1}</td>

										{/* 문제 유형 열 */}
										<td className="px-5 py-4 text-center">
											<span className={`text-xs px-2 py-1 rounded font-semibold ${typeInfo.color}`}>
												{typeInfo.label}
											</span>
										</td>

										<td
											className="px-5 py-4 text-center truncate max-w-[200px] overflow-hidden whitespace-nowrap"
											title={p.title}
										>
											{p.title.length > 15 ? `${p.title.slice(0, 15)}...` : p.title}
										</td>
										<td className="px-5 py-4 text-center">{p.attempt_count}</td>
										<td className="px-5 py-4 text-center">{p.pass_count}</td>
										{isGroupOwner && <td>{p.points}</td>}
										{/* <td className="px-5 py-4 text-center">
											<button
												onClick={() => router.push(`/mygroups/${groupId}/exams/${workbookId}/problems/${p.problem_id}`)}
												className="w-full py-2 rounded-md text-sm font-medium transition-all duration-300 ease-in-out active:scale-95 bg-mygreen text-white hover:bg-opacity-80"
											>
												도전하기
											</button>
										</td> */}
										{/* 문제 수정하기, 삭제하기 - 그룹장 권한 */}
										{isGroupOwner && (
											<td className="px-5 py-4 text-center">
												<button
													onClick={() => {
														setEditingProblem(p)
														setEditScore(p.points) //문제의 점수를 연동해야함
													}}
													className="text-blue-600 hover:text-red-700 text-sm font-semibold"
												>
													배점 수정
												</button>
											</td>
										)}

										{isGroupOwner && (
											<td className="px-5 py-4 text-center">
												<button
													onClick={() => deleteProblem(p.problem_id)}
													className="text-red-500 hover:text-red-700 text-sm font-semibold"
												>
													삭제
												</button>
											</td>
										)}
									</tr>
								)
							})
						) : (
							<tr>
								<td colSpan={isGroupOwner ? 6 : 5} className="px-5 py-6 text-center text-gray-500">
									📌 문제가 없습니다.
								</td>
							</tr>
						)}
					</tbody>
				</table>
				{/* 모달창 추가*/}
				{editingProblem && (
					<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
						<div className="bg-white rounded-lg w-[400px] p-6 relative shadow-lg">
							{/* 닫기 버튼 */}
							<button
								onClick={() => setEditingProblem(null)}
								className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
							>
								×
							</button>

							<h2 className="text-xl font-bold mb-4">배점 수정</h2>

							<label className="block text-sm font-medium text-gray-700 mb-1">배점</label>
							<input
								type="number"
								value={editScore}
								onChange={(e) => setEditScore(Number(e.target.value))}
								className="w-full border rounded px-3 py-2 mb-6"
							/>

							<div className="flex justify-end">
								<button
									onClick={async () => {
										try {
											await problem_ref_api.problem_ref_edit_points(
												//점수수정모달 연동해야함
												groupId,
												workbookId,
												editingProblem.problem_id,
												editScore
											)
											setEditingProblem(null)
											setRefresh(!refresh)
										} catch (error) {
											alert("배점 수정 실패")
											console.error(error)
										}
									}}
									className="px-4 py-2 bg-mygreen text-white rounded-md hover:bg-opacity-80 active:scale-95"
								>
									수정하기
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</section>
	)
}

export default ProblemList
