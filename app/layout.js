import './globals.scss'

export const metadata = {
  title: 'NCAA Bracket Builder',
  description: 'Build a bracket for the NCAA tournament',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
