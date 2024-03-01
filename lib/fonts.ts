import { JetBrains_Mono, Inter } from 'next/font/google';
import localFont from 'next/font/local';

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontHeader = localFont({
  src: "../assets/fonts/StyleScript-Regular.ttf",
  variable: "--font-header",
})
