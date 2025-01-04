export const metadata = {
  title: 'Tetris Game',
  description: 'A Tetris game built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-800 text-white">{children}</body>
    </html>
  );
}
