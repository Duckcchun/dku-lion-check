import type { Metadata } from "next"
import "./globals.css"
import HeaderLogo from "@/components/HeaderLogo"
import logo from "@/asset/logo.png"

export const metadata: Metadata = {
  title: "단국대 멋사 출석 관리",
  description: "단국대학교 멋쟁이사자처럼 14기 출석 관리 시스템",
  openGraph: {
    title: "단국대 멋사 출석 관리",
    description: "단국대학교 멋쟁이사자처럼 14기 출석 관리 시스템",
    images: [{ url: logo.src }],
  },
  twitter: {
    card: "summary_large_image",
    title: "단국대 멋사 출석 관리",
    description: "단국대학교 멋쟁이사자처럼 14기 출석 관리 시스템",
    images: [logo.src],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="icon" href={logo.src} />
      </head>
      <body className="min-h-screen bg-lion-gray-50">
        <header className="sticky top-0 z-40 border-b border-lion-gray-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5">
              <HeaderLogo />
              <div>
                <h1 className="text-xs font-bold text-lion-black sm:text-sm">단국대 멋사 출석 관리</h1>
                <p className="text-[11px] text-lion-gray-500 sm:text-xs">출석 현황 대시보드</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-lion-orange/10 px-3 py-1 text-xs font-medium text-lion-orange">
                운영진
              </span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  )
}
