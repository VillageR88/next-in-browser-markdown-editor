import { useRef, useState, useEffect, useCallback, useContext } from 'react';
import { DataContext } from '@/app/_providers/DataContext';
import React from 'react';
import Preview from '../components/Preview';
import ButtonPreview from '../components/ButtonPreview';

const Main = () => {
  const { dataContext, selected, setDataContext } = useContext(DataContext);
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 });
  const [history, setHistory] = useState<{ text: string; cursorPosition: { start: number; end: number } }[]>([
    { text: '', cursorPosition },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  let textareaScrollTop = 0;
  let previewScrollTop = 0;
  if (textareaRef.current) textareaScrollTop = textareaRef.current.scrollTop;
  if (previewRef.current) previewScrollTop = previewRef.current.scrollTop;

  useEffect(() => {
    if (selected === null) return;
    setHistory([{ text: textareaRef.current?.textContent ?? '', cursorPosition: { start: 0, end: 0 } }]);
  }, [selected]);

  useEffect(() => {
    if (history[1]) {
      if (history[0].cursorPosition === history[1].cursorPosition) return;
      history[0].cursorPosition.start = history[1].cursorPosition.start - 1;
      history[0].cursorPosition.end = history[1].cursorPosition.end - 1;
    }
  }, [history]);

  useEffect(() => {
    if (!textareaRef.current || !previewRef.current) return;
    textareaRef.current.focus();
    textareaRef.current.selectionStart = cursorPosition.start;
    textareaRef.current.selectionEnd = cursorPosition.end;
    textareaRef.current.scrollTo({ top: textareaScrollTop });
    previewRef.current.scrollTo({ top: previewScrollTop });
  }, [cursorPosition, previewScrollTop, textareaScrollTop]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selected === null) return;
    const newText = e.target.value;
    setDataContext((prevData) => {
      const newData = [...prevData];
      newData[selected].content = newText;
      return newData;
    });
    const newCursorPosition = {
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
    };
    setCursorPosition(newCursorPosition);
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, currentIndex + 1);
      newHistory.push({ text: newText, cursorPosition: newCursorPosition });
      return newHistory;
    });
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  const undo = useCallback(() => {
    if (selected === null) return;
    if (currentIndex > 0) {
      const previousState = history[currentIndex - 1];
      setDataContext((prevData) => {
        const newData = [...prevData];
        newData[selected].content = previousState.text;
        return newData;
      });
      setCursorPosition(previousState.cursorPosition);
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  }, [currentIndex, history, selected, setDataContext]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      if (selected === null) return;
      const nextState = history[currentIndex + 1];
      setDataContext((prevData) => {
        const newData = [...prevData];
        newData[selected].content = nextState.text;
        return newData;
      });
      setCursorPosition(nextState.cursorPosition);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  }, [currentIndex, history, selected, setDataContext]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    },
    [undo, redo],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const Block = ({
    title,
    children,
    AdditionalIcon,
  }: {
    title: string;
    children: React.ReactNode;
    AdditionalIcon?: JSX.Element;
  }) => {
    return (
      <div className="flex w-1/2 flex-col">
        <div className="flex min-h-[42px] w-full items-center justify-between bg-[#F5F5F5] pl-[16px] pr-[17px] transition-colors dark:bg-[#1D1F22]">
          <span className="text-[14px] font-medium tracking-[2px] text-[#7C8187] transition-colors dark:text-[#C1C4CB]">
            {title}
          </span>
          {AdditionalIcon}
        </div>
        <div className="size-full">{children}</div>
      </div>
    );
  };
  if (selected === null) return null;
  return (
    <main className="flex size-full justify-center overflow-hidden text-clip bg-[#FFFFFF] transition-colors dark:bg-[#151619]">
      <Block title="MARKDOWN">
        <textarea
          id="editor"
          ref={textareaRef}
          value={dataContext[selected].content}
          onChange={handleTextChange}
          className="no-scrollbar size-full resize-none border-none bg-transparent px-[18px] pb-[30px] pt-[14px] font-robotoMono text-[14px] leading-[24px] text-[#35393F] outline-none transition-colors dark:text-[#C1C4CB]"
        />
      </Block>
      <div className="min-h-full w-px bg-[#E4E4E4] transition-colors dark:bg-[#5A6069]"></div>
      <Block
        AdditionalIcon={
          <ButtonPreview
            func={() => {
              null;
            }}
          />
        }
        title="PREVIEW"
      >
        <Preview refProp={previewRef} text={dataContext[selected].content} />
      </Block>
    </main>
  );
};

export default Main;
