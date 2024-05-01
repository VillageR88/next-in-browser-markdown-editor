import Logo from '../components/Logo';
import ButtonTheme from '../components/ButtonTheme';

import React from 'react';

export default function LayoutAccount({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center px-6 py-10 font-instrumentSans md:min-h-screen">
      <div className={`flex w-full max-w-[500px] flex-col items-center justify-between gap-3`}>
        <header className="flex w-full justify-between dark:drop-shadow-none">
          <Logo />
          <ButtonTheme />
        </header>
        <main className="mt-[10px] flex min-h-full w-full flex-col gap-[48px] rounded-[6px] border border-[#f5f5f5] bg-[white] px-8 pb-14 pt-10 shadow-[0_10px_30px_-1px_rgba(0,0,0,0.03)] transition dark:border-[#313131] dark:bg-[#232323] dark:shadow-none">
          <div className="flex h-full items-start">
            <h2 className="leading-[32px] [word-spacing:3px]">{title}</h2>
          </div>
          <div className="size-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
