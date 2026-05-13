-- ============================================
-- DKU Lion Check - Supabase DB Schema
-- 단국대 멋사 14기 출석 관리 시스템
-- ============================================

-- 트랙 enum
CREATE TYPE track_type AS ENUM ('PM', 'FE', 'BE', 'Design');

-- 출석 상태 enum
CREATE TYPE attendance_status AS ENUM ('none', 'present', 'late', 'late_reason', 'absent', 'absent_excused');

-- 멤버 테이블
CREATE TABLE members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  track track_type NOT NULL,
  student_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 세션 테이블
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 출석 테이블
CREATE TABLE attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  status attendance_status NOT NULL DEFAULT 'none',
  reason TEXT,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(member_id, session_id)
);

-- 인덱스
CREATE INDEX idx_attendance_member ON attendance(member_id);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_members_track ON members(track);

-- RLS (Row Level Security) 비활성화 - 운영진만 사용하므로
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- 모든 사용자에게 읽기/쓰기 허용 (anon key로 접근)
CREATE POLICY "Allow all access to members" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to sessions" ON sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to attendance" ON attendance FOR ALL USING (true) WITH CHECK (true);
