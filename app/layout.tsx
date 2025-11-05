export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Root layout - middleware handles redirect from / to /sv
  // The [locale]/layout.tsx handles the actual HTML structure
  return children
}