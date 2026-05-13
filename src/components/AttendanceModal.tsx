"use client"

import { useState, useEffect } from "react"
import {
  MemberAttendanceSummary,
  AttendanceRecord,
  AttendanceStatus,
  Session,
  STATUS_LABELS,
  TRACK_LABELS,
} from "@/types"
import { fetchSessions, updateSessionDate } from "@/lib/supabase-data"

const STATUS_BADGE_STYLES: Record<AttendanceStatus, { backgroundColor: string; color: string }> = {
  none: { backgroundColor: "#F3F4F6", color: "#9CA3AF" },
  present: { backgroundColor: "#FF7710", color: "#FFFFFF" },
  late: { backgroundColor: "#EAB308", color: "#111111" },
  late_reason: { backgroundColor: "#F97316", color: "#FFFFFF" },
  absent: { backgroundColor: "#EF4444", color: "#FFFFFF" },
  absent_excused: { backgroundColor: "#4B5563", color: "#FFFFFF" },
}

interface AttendanceModalProps {
  summary: MemberAttendanceSummary
  onClose: () => void
  onUpdate: (recordId: string, status: AttendanceStatus, reason: string | null) => void
}

export default function AttendanceModal({ summary, onClose, onUpdate }: AttendanceModalProps) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<AttendanceStatus>("present")
  const [editReason, setEditReason] = useState("")
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editSessionDate, setEditSessionDate] = useState("")

  useEffect(() => {
    fetchSessions().then(setSessions)
  }, [])

  const startEdit = (record: AttendanceRecord) => {
    setEditingId(record.id)
    setEditStatus(record.status === "none" ? "present" : record.status)
    setEditReason(record.reason || "")
  }

  const saveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editStatus, editReason || null)
      setEditingId(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const startSessionDateEdit = (sessionId: string) => {
    setEditingSessionId(sessionId)
    setEditSessionDate(getSessionDate(sessionId))
  }

  const saveSessionDateEdit = async () => {
    if (!editingSessionId || !editSessionDate) return

    try {
      await updateSessionDate(editingSessionId, editSessionDate)
      setSessions((prev) =>
        prev.map((session) =>
          session.id === editingSessionId ? { ...session, date: editSessionDate } : session
        )
      )
      setEditingSessionId(null)
      setEditSessionDate("")
    } catch (err) {
      console.error("세션 날짜 업데이트 실패:", err)
      alert("세션 날짜 저장에 실패했습니다. 다시 시도해주세요.")
    }
  }

  const cancelSessionDateEdit = () => {
    setEditingSessionId(null)
    setEditSessionDate("")
  }

  const getSessionTitle = (sessionId: string) => {
    return sessions.find((s) => s.id === sessionId)?.title || ""
  }

  const getSessionDate = (sessionId: string) => {
    return sessions.find((s) => s.id === sessionId)?.date || ""
  }

  const sortedRecords = [...summary.records].sort((a, b) => {
    const dateA = getSessionDate(a.sessionId)
    const dateB = getSessionDate(b.sessionId)
    return dateA.localeCompare(dateB)
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-lion-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-lion-gray-200 bg-white/95 backdrop-blur-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-lion-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lion-orange/10 text-xl font-bold text-lion-orange">
                {summary.member.name[0]}
              </div>
              <div>
                <h2 className="text-lg font-bold text-lion-black">{summary.member.name}</h2>
                <p className="text-sm text-lion-gray-500">
                  {TRACK_LABELS[summary.member.track]} · {summary.member.studentId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-lion-gray-400 transition-colors hover:bg-lion-gray-100 hover:text-lion-black"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 grid grid-cols-5 gap-2">
            <div className="rounded-lg bg-lion-orange/10 p-2 text-center">
              <p className="text-lg font-bold text-lion-orange">{summary.presentCount}</p>
              <p className="text-[10px] text-lion-gray-500">출석</p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-2 text-center">
              <p className="text-lg font-bold text-status-late">{summary.lateCount}</p>
              <p className="text-[10px] text-lion-gray-500">지각</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-2 text-center">
              <p className="text-lg font-bold text-status-late-reason">{summary.lateReasonCount}</p>
              <p className="text-[10px] text-lion-gray-500">사유지각</p>
            </div>
            <div className="rounded-lg bg-red-50 p-2 text-center">
              <p className="text-lg font-bold text-status-absent">{summary.absentCount}</p>
              <p className="text-[10px] text-lion-gray-500">결석</p>
            </div>
            <div className="rounded-lg bg-lion-gray-100 p-2 text-center">
              <p className="text-lg font-bold text-status-absent-excused">{summary.absentExcusedCount}</p>
              <p className="text-[10px] text-lion-gray-500">유고</p>
            </div>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto p-6">
          <h3 className="mb-3 text-sm font-semibold text-lion-gray-500">출석 이력</h3>
          <div className="space-y-3">
            {sortedRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-lg border border-lion-gray-100 p-3 transition-colors hover:border-lion-orange/20"
              >
                {editingId === record.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-lion-black">
                        {getSessionTitle(record.sessionId)}
                      </p>
                      <p className="text-xs text-lion-gray-400">
                        {getSessionDate(record.sessionId)}
                      </p>
                    </div>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as AttendanceStatus)}
                      className="w-full rounded-lg border border-lion-gray-200 px-3 py-2 text-sm focus:border-lion-orange focus:outline-none focus:ring-1 focus:ring-lion-orange"
                    >
                      {(Object.keys(STATUS_LABELS) as AttendanceStatus[])
                        .filter((s) => s !== "none")
                        .map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                    </select>
                    <input
                      type="text"
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      placeholder="사유 입력 (선택)"
                      className="w-full rounded-lg border border-lion-gray-200 px-3 py-2 text-sm focus:border-lion-orange focus:outline-none focus:ring-1 focus:ring-lion-orange"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg border border-lion-gray-200 px-3 py-1.5 text-xs font-medium text-lion-gray-600 hover:bg-lion-gray-50"
                      >
                        취소
                      </button>
                      <button
                        onClick={saveEdit}
                        className="rounded-lg bg-lion-orange px-3 py-1.5 text-xs font-medium text-white hover:bg-lion-orange-dark"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer space-y-2"
                    onClick={() => startEdit(record)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-lion-black">
                          {getSessionTitle(record.sessionId)}
                        </p>
                        <p className="text-xs text-lion-gray-400">
                          {getSessionDate(record.sessionId)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge" style={STATUS_BADGE_STYLES[record.status]}>
                          {STATUS_LABELS[record.status]}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            startSessionDateEdit(record.sessionId)
                          }}
                          className="rounded-md border border-lion-gray-200 px-2 py-1 text-xs text-lion-gray-600 hover:bg-lion-gray-50"
                        >
                          날짜 수정
                        </button>
                      </div>
                    </div>

                    {editingSessionId === record.sessionId && (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="date"
                          value={editSessionDate}
                          onChange={(e) => setEditSessionDate(e.target.value)}
                          className="rounded-lg border border-lion-gray-200 px-2 py-1 text-xs focus:border-lion-orange focus:outline-none focus:ring-1 focus:ring-lion-orange"
                        />
                        <button
                          type="button"
                          onClick={saveSessionDateEdit}
                          className="rounded-md bg-lion-orange px-2 py-1 text-xs font-medium text-white hover:bg-lion-orange-dark"
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={cancelSessionDateEdit}
                          className="rounded-md border border-lion-gray-200 px-2 py-1 text-xs text-lion-gray-600 hover:bg-lion-gray-50"
                        >
                          취소
                        </button>
                      </div>
                    )}

                    {record.reason && (
                      <p className="mt-2 rounded-md bg-lion-gray-50 px-2 py-1 text-xs text-lion-gray-600">
                        💬 {record.reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-lion-gray-100 bg-lion-gray-50/50 px-6 py-3">
          <p className="text-center text-xs text-lion-gray-400">
            클릭하여 출석 상태를 수정할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  )
}
