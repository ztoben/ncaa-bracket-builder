import './globals.scss'

export const metadata = {
  title: 'NCAA Bracket Builder',
  description: 'Build a bracket for the NCAA tournament',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
