"use client"

import { getOverallStats, getTrackStats } from "@/lib/supabase-data"
import { TRACK_LABELS, Track, Member, Session, AttendanceRecord } from "@/types"

const TRACK_ICONS: Record<Track, string> = {
  PM: "📋",
  FE: "💻",
  BE: "⚙️",
  Design: "🎨",
}

interface StatsCardsProps {
  members: Member[]
  sessions: Session[]
  records: AttendanceRecord[]
}

export default function StatsCards({ members, sessions, records }: StatsCardsProps) {
  const overall = getOverallStats(members, records, sessions)
  const trackStats = getTrackStats(members, records, sessions)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card border-lion-orange/20 bg-gradient-to-br from-lion-orange/5 to-transparent">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-lion-gray-500">전체 출석률</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lion-orange/10 text-sm">
              📊
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-lion-orange">{overall.overallRate}%</p>
          <p className="mt-1 text-xs text-lion-gray-400">
            {overall.totalMembers}명 · {overall.totalSessions}회 세션
          </p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-lion-gray-500">총 출석</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-sm">
              ✅
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-lion-black">{overall.presentCount}</p>
          <p className="mt-1 text-xs text-lion-gray-400">회 출석 기록</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-lion-gray-500">총 지각</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-50 text-sm">
              ⏰
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-lion-black">{overall.lateCount}</p>
          <p className="mt-1 text-xs text-lion-gray-400">회 지각 기록</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-lion-gray-500">총 결석</p>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-sm">
              ❌
            </span>
          </div>
          <p className="mt-2 text-3xl font-bold text-lion-black">{overall.absentCount}</p>
          <p className="mt-1 text-xs text-lion-gray-400">회 결석 기록</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trackStats.map((stat) => (
          <div key={stat.track} className="card">
            <div className="flex items-center gap-2">
              <span className="text-lg">{TRACK_ICONS[stat.track]}</span>
              <div>
                <p className="text-sm font-semibold text-lion-black">
                  {TRACK_LABELS[stat.track]}
                </p>
                <p className="text-xs text-lion-gray-400">{stat.memberCount}명</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-lion-black">{stat.attendanceRate}%</span>
                <span className="text-xs text-lion-gray-400">출석률</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-lion-gray-100">
                <div
                  className="h-full rounded-full bg-lion-orange transition-all"
                  style={{ width: `${stat.attendanceRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
