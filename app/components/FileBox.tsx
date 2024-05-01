import Image from 'next/image';
import iconDocument from '@/public/FEMAssets/icon-document.svg';
import type { DocumentJSON } from '../lib/interfaces';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../_providers/DataContext';
import { safeName, safeContext } from '../lib/functionsClient';

export default function FileBox({
  isNavbarType,
  data,
  clicked,
}: {
  isNavbarType?: boolean;
  data: DocumentJSON;
  clicked?(): void;
}) {
  const { setDataContext, dataContext, selected, setHandleAutosave, initialDataContext } = useContext(DataContext);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (editable) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          safeName({
            dataContext: dataContext,
            selected: selected,
          });
          setDataContext(safeName({ dataContext, selected }));
          initialDataContext.current = safeName({ dataContext, selected });
          setEditable(false);
          setHandleAutosave(true);
        }
        if (e.key === 'Escape') {
          setDataContext(safeContext({ dataContext: initialDataContext.current }));
          setEditable(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [dataContext, editable, initialDataContext, selected, setDataContext, setEditable, setHandleAutosave]);
  const createdAt = new Date(data.createdAt).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return (
    <div className="flex items-center gap-[16px]">
      <Image src={iconDocument as string} alt="document" />
      <div className="flex flex-col">
        <span className="font-roboto text-[13px] font-light text-[#7C8187]">
          {isNavbarType ? 'Document Name' : createdAt}
        </span>
        {editable && selected !== null ? (
          <input
            autoFocus
            onBlur={() => {
              setDataContext(safeName({ dataContext, selected }));
              initialDataContext.current = safeName({ dataContext, selected });
              setEditable(false);
              setHandleAutosave(true);
            }}
            className="w-[400px] bg-transparent font-roboto text-[15px] font-normal text-[#FFFFFF] outline-none transition-colors"
            value={dataContext[selected].name.slice(0, -3)}
            onChange={(e) => {
              const temp = [...dataContext];
              temp[selected].name = e.target.value + '.md';
              setDataContext(temp);
            }}
          />
        ) : (
          <button
            className="w-fit"
            onClick={
              clicked
                ? clicked
                : () => {
                    setEditable(!editable);
                  }
            }
          >
            <div
              className={`${isNavbarType ? 'max-w-[320px] truncate' : 'line-clamp-2 max-w-[170px] break-words'} text-start font-roboto text-[15px] font-normal text-[#FFFFFF] transition-colors hover:text-[#E46643]`}
            >
              <span>{data.name}</span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
