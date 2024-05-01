/* eslint-disable @next/next/no-page-custom-font */

import './globals.css';
import type { Metadata } from 'next';
import DataProvider from '@/app/_providers/DataContext';
import MainContextProvider from '@/app/_providers/MainContext';
import SidebarContextProvider from '@/app/_providers/SidebarContext';

export const metadata: Metadata = {
  title: 'MARKDOWN',
  description: 'In-browser markdown editor application',
  //applicationName: 'My App',
} as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="hidden" lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="use-credentials" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Roboto+Slab:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=optional"
          rel="stylesheet"
        />
        <meta property="og:image" content="/Markdown.png" />
      </head>
      <body className={'bg-[#fcfcfc]  dark:bg-[#1D1F22]'}>
        <DataProvider>
          <MainContextProvider>
            <SidebarContextProvider>{children}</SidebarContextProvider>
          </MainContextProvider>
        </DataProvider>
      </body>
    </html>
  );
}
