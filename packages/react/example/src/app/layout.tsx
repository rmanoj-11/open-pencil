import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenPencil React Example',
  description: 'Headless React SDK example for OpenPencil',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}