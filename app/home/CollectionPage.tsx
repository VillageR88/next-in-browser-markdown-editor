import { DataContext } from '../_providers/DataContext';
import { useContext, useState, useRef, useEffect } from 'react';
import IconReturn from '../components/IconReturn';
import ButtonAdd from '../ButtonAdd';
import ButtonDelete from '../components/ButtonDelete';
import { handleSaveCollectionGroup } from '@/app/lib/functionsServer';
import { newData, safeContext } from '@/app/lib/functionsClient';
import { CollectionGroup } from '../lib/interfaces';
import { Reorder, useDragControls } from 'framer-motion';
import ButtonDrag from '../components/ButtonDrag';

const CollectionPage = ({
  token,
  collectionPage,
  setCollectionPage,
  setNotePage,
}: {
  token: string;
  collectionPage: number;
  setCollectionPage: React.Dispatch<React.SetStateAction<number | null>>;
  setNotePage: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const controls = useDragControls();
  const { dataContext, initialDataContext, setDataContext } = useContext(DataContext);
  const [titleEditable, setTitleEditable] = useState<boolean>(false);
  const textRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const clickListener = () => {
      if (textRef.current?.value.length === 0) {
        textRef.current.value = 'Untitled Collection';
      }
    };
    document.addEventListener('click', clickListener);
    return () => {
      document.removeEventListener('click', clickListener);
    };
  }, []);
  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      <div className="group flex select-none flex-col gap-[6px] rounded-[6px] border border-[#f5f5f5] bg-white px-3 py-4 drop-shadow-sm transition-colors dark:border-[#313131] dark:bg-[#232323] ">
        <div className="flex justify-between px-1">
          {!titleEditable ? (
            <button
              onClick={() => {
                setTitleEditable(true);
              }}
              className="max-w-[80%] truncate pb-[8px] text-left text-[18px] font-bold transition-colors hover:text-[darkorange] dark:text-white dark:hover:text-[orange]"
            >
              {dataContext.collections[collectionPage - 1].title}
            </button>
          ) : (
            <input
              ref={textRef}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  //if current input length is 0 return
                  if (e.currentTarget.value.length === 0) {
                    e.currentTarget.value = 'Untitled Collection';
                    return;
                  }
                  setTitleEditable(false);
                }
              }}
              type="text"
              value={dataContext.collections[collectionPage - 1].title}
              onChange={(e) => {
                const newCollections = dataContext.collections.map((collection) => {
                  if (collection.id === collectionPage) {
                    collection.title = e.target.value;
                  }
                  return collection;
                });
                setDataContext({ collections: newCollections });
              }}
              className="h-fit w-[84%] border-none bg-transparent p-0 text-left text-[18px] font-bold outline-none transition-colors dark:text-white"
            />
          )}
          <div className="flex gap-2 pb-3">
            <ButtonAdd
              alwaysVisible
              func={() => {
                const newCollections = dataContext.collections.map((collection) => {
                  if (collection.id === collectionPage) {
                    collection.notes.push({
                      id: collection.notes.length + 1,
                      title: 'New Note',
                      description: 'Add a description here',
                    });
                  }
                  return collection;
                });
                const newDataContext = { collections: newCollections };
                setDataContext(JSON.parse(JSON.stringify(newDataContext)) as CollectionGroup);
              }}
            />
            <ButtonDelete
              alwaysVisible
              func={() => {
                const newCollections = dataContext.collections.filter((collection) => collection.id !== collectionPage);
                const newDataContext = { collections: newCollections };
                initialDataContext.current = newData({
                  data: JSON.parse(JSON.stringify(newDataContext)) as CollectionGroup,
                });
                setDataContext(newData({ data: JSON.parse(JSON.stringify(newDataContext)) as CollectionGroup }));
                if (!token) return;
                void handleSaveCollectionGroup({
                  data: newData({ data: JSON.parse(JSON.stringify(newDataContext)) as CollectionGroup }),
                  token: token,
                });
                setCollectionPage(null);
              }}
            />
          </div>
        </div>
        <Reorder.Group
          values={dataContext.collections[collectionPage - 1].notes}
          onReorder={(newOrder) => {
            const newCollections = dataContext.collections.map((collection) => {
              if (collection.id === collectionPage) {
                collection.notes = newOrder;
              }
              return collection;
            });
            const newDataContext = { collections: newCollections };
            setDataContext(newDataContext);
          }}
          className="flex flex-col gap-2"
        >
          {dataContext.collections[collectionPage - 1].notes.map((note) => (
            <Reorder.Item
              //dragListener={false}
              dragControls={controls}
              value={note}
              className="rounded-[6px] border border-[rgba(0,0,0,0.2)] bg-white p-[10px] transition-colors dark:border-[#1C1C1C] dark:bg-[#1C1C1C]"
              key={note.id}
            >
              <div className="flex justify-between pl-1 pr-2">
                <button
                  onClick={() => {
                    setNotePage(note.id);
                    void handleSaveCollectionGroup({
                      data: newData({ data: JSON.parse(JSON.stringify(dataContext)) as CollectionGroup }),
                      token: token,
                    });
                    initialDataContext.current = newData({ data: dataContext });
                    setDataContext(newData({ data: dataContext }));
                  }}
                  className="font-semibold tracking-[-0.3px] transition-colors hover:text-[darkorange] dark:font-normal dark:tracking-normal dark:text-white dark:hover:text-[orange]"
                >
                  {note.title}
                </button>

                <ButtonDrag
                  alwaysVisible
                  func={(e) => {
                    controls.start(e);
                  }}
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
      <button
        className="button1 flex pt-[3px]"
        onClick={() => {
          setCollectionPage(null);
          initialDataContext.current = newData({ data: safeContext({ dataContext: dataContext }) });
          setDataContext(newData({ data: safeContext({ dataContext: dataContext }) }));
          void handleSaveCollectionGroup({
            data: newData({ data: safeContext({ dataContext: dataContext }) }),
            token: token,
          });
        }}
      >
        <IconReturn />
        <span className="hidden pl-1 md:block">Return</span>
      </button>
    </div>
  );
};

export default CollectionPage;
