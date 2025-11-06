'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Script from 'next/script';
import { NotificationContainer } from './components/Notification';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ClientLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script 
          id="gsap-script"
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <NotificationContainer />
      </body>
    </html>
  );
}
