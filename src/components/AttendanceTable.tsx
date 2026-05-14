"use client"

import { AttendanceStatus, MemberAttendanceSummary, Session, TRACK_LABELS, STATUS_LABELS, Track } from "@/types"

interface AttendanceTableProps {
  summaries: MemberAttendanceSummary[]
  sessions: Session[]
  onMemberClick: (summary: MemberAttendanceSummary) => void
}

const TRACK_BADGE_COLORS: Record<Track, string> = {
  PM: "bg-purple-100 text-purple-700",
  FE: "bg-blue-100 text-blue-700",
  BE: "bg-green-100 text-green-700",
  Design: "bg-pink-100 text-pink-700",
}

const STATUS_BADGE_STYLES: Record<AttendanceStatus, { backgroundColor: string; color: string }> = {
  none: { backgroundColor: "#F3F4F6", color: "#9CA3AF" },
  present: { backgroundColor: "#FF7710", color: "#FFFFFF" },
  late: { backgroundColor: "#EAB308", color: "#111111" },
  late_reason: { backgroundColor: "#F97316", color: "#FFFFFF" },
  absent: { backgroundColor: "#EF4444", color: "#FFFFFF" },
  absent_excused: { backgroundColor: "#4B5563", color: "#FFFFFF" },
}

export default function AttendanceTable({ summaries, sessions, onMemberClick }: AttendanceTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-lion-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-lion-gray-100 bg-lion-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-lion-gray-500">
                이름
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-lion-gray-500 sm:table-cell">
                트랙
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-lion-gray-500 md:table-cell">
                학번
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-lion-gray-500">
                출석률
              </th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-lion-gray-500 sm:table-cell">
                출석
              </th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-lion-gray-500 sm:table-cell">
                지각
              </th>
              <th className="hidden px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-lion-gray-500 lg:table-cell">
                결석
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-lion-gray-500">
                최근 상태
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lion-gray-100">
            {summaries.map((summary) => {
              const sortedRecords = [...summary.records]
                .filter((r) => r.status !== "none")
                .sort((a, b) => {
                  const dateA = sessions.find((s) => s.id === a.sessionId)?.date || ""
                  const dateB = sessions.find((s) => s.id === b.sessionId)?.date || ""
                  return dateB.localeCompare(dateA)
                })
              const latestRecord = sortedRecords[0] || null
              return (
                <tr
                  key={summary.member.id}
                  onClick={() => onMemberClick(summary)}
                  className="cursor-pointer transition-colors hover:bg-lion-orange/5"
                >
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lion-orange/10 text-sm font-bold text-lion-orange">
                        {summary.member.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-lion-black">{summary.member.name}</p>
                        <p className="text-xs text-lion-gray-400 sm:hidden">
                          {TRACK_LABELS[summary.member.track]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 sm:table-cell">
                    <span className={`badge ${TRACK_BADGE_COLORS[summary.member.track]}`}>
                      {TRACK_LABELS[summary.member.track]}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-lion-gray-500 md:table-cell">
                    {summary.member.studentId}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    <span
                      className={`text-sm font-bold ${
                        summary.attendanceRate >= 80
                          ? "text-lion-orange"
                          : summary.attendanceRate >= 60
                          ? "text-status-late"
                          : "text-status-absent"
                      }`}
                    >
                      {summary.attendanceRate}%
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-center text-sm text-lion-gray-600 sm:table-cell">
                    {summary.presentCount}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-center text-sm text-lion-gray-600 sm:table-cell">
                    {summary.lateCount + summary.lateReasonCount}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-center text-sm text-lion-gray-600 lg:table-cell">
                    {summary.absentCount + summary.absentExcusedCount}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-center">
                    {latestRecord ? (
                      <span className="badge" style={STATUS_BADGE_STYLES[latestRecord.status]}>
                        {STATUS_LABELS[latestRecord.status]}
                      </span>
                    ) : (
                      <span className="text-xs text-lion-gray-400">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {summaries.length === 0 && (
        <div className="py-12 text-center text-sm text-lion-gray-400">
          해당 트랙에 등록된 멤버가 없습니다.
        </div>
      )}
    </div>
  )
}
