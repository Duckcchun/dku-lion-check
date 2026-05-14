export type Track = "PM" | "FE" | "BE" | "Design"

export type AttendanceStatus =
  | "none"
  | "present"
  | "late"
  | "late_reason"
  | "absent"
  | "absent_excused"

export interface Member {
  id: string
  name: string
  track: Track
  studentId: string
}

export interface Session {
  id: string
  title: string
  date: string
}

export interface AttendanceRecord {
  id: string
  memberId: string
  sessionId: string
  status: AttendanceStatus
  reason: string | null
  updatedAt: string
}

export interface MemberAttendanceSummary {
  member: Member
  records: AttendanceRecord[]
  presentCount: number
  lateCount: number
  lateReasonCount: number
  absentCount: number
  absentExcusedCount: number
  attendanceRate: number
}

export const TRACK_LABELS: Record<Track, string> = {
  PM: "기획",
  FE: "프론트엔드",
  BE: "백엔드",
  Design: "디자인",
}

export const STATUS_LABELS: Record<AttendanceStatus, string> = {
  none: "미입력",
  present: "출석",
  late: "지각",
  late_reason: "사유 지각",
  absent: "결석",
  absent_excused: "유고 결석",
}

export const STATUS_COLORS: Record<AttendanceStatus, string> = {
  none: "bg-lion-gray-100 text-lion-gray-400",
  present: "bg-status-present text-white",
  late: "bg-status-late text-lion-black",
  late_reason: "bg-status-late-reason text-white",
  absent: "bg-status-absent text-white",
  absent_excused: "bg-status-absent-excused text-white",
}
