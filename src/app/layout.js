import './globals.css'
import { Inter } from 'next/font/google'
// import ThemeProvider from './components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Transaction Tracker',
  description: 'Track your expenses and income',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* <ThemeProvider> */}
          {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}