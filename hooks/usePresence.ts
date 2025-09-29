// hooks/usePresence.ts
import { useEffect, useState } from "react"

export interface PresenceUser {
	userId: string
	nickname: string
	joinedAt: string
	lastActivity: string
}

export interface PresenceData {
	count: number
	users: PresenceUser[]
}

export function usePresence(pageId: string, currentUser: { userId: string; nickname: string }) {
	const [presenceData, setPresenceData] = useState < PresenceData > ({
		count: 0,
		users: [],
	})

	useEffect(() => {
		if (!currentUser.userId || !currentUser.nickname) return

		const sessionId = `${currentUser.userId}-${Date.now()}`
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		
    const ws = new WebSocket(`${wsProtocol}//210.115.227.15:8099/ws/presence/${pageId}`);

		ws.onopen = () => {
			console.log("✅ WebSocket 연결 성공")
			// 사용자 접속 알림 전송
			if (currentUser.userId && currentUser.nickname && sessionId) {
				ws.send(
					JSON.stringify({
						type: "join",
						user: {
							userId: currentUser.userId,
							nickname: currentUser.nickname,
							joinedAt: new Date().toISOString(),
							lastActivity: new Date().toISOString(),
							sessionId
						},
					})
				)
			}
		}

		ws.onmessage = (event) => {
			console.log("🔵 [WebSocket] 원본 메시지 수신:", event.data);
			try {
				const data = JSON.parse(event.data)

				switch (data.type) {
					case "participants":
						// 기존 방식 (숫자만)
						setPresenceData((prev) => ({
							count: data.count,
							users: prev.users, // 기존 사용자 목록 유지
						}))
						break

					case "presence_update":
						// 개선된 방식 (전체 사용자 목록)
						setPresenceData({
							count: data.count,
							users: data.users || [],
						})
						break

					case "user_joined":
						setPresenceData((prev) => ({
							count: prev.count + 1,
							users: [...prev.users, data.user],
						}))
						break

					case "user_left":
						setPresenceData((prev) => ({
							count: Math.max(0, prev.count - 1),
							users: prev.users.filter((user) => user.userId !== data.userId),
						}))
						break
				}
			} catch (error) {
				console.error("WebSocket 메시지 파싱 에러:", error)
			}
		}

		ws.onclose = () => {
			if (ws.readyState === WebSocket.OPEN && currentUser.userId && sessionId) {
				ws.send(JSON.stringify({
					type: "leave",
					userId: currentUser.userId, // 가능하면 sessionId도 같이 넣기
					sessionId: sessionId,
				}))

				console.log("🔌 WebSocket 연결 종료")
			}
		}

		ws.onerror = (error) => {
			console.error("❌ WebSocket 에러:", error)
		}

		return () => {
			// 연결 해제 시 사용자 나가기 알림 전송
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(
					JSON.stringify({
						type: "leave",
						userId: currentUser.userId,
					})
				)
			}
			ws.close()
		}
	}, [pageId, currentUser.userId, currentUser.nickname])

	return presenceData
}