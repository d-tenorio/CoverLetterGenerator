import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cover Letter Generator',
  description: 'Generate cover letters at breakneck speed!',
  icons: { icon: "favicon.ico", apple: "apple-touch-icon.png" }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
