"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Track, MemberAttendanceSummary, AttendanceStatus, Member, Session, AttendanceRecord } from "@/types"
import {
  fetchMembers,
  fetchSessions,
  fetchAttendance,
  updateAttendance,
  getMemberSummaries,
} from "@/lib/supabase-data"
import StatsCards from "@/components/StatsCards"
import TrackFilter from "@/components/TrackFilter"
import AttendanceTable from "@/components/AttendanceTable"
import AttendanceModal from "@/components/AttendanceModal"

export default function Home() {
  const [members, setMembers] = useState<Member[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [trackFilter, setTrackFilter] = useState<Track | "all">("all")
  const [selectedMember, setSelectedMember] = useState<MemberAttendanceSummary | null>(null)

  const loadData = useCallback(async () => {
    try {
      setError(null)
      const [membersData, sessionsData, attendanceData] = await Promise.all([
        fetchMembers(),
        fetchSessions(),
        fetchAttendance(),
      ])
      setMembers(membersData)
      setSessions(sessionsData)
      setRecords(attendanceData)
    } catch (err) {
      console.error("데이터 로드 실패:", err)
      setError("데이터를 불러오는 데 실패했습니다. 새로고침해주세요.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const summaries = useMemo(() => {
    return getMemberSummaries(members, records, trackFilter)
  }, [members, records, trackFilter])

  const handleUpdate = async (recordId: string, status: AttendanceStatus, reason: string | null) => {
    try {
      await updateAttendance(recordId, status, reason)

      setRecords((prev) =>
        prev.map((r) =>
          r.id === recordId ? { ...r, status, reason, updatedAt: new Date().toISOString() } : r
        )
      )

      if (selectedMember) {
        setSelectedMember({
          ...selectedMember,
          records: selectedMember.records.map((r) =>
            r.id === recordId ? { ...r, status, reason } : r
          ),
        })
      }
    } catch (err) {
      console.error("출석 업데이트 실패:", err)
      alert("저장에 실패했습니다. 다시 시도해주세요.")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-lion-gray-200 border-t-lion-orange" />
          <p className="mt-3 text-sm text-lion-gray-500">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
            ⚠️
          </div>
          <p className="mt-3 text-sm font-medium text-lion-black">{error}</p>
          <button
            onClick={() => {
              setLoading(true)
              loadData()
            }}
            className="mt-4 rounded-lg bg-lion-orange px-4 py-2 text-sm font-medium text-white hover:bg-lion-orange-dark"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <StatsCards members={members} sessions={sessions} records={records} />

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-bold text-lion-black">멤버 출석 현황</h3>
          <TrackFilter selected={trackFilter} onChange={setTrackFilter} />
        </div>

        <AttendanceTable summaries={summaries} sessions={sessions} onMemberClick={setSelectedMember} />
      </div>

      {selectedMember && (
        <AttendanceModal
          summary={selectedMember}
          onClose={() => setSelectedMember(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
