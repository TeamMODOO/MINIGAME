export const metadata = {
  title: 'Ping Pong Game',
  description: 'A simple ping pong game built with Next.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
