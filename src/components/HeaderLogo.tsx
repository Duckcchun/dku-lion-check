"use client"

import { useState } from "react"
import logo from "@/asset/logo.png"

export default function HeaderLogo() {
  const [hasImageError, setHasImageError] = useState(false)

  if (hasImageError) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-lion-gray-200 bg-white">
        <span className="text-xl font-bold text-lion-orange">🦁</span>
      </div>
    )
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-transparent">
      <img
        src={logo.src}
        alt="단국대 멋사 로고"
        className="h-full w-full object-cover"
        onError={() => setHasImageError(true)}
      />
    </div>
  )
}