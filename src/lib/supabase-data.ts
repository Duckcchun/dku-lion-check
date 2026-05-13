import { supabase } from "./supabase"
import { Member, Session, AttendanceRecord, AttendanceStatus, Track } from "@/types"

export async function fetchMembers(): Promise<Member[]> {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .order("name")

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    track: row.track as Track,
    studentId: row.student_id,
  }))
}

export async function fetchSessions(): Promise<Session[]> {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("date")

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    date: row.date,
  }))
}

export async function fetchAttendance(): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")

  if (error) throw error

  return (data || []).map((row) => ({
    id: row.id,
    memberId: row.member_id,
    sessionId: row.session_id,
    status: row.status as AttendanceStatus,
    reason: row.reason,
    updatedAt: row.updated_at,
  }))
}

export async function updateAttendance(
  recordId: string,
  status: AttendanceStatus,
  reason: string | null
): Promise<void> {
  const { error } = await supabase
    .from("attendance")
    .update({
      status,
      reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", recordId)

  if (error) throw error
}

export async function updateSessionDate(sessionId: string, date: string): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .update({ date })
    .eq("id", sessionId)

  if (error) throw error
}

export function getMemberSummaries(
  members: Member[],
  records: AttendanceRecord[],
  trackFilter?: Track | "all"
) {
  const filteredMembers =
    trackFilter && trackFilter !== "all"
      ? members.filter((m) => m.track === trackFilter)
      : members

  return filteredMembers.map((member) => {
    const memberRecords = records.filter((r) => r.memberId === member.id)
    const presentCount = memberRecords.filter((r) => r.status === "present").length
    const lateCount = memberRecords.filter((r) => r.status === "late").length
    const lateReasonCount = memberRecords.filter((r) => r.status === "late_reason").length
    const absentCount = memberRecords.filter((r) => r.status === "absent").length
    const absentExcusedCount = memberRecords.filter((r) => r.status === "absent_excused").length

    const recordedSessions = memberRecords.filter((r) => r.status !== "none").length
    const attendanceRate =
      recordedSessions > 0
        ? Math.round(((presentCount + lateCount + lateReasonCount) / recordedSessions) * 100)
        : 0

    return {
      member,
      records: memberRecords,
      presentCount,
      lateCount,
      lateReasonCount,
      absentCount,
      absentExcusedCount,
      attendanceRate,
    }
  })
}

export function getTrackStats(members: Member[], records: AttendanceRecord[], sessions: Session[]) {
  const tracks: Track[] = ["PM", "FE", "BE", "Design"]

  return tracks.map((track) => {
    const trackMembers = members.filter((m) => m.track === track)
    const trackRecords = records.filter((r) =>
      trackMembers.some((m) => m.id === r.memberId)
    )

    const recordedRecords = trackRecords.filter((r) => r.status !== "none")
    const presentRecords = recordedRecords.filter(
      (r) => r.status === "present" || r.status === "late" || r.status === "late_reason"
    ).length

    return {
      track,
      memberCount: trackMembers.length,
      attendanceRate:
        recordedRecords.length > 0
          ? Math.round((presentRecords / recordedRecords.length) * 100)
          : 0,
      totalSessions: sessions.length,
    }
  })
}

export function getOverallStats(members: Member[], records: AttendanceRecord[], sessions: Session[]) {
  const recordedRecords = records.filter((r) => r.status !== "none")
  const presentRecords = recordedRecords.filter(
    (r) => r.status === "present" || r.status === "late" || r.status === "late_reason"
  ).length

  return {
    totalMembers: members.length,
    totalSessions: sessions.length,
    overallRate:
      recordedRecords.length > 0
        ? Math.round((presentRecords / recordedRecords.length) * 100)
        : 0,
    presentCount: recordedRecords.filter((r) => r.status === "present").length,
    lateCount: recordedRecords.filter((r) => r.status === "late").length,
    absentCount: recordedRecords.filter((r) => r.status === "absent").length,
  }
}
