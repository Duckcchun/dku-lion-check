"use client"

import { Track, TRACK_LABELS } from "@/types"

interface TrackFilterProps {
  selected: Track | "all"
  onChange: (track: Track | "all") => void
}

const TRACK_OPTIONS: { value: Track | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "PM", label: "기획" },
  { value: "FE", label: "프론트엔드" },
  { value: "BE", label: "백엔드" },
  { value: "Design", label: "디자인" },
]

export default function TrackFilter({ selected, onChange }: TrackFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TRACK_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            selected === option.value
              ? "bg-lion-orange text-white"
              : "border border-lion-gray-200 bg-white text-lion-gray-600 hover:border-lion-orange/50 hover:text-lion-orange"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
