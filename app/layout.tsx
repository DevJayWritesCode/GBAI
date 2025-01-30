"use client"
import './globals.css';
import { Inter } from 'next/font/google';
// import { usePathname, useRouter } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="manifest" href="manifest.json" />
        <link rel="icon" href="favicon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
